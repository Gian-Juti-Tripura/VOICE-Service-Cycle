import React, { useState, useEffect } from 'react';
import { Phone, Mail, Sparkles, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export interface VaishnavaQuote {
  id: string;
  quoteEn: string;
  quoteBn: string;
  authorEn: string;
  authorBn: string;
  sourceEn?: string;
  sourceBn?: string;
}

const VAISHNAVA_QUOTES: VaishnavaQuote[] = [
  {
    id: 'q1',
    quoteEn: '“Advancement happens not merely by our own sadhana, but when Guru and Vaishnavas are pleased seeing our sincere sadhana.”',
    quoteBn: '“আমাদের সাধনা দিয়ে আমাদের উন্নতি হয় না, যখন সেই সাধনা দেখে গুরু-বৈষ্ণব সন্তুষ্ট হন তখনই আমাদের উন্নতি হয়।”',
    authorEn: 'HH Jayapataka Swami',
    authorBn: 'শ্রীল জয়পতাকা স্বামী',
    sourceEn: 'Nectar of Sadhana',
    sourceBn: 'সাধনামৃত'
  },
  {
    id: 'q2',
    quoteEn: '“Books are the basis, Preaching is the essence, Utility is the principle, and Purity is the force.”',
    quoteBn: '“গ্রন্থসমূহ হলো ভিত্তি, প্রচার হলো সারবস্তু, উপযোগিতাই মূলনীতি এবং শুদ্ধতাই হলো পরম শক্তি।”',
    authorEn: 'Srila Prabhupada',
    authorBn: 'শ্রীল অভয়চরণারবিন্দ ভক্তিবেদান্ত স্বামী প্রভুপাদ',
    sourceEn: 'Foundational Principles of ISKCON',
    sourceBn: 'ইসকনের মূল চার স্তম্ভ'
  },
  {
    id: 'q3',
    quoteEn: '“One should chant the holy name of the Lord in a humble state of mind, thinking oneself lower than the straw in the street; one should be more tolerant than a tree, devoid of all sense of false prestige, and should be ready to offer all respect to others.”',
    quoteBn: '“তৃণাদপি সুনীচেন তরোরিব সহিষ্ণুনা। অমানিনা মানদেন কীর্তনীয়ঃ সদা হরিঃ॥”',
    authorEn: 'Sri Chaitanya Mahaprabhu',
    authorBn: 'শ্রীচৈতন্য মহাপ্রভু',
    sourceEn: 'Sri Shikshashtakam (Verse 3)',
    sourceBn: 'শ্রীশিক্ষাষ্টকম্ (৩য় শ্লোক)'
  },
  {
    id: 'q4',
    quoteEn: '“Chant 16 rounds attentively every day, follow the four regulative principles strictly, and your life is guaranteed to become sublime.”',
    quoteBn: '“প্রতিদিন মনোযোগ দিয়ে ১৬ মালা জপ করুন, চারটি বিধিনিষেধ নিষ্ঠার সাথে পালন করুন এবং আপনার জীবন পূর্ণরূপে সার্থক হবে।”',
    authorEn: 'Srila Prabhupada',
    authorBn: 'শ্রীল প্রভুপাদ',
    sourceEn: 'Letter to Devotees (1972)',
    sourceBn: 'ভক্তদের উদ্দেশ্যে নির্দেশ'
  },
  {
    id: 'q5',
    quoteEn: '“To serve the mission of Srila Prabhupada together in harmony, with love and trust, is the highest satisfaction of the spiritual master.”',
    quoteBn: '“প্রেম ও বিশ্বাসের সাথে ঐক্যবদ্ধভাবে শ্রীল প্রভুপাদের মিশন সেবা করাই গুরুদেব ও কৃষ্ণের সর্বোচ্চ সন্তুষ্টি।”',
    authorEn: 'HH Bhakti Charu Swami',
    authorBn: 'শ্রীল ভক্তিচারু স্বামী',
    sourceEn: 'Unity in Diversity',
    sourceBn: 'সেবা ও সহযোগিতা'
  },
  {
    id: 'q6',
    quoteEn: '“True humility means not thinking less of yourself, but thinking of yourself less, and keeping Krishna in the center.”',
    quoteBn: '“প্রকৃত বিনম্রতা মানে নিজেকে ছোট ভাবা নয়, বরং নিজের অহংকারকে দূরে রেখে কৃষ্ণকে জীবনের কেন্দ্রে রাখা।”',
    authorEn: 'HH Radhanath Swami',
    authorBn: 'শ্রীল রাধানাথ স্বামী',
    sourceEn: 'The Journey Home',
    sourceBn: 'ভক্তির অমীয় বাণী'
  },
  {
    id: 'q7',
    quoteEn: '“The highest seva is to dedicate one\'s intellect, energy, and youth in spreading the message of Sri Chaitanya Mahaprabhu.”',
    quoteBn: '“শ্রীচৈতন্য মহাপ্রভুর বাণী প্রচারের কাজে নিজের মেধা, যৌবন ও কর্মশক্তি উৎসর্গ করাই মানবজীবনের পরম সৌভাগ্য।”',
    authorEn: 'Srila Bhaktisiddhanta Sarasvati Thakura',
    authorBn: 'শ্রীল ভক্তিসিদ্ধান্ত সরস্বতী ঠাকুর প্রভুপাদ',
    sourceEn: 'Upadeshavali',
    sourceBn: 'উপদেশাবলী'
  }
];

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance every 10 seconds if not paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % VAISHNAVA_QUOTES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % VAISHNAVA_QUOTES.length);
  };

  const handlePrev = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + VAISHNAVA_QUOTES.length) % VAISHNAVA_QUOTES.length);
  };

  const currentQuote = VAISHNAVA_QUOTES[currentQuoteIndex];

  const handleCopyQuote = () => {
    const textToCopy = `${language === 'bn' ? currentQuote.quoteBn : currentQuote.quoteEn}\n— ${language === 'bn' ? currentQuote.authorBn : currentQuote.authorEn}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success(language === 'bn' ? 'বাণী কপি করা হয়েছে!' : 'Quote copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="mt-16 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-500 font-sans">
      
      {/* 1. Interactive Sacred Vaishnava Vani Quotes Ribbon */}
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative overflow-hidden bg-gradient-to-r from-amber-500/[0.08] via-primary-500/[0.08] to-rose-500/[0.08] border-b border-amber-500/20 py-5 px-4 sm:px-6"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl h-24 bg-amber-500/10 blur-2xl pointer-events-none rounded-full" />

        <div className="relative max-w-4xl mx-auto z-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          
          <button 
            onClick={handlePrev}
            className="hidden sm:flex p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 shadow-xs hover:scale-105 transition-all shrink-0"
            title="Previous Quote"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="text-center space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles size={11} className="text-amber-500" />
              <span>{language === 'bn' ? 'দৈনিক বৈষ্ণব বাণী ও অমৃত কথা' : 'Daily Vaishnava Nectar Quote'}</span>
              <span className="text-amber-500/60">•</span>
              <span>{currentQuoteIndex + 1}/{VAISHNAVA_QUOTES.length}</span>
            </div>

            <p className="text-xs sm:text-sm md:text-base font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed font-semibold max-w-3xl mx-auto px-2">
              {language === 'bn' ? currentQuote.quoteBn : currentQuote.quoteEn}
            </p>

            <div className="flex items-center justify-center gap-2 flex-wrap text-xs pt-0.5">
              <span className="font-bold text-amber-600 dark:text-amber-400">
                — {language === 'bn' ? currentQuote.authorBn : currentQuote.authorEn}
              </span>
              {currentQuote.sourceEn && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  ({language === 'bn' ? currentQuote.sourceBn : currentQuote.sourceEn})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={handleCopyQuote}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 shadow-xs hover:scale-105 transition-all"
              title="Copy Quote"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span className="text-[10px]">{copied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'কপি' : 'Copy')}</span>
            </button>

            <button 
              onClick={handleNext}
              className="p-1.5 sm:p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 shadow-xs hover:scale-105 transition-all"
              title="Next Quote"
            >
              <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </div>

      {/* 2. Grand & Respectful Srila Prabhupada Memorial Dedication Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-amber-500/[0.08] via-amber-500/[0.03] to-transparent border border-amber-500/30 dark:border-amber-500/30 text-center relative overflow-hidden shadow-sm">
          
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/15 blur-2xl pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-3.5">
            
            {/* Sacred Lotus Header */}
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-widest">
              <span>🪷</span>
              <span>{language === 'bn' ? 'পরম শ্রদ্ধায় সশ্রদ্ধ নিবেদন' : 'Sacred Memorial Dedication'}</span>
              <span>🪷</span>
            </div>

            {/* Sacred Sanskrit Pranama Mantra */}
            <div className="py-1">
              <p className="font-serif italic text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 font-medium leading-relaxed">
                {language === 'bn' ? (
                  <>
                    “নম ওঁ বিষ্ণুপাদায় কৃষ্ণপ্রেষ্ঠায় ভূতলে। শ্রীমতে ভক্তিবেদান্ত স্বামিন্নিতি নামিনে॥<br />
                    নমস্তে সারস্বতে দেবে গৌরবাণীপ্রচারিণে। নির্বিশেষশূন্যবাদীপাশ্চাত্যদেশতারিণে॥”
                  </>
                ) : (
                  <>
                    “nama oṁ viṣṇu-pādāya kṛṣṇa-preṣṭhāya bhū-tale, śrīmate bhaktivedānta-svāminn iti nāmine<br />
                    namas te sārasvate deve gaura-vāṇī-pracāriṇe, nirviśeṣa-śūnyavādī-pāścātya-deśa-tāriṇe”
                  </>
                )}
              </p>
            </div>

            {/* Founder-Acharya Title in Radiant Gold Gradient */}
            <div className="space-y-2 pt-1 border-t border-amber-500/20">
              <h4 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                {language === 'bn' ? (
                  <span>
                    আন্তর্জাতিক কৃষ্ণভাবনামৃত সংঘ (ইসকন)-এর প্রতিষ্ঠাতা-আচার্য<br />
                    <span className="bg-gradient-to-r from-amber-600 via-primary-700 to-amber-600 dark:from-amber-400 dark:via-amber-200 dark:to-amber-400 bg-clip-text text-transparent">
                      শ্রীশ্রীমদ্ অভয়চরণারবিন্দ ভক্তিবেদান্ত স্বামী প্রভুপাদ
                    </span>
                  </span>
                ) : (
                  <span>
                    Founder-Ācārya of the International Society for Krishna Consciousness (ISKCON)<br />
                    <span className="bg-gradient-to-r from-amber-600 via-primary-700 to-amber-600 dark:from-amber-400 dark:via-amber-200 dark:to-amber-400 bg-clip-text text-transparent">
                      His Divine Grace A. C. Bhaktivedanta Swami Prabhupada
                    </span>
                  </span>
                )}
              </h4>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
                {language === 'bn' 
                  ? 'যাঁর অহৈতুকী করুণা, অক্লান্ত সাধনা ও দিব্য গ্রন্থাবলীর ওপর ভিত্তি করে বিশ্বজুড়ে কোটি কোটি আত্মা কৃষ্ণপ্রেমের সন্ধান পেয়েছে এবং যাঁর অপ্রাকৃত নির্দেশনায় যুবসমাজকে চরিত্রবান ও আধ্যাত্মিক জ্ঞানে আলোকিত করার উদ্দেশ্যে ভয়েস (VOICE) প্রতিষ্ঠিত — তাঁরই শ্রীচরণকমলে অদ্বৈত ভয়েসের এই সমগ্র ডিজিটাল প্ল্যাটফর্ম সশ্রদ্ধ ভক্তি ও অনন্ত কৃতজ্ঞতা সহযোগে উৎসর্গীকৃত।'
                  : 'Humbly and eternally dedicated at the divine lotus feet of Srila Prabhupada — the visionary world preceptor who brought Vedic wisdom to humanity and inspired the spiritual youth movement of VOICE to cultivate character, wisdom, and selfless devotion across the globe.'}
              </p>

              {/* 4 Foundational Pillars of ISKCON & Youth Outreach */}
              <div className="pt-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[10px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300 font-mono">
                  📖 {language === 'bn' ? 'গ্রন্থসমূহ ভিত্তি' : 'Books are the Basis'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[10px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300 font-mono">
                  🗣️ {language === 'bn' ? 'প্রচারই সারবস্তু' : 'Preaching is the Essence'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[10px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300 font-mono">
                  ⚙️ {language === 'bn' ? 'উপযোগিতাই নীতি' : 'Utility is the Principle'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[10px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300 font-mono">
                  🤍 {language === 'bn' ? 'শুদ্ধতাই পরম শক্তি' : 'Purity is the Force'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Comprehensive Organized Directory */}
        <div className="mt-8 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 space-y-6">
          
          {/* Top Brand & Identity Card (Mobile & Desktop) */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/[0.06] via-indigo-500/[0.04] to-amber-500/[0.06] border border-amber-500/20 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center shadow-xs shrink-0">
                <img 
                  src="/voice-logo-transparent.png" 
                  className="w-full h-full object-contain dark:hidden" 
                  alt="Advaita VOICE Logo" 
                />
                <img 
                  src="/voice-logo-white.png" 
                  className="w-full h-full object-contain hidden dark:block" 
                  alt="Advaita VOICE Logo" 
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    ADVAITA VOICE
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-extrabold text-[9px] uppercase tracking-wider border border-amber-500/20">
                    CU Chapter
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-serif italic">
                  "Rekindling Wisdom, Reviving Love" • ISKCON Youth Forum
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-300 sm:text-right space-y-0.5">
              <div className="font-semibold flex sm:justify-end items-center gap-1">
                <span>📍</span>
                <span>Radhamadhav Mandir &amp; Gour Nitai Ashram, CU Campus</span>
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                Affiliated: ISKCON Nandankanan, Chittagong
              </div>
            </div>
          </div>

          {/* Quick Links & Devotee Care Grid: 2 columns on Mobile, 3 columns on Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 text-xs">
            
            {/* Box 1: Ashram Daily Operations */}
            <div className="rounded-2xl p-3 sm:p-4 bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] sm:text-[11px] flex items-center gap-1.5 border-b border-slate-200/60 dark:border-slate-800/60 pb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>{language === 'bn' ? 'দৈনিক সেবা ও টুলস' : 'Ashram Utilities'}</span>
              </h5>
              <div className="grid grid-cols-1 gap-1 text-slate-700 dark:text-slate-300">
                <Link to="/meals" className="p-1 rounded-lg hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center gap-1.5 text-[11px]">
                  <span>🍛</span>
                  <span className="truncate">{language === 'bn' ? 'প্রসাদ বুকিং' : 'Prasad Booking'}</span>
                </Link>
                <Link to="/bazar-tracker" className="p-1 rounded-lg hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center gap-1.5 text-[11px]">
                  <span>🛒</span>
                  <span className="truncate">{language === 'bn' ? 'বাজার লেজার' : 'Bazar Tracker'}</span>
                </Link>
                <Link to="/sadhana" className="p-1 rounded-lg hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center gap-1.5 text-[11px]">
                  <span>📿</span>
                  <span className="truncate">{language === 'bn' ? 'সাধনাপত্র' : 'Daily Sadhana'}</span>
                </Link>
                <Link to="/discipline-audit" className="p-1 rounded-lg hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center gap-1.5 text-[11px]">
                  <span>⏰</span>
                  <span className="truncate">{language === 'bn' ? 'শৃঙ্খলা অডিট' : 'Discipline Audit'}</span>
                </Link>
                <Link to="/service-cycle" className="p-1 rounded-lg hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center gap-1.5 text-[11px]">
                  <span>🔄</span>
                  <span className="truncate">{language === 'bn' ? 'সেবাক্রম রোস্টার' : 'Seva Cycle'}</span>
                </Link>
              </div>
            </div>

            {/* Box 2: Vedic Curriculum & Training */}
            <div className="rounded-2xl p-3 sm:p-4 bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] sm:text-[11px] flex items-center gap-1.5 border-b border-slate-200/60 dark:border-slate-800/60 pb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>{language === 'bn' ? 'শিক্ষা ও ক্যাম্প' : 'Curriculum & Camps'}</span>
              </h5>
              <div className="grid grid-cols-1 gap-1 text-slate-700 dark:text-slate-300">
                <Link to="/syllabus" className="p-1 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-1.5 text-[11px]">
                  <span>🧭</span>
                  <span className="truncate">{language === 'bn' ? 'সিলেবাস (৮৫৪)' : 'VOICE Syllabus'}</span>
                </Link>
                <Link to="/courses" className="p-1 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-1.5 text-[11px]">
                  <span>🎓</span>
                  <span className="truncate">{language === 'bn' ? 'DYS কোর্স' : 'DYS Courses'}</span>
                </Link>
                <Link to="/camps" className="p-1 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-1.5 text-[11px]">
                  <span>🏕️</span>
                  <span className="truncate">{language === 'bn' ? 'যুব ক্যাম্প' : 'Youth Retreats'}</span>
                </Link>
                <Link to="/library" className="p-1 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-1.5 text-[11px]">
                  <span>📚</span>
                  <span className="truncate">{language === 'bn' ? 'সেবানন্দ লাইব্রেরি' : 'Audio Library'}</span>
                </Link>
                <Link to="/preaching" className="p-1 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-1.5 text-[11px]">
                  <span>🔥</span>
                  <span className="truncate">{language === 'bn' ? 'প্রচারক টুলকিট' : 'Preacher Toolkit'}</span>
                </Link>
              </div>
            </div>

            {/* Box 3: Devotee Care & Emergency Helpline (Spans full width on mobile) */}
            <div className="col-span-2 md:col-span-1 rounded-2xl p-3 sm:p-4 bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
              <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] sm:text-[11px] flex items-center gap-1.5 border-b border-slate-200/60 dark:border-slate-800/60 pb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{language === 'bn' ? 'ভক্ত যত্ন ও যোগাযোগ' : 'Contacts & Care'}</span>
              </h5>
              
              <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-[10.5px]">
                    {language === 'bn' ? 'তত্ত্ববধায়ক:' : 'Caretaker:'}
                  </span>
                  <span className="font-bold text-amber-700 dark:text-amber-300 text-[10.5px] truncate">
                    HG Rasvihari Das
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <a 
                    href="tel:01845812889"
                    className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all text-center"
                  >
                    <Phone size={11} />
                    <span>01845-812889</span>
                  </a>

                  <a 
                    href="mailto:Pandit.Gadadhar.JPS@pamho.net"
                    className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/25 text-[11px] font-bold text-sky-700 dark:text-sky-400 hover:bg-sky-500/20 transition-all text-center"
                  >
                    <Mail size={11} />
                    <span>Email Desk</span>
                  </a>
                </div>

                <Link 
                  to="/profiles" 
                  className="w-full py-1.5 px-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 font-bold hover:bg-rose-500/15 transition-all flex items-center justify-center gap-1.5 text-[10px]"
                >
                  <span>🩸</span>
                  <span>{language === 'bn' ? 'জরুরি রক্তের গ্রুপ তালিকা' : 'Emergency Blood Registry'}</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* 4. Copyright, System Version & Maha-Mantra with safe bottom padding for Mobile Navigation */}
        <div className="mt-8 pt-4 pb-24 sm:pb-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left text-[11px] text-slate-400 dark:text-slate-500">
          <div>
            <span>© 2026 Advaita VOICE Management System (v2.4).</span>
            <span className="hidden sm:inline"> • All rights dedicated to ISKCON.</span>
          </div>
          <p className="font-serif italic font-medium text-amber-600/90 dark:text-amber-400/90">
            Hare Krishna Hare Krishna Krishna Krishna Hare Hare • Hare Rama Hare Rama Rama Rama Hare Hare
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
