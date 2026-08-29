import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FeatureCard } from '../components/hub/FeatureCard';
import { Footer } from '../components/layout/Footer';
import { 
  BookOpen, HeartHandshake, RefreshCw, ShieldCheck, Users, Headphones, 
  Sparkles, Calendar, HelpCircle, Search, 
  GraduationCap, Tent, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HubHome: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SEVA' | 'STUDY' | 'PREACHING' | 'ORG'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const isLoggedIn = !!user;

  const CARDS_DATA = [
    {
      id: 'counselor_desk',
      titleEn: "Counselor's Desk & Sadhana Audit",
      titleBn: 'কাউন্সেলর সাধনা অডিট ও কেয়ার',
      descEn: "Inspect 12 counsellees' daily sadhana, write comments & send WhatsApp blessings.",
      descBn: '১২ জন শিক্ষার্থীর সাধনা যাচাই, মন্তব্য প্রদান ও হোয়াটসঅ্যাপ আশীর্বাদ।',
      categoryEn: 'Mentorship & Audit',
      categoryBn: 'কাউন্সেলিং ও অডিট',
      categoryType: 'SEVA',
      icon: ShieldCheck,
      link: '/counselor',
      colorScheme: {
        bgLight: 'bg-amber-50',
        bgDark: 'bg-amber-950/20',
        borderLight: 'border-amber-200',
        borderDark: 'border-amber-900/40',
        iconBg: 'bg-amber-600',
        iconText: 'text-white',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
        badgeText: 'text-amber-700 dark:text-amber-300',
        glow: 'rgba(245, 158, 11, 0.2)'
      },
      badgeEn: 'Counselor Portal',
      badgeBn: 'কাউন্সেলর ডেস্ক',
      isMemberOnly: false
    },
    {
      id: 'service_cycle_member',
      titleEn: 'My Daily Seva Dashboard',
      titleBn: 'আমার দৈনিক সেবা',
      descEn: 'Today\'s seva duty, timing & upcoming 7-day schedule.',
      descBn: 'আজকের সেবা দায়িত্ব, সময়সূচি ও আগামী ৭ দিনের শিডিউল।',
      categoryEn: 'Ashram Seva',
      categoryBn: 'আশ্রম সেবা',
      categoryType: 'SEVA',
      icon: RefreshCw,
      link: isLoggedIn ? '/member' : '/login',
      colorScheme: {
        bgLight: 'bg-emerald-50',
        bgDark: 'bg-emerald-950/20',
        borderLight: 'border-emerald-200',
        borderDark: 'border-emerald-900/40',
        iconBg: 'bg-emerald-600',
        iconText: 'text-white',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
        badgeText: 'text-emerald-700 dark:text-emerald-300',
        glow: 'rgba(16, 185, 129, 0.2)'
      },
      badgeEn: 'Daily Duty',
      badgeBn: 'দৈনিক সেবা',
      isMemberOnly: true
    },
    {
      id: 'sadhana',
      titleEn: 'Digital Sadhana Sheet',
      titleBn: 'ডিজিটাল সাধনাপত্র',
      descEn: 'Body, Soul & Seva scoring (Scales 1–4) + 1-tap WhatsApp report.',
      descBn: 'দেহ, আত্মা ও সেবার অটো মার্কস ও হোয়াটসঅ্যাপ রিপোর্ট।',
      categoryEn: 'Sadhana & Care',
      categoryBn: 'সাধনা ও কেয়ার',
      categoryType: 'SEVA',
      icon: HeartHandshake,
      link: '/sadhana',
      colorScheme: {
        bgLight: 'bg-indigo-50',
        bgDark: 'bg-indigo-950/20',
        borderLight: 'border-indigo-200',
        borderDark: 'border-indigo-900/40',
        iconBg: 'bg-indigo-600',
        iconText: 'text-white',
        badgeBg: 'bg-indigo-50 dark:bg-indigo-950/50',
        badgeText: 'text-indigo-700 dark:text-indigo-300',
        glow: 'rgba(99, 102, 241, 0.2)'
      },
      badgeEn: 'Scales 1–4',
      badgeBn: 'স্কেল ১–৪',
      isMemberOnly: true
    },
    {
      id: 'syllabus',
      titleEn: 'Full VOICE Syllabus',
      titleBn: 'সম্পূর্ণ ভয়েস সিলেবাস',
      descEn: '854 topics from DYS to SP Books with personal study notes.',
      descBn: 'ডিওয়াইএস থেকে শুরু করে গ্রন্থ অধ্যয়নের ৮৫৪ বিষয় ও নোট।',
      categoryEn: 'Study & Wisdom',
      categoryBn: 'শিক্ষা ও প্রজ্ঞা',
      categoryType: 'STUDY',
      icon: BookOpen,
      link: '/syllabus',
      colorScheme: {
        bgLight: 'bg-amber-50',
        bgDark: 'bg-amber-950/20',
        borderLight: 'border-amber-200',
        borderDark: 'border-amber-900/40',
        iconBg: 'bg-amber-600',
        iconText: 'text-white',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
        badgeText: 'text-amber-700 dark:text-amber-300',
        glow: 'rgba(245, 158, 11, 0.2)'
      },
      badgeEn: '854 Topics',
      badgeBn: '৮৫৪ বিষয়',
      isMemberOnly: false
    },
        {
      id: 'all_courses',
      titleEn: 'All Courses & Diplomas',
      titleBn: 'সকল কোর্স ও ডিপ্লোমা',
      descEn: 'DYS, EBG, VVS, Bhakti Shastri & Preacher Training curriculum with session breakdowns.',
      descBn: 'ডিওয়াইএস, ইবিজি, ভিভিএস, ভক্তি শাস্ত্রী ও প্রচারক প্রশিক্ষণ সেশন ও সনদপত্র।',
      categoryEn: 'Vedic Courses',
      categoryBn: 'বৈদিক কোর্স',
      categoryType: 'STUDY',
      icon: GraduationCap,
      link: '/courses',
      colorScheme: {
        bgLight: 'bg-indigo-50',
        bgDark: 'bg-indigo-950/20',
        borderLight: 'border-indigo-200',
        borderDark: 'border-indigo-900/40',
        iconBg: 'bg-indigo-600',
        iconText: 'text-white',
        badgeBg: 'bg-indigo-50 dark:bg-indigo-950/50',
        badgeText: 'text-indigo-700 dark:text-indigo-300',
        glow: 'rgba(99, 102, 241, 0.2)'
      },
      badgeEn: '6 Courses',
      badgeBn: '৬টি কোর্স',
      isMemberOnly: false
    },
    {
      id: 'all_camps',
      titleEn: 'Youth Retreats & Camps',
      titleBn: 'যুব রিট্রিট ও মহা শিবির',
      descEn: 'Annual Residential Retreat, Mega Fest UDGOSH, Holy Dham Pilgrimage & Weekend Immersion.',
      descBn: 'বার্ষিক আবাসিক রিট্রিট, উদ্ঘোষ ফেস্ট, মায়াপুর-বৃন্দাবন পরিক্রমা ও সাপ্তাহিক সাধনা ক্যাম্প।',
      categoryEn: 'Camps & Yatras',
      categoryBn: 'ক্যাম্প ও যাত্রা',
      categoryType: 'STUDY',
      icon: Tent,
      link: '/camps',
      colorScheme: {
        bgLight: 'bg-amber-50',
        bgDark: 'bg-amber-950/20',
        borderLight: 'border-amber-200',
        borderDark: 'border-amber-900/40',
        iconBg: 'bg-amber-600',
        iconText: 'text-white',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
        badgeText: 'text-amber-700 dark:text-amber-300',
        glow: 'rgba(245, 158, 11, 0.2)'
      },
      badgeEn: '5 Retreats',
      badgeBn: '৫টি ক্যাম্প',
      isMemberOnly: false
    },
    {
      id: 'study_care_board',
      titleEn: 'Study Care & Academic Board',
      titleBn: 'স্টাডি কেয়ার ও বিসিএস বোর্ড',
      descEn: 'Gian Juti & Pranto: Exam revision circles, BCS quizzes & study routine.',
      descBn: 'জ্ঞান জ্যোতি ও প্রান্ত: চবি পরীক্ষা রিভিশন, বিসিএস কুইজ ও পড়ার ট্র্যাকার।',
      categoryEn: 'Academic Care',
      categoryBn: 'স্টাডি ও ক্যারিয়ার',
      categoryType: 'STUDY',
      icon: GraduationCap,
      link: '/management?tab=STUDY_CARE',
      colorScheme: {
        bgLight: 'bg-blue-50',
        bgDark: 'bg-blue-950/20',
        borderLight: 'border-blue-200',
        borderDark: 'border-blue-900/40',
        iconBg: 'bg-blue-600',
        iconText: 'text-white',
        badgeBg: 'bg-blue-50 dark:bg-blue-950/50',
        badgeText: 'text-blue-700 dark:text-blue-300',
        glow: 'rgba(37, 99, 235, 0.2)'
      },
      badgeEn: 'Gian + Pranto',
      badgeBn: 'জ্ঞান + প্রান্ত',
      isMemberOnly: false
    },
    {
      id: 'vani_lectures',
      titleEn: 'Prabhupada Vani Series (Audio & Video)',
      titleBn: 'প্রভুপাদ বাণী সিরিজ (অডিও ও ভিডিও)',
      descEn: '240+ Srimad Bhagavatam lectures, Hare Krsna TV & IDT.',
      descBn: '২৪০+ ভাগবতম লেকচার, হরেকৃষ্ণ টিভি ও ডিজায়ার ট্রি।',
      categoryEn: 'Study & Wisdom',
      categoryBn: 'শিক্ষা ও প্রজ্ঞা',
      categoryType: 'STUDY',
      icon: Headphones,
      link: '/syllabus?tab=vani',
      colorScheme: {
        bgLight: 'bg-cyan-50',
        bgDark: 'bg-cyan-950/20',
        borderLight: 'border-cyan-200',
        borderDark: 'border-cyan-900/40',
        iconBg: 'bg-cyan-600',
        iconText: 'text-white',
        badgeBg: 'bg-cyan-50 dark:bg-cyan-950/50',
        badgeText: 'text-cyan-700 dark:text-cyan-300',
        glow: 'rgba(6, 182, 212, 0.2)'
      },
      badgeEn: '240+ Audio/Video',
      badgeBn: '২৪০+ অডিও/ভিডিও',
      isMemberOnly: false
    },
    {
      id: 'preachers_toolkit',
      titleEn: 'Preacher’s Pocket Toolkit & Shlokas',
      titleBn: 'প্রচারক টুলকিট ও শ্লোক ভান্ডার',
      descEn: '150+ answers + authentic Sanskrit shlokas with word-for-word & Bengali translations.',
      descBn: '১৫০+ প্রশ্নোত্তর এবং পদান্বয় ও বঙ্গানুবাদসহ আসল সংস্কৃত শ্লোক।',
      categoryEn: 'Preaching',
      categoryBn: 'প্রচার ও প্রশিক্ষণ',
      categoryType: 'PREACHING',
      icon: HelpCircle,
      link: '/preaching',
      colorScheme: {
        bgLight: 'bg-violet-50',
        bgDark: 'bg-violet-950/20',
        borderLight: 'border-violet-200',
        borderDark: 'border-violet-900/40',
        iconBg: 'bg-violet-600',
        iconText: 'text-white',
        badgeBg: 'bg-violet-50 dark:bg-violet-950/50',
        badgeText: 'text-violet-700 dark:text-violet-300',
        glow: 'rgba(168, 85, 247, 0.2)'
      },
      badgeEn: 'Real Shlokas',
      badgeBn: 'আসল শ্লোক',
      isMemberOnly: false
    },
        {
      id: 'advaita_org',
      titleEn: 'Advaita VOICE Org (All Depts)',
      titleBn: 'অদ্বৈত পরিচালনা ও সকল বিভাগ',
      descEn: 'Leadership tree & all department action boards (Kitchen, Festivals, Study Care, Outreach).',
      descBn: 'পরিচালনা পরিষদ ও সকল বিভাগীয় বোর্ড (রান্নাঘর, উৎসব, প্রচার ও স্টাডি)।',
      categoryEn: 'Governance',
      categoryBn: 'পরিচালনা পরিষদ',
      categoryType: 'ORG',
      icon: Users,
      link: '/management',
      colorScheme: {
        bgLight: 'bg-rose-50',
        bgDark: 'bg-rose-950/20',
        borderLight: 'border-rose-200',
        borderDark: 'border-rose-900/40',
        iconBg: 'bg-rose-600',
        iconText: 'text-white',
        badgeBg: 'bg-rose-50 dark:bg-rose-950/50',
        badgeText: 'text-rose-700 dark:text-rose-300',
        glow: 'rgba(244, 63, 94, 0.2)'
      },
      badgeEn: 'All Depts',
      badgeBn: 'সকল বিভাগ',
      isMemberOnly: false
    },
    {
      id: 'calendar',
      titleEn: '2026 Vaishnava Calendar & Festivals',
      titleBn: '২০২৬ বৈষ্ণব ক্যালেন্ডার ও উৎসব',
      descEn: 'Official 2026 Ekadashis, Parana breaking schedule & major ISKCON festivals with seva duties.',
      descBn: '২০২৬ সালের সকল একাদশী, পারণ সময় ও মহোৎসবের তালিকা ও সেবা দায়িত্ব।',
      categoryEn: 'Festivals',
      categoryBn: 'ব্রত ও উৎসব',
      categoryType: 'PREACHING',
      icon: Calendar,
      link: '/calendar',
      colorScheme: {
        bgLight: 'bg-yellow-50',
        bgDark: 'bg-yellow-950/20',
        borderLight: 'border-yellow-200',
        borderDark: 'border-yellow-900/40',
        iconBg: 'bg-yellow-600',
        iconText: 'text-white',
        badgeBg: 'bg-yellow-50 dark:bg-yellow-950/50',
        badgeText: 'text-yellow-700 dark:text-yellow-300',
        glow: 'rgba(234, 179, 8, 0.2)'
      },
      badgeEn: '2026 ISKCON',
      badgeBn: '২০২৬ ক্যালেন্ডার',
      isMemberOnly: false
    }
  ];

  const filteredCards = CARDS_DATA.filter(card => {
    const matchesFilter = activeFilter === 'ALL' || card.categoryType === activeFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      card.titleEn.toLowerCase().includes(query) ||
      card.titleBn.toLowerCase().includes(query) ||
      card.descEn.toLowerCase().includes(query) ||
      card.descBn.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans pb-8">
      
      {/* Compact Hero Banner */}
      <section className="relative overflow-hidden pt-4 pb-3 sm:pt-6 sm:pb-5 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-500/[0.08] via-primary-500/[0.04] to-transparent dark:from-amber-500/[0.05] dark:via-primary-500/[0.05] dark:to-transparent border-b border-slate-200/70 dark:border-slate-800/80">
        
        {/* Soft Ambient Light Glow */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-full max-w-xl h-36 bg-gradient-to-r from-amber-500/20 via-primary-500/15 to-rose-500/15 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-3xl mx-auto text-center space-y-2.5 z-10">
          
          {/* Top Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-amber-500/30 text-[10px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-400">
            <Sparkles size={11} className="text-amber-500" />
            <span>Advaita VOICE • University of Chittagong</span>
          </div>

          {/* Main Title */}
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-primary-800 to-amber-600 dark:from-white dark:via-primary-200 dark:to-amber-300 bg-clip-text text-transparent">
              {language === 'bn' ? 'অদ্বৈত ভয়েস ডিজিটাল হাব' : 'Advaita VOICE Digital Hub'}
            </span>
          </h1>

          {/* Sacred Devotional Motto & Key Feature Box */}
          <div className="max-w-xl mx-auto px-3 py-1.5 rounded-xl bg-amber-500/[0.05] dark:bg-amber-500/[0.07] border border-amber-500/25 backdrop-blur-xs">
            <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-serif italic text-xs sm:text-sm font-bold tracking-wide">
              <span>✦</span>
              <span>
                {language === 'bn' 
                  ? '“জ্ঞানের পুনরুদ্দীপন, ভালবাসার উৎসরণ”' 
                  : '“Rekindling Wisdom, Reviving Love”'}
              </span>
              <span>✦</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              {language === 'bn' 
                ? 'সম্পূর্ণ ভয়েস সিলেবাস • ডিজিটাল সাধনা কার্ড ও রিপোর্ট • ২০২৬ বৈষ্ণব ক্যালেন্ডার' 
                : 'Full VOICE Syllabus (854) • Digital Sadhana Card & Reports • 2026 Calendar'}
            </p>
          </div>

          {/* Search Input */}
          <div className="pt-1 max-w-md mx-auto">
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'মডিউল, স্টাডি কেয়ার বা ২০২৬ ক্যালেন্ডার খুঁজুন...' : 'Search modules, camps, calendar...'}
                className="w-full pl-8 pr-8 py-1.5 sm:py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xs text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Filter Tabs & Compact Grid */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1.5 scrollbar-none justify-start sm:justify-center">
          {[
            { id: 'ALL', labelEn: 'All Modules', labelBn: 'সকল' },
            { id: 'SEVA', labelEn: '🔄 Seva & Sadhana', labelBn: '🔄 সেবা ও সাধনা' },
            { id: 'STUDY', labelEn: '📖 Study & Camps', labelBn: '📖 স্টাডি ও ক্যাম্প' },
            { id: 'PREACHING', labelEn: '❓ Preaching & Shlokas', labelBn: '❓ প্রচার ও শ্লোক' },
            { id: 'ORG', labelEn: '🏛️ Org & All Depts', labelBn: '🏛️ পরিচালনা পরিষদ' }
          ].map(tab => {
            const count = tab.id === 'ALL' 
              ? CARDS_DATA.length 
              : CARDS_DATA.filter(c => c.categoryType === tab.id).length;

            const isActive = activeFilter === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{language === 'bn' ? tab.labelBn : tab.labelEn}</span>
                <span className={`text-[9px] font-extrabold px-1 py-0.1 rounded ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact 2-Column Mobile / 3-Col Tablet / 4-Col Desktop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3.5 pt-2.5">
          {filteredCards.map(card => (
            <FeatureCard 
              key={card.id}
              {...card}
              isLoggedIn={isLoggedIn}
              lang={language}
              onLockedClick={() => navigate('/login')}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HubHome;
