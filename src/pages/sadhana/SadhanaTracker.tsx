import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  HeartHandshake, Send, Copy, ArrowLeft, 
  Moon, Sun, CheckCircle2, 
  Flame, Share2, Calendar, BarChart3, TrendingUp,
  FileText, Check, Eye, GraduationCap, Users, Activity,
  Bell, ShieldCheck, MessageSquare, CheckCircle, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const ASHRAM_MEMBERS = [
  'Raghav Kirtan Das',
  'Gian Juti Tripura',
  'Utpol Das Khocon',
  'Chaitanya Das',
  'Pranto C Das',
  'Sanga Das',
  'Dipendranath Roy',
  'Ankon Das',
  'Antar Das',
  'Roton Das',
  'Joy Das',
  'Joykan Das',
  'Bappi Chowdhury',
  'Custom (অন্যান্য)'
];

export const ASHRAM_SERVICES_LIST = [
  '10. Dinner service + Prasad hall + Utensils (+ 1st Absent)',
  '1. Offering Arati & Sringer (6:00 AM)',
  '2. Offering Bhogo (+ 5th Absent)',
  '3. Cleaning utensils at night + Mangal Arati Kirton + Room',
  '4. Preparing veg at night for morning (+ 2nd Absent)',
  '5. Cleaning utensils + Prasad hall + Breakfast (Before 8 AM)',
  '6. Making veg at night for morning + Wash (+ 3rd Absent)',
  '7. Lunch service + Gather utensils (8 AM - 2 PM)',
  '8. Veranda cleaning + Deities room (+ 6th Absent)',
  '9. Cooking in the morning (5:30 AM - 8:30 AM)',
  '11. Cooking in the night for morning (Night)',
  '12. Breakfast service + Prasad hall + Utensils',
  'Translating Utkarsha book',
  'Book Distribution & Campus Preaching',
  'Custom (অন্যান্য)'
];

export const COUNSELORS_LIST = [
  'HG Raghav Kirtan Das',
  'HG Rashbihari KC Das',
  'Custom (অন্যান্য)'
];

// Mock Real-time Student Submissions for Counselor Portal
interface StudentStatus {
  name: string;
  submitted: boolean;
  time?: string;
  bodyScore: number;
  soulScore: number;
  mangalarati: boolean;
  japaRounds: number;
  seva: string;
  counselorRemark?: string;
}

const INITIAL_STUDENT_STATUSES: StudentStatus[] = [
  { name: 'Gian Juti Tripura', submitted: true, time: '08:15 AM', bodyScore: 92, soulScore: 95, mangalarati: true, japaRounds: 18, seva: 'Translating Utkarsha book' },
  { name: 'Utpol Das Khocon', submitted: true, time: '07:45 AM', bodyScore: 88, soulScore: 90, mangalarati: true, japaRounds: 16, seva: '1. Offering Arati & Sringer' },
  { name: 'Chaitanya Das', submitted: true, time: '08:30 AM', bodyScore: 90, soulScore: 96, mangalarati: true, japaRounds: 18, seva: '3. Cleaning utensils & Kirtan' },
  { name: 'Pranto C Das', submitted: false, bodyScore: 0, soulScore: 0, mangalarati: false, japaRounds: 0, seva: '4. Preparing veg at night' },
  { name: 'Sanga Das', submitted: true, time: '07:20 AM', bodyScore: 94, soulScore: 92, mangalarati: true, japaRounds: 16, seva: '9. Cooking morning' },
  { name: 'Dipendranath Roy', submitted: true, time: '08:00 AM', bodyScore: 86, soulScore: 88, mangalarati: true, japaRounds: 16, seva: '5. Cleaning utensils' },
  { name: 'Ankon Das', submitted: false, bodyScore: 0, soulScore: 0, mangalarati: false, japaRounds: 0, seva: '7. Lunch service' },
  { name: 'Antar Das', submitted: true, time: '08:10 AM', bodyScore: 90, soulScore: 90, mangalarati: true, japaRounds: 16, seva: '8. Veranda cleaning' },
  { name: 'Roton Das', submitted: true, time: '07:50 AM', bodyScore: 92, soulScore: 94, mangalarati: true, japaRounds: 16, seva: '10. Dinner service' },
  { name: 'Joy Das', submitted: false, bodyScore: 0, soulScore: 0, mangalarati: false, japaRounds: 0, seva: '11. Cooking night' },
  { name: 'Joykan Das', submitted: true, time: '08:05 AM', bodyScore: 88, soulScore: 91, mangalarati: true, japaRounds: 16, seva: '12. Breakfast service' },
  { name: 'Bappi Chowdhury', submitted: true, time: '08:25 AM', bodyScore: 90, soulScore: 89, mangalarati: true, japaRounds: 16, seva: 'Campus Book Distribution' }
];

export const SadhanaTracker: React.FC = () => {
  const { language } = useLanguage();

  // Active View Tab: 'FORM' | 'REPORTS' | 'COUNSELOR_PORTAL'
  const [activeTab, setActiveTab] = useState<'FORM' | 'REPORTS' | 'COUNSELOR_PORTAL'>('FORM');
  const [reportType, setReportType] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [copied, setCopied] = useState(false);

  // Form State - Devotee & Counselor Dropdowns
  const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const [selectedDevotee, setSelectedDevotee] = useState(localStorage.getItem('voice_sadhana_devotee_name') || ASHRAM_MEMBERS[0]);
  const [customDevoteeName, setCustomDevoteeName] = useState('');
  
  const [selectedCounselor, setSelectedCounselor] = useState(() => {
    const saved = localStorage.getItem('voice_sadhana_counselor_name');
    if (saved === 'HG Raghav Kirtan Das' || saved === 'HG Rashbihari KC Das' || saved === 'Custom (অন্যান্য)') {
      return saved;
    }
    return 'HG Raghav Kirtan Das';
  });
  const [customCounselorName, setCustomCounselorName] = useState('');

  const [reportDate, setReportDate] = useState(todayFormatted);

  const effectiveDevoteeName = selectedDevotee === 'Custom (অন্যান্য)' ? (customDevoteeName.trim() || 'Gian Juti Tripura') : selectedDevotee;
  const effectiveCounselorName = selectedCounselor === 'Custom (অন্যান্য)' ? (customCounselorName.trim() || 'HG Raghav Kirtan Das') : selectedCounselor;

  // Counselor Portal Remarks State
  const [counselorRemarkText, setCounselorRemarkText] = useState(
    localStorage.getItem('voice_counselor_remark') || 'Please study your academic and spiritual books daily.'
  );
  const [studentStatuses] = useState<StudentStatus[]>(INITIAL_STUDENT_STATUSES);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // 1. Body Fields
  const [wentToBed, setWentToBed] = useState('9.10 pm');
  const [gotUp, setGotUp] = useState('3.20AM');
  const [dayRestMin, setDayRestMin] = useState('0');

  // 2. Soul Fields
  const [japa16FinishTime, setJapa16FinishTime] = useState('7.30 am');
  const [totalJapaRounds, setTotalJapaRounds] = useState('18');
  const [japaQuality, setJapaQuality] = useState<'high' | 'medium' | 'low'>('medium');
  const [japaOneSittingRounds, setJapaOneSittingRounds] = useState('13');
  const [scriptureStudyMin, setScriptureStudyMin] = useState('60');
  const [scriptureStudyNote, setScriptureStudyNote] = useState(true);

  // Lecture Hearing Fields
  const [lectureGuruMaharajMin, setLectureGuruMaharajMin] = useState('30');
  const [lectureSrilaPrabhupadaMin, setLectureSrilaPrabhupadaMin] = useState('0');
  const [lectureOtherMin, setLectureOtherMin] = useState('30+');
  const [lectureNotesTaken, setLectureNotesTaken] = useState(true);

  // Seva & Harinam Fields
  const [selectedService, setSelectedService] = useState('10. Dinner service + Prasad hall + Utensils (+ 1st Absent)');
  const [customRenderedSeva, setCustomRenderedSeva] = useState('');
  const effectiveRenderedSeva = selectedService === 'Custom (অন্যান্য)' ? (customRenderedSeva || 'Seva') : selectedService;
  const [hnCount, setHnCount] = useState('');

  // 3. Morning Program Fields
  const [mangalarati, setMangalarati] = useState(true);
  const [nrsimharati, setNrsimharati] = useState(true);
  const [tulasiArati, setTulasiArati] = useState(true);
  const [wateringVrinda, setWateringVrinda] = useState(true);
  const [siksastakamTenOffenses, setSiksastakamTenOffenses] = useState(true);

  // 4. Material Study & Career Field
  const [academicStudyHours, setAcademicStudyHours] = useState('nil');

  // 5. Preaching & Care Fields (NO Japamala distribution)
  const [bookDistCount, setBookDistCount] = useState('4  BG cs small books');
  const [devoteeCareCount, setDevoteeCareCount] = useState('02+');
  const [krishnaKathaMin, setKrishnaKathaMin] = useState('60+');
  const [harinamKirtanMin, setHarinamKirtanMin] = useState('0');

  // 6. Additional Activities
  const [slokaMemorising, setSlokaMemorising] = useState('no');
  const [obeisancesCount, setObeisancesCount] = useState('10±');
  const [journalWriting, setJournalWriting] = useState('');
  const [yogaExerciseMin, setYogaExerciseMin] = useState('0');
  const [walkingMin, setWalkingMin] = useState('0+');
  const [bhajanDone, setBhajanDone] = useState('');
  const [socialMediaMin, setSocialMediaMin] = useState('10+');

  // Save selected names to localStorage
  useEffect(() => {
    localStorage.setItem('voice_sadhana_devotee_name', selectedDevotee);
    localStorage.setItem('voice_sadhana_counselor_name', selectedCounselor);
  }, [selectedDevotee, selectedCounselor]);

  const morningCount = [mangalarati, nrsimharati, tulasiArati, wateringVrinda, siksastakamTenOffenses].filter(Boolean).length;
  const morningPercentage = Math.round((morningCount / 5) * 100);

  // --- REPORT GENERATORS ---

  // 1. EXACT SECTIONALLY ORGANIZED DAILY REPORT
  const generateDailyReportText = () => {
    return `*Sadhana Report On ${reportDate}*\n${effectiveDevoteeName}\n\n` +
      `*Body*\n` +
      `(1) Went to bed: ${wentToBed}\n` +
      `(2) Got up: ${gotUp}\n` +
      `(3) Day rest: ${dayRestMin}minutes\n\n` +
      `*Soul*\n` +
      `(1) Japa: 16 rounds (${japa16FinishTime}) Total: ${totalJapaRounds} Japa Quality: ${japaQuality}\n` +
      `chanting in one sitting: ${japaOneSittingRounds} rounds\n` +
      `(2) Studying Scriptures: ${scriptureStudyMin} minutes\n` +
      `Note: ${scriptureStudyNote ? 'yes' : 'no'}\n` +
      `(3) Lecture Hearing:\n` +
      `✓Guru Maharaj ${lectureGuruMaharajMin} mins\n` +
      `✓Srila Prabhupada ${lectureSrilaPrabhupadaMin} mins\n` +
      `✓other hearing ${lectureOtherMin} minutes,\n\n` +
      `Preparing notes from lectures: ${lectureNotesTaken ? 'yes' : 'no'}\n` +
      `✓HN count: ${hnCount}\n` +
      `✓Rendered seva: ${effectiveRenderedSeva}\n\n` +
      `*Morning Program*\n` +
      `(1) Mangalarati: ${mangalarati ? 'yes' : 'no'}\n` +
      `(2) Nrishimharati: ${nrsimharati ? 'yes' : 'no'}\n` +
      `(3) Tulshi Arati: ${tulasiArati ? 'yes' : 'no'}\n` +
      `(4) Watering Vrinda: ${wateringVrinda ? 'yes' : 'no'}\n` +
      `(5) Siksastakam prayers and ten offenses recitation: ${siksastakamTenOffenses ? 'yes' : 'no'}\n\n` +
      `*Material study and career*: ${academicStudyHours}\n\n` +
      `*Preaching*\n` +
      `✓Book Distribution- ${bookDistCount}\n` +
      `✓taking care of devotees: ${devoteeCareCount}\n` +
      `✓talking about Krishna: ${krishnaKathaMin} mins -\n` +
      `Harinam kirtan: ${harinamKirtanMin} min\n\n` +
      `*Additional*\n` +
      `(1) Sloka Memorising: ${slokaMemorising}\n` +
      `(2) offering obeisance: ${obeisancesCount} times\n` +
      `(3) Journal writing: ${journalWriting}\n` +
      `Yoga Exercise: ${yogaExerciseMin} min\n` +
      `Walking: ${walkingMin} minutes\n` +
      `Bhajan: ${bhajanDone}\n` +
      `Social Media browsing: ${socialMediaMin} min`;
  };

  // 2. CONCISE WEEKLY REPORT
  const generateWeeklyReportText = () => {
    return `*Weekly Sadhana Summary (${reportDate})*\n` +
      `*Student / Counsellee:* ${effectiveDevoteeName}\n` +
      `*Counselor:* ${effectiveCounselorName}\n\n` +
      `*BODY (Avg: 79%)*\n` +
      `• To Bed: 77% (Avg 9.15 pm)\n` +
      `• Wake Up: 85% (Avg 3.25 am)\n` +
      `• Day Rest: 74% (Avg ${dayRestMin} min)\n\n` +
      `*SOUL (Avg: 72%)*\n` +
      `• Japa: 74% (Avg ${totalJapaRounds} rounds)\n` +
      `• SP Books: 71% (Avg ${scriptureStudyMin} min/day)\n` +
      `• Lecture Hearing: 71% (Avg 35 min/day)\n\n` +
      `*SEVA (Total & Avg)*\n` +
      `• Study / Academic Work: ${academicStudyHours === 'nil' ? '14 Hours' : academicStudyHours}\n` +
      `• Cleaning / Seva: 125 Min\n` +
      `• Devotee Follow Up: ${devoteeCareCount} devotees\n` +
      `• Book Distribution (BBT/CS): ${bookDistCount}\n` +
      `• Morning Class / Program: ${morningPercentage}%\n\n` +
      `*OTHERS*\n` +
      `• Sadhana Card: 100%\n` +
      `• Sloka Memorizing: ${slokaMemorising}\n` +
      `• Bhajan: ${bhajanDone || 'Regular'}\n\n` +
      `*Overall Average Score: 78%*\n` +
      `*Counselor's Comment (${effectiveCounselorName}):* ${counselorRemarkText}`;
  };

  // 3. CONCISE MONTHLY REPORT
  const generateMonthlyReportText = () => {
    return `*Monthly Sadhana Summary (${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })})*\n` +
      `*Student / Counsellee:* ${effectiveDevoteeName}\n` +
      `*Counselor:* ${effectiveCounselorName}\n\n` +
      `*BODY (Monthly Avg: 81%)*\n` +
      `• To Bed Avg: 78% (9.20 pm)\n` +
      `• Wake Up Avg: 86% (3.25 am)\n` +
      `• Day Rest Avg: 75% (15 min)\n\n` +
      `*SOUL (Monthly Avg: 76%)*\n` +
      `• Japa Avg: 76% (16.5 rounds/day)\n` +
      `• SP Books Study: 75% (24 Hours Total)\n` +
      `• Lecture Hearing: 76% (28 Hours Total)\n\n` +
      `*SEVA & ACADEMICS*\n` +
      `• Study / Academic Work: 85 Hours\n` +
      `• Cleaning / Seva: 10 Hours\n` +
      `• Devotee Follow Up: 15 Devotees\n` +
      `• Book Distribution (BBT/CS): 18 Books\n` +
      `• Morning Program Consistency: 96%\n\n` +
      `*OTHERS*\n` +
      `• Sadhana Card: 100%\n` +
      `• Sloka Memorizing: 4 Slokas\n` +
      `• Bhajan / Kirtan: Regular\n\n` +
      `*Overall Monthly Average: 80%*\n` +
      `*Counselor's Blessing & Comment (${effectiveCounselorName}):* ${counselorRemarkText}`;
  };

  const copyReport = (type: 'DAILY' | 'WEEKLY' | 'MONTHLY') => {
    let report = '';
    if (type === 'DAILY') report = generateDailyReportText();
    else if (type === 'WEEKLY') report = generateWeeklyReportText();
    else report = generateMonthlyReportText();

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(language === 'bn' ? 'রিপোর্ট কপি হয়েছে! হোয়াটসঅ্যাপে পেস্ট করুন।' : 'Report copied! Ready to paste in WhatsApp.');
  };

  const shareViaWhatsApp = (type: 'DAILY' | 'WEEKLY' | 'MONTHLY') => {
    let report = '';
    if (type === 'DAILY') report = generateDailyReportText();
    else if (type === 'WEEKLY') report = generateWeeklyReportText();
    else report = generateMonthlyReportText();

    const encoded = encodeURIComponent(report);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Counselor Actions
  const handleSaveCounselorRemark = () => {
    localStorage.setItem('voice_counselor_remark', counselorRemarkText);
    toast.success(language === 'bn' ? 'কাউন্সেলর মন্তব্য ও আশীর্বাদ সংরক্ষিত হয়েছে!' : 'Counselor Remark & Blessing saved!');
  };

  const handleBroadcastReminder = () => {
    const msg = `Hare Krishna Dandavat Pranam to all Counsellees!\nThis is a gentle reminder from ${effectiveCounselorName} to submit today's Sadhana Card (${todayFormatted}). Let us maintain steady 16 rounds and morning Mangalarati. 🙏`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Back & Action Bar */}
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all duration-200 group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-indigo-600 dark:text-indigo-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
              Advaita VOICE Digital Sadhana Card
            </span>
          </div>
        </div>

        {/* Hero Header with Animated Gradient Accent */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <HeartHandshake size={13} className="animate-bounce" />
              <span>Counselor Sadhana &amp; Student Care System</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'ডিজিটাল সাধনাপত্র ও কাউন্সেলর পোর্টাল' : 'Digital Sadhana & Counselor Portal'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'শিক্ষার্থীদের দৈনিক সাধনা এন্ট্রি, হোয়াটসঅ্যাপ রিপোর্ট এবং কাউন্সেলর প্রভুদের সরাসরি মনিটরিং ও রিভিউ ড্যাশবোর্ড।'
                : 'Student daily sadhana logging, WhatsApp reports, and live Counselor review, notifications & guidance dashboard.'}
            </p>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 flex-wrap">
          <button
            onClick={() => setActiveTab('FORM')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'FORM'
                ? 'bg-indigo-600 text-white shadow-md scale-102'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <FileText size={14} />
            <span>{language === 'bn' ? '📝 সাধনা এন্ট্রি ফর্ম ও লাইভ প্রিভিউ' : '📝 Sadhana Form & Live Preview'}</span>
          </button>

          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'REPORTS'
                ? 'bg-indigo-600 text-white shadow-md scale-102'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Share2 size={14} />
            <span>{language === 'bn' ? '📲 কাউন্সেলর ৩টি রিপোর্ট' : '📲 3 WhatsApp Reports'}</span>
          </button>

          <button
            onClick={() => setActiveTab('COUNSELOR_PORTAL')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'COUNSELOR_PORTAL'
                ? 'bg-indigo-600 text-white shadow-md scale-102'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
            }`}
          >
            <ShieldCheck size={14} />
            <span>{language === 'bn' ? '👨‍🏫 কাউন্সেলর ম্যানেজমেন্ট পোর্টাল' : '👨‍🏫 Counselor Management Portal'}</span>
          </button>
        </div>

        {/* ================= TAB 1: FORM & LIVE PREVIEW ================= */}
        {activeTab === 'FORM' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
            
            {/* Left Column: Form Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Devotee & Counselor Dropdowns Bar */}
              <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                {/* Devotee Dropdown */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1">
                    {language === 'bn' ? '👤 শিক্ষার্থী নির্বাচন' : '👤 Student Name'}
                  </label>
                  <select 
                    value={selectedDevotee}
                    onChange={(e) => setSelectedDevotee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    {ASHRAM_MEMBERS.map((m, idx) => (
                      <option key={idx} value={m}>{m}</option>
                    ))}
                  </select>

                  {selectedDevotee === 'Custom (অন্যান্য)' && (
                    <input 
                      type="text"
                      value={customDevoteeName}
                      onChange={(e) => setCustomDevoteeName(e.target.value)}
                      placeholder="Enter student name..."
                      className="w-full mt-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-indigo-300 text-xs font-bold"
                    />
                  )}
                </div>

                {/* Counselor Dropdown */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1">
                    {language === 'bn' ? '👨‍🏫 কাউন্সেলর প্রভু' : '👨‍🏫 Counselor Prabhu'}
                  </label>
                  <select 
                    value={selectedCounselor}
                    onChange={(e) => setSelectedCounselor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    {COUNSELORS_LIST.map((c, idx) => (
                      <option key={idx} value={c}>{c}</option>
                    ))}
                  </select>

                  {selectedCounselor === 'Custom (অন্যান্য)' && (
                    <input 
                      type="text"
                      value={customCounselorName}
                      onChange={(e) => setCustomCounselorName(e.target.value)}
                      placeholder="Enter counselor name..."
                      className="w-full mt-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-indigo-300 text-xs font-bold"
                    />
                  )}
                </div>

                {/* Report Date */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1">
                    {language === 'bn' ? '📅 তারিখ (Date)' : '📅 Report Date'}
                  </label>
                  <input 
                    type="text"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Section 1: BODY */}
              <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Moon size={16} className="text-indigo-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    *Body* (দেহ ও নিদ্রা নিয়ন্ত্রণ)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      (1) Went to bed:
                    </label>
                    <input 
                      type="text"
                      value={wentToBed}
                      onChange={(e) => setWentToBed(e.target.value)}
                      placeholder="e.g. 9.10 pm"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      (2) Got up:
                    </label>
                    <input 
                      type="text"
                      value={gotUp}
                      onChange={(e) => setGotUp(e.target.value)}
                      placeholder="e.g. 3.20AM"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      (3) Day rest:
                    </label>
                    <input 
                      type="text"
                      value={dayRestMin}
                      onChange={(e) => setDayRestMin(e.target.value)}
                      placeholder="e.g. 0"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: SOUL */}
              <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Sun size={16} className="text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    *Soul* (জপ, শাস্ত্র অধ্যয়ন ও প্রবচন শ্রবণ)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      (1) Japa finish time:
                    </label>
                    <input 
                      type="text"
                      value={japa16FinishTime}
                      onChange={(e) => setJapa16FinishTime(e.target.value)}
                      placeholder="e.g. 7.30 am"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Total rounds:
                    </label>
                    <input 
                      type="text"
                      value={totalJapaRounds}
                      onChange={(e) => setTotalJapaRounds(e.target.value)}
                      placeholder="e.g. 18"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Japa Quality:
                    </label>
                    <select 
                      value={japaQuality}
                      onChange={(e) => setJapaQuality(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    >
                      <option value="medium">medium (মাঝারি)</option>
                      <option value="high">high (উত্তম)</option>
                      <option value="low">low (বিক্ষিপ্ত)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      In one sitting:
                    </label>
                    <input 
                      type="text"
                      value={japaOneSittingRounds}
                      onChange={(e) => setJapaOneSittingRounds(e.target.value)}
                      placeholder="e.g. 13"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Scripture & Lecture */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-900 dark:text-white">
                        (2) Studying Scriptures:
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={scriptureStudyNote}
                          onChange={(e) => setScriptureStudyNote(e.target.checked)}
                          className="rounded text-indigo-600"
                        />
                        <span>Note: yes</span>
                      </label>
                    </div>
                    <input 
                      type="text"
                      value={scriptureStudyMin}
                      onChange={(e) => setScriptureStudyMin(e.target.value)}
                      placeholder="e.g. 60"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-900 dark:text-white">
                        (3) Lecture Hearing (mins):
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={lectureNotesTaken}
                          onChange={(e) => setLectureNotesTaken(e.target.checked)}
                          className="rounded text-indigo-600"
                        />
                        <span>Notes: yes</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-400 block">✓Guru Maharaj:</span>
                        <input 
                          type="text"
                          value={lectureGuruMaharajMin}
                          onChange={(e) => setLectureGuruMaharajMin(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">✓Srila Prabhupada:</span>
                        <input 
                          type="text"
                          value={lectureSrilaPrabhupadaMin}
                          onChange={(e) => setLectureSrilaPrabhupadaMin(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">✓other hearing:</span>
                        <input 
                          type="text"
                          value={lectureOtherMin}
                          onChange={(e) => setLectureOtherMin(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seva Rendered with 12 Services Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      ✓ Rendered seva:
                    </label>
                    <select 
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      {ASHRAM_SERVICES_LIST.map((s, idx) => (
                        <option key={idx} value={s}>{s}</option>
                      ))}
                    </select>

                    {selectedService === 'Custom (অন্যান্য)' && (
                      <input 
                        type="text"
                        value={customRenderedSeva}
                        onChange={(e) => setCustomRenderedSeva(e.target.value)}
                        placeholder="Type custom seva description..."
                        className="w-full mt-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-indigo-300 text-xs font-bold"
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      ✓ HN count:
                    </label>
                    <input 
                      type="text"
                      value={hnCount}
                      onChange={(e) => setHnCount(e.target.value)}
                      placeholder="e.g. leave blank or count"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: MORNING PROGRAM */}
              <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Flame size={16} className="text-orange-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      *Morning Program* (প্রভাতীয় কার্যক্রম)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 font-mono">
                    {morningCount}/5 Done ({morningPercentage}%)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { label: '(1) Mangalarati', val: mangalarati, set: setMangalarati },
                    { label: '(2) Nrishimharati', val: nrsimharati, set: setNrsimharati },
                    { label: '(3) Tulshi Arati', val: tulasiArati, set: setTulasiArati },
                    { label: '(4) Watering Vrinda', val: wateringVrinda, set: setWateringVrinda },
                    { label: '(5) Siksastakam', val: siksastakamTenOffenses, set: setSiksastakamTenOffenses }
                  ].map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => item.set(!item.val)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer hover:scale-102 ${
                        item.val
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 shadow-xs'
                          : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                      }`}
                    >
                      <CheckCircle2 size={16} className={item.val ? 'text-emerald-600' : 'text-slate-300'} />
                      <span className="text-center text-[11px] leading-tight">{item.label}: {item.val ? 'yes' : 'no'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 4: MATERIAL STUDY & CAREER */}
              <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <GraduationCap size={16} className="text-blue-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    *Material Study &amp; Career* (শিক্ষা ও ক্যারিয়ার)
                  </h3>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    *Material study and career* (Study Hours / Status):
                  </label>
                  <input 
                    type="text"
                    value={academicStudyHours}
                    onChange={(e) => setAcademicStudyHours(e.target.value)}
                    placeholder="e.g. 4 h or nil"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>

              {/* Section 5: PREACHING & DEVOTEE CARE */}
              <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Users size={16} className="text-purple-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    *Preaching* (গ্রন্থ প্রচার ও ভক্ত সেবা)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      ✓ Book Distribution-
                    </label>
                    <input 
                      type="text"
                      value={bookDistCount}
                      onChange={(e) => setBookDistCount(e.target.value)}
                      placeholder="e.g. 4  BG cs small books or none"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      ✓ taking care of devotees:
                    </label>
                    <input 
                      type="text"
                      value={devoteeCareCount}
                      onChange={(e) => setDevoteeCareCount(e.target.value)}
                      placeholder="e.g. 4 or 02+"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      ✓ talking about Krishna:
                    </label>
                    <input 
                      type="text"
                      value={krishnaKathaMin}
                      onChange={(e) => setKrishnaKathaMin(e.target.value)}
                      placeholder="e.g. 60+ mins -"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Harinam kirtan:
                    </label>
                    <input 
                      type="text"
                      value={harinamKirtanMin}
                      onChange={(e) => setHarinamKirtanMin(e.target.value)}
                      placeholder="e.g. 0 min"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: ADDITIONAL ACTIVITIES */}
              <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Activity size={16} className="text-yellow-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    *Additional* (অন্যান্য কার্যকলাপ)
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      (1) Sloka Memorising:
                    </label>
                    <input 
                      type="text"
                      value={slokaMemorising}
                      onChange={(e) => setSlokaMemorising(e.target.value)}
                      placeholder="e.g. yes or no"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      (2) offering obeisance:
                    </label>
                    <input 
                      type="text"
                      value={obeisancesCount}
                      onChange={(e) => setObeisancesCount(e.target.value)}
                      placeholder="e.g. 10± times"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      (3) Journal writing:
                    </label>
                    <input 
                      type="text"
                      value={journalWriting}
                      onChange={(e) => setJournalWriting(e.target.value)}
                      placeholder="e.g. yes or no"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Yoga Exercise:
                    </label>
                    <input 
                      type="text"
                      value={yogaExerciseMin}
                      onChange={(e) => setYogaExerciseMin(e.target.value)}
                      placeholder="e.g. 0 min"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Walking:
                    </label>
                    <input 
                      type="text"
                      value={walkingMin}
                      onChange={(e) => setWalkingMin(e.target.value)}
                      placeholder="e.g. 0+ minutes"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Bhajan:
                    </label>
                    <input 
                      type="text"
                      value={bhajanDone}
                      onChange={(e) => setBhajanDone(e.target.value)}
                      placeholder="e.g. yes or no"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-3">
                    <label className="text-[11px] font-semibold text-rose-500 block mb-1">
                      Social Media browsing:
                    </label>
                    <input 
                      type="text"
                      value={socialMediaMin}
                      onChange={(e) => setSocialMediaMin(e.target.value)}
                      placeholder="e.g. 10+ min"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-rose-200 dark:border-rose-900/50 text-xs font-bold text-rose-600"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Live WhatsApp Report Preview Card (5 Cols Sticky) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="sticky top-20 rounded-3xl p-5 bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-900/50 shadow-xl space-y-4">
                
                {/* Header Row with Quick Switcher */}
                <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        Live WhatsApp Preview
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold">
                      {effectiveCounselorName}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setReportType('DAILY')}
                      className={`py-1 rounded-lg transition-all cursor-pointer ${reportType === 'DAILY' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Daily
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportType('WEEKLY')}
                      className={`py-1 rounded-lg transition-all cursor-pointer ${reportType === 'WEEKLY' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Weekly
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportType('MONTHLY')}
                      className={`py-1 rounded-lg transition-all cursor-pointer ${reportType === 'MONTHLY' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Live Message Box (Dark high-contrast styling) */}
                <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all border border-slate-800 max-h-[500px] overflow-y-auto shadow-inner">
                  {reportType === 'DAILY' && generateDailyReportText()}
                  {reportType === 'WEEKLY' && generateWeeklyReportText()}
                  {reportType === 'MONTHLY' && generateMonthlyReportText()}
                </div>

                {/* 1-Tap Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => copyReport(reportType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-102"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>

                  <button
                    onClick={() => shareViaWhatsApp(reportType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-102"
                  >
                    <Send size={14} />
                    <span>WhatsApp Send</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: 3 COUNSELOR REPORTS ================= */}
        {activeTab === 'REPORTS' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Sub-Switch: Daily vs Weekly vs Monthly */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <button
                onClick={() => setReportType('DAILY')}
                className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  reportType === 'DAILY'
                    ? 'bg-indigo-600 text-white shadow-md scale-102'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Calendar size={14} />
                <span>1. Daily Report</span>
              </button>

              <button
                onClick={() => setReportType('WEEKLY')}
                className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  reportType === 'WEEKLY'
                    ? 'bg-indigo-600 text-white shadow-md scale-102'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <BarChart3 size={14} />
                <span>2. Weekly Body &amp; Soul</span>
              </button>

              <button
                onClick={() => setReportType('MONTHLY')}
                className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  reportType === 'MONTHLY'
                    ? 'bg-indigo-600 text-white shadow-md scale-102'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <TrendingUp size={14} />
                <span>3. Monthly Average</span>
              </button>
            </div>

            {/* Report Preview Card */}
            <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                    WhatsApp Messenger Format
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {reportType === 'DAILY' && '📝 1. Counselor Daily Sadhana Report'}
                    {reportType === 'WEEKLY' && '📊 2. Counselor Weekly Body & Soul Summary'}
                    {reportType === 'MONTHLY' && '📈 3. Counselor Monthly Overall Average Report'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyReport(reportType)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-all"
                  >
                    {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>

                  <button
                    onClick={() => shareViaWhatsApp(reportType)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer hover:scale-102 transition-all"
                  >
                    <Send size={13} />
                    <span>WhatsApp Send</span>
                  </button>
                </div>
              </div>

              {/* Formatted Text Box */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap select-all border border-slate-800 max-h-96 overflow-y-auto shadow-inner">
                {reportType === 'DAILY' && generateDailyReportText()}
                {reportType === 'WEEKLY' && generateWeeklyReportText()}
                {reportType === 'MONTHLY' && generateMonthlyReportText()}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: COUNSELOR MANAGEMENT PORTAL ================= */}
        {activeTab === 'COUNSELOR_PORTAL' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Counselor Switcher & Stats Header */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-amber-500/10 via-slate-900 to-indigo-950 border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                    <ShieldCheck size={14} />
                    <span>Active Counselor Review Session</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {effectiveCounselorName}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Advaita VOICE, University of Chittagong — Monitoring 12 Active Ashram Students
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      notificationsEnabled 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Bell size={14} className={notificationsEnabled ? 'animate-bounce' : ''} />
                    <span>{notificationsEnabled ? '🔔 Live Notifications: ON' : '🔕 Notifications: Muted'}</span>
                  </button>

                  <button
                    onClick={handleBroadcastReminder}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-102 transition-all"
                  >
                    <Send size={13} />
                    <span>Broadcast WA Reminder</span>
                  </button>
                </div>
              </div>

              {/* Realtime Submission Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xs font-semibold text-slate-400 block">Total Counsellees</span>
                  <span className="text-xl font-black text-white">12</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <span className="text-xs font-semibold text-emerald-400 block">Submitted Today</span>
                  <span className="text-xl font-black text-emerald-400">9 / 12</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
                  <span className="text-xs font-semibold text-rose-400 block">Pending Sadhana</span>
                  <span className="text-xl font-black text-rose-400">3 Students</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center">
                  <span className="text-xs font-semibold text-indigo-400 block">Avg Ashram Score</span>
                  <span className="text-xl font-black text-indigo-400">93.4%</span>
                </div>
              </div>
            </div>

            {/* Counselor Blessing & Remarks Direct Editor */}
            <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    👨‍🏫 Counselor’s Weekly/Monthly Blessing &amp; Remarks Editor
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  Appears in all student reports
                </span>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={counselorRemarkText}
                  onChange={(e) => setCounselorRemarkText(e.target.value)}
                  placeholder="Enter spiritual remark or blessing for your counsellees..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveCounselorRemark}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer hover:scale-102 transition-all"
                  >
                    <Check size={14} />
                    <span>Save Counselor Remarks</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 12 Students Live Status Matrix */}
            <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    12 Counsellees Live Sadhana Status ({reportDate})
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Real-time Synced
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="pb-2">Student Name</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Body Score</th>
                      <th className="pb-2">Soul Score</th>
                      <th className="pb-2">Mangalarati</th>
                      <th className="pb-2">Japa</th>
                      <th className="pb-2">Seva</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {studentStatuses.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-bold text-slate-900 dark:text-white">
                          {s.name}
                        </td>
                        <td className="py-3">
                          {s.submitted ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                              <CheckCircle size={12} /> {s.time}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                              <Clock size={12} /> Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {s.submitted ? `${s.bodyScore}%` : '-'}
                        </td>
                        <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {s.submitted ? `${s.soulScore}%` : '-'}
                        </td>
                        <td className="py-3">
                          {s.submitted ? (s.mangalarati ? '✅ 100%' : '❌ Missed') : '-'}
                        </td>
                        <td className="py-3 font-mono">
                          {s.submitted ? `${s.japaRounds} Rds` : '-'}
                        </td>
                        <td className="py-3 text-[11px] text-slate-500 max-w-[150px] truncate">
                          {s.seva}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedDevotee(s.name);
                              setActiveTab('FORM');
                              toast.success(`Loaded ${s.name}'s Sadhana Card for review.`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Review Log
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default SadhanaTracker;
