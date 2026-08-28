import React, { useState } from 'react';
import { PREACHER_QA_LIST, SHLOKA_BOX, type PreacherQA, type ShlokaEntry } from '../../data/preachersData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Search, Sparkles, Copy, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const PreachersToolkit: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'QA' | 'SHLOKA'>('QA');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredQA = PREACHER_QA_LIST.filter(item => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    const q = searchQuery.toLowerCase();
    return item.questionEn.toLowerCase().includes(q) ||
           item.questionBn.toLowerCase().includes(q) ||
           item.shortAnswerEn.toLowerCase().includes(q) ||
           item.shortAnswerBn.toLowerCase().includes(q);
  });

  const copyQA = (item: PreacherQA) => {
    const text = `❓ *Q:* ${item.questionEn}\n💡 *A:* ${item.shortAnswerEn}\n📖 *References:* ${item.keyVerses.join(', ')}`;
    navigator.clipboard.writeText(text);
    toast.success('Q&A copied to clipboard!');
  };

  const copyShloka = (shloka: ShlokaEntry) => {
    const text = `📜 *${shloka.source} ${shloka.verseNumber}*\n\n${language === 'bn' ? shloka.bengaliScript : shloka.sanskrit}\n\n*Transliteration:*\n${shloka.transliteration}\n\n*Word-for-Word:*\n${language === 'bn' ? (shloka.wordForWordBn || shloka.wordForWordEn) : shloka.wordForWordEn}\n\n*Translation:*\n${language === 'bn' ? shloka.meaningBn : shloka.meaningEn}`;
    navigator.clipboard.writeText(text);
    toast.success(language === 'bn' ? 'শ্লোক ও অর্থ কপি করা হয়েছে!' : 'Verse & translation copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-500/40 shadow-xs hover:shadow-sm transition-all group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-violet-600 dark:text-violet-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
            {language === 'bn' ? 'প্রচারক টুলকিট ও শ্লোক' : 'Preacher’s Pocket Toolkit'}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-violet-700 via-fuchsia-700 to-violet-900 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <Sparkles size={13} />
              <span>Campus Preachers • Instant Q&amp;A Defense &amp; Shloka Bank</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'প্রচারক প্রশ্নোত্তর ও শ্লোক ভান্ডার' : 'Preacher’s Pocket Toolkit & Shloka Box'}
            </h1>
            <p className="text-xs sm:text-sm text-violet-100 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'বিশ্ববিদ্যালয় ও কলেজ ক্যাম্পাসে প্রচারের জন্য বিজ্ঞান, সৃষ্টি, কর্মফল ও ধর্ম বিষয়ক যুক্তিপূর্ণ উত্তর এবং আবশ্যক শ্লোক।'
                : 'Logical answers on science, karma, purpose of life, and essential Sanskrit verses for discussions and debates.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button 
            onClick={() => setActiveTab('QA')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'QA' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ❓ Campus Q&amp;A Defense Guide
          </button>
          <button 
            onClick={() => setActiveTab('SHLOKA')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'SHLOKA' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            🪷 Shloka Box (Verse Bank)
          </button>
        </div>

        {activeTab === 'QA' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions on science, karma, soul, God..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm focus:outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                <option value="ALL">All Categories</option>
                <option value="SCIENCE">Science &amp; God</option>
                <option value="KARMA">Karma &amp; Reincarnation</option>
                <option value="PHILOSOPHY">One God vs Many</option>
                <option value="GURU">Need for Guru</option>
                <option value="LIFESTYLE">4 Regulative Principles</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredQA.map(item => (
                <div 
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                        {item.category}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white pt-1">
                        {language === 'bn' ? item.questionBn : item.questionEn}
                      </h3>
                    </div>

                    <button 
                      onClick={() => copyQA(item)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="Copy Answer"
                    >
                      <Copy size={13} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl">
                    {language === 'bn' ? item.shortAnswerBn : item.shortAnswerEn}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-400">Key Shlokas:</span>
                    {item.keyVerses.map((v, i) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'SHLOKA' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {SHLOKA_BOX.map(shloka => (
                <div 
                  key={shloka.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold">
                        {shloka.source} {shloka.verseNumber}
                      </span>
                    </div>

                    <button 
                      onClick={() => copyShloka(shloka)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="Copy Verse"
                    >
                      <Copy size={14} />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-center space-y-1.5">
                    <p className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-amber-200">
                      {shloka.sanskrit}
                    </p>
                    <p className="text-xs italic text-slate-500 dark:text-slate-400 font-serif">
                      {shloka.transliteration}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Translation:</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {language === 'bn' ? shloka.meaningBn : shloka.meaningEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PreachersToolkit;
