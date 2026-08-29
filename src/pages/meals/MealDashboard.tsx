import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MealHeader } from '../../components/meals/MealHeader';
import { ExportPdfButton } from '../../components/meals/ExportPdfButton';
import { 
  ShoppingCart, Utensils, CreditCard, 
  FileSpreadsheet, ArrowUpRight, ArrowDownRight, 
  TrendingUp, Lock, Unlock, MessageSquare, Check,
  UserCheck
} from 'lucide-react';
import { 
  getStoredMealMembers, 
  getStoredMealOverrides, 
  getStoredBazar, 
  getStoredPayments,
  getStoredWeights,
  BAZAR_CATEGORIES_INFO
} from '../../data/mealStore';
import { computeMonthlyReport, getTodayInDhaka } from '../../lib/mealReportingEngine';
import { type MonthlyRow } from '../../types/mealTypes';
import toast from 'react-hot-toast';

const STORAGE_MONTH_MANAGERS = 'advaita_month_managers_v1';
const STORAGE_MONTH_LOCKS = 'advaita_month_locks_v1';
const STORAGE_MONTH_MEAL_OVERRIDES = 'advaita_month_meal_overrides_v1';

export const MealDashboard: React.FC = () => {
  const { language } = useLanguage();
  const today = getTodayInDhaka();
  const [selectedMonth, setSelectedMonth] = useState<string>(today.monthKey);

  const [members] = useState(() => getStoredMealMembers());
  const [overrides] = useState(() => getStoredMealOverrides());
  const [bazar] = useState(() => getStoredBazar());
  const [payments] = useState(() => getStoredPayments());
  const [weights] = useState(() => getStoredWeights());

  // Month Managers Map { [monthKey]: managerName }
  const [monthManagers, setMonthManagers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MONTH_MANAGERS);
      return saved ? JSON.parse(saved) : { [today.monthKey]: 'Utpol P.' };
    } catch {
      return { [today.monthKey]: 'Utpol P.' };
    }
  });

  // Month Locks Map { [monthKey]: boolean }
  const [monthLocks, setMonthLocks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MONTH_LOCKS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Manual Monthly Meal Overrides { [`${memberId}_${month}`]: number }
  const [monthlyMealOverrides, setMonthlyMealOverrides] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MONTH_MEAL_OVERRIDES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [copiedDevoteeId, setCopiedDevoteeId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_MONTH_MANAGERS, JSON.stringify(monthManagers));
  }, [monthManagers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_MONTH_LOCKS, JSON.stringify(monthLocks));
  }, [monthLocks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_MONTH_MEAL_OVERRIDES, JSON.stringify(monthlyMealOverrides));
  }, [monthlyMealOverrides]);

  const isLocked = !!monthLocks[selectedMonth];
  const currentManager = monthManagers[selectedMonth] || members[0]?.name || 'Utpol P.';

  // Base report
  const rawReport = useMemo(() => {
    return computeMonthlyReport(selectedMonth, members, bazar, payments, overrides, [], weights);
  }, [selectedMonth, members, bazar, payments, overrides, weights]);

  // Apply monthly meal overrides if present
  const report = useMemo(() => {
    let newTotalMeals = 0;
    const updatedRows = rawReport.rows.map(row => {
      const overrideKey = `${row.memberId}_${selectedMonth}`;
      const overriddenMeals = monthlyMealOverrides[overrideKey] !== undefined ? monthlyMealOverrides[overrideKey] : row.meals;
      newTotalMeals += overriddenMeals;
      return { ...row, meals: overriddenMeals };
    });

    const newRate = newTotalMeals > 0 ? rawReport.totalBazar / newTotalMeals : 0;

    const finalRows = updatedRows.map(row => {
      const cost = Math.round(row.meals * newRate * 100) / 100;
      const finalBalance = Math.round((row.previousBalance + row.deposits + row.adjustmentTotal - cost) * 100) / 100;
      let status: 'Surplus' | 'Due' | 'Clear' = 'Clear';
      if (finalBalance > 0.5) status = 'Surplus';
      else if (finalBalance < -0.5) status = 'Due';

      return {
        ...row,
        mealCost: cost,
        finalBalance,
        status
      };
    });

    return {
      ...rawReport,
      totalMeals: newTotalMeals,
      mealRate: Math.round(newRate * 100) / 100,
      totalDue: finalRows.filter(r => r.finalBalance < 0).reduce((sum, r) => sum + Math.abs(r.finalBalance), 0),
      totalSurplus: finalRows.filter(r => r.finalBalance > 0).reduce((sum, r) => sum + r.finalBalance, 0),
      rows: finalRows
    };
  }, [rawReport, monthlyMealOverrides, selectedMonth]);

  // Recent bazar for this month
  const recentBazar = useMemo(() => {
    return bazar
      .filter(b => b.month === selectedMonth)
      .slice(-5)
      .reverse();
  }, [bazar, selectedMonth]);

  const activeMembersCount = members.filter(m => m.status === 'ACTIVE').length;

  // Totals for table footer
  const totalPrev = report.rows.reduce((sum, r) => sum + r.previousBalance, 0);
  const totalDeposit = report.rows.reduce((sum, r) => sum + r.deposits, 0);
  const totalMealCost = report.rows.reduce((sum, r) => sum + r.mealCost, 0);
  const totalBalance = report.rows.reduce((sum, r) => sum + r.finalBalance, 0);

  const toggleMonthLock = () => {
    const nextState = !isLocked;
    setMonthLocks(prev => ({ ...prev, [selectedMonth]: nextState }));
    toast.success(nextState ? `Month ${selectedMonth} is now LOCKED 🔒` : `Month ${selectedMonth} is now UNLOCKED 🔓`);
  };

  const handleSaveMealOverride = (memberId: string, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return;
    setMonthlyMealOverrides(prev => ({ ...prev, [`${memberId}_${selectedMonth}`]: num }));
    toast.success('Updated member total meals');
  };

  const handleCopyPersonalBill = async (row: MonthlyRow) => {
    const monthName = new Date(selectedMonth + '-01').toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', { 
      month: 'long', 
      year: 'numeric' 
    });

    let msg = `🪷 *ADVAITA VOICE — PRASAD STATEMENT (${monthName.toUpperCase()})* 🪷\n`;
    msg += `👤 *Devotee:* ${row.name}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `• Previous Balance: ৳ ${row.previousBalance.toFixed(2)}\n`;
    msg += `• Total Meals Consumed: ${row.meals} meals\n`;
    msg += `• Current Meal Rate: ৳ ${report.mealRate.toFixed(2)} / meal\n`;
    msg += `• Total Meal Cost: ৳ ${row.mealCost.toFixed(2)}\n`;
    msg += `• Total Deposits (bKash/Cash): ৳ ${row.deposits.toFixed(2)}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    if (row.finalBalance > 0) {
      msg += `✨ *Net Status:* +৳ ${row.finalBalance.toFixed(2)} (Surplus / জমা আছে)\n`;
    } else if (row.finalBalance < 0) {
      msg += `⚠️ *Net Status:* -৳ ${Math.abs(row.finalBalance).toFixed(2)} (Due / বকেয়া আছে)\n`;
    } else {
      msg += `✅ *Net Status:* ৳ 0.00 (Fully Clear / পরিশোধিত)\n`;
    }
    msg += `\n🙏 Haribol! Please contact Kitchen Incharge for any queries.\n`;

    try {
      await navigator.clipboard.writeText(msg);
      setCopiedDevoteeId(row.memberId);
      setTimeout(() => setCopiedDevoteeId(null), 2000);
      toast.success(`Personal bill copied for ${row.name}`);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <MealHeader selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

        {/* Live Monthly Stats KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* 1. Total Bazar Expense */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-black uppercase tracking-wider font-mono">
                {language === 'bn' ? 'মোট বাজার খরচ' : 'Total Bazar'}
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <ShoppingCart size={15} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              ৳ {report.totalBazar.toLocaleString()}
            </div>
            <p className="text-[10.5px] text-slate-400">
              {language === 'bn' ? 'এই মাসের মোট বাজার খরচ' : `For ${selectedMonth}`}
            </p>
          </div>

          {/* 2. Total Meals Consumed */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-black uppercase tracking-wider font-mono">
                {language === 'bn' ? 'মোট পরিবেশিত মিল' : 'Total Meals'}
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Utensils size={15} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {report.totalMeals.toFixed(1)} <span className="text-xs text-slate-400 font-normal">meals</span>
            </div>
            <p className="text-[10.5px] text-slate-400">
              {activeMembersCount} {language === 'bn' ? 'জন নিয়মিত ভক্ত' : 'active devotees'}
            </p>
          </div>

          {/* 3. Live Meal Rate */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-white to-white dark:from-amber-500/10 dark:via-slate-900 dark:to-slate-900 border border-amber-400/30 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-amber-700 dark:text-amber-300">
              <span className="text-[11px] font-black uppercase tracking-wider font-mono">
                {language === 'bn' ? 'বর্তমান মিল রেট' : 'Live Meal Rate'}
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <TrendingUp size={15} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-800 dark:text-amber-300 font-mono">
              ৳ {report.mealRate.toFixed(2)} <span className="text-xs text-slate-500 font-normal">/meal</span>
            </div>
            <p className="text-[10.5px] text-amber-700/80 dark:text-amber-400/80">
              {language === 'bn' ? 'বাজার ÷ মোট মিল' : 'Total Bazar ÷ Total Meals'}
            </p>
          </div>

          {/* 4. Total Deposits & Balance */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-black uppercase tracking-wider font-mono">
                {language === 'bn' ? 'মোট ডিপোজিট জমা' : 'Total Deposits'}
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <CreditCard size={15} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              ৳ {report.totalDeposits.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-[10.5px]">
              <span className="text-emerald-600 font-bold flex items-center">
                <ArrowUpRight size={12} /> +৳{report.totalSurplus.toFixed(0)}
              </span>
              <span className="text-rose-600 font-bold flex items-center">
                <ArrowDownRight size={12} /> -৳{report.totalDue.toFixed(0)}
              </span>
            </div>
          </div>

        </div>

        {/* Quick Action Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/meals/attendance"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Utensils size={18} />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {language === 'bn' ? 'মিল উপস্থিতি' : 'Meal Toggles'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'bn' ? 'আজকের উপস্থিতি দিন' : 'Mark daily food'}
              </p>
            </div>
          </Link>

          <Link
            to="/meals/bazar"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-rose-400 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingCart size={18} />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {language === 'bn' ? 'নতুন বাজার খরচ' : 'Add Bazar Log'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'bn' ? 'রসিদ ও খরচ যুক্ত করুন' : 'Record purchase'}
              </p>
            </div>
          </Link>

          <Link
            to="/meals/payments"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {language === 'bn' ? 'জমা গ্রহণ করুন' : 'Add Payment'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'bn' ? 'বিকাশ / ক্যাশ ডিপোজিট' : 'bKash / Cash log'}
              </p>
            </div>
          </Link>

          <Link
            to="/meals/reports"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileSpreadsheet size={18} />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {language === 'bn' ? 'মাসিক হিসাব শিট' : 'Monthly Bill Sheet'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'bn' ? 'হোয়াটসঅ্যাপ বিল ও এক্সেল' : 'WhatsApp & Excel'}
              </p>
            </div>
          </Link>
        </div>

        {/* Master Accounting Table + Side Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main Master Table (2 Cols on XL) */}
          <div className="xl:col-span-2 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <FileSpreadsheet size={18} className="text-amber-500" />
                  <span>{language === 'bn' ? 'মাসিক মাস্টার স্টেটমেন্ট ও লেজার' : 'Monthly Master Ledger & Statement'}</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Month: {selectedMonth} • Rate: ৳{report.mealRate.toFixed(2)}/meal
                </span>
              </div>

              {/* Action Bar (Export PDF & Month Lock) */}
              <div className="flex items-center gap-2 flex-wrap">
                
                {/* Official PDF Export Button */}
                <ExportPdfButton
                  elementId="dashboard-meal-table-section"
                  meta={{
                    month: selectedMonth,
                    mealRate: report.mealRate,
                    totalMeals: report.totalMeals,
                    totalExpense: report.totalBazar,
                    manager: currentManager,
                    totalPrev,
                    totalDeposit,
                    totalBalance,
                    rows: report.rows,
                  }}
                  label="Export PDF Report"
                />

                {/* Lock Month Toggle Button */}
                <button
                  onClick={toggleMonthLock}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isLocked
                      ? 'bg-rose-500/10 text-rose-600 border border-rose-500/30 hover:bg-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20'
                  }`}
                  title={isLocked ? 'Unlock Month' : 'Lock Month to finalize'}
                >
                  {isLocked ? <Lock size={13} /> : <Unlock size={13} />}
                  <span>{isLocked ? 'Locked 🔒' : 'Open 🔓'}</span>
                </button>
              </div>
            </div>

            {/* The Master Table Element for On-Screen & PDF Rendering */}
            <div 
              id="dashboard-meal-table-section" 
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-3.5">Name</th>
                      <th className="py-3 px-2 text-right">Last Bal</th>
                      <th className="py-3 px-2 text-right">Deposits</th>
                      <th className="py-3 px-2 text-right">Total Dep</th>
                      <th className="py-3 px-3 text-center">Meals</th>
                      <th className="py-3 px-2 text-right">Cost (৳)</th>
                      <th className="py-3 px-2 text-right">Final Balance</th>
                      <th className="py-3 px-2 text-center">Status</th>
                      <th className="py-3 px-3 text-center pdf-hide">WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {report.rows.map((row) => {
                      const totalDeposited = row.previousBalance + row.deposits;
                      const isCopied = copiedDevoteeId === row.memberId;

                      return (
                        <tr key={row.memberId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">
                            {row.name}
                          </td>

                          <td className="py-2.5 px-2 text-right font-mono text-slate-500">
                            ৳{row.previousBalance.toFixed(0)}
                          </td>

                          <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ৳{row.deposits.toFixed(0)}
                          </td>

                          <td className="py-2.5 px-2 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                            ৳{totalDeposited.toFixed(0)}
                          </td>

                          {/* Editable Meals Cell */}
                          <td className="py-2.5 px-3 text-center">
                            {!isLocked ? (
                              <div className="pdf-hide inline-flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  defaultValue={row.meals}
                                  onBlur={(e) => handleSaveMealOverride(row.memberId, e.target.value)}
                                  className="w-14 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1 text-xs font-bold text-slate-900 dark:text-white font-mono"
                                />
                              </div>
                            ) : (
                              <span className="font-bold text-slate-900 dark:text-white font-mono">{row.meals.toFixed(1)}</span>
                            )}
                            <span className="pdf-only hidden font-bold text-slate-900">{row.meals.toFixed(1)}</span>
                          </td>

                          <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                            ৳{row.mealCost.toFixed(0)}
                          </td>

                          <td className="py-2.5 px-2 text-right font-mono font-black">
                            <span className={
                              row.finalBalance > 0 ? 'text-emerald-600 dark:text-emerald-400' :
                              row.finalBalance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
                            }>
                              {row.finalBalance >= 0 ? `+৳${row.finalBalance.toFixed(0)}` : `-৳${Math.abs(row.finalBalance).toFixed(0)}`}
                            </span>
                          </td>

                          <td className="py-2.5 px-2 text-center">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              row.status === 'Surplus' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                              row.status === 'Due' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                            }`}>
                              {row.status === 'Surplus' ? 'Advance' : row.status}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center pdf-hide">
                            <button
                              onClick={() => handleCopyPersonalBill(row)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isCopied
                                  ? 'bg-emerald-500 text-white shadow-xs'
                                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                              }`}
                              title="Copy WhatsApp Statement"
                            >
                              {isCopied ? <Check size={13} /> : <MessageSquare size={13} />}
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {/* TOTAL SUMMARY FOOTER ROW */}
                    <tr className="border-t-2 border-slate-300 dark:border-slate-700 font-black bg-slate-100/70 dark:bg-slate-800/80 text-slate-900 dark:text-white">
                      <td className="py-3 px-3.5 uppercase font-mono">TOTAL</td>
                      <td className="py-3 px-2 text-right font-mono">৳{totalPrev.toFixed(0)}</td>
                      <td className="py-3 px-2 text-right font-mono text-emerald-600 dark:text-emerald-400">৳{totalDeposit.toFixed(0)}</td>
                      <td className="py-3 px-2 text-right font-mono">৳{(totalPrev + totalDeposit).toFixed(0)}</td>
                      <td className="py-3 px-3 text-center font-mono">{report.totalMeals.toFixed(1)}</td>
                      <td className="py-3 px-2 text-right font-mono">৳{totalMealCost.toFixed(0)}</td>
                      <td className="py-3 px-2 text-right font-mono">
                        <span className={totalBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          {totalBalance >= 0 ? `+৳${totalBalance.toFixed(0)}` : `-৳${Math.abs(totalBalance).toFixed(0)}`}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">—</td>
                      <td className="py-3 px-3 text-center pdf-hide">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Side Panel: Month Manager + Recent Bazar (1 Col on XL) */}
          <div className="space-y-6">
            
            {/* Assigned Monthly Manager Card */}
            <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck size={16} className="text-amber-500" />
                  <span>{language === 'bn' ? 'মাসিক ম্যানেজার' : 'Month Manager'}</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">{selectedMonth}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/25 flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider font-mono">
                    Assigned Incharge
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {currentManager}
                  </div>
                </div>

                <select
                  value={currentManager}
                  onChange={(e) => {
                    setMonthManagers(prev => ({ ...prev, [selectedMonth]: e.target.value }));
                    toast.success(`Manager assigned for ${selectedMonth}`);
                  }}
                  className="rounded-xl border border-amber-400/40 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white p-1.5 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recent Bazar Logs Card */}
            <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={16} className="text-rose-500" />
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    {language === 'bn' ? 'সাম্প্রতিক বাজার খরচ' : 'Recent Bazar Entries'}
                  </h3>
                </div>
                <Link to="/meals/bazar" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentBazar.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No bazar entries for {selectedMonth}.
                  </div>
                ) : (
                  recentBazar.map((item) => {
                    const catInfo = BAZAR_CATEGORIES_INFO[item.category] || BAZAR_CATEGORIES_INFO.OTHER;
                    return (
                      <div key={item.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {item.buyer}
                            </span>
                            <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold border ${catInfo.color}`}>
                              {language === 'bn' ? catInfo.labelBn : catInfo.labelEn}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {item.items}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.date}
                          </span>
                        </div>
                        <div className="text-sm font-black text-slate-900 dark:text-white font-mono shrink-0">
                          ৳ {item.amount.toLocaleString()}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default MealDashboard;
