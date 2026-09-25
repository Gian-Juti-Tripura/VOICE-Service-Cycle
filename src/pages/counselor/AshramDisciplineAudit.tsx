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
import { supabase } from '../../supabase/supabaseClient';
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
import {
  getCachedDisciplineStudents,
  getCachedDailyRecords,
  fetchDisciplineStudents,
  fetchDailyDisciplineLogs,
  saveDailyDisciplineEntryToCloud,
  saveBulkDailyDisciplineEntriesToCloud,
  saveDisciplineStudents,
  updateStudentStrikesInCloud,
  deleteStudentFromCloud,
  autoMigrateLocalDataToSupabase
} from '../../services/disciplineStorageService';
import { shareToWhatsAppOrSystem } from '../../utils/shareUtils';
import { exportTableToPdf } from '../../lib/exportTablePdf';
import { triggerHaptic } from '../../utils/haptics';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import toast from 'react-hot-toast';

const STORAGE_STUDENTS_KEY = 'advaita_discipline_students_v6';
const STORAGE_DAILY_KEY = 'advaita_discipline_daily_v6';

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
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [activeTab, setActiveTab] = useState<GroupType | 'ALL'>('VOICE');

  const currentUserEmail = user?.email?.toLowerCase().trim();

  // Load and synchronize auditor assignments from Supabase & LocalStorage
  const [assignments, setAssignments] = useState<DisciplineAuditorAssignment[]>(() => getCachedAuditorAssignments());
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<Date | null>(null);

  // Background Cloud Sync & Realtime Listener
  useEffect(() => {
    let isMounted = true;
    setIsCloudSyncing(true);

    // 1. Fetch live assignments, students, and daily records
    Promise.all([
      getAuditorAssignments(),
      autoMigrateLocalDataToSupabase(),
      fetchDisciplineStudents(),
      fetchDailyDisciplineLogs()
    ]).then(([liveAssignments, _, cloudStudents, cloudDaily]) => {
      if (!isMounted) return;
      if (liveAssignments && liveAssignments.length > 0) {
        setAssignments(liveAssignments);
      }
      if (cloudStudents && cloudStudents.length > 0) {
        setStudents(cloudStudents);
      }
      if (cloudDaily && Object.keys(cloudDaily).length > 0) {
        setDailyRecords(cloudDaily);
      }
      setLastCloudSyncTime(new Date());
      setIsCloudSyncing(false);
    }).catch(err => {
      console.warn('Initial cloud discipline sync warning:', err);
      if (isMounted) setIsCloudSyncing(false);
    });

    // 2. Realtime subscription for cross-device live updates
    const channel = supabase
      .channel('public:daily_discipline_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_discipline_logs' }, () => {
        fetchDailyDisciplineLogs().then(data => {
          if (isMounted && data) {
            setDailyRecords(data);
            setLastCloudSyncTime(new Date());
          }
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'discipline_students' }, () => {
        fetchDisciplineStudents().then(data => {
          if (isMounted && data) {
            setStudents(data);
            setLastCloudSyncTime(new Date());
          }
        });
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const isMaster = isMasterAdmin(currentUserEmail);
  const assignedRoleForUser = getAuditorRoleForEmail(currentUserEmail, assignments);
  const isUserAdmin = isMaster || authRole === 'ADMIN' || assignedRoleForUser === 'ADMIN';

  // Strict Gmail-based role resolution:
  // No manual choose options — role is strictly determined by authentication and assignment.
  // 1. Not logged in -> pure VIEWER
  // 2. Admin / Master Admin -> ADMIN (full editing authority)
  // 3. Assigned Incharge (Morning / Security / Manager) -> strictly their assigned role
  // 4. Logged-in user with unassigned Gmail -> pure VIEWER
  const effectiveAuditorRole: DisciplineAuditorRole = useMemo(() => {
    if (!user) return 'VIEWER';
    if (isUserAdmin) return 'ADMIN';
    if (assignedRoleForUser && assignedRoleForUser !== 'VIEWER') return assignedRoleForUser;
    return 'VIEWER';
  }, [user, isUserAdmin, assignedRoleForUser]);

  const hasAuditAuthority = effectiveAuditorRole !== 'VIEWER';
  const isPrivileged = hasAuditAuthority;

  // Track active custom minute inputs for Bedtime and MP
  const [customBedActive, setCustomBedActive] = useState<Record<string, boolean>>({});
  const [customMpActive, setCustomMpActive] = useState<Record<string, boolean>>({});

  const [students, setStudents] = useState<StudentDisciplineRecord[]>(() => getCachedDisciplineStudents());
  const [dailyRecords, setDailyRecords] = useState<Record<string, Record<string, DailyDisciplineEntry>>>(() => getCachedDailyRecords());

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
    try {
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
    } catch (e) {
      console.warn('LocalStorage save failed for students:', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DAILY_KEY, JSON.stringify(dailyRecords));
    } catch (e) {
      console.warn('LocalStorage save failed for dailyRecords:', e);
    }
  }, [dailyRecords]);

  const formatToLocalIso = (d: Date): string => {
    try {
      if (!d || isNaN(d.getTime())) d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch {
      return '2026-09-01';
    }
  };

  const dateIso = formatToLocalIso(selectedDate);
  const todayIso = formatToLocalIso(new Date());
  const isToday = dateIso === todayIso;
  const isBn = language === 'bn';

  // Automatically keep verdict month aligned with the viewed date's month
  useEffect(() => {
    const viewedMonth = dateIso.slice(0, 7);
    setSelectedVerdictMonth(viewedMonth);
  }, [dateIso]);

  // Permission Evaluation — Assigned Admin & Morning Program Incharge can edit everything
  const isFullEditor = effectiveAuditorRole === 'ADMIN' || effectiveAuditorRole === 'MORNING_INCHARGE';
  const canEditBedtime = isFullEditor || effectiveAuditorRole === 'SECURITY_MANAGER' || effectiveAuditorRole === 'INTERNAL_MANAGER';
  const canEditMorning = isFullEditor || effectiveAuditorRole === 'INTERNAL_MANAGER';
  const canEditAbsence = isFullEditor || effectiveAuditorRole === 'SECURITY_MANAGER' || effectiveAuditorRole === 'INTERNAL_MANAGER';
  const canEditStrikes = isFullEditor;
  const canManageDevotees = isFullEditor;

  const checkPermission = (actionType: 'bedtime' | 'morning' | 'absence' | 'strikes' | 'manage'): boolean => {
    if (isFullEditor) return true;
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

  const toBn = (num: number | string | undefined | null) => {
    if (num === undefined || num === null) return '';
    if (!isBn) return String(num);
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, d => bnDigits[parseInt(d, 10)]);
  };

  const parseIsoDate = (iso: string): Date => {
    try {
      if (!iso || typeof iso !== 'string') return new Date();
      const cleanIso = iso.split('T')[0].trim();
      const parts = cleanIso.split('-').map(Number);
      if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
      }
      const fallbackDate = new Date(iso);
      if (!isNaN(fallbackDate.getTime())) return fallbackDate;
      return new Date();
    } catch {
      return new Date();
    }
  };

  const safeFormatDate = (
    dateInput: Date | string | number | undefined | null,
    options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' },
    fallback = ''
  ): string => {
    if (!dateInput) return fallback;
    try {
      let d: Date;
      if (typeof dateInput === 'string') {
        d = parseIsoDate(dateInput);
      } else if (dateInput instanceof Date) {
        d = dateInput;
      } else {
        d = new Date(dateInput);
      }
      if (isNaN(d.getTime())) return fallback || String(dateInput);
      try {
        return d.toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', options);
      } catch {
        // Fallback for Android WebView / Realme UI where bn-BD locale throws
        try {
          return d.toLocaleDateString('en-GB', options);
        } catch {
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }
      }
    } catch {
      return fallback || String(dateInput);
    }
  };

  const dateFormatted = safeFormatDate(selectedDate, { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const dateFormattedShort = safeFormatDate(selectedDate, { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

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
      isAbsent: false,
      absenceReason: '',
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

  // Strict 2-rule strike evaluation: ONLY 2 rules count for disciplinary strikes (no excuse for any reason)
  const calculateDevoteeStrikes = (
    studentId: string, 
    records: Record<string, Record<string, DailyDisciplineEntry>>, 
    monthPrefix: string,
    manualDelta = 0
  ) => {
    let violationDays = 0;
    const recordedDatesInMonth = Object.keys(records).filter(d => 
      d.startsWith(monthPrefix) && records[d] && records[d][studentId]
    );

    recordedDatesInMonth.forEach(d => {
      const entry = records[d]?.[studentId];
      if (!entry || entry.isAbsent) return;
      if (!entry.sleptOnTime || !entry.morningProgramOnTime) {
        violationDays++;
      }
    });

    const totalStrikes = Math.max(0, violationDays + manualDelta);
    return {
      autoStrikes: violationDays,
      strikes: totalStrikes
    };
  };

  const updateEntry = (studentId: string, updates: Partial<DailyDisciplineEntry>, customDateIso = dateIso) => {
    const current = getEntry(studentId, customDateIso);
    const updated: DailyDisciplineEntry = { ...current, ...updates };

    // 1. Update daily records in state and LocalStorage immediately
    const nextDailyRecords = {
      ...dailyRecords,
      [customDateIso]: {
        ...(dailyRecords[customDateIso] || {}),
        [studentId]: updated
      }
    };
    setDailyRecords(nextDailyRecords);
    try {
      localStorage.setItem(STORAGE_DAILY_KEY, JSON.stringify(nextDailyRecords));
    } catch (e) {
      console.warn('LocalStorage save failed for daily logs:', e);
    }

    // 2. Save daily log to Supabase immediately
    const reporter = currentUserEmail || (effectiveAuditorRole === 'ADMIN' ? 'Admin' : 'Incharge');
    saveDailyDisciplineEntryToCloud(updated, reporter).catch(err => {
      console.warn('Cloud sync error for entry update:', err);
    });

    // 3. Immediately recalculate strikes for this student and sync to Supabase
    const monthPrefix = customDateIso.slice(0, 7);
    const targetStudent = students.find(s => s.id === studentId);
    if (targetStudent) {
      const { strikes: newStrikes } = calculateDevoteeStrikes(
        studentId, 
        nextDailyRecords, 
        monthPrefix, 
        targetStudent.manualStrikeDelta ?? 0
      );

      let newStatus: StudentDisciplineRecord['status'] = 'ACTIVE';
      let newGroup: GroupType = targetStudent.group;

      if (newStrikes === 1 || newStrikes === 2) {
        newStatus = 'WARNED';
      } else if (newStrikes >= 3) {
        if (targetStudent.group === 'VOICE') {
          newStatus = 'DEMOTION_DUE';
          newGroup = 'LOTUS';
        } else {
          newStatus = newStrikes >= 5 ? 'DISMISSED' : 'DEMOTION_DUE';
        }
      }

      if (targetStudent.monthlyStrikes !== newStrikes || targetStudent.status !== newStatus || targetStudent.group !== newGroup) {
        const updatedStudents = students.map(s => 
          s.id === studentId 
            ? { ...s, monthlyStrikes: newStrikes, status: newStatus, group: newGroup } 
            : s
        );
        setStudents(updatedStudents);
        try {
          localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(updatedStudents));
        } catch (e) {
          console.warn('LocalStorage save failed for students:', e);
        }

        // 4. Save recalculated strikes and status to Supabase discipline_students immediately!
        updateStudentStrikesInCloud(studentId, newStrikes, newStatus, newGroup).catch(err => {
          console.warn('Failed to update student strikes in Supabase:', err);
        });
      }
    }
  };

  // Live Automatic Strike Evaluation based on must-follow rules
  const devoteeStrikesMap = useMemo(() => {
    // Only evaluate dates in the selected month that have actual recorded discipline logs
    const recordedDatesInMonth = Object.keys(dailyRecords).filter(d => 
      d.startsWith(selectedVerdictMonth) && dailyRecords[d] && Object.keys(dailyRecords[d]).length > 0
    );
    const monthDates = recordedDatesInMonth.sort();

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

        // STRICT DISCIPLINE RULE: Only TWO rules trigger strikes (No excuse for any reason):
        // 1. Must-Follow Rule 1: Timely Bedtime Curfew (<=10 PM for VOICE / <=11 PM for Lotus)
        if (!entry.sleptOnTime) {
          const min = entry.bedLateMinutes || 15;
          const r = entry.reason ? ` (${formatReasonText(entry.reason, isBn)})` : '';
          dayRulesBroken.push(isBn ? `দেরিতে শয়ন (${toBn(min)} মি. বিলম্ব)${r}` : `Late Bedtime (${min}m late)${r}`);
        }

        // 2. Must-Follow Rule 2: Timely Morning Program Attendance (<=4:30 AM for VOICE / <=5:00 AM for Lotus)
        if (!entry.morningProgramOnTime) {
          const min = entry.mpLateMinutes || 15;
          const r = entry.reason ? ` (${formatReasonText(entry.reason, isBn)})` : '';
          dayRulesBroken.push(isBn ? `মর্নিং প্রোগ্রামে বিলম্ব (${toBn(min)} মি. বিলম্ব)${r}` : `Late MP (${min}m late)${r}`);
        }

        // Note: Wake-up at 4:00 AM, Mangalarati, and Morning Class attendance are tracked as sadhana records,
        // but strictly DO NOT count for disciplinary strikes as per ashram rule.
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

    let finalStatus: StudentDisciplineRecord['status'] = 'ACTIVE';
    let finalGroup: GroupType = targetStudent.group;

    const updatedStudents = students.map(s => {
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

      finalStatus = status;
      finalGroup = group;
      return { ...s, group, monthlyStrikes: newStrikes, manualStrikeDelta, status };
    });

    setStudents(updatedStudents);
    saveDisciplineStudents(updatedStudents);
    updateStudentStrikesInCloud(targetStudent.id, newStrikes, finalStatus, finalGroup);

    toast.success(
      isBn
        ? `✅ ${targetStudent.name}-এর স্ট্রাইক সফলভাবে সমন্বয় করা হয়েছে: ${toBn(currentStrikes)} ➔ ${toBn(newStrikes)}`
        : `✅ Successfully updated strikes for ${targetStudent.name}: ${currentStrikes} ➔ ${newStrikes}`
    );

    setStrikeModalStudentId(null);
  };

  const handleSwitchGroup = (studentId: string) => {
    if (!checkPermission('manage')) return;

    const updated = students.map(s => {
      if (s.id !== studentId) return s;
      const newGroup: GroupType = s.group === 'VOICE' ? 'LOTUS' : 'VOICE';
      toast.success(
        isBn 
          ? `${s.name}-কে ${newGroup === 'VOICE' ? 'ভয়েস গ্রুপে' : 'লোটাস গ্রুপে'} স্থানান্তর করা হয়েছে` 
          : `Moved ${s.name} to ${newGroup} Group`
      );
      return { ...s, group: newGroup, monthlyStrikes: 0, status: 'ACTIVE' as const };
    });

    setStudents(updated);
    saveDisciplineStudents(updated);
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

    const updated = [...students, newStudent];
    setStudents(updated);
    saveDisciplineStudents(updated);
    setNewStudentName('');
    setNewStudentPhone('');
    setIsAddModalOpen(false);
    toast.success(isBn ? 'নতুন ভক্ত যুক্ত হয়েছে' : 'Added devotee successfully');
  };

  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission('manage')) return;
    if (!editingStudent || !editingStudent.name.trim()) return;

    const updated = students.map(s => s.id === editingStudent.id ? editingStudent : s);
    setStudents(updated);
    saveDisciplineStudents(updated);
    setEditingStudent(null);
    toast.success(isBn ? 'ভক্তের তথ্য আপডেট হয়েছে' : 'Devotee details updated');
  };

  const handleDeleteStudent = (studentId: string, name: string) => {
    if (!checkPermission('manage')) return;
    if (!window.confirm(`Remove ${name} from discipline list?`)) return;
    const updated = students.filter(s => s.id !== studentId);
    setStudents(updated);
    saveDisciplineStudents(updated);
    deleteStudentFromCloud(studentId).catch(err => {
      console.warn('Failed to delete student from cloud:', err);
    });
    toast.success('Devotee removed');
  };

  const handleResetToDefault = () => {
    if (!checkPermission('manage')) return;
    if (!window.confirm('Reset devotee list and restore September 1–7 historical data?')) return;
    setStudents(INITIAL_DISCIPLINE_STUDENTS);
    setDailyRecords(INITIAL_DAILY_DISCIPLINE_RECORDS);
    saveDisciplineStudents(INITIAL_DISCIPLINE_STUDENTS);
    const allBaseline: DailyDisciplineEntry[] = [];
    Object.values(INITIAL_DAILY_DISCIPLINE_RECORDS).forEach(day => {
      Object.values(day).forEach(entry => allBaseline.push(entry));
    });
    saveBulkDailyDisciplineEntriesToCloud(allBaseline, 'Reset Admin');
    toast.success('Reset to 12 active devotees & restored September history!');
  };

  const changeDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  const syncDateRecordsToCloud = async (targetDateIso = dateIso, silent = false) => {
    try {
      setIsCloudSyncing(true);
      const entriesToSave: DailyDisciplineEntry[] = [];
      const updatedDayRecords: Record<string, DailyDisciplineEntry> = {};

      students.forEach(s => {
        const entry = getEntry(s.id, targetDateIso);
        entriesToSave.push(entry);
        updatedDayRecords[s.id] = entry;
      });

      // 1. Update local daily records state & LocalStorage
      setDailyRecords(prev => {
        const next = {
          ...prev,
          [targetDateIso]: {
            ...(prev[targetDateIso] || {}),
            ...updatedDayRecords
          }
        };
        localStorage.setItem(STORAGE_DAILY_KEY, JSON.stringify(next));
        return next;
      });

      // 2. Bulk sync daily entries to Supabase
      const reporter = currentUserEmail || (effectiveAuditorRole === 'ADMIN' ? 'Admin' : 'Morning Incharge');
      await saveBulkDailyDisciplineEntriesToCloud(entriesToSave, reporter);

      // 3. Update cumulative student strikes and status in Supabase & LocalStorage
      const updatedStudents = students.map(s => {
        const calculated = devoteeStrikesMap[s.id];
        const strikes = calculated?.strikes ?? s.monthlyStrikes;
        let newStatus: StudentDisciplineRecord['status'] = 'ACTIVE';
        if (strikes >= 5) newStatus = 'DISMISSED';
        else if (strikes >= 3) newStatus = 'DEMOTION_DUE';
        else if (strikes >= 1) newStatus = 'WARNED';

        return {
          ...s,
          monthlyStrikes: strikes,
          status: newStatus
        };
      });

      setStudents(updatedStudents);
      await saveDisciplineStudents(updatedStudents);

      setLastCloudSyncTime(new Date());
      setIsCloudSyncing(false);
      if (!silent) {
        toast.success(isBn ? 'আজকের রেকর্ড ও সকল স্ট্রাইক ক্লাউডে সংরক্ষিত হয়েছে!' : 'Day record & strikes synced to cloud!');
      }
    } catch (err) {
      console.error('Failed to sync day records to cloud:', err);
      setIsCloudSyncing(false);
      if (!silent) {
        toast.error(isBn ? 'ক্লাউড সিঙ্ক ব্যর্থ হয়েছে' : 'Cloud sync failed');
      }
    }
  };

  const generateMorningProgramCombinedReport = () => {
    const voiceStudents = students.filter(s => s.group === 'VOICE');
    const lotusStudents = students.filter(s => s.group === 'LOTUS');
    const cleanName = (n?: string | null) => (n || '').replace(/\s*\(Pranto C Das\)/gi, '').replace(/\s*\(Sangakara Das\)/gi, '').trim();

    const voiceOnTime: string[] = [];
    const voiceLateOrMissed: string[] = [];
    const voiceAbsent: string[] = [];

    const lotusOnTime: string[] = [];
    const lotusLateOrMissed: string[] = [];
    const lotusAbsent: string[] = [];

    voiceStudents.forEach(s => {
      const entry = getEntry(s.id);
      const sStrikes = devoteeStrikesMap[s.id]?.strikes ?? s.monthlyStrikes ?? 0;
      const strikeStr = `_(${isBn ? 'স্ট্রাইক: ' + toBn(sStrikes) : 'Strike: ' + sStrikes})_`;

      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        voiceAbsent.push(`*${cleanName(s.name)}* ${strikeStr} — ${reason}`);
      } else {
        const isPerfect = entry.wokeUpOnTime && entry.morningProgramOnTime && entry.mangalaratiAttended && entry.morningClassAttended;
        if (isPerfect) {
          voiceOnTime.push(`*${cleanName(s.name)}* ${strikeStr}`);
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
          voiceLateOrMissed.push(`*${cleanName(s.name)}* ${strikeStr} — ${notes.join(', ')}`);
        }
      }
    });

    lotusStudents.forEach(s => {
      const entry = getEntry(s.id);
      const sStrikes = devoteeStrikesMap[s.id]?.strikes ?? s.monthlyStrikes ?? 0;
      const strikeStr = `_(${isBn ? 'স্ট্রাইক: ' + toBn(sStrikes) : 'Strike: ' + sStrikes})_`;

      if (entry.isAbsent) {
        const reason = formatReasonText(entry.absenceReason, isBn);
        lotusAbsent.push(`*${cleanName(s.name)}* ${strikeStr} — ${reason}`);
      } else {
        const isPerfect = entry.wokeUpOnTime && entry.morningProgramOnTime && entry.mangalaratiAttended && entry.morningClassAttended;
        if (isPerfect) {
          lotusOnTime.push(`*${cleanName(s.name)}* ${strikeStr}`);
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
          lotusLateOrMissed.push(`*${cleanName(s.name)}* ${strikeStr} — ${notes.join(', ')}`);
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
    report += `📊 *${isBn ? 'উপস্থিতি' : 'Attendance'}:* ${toBn(totalOnTime)}/${toBn(totalStudents)} ${isBn ? 'সময়মতো' : 'On-Time'}${totalAbsent > 0 ? ` • ${toBn(totalAbsent)} ${isBn ? 'ছুটি' : 'on Leave'}` : ''}\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    report += `🌟 *${toBn(1)}. ${isBn ? 'ভয়েস গ্রুপ' : 'VOICE GROUP'}*\n`;
    report += `⏰ _${isBn ? 'টার্গেট: এমপি ≤ ৪:৩০ AM • ক্লাস: ৭:০০ AM' : 'Target: MP ≤ 4:30 AM • Class: 7:00 AM'}_\n\n`;
    report += `✅ *${isBn ? 'সময়মতো সম্পন্ন' : 'Completed On-Time'} (${toBn(voiceOnTime.length)}/${toBn(voiceStudents.length)}):*\n`;
    if (voiceOnTime.length === 0) {
      report += `_${isBn ? 'কেউ নেই' : 'None'}_\n`;
    } else {
      voiceOnTime.forEach((item, i) => {
        report += `${toBn(i + 1)}. ${item}\n`;
      });
    }

    if (voiceLateOrMissed.length > 0) {
      report += `\n⚠️ *${isBn ? 'দেরি বা অপূর্ণ' : 'Late / Incomplete'} (${toBn(voiceLateOrMissed.length)}):*\n`;
      voiceLateOrMissed.forEach((item, i) => {
        report += `${toBn(i + 1)}. ${item}\n`;
      });
    }

    if (voiceAbsent.length > 0) {
      report += `\n🕊️ *${isBn ? 'ছুটি / অনুপস্থিত' : 'On Leave / Absent'} (${toBn(voiceAbsent.length)}):*\n`;
      voiceAbsent.forEach((item, i) => {
        report += `${toBn(i + 1)}. ${item}\n`;
      });
    }
    report += `\n━━━━━━━━━━━━━━━━━━━━━\n\n`;

    report += `🪷 *${toBn(2)}. ${isBn ? 'লোটাস গ্রুপ' : 'LOTUS GROUP'}*\n`;
    report += `⏰ _${isBn ? 'টার্গেট: এমপি ≤ ৫:০০ AM • ক্লাস: ৭:০০ AM' : 'Target: MP ≤ 5:00 AM • Class: 7:00 AM'}_\n\n`;
    report += `✅ *${isBn ? 'সময়মতো সম্পন্ন' : 'Completed On-Time'} (${toBn(lotusOnTime.length)}/${toBn(lotusStudents.length)}):*\n`;
    if (lotusOnTime.length === 0) {
      report += `_${isBn ? 'কেউ নেই' : 'None'}_\n`;
    } else {
      lotusOnTime.forEach((item, i) => {
        report += `${toBn(i + 1)}. ${item}\n`;
      });
    }

    if (lotusLateOrMissed.length > 0) {
      report += `\n⚠️ *${isBn ? 'দেরি বা অপূর্ণ' : 'Late / Incomplete'} (${toBn(lotusLateOrMissed.length)}):*\n`;
      lotusLateOrMissed.forEach((item, i) => {
        report += `${toBn(i + 1)}. ${item}\n`;
      });
    }

    if (lotusAbsent.length > 0) {
      report += `\n🕊️ *${isBn ? 'ছুটি / অনুপস্থিত' : 'On Leave / Absent'} (${toBn(lotusAbsent.length)}):*\n`;
      lotusAbsent.forEach((item, i) => {
        report += `${toBn(i + 1)}. ${item}\n`;
      });
    }
    report += `\n━━━━━━━━━━━━━━━━━━━━━\n\n`;

    report += `📊 *${isBn ? 'সারসংক্ষেপ' : 'Summary'}:* ${toBn(totalOnTime)} ${isBn ? 'অন-টাইম' : 'On-Time'} • ${toBn(totalPresent - totalOnTime)} ${isBn ? 'বিলম্ব/আংশিক' : 'Late/Partial'} • ${toBn(totalAbsent)} ${isBn ? 'ছুটি' : 'on Leave'}\n`;
    report += `🙏 *${isBn ? 'রিপোর্ট প্রেরক' : 'Reported by'}:* ${isBn ? 'মর্নিং প্রোগ্রাম ইনচার্জ (অদ্বৈত ভয়েস)' : 'Morning Program Incharge (Advaita VOICE)'}\n`;
    return report;
  };

  const generateSecurityManagerCombinedReport = () => {
    const voiceStudents = students.filter(s => s.group === 'VOICE');
    const lotusStudents = students.filter(s => s.group === 'LOTUS');
    const cleanName = (n?: string | null) => (n || '').replace(/\s*\(Pranto C Das\)/gi, '').replace(/\s*\(Sangakara Das\)/gi, '').trim();

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
        voiceDevoteesList.push(`${toBn(i + 1)}. *${cleanName(s.name)}* — ${isBn ? 'ছুটি / অনুপস্থিত' : 'On Leave'} (${reason})`);
      } else if (entry.sleptOnTime) {
        totalCompliant++;
        voiceDevoteesList.push(`${toBn(i + 1)}. *${cleanName(s.name)}* — ${isBn ? 'শয়নে উপস্থিত (বিছানায়)' : 'In bed'}`);
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
        voiceDevoteesList.push(`${toBn(i + 1)}. *${cleanName(s.name)}* — ${isBn ? 'বিছানায় নেই' : 'Not in bed'}${note}`);
      }
    });

    lotusStudents.forEach((s, i) => {
      const entry = getEntry(s.id);
      if (entry.isAbsent) {
        totalAbsent++;
        const reason = formatReasonText(entry.absenceReason, isBn);
        lotusDevoteesList.push(`${toBn(i + 1)}. *${cleanName(s.name)}* — ${isBn ? 'ছুটি / অনুপস্থিত' : 'On Leave'} (${reason})`);
      } else if (entry.sleptOnTime) {
        totalCompliant++;
        lotusDevoteesList.push(`${toBn(i + 1)}. *${cleanName(s.name)}* — ${isBn ? 'শয়নে উপস্থিত (বিছানায়)' : 'In bed'}`);
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
        lotusDevoteesList.push(`${toBn(i + 1)}. *${cleanName(s.name)}* — ${isBn ? 'বিছানায় নেই' : 'Not in bed'}${note}`);
      }
    });

    const totalStudents = students.length;

    let report = isBn
      ? `🌙 *অদ্বৈত ভয়েস — নৈশ শৃঙ্খলা ও নিরাপত্তা সমন্বিত প্রতিবেদন* 🌙\n`
      : `🌙 *ADVAITA VOICE — NIGHT DISCIPLINE & SECURITY REPORT* 🌙\n`;
    report += `📅 *${isBn ? 'তারিখ' : 'Date'}:* ${dateFormatted}\n`;
    report += `🔒 *${isBn ? 'কারফিউ ও শয়ন মানদণ্ড' : 'Curfew & Bedtime Compliance'}:* ${toBn(totalCompliant)}/${toBn(totalStudents)} ${isBn ? 'সময়মতো শয়ন' : 'Slept On Time'}${totalAbsent > 0 ? ` • ${toBn(totalAbsent)} ${isBn ? 'নৈশ ছুটি' : 'on Leave'}` : ''}\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    report += `🌟 *${toBn(1)}. ${isBn ? 'ভয়েস ভক্তবৃন্দ' : 'VOICE Devotees'}*\n`;
    report += `⏰ _${isBn ? 'পর্যবেক্ষণ: ১০:১০ PM' : 'Observation: 10:10 PM'}_\n\n`;
    report += voiceDevoteesList.join('\n') + '\n\n';
    report += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    report += `🪷 *${toBn(2)}. ${isBn ? 'লোটাস ভক্তবৃন্দ' : 'Lotus Devotees'}*\n`;
    report += `⏰ _${isBn ? 'পর্যবেক্ষণ: ১১:০০ PM' : 'Observation: 11:00 PM'}_\n\n`;
    report += lotusDevoteesList.join('\n') + '\n\n';
    report += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    report += `📊 *${isBn ? 'সারসংক্ষেপ' : 'Summary'}:* ${toBn(totalCompliant)} ${isBn ? 'সময়মতো শয়ন' : 'In Bed'} • ${toBn(totalNonCompliant)} ${isBn ? 'বিলম্ব/অনুপস্থিত' : 'Late/Awake'} • ${toBn(totalAbsent)} ${isBn ? 'নৈশ ছুটি' : 'on Leave'}\n`;
    report += `🙏 *${isBn ? 'রিপোর্ট প্রেরক' : 'Reported by'}:* ${isBn ? 'সিকিউরিটি ও এনার্জি ম্যানেজার (অদ্বৈত ভয়েস)' : 'Security & Energy Manager (Advaita VOICE)'}\n`;
    return report;
  };


  const monthlyStats = useMemo<MonthlyDevoteeStats[]>(() => {
    // Only evaluate dates in the month that have actual audited records
    const recordedDatesInMonth = Object.keys(dailyRecords).filter(d => 
      d.startsWith(selectedVerdictMonth) && dailyRecords[d] && Object.keys(dailyRecords[d]).length > 0
    );
    const monthDates = recordedDatesInMonth.sort();

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

    const [year, month] = (selectedVerdictMonth || '').split('-');
    const monthDate = (!year || !month) ? new Date() : new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const monthFormatted = safeFormatDate(monthDate, { month: 'long', year: 'numeric' });

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

  const copyToClipboard = async (text: string, type: 'MP' | 'NIGHT' | 'MONTHLY') => {
    try {
      await navigator.clipboard.writeText(text);
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
    Object.keys(dailyRecords).forEach(d => {
      if (d && typeof d === 'string' && /^\d{4}-\d{2}-\d{2}/.test(d)) {
        dates.add(d.split('T')[0]);
      }
    });

    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth() + 1;
    const curDay = now.getDate();
    for (let day = 1; day <= curDay; day++) {
      const dStr = `${curYear}-${String(curMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dates.add(dStr);
    }
    if (dateIso && /^\d{4}-\d{2}-\d{2}/.test(dateIso)) dates.add(dateIso);
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

              {/* Date & Today: Minimal, Professional 2-Column Side-by-Side Boxes */}
              <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[auto_auto] gap-2 items-center w-full md:w-auto">
                {/* Column 1: Date Navigation Box */}
                <div className="relative flex items-center justify-between gap-1 bg-white/10 dark:bg-slate-900/60 backdrop-blur-md px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-2xl border border-white/20 shadow-sm min-w-0">
                  <button 
                    type="button"
                    onClick={() => changeDate(-1)} 
                    className="p-1.5 hover:bg-white/20 active:scale-90 rounded-xl text-white transition-all cursor-pointer shrink-0"
                    title={isBn ? 'পূর্ববর্তী দিন' : 'Previous Day'}
                  >
                    <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  
                  <label className="flex items-center justify-center gap-1.5 px-1.5 sm:px-2 py-1 min-w-0 cursor-pointer group select-none">
                    <Calendar size={14} className="text-amber-300 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-extrabold text-xs sm:text-sm text-white truncate text-center group-hover:text-amber-200 transition-colors">
                      <span className="hidden sm:inline">{dateFormatted}</span>
                      <span className="sm:hidden">{dateFormattedShort}</span>
                    </span>
                    <input 
                      type="date" 
                      value={dateIso} 
                      onChange={(e) => {
                        if (e.target.value) {
                          setSelectedDate(parseIsoDate(e.target.value));
                        }
                      }} 
                      className="sr-only" 
                    />
                  </label>

                  <button 
                    type="button"
                    onClick={() => changeDate(1)} 
                    className="p-1.5 hover:bg-white/20 active:scale-90 rounded-xl text-white transition-all cursor-pointer shrink-0"
                    title={isBn ? 'পরবর্তী দিন' : 'Next Day'}
                  >
                    <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>

                {/* Column 2: Today Button Box */}
                <button 
                  type="button"
                  onClick={() => setSelectedDate(new Date())} 
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-black rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shrink-0 active:scale-95 ${
                    isToday
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300/80 shadow-amber-500/20 font-black'
                      : 'bg-white/15 hover:bg-white/25 text-white border border-white/20 hover:border-white/30'
                  }`}
                  title={isBn ? 'আজকের তারিখে ফিরে যান' : 'Jump to Today'}
                >
                  <Sparkles size={13} className={isToday ? 'text-slate-950' : 'text-amber-300'} />
                  <span className="font-black">{isBn ? 'আজ' : 'Today'}</span>
                </button>
              </div>
            </div>

            {/* Groups in 2 Columns: Minimal, Clean, Beautiful Side-by-Side Boxes */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1">
              {/* Box 1: VOICE Group */}
              <button 
                type="button"
                onClick={() => setActiveTab('VOICE')}
                className={`p-2.5 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 sm:gap-2 shadow-xs group ${
                  activeTab === 'VOICE'
                    ? 'bg-amber-500/20 border-amber-400/50 text-white ring-2 ring-amber-400/40 shadow-md'
                    : 'bg-amber-500/10 border-amber-400/20 text-amber-100 hover:bg-amber-500/15'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-black text-amber-300 text-xs sm:text-sm flex items-center gap-1.5 truncate">
                    <span className="text-sm sm:text-base">🌟</span>
                    <span className="truncate">{isBn ? 'ভয়েস গ্রুপ' : 'VOICE Group'}</span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono font-black bg-amber-400/25 text-amber-200 px-2 py-0.5 rounded-full shrink-0 border border-amber-400/30">
                    {voiceCount} {isBn ? 'জন' : ''}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-amber-100/80 leading-snug font-medium">
                  {isBn ? 'শয়ন ≤ ১০টা • জাগরণ ৪টা • এমপি ≤ ৪:৩০ • ক্লাস' : 'Bed ≤ 10 PM • Wake 4 AM • MP ≤ 4:30 • Class'}
                </p>
              </button>

              {/* Box 2: Lotus Group */}
              <button 
                type="button"
                onClick={() => setActiveTab('LOTUS')}
                className={`p-2.5 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 sm:gap-2 shadow-xs group ${
                  activeTab === 'LOTUS'
                    ? 'bg-indigo-500/25 border-indigo-400/50 text-white ring-2 ring-indigo-400/40 shadow-md'
                    : 'bg-indigo-500/10 border-indigo-400/20 text-indigo-100 hover:bg-indigo-500/15'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-black text-indigo-300 text-xs sm:text-sm flex items-center gap-1.5 truncate">
                    <span className="text-sm sm:text-base">🪷</span>
                    <span className="truncate">{isBn ? 'লোটাস গ্রুপ' : 'Lotus Group'}</span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono font-black bg-indigo-400/25 text-indigo-200 px-2 py-0.5 rounded-full shrink-0 border border-indigo-400/30">
                    {lotusCount} {isBn ? 'জন' : ''}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-indigo-100/80 leading-snug font-medium">
                  {isBn ? 'শয়ন ≤ ১১টা • এমপি ≤ ৫:০০ • মঙ্গল ও ক্লাস' : 'Bed ≤ 11 PM • MP ≤ 5:00 AM • Class'}
                </p>
              </button>
            </div>

          </div>
        </div>

        {/* Two Major Feature Action Cards: Sleek, Compact & Beautiful Side-by-Side Boxes */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Card 1: Audit History & Log */}
          <button
            type="button"
            onClick={() => setIsHistoryModalOpen(true)}
            className="group relative overflow-hidden text-left p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-amber-500/[0.06] via-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 border border-slate-200/90 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/40 shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98] flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <History size={15} className="sm:w-4 sm:h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-amber-500 flex items-center gap-0.5 transition-colors">
                {isBn ? 'লগ' : 'Logs'}
                <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                {isBn ? 'অডিট হিস্ট্রি' : 'Audit History Log'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                {isBn ? 'অতীত সাধনা ও রেকর্ড' : 'Timeline & past logs'}
              </p>
            </div>
          </button>

          {/* Card 2: Monthly Verdict & Report */}
          <button
            type="button"
            onClick={() => setIsMonthlyVerdictModalOpen(true)}
            className="group relative overflow-hidden text-left p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-amber-500/[0.12] via-amber-500/[0.04] to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border border-amber-500/35 dark:border-amber-500/30 hover:border-amber-500/60 shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98] flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Award size={15} className="sm:w-4 sm:h-4" />
              </div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                {isBn ? 'মাসিক' : 'Monthly'}
                <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                {isBn ? 'মাসিক মূল্যায়ন' : 'Monthly Verdict'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                {isBn ? 'পারফরম্যান্স ও রিপোর্ট' : 'Analytics & reports'}
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
                  <span 
                    title={lastCloudSyncTime ? (isBn ? `সর্বশেষ সিঙ্ক: ${lastCloudSyncTime.toLocaleTimeString()}` : `Last cloud sync: ${lastCloudSyncTime.toLocaleTimeString()}`) : undefined}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                      isCloudSyncing
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isCloudSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <span>{isCloudSyncing ? (isBn ? 'সিঙ্ক হচ্ছে...' : 'Syncing...') : (isBn ? 'ক্লাউড সিঙ্ক' : 'Cloud Synced')}</span>
                  </span>
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

            {/* Admin Controls: Incharges Management Page Link */}
            {isUserAdmin && (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/discipline-audit/roles"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition shadow-xs"
                  title={isBn ? 'ইনচার্জ ও জিমেইল নির্ধারণ করুন' : 'Assign & manage incharge Gmails'}
                >
                  <Shield size={14} />
                  <span>{isBn ? 'ইনচার্জ ব্যবস্থাপনা' : 'Manage Incharges'}</span>
                  <ExternalLink size={12} className="opacity-70" />
                </Link>
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

        {/* Strict Ashram 2-Rule Strike Policy Info Banner */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-950 dark:text-amber-200 flex items-start sm:items-center gap-2.5 shadow-xs">
          <span className="text-xl shrink-0 mt-0.5 sm:mt-0">⚖️</span>
          <div className="space-y-0.5">
            <span className="font-black text-[11px] sm:text-xs uppercase tracking-wider block text-amber-900 dark:text-amber-300">
              {isBn ? 'আশ্রম শৃঙ্খলার স্ট্রাইক নীতি (Strict 2-Rule Strike Policy)' : 'Ashram Strike Policy (Strict 2 Rules Only)'}
            </span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {isBn 
                ? 'স্ট্রাইক শুধুমাত্র এবং শুধুমাত্র এই ২টি নিয়মের ব্যত্যয়ের জন্য কার্যকর হয় (কোনো কারণ বা অজুহাত গ্রহণযোগ্য নয়): ১. সময়মতো শয়ন (ভয়েস: ১০:০০ PM, লোটাস: ১১:০০ PM), ২. সময়মতো মর্নিং প্রোগ্রামে প্রবেশ (ভয়েস: ≤ ৪:৩০ AM, লোটাস: ≤ ৫:০০ AM)। ক্লাস ও মঙ্গল আরতি মিস হওয়া সাধনায় নথিভুক্ত থাকে কিন্তু স্ট্রাইকে গণনা হয় না।'
                : 'Disciplinary strikes strictly apply to 2 rules only (no excuse for any reason): 1. Timely Bedtime (VOICE: <=10:00 PM, Lotus: <=11:00 PM), 2. Timely Morning Entry (VOICE: <=4:30 AM, Lotus: <=5:00 AM). Missed class/mangalarati are logged for sadhana records but do not count as strikes.'}
            </p>
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
            <div className="flex items-center gap-2">
              {isPrivileged && (
                <button
                  type="button"
                  onClick={() => syncDateRecordsToCloud(dateIso)}
                  disabled={isCloudSyncing}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  title="Save and synchronize today's entire discipline record and updated strikes directly to Supabase cloud"
                >
                  <Save size={13} className={isCloudSyncing ? 'animate-spin' : ''} />
                  <span>{isCloudSyncing ? (isBn ? 'সিঙ্ক হচ্ছে...' : 'Syncing...') : (isBn ? 'ক্লাউডে সেভ ও সিঙ্ক' : 'Save & Sync Day')}</span>
                </button>
              )}
              <span className="text-[10.5px] font-bold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 hidden sm:inline-block">
                {isBn ? `মোট ${students.length} জন ভক্ত` : `${students.length} Devotees`}
              </span>
            </div>
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
                    syncDateRecordsToCloud(dateIso, true);
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
                    syncDateRecordsToCloud(dateIso, true);
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
                    syncDateRecordsToCloud(dateIso, true);
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
                    syncDateRecordsToCloud(dateIso, true);
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
                  id={`student-card-${student.id}`}
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

                                <button
                                  type="button"
                                  onClick={() => {
                                    setHistorySelectedStudentId(student.id);
                                    setIsHistoryModalOpen(true);
                                  }}
                                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs transition-colors"
                                  title={isBn ? 'এই ভক্তের হিস্ট্রি ও টাইমলাইন দেখুন' : "View this devotee's history & timeline"}
                                >
                                  <History size={10} />
                                  <span>{isBn ? 'হিস্ট্রি' : 'History'}</span>
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
                        
                        <div className="flex items-center gap-3">
                          {canEditStrikes && (
                            <button
                              type="button"
                              onClick={() => handleOpenStrikeModal(targetStudent.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                              title={isBn ? 'স্ট্রাইক সমন্বয় করুন' : 'Adjust Strikes'}
                            >
                              <AlertCircle size={14} />
                              <span>{isBn ? '⚡ স্ট্রাইক পরিবর্তন' : '⚡ Adjust Strikes'}</span>
                            </button>
                          )}
                          <div className="text-right sm:border-l sm:border-white/15 sm:pl-4 shrink-0">
                            <div className="text-[11px] text-slate-400 font-medium">{isBn ? 'সাধনা সাফল্যের হার' : 'Sadhana Success Rate'}</div>
                            <div className={`text-xl font-mono font-black ${
                              overallRate >= 90 ? 'text-emerald-400' : overallRate >= 75 ? 'text-amber-400' : 'text-rose-400'
                            }`}>
                              {overallRate}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                        {recordedDates.map(date => {
                          const entry = getEntry(targetStudent.id, date);
                          const dateLabel = safeFormatDate(date, { 
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

                                  {entry.isEmergency && (
                                    <span 
                                      className="px-2 py-0.5 rounded font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center gap-1 shadow-2xs" 
                                      title={entry.reason || 'Emergency Medical Exemption'}
                                    >
                                      <span>🏥</span>
                                      <span>{isBn ? 'জরুরি ছাড় (স্ট্রাইক মওকুফ)' : 'Exempt (Emergency/Illness)'}</span>
                                    </span>
                                  )}
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDate(parseIsoDate(date));
                                  setIsHistoryModalOpen(false);
                                  toast.success(isBn ? `${date} এর অডিট খোলা হয়েছে` : `Opened audit for ${date}`);
                                  setTimeout(() => {
                                    const el = document.getElementById(`student-card-${targetStudent.id}`);
                                    if (el) {
                                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                      el.classList.add('ring-2', 'ring-amber-500');
                                      setTimeout(() => el.classList.remove('ring-2', 'ring-amber-500'), 2500);
                                    }
                                  }, 150);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold text-[11px] border border-indigo-200 dark:border-indigo-800/60 transition-colors shrink-0 cursor-pointer ml-auto sm:ml-0 shadow-2xs"
                                title={isBn ? 'এই দিনের তথ্য সম্পাদনা করুন' : "Edit this day's discipline"}
                              >
                                <Edit size={12} />
                                <span>{isBn ? 'সম্পাদনা' : 'Edit Day'}</span>
                              </button>
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
                    const formattedDate = safeFormatDate(date, { 
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
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
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

                {/* Quick Presets for 1-Click Update */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
                    {isBn ? 'কুইক প্রিসেট:' : 'Quick Presets:'}
                  </span>
                  {[
                    { label: isBn ? '০ ক্লিন' : '0 Clean', val: 0, cls: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' },
                    { label: isBn ? '১ সতর্কবার্তা' : '1 Warning', val: 1, cls: 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-800' },
                    { label: isBn ? '২ চূড়ান্ত' : '2 Final', val: 2, cls: 'bg-orange-50 hover:bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-300 dark:border-orange-800' },
                    { label: isBn ? '৩ অবনমন' : '3 Demote', val: 3, cls: 'bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300 dark:border-rose-800' },
                  ].map(preset => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setPendingStrikeCount(preset.val)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${preset.cls} ${
                        pendingStrikeCount === preset.val ? 'ring-2 ring-rose-500 shadow-xs scale-105 font-black' : ''
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
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
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-900 dark:text-amber-200 font-semibold leading-relaxed">
                    📌 {isBn ? 'স্ট্রাইক গণনা নীতি: শুধুমাত্র ২টি নিয়মে স্ট্রাইক কার্যকর হয় (কোনো কারণ বা অজুহাত গ্রহণযোগ্য নয়): ১. সময়মতো শয়ন (১০টা / ১১টা), ২. সময়মতো মর্নিং প্রোগ্রামে প্রবেশ (৪:৩০ / ৫:০০)। ক্লাস বা মঙ্গল আরতি মিস স্ট্রাইকে গণনা হয় না।' : 'Strike Policy: Strictly applied to 2 rules only (no excuse for any reason): 1. Bedtime Curfew (10 PM / 11 PM), 2. Morning Entry (<=4:30 AM / <=5:00 AM). Missed class/mangalarati are not counted as strikes.'}
                  </div>
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

const SafeAshramDisciplineAudit: React.FC = () => {
  return (
    <ErrorBoundary fallbackTitle="শৃঙ্খলা অডিট পেইজ লোড করতে সাময়িক সমস্যা হয়েছে">
      <AshramDisciplineAudit />
    </ErrorBoundary>
  );
};

export default SafeAshramDisciplineAudit;
