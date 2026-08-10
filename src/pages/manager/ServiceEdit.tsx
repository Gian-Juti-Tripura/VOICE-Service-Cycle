import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { localDb } from '../../utils/localDb';
import type { ServiceDefinition } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isNew = id === 'new';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) {
      setError('Service ID/Number is required');
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
        isActive: formData.isActive !== false
      });
      
      navigate('/manager/services');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">{t('loading')}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/manager/services" className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? t('addService') : t('editService')}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Number (1-12) *</label>
              <input
                type="text"
                required
                disabled={!isNew}
                value={formData.id || ''}
                onChange={e => setFormData({...formData, id: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all outline-none disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.nameEn || ''}
                  onChange={e => setFormData({...formData, nameEn: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (Bengali) *</label>
                <input
                  type="text"
                  required
                  value={formData.nameBn || ''}
                  onChange={e => setFormData({...formData, nameBn: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timing *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mangalarati (4:30 AM)"
                value={formData.timing || ''}
                onChange={e => setFormData({...formData, timing: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                <textarea
                  rows={3}
                  value={formData.descEn || ''}
                  onChange={e => setFormData({...formData, descEn: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Bengali)</label>
                <textarea
                  rows={3}
                  value={formData.descBn || ''}
                  onChange={e => setFormData({...formData, descBn: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all outline-none resize-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive !== false}
                onChange={e => setFormData({...formData, isActive: e.target.checked})}
                className="w-5 h-5 text-saffron-600 border-gray-300 rounded focus:ring-saffron-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                Service is Active
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-saffron-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-saffron-700 transition-colors disabled:opacity-70"
            >
              {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
