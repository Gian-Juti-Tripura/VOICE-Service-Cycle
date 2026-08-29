import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FeatureCard } from '../components/hub/FeatureCard';
import { Footer } from '../components/layout/Footer';
import { VOICE_HANDBOOK_DATA } from '../data/voiceHandbookData';
import { 
  BookOpen, HeartHandshake, RefreshCw, ShieldCheck,
  GraduationCap, Tent, Calendar, Compass, Phone,
  Sparkles, CheckCircle2,
  Flame, Landmark, MapPin, ChevronDown, ChevronUp,
  Bell, ArrowRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const HubHome: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SEVA' | 'STUDY' | 'PREACHING' | 'ORG'>('ALL');
  const [showIskconCenters, setShowIskconCenters] = useState(false);
  const [selectedYearTab, setSelectedYearTab] = useState<number>(0);

  const isLoggedIn = !!user;

  // Closest 3 Upcoming Festivals from August 2026 onwards in compact format
  const CLOSEST_UPCOMING_FESTIVALS = [
    {
      id: 'f_janmastami',
      nameEn: 'Sri Krishna Janmastami (Appearance Day of Supreme Lord)',
      nameBn: 'শ্রীকৃষ্ণ জন্মাষ্টমী (ভগবান শ্রীকৃষ্ণের আবির্ভাব মহোৎসব)',
      dateEn: '04 Sep 2026',
      dateBn: '৪ সেপ্টেম্বর ২০২৬',
      fastingEn: 'Fasting till Midnight 12:00 AM • Mahabhisheka',
      fastingBn: 'মধ্যরাত পর্যন্ত নির্জলা/সজল উপবাস • রাত ১২টায় অভিষেক',
      badgeColor: 'bg-amber-500 text-slate-950 font-black'
    },
    {
      id: 'f_radhastami',
      nameEn: 'Srimati Radhastami (Appearance of Srimati Radharani)',
      nameBn: 'শ্রীমতী রাধাষ্টমী (শ্রীমতী রাধারাণীর শুভ আবির্ভাব তিথি)',
      dateEn: '19 Sep 2026',
      dateBn: '১৯ সেপ্টেম্বর ২০২৬',
      fastingEn: 'Fasting till Noon 12:00 PM • Radha Kripa Kataksha',
      fastingBn: 'দুপুর ১২:০০ পর্যন্ত উপবাস ও শ্রীরাধা কৃপাকটাক্ষ স্তোত্র পাঠ',
      badgeColor: 'bg-rose-500 text-white font-bold'
    },
    {
      id: 'f_govardhana',
      nameEn: 'Sri Govardhana Puja & Annakut Mahotsav',
      nameBn: 'শ্রী গোবর্ধন পূজা ও অন্নকূট মহোৎসব (দীপাবলির পরদিন)',
      dateEn: '10 Nov 2026',
      dateBn: '১০ নভেম্বর ২০২৬',
      fastingEn: 'Grand Feast & 108 Offering Darshan',
      fastingBn: 'গিরিরাজ পূজা, গো-সেবা ও শত ব্যঞ্জনের মহাপ্রসাদ বিতরণ',
      badgeColor: 'bg-indigo-600 text-white font-bold'
    }
  ];

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
      isMemberOnly: false
    },
    {
      id: 'announcements_board',
      titleEn: 'Announcements & Incharge Notices',
      titleBn: 'বিজ্ঞপ্তি ও ইনচার্জ নির্দেশিকা',
      descEn: 'Internal Manager, Security, Morning Program & Coordinator directives.',
      descBn: 'অভ্যন্তরীণ ব্যবস্থাপক, নিরাপত্তা ও সমন্বয়কদের জরুরি নোটিশ বোর্ড।',
      categoryEn: 'Notices & Admin',
      categoryBn: 'বিজ্ঞপ্তি ও প্রশাসন',
      categoryType: 'ORG',
      icon: Bell,
      link: '/announcements',
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
      badgeEn: 'Role Notices',
      badgeBn: 'ইনচার্জ নোটিশ',
      isMemberOnly: false
    },
    {
      id: 'sebananda_library',
      titleEn: 'Sebananda Library (সেবানন্দ গ্রন্থাগার)',
      titleBn: 'সেবানন্দ গ্রন্থাগার ও ই-রিসোর্স',
      descEn: 'Srila Prabhupada E-books, DYS slides, camp guides, BCS notes & songbooks.',
      descBn: 'শ্রীল প্রভুপাদের মূল গ্রন্থ, ডিওয়াইএস স্লাইড, ক্যাম্প বুকলেট ও বিসিএস নোটস।',
      categoryEn: 'Digital Library',
      categoryBn: 'ডিজিটাল গ্রন্থাগার',
      categoryType: 'STUDY',
      icon: BookOpen,
      link: '/library',
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
      badgeEn: 'E-Books & PDFs',
      badgeBn: 'ই-বুক ও পিডিএফ',
      isMemberOnly: false
    },
    {
      id: 'all_courses',
      titleEn: 'All Courses & Diplomas',
      titleBn: 'সকল কোর্স ও ডিপ্লোমা',
      descEn: 'DYS (6 Sessions), SS, PT, SM, PL & Bhakti Shastri with session breakdowns.',
      descBn: 'ডিওয়াইএস (৬ সেশন), এসএস, পিটি, এসএম, পিএল ও ভক্তি শাস্ত্রী পাঠ্যক্রম।',
      categoryEn: 'Vedic Courses',
      categoryBn: 'বৈদিক কোর্স',
      categoryType: 'STUDY',
      icon: GraduationCap,
      link: '/courses',
      colorScheme: {
        bgLight: 'bg-purple-50',
        bgDark: 'bg-purple-950/20',
        borderLight: 'border-purple-200',
        borderDark: 'border-purple-900/40',
        iconBg: 'bg-purple-600',
        iconText: 'text-white',
        badgeBg: 'bg-purple-50 dark:bg-purple-950/50',
        badgeText: 'text-purple-700 dark:text-purple-300',
        glow: 'rgba(168, 85, 247, 0.2)'
      },
      badgeEn: '6 Courses',
      badgeBn: '৬টি কোর্স',
      isMemberOnly: false
    },
    {
      id: 'all_camps',
      titleEn: 'Sacred 6-Step Camps & Yatras',
      titleBn: 'পবিত্র ৬-ধাপের ক্যাম্প ও পরিক্রমা',
      descEn: 'Sankalpa, Sphurti, Utkarsh, Nishtha, Ashroy, Saranagati & Prerana Festival.',
      descBn: 'সঙ্কল্প, স্ফূর্তি, উৎকর্ষ, নিষ্ঠা, আশ্রয়, শরণাগতি ও প্রেরণা যুব উৎসব।',
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
      badgeEn: '6 Step Camps',
      badgeBn: '৬টি ক্যাম্প',
      isMemberOnly: false
    },
    {
      id: 'syllabus',
      titleEn: 'Full VOICE Syllabus & Lectures',
      titleBn: 'সম্পূর্ণ ভয়েস সিলেবাস ও লেকচার',
      descEn: '854 topics from DYS to SP Books with personal study notes & lectures.',
      descBn: 'ডিওয়াইএস থেকে শুরু করে গ্রন্থ অধ্যয়নের ৮৫৪ বিষয় ও অডিও নোট।',
      categoryEn: 'Study & Wisdom',
      categoryBn: 'শিক্ষা ও প্রজ্ঞা',
      categoryType: 'STUDY',
      icon: Compass,
      link: '/syllabus',
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
      badgeEn: '854 Topics',
      badgeBn: '৮৫৪ বিষয়',
      isMemberOnly: false
    },
    {
      id: 'service_cycle_member',
      titleEn: 'My Daily Seva Dashboard',
      titleBn: 'আমার দৈনিক সেবা',
      descEn: "Today's seva duty, timing & upcoming 7-day schedule.",
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
      id: 'preaching_toolkit',
      titleEn: "Preacher's Pocket Toolkit & Shlokas",
      titleBn: 'প্রচারক পকেট টুলকিট ও শ্লোক',
      descEn: '108 core Sanskrit verses, debate refutations & outreach strategies.',
      descBn: '১০৮টি মৌলিক সংস্কৃত শ্লোক, বিজ্ঞানভিত্তিক যুক্তি ও প্রচার কলা।',
      categoryEn: 'Preaching & Youth',
      categoryBn: 'প্রচার ও যুবসেবা',
      categoryType: 'PREACHING',
      icon: Flame,
      link: '/preaching',
      colorScheme: {
        bgLight: 'bg-orange-50',
        bgDark: 'bg-orange-950/20',
        borderLight: 'border-orange-200',
        borderDark: 'border-orange-900/40',
        iconBg: 'bg-orange-600',
        iconText: 'text-white',
        badgeBg: 'bg-orange-50 dark:bg-orange-950/50',
        badgeText: 'text-orange-700 dark:text-orange-300',
        glow: 'rgba(234, 88, 12, 0.2)'
      },
      badgeEn: '108 Shlokas',
      badgeBn: '১০৮ শ্লোক',
      isMemberOnly: false
    },
    {
      id: 'advaita_org',
      titleEn: 'Advaita VOICE Org (All Depts)',
      titleBn: 'অদ্বৈত ভয়েস সাংগঠনিক কাঠামো',
      descEn: 'Central leadership, 9 departments, 12 members matrix & Study Care.',
      descBn: 'কেন্দ্রীয় পরিচালনা পর্ষদ, ৯টি বিভাগ ও স্টাডি কেয়ার টিম।',
      categoryEn: 'Ashram Management',
      categoryBn: 'আশ্রম ব্যবস্থাপনা',
      categoryType: 'ORG',
      icon: Landmark,
      link: '/management',
      colorScheme: {
        bgLight: 'bg-slate-50',
        bgDark: 'bg-slate-900/40',
        borderLight: 'border-slate-200',
        borderDark: 'border-slate-800',
        iconBg: 'bg-slate-700',
        iconText: 'text-white',
        badgeBg: 'bg-slate-100 dark:bg-slate-800',
        badgeText: 'text-slate-700 dark:text-slate-300',
        glow: 'rgba(71, 85, 105, 0.2)'
      },
      badgeEn: 'Central Org',
      badgeBn: 'কেন্দ্রীয় পর্ষদ',
      isMemberOnly: false
    },
    {
      id: 'vaishnava_calendar',
      titleEn: '2026 Vaishnava Calendar & Festivals',
      titleBn: '২০২৬ বৈষ্ণব ক্যালেন্ডার ও উৎসব',
      descEn: 'Official 2026 Ekadashi fasting, Parana time & Appearance days.',
      descBn: '২০২৬ সালের সকল একাদশী ব্রত, পারণ সময় ও বৈষ্ণবীয় আবির্ভাব তিথি।',
      categoryEn: 'Calendar & Feasts',
      categoryBn: 'পঞ্জিকা ও উৎসব',
      categoryType: 'ORG',
      icon: Calendar,
      link: '/calendar',
      colorScheme: {
        bgLight: 'bg-teal-50',
        bgDark: 'bg-teal-950/20',
        borderLight: 'border-teal-200',
        borderDark: 'border-teal-900/40',
        iconBg: 'bg-teal-600',
        iconText: 'text-white',
        badgeBg: 'bg-teal-50 dark:bg-teal-950/50',
        badgeText: 'text-teal-700 dark:text-teal-300',
        glow: 'rgba(13, 148, 136, 0.2)'
      },
      badgeEn: '2026 Dates',
      badgeBn: '২০২৬ পঞ্জিকা',
      isMemberOnly: false
    }
  ];

  const filteredCards = CARDS_DATA.filter(card => {
    return activeFilter === 'ALL' || card.categoryType === activeFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50/40 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* ================= TOP TWO-ROW MOVING NOTICES & UPCOMING FESTIVAL MARQUEE ================= */}
      <div className="w-full shadow-sm text-white text-xs font-bold divide-y divide-white/10 select-none">
        
        {/* Row 1: ONLY Most Recent Upcoming Festival Marquee */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 py-1.5 px-3 sm:px-4 flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center gap-1 shrink-0 z-10 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-400/30">
            <span className="text-[10px] uppercase tracking-wider font-mono font-black text-amber-200">
              {language === 'bn' ? '🌸 আসন্ন মহোৎসব' : '🌸 UPCOMING FEAST'}
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-[11px] sm:text-xs">
              <span>🌸 <strong>{language === 'bn' ? 'শ্রীকৃষ্ণ জন্মাষ্টমী (৪ সেপ্টেম্বর ২০২৬):' : 'Sri Krishna Janmastami (04 Sep 2026):'}</strong> {language === 'bn' ? 'মধ্যরাত ১২:০০ পর্যন্ত নির্জলা/সজল উপবাস ও রাত ১২টায় মহাভিষেক এবং আনন্দ উৎসব।' : 'Fasting till midnight 12:00 AM • Mahabhisheka & Feast!'}</span>
              <span>🌸 <strong>{language === 'bn' ? 'শ্রীকৃষ্ণ জন্মাষ্টমী (৪ সেপ্টেম্বর ২০২৬):' : 'Sri Krishna Janmastami (04 Sep 2026):'}</strong> {language === 'bn' ? 'মধ্যরাত ১২:০০ পর্যন্ত নির্জলা/সজল উপবাস ও রাত ১২টায় মহাভিষেক এবং আনন্দ উৎসব।' : 'Fasting till midnight 12:00 AM • Mahabhisheka & Feast!'}</span>
            </div>
          </div>
          <Link to="/calendar" className="shrink-0 text-[10px] sm:text-[11px] font-mono underline hover:text-amber-200 z-10 pl-1">
            {language === 'bn' ? 'পঞ্জিকা →' : 'Calendar →'}
          </Link>
        </div>

        {/* Row 2: ONLY Most Recent Active Incharge & Admin Announcement Marquee */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-1.5 px-3 sm:px-4 flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center gap-1 shrink-0 z-10 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-400/30">
            <span className="text-[10px] uppercase tracking-wider font-mono font-black text-rose-300">
              {language === 'bn' ? '📢 জরুরি নোটিশ' : '📢 LATEST NOTICE'}
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-[11px] sm:text-xs text-slate-200">
              <span>📢 <strong>{language === 'bn' ? 'সাপ্তাহিক সাধনা অডিট ও কাউন্সেলিং:' : 'Weekly Sadhana Audit & Counseling:'}</strong> {language === 'bn' ? 'শুক্রবার রাত ৮:০০ টার মধ্যে সকল শিক্ষার্থীকে সাধনাপত্র জমা দিতে হবে (কাউন্সেলর ডেস্ক সক্রিয়)।' : 'All counsellees must submit their weekly sadhana log by Friday 8:00 PM.'}</span>
              <span>📢 <strong>{language === 'bn' ? 'সাপ্তাহিক সাধনা অডিট ও কাউন্সেলিং:' : 'Weekly Sadhana Audit & Counseling:'}</strong> {language === 'bn' ? 'শুক্রবার রাত ৮:০০ টার মধ্যে সকল শিক্ষার্থীকে সাধনাপত্র জমা দিতে হবে (কাউন্সেলর ডেস্ক সক্রিয়)।' : 'All counsellees must submit their weekly sadhana log by Friday 8:00 PM.'}</span>
            </div>
          </div>
          <Link to="/announcements" className="shrink-0 text-[10px] sm:text-[11px] font-mono underline hover:text-rose-300 z-10 pl-1">
            {language === 'bn' ? 'সকল নোটিশ →' : 'Notices →'}
          </Link>
        </div>

      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ================= 1. MAJESTIC HERO SECTION WITH 5 CORE BUTTONS ================= */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-indigo-900 via-slate-900 to-amber-950 text-white shadow-2xl border border-white/10">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 backdrop-blur-md">
                Advaita VOICE • University of Chittagong
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-mono font-bold backdrop-blur-md">
                Dare to be Rare
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {language === 'bn' ? 'অদ্বৈত ভয়েস যুব হাব' : 'Advaita VOICE Youth Hub'}
              </h1>
              <p className="text-sm sm:text-base text-amber-300 font-serif italic tracking-wide">
                "{language === 'bn' ? VOICE_HANDBOOK_DATA.mottoBn : VOICE_HANDBOOK_DATA.mottoEn}"
              </p>
            </div>

            {/* Srila Prabhupada Oasis Quote Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              <p className="italic">
                "{language === 'bn' ? VOICE_HANDBOOK_DATA.oasisQuoteBn : VOICE_HANDBOOK_DATA.oasisQuoteEn}"
              </p>
              <div className="text-right text-[11px] font-bold text-amber-400">
                — {language === 'bn' ? VOICE_HANDBOOK_DATA.oasisSourceBn : VOICE_HANDBOOK_DATA.oasisSourceEn}
              </div>
            </div>

            {/* Symmetrical 2-Column Action Grid (Equal Size & Length Boxes) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 pt-2">
              
              {/* 1. Counselor Desk */}
              <button
                onClick={() => navigate('/counselor')}
                className="h-11 sm:h-12 w-full px-2.5 sm:px-3 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <ShieldCheck size={16} className="shrink-0 text-slate-950" />
                <span className="text-[11px] sm:text-xs font-black truncate">{language === 'bn' ? 'কাউন্সেলর ডেস্ক' : 'Counselor Desk'}</span>
              </button>

              {/* 2. Digital Sadhana */}
              <button
                onClick={() => navigate('/sadhana')}
                className="h-11 sm:h-12 w-full px-2.5 sm:px-3 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <HeartHandshake size={16} className="shrink-0 text-indigo-200" />
                <span className="text-[11px] sm:text-xs font-bold truncate">{language === 'bn' ? 'ডিজিটাল সাধনাপত্র' : 'Digital Sadhana'}</span>
              </button>

              {/* 3. Sebananda Library */}
              <button
                onClick={() => navigate('/library')}
                className="h-11 sm:h-12 w-full px-2.5 sm:px-3 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <BookOpen size={16} className="shrink-0 text-emerald-200" />
                <span className="text-[11px] sm:text-xs font-bold truncate">{language === 'bn' ? 'সেবানন্দ গ্রন্থাগার' : 'Sebananda Library'}</span>
              </button>

              {/* 4. Daily Service Duty */}
              <button
                onClick={() => navigate(isLoggedIn ? '/member' : '/login')}
                className="h-11 sm:h-12 w-full px-2.5 sm:px-3 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <RefreshCw size={16} className="shrink-0 text-teal-200" />
                <span className="text-[11px] sm:text-xs font-bold truncate">{language === 'bn' ? 'আমার দৈনিক সেবা' : 'My Daily Seva'}</span>
              </button>

              {/* 5. Full VOICE Syllabus & Lectures */}
              <button
                onClick={() => navigate('/syllabus')}
                className="h-11 sm:h-12 w-full px-2.5 sm:px-3 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <Compass size={16} className="shrink-0 text-rose-200" />
                <span className="text-[11px] sm:text-xs font-bold truncate">{language === 'bn' ? 'ভয়েস সিলেবাস' : 'Syllabus & Notes'}</span>
              </button>

              {/* 6. Announcements & Notices */}
              <button
                onClick={() => navigate('/announcements')}
                className="h-11 sm:h-12 w-full px-2.5 sm:px-3 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <Bell size={16} className="shrink-0 text-purple-200" />
                <span className="text-[11px] sm:text-xs font-bold truncate">{language === 'bn' ? 'ইনচার্জ নোটিশ' : 'Incharge Notices'}</span>
              </button>

            </div>

          </div>
        </div>

        {/* ================= 2. COMPACT UPCOMING FESTIVALS & EKADASHI (SMALL LINES) ================= */}
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-indigo-500/10 border border-amber-500/20 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {language === 'bn' ? 'আসন্ন মহোৎসব ও তিথি (Upcoming Festivals)' : 'Upcoming Sacred Festivals & Timings'}
              </h3>
            </div>
            <Link
              to="/calendar"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>{language === 'bn' ? 'সম্পূর্ণ বৈষ্ণব পঞ্জিকা' : 'Full Calendar'}</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Compact 3-Line Rows */}
          <div className="space-y-2">
            {CLOSEST_UPCOMING_FESTIVALS.map((fest) => (
              <div
                key={fest.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2.5 sm:py-2 sm:px-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800/80 text-xs shadow-xs hover:border-amber-400/60 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${fest.badgeColor}`}>
                    {language === 'bn' ? fest.dateBn : fest.dateEn}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {language === 'bn' ? fest.nameBn : fest.nameEn}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium sm:text-right shrink-0 pl-7 sm:pl-0">
                  {language === 'bn' ? fest.fastingBn : fest.fastingEn}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 3. SEARCH & MODULES CARD GRID (NOW INCLUDES ANNOUNCEMENTS CARD) ================= */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {language === 'bn' ? 'ভয়েস প্রধান মডিউল ও সেবাসমূহ' : 'VOICE Core Modules & Services'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'নিচের যেকোনো কার্ডে ক্লিক করে সরাসরি ড্যাশবোর্ড ব্যবহার করুন' : 'Click any card below to launch its interactive workspace'}
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
              {[
                { key: 'ALL', label: 'All Modules' },
                { key: 'SEVA', label: 'Seva & Care' },
                { key: 'STUDY', label: 'Courses & Wisdom' },
                { key: 'PREACHING', label: 'Preaching' },
                { key: 'ORG', label: 'Org & Admin' }
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeFilter === f.key ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map(card => (
              <FeatureCard
                key={card.id}
                {...card}
                lang={language}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        </div>

        {/* ================= 4. THE 6 PILLARS & 8 CORE OBJECTIVES ================= */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-900">
              <Sparkles size={13} />
              <span>Pillars &amp; Objectives</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'bn' ? 'ভয়েসের ৬টি স্তম্ভ ও ৮টি মূল উদ্দেশ্য' : 'The 6 Pillars & 8 Core Objectives of VOICE'}
            </h3>
          </div>

          {/* 6 Pillars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {VOICE_HANDBOOK_DATA.sixPillars.map((p, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 block">
                  {language === 'bn' ? p.titleBn : p.titleEn}
                </span>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {language === 'bn' ? p.descBn : p.descEn}
                </p>
              </div>
            ))}
          </div>

          {/* 8 Objectives List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {VOICE_HANDBOOK_DATA.objectives.map(obj => (
              <div key={obj.number} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {obj.number}
                </span>
                <div className="space-y-0.5 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {language === 'bn' ? obj.titleBn : obj.titleEn}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    {language === 'bn' ? obj.descBn : obj.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 5. 4-YEAR ACADEMIC & CAMP PROGRESSION ROADMAP ================= */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white shadow-xl space-y-6 border border-purple-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
                Official VOICE Curriculum
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {language === 'bn' ? '৪-বছর মেয়াদী বৈদিক কোর্স ও ক্যাম্প কারিকুলাম' : '4-Year VOICE Academic & Camp Progression Roadmap'}
              </h3>
            </div>

            {/* Year Selector Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/10 text-xs font-bold">
              {VOICE_HANDBOOK_DATA.fourYearMatrix.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedYearTab(idx)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedYearTab === idx ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'}`}
                >
                  Year {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Year Display Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Courses Column */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-purple-400" />
                <h4 className="text-sm font-black text-purple-300 uppercase">
                  {language === 'bn' ? 'অধ্যয়ন কোর্সসমূহ (Courses)' : 'Academic Courses'}
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                {VOICE_HANDBOOK_DATA.fourYearMatrix[selectedYearTab].courses.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Camps Column */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <Tent size={16} className="text-amber-400" />
                <h4 className="text-sm font-black text-amber-300 uppercase">
                  {language === 'bn' ? 'আবাসিক ক্যাম্পসমূহ (Camps)' : 'Residential Camps'}
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                {VOICE_HANDBOOK_DATA.fourYearMatrix[selectedYearTab].camps.map((camp, i) => (
                  <li key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                    <Flame size={13} className="text-amber-400 shrink-0" />
                    <span>{camp}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* ================= 6. 2026 NIGHT STAY FESTIVALS & HOST ASHRAMS ================= */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-mono">
                Monthly Fellowship
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                {language === 'bn' ? '২০২৬ নাইট স্টে ফেস্টিভ্যাল ও হোস্ট আশ্রম তালিকা' : '2026 Night Stay Festivals Calendar'}
              </h3>
            </div>
            <Link to="/calendar" className="text-xs font-bold text-indigo-600 hover:underline">
              View Vaishnava Calendar →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-slate-400 uppercase">
                  <th className="pb-2">Month</th>
                  <th className="pb-2">Servants / Organizers</th>
                  <th className="pb-2">Managed By (VOICE Host Ashrams)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {VOICE_HANDBOOK_DATA.nightStayFestivals2026.map((n, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {language === 'bn' ? n.monthBn : n.monthEn}
                    </td>
                    <td className="py-2.5 text-slate-800 dark:text-slate-200">
                      {language === 'bn' ? n.servantBn : n.servantEn}
                    </td>
                    <td className="py-2.5 font-semibold text-slate-600 dark:text-slate-400">
                      {language === 'bn' ? n.managedByBn : n.managedByEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= 7. BLESSINGS & CENTRAL LEADERSHIP ================= */}
        <div className="rounded-3xl p-6 sm:p-8 bg-amber-500/10 border border-amber-500/30 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
              Invocations &amp; Blessings
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "{language === 'bn' ? VOICE_HANDBOOK_DATA.swamiBlessingBn : VOICE_HANDBOOK_DATA.swamiBlessingEn}"
            </p>
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
              — {language === 'bn' ? VOICE_HANDBOOK_DATA.swamiTitleBn : VOICE_HANDBOOK_DATA.swamiTitleEn}
            </p>
          </div>
        </div>

        {/* ================= 8. ISKCON BANGLADESH CENTRES DIRECTORY ================= */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div 
            onClick={() => setShowIskconCenters(!showIskconCenters)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Landmark size={18} className="text-indigo-600" />
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {language === 'bn' ? 'বাংলাদেশে ইসকন কেন্দ্রসমূহের তালিকা (ফোন ও ঠিকানা)' : 'ISKCON Centres in Bangladesh Directory'}
              </h3>
            </div>
            <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              {showIskconCenters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {showIskconCenters && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
              {VOICE_HANDBOOK_DATA.iskconDivisions.map((div, dIdx) => (
                <div key={dIdx} className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {language === 'bn' ? div.divisionNameBn : div.divisionNameEn}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {div.centers.map((c, cIdx) => (
                      <div key={cIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin size={12} className="text-rose-500 shrink-0" />
                          <span>{c.address}</span>
                        </div>
                        <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Phone size={11} />
                          <span>{c.phones.join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default HubHome;
