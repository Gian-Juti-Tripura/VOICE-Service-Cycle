import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, Sparkles, ChevronRight, User, BookOpen, Clock, 
  Utensils, HeartHandshake, RefreshCw, ShieldCheck, GraduationCap, 
  Tent, Calendar, Compass, PlayCircle, Bell, Flame, Building
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';
import { INITIAL_DEVOTEES_DATA, type DevoteeProfile } from '../../data/devoteeProfilesData';

interface SearchResultItem {
  id: string;
  titleEn: string;
  titleBn: string;
  categoryEn: string;
  categoryBn: string;
  categoryType: 'PORTAL' | 'DEVOTEE' | 'COURSE' | 'CAMP' | 'LIBRARY';
  descEn: string;
  descBn: string;
  link: string;
  icon: any;
  keywords: string[];
}

export const GlobalSearchBar: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [devotees, setDevotees] = useState<DevoteeProfile[]>(INITIAL_DEVOTEES_DATA);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isBn = language === 'bn';

  // Load custom/edited devotees if available in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('advaita_voice_devotee_profiles_v1');
      if (saved) {
        setDevotees(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Complete Searchable Corpus
  const searchCorpus: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [
      // --- 1. CORE PORTALS & TOOLS ---
      {
        id: 'portal_meals',
        titleEn: 'Prasad & Meal Manager',
        titleBn: 'প্রসাদ ও মিল হিসাব',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Daily meal toggles, live cook count, bazar logs & 1-tap WhatsApp bills.',
        descBn: 'দৈনিক মিল টগল, বাজার ট্র্যাকার ও ১-ক্লিকে হোয়াটসঅ্যাপ বিলিং।',
        link: '/meals',
        icon: Utensils,
        keywords: ['meal', 'prasad', 'bazar', 'bills', 'breakfast', 'lunch', 'dinner', 'rate', 'খাবার', 'মিল', 'প্রসাদ', 'বাজার', 'বিল']
      },
      {
        id: 'portal_discipline',
        titleEn: 'VOICE & Lotus Discipline Audit',
        titleBn: 'ভয়েস ও লোটাস গ্রুপ শৃঙ্খলা অডিট',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Morning program, wake-up (4:00 AM) and bed timing reports with WhatsApp send.',
        descBn: 'ঘুম, জাগরণ (৪:০০ AM) ও মর্নিং প্রোগ্রাম অডিট এবং কাউন্সেলর প্রভুকে হোয়াটসঅ্যাপ রিপোর্ট।',
        link: '/discipline-audit',
        icon: Clock,
        keywords: ['discipline', 'wake', 'sleep', 'morning program', 'lotus', 'voice', 'audit', 'ঘুম', 'জাগরণ', 'শৃঙ্খলা', 'অডিট']
      },
      {
        id: 'portal_counselor',
        titleEn: 'Counselor Desk & Mentorship',
        titleBn: 'কাউন্সেলর ডেস্ক ও মেন্টরশিপ',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Inspect 12 counsellees daily sadhana records and send WhatsApp remarks.',
        descBn: '১২ জন শিক্ষার্থীর সাধনা যাচাই, মন্তব্য প্রদান ও হোয়াটসঅ্যাপ আশীর্বাদ।',
        link: '/counselor',
        icon: ShieldCheck,
        keywords: ['counselor', 'mentor', 'care', 'guide', 'audit', 'remarks', 'কাউন্সেলর', 'মেন্টর']
      },
      {
        id: 'portal_sadhana',
        titleEn: 'Digital Sadhana Sheet',
        titleBn: 'ডিজিটাল সাধনাপত্র',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: '16 rounds chanting, Mangala Arati, hearing, and reading logs.',
        descBn: '১৬ মালা জপ, মঙ্গল আরতি, শ্রবণ ও অধ্যয়নের পূর্ণাঙ্গ দৈনিক সাধনাপত্র।',
        link: '/sadhana',
        icon: HeartHandshake,
        keywords: ['sadhana', 'chanting', 'japa', '16 rounds', 'mangala arati', 'hearing', 'reading', 'সাধনা', 'জপ', 'মালা']
      },
      {
        id: 'portal_profiles',
        titleEn: 'Advaita VOICE Devotee Profiles Directory',
        titleBn: 'অদ্বৈত ভয়েস ভক্ত প্রোফাইল ডিরেক্টরি',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Comprehensive devotees directory, blood group, department, contacts & Nectar Drops.',
        descBn: 'ভক্তদের পূর্ণাঙ্গ তথ্য, রক্তের গ্রুপ, বিভাগ, ফোন নম্বর ও পারস্পরিক গুণগান (অমৃতবিন্দু)।',
        link: '/profiles',
        icon: User,
        keywords: ['profiles', 'devotees', 'directory', 'phone', 'blood', 'nectar', 'contacts', 'প্রোফাইল', 'ভক্ত', 'ডিরেক্টরি']
      },
      {
        id: 'portal_cycle',
        titleEn: 'Daily Seva Cycle Rotation',
        titleBn: 'দৈনিক সেবাক্রম রোটেশন',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Pujari, cooking, cleaning, utensils, and hall seva duty allocation.',
        descBn: 'পূজারী, রান্না, পরিচ্ছন্নতা, বাসন ও হলরুম সেবার স্বয়ংক্রিয় রোটেশন।',
        link: '/service-cycle',
        icon: RefreshCw,
        keywords: ['seva', 'service', 'cycle', 'rotation', 'duty', 'pujari', 'cooking', 'cleaning', 'সেবা', 'সেবাক্রম', 'রান্না']
      },
      {
        id: 'portal_library',
        titleEn: 'Sebananda Digital Library (সেবানন্দ গ্রন্থাগার)',
        titleBn: 'সেবানন্দ ডিজিটাল গ্রন্থাগার',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Srila Prabhupada E-books, DYS slide decks, exam guides & songbooks.',
        descBn: 'শ্রীল প্রভুপাদের মূল গ্রন্থ, ডিওয়াইএস স্লাইড, পরীক্ষার নোট ও বৈষ্ণব পদাবলী।',
        link: '/library',
        icon: BookOpen,
        keywords: ['library', 'books', 'ebook', 'pdf', 'slides', 'prabhupada', 'gita', 'লাইব্রেরি', 'বই', 'গ্রন্থ']
      },
      {
        id: 'portal_media',
        titleEn: 'VOICE Audio & Video Library',
        titleBn: 'ভয়েস অডিও ও ভিডিও লাইব্রেরি',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Srila Prabhupada Morning SB Vani + HG Radheshyam Prabhu lecture archive.',
        descBn: 'শ্রীল প্রভুপাদের বাণী এবং শ্রীপাদ রাধেশ্যাম প্রভুর ভিডিও লেকচার সংগ্রহশালা।',
        link: '/lectures-library',
        icon: PlayCircle,
        keywords: ['audio', 'video', 'lectures', 'prabhupada', 'radheshyam', 'vani', 'media', 'অডিও', 'ভিডিও', 'লেকচার']
      },
      {
        id: 'portal_syllabus',
        titleEn: 'Full 854-Topic VOICE Syllabus',
        titleBn: 'সম্পূর্ণ ৮৫৪-টপিক ভয়েস সিলেবাস',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Detailed 6-Level syllabus from DYS to Srimad Bhagavatam & Chaitanya Charitamrita.',
        descBn: 'ডিওয়াইএস থেকে শুরু করে শ্রীমদ্ভাগবতম ও চৈতন্য চরিতামৃতের সম্পূর্ণ পাঠ্যক্রম।',
        link: '/syllabus',
        icon: Compass,
        keywords: ['syllabus', 'curriculum', 'topics', '854', 'levels', 'study', 'সিলেবাস', 'পাঠ্যক্রম']
      },
      {
        id: 'portal_courses',
        titleEn: 'All Courses & Diplomas (DYS, SS, PT, SM, PL, BS)',
        titleBn: 'সকল কোর্স ও ডিপ্লোমা পাঠ্যক্রম',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'DYS (6 Sessions), Spiritual Scientist, Positron, Protons & Bhakti Shastri.',
        descBn: 'ডিওয়াইএস (৬ সেশন), স্পিরিচুয়াল সায়েন্টিস্ট, পজিট্রন ও ভক্তি শাস্ত্রী কোর্স।',
        link: '/courses',
        icon: GraduationCap,
        keywords: ['courses', 'dys', 'diploma', 'positron', 'protons', 'bhakti shastri', 'কোর্স', 'ডিপ্লোমা']
      },
      {
        id: 'portal_camps',
        titleEn: 'VOICE Residential Camps (13 Camps)',
        titleBn: 'ভয়েস আবাসিক ক্যাম্পসমূহ (১৩টি ক্যাম্প)',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Sankalpa, Sphurti, Utsaha, Utkarsha, Nistha, FTW, FEC, Ashraya & Sharanagati.',
        descBn: 'সংকল্প, স্ফূর্তি, উৎসাহ, উৎকর্ষ, নিষ্ঠা, এফটিডব্লিউ ও শরণাগতি ক্যাম্প।',
        link: '/camps',
        icon: Tent,
        keywords: ['camps', 'sankalpa', 'sphurti', 'utsaha', 'utkarsha', 'nistha', 'ftw', 'fec', 'retreat', 'ক্যাম্প']
      },
      {
        id: 'portal_calendar',
        titleEn: 'Vaishnava Calendar & Festivals',
        titleBn: 'বৈষ্ণব ক্যালেন্ডার ও উৎসবসমূহ',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Ekadashi fasting dates, Janmastami, Gaura Purnima & Appearance days.',
        descBn: 'একাদশী ব্রত, জন্মাষ্টমী, গৌর পূর্ণিমা ও বৈষ্ণব মহাজনদের আবির্ভাব তিথি।',
        link: '/calendar',
        icon: Calendar,
        keywords: ['calendar', 'ekadashi', 'festivals', 'janmastami', 'gaura purnima', 'fasting', 'ক্যালেন্ডার', 'একাদশী', 'উৎসব']
      },
      {
        id: 'portal_org',
        titleEn: 'Advaita VOICE Organizational Structure',
        titleBn: 'অদ্বৈত ভয়েস সাংগঠনিক কাঠামো',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Caretaker, Coordinator, Kitchen, Seva & Preaching leadership wings.',
        descBn: 'কেয়ারটেকার, সমন্বয়ক, রান্নাঘর ও প্রচার বিভাগীয় নেতৃত্ব কাঠামো।',
        link: '/advaita-org',
        icon: Building,
        keywords: ['org', 'structure', 'caretaker', 'coordinator', 'hierarchy', 'wings', 'সংগঠন', 'কেয়ারটেকার']
      },
      {
        id: 'portal_notices',
        titleEn: 'Announcements & Incharge Notice Board',
        titleBn: 'বিজ্ঞপ্তি ও ইনচার্জ নোটিশ বোর্ড',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Manager, Security, Morning Program & Coordinator notices.',
        descBn: 'ম্যানেজার, নিরাপত্তা, মর্নিং প্রোগ্রাম ও সমন্বয়কদের জরুরি নোটিশ।',
        link: '/announcements',
        icon: Bell,
        keywords: ['notices', 'announcements', 'incharge', 'board', 'alerts', 'নোটিশ', 'বিজ্ঞপ্তি']
      },
      {
        id: 'portal_preachers',
        titleEn: "Preacher's Pocket Toolkit & Q/A",
        titleBn: 'প্রচারক পকেট টুলকিট ও প্রশ্নোত্তর',
        categoryEn: 'Portals & Tools',
        categoryBn: 'পোর্টাল ও টুলস',
        categoryType: 'PORTAL',
        descEn: 'Crucial preaching Q/A, key shloka memorizer & DYS outreach guides.',
        descBn: 'জরুরি প্রচারমূলক প্রশ্নোত্তর, মুখস্থ শ্লোকমালা ও ডিওয়াইএস প্রচার কৌশল।',
        link: '/preaching',
        icon: Flame,
        keywords: ['preachers', 'toolkit', 'shloka', 'qa', 'dharma', 'gita verses', 'প্রচারক', 'শ্লোক']
      }
    ];

    // --- 2. DEVOTEE PROFILES ---
    devotees.forEach(dev => {
      items.push({
        id: `dev_${dev.id}`,
        titleEn: dev.name + (dev.spiritualName ? ` (${dev.spiritualName})` : ''),
        titleBn: dev.name + (dev.spiritualName ? ` (${dev.spiritualName})` : ''),
        categoryEn: 'Devotees Directory',
        categoryBn: 'ভক্ত ডিরেক্টরি',
        categoryType: 'DEVOTEE',
        descEn: `${dev.roleBadge ? dev.roleBadge + ' • ' : ''}${dev.department} • Phone: ${dev.phone} • Blood: ${dev.bloodGroup}`,
        descBn: `${dev.roleBadge ? dev.roleBadge + ' • ' : ''}${dev.department} • ফোন: ${dev.phone} • রক্ত: ${dev.bloodGroup}`,
        link: '/profiles',
        icon: User,
        keywords: [
          dev.name, 
          dev.spiritualName || '', 
          dev.phone, 
          dev.gmail || '', 
          dev.department || '', 
          dev.address || '', 
          dev.bloodGroup || '', 
          dev.roleBadge || '',
          'devotee', 'profile', 'member', 'bhakta', 'ভক্ত'
        ]
      });
    });

    // --- 3. COURSES SPECIFIC ENTRIES ---
    const courses = [
      { id: 'c_dys', nameEn: 'Discover Yourself (DYS)', nameBn: 'ডিসকভার ইয়োরসেলফ (DYS)', desc: '6 sessions fundamental course exploring the science of soul, mind & destiny.' },
      { id: 'c_ss', nameEn: 'Spiritual Scientist (SS)', nameBn: 'স্পিরিচুয়াল সায়েন্টিস্ট (SS)', desc: 'Scientific synthesis of science and Vedic spirituality.' },
      { id: 'c_pt', nameEn: 'Positive Thinking (PT / Positron)', nameBn: 'পজিটিভ থিংকিং (পজিট্রন)', desc: 'Mind control, stress reduction and victorious living.' },
      { id: 'c_bs', nameEn: 'Bhakti Shastri (BS)', nameBn: 'ভক্তি শাস্ত্রী ডিপ্লোমা', desc: 'In-depth study of Bhagavad Gita, Nectar of Devotion, Upadesamrita & Isopanisad.' }
    ];

    courses.forEach(c => {
      items.push({
        id: `course_${c.id}`,
        titleEn: c.nameEn,
        titleBn: c.nameBn,
        categoryEn: 'Vedic Courses',
        categoryBn: 'বৈদিক কোর্স',
        categoryType: 'COURSE',
        descEn: c.desc,
        descBn: c.desc,
        link: '/courses',
        icon: GraduationCap,
        keywords: [c.nameEn, c.nameBn, 'course', 'vedic', 'diploma', 'study', 'কোর্স']
      });
    });

    // --- 4. RESIDENTIAL CAMPS ---
    const camps = [
      { id: 'camp_sankalpa', nameEn: 'Sankalpa Camp (সংকল্প ক্যাম্প)', desc: 'Cultivating spiritual determination, vow commitment & morning program enthusiasm.' },
      { id: 'camp_sphurti', nameEn: 'Sphurti Camp (স্ফূর্তি ক্যাম্প)', desc: 'Youth rejuvenation retreat through holy harinama, vaishnava association & prasadam.' },
      { id: 'camp_utsaha', nameEn: 'Utsaha Camp (উৎসাহ ক্যাম্প)', desc: 'Awakening enthusiasm in high-impact devotional service & ashram life.' },
      { id: 'camp_utkarsha', nameEn: 'Utkarsha Camp (উৎকর্ষ ক্যাম্প)', desc: 'Excellence in sadhana, discipline, emotional intelligence & academic prowess.' }
    ];

    camps.forEach(cmp => {
      items.push({
        id: `camp_${cmp.id}`,
        titleEn: cmp.nameEn,
        titleBn: cmp.nameEn,
        categoryEn: 'Ashram Camps',
        categoryBn: 'আবাসিক ক্যাম্প',
        categoryType: 'CAMP',
        descEn: cmp.desc,
        descBn: cmp.desc,
        link: '/camps',
        icon: Tent,
        keywords: [cmp.nameEn, 'camp', 'sankalpa', 'sphurti', 'utsaha', 'utkarsha', 'retreat', 'ক্যাম্প']
      });
    });

    return items;
  }, [devotees]);

  // Filtered results
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return searchCorpus.filter(item => {
      const matchTitleEn = item.titleEn.toLowerCase().includes(q);
      const matchTitleBn = item.titleBn.toLowerCase().includes(q);
      const matchDescEn = item.descEn.toLowerCase().includes(q);
      const matchDescBn = item.descBn.toLowerCase().includes(q);
      const matchKeyword = item.keywords.some(k => k.toLowerCase().includes(q));
      return matchTitleEn || matchTitleBn || matchDescEn || matchDescBn || matchKeyword;
    }).slice(0, 8); // Top 8 most relevant results
  }, [query, searchCorpus]);

  const handleSelectResult = (link: string) => {
    triggerHaptic('selection');
    setIsOpen(false);
    setQuery('');
    navigate(link);
  };

  const quickPills = [
    { label: isBn ? '▶️ অডিও ও ভিডিও' : '▶️ Media Library', link: '/lectures-library' },
    { label: isBn ? '🍴 মিল ও প্রসাদ' : '🍴 Prasad Meal', link: '/meals' },
    { label: isBn ? '📿 সাধনাপত্র' : '📿 Sadhana', link: '/sadhana' },
    { label: isBn ? '⏰ শৃঙ্খলা অডিট' : '⏰ Discipline', link: '/discipline-audit' },
    { label: isBn ? '🔄 সেবাক্রম' : '🔄 Seva Cycle', link: '/service-cycle' },
    { label: isBn ? '🛡️ কাউন্সেলর' : '🛡️ Counselor', link: '/counselor' },
    { label: isBn ? '👥 ভক্ত প্রোফাইল' : '👥 Devotees', link: '/profiles' },
    { label: isBn ? '🎓 বেদিক কোর্স' : '🎓 Courses', link: '/courses' },
    { label: isBn ? '🧭 সিলেবাস (৮৫৪)' : '🧭 Syllabus', link: '/syllabus' },
    { label: isBn ? '🏕️ আবাসিক ক্যাম্প' : '🏕️ Camps', link: '/camps' },
    { label: isBn ? '📚 সেবানন্দ লাইব্রেরি' : '📚 Library', link: '/library' },
    { label: isBn ? '🏛️ পরিচালনা পরিষদ' : '🏛️ Management', link: '/management' },
    { label: isBn ? '📅 বৈষ্ণব পঞ্জিকা' : '📅 Calendar', link: '/calendar' },
    { label: isBn ? '📢 ইনচার্জ নোটিশ' : '📢 Notices', link: '/announcements' },
    { label: isBn ? '🔥 প্রচারক টুলকিট' : '🔥 Preaching', link: '/preaching' }
  ];

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-4xl lg:max-w-5xl mx-auto z-40">
      
      {/* Search Input Box */}
      <div className="relative group">
        
        {/* Glowing Aura Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300 pointer-events-none" />

        <div className="relative flex items-center bg-slate-900/95 dark:bg-slate-950/95 border border-amber-400/40 rounded-2xl shadow-2xl backdrop-blur-xl">
          
          {/* Left Search Icon */}
          <div className="pl-4 pr-2 text-amber-400 flex items-center justify-center shrink-0">
            <Search size={18} className="animate-pulse" />
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder={
              isBn 
                ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 'ভয়েস হাব অনুসন্ধান করুন...' : 'যেকোনো বিষয় খুঁজুন... (উদাঃ ডিওয়াইএস, সাধনা, মিল)') 
                : (typeof window !== 'undefined' && window.innerWidth < 640 ? 'Search VOICE Hub...' : 'Search anything across VOICE... (e.g. DYS, Sadhana, Meals)')
            }
            className="w-full py-3 sm:py-3.5 pr-8 sm:pr-20 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none font-medium"
          />

          {/* Right Action Icons: Clear Button + Keyboard Shortcut Badge */}
          <div className="pr-3 flex items-center gap-1.5 shrink-0">
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Clear Search"
              >
                <X size={15} />
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 font-bold">
                ⌘K
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Quick Search Suggestion Pills - Responsive Scrollable Mobile, Clean Wrap Desktop */}
      <div className="flex items-center gap-1.5 sm:gap-2 pt-2.5 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-start sm:justify-center px-0.5">
        {quickPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectResult(pill.link)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-amber-500/20 text-slate-200 hover:text-amber-200 text-[11px] font-semibold border border-slate-700/60 hover:border-amber-400/60 whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs active:scale-95 shrink-0 backdrop-blur-md"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Results Dropdown Menu */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-slate-900/98 dark:bg-slate-950/98 border border-amber-400/30 shadow-2xl backdrop-blur-2xl overflow-hidden divide-y divide-slate-800/80 animate-scale-in z-50 max-h-[75vh] sm:max-h-96 overflow-y-auto">
          
          <div className="p-2.5 bg-black/40 flex items-center justify-between text-[11px] font-bold text-amber-300 font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              <span>{isBn ? `অনুসন্ধান ফলাফল (${searchResults.length})` : `Matching Results (${searchResults.length})`}</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {isBn ? 'ক্লিক করে সরাসরি প্রবেশ করুন' : 'Tap to Navigate'}
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Search size={28} className="mx-auto text-slate-600 animate-bounce" />
              <p className="text-xs text-slate-400 font-medium">
                {isBn 
                  ? `"${query}" এর সাথে মেলানো কোনো তথ্য পাওয়া যায়নি। অন্য কিছু দিয়ে চেষ্টা করুন।`
                  : `No results found matching "${query}". Try searching for modules, devotees or courses.`}
              </p>
            </div>
          ) : (
            <div className="p-1.5 space-y-1">
              {searchResults.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectResult(item.link)}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/10 active:bg-amber-500/20 transition-all flex items-start gap-3 group cursor-pointer"
                  >
                    
                    {/* Icon Box */}
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-xs mt-0.5">
                      <IconComponent size={17} />
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                          {isBn ? item.titleBn : item.titleEn}
                        </h4>
                        
                        <span className="text-[9.5px] font-mono font-bold px-2 py-0.2 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30">
                          {isBn ? item.categoryBn : item.categoryEn}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 group-hover:text-slate-300">
                        {isBn ? item.descBn : item.descEn}
                      </p>
                    </div>

                    {/* Arrow Pointer */}
                    <ChevronRight size={15} className="text-slate-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                  </button>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
