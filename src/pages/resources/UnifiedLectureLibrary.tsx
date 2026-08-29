import React, { useState, useMemo } from 'react';
import { PRABHUPADA_VANI_DATA, type PrabhupadaLecture } from '../../data/prabhupadaVaniData';
import { RADHESHYAM_LECTURES_DATA, type RadheshyamLecture } from '../../data/radheshyamLecturesData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Search, ArrowLeft, ExternalLink, Headphones, Sparkles, X, Video, PlayCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const UnifiedLectureLibrary: React.FC = () => {
  const { language } = useLanguage();
  
  // Speaker Tab State
  const [activeSpeaker, setActiveSpeaker] = useState<'PRABHUPADA' | 'RADHESHYAM'>('PRABHUPADA');
  
  // Filtering States
  const [selectedYear, setSelectedYear] = useState<'ALL' | 1 | 2 | 3 | 4>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [activeLectureModal, setActiveLectureModal] = useState<PrabhupadaLecture | RadheshyamLecture | null>(null);

  // Reset filters when switching speakers
  const handleSpeakerChange = (speaker: 'PRABHUPADA' | 'RADHESHYAM') => {
    setActiveSpeaker(speaker);
    setSelectedYear('ALL');
    setSelectedCategory('ALL');
    setSearchQuery('');
  };

  // Prabhupada Vani Filters
  const filteredPrabhupada = useMemo(() => {
    return PRABHUPADA_VANI_DATA.filter((lec: PrabhupadaLecture) => {
      const matchesYear = selectedYear === 'ALL' || lec.year === selectedYear;
      const matchesCat = selectedCategory === 'ALL' || lec.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        lec.titleEn.toLowerCase().includes(query) ||
        lec.titleBn.toLowerCase().includes(query) ||
        lec.summaryEn.toLowerCase().includes(query) ||
        lec.summaryBn.toLowerCase().includes(query) ||
        (lec.verse && lec.verse.toLowerCase().includes(query)) ||
        lec.dateAndPlace.toLowerCase().includes(query);

      return matchesYear && matchesCat && matchesSearch;
    });
  }, [selectedYear, selectedCategory, searchQuery]);

  // Radheshyam Prabhu Filters
  const filteredRadheshyam = useMemo(() => {
    return RADHESHYAM_LECTURES_DATA.filter((lec: RadheshyamLecture) => {
      const matchesYear = selectedYear === 'ALL' || lec.year === selectedYear;
      const matchesCat = selectedCategory === 'ALL' || lec.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        lec.titleEn.toLowerCase().includes(query) ||
        lec.titleBn.toLowerCase().includes(query) ||
        lec.lectureCode.toLowerCase().includes(query) ||
        lec.locationEn.toLowerCase().includes(query) ||
        lec.keyLessonEn.toLowerCase().includes(query) ||
        lec.keyLessonBn.toLowerCase().includes(query);

      return matchesYear && matchesCat && matchesSearch;
    });
  }, [selectedYear, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500/40 shadow-xs transition-all group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-primary-600 dark:text-primary-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
            Official VOICE Syllabus • Complete Audio & Video Archive
          </span>
        </div>

        {/* Hero Banner */}
        <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl transition-all duration-500 ${
          activeSpeaker === 'PRABHUPADA' 
            ? 'bg-gradient-to-r from-amber-700 via-orange-600 to-amber-900' 
            : 'bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-950'
        }`}>
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <PlayCircle size={13} />
              <span>{language === 'bn' ? 'ভয়েস মিডিয়া লাইব্রেরি' : 'VOICE Media Library'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {activeSpeaker === 'PRABHUPADA' 
                ? (language === 'bn' ? 'শ্রীল প্রভুপাদ বাণী আর্কাইভ' : 'Srila Prabhupada Vani Archive')
                : (language === 'bn' ? 'শ্রীপাদ রাধেশ্যাম প্রভুর ভিডিও সিরিজ' : 'HG Radheshyam Prabhu Video Series')}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-3xl leading-relaxed">
              {activeSpeaker === 'PRABHUPADA'
                ? (language === 'bn' 
                    ? 'ভয়েস সিলেবাসের চার বছরের পাঠ্যক্রম অনুযায়ী সাজানো শ্রীল প্রভুপাদের ভগবদগীতা, ভাগবতম ও অমৃতবচন অডিও ক্লাস।' 
                    : 'Canonical discourses, Gita & Bhagavatam classes, morning walks, and room conversations organized as per the VOICE Syllabus.')
                : (language === 'bn'
                    ? 'ভয়েস সিলেবাস অনুসারে ২য়, ৩য় ও ৪র্থ বর্ষের শিক্ষার্থীদের জন্য চরিত্র গঠন ও আধ্যাত্মিক নেতৃত্বের প্রামাণ্য ভিডিও ক্লাস।'
                    : 'Comprehensive video lecture series covering Character Building, Vaishnava Etiquette, and Ashram Leadership.')
              }
            </p>
          </div>
        </div>

        {/* Main Speaker Toggle Tabs */}
        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl">
          <button
            onClick={() => handleSpeakerChange('PRABHUPADA')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all ${
              activeSpeaker === 'PRABHUPADA'
                ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-md border-amber-500/20'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <span className="text-xl">🪷</span> 
            {language === 'bn' ? 'শ্রীল প্রভুপাদ' : 'Srila Prabhupada Vani'}
          </button>
          <button
            onClick={() => handleSpeakerChange('RADHESHYAM')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all ${
              activeSpeaker === 'RADHESHYAM'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md border-indigo-500/20'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <span className="text-xl">🎙️</span> 
            {language === 'bn' ? 'রাধেশ্যাম প্রভু' : 'Radheshyam Prabhu Videos'}
          </button>
        </div>

        {/* Dynamic Filters Section */}
        <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          
          {/* Year Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['ALL', 1, 2, 3, 4] as const).map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  selectedYear === y 
                    ? (activeSpeaker === 'PRABHUPADA' ? 'bg-amber-600 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md')
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {y === 'ALL' 
                  ? (language === 'bn' ? 'সকল বছর' : 'All Years') 
                  : (language === 'bn' ? `${y}ম বর্ষ` : `Year ${y}`)}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'সার্চ করুন (যেমন: 2.13, Character, Leadership)...' : 'Search by topic, verse, or location...'}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 shadow-2xs ${
                  activeSpeaker === 'PRABHUPADA' ? 'focus:ring-amber-500' : 'focus:ring-indigo-500'
                }`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {activeSpeaker === 'PRABHUPADA' ? (
              [
                { key: 'ALL', labelEn: 'All Books', labelBn: 'সকল গ্রন্থ' },
                { key: 'Bhagavad Gita', labelEn: 'Bhagavad Gita', labelBn: 'ভগবদ্গীতা' },
                { key: 'Srimad Bhagavatam', labelEn: 'Bhagavatam', labelBn: 'ভাগবতম' },
                { key: 'Nectar of Instruction', labelEn: 'NOI / NOD', labelBn: 'উপদেশামৃত' },
                { key: 'Caitanya Caritamrta', labelEn: 'Caitanya Caritamrta', labelBn: 'চৈতন্য চরিতামৃত' },
                { key: 'Morning Walk', labelEn: 'Morning Walks', labelBn: 'প্রাতঃভ্রমণ' }
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.key
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {language === 'bn' ? cat.labelBn : cat.labelEn}
                </button>
              ))
            ) : (
              [
                { key: 'ALL', labelEn: 'All Topics', labelBn: 'সকল বিষয়' },
                { key: 'Junior VOICE', labelEn: 'Junior VOICE', labelBn: 'জুনিয়র ভয়েস' },
                { key: 'Senior VOICE', labelEn: 'Senior VOICE', labelBn: 'সিনিয়র ভয়েস' },
                { key: 'Gauranga Sabha', labelEn: 'Gauranga Sabha', labelBn: 'গৌরাঙ্গ সভা' },
                { key: 'Leadership & Management', labelEn: 'Leadership', labelBn: 'নেতৃত্ব প্রশিক্ষণ' },
                { key: 'Future Videos', labelEn: 'Future Series', labelBn: 'ফিউচার সিরিজ' }
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.key
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {language === 'bn' ? cat.labelBn : cat.labelEn}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Prabhupada Vani Content */}
        {activeSpeaker === 'PRABHUPADA' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrabhupada.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-2xl">🪷</span>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'কোনো লেকচার পাওয়া যায়নি' : 'No lectures found'}
                </h4>
              </div>
            ) : (
              filteredPrabhupada.map((lec: PrabhupadaLecture) => (
                <div key={lec.id} className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-500/50 transition-all group">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider font-mono">
                        <Sparkles size={10} className="text-amber-500" />
                        <span>Year {lec.year} • {lec.category}</span>
                      </span>
                      {lec.duration && (
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{lec.duration}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {language === 'bn' ? lec.titleBn : lec.titleEn}
                    </h3>
                    <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300">📍 {lec.dateAndPlace}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 font-normal">
                      {language === 'bn' ? lec.summaryBn : lec.summaryEn}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button onClick={() => setActiveLectureModal(lec)} className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                      <Headphones size={13} /> <span>{language === 'bn' ? 'অডিও শুনুন' : 'Listen Vani'}</span>
                    </button>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lec.youtubeSearchQuery)}`} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Radheshyam Prabhu Content */}
        {activeSpeaker === 'RADHESHYAM' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRadheshyam.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-2xl">🎙️</span>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'কোনো ভিডিও পাওয়া যায়নি' : 'No videos found'}
                </h4>
              </div>
            ) : (
              filteredRadheshyam.map((lec: RadheshyamLecture) => (
                <div key={lec.id} className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-indigo-500/50 transition-all group">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 text-[10px] font-black uppercase tracking-wider font-mono">
                        <Sparkles size={10} className="text-indigo-500" />
                        <span>Year {lec.year} • {lec.category}</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {language === 'bn' ? lec.titleBn : lec.titleEn}
                    </h3>
                    <p className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400">📍 {lec.locationEn}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 font-normal">
                      {language === 'bn' ? lec.keyLessonBn : lec.keyLessonEn}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button onClick={() => setActiveLectureModal(lec)} className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                      <Video size={13} /> <span>{language === 'bn' ? 'ভিডিও দেখুন' : 'Watch Lecture'}</span>
                    </button>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lec.youtubeSearchQuery)}`} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {activeLectureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${activeSpeaker === 'PRABHUPADA' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'}`}>
                  {activeSpeaker === 'PRABHUPADA' ? <Headphones size={20} /> : <Video size={20} />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {activeSpeaker === 'PRABHUPADA' ? 'Prabhupada Vani Player' : 'Radheshyam Prabhu Video'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Year {activeLectureModal.year} • {activeLectureModal.category}
                  </p>
                </div>
              </div>
              <button onClick={() => setActiveLectureModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className={`p-3.5 rounded-2xl border space-y-1 text-xs ${
              activeSpeaker === 'PRABHUPADA' 
                ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/60'
                : 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-900/60'
            }`}>
              <span className={`text-[10px] font-black uppercase ${activeSpeaker === 'PRABHUPADA' ? 'text-amber-800 dark:text-amber-400' : 'text-indigo-800 dark:text-indigo-400'}`}>Topic:</span>
              <h5 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">
                {language === 'bn' ? activeLectureModal.titleBn : activeLectureModal.titleEn}
              </h5>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeLectureModal.youtubeSearchQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:border-rose-500/60 text-slate-900 dark:text-white hover:bg-rose-500/20 transition-all font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📺</span>
                  <div>
                    <span>Watch Full Recording on YouTube</span>
                    <span className="block text-[10px] text-slate-500 font-normal">Official VOICE / ISKCON broadcast</span>
                  </div>
                </div>
                <ExternalLink size={14} className="text-rose-600" />
              </a>
              
              {activeSpeaker === 'PRABHUPADA' && (
                <a
                  href={`https://prabhupadavani.org${((activeLectureModal as PrabhupadaLecture).vaniUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 text-slate-900 dark:text-white hover:bg-amber-500/20 transition-all font-bold text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🎧</span>
                    <div>
                      <span>PrabhupadaVani.org Transcript</span>
                      <span className="block text-[10px] text-slate-500 font-normal">Read original text while listening</span>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-amber-600" />
                </a>
              )}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveLectureModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedLectureLibrary;
