import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, 
  Send, ArrowLeft,
  User,
  MessageSquare, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const COUNSELORS_LIST = [
  'HG Raghav Kirtan Das',
  'HG Rashbihari KC Das',
  'Custom (অন্যান্য)'
];

interface CounselleeLog {
  id: string;
  name: string;
  phone?: string;
  submitted: boolean;
  submitTime?: string;
  bodyScore: number;
  soulScore: number;
  mangalarati: boolean;
  japaRounds: number;
  japaFinishTime: string;
  scriptureStudyMin: number;
  lectureHearingMin: number;
  seva: string;
  academicHours: string;
  bookDist: string;
  devoteeCare: string;
  sloka: string;
  counselorComment?: string;
}

const INITIAL_COUNSELLEES: CounselleeLog[] = [
  {
    id: '1',
    name: 'Gian Juti Tripura',
    submitted: true,
    submitTime: '08:15 AM',
    bodyScore: 92,
    soulScore: 95,
    mangalarati: true,
    japaRounds: 18,
    japaFinishTime: '7.30 am',
    scriptureStudyMin: 60,
    lectureHearingMin: 60,
    seva: 'Translating Utkarsha book',
    academicHours: '4 h',
    bookDist: '4 BG cs small books',
    devoteeCare: '02+',
    sloka: 'BG 7.19'
  },
  {
    id: '2',
    name: 'Utpol Das Khocon',
    submitted: true,
    submitTime: '07:45 AM',
    bodyScore: 88,
    soulScore: 90,
    mangalarati: true,
    japaRounds: 16,
    japaFinishTime: '7.45 am',
    scriptureStudyMin: 45,
    lectureHearingMin: 45,
    seva: '1. Offering Arati & Sringer (6:00 AM)',
    academicHours: '3 h',
    bookDist: '2 BG small books',
    devoteeCare: '01',
    sloka: 'BG 2.13'
  },
  {
    id: '3',
    name: 'Chaitanya Das',
    submitted: true,
    submitTime: '08:30 AM',
    bodyScore: 90,
    soulScore: 96,
    mangalarati: true,
    japaRounds: 18,
    japaFinishTime: '7.15 am',
    scriptureStudyMin: 60,
    lectureHearingMin: 50,
    seva: '3. Cleaning utensils at night + Mangal Arati Kirton',
    academicHours: '5 h',
    bookDist: '3 BG small books',
    devoteeCare: '02',
    sloka: 'BG 4.34'
  },
  {
    id: '4',
    name: 'Pranto C Das',
    submitted: false,
    bodyScore: 0,
    soulScore: 0,
    mangalarati: false,
    japaRounds: 0,
    japaFinishTime: '-',
    scriptureStudyMin: 0,
    lectureHearingMin: 0,
    seva: '4. Preparing veg at night for morning',
    academicHours: 'nil',
    bookDist: 'nil',
    devoteeCare: 'nil',
    sloka: 'none'
  },
  {
    id: '5',
    name: 'Sanga Das',
    submitted: true,
    submitTime: '07:20 AM',
    bodyScore: 94,
    soulScore: 92,
    mangalarati: true,
    japaRounds: 16,
    japaFinishTime: '7.00 am',
    scriptureStudyMin: 45,
    lectureHearingMin: 40,
    seva: '9. Cooking in the morning (5:30 AM - 8:30 AM)',
    academicHours: '4 h',
    bookDist: '2 books',
    devoteeCare: '01',
    sloka: 'BG 9.27'
  },
  {
    id: '6',
    name: 'Dipendranath Roy',
    submitted: true,
    submitTime: '08:00 AM',
    bodyScore: 86,
    soulScore: 88,
    mangalarati: true,
    japaRounds: 16,
    japaFinishTime: '8.00 am',
    scriptureStudyMin: 40,
    lectureHearingMin: 35,
    seva: '5. Cleaning utensils + Prasad hall + Breakfast',
    academicHours: '3 h',
    bookDist: '1 book',
    devoteeCare: '01',
    sloka: 'BG 18.66'
  },
  {
    id: '7',
    name: 'Ankon Das',
    submitted: false,
    bodyScore: 0,
    soulScore: 0,
    mangalarati: false,
    japaRounds: 0,
    japaFinishTime: '-',
    scriptureStudyMin: 0,
    lectureHearingMin: 0,
    seva: '7. Lunch service + Gather utensils',
    academicHours: 'nil',
    bookDist: 'nil',
    devoteeCare: 'nil',
    sloka: 'none'
  },
  {
    id: '8',
    name: 'Antar Das',
    submitted: true,
    submitTime: '08:10 AM',
    bodyScore: 90,
    soulScore: 90,
    mangalarati: true,
    japaRounds: 16,
    japaFinishTime: '7.30 am',
    scriptureStudyMin: 45,
    lectureHearingMin: 45,
    seva: '8. Veranda cleaning + Deities room',
    academicHours: '4 h',
    bookDist: '2 books',
    devoteeCare: '02',
    sloka: 'BG 12.8'
  },
  {
    id: '9',
    name: 'Roton Das',
    submitted: true,
    submitTime: '07:50 AM',
    bodyScore: 92,
    soulScore: 94,
    mangalarati: true,
    japaRounds: 16,
    japaFinishTime: '7.15 am',
    scriptureStudyMin: 60,
    lectureHearingMin: 45,
    seva: '10. Dinner service + Prasad hall + Utensils',
    academicHours: '4.5 h',
    bookDist: '3 books',
    devoteeCare: '02',
    sloka: 'BG 7.7'
  },
  {
    id: '10',
    name: 'Joy Das',
    submitted: false,
    bodyScore: 0,
    soulScore: 0,
    mangalarati: false,
    japaRounds: 0,
    japaFinishTime: '-',
    scriptureStudyMin: 0,
    lectureHearingMin: 0,
    seva: '11. Cooking in the night for morning',
    academicHours: 'nil',
    bookDist: 'nil',
    devoteeCare: 'nil',
    sloka: 'none'
  },
  {
    id: '11',
    name: 'Joykan Das',
    submitted: true,
    submitTime: '08:05 AM',
    bodyScore: 88,
    soulScore: 91,
    mangalarati: true,
    japaRounds: 16,
    japaFinishTime: '7.45 am',
    scriptureStudyMin: 45,
    lectureHearingMin: 40,
    seva: '12. Breakfast service + Prasad hall + Utensils',
    academicHours: '3 h',
    bookDist: '1 book',
    devoteeCare: '01',
    sloka: 'BG 2.20'
  },
  {
    id: '12',
    name: 'Bappi Chowdhury',
    submitted: true,
    submitTime: '08:25 AM',
    bodyScore: 90,
    soulScore: 89,
    mangalarati: true,
    japaRounds: 16,
    japaFinishTime: '7.30 am',
    scriptureStudyMin: 40,
    lectureHearingMin: 45,
    seva: 'Campus Book Distribution & Preaching',
    academicHours: '4 h',
    bookDist: '4 books',
    devoteeCare: '02',
    sloka: 'BG 18.65'
  }
];

export const CounselorDesk: React.FC = () => {
  const { language } = useLanguage();
  const [selectedCounselor, setSelectedCounselor] = useState(
    localStorage.getItem('voice_sadhana_counselor_name') || COUNSELORS_LIST[0]
  );
  const [counsellees] = useState<CounselleeLog[]>(INITIAL_COUNSELLEES);
  const [selectedStudent, setSelectedStudent] = useState<CounselleeLog>(INITIAL_COUNSELLEES[0]);
  const [customComment, setCustomComment] = useState(
    'Hare Krishna Prabhu! Please study your academic and spiritual books daily. Your morning japa and seva absorption are deeply appreciated. 🙏'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });

  const filteredStudents = counsellees.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const submittedCount = counsellees.filter(s => s.submitted).length;
  const pendingCount = counsellees.length - submittedCount;

  const handleSendFeedbackWhatsApp = (student: CounselleeLog) => {
    const feedbackMsg = `*Counselor Feedback & Blessing (${todayFormatted})*\n` +
      `*Student:* ${student.name}\n` +
      `*Counselor:* ${selectedCounselor}\n\n` +
      `*Status:* ${student.submitted ? `Submitted (Body: ${student.bodyScore}%, Soul: ${student.soulScore}%)` : 'Pending'}\n` +
      `*Today's Seva:* ${student.seva}\n\n` +
      `*Counselor's Message:*\n"${customComment}"\n\n` +
      `Hare Krishna! Dandavat Pranam! 🙏`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(feedbackMsg)}`, '_blank');
    toast.success(`Feedback sent to ${student.name} via WhatsApp!`);
  };

  const handleSendReminderWhatsApp = (student: CounselleeLog) => {
    const msg = `Hare Krishna ${student.name} Prabhu!\nThis is a gentle reminder from ${selectedCounselor} to submit today's Sadhana Card (${todayFormatted}). Please update your log after morning chanting. 🙏`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleBroadcastAll = () => {
    const msg = `*Advaita VOICE Morning Sadhana Reminder (${todayFormatted})*\n` +
      `From: ${selectedCounselor}\n\n` +
      `Hare Krishna dear students! Please complete your morning sadhana card logging and seva on time today. May Srila Prabhupada bless your devotional life! 🙏`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs hover:shadow-md transition-all duration-200 group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-indigo-600 dark:text-indigo-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
            Advaita VOICE Counselor Mentorship Hub
          </span>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <ShieldCheck size={14} />
              <span>Counselor Sadhana Audit &amp; Care Desk</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'কাউন্সেলর সাধনা অডিট ও কেয়ার ডেস্ক' : 'Counselor Sadhana Audit & Care Desk'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? '১২ জন শিক্ষার্থীর সাধনা যাচাই করুন, ব্যক্তিগত মন্তব্য ও আশীর্বাদ পাঠান এবং ১-ট্যাপে হোয়াটসঅ্যাপ ফলো-আপ করুন।'
                : `Review 12 counsellees' daily sadhana submissions, provide individual feedback and send 1-tap WhatsApp blessings.`}
            </p>
          </div>
        </div>

        {/* Counselor Selector & Global Actions Bar */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <User size={18} className="text-amber-500 shrink-0" />
            <div className="w-full sm:w-64">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                {language === 'bn' ? 'কাউন্সেলর নির্বাচন' : 'Active Counselor'}
              </label>
              <select
                value={selectedCounselor}
                onChange={(e) => {
                  setSelectedCounselor(e.target.value);
                  localStorage.setItem('voice_sadhana_counselor_name', e.target.value);
                }}
                className="w-full mt-0.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                {COUNSELORS_LIST.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleBroadcastAll}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-102 transition-all cursor-pointer"
            >
              <Send size={13} />
              <span>Broadcast Reminder to All 12</span>
            </button>
          </div>
        </div>

        {/* Real-time Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Students</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">12</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-center">
            <span className="text-[11px] font-bold text-emerald-600 uppercase block">Submitted Today</span>
            <span className="text-2xl font-black text-emerald-600">{submittedCount} / 12</span>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-center">
            <span className="text-[11px] font-bold text-rose-600 uppercase block">Pending</span>
            <span className="text-2xl font-black text-rose-600">{pendingCount} Students</span>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 text-center">
            <span className="text-[11px] font-bold text-indigo-600 uppercase block">Avg Ashram Score</span>
            <span className="text-2xl font-black text-indigo-600">93.4%</span>
          </div>
        </div>

        {/* Main 2-Column Workspace: Left = Student List, Right = Detailed Inspection & Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 12 Students List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  12 Counsellees ({todayFormatted})
                </h3>
                <span className="text-[10px] font-bold text-slate-400">Click to Inspect</span>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter student name..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudent.id === student.id;
                  return (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 shadow-xs scale-101'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {student.name}
                          </span>
                          {student.submitted ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded-full">
                              {student.submitTime}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.2 rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          Seva: {student.seva}
                        </p>
                      </div>

                      {student.submitted ? (
                        <div className="text-right shrink-0 font-mono text-[11px] font-bold">
                          <span className="text-indigo-600 dark:text-indigo-400 block">B: {student.bodyScore}%</span>
                          <span className="text-emerald-600 dark:text-emerald-400 block">S: {student.soulScore}%</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendReminderWhatsApp(student);
                          }}
                          className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 text-[10px] font-bold hover:bg-rose-100 transition-all shrink-0"
                        >
                          Ping WA
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Student Inspection & Feedback (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              
              {/* Student Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    <User size={13} />
                    <span>Selected Counsellee</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedStudent.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/sadhana"
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all"
                  >
                    Open in Sadhana Card
                  </Link>
                </div>
              </div>

              {/* Status Metrics Box */}
              {selectedStudent.submitted ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Body Score</span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{selectedStudent.bodyScore}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Soul Score</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{selectedStudent.soulScore}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Mangalarati</span>
                    <span className="text-xs font-black text-emerald-600 block mt-1">{selectedStudent.mangalarati ? '✅ 100%' : '❌ Missed'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Japa Finished</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white block mt-1">{selectedStudent.japaFinishTime} ({selectedStudent.japaRounds} Rds)</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  ⏳ <strong>Pending Submission:</strong> This student has not yet logged their sadhana card for today. You can send them a direct WhatsApp reminder below.
                </div>
              )}

              {/* Today's Activity Highlights */}
              {selectedStudent.submitted && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                    <div><strong>Seva Assigned:</strong> {selectedStudent.seva}</div>
                    <div><strong>Scripture Study:</strong> {selectedStudent.scriptureStudyMin} mins</div>
                    <div><strong>Lecture Hearing:</strong> {selectedStudent.lectureHearingMin} mins</div>
                    <div><strong>Academic Hours:</strong> {selectedStudent.academicHours}</div>
                    <div><strong>Book Distribution:</strong> {selectedStudent.bookDist}</div>
                    <div><strong>Sloka Memorized:</strong> {selectedStudent.sloka}</div>
                  </div>
                </div>
              )}

              {/* Counselor Direct Feedback & Comment Box */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-indigo-600" />
                  <span>Counselor&#39;s Feedback &amp; Spiritual Guidance:</span>
                </label>
                <textarea
                  rows={3}
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  placeholder="Write your spiritual feedback and guidance for this student..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleSendFeedbackWhatsApp(selectedStudent)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-102 transition-all cursor-pointer"
                  >
                    <Send size={14} />
                    <span>Send Feedback via WhatsApp</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CounselorDesk;
