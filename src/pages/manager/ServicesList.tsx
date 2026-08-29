import { useEffect, useState } from 'react';
import { localDb } from '../../utils/localDb';
import type { ServiceDefinition } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Edit, PlusCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceCycleHeader } from '../../components/layout/ServiceCycleHeader';

export default function ServicesList() {
  const { language } = useLanguage();
  const [services, setServices] = useState<ServiceDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const servicesList = await localDb.getServices();
        servicesList.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        setServices(servicesList);
      } catch (err: any) {
        console.error('Error fetching services:', err);
        setError(err.message || "Failed to load services.");
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <ServiceCycleHeader 
        title={language === 'bn' ? '১২টি সেবার তালিকা' : 'Services — Service Cycle'} 
        subtitle={language === 'bn' ? 'দৈনিক সেবার বিবরণ, সময়সূচী, বাংলা ও ইংরেজি নাম ব্যবস্থাপনা' : 'Configure the 12 Daily Seva Slots, Timings & Descriptions'}
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {language === 'bn' ? `মোট সেবা: ${services.length}` : `Configured Services: ${services.length}`}
          </span>
        </div>
        <Link
          to="/manager/services/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <PlusCircle size={16} />
          <span>{language === 'bn' ? 'নতুন সেবা যুক্ত করুন' : 'Add Service'}</span>
        </Link>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="animate-pulse p-6 space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded w-full"></div>
            <div className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded w-full"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">No services found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4">Slot</th>
                  <th className="p-4">Service Name (EN / BN)</th>
                  <th className="p-4">Timing</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {services.map(service => (
                  <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="p-4">
                      <span className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/20">
                        {service.id}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {service.nameEn}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bengali mt-0.5">
                          {service.nameBn}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        <Clock size={12} className="text-amber-500" />
                        {service.timing}
                      </span>
                    </td>
                    <td className="p-4">
                      {service.isActive !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle size={13} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <XCircle size={13} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/manager/services/${service.id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-xl transition-all"
                        title="Edit Service Details"
                      >
                        <Edit size={14} className="mr-1" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
