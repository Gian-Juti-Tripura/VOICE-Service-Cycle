import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, Calendar, Check, Copy, 
  ChevronLeft, ChevronRight, 
  Moon, Sun, X, Send,
  History, Award,
  Download, Shield, Eye, ExternalLink, Key, UserCheck,
  RefreshCw, Clock, AlertTriangle
} from 'lucide-react';
import { supabase } from '../../supabase/supabaseClient';
import { 
  type GroupType, 
  type DisciplineAuditorRole,
  type StudentDisciplineRecord, 
  type DailyDisciplineEntry, 
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
  autoMigrateLocalDataToSupabase
} from '../../services/disciplineStorageService';
import { shareToWhatsAppOrSystem } from '../../utils/shareUtils';
import { exportTableToPdf } from '../../lib/exportTablePdf';
import { triggerHaptic } from '../../utils/haptics';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import toast from 'react-hot-toast';

const STORAGE_STUDENTS_KEY = 'advaita_discipline_students_v6';
const STORAGE_DAILY_KEY = 'advaita_discipline_daily_v6';

export const MORNING_LATE_REASONS = [
  'ঘুম ভাঙতে দেরি / ক্লান্তি',
  'শারীরিক অসুস্থতা / অস্বস্তি',
  'রাতে দেরিতে ঘুমানো / পড়া',
  'স্নানে বা প্রস্তুতিতে বিলম্ব',
  'মন্দির / আশ্রমের সেবা',
  'পরীক্ষার বিশেষ প্রস্তুতি',
  'বিশ্ববিদ্যালয় ক্লাস / ল্যাব',
  'ব্যক্তিগত জরুরি কারণ',
  'অন্যান্য'
];

export const NIGHT_LATE_REASONS = [
  'পরীক্ষার বিশেষ প্রস্তুতি',
  'মন্দির সেবা / বিশেষ দায়িত্ব',
  'দেরিতে ঘুম / ক্লান্তি',
  'অধ্যয়ন / গ্রুপ স্টাডি',
  'শারীরিক অসুস্থতা / বিশ্রাম',
  'ব্যক্তিগত জরুরি কারণ',
  'অন্যান্য'
];

export const ABSENCE_REASONS_LIST = [
  'গ্রামের বাড়ি / পারিবারিক ছুটি',
  'শারীরিক অসুস্থতা / চিকিৎসা',
  'বিশ্ববিদ্যালয় পরীক্ষা / একাডেমিক',
  'মন্দির বা বিশেষ প্রচার সেবা',
  'ব্যক্তিগত জরুরি ছুটি',
  'অন্যান্য'
];

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
  const { user, role: authRole, logout } = useAuth();
  const isBn = language === 'bn';

  // Smart initial mode based on current time:
  // After 7:00 PM or before 4:00 AM -> Default to NIGHT, otherwise MORNING
  const [auditMode, setAuditMode] = useState<'MORNING' | 'NIGHT'>(() => {
    const hr = new Date().getHours();
    return (hr >= 19 || hr < 4) ? 'NIGHT' : 'MORNING';
  });

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [students, setStudents] = useState<StudentDisciplineRecord[]>(() => getCachedDisciplineStudents());
  const [dailyRecords, setDailyRecords] = useState<Record<string, Record<string, DailyDisciplineEntry>>>(() => getCachedDailyRecords());
  const [assignments, setAssignments] = useState<DisciplineAuditorAssignment[]>(() => getCachedAuditorAssignments());
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<Date | null>(null);

  // Modals
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState<boolean>(false);
  const [monthlyModalTab, setMonthlyModalTab] = useState<'MATRIX' | 'VERDICT'>('MATRIX');
  const [selectedVerdictMonth, setSelectedVerdictMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [previewReport, setPreviewReport] = useState<{ title: string; content: string } | null>(null);

  // Sanga Night Mode customizable observation & reporting times
  const [nightVoiceObserved, setNightVoiceObserved] = useState<string>('10:00 PM');
  const [nightLotusObserved, setNightLotusObserved] = useState<string>('11:00 PM');
  const [nightReportingTime, setNightReportingTime] = useState<string>(() => {
    const now = new Date();
    let hours = now.getHours() % 12 || 12;
    let minutes = now.getMinutes();
    const minStr = minutes < 10 ? '0' + minutes : String(minutes);
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `${String(hours).padStart(2, '0')}:${minStr} ${ampm}`;
  });

  const currentUserEmail = user?.email?.toLowerCase().trim();
  const isMaster = isMasterAdmin(currentUserEmail);
  const assignedRoleForUser = getAuditorRoleForEmail(currentUserEmail, assignments);
  const isUserAdmin = isMaster || authRole === 'ADMIN' || assignedRoleForUser === 'ADMIN';

  const effectiveAuditorRole: DisciplineAuditorRole = useMemo(() => {
    if (!user) return 'VIEWER';
    if (isUserAdmin) return 'ADMIN';
    if (assignedRoleForUser && assignedRoleForUser !== 'VIEWER') return assignedRoleForUser;
    return 'VIEWER';
  }, [user, isUserAdmin, assignedRoleForUser]);

  // Admin and Managers have rights to manually edit devotee groups (VOICE ⇄ LOTUS)
  const canEditGroup = useMemo(() => {
    if (isUserAdmin) return true;
    if (authRole === 'INTERNAL_MANAGER') return true;
    if (effectiveAuditorRole === 'ADMIN' || effectiveAuditorRole === 'INTERNAL_MANAGER') return true;
    return false;
  }, [isUserAdmin, authRole, effectiveAuditorRole]);

  // Background Cloud Sync & Realtime Listener
  useEffect(() => {
    let isMounted = true;
    setIsCloudSyncing(true);

    Promise.all([
      getAuditorAssignments(),
      autoMigrateLocalDataToSupabase(),
      fetchDisciplineStudents(),
      fetchDailyDisciplineLogs()
    ]).then(([liveAssignments, _, cloudStudents, cloudDaily]) => {
      if (!isMounted) return;
      if (liveAssignments && liveAssignments.length > 0) setAssignments(liveAssignments);
      if (cloudStudents && cloudStudents.length > 0) setStudents(cloudStudents);
      if (cloudDaily && Object.keys(cloudDaily).length > 0) setDailyRecords(cloudDaily);
      setLastCloudSyncTime(new Date());
      setIsCloudSyncing(false);
    }).catch(err => {
      console.warn('Initial cloud discipline sync warning:', err);
      if (isMounted) setIsCloudSyncing(false);
    });

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

  // Save to LocalStorage safely
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

  // Safe formatting helpers
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

  useEffect(() => {
    const viewedMonth = dateIso.slice(0, 7);
    setSelectedVerdictMonth(viewedMonth);
  }, [dateIso]);

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

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
    triggerHaptic('light');
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

  // Strict 2-rule strike evaluation (ONLY 2 rules trigger strikes: Late Bed, Late MP)
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

  // Instant update with 2-way Supabase and LocalStorage sync
  const updateEntry = (studentId: string, updates: Partial<DailyDisciplineEntry>, customDateIso = dateIso) => {
    const current = getEntry(studentId, customDateIso);
    const updated: DailyDisciplineEntry = { ...current, ...updates };

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

    const reporter = currentUserEmail || (effectiveAuditorRole === 'ADMIN' ? 'Admin' : 'Incharge');
    saveDailyDisciplineEntryToCloud(updated, reporter).catch(err => {
      console.warn('Cloud sync error for entry update:', err);
    });

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
      // STOP AUTO PUSH: Devotee group is NEVER automatically changed to LOTUS upon reaching strikes.
      // Group changes are strictly manual decisions by Admin and Managers.
      const currentGroup: GroupType = targetStudent.group;

      if (newStrikes === 1 || newStrikes === 2) {
        newStatus = 'WARNED';
      } else if (newStrikes >= 3) {
        newStatus = newStrikes >= 5 ? 'DISMISSED' : 'DEMOTION_DUE';
      }

      if (targetStudent.monthlyStrikes !== newStrikes || targetStudent.status !== newStatus) {
        const updatedStudents = students.map(s => 
          s.id === studentId 
            ? { ...s, monthlyStrikes: newStrikes, status: newStatus } 
            : s
        );
        setStudents(updatedStudents);
        try {
          localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(updatedStudents));
        } catch (e) {
          console.warn('LocalStorage save failed for students:', e);
        }

        updateStudentStrikesInCloud(studentId, newStrikes, newStatus, currentGroup).catch(err => {
          console.warn('Failed to update student strikes in Supabase:', err);
        });
      }
    }
  };

  // Manual Devotee Group Switcher (Exclusively for Admin & Managers)
  const handleUpdateDevoteeGroup = async (studentId: string, newGroup: GroupType) => {
    if (!canEditGroup) {
      toast.error('শুধুমাত্র অ্যাডমিন এবং ম্যানেজার গ্রুপ পরিবর্তন করতে পারবেন');
      return;
    }

    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;
    if (targetStudent.group === newGroup) return;

    const updatedStudents = students.map(s => 
      s.id === studentId ? { ...s, group: newGroup } : s
    );
    setStudents(updatedStudents);

    try {
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(updatedStudents));
    } catch (e) {
      console.warn('LocalStorage save failed for student group update:', e);
    }

    try {
      await updateStudentStrikesInCloud(studentId, targetStudent.monthlyStrikes, targetStudent.status, newGroup);
      toast.success(`${cleanName(targetStudent.name)} এর গ্রুপ ${newGroup}-এ পরিবর্তন করা হয়েছে`);
    } catch (err) {
      console.warn('Supabase group update error:', err);
      toast.success(`${cleanName(targetStudent.name)} এর গ্রুপ ${newGroup}-এ পরিবর্তন করা হয়েছে (Local)`);
    }
  };

  // Strikes map for all students in current selected verdict month
  const devoteeStrikesMap = useMemo(() => {
    const recordedDatesInMonth = Object.keys(dailyRecords).filter(d => 
      d.startsWith(selectedVerdictMonth) && dailyRecords[d] && Object.keys(dailyRecords[d]).length > 0
    );
    const monthDates = recordedDatesInMonth.sort();
    const map: Record<string, { autoStrikes: number; strikes: number }> = {};

    students.forEach(student => {
      let violationDaysCount = 0;
      monthDates.forEach(d => {
        const entry = (dailyRecords[d] && dailyRecords[d][student.id]) || getEntry(student.id, d);
        if (!entry || entry.isAbsent) return;
        if (!entry.sleptOnTime || !entry.morningProgramOnTime) {
          violationDaysCount++;
        }
      });

      const autoStrikes = violationDaysCount;
      const manualDelta = student.manualStrikeDelta ?? 0;
      const strikes = Math.max(0, autoStrikes + manualDelta);

      map[student.id] = { autoStrikes, strikes };
    });

    return map;
  }, [dailyRecords, students, selectedVerdictMonth]);

  // Clean student name
  const cleanName = (n?: string | null) => (n || '').replace(/\s*\(Pranto C Das\)/gi, '').replace(/\s*\(Sangakara Das\)/gi, '').trim();

  // Full Month Dates for Matrix
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

  // Sanga's Authentic Night Status WhatsApp Report Generator (from sanga.html)
  const generateSangaNightReport = (): string => {
    const d = selectedDate;
    const day = d.getDate();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[d.getDay()];

    const vObs = nightVoiceObserved || '10:00 PM';
    const lObs = nightLotusObserved || '11:00 PM';
    const repTime = nightReportingTime || '10:00 PM';

    let text = `*Night Status Report*\n\n`;
    text += `Date: ${day} ${monthName}, ${year} ( ${dayName} )\n`;
    text += `Reporting Time: ${repTime}.\n\n`;

    const voiceList = students.filter(s => s.group === 'VOICE');
    const lotusList = students.filter(s => s.group === 'LOTUS');

    text += `*𝒱𝑜𝒾𝒸𝑒 𝒟𝑒𝓋𝑜𝓉𝑒𝑒𝓈* (Observed at ${vObs}).\n\n`;
    voiceList.forEach(s => {
      const entry = getEntry(s.id);
      const name = cleanName(s.name).endsWith('Prabhu') ? cleanName(s.name) : `${cleanName(s.name)} Prabhu`;
      if (entry.isAbsent) {
        const reason = entry.absenceReason ? ` (${formatReasonText(entry.absenceReason, isBn)})` : '';
        text += `*•${name}:*  Absent ${reason}.\n`;
      } else if (!entry.sleptOnTime) {
        const reason = entry.reason ? `(${formatReasonText(entry.reason, isBn)})` : (entry.bedLateMinutes ? `(${entry.bedLateMinutes}m late)` : '(Late Bed)');
        text += `*•${name}:* Not In bed.${reason}\n`;
      } else {
        text += `*•${name}:* In bed.\n`;
      }
    });

    text += `\n*𝐿𝑜𝓉𝓊𝓈 𝒟𝑒𝓋𝑜𝓉𝑒𝑒𝓈* (Observed at ${lObs})\n\n`;
    lotusList.forEach(s => {
      const entry = getEntry(s.id);
      const name = cleanName(s.name).endsWith('Prabhu') ? cleanName(s.name) : `${cleanName(s.name)} Prabhu`;
      if (entry.isAbsent) {
        const reason = entry.absenceReason ? ` (${formatReasonText(entry.absenceReason, isBn)})` : '';
        text += `*•${name}:*  Absent ${reason}.\n`;
      } else if (!entry.sleptOnTime) {
        const reason = entry.reason ? `(${formatReasonText(entry.reason, isBn)})` : (entry.bedLateMinutes ? `(${entry.bedLateMinutes}m late)` : '(Late Bed)');
        text += `*•${name}:* Not In bed.${reason}\n`;
      } else {
        text += `*•${name}:* In bed.\n`;
      }
    });

    return text;
  };

  // Morning Program WhatsApp Report Generator
  const generateMorningProgramReport = (): string => {
    const voiceStudents = students.filter(s => s.group === 'VOICE');
    const lotusStudents = students.filter(s => s.group === 'LOTUS');

    const voiceOnTime: string[] = [];
    const voiceLate: string[] = [];
    const voiceAbsent: string[] = [];

    const lotusOnTime: string[] = [];
    const lotusLate: string[] = [];
    const lotusAbsent: string[] = [];

    voiceStudents.forEach(s => {
      const entry = getEntry(s.id);
      const name = cleanName(s.name);
      if (entry.isAbsent) {
        voiceAbsent.push(`*${name}* — ${formatReasonText(entry.absenceReason, isBn)}`);
      } else if (entry.morningProgramOnTime) {
        voiceOnTime.push(name);
      } else {
        const lateMins = entry.mpLateMinutes ? ` (+${entry.mpLateMinutes} মি.)` : '';
        const r = entry.reason ? ` — ${formatReasonText(entry.reason, isBn)}` : '';
        voiceLate.push(`*${name}*${lateMins}${r}`);
      }
    });

    lotusStudents.forEach(s => {
      const entry = getEntry(s.id);
      const name = cleanName(s.name);
      if (entry.isAbsent) {
        lotusAbsent.push(`*${name}* — ${formatReasonText(entry.absenceReason, isBn)}`);
      } else if (entry.morningProgramOnTime) {
        lotusOnTime.push(name);
      } else {
        const lateMins = entry.mpLateMinutes ? ` (+${entry.mpLateMinutes} মি.)` : '';
        const r = entry.reason ? ` — ${formatReasonText(entry.reason, isBn)}` : '';
        lotusLate.push(`*${name}*${lateMins}${r}`);
      }
    });

    const totalOnTime = voiceOnTime.length + lotusOnTime.length;
    const totalDevotees = students.length;

    let report = `🌅 *ADVAITA VOICE — MORNING PROGRAM REPORT* 🌅\n`;
    report += `📅 *Date:* ${dateFormatted}\n`;
    report += `📊 *Attendance:* ${totalOnTime}/${totalDevotees} On-Time${(voiceAbsent.length + lotusAbsent.length) > 0 ? ` • ${voiceAbsent.length + lotusAbsent.length} on Leave` : ''}\n`;
    report += `───────────────────────────\n`;

    report += `🌟 *1. VOICE GROUP* _(MP: ≤ 4:30 AM | Class: 7:00 AM)_\n\n`;
    report += `✅ *Completed On-Time (${voiceOnTime.length}/${voiceStudents.length}):*\n`;
    voiceOnTime.forEach((name, i) => {
      report += `   ${i + 1}. ${name}\n`;
    });

    if (voiceLate.length > 0) {
      report += `\n⚠️ *Late to Morning Program (${voiceLate.length}):*\n`;
      voiceLate.forEach((item, i) => {
        report += `   ${i + 1}. ❌ ${item}\n`;
      });
    }

    if (voiceAbsent.length > 0) {
      report += `\n🕊️ *On Leave / Absent (${voiceAbsent.length}):*\n`;
      voiceAbsent.forEach((item, i) => {
        report += `   ${i + 1}. ${item}\n`;
      });
    }

    report += `───────────────────────────\n`;
    report += `🪷 *2. LOTUS GROUP* _(MP: ≤ 5:00 AM | Class: 7:00 AM)_\n\n`;
    report += `✅ *Completed On-Time (${lotusOnTime.length}/${lotusStudents.length}):*\n`;
    lotusOnTime.forEach((name, i) => {
      report += `   ${i + 1}. ${name}\n`;
    });

    if (lotusLate.length > 0) {
      report += `\n⚠️ *Late to Morning Program (${lotusLate.length}):*\n`;
      lotusLate.forEach((item, i) => {
        report += `   ${i + 1}. ❌ ${item}\n`;
      });
    }

    if (lotusAbsent.length > 0) {
      report += `\n🕊️ *On Leave / Absent (${lotusAbsent.length}):*\n`;
      lotusAbsent.forEach((item, i) => {
        report += `   ${i + 1}. ${item}\n`;
      });
    }

    report += `───────────────────────────\n`;
    report += `🙏 *Reported by:* Morning Program Incharge (Advaita VOICE)\n`;
    return report;
  };

  // Monthly Analytics & Verdict Report
  const monthlyStats = useMemo(() => {
    const recordedDatesInMonth = Object.keys(dailyRecords).filter(d => 
      d.startsWith(selectedVerdictMonth) && dailyRecords[d] && Object.keys(dailyRecords[d]).length > 0
    );
    const monthDates = recordedDatesInMonth.sort();

    return students.map(student => {
      let presentDays = 0;
      let absentDays = 0;
      let bedOnTimeDays = 0;
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
          if (entry.morningProgramOnTime) mpOnTimeDays++;
          if (entry.mangalaratiAttended) mangalaratiDays++;
          if (entry.morningClassAttended) classDays++;
        }
      });

      const totalDaysEvaluated = presentDays + absentDays;
      const divisor = presentDays > 0 ? presentDays : 1;

      const bedSuccessRate = presentDays > 0 ? Math.round((bedOnTimeDays / divisor) * 100) : 100;
      const mpSuccessRate = presentDays > 0 ? Math.round((mpOnTimeDays / divisor) * 100) : 100;
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
        wakeOnTimeDays: presentDays,
        mpOnTimeDays,
        mangalaratiDays,
        classDays,
        bedSuccessRate,
        mpSuccessRate,
        mangalaratiRate: 100,
        classRate: 100,
        overallSuccessRate,
        totalStrikes: strikes,
        verdictType,
        verdictLabelEn,
        verdictLabelBn
      };
    });
  }, [dailyRecords, students, selectedVerdictMonth, devoteeStrikesMap]);

  const generateMonthlyVerdictReport = (): string => {
    const voiceStats = monthlyStats.filter(s => s.student.group === 'VOICE');
    const lotusStats = monthlyStats.filter(s => s.student.group === 'LOTUS');

    const [year, month] = (selectedVerdictMonth || '').split('-');
    const monthDate = (!year || !month) ? new Date() : new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const monthFormatted = safeFormatDate(monthDate, { month: 'long', year: 'numeric' });

    let report = `📊 *ADVAITA VOICE — MONTHLY DISCIPLINE & SADHANA VERDICT* 📊\n`;
    report += `📅 *Evaluation Month:* ${monthFormatted}\n`;
    report += `🏛️ *Ashram:* Advaita VOICE (Chittagong University)\n`;
    report += `───────────────────────────\n`;

    report += `🌟 *1. VOICE GROUP EVALUATION (${voiceStats.length} Devotees)*\n\n`;
    voiceStats.forEach((st, i) => {
      report += `${i + 1}. *${st.student.name}*\n`;
      report += `   • Success Rate: *${st.overallSuccessRate}%* (Present: ${st.presentDays}/${st.totalDaysEvaluated} days)\n`;
      report += `   • Bed: ${st.bedSuccessRate}% | MP: ${st.mpSuccessRate}%\n`;
      report += `   • Strikes: ${st.totalStrikes} strike${st.totalStrikes !== 1 ? 's' : ''}\n`;
      report += `   • Verdict: *${st.verdictLabelEn}*\n\n`;
    });

    report += `───────────────────────────\n`;
    report += `🪷 *2. LOTUS GROUP EVALUATION (${lotusStats.length} Devotees)*\n\n`;
    lotusStats.forEach((st, i) => {
      report += `${i + 1}. *${st.student.name}*\n`;
      report += `   • Success Rate: *${st.overallSuccessRate}%* (Present: ${st.presentDays}/${st.totalDaysEvaluated} days)\n`;
      report += `   • Bed: ${st.bedSuccessRate}% | MP: ${st.mpSuccessRate}%\n`;
      report += `   • Strikes: ${st.totalStrikes} strike${st.totalStrikes !== 1 ? 's' : ''}\n`;
      report += `   • Verdict: *${st.verdictLabelEn}*\n\n`;
    });

    report += `───────────────────────────\n`;
    report += `🙏 *Approved by:* Counselor & Management Board (Advaita VOICE)\n`;
    return report;
  };

  // Actions
  const handleSendWhatsApp = () => {
    const text = auditMode === 'NIGHT' ? generateSangaNightReport() : generateMorningProgramReport();
    shareToWhatsAppOrSystem({ text });
  };

  const handleCopyReport = () => {
    const text = auditMode === 'NIGHT' ? generateSangaNightReport() : generateMorningProgramReport();
    navigator.clipboard.writeText(text).then(() => {
      toast.success(isBn ? 'রিপোর্ট কপি হয়েছে!' : 'Report copied to clipboard!');
      triggerHaptic('success');
    });
  };

  const handlePreviewReport = () => {
    const title = auditMode === 'NIGHT' 
      ? (isBn ? 'নৈশ স্ট্যাটাস রিপোর্ট প্রিভিউ' : 'Night Status Report Preview')
      : (isBn ? 'মর্নিং প্রোগ্রাম রিপোর্ট প্রিভিউ' : 'Morning Program Report Preview');
    const content = auditMode === 'NIGHT' ? generateSangaNightReport() : generateMorningProgramReport();
    setPreviewReport({ title, content });
  };

  const handleSaveAll = async () => {
    setIsCloudSyncing(true);
    const toastId = toast.loading(isBn ? 'ক্লাউডে সংরক্ষণ করা হচ্ছে...' : 'Saving to cloud...');
    try {
      const reporter = currentUserEmail || 'Incharge';
      const entries: DailyDisciplineEntry[] = students.map(s => getEntry(s.id));
      await saveBulkDailyDisciplineEntriesToCloud(entries, reporter);
      await saveDisciplineStudents(students);
      toast.success(isBn ? '✅ সকল রেকর্ড সফলভাবে ক্লাউডে সংরক্ষিত হয়েছে!' : 'All records saved to cloud!', { id: toastId });
      setLastCloudSyncTime(new Date());
    } catch (e) {
      toast.error(isBn ? 'সংরক্ষণ ব্যর্থ হয়েছে' : 'Save failed', { id: toastId });
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const voiceStudents = students.filter(s => s.group === 'VOICE');
  const lotusStudents = students.filter(s => s.group === 'LOTUS');

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-4 sm:py-6 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* ===================== TOP HEADER & NAVIGATION BAR ===================== */}
        <header className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3.5 shadow-sm flex items-center justify-between gap-2 flex-wrap">
          {/* Left: Back button & Title */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Back to Hub Home"
            >
              <ArrowLeft size={14} className="text-amber-500" />
              <span className="hidden sm:inline">হোম</span>
            </Link>
            
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1 truncate">
                <span>Advaita VOICE</span>
                <span className="text-amber-500 text-xs">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-semibold truncate">Discipline</span>
              </h1>
            </div>
          </div>

          {/* Center/Date Navigator (Compact) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 px-1.5 py-0.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => changeDate(-1)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft size={14} />
            </button>

            <label className="flex items-center gap-1 px-1.5 py-0.5 cursor-pointer text-xs font-black text-slate-800 dark:text-slate-200 select-none">
              <Calendar size={12} className="text-amber-500 shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[180px]">{dateFormattedShort}</span>
              <input
                type="date"
                value={dateIso}
                onChange={(e) => e.target.value && setSelectedDate(parseIsoDate(e.target.value))}
                className="sr-only"
              />
            </label>

            <button
              type="button"
              onClick={() => changeDate(1)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Next Day"
            >
              <ChevronRight size={14} />
            </button>

            {!isToday && (
              <button
                type="button"
                onClick={() => setSelectedDate(new Date())}
                className="ml-0.5 px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] hover:bg-amber-400 transition cursor-pointer shrink-0"
              >
                Today
              </button>
            )}
          </div>

          {/* Right Action Icons: History, Monthly Sheet, Login Pill */}
          <div className="flex items-center gap-1.5">
            {/* History Button */}
            <button
              type="button"
              onClick={() => setIsHistoryModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
              title="Audit History Log"
            >
              <History size={13} className="text-amber-500" />
              <span className="hidden md:inline">হিস্ট্রি</span>
            </button>

            {/* Monthly Sheet Button */}
            <button
              type="button"
              onClick={() => setIsMonthlyModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition flex items-center gap-1 border border-amber-500/20 cursor-pointer shrink-0"
              title="Monthly Attendance Sheet"
            >
              <Award size={13} className="text-amber-500" />
              <span className="hidden md:inline">মাসিক শিট</span>
            </button>

            {/* Login / Profile Pill */}
            {user ? (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer shrink-0 max-w-[130px] truncate"
                title={currentUserEmail || 'Logged In'}
              >
                <UserCheck size={13} className="text-emerald-500 shrink-0" />
                <span className="truncate">{effectiveAuditorRole === 'ADMIN' ? 'Admin' : (currentUserEmail ? currentUserEmail.split('@')[0] : 'Incharge')}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 transition shadow-xs cursor-pointer shrink-0"
              >
                <Key size={13} className="text-amber-400" />
                <span>লগইন</span>
              </Link>
            )}

            {/* Cloud Sync Status Dot */}
            <span 
              title={lastCloudSyncTime ? `Last sync: ${lastCloudSyncTime.toLocaleTimeString()}` : 'Connected to Supabase'}
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300/40 ml-0.5 shrink-0"
            />
          </div>
        </header>

        {/* ===================== TWO HEADER BUTTONS SIDE BY SIDE ===================== */}
        {/* Core toggle: Morning Program Report vs Security & Night Report */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 dark:bg-slate-900/90 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setAuditMode('MORNING');
              triggerHaptic('light');
            }}
            className={`py-3 px-2 sm:px-4 rounded-xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              auditMode === 'MORNING'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md ring-2 ring-amber-400/50 scale-[1.01]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sun size={17} className={auditMode === 'MORNING' ? 'text-slate-950 fill-current' : 'text-amber-500'} />
            <span className="truncate">Morning Program Report</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuditMode('NIGHT');
              triggerHaptic('light');
            }}
            className={`py-3 px-2 sm:px-4 rounded-xl font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              auditMode === 'NIGHT'
                ? 'bg-gradient-to-r from-indigo-700 to-slate-900 text-white shadow-md ring-2 ring-indigo-500/50 scale-[1.01]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Moon size={17} className={auditMode === 'NIGHT' ? 'text-amber-300 fill-current' : 'text-indigo-400'} />
            <span className="truncate">Security & Night Report</span>
          </button>
        </div>

        {/* ===================== VIEW 1: SANGA NIGHT SYSTEM ===================== */}
        {auditMode === 'NIGHT' && (
          <div className="space-y-4 animate-fade-in">
            {/* Night Meta Bar (from sanga.html) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm flex items-center justify-between gap-3 flex-wrap text-xs">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  📅 <strong>তারিখ:</strong> {selectedDate.getDate()} {selectedDate.toLocaleString('default', { month: 'short' })}, {selectedDate.getFullYear()}
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => {
                    const val = prompt('রিপোর্টিং সময় পরিবর্তন করুন:', nightReportingTime);
                    if (val) setNightReportingTime(val);
                  }}
                  className="font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
                  title="Click to edit reporting time"
                >
                  ⏰ <strong>সময়:</strong> {nightReportingTime} ✏️
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    const val = prompt('Voice পর্যবেক্ষণ সময় পরিবর্তন করুন:', nightVoiceObserved);
                    if (val) setNightVoiceObserved(val);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 hover:bg-amber-100 cursor-pointer"
                  title="Click to change observation time"
                >
                  Voice Obs: {nightVoiceObserved}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const val = prompt('Lotus পর্যবেক্ষণ সময় পরিবর্তন করুন:', nightLotusObserved);
                    if (val) setNightLotusObserved(val);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-100 cursor-pointer"
                  title="Click to change observation time"
                >
                  Lotus Obs: {nightLotusObserved}
                </button>
              </div>
            </div>

            {/* Voice Devotees Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🌟</span>
                  <span>Voice Devotees ({voiceStudents.length} জন • শয়ন কারফিউ ১০:০০ PM)</span>
                </h3>
              </div>

              <div className="space-y-2">
                {voiceStudents.map((student, idx) => {
                  const entry = getEntry(student.id);
                  const strikes = devoteeStrikesMap[student.id]?.strikes ?? student.monthlyStrikes;

                  return (
                    <div
                      key={student.id}
                      className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        {/* Name & Strikes */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                              {student.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                strikes === 0 
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' 
                                  : strikes <= 2 
                                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' 
                                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 animate-pulse'
                              }`}>
                                ⚡ {strikes} {isBn ? 'স্ট্রাইক' : 'strikes'}
                              </span>
                              {canEditGroup ? (
                                <select
                                  value={student.group}
                                  onChange={(e) => {
                                    handleUpdateDevoteeGroup(student.id, e.target.value as GroupType);
                                    triggerHaptic('medium');
                                  }}
                                  className="text-[10px] font-black px-1.5 py-0.5 rounded-md border bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 cursor-pointer focus:outline-none transition hover:bg-amber-100"
                                  title="গ্রুপ পরিবর্তন করুন (Admin / Manager Only)"
                                >
                                  <option value="VOICE">VOICE ▾</option>
                                  <option value="LOTUS">LOTUS ▾</option>
                                </select>
                              ) : (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                                  {student.group}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 3-State Night Status Buttons (In bed / Absent / Not In bed) */}
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              updateEntry(student.id, { sleptOnTime: true, isAbsent: false, bedLateMinutes: 0 });
                              triggerHaptic('light');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              !entry.isAbsent && entry.sleptOnTime
                                ? 'bg-emerald-600 text-white shadow-xs scale-105'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            <span>🛌</span>
                            <span>In bed</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              updateEntry(student.id, { isAbsent: true, sleptOnTime: true, absenceReason: entry.absenceReason || 'Home Leave' });
                              triggerHaptic('light');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              entry.isAbsent
                                ? 'bg-sky-600 text-white shadow-xs scale-105'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            <span>🕊️</span>
                            <span>Absent</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              updateEntry(student.id, { sleptOnTime: false, isAbsent: false, bedLateMinutes: entry.bedLateMinutes || 15, reason: entry.reason || 'Late Bed' });
                              triggerHaptic('warning');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              !entry.isAbsent && !entry.sleptOnTime
                                ? 'bg-rose-600 text-white shadow-xs scale-105 animate-shake'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            <span>❌</span>
                            <span>Not In bed</span>
                            {!entry.isAbsent && !entry.sleptOnTime && entry.bedLateMinutes ? (
                              <span className="ml-0.5 text-[10px] bg-rose-800/80 px-1 py-0.2 rounded font-mono">
                                +{entry.bedLateMinutes}m
                              </span>
                            ) : null}
                          </button>
                        </div>
                      </div>

                      {/* Smooth Reason row if Not In bed */}
                      {!entry.isAbsent && !entry.sleptOnTime && (
                        <div className="pt-2.5 pb-0.5 border-t border-rose-100 dark:border-rose-900/30 flex flex-col md:flex-row md:items-center gap-2">
                          {/* 1. How much late time: Edit input (first order) + Dropdown option */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 shrink-0 flex items-center gap-1">
                              <Clock size={12} className="text-rose-500" />
                              কতক্ষণ বিলম্ব:
                            </span>

                            {/* Edit input (first order) */}
                            <div className="relative flex items-center">
                              <input
                                type="number"
                                min="1"
                                max="360"
                                value={entry.bedLateMinutes ?? ''}
                                placeholder="15"
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  const val = raw === '' ? undefined : parseInt(raw, 10);
                                  updateEntry(student.id, { bedLateMinutes: isNaN(val as number) ? undefined : val });
                                }}
                                className="w-14 px-2 py-1 text-center font-bold text-xs rounded-lg bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                              />
                              <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 ml-1">মি.</span>
                            </div>

                            {/* Dropdown selector for late time */}
                            <select
                              value={entry.bedLateMinutes ?? ''}
                              onChange={(e) => {
                                const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                                updateEntry(student.id, { bedLateMinutes: val });
                                triggerHaptic('light');
                              }}
                              className="px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-slate-700 dark:text-slate-200 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500"
                            >
                              <option value="">বাছুন ▼</option>
                              <option value="15">+১৫ মি.</option>
                              <option value="30">+৩০ মি.</option>
                              <option value="45">+৪৫ মি.</option>
                              <option value="60">+৬০ মি. (১ ঘণ্টা)</option>
                              <option value="90">+৯০ মি.</option>
                              <option value="120">+১২০ মি. (২ ঘণ্টা)</option>
                            </select>
                          </div>

                          {/* Divider on desktop */}
                          <div className="hidden md:block w-px h-5 bg-rose-200 dark:bg-rose-800/60 shrink-0" />

                          {/* 2. Beside it: Cause (Dropdown reason + Edit text input) */}
                          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5">
                            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 shrink-0 flex items-center gap-1">
                              <AlertTriangle size={12} className="text-rose-500" />
                              দেরির কারণ:
                            </span>

                            {/* Dropdown reasons */}
                            <select
                              value={NIGHT_LATE_REASONS.includes(entry.reason || '') ? (entry.reason || '') : ''}
                              onChange={(e) => {
                                if (e.target.value) {
                                  updateEntry(student.id, { reason: e.target.value });
                                  triggerHaptic('light');
                                }
                              }}
                              className="px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-slate-700 dark:text-slate-200 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500 shrink-0 sm:max-w-[190px]"
                            >
                              <option value="">কারণ বাছুন ▼</option>
                              {NIGHT_LATE_REASONS.map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>

                            {/* Editable text input */}
                            <input
                              type="text"
                              value={entry.reason || ''}
                              placeholder="বিলম্বের কারণ (পরীক্ষার প্রস্তুতি, মন্দির সেবা...)"
                              onChange={(e) => updateEntry(student.id, { reason: e.target.value })}
                              className="flex-1 px-3 py-1 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* Smooth Reason row if Absent */}
                      {entry.isAbsent && (
                        <div className="pt-2 border-t border-sky-100 dark:border-sky-900/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 shrink-0">
                            ছুটির কারণ:
                          </span>
                          <select
                            value={ABSENCE_REASONS_LIST.includes(entry.absenceReason || '') ? (entry.absenceReason || '') : ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                updateEntry(student.id, { absenceReason: e.target.value });
                                triggerHaptic('light');
                              }
                            }}
                            className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-800 text-slate-700 dark:text-slate-200 font-medium cursor-pointer focus:outline-none shrink-0 sm:max-w-[200px]"
                          >
                            <option value="">ছুটির কারণ বাছুন ▼</option>
                            {ABSENCE_REASONS_LIST.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={entry.absenceReason || ''}
                            placeholder="অনুপস্থিতির কারণ (e.g. গ্রামের বাড়ি, অসুস্থতা...)"
                            onChange={(e) => updateEntry(student.id, { absenceReason: e.target.value })}
                            className="flex-1 px-3 py-1 rounded-lg bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 text-xs text-sky-900 dark:text-sky-200 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lotus Devotees Section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🪷</span>
                  <span>Lotus Devotees ({lotusStudents.length} জন • শয়ন কারফিউ ১১:০০ PM)</span>
                </h3>
              </div>

              <div className="space-y-2">
                {lotusStudents.map((student, idx) => {
                  const entry = getEntry(student.id);
                  const strikes = devoteeStrikesMap[student.id]?.strikes ?? student.monthlyStrikes;

                  return (
                    <div
                      key={student.id}
                      className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                              {student.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                strikes === 0 
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' 
                                  : strikes <= 2 
                                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' 
                                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 animate-pulse'
                              }`}>
                                ⚡ {strikes} {isBn ? 'স্ট্রাইক' : 'strikes'}
                              </span>
                              {canEditGroup ? (
                                <select
                                  value={student.group}
                                  onChange={(e) => {
                                    handleUpdateDevoteeGroup(student.id, e.target.value as GroupType);
                                    triggerHaptic('medium');
                                  }}
                                  className="text-[10px] font-black px-1.5 py-0.5 rounded-md border bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 cursor-pointer focus:outline-none transition hover:bg-indigo-100"
                                  title="গ্রুপ পরিবর্তন করুন (Admin / Manager Only)"
                                >
                                  <option value="VOICE">VOICE ▾</option>
                                  <option value="LOTUS">LOTUS ▾</option>
                                </select>
                              ) : (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                                  {student.group}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              updateEntry(student.id, { sleptOnTime: true, isAbsent: false, bedLateMinutes: 0 });
                              triggerHaptic('light');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              !entry.isAbsent && entry.sleptOnTime
                                ? 'bg-emerald-600 text-white shadow-xs scale-105'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            <span>🛌</span>
                            <span>In bed</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              updateEntry(student.id, { isAbsent: true, sleptOnTime: true, absenceReason: entry.absenceReason || 'Home Leave' });
                              triggerHaptic('light');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              entry.isAbsent
                                ? 'bg-sky-600 text-white shadow-xs scale-105'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            <span>🕊️</span>
                            <span>Absent</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              updateEntry(student.id, { sleptOnTime: false, isAbsent: false, bedLateMinutes: entry.bedLateMinutes || 15, reason: entry.reason || 'Late Bed' });
                              triggerHaptic('warning');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              !entry.isAbsent && !entry.sleptOnTime
                                ? 'bg-rose-600 text-white shadow-xs scale-105 animate-shake'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            <span>❌</span>
                            <span>Not In bed</span>
                            {!entry.isAbsent && !entry.sleptOnTime && entry.bedLateMinutes ? (
                              <span className="ml-0.5 text-[10px] bg-rose-800/80 px-1 py-0.2 rounded font-mono">
                                +{entry.bedLateMinutes}m
                              </span>
                            ) : null}
                          </button>
                        </div>
                      </div>

                      {!entry.isAbsent && !entry.sleptOnTime && (
                        <div className="pt-2.5 pb-0.5 border-t border-rose-100 dark:border-rose-900/30 flex flex-col md:flex-row md:items-center gap-2">
                          {/* 1. How much late time: Edit input (first order) + Dropdown option */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 shrink-0 flex items-center gap-1">
                              <Clock size={12} className="text-rose-500" />
                              কতক্ষণ বিলম্ব:
                            </span>

                            {/* Edit input (first order) */}
                            <div className="relative flex items-center">
                              <input
                                type="number"
                                min="1"
                                max="360"
                                value={entry.bedLateMinutes ?? ''}
                                placeholder="15"
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  const val = raw === '' ? undefined : parseInt(raw, 10);
                                  updateEntry(student.id, { bedLateMinutes: isNaN(val as number) ? undefined : val });
                                }}
                                className="w-14 px-2 py-1 text-center font-bold text-xs rounded-lg bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                              />
                              <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 ml-1">মি.</span>
                            </div>

                            {/* Dropdown selector for late time */}
                            <select
                              value={entry.bedLateMinutes ?? ''}
                              onChange={(e) => {
                                const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                                updateEntry(student.id, { bedLateMinutes: val });
                                triggerHaptic('light');
                              }}
                              className="px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-slate-700 dark:text-slate-200 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500"
                            >
                              <option value="">বাছুন ▼</option>
                              <option value="15">+১৫ মি.</option>
                              <option value="30">+৩০ মি.</option>
                              <option value="45">+৪৫ মি.</option>
                              <option value="60">+৬০ মি. (১ ঘণ্টা)</option>
                              <option value="90">+৯০ মি.</option>
                              <option value="120">+১২০ মি. (২ ঘণ্টা)</option>
                            </select>
                          </div>

                          {/* Divider on desktop */}
                          <div className="hidden md:block w-px h-5 bg-rose-200 dark:bg-rose-800/60 shrink-0" />

                          {/* 2. Beside it: Cause (Dropdown reason + Edit text input) */}
                          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5">
                            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 shrink-0 flex items-center gap-1">
                              <AlertTriangle size={12} className="text-rose-500" />
                              দেরির কারণ:
                            </span>

                            {/* Dropdown reasons */}
                            <select
                              value={NIGHT_LATE_REASONS.includes(entry.reason || '') ? (entry.reason || '') : ''}
                              onChange={(e) => {
                                if (e.target.value) {
                                  updateEntry(student.id, { reason: e.target.value });
                                  triggerHaptic('light');
                                }
                              }}
                              className="px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-slate-700 dark:text-slate-200 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500 shrink-0 sm:max-w-[190px]"
                            >
                              <option value="">কারণ বাছুন ▼</option>
                              {NIGHT_LATE_REASONS.map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>

                            {/* Editable text input */}
                            <input
                              type="text"
                              value={entry.reason || ''}
                              placeholder="বিলম্বের কারণ (পরীক্ষার প্রস্তুতি, মন্দির সেবা...)"
                              onChange={(e) => updateEntry(student.id, { reason: e.target.value })}
                              className="flex-1 px-3 py-1 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            />
                          </div>
                        </div>
                      )}

                      {entry.isAbsent && (
                        <div className="pt-2 border-t border-sky-100 dark:border-sky-900/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 shrink-0">
                            ছুটির কারণ:
                          </span>
                          <select
                            value={ABSENCE_REASONS_LIST.includes(entry.absenceReason || '') ? (entry.absenceReason || '') : ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                updateEntry(student.id, { absenceReason: e.target.value });
                                triggerHaptic('light');
                              }
                            }}
                            className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-800 text-slate-700 dark:text-slate-200 font-medium cursor-pointer focus:outline-none shrink-0 sm:max-w-[200px]"
                          >
                            <option value="">ছুটির কারণ বাছুন ▼</option>
                            {ABSENCE_REASONS_LIST.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={entry.absenceReason || ''}
                            placeholder="অনুপস্থিতির কারণ..."
                            onChange={(e) => updateEntry(student.id, { absenceReason: e.target.value })}
                            className="flex-1 px-3 py-1 rounded-lg bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 text-xs text-sky-900 dark:text-sky-200 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Night Actions Sticky Footer Bar */}
            <div className="sticky bottom-3 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Send size={15} />
                <span>WhatsApp Night Report</span>
              </button>

              <button
                type="button"
                onClick={handlePreviewReport}
                className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                title="Preview Report"
              >
                <Eye size={15} />
                <span className="hidden sm:inline">Preview</span>
              </button>

              <button
                type="button"
                onClick={handleCopyReport}
                className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                title="Copy Report"
              >
                <Copy size={15} />
                <span className="hidden sm:inline">Copy</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAll}
                className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                title="Save all changes to Cloud"
              >
                <RefreshCw size={15} className={isCloudSyncing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">সংরক্ষণ</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== VIEW 2: MORNING PROGRAM SYSTEM ===================== */}
        {auditMode === 'MORNING' && (
          <div className="space-y-4 animate-fade-in">
            {/* Morning Meta Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm flex items-center justify-between gap-3 flex-wrap text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  VOICE: MP ≤ 4:30 AM | Lotus: MP ≤ 5:00 AM | Class: 7:00 AM
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                (দেরিতে মর্নিং এন্ট্রি স্ট্রাইক কাউন্ট হবে • মঙ্গল আরতি ও ক্লাস সাধনা পর্যবেক্ষণ)
              </span>
            </div>

            {/* Devotees List */}
            <div className="space-y-2">
              {students.map((student, idx) => {
                const entry = getEntry(student.id);
                const strikes = devoteeStrikesMap[student.id]?.strikes ?? student.monthlyStrikes;

                return (
                  <div
                    key={student.id}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      {/* Name & Strikes */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                            {student.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              strikes === 0 
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' 
                                : strikes <= 2 
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' 
                                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 animate-pulse'
                            }`}>
                              ⚡ {strikes} {isBn ? 'স্ট্রাইক' : 'strikes'}
                            </span>
                            {canEditGroup ? (
                              <select
                                value={student.group}
                                onChange={(e) => {
                                  handleUpdateDevoteeGroup(student.id, e.target.value as GroupType);
                                  triggerHaptic('medium');
                                }}
                                className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border cursor-pointer focus:outline-none transition ${
                                  student.group === 'VOICE' 
                                    ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100' 
                                    : 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
                                }`}
                                title="গ্রুপ পরিবর্তন করুন (Admin / Manager Only)"
                              >
                                <option value="VOICE">VOICE ▾</option>
                                <option value="LOTUS">LOTUS ▾</option>
                              </select>
                            ) : (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                student.group === 'VOICE' 
                                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' 
                                  : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                              }`}>
                                {student.group}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* MP Attendance 3-state buttons */}
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            updateEntry(student.id, { morningProgramOnTime: true, isAbsent: false, mpLateMinutes: 0 });
                            triggerHaptic('light');
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            !entry.isAbsent && entry.morningProgramOnTime
                              ? 'bg-emerald-600 text-white shadow-xs scale-105'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          <span>🌅</span>
                          <span>অন-টাইম</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateEntry(student.id, { morningProgramOnTime: false, isAbsent: false, mpLateMinutes: entry.mpLateMinutes || 15 });
                            triggerHaptic('warning');
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            !entry.isAbsent && !entry.morningProgramOnTime
                              ? 'bg-rose-600 text-white shadow-xs scale-105 animate-shake'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          <span>⏰</span>
                          <span>দেরি</span>
                          {!entry.isAbsent && !entry.morningProgramOnTime && entry.mpLateMinutes ? (
                            <span className="ml-0.5 text-[10px] bg-rose-800/80 px-1 py-0.2 rounded font-mono">
                              +{entry.mpLateMinutes}m
                            </span>
                          ) : null}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateEntry(student.id, { isAbsent: true, absenceReason: entry.absenceReason || 'Home Leave' });
                            triggerHaptic('light');
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            entry.isAbsent
                              ? 'bg-sky-600 text-white shadow-xs scale-105'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          <span>🕊️</span>
                          <span>ছুটি</span>
                        </button>
                      </div>
                    </div>

                    {/* Sadhana Checkboxes (Clean compact row: Mangalarati, Class, Wake-up in ONE single row) */}
                    {!entry.isAbsent && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar flex-nowrap py-0.5">
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                          সাধনা:
                        </span>
                        
                        {/* Mangalarati */}
                        <button
                          type="button"
                          onClick={() => {
                            updateEntry(student.id, { mangalaratiAttended: !entry.mangalaratiAttended });
                            triggerHaptic('light');
                          }}
                          className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold border transition flex items-center gap-1 shrink-0 cursor-pointer ${
                            entry.mangalaratiAttended
                              ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 line-through'
                          }`}
                        >
                          <span>🔥 মঙ্গল আরতি</span>
                          {entry.mangalaratiAttended && <Check size={11} className="stroke-[2.5]" />}
                        </button>

                        {/* Bhagavatam Class */}
                        <button
                          type="button"
                          onClick={() => {
                            updateEntry(student.id, { morningClassAttended: !entry.morningClassAttended });
                            triggerHaptic('light');
                          }}
                          className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold border transition flex items-center gap-1 shrink-0 cursor-pointer ${
                            entry.morningClassAttended
                              ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-700 dark:text-indigo-300'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 line-through'
                          }`}
                        >
                          <span>📖 ভাগবত ক্লাস</span>
                          {entry.morningClassAttended && <Check size={11} className="stroke-[2.5]" />}
                        </button>

                        {/* Wake-up 4:00 AM */}
                        <button
                          type="button"
                          onClick={() => {
                            updateEntry(student.id, { wokeUpOnTime: !entry.wokeUpOnTime });
                            triggerHaptic('light');
                          }}
                          className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold border transition flex items-center gap-1 shrink-0 cursor-pointer ${
                            entry.wokeUpOnTime
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 line-through'
                          }`}
                        >
                          <span>⏰ জাগরণ ৪টা</span>
                          {entry.wokeUpOnTime && <Check size={11} className="stroke-[2.5]" />}
                        </button>
                      </div>
                    )}

                    {/* Late to Morning Program: How much late time + Dropdown Reason row */}
                    {!entry.isAbsent && !entry.morningProgramOnTime && (
                      <div className="pt-2.5 pb-0.5 border-t border-rose-100 dark:border-rose-900/30 flex flex-col md:flex-row md:items-center gap-2">
                        {/* 1. How much late time: Edit input (first order) + Dropdown option */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 shrink-0 flex items-center gap-1">
                            <Clock size={12} className="text-rose-500" />
                            কতক্ষণ দেরি:
                          </span>

                          {/* Edit input (first order) */}
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              min="1"
                              max="240"
                              value={entry.mpLateMinutes ?? ''}
                              placeholder="15"
                              onChange={(e) => {
                                const raw = e.target.value;
                                const val = raw === '' ? undefined : parseInt(raw, 10);
                                updateEntry(student.id, { mpLateMinutes: isNaN(val as number) ? undefined : val });
                              }}
                              className="w-14 px-2 py-1 text-center font-bold text-xs rounded-lg bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            />
                            <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 ml-1">মি.</span>
                          </div>

                          {/* Dropdown selector for late time */}
                          <select
                            value={entry.mpLateMinutes ?? ''}
                            onChange={(e) => {
                              const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                              updateEntry(student.id, { mpLateMinutes: val });
                              triggerHaptic('light');
                            }}
                            className="px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-slate-700 dark:text-slate-200 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500"
                          >
                            <option value="">বাছুন ▼</option>
                            <option value="5">+৫ মি.</option>
                            <option value="10">+১০ মি.</option>
                            <option value="15">+১৫ মি.</option>
                            <option value="20">+২০ মি.</option>
                            <option value="25">+২৫ মি.</option>
                            <option value="30">+৩০ মি.</option>
                            <option value="45">+৪৫ মি.</option>
                            <option value="60">+৬০ মি. (১ ঘণ্টা)</option>
                            <option value="90">+৯০ মি.</option>
                            <option value="120">+১২০ মি.</option>
                          </select>
                        </div>

                        {/* Divider on desktop */}
                        <div className="hidden md:block w-px h-5 bg-rose-200 dark:bg-rose-800/60 shrink-0" />

                        {/* 2. Beside it: Cause (Dropdown reason + Edit text input) */}
                        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5">
                          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 shrink-0 flex items-center gap-1">
                            <AlertTriangle size={12} className="text-rose-500" />
                            দেরির কারণ:
                          </span>

                          {/* Dropdown reasons */}
                          <select
                            value={MORNING_LATE_REASONS.includes(entry.reason || '') ? (entry.reason || '') : ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                updateEntry(student.id, { reason: e.target.value });
                                triggerHaptic('light');
                              }
                            }}
                            className="px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-slate-700 dark:text-slate-200 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500 shrink-0 sm:max-w-[190px]"
                          >
                            <option value="">কারণ বাছুন ▼</option>
                            {MORNING_LATE_REASONS.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>

                          {/* Editable text input for custom cause */}
                          <input
                            type="text"
                            value={entry.reason || ''}
                            placeholder="মর্নিং প্রোগ্রামে দেরির কারণ বা বিশেষ নোট..."
                            onChange={(e) => updateEntry(student.id, { reason: e.target.value })}
                            className="flex-1 px-3 py-1 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Absence reason row in Morning Program */}
                    {entry.isAbsent && (
                      <div className="pt-2 border-t border-sky-100 dark:border-sky-900/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 shrink-0">
                          ছুটির কারণ:
                        </span>
                        <select
                          value={ABSENCE_REASONS_LIST.includes(entry.absenceReason || '') ? (entry.absenceReason || '') : ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              updateEntry(student.id, { absenceReason: e.target.value });
                              triggerHaptic('light');
                            }
                          }}
                          className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-800 text-slate-700 dark:text-slate-200 font-medium cursor-pointer focus:outline-none shrink-0 sm:max-w-[200px]"
                        >
                          <option value="">ছুটির কারণ বাছুন ▼</option>
                          {ABSENCE_REASONS_LIST.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={entry.absenceReason || ''}
                          placeholder="অনুপস্থিতির কারণ (গ্রামের বাড়ি, অসুস্থতা...)"
                          onChange={(e) => updateEntry(student.id, { absenceReason: e.target.value })}
                          className="flex-1 px-3 py-1 rounded-lg bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 text-xs text-sky-900 dark:text-sky-200 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Morning Actions Sticky Footer Bar */}
            <div className="sticky bottom-3 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Send size={15} />
                <span>WhatsApp MP Report</span>
              </button>

              <button
                type="button"
                onClick={handlePreviewReport}
                className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                title="Preview Report"
              >
                <Eye size={15} />
                <span className="hidden sm:inline">Preview</span>
              </button>

              <button
                type="button"
                onClick={handleCopyReport}
                className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                title="Copy Report"
              >
                <Copy size={15} />
                <span className="hidden sm:inline">Copy</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAll}
                className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                title="Save all changes to Cloud"
              >
                <RefreshCw size={15} className={isCloudSyncing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">সংরক্ষণ</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== MODAL 1: SANGA MATRIX & MONTHLY VERDICT MODAL ===================== */}
        {isMonthlyModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-5xl w-full p-4 sm:p-6 shadow-2xl max-h-[92vh] flex flex-col gap-4">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      মাসিক উপস্থিতি ও শৃঙ্খলা প্রতিবেদন
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Sanga's Night Matrix & Monthly Discipline Verdict
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Month Picker */}
                  <input
                    type="month"
                    value={selectedVerdictMonth}
                    onChange={(e) => e.target.value && setSelectedVerdictMonth(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
                  />

                  <button
                    type="button"
                    onClick={() => setIsMonthlyModalOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Tabs: Matrix Spreadsheet vs Verdict Summary */}
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setMonthlyModalTab('MATRIX')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    monthlyModalTab === 'MATRIX'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  📊 Sanga's Matrix Spreadsheet
                </button>

                <button
                  type="button"
                  onClick={() => setMonthlyModalTab('VERDICT')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    monthlyModalTab === 'VERDICT'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  🏆 Sadhana & Strike Verdict
                </button>
              </div>

              {/* Tab 1: Sanga's Matrix Spreadsheet (from sanga.html) */}
              {monthlyModalTab === 'MATRIX' && (
                <div className="flex-1 overflow-auto space-y-3" id="sanga-matrix-container">
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300">
                          <th className="p-2.5 font-black sticky left-0 bg-slate-100 dark:bg-slate-800 z-10 border-b border-slate-200 dark:border-slate-700 min-w-[140px]">
                            Devotee Name
                          </th>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <th key={day} className="p-1 text-center font-bold border-b border-slate-200 dark:border-slate-700 min-w-[28px]">
                              {day}
                            </th>
                          ))}
                          <th className="p-2 text-center font-black bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-b border-slate-200 dark:border-slate-700 min-w-[50px]">
                            Bed
                          </th>
                          <th className="p-2 text-center font-black bg-rose-100/60 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-b border-slate-200 dark:border-slate-700 min-w-[50px]">
                            Out
                          </th>
                          <th className="p-2 text-center font-black bg-sky-100/60 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-b border-slate-200 dark:border-slate-700 min-w-[50px]">
                            Abs
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {/* Voice Devotees */}
                        <tr className="bg-amber-50/50 dark:bg-amber-950/20 font-bold text-amber-700 dark:text-amber-300">
                          <td colSpan={35} className="p-1.5 px-3 uppercase tracking-wider text-[10px]">
                            • Voice Devotees
                          </td>
                        </tr>
                        {voiceStudents.map(student => {
                          let totalBed = 0;
                          let totalOut = 0;
                          let totalAbs = 0;

                          return (
                            <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="p-2 font-bold sticky left-0 bg-white dark:bg-slate-900 z-10 truncate max-w-[150px]">
                                {cleanName(student.name)}
                              </td>
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                                const dayStr = `${selectedVerdictMonth}-${String(day).padStart(2, '0')}`;
                                const entry = dailyRecords[dayStr]?.[student.id];

                                if (!entry) {
                                  return (
                                    <td key={day} className="p-1 text-center text-slate-300 dark:text-slate-700">
                                      -
                                    </td>
                                  );
                                }

                                if (entry.isAbsent) {
                                  totalAbs++;
                                  return (
                                    <td key={day} className="p-1 text-center text-sky-600 font-bold" title={entry.absenceReason || 'Absent'}>
                                      A
                                    </td>
                                  );
                                }

                                if (!entry.sleptOnTime) {
                                  totalOut++;
                                  return (
                                    <td key={day} className="p-1 text-center text-rose-600 font-black bg-rose-50 dark:bg-rose-950/30" title={entry.reason || 'Late Bed'}>
                                      ✕
                                    </td>
                                  );
                                }

                                totalBed++;
                                return (
                                  <td key={day} className="p-1 text-center text-emerald-600 font-bold">
                                    ✓
                                  </td>
                                );
                              })}
                              <td className="p-2 text-center font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/20">
                                {totalBed}
                              </td>
                              <td className="p-2 text-center font-bold text-rose-700 dark:text-rose-300 bg-rose-50/30 dark:bg-rose-950/20">
                                {totalOut}
                              </td>
                              <td className="p-2 text-center font-bold text-sky-700 dark:text-sky-300 bg-sky-50/30 dark:bg-sky-950/20">
                                {totalAbs}
                              </td>
                            </tr>
                          );
                        })}

                        {/* Lotus Devotees */}
                        <tr className="bg-indigo-50/50 dark:bg-indigo-950/20 font-bold text-indigo-700 dark:text-indigo-300">
                          <td colSpan={35} className="p-1.5 px-3 uppercase tracking-wider text-[10px]">
                            • Lotus Devotees
                          </td>
                        </tr>
                        {lotusStudents.map(student => {
                          let totalBed = 0;
                          let totalOut = 0;
                          let totalAbs = 0;

                          return (
                            <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="p-2 font-bold sticky left-0 bg-white dark:bg-slate-900 z-10 truncate max-w-[150px]">
                                {cleanName(student.name)}
                              </td>
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                                const dayStr = `${selectedVerdictMonth}-${String(day).padStart(2, '0')}`;
                                const entry = dailyRecords[dayStr]?.[student.id];

                                if (!entry) {
                                  return (
                                    <td key={day} className="p-1 text-center text-slate-300 dark:text-slate-700">
                                      -
                                    </td>
                                  );
                                }

                                if (entry.isAbsent) {
                                  totalAbs++;
                                  return (
                                    <td key={day} className="p-1 text-center text-sky-600 font-bold" title={entry.absenceReason || 'Absent'}>
                                      A
                                    </td>
                                  );
                                }

                                if (!entry.sleptOnTime) {
                                  totalOut++;
                                  return (
                                    <td key={day} className="p-1 text-center text-rose-600 font-black bg-rose-50 dark:bg-rose-950/30" title={entry.reason || 'Late Bed'}>
                                      ✕
                                    </td>
                                  );
                                }

                                totalBed++;
                                return (
                                  <td key={day} className="p-1 text-center text-emerald-600 font-bold">
                                    ✓
                                  </td>
                                );
                              })}
                              <td className="p-2 text-center font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/20">
                                {totalBed}
                              </td>
                              <td className="p-2 text-center font-bold text-rose-700 dark:text-rose-300 bg-rose-50/30 dark:bg-rose-950/20">
                                {totalOut}
                              </td>
                              <td className="p-2 text-center font-bold text-sky-700 dark:text-sky-300 bg-sky-50/30 dark:bg-sky-950/20">
                                {totalAbs}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <p className="text-[11px] text-slate-400">
                      চিহ্ন পরিচিতি: ✓ = In bed (উপস্থিত) • ✕ = Not In bed (দেরি) • A = Absent (ছুটি)
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        exportTableToPdf({
                          elementId: 'sanga-matrix-container',
                          filename: `Sanga-Night-Matrix-${selectedVerdictMonth}.pdf`,
                          title: 'Advaita VOICE Night Status Matrix',
                          subtitle: `Month: ${selectedVerdictMonth}`
                        }).then(() => toast.success('PDF Exported!')).catch(() => toast.error('PDF Export failed'));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Export PDF</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Monthly Verdict & Evaluation */}
              {monthlyModalTab === 'VERDICT' && (
                <div className="flex-1 overflow-auto space-y-3">
                  <div className="space-y-2">
                    {monthlyStats.map((st, i) => (
                      <div
                        key={st.student.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap"
                      >
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {i + 1}. {st.student.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            সাফল্য: <strong>{st.overallSuccessRate}%</strong> (উপস্থিত: {st.presentDays}/{st.totalDaysEvaluated}) • শয়ন: {st.bedSuccessRate}% • এমপি: {st.mpSuccessRate}%
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {canEditGroup ? (
                            <select
                              value={st.student.group}
                              onChange={(e) => {
                                handleUpdateDevoteeGroup(st.student.id, e.target.value as GroupType);
                                triggerHaptic('medium');
                              }}
                              className={`text-[10px] font-black px-2 py-1 rounded-lg border cursor-pointer focus:outline-none transition ${
                                st.student.group === 'VOICE'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                              }`}
                              title="গ্রুপ পরিবর্তন করুন (Admin / Manager Only)"
                            >
                              <option value="VOICE">VOICE ▾</option>
                              <option value="LOTUS">LOTUS ▾</option>
                            </select>
                          ) : (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              st.student.group === 'VOICE'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            }`}>
                              {st.student.group}
                            </span>
                          )}

                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            st.totalStrikes === 0
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : st.totalStrikes <= 2
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                          }`}>
                            ⚡ {st.totalStrikes} Strikes
                          </span>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                            {st.verdictLabelBn}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const r = generateMonthlyVerdictReport();
                        navigator.clipboard.writeText(r);
                        toast.success('মাসিক মূল্যায়ন কপি হয়েছে!');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy size={13} />
                      <span>কপি মাসিক রিপোর্ট</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== MODAL 2: AUDIT HISTORY QUICK JUMP ===================== */}
        {isHistoryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-4 sm:p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <History size={16} className="text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    অডিট হিস্ট্রি লগ (Audit History)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto space-y-1.5 pr-1">
                {recordedDates.map(date => {
                  const isCurrent = date === dateIso;
                  const formattedDate = safeFormatDate(date, { weekday: 'short', day: 'numeric', month: 'short' });
                  
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
                      type="button"
                      onClick={() => {
                        setSelectedDate(parseIsoDate(date));
                        setIsHistoryModalOpen(false);
                        triggerHaptic('light');
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-900 dark:text-amber-200 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{date}</span>
                        <span className="text-[11px] text-slate-400">({formattedDate})</span>
                      </div>
                      <div className="text-[11px] font-bold">
                        <span className="text-emerald-600">{dayPresent} উপস্থিত</span>
                        {dayAbsent > 0 && <span className="text-sky-600 ml-1.5">• {dayAbsent} ছুটি</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================== MODAL 3: PREVIEW REPORT ===================== */}
        {previewReport && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-4 sm:p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {previewReport.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setPreviewReport(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] whitespace-pre-wrap max-h-[60vh] overflow-y-auto leading-relaxed border border-slate-800">
                {previewReport.content}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    shareToWhatsAppOrSystem({ text: previewReport.content });
                    setPreviewReport(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={13} />
                  <span>WhatsApp-এ পাঠান</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(previewReport.content);
                    toast.success('কপি হয়েছে!');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy size={13} />
                  <span>কপি</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== MODAL 4: AUTH & INCHARGE INFO ===================== */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-4 sm:p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Shield size={16} className="text-amber-500" />
                  <span>ইনচার্জ ও লগইন প্রোফাইল</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
                <p className="text-slate-500">লগইনকৃত ইমেইল:</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 break-all">{currentUserEmail || 'None'}</p>
                <p className="text-slate-500 pt-1">অ্যাক্সেস রোল:</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                  {effectiveAuditorRole}
                </span>
              </div>

              {isUserAdmin && (
                <Link
                  to="/discipline-audit/roles"
                  className="w-full py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <span>ইনচার্জ ব্যবস্থাপনা (Manage Incharges)</span>
                  <ExternalLink size={12} />
                </Link>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsAuthModalOpen(false);
                    toast.success('লগআউট সফল হয়েছে');
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  লগআউট (Logout)
                </button>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
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
