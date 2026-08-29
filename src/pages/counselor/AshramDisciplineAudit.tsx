import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ArrowLeft, Calendar, Check, Copy, 
  Sparkles, ChevronLeft, ChevronRight, 
  CheckCircle2, UserPlus, Trash2, ArrowRightLeft,
  Moon, Sun, Clock, AlertCircle
} from 'lucide-react';
import { 
  type GroupType, 
  type StudentDisciplineRecord, 
  type DailyDisciplineEntry, 
  EMERGENCY_REASONS, 
  INITIAL_DISCIPLINE_STUDENTS 
} from '../../data/groupDisciplineData';
import toast from 'react-hot-toast';

const STORAGE_STUDENTS_KEY = 'advaita_discipline_students_v1';
const STORAGE_DAILY_KEY = 'advaita_discipline_daily_v1';

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

  // New Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGroup, setNewStudentGroup] = useState<GroupType>('VOICE');

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
      newDayEntries[s.id] = {
        studentId: s.id,
        dateStr: dateIso,
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
      id: `std_${Date.now()}`,
      name: newStudentName.trim(),
      group: newStudentGroup,
      monthlyStrikes: 0,
      status: 'ACTIVE'
    };

    setStudents(prev => [...prev, newStudent]);
    setNewStudentName('');
    setIsAddModalOpen(false);
    toast.success(language === 'bn' ? 'নতুন শিক্ষার্থী যুক্ত হয়েছে' : 'Added student successfully');
  };

  // Delete student
  const handleDeleteStudent = (studentId: string, name: string) => {
    if (!window.confirm(`Remove ${name} from discipline list?`)) return;
    setStudents(prev => prev.filter(s => s.id !== studentId));
    toast.success('Student removed');
  };

  // Change Date
  const changeDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  // Generate VOICE Group WhatsApp Report (Morning Program Incharge)
  const generateVoiceReport = () => {
    const voiceStudents = students.filter(s => s.group === 'VOICE');
    const compliant: string[] = [];
    const nonCompliant: string[] = [];

    voiceStudents.forEach(s => {
      const entry = getEntry(s.id);
      const isAllGood = entry.sleptOnTime && entry.wokeUpOnTime && entry.morningProgramOnTime;
      
      if (isAllGood) {
        compliant.push(s.name);
      } else {
        const issues: string[] = [];
        if (!entry.sleptOnTime) issues.push('Late Bed (>10:00 PM)');
        if (!entry.wokeUpOnTime) issues.push('Late Wake (>4:00 AM)');
        if (!entry.morningProgramOnTime) issues.push('Late to MP (>4:30 AM)');
        
        let reasonStr = entry.reason ? ` — *Reason:* ${entry.reason}` : '';
        let strikeStr = s.monthlyStrikes > 0 ? ` [Strike ${s.monthlyStrikes}/3]` : '';
        nonCompliant.push(`❌ *${s.name}* (${issues.join(', ')})${reasonStr}${strikeStr}`);
      }
    });

    let report = `🌟 *ADVAITA VOICE — MORNING PROGRAM & DISCIPLINE REPORT* 🌟\n`;
    report += `📅 *Date:* ${dateFormatted}\n`;
    report += `👤 *To Counselor:* HG Rasavihari Krishna Chandra Das\n`;
    report += `📋 *Group:* VOICE Group (Bed: <10:00 PM | Wake: 4:00 AM | MP: <4:30 AM)\n\n`;

    report += `✅ *All Rules Followed (On Time - ${compliant.length}/${voiceStudents.length}):*\n`;
    if (compliant.length > 0) {
      compliant.forEach((name, i) => {
        report += `   ${i + 1}. ${name}\n`;
      });
    } else {
      report += `   (None)\n`;
    }
    report += `\n`;

    report += `⚠️ *Rule Breaches / Exceptions (${nonCompliant.length}):*\n`;
    if (nonCompliant.length > 0) {
      nonCompliant.forEach((item, i) => {
        report += `   ${i + 1}. ${item}\n`;
      });
    } else {
      report += `   ✨ All students followed rules on time! Haribol!\n`;
    }
    report += `\n`;

    report += `🙏 *Reported by:* Morning Program Incharge (VOICE Group)\n`;
    return report;
  };

  // Generate Lotus Group WhatsApp Report (Security Manager)
  const generateLotusReport = () => {
    const lotusStudents = students.filter(s => s.group === 'LOTUS');
    const compliant: string[] = [];
    const nonCompliant: string[] = [];

    lotusStudents.forEach(s => {
      const entry = getEntry(s.id);
      const isAllGood = entry.sleptOnTime && entry.morningProgramOnTime;
      
      if (isAllGood) {
        compliant.push(s.name);
      } else {
        const issues: string[] = [];
        if (!entry.sleptOnTime) issues.push('Late Bed (>11:00 PM)');
        if (!entry.morningProgramOnTime) issues.push('Late to MP (>5:00 AM)');
        
        let reasonStr = entry.reason ? ` — *Reason:* ${entry.reason}` : '';
        let strikeStr = s.monthlyStrikes > 0 ? ` [Strike ${s.monthlyStrikes}/3]` : '';
        nonCompliant.push(`❌ *${s.name}* (${issues.join(', ')})${reasonStr}${strikeStr}`);
      }
    });

    let report = `🪷 *ADVAITA VOICE — LOTUS GROUP DISCIPLINE REPORT* 🪷\n`;
    report += `📅 *Date:* ${dateFormatted}\n`;
    report += `👤 *To Counselor:* HG Rasavihari Krishna Chandra Das\n`;
    report += `📋 *Group:* Lotus Group (Bed: <11:00 PM | MP: <5:00 AM)\n\n`;

    report += `✅ *All Rules Followed (On Time - ${compliant.length}/${lotusStudents.length}):*\n`;
    if (compliant.length > 0) {
      compliant.forEach((name, i) => {
        report += `   ${i + 1}. ${name}\n`;
      });
    } else {
      report += `   (None)\n`;
    }
    report += `\n`;

    report += `⚠️ *Rule Breaches / Exceptions (${nonCompliant.length}):*\n`;
    if (nonCompliant.length > 0) {
      nonCompliant.forEach((item, i) => {
        report += `   ${i + 1}. ${item}\n`;
      });
    } else {
      report += `   ✨ All students followed rules on time! Haribol!\n`;
    }
    report += `\n`;

    report += `🙏 *Reported by:* Security Manager (Lotus Group)\n`;
    return report;
  };

  const copyToClipboard = async (text: string, type: 'VOICE' | 'LOTUS' | 'ALL') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'VOICE') { setCopiedVoice(true); setTimeout(() => setCopiedVoice(false), 2000); }
      if (type === 'LOTUS') { setCopiedLotus(true); setTimeout(() => setCopiedLotus(false), 2000); }
      if (type === 'ALL') { setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000); }
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
          <span className="text-[11px] font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Counselor Audit Portal
          </span>
        </div>

        {/* Hero Card with Counselor Salutation & Date Navigator */}
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
                    ? 'প্রতিবেদক: মর্নিং প্রোগ্রাম ইনচার্জ ও সিকিউরিটি ম্যানেজার • প্রতিপালক: শ্রীমান রসবিহারী কৃষ্ণচন্দ্র দাস প্রভু'
                    : 'Reporting to Counselor: HG Rasavihari Krishna Chandra Das'}
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
                  • <strong>Bed:</strong> &lt; 10:00 PM &nbsp;|&nbsp; <strong>Wake:</strong> 4:00 AM &nbsp;|&nbsp; <strong>MP:</strong> &lt; 4:30 AM<br/>
                  • <em>Rule Breach:</em> 2–3 warning chances per month before demotion to Lotus.
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
                  • <strong>Bed:</strong> &lt; 11:00 PM &nbsp;|&nbsp; <strong>MP:</strong> &lt; 5:00 AM<br/>
                  • <em>Rule Breach:</em> Repeated violation leads to ashram removal.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Group Filter Tabs & Report Copy Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('VOICE')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'VOICE'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>🌟 VOICE Group ({voiceCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('LOTUS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'LOTUS'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>🪷 Lotus Group ({lotusCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>All Students</span>
            </button>
          </div>

          {/* Action Bar (Mark All + Copy Report) */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            
            {activeTab === 'VOICE' && (
              <>
                <button
                  onClick={() => handleMarkAllOnTime('VOICE')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Mark All On-Time</span>
                </button>

                <button
                  onClick={() => copyToClipboard(generateVoiceReport(), 'VOICE')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-sm transition-all cursor-pointer"
                >
                  {copiedVoice ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedVoice ? 'Copied VOICE Report!' : 'Copy VOICE Report (WhatsApp)'}</span>
                </button>
              </>
            )}

            {activeTab === 'LOTUS' && (
              <>
                <button
                  onClick={() => handleMarkAllOnTime('LOTUS')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Mark All On-Time</span>
                </button>

                <button
                  onClick={() => copyToClipboard(generateLotusReport(), 'LOTUS')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs shadow-sm transition-all cursor-pointer"
                >
                  {copiedLotus ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedLotus ? 'Copied Lotus Report!' : 'Copy Lotus Report (WhatsApp)'}</span>
                </button>
              </>
            )}

            {activeTab === 'ALL' && (
              <button
                onClick={() => {
                  const fullReport = `${generateVoiceReport()}\n-----------------------------\n\n${generateLotusReport()}`;
                  copyToClipboard(fullReport, 'ALL');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-black text-xs shadow-sm transition-all cursor-pointer"
              >
                {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedAll ? 'Copied All Reports!' : 'Copy Combined Report'}</span>
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              title="Add New Student"
            >
              <UserPlus size={16} />
            </button>
          </div>

        </div>

        {/* Student Checklist Cards */}
        <div className="space-y-3">
          {displayedStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No students found in this group. Click "+" above to add students.
            </div>
          ) : (
            displayedStudents.map(student => {
              const entry = getEntry(student.id);
              const isVoice = student.group === 'VOICE';
              const hasFailure = !entry.sleptOnTime || !entry.wokeUpOnTime || !entry.morningProgramOnTime;

              return (
                <div 
                  key={student.id}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all shadow-xs ${
                    hasFailure
                      ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Student Identity + Strikes */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isVoice 
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30' 
                          : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30'
                      }`}>
                        {student.name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                            {student.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isVoice 
                              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' 
                              : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300'
                          }`}>
                            {student.group}
                          </span>
                        </div>

                        {/* Strikes Status */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10.5px] text-slate-500 font-medium">Monthly Strikes:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3].map(st => (
                              <button
                                key={st}
                                onClick={() => handleAdjustStrikes(student.id, student.monthlyStrikes === st ? -1 : (st - student.monthlyStrikes))}
                                className={`w-4.5 h-4.5 rounded text-[9.5px] font-black flex items-center justify-center transition-all cursor-pointer ${
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
                            <span className="text-[10px] font-black text-rose-600 animate-pulse ml-1">
                              {isVoice ? '⚠️ Move to Lotus' : '⚠️ Action Required'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rule Abidance Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 max-w-xl">
                      
                      {/* 1. Bedtime */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Moon size={14} className="text-indigo-400" />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {isVoice ? '<10:00 PM Bed' : '<11:00 PM Bed'}
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
                            {isVoice ? '<4:30 AM MP' : '<5:00 AM MP'}
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

                    {/* Quick Management Actions */}
                    <div className="flex items-center gap-1.5 justify-end shrink-0">
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
                        title="Delete Student"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </div>

                  {/* Exception / Emergency Reason Dropdown (Shown if any rule was broken) */}
                  {hasFailure && (
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
