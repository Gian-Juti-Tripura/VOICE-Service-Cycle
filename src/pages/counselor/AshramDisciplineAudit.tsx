import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ArrowLeft, Calendar, Check, Copy, 
  Sparkles, ChevronLeft, ChevronRight, 
  UserPlus, Trash2, ArrowRightLeft,
  Moon, Sun, Clock, AlertCircle, Edit, Save, X, Send,
  Flame, BookOpen, History, Award,
  Download
} from 'lucide-react';
import { 
  type GroupType, 
  type StudentDisciplineRecord, 
  type DailyDisciplineEntry, 
  EMERGENCY_REASONS, 
  ABSENCE_REASONS,
  MANGALARATI_REASONS,
  MORNING_CLASS_REASONS,
  LATE_MINUTE_OPTIONS,
  INITIAL_DISCIPLINE_STUDENTS 
} from '../../data/groupDisciplineData';
import { shareToWhatsAppOrSystem } from '../../utils/shareUtils';
import { exportTableToPdf } from '../../lib/exportTablePdf';
import { triggerHaptic } from '../../utils/haptics';
import toast from 'react-hot-toast';

const STORAGE_STUDENTS_KEY = 'advaita_discipline_students_v3';
const STORAGE_DAILY_KEY = 'advaita_discipline_daily_v3';

interface MonthlyDevoteeStats {
  student: StudentDisciplineRecord;
  totalDaysEvaluated: number;
  presentDays: number;
  absentDays: number;
  bedOnTimeDays: number;
  wakeOnTimeDays: number;
  mpOnTimeDays: number;
  mangalaratiDays: number;
  classDays: number;
  bedSuccessRate: number;
  mpSuccessRate: number;
  mangalaratiRate: number;
  classRate: number;
  overallSuccessRate: number;
  totalStrikes: number;
  verdictType: 'VOICE_SUCCESS' | 'VOICE_WARNING' | 'VOICE_DEMOTION' | 'LOTUS_SUCCESS' | 'LOTUS_ACTIVE';
  verdictLabelEn: string;
  verdictLabelBn: string;
}

export const AshramDisciplineAudit: React.FC = () => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<GroupType | 'ALL'>('VOICE');

  const [students, setStudents] = useState<StudentDisciplineRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STUDENTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DISCIPLINE_STUDENTS;
    } catch {
      return INITIAL_DISCIPLINE_STUDENTS;
    }
  });

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
  const [copiedMp, setCopiedMp] = useState(false);
  const [copiedNight, setCopiedNight] = useState(false);
  const [copiedMonthly, setCopiedMonthly] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentGroup, setNewStudentGroup] = useState<GroupType>('VOICE');

  const [editingStudent, setEditingStudent] = useState<StudentDisciplineRecord | null>(null);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historySelectedStudentId, setHistorySelectedStudentId] = useState<string | null>(null);

  const [isMonthlyVerdictModalOpen, setIsMonthlyVerdictModalOpen] = useState(false);
  const [selectedVerdictMonth, setSelectedVerdictMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_DAILY_KEY, JSON.stringify(dailyRecords));
  }, [dailyRecords]);

  const dateIso = selectedDate.toISOString().split('T')[0];
  const isBn = language === 'bn';

  const dateFormatted = selectedDate.toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const toBn = (num: number | string) => {
    if (!isBn) return String(num);
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, d => bnDigits[parseInt(d, 10)]);
  };

  const formatReasonText = (reason?: string, bn = isBn) => {
    if (!reason) return bn ? 'অনুপস্থিত / ছুটি' : 'Leave / Absent';
    if (bn) {
      const match = reason.match(/\((.*?)\)/);
      if (match && match[1]) return match[1].trim();
      return reason;
    } else {
      const parts = reason.split('(');
      return parts[0].trim() || reason;
    }
  };

  const getEntry = (studentId: string, customDateIso = dateIso): DailyDisciplineEntry => {
    const dayData = dailyRecords[customDateIso] || {};
    return dayData[studentId] || {
      studentId,
      dateStr: customDateIso,
      isAbsent: studentId === 'member_0',
      absenceReason: studentId === 'member_0' ? 'Out of town / Home Leave (গ্রামের বাড়ি / বাইরে অবস্থান)' : '',
      sleptOnTime: true,
      bedLateMinutes: 0,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: true,
      mangalaratiReason: '',
      morningClassAttended: true,
      morningClassReason: '',
      reason: '',
      isEmergency: false,
    };
  };

  const updateEntry = (studentId: string, updates: Partial<DailyDisciplineEntry>, customDateIso = dateIso) => {
    const current = getEntry(studentId, customDateIso);
    const updated = { ...current, ...updates };

    setDailyRecords(prev => ({
      ...prev,
      [customDateIso]: {
        ...(prev[customDateIso] || {}),
        [studentId]: updated
      }
    }));
  };

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
        bedLateMinutes: 0,
        wokeUpOnTime: true,
        morningProgramOnTime: true,
        mpLateMinutes: 0,
        mangalaratiAttended: true,
        mangalaratiReason: '',
        morningClassAttended: true,
        morningClassReason: '',
        reason: '',
        isEmergency: false
      };
    });

    setDailyRecords(prev => ({
      ...prev,
      [dateIso]: newDayEntries
    }));

    toast.success(
      isBn 
        ? `${group === 'VOICE' ? 'ভয়েস গ্রুপের' : 'লোটাস গ্রুপের'} সবাইকে অন-টাইম মার্ক করা হয়েছে!` 
        : `Marked all ${group} Group devotees as On-Time!`
    );
  };

  const handleAdjustStrikes = (studentId: string, delta: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const newStrikes = Math.max(0, Math.min(3, s.monthlyStrikes + delta));
      let status: StudentDisciplineRecord['status'] = 'ACTIVE';
      let group: GroupType = s.group;

      if (newStrikes === 1 || newStrikes === 2) {
        status = 'WARNED';
      }
      if (newStrikes >= 3) {
        if (s.group === 'VOICE') {
          status = 'DEMOTION_DUE';
          group = 'LOTUS';
          toast.error(
            isBn
              ? `⚠️ ${s.name} ৩টি স্ট্রাইক পূর্ণ করায় স্বয়ংক্রিয়ভাবে লোটাস গ্রুপে অবনমিত করা হয়েছে!`
              : `⚠️ ${s.name} accumulated 3 strikes and was automatically degraded to Lotus Group!`,
            { duration: 5000 }
          );
        } else {
          status = 'DISMISSED';
        }
      }
      return { ...s, group, monthlyStrikes: newStrikes, status };
    }));
  };

  const handleSwitchGroup = (studentId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const newGroup: GroupType = s.group === 'VOICE' ? 'LOTUS' : 'VOICE';
      toast.success(
        isBn 
          ? `${s.name}-কে ${newGroup === 'VOICE' ? 'ভয়েস গ্রুপে' : 'লোটাস গ্রুপে'} স্থানান্তর করা হয়েছে` 
          : `Moved ${s.name} to ${newGroup} Group`
      );
      return { ...s, group: newGroup, monthlyStrikes: 0, status: 'ACTIVE' };
    }));
  };

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
    toast.success(isBn ? 'নতুন ভক্ত যুক্ত হয়েছে' : 'Added devotee successfully');
  };

  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editingStudent.name.trim()) return;

    setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
    setEditingStudent(null);
    toast.success(isBn ? 'ভক্তের তথ্য আপডেট হয়েছে' : 'Devotee details updated');
  };

  const handleDeleteStudent = (studentId: string, name: string) => {
    if (!window.confirm(`Remove ${name} from discipline list?`)) return;
    setStudents(prev => prev.filter(s => s.id !== studentId));
    toast.success('Devotee removed');
  };

  const handleResetToDefault = () => {
    if (!window.confirm('Reset student list to default 12 active ashram devotees?')) return;
    setStudents(INITIAL_DISCIPLINE_STUDENTS);
    toast.success('Reset to 12 active devotees list');
  };

  const changeDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  const generateVoiceReport = () => {
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
        const isAllGood = entry.sleptOnTime && entry.wokeUpOnTime && entry.morningProgramOnTime && entry.mangalaratiAttended && entry.morningClassAttended;
        if (isAllGood) {
          compliant.push(s.name);
        } else {
          const issues: string[] = [];
          if (!entry.sleptOnTime) {
            const minStr = entry.bedLateMinutes ? ` (${entry.bedLateMinutes}m late)` : '';
            issues.push(isBn ? `শয়নে দেরি${minStr}` : `Late Bed${minStr}`);
          }
          if (!entry.wokeUpOnTime) issues.push(isBn ? 'দেরিতে জাগরণ (>৪:০০)' : 'Late Wake (>4:00 AM)');
          if (!entry.morningProgramOnTime) {
            const minStr = entry.mpLateMinutes ? ` (${entry.mpLateMinutes}m late)` : '';
            issues.push(isBn ? `মর্নিংয়ে দেরি${minStr}` : `Late to MP${minStr}`);
          }
          if (!entry.mangalaratiAttended) {
            const mReason = entry.mangalaratiReason ? ` [${formatReasonText(entry.mangalaratiReason, isBn)}]` : '';
            issues.push(isBn ? `মঙ্গল আরতি মিস${mReason}` : `Missed Mangalarati${mReason}`);
          }
          if (!entry.morningClassAttended) {
            const cReason = entry.morningClassReason ? ` [${formatReasonText(entry.morningClassReason, isBn)}]` : '';
            issues.push(isBn ? `ক্লাস মিস${cReason}` : `Missed Morning Class${cReason}`);
          }
          
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
    report += `📋 *${isBn ? 'গ্রুপ' : 'Group'}:* ${isBn ? 'ভয়েস গ্রুপ (শয়ন: <= রাত ১০:০০ | ওঠা: ভোর ৪:০০ | মর্নিং: <= ৪:৩০ | মঙ্গল আরতি ও ক্লাস)' : 'VOICE Group (Bed: <= 10:00 PM | Wake: 4:00 AM | MP: <= 4:30 AM | Mangalarati & Class)'}\n\n`;

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

  const generateLotusReport = () => {
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
        const isAllGood = entry.sleptOnTime && entry.morningProgramOnTime && entry.mangalaratiAttended && entry.morningClassAttended;
        if (isAllGood) {
          compliant.push(s.name);
        } else {
          const issues: string[] = [];
          if (!entry.sleptOnTime) {
            const minStr = entry.bedLateMinutes ? ` (${entry.bedLateMinutes}m late)` : '';
            issues.push(isBn ? `দেরিতে শয়ন${minStr}` : `Late Bed${minStr}`);
          }
          if (!entry.morningProgramOnTime) {
            const minStr = entry.mpLateMinutes ? ` (${entry.mpLateMinutes}m late)` : '';
            issues.push(isBn ? `মর্নিংয়ে দেরি${minStr}` : `Late to MP${minStr}`);
          }
          if (!entry.mangalaratiAttended) {
            const mReason = entry.mangalaratiReason ? ` [${formatReasonText(entry.mangalaratiReason, isBn)}]` : '';
            issues.push(isBn ? `মঙ্গল আরতি মিস${mReason}` : `Missed Mangalarati${mReason}`);
          }
          if (!entry.morningClassAttended) {
            const cReason = entry.morningClassReason ? ` [${formatReasonText(entry.morningClassReason, isBn)}]` : '';
            issues.push(isBn ? `ক্লাস মিস${cReason}` : `Missed Morning Class${cReason}`);
          }
          
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
    report += `📋 *${isBn ? 'গ্রুপ' : 'Group'}:* ${isBn ? 'লোটাস গ্রুপ (শয়ন: <= রাত ১১:০০ | মর্নিং: <= ভোর ৫:০০ | মঙ্গল আরতি ও ক্লাস)' : 'Lotus Group (Bed: <= 11:00 PM | MP: <= 5:00 AM | Mangalarati & Class)'}\n\n`;

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

  const generateMorningProgramCombinedReport = () => {
    const voiceStudents = students.filter(s => s.group === 'VOICE');
    const lotusStudents = students.filter(s => s.group === 'LOTUS');

    const voiceCompliant: string[] = [];
    const voiceNonCompliant: string[] = [];
    const voiceAbsent: string[] = [];

    const lotusCompliant: string[] = [];
    const lotusNonCompliant: string[] = [];
    const lotusAbsent: string[] = [];

    let totalMangalaratiAttended = 0;
    let totalMorningClassAttended = 0;
    let totalPresentCount = 0;

    voiceStudents.forEach(s => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        voiceAbsent.push(`🔴 *${s.name}* — ${reason}`);
      } else {
        totalPresentCount++;
        if (entry.mangalaratiAttended) totalMangalaratiAttended++;
        if (entry.morningClassAttended) totalMorningClassAttended++;

        const isMorningGood = entry.wokeUpOnTime && entry.morningProgramOnTime && entry.mangalaratiAttended && entry.morningClassAttended;
        if (isMorningGood) {
          voiceCompliant.push(s.name);
        } else {
          const issues: string[] = [];
          if (!entry.wokeUpOnTime) issues.push(isBn ? 'দেরিতে জাগরণ (>৪:০০)' : 'Late Wake (>4:00 AM)');
          if (!entry.morningProgramOnTime) {
            const minStr = entry.mpLateMinutes ? ` (${entry.mpLateMinutes}m)` : '';
            issues.push(isBn ? `মর্নিংয়ে দেরি${minStr}` : `Late to MP${minStr}`);
          }
          if (!entry.mangalaratiAttended) {
            const mReason = entry.mangalaratiReason ? ` (${formatReasonText(entry.mangalaratiReason, isBn)})` : '';
            issues.push(isBn ? `মঙ্গল আরতি মিস${mReason}` : `Missed Mangalarati${mReason}`);
          }
          if (!entry.morningClassAttended) {
            const cReason = entry.morningClassReason ? ` (${formatReasonText(entry.morningClassReason, isBn)})` : '';
            issues.push(isBn ? `ক্লাস মিস${cReason}` : `Missed Morning Class${cReason}`);
          }
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
        totalPresentCount++;
        if (entry.mangalaratiAttended) totalMangalaratiAttended++;
        if (entry.morningClassAttended) totalMorningClassAttended++;

        const isMorningGood = entry.morningProgramOnTime && entry.mangalaratiAttended && entry.morningClassAttended;
        if (isMorningGood) {
          lotusCompliant.push(s.name);
        } else {
          const issues: string[] = [];
          if (!entry.morningProgramOnTime) {
            const minStr = entry.mpLateMinutes ? ` (${entry.mpLateMinutes}m)` : '';
            issues.push(isBn ? `মর্নিংয়ে দেরি${minStr}` : `Late to MP${minStr}`);
          }
          if (!entry.mangalaratiAttended) {
            const mReason = entry.mangalaratiReason ? ` (${formatReasonText(entry.mangalaratiReason, isBn)})` : '';
            issues.push(isBn ? `মঙ্গল আরতি মিস${mReason}` : `Missed Mangalarati${mReason}`);
          }
          if (!entry.morningClassAttended) {
            const cReason = entry.morningClassReason ? ` (${formatReasonText(entry.morningClassReason, isBn)})` : '';
            issues.push(isBn ? `ক্লাস মিস${cReason}` : `Missed Morning Class${cReason}`);
          }
          let reasonStr = entry.reason ? ` — *${isBn ? 'কারণ' : 'Reason'}:* ${formatReasonText(entry.reason, isBn)}` : '';
          lotusNonCompliant.push(`❌ *${s.name}* (${issues.join(', ')})${reasonStr}`);
        }
      }
    });

    const totalStudents = students.length;
    const totalCompliant = voiceCompliant.length + lotusCompliant.length;
    const totalAbsent = voiceAbsent.length + lotusAbsent.length;

    let report = isBn
      ? `🌅 *অদ্বৈত ভয়েস — প্রাতঃকালীন সাধনা ও উপস্থিতি রিপোর্ট* 🌅\n`
      : `🌅 *ADVAITA VOICE — MORNING PROGRAM COMBINED REPORT* 🌅\n`;
    report += `📅 *${isBn ? 'তারিখ' : 'Date'}:* ${dateFormatted}\n`;
    report += `👥 *${isBn ? 'মোট উপস্থিতি' : 'Total Attendance'}:* ${toBn(totalCompliant)}/${toBn(totalStudents)} ${isBn ? 'জন সময়মতো উপস্থিত' : 'Present on Time'}`;
    if (totalAbsent > 0) report += ` (${toBn(totalAbsent)} ${isBn ? 'জন অনুপস্থিত' : 'Absent'})`;
    report += `\n`;
    report += `🪔 *${isBn ? 'মঙ্গল আরতি উপস্থিতি' : 'Mangalarati Attendance'}:* ${toBn(totalMangalaratiAttended)}/${toBn(totalPresentCount)} ${isBn ? 'জন উপস্থিত' : 'Attended'}\n`;
    report += `📖 *${isBn ? 'প্রাতঃকালীন ক্লাস (~৭:০০)' : 'Morning Class (~7:00 AM)'}:* ${toBn(totalMorningClassAttended)}/${toBn(totalPresentCount)} ${isBn ? 'জন উপস্থিত' : 'Attended'}\n\n`;

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

    report += `🙏 *${isBn ? 'রিপোর্ট প্রেরণকারী' : 'Reported by'}:* ${isBn ? 'মর্নিং প্রোগ্রাম ইনচার্জ (অদ্বৈত ভয়েস)' : 'Morning Program Incharge (Advaita VOICE)'}\n`;
    return report;
  };

  const generateSecurityManagerCombinedReport = () => {
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
          const minStr = entry.bedLateMinutes ? ` (${entry.bedLateMinutes}m late)` : '';
          let reasonStr = entry.reason ? ` — *${isBn ? 'কারণ' : 'Reason'}:* ${formatReasonText(entry.reason, isBn)}` : '';
          let strikeStr = s.monthlyStrikes > 0 ? ` [${isBn ? 'স্ট্রাইক' : 'Strike'} ${toBn(s.monthlyStrikes)}/৩]` : '';
          voiceNonCompliant.push(`❌ *${s.name}* (${isBn ? `রাত ১০:০০ এর পর শয়ন${minStr}` : `Late Bed >10:00 PM${minStr}`})${reasonStr}${strikeStr}`);
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
          const minStr = entry.bedLateMinutes ? ` (${entry.bedLateMinutes}m late)` : '';
          let reasonStr = entry.reason ? ` — *${isBn ? 'কারণ' : 'Reason'}:* ${formatReasonText(entry.reason, isBn)}` : '';
          let strikeStr = s.monthlyStrikes > 0 ? ` [${isBn ? 'স্ট্রাইক' : 'Strike'} ${toBn(s.monthlyStrikes)}/৩]` : '';
          lotusNonCompliant.push(`❌ *${s.name}* (${isBn ? `রাত ১১:০০ এর পর শয়ন${minStr}` : `Late Bed >11:00 PM${minStr}`})${reasonStr}${strikeStr}`);
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

  const monthlyStats = useMemo<MonthlyDevoteeStats[]>(() => {
    const monthDates = Object.keys(dailyRecords).filter(d => d.startsWith(selectedVerdictMonth));
    if (monthDates.length === 0 && dateIso.startsWith(selectedVerdictMonth)) {
      monthDates.push(dateIso);
    }

    return students.map(student => {
      let presentDays = 0;
      let absentDays = 0;
      let bedOnTimeDays = 0;
      let wakeOnTimeDays = 0;
      let mpOnTimeDays = 0;
      let mangalaratiDays = 0;
      let classDays = 0;

      monthDates.forEach(date => {
        const entry = (dailyRecords[date] && dailyRecords[date][student.id]) || getEntry(student.id, date);
        if (entry.isAbsent) {
          absentDays++;
        } else {
          presentDays++;
          if (entry.sleptOnTime) bedOnTimeDays++;
          if (entry.wokeUpOnTime) wakeOnTimeDays++;
          if (entry.morningProgramOnTime) mpOnTimeDays++;
          if (entry.mangalaratiAttended) mangalaratiDays++;
          if (entry.morningClassAttended) classDays++;
        }
      });

      const totalDaysEvaluated = presentDays + absentDays;
      const divisor = presentDays > 0 ? presentDays : 1;

      const bedSuccessRate = presentDays > 0 ? Math.round((bedOnTimeDays / divisor) * 100) : 100;
      const mpSuccessRate = presentDays > 0 ? Math.round((mpOnTimeDays / divisor) * 100) : 100;
      const mangalaratiRate = presentDays > 0 ? Math.round((mangalaratiDays / divisor) * 100) : 100;
      const classRate = presentDays > 0 ? Math.round((classDays / divisor) * 100) : 100;

      const overallSuccessRate = presentDays > 0 
        ? Math.round(((bedOnTimeDays + mpOnTimeDays + mangalaratiDays + classDays) / (divisor * 4)) * 100)
        : 100;

      const strikes = student.monthlyStrikes;

      let verdictType: MonthlyDevoteeStats['verdictType'] = 'VOICE_SUCCESS';
      let verdictLabelEn = 'VOICE SUCCESS (Exemplary Sadhaka)';
      let verdictLabelBn = 'ভয়েস সাকসেস (অনুকরণীয় সাধক)';

      if (student.group === 'VOICE') {
        if (strikes >= 3 || overallSuccessRate < 75) {
          verdictType = 'VOICE_DEMOTION';
          verdictLabelEn = 'DEMOTION TO LOTUS (Failed Criteria)';
          verdictLabelBn = 'লোটাসে অবনমন (ভয়েস মানদণ্ডে অনুত্তীর্ণ)';
        } else if (strikes === 2 || overallSuccessRate < 90) {
          verdictType = 'VOICE_WARNING';
          verdictLabelEn = 'VOICE WARNING (Under Review)';
          verdictLabelBn = 'ভয়েস সতর্কতা (পর্যবেক্ষণে)';
        } else {
          verdictType = 'VOICE_SUCCESS';
          verdictLabelEn = 'VOICE SUCCESS (Retain in VOICE)';
          verdictLabelBn = 'ভয়েস সাকসেস (ভয়েস বহাল)';
        }
      } else {
        if (overallSuccessRate >= 90 && strikes <= 1) {
          verdictType = 'LOTUS_SUCCESS';
          verdictLabelEn = 'LOTUS SUCCESS (Promotion Eligible)';
          verdictLabelBn = 'লোটাস সাকসেস (ভয়েসে পদোন্নতির যোগ্য)';
        } else {
          verdictType = 'LOTUS_ACTIVE';
          verdictLabelEn = 'LOTUS ACTIVE (Continue Improvement)';
          verdictLabelBn = 'লোটাস সক্রিয় (উন্নতি চলমান)';
        }
      }

      return {
        student,
        totalDaysEvaluated,
        presentDays,
        absentDays,
        bedOnTimeDays,
        wakeOnTimeDays,
        mpOnTimeDays,
        mangalaratiDays,
        classDays,
        bedSuccessRate,
        mpSuccessRate,
        mangalaratiRate,
        classRate,
        overallSuccessRate,
        totalStrikes: strikes,
        verdictType,
        verdictLabelEn,
        verdictLabelBn
      };
    });
  }, [dailyRecords, students, selectedVerdictMonth, dateIso]);

  const generateMonthlyVerdictReport = () => {
    const voiceStats = monthlyStats.filter(s => s.student.group === 'VOICE');
    const lotusStats = monthlyStats.filter(s => s.student.group === 'LOTUS');

    const [year, month] = selectedVerdictMonth.split('-');
    const monthDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthFormatted = monthDate.toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', { month: 'long', year: 'numeric' });

    let report = isBn 
      ? `📊 *অদ্বৈত ভয়েস — মাসিক সাধনা ও শৃঙ্খলা মূল্যায়ন প্রতিবেদন* 📊\n`
      : `📊 *ADVAITA VOICE — MONTHLY DISCIPLINE & SADHANA VERDICT* 📊\n`;
    report += `📅 *${isBn ? 'মূল্যায়ন মাস' : 'Evaluation Month'}:* ${monthFormatted}\n`;
    report += `🏛️ *${isBn ? 'আশ্রম' : 'Ashram'}:* Advaita VOICE (Chittagong University)\n\n`;

    report += `🌟 *১. ${isBn ? 'ভয়েস গ্রুপ মূল্যায়ন' : 'VOICE GROUP EVALUATION'} (${toBn(voiceStats.length)} ${isBn ? 'জন' : 'Devotees'})*\n`;
    voiceStats.forEach((st, i) => {
      report += `${toBn(i + 1)}. *${st.student.name}*\n`;
      report += `   • ${isBn ? 'সাফল্যের হার' : 'Success Rate'}: *${toBn(st.overallSuccessRate)}%* (${isBn ? 'উপস্থিত' : 'Present'}: ${toBn(st.presentDays)}/${toBn(st.totalDaysEvaluated)} ${isBn ? 'দিন' : 'days'})\n`;
      report += `   • ${isBn ? 'শয়ন' : 'Bed'}: ${toBn(st.bedSuccessRate)}% | ${isBn ? 'মর্নিং' : 'MP'}: ${toBn(st.mpSuccessRate)}% | ${isBn ? 'মঙ্গল আরতি' : 'Mangalarati'}: ${toBn(st.mangalaratiRate)}% | ${isBn ? 'ক্লাস' : 'Class'}: ${toBn(st.classRate)}%\n`;
      report += `   • ${isBn ? 'স্ট্রাইক' : 'Strikes'}: ${toBn(st.totalStrikes)}/৩\n`;
      report += `   • ${isBn ? 'চূড়ান্ত সিদ্ধান্ত' : 'Final Verdict'}: ${st.verdictType === 'VOICE_SUCCESS' ? '🟢' : st.verdictType === 'VOICE_WARNING' ? '🟡' : '🔴'} *${isBn ? st.verdictLabelBn : st.verdictLabelEn}*\n\n`;
    });

    report += `🪷 *২. ${isBn ? 'লোটাস গ্রুপ মূল্যায়ন' : 'LOTUS GROUP EVALUATION'} (${toBn(lotusStats.length)} ${isBn ? 'জন' : 'Devotees'})*\n`;
    lotusStats.forEach((st, i) => {
      report += `${toBn(i + 1)}. *${st.student.name}*\n`;
      report += `   • ${isBn ? 'সাফল্যের হার' : 'Success Rate'}: *${toBn(st.overallSuccessRate)}%* (${isBn ? 'উপস্থিত' : 'Present'}: ${toBn(st.presentDays)}/${toBn(st.totalDaysEvaluated)} ${isBn ? 'দিন' : 'days'})\n`;
      report += `   • ${isBn ? 'শয়ন' : 'Bed'}: ${toBn(st.bedSuccessRate)}% | ${isBn ? 'মর্নিং' : 'MP'}: ${toBn(st.mpSuccessRate)}% | ${isBn ? 'মঙ্গল আরতি' : 'Mangalarati'}: ${toBn(st.mangalaratiRate)}% | ${isBn ? 'ক্লাস' : 'Class'}: ${toBn(st.classRate)}%\n`;
      report += `   • ${isBn ? 'স্ট্রাইক' : 'Strikes'}: ${toBn(st.totalStrikes)}/৩\n`;
      report += `   • ${isBn ? 'চূড়ান্ত সিদ্ধান্ত' : 'Final Verdict'}: 🪷 *${isBn ? st.verdictLabelBn : st.verdictLabelEn}*\n\n`;
    });

    report += `🙏 *${isBn ? 'প্রতিবেদন অনুমোদন' : 'Approved by'}:* ${isBn ? 'কাউন্সেলর ও ম্যানেজমেন্ট বোর্ড (অদ্বৈত ভয়েস)' : 'Counselor & Management Board (Advaita VOICE)'}\n`;
    return report;
  };

  const copyToClipboard = async (text: string, type: 'VOICE' | 'LOTUS' | 'MP' | 'NIGHT' | 'MONTHLY') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'VOICE') { setCopiedVoice(true); setTimeout(() => setCopiedVoice(false), 2000); }
      if (type === 'LOTUS') { setCopiedLotus(true); setTimeout(() => setCopiedLotus(false), 2000); }
      if (type === 'MP') { setCopiedMp(true); setTimeout(() => setCopiedMp(false), 2000); }
      if (type === 'NIGHT') { setCopiedNight(true); setTimeout(() => setCopiedNight(false), 2000); }
      if (type === 'MONTHLY') { setCopiedMonthly(true); setTimeout(() => setCopiedMonthly(false), 2000); }
      toast.success(isBn ? 'হোয়াটসঅ্যাপ রিপোর্ট কপি করা হয়েছে!' : 'WhatsApp Report copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const displayedStudents = activeTab === 'ALL' 
    ? students 
    : students.filter(s => s.group === activeTab);

  const voiceCount = students.filter(s => s.group === 'VOICE').length;
  const lotusCount = students.filter(s => s.group === 'LOTUS').length;

  const recordedDates = useMemo(() => {
    const dates = Object.keys(dailyRecords);
    if (!dates.includes(dateIso)) dates.push(dateIso);
    return dates.sort().reverse();
  }, [dailyRecords, dateIso]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 shadow-xs transition-all w-fit cursor-pointer"
          >
            <ArrowLeft size={15} className="text-amber-500" />
            <span>{isBn ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-400/30 transition-all cursor-pointer shadow-xs"
            >
              <History size={14} className="text-amber-400" />
              <span>{isBn ? 'অডিট হিস্ট্রি ও লগ' : 'Audit History Log'}</span>
            </button>

            <button
              onClick={() => setIsMonthlyVerdictModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
            >
              <Award size={14} />
              <span>{isBn ? 'মাসিক মূল্যায়ন ও ভার্ডিক্ট' : 'Monthly Verdict & Report'}</span>
            </button>

            <button
              onClick={handleResetToDefault}
              className="text-[10px] text-slate-400 hover:text-slate-600 underline font-bold px-1 cursor-pointer"
            >
              Reset 12 Devotees
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 text-white shadow-xl border border-white/15">
          <div className="relative z-10 space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono text-[10.5px] font-extrabold uppercase tracking-wider border border-white/15">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Advaita VOICE • Complete Ashram Sadhana & Discipline</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {isBn ? 'ভয়েস ও লোটাস গ্রুপ অডিট ও রিপোর্ট' : 'VOICE & Lotus Group Daily Discipline Audit'}
                </h1>
                <p className="text-xs sm:text-sm text-amber-200/90 font-serif italic">
                  {isBn 
                    ? 'শয়ন, জাগরণ, মর্নিং প্রোগ্রাম, মঙ্গল আরতি ও ক্লাস উপস্থিতি সার্বিক মনিটর'
                    : 'Bedtime, Wake-up, MP, Mangalarati & Morning Class Abidance Monitor'}
                </p>
              </div>

              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
                <button 
                  onClick={() => changeDate(-1)} 
                  className="p-1.5 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer"
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
                  className="p-1.5 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer"
                  title="Next Day"
                >
                  <ChevronRight size={18} />
                </button>
                <button 
                  onClick={() => setSelectedDate(new Date())} 
                  className="ml-1 px-2.5 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer"
                >
                  Today
                </button>
              </div>
            </div>

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
                  • <strong>Bed:</strong> &le; 10:00 PM &nbsp;|&nbsp; <strong>Wake:</strong> 4:00 AM &nbsp;|&nbsp; <strong>MP:</strong> &le; 4:30 AM &nbsp;|&nbsp; <strong>Mangalarati & Class</strong><br/>
                  • <em>Live Strikes:</em> 3 strikes within month triggers automatic demotion to Lotus Group.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-300 font-mono uppercase">
                    🪷 Lotus Group (Security Manager)
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-400/20 text-indigo-200 px-2 py-0.5 rounded-full">
                    {lotusCount} Devotees
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                  • <strong>Bed:</strong> &le; 11:00 PM &nbsp;|&nbsp; <strong>MP:</strong> &le; 5:00 AM &nbsp;|&nbsp; <strong>Mangalarati & Class</strong><br/>
                  • <em>Promotion:</em> &ge; 90% success rate with &le; 1 strike qualifies for promotion to VOICE.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('VOICE')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'VOICE'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>🌟 VOICE Group</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/15">
                {voiceCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('LOTUS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'LOTUS'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>🪷 Lotus Group</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">
                {lotusCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ALL')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>All Devotees ({students.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {activeTab === 'VOICE' && (
              <>
                <button
                  onClick={() => handleMarkAllOnTime('VOICE')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
                  title="Mark all VOICE students as on time today"
                >
                  <Check size={14} className="text-emerald-600" />
                  <span>Mark All On-Time</span>
                </button>

                <button
                  onClick={() => {
                    const r = generateVoiceReport();
                    shareToWhatsAppOrSystem({ text: r, successMessage: 'Sharing VOICE Report...' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-xs"
                >
                  <Send size={13} />
                  <span>VOICE WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('selection');
                    copyToClipboard(generateVoiceReport(), 'VOICE');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
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
                  onClick={() => handleMarkAllOnTime('LOTUS')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
                  title="Mark all Lotus students as on time today"
                >
                  <Check size={14} className="text-emerald-600" />
                  <span>Mark All On-Time</span>
                </button>

                <button
                  onClick={() => {
                    const r = generateLotusReport();
                    shareToWhatsAppOrSystem({ text: r, successMessage: 'Sharing Lotus Report...' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all cursor-pointer shadow-xs"
                >
                  <Send size={13} />
                  <span>Lotus WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('selection');
                    copyToClipboard(generateLotusReport(), 'LOTUS');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
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

        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-[24px] border border-indigo-500/30 shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-amber-400">📊</span>
              <h2 className="text-xs sm:text-sm font-black tracking-wide uppercase text-white">
                Incharge Daily Reports & WhatsApp Dispatch
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                    <Sun size={14} className="text-amber-400" />
                    Morning Program Incharge Report
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-200 font-mono px-2 py-0.5 rounded-full font-bold">
                    All {students.length} Students
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 font-normal">
                  Covers morning wake-up, MP punctuality (with late minutes), Mangalarati & Morning Class attendance.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    const r = generateMorningProgramCombinedReport();
                    shareToWhatsAppOrSystem({ text: r, successMessage: 'Sharing Morning Report...' });
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Send size={13} />
                  <span>Send WhatsApp</span>
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('selection');
                    copyToClipboard(generateMorningProgramCombinedReport(), 'MP');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedMp ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedMp ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-1.5">
                    <Moon size={14} className="text-indigo-400" />
                    Security Manager Night Report
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-200 font-mono px-2 py-0.5 rounded-full font-bold">
                    All {students.length} Students
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 font-normal">
                  Covers bedtime curfew compliance (10 PM / 11 PM), late minutes, lights-off security & night leave.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    const r = generateSecurityManagerCombinedReport();
                    shareToWhatsAppOrSystem({ text: r, successMessage: 'Sharing Night Report...' });
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Send size={13} />
                  <span>Send WhatsApp</span>
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('selection');
                    copyToClipboard(generateSecurityManagerCombinedReport(), 'NIGHT');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedNight ? <Check size={13} className="text-indigo-400" /> : <Copy size={13} />}
                  <span>{copiedNight ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

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
              const hasFailure = !isAbsent && (
                !entry.sleptOnTime || 
                !entry.wokeUpOnTime || 
                !entry.morningProgramOnTime || 
                !entry.mangalaratiAttended || 
                !entry.morningClassAttended
              );

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
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-3 min-w-[240px]">
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
                            <span className="text-[10px] font-black text-rose-600 animate-pulse bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
                              ⚠️ Degraded to Lotus
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isAbsent ? (
                      <div className="flex-1 max-w-2xl p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center gap-2 animate-fade-in">
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 flex-1 max-w-3xl">
                        
                        <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1.5 transition-all ${
                          entry.sleptOnTime 
                            ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60' 
                            : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900'
                        }`}>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <Moon size={12} className="text-indigo-400" />
                              {isVoice ? '<=10 PM' : '<=11 PM'}
                            </span>
                            <button
                              onClick={() => updateEntry(student.id, { sleptOnTime: !entry.sleptOnTime })}
                              className={`px-2 py-0.5 rounded-md text-[10.5px] font-black cursor-pointer transition-all ${
                                entry.sleptOnTime ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {entry.sleptOnTime ? 'Yes' : 'No'}
                            </button>
                          </div>
                          {!entry.sleptOnTime && (
                            <select
                              value={entry.bedLateMinutes || 15}
                              onChange={(e) => updateEntry(student.id, { bedLateMinutes: parseInt(e.target.value) || 0 })}
                              className="text-[10px] bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded px-1 py-0.5 font-bold text-rose-700 dark:text-rose-300"
                            >
                              {LATE_MINUTE_OPTIONS.map(m => (
                                <option key={m} value={m}>Late {m}m</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1.5 transition-all ${
                          entry.wokeUpOnTime 
                            ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60' 
                            : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900'
                        }`}>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <Sun size={12} className="text-amber-400" />
                              {isVoice ? '4:00 AM' : 'Wake'}
                            </span>
                            <button
                              onClick={() => updateEntry(student.id, { wokeUpOnTime: !entry.wokeUpOnTime })}
                              className={`px-2 py-0.5 rounded-md text-[10.5px] font-black cursor-pointer transition-all ${
                                entry.wokeUpOnTime ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {entry.wokeUpOnTime ? 'Yes' : 'No'}
                            </button>
                          </div>
                        </div>

                        <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1.5 transition-all ${
                          entry.morningProgramOnTime 
                            ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60' 
                            : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900'
                        }`}>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <Clock size={12} className="text-rose-400" />
                              {isVoice ? '<=4:30' : '<=5:00'}
                            </span>
                            <button
                              onClick={() => updateEntry(student.id, { morningProgramOnTime: !entry.morningProgramOnTime })}
                              className={`px-2 py-0.5 rounded-md text-[10.5px] font-black cursor-pointer transition-all ${
                                entry.morningProgramOnTime ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {entry.morningProgramOnTime ? 'Yes' : 'No'}
                            </button>
                          </div>
                          {!entry.morningProgramOnTime && (
                            <select
                              value={entry.mpLateMinutes || 15}
                              onChange={(e) => updateEntry(student.id, { mpLateMinutes: parseInt(e.target.value) || 0 })}
                              className="text-[10px] bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded px-1 py-0.5 font-bold text-rose-700 dark:text-rose-300"
                            >
                              {LATE_MINUTE_OPTIONS.map(m => (
                                <option key={m} value={m}>Late {m}m</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1.5 transition-all ${
                          entry.mangalaratiAttended 
                            ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60' 
                            : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900'
                        }`}>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <Flame size={12} className="text-amber-500" />
                              Mangal Arati
                            </span>
                            <button
                              onClick={() => updateEntry(student.id, { mangalaratiAttended: !entry.mangalaratiAttended })}
                              className={`px-2 py-0.5 rounded-md text-[10.5px] font-black cursor-pointer transition-all ${
                                entry.mangalaratiAttended ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {entry.mangalaratiAttended ? 'Yes' : 'No'}
                            </button>
                          </div>
                          {!entry.mangalaratiAttended && (
                            <select
                              value={entry.mangalaratiReason || ''}
                              onChange={(e) => updateEntry(student.id, { mangalaratiReason: e.target.value })}
                              className="text-[10px] bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded px-1 py-0.5 font-medium text-rose-700 dark:text-rose-300"
                            >
                              <option value="">-- Reason --</option>
                              {MANGALARATI_REASONS.map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div className={`p-2 rounded-xl border flex flex-col justify-between gap-1.5 transition-all ${
                          entry.morningClassAttended 
                            ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60' 
                            : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900'
                        }`}>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <BookOpen size={12} className="text-emerald-500" />
                              Class (~7 AM)
                            </span>
                            <button
                              onClick={() => updateEntry(student.id, { morningClassAttended: !entry.morningClassAttended })}
                              className={`px-2 py-0.5 rounded-md text-[10.5px] font-black cursor-pointer transition-all ${
                                entry.morningClassAttended ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {entry.morningClassAttended ? 'Yes' : 'No'}
                            </button>
                          </div>
                          {!entry.morningClassAttended && (
                            <select
                              value={entry.morningClassReason || ''}
                              onChange={(e) => updateEntry(student.id, { morningClassReason: e.target.value })}
                              className="text-[10px] bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded px-1 py-0.5 font-medium text-rose-700 dark:text-rose-300"
                            >
                              <option value="">-- Reason --</option>
                              {MORNING_CLASS_REASONS.map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          )}
                        </div>

                      </div>
                    )}

                    <div className="flex items-center gap-1.5 justify-end shrink-0">
                      <button
                        onClick={() => setEditingStudent({ ...student })}
                        className="p-2 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                        title="Edit Devotee Details"
                      >
                        <Edit size={14} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => handleSwitchGroup(student.id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                        title={`Move to ${isVoice ? 'Lotus Group' : 'VOICE Group'}`}
                      >
                        <ArrowRightLeft size={14} />
                        <span className="hidden sm:inline">{isVoice ? 'To Lotus' : 'To VOICE'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteStudent(student.id, student.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Delete Devotee"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </div>

                  {!isAbsent && hasFailure && (
                    <div className="mt-3 pt-3 border-t border-rose-200/60 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center gap-2 animate-fade-in">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 shrink-0">
                        <AlertCircle size={14} />
                        <span>Exception Notes / Emergency:</span>
                      </div>

                      <select
                        value={entry.reason || ''}
                        onChange={(e) => updateEntry(student.id, { reason: e.target.value })}
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2 font-medium focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="">-- Select Emergency / Exception Reason --</option>
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

      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <History className="text-amber-500" size={20} />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isBn ? 'দৈনিক অডিট হিস্ট্রি ও ভক্তদের টাইমলাইন' : 'Audit History Log & Devotee Timeline'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setIsHistoryModalOpen(false);
                  setHistorySelectedStudentId(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setHistorySelectedStudentId(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer ${
                  historySelectedStudentId === null 
                    ? 'bg-amber-500 text-slate-950 font-black' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                📅 All Dates Log
              </button>
              {students.map(s => (
                <button
                  key={s.id}
                  onClick={() => setHistorySelectedStudentId(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer ${
                    historySelectedStudentId === s.id 
                      ? 'bg-indigo-600 text-white font-black' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {historySelectedStudentId ? (
              <div className="space-y-3">
                {(() => {
                  const targetStudent = students.find(s => s.id === historySelectedStudentId);
                  if (!targetStudent) return null;

                  return (
                    <div>
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                        <div>
                          <h4 className="font-black text-sm text-indigo-950 dark:text-indigo-200">
                            {targetStudent.name} • {targetStudent.group} Group Timeline
                          </h4>
                          <p className="text-xs text-slate-500">
                            Current Strikes: {targetStudent.monthlyStrikes}/3
                          </p>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500 text-white">
                          {targetStudent.status}
                        </span>
                      </div>

                      <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                        {recordedDates.map(date => {
                          const entry = getEntry(targetStudent.id, date);
                          return (
                            <div key={date} className="p-3 flex items-center justify-between gap-2 text-xs">
                              <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
                                {date}
                              </span>
                              {entry.isAbsent ? (
                                <span className="text-rose-600 font-bold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                                  🔴 Absent: {entry.absenceReason || 'Leave'}
                                </span>
                              ) : (
                                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                                  <span className={entry.sleptOnTime ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                                    Bed: {entry.sleptOnTime ? 'On-Time' : `Late ${entry.bedLateMinutes || 15}m`}
                                  </span>
                                  <span className={entry.morningProgramOnTime ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                                    MP: {entry.morningProgramOnTime ? 'On-Time' : `Late ${entry.mpLateMinutes || 15}m`}
                                  </span>
                                  <span className={entry.mangalaratiAttended ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                                    Mangalarati: {entry.mangalaratiAttended ? 'Attended' : 'Missed'}
                                  </span>
                                  <span className={entry.morningClassAttended ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                                    Class: {entry.morningClassAttended ? 'Attended' : 'Missed'}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {recordedDates.map(date => {
                    const dayEntries = dailyRecords[date] || {};
                    const recordedCount = Object.keys(dayEntries).length;
                    const isCurrent = date === dateIso;

                    return (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(new Date(date));
                          setIsHistoryModalOpen(false);
                          toast.success(`Loaded discipline records for ${date}`);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-200'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs">
                            {date}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                              Active Day
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {recordedCount} custom entries recorded
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isMonthlyVerdictModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Award className="text-amber-500 shrink-0" size={24} />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {isBn ? 'মাসিক সাধনা ও শৃঙ্খলা মূল্যায়ন প্রতিবেদন (ভার্ডিক্ট)' : 'Monthly Sadhana & Discipline Verdict Report'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculates sadhana success rate (%), strikes, and final counselor verdict.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="month"
                  value={selectedVerdictMonth}
                  onChange={e => setSelectedVerdictMonth(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 cursor-pointer"
                />

                <button
                  onClick={() => {
                    const r = generateMonthlyVerdictReport();
                    shareToWhatsAppOrSystem({ text: r, successMessage: 'Sharing Monthly Report...' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer shadow-xs"
                >
                  <Send size={13} />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('selection');
                    copyToClipboard(generateMonthlyVerdictReport(), 'MONTHLY');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedMonthly ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedMonthly ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => exportTableToPdf({
                    elementId: 'monthly-discipline-verdict-table',
                    filename: `Advaita_VOICE_Discipline_Verdict_${selectedVerdictMonth}.pdf`,
                    title: `Advaita VOICE — Monthly Sadhana & Discipline Verdict (${selectedVerdictMonth})`,
                    subtitle: 'University of Chittagong'
                  })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all cursor-pointer shadow-xs"
                >
                  <Download size={13} />
                  <span>PDF</span>
                </button>

                <button 
                  onClick={() => setIsMonthlyVerdictModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table id="monthly-discipline-verdict-table" className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-black uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Devotee</th>
                    <th className="p-3">Group</th>
                    <th className="p-3">Days Evaluated</th>
                    <th className="p-3">Bed %</th>
                    <th className="p-3">MP %</th>
                    <th className="p-3">Mangalarati %</th>
                    <th className="p-3">Class %</th>
                    <th className="p-3">Success Rate</th>
                    <th className="p-3">Strikes</th>
                    <th className="p-3">Final Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium">
                  {monthlyStats.map((st, i) => {
                    const isSuccess = st.verdictType === 'VOICE_SUCCESS' || st.verdictType === 'LOTUS_SUCCESS';
                    const isWarning = st.verdictType === 'VOICE_WARNING';

                    return (
                      <tr key={st.student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-slate-400">{i + 1}</td>
                        <td className="p-3 font-black text-slate-900 dark:text-white">{st.student.name}</td>
                        <td className="p-3 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            st.student.group === 'VOICE' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {st.student.group}
                          </span>
                        </td>
                        <td className="p-3">{st.presentDays}/{st.totalDaysEvaluated} days</td>
                        <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{st.bedSuccessRate}%</td>
                        <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{st.mpSuccessRate}%</td>
                        <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{st.mangalaratiRate}%</td>
                        <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{st.classRate}%</td>
                        <td className="p-3 font-mono font-black text-sm">
                          <span className={st.overallSuccessRate >= 90 ? 'text-emerald-600' : st.overallSuccessRate >= 75 ? 'text-amber-600' : 'text-rose-600'}>
                            {st.overallSuccessRate}%
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold">
                          <span className={st.totalStrikes >= 3 ? 'text-rose-600 font-black' : st.totalStrikes > 0 ? 'text-amber-600' : 'text-slate-400'}>
                            {st.totalStrikes}/3
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-black inline-block whitespace-nowrap ${
                            isSuccess
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                              : isWarning
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300'
                          }`}>
                            {isBn ? st.verdictLabelBn : st.verdictLabelEn}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Edit Devotee: {editingStudent.name}
              </h3>
              <button 
                onClick={() => setEditingStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
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
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
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
