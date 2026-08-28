import React, { useState } from 'react';
import { CALENDAR_2026_DATA } from '../../data/calendar2026Data';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Calendar as CalendarIcon, Clock, ArrowLeft, Search, Moon, Utensils
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const VaishnavaCalendarPage: React.FC = () => {
  const { language } = useLanguage();
  const [filterType, setFilterType] = useState<'ALL' | 'EKADASHI' | 'FESTIVAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = CALENDAR_2026_DATA.filter(ev => {
    if (filterType === 'EKADASHI' && ev.type !== 'EKADASHI') return false;
    if (filterType === 'FESTIVAL' && ev.type === 'EKADASHI') return false;
    const q = searchQuery.toLowerCase();
    return ev.nameEn.toLowerCase().includes(q) ||
           ev.nameBn.toLowerCase().includes(q) ||
           ev.significanceEn.toLowerCase().includes(q) ||
           ev.significanceBn.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/40 shadow-xs hover:shadow-sm transition-all group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-amber-600 dark:text-amber-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
            {language === 'bn' ? '২০২৬ বৈষ্ণব ক্যালেন্ডার' : '2026 ISKCON Vaishnava Calendar'}
          </span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-800 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <CalendarIcon size={13} />
              <span>Official ISKCON Calendar 2026 • Bangladesh &amp; Chittagong Timetable</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? '২০২৬ বৈষ্ণব ক্যালেন্ডার ও উৎসব তালিকা' : '2026 Vaishnava Calendar & Festivals'}
            </h1>
            <p className="text-xs sm:text-sm text-yellow-100 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'একাদশী ব্রত, পারণ সময়সূচি, শ্রীশ্রী গৌর পূর্ণিমা, জন্মাষ্টমী, রাধাষ্টমী ও শ্রীল প্রভুপাদের ব্যাসপূজা মহোৎসব তালিকা এবং আশ্রম সেবা বণ্টন।'
                : 'All 2026 Ekadashis, Parana breaking timings, major festivals (Gaura Purnima, Janmashtami, Ratha Yatra, Vyasa-puja) & seva duties.'}
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'ALL'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {language === 'bn' ? 'সকল উৎসব (২১টি)' : 'All Events (21)'}
            </button>
            <button
              onClick={() => setFilterType('EKADASHI')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'EKADASHI'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {language === 'bn' ? 'একাদশী ব্রত ও পারণ' : 'Ekadashi & Parana'}
            </button>
            <button
              onClick={() => setFilterType('FESTIVAL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'FESTIVAL'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {language === 'bn' ? 'মহোৎসব ও আবির্ভাব' : 'Major Festivals'}
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'উৎসব বা একাদশী খুঁজুন...' : 'Search event, fasting...'}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map(ev => {
            const isEkadashi = ev.type === 'EKADASHI';

            return (
              <div 
                key={ev.id}
                className={`rounded-2xl p-4 sm:p-5 border transition-all shadow-xs flex flex-col justify-between space-y-3 ${
                  isEkadashi
                    ? 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-900/40 hover:border-amber-400'
                    : 'bg-white dark:bg-slate-900 border-yellow-200/80 dark:border-yellow-900/40 hover:border-yellow-400'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60 font-mono">
                      📅 {ev.date}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      isEkadashi
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                    }`}>
                      {ev.type}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {language === 'bn' ? ev.nameBn : ev.nameEn}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                    <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                      <Moon size={13} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span><strong>{language === 'bn' ? 'উপবাস বিধি:' : 'Fasting:'}</strong> {language === 'bn' ? ev.fastingBn : ev.fastingEn}</span>
                    </div>

                    {ev.paranaEn && (
                      <div className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <Clock size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>{language === 'bn' ? 'পারণ সময়:' : 'Parana:'}</strong> {language === 'bn' ? ev.paranaBn : ev.paranaEn}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {language === 'bn' ? ev.significanceBn : ev.significanceEn}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
                    <Utensils size={13} />
                    <span>Seva: {language === 'bn' ? ev.assignedSevaBn : ev.assignedSevaEn}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default VaishnavaCalendarPage;
