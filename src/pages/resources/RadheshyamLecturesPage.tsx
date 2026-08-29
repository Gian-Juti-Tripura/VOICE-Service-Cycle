import React, { useState, useMemo } from 'react';
import { RADHESHYAM_LECTURES_DATA, type RadheshyamLecture } from '../../data/radheshyamLecturesData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Search, ArrowLeft, ExternalLink, Video, Sparkles, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RadheshyamLecturesPage: React.FC = () => {
  const { language } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<'ALL' | 2 | 3 | 4>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<RadheshyamLecture | null>(null);

  const filteredLectures = useMemo(() => {
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
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 shadow-xs transition-all group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-indigo-600 dark:text-indigo-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
            Official VOICE Syllabus • HG Radheshyam Prabhu Video Lectures
          </span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-950 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <Video size={13} />
              <span>Official VOICE Video Lecture Series (Designed by Radheshyam Das, M.Tech, IIT Bombay)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'শ্রীপাদ রাধেশ্যাম প্রভুর ভিডিও লেকচার সিরিজ' : 'HG Radheshyam Prabhu Video Lecture Series'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-3xl leading-relaxed">
              {language === 'bn'
                ? 'ভয়েস সিলেবাস অনুসারে ২য়, ৩য় ও ৪র্থ বর্ষের শিক্ষার্থীদের জন্য চরিত্র গঠন, বৈষ্ণবীয় শিষ্টাচার, সম্পর্কের মর্যাদা ও আধ্যাত্মিক নেতৃত্বের প্রামাণ্য ভিডিও ক্লাস।'
                : 'Comprehensive 60+ video lecture series covering Character Building, Vaishnava Etiquette, Ashram Leadership, Overcoming Obstacles & Preaching Strategies.'}
            </p>
          </div>
        </div>

        {/* Year Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {(['ALL', 2, 3, 4] as const).map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                selectedYear === y 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {y === 'ALL' 
                ? (language === 'bn' ? 'সকল সিরিজ (All Series)' : 'All Years (60+ Series)') 
                : (language === 'bn' ? `${y}য় বর্ষ (${y === 2 ? 'জুনিয়র' : y === 3 ? 'সিনিয়র' : 'নেতৃত্ব'})` : `Year ${y} (${y === 2 ? 'Junior' : y === 3 ? 'Senior' : 'Leadership'})`)}
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
              placeholder={language === 'bn' ? 'লেকচার শিরোনাম, কোড বা শাখা দিয়ে খুঁজুন (যেমন: VIT VOICE, Austerity, Character)...' : 'Search by title, code or branch (e.g. VIT VOICE, Austerity, Character)...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { key: 'ALL', labelEn: 'All Topics', labelBn: 'সকল বিষয়' },
              { key: 'CHARACTER', labelEn: 'Character & Mind', labelBn: 'চরিত্র ও তপস্যা' },
              { key: 'RELATIONSHIPS', labelEn: 'Relationships', labelBn: 'সম্পর্ক ও শিষ্টাচার' },
              { key: 'MAYA_TESTS', labelEn: 'Overcoming Tests', labelBn: 'বাধা অতিক্রম' },
              { key: 'LEADERSHIP', labelEn: 'Leadership', labelBn: 'আশ্রম নেতৃত্ব' },
              { key: 'PREACHING', labelEn: 'Preaching', labelBn: 'প্রচার কৌশল' }
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-slate-900 text-white dark:bg-indigo-500 dark:text-slate-950 font-black shadow-xs'
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
              <span className="text-2xl">🎙️</span>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {language === 'bn' ? 'কোনো ভিডিও লেকচার পাওয়া যায়নি' : 'No Radheshyam Prabhu lectures found'}
              </h4>
              <p className="text-xs text-slate-400">Try changing your search keyword or selected year.</p>
            </div>
          ) : (
            filteredLectures.map((lec: RadheshyamLecture) => (
              <div 
                key={lec.id}
                className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-indigo-500/50 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 text-[10px] font-black uppercase tracking-wider font-mono">
                      <Sparkles size={10} className="text-indigo-500" />
                      <span>Year {lec.year} • {lec.category}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      {lec.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {language === 'bn' ? lec.titleBn : lec.titleEn}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                    <span>🏷️ {lec.lectureCode}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 font-normal">
                    {language === 'bn' ? lec.keyLessonBn : lec.keyLessonEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModal(lec)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    <Video size={13} />
                    <span>{language === 'bn' ? 'ভিডিও দেখুন' : 'Watch Lecture'}</span>
                  </button>

                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lec.youtubeSearchQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
                    title="Open on YouTube"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Video Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Video size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    HG Radheshyam Prabhu Video Player
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {activeModal.lectureCode} • {activeModal.locationEn}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 space-y-1 text-xs">
              <span className="text-[10px] font-black uppercase text-indigo-800 dark:text-indigo-400">Lecture Topic:</span>
              <h5 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">
                {language === 'bn' ? activeModal.titleBn : activeModal.titleEn}
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                {language === 'bn' ? activeModal.keyLessonBn : activeModal.keyLessonEn}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Online Broadcast &amp; Study Links:
              </div>

              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeModal.youtubeSearchQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 hover:border-indigo-500/60 text-slate-900 dark:text-white hover:bg-indigo-500/20 transition-all font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📺</span>
                  <div>
                    <span>Watch Full Lecture on YouTube</span>
                    <span className="block text-[10px] text-slate-500 font-normal">Official VOICE Pune &amp; ISKCON Desire Tree recording</span>
                  </div>
                </div>
                <ExternalLink size={14} className="text-indigo-600" />
              </a>

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(activeModal.youtubeSearchQuery + " notes PDF")}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/60 text-slate-900 dark:text-white hover:bg-purple-500/20 transition-all font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📝</span>
                  <div>
                    <span>Study Notes &amp; PPT Summaries</span>
                    <span className="block text-[10px] text-slate-500 font-normal">Search student lecture notes &amp; discussion guides</span>
                  </div>
                </div>
                <ExternalLink size={14} className="text-purple-600" />
              </a>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveModal(null)}
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

export default RadheshyamLecturesPage;
