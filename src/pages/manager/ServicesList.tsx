import { useEffect, useState } from 'react';
import { localDb } from '../../utils/localDb';
import type { ServiceDefinition } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Edit, PlusCircle, CheckCircle, XCircle, Clock, Copy, Check, Printer, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceCycleHeader } from '../../components/layout/ServiceCycleHeader';
import { exportTableToPdf } from '../../lib/exportTablePdf';
import { triggerHaptic } from '../../utils/haptics';
import toast from 'react-hot-toast';

export default function ServicesList() {
  const { language } = useLanguage();
  const { role } = useAuth();
  const [services, setServices] = useState<ServiceDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedList, setCopiedList] = useState(false);

  const isManagerOrAdmin = role === 'INTERNAL_MANAGER' || role === 'ADMIN';

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

  const handleExportPdf = async () => {
    try {
      setExportingPdf(true);
      toast.loading('Generating PDF...', { id: 'pdf-gen' });
      await exportTableToPdf({
        elementId: 'services-list-table-section',
        filename: 'Advaita-VOICE-Services-List.pdf',
        title: 'Advaita VOICE — 12 Daily Seva Definitions & Slots',
        subtitle: 'University of Chittagong • Ashram Seva Chart'
      });
      toast.success('PDF downloaded successfully!', { id: 'pdf-gen' });
    } catch (err) {
      toast.error('Failed to export PDF', { id: 'pdf-gen' });
    } finally {
      setExportingPdf(false);
    }
  };

  const handleCopyWhatsAppServices = async () => {
    triggerHaptic('selection');
    let text = `🌟 *ADVAITA VOICE — 12 DAILY SEVA DEFINITIONS & SLOTS* 🌟\n`;
    text += `📍 *Ashram:* University of Chittagong\n\n`;
    services.forEach((s) => {
      text += `🟢 *Slot ${s.id}:* ${s.nameEn} / ${s.nameBn}\n`;
      text += `   ⏰ Timing: ${s.timing}\n`;
      if (s.descEn) text += `   📋 Description: ${s.descEn}\n`;
      text += `\n`;
    });
    text += `🙏 *Advaita VOICE Seva Management*`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 2000);
      toast.success(language === 'bn' ? 'সেবাসমূহের তালিকা কপি করা হয়েছে!' : 'Services list copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in space-y-6">
      <ServiceCycleHeader 
        title={language === 'bn' ? '১২টি সেবার তালিকা' : 'Services — Service Cycle'} 
        subtitle={language === 'bn' ? 'দৈনিক সেবার বিবরণ, সময়সূচী, বাংলা ও ইংরেজি নাম' : 'Configure the 12 Daily Seva Slots, Timings & Descriptions'}
      />

      {/* Action and Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
            {language === 'bn' ? `মোট দৈনিক সেবা: ${services.length}টি` : `Configured Daily Seva Slots: ${services.length}`}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Export PDF Button */}
          <button
            onClick={handleExportPdf}
            disabled={exportingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="Download Services List as PDF"
          >
            {exportingPdf ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            <span>{exportingPdf ? 'Exporting...' : (language === 'bn' ? 'পিডিএফ এক্সপোর্ট' : 'Export PDF')}</span>
          </button>

          {/* Copy WhatsApp List */}
          <button
            onClick={handleCopyWhatsAppServices}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
            title="Copy Services List for WhatsApp"
          >
            {copiedList ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedList ? 'Copied!' : (language === 'bn' ? 'সেবা কপি' : 'Copy Seva')}</span>
          </button>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            title="Print Services List"
          >
            <Printer size={14} />
            <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
          </button>

          {/* Add Service (Admin/Manager only) */}
          {isManagerOrAdmin && (
            <Link
              to="/manager/services/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition-all"
            >
              <PlusCircle size={14} />
              <span>{language === 'bn' ? 'নতুন সেবা যুক্ত' : 'Add Service'}</span>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Printable / PDF-able Table Section */}
      <div id="services-list-table-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-1">
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
                  {isManagerOrAdmin && <th className="p-4 text-right">Actions</th>}
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
                    {isManagerOrAdmin && (
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
                    )}
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
