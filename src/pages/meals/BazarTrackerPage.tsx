import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MealHeader } from '../../components/meals/MealHeader';
import { 
  ShoppingCart, Plus, Trash2, Search, 
  X
} from 'lucide-react';
import { 
  getStoredBazar, 
  saveStoredBazar, 
  getStoredMealMembers,
  BAZAR_CATEGORIES_INFO
} from '../../data/mealStore';
import { type BazarEntry, type BazarCategory } from '../../types/mealTypes';
import { getTodayInDhaka } from '../../lib/mealReportingEngine';
import toast from 'react-hot-toast';

export const BazarTrackerPage: React.FC = () => {
  const { language } = useLanguage();
  const today = getTodayInDhaka();

  const [selectedMonth, setSelectedMonth] = useState<string>(today.monthKey);
  const [bazarList, setBazarList] = useState<BazarEntry[]>(() => getStoredBazar());
  const members = useMemo(() => getStoredMealMembers(), []);

  // Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [buyer, setBuyer] = useState(members[0]?.name || 'Utpol P.');
  const [category, setCategory] = useState<BazarCategory>('VEGETABLES');
  const [items, setItems] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today.dateStr);
  const [notes, setNotes] = useState('');

  // Search & Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<BazarCategory | 'ALL'>('ALL');

  useEffect(() => {
    saveStoredBazar(bazarList);
  }, [bazarList]);

  // Filtered bazar list
  const filteredBazar = useMemo(() => {
    return bazarList.filter(entry => {
      const matchMonth = entry.month === selectedMonth;
      const matchCategory = filterCategory === 'ALL' || entry.category === filterCategory;
      const matchSearch = searchQuery === '' || 
        entry.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.items.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMonth && matchCategory && matchSearch;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [bazarList, selectedMonth, filterCategory, searchQuery]);

  const totalMonthBazar = useMemo(() => {
    return bazarList
      .filter(b => b.month === selectedMonth)
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  }, [bazarList, selectedMonth]);

  const handleAddBazar = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!items.trim()) {
      toast.error('Please enter items description');
      return;
    }

    const monthKey = date.slice(0, 7);

    const newEntry: BazarEntry = {
      id: `bz_${Date.now()}`,
      date,
      month: monthKey,
      buyer: buyer.trim(),
      category,
      items: items.trim(),
      amount: numAmount,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    setBazarList(prev => [newEntry, ...prev]);
    setItems('');
    setAmount('');
    setNotes('');
    setIsAddModalOpen(false);
    toast.success(language === 'bn' ? 'বাজার খরচ সংরক্ষিত হয়েছে!' : 'Bazar entry recorded!');
  };

  const handleDeleteBazar = (id: string) => {
    if (!window.confirm('Delete this bazar entry?')) return;
    setBazarList(prev => prev.filter(b => b.id !== id));
    toast.success('Deleted entry');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <MealHeader selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

        {/* Top Control Bar with Search, Total & Add Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-black">
              <ShoppingCart size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                {language === 'bn' ? `${selectedMonth} এর মোট বাজার` : `Total Bazar for ${selectedMonth}`}
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                ৳ {totalMonthBazar.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={language === 'bn' ? 'খুঁজুন (আইটেম / ক্রেতা)...' : 'Search items or buyer...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 w-44 sm:w-56"
              />
            </div>

            {/* Add Bazar Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>{language === 'bn' ? 'বাজার খরচ যুক্ত করুন' : 'Add Bazar Entry'}</span>
            </button>
          </div>

        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterCategory === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            All Categories ({bazarList.filter(b => b.month === selectedMonth).length})
          </button>

          {(Object.keys(BAZAR_CATEGORIES_INFO) as BazarCategory[]).map(catKey => {
            const info = BAZAR_CATEGORIES_INFO[catKey];
            const isCatActive = filterCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setFilterCategory(catKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isCatActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span>{language === 'bn' ? info.labelBn : info.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Bazar Entries List */}
        <div className="space-y-3">
          {filteredBazar.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <ShoppingCart size={32} className="mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-xs">No bazar entries match the selected filters.</p>
            </div>
          ) : (
            filteredBazar.map((item) => {
              const catInfo = BAZAR_CATEGORIES_INFO[item.category] || BAZAR_CATEGORIES_INFO.OTHER;

              return (
                <div 
                  key={item.id}
                  className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                        {item.buyer}
                      </span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${catInfo.color}`}>
                        {language === 'bn' ? catInfo.labelBn : catInfo.labelEn}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {item.date}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      {item.items}
                    </p>

                    {item.notes && (
                      <p className="text-[11px] text-slate-400 italic">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono">
                      ৳ {item.amount.toLocaleString()}
                    </div>

                    <button
                      onClick={() => handleDeleteBazar(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Add Bazar Entry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingCart size={18} className="text-rose-500" />
                <span>{language === 'bn' ? 'বাজার খরচ যুক্ত করুন' : 'Add Bazar Entry'}</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddBazar} className="space-y-3.5">
              
              {/* Buyer & Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Buyer (ক্রেতা) *
                  </label>
                  <select
                    value={buyer}
                    onChange={e => setBuyer(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
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

              {/* Category & Amount */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as BazarCategory)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    {(Object.keys(BAZAR_CATEGORIES_INFO) as BazarCategory[]).map(cat => (
                      <option key={cat} value={cat}>{BAZAR_CATEGORIES_INFO[cat].labelEn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Amount (৳) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="e.g. 750"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-black font-mono"
                  />
                </div>
              </div>

              {/* Items description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Items Purchased (আইটেমের বিবরণ) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Alu 5kg, Potol 2kg, Begun 1kg, Tomato 1kg"
                  value={items}
                  onChange={e => setItems(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notes (ঐচ্ছিক মন্তব্য)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid from cash in hand"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
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
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-500 shadow-md cursor-pointer"
                >
                  Save Bazar Entry
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BazarTrackerPage;
