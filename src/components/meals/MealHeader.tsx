import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ArrowLeft, LayoutDashboard, Utensils, 
  ShoppingCart, CreditCard, FileSpreadsheet, 
  Sparkles, ChefHat, Sun, Moon, Calendar
} from 'lucide-react';
import { 
  getStoredMealMembers, 
  getStoredMealOverrides 
} from '../../data/mealStore';
import { getTodayInDhaka } from '../../lib/mealReportingEngine';

interface MealHeaderProps {
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
}

export const MealHeader: React.FC<MealHeaderProps> = ({ selectedMonth, onMonthChange }) => {
  const { language } = useLanguage();
  const location = useLocation();

  const today = getTodayInDhaka();

  // Calculate live cook headcount for today
  const { lunchCount, dinnerCount, totalActive } = useMemo(() => {
    const members = getStoredMealMembers().filter(m => m.status === 'ACTIVE');
    const overrides = getStoredMealOverrides();

    const todayOverrides = new Map<string, { lunch: boolean; dinner: boolean }>();
    overrides
      .filter(o => o.date === today.dateStr)
      .forEach(o => todayOverrides.set(o.memberId, { lunch: o.lunch, dinner: o.dinner }));

    let lunch = 0;
    let dinner = 0;

    members.forEach(m => {
      const o = todayOverrides.get(m.id);
      if (o ? o.lunch : true) lunch++;
      if (o ? o.dinner : true) dinner++;
    });

    return { lunchCount: lunch, dinnerCount: dinner, totalActive: members.length };
  }, [today.dateStr]);

  const navItems = [
    { path: '/meals', labelEn: 'Dashboard', labelBn: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { path: '/meals/attendance', labelEn: 'Daily Toggles', labelBn: 'দৈনিক উপস্থিতি', icon: Utensils },
    { path: '/meals/bazar', labelEn: 'Bazar Tracker', labelBn: 'বাজার খরচ', icon: ShoppingCart },
    { path: '/meals/payments', labelEn: 'Payments', labelBn: 'জমা ও ডিপোজিট', icon: CreditCard },
    { path: '/meals/reports', labelEn: 'Monthly Sheet', labelBn: 'মাসিক বিল শিট', icon: FileSpreadsheet },
  ];

  return (
    <div className="space-y-4">
      {/* Top Bar with Back Link & Cook Headcount */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 shadow-xs transition-all w-fit"
        >
          <ArrowLeft size={15} className="text-amber-500" />
          <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
        </Link>

        {/* Live Cook's Headcount Banner */}
        <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-400/30 text-amber-900 dark:text-amber-200 text-xs font-mono font-bold shadow-xs">
          <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
            <ChefHat size={15} />
            <span className="hidden md:inline font-sans font-black uppercase text-[10px] tracking-wider">
              {language === 'bn' ? 'আজকের মিল হেডকাউন্ট:' : "Today's Headcount:"}
            </span>
          </div>
          <div className="flex items-center gap-2 font-black">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Sun size={13} />
              <span>Lunch: {lunchCount}/{totalActive}</span>
            </span>
            <span className="text-amber-400/40">•</span>
            <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
              <Moon size={13} />
              <span>Dinner: {dinnerCount}/{totalActive}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-amber-950/70 to-slate-900 text-white shadow-xl border border-white/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono text-[10.5px] font-extrabold uppercase tracking-wider border border-white/15">
              <Sparkles size={12} className="text-amber-400" />
              <span>Advaita VOICE • Prasad &amp; Meal System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'bn' ? 'প্রসাদ, বাজার ও ডাইনিং হিসাব' : 'Prasad, Bazar & Meal Management'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 font-serif italic">
              "Honoring Krishna Prasad with devotion, financial clarity, and zero waste."
            </p>
          </div>

          {/* Month Selector if provided */}
          {selectedMonth && onMonthChange && (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15 w-fit">
              <Calendar size={16} className="text-amber-300 ml-1" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="bg-transparent text-white font-mono font-bold text-xs sm:text-sm border-none focus:ring-0 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-slate-950' : 'text-slate-400'} />
              <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
