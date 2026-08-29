import React, { useState, useMemo } from 'react';
import { PRABHUPADA_VANI_DATA, type PrabhupadaLecture } from '../../data/prabhupadaVaniData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Search, ArrowLeft, ExternalLink, Headphones, Sparkles, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrabhupadaVaniPage: React.FC = () => {
  const { language } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<'ALL' | 1 | 2 | 3 | 4>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLectureModal, setActiveLectureModal] = useState<PrabhupadaLecture | null>(null);

  const filteredLectures = useMemo(() => {
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

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/40 shadow-xs transition-all group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-amber-600 dark:text-amber-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
            Official VOICE Syllabus • Srila Prabhupada Audio &amp; Vani Archive
          </span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-900 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <Headphones size={13} />
              <span>Canonical Audio Lectures &amp; Vani Discourses</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'শ্রীল প্রভুপাদ বাণী ও অডিও আর্কাইভ' : 'Srila Prabhupada Vani & Audio Archive'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-3xl leading-relaxed">
              {language === 'bn'
                ? 'ভয়েস সিলেবাসের চার বছরের পাঠ্যক্রম অনুযায়ী সাজানো শ্রীল প্রভুপাদের ভগবদগীতা, ভাগবতম, চৈতন্য চরিতামৃত ও অমৃতবচন অডিও ক্লাস।'
                : 'Canonical discourses, Gita & Bhagavatam classes, morning walks, and room conversations organized Year-wise and Category-wise as per the VOICE Syllabus.'}
            </p>
          </div>
        </div>

        {/* Year Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {(['ALL', 1, 2, 3, 4] as const).map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                selectedYear === y 
                  ? 'bg-amber-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {y === 'ALL' 
                ? (language === 'bn' ? 'সকল বছর (All Years)' : 'All 4 Years') 
                : (language === 'bn' ? `${y}ম বর্ষ (Year ${y})` : `Year ${y}`)}
            </button>
          ))}
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'শ্লোক, বিষয় বা স্থান দিয়ে সার্চ করুন (যেমন: 2.13, London, Japa)...' : 'Search by verse, topic or place (e.g. 2.13, London, Japa)...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { key: 'ALL', labelEn: 'All Books', labelBn: 'সকল শাস্ত্র' },
              { key: 'BG', labelEn: 'Bhagavad Gita', labelBn: 'শ্রীমদ্ভগবদ্গীতা' },
              { key: 'SB', labelEn: 'Bhagavatam', labelBn: 'শ্রীমদ্ভাগবতম' },
              { key: 'NOD_NOI', labelEn: 'NOI / NOD', labelBn: 'উপদেশামৃত' },
              { key: 'CC', labelEn: 'Caitanya Caritamrta', labelBn: 'শ্রীচৈতন্য চরিতামৃত' },
              { key: 'WALKS', labelEn: 'Morning Walks', labelBn: 'মর্নিং ওয়াক' }
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 font-black shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {language === 'bn' ? cat.labelBn : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Lectures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLectures.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-2xl">🪷</span>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {language === 'bn' ? 'কোনো প্রভুপাদ বাণী লেকচার পাওয়া যায়নি' : 'No Prabhupada lectures found matching your criteria'}
              </h4>
              <p className="text-xs text-slate-400">Try changing your search keywords or year filter.</p>
            </div>
          ) : (
            filteredLectures.map((lec: PrabhupadaLecture) => (
              <div 
                key={lec.id}
                className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-500/50 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider font-mono">
                      <Sparkles size={10} className="text-amber-500" />
                      <span>Year {lec.year} • {lec.category}</span>
                    </span>
                    {lec.duration && (
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {lec.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {language === 'bn' ? lec.titleBn : lec.titleEn}
                  </h3>

                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    📍 {lec.dateAndPlace}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 font-normal">
                    {language === 'bn' ? lec.summaryBn : lec.summaryEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveLectureModal(lec)}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                  >
                    <Headphones size={13} />
                    <span>{language === 'bn' ? 'অডিও শুনুন' : 'Listen Vani'}</span>
                  </button>

                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lec.youtubeSearchQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
                    title="Watch on YouTube"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Audio & Video Play Modal */}
      {activeLectureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Headphones size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Srila Prabhupada Vani Player
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {activeLectureModal.dateAndPlace}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveLectureModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-1 text-xs">
              <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400">Discourse Title:</span>
              <h5 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">
                {language === 'bn' ? activeLectureModal.titleBn : activeLectureModal.titleEn}
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                {language === 'bn' ? activeLectureModal.summaryBn : activeLectureModal.summaryEn}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Direct Streaming &amp; Archive Portals:
              </div>

              <a
                href={activeLectureModal.vaniUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 text-slate-900 dark:text-white hover:bg-amber-500/20 transition-all font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🪷</span>
                  <div>
                    <span>PrabhupadaVani.org (Full Audio &amp; Transcript)</span>
                    <span className="block text-[10px] text-slate-500 font-normal">Official Vanipedia text, audio streaming &amp; dictionary</span>
                  </div>
                </div>
                <ExternalLink size={14} className="text-amber-600" />
              </a>

              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeLectureModal.youtubeSearchQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:border-rose-500/60 text-slate-900 dark:text-white hover:bg-rose-500/20 transition-all font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📺</span>
                  <div>
                    <span>YouTube (Hare Krsna TV / ISKCON Desire Tree)</span>
                    <span className="block text-[10px] text-slate-500 font-normal">Classic audio broadcast with English &amp; Bengali subtitles</span>
                  </div>
                </div>
                <ExternalLink size={14} className="text-rose-600" />
              </a>
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

export default PrabhupadaVaniPage;
