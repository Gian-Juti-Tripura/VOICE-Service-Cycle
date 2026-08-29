import React, { useState } from 'react';
import { UNIFIED_LECTURES_DATA } from '../../data/unifiedLectureData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ArrowLeft, Headphones, Video, Search, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const UnifiedLectureLibrary: React.FC = () => {
  const { language } = useLanguage();
  const [activeSpeaker, setActiveSpeaker] = useState<'PRABHUPADA' | 'RADHESHYAM'>('PRABHUPADA');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | 'ALL'>('ALL');

  const sections = UNIFIED_LECTURES_DATA[activeSpeaker];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500/40 shadow-sm transition-all group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-primary-600 dark:text-primary-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
            Official VOICE Syllabus Format
          </span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl transition-all duration-500 bg-gradient-to-r from-[#2c1a0e] via-[#4a2714] to-[#2c1a0e] border-2 border-[#e2a850]">
          <div className="relative z-10 text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-[#f7b731] font-serif uppercase">
              {language === 'bn' ? 'ভয়েস মিডিয়া লাইব্রেরি' : 'VOICE Media Library'}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed italic">
              {language === 'bn' 
                ? 'ভয়েস সিলেবাস অনুসারে শ্রীল প্রভুপাদ এবং রাধেশ্যাম প্রভুর সম্পূর্ণ লেকচার আর্কাইভ।' 
                : 'The complete archive of Srila Prabhupada and HG Radheshyam Prabhu lectures exactly as per the VOICE Syllabus.'}
            </p>
          </div>
        </div>

        {/* Main Speaker Toggle Tabs */}
        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl">
          <button
            onClick={() => { setActiveSpeaker('PRABHUPADA'); setSearchQuery(''); setSelectedSectionIndex('ALL'); }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all ${
              activeSpeaker === 'PRABHUPADA'
                ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-md border border-amber-500/20'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <span className="text-xl">🪷</span> 
            {language === 'bn' ? 'শ্রীল প্রভুপাদ বাণী' : 'Srila Prabhupada Vani'}
          </button>
          <button
            onClick={() => { setActiveSpeaker('RADHESHYAM'); setSearchQuery(''); setSelectedSectionIndex('ALL'); }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all ${
              activeSpeaker === 'RADHESHYAM'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md border border-indigo-500/20'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <span className="text-xl">🎙️</span> 
            {language === 'bn' ? 'রাধেশ্যাম প্রভু ভিডিও' : 'Radheshyam Prabhu Videos'}
          </button>
        </div>

        
        {/* Chapter Header */}
        <div className="bg-gradient-to-r from-[#2c1a0e] to-[#4a2812] text-[#fff6ee] p-4 sm:p-5 rounded-xl shadow-md border-l-[5px] border-[#c28834]">
          <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wide">
            {activeSpeaker === 'PRABHUPADA' 
              ? '8. Vani Syllabus — Morning Program Series'
              : '3. HG Radheshyam Prabhu\'s Video Lecture Series'}
          </h2>
          <div className="font-bengali text-sm text-[#e2a850] mt-1.5">
            {activeSpeaker === 'PRABHUPADA'
              ? 'বাণী সিলেবাস — শ্রীল প্রভুপাদের প্রাতঃকালীন ভাগবতম লেকচার সংকলন'
              : 'শ্রীল রাধেশ্যাম প্রভুর ভিডিও লেকচার সিরিজ'}
          </div>
        </div>

        
        {/* Quick Nav / Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedSectionIndex('ALL')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedSectionIndex === 'ALL'
                ? (activeSpeaker === 'PRABHUPADA' ? 'bg-amber-600 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md')
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {language === 'bn' ? 'সকল' : 'All Sections'}
          </button>
          {sections.map((sec: any, idx: number) => {
            let shortName = sec.sectionTitle.split('(')[0].trim();
            shortName = shortName.split('-')[0].trim();
            return (
              <button
                key={idx}
                onClick={() => setSelectedSectionIndex(idx)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedSectionIndex === idx
                    ? (activeSpeaker === 'PRABHUPADA' ? 'bg-amber-600 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md')
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {shortName}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}


        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'টপিক সার্চ করুন...' : 'Search for any topic...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e2a850] shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Content Rendered Exactly Like the Syllabus */}
        <div className="space-y-6">
          {sections.map((section: any, idx: number) => {
            if (selectedSectionIndex !== 'ALL' && selectedSectionIndex !== idx) return null;

            
            // Filter topics by search query
            const filteredTopics = section.topics.filter((topic: string) => 
              topic.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );

            // If searching and no matches in this section, hide section
            if (searchQuery && filteredTopics.length === 0) return null;

            return (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                {/* Section Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <h2 className="text-base font-bold text-[#c28834] dark:text-[#e2a850] flex-1">
                    {section.sectionTitle}
                  </h2>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#f7e8cf] text-[#c28834] dark:bg-[#3d2e1b] dark:text-[#e2a850]">
                    {section.badge}
                  </span>
                </div>

                {/* Topics List */}
                <ul className="p-0 m-0 list-none divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTopics.map((topic: string, tIdx: number) => (
                    <li key={tIdx} className="flex items-start gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      
                      {/* Checkbox (visual only) */}
                      <div className="mt-1 shrink-0">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#2e7d32] focus:ring-[#2e7d32] cursor-pointer" />
                      </div>

                      {/* Topic Title */}
                      <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                        {topic}
                      </span>

                      {/* Action Icon */}
                      <a 
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`shrink-0 p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity ${
                          activeSpeaker === 'PRABHUPADA' 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' 
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400'
                        }`}
                        title="Search on YouTube"
                      >
                        {activeSpeaker === 'PRABHUPADA' ? <Headphones size={16} /> : <Video size={16} />}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {sections.filter((_: any, idx: number) => selectedSectionIndex === 'ALL' || selectedSectionIndex === idx).every((s: any) => 
            s.topics.filter((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase().trim())).length === 0
          ) && (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              No matching topics found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedLectureLibrary;
