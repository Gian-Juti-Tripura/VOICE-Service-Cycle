import React, { useState, useEffect } from 'react';
import { SYLLABUS_COURSES } from '../../data/syllabusData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Search, CheckCircle2, Circle, Headphones, 
  ExternalLink, FileText, Sparkles, ArrowLeft, X
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const SyllabusExplorer: React.FC = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');

  const [selectedCourse, setSelectedCourse] = useState<number | 'ALL'>(initialTab === 'vani' ? 8 : 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('voice_syllabus_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('voice_syllabus_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeNoteItem, setActiveNoteItem] = useState<{ id: string; title: string } | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState('');
  const [audioModalItem, setAudioModalItem] = useState<{ title: string; query: string; courseNumber?: number; courseTitle?: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('voice_syllabus_progress', JSON.stringify(completedItems));
  }, [completedItems]);

  useEffect(() => {
    localStorage.setItem('voice_syllabus_notes', JSON.stringify(notes));
  }, [notes]);

  const toggleItem = (id: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openNoteDrawer = (id: string, title: string) => {
    setActiveNoteItem({ id, title });
    setCurrentNoteText(notes[id] || '');
  };

  const saveNote = () => {
    if (activeNoteItem) {
      setNotes(prev => ({
        ...prev,
        [activeNoteItem.id]: currentNoteText
      }));
      toast.success(language === 'bn' ? 'নোট সংরক্ষিত হয়েছে!' : 'Note saved successfully!');
      setActiveNoteItem(null);
    }
  };

  let totalItemsCount = 0;
  let completedCount = 0;

  SYLLABUS_COURSES.forEach(c => {
    c.subchapters.forEach(s => {
      s.items.forEach(i => {
        totalItemsCount++;
        if (completedItems[i.id]) completedCount++;
      });
    });
  });

  const progressPercent = totalItemsCount > 0 ? Math.round((completedCount / totalItemsCount) * 100) : 0;

  const filteredCourses = SYLLABUS_COURSES.filter(c => {
    if (selectedCourse !== 'ALL' && c.courseNumber !== selectedCourse) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-amber-400 hover:border-primary-500/40 shadow-xs hover:shadow-sm transition-all group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-amber-600 dark:text-amber-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
            {language === 'bn' ? 'অদ্বৈত ভয়েস সিলেবাস' : 'Advaita VOICE Syllabus'}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <Sparkles size={13} />
              <span>VOICE Syllabus • 14 Modules • 854 Total Topics</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'ভয়েস পাঠক্রম ও ধারাবাহিক সিলেবাস' : 'VOICE Syllabus & Course Explorer'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'শ্রীল রাধেশ্যাম দাস (পরিচালক, ভয়েস) প্রণীত সার্বিক আধ্যাত্মিক প্রশিক্ষণ ও পাঠক্রম তালিকা।'
                : 'Designed by HG Radheshyam Das (Director, VOICE) — a step-by-step roadmap for spiritual and character excellence.'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-md space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span>{language === 'bn' ? 'আপনার সামগ্রিক অগ্রগতি' : 'Your Overall Progress'}</span>
                <span>{completedCount} / {totalItemsCount} ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/30 overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="text-xs font-semibold text-amber-100 text-center sm:text-right">
              Progress saved automatically in browser storage
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? '৮৫৪টি বিষয়ের মধ্যে অনুসন্ধান করুন...' : 'Search within 854 topics, verses, or lectures...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold shadow-sm focus:outline-none"
            >
              <option value="ALL">All 14 Modules ({totalItemsCount} items)</option>
              {SYLLABUS_COURSES.map(c => (
                <option key={c.courseNumber} value={c.courseNumber}>
                  {c.courseNumber}. {language === 'bn' ? (c.titleBn || c.titleEn) : c.titleEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredCourses.map(course => (
            <div 
              key={course.id}
              className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
            >
              <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    Module {course.courseNumber}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                    {course.courseNumber}. {language === 'bn' ? (course.titleBn || course.titleEn) : course.titleEn}
                  </h2>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {course.subchapters.map((sub, sIdx) => {
                  const subQuery = searchQuery.toLowerCase();
                  const filteredItems = sub.items.filter(i => 
                    i.textEn.toLowerCase().includes(subQuery) ||
                    (i.textBn && i.textBn.toLowerCase().includes(subQuery))
                  );

                  if (searchQuery && filteredItems.length === 0) return null;

                  return (
                    <div key={sIdx} className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400">
                          {sub.title}
                        </h3>
                        {sub.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {sub.badge}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {filteredItems.map(item => {
                          const isDone = !!completedItems[item.id];
                          const hasNote = !!notes[item.id];

                          return (
                            <div 
                              key={item.id}
                              className={`p-3 rounded-2xl border text-xs transition-all flex items-start justify-between gap-3 ${
                                isDone 
                                  ? 'bg-amber-50/40 border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-900/40' 
                                  : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-slate-300'
                              }`}
                            >
                              <div 
                                onClick={() => toggleItem(item.id)}
                                className="flex items-start gap-2.5 flex-1 cursor-pointer select-none"
                              >
                                <button className="mt-0.5 text-primary-600 dark:text-amber-400 shrink-0">
                                  {isDone ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-slate-300 dark:text-slate-600" />}
                                </button>
                                <div>
                                  <p className={`font-medium ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                                    {item.textEn}
                                  </p>
                                  {item.textBn && (
                                    <p className="text-[11px] font-serif text-slate-500 dark:text-slate-400 mt-0.5">
                                      {item.textBn}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => setAudioModalItem({ title: item.textEn, query: item.textEn, courseNumber: course.courseNumber, courseTitle: course.titleEn })}
                                  className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
                                  title="Listen / Search Audio"
                                >
                                  <Headphones size={13} />
                                </button>
                                <button
                                  onClick={() => openNoteDrawer(item.id, item.textEn)}
                                  className={`p-1.5 rounded-lg text-xs font-semibold ${
                                    hasNote 
                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' 
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                                  }`}
                                  title="Add Personal Study Notes"
                                >
                                  <FileText size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {activeNoteItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-scale-in">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText size={16} className="text-amber-500" />
                  <span>Personal Study Notes</span>
                </h3>
                <button onClick={() => setActiveNoteItem(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Topic: <span className="font-bold text-slate-700 dark:text-slate-300">{activeNoteItem.title}</span>
              </div>

              <textarea 
                rows={6}
                value={currentNoteText}
                onChange={(e) => setCurrentNoteText(e.target.value)}
                placeholder="Write your study realizations, points, questions for counselor, or lecture summaries..."
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setActiveNoteItem(null)} 
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveNote}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white shadow-md hover:bg-amber-700"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}

        {audioModalItem && (() => {
          const cleanQuery = (audioModalItem.query || '').replace(/^\d+[\.\)]\s*/, '').trim();
          const isSPCourse = audioModalItem.courseNumber === 8 || 
                             audioModalItem.title.toLowerCase().includes('prabhupada') ||
                             audioModalItem.title.toLowerCase().includes('sb ') ||
                             audioModalItem.title.toLowerCase().includes('srimad bhagavatam') ||
                             audioModalItem.title.toLowerCase().includes('bhagavad gita');

          return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-scale-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-sm">
                      <Headphones size={16} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {language === 'bn' ? 'বাণী ও অডিও-ভিডিও সন্ধান' : 'Vani & Lecture Media Finder'}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {isSPCourse ? 'Speaker: Srila Prabhupada' : 'Speaker: HG Radheshyam Das & ISKCON Acharyas'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setAudioModalItem(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X size={18} />
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Selected Topic:</span>
                  <strong className="text-slate-900 dark:text-white block leading-snug">{audioModalItem.title}</strong>
                </div>

                <div className="space-y-2 pt-1 text-xs max-h-96 overflow-y-auto pr-1">
                  
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 pt-0.5">
                    🪷 Srila Prabhupada Vani &amp; ISKCON Broadcasts:
                  </div>

                  {/* 1. Hare Krsna TV */}
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent("Hare Krsna TV Srila Prabhupada " + cleanQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 text-slate-900 dark:text-slate-100 hover:bg-amber-500/15 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">📺</span>
                      <div>
                        <span className="block font-bold text-amber-700 dark:text-amber-300 group-hover:underline">Hare Krsna TV (Srila Prabhupada)</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Official Lectures &amp; Classic Discourses</span>
                      </div>
                    </div>
                    <ExternalLink size={13} className="shrink-0 text-amber-600 dark:text-amber-400" />
                  </a>

                  {/* 2. ISKCON Desire Tree */}
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent("ISKCON Desire Tree Srila Prabhupada " + cleanQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/60 text-slate-900 dark:text-slate-100 hover:bg-emerald-500/15 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🌳</span>
                      <div>
                        <span className="block font-bold text-emerald-700 dark:text-emerald-300 group-hover:underline">ISKCON Desire Tree (SP Audio/Video)</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Comprehensive Media &amp; Class Archives</span>
                      </div>
                    </div>
                    <ExternalLink size={13} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  </a>

                  {/* 3. PrabhupadaVani.org */}
                  <a
                    href={`https://prabhupadavani.org/?s=${encodeURIComponent(cleanQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 hover:border-orange-500/60 text-slate-900 dark:text-slate-100 hover:bg-orange-500/15 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">📜</span>
                      <div>
                        <span className="block font-bold text-orange-700 dark:text-orange-300 group-hover:underline">PrabhupadaVani.org (Full Transcripts)</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Verbatim Audio &amp; Searchable Text</span>
                      </div>
                    </div>
                    <ExternalLink size={13} className="shrink-0 text-orange-600 dark:text-orange-400" />
                  </a>

                  {/* 4. Vanipedia Archive */}
                  <a
                    href={`https://vanipedia.org/w/index.php?search=${encodeURIComponent(cleanQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/60 text-slate-900 dark:text-slate-100 hover:bg-blue-500/15 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🌐</span>
                      <div>
                        <span className="block font-bold text-blue-700 dark:text-blue-300 group-hover:underline">Vanipedia Multi-lingual Encyclopedia</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Cross-Reference Quotes &amp; Audio Clips</span>
                      </div>
                    </div>
                    <ExternalLink size={13} className="shrink-0 text-blue-600 dark:text-blue-400" />
                  </a>

                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    🎙️ VOICE Youth Seminars &amp; Classes:
                  </div>

                  {/* 5. HG Radheshyam Das on YouTube */}
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent("HG Radheshyam Das " + cleanQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:border-rose-500/60 text-slate-900 dark:text-slate-100 hover:bg-rose-500/15 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🎤</span>
                      <div>
                        <span className="block font-bold text-rose-700 dark:text-rose-300 group-hover:underline">HG Radheshyam Das (VOICE Seminars)</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">DYS, EBG, VVS Seminars &amp; Youth Q&amp;A</span>
                      </div>
                    </div>
                    <ExternalLink size={13} className="shrink-0 text-rose-600 dark:text-rose-400" />
                  </a>

                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};

export default SyllabusExplorer;
