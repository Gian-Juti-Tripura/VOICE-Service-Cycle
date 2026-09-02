import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ArrowLeft, Calendar, Check, Copy, 
  Sparkles, ChevronLeft, ChevronRight, 
  CheckCircle2, UserPlus, Trash2, ArrowRightLeft,
  Moon, Sun, Clock, AlertCircle, Edit, Save, X, Send
} from 'lucide-react';
import { 
  type GroupType, 
  type StudentDisciplineRecord, 
  type DailyDisciplineEntry, 
  EMERGENCY_REASONS, 
  ABSENCE_REASONS,
  INITIAL_DISCIPLINE_STUDENTS 
} from '../../data/groupDisciplineData';
import { shareToWhatsAppOrSystem } from '../../utils/shareUtils';
import { triggerHaptic } from '../../utils/haptics';
import toast from 'react-hot-toast';

const STORAGE_STUDENTS_KEY = 'advaita_discipline_students_v2';
const STORAGE_DAILY_KEY = 'advaita_discipline_daily_v2';

export const AshramDisciplineAudit: React.FC = () => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<GroupType | 'ALL'>('VOICE');

  // Load students from storage or initial data
  const [students, setStudents] = useState<StudentDisciplineRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STUDENTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DISCIPLINE_STUDENTS;
    } catch {
      return INITIAL_DISCIPLINE_STUDENTS;
    }
  });

  // Daily entries map: { "YYYY-MM-DD": { [studentId]: DailyDisciplineEntry } }
  const [dailyRecords, setDailyRecords] = useState<Record<string, Record<string, DailyDisciplineEntry>>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DAILY_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [copiedVoice, setCopiedVoice] = useState(false);
  const [copiedLotus, setCopiedLotus] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedMp, setCopiedMp] = useState(false);
  const [copiedNight, setCopiedNight] = useState(false);

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentGroup, setNewStudentGroup] = useState<GroupType>('VOICE');

  // Edit Student Modal State
  const [editingStudent, setEditingStudent] = useState<StudentDisciplineRecord | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_DAILY_KEY, JSON.stringify(dailyRecords));
  }, [dailyRecords]);

  const dateIso = selectedDate.toISOString().split('T')[0];
  const dateFormatted = selectedDate.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Helper to get or initialize a student's daily record
  const getEntry = (studentId: string): DailyDisciplineEntry => {
    const dayData = dailyRecords[dateIso] || {};
    return dayData[studentId] || {
      studentId,
      dateStr: dateIso,
      isAbsent: studentId === 'member_0', // Default Utpol P. out of town
      absenceReason: studentId === 'member_0' ? 'Out of town / Home Leave (গ্রামের বাড়ি / বাইরে অবস্থান)' : '',
      sleptOnTime: true,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      reason: '',
      isEmergency: false,
    };
  };

  const updateEntry = (studentId: string, updates: Partial<DailyDisciplineEntry>) => {
    const current = getEntry(studentId);
    const updated = { ...current, ...updates };

    setDailyRecords(prev => ({
      ...prev,
      [dateIso]: {
        ...(prev[dateIso] || {}),
        [studentId]: updated
      }
    }));
  };

  // Mark all students in current tab as on time
  const handleMarkAllOnTime = (group: GroupType) => {
    const targetStudents = students.filter(s => s.group === group);
    const newDayEntries: Record<string, DailyDisciplineEntry> = { ...(dailyRecords[dateIso] || {}) };

    targetStudents.forEach(s => {
      const prevEntry = getEntry(s.id);
      newDayEntries[s.id] = {
        studentId: s.id,
        dateStr: dateIso,
        isAbsent: prevEntry.isAbsent,
        absenceReason: prevEntry.absenceReason,
        sleptOnTime: true,
        wokeUpOnTime: true,
        morningProgramOnTime: true,
        reason: '',
        isEmergency: false
      };
    });

    setDailyRecords(prev => ({
      ...prev,
      [dateIso]: newDayEntries
    }));

    toast.success(
      language === 'bn' 
        ? `${group === 'VOICE' ? 'ভয়েস গ্রুপের' : 'লোটাস গ্রুপের'} সবাইকে অন-টাইম মার্ক করা হয়েছে!` 
        : `Marked all ${group} Group devotees as On-Time!`
    );
  };

  // Update Monthly Strike count
  const handleAdjustStrikes = (studentId: string, delta: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const newStrikes = Math.max(0, Math.min(3, s.monthlyStrikes + delta));
      let status: StudentDisciplineRecord['status'] = 'ACTIVE';
      if (newStrikes === 1 || newStrikes === 2) status = 'WARNED';
      if (newStrikes >= 3) status = s.group === 'VOICE' ? 'DEMOTION_DUE' : 'DISMISSED';
      return { ...s, monthlyStrikes: newStrikes, status };
    }));
  };

  // Switch student between VOICE and LOTUS
  const handleSwitchGroup = (studentId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const newGroup: GroupType = s.group === 'VOICE' ? 'LOTUS' : 'VOICE';
      toast.success(
        language === 'bn' 
          ? `${s.name}-কে ${newGroup === 'VOICE' ? 'ভয়েস গ্রুপে' : 'লোটাস গ্রুপে'} স্থানান্তর করা হয়েছে` 
          : `Moved ${s.name} to ${newGroup} Group`
      );
      return { ...s, group: newGroup, monthlyStrikes: 0, status: 'ACTIVE' };
    }));
  };

  // Add new student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent: StudentDisciplineRecord = {
      id: `manual_${Date.now()}`,
      name: newStudentName.trim().toUpperCase(),
      phone: newStudentPhone.trim(),
      group: newStudentGroup,
      cycleOrder: students.length + 1,
      monthlyStrikes: 0,
      status: 'ACTIVE'
    };

    setStudents(prev => [...prev, newStudent]);
    setNewStudentName('');
    setNewStudentPhone('');
    setIsAddModalOpen(false);
    toast.success(language === 'bn' ? 'নতুন ভক্ত যুক্ত হয়েছে' : 'Added devotee successfully');
  };

  // Save Edit Student
  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editingStudent.name.trim()) return;

    setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
    setEditingStudent(null);
    toast.success(language === 'bn' ? 'ভক্তের তথ্য আপডেট হয়েছে' : 'Devotee details updated');
  };

  // Delete student
  const handleDeleteStudent = (studentId: string, name: string) => {
    if (!window.confirm(`Remove ${name} from discipline list?`)) return;
    setStudents(prev => prev.filter(s => s.id !== studentId));
    toast.success('Devotee removed');
  };

  // Reset to default 12 devotees
  const handleResetToDefault = () => {
    if (!window.confirm('Reset student list to default 12 active ashram devotees?')) return;
    setStudents(INITIAL_DISCIPLINE_STUDENTS);
    toast.success('Reset to 12 active devotees list');
  };

  // Change Date
  const changeDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  // Format reasons cleanly without bracket repetition
  const formatReasonText = (reason?: string, isBn = false) => {
    if (!reason) return isBn ? 'অনুপস্থিত / ছুটি' : 'Leave / Absent';
    if (isBn) {
      const match = reason.match(/\((.*?)\)/);
      if (match && match[1]) return match[1].trim();
      return reason;
    } else {
      const parts = reason.split('(');
      return parts[0].trim() || reason;
    }
  };

  // Convert English numbers to Bengali digits when language === 'bn'
  const toBn = (num: number | string) => {
    if (language !== 'bn') return String(num);
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, d => bnDigits[parseInt(d, 10)]);
  };

  // Generate VOICE Group WhatsApp Report (Morning Program Incharge)
  const generateVoiceReport = () => {
    const isBn = language === 'bn';
    const voiceStudents = students.filter(s => s.group === 'VOICE');
    const compliant: string[] = [];
    const nonCompliant: string[] = [];
    const absent: string[] = [];

    voiceStudents.forEach(s => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        absent.push(`🔴 *${s.name}* — ${reason}`);
      } else {
        const isAllGood = entry.sleptOnTime && entry.wokeUpOnTime && entry.morningProgramOnTime;
        if (isAllGood) {
          compliant.push(s.name);
        } else {
          const issues: string[] = [];
          if (!entry.sleptOnTime) issues.push(isBn ? 'দেরিতে শয়ন (>১০:০০)' : 'Late Bed (>10:00 PM)');
          if (!entry.wokeUpOnTime) issues.push(isBn ? 'দেরিতে জাগরণ (>৪:০০)' : 'Late Wake (>4:00 AM)');
          if (!entry.morningProgramOnTime) issues.push(isBn ? 'মর্নিংয়ে দেরি (>৪:৩০)' : 'Late to MP (>4:30 AM)');
          
          let reasonStr = entry.reason ? ` — *${isBn ? 'কারণ' : 'Reason'}:* ${formatReasonText(entry.reason, isBn)}` : '';
          let strikeStr = s.monthlyStrikes > 0 ? ` [${isBn ? 'স্ট্রাইক' : 'Strike'} ${toBn(s.monthlyStrikes)}/৩]` : '';
          nonCompliant.push(`❌ *${s.name}* (${issues.join(', ')})${reasonStr}${strikeStr}`);
        }
      }
    });

    let report = isBn
      ? `🌟 *অদ্বৈত ভয়েস — ভয়েস গ্রুপ সাধনা ও শৃঙ্খলা রিপোর্ট* 🌟\n`
      : `🌟 *ADVAITA VOICE — MORNING PROGRAM & DISCIPLINE REPORT* 🌟\n`;
    report += `📅 *${isBn ? 'তারিখ' : 'Date'}:* ${dateFormatted}\n`;
    report += `📋 *${isBn ? 'গ্রুপ' : 'Group'}:* ${isBn ? 'ভয়েস গ্রুপ (শয়ন: <= রাত ১০:০০ | ওঠা: ভোর ৪:০০ | মর্নিং: <= ৪:৩০)' : 'VOICE Group (Bed: <= 10:00 PM | Wake: 4:00 AM | MP: <= 4:30 AM)'}\n\n`;

    report += `✅ *${isBn ? 'সব নিয়ম পালন করেছেন' : 'All Rules Followed (On Time)'} (${toBn(compliant.length)}/${toBn(voiceStudents.length)}):*\n`;
    if (compliant.length > 0) {
      compliant.forEach((name, i) => {
        report += `   ${toBn(i + 1)}. ${name}\n`;
      });
    } else {
      report += `   (${isBn ? 'কেউ নেই' : 'None'})\n`;
    }
    report += `\n`;

    if (nonCompliant.length > 0) {
      report += `⚠️ *${isBn ? 'নিয়ম লঙ্ঘন / ব্যতিক্রম' : 'Rule Breaches / Exceptions'} (${toBn(nonCompliant.length)}):*\n`;
      nonCompliant.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
      report += `\n`;
    }

    if (absent.length > 0) {
      report += `🔴 *${isBn ? 'অনুপস্থিত ভক্তবৃন্দ' : 'Absent Devotees'} (${toBn(absent.length)}):*\n`;
      absent.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
      report += `\n`;
    }

    if (nonCompliant.length === 0 && absent.length === 0) {
      report += `✨ ${isBn ? 'সবাই সময়মতো নিয়ম পালন করেছেন! হরিবোল!' : 'All students present and followed rules on time! Haribol!'}\n\n`;
    }

    report += `🙏 *${isBn ? 'রিপোর্ট প্রেরণকারী' : 'Reported by'}:* ${isBn ? 'মর্নিং প্রোগ্রাম ইনচার্জ (ভয়েস গ্রুপ)' : 'Morning Program Incharge (VOICE Group)'}\n`;
    return report;
  };

  // Generate Lotus Group WhatsApp Report (Security Manager)
  const generateLotusReport = () => {
    const isBn = language === 'bn';
    const lotusStudents = students.filter(s => s.group === 'LOTUS');
    const compliant: string[] = [];
    const nonCompliant: string[] = [];
    const absent: string[] = [];

    lotusStudents.forEach(s => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        absent.push(`🔴 *${s.name}* — ${reason}`);
      } else {
        const isAllGood = entry.sleptOnTime && entry.morningProgramOnTime;
        if (isAllGood) {
          compliant.push(s.name);
        } else {
          const issues: string[] = [];
          if (!entry.sleptOnTime) issues.push(isBn ? 'দেরিতে শয়ন (>১১:০০)' : 'Late Bed (>11:00 PM)');
          if (!entry.morningProgramOnTime) issues.push(isBn ? 'মর্নিংয়ে দেরি (>৫:০০)' : 'Late to MP (>5:00 AM)');
          
          let reasonStr = entry.reason ? ` — *${isBn ? 'কারণ' : 'Reason'}:* ${formatReasonText(entry.reason, isBn)}` : '';
          let strikeStr = s.monthlyStrikes > 0 ? ` [${isBn ? 'স্ট্রাইক' : 'Strike'} ${toBn(s.monthlyStrikes)}/৩]` : '';
          nonCompliant.push(`❌ *${s.name}* (${issues.join(', ')})${reasonStr}${strikeStr}`);
        }
      }
    });

    let report = isBn
      ? `🪷 *অদ্বৈত ভয়েস — লোটাস গ্রুপ সাধনা ও শৃঙ্খলা রিপোর্ট* 🪷\n`
      : `🪷 *ADVAITA VOICE — LOTUS GROUP DISCIPLINE REPORT* 🪷\n`;
    report += `📅 *${isBn ? 'তারিখ' : 'Date'}:* ${dateFormatted}\n`;
    report += `📋 *${isBn ? 'গ্রুপ' : 'Group'}:* ${isBn ? 'লোটাস গ্রুপ (শয়ন: <= রাত ১১:০০ | মর্নিং: <= ভোর ৫:০০)' : 'Lotus Group (Bed: <= 11:00 PM | MP: <= 5:00 AM)'}\n\n`;

    report += `✅ *${isBn ? 'সব নিয়ম পালন করেছেন' : 'All Rules Followed (On Time)'} (${toBn(compliant.length)}/${toBn(lotusStudents.length)}):*\n`;
    if (compliant.length > 0) {
      compliant.forEach((name, i) => {
        report += `   ${toBn(i + 1)}. ${name}\n`;
      });
    } else {
      report += `   (${isBn ? 'কেউ নেই' : 'None'})\n`;
    }
    report += `\n`;

    if (nonCompliant.length > 0) {
      report += `⚠️ *${isBn ? 'নিয়ম লঙ্ঘন / ব্যতিক্রম' : 'Rule Breaches / Exceptions'} (${toBn(nonCompliant.length)}):*\n`;
      nonCompliant.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
      report += `\n`;
    }

    if (absent.length > 0) {
      report += `🔴 *${isBn ? 'অনুপস্থিত ভক্তবৃন্দ' : 'Absent Devotees'} (${toBn(absent.length)}):*\n`;
      absent.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
      report += `\n`;
    }

    if (nonCompliant.length === 0 && absent.length === 0) {
      report += `✨ ${isBn ? 'সবাই সময়মতো নিয়ম পালন করেছেন! হরিবোল!' : 'All students present and followed rules on time! Haribol!'}\n\n`;
    }

    report += `🙏 *${isBn ? 'রিপোর্ট প্রেরণকারী' : 'Reported by'}:* ${isBn ? 'সিকিউরিটি ম্যানেজার (লোটাস গ্রুপ)' : 'Security Manager (Lotus Group)'}\n`;
    return report;
  };

  // Generate Combined Morning Program Incharge Report (Both Groups)
  const generateMorningProgramCombinedReport = () => {
    const isBn = language === 'bn';
    const voiceStudents = students.filter(s => s.group === 'VOICE');
    const lotusStudents = students.filter(s => s.group === 'LOTUS');

    const voiceCompliant: string[] = [];
    const voiceNonCompliant: string[] = [];
    const voiceAbsent: string[] = [];

    const lotusCompliant: string[] = [];
    const lotusNonCompliant: string[] = [];
    const lotusAbsent: string[] = [];

    voiceStudents.forEach(s => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        voiceAbsent.push(`🔴 *${s.name}* — ${reason}`);
      } else {
        const isMorningGood = entry.wokeUpOnTime && entry.morningProgramOnTime;
        if (isMorningGood) {
          voiceCompliant.push(s.name);
        } else {
          const issues: string[] = [];
          if (!entry.wokeUpOnTime) issues.push(isBn ? 'দেরিতে জাগরণ (>৪:০০)' : 'Late Wake (>4:00 AM)');
          if (!entry.morningProgramOnTime) issues.push(isBn ? 'মর্নিংয়ে দেরি (>৪:৩০)' : 'Late to MP (>4:30 AM)');
          let reasonStr = entry.reason ? ` — *${isBn ? 'কারণ' : 'Reason'}:* ${formatReasonText(entry.reason, isBn)}` : '';
          voiceNonCompliant.push(`❌ *${s.name}* (${issues.join(', ')})${reasonStr}`);
        }
      }
    });

    lotusStudents.forEach(s => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        lotusAbsent.push(`🔴 *${s.name}* — ${reason}`);
      } else {
        const isMorningGood = entry.morningProgramOnTime;
        if (isMorningGood) {
          lotusCompliant.push(s.name);
        } else {
          let reasonStr = entry.reason ? ` — *${isBn ? 'কারণ' : 'Reason'}:* ${formatReasonText(entry.reason, isBn)}` : '';
          lotusNonCompliant.push(`❌ *${s.name}* (${isBn ? 'মর্নিংয়ে দেরি >৫:০০' : 'Late to MP >5:00 AM'})${reasonStr}`);
        }
      }
    });

    const totalStudents = students.length;
    const totalCompliant = voiceCompliant.length + lotusCompliant.length;
    const totalNonCompliant = voiceNonCompliant.length + lotusNonCompliant.length;
    const totalAbsent = voiceAbsent.length + lotusAbsent.length;

    let report = isBn
      ? `🌅 *অদ্বৈত ভয়েস — প্রাতঃকালীন সাধনা ও উপস্থিতি রিপোর্ট* 🌅\n`
      : `🌅 *ADVAITA VOICE — MORNING PROGRAM COMBINED REPORT* 🌅\n`;
    report += `📅 *${isBn ? 'তারিখ' : 'Date'}:* ${dateFormatted}\n`;
    report += `👥 *${isBn ? 'মোট উপস্থিতি' : 'Total Attendance'}:* ${toBn(totalCompliant)}/${toBn(totalStudents)} ${isBn ? 'জন সময়মতো উপস্থিত' : 'Present on Time'}`;
    if (totalAbsent > 0) report += ` (${toBn(totalAbsent)} ${isBn ? 'জন অনুপস্থিত' : 'Absent'})`;
    report += `\n\n`;

    report += `🌟 *১. ${isBn ? 'ভয়েস গ্রুপ (ভোর ৪:০০ জাগরণ | ৪:৩০ এর মধ্যে মর্নিং প্রোগ্রাম)' : 'VOICE GROUP (Target: Wake 4:00 AM | MP <= 4:30 AM)'}*\n`;
    report += `✅ *${isBn ? 'সময়মতো উপস্থিত' : 'On Time'} (${toBn(voiceCompliant.length)}/${toBn(voiceStudents.length)}):*\n`;
    if (voiceCompliant.length > 0) {
      voiceCompliant.forEach((name, i) => {
        report += `   ${toBn(i + 1)}. ${name}\n`;
      });
    } else {
      report += `   (${isBn ? 'কেউ নেই' : 'None'})\n`;
    }
    if (voiceNonCompliant.length > 0) {
      report += `⚠️ *${isBn ? 'দেরি / মিস' : 'Late / Missed'} (${toBn(voiceNonCompliant.length)}):*\n`;
      voiceNonCompliant.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }
    if (voiceAbsent.length > 0) {
      report += `🔴 *${isBn ? 'অনুপস্থিত ভক্তবৃন্দ' : 'Absent Devotees'} (${toBn(voiceAbsent.length)}):*\n`;
      voiceAbsent.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }
    report += `\n`;

    report += `🪷 *২. ${isBn ? 'লোটাস গ্রুপ (ভোর ৫:০০ এর মধ্যে মর্নিং প্রোগ্রাম)' : 'LOTUS GROUP (Target: MP <= 5:00 AM)'}*\n`;
    report += `✅ *${isBn ? 'সময়মতো উপস্থিত' : 'On Time'} (${toBn(lotusCompliant.length)}/${toBn(lotusStudents.length)}):*\n`;
    if (lotusCompliant.length > 0) {
      lotusCompliant.forEach((name, i) => {
        report += `   ${toBn(i + 1)}. ${name}\n`;
      });
    } else {
      report += `   (${isBn ? 'কেউ নেই' : 'None'})\n`;
    }
    if (lotusNonCompliant.length > 0) {
      report += `⚠️ *${isBn ? 'দেরি / মিস' : 'Late / Missed'} (${toBn(lotusNonCompliant.length)}):*\n`;
      lotusNonCompliant.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }
    if (lotusAbsent.length > 0) {
      report += `🔴 *${isBn ? 'অনুপস্থিত ভক্তবৃন্দ' : 'Absent Devotees'} (${toBn(lotusAbsent.length)}):*\n`;
      lotusAbsent.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }
    report += `\n`;

    report += `📊 *${isBn ? 'সারসংক্ষেপ' : 'Summary'}:* ${toBn(totalCompliant)} ${isBn ? 'জন সময়মতো' : 'On-Time'}, ${toBn(totalNonCompliant)} ${isBn ? 'জন ব্যতিক্রম' : 'Exception(s)'}, ${toBn(totalAbsent)} ${isBn ? 'জন অনুপস্থিত' : 'Absent'}\n`;
    report += `🙏 *${isBn ? 'রিপোর্ট প্রেরণকারী' : 'Reported by'}:* ${isBn ? 'মর্নিং প্রোগ্রাম ইনচার্জ (অদ্বৈত ভয়েস)' : 'Morning Program Incharge (Advaita VOICE)'}\n`;
    return report;
  };

  // Generate Combined Security Manager / Night Discipline Report (Both Groups)
  const generateSecurityManagerCombinedReport = () => {
    const isBn = language === 'bn';
    const voiceStudents = students.filter(s => s.group === 'VOICE');
    const lotusStudents = students.filter(s => s.group === 'LOTUS');

    const voiceCompliant: string[] = [];
    const voiceNonCompliant: string[] = [];
    const voiceAbsent: string[] = [];

    const lotusCompliant: string[] = [];
    const lotusNonCompliant: string[] = [];
    const lotusAbsent: string[] = [];

    voiceStudents.forEach(s => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        voiceAbsent.push(`🔴 *${s.name}* — ${reason}`);
      } else {
        if (entry.sleptOnTime) {
          voiceCompliant.push(s.name);
        } else {
          let reasonStr = entry.reason ? ` — *${isBn ? 'কারণ' : 'Reason'}:* ${formatReasonText(entry.reason, isBn)}` : '';
          let strikeStr = s.monthlyStrikes > 0 ? ` [${isBn ? 'স্ট্রাইক' : 'Strike'} ${toBn(s.monthlyStrikes)}/৩]` : '';
          voiceNonCompliant.push(`❌ *${s.name}* (${isBn ? 'দেরিতে শয়ন >১০:০০' : 'Late Bed >10:00 PM'})${reasonStr}${strikeStr}`);
        }
      }
    });

    lotusStudents.forEach(s => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        lotusAbsent.push(`🔴 *${s.name}* — ${reason}`);
      } else {
        if (entry.sleptOnTime) {
          lotusCompliant.push(s.name);
        } else {
          let reasonStr = entry.reason ? ` — *${isBn ? 'কারণ' : 'Reason'}:* ${formatReasonText(entry.reason, isBn)}` : '';
          let strikeStr = s.monthlyStrikes > 0 ? ` [${isBn ? 'স্ট্রাইক' : 'Strike'} ${toBn(s.monthlyStrikes)}/৩]` : '';
          lotusNonCompliant.push(`❌ *${s.name}* (${isBn ? 'দেরিতে শয়ন >১১:০০' : 'Late Bed >11:00 PM'})${reasonStr}${strikeStr}`);
        }
      }
    });

    const totalStudents = students.length;
    const totalCompliant = voiceCompliant.length + lotusCompliant.length;
    const totalNonCompliant = voiceNonCompliant.length + lotusNonCompliant.length;
    const totalAbsent = voiceAbsent.length + lotusAbsent.length;

    let report = isBn
      ? `🌙 *অদ্বৈত ভয়েস — নৈশ শৃঙ্খলা ও নিরাপত্তা রিপোর্ট* 🌙\n`
      : `🌙 *ADVAITA VOICE — NIGHT DISCIPLINE & SECURITY REPORT* 🌙\n`;
    report += `📅 *${isBn ? 'তারিখ' : 'Date'}:* ${dateFormatted}\n`;
    report += `🔒 *${isBn ? 'কারফিউ ও শয়ন নিয়ম পালন' : 'Curfew & Bedtime Compliance'}:* ${toBn(totalCompliant)}/${toBn(totalStudents)} ${isBn ? 'জন সময়মতো শয়ন' : 'Present on Time'}`;
    if (totalAbsent > 0) report += ` (${toBn(totalAbsent)} ${isBn ? 'জন নৈশ ছুটি/অনুপস্থিত' : 'Night Leave/Absent'})`;
    report += `\n\n`;

    report += `🌟 *১. ${isBn ? 'ভয়েস গ্রুপ (শয়ন লক্ষ্য: রাত ১০:০০ এর মধ্যে | বাতি বন্ধ)' : 'VOICE GROUP (Bedtime Target: <= 10:00 PM | Lights Off)'}*\n`;
    report += `✅ *${isBn ? 'সময়মতো শয়ন' : 'Slept On Time'} (${toBn(voiceCompliant.length)}/${toBn(voiceStudents.length)}):*\n`;
    if (voiceCompliant.length > 0) {
      voiceCompliant.forEach((name, i) => {
        report += `   ${toBn(i + 1)}. ${name}\n`;
      });
    } else {
      report += `   (${isBn ? 'কেউ নেই' : 'None'})\n`;
    }
    if (voiceNonCompliant.length > 0) {
      report += `⚠️ *${isBn ? 'দেরিতে শয়ন' : 'Late Bed Violations'} (${toBn(voiceNonCompliant.length)}):*\n`;
      voiceNonCompliant.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }
    if (voiceAbsent.length > 0) {
      report += `🔴 *${isBn ? 'নৈশ ছুটি / অনুপস্থিত' : 'Night Leave / Absent'} (${toBn(voiceAbsent.length)}):*\n`;
      voiceAbsent.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }
    report += `\n`;

    report += `🪷 *২. ${isBn ? 'লোটাস গ্রুপ (শয়ন লক্ষ্য: রাত ১১:০০ এর মধ্যে | সিকিউরিটি লক)' : 'LOTUS GROUP (Bedtime Target: <= 11:00 PM | Security Lock)'}*\n`;
    report += `✅ *${isBn ? 'সময়মতো শয়ন' : 'Slept On Time'} (${toBn(lotusCompliant.length)}/${toBn(lotusStudents.length)}):*\n`;
    if (lotusCompliant.length > 0) {
      lotusCompliant.forEach((name, i) => {
        report += `   ${toBn(i + 1)}. ${name}\n`;
      });
    } else {
      report += `   (${isBn ? 'কেউ নেই' : 'None'})\n`;
    }
    if (lotusNonCompliant.length > 0) {
      report += `⚠️ *${isBn ? 'দেরিতে শয়ন' : 'Late Bed Violations'} (${toBn(lotusNonCompliant.length)}):*\n`;
      lotusNonCompliant.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }
    if (lotusAbsent.length > 0) {
      report += `🔴 *${isBn ? 'নৈশ ছুটি / অনুপস্থিত' : 'Night Leave / Absent'} (${toBn(lotusAbsent.length)}):*\n`;
      lotusAbsent.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }
    report += `\n`;

    report += `📊 *${isBn ? 'সারসংক্ষেপ' : 'Summary'}:* ${toBn(totalCompliant)} ${isBn ? 'জন সময়মতো শয়ন' : 'Slept On-Time'}, ${toBn(totalNonCompliant)} ${isBn ? 'জন অনিয়ম' : 'Violation(s)'}, ${toBn(totalAbsent)} ${isBn ? 'জন নৈশ ছুটি' : 'Night Leave'}\n`;
    report += `🙏 *${isBn ? 'রিপোর্ট প্রেরণকারী' : 'Reported by'}:* ${isBn ? 'সিকিউরিটি ম্যানেজার (অদ্বৈত ভয়েস)' : 'Security Manager (Advaita VOICE)'}\n`;
    return report;
  };

  const copyToClipboard = async (text: string, type: 'VOICE' | 'LOTUS' | 'ALL' | 'MP' | 'NIGHT') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'VOICE') { setCopiedVoice(true); setTimeout(() => setCopiedVoice(false), 2000); }
      if (type === 'LOTUS') { setCopiedLotus(true); setTimeout(() => setCopiedLotus(false), 2000); }
      if (type === 'ALL') { setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000); }
      if (type === 'MP') { setCopiedMp(true); setTimeout(() => setCopiedMp(false), 2000); }
      if (type === 'NIGHT') { setCopiedNight(true); setTimeout(() => setCopiedNight(false), 2000); }
      toast.success(language === 'bn' ? 'হোয়াটসঅ্যাপ রিপোর্ট কপি করা হয়েছে!' : 'WhatsApp Report copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const displayedStudents = activeTab === 'ALL' 
    ? students 
    : students.filter(s => s.group === activeTab);

  const voiceCount = students.filter(s => s.group === 'VOICE').length;
  const lotusCount = students.filter(s => s.group === 'LOTUS').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Link & Header */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 shadow-xs transition-all"
          >
            <ArrowLeft size={15} className="text-amber-500" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="text-[10px] text-slate-400 hover:text-slate-600 underline font-bold"
            >
              Reset 12 Devotees
            </button>
            <span className="text-[11px] font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Discipline Portal
            </span>
          </div>
        </div>

        {/* Hero Card with Date Navigator */}
        <div className="relative overflow-hidden rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 text-white shadow-xl border border-white/15">
          <div className="relative z-10 space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono text-[10.5px] font-extrabold uppercase tracking-wider border border-white/15">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Advaita VOICE • Ashram Discipline System</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {language === 'bn' ? 'ভয়েস ও লোটাস গ্রুপ অডিট ও দৈনিক রিপোর্ট' : 'VOICE & Lotus Group Daily Discipline Audit'}
                </h1>
                <p className="text-xs sm:text-sm text-amber-200/90 font-serif italic">
                  {language === 'bn' 
                    ? 'মর্নিং প্রোগ্রাম ইনচার্জ (ভয়েস গ্রুপ) ও সিকিউরিটি ম্যানেজার (লোটাস গ্রুপ) দৈনিক উপস্থিতি অডিট'
                    : 'Morning Program Incharge & Security Manager Daily Abidance Monitor'}
                </p>
              </div>

              {/* Date Controls */}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
                <button 
                  onClick={() => changeDate(-1)} 
                  className="p-1.5 hover:bg-white/20 rounded-xl text-white transition-colors"
                  title="Previous Day"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-2 px-3 py-1 text-center">
                  <Calendar size={15} className="text-amber-300" />
                  <span className="font-bold text-xs sm:text-sm text-white whitespace-nowrap">
                    {dateFormatted}
                  </span>
                </div>
                <button 
                  onClick={() => changeDate(1)} 
                  className="p-1.5 hover:bg-white/20 rounded-xl text-white transition-colors"
                  title="Next Day"
                >
                  <ChevronRight size={18} />
                </button>
                <button 
                  onClick={() => setSelectedDate(new Date())} 
                  className="ml-1 px-2.5 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Quick Rules Legend Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 font-mono uppercase">
                    🌟 VOICE Group (Morning Program Incharge)
                  </span>
                  <span className="text-[10px] font-bold bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full">
                    {voiceCount} Devotees
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                  • <strong>Bed:</strong> &le; 10:00 PM &nbsp;|&nbsp; <strong>Wake:</strong> 4:00 AM &nbsp;|&nbsp; <strong>MP:</strong> &le; 4:30 AM<br/>
                  • <em>Rule Breach:</em> 2–3 warning chances per month before demotion to Lotus.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-300 font-mono uppercase">
                    🪷 Lotus Group (Security Manager)
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-400/20 text-indigo-200 px-2 py-0.5 rounded-full">
                    {lotusCount} Devotees (Sangakara Das & Pranto C Das)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                  • <strong>Bed:</strong> &le; 11:00 PM &nbsp;|&nbsp; <strong>MP:</strong> &le; 5:00 AM<br/>
                  • <em>Rule Breach:</em> Repeated violation leads to ashram action.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Row 1: Clean Tabs and Devotee Management */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('VOICE')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'VOICE'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>🌟 VOICE Group ({voiceCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('LOTUS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'LOTUS'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>🪷 Lotus Group ({lotusCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>👥 All Students ({students.length})</span>
            </button>
          </div>

          {/* Quick Management Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => {
                triggerHaptic('light');
                if (activeTab === 'ALL') {
                  handleMarkAllOnTime('VOICE');
                  handleMarkAllOnTime('LOTUS');
                } else {
                  handleMarkAllOnTime(activeTab);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>Mark On-Time</span>
            </button>

            {activeTab === 'VOICE' && (
              <>
                <button
                  onClick={() => {
                    const report = generateVoiceReport();
                    shareToWhatsAppOrSystem({
                      text: report,
                      successMessage: 'Opening WhatsApp with VOICE Report...'
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xs transition-all cursor-pointer"
                  title="Send VOICE Group WhatsApp Report"
                >
                  <Send size={13} />
                  <span>VOICE Report</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('selection');
                    copyToClipboard(generateVoiceReport(), 'VOICE');
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
                  title="Copy VOICE Report"
                >
                  {copiedVoice ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedVoice ? 'Copied!' : 'Copy'}</span>
                </button>
              </>
            )}

            {activeTab === 'LOTUS' && (
              <>
                <button
                  onClick={() => {
                    const report = generateLotusReport();
                    shareToWhatsAppOrSystem({
                      text: report,
                      successMessage: 'Opening WhatsApp with Lotus Report...'
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
                  title="Send Lotus Group WhatsApp Report"
                >
                  <Send size={13} />
                  <span>Lotus Report</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('selection');
                    copyToClipboard(generateLotusReport(), 'LOTUS');
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all cursor-pointer"
                  title="Copy Lotus Report"
                >
                  {copiedLotus ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedLotus ? 'Copied!' : 'Copy'}</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all cursor-pointer"
              title="Add New Devotee"
            >
              <UserPlus size={14} />
              <span>Add Devotee</span>
            </button>
          </div>
        </div>

        {/* Row 2: Incharge Reports Command Center */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-[24px] border border-indigo-500/30 shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-amber-400">📊</span>
              <h2 className="text-xs sm:text-sm font-black tracking-wide uppercase text-white">
                Incharge Daily Reports & WhatsApp Dispatch
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const fullReport = `${generateMorningProgramCombinedReport()}\n=============================\n\n${generateSecurityManagerCombinedReport()}`;
                  shareToWhatsAppOrSystem({
                    text: fullReport,
                    successMessage: 'Opening WhatsApp with Full Report...'
                  });
                }}
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Share Full Summary →</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('selection');
                  const fullReport = `${generateMorningProgramCombinedReport()}\n=============================\n\n${generateSecurityManagerCombinedReport()}`;
                  copyToClipboard(fullReport, 'ALL');
                }}
                className="text-[11px] font-bold bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md text-slate-200 cursor-pointer inline-flex items-center gap-1"
                title="Copy Full Report"
              >
                {copiedAll ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                <span>{copiedAll ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Morning Program Incharge Card */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                    <Sun size={14} className="text-amber-400" />
                    Morning Program Incharge Report
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-200 font-mono px-2 py-0.5 rounded-full font-bold">
                    All 12 Students
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 font-normal">
                  Covers morning wake-up & Mangal Arati attendance for both VOICE & Lotus groups.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    const mpReport = generateMorningProgramCombinedReport();
                    shareToWhatsAppOrSystem({
                      text: mpReport,
                      successMessage: 'Opening WhatsApp...'
                    });
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Send size={13} />
                  <span>Send WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('selection');
                    const mpReport = generateMorningProgramCombinedReport();
                    copyToClipboard(mpReport, 'MP');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all cursor-pointer"
                  title="Copy Morning Report"
                >
                  {copiedMp ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedMp ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Security Manager Night Report Card */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-1.5">
                    <Moon size={14} className="text-indigo-400" />
                    Security Manager Night Report
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-200 font-mono px-2 py-0.5 rounded-full font-bold">
                    All 12 Students
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 font-normal">
                  Covers bedtime curfew compliance (10 PM / 11 PM) and lights-off security for all students.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    const nightReport = generateSecurityManagerCombinedReport();
                    shareToWhatsAppOrSystem({
                      text: nightReport,
                      successMessage: 'Opening WhatsApp...'
                    });
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Send size={13} />
                  <span>Send WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('selection');
                    const nightReport = generateSecurityManagerCombinedReport();
                    copyToClipboard(nightReport, 'NIGHT');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all cursor-pointer"
                  title="Copy Night Report"
                >
                  {copiedNight ? <Check size={13} className="text-indigo-400" /> : <Copy size={13} />}
                  <span>{copiedNight ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Student Checklist Cards with Edit Option */}
        <div className="space-y-3">
          {displayedStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No devotees found in this group. Click "Add Devotee" above to add names.
            </div>
          ) : (
            displayedStudents.map((student, idx) => {
              const entry = getEntry(student.id);
              const isVoice = student.group === 'VOICE';
              const isAbsent = !!entry.isAbsent;
              const hasFailure = !isAbsent && (!entry.sleptOnTime || !entry.wokeUpOnTime || !entry.morningProgramOnTime);

              return (
                <div 
                  key={student.id}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
                    isAbsent
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-800/60'
                      : hasFailure
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Devotee Identity + Strikes + Attendance Pill */}
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isAbsent
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                          : isVoice 
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30' 
                            : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30'
                      }`}>
                        {student.cycleOrder ? student.cycleOrder : idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                            {student.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isVoice 
                              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' 
                              : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300'
                          }`}>
                            {student.group}
                          </span>

                          {/* Attendance Status Toggle Button */}
                          <button
                            onClick={() => {
                              triggerHaptic('selection');
                              updateEntry(student.id, { 
                                isAbsent: !isAbsent,
                                absenceReason: !isAbsent ? (entry.absenceReason || 'Out of town / Home Leave (গ্রামের বাড়ি / বাইরে অবস্থান)') : ''
                              });
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer border ${
                              isAbsent
                                ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-100'
                            }`}
                            title="Click to toggle Present / Absent status"
                          >
                            <span>{isAbsent ? '🔴 Absent' : '🟢 Present'}</span>
                          </button>
                        </div>

                        {/* Strikes Status & Phone */}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {student.phone && (
                            <span className="text-[10px] font-mono text-slate-400">
                              {student.phone}
                            </span>
                          )}

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500 font-medium">Strikes:</span>
                            {[1, 2, 3].map(st => (
                              <button
                                key={st}
                                onClick={() => handleAdjustStrikes(student.id, student.monthlyStrikes === st ? -1 : (st - student.monthlyStrikes))}
                                className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center transition-all cursor-pointer ${
                                  student.monthlyStrikes >= st
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:bg-slate-300'
                                }`}
                                title={`Strike ${st}`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                          {student.monthlyStrikes >= 3 && (
                            <span className="text-[10px] font-black text-rose-600 animate-pulse">
                              {isVoice ? '⚠️ Move to Lotus' : '⚠️ Action Due'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Controls: If Absent, show Absence Reason; If Present, show 3 discipline toggles */}
                    {isAbsent ? (
                      <div className="flex-1 max-w-xl p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center gap-2 animate-fade-in">
                        <span className="text-xs font-black text-amber-800 dark:text-amber-300 shrink-0 flex items-center gap-1">
                          <span>🔴 Reason for Absence:</span>
                        </span>
                        <select
                          value={entry.absenceReason || ''}
                          onChange={(e) => updateEntry(student.id, { absenceReason: e.target.value })}
                          className="flex-1 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg p-1.5 font-medium focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">-- Select Absence Reason --</option>
                          {ABSENCE_REASONS.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 max-w-xl">
                        
                        {/* 1. Bedtime */}
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <Moon size={14} className="text-indigo-400" />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {isVoice ? '<= 10:00 PM Bed' : '<= 11:00 PM Bed'}
                            </span>
                          </div>
                          <button
                            onClick={() => updateEntry(student.id, { sleptOnTime: !entry.sleptOnTime })}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              entry.sleptOnTime
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'bg-rose-500 text-white shadow-xs'
                            }`}
                          >
                            {entry.sleptOnTime ? 'Yes' : 'No'}
                          </button>
                        </div>

                        {/* 2. Wake-up */}
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <Sun size={14} className="text-amber-400" />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {isVoice ? '4:00 AM Wake' : 'Wake On-Time'}
                            </span>
                          </div>
                          <button
                            onClick={() => updateEntry(student.id, { wokeUpOnTime: !entry.wokeUpOnTime })}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              entry.wokeUpOnTime
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'bg-rose-500 text-white shadow-xs'
                            }`}
                          >
                            {entry.wokeUpOnTime ? 'Yes' : 'No'}
                          </button>
                        </div>

                        {/* 3. Morning Program */}
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-rose-400" />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {isVoice ? '<= 4:30 AM MP' : '<= 5:00 AM MP'}
                            </span>
                          </div>
                          <button
                            onClick={() => updateEntry(student.id, { morningProgramOnTime: !entry.morningProgramOnTime })}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              entry.morningProgramOnTime
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'bg-rose-500 text-white shadow-xs'
                            }`}
                          >
                            {entry.morningProgramOnTime ? 'Yes' : 'No'}
                          </button>
                        </div>

                      </div>
                    )}

                    {/* Management Edit Actions */}
                    <div className="flex items-center gap-1.5 justify-end shrink-0">
                      
                      {/* Edit Details Button */}
                      <button
                        onClick={() => setEditingStudent({ ...student })}
                        className="p-2 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                        title="Edit Devotee Details"
                      >
                        <Edit size={14} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      {/* Switch Group Button */}
                      <button
                        onClick={() => handleSwitchGroup(student.id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                        title={`Move to ${isVoice ? 'Lotus Group' : 'VOICE Group'}`}
                      >
                        <ArrowRightLeft size={14} />
                        <span className="hidden sm:inline">{isVoice ? 'To Lotus' : 'To VOICE'}</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteStudent(student.id, student.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Delete Devotee"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </div>

                  {/* Exception / Emergency Reason Dropdown (Shown if present and any rule was broken) */}
                  {!isAbsent && hasFailure && (
                    <div className="mt-3 pt-3 border-t border-rose-200/60 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center gap-2 animate-fade-in">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 shrink-0">
                        <AlertCircle size={14} />
                        <span>Reason / Emergency:</span>
                      </div>

                      <select
                        value={entry.reason || ''}
                        onChange={(e) => updateEntry(student.id, { reason: e.target.value })}
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2 font-medium focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="">-- Select Reason / Emergency --</option>
                        {EMERGENCY_REASONS.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Edit Devotee Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Edit Devotee: {editingStudent.name}
              </h3>
              <button 
                onClick={() => setEditingStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Devotee Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editingStudent.phone || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Group *
                  </label>
                  <select
                    value={editingStudent.group}
                    onChange={e => setEditingStudent({ ...editingStudent, group: e.target.value as GroupType })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    <option value="VOICE">🌟 VOICE Group</option>
                    <option value="LOTUS">🪷 Lotus Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Strikes (0-3)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={editingStudent.monthlyStrikes}
                    onChange={e => setEditingStudent({ ...editingStudent, monthlyStrikes: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-md flex items-center justify-center gap-1.5"
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Add New Devotee to Discipline List
            </h3>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Devotee Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhamohan P."
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+880 1..."
                  value={newStudentPhone}
                  onChange={e => setNewStudentPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Group *
                </label>
                <select
                  value={newStudentGroup}
                  onChange={e => setNewStudentGroup(e.target.value as GroupType)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="VOICE">🌟 VOICE Group (10 PM Bed / 4:30 AM MP)</option>
                  <option value="LOTUS">🪷 Lotus Group (11 PM Bed / 5:00 AM MP)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-md"
                >
                  Save Devotee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AshramDisciplineAudit;
