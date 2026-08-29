import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MealHeader } from '../../components/meals/MealHeader';
import { ExportPdfButton } from '../../components/meals/ExportPdfButton';
import { 
  Copy, Check, MessageSquare, 
  Printer, Download
} from 'lucide-react';
import { 
  getStoredMealMembers, 
  getStoredBazar, 
  getStoredPayments, 
  getStoredMealOverrides, 
  getStoredWeights 
} from '../../data/mealStore';
import { computeMonthlyReport, getTodayInDhaka } from '../../lib/mealReportingEngine';
import { type MonthlyRow } from '../../types/mealTypes';
import toast from 'react-hot-toast';

export const MealReportsPage: React.FC = () => {
  const { language } = useLanguage();
  const today = getTodayInDhaka();

  const [selectedMonth, setSelectedMonth] = useState<string>(today.monthKey);
  const [copiedDevoteeId, setCopiedDevoteeId] = useState<string | null>(null);
  const [copiedGroupReport, setCopiedGroupReport] = useState(false);

  const members = useMemo(() => getStoredMealMembers(), []);
  const overrides = useMemo(() => getStoredMealOverrides(), []);
  const bazar = useMemo(() => getStoredBazar(), []);
  const payments = useMemo(() => getStoredPayments(), []);
  const weights = useMemo(() => getStoredWeights(), []);

  const report = useMemo(() => {
    return computeMonthlyReport(selectedMonth, members, bazar, payments, overrides, [], weights);
  }, [selectedMonth, members, bazar, payments, overrides, weights]);

  // Generate Personal Devotee WhatsApp Statement
  const generatePersonalBill = (row: MonthlyRow) => {
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
    if (row.adjustmentTotal !== 0) {
      msg += `• Adjustments: ৳ ${row.adjustmentTotal.toFixed(2)}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    if (row.finalBalance > 0) {
      msg += `✨ *Net Status:* +৳ ${row.finalBalance.toFixed(2)} (Surplus / জমা আছে)\n`;
    } else if (row.finalBalance < 0) {
      msg += `⚠️ *Net Status:* -৳ ${Math.abs(row.finalBalance).toFixed(2)} (Due / বকেয়া আছে)\n`;
    } else {
      msg += `✅ *Net Status:* ৳ 0.00 (Fully Clear / পরিশোধিত)\n`;
    }
    msg += `\n🙏 Haribol! Please contact Kitchen Incharge for any queries.\n`;
    return msg;
  };

  // Generate Full Group Summary WhatsApp Report
  const generateGroupReport = () => {
    const monthName = new Date(selectedMonth + '-01').toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', { 
      month: 'long', 
      year: 'numeric' 
    });

    let msg = `📊 *ADVAITA VOICE — MONTHLY PRASAD SUMMARY (${monthName.toUpperCase()})* 📊\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🛒 *Total Bazar Expense:* ৳ ${report.totalBazar.toLocaleString()}\n`;
    msg += `🍛 *Total Meals Consumed:* ${report.totalMeals} meals\n`;
    msg += `📈 *Live Meal Rate:* ৳ ${report.mealRate.toFixed(2)} / meal\n`;
    msg += `💳 *Total Deposits Collected:* ৳ ${report.totalDeposits.toLocaleString()}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `📋 *INDIVIDUAL DEVOTEE BALANCES:*\n`;
    report.rows.forEach((r, i) => {
      const sign = r.finalBalance > 0 ? `+৳${r.finalBalance.toFixed(0)} (Surplus)` :
                   r.finalBalance < 0 ? `-৳${Math.abs(r.finalBalance).toFixed(0)} (Due)` : `৳0 (Clear)`;
      msg += `${i + 1}. ${r.name} (${r.meals} meals) ➔ ${sign}\n`;
    });

    msg += `\n🙏 *Generated from:* Advaita VOICE Digital Hub\n`;
    return msg;
  };

  const copyToClipboard = async (text: string, devoteeId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (devoteeId) {
        setCopiedDevoteeId(devoteeId);
        setTimeout(() => setCopiedDevoteeId(null), 2000);
        toast.success('Personal bill copied for WhatsApp!');
      } else {
        setCopiedGroupReport(true);
        setTimeout(() => setCopiedGroupReport(false), 2000);
        toast.success('Full monthly summary copied for WhatsApp!');
      }
    } catch {
      toast.error('Failed to copy');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    let csv = 'Devotee,Phone,PreviousBalance,Meals,MealRate,MealCost,Deposits,FinalBalance,Status\n';
    report.rows.forEach(r => {
      csv += `"${r.name}","${r.phone || ''}",${r.previousBalance},${r.meals},${report.mealRate},${r.mealCost},${r.deposits},${r.finalBalance},"${r.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Advaita_VOICE_Meal_Report_${selectedMonth}.csv`;
    link.click();
    toast.success('Downloaded CSV Report');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <MealHeader selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

        {/* Monthly Financial Health Summary Box */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {language === 'bn' ? `${selectedMonth} এর মাসিক মিল ও বিল বিবরণী` : `Monthly Prasad & Billing Statement (${selectedMonth})`}
              </h2>
              <p className="text-xs text-slate-500 font-serif italic mt-0.5">
                Detailed devotee ledger, meal counts, live rate, and balance statements.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <ExportPdfButton
                elementId="meal-report-table-section"
                meta={{
                  month: selectedMonth,
                  mealRate: report.mealRate,
                  totalMeals: report.totalMeals,
                  totalExpense: report.totalBazar,
                  rows: report.rows,
                }}
                label="Official PDF"
              />

              <button
                onClick={() => copyToClipboard(generateGroupReport())}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-sm transition-all cursor-pointer"
              >
                {copiedGroupReport ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedGroupReport ? 'Copied Summary!' : 'Copy Group Summary (WhatsApp)'}</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs transition-all cursor-pointer"
                title="Print Report"
              >
                <Printer size={15} />
              </button>
            </div>
          </div>

          {/* 4 Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total Bazar Expense</div>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">৳ {report.totalBazar.toLocaleString()}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total Meals Taken</div>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">{report.totalMeals} meals</div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 font-mono">Computed Meal Rate</div>
              <div className="text-lg font-black text-amber-800 dark:text-amber-300 font-mono mt-0.5">৳ {report.mealRate.toFixed(2)} /meal</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Total Deposits</div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">৳ {report.totalDeposits.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Complete Devotee Billing Statement Table */}
        <div id="meal-report-table-section" className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4"># Devotee</th>
                  <th className="py-3 px-3 text-center">Meals</th>
                  <th className="py-3 px-3 text-right">Prev Balance</th>
                  <th className="py-3 px-3 text-right">Cost (৳)</th>
                  <th className="py-3 px-3 text-right">Deposits (৳)</th>
                  <th className="py-3 px-3 text-right">Final Balance</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-center">1-Tap WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {report.rows.map((row) => {
                  const isCopied = copiedDevoteeId === row.memberId;
                  return (
                    <tr key={row.memberId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                          {row.name}
                        </div>
                        {row.phone && (
                          <div className="text-[10px] font-mono text-slate-400">
                            {row.phone}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                        {row.meals}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        ৳{row.previousBalance.toFixed(0)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ৳{row.mealCost.toFixed(0)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ৳{row.deposits.toFixed(0)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-black">
                        <span className={
                          row.finalBalance > 0 ? 'text-emerald-600 dark:text-emerald-400' :
                          row.finalBalance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
                        }>
                          {row.finalBalance >= 0 ? `+৳${row.finalBalance.toFixed(0)}` : `-৳${Math.abs(row.finalBalance).toFixed(0)}`}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          row.status === 'Surplus' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20' :
                          row.status === 'Due' ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-500/20' : 
                          'bg-slate-100 dark:bg-slate-800 text-slate-600'
                        }`}>
                          {row.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => copyToClipboard(generatePersonalBill(row), row.memberId)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-600 border border-slate-200 dark:border-slate-700'
                          }`}
                          title="Generate & Copy Personal WhatsApp Bill"
                        >
                          {isCopied ? <Check size={13} /> : <MessageSquare size={13} />}
                          <span>{isCopied ? 'Copied!' : 'Send WhatsApp'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MealReportsPage;
