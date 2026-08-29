import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MealHeader } from '../../components/meals/MealHeader';
import { 
  Calendar, ChevronLeft, ChevronRight, Check, X, 
  Sun, Moon, Coffee, 
  CheckCheck, XCircle
} from 'lucide-react';
import { 
  getStoredMealMembers, 
  getStoredMealOverrides, 
  saveStoredMealOverrides 
} from '../../data/mealStore';
import { type MealMember, type MealOverride } from '../../types/mealTypes';
import toast from 'react-hot-toast';

export const MealAttendancePage: React.FC = () => {
  const { language } = useLanguage();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [members] = useState<MealMember[]>(() => getStoredMealMembers());
  const [overrides, setOverrides] = useState<MealOverride[]>(() => getStoredMealOverrides());

  useEffect(() => {
    saveStoredMealOverrides(overrides);
  }, [overrides]);

  const dateIso = selectedDate.toISOString().split('T')[0];
  const dateFormatted = selectedDate.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const changeDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  // Get or create override entry for a devotee on this date
  const getMemberMeal = (memberId: string) => {
    const found = overrides.find(o => o.memberId === memberId && o.date === dateIso);
    return found || {
      id: `${memberId}_${dateIso}`,
      memberId,
      date: dateIso,
      breakfast: true,
      lunch: true,
      dinner: true,
    };
  };

  // Update specific meal for a devotee
  const toggleMeal = (memberId: string, mealKey: 'breakfast' | 'lunch' | 'dinner') => {
    const current = getMemberMeal(memberId);
    const updated: MealOverride = {
      ...current,
      [mealKey]: !current[mealKey]
    };

    setOverrides(prev => {
      const filtered = prev.filter(o => !(o.memberId === memberId && o.date === dateIso));
      return [...filtered, updated];
    });
  };

  // Bulk actions for today
  const handleBulkToggle = (action: 'ALL_ON' | 'ALL_OFF' | 'LUNCH_OFF' | 'DINNER_OFF') => {
    const activeMembers = members.filter(m => m.status === 'ACTIVE');
    
    setOverrides(prev => {
      const filtered = prev.filter(o => o.date !== dateIso);
      const newEntries: MealOverride[] = activeMembers.map(m => {
        const existing = prev.find(o => o.memberId === m.id && o.date === dateIso);
        const base = existing || {
          id: `${m.id}_${dateIso}`,
          memberId: m.id,
          date: dateIso,
          breakfast: true,
          lunch: true,
          dinner: true,
        };

        if (action === 'ALL_ON') return { ...base, breakfast: true, lunch: true, dinner: true };
        if (action === 'ALL_OFF') return { ...base, breakfast: false, lunch: false, dinner: false };
        if (action === 'LUNCH_OFF') return { ...base, lunch: false };
        if (action === 'DINNER_OFF') return { ...base, dinner: false };
        return base;
      });

      return [...filtered, ...newEntries];
    });

    toast.success(language === 'bn' ? 'উপস্থিতি আপডেট করা হয়েছে!' : 'Attendance updated!');
  };

  // Compute Headcount for this date
  const counts = members.filter(m => m.status === 'ACTIVE').reduce((acc, m) => {
    const meal = getMemberMeal(m.id);
    if (meal.breakfast) acc.breakfast++;
    if (meal.lunch) acc.lunch++;
    if (meal.dinner) acc.dinner++;
    return acc;
  }, { breakfast: 0, lunch: 0, dinner: 0 });

  const totalActive = members.filter(m => m.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <MealHeader />

        {/* Date Navigator Card & Quick Stats */}
        <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Date Navigator */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 w-fit">
              <button 
                onClick={() => changeDate(-1)} 
                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                title="Previous Day"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2 px-3 py-1 text-center">
                <Calendar size={15} className="text-amber-500" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white whitespace-nowrap">
                  {dateFormatted}
                </span>
              </div>
              <button 
                onClick={() => changeDate(1)} 
                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                title="Next Day"
              >
                <ChevronRight size={18} />
              </button>
              <button 
                onClick={() => setSelectedDate(new Date())} 
                className="ml-1 px-2.5 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all"
              >
                Today
              </button>
            </div>

            {/* Live Headcount Chips for This Date */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-300 font-mono text-xs font-bold flex items-center gap-1.5">
                <Coffee size={14} className="text-orange-500" />
                <span>Breakfast: {counts.breakfast}/{totalActive}</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                <Sun size={14} className="text-emerald-500" />
                <span>Lunch: {counts.lunch}/{totalActive}</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold flex items-center gap-1.5">
                <Moon size={14} className="text-indigo-500" />
                <span>Dinner: {counts.dinner}/{totalActive}</span>
              </div>
            </div>

          </div>

          {/* Quick Bulk Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mr-1">
              Quick Actions:
            </span>
            <button
              onClick={() => handleBulkToggle('ALL_ON')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer"
            >
              <CheckCheck size={13} />
              <span>All On (সবাই খাবে)</span>
            </button>
            <button
              onClick={() => handleBulkToggle('ALL_OFF')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer"
            >
              <XCircle size={13} />
              <span>All Off (কেউ খাবে না)</span>
            </button>
            <button
              onClick={() => handleBulkToggle('LUNCH_OFF')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
            >
              <Sun size={13} />
              <span>Cancel All Lunch</span>
            </button>
            <button
              onClick={() => handleBulkToggle('DINNER_OFF')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
            >
              <Moon size={13} />
              <span>Cancel All Dinner</span>
            </button>
          </div>

        </div>

        {/* 12 Devotees Meal Toggle Cards */}
        <div className="space-y-3">
          {members.map((member, idx) => {
            const meal = getMemberMeal(member.id);

            return (
              <div 
                key={member.id}
                className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Devotee Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-sm shrink-0">
                    {member.cycleOrder ? member.cycleOrder : idx + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      {member.name}
                    </h3>
                    <div className="text-[10.5px] text-slate-400 font-mono">
                      {member.phone || 'Active Member'}
                    </div>
                  </div>
                </div>

                {/* 3 Meal Toggles (Breakfast, Lunch, Dinner) */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-sm w-full">
                  
                  {/* Breakfast */}
                  <button
                    onClick={() => toggleMeal(member.id, 'breakfast')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                      meal.breakfast
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    <Coffee size={13} />
                    <span>Breakfast</span>
                    {meal.breakfast ? <Check size={13} className="text-orange-600" /> : <X size={13} />}
                  </button>

                  {/* Lunch */}
                  <button
                    onClick={() => toggleMeal(member.id, 'lunch')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                      meal.lunch
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    <Sun size={13} />
                    <span>Lunch</span>
                    {meal.lunch ? <Check size={13} className="text-emerald-600" /> : <X size={13} />}
                  </button>

                  {/* Dinner */}
                  <button
                    onClick={() => toggleMeal(member.id, 'dinner')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                      meal.dinner
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    <Moon size={13} />
                    <span>Dinner</span>
                    {meal.dinner ? <Check size={13} className="text-indigo-600" /> : <X size={13} />}
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default MealAttendancePage;
