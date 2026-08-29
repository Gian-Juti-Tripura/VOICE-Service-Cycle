import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MealHeader } from '../../components/meals/MealHeader';
import { 
  ShoppingCart, Utensils, CreditCard, 
  FileSpreadsheet, ArrowUpRight, ArrowDownRight, 
  TrendingUp, Users
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

export const MealDashboard: React.FC = () => {
  const { language } = useLanguage();
  const today = getTodayInDhaka();
  const [selectedMonth, setSelectedMonth] = useState<string>(today.monthKey);

  const members = useMemo(() => getStoredMealMembers(), []);
  const overrides = useMemo(() => getStoredMealOverrides(), []);
  const bazar = useMemo(() => getStoredBazar(), []);
  const payments = useMemo(() => getStoredPayments(), []);
  const weights = useMemo(() => getStoredWeights(), []);

  const report = useMemo(() => {
    return computeMonthlyReport(selectedMonth, members, bazar, payments, overrides, [], weights);
  }, [selectedMonth, members, bazar, payments, overrides, weights]);

  // Recent bazar for this month
  const recentBazar = useMemo(() => {
    return bazar
      .filter(b => b.month === selectedMonth)
      .slice(-4)
      .reverse();
  }, [bazar, selectedMonth]);

  const activeMembersCount = members.filter(m => m.status === 'ACTIVE').length;

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
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
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
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {report.totalMeals.toLocaleString()} <span className="text-xs text-slate-400 font-normal">meals</span>
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
            <div className="text-xl sm:text-2xl font-black text-amber-800 dark:text-amber-300">
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
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
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

        {/* Two-Column Section: Recent Bazar + Devotee Balances Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Bazar Entries */}
          <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-rose-500" />
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
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

          {/* Devotees Balance Summary */}
          <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-indigo-500" />
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  {language === 'bn' ? 'ভক্তদের মাসিক ব্যালেন্স সারাংশ' : 'Devotees Month Balance'}
                </h3>
              </div>
              <Link to="/meals/reports" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
                Full Statement
              </Link>
            </div>

            <div className="space-y-2">
              {report.rows.slice(0, 5).map((row) => (
                <div key={row.memberId} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {row.name}
                    </div>
                    <div className="text-[10.5px] text-slate-400">
                      {row.meals} meals • Deposited: ৳{row.deposits}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-mono font-black text-xs ${
                      row.finalBalance > 0 ? 'text-emerald-600 dark:text-emerald-400' :
                      row.finalBalance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
                    }`}>
                      {row.finalBalance >= 0 ? `+৳${row.finalBalance.toFixed(0)}` : `-৳${Math.abs(row.finalBalance).toFixed(0)}`}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      row.status === 'Surplus' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                      row.status === 'Due' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}>
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MealDashboard;
