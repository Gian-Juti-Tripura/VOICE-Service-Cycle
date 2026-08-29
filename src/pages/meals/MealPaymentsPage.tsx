import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MealHeader } from '../../components/meals/MealHeader';
import { 
  CreditCard, Plus, Trash2, Search, 
  Wallet, X, Users
} from 'lucide-react';
import { 
  getStoredPayments, 
  saveStoredPayments, 
  getStoredMealMembers,
  getStoredBazar,
  getStoredMealOverrides,
  getStoredWeights
} from '../../data/mealStore';
import { type Payment, type PaymentMethod } from '../../types/mealTypes';
import { computeMonthlyReport, getTodayInDhaka } from '../../lib/mealReportingEngine';
import toast from 'react-hot-toast';

export const MealPaymentsPage: React.FC = () => {
  const { language } = useLanguage();
  const today = getTodayInDhaka();

  const [selectedMonth, setSelectedMonth] = useState<string>(today.monthKey);
  const [paymentsList, setPaymentsList] = useState<Payment[]>(() => getStoredPayments());
  const members = useMemo(() => getStoredMealMembers(), []);

  // Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memberId, setMemberId] = useState(members[0]?.id || 'member_0');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('BKASH');
  const [trxId, setTrxId] = useState('');
  const [date, setDate] = useState(today.dateStr);
  const [note, setNote] = useState('');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    saveStoredPayments(paymentsList);
  }, [paymentsList]);

  // Compute live report to display devotee current passbook balances
  const report = useMemo(() => {
    const bazar = getStoredBazar();
    const overrides = getStoredMealOverrides();
    const weights = getStoredWeights();
    return computeMonthlyReport(selectedMonth, members, bazar, paymentsList, overrides, [], weights);
  }, [selectedMonth, members, paymentsList]);

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return paymentsList.filter(p => {
      const matchMonth = p.month === selectedMonth;
      const member = members.find(m => m.id === p.memberId);
      const memberName = member ? member.name.toLowerCase() : '';
      const matchSearch = searchQuery === '' ||
        memberName.includes(searchQuery.toLowerCase()) ||
        (p.trxId && p.trxId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.note && p.note.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchMonth && matchSearch;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [paymentsList, selectedMonth, members, searchQuery]);

  const totalMonthPayments = useMemo(() => {
    return paymentsList
      .filter(p => p.month === selectedMonth)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [paymentsList, selectedMonth]);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid deposit amount');
      return;
    }

    const monthKey = date.slice(0, 7);

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      memberId,
      amount: numAmount,
      date,
      month: monthKey,
      method,
      trxId: trxId.trim() || undefined,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    setPaymentsList(prev => [newPayment, ...prev]);
    setAmount('');
    setTrxId('');
    setNote('');
    setIsAddModalOpen(false);
    toast.success(language === 'bn' ? 'ডিপোজিট জমা সফল হয়েছে!' : 'Payment recorded successfully!');
  };

  const handleDeletePayment = (id: string) => {
    if (!window.confirm('Delete this payment entry?')) return;
    setPaymentsList(prev => prev.filter(p => p.id !== id));
    toast.success('Payment deleted');
  };

  const getMethodBadge = (m: PaymentMethod) => {
    switch (m) {
      case 'BKASH': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-600 border border-pink-500/20">bKash</span>;
      case 'NAGAD': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">Nagad</span>;
      case 'CASH': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Cash</span>;
      case 'BANK': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">Bank</span>;
      default: return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 border border-slate-500/20">Other</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <MealHeader selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

        {/* Top Control Bar with Total Deposits & Add Deposit Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-black">
              <Wallet size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                {language === 'bn' ? `${selectedMonth} এর মোট জমা` : `Total Deposits for ${selectedMonth}`}
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                ৳ {totalMonthPayments.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={language === 'bn' ? 'খুঁজুন (ভক্ত / TrxID)...' : 'Search devotee or TrxID...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 w-44 sm:w-56"
              />
            </div>

            {/* Add Payment Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>{language === 'bn' ? 'নতুন জমা যুক্ত করুন' : 'Add New Deposit'}</span>
            </button>
          </div>

        </div>

        {/* Two Columns: Live Devotee Passbooks + Payment Transaction History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 1 Col: Devotee Passbook Balances */}
          <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 lg:col-span-1">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users size={16} className="text-amber-500" />
                <span>{language === 'bn' ? 'ভক্তদের ব্যালেন্স' : 'Devotees Passbook'}</span>
              </h3>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {report.rows.map((row) => (
                <div 
                  key={row.memberId}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {row.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Deposits: ৳{row.deposits} • {row.meals} meals
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className={`text-xs font-black ${
                      row.finalBalance > 0 ? 'text-emerald-600 dark:text-emerald-400' :
                      row.finalBalance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
                    }`}>
                      {row.finalBalance >= 0 ? `+৳${row.finalBalance.toFixed(0)}` : `-৳${Math.abs(row.finalBalance).toFixed(0)}`}
                    </div>
                    <span className={`text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
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

          {/* Right 2 Cols: Payments Ledger */}
          <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 lg:col-span-2">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <CreditCard size={16} className="text-indigo-500" />
              <span>{language === 'bn' ? 'জমার তালিকা' : 'Payment Transaction Ledger'}</span>
            </h3>

            <div className="space-y-2.5">
              {filteredPayments.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs">
                  No payment deposits recorded for {selectedMonth}.
                </div>
              ) : (
                filteredPayments.map((p) => {
                  const member = members.find(m => m.id === p.memberId);
                  return (
                    <div 
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {member ? member.name : 'Unknown'}
                          </span>
                          {getMethodBadge(p.method)}
                          <span className="text-[10.5px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {p.date}
                          </span>
                        </div>

                        {p.trxId && (
                          <div className="text-[10px] font-mono text-slate-500">
                            TrxID: <span className="font-bold text-slate-700 dark:text-slate-300">{p.trxId}</span>
                          </div>
                        )}

                        {p.note && (
                          <p className="text-[11px] text-slate-400 italic">
                            Note: {p.note}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                          +৳ {p.amount.toLocaleString()}
                        </div>

                        <button
                          onClick={() => handleDeletePayment(p.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Delete Payment"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Add Payment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard size={18} className="text-indigo-500" />
                <span>{language === 'bn' ? 'নতুন জমা যুক্ত করুন' : 'Record Deposit Payment'}</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-3.5">
              
              {/* Member */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Devotee (ভক্তের নাম) *
                </label>
                <select
                  value={memberId}
                  onChange={e => setMemberId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.phone || 'Active'})</option>
                  ))}
                </select>
              </div>

              {/* Amount & Method */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Amount (৳) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="e.g. 2000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-black font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={method}
                    onChange={e => setMethod(e.target.value as PaymentMethod)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    <option value="BKASH">bKash (বিকাশ)</option>
                    <option value="NAGAD">Nagad (নগদ)</option>
                    <option value="CASH">Cash (ক্যাশ)</option>
                    <option value="BANK">Bank Transfer (ব্যাংক)</option>
                    <option value="OTHER">Other (অন্যান্য)</option>
                  </select>
                </div>
              </div>

              {/* TrxID & Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    TrxID (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BKS9812..."
                    value={trxId}
                    onChange={e => setTrxId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notes (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="e.g. August Advance meal deposit"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer"
                >
                  Save Deposit
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MealPaymentsPage;
