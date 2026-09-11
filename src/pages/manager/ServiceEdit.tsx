import { ServiceCycleHeader } from '../../components/layout/ServiceCycleHeader';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { localDb } from '../../utils/localDb';
import type { ServiceDefinition } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Save, Loader2, Trash2, ShieldAlert } from 'lucide-react';
import { DIFFICULTY_LABELS } from '../../utils/emergencyCycleEngine';

type DifficultyLevel = 'LIGHT' | 'LIGHT_MEDIUM' | 'MEDIUM' | 'MEDIUM_HIGH' | 'HEAVY';

const DIFFICULTY_OPTIONS: {
  value: DifficultyLevel;
  emoji: string;
  bg: string;
  border: string;
  text: string;
  ring: string;
}[] = [
  { value: 'LIGHT',        emoji: '🟢', bg: 'bg-teal-50 dark:bg-teal-900/20',       border: 'border-teal-400 dark:border-teal-600',    text: 'text-teal-700 dark:text-teal-300',    ring: 'ring-teal-400' },
  { value: 'LIGHT_MEDIUM', emoji: '🟡', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-400 dark:border-emerald-600', text: 'text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-400' },
  { value: 'MEDIUM',       emoji: '🔵', bg: 'bg-blue-50 dark:bg-blue-900/20',       border: 'border-blue-400 dark:border-blue-600',    text: 'text-blue-700 dark:text-blue-300',    ring: 'ring-blue-400' },
  { value: 'MEDIUM_HIGH',  emoji: '🟠', bg: 'bg-amber-50 dark:bg-amber-900/20',     border: 'border-amber-400 dark:border-amber-600',  text: 'text-amber-700 dark:text-amber-300',  ring: 'ring-amber-400' },
  { value: 'HEAVY',        emoji: '🔴', bg: 'bg-rose-50 dark:bg-rose-900/20',       border: 'border-rose-400 dark:border-rose-600',    text: 'text-rose-700 dark:text-rose-300',    ring: 'ring-rose-400' },
];

export default function ServiceEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { role } = useAuth();
  const isNew = id === 'new';
  const isManagerOrAdmin = role === 'INTERNAL_MANAGER' || role === 'ADMIN';
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<ServiceDefinition>>({
    id: '',
    nameBn: '',
    nameEn: '',
    descBn: '',
    descEn: '',
    timing: '',
    isActive: true,
    difficulty: undefined,
    weight: undefined,
  });

  useEffect(() => {
    async function fetchService() {
      if (isNew) return;
      try {
        const service = await localDb.getService(id!);
        if (service) {
          setFormData(service);
        } else {
          setError('Service not found');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching service details');
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [id, isNew]);

  const handleDifficultySelect = (level: DifficultyLevel) => {
    const defaultWeight = DIFFICULTY_LABELS[level]?.defaultWeight ?? 2.0;
    setFormData(prev => ({ ...prev, difficulty: level, weight: defaultWeight }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) {
      setError('Service ID/Number is required');
      return;
    }

    // Difficulty rank is mandatory for managers/admins (required for Emergency Chart)
    if (isManagerOrAdmin && !formData.difficulty) {
      setError(isBn
        ? '⚖️ সেবার কাঠিন্য স্তর (Difficulty Rank) বাধ্যতামূলক — জরুরী সেবা চার্টে সুষম বণ্টনের জন্য প্রয়োজনীয়। অনুগ্রহ করে একটি স্তর নির্বাচন করুন।'
        : '⚖️ Difficulty Rank is required — it is mandatory for fair distribution in the Emergency Roster. Please select a level before saving.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await localDb.saveService({
        id: formData.id!,
        nameBn: formData.nameBn || '',
        nameEn: formData.nameEn || '',
        descBn: formData.descBn || '',
        descEn: formData.descEn || '',
        timing: formData.timing || '',
        isActive: formData.isActive !== false,
        difficulty: formData.difficulty,
        weight: formData.weight,
      });
      navigate('/manager/services');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this service? This will also delete its assignment history.')) return;
    setSaving(true);
    setError('');
    try {
      await localDb.deleteService(id!);
      navigate('/manager/services');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete service');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">{t('loading')}</div>;
  }

  const selectedOption = DIFFICULTY_OPTIONS.find(o => o.value === formData.difficulty);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8 animate-fade-in">
      <ServiceCycleHeader
        title={isNew
          ? (isBn ? 'নতুন সেবা যোগ করুন' : 'Add New Service Slot')
          : (isBn ? 'সেবার বিবরণ সম্পাদনা' : 'Edit Service Details')}
        subtitle={isBn
          ? 'সেবা নম্বর, সময়সূচী, কাঠিন্য স্তর, ইংরেজি ও বাংলা নাম কনফিগার করুন'
          : 'Configure service ID, timing, difficulty rank, English & Bengali descriptions'}
      />

      {error && (
        <div className="mb-5 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="space-y-5">

        {/* ── Basic Info Card ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
            {isBn ? '📋 সেবার তথ্য' : '📋 Service Info'}
          </h3>

          <form id="service-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'সেবা নম্বর (১-১২) *' : 'Service Number (1-12) *'}
              </label>
              <input
                type="text"
                required
                disabled={!isNew}
                value={formData.id || ''}
                onChange={e => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all outline-none disabled:opacity-50 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Name (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.nameEn || ''}
                  onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all outline-none text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">নাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={formData.nameBn || ''}
                  onChange={e => setFormData({ ...formData, nameBn: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all outline-none text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'সময় *' : 'Timing *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 6:00 AM"
                value={formData.timing || ''}
                onChange={e => setFormData({ ...formData, timing: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description (English)</label>
                <textarea
                  rows={3}
                  value={formData.descEn || ''}
                  onChange={e => setFormData({ ...formData, descEn: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all outline-none resize-none text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">বিবরণ (বাংলা)</label>
                <textarea
                  rows={3}
                  value={formData.descBn || ''}
                  onChange={e => setFormData({ ...formData, descBn: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all outline-none resize-none text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive !== false}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 text-amber-600 border-slate-300 rounded focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                {isBn ? 'সেবা সক্রিয় (Active)' : 'Service is Active'}
              </label>
            </div>
          </form>
        </div>

        {/* ── Difficulty Rank Card — ADMIN / INTERNAL_MANAGER only ── */}
        {isManagerOrAdmin && (
          <div className={`rounded-2xl shadow-sm border p-6 transition-colors ${
            formData.difficulty
              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                  ⚖️ {isBn ? 'কাঠিন্য স্তর (Difficulty Rank)' : 'Difficulty Rank'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isBn
                    ? 'জরুরী সেবা চার্টে সুষম বণ্টনের জন্য বাধ্যতামূলক'
                    : 'Mandatory for fair distribution in the Emergency Roster'}
                </p>
              </div>
              {!formData.difficulty && (
                <span className="flex items-center gap-1 text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-600 shrink-0">
                  <ShieldAlert size={12} />
                  {isBn ? 'বাধ্যতামূলক' : 'Required'}
                </span>
              )}
            </div>

            {/* 5-option grid selector */}
            <div className="grid grid-cols-5 gap-2">
              {DIFFICULTY_OPTIONS.map(opt => {
                const label = DIFFICULTY_LABELS[opt.value];
                const isSelected = formData.difficulty === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleDifficultySelect(opt.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all cursor-pointer select-none
                      ${isSelected
                        ? `${opt.bg} ${opt.border} ${opt.text} ring-2 ${opt.ring} shadow-md scale-105`
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                  >
                    <span className="text-2xl leading-none">{opt.emoji}</span>
                    <span className="text-[10px] font-black leading-tight text-center line-clamp-2">
                      {isBn ? label.labelBn : label.labelEn}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white/60 dark:bg-black/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                      {label.defaultWeight}pt
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected difficulty + fine-tune weight */}
            {formData.difficulty && (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                    {isBn ? 'নির্বাচিত স্তর' : 'Selected Level'}
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {selectedOption?.emoji}{' '}
                    {isBn ? DIFFICULTY_LABELS[formData.difficulty]?.labelBn : DIFFICULTY_LABELS[formData.difficulty]?.labelEn}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {isBn ? 'ওজন (pt)' : 'Weight (pt)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="5"
                    value={formData.weight ?? ''}
                    onChange={e => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || undefined }))}
                    className="w-20 px-3 py-1.5 text-center text-sm font-black bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Save / Delete ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            form="service-form"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white py-3 px-5 rounded-xl font-black text-sm shadow-sm transition-all disabled:opacity-70"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isBn ? 'সংরক্ষণ করুন' : 'Save Service'}
          </button>

          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 py-3 px-5 rounded-xl font-black text-sm border border-red-200 dark:border-red-800 transition-all disabled:opacity-70"
            >
              <Trash2 size={18} />
              {isBn ? 'মুছে ফেলুন' : 'Delete Service'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
