import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { localDb } from '../../utils/localDb';
import type { Member } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MemberEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<Member>>({
    fullName: '',
    phone: '',
    dob: '',
    isActive: true,
  });

  useEffect(() => {
    async function fetchMember() {
      if (isNew) return;
      try {
        const member = await localDb.getMember(id!);
        if (member) {
          setFormData(member);
        } else {
          setError('Member not found');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching member details');
      } finally {
        setLoading(false);
      }
    }
    fetchMember();
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isNew) {
        const members = await localDb.getMembers();
        const maxCycleOrder = members.length > 0 ? Math.max(...members.map(m => m.cycleOrder)) : -1;
        const newId = `manual_${Date.now()}`;
        
        await localDb.saveMember({
          id: newId,
          fullName: formData.fullName || '',
          phone: formData.phone || '',
          dob: formData.dob || '',
          isActive: formData.isActive !== false,
          cycleOrder: maxCycleOrder + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        const member = await localDb.getMember(id!);
        if (member) {
          await localDb.saveMember({
            ...member,
            ...formData,
            updatedAt: new Date().toISOString()
          });
        }
      }
      navigate('/manager/members');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save member');
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
        <Link to="/manager/members" className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? t('addMember') : t('editMember')}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')} *</label>
              <input
                type="text"
                required
                value={formData.fullName || ''}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('dob')}</label>
              <input
                type="date"
                value={formData.dob || ''}
                onChange={e => setFormData({...formData, dob: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all outline-none"
              />
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
                Member is Active
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
