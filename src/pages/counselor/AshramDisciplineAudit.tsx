import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, Calendar, Check, Copy, 
  Sparkles, ChevronLeft, ChevronRight, 
  UserPlus, Trash2, ArrowRightLeft,
  Moon, Sun, Clock, AlertCircle, Edit, Save, X, Send,
  Flame, BookOpen, History, Award,
  Download, Shield, Eye, Lock, ExternalLink, Key, UserCheck
} from 'lucide-react';
import { 
  type GroupType, 
  type DisciplineAuditorRole,
  type StudentDisciplineRecord, 
  type DailyDisciplineEntry, 
  DISCIPLINE_AUDITOR_ROLES,
  EMERGENCY_REASONS, 
  ABSENCE_REASONS,
  MANGALARATI_REASONS,
  MORNING_CLASS_REASONS,
  LATE_MINUTE_OPTIONS,
  INITIAL_DISCIPLINE_STUDENTS,
  INITIAL_DAILY_DISCIPLINE_RECORDS,
  createDefaultDailyRecordsForDate
} from '../../data/groupDisciplineData';
import {
  type DisciplineAuditorAssignment,
  getAuditorAssignments,
  getCachedAuditorAssignments,
  getAuditorRoleForEmail,
  isMasterAdmin
} from '../../services/disciplineAuditorService';
import { shareToWhatsAppOrSystem } from '../../utils/shareUtils';
import { exportTableToPdf } from '../../lib/exportTablePdf';
import { triggerHaptic } from '../../utils/haptics';
import toast from 'react-hot-toast';

const STORAGE_STUDENTS_KEY = 'advaita_discipline_students_v6';
const STORAGE_DAILY_KEY = 'advaita_discipline_daily_v6';
const STORAGE_AUDITOR_ROLE_KEY = 'advaita_discipline_auditor_role_v1';

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
  const { user, role: authRole } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(2026, 8, 7, 12, 0, 0));
  const [activeTab, setActiveTab] = useState<GroupType | 'ALL'>('VOICE');

  const currentUserEmail = user?.email?.toLowerCase().trim();

  // Load and synchronize auditor assignments from Supabase & LocalStorage
  const [assignments, setAssignments] = useState<DisciplineAuditorAssignment[]>(() => getCachedAuditorAssignments());

  useEffect(() => {
    getAuditorAssignments().then(data => {
      if (data && data.length > 0) {
        setAssignments(data);
      }
    });
  }, []);

  const isMaster = isMasterAdmin(currentUserEmail);
  const assignedRoleForUser = getAuditorRoleForEmail(currentUserEmail, assignments);
  const isUserAdmin = isMaster || authRole === 'ADMIN' || assignedRoleForUser === 'ADMIN';

  // Role-Based Auditor Identity State (Admins can switch active preview role)
  const [activeAuditorRole, setActiveAuditorRole] = useState<DisciplineAuditorRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUDITOR_ROLE_KEY);
      return (saved as DisciplineAuditorRole) || 'ADMIN';
    } catch {
      return 'ADMIN';
    }
  });

  // Effective auditor role — strictly enforced:
  // 1. Not logged in -> pure VIEWER
  // 2. Admin / Master Admin -> activeAuditorRole (can preview or stay ADMIN)
  // 3. Assigned Incharge (Morning / Security / Manager) -> strictly their assigned role
  // 4. Logged-in user with unassigned Gmail -> pure VIEWER
  const effectiveAuditorRole: DisciplineAuditorRole = useMemo(() => {
    if (!user) return 'VIEWER';
    if (isUserAdmin) return activeAuditorRole;
    if (assignedRoleForUser && assignedRoleForUser !== 'VIEWER') return assignedRoleForUser;
    return 'VIEWER';
  }, [user, isUserAdmin, activeAuditorRole, assignedRoleForUser]);

  const hasAuditAuthority = effectiveAuditorRole !== 'VIEWER';
  const isPrivileged = hasAuditAuthority;

  // Track active custom minute inputs for Bedtime and MP
  const [customBedActive, setCustomBedActive] = useState<Record<string, boolean>>({});
  const [customMpActive, setCustomMpActive] = useState<Record<string, boolean>>({});

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
      const parsed = saved ? JSON.parse(saved) : {};
      return { ...INITIAL_DAILY_DISCIPLINE_RECORDS, ...parsed };
    } catch {
      return INITIAL_DAILY_DISCIPLINE_RECORDS;
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

  const [previewReport, setPreviewReport] = useState<{ title: string; content: string } | null>(null);

  // Strike Warning & Management Modal state - prevents accidental 1-click edits
  const [strikeModalStudentId, setStrikeModalStudentId] = useState<string | null>(null);
  const [pendingStrikeCount, setPendingStrikeCount] = useState<number>(0);
  const [strikeWarningAck, setStrikeWarningAck] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_DAILY_KEY, JSON.stringify(dailyRecords));
  }, [dailyRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_AUDITOR_ROLE_KEY, activeAuditorRole);
  }, [activeAuditorRole]);

  const dateIso = selectedDate.toISOString().split('T')[0];
  const isBn = language === 'bn';

  // Permission Evaluation — uses effectiveAuditorRole so non-privileged users are always VIEWER
  const canEditBedtime = effectiveAuditorRole === 'ADMIN' || effectiveAuditorRole === 'SECURITY_MANAGER' || effectiveAuditorRole === 'INTERNAL_MANAGER';
  const canEditMorning = effectiveAuditorRole === 'ADMIN' || effectiveAuditorRole === 'MORNING_INCHARGE' || effectiveAuditorRole === 'INTERNAL_MANAGER';
  const canEditAbsence = effectiveAuditorRole === 'ADMIN' || effectiveAuditorRole === 'SECURITY_MANAGER' || effectiveAuditorRole === 'INTERNAL_MANAGER';
  const canEditStrikes = effectiveAuditorRole === 'ADMIN' || effectiveAuditorRole === 'MORNING_INCHARGE';
  const canManageDevotees = effectiveAuditorRole === 'ADMIN';

  const checkPermission = (actionType: 'bedtime' | 'morning' | 'absence' | 'strikes' | 'manage'): boolean => {
    if (effectiveAuditorRole === 'ADMIN') return true;
    if (actionType === 'bedtime' && canEditBedtime) return true;
    if (actionType === 'morning' && canEditMorning) return true;
    if (actionType === 'absence' && canEditAbsence) return true;
    if (actionType === 'strikes' && canEditStrikes) return true;
    if (actionType === 'manage' && canManageDevotees) return true;

    if (!user) {
      toast.error(
        isBn 
          ? '🔒 সম্পাদনা করতে অনুগ্রহ করে আপনার দায়িত্বপ্রাপ্ত জিমেইল দিয়ে লগইন করুন।' 
          : '🔒 Please log in with your assigned Gmail to edit discipline records.'
      );
      return false;
    }

    if (!isPrivileged) {
      toast.error(
        isBn 
          ? `🔒 আপনার জিমেইলে (${currentUserEmail}) কোনো ইনচার্জ দায়িত্ব নির্ধারিত নেই। পরিবর্তনের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।` 
          : `🔒 Your Gmail (${currentUserEmail}) is not assigned an incharge role. Please contact Admin.`
      );
      return false;
    }

    const curProfile = DISCIPLINE_AUDITOR_ROLES.find(r => r.key === effectiveAuditorRole);
    const roleTitle = isBn ? curProfile?.titleBn : curProfile?.titleEn;

    const morningIncharge = assignments.find(a => a.role === 'MORNING_INCHARGE' && a.isActive);
    const securityIncharge = assignments.find(a => a.role === 'SECURITY_MANAGER' && a.isActive);
    const morningLabel = morningIncharge ? morningIncharge.name : (isBn ? 'মর্নিং ইনচার্জ' : 'Morning Incharge');
    const securityLabel = securityIncharge ? securityIncharge.name : (isBn ? 'সিকিউরিটি ম্যানেজার' : 'Security Manager');

    if (actionType === 'bedtime') {
      toast.error(
        isBn 
          ? `🔒 শয়ন কারফিউ ও বিলম্ব মিনিট সম্পাদনার অধিকার শুধুমাত্র সিকিউরিটি ম্যানেজার (${securityLabel}) এবং অ্যাডমিনের রয়েছে। (বর্তমান: ${roleTitle})`
          : `🔒 Bedtime editing is restricted to Security Manager (${securityLabel}) & Admin. (Current: ${roleTitle})`
      );
    } else if (actionType === 'morning') {
      toast.error(
        isBn
          ? `🔒 জাগরণ, মর্নিং প্রোগ্রাম ও মঙ্গল আরতি সম্পাদনার অধিকার শুধুমাত্র মর্নিং ইনচার্জ (${morningLabel}) এবং অ্যাডমিনের রয়েছে। (বর্তমান: ${roleTitle})`
          : `🔒 Morning sadhana editing is restricted to Morning Incharge (${morningLabel}) & Admin. (Current: ${roleTitle})`
      );
    } else if (actionType === 'absence') {
      toast.error(
        isBn
          ? `🔒 অনুপস্থিতি ও ছুটির কারণ ব্যবস্থাপনার অধিকার সিকিউরিটি ম্যানেজার (${securityLabel}) ও অ্যাডমিনের রয়েছে।`
          : `🔒 Leave/absence management is restricted to Security Manager (${securityLabel}) & Admin.`
      );
    } else if (actionType === 'strikes') {
      toast.error(
        isBn
          ? `🔒 স্ট্রাইক সমন্বয় করার অধিকার শুধুমাত্র অ্যাডমিন ও মর্নিং প্রোগ্রাম ইনচার্জের (${morningLabel}) রয়েছে।`
          : `🔒 Only Admin and Morning Program Incharge (${morningLabel}) can adjust strikes.`
      );
    } else {
      toast.error(
        isBn
          ? `🔒 ভক্ত তালিকা পরিবর্তন শুধুমাত্র অ্যাডমিন অ্যাকাউন্টের জন্য সংরক্ষিত।`
          : `🔒 Devotee management is restricted to Admin.`
      );
    }
    return false;
  };

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

  const parseIsoDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
  };

  const formatReasonText = (reason?: string, bn = isBn) => {
    if (!reason) return bn ? 'ছুটি / অনুপস্থিত' : 'On Leave';
    if (bn) {
      const match = reason.match(/\((.*?)\)/);
      if (match && match[1]) return match[1].trim();
      return reason.replace('Out of town / Home Leave', 'গ্রামের বাড়ি / ছুটি');
    } else {
      const parts = reason.split('(');
      let text = parts[0].trim() || reason;
      if (text === 'Out of town / Home Leave') return 'Home Leave';
      if (text === 'Health / Hospital / Sickness') return 'Health / Sickness';
      if (text === 'University Exam / Academic') return 'Exam / Academic';
      return text;
    }
  };

  const getEntry = (studentId: string, customDateIso = dateIso): DailyDisciplineEntry => {
    const dayData = dailyRecords[customDateIso];
    if (dayData && dayData[studentId]) {
      return dayData[studentId];
    }
    const defaultDay = createDefaultDailyRecordsForDate(customDateIso);
    return defaultDay[studentId] || {
      studentId,
      dateStr: customDateIso,
      isAbsent: studentId === 'member_0',
      absenceReason: studentId === 'member_0' ? 'Out of town / Home Leave (গ্রামের বাড়ি / বাইরে অবস্থান)' : '',
      sleptOnTime: true,
      bedLateMinutes: 0,
      wokeUpOnTime: true,
      morningProgramOnTime: true,
      mpLateMinutes: 0,
      mangalaratiAttended: studentId !== 'member_0',
      mangalaratiReason: studentId === 'member_0' ? 'Leave / Absent' : '',
      morningClassAttended: studentId !== 'member_0',
      morningClassReason: studentId === 'member_0' ? 'Leave / Absent' : '',
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
    if (effectiveAuditorRole === 'VIEWER') {
      checkPermission('manage');
      return;
    }
    if (effectiveAuditorRole === 'SECURITY_MANAGER') {
      toast.error(
        isBn 
          ? '🔒 সিকিউরিটি ম্যানেজার হিসেবে আপনি শুধুমাত্র শয়নের সময় নিয়ন্ত্রণ করতে পারবেন।' 
          : '🔒 As Security Manager, you can only manage bedtime/night attendance.'
      );
      return;
    }

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

  const handleMarkAllStudentsOnTime = () => {
    if (effectiveAuditorRole === 'VIEWER') {
      checkPermission('manage');
      return;
    }
    if (effectiveAuditorRole === 'SECURITY_MANAGER') {
      toast.error(
        isBn 
          ? '🔒 সিকিউরিটি ম্যানেজার হিসেবে আপনি শুধুমাত্র শয়নের সময় নিয়ন্ত্রণ করতে পারবেন।' 
          : '🔒 As Security Manager, you can only manage bedtime/night attendance.'
      );
      return;
    }

    const newDayEntries: Record<string, DailyDisciplineEntry> = { ...(dailyRecords[dateIso] || {}) };

    students.forEach(s => {
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
        ? 'সকল ভক্তকে অন-টাইম মার্ক করা হয়েছে!' 
        : 'Marked all devotees as On-Time!'
    );
  };

  // Live Automatic Strike Evaluation based on must-follow rules
  const devoteeStrikesMap = useMemo(() => {
    const datesSet = new Set<string>();
    Object.keys(dailyRecords).filter(d => d.startsWith(selectedVerdictMonth)).forEach(d => datesSet.add(d));

    const [vYear, vMonth] = selectedVerdictMonth.split('-').map(Number);
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === vYear && (now.getMonth() + 1) === vMonth;
    const daysInMonthCount = new Date(vYear, vMonth, 0).getDate();
    const maxDay = isCurrentMonth ? now.getDate() : daysInMonthCount;

    for (let day = 1; day <= maxDay; day++) {
      const dStr = `${vYear}-${String(vMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      datesSet.add(dStr);
    }

    const monthDates = Array.from(datesSet).sort();

    const map: Record<string, { 
      autoStrikes: number; 
      strikes: number; 
      violations: { date: string; rules: string[] }[] 
    }> = {};

    students.forEach(student => {
      let violationDaysCount = 0;
      const violationList: { date: string; rules: string[] }[] = [];

      monthDates.forEach(d => {
        const entry = (dailyRecords[d] && dailyRecords[d][student.id]) || getEntry(student.id, d);
        if (!entry || entry.isAbsent) return;

        const dayRulesBroken: string[] = [];

        // 1. Must-Follow Rule 1: Timely Bedtime Curfew (<=10 PM / <=11 PM)
        if (!entry.sleptOnTime && !entry.isEmergency) {
          dayRulesBroken.push(isBn ? `দেরিতে শয়ন (${toBn(entry.bedLateMinutes || 15)} মি. বিলম্ব)` : `Late Bedtime (${entry.bedLateMinutes || 15}m late)`);
        }

        // 2. Must-Follow Rule 2: Timely Morning Program Attendance (<=4:30 AM / <=5:00 AM)
        if (!entry.morningProgramOnTime && !entry.isEmergency) {
          dayRulesBroken.push(isBn ? `মর্নিং প্রোগ্রামে বিলম্ব (${toBn(entry.mpLateMinutes || 15)} মি. বিলম্ব)` : `Late MP (${entry.mpLateMinutes || 15}m late)`);
        }

        // 3. Must-Follow Rule 3: Wake-up at 4:00 AM
        if (!entry.wokeUpOnTime && !entry.isEmergency) {
          dayRulesBroken.push(isBn ? 'দেরিতে জাগরণ (ভোর ৪:০০ নয়)' : 'Late Wake-up (missed 4:00 AM)');
        }

        // 4. Must-Follow Rule 4: Mangalarati Attendance
        const excusedMangal = [
          'Health / Sickness (অসুস্থতা / চিকিৎসা)',
          'Health Emergency / Sickness (অসুস্থতা / স্বাস্থ্য সমস্যা)',
          'Morning Temple Seva Duty (সকালের বিশেষ সেবা দায়িত্ব)',
          'Temple / VOICE Seva Duty (মন্দির বা ভয়েস বিশেষ সেবা)'
        ];
        if (!entry.mangalaratiAttended && !entry.isEmergency && (!entry.mangalaratiReason || !excusedMangal.includes(entry.mangalaratiReason))) {
          dayRulesBroken.push(isBn ? 'অননুমোদিত মঙ্গল আরতি অনুপস্থিতি' : 'Missed Mangalarati (unexcused)');
        }

        // 5. Must-Follow Rule 5: Morning Bhagavatam Class Attendance
        const excusedClass = [
          'University Class / Lab (বিশ্ববিদ্যালয়ের ক্লাস / ল্যাব পরীক্ষা)',
          'Academic Exam Prep (পরীক্ষার বিশেষ প্রস্তুতি)',
          'Health / Sickness (অসুস্থতা / বিশ্রাম)',
          'Health Emergency / Sickness (অসুস্থতা / স্বাস্থ্য সমস্যা)',
          'Morning Temple Seva Duty (সকালের বিশেষ সেবা দায়িত্ব)',
          'Temple / VOICE Seva Duty (মন্দির বা ভয়েস বিশেষ সেবা)'
        ];
        if (!entry.morningClassAttended && !entry.isEmergency && (!entry.morningClassReason || !excusedClass.includes(entry.morningClassReason))) {
          dayRulesBroken.push(isBn ? 'অননুমোদিত ক্লাস অনুপস্থিতি' : 'Missed Class (unexcused)');
        }

        if (dayRulesBroken.length > 0) {
          violationDaysCount++;
          violationList.push({ date: d, rules: dayRulesBroken });
        }
      });

      const autoStrikes = violationDaysCount;
      const manualDelta = student.manualStrikeDelta ?? 0;
      // Continuous strike count - no cap at 3
      const strikes = Math.max(0, autoStrikes + manualDelta);

      map[student.id] = {
        autoStrikes,
        strikes,
        violations: violationList
      };
    });

    return map;
  }, [dailyRecords, students, selectedVerdictMonth, isBn]);

  // Open Strike Warning & Management Modal (Restricted to Admin & Morning Incharge)
  const handleOpenStrikeModal = (studentId: string) => {
    if (!checkPermission('strikes')) return;
    const current = devoteeStrikesMap[studentId]?.strikes ?? (students.find(s => s.id === studentId)?.monthlyStrikes || 0);
    setStrikeModalStudentId(studentId);
    setPendingStrikeCount(current);
    setStrikeWarningAck(false);
  };

  // Confirm strike change inside modal - allows continuous counting (4, 5, 6+)
  const handleConfirmStrikeUpdate = () => {
    if (!strikeModalStudentId || !checkPermission('strikes')) return;

    const targetStudent = students.find(s => s.id === strikeModalStudentId);
    if (!targetStudent) return;

    const currentStrikes = devoteeStrikesMap[strikeModalStudentId]?.strikes ?? targetStudent.monthlyStrikes;
    const autoStrikes = devoteeStrikesMap[strikeModalStudentId]?.autoStrikes ?? 0;
    const newStrikes = Math.max(0, pendingStrikeCount); // Continuous counting without cap
    const manualStrikeDelta = newStrikes - autoStrikes;

    setStudents(prev => prev.map(s => {
      if (s.id !== strikeModalStudentId) return s;
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
              ? `⚠️ ${s.name} ${toBn(newStrikes)}টি স্ট্রাইক পূর্ণ করায় লোটাস গ্রুপে অবনমিত করা হয়েছে!`
              : `⚠️ ${s.name} reached ${newStrikes} strikes and was automatically degraded to Lotus Group!`,
            { duration: 6000 }
          );
        } else {
          status = newStrikes >= 5 ? 'DISMISSED' : 'DEMOTION_DUE';
          if (newStrikes >= 5) {
            toast.error(
              isBn
                ? `🚨 ${s.name} ${toBn(newStrikes)}টি স্ট্রাইক পেয়েছেন — আশ্রম বহিষ্কারের পর্যালোচনা পর্যায়!`
                : `🚨 ${s.name} reached ${newStrikes} strikes — ashram dismissal review level!`,
              { duration: 6000 }
            );
          }
        }
      }

      return { ...s, group, monthlyStrikes: newStrikes, manualStrikeDelta, status };
    }));

    toast.success(
      isBn
        ? `✅ ${targetStudent.name}-এর স্ট্রাইক সফলভাবে সমন্বয় করা হয়েছে: ${toBn(currentStrikes)} ➔ ${toBn(newStrikes)}`
        : `✅ Successfully updated strikes for ${targetStudent.name}: ${currentStrikes} ➔ ${newStrikes}`
    );

    setStrikeModalStudentId(null);
  };

  const handleSwitchGroup = (studentId: string) => {
    if (!checkPermission('manage')) return;

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
    if (!checkPermission('manage')) return;
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
    if (!checkPermission('manage')) return;
    if (!editingStudent || !editingStudent.name.trim()) return;

    setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
    setEditingStudent(null);
    toast.success(isBn ? 'ভক্তের তথ্য আপডেট হয়েছে' : 'Devotee details updated');
  };

  const handleDeleteStudent = (studentId: string, name: string) => {
    if (!checkPermission('manage')) return;
    if (!window.confirm(`Remove ${name} from discipline list?`)) return;
    setStudents(prev => prev.filter(s => s.id !== studentId));
    toast.success('Devotee removed');
  };

  const handleResetToDefault = () => {
    if (!checkPermission('manage')) return;
    if (!window.confirm('Reset devotee list and restore September 1–7 historical data?')) return;
    setStudents(INITIAL_DISCIPLINE_STUDENTS);
    setDailyRecords(INITIAL_DAILY_DISCIPLINE_RECORDS);
    localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(INITIAL_DISCIPLINE_STUDENTS));
    localStorage.setItem(STORAGE_DAILY_KEY, JSON.stringify(INITIAL_DAILY_DISCIPLINE_RECORDS));
    toast.success('Reset to 12 active devotees & restored September history!');
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
    const onLeave: string[] = [];

    voiceStudents.forEach(s => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        onLeave.push(`*${s.name}* — ${reason}`);
      } else {
        const wakeAndMpGood = entry.wokeUpOnTime && entry.morningProgramOnTime && entry.mangalaratiAttended && entry.morningClassAttended;
        const bedGood = entry.sleptOnTime || entry.isEmergency;
        const isAllGood = wakeAndMpGood && bedGood;

        if (isAllGood) {
          compliant.push(s.name);
        } else {
          const issues: string[] = [];
          if (!entry.wokeUpOnTime) issues.push(isBn ? 'দেরিতে জাগরণ (>৪:০০ AM)' : 'Late Wake (>4:00 AM)');
          if (!entry.morningProgramOnTime) {
            const minStr = entry.mpLateMinutes ? ` (${toBn(entry.mpLateMinutes)}m)` : '';
            issues.push(isBn ? `মর্নিং প্রোগ্রামে বিলম্ব (>৪:৩০ AM)${minStr}` : `Late to MP (>4:30 AM)${minStr}`);
          }
          if (!entry.sleptOnTime && !entry.isEmergency) {
            const minStr = entry.bedLateMinutes ? ` (${toBn(entry.bedLateMinutes)}m)` : '';
            issues.push(isBn ? `দেরিতে শয়ন (>১০:০০ PM)${minStr}` : `Late Bedtime (>10:00 PM)${minStr}`);
          }
          if (!entry.mangalaratiAttended) {
            const reason = formatReasonText(entry.mangalaratiReason, isBn);
            issues.push(isBn ? `মঙ্গল আরতি অনুপস্থিত (${reason})` : `Missed Mangalarati (${reason})`);
          }
          if (!entry.morningClassAttended) {
            const reason = formatReasonText(entry.morningClassReason, isBn);
            issues.push(isBn ? `ক্লাসে অনুপস্থিত (${reason})` : `Missed Class (${reason})`);
          }
          const sStrikes = devoteeStrikesMap[s.id]?.strikes ?? s.monthlyStrikes;
          let strikeStr = sStrikes > 0 ? ` [${isBn ? 'স্ট্রাইক ' + toBn(sStrikes) : 'Strike ' + sStrikes}]` : '';
          const reasonStr = entry.reason ? ` — _${isBn ? 'কারণ' : 'Reason'}:_ ${formatReasonText(entry.reason, isBn)}` : '';
          nonCompliant.push(`*${s.name}*${strikeStr} (${issues.join(', ')})${reasonStr}`);
        }
      }
    });

    let report = isBn 
      ? `🌟 *অদ্বৈত ভয়েস — মর্নিং প্রোগ্রাম ও শৃঙ্খলা প্রতিবেদন* 🌟\n` 
      : `🌟 *ADVAITA VOICE — MORNING PROGRAM & DISCIPLINE REPORT* 🌟\n`;
    report += `📅 *${isBn ? 'তারিখ' : 'Date'}:* ${dateFormatted}\n`;
    report += `📋 *${isBn ? 'গ্রুপ' : 'Group'}:* ${isBn ? 'ভয়েস গ্রুপ (শয়ন: ≤ ১০:০০ PM | জাগরণ: ৪:০০ AM | এমপি: ≤ ৪:৩০ AM)' : 'VOICE Group (Bed: ≤ 10:00 PM | Wake: 4:00 AM | MP: ≤ 4:30 AM)'}\n`;
    report += `───────────────────────────\n`;

    report += `✅ *${isBn ? 'সকল নিয়ম পালনকারী' : 'All Rules Followed'} (${isBn ? 'সময়মতো' : 'On Time'} - ${toBn(compliant.length)}/${toBn(voiceStudents.length)}):*\n`;
    if (compliant.length === 0) {
      report += `   _${isBn ? 'কেউ নেই' : 'None'}_\n`;
    } else {
      compliant.forEach((name, i) => {
        report += `   ${toBn(i + 1)}. ${name}\n`;
      });
    }

    if (nonCompliant.length > 0) {
      report += `\n⚠️ *${isBn ? 'নিয়ম লঙ্ঘন / ব্যতিক্রম' : 'Rule Breaches / Exceptions'} (${toBn(nonCompliant.length)}):*\n`;
      nonCompliant.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }

    if (onLeave.length > 0) {
      report += `\n🕊️ *${isBn ? 'ছুটি / অনুপস্থিত' : 'On Leave / Excused'} (${toBn(onLeave.length)}):*\n`;
      onLeave.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }

    report += `───────────────────────────\n`;
    report += `🙏 *${isBn ? 'রিপোর্ট প্রেরক' : 'Reported by'}:* ${isBn ? 'মর্নিং প্রোগ্রাম ইনচার্জ (ভয়েস গ্রুপ)' : 'Morning Program Incharge (VOICE Group)'}\n`;
    return report;
  };

  const generateLotusReport = () => {
    const lotusStudents = students.filter(s => s.group === 'LOTUS');
    const compliant: string[] = [];
    const nonCompliant: string[] = [];
    const onLeave: string[] = [];

    lotusStudents.forEach(s => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        onLeave.push(`*${s.name}* — ${reason}`);
      } else {
        const wakeAndMpGood = entry.wokeUpOnTime && entry.morningProgramOnTime && entry.mangalaratiAttended && entry.morningClassAttended;
        if (wakeAndMpGood) {
          compliant.push(s.name);
        } else {
          const issues: string[] = [];
          if (!entry.wokeUpOnTime) issues.push(isBn ? 'দেরিতে জাগরণ' : 'Wake Late');
          if (!entry.morningProgramOnTime) {
            const minStr = entry.mpLateMinutes ? ` (${toBn(entry.mpLateMinutes)}m)` : '';
            issues.push(isBn ? `এমপিতে বিলম্ব (>৫:০০ AM)${minStr}` : `Late to MP (>5:00 AM)${minStr}`);
          }
          if (!entry.mangalaratiAttended) {
            const reason = formatReasonText(entry.mangalaratiReason, isBn);
            issues.push(isBn ? `মঙ্গল আরতি অনুপস্থিত (${reason})` : `Missed Mangalarati (${reason})`);
          }
          if (!entry.morningClassAttended) {
            const reason = formatReasonText(entry.morningClassReason, isBn);
            issues.push(isBn ? `ক্লাসে অনুপস্থিত (${reason})` : `Missed Class (${reason})`);
          }
          const sStrikes = devoteeStrikesMap[s.id]?.strikes ?? s.monthlyStrikes;
          let strikeStr = sStrikes > 0 ? ` [${isBn ? 'স্ট্রাইক ' + toBn(sStrikes) : 'Strike ' + sStrikes}]` : '';
          const reasonStr = entry.reason ? ` — _${isBn ? 'কারণ' : 'Reason'}:_ ${formatReasonText(entry.reason, isBn)}` : '';
          nonCompliant.push(`*${s.name}*${strikeStr} (${issues.join(', ')})${reasonStr}`);
        }
      }
    });

    let report = isBn 
      ? `🪷 *অদ্বৈত ভয়েস — লোটাস গ্রুপ সাধনা ও শৃঙ্খলা প্রতিবেদন* 🪷\n` 
      : `🪷 *ADVAITA VOICE — LOTUS GROUP DISCIPLINE REPORT* 🪷\n`;
    report += `📅 *${isBn ? 'তারিখ' : 'Date'}:* ${dateFormatted}\n`;
    report += `📋 *${isBn ? 'গ্রুপ' : 'Group'}:* ${isBn ? 'লোটাস গ্রুপ (শয়ন: ≤ ১১:০০ PM | এমপি: ≤ ৫:০০ AM)' : 'Lotus Group (Bed: ≤ 11:00 PM | MP: ≤ 5:00 AM)'}\n`;
    report += `───────────────────────────\n`;

    report += `✅ *${isBn ? 'সকল নিয়ম পালনকারী' : 'All Rules Followed'} (${isBn ? 'সময়মতো' : 'On Time'} - ${toBn(compliant.length)}/${toBn(lotusStudents.length)}):*\n`;
    if (compliant.length === 0) {
      report += `   _${isBn ? 'কেউ নেই' : 'None'}_\n`;
    } else {
      compliant.forEach((name, i) => {
        report += `   ${toBn(i + 1)}. ${name}\n`;
      });
    }

    if (nonCompliant.length > 0) {
      report += `\n⚠️ *${isBn ? 'নিয়ম লঙ্ঘন / ব্যতিক্রম' : 'Rule Breaches / Exceptions'} (${toBn(nonCompliant.length)}):*\n`;
      nonCompliant.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }

    if (onLeave.length > 0) {
      report += `\n🕊️ *${isBn ? 'ছুটি / অনুপস্থিত' : 'On Leave / Excused'} (${toBn(onLeave.length)}):*\n`;
      onLeave.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }

    report += `───────────────────────────\n`;
    report += `🙏 *${isBn ? 'রিপোর্ট প্রেরক' : 'Reported by'}:* ${isBn ? 'কাউন্সেলর ডেস্ক (অদ্বৈত ভয়েস)' : 'Counselor Desk (Advaita VOICE)'}\n`;
    return report;
  };

  const generateMorningProgramCombinedReport = () => {
    const voiceStudents = students.filter(s => s.group === 'VOICE');
    const lotusStudents = students.filter(s => s.group === 'LOTUS');

    const voiceOnTime: string[] = [];
    const voiceLateOrMissed: string[] = [];
    const voiceAbsent: string[] = [];

    const lotusOnTime: string[] = [];
    const lotusLateOrMissed: string[] = [];
    const lotusAbsent: string[] = [];

    voiceStudents.forEach(s => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        voiceAbsent.push(`*${s.name}* — ${reason}`);
      } else {
        const isPerfect = entry.wokeUpOnTime && entry.morningProgramOnTime && entry.mangalaratiAttended && entry.morningClassAttended;
        if (isPerfect) {
          voiceOnTime.push(s.name);
        } else {
          const notes: string[] = [];
          if (!entry.wokeUpOnTime) notes.push(isBn ? 'দেরিতে জাগরণ' : 'Wake Late');
          if (!entry.morningProgramOnTime) {
            const minStr = entry.mpLateMinutes ? ` (${toBn(entry.mpLateMinutes)}m)` : '';
            notes.push(`${isBn ? 'এমপিতে বিলম্ব' : 'MP Late'}${minStr}`);
          }
          if (!entry.mangalaratiAttended) {
            const r = formatReasonText(entry.mangalaratiReason, isBn);
            notes.push(`${isBn ? 'মঙ্গল আরতি অনুপস্থিত' : 'Missed Mangalarati'} (${r})`);
          }
          if (!entry.morningClassAttended) {
            const r = formatReasonText(entry.morningClassReason, isBn);
            notes.push(`${isBn ? 'ক্লাস অনুপস্থিত' : 'Missed Class'} (${r})`);
          }
          const sStrikes = devoteeStrikesMap[s.id]?.strikes ?? s.monthlyStrikes;
          let strikeStr = sStrikes > 0 ? ` [${isBn ? 'স্ট্রাইক ' + toBn(sStrikes) : 'Strike ' + sStrikes}]` : '';
          voiceLateOrMissed.push(`*${s.name}*${strikeStr} — ${notes.join(', ')}`);
        }
      }
    });

    lotusStudents.forEach(s => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        lotusAbsent.push(`*${s.name}* — ${reason}`);
      } else {
        const isPerfect = entry.wokeUpOnTime && entry.morningProgramOnTime && entry.mangalaratiAttended && entry.morningClassAttended;
        if (isPerfect) {
          lotusOnTime.push(s.name);
        } else {
          const notes: string[] = [];
          if (!entry.wokeUpOnTime) notes.push(isBn ? 'দেরিতে জাগরণ' : 'Wake Late');
          if (!entry.morningProgramOnTime) {
            const minStr = entry.mpLateMinutes ? ` (${toBn(entry.mpLateMinutes)}m)` : '';
            notes.push(`${isBn ? 'এমপিতে বিলম্ব' : 'MP Late'}${minStr}`);
          }
          if (!entry.mangalaratiAttended) {
            const r = formatReasonText(entry.mangalaratiReason, isBn);
            notes.push(`${isBn ? 'মঙ্গল আরতি অনুপস্থিত' : 'Missed Mangalarati'} (${r})`);
          }
          if (!entry.morningClassAttended) {
            const r = formatReasonText(entry.morningClassReason, isBn);
            notes.push(`${isBn ? 'ক্লাস অনুপস্থিত' : 'Missed Class'} (${r})`);
          }
          const sStrikes = devoteeStrikesMap[s.id]?.strikes ?? s.monthlyStrikes;
          let strikeStr = sStrikes > 0 ? ` [${isBn ? 'স্ট্রাইক ' + toBn(sStrikes) : 'Strike ' + sStrikes}]` : '';
          lotusLateOrMissed.push(`*${s.name}*${strikeStr} — ${notes.join(', ')}`);
        }
      }
    });

    const totalPresent = (voiceOnTime.length + voiceLateOrMissed.length) + (lotusOnTime.length + lotusLateOrMissed.length);
    const totalOnTime = voiceOnTime.length + lotusOnTime.length;
    const totalAbsent = voiceAbsent.length + lotusAbsent.length;
    const totalStudents = students.length;

    let report = isBn
      ? `🌅 *অদ্বৈত ভয়েস — প্রাতঃকালীন সাধনা ও উপস্থিতি প্রতিবেদন* 🌅\n`
      : `🌅 *ADVAITA VOICE — MORNING PROGRAM REPORT* 🌅\n`;
    report += `📅 *${isBn ? 'তারিখ' : 'Date'}:* ${dateFormatted}\n`;
    report += `📊 *${isBn ? 'উপস্থিতি' : 'Attendance'}:* ${toBn(totalOnTime)}/${toBn(totalStudents)} ${isBn ? 'সময়মতো' : 'On-Time'}${totalAbsent > 0 ? ` • ${toBn(totalAbsent)} ${isBn ? 'ছুটি' : 'on Leave'}` : ''}\n`;
    report += `───────────────────────────\n`;

    report += `🌟 *${toBn(1)}. ${isBn ? 'ভয়েস গ্রুপ' : 'VOICE GROUP'}* _(${isBn ? 'টার্গেট: ≤ ৪:৩০ AM | ক্লাস: ৭:০০ AM' : 'MP: ≤ 4:30 AM | Class: 7:00 AM'})_\n\n`;
    report += `✅ *${isBn ? 'সময়মতো সম্পন্ন' : 'Completed On-Time'} (${toBn(voiceOnTime.length)}/${toBn(voiceStudents.length)}):*\n`;
    if (voiceOnTime.length === 0) {
      report += `   _${isBn ? 'কেউ নেই' : 'None'}_\n`;
    } else {
      voiceOnTime.forEach((name, i) => {
        report += `   ${toBn(i + 1)}. ${name}\n`;
      });
    }

    if (voiceLateOrMissed.length > 0) {
      report += `\n⚠️ *${isBn ? 'দেরি বা অপূর্ণ' : 'Late / Incomplete'} (${toBn(voiceLateOrMissed.length)}):*\n`;
      voiceLateOrMissed.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }

    if (voiceAbsent.length > 0) {
      report += `\n🕊️ *${isBn ? 'ছুটি / অনুপস্থিত' : 'On Leave / Absent'} (${toBn(voiceAbsent.length)}):*\n`;
      voiceAbsent.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }
    report += `\n───────────────────────────\n`;

    report += `🪷 *${toBn(2)}. ${isBn ? 'লোটাস গ্রুপ' : 'LOTUS GROUP'}* _(${isBn ? 'টার্গেট: ≤ ৫:০০ AM | ক্লাস: ৭:০০ AM' : 'MP: ≤ 5:00 AM | Class: 7:00 AM'})_\n\n`;
    report += `✅ *${isBn ? 'সময়মতো সম্পন্ন' : 'Completed On-Time'} (${toBn(lotusOnTime.length)}/${toBn(lotusStudents.length)}):*\n`;
    if (lotusOnTime.length === 0) {
      report += `   _${isBn ? 'কেউ নেই' : 'None'}_\n`;
    } else {
      lotusOnTime.forEach((name, i) => {
        report += `   ${toBn(i + 1)}. ${name}\n`;
      });
    }

    if (lotusLateOrMissed.length > 0) {
      report += `\n⚠️ *${isBn ? 'দেরি বা অপূর্ণ' : 'Late / Incomplete'} (${toBn(lotusLateOrMissed.length)}):*\n`;
      lotusLateOrMissed.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }

    if (lotusAbsent.length > 0) {
      report += `\n🕊️ *${isBn ? 'ছুটি / অনুপস্থিত' : 'On Leave / Absent'} (${toBn(lotusAbsent.length)}):*\n`;
      lotusAbsent.forEach((item, i) => {
        report += `   ${toBn(i + 1)}. ${item}\n`;
      });
    }
    report += `\n───────────────────────────\n`;

    report += `📊 *${isBn ? 'সারসংক্ষেপ' : 'Summary'}:* ${toBn(totalOnTime)} ${isBn ? 'অন-টাইম' : 'On-Time'} • ${toBn(totalPresent - totalOnTime)} ${isBn ? 'বিলম্ব/আংশিক' : 'Late/Partial'} • ${toBn(totalAbsent)} ${isBn ? 'ছুটি' : 'on Leave'}\n`;
    report += `🙏 *${isBn ? 'রিপোর্ট প্রেরক' : 'Reported by'}:* ${isBn ? 'মর্নিং প্রোগ্রাম ইনচার্জ (অদ্বৈত ভয়েস)' : 'Morning Program Incharge (Advaita VOICE)'}\n`;
    return report;
  };

  const generateSecurityManagerCombinedReport = () => {
    const voiceStudents = students.filter(s => s.group === 'VOICE');
    const lotusStudents = students.filter(s => s.group === 'LOTUS');

    const voiceDevoteesList: string[] = [];
    const lotusDevoteesList: string[] = [];

    let totalCompliant = 0;
    let totalNonCompliant = 0;
    let totalAbsent = 0;

    voiceStudents.forEach((s, i) => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        totalAbsent++;
        const reason = formatReasonText(entry.absenceReason, isBn);
        voiceDevoteesList.push(`   ${toBn(i + 1)}. *${s.name}* — ${isBn ? 'ছুটি / অনুপস্থিত' : 'On Leave'} (${reason})`);
      } else if (entry.sleptOnTime) {
        totalCompliant++;
        voiceDevoteesList.push(`   ${toBn(i + 1)}. *${s.name}* — ${isBn ? 'শয়নে উপস্থিত (বিছানায়)' : 'In bed'}`);
      } else {
        totalNonCompliant++;
        let note = '';
        if (entry.reason && entry.reason.includes('Exam')) {
          note = isBn ? ' (পরীক্ষা)' : ' (Exam)';
        } else if (entry.bedLateMinutes) {
          note = ` (${toBn(entry.bedLateMinutes)} ${isBn ? 'মিনিট বিলম্ব' : 'min late'})`;
        } else if (entry.reason) {
          note = ` (${formatReasonText(entry.reason, isBn)})`;
        }
        voiceDevoteesList.push(`   ${toBn(i + 1)}. *${s.name}* — ${isBn ? 'বিছানায় নেই' : 'Not in bed'}${note}`);
      }
    });

    lotusStudents.forEach((s, i) => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        totalAbsent++;
        const reason = formatReasonText(entry.absenceReason, isBn);
        lotusDevoteesList.push(`   ${toBn(i + 1)}. *${s.name}* — ${isBn ? 'ছুটি / অনুপস্থিত' : 'On Leave'} (${reason})`);
      } else if (entry.sleptOnTime) {
        totalCompliant++;
        lotusDevoteesList.push(`   ${toBn(i + 1)}. *${s.name}* — ${isBn ? 'শয়নে উপস্থিত (বিছানায়)' : 'In bed'}`);
      } else {
        totalNonCompliant++;
        let note = '';
        if (entry.reason && entry.reason.includes('Exam')) {
          note = isBn ? ' (পরীক্ষা)' : ' (Exam)';
        } else if (entry.bedLateMinutes) {
          note = ` (${toBn(entry.bedLateMinutes)} ${isBn ? 'মিনিট বিলম্ব' : 'min late'})`;
        } else if (entry.reason) {
          note = ` (${formatReasonText(entry.reason, isBn)})`;
        }
        lotusDevoteesList.push(`   ${toBn(i + 1)}. *${s.name}* — ${isBn ? 'বিছানায় নেই' : 'Not in bed'}${note}`);
      }
    });

    const totalStudents = students.length;

    let report = isBn
      ? `🌙 *অদ্বৈত ভয়েস — নৈশ শৃঙ্খলা ও নিরাপত্তা সমন্বিত প্রতিবেদন* 🌙\n`
      : `🌙 *ADVAITA VOICE — NIGHT DISCIPLINE & SECURITY REPORT* 🌙\n`;
    report += `📅 *${isBn ? 'তারিখ' : 'Date'}:* ${dateFormatted}\n`;
    report += `🔒 *${isBn ? 'কারফিউ ও শয়ন মানদণ্ড' : 'Curfew & Bedtime Compliance'}:* ${toBn(totalCompliant)}/${toBn(totalStudents)} ${isBn ? 'সময়মতো শয়ন' : 'Slept On Time'}${totalAbsent > 0 ? ` • ${toBn(totalAbsent)} ${isBn ? 'নৈশ ছুটি' : 'on Leave'}` : ''}\n`;
    report += `───────────────────────────\n`;

    report += `🌟 *${toBn(1)}. ${isBn ? 'ভয়েস ভক্তবৃন্দ (পর্যবেক্ষণ: ১০:১০ PM)' : 'VOICE Devotees (Observed at 10:10 PM)'}:*\n`;
    report += voiceDevoteesList.join('\n') + '\n\n';

    report += `🪷 *${toBn(2)}. ${isBn ? 'লোটাস ভক্তবৃন্দ (পর্যবেক্ষণ: ১১:০০ PM)' : 'Lotus Devotees (Observed at 11:00 PM)'}:*\n`;
    report += lotusDevoteesList.join('\n') + '\n';
    report += `───────────────────────────\n`;

    report += `📊 *${isBn ? 'সারসংক্ষেপ' : 'Summary'}:* ${toBn(totalCompliant)} ${isBn ? 'জন সময়মতো শয়ন' : 'Slept On-Time'} • ${toBn(totalNonCompliant)} ${isBn ? 'জন অনিয়ম/ব্যতিক্রম' : 'Late/Exception'} • ${toBn(totalAbsent)} ${isBn ? 'জন নৈশ ছুটি' : 'on Leave'}\n`;
    report += `🙏 *${isBn ? 'রিপোর্ট প্রেরক' : 'Reported by'}:* ${isBn ? 'সিকিউরিটি ম্যানেজার (অদ্বৈত ভয়েস)' : 'Security Manager (Advaita VOICE)'}\n`;
    return report;
  };

  const monthlyStats = useMemo<MonthlyDevoteeStats[]>(() => {
    const datesSet = new Set<string>();
    Object.keys(dailyRecords).filter(d => d.startsWith(selectedVerdictMonth)).forEach(d => datesSet.add(d));

    const [vYear, vMonth] = selectedVerdictMonth.split('-').map(Number);
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === vYear && (now.getMonth() + 1) === vMonth;
    const daysInMonthCount = new Date(vYear, vMonth, 0).getDate();
    const maxDay = isCurrentMonth ? now.getDate() : daysInMonthCount;

    for (let day = 1; day <= maxDay; day++) {
      const dStr = `${vYear}-${String(vMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      datesSet.add(dStr);
    }

    const monthDates = Array.from(datesSet).sort();

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

      const strikes = devoteeStrikesMap[student.id]?.strikes ?? student.monthlyStrikes;

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
  }, [dailyRecords, students, selectedVerdictMonth, dateIso, devoteeStrikesMap]);

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
    report += `🏛️ *${isBn ? 'আশ্রম' : 'Ashram'}:* Advaita VOICE (Chittagong University)\n`;
    report += `───────────────────────────\n`;

    report += `🌟 *${toBn(1)}. ${isBn ? 'ভয়েস গ্রুপ মূল্যায়ন' : 'VOICE GROUP EVALUATION'} (${toBn(voiceStats.length)} ${isBn ? 'জন' : 'Devotees'})*\n\n`;
    voiceStats.forEach((st, i) => {
      const strikeDisplay = isBn ? `${toBn(st.totalStrikes)}টি` : `${st.totalStrikes} strike${st.totalStrikes !== 1 ? 's' : ''}`;
      report += `${toBn(i + 1)}. *${st.student.name}*\n`;
      report += `   • ${isBn ? 'সাফল্য' : 'Success Rate'}: *${toBn(st.overallSuccessRate)}%* (${isBn ? 'উপস্থিত' : 'Present'}: ${toBn(st.presentDays)}/${toBn(st.totalDaysEvaluated)} ${isBn ? 'দিন' : 'days'})\n`;
      report += `   • ${isBn ? 'শয়ন' : 'Bed'}: ${toBn(st.bedSuccessRate)}% | ${isBn ? 'মর্নিং' : 'MP'}: ${toBn(st.mpSuccessRate)}% | ${isBn ? 'মঙ্গল আরতি' : 'Mangalarati'}: ${toBn(st.mangalaratiRate)}% | ${isBn ? 'ক্লাস' : 'Class'}: ${toBn(st.classRate)}%\n`;
      report += `   • ${isBn ? 'স্ট্রাইক' : 'Strikes'}: ${strikeDisplay}\n`;
      report += `   • ${isBn ? 'চূড়ান্ত সিদ্ধান্ত' : 'Final Verdict'}: *${isBn ? st.verdictLabelBn : st.verdictLabelEn}*\n\n`;
    });
    report += `───────────────────────────\n`;

    report += `🪷 *${toBn(2)}. ${isBn ? 'লোটাস গ্রুপ মূল্যায়ন' : 'LOTUS GROUP EVALUATION'} (${toBn(lotusStats.length)} ${isBn ? 'জন' : 'Devotees'})*\n\n`;
    lotusStats.forEach((st, i) => {
      const strikeDisplay = isBn ? `${toBn(st.totalStrikes)}টি` : `${st.totalStrikes} strike${st.totalStrikes !== 1 ? 's' : ''}`;
      report += `${toBn(i + 1)}. *${st.student.name}*\n`;
      report += `   • ${isBn ? 'সাফল্য' : 'Success Rate'}: *${toBn(st.overallSuccessRate)}%* (${isBn ? 'উপস্থিত' : 'Present'}: ${toBn(st.presentDays)}/${toBn(st.totalDaysEvaluated)} ${isBn ? 'দিন' : 'days'})\n`;
      report += `   • ${isBn ? 'শয়ন' : 'Bed'}: ${toBn(st.bedSuccessRate)}% | ${isBn ? 'মর্নিং' : 'MP'}: ${toBn(st.mpSuccessRate)}% | ${isBn ? 'মঙ্গল আরতি' : 'Mangalarati'}: ${toBn(st.mangalaratiRate)}% | ${isBn ? 'ক্লাস' : 'Class'}: ${toBn(st.classRate)}%\n`;
      report += `   • ${isBn ? 'স্ট্রাইক' : 'Strikes'}: ${strikeDisplay}\n`;
      report += `   • ${isBn ? 'চূড়ান্ত সিদ্ধান্ত' : 'Final Verdict'}: *${isBn ? st.verdictLabelBn : st.verdictLabelEn}*\n\n`;
    });
    report += `───────────────────────────\n`;

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
    const dates = new Set<string>();
    Object.keys(dailyRecords).forEach(d => dates.add(d));

    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth() + 1;
    const curDay = now.getDate();
    for (let day = 1; day <= curDay; day++) {
      const dStr = `${curYear}-${String(curMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dates.add(dStr);
    }
    if (!dates.has(dateIso)) dates.add(dateIso);
    return Array.from(dates).sort().reverse();
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

          <button
            onClick={handleResetToDefault}
            className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline font-bold px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Reset 12 Devotees
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 text-white shadow-xl border border-white/15">
          <div className="relative z-10 space-y-3">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono text-[10px] font-extrabold uppercase tracking-wider border border-white/15">
                  <Sparkles size={11} className="text-amber-400" />
                  <span>Advaita VOICE • Ashram Discipline</span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
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

            {/* Minimal Group Info: Titles and (Features in brackets) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
              <div className="flex-1 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/20 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="font-black text-amber-300">
                    🌟 {isBn ? 'ভয়েস গ্রুপ' : 'VOICE Group'}
                  </span>
                  <span className="text-[11px] text-amber-100/80 font-medium">
                    ({isBn ? '১০টা শয়ন, ৪টা জাগরণ, ৪:৩০ এমপি, মঙ্গলারতি ও ক্লাস' : 'Bed ≤ 10 PM, Wake 4 AM, MP ≤ 4:30 AM, Mangalarati & Class'})
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full shrink-0">
                  {voiceCount} {isBn ? 'জন' : ''}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="font-black text-indigo-300">
                    🪷 {isBn ? 'লোটাস গ্রুপ' : 'Lotus Group'}
                  </span>
                  <span className="text-[11px] text-indigo-100/80 font-medium">
                    ({isBn ? '১১টা শয়ন, ৫টা এমপি, মঙ্গলারতি ও ক্লাস' : 'Bed ≤ 11 PM, MP ≤ 5:00 AM, Mangalarati & Class'})
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-indigo-400/20 text-indigo-200 px-2 py-0.5 rounded-full shrink-0">
                  {lotusCount} {isBn ? 'জন' : ''}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Two Major Feature Action Cards: Side by Side Professional Boxes */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Card 1: Audit History & Log */}
          <button
            type="button"
            onClick={() => setIsHistoryModalOpen(true)}
            className="group relative overflow-hidden text-left p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-500/60 dark:hover:border-amber-500/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] flex flex-col justify-between gap-3 sm:gap-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <History size={22} className="sm:w-6 sm:h-6" />
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                {isBn ? 'লগ ও টাইমলাইন' : 'Audit Trail'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {isBn ? 'অডিট হিস্ট্রি ও লগ' : 'Audit History Log'}
                </h3>
                <ChevronRight size={15} className="text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium line-clamp-2">
                {isBn ? 'সকল ভক্তের অতীত সাধনা, উপস্থিতি ও অনিয়ম পর্যালোচনার পূর্ণ লগ।' : 'Complete timeline of past sadhana entries, absences & violation logs.'}
              </p>
            </div>
          </button>

          {/* Card 2: Monthly Verdict & Report */}
          <button
            type="button"
            onClick={() => setIsMonthlyVerdictModalOpen(true)}
            className="group relative overflow-hidden text-left p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-white dark:to-slate-900 border border-amber-500/40 dark:border-amber-500/35 hover:border-amber-500 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] flex flex-col justify-between gap-3 sm:gap-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 group-hover:scale-105 shadow-md transition-transform duration-200">
                <Award size={22} className="sm:w-6 sm:h-6" />
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30">
                {isBn ? 'মাসিক মূল্যায়ন' : 'Monthly'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {isBn ? 'মাসিক মূল্যায়ন ও ভার্ডিক্ট' : 'Monthly Verdict & Report'}
                </h3>
                <ChevronRight size={15} className="text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium line-clamp-2">
                {isBn ? 'সাফল্য হার, পদোন্নতি ও অবনমন মানদণ্ড এবং পূর্ণ মাসিক রিপোর্ট।' : 'Performance analytics, promotion/demotion criteria & WhatsApp report.'}
              </p>
            </div>
          </button>
        </div>

        {/* Role-Based Auditor Identity Switcher Banner */}
        <div className={`rounded-3xl p-4 sm:p-5 border shadow-md space-y-3 ${
          !isPrivileged
            ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-300 dark:border-slate-700'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}>

          {/* Not logged in banner */}
          {!user && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Lock size={18} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black">
                    {isBn ? '🔒 আপনি লগইন করেননি (শুধুমাত্র দেখার মোড)' : '🔒 Not Logged In (Read-Only Mode)'}
                  </p>
                  <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-300/80 mt-0.5 font-medium">
                    {isBn 
                      ? 'শয়ন কারফিউ, প্রভাতী সাধনা বা স্ট্রাইক সম্পাদনা করতে আপনার দায়িত্বপ্রাপ্ত জিমেইল দিয়ে লগইন করুন।' 
                      : 'To record bedtime, morning sadhana or strikes, please log in with your assigned incharge Gmail.'}
                  </p>
                </div>
              </div>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-sm transition shrink-0"
              >
                <Key size={14} />
                <span>{isBn ? 'জিমেইল দিয়ে লগইন' : 'Log In with Gmail'}</span>
              </Link>
            </div>
          )}

          {/* Logged in but unassigned banner */}
          {user && !isPrivileged && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                  <Eye size={18} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black flex items-center gap-2 flex-wrap">
                    <span>{isBn ? '🔒 সাধারণ দর্শক মোড' : '🔒 Viewer Mode'}</span>
                    <span className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
                      ({currentUserEmail})
                    </span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {isBn 
                      ? 'আপনার জিমেইলে কোনো ইনচার্জ দায়িত্ব বরাদ্দ নেই। সম্পাদনার অধিকার পেতে অ্যাডমিনের সাথে যোগাযোগ করুন।' 
                      : 'No incharge role assigned to your Gmail. You have read-only access to records and reports.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${
                isPrivileged
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
              }`}>
                {isPrivileged ? <Shield size={20} /> : <Lock size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xs font-black tracking-wider uppercase text-slate-500 dark:text-slate-400">
                    {isBn ? 'দায়িত্বপ্রাপ্ত ইনচার্জ ও রোল নিয়ন্ত্রণ' : 'Discipline Auditor & Access Role'}
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-black ${
                    isPrivileged
                      ? DISCIPLINE_AUDITOR_ROLES.find(r => r.key === effectiveAuditorRole)?.badgeColor || 'bg-slate-700 text-white'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {isBn
                      ? DISCIPLINE_AUDITOR_ROLES.find(r => r.key === effectiveAuditorRole)?.titleBn
                      : DISCIPLINE_AUDITOR_ROLES.find(r => r.key === effectiveAuditorRole)?.titleEn}
                  </span>
                  {user && isPrivileged && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <UserCheck size={10} />
                      <span>{isBn ? 'যাচাইকৃত লগইন' : 'Verified Login'}</span>
                    </span>
                  )}
                </div>
                <p className={`text-xs sm:text-sm font-bold mt-0.5 ${isPrivileged ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                  👤 {(() => {
                    const userAssignment = assignments.find(a => a.email.toLowerCase() === currentUserEmail && a.isActive);
                    if (userAssignment) return `${userAssignment.name} (${userAssignment.email})`;
                    if (isUserAdmin) return `${currentUserEmail || 'Admin'} (Master Admin)`;
                    const roleProfile = DISCIPLINE_AUDITOR_ROLES.find(r => r.key === effectiveAuditorRole);
                    const activeRoleAssignment = assignments.find(a => a.role === effectiveAuditorRole && a.isActive);
                    if (activeRoleAssignment) return `${activeRoleAssignment.name} (${activeRoleAssignment.email})`;
                    return isBn ? roleProfile?.inchargeNameBn : roleProfile?.inchargeNameEn;
                  })()}
                  <span className="text-slate-400 dark:text-slate-500 font-normal ml-2 hidden sm:inline">
                    — {isBn
                      ? DISCIPLINE_AUDITOR_ROLES.find(r => r.key === effectiveAuditorRole)?.descriptionBn
                      : DISCIPLINE_AUDITOR_ROLES.find(r => r.key === effectiveAuditorRole)?.descriptionEn}
                  </span>
                </p>
              </div>
            </div>

            {/* Admin Controls: Role Switcher & Incharges Management Page Link */}
            {isUserAdmin && (
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <Link
                  to="/discipline-audit/roles"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition shadow-xs"
                  title={isBn ? 'ইনচার্জ ও জিমেইল নির্ধারণ করুন' : 'Assign & manage incharge Gmails'}
                >
                  <Shield size={14} />
                  <span>{isBn ? 'ইনচার্জ ব্যবস্থাপনা' : 'Manage Incharges'}</span>
                  <ExternalLink size={12} className="opacity-70" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
                    {isBn ? 'সক্রিয় প্রিভিউ:' : 'Preview Role:'}
                  </span>
                  <select
                    value={activeAuditorRole}
                    onChange={(e) => {
                      const newRole = e.target.value as DisciplineAuditorRole;
                      setActiveAuditorRole(newRole);
                      const p = DISCIPLINE_AUDITOR_ROLES.find(r => r.key === newRole);
                      toast.success(
                        isBn
                          ? `সক্রিয় রোল পরিবর্তন করা হয়েছে: ${p?.titleBn} (${p?.inchargeNameBn})`
                          : `Switched active auditor to: ${p?.titleEn} (${p?.inchargeNameEn})`
                      );
                    }}
                    className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    {DISCIPLINE_AUDITOR_ROLES.map(r => (
                      <option key={r.key} value={r.key}>
                        {r.key === 'ADMIN' ? '👑' : r.key === 'MORNING_INCHARGE' ? '🌅' : r.key === 'SECURITY_MANAGER' ? '🌙' : r.key === 'INTERNAL_MANAGER' ? '📋' : '👁️'} {isBn ? r.titleBn : r.titleEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Parallel Permissions Status Grid */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {isBn ? 'আপনার অডিট ও সম্পাদনা অধিকার' : 'Audit & Edit Permissions'}
              </span>
              {effectiveAuditorRole === 'VIEWER' && (
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  👁️ {isBn ? 'শুধুমাত্র দেখার সুযোগ' : 'View Only Mode'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 text-xs">
              <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border font-bold transition-colors ${
                canEditBedtime 
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30' 
                  : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
              }`}>
                <span className="flex items-center gap-1.5 truncate">
                  <span>🌙</span>
                  <span className="truncate">{isBn ? 'শয়ন কারফিউ' : 'Bed Curfew'}</span>
                </span>
                <span className="text-[11px] shrink-0 font-mono">{canEditBedtime ? '✅' : '🔒'}</span>
              </div>

              <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border font-bold transition-colors ${
                canEditMorning 
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30' 
                  : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
              }`}>
                <span className="flex items-center gap-1.5 truncate">
                  <span>🌅</span>
                  <span className="truncate">{isBn ? 'প্রভাতী সাধনা' : 'Morning'}</span>
                </span>
                <span className="text-[11px] shrink-0 font-mono">{canEditMorning ? '✅' : '🔒'}</span>
              </div>

              <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border font-bold transition-colors ${
                canEditAbsence 
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30' 
                  : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
              }`}>
                <span className="flex items-center gap-1.5 truncate">
                  <span>📋</span>
                  <span className="truncate">{isBn ? 'ছুটি / অনুপস্থিতি' : 'Absence'}</span>
                </span>
                <span className="text-[11px] shrink-0 font-mono">{canEditAbsence ? '✅' : '🔒'}</span>
              </div>

              <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border font-bold transition-colors ${
                canEditStrikes 
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30' 
                  : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
              }`}>
                <span className="flex items-center gap-1.5 truncate">
                  <span>⚡</span>
                  <span className="truncate">{isBn ? 'স্ট্রাইক' : 'Strikes'}</span>
                </span>
                <span className="text-[11px] shrink-0 font-mono">{canEditStrikes ? '✅' : '🔒'}</span>
              </div>

              <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border font-bold transition-colors ${
                canManageDevotees 
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30' 
                  : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
              }`}>
                <span className="flex items-center gap-1.5 truncate">
                  <span>👥</span>
                  <span className="truncate">{isBn ? 'ভক্ত তালিকা' : 'Devotees'}</span>
                </span>
                <span className="text-[11px] shrink-0 font-mono">{canManageDevotees ? '✅' : '🔒'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Group Navigation & Action Center */}
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          
          {/* Row 1: Group Navigation & Add Devotee (Parallel 4-Column Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Tab 1: VOICE Group */}
            <button
              type="button"
              onClick={() => setActiveTab('VOICE')}
              className={`flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer shadow-xs ${
                activeTab === 'VOICE'
                  ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-md ring-2 ring-amber-500/30'
                  : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <span>🌟</span>
                <span>{isBn ? 'ভয়েস গ্রুপ' : 'VOICE Group'}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold shrink-0 ${
                activeTab === 'VOICE'
                  ? 'bg-slate-950 text-amber-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {voiceCount}
              </span>
            </button>

            {/* Tab 2: Lotus Group */}
            <button
              type="button"
              onClick={() => setActiveTab('LOTUS')}
              className={`flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer shadow-xs ${
                activeTab === 'LOTUS'
                  ? 'bg-indigo-600 border-indigo-700 text-white shadow-md ring-2 ring-indigo-500/30'
                  : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <span>🪷</span>
                <span>{isBn ? 'লোটাস গ্রুপ' : 'Lotus Group'}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold shrink-0 ${
                activeTab === 'LOTUS'
                  ? 'bg-white text-indigo-900'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {lotusCount}
              </span>
            </button>

            {/* Tab 3: All Devotees */}
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer shadow-xs ${
                activeTab === 'ALL'
                  ? 'bg-slate-900 dark:bg-white border-slate-950 dark:border-white text-white dark:text-slate-900 shadow-md ring-2 ring-slate-500/30'
                  : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <span>👥</span>
                <span>{isBn ? 'সকল ভক্ত' : 'All Devotees'}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold shrink-0 ${
                activeTab === 'ALL'
                  ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {students.length}
              </span>
            </button>

            {/* Button 4: Add Devotee */}
            <button
              type="button"
              onClick={() => {
                if (checkPermission('manage')) {
                  setIsAddModalOpen(true);
                }
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 active:scale-[0.98] border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title={isBn ? 'নতুন ভক্ত যোগ করুন' : 'Add New Devotee'}
            >
              <UserPlus size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate">{isBn ? 'নতুন ভক্ত যোগ' : 'Add Devotee'}</span>
            </button>
          </div>

          {/* Row 2: Parallel 4-Column Quick Action Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {/* Action 1: Mark All On-Time */}
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'VOICE') handleMarkAllOnTime('VOICE');
                else if (activeTab === 'LOTUS') handleMarkAllOnTime('LOTUS');
                else handleMarkAllStudentsOnTime();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-[0.98] border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title={isBn ? 'নির্বাচিত গ্রুপের সবাইকে সময়মত মার্ক করুন' : 'Mark all devotees in this group as on time'}
            >
              <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{isBn ? 'সবাই সময়মত' : 'Mark On-Time'}</span>
            </button>

            {/* Action 2: WhatsApp Report / Dispatch */}
            {activeTab === 'VOICE' && (
              <button
                type="button"
                onClick={() => {
                  const r = generateVoiceReport();
                  shareToWhatsAppOrSystem({ text: r, successMessage: isBn ? 'ভয়েস রিপোর্ট শেয়ার হচ্ছে...' : 'Sharing VOICE Report...' });
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 text-xs font-black transition-all cursor-pointer shadow-xs"
                title="Send VOICE WhatsApp Report"
              >
                <Send size={13} className="shrink-0" />
                <span className="truncate">{isBn ? 'ভয়েস হোয়াটসঅ্যাপ' : 'VOICE WhatsApp'}</span>
              </button>
            )}

            {activeTab === 'LOTUS' && (
              <button
                type="button"
                onClick={() => {
                  const r = generateLotusReport();
                  shareToWhatsAppOrSystem({ text: r, successMessage: isBn ? 'লোটাস রিপোর্ট শেয়ার হচ্ছে...' : 'Sharing Lotus Report...' });
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-black transition-all cursor-pointer shadow-xs"
                title="Send Lotus WhatsApp Report"
              >
                <Send size={13} className="shrink-0" />
                <span className="truncate">{isBn ? 'লোটাস হোয়াটসঅ্যাপ' : 'Lotus WhatsApp'}</span>
              </button>
            )}

            {activeTab === 'ALL' && (
              <button
                type="button"
                onClick={() => setIsMonthlyVerdictModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 text-xs font-black transition-all cursor-pointer shadow-xs"
                title="Open Monthly Verdict & Performance Analytics"
              >
                <Award size={13} className="shrink-0" />
                <span className="truncate">{isBn ? 'মাসিক রিপোর্ট' : 'Monthly Report'}</span>
              </button>
            )}

            {/* Action 3: Preview */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                if (activeTab === 'VOICE') {
                  setPreviewReport({
                    title: isBn ? '🌟 ভয়েস গ্রুপ রিপোর্ট প্রিভিউ' : '🌟 VOICE Group Report Preview',
                    content: generateVoiceReport()
                  });
                } else if (activeTab === 'LOTUS') {
                  setPreviewReport({
                    title: isBn ? '🪷 লোটাস গ্রুপ রিপোর্ট প্রিভিউ' : '🪷 Lotus Group Report Preview',
                    content: generateLotusReport()
                  });
                } else {
                  setPreviewReport({
                    title: isBn ? '🌅 সম্মিলিত মর্নিং সাধনা রিপোর্ট' : '🌅 Combined Morning Sadhana Report',
                    content: generateMorningProgramCombinedReport()
                  });
                }
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 active:scale-[0.98] border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title={isBn ? 'রিপোর্ট প্রিভিউ দেখুন' : 'Preview WhatsApp Report'}
            >
              <Eye size={13} className="text-amber-500 shrink-0" />
              <span className="truncate">{isBn ? 'প্রিভিউ' : 'Preview'}</span>
            </button>

            {/* Action 4: Copy Report */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                if (activeTab === 'VOICE') {
                  copyToClipboard(generateVoiceReport(), 'VOICE');
                } else if (activeTab === 'LOTUS') {
                  copyToClipboard(generateLotusReport(), 'LOTUS');
                } else {
                  copyToClipboard(generateMorningProgramCombinedReport(), 'MP');
                }
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 active:scale-[0.98] border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title={isBn ? 'রিপোর্ট ক্লিপবোর্ডে কপি করুন' : 'Copy Report to Clipboard'}
            >
              {((activeTab === 'VOICE' && copiedVoice) || (activeTab === 'LOTUS' && copiedLotus) || (activeTab === 'ALL' && copiedMp)) ? (
                <>
                  <Check size={13} className="text-emerald-500 shrink-0" />
                  <span className="truncate text-emerald-600 dark:text-emerald-400">{isBn ? 'কপি হয়েছে' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="shrink-0 text-slate-500" />
                  <span className="truncate">{isBn ? 'কপি' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Incharge Reports - Minimal Two Column Side-by-Side Boxes */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-3xl border border-slate-800 shadow-md space-y-2.5">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-sm">📊</span>
              <h2 className="text-xs sm:text-sm font-black tracking-wide uppercase text-white">
                {isBn ? 'ইনচার্জ দৈনিক রিপোর্ট ও ডিসপ্যাচ' : 'Incharge Daily Reports & WhatsApp Dispatch'}
              </h2>
            </div>
            <span className="text-[10.5px] font-bold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
              {isBn ? `মোট ${students.length} জন ভক্ত` : `${students.length} Devotees`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {/* Column 1: Morning Program Report */}
            <div className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] border border-amber-500/25 transition-all flex flex-col justify-between gap-2.5 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5 truncate">
                  <Sun size={15} className="text-amber-400 shrink-0" />
                  <span className="truncate">{isBn ? 'মর্নিং প্রোগ্রাম রিপোর্ট' : 'Morning Program Report'}</span>
                </span>
                <span className="text-[10px] bg-amber-500/15 text-amber-300 font-mono px-2 py-0.5 rounded-full font-bold border border-amber-500/20 shrink-0">
                  {isBn ? 'প্রভাতী সাধনা' : 'Morning'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    const r = generateMorningProgramCombinedReport();
                    shareToWhatsAppOrSystem({ text: r, successMessage: isBn ? 'মর্নিং রিপোর্ট শেয়ার হচ্ছে...' : 'Sharing Morning Report...' });
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-xs shadow-xs transition-all cursor-pointer"
                  title="Send Morning Report via WhatsApp"
                >
                  <Send size={12} className="shrink-0" />
                  <span className="truncate">{isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setPreviewReport({
                      title: isBn ? '🌅 মর্নিং প্রোগ্রাম রিপোর্ট প্রিভিউ' : '🌅 Morning Program Report Preview',
                      content: generateMorningProgramCombinedReport()
                    });
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/15 text-xs font-bold transition-all cursor-pointer"
                  title="Preview Morning WhatsApp Card"
                >
                  <Eye size={12} className="text-amber-300 shrink-0" />
                  <span className="truncate">{isBn ? 'প্রিভিউ' : 'Preview'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    copyToClipboard(generateMorningProgramCombinedReport(), 'MP');
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/15 text-xs font-bold transition-all cursor-pointer"
                  title="Copy Morning Report"
                >
                  {copiedMp ? <Check size={12} className="text-emerald-400 shrink-0" /> : <Copy size={12} className="shrink-0 text-slate-300" />}
                  <span className="truncate">{copiedMp ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'কপি' : 'Copy')}</span>
                </button>
              </div>
            </div>

            {/* Column 2: Security Manager Night Report */}
            <div className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] border border-indigo-500/25 transition-all flex flex-col justify-between gap-2.5 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-1.5 truncate">
                  <Moon size={15} className="text-indigo-400 shrink-0" />
                  <span className="truncate">{isBn ? 'সিকিউরিটি নাইট রিপোর্ট' : 'Security Night Report'}</span>
                </span>
                <span className="text-[10px] bg-indigo-500/15 text-indigo-300 font-mono px-2 py-0.5 rounded-full font-bold border border-indigo-500/20 shrink-0">
                  {isBn ? 'নৈশ কারফিউ' : 'Curfew'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    const r = generateSecurityManagerCombinedReport();
                    shareToWhatsAppOrSystem({ text: r, successMessage: isBn ? 'নাইট রিপোর্ট শেয়ার হচ্ছে...' : 'Sharing Night Report...' });
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-black text-xs shadow-xs transition-all cursor-pointer"
                  title="Send Night Report via WhatsApp"
                >
                  <Send size={12} className="shrink-0" />
                  <span className="truncate">{isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setPreviewReport({
                      title: isBn ? '🌙 নৈশ শৃঙ্খলা ও নিরাপত্তা রিপোর্ট প্রিভিউ' : '🌙 Night Discipline & Security Report Preview',
                      content: generateSecurityManagerCombinedReport()
                    });
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/15 text-xs font-bold transition-all cursor-pointer"
                  title="Preview Night WhatsApp Card"
                >
                  <Eye size={12} className="text-indigo-300 shrink-0" />
                  <span className="truncate">{isBn ? 'প্রিভিউ' : 'Preview'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    copyToClipboard(generateSecurityManagerCombinedReport(), 'NIGHT');
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/15 text-xs font-bold transition-all cursor-pointer"
                  title="Copy Night Report"
                >
                  {copiedNight ? <Check size={12} className="text-indigo-400 shrink-0" /> : <Copy size={12} className="shrink-0 text-slate-300" />}
                  <span className="truncate">{copiedNight ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'কপি' : 'Copy')}</span>
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
                          ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
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
                              if (!checkPermission('absence')) return;
                              triggerHaptic('selection');
                              updateEntry(student.id, { 
                                isAbsent: !isAbsent,
                                absenceReason: !isAbsent ? (entry.absenceReason || 'Out of town / Home Leave (গ্রামের বাড়ি / বাইরে অবস্থান)') : ''
                              });
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                              isAbsent
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700 shadow-xs'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-100/60'
                            }`}
                            title="Click to toggle Present / On Leave status"
                          >
                            <span className={`w-2 h-2 rounded-full shrink-0 ${isAbsent ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <span>{isAbsent ? (isBn ? 'ছুটি' : 'On Leave') : (isBn ? 'উপস্থিত' : 'Present')}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {student.phone && (
                            <span className="text-[10px] font-mono text-slate-400">
                              {student.phone}
                            </span>
                          )}

                          {(() => {
                            const strikeInfo = devoteeStrikesMap[student.id] || { strikes: student.monthlyStrikes, autoStrikes: 0, violations: [] };
                            const currentStrikes = strikeInfo.strikes;
                            return (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-slate-500 font-medium">{isBn ? 'স্ট্রাইক:' : 'Strikes:'}</span>

                                {/* Non-accidental Strike Badge: Click opens Disciplinary Warning Modal */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (canEditStrikes) {
                                      handleOpenStrikeModal(student.id);
                                    } else {
                                      toast(
                                        isBn
                                          ? `বর্তমান স্ট্রাইক: ${toBn(currentStrikes)}টি। পরিবর্তনের অধিকার শুধুমাত্র অ্যাডমিন ও মর্নিং ইনচার্জের।`
                                          : `Current strikes: ${currentStrikes}. Only Admin & Morning Incharge can adjust.`,
                                        { icon: '🔒' }
                                      );
                                    }
                                  }}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer shadow-xs ${
                                    currentStrikes === 0
                                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                      : currentStrikes <= 2
                                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                                      : currentStrikes <= 4
                                      ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/25'
                                      : 'bg-red-700/20 text-red-800 dark:text-red-300 border border-red-700/40 hover:bg-red-700/30 animate-pulse'
                                  }`}
                                  title={
                                    canEditStrikes
                                      ? (isBn ? `স্ট্রাইক: ${toBn(currentStrikes)}টি — সতর্কতা ও সমন্বয় করতে ক্লিক করুন` : `Strikes: ${currentStrikes} — Click to manage warning & adjustment`)
                                      : (isBn ? `স্ট্রাইক: ${toBn(currentStrikes)}টি (শুধুমাত্র অ্যাডমিন ও মর্নিং ইনচার্জ সমন্বয় করতে পারেন)` : `Strikes: ${currentStrikes} (Read-only. Only Admin & Morning Incharge can adjust)`)
                                  }
                                >
                                  <span>{currentStrikes === 0 ? '✅' : currentStrikes <= 2 ? '⚠️' : currentStrikes <= 4 ? '🚨' : '💀'}</span>
                                  <span>{isBn ? `${toBn(currentStrikes)} স্ট্রাইক` : `${currentStrikes} Strike${currentStrikes !== 1 ? 's' : ''}`}</span>
                                  {canEditStrikes && <Edit size={10} className="ml-0.5 opacity-70" />}
                                </button>

                                {strikeInfo.autoStrikes > 0 && (
                                  <span 
                                    className="text-[9.5px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-300 dark:border-rose-800 flex items-center gap-0.5 cursor-help"
                                    title={
                                      isBn
                                        ? `স্বয়ংক্রিয় স্ট্রাইক কারণ:\n${strikeInfo.violations.map(v => `${v.date}: ${v.rules.join(', ')}`).join('\n')}`
                                        : `Auto-counted strike reasons:\n${strikeInfo.violations.map(v => `${v.date}: ${v.rules.join(', ')}`).join('\n')}`
                                    }
                                  >
                                    ⚡ {isBn ? 'অটো' : 'Auto'}: {toBn(strikeInfo.autoStrikes)}
                                  </span>
                                )}

                                {currentStrikes >= 3 && currentStrikes < 5 && (
                                  <span className="text-[10px] font-black text-rose-600 animate-pulse bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
                                    {student.group === 'VOICE' ? '⚠️ Degraded to Lotus' : '🚨 3+ Strikes'}
                                  </span>
                                )}

                                {currentStrikes >= 5 && (
                                  <span className="text-[10px] font-black text-red-800 dark:text-red-300 animate-pulse bg-red-500/20 px-1.5 py-0.5 rounded border border-red-700/50">
                                    💀 {isBn ? `বহিষ্কার পর্যায় (${toBn(currentStrikes)})` : `Dismissal Level (${currentStrikes})`}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {isAbsent ? (
                      <div className="flex-1 max-w-2xl p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center gap-2 animate-fade-in">
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-200 shrink-0 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span>{isBn ? 'ছুটির কারণ:' : 'Reason for Leave:'}</span>
                        </span>
                        <select
                          disabled={!canEditAbsence}
                          value={entry.absenceReason || ''}
                          onChange={(e) => {
                            if (!checkPermission('absence')) return;
                            updateEntry(student.id, { absenceReason: e.target.value });
                          }}
                          className="flex-1 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg p-1.5 font-medium focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                        >
                          <option value="">-- Select Absence Reason --</option>
                          {ABSENCE_REASONS.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 flex-1 max-w-3xl">
                        
                        {/* Bedtime Curfew */}
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
                              onClick={() => {
                                if (!checkPermission('bedtime')) return;
                                updateEntry(student.id, { 
                                  sleptOnTime: !entry.sleptOnTime,
                                  bedLateMinutes: !entry.sleptOnTime ? 0 : (entry.bedLateMinutes || 15)
                                });
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10.5px] font-black cursor-pointer transition-all ${
                                entry.sleptOnTime ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {entry.sleptOnTime ? 'Yes' : 'No'}
                            </button>
                          </div>
                          {!entry.sleptOnTime && (
                            <div className="flex flex-col gap-1 mt-1">
                              <select
                                disabled={!canEditBedtime}
                                value={
                                  customBedActive[student.id] || (entry.bedLateMinutes !== undefined && entry.bedLateMinutes > 0 && !LATE_MINUTE_OPTIONS.includes(entry.bedLateMinutes))
                                    ? 'custom'
                                    : (entry.bedLateMinutes && LATE_MINUTE_OPTIONS.includes(entry.bedLateMinutes) ? entry.bedLateMinutes : 15)
                                }
                                onChange={(e) => {
                                  if (!checkPermission('bedtime')) return;
                                  if (e.target.value === 'custom') {
                                    setCustomBedActive(prev => ({ ...prev, [student.id]: true }));
                                    if (!entry.bedLateMinutes || LATE_MINUTE_OPTIONS.includes(entry.bedLateMinutes)) {
                                      updateEntry(student.id, { bedLateMinutes: entry.bedLateMinutes || 15 });
                                    }
                                  } else {
                                    setCustomBedActive(prev => ({ ...prev, [student.id]: false }));
                                    updateEntry(student.id, { bedLateMinutes: parseInt(e.target.value, 10) || 0 });
                                  }
                                }}
                                className="text-[10px] bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded px-1 py-0.5 font-bold text-rose-700 dark:text-rose-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="custom">✏️ {isBn ? 'কাস্টম মিনিট...' : 'Custom min...'}</option>
                                {LATE_MINUTE_OPTIONS.map(m => (
                                  <option key={m} value={m}>Late {m}m</option>
                                ))}
                              </select>
                              {(customBedActive[student.id] || (entry.bedLateMinutes !== undefined && entry.bedLateMinutes > 0 && !LATE_MINUTE_OPTIONS.includes(entry.bedLateMinutes))) && (
                                <div className="flex items-center gap-1 animate-fade-in mt-0.5">
                                  <input
                                    type="number"
                                    min="1"
                                    max="360"
                                    autoFocus
                                    disabled={!canEditBedtime}
                                    value={entry.bedLateMinutes === 0 ? '' : (entry.bedLateMinutes || '')}
                                    onChange={(e) => {
                                      if (!checkPermission('bedtime')) return;
                                      const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                                      updateEntry(student.id, { bedLateMinutes: val });
                                    }}
                                    placeholder={isBn ? 'মিনিট' : 'mins'}
                                    className="w-14 text-[10px] bg-white dark:bg-slate-900 border border-rose-400 dark:border-rose-700 rounded px-1.5 py-0.5 font-mono font-bold text-rose-800 dark:text-rose-200 focus:ring-1 focus:ring-rose-500 disabled:opacity-50"
                                  />
                                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">{isBn ? 'মি.' : 'min'}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Wake-up 4:00 AM */}
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
                              onClick={() => {
                                if (!checkPermission('morning')) return;
                                updateEntry(student.id, { wokeUpOnTime: !entry.wokeUpOnTime });
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10.5px] font-black cursor-pointer transition-all ${
                                entry.wokeUpOnTime ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {entry.wokeUpOnTime ? 'Yes' : 'No'}
                            </button>
                          </div>
                        </div>

                        {/* Morning Program Attendance */}
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
                              onClick={() => {
                                if (!checkPermission('morning')) return;
                                updateEntry(student.id, { 
                                  morningProgramOnTime: !entry.morningProgramOnTime,
                                  mpLateMinutes: !entry.morningProgramOnTime ? 0 : (entry.mpLateMinutes || 15)
                                });
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10.5px] font-black cursor-pointer transition-all ${
                                entry.morningProgramOnTime ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {entry.morningProgramOnTime ? 'Yes' : 'No'}
                            </button>
                          </div>
                          {!entry.morningProgramOnTime && (
                            <div className="flex flex-col gap-1 mt-1">
                              <select
                                disabled={!canEditMorning}
                                value={
                                  customMpActive[student.id] || (entry.mpLateMinutes !== undefined && entry.mpLateMinutes > 0 && !LATE_MINUTE_OPTIONS.includes(entry.mpLateMinutes))
                                    ? 'custom'
                                    : (entry.mpLateMinutes && LATE_MINUTE_OPTIONS.includes(entry.mpLateMinutes) ? entry.mpLateMinutes : 15)
                                }
                                onChange={(e) => {
                                  if (!checkPermission('morning')) return;
                                  if (e.target.value === 'custom') {
                                    setCustomMpActive(prev => ({ ...prev, [student.id]: true }));
                                    if (!entry.mpLateMinutes || LATE_MINUTE_OPTIONS.includes(entry.mpLateMinutes)) {
                                      updateEntry(student.id, { mpLateMinutes: entry.mpLateMinutes || 15 });
                                    }
                                  } else {
                                    setCustomMpActive(prev => ({ ...prev, [student.id]: false }));
                                    updateEntry(student.id, { mpLateMinutes: parseInt(e.target.value, 10) || 0 });
                                  }
                                }}
                                className="text-[10px] bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded px-1 py-0.5 font-bold text-rose-700 dark:text-rose-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="custom">✏️ {isBn ? 'কাস্টম মিনিট...' : 'Custom min...'}</option>
                                {LATE_MINUTE_OPTIONS.map(m => (
                                  <option key={m} value={m}>Late {m}m</option>
                                ))}
                              </select>
                              {(customMpActive[student.id] || (entry.mpLateMinutes !== undefined && entry.mpLateMinutes > 0 && !LATE_MINUTE_OPTIONS.includes(entry.mpLateMinutes))) && (
                                <div className="flex items-center gap-1 animate-fade-in mt-0.5">
                                  <input
                                    type="number"
                                    min="1"
                                    max="360"
                                    autoFocus
                                    disabled={!canEditMorning}
                                    value={entry.mpLateMinutes === 0 ? '' : (entry.mpLateMinutes || '')}
                                    onChange={(e) => {
                                      if (!checkPermission('morning')) return;
                                      const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                                      updateEntry(student.id, { mpLateMinutes: val });
                                    }}
                                    placeholder={isBn ? 'মিনিট' : 'mins'}
                                    className="w-14 text-[10px] bg-white dark:bg-slate-900 border border-rose-400 dark:border-rose-700 rounded px-1.5 py-0.5 font-mono font-bold text-rose-800 dark:text-rose-200 focus:ring-1 focus:ring-rose-500 disabled:opacity-50"
                                  />
                                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">{isBn ? 'মি.' : 'min'}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Mangalarati */}
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
                              onClick={() => {
                                if (!checkPermission('morning')) return;
                                updateEntry(student.id, { 
                                  mangalaratiAttended: !entry.mangalaratiAttended,
                                  mangalaratiReason: !entry.mangalaratiAttended ? '' : (entry.mangalaratiReason || MANGALARATI_REASONS[0])
                                });
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10.5px] font-black cursor-pointer transition-all ${
                                entry.mangalaratiAttended ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {entry.mangalaratiAttended ? 'Yes' : 'No'}
                            </button>
                          </div>
                          {!entry.mangalaratiAttended && (
                            <select
                              disabled={!canEditMorning}
                              value={entry.mangalaratiReason || ''}
                              onChange={(e) => {
                                if (!checkPermission('morning')) return;
                                updateEntry(student.id, { mangalaratiReason: e.target.value });
                              }}
                              className="text-[10px] bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded px-1 py-0.5 font-medium text-rose-700 dark:text-rose-300 disabled:opacity-50"
                            >
                              <option value="">-- Reason --</option>
                              {MANGALARATI_REASONS.map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* Morning Class */}
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
                              onClick={() => {
                                if (!checkPermission('morning')) return;
                                updateEntry(student.id, { 
                                  morningClassAttended: !entry.morningClassAttended,
                                  morningClassReason: !entry.morningClassAttended ? '' : (entry.morningClassReason || MORNING_CLASS_REASONS[0])
                                });
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10.5px] font-black cursor-pointer transition-all ${
                                entry.morningClassAttended ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {entry.morningClassAttended ? 'Yes' : 'No'}
                            </button>
                          </div>
                          {!entry.morningClassAttended && (
                            <select
                              disabled={!canEditMorning}
                              value={entry.morningClassReason || ''}
                              onChange={(e) => {
                                if (!checkPermission('morning')) return;
                                updateEntry(student.id, { morningClassReason: e.target.value });
                              }}
                              className="text-[10px] bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded px-1 py-0.5 font-medium text-rose-700 dark:text-rose-300 disabled:opacity-50"
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
                        onClick={() => {
                          if (!checkPermission('manage')) return;
                          setEditingStudent({ ...student });
                        }}
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

                  let presentDays = 0;
                  let absentDays = 0;
                  let bedOnTime = 0;
                  let mpOnTime = 0;
                  let mangalOnTime = 0;
                  let classOnTime = 0;

                  recordedDates.forEach(date => {
                    const entry = getEntry(targetStudent.id, date);
                    if (entry.isAbsent) {
                      absentDays++;
                    } else {
                      presentDays++;
                      if (entry.sleptOnTime) bedOnTime++;
                      if (entry.morningProgramOnTime) mpOnTime++;
                      if (entry.mangalaratiAttended) mangalOnTime++;
                      if (entry.morningClassAttended) classOnTime++;
                    }
                  });

                  const divisor = presentDays > 0 ? presentDays : 1;
                  const overallRate = presentDays > 0
                    ? Math.round(((bedOnTime + mpOnTime + mangalOnTime + classOnTime) / (divisor * 4)) * 100)
                    : 100;

                  return (
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-indigo-900/40 via-slate-900 to-indigo-950/40 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-base text-white">
                              {targetStudent.name}
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              targetStudent.group === 'VOICE' ? 'bg-amber-500 text-slate-950' : 'bg-indigo-500 text-white'
                            }`}>
                              {targetStudent.group} Group
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-200">
                              {targetStudent.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {isBn ? 'মূল্যায়নকৃত দিন' : 'Evaluated'}: <span className="text-white font-bold">{presentDays + absentDays} {isBn ? 'দিন' : 'days'}</span> ({presentDays} {isBn ? 'উপস্থিত' : 'present'}, {absentDays} {isBn ? 'ছুটি' : 'leave'}) • {isBn ? 'স্ট্রাইক' : 'Strikes'}: <span className="text-amber-400 font-black">{toBn(devoteeStrikesMap[targetStudent.id]?.strikes ?? targetStudent.monthlyStrikes)} {isBn ? 'টি' : ''}</span>
                          </p>
                        </div>
                        
                        <div className="text-right sm:border-l sm:border-white/15 sm:pl-4">
                          <div className="text-[11px] text-slate-400 font-medium">{isBn ? 'সাধনা সাফল্যের হার' : 'Sadhana Success Rate'}</div>
                          <div className={`text-xl font-mono font-black ${
                            overallRate >= 90 ? 'text-emerald-400' : overallRate >= 75 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {overallRate}%
                          </div>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                        {recordedDates.map(date => {
                          const entry = getEntry(targetStudent.id, date);
                          const dateObj = parseIsoDate(date);
                          const dateLabel = dateObj.toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', { 
                            weekday: 'short', 
                            day: 'numeric', 
                            month: 'short' 
                          });

                          return (
                            <div key={date} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-300 w-24">
                                  {date}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  ({dateLabel})
                                </span>
                              </div>

                              {entry.isAbsent ? (
                                <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1 rounded-lg text-xs w-fit">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                  <span>{isBn ? 'ছুটি / অনুপস্থিত' : 'On Leave'}: {formatReasonText(entry.absenceReason, isBn)}</span>
                                </span>
                              ) : (
                                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                                  <span className={`px-2 py-0.5 rounded font-bold ${
                                    entry.sleptOnTime 
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' 
                                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-black'
                                  }`}>
                                    🌙 Bed: {entry.sleptOnTime ? 'On-Time' : `Late +${entry.bedLateMinutes || 15}m`}
                                  </span>

                                  <span className={`px-2 py-0.5 rounded font-bold ${
                                    entry.morningProgramOnTime 
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' 
                                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-black'
                                  }`}>
                                    ⏰ MP: {entry.morningProgramOnTime ? 'On-Time' : `Late +${entry.mpLateMinutes || 15}m`}
                                  </span>

                                  <span className={`px-2 py-0.5 rounded font-bold ${
                                    entry.mangalaratiAttended 
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' 
                                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                                  }`}>
                                    🪔 Mangal: {entry.mangalaratiAttended ? 'Attended' : 'Missed'}
                                  </span>

                                  <span className={`px-2 py-0.5 rounded font-bold ${
                                    entry.morningClassAttended 
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' 
                                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                                  }`}>
                                    📖 Class: {entry.morningClassAttended ? 'Attended' : 'Missed'}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {recordedDates.map(date => {
                    const isCurrent = date === dateIso;
                    const dateObj = parseIsoDate(date);
                    const formattedDate = dateObj.toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'short',
                      year: 'numeric'
                    });

                    let dayPresent = 0;
                    let dayAbsent = 0;
                    students.forEach(s => {
                      const entry = getEntry(s.id, date);
                      if (entry.isAbsent) dayAbsent++;
                      else dayPresent++;
                    });

                    return (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(parseIsoDate(date));
                          setIsHistoryModalOpen(false);
                          toast.success(isBn ? `${formattedDate} তারিখের অডিট লোড করা হয়েছে` : `Loaded discipline records for ${date}`);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer group hover:scale-[1.01] ${
                          isCurrent
                            ? 'bg-gradient-to-br from-amber-500/15 to-amber-500/5 border-amber-500 text-slate-900 dark:text-white shadow-md'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                            {date}
                          </span>
                          {isCurrent ? (
                            <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                              Active Day
                            </span>
                          ) : (
                            <span className="text-[10.5px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                              Open ➔
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                          {formattedDate}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ {toBn(dayPresent)} {isBn ? 'উপস্থিত' : 'Present'}
                          </span>
                          {dayAbsent > 0 && (
                            <span className="text-rose-500 font-bold">
                              • {toBn(dayAbsent)} {isBn ? 'ছুটি' : 'Leave'}
                            </span>
                          )}
                        </div>
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
                            {st.totalStrikes}
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
                    Monthly Strikes (Cumulative)
                  </label>
                  <input
                    type="number"
                    min="0"
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

      {/* Strike Management & Disciplinary Warning Modal */}
      {strikeModalStudentId && (() => {
        const targetStudent = students.find(s => s.id === strikeModalStudentId);
        if (!targetStudent) return null;
        const strikeInfo = devoteeStrikesMap[targetStudent.id] || { strikes: targetStudent.monthlyStrikes, autoStrikes: 0, violations: [] };
        const currentStrikes = strikeInfo.strikes;
        const isDemotingVoice = targetStudent.group === 'VOICE' && pendingStrikeCount >= 3;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {isBn ? 'আশ্রম শৃঙ্খলার স্ট্রাইক ও সতর্কীকরণ' : 'Ashram Strike & Disciplinary Warning'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                      👤 {targetStudent.name} • <span className={targetStudent.group === 'VOICE' ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'}>{targetStudent.group === 'VOICE' ? '🌟 VOICE Group' : '🪷 Lotus Group'}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStrikeModalStudentId(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
                
                {/* Authority Notice */}
                <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] font-bold flex items-center gap-2">
                  <Shield size={16} className="text-amber-600 shrink-0" />
                  <span>
                    {isBn 
                      ? '🔒 এই ব্যবস্থা শুধুমাত্র অ্যাডমিন ও মর্নিং প্রোগ্রাম ইনচার্জের অনুমোদনে নিয়ন্ত্রিত।' 
                      : '🔒 Strike adjustment is strictly restricted to Admin and Morning Program Incharge.'}
                  </span>
                </div>

                {/* Current vs New Strike Comparison Box */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {isBn ? 'বর্তমান স্ট্রাইক' : 'Current Strikes'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {toBn(currentStrikes)}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({isBn ? 'অটো' : 'Auto'}: {toBn(strikeInfo.autoStrikes)})
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                    <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block">
                      {isBn ? 'নতুন নির্ধারিত মান' : 'Target Strikes'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPendingStrikeCount(prev => Math.max(0, prev - 1))}
                        disabled={pendingStrikeCount === 0}
                        className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-sm flex items-center justify-center hover:bg-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={pendingStrikeCount}
                        onChange={(e) => setPendingStrikeCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-12 text-center text-lg font-black text-slate-900 dark:text-white bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 py-0.5"
                      />
                      <button
                        type="button"
                        onClick={() => setPendingStrikeCount(prev => prev + 1)}
                        className="w-7 h-7 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center hover:bg-rose-500 shadow-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Auto Rule Violations Breakdown if any */}
                {strikeInfo.violations.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      ⚡ {isBn ? 'স্বয়ংক্রিয়ভাবে চিহ্নিত অনিয়ম সমূহ:' : 'System Auto-Detected Rule Violations:'}
                    </span>
                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1 text-[10.5px]">
                      {strikeInfo.violations.map((v, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                          <span className="font-mono font-bold text-rose-600 shrink-0">• {v.date}:</span>
                          <span>{v.rules.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disciplinary Policy Warning Levels */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-slate-100 dark:to-slate-800/60 border border-amber-500/30 space-y-2">
                  <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    ⚠️ {isBn ? 'শৃঙ্খলা নীতি ও সতর্কীকরণ পর্যায়:' : 'Disciplinary Warning Policy:'}
                  </span>
                  <div className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-black text-[10px]">১-২ স্ট্রাইক</span>
                      <span>{isBn ? 'মৌখিক ও আনুষ্ঠানিক সতর্কতা (Formal Caution)' : 'Formal disciplinary caution & observation'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-rose-600/20 text-rose-800 dark:text-rose-300 font-black text-[10px]">৩+ স্ট্রাইক</span>
                      <span>{isBn ? 'স্বয়ংক্রিয়ভাবে লোটাস গ্রুপে অবনমন (Lotus Demotion)' : 'Automatic demotion to Lotus Group'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-red-700/25 text-red-900 dark:text-red-300 font-black text-[10px]">৫+ স্ট্রাইক</span>
                      <span>{isBn ? 'আশ্রম আবাসিক সুযোগ বাতিল বা বহিষ্কার বিবেচনা' : 'Ashram residency disqualification / dismissal'}</span>
                    </div>
                  </div>
                </div>

                {/* Demotion Alert if target strikes >= 3 */}
                {isDemotingVoice && (
                  <div className="p-3 rounded-2xl bg-rose-600/20 border border-rose-600/40 text-rose-900 dark:text-rose-200 text-xs font-bold space-y-0.5 animate-pulse">
                    <p className="font-black flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                      🚨 {isBn ? 'গুরুত্বপূর্ণ সতর্কবার্তা:' : 'Critical Warning:'}
                    </p>
                    <p className="text-[11px] font-normal leading-relaxed">
                      {isBn
                        ? `${targetStudent.name} বর্তমানে ভয়েস গ্রুপে আছেন। ৩ বা ততোধিক স্ট্রাইক নিশ্চিত করলে তিনি তাৎক্ষণিকভাবে লোটাস গ্রুপে অবনমিত হবেন।`
                        : `${targetStudent.name} is in VOICE Group. Setting strikes to 3+ will immediately demote him to Lotus Group.`}
                    </p>
                  </div>
                )}

                {/* Warning Acknowledgment Checkbox */}
                <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={strikeWarningAck}
                    onChange={(e) => setStrikeWarningAck(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 dark:border-slate-600 mt-0.5 cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-snug">
                    {isBn 
                      ? 'আমি আশ্রমের শৃঙ্খলা বিধি ও সতর্কবার্তা পর্যালোচনা করেছি এবং এই স্ট্রাইক সমন্বয় নিশ্চিত করছি।' 
                      : 'I have reviewed the ashram discipline warnings and confirm this strike adjustment.'}
                  </span>
                </label>

              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStrikeModalStudentId(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmStrikeUpdate}
                  disabled={!strikeWarningAck}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertCircle size={14} />
                  <span>{isBn ? 'স্ট্রাইক পরিবর্তন নিশ্চিত করুন' : 'Confirm Strike Change'}</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* WhatsApp Report Live Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Send size={15} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {previewReport.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isBn ? 'হোয়াটসঅ্যাপে যেরকম প্রদর্শিত হবে' : 'WhatsApp Formatted Preview'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* WhatsApp Chat Bubble Preview */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="bg-[#0b141a] rounded-2xl p-4 border border-emerald-900/40 shadow-inner">
                <div className="bg-[#005c4b]/30 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-4 text-emerald-50 shadow-sm">
                  <pre className="whitespace-pre-wrap font-sans text-xs sm:text-[12.5px] leading-relaxed select-text font-normal text-slate-100">
                    {previewReport.content}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  shareToWhatsAppOrSystem({ text: previewReport.content, successMessage: 'Sharing report...' });
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition-all cursor-pointer"
              >
                <Send size={14} />
                <span>{isBn ? 'হোয়াটসঅ্যাপে শেয়ার করুন' : 'Share to WhatsApp'}</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewReport.content);
                  toast.success(isBn ? 'রিপোর্ট কপি হয়েছে!' : 'Report copied to clipboard!');
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Copy size={14} />
                <span>{isBn ? 'কপি' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AshramDisciplineAudit;
