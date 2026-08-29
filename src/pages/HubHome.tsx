import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FeatureCard } from '../components/hub/FeatureCard';
import { Footer } from '../components/layout/Footer';
import { VOICE_HANDBOOK_DATA } from '../data/voiceHandbookData';
import { 
  Users, BookOpen, HeartHandshake, RefreshCw, ShieldCheck,
  GraduationCap, Tent, Calendar, Compass, Phone,
  Sparkles,
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
      id: 'devotee_profiles',
      titleEn: 'Devotee Profiles & Nectar Drops',
      titleBn: 'ভক্ত প্রোফাইল ও সদ্গুণাবলী ডিরেক্টরি',
      descEn: 'Photos, birthday, gmail, blood group & mutual Vaishnava appreciations.',
      descBn: 'ভক্তের ছবি, জন্মদিন, রক্তের গ্রুপ ও অমৃতবিন্দু সদ্গুণাবলী ডিরেক্টরি।',
      categoryEn: 'Vaishnava Profiles',
      categoryBn: 'ভক্তবৃন্দ',
      categoryType: 'ORG',
      icon: Users,
      link: '/profiles',
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
      badgeEn: 'All Profiles',
      badgeBn: 'সকল ভক্তবৃন্দ',
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
      
      {/* ================= ULTRA-STYLISH TWO-ROW GLASSMARQUEE TICKER ================= */}
      <div className="w-full shadow-md text-white text-xs font-bold divide-y divide-white/10 select-none backdrop-blur-xl">
        
        {/* Row 1: Royal Saffron & Rose Gold Festival Marquee */}
        <div className="bg-gradient-to-r from-amber-600/95 via-orange-600/95 to-amber-700/95 py-2 px-3.5 sm:px-6 flex items-center gap-3 overflow-hidden border-b border-amber-500/20">
          <div className="flex items-center gap-1.5 shrink-0 z-10 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider font-mono font-black text-white">
              {language === 'bn' ? '🌸 উৎসব' : '🌸 FEAST'}
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-[11px] sm:text-xs">
              <span>🌸 <strong className="text-amber-100 font-extrabold">{language === 'bn' ? 'শ্রীকৃষ্ণ জন্মাষ্টমী (৪ সেপ্টেম্বর ২০২৬):' : 'Sri Krishna Janmastami (04 Sep 2026):'}</strong> <span className="text-white/90">{language === 'bn' ? 'মধ্যরাত ১২:০০ পর্যন্ত নির্জলা/সজল উপবাস ও রাত ১২টায় মহাভিষেক এবং আনন্দ উৎসব।' : 'Fasting till midnight 12:00 AM • Mahabhisheka & Feast!'}</span></span>
              <span>🌸 <strong className="text-amber-100 font-extrabold">{language === 'bn' ? 'শ্রীকৃষ্ণ জন্মাষ্টমী (৪ সেপ্টেম্বর ২০২৬):' : 'Sri Krishna Janmastami (04 Sep 2026):'}</strong> <span className="text-white/90">{language === 'bn' ? 'মধ্যরাত ১২:০০ পর্যন্ত নির্জলা/সজল উপবাস ও রাত ১২টায় মহাভিষেক এবং আনন্দ উৎসব।' : 'Fasting till midnight 12:00 AM • Mahabhisheka & Feast!'}</span></span>
            </div>
          </div>
          <Link to="/calendar" title="View Full Calendar" className="shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/35 text-white z-10 flex items-center justify-center transition-all hover:scale-110 shadow-xs cursor-pointer">
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Row 2: Deep Indigo & Ruby Incharge Announcement Marquee */}
        <div className="bg-gradient-to-r from-slate-950/95 via-indigo-950/95 to-slate-950/95 py-2 px-3.5 sm:px-6 flex items-center gap-3 overflow-hidden border-b border-indigo-500/20">
          <div className="flex items-center gap-1.5 shrink-0 z-10 px-2.5 py-0.5 rounded-full bg-rose-500/25 backdrop-blur-md border border-rose-400/40 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider font-mono font-black text-rose-200">
              {language === 'bn' ? '📢 নোটিশ' : '📢 NOTICE'}
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-[11px] sm:text-xs text-slate-200">
              <span>📢 <strong className="text-rose-200 font-extrabold">{language === 'bn' ? 'সাপ্তাহিক সাধনা অডিট ও কাউন্সেলিং:' : 'Weekly Sadhana Audit & Counseling:'}</strong> <span className="text-slate-300">{language === 'bn' ? 'শুক্রবার রাত ৮:০০ টার মধ্যে সকল শিক্ষার্থীকে সাধনাপত্র জমা দিতে হবে (কাউন্সেলর ডেস্ক সক্রিয়)।' : 'All counsellees must submit their weekly sadhana log by Friday 8:00 PM.'}</span></span>
              <span>📢 <strong className="text-rose-200 font-extrabold">{language === 'bn' ? 'সাপ্তাহিক সাধনা অডিট ও কাউন্সেলিং:' : 'Weekly Sadhana Audit & Counseling:'}</strong> <span className="text-slate-300">{language === 'bn' ? 'শুক্রবার রাত ৮:০০ টার মধ্যে সকল শিক্ষার্থীকে সাধনাপত্র জমা দিতে হবে (কাউন্সেলর ডেস্ক সক্রিয়)।' : 'All counsellees must submit their weekly sadhana log by Friday 8:00 PM.'}</span></span>
            </div>
          </div>
          <Link to="/announcements" title="View All Notices" className="shrink-0 w-6 h-6 rounded-full bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 z-10 flex items-center justify-center transition-all hover:scale-110 shadow-xs cursor-pointer">
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>

      {/* ================= DISTINCT STYLISH ITALIC BANNER: DARE TO BE RARE ================= */}
      <div className="w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/30 py-2 px-4 text-center shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <span className="h-[1px] flex-1 max-w-[60px] sm:max-w-[120px] bg-gradient-to-r from-transparent to-amber-400/60" />
          <span className="text-xs sm:text-sm md:text-base font-serif italic tracking-[0.2em] font-extrabold bg-gradient-to-r from-amber-300 via-orange-200 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)] select-none">
            ✦ Dare to be Rare ✦
          </span>
          <span className="h-[1px] flex-1 max-w-[60px] sm:max-w-[120px] bg-gradient-to-l from-transparent to-amber-400/60" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ================= 1. MAJESTIC HERO SECTION WITH IYF LOGO & RESTYLED NAMES ================= */}
        <div className="relative overflow-hidden rounded-[32px] p-6 sm:p-10 bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/15">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -top-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-5">
            
            {/* Header Identity Row: Official IYF Logo + Restyled Titles */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              
              {/* Official IYF Emblem Logo at First */}
              <div className="relative shrink-0 group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-transform duration-300 group-hover:scale-105">
                  <img 
                    src="/assets/iyf_logo.png" 
                    alt="ISKCON Youth Forum (IYF)" 
                    className="w-full h-full object-cover rounded-full bg-slate-950"
                  />
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[8.5px] uppercase font-mono shadow-md whitespace-nowrap">
                  IYF • VOICE
                </div>
              </div>

              {/* Restyled Names & Sacred Motto */}
              <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest border border-white/15 backdrop-blur-md">
                  <Sparkles size={11} className="text-amber-400" />
                  <span>{language === 'bn' ? 'ইসকন যুব ফোরাম • অদ্বৈত ভয়েস' : 'ISKCON Youth Forum • Advaita VOICE'}</span>
                </div>
                
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-amber-200 via-orange-100 to-white bg-clip-text text-transparent drop-shadow-sm whitespace-nowrap">
                  {language === 'bn' ? 'অদ্বৈত ভয়েস হাব' : 'Advaita VOICE Hub'}
                </h1>
                
                <p className="text-xs sm:text-sm text-amber-200 font-serif italic tracking-wide pt-0.5">
                  "{language === 'bn' ? VOICE_HANDBOOK_DATA.mottoBn : VOICE_HANDBOOK_DATA.mottoEn}"
                </p>
              </div>

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

            {/* Symmetrical 2-Column Action Grid (Clear, Fully Readable, Unclipped Labels) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
              
              {/* 1. Counselor Desk */}
              <button
                onClick={() => navigate('/counselor')}
                className="h-11 sm:h-12 w-full px-2 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <ShieldCheck size={15} className="shrink-0 text-slate-950" />
                <span className="text-[10.5px] xs:text-[11.5px] sm:text-xs font-black tracking-tight whitespace-nowrap">
                  {language === 'bn' ? 'কাউন্সেলর ডেস্ক' : 'Counselor Desk'}
                </span>
              </button>

              {/* 2. Digital Sadhana */}
              <button
                onClick={() => navigate('/sadhana')}
                className="h-11 sm:h-12 w-full px-2 py-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <HeartHandshake size={15} className="shrink-0 text-indigo-200" />
                <span className="text-[10.5px] xs:text-[11.5px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
                  {language === 'bn' ? 'ডিজিটাল সাধনা' : 'Digital Sadhana'}
                </span>
              </button>

              {/* 3. Sebananda Library */}
              <button
                onClick={() => navigate('/library')}
                className="h-11 sm:h-12 w-full px-2 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <BookOpen size={15} className="shrink-0 text-emerald-200" />
                <span className="text-[10.5px] xs:text-[11.5px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
                  {language === 'bn' ? 'সেবানন্দ লাইব্রেরি' : 'Sebananda Library'}
                </span>
              </button>

              {/* 4. Daily Service Duty */}
              <button
                onClick={() => navigate(isLoggedIn ? '/member' : '/login')}
                className="h-11 sm:h-12 w-full px-2 py-1.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <RefreshCw size={15} className="shrink-0 text-teal-200" />
                <span className="text-[10.5px] xs:text-[11.5px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
                  {language === 'bn' ? 'আমার দৈনিক সেবা' : 'My Daily Seva'}
                </span>
              </button>

              {/* 5. Full VOICE Syllabus & Lectures */}
              <button
                onClick={() => navigate('/syllabus')}
                className="h-11 sm:h-12 w-full px-2 py-1.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <Compass size={15} className="shrink-0 text-rose-200" />
                <span className="text-[10.5px] xs:text-[11.5px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
                  {language === 'bn' ? 'ভয়েস সিলেবাস' : 'Voice Syllabus'}
                </span>
              </button>

              {/* 6. Announcements & Notices */}
              <button
                onClick={() => navigate('/announcements')}
                className="h-11 sm:h-12 w-full px-2 py-1.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                <Bell size={15} className="shrink-0 text-purple-200" />
                <span className="text-[10.5px] xs:text-[11.5px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
                  {language === 'bn' ? 'ইনচার্জ নোটিশ' : 'Incharge Notices'}
                </span>
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
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
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

        {/* ================= 5. AUTHENTIC 4-YEAR VOICE SYLLABUS & CAMPS MATRIX (IMAGE 2 REPLICA) ================= */}
        <div className="rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl space-y-6 border border-white/15">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-mono font-black uppercase tracking-widest shadow-md">
              VOICE Syllabus
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'bn' ? '৪-বর্ষীয় ভয়েস সিলেবাস ও কোর্স-ক্যাম্প কাঠামো' : '4-Year VOICE Academic & Camp Progression Roadmap'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/90 font-serif italic">
              "Introducing Krishna Consciousness to youths by one time seminars on Art of Mind Control, Power of Habit, Stress Management etc."
            </p>
          </div>

          {/* 4 Years Golden Plaque Grid (Exact replica of Handbook structure) */}
          <div className="space-y-6">
            
            {/* --- FIRST YEAR --- */}
            <div className="space-y-2">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-mono px-3 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/30">
                  FIRST YEAR
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Plaque */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-orange-500/20 border-2 border-amber-400/50 shadow-md backdrop-blur-md space-y-2">
                  <div className="text-center pb-1.5 border-b border-amber-400/30">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">COURSE</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-amber-100 font-medium">
                    <li className="p-1 rounded bg-black/20">Discover Yourself (DYS)</li>
                    <li className="p-1 rounded bg-black/20">Spiritual Scientist (SS)</li>
                    <li className="p-1 rounded bg-black/20">Positive Thinker (PT)</li>
                  </ul>
                </div>
                {/* Camp Plaque */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-orange-500/20 border-2 border-amber-400/50 shadow-md backdrop-blur-md space-y-2">
                  <div className="text-center pb-1.5 border-b border-amber-400/30">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">CAMP</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-amber-100 font-medium">
                    <li className="p-1 rounded bg-black/20">Sankalpa</li>
                    <li className="p-1 rounded bg-black/20">Sphurti</li>
                    <li className="p-1 rounded bg-black/20">Utsaha</li>
                    <li className="p-1 rounded bg-black/20">Utkarsha</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* --- SECOND YEAR --- */}
            <div className="space-y-2">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-mono px-3 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/30">
                  SECOND YEAR
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Plaque */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-orange-500/20 border-2 border-amber-400/50 shadow-md backdrop-blur-md space-y-2">
                  <div className="text-center pb-1.5 border-b border-amber-400/30">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">COURSE</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-amber-100 font-medium">
                    <li className="p-1 rounded bg-black/20">Self Manager (SM)</li>
                    <li className="p-1 rounded bg-black/20">Hearing Srila Prabhupada-100 Lecture</li>
                  </ul>
                </div>
                {/* Camp Plaque */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-orange-500/20 border-2 border-amber-400/50 shadow-md backdrop-blur-md space-y-2">
                  <div className="text-center pb-1.5 border-b border-amber-400/30">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">CAMP</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-amber-100 font-medium">
                    <li className="p-1 rounded bg-black/20">SRCGD</li>
                    <li className="p-1 rounded bg-black/20">Nistha Camp</li>
                    <li className="p-1 rounded bg-black/20">Follow up Training Workshop (FTW)</li>
                    <li className="p-1 rounded bg-black/20">Facilitator Empowerment Course (FEC)</li>
                    <li className="p-1 rounded bg-black/20">DYS Preachers Training</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* --- THIRD YEAR --- */}
            <div className="space-y-2">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-mono px-3 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/30">
                  THIRD YEAR
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Plaque */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-orange-500/20 border-2 border-amber-400/50 shadow-md backdrop-blur-md space-y-2">
                  <div className="text-center pb-1.5 border-b border-amber-400/30">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">COURSE</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-amber-100 font-medium">
                    <li className="p-1 rounded bg-black/20">Proactive Leader</li>
                    <li className="p-1 rounded bg-black/20">Hearing Srila Prabhupada &amp; Gurumaharaj 100 Lecture</li>
                  </ul>
                </div>
                {/* Camp Plaque */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-orange-500/20 border-2 border-amber-400/50 shadow-md backdrop-blur-md space-y-2">
                  <div className="text-center pb-1.5 border-b border-amber-400/30">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">CAMP</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-amber-100 font-medium">
                    <li className="p-1 rounded bg-black/20">Ashraya Camp</li>
                    <li className="p-1 rounded bg-black/20">Gauranga Sabha Camp &amp; Nityananda Sabha Camp</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* --- FOURTH YEAR --- */}
            <div className="space-y-2">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-mono px-3 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/30">
                  FOURTH YEAR
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Plaque */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-orange-500/20 border-2 border-amber-400/50 shadow-md backdrop-blur-md space-y-2">
                  <div className="text-center pb-1.5 border-b border-amber-400/30">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">COURSE</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-amber-100 font-medium">
                    <li className="p-1 rounded bg-black/20">Proactive Leader</li>
                    <li className="p-1 rounded bg-black/20">Personality Development Course</li>
                    <li className="p-1 rounded bg-black/20">Hearing Srila Prabhupada &amp; Gurumaharaj 100 Lecture</li>
                  </ul>
                </div>
                {/* Camp Plaque */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-orange-500/20 border-2 border-amber-400/50 shadow-md backdrop-blur-md space-y-2">
                  <div className="text-center pb-1.5 border-b border-amber-400/30">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">CAMP</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-amber-100 font-medium">
                    <li className="p-1 rounded bg-black/20">Sharanagati Camp</li>
                    <li className="p-1 rounded bg-black/20">Gauranga Sabha Camp &amp; Nityananda Sabha Camp</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= 6. DEVOTEE'S ADVANCEMENT MATRIX (IMAGE 3 REPLICA: ভক্তের উন্নতির পাঠ্যক্রম) ================= */}
        <div className="rounded-[32px] p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          <div className="text-center space-y-1 max-w-2xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold uppercase tracking-wider border border-rose-200 dark:border-rose-900">
              Spiritual Evolution Matrix
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'bn' ? 'ভক্তের উন্নতির পাঠ্যক্রম' : "Devotee's Advancement Curriculum Matrix"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'bn' ? 'শুরু থেকে ৭+ বছর পর্যন্ত আধ্যাত্মিক শাস্ত্রজ্ঞান, আচার্য নিষ্ঠা, বৈষ্ণব সদাচার ও সেবার পর্যায়ক্রমিক সারণি' : 'Chronological matrix from initiation to 7+ years of spiritual study, Acharya dedication and devotional service.'}
            </p>
          </div>

          {/* 4 Column Progression Table Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VOICE_HANDBOOK_DATA.devoteeAdvancementMatrix.map((stage, idx) => (
              <div 
                key={idx}
                className={`rounded-2xl border-2 ${stage.borderColor} bg-gradient-to-b ${stage.color} overflow-hidden shadow-sm flex flex-col justify-between`}
              >
                <div>
                  {/* Stage Header */}
                  <div className={`p-3 text-center font-black text-xs sm:text-sm tracking-wide shadow-xs ${stage.headerBg}`}>
                    {language === 'bn' ? stage.stageBn : stage.stageEn}
                  </div>

                  {/* Stage Items */}
                  <div className="p-3 space-y-2">
                    {stage.items.map((item, iIdx) => (
                      <div 
                        key={iIdx}
                        className="p-2.5 rounded-xl bg-white/85 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 font-semibold shadow-2xs leading-snug flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                        <span>{language === 'bn' ? item.bn : item.en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Official Accreditations */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-4 flex-wrap text-xs font-mono font-black text-slate-700 dark:text-slate-300">
            <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              🎓 BHAKTISASTRI
            </span>
            <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              📜 TTC1
            </span>
            <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              📜 TTC2
            </span>
            <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              🏛️ BSTTC
            </span>
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
