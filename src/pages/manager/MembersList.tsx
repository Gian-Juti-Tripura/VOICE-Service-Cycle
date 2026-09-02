import { useEffect, useState } from 'react';
import { localDb } from '../../utils/localDb';
import type { Member } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Edit, CheckCircle, XCircle, Copy, Check, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceCycleHeader } from '../../components/layout/ServiceCycleHeader';
import { ExportPdfButton } from '../../components/meals/ExportPdfButton';
import { triggerHaptic } from '../../utils/haptics';
import toast from 'react-hot-toast';

export default function MembersList() {
  const { t, language } = useLanguage();
  const { role } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedList, setCopiedList] = useState(false);

  const isManagerOrAdmin = role === 'INTERNAL_MANAGER' || role === 'ADMIN';

  useEffect(() => {
    async function fetchMembers() {
      try {
        const membersList = await localDb.getMembers();
        membersList.sort((a, b) => a.cycleOrder - b.cycleOrder);
        setMembers(membersList);
      } catch (err: any) {
        console.error('Error fetching members:', err);
        setError(err.message || "Failed to load members.");
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  const handleCopyWhatsAppList = async () => {
    triggerHaptic('selection');
    let text = `🌟 *ADVAITA VOICE — 12 ACTIVE RESIDENT DEVOTEES* 🌟\n`;
    text += `📍 *Ashram:* University of Chittagong\n\n`;
    members.forEach((m, idx) => {
      text += `${idx + 1}. *${m.fullName}* (Day ${m.cycleOrder + 1})\n`;
      if (m.phone) text += `   📞 ${m.phone}\n`;
      text += `   🟢 Status: ${m.isActive !== false ? 'Active' : 'Inactive'}\n\n`;
    });
    text += `🙏 *Advaita VOICE Seva Management*`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 2000);
      toast.success(language === 'bn' ? 'ভক্তবৃন্দের তালিকা কপি করা হয়েছে!' : 'Devotees list copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in space-y-6">
      <ServiceCycleHeader 
        title={language === 'bn' ? 'সেবাক্রমের ভক্তবৃন্দ' : 'Devotees — Service Cycle'} 
        subtitle={language === 'bn' ? '১২ জনের সেবাক্রম তালিকা, রোটেশন ক্রম ও সদস্য প্রোফাইল' : '12-Day Rotation Devotee Roster, Sequence & Member Profiles'}
      />

      {/* Action and Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
            {language === 'bn' ? `মোট সেবক ভক্ত: ${members.length} জন` : `Active Devotees in Cycle: ${members.length}`}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Export PDF Button */}
          <ExportPdfButton
            elementId="devotees-list-table-section"
            meta={{
              title: 'Advaita VOICE — 12 Active Resident Devotees Roster',
              subtitle: 'University of Chittagong • Ashram Seva Rotation Chart',
              generatedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            }}
            label={language === 'bn' ? 'পিডিএফ এক্সপোর্ট' : 'Export PDF'}
          />

          {/* Copy WhatsApp List */}
          <button
            onClick={handleCopyWhatsAppList}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
            title="Copy Devotees List for WhatsApp"
          >
            {copiedList ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedList ? 'Copied!' : (language === 'bn' ? 'তালিকা কপি' : 'Copy List')}</span>
          </button>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            title="Print Devotees List"
          >
            <Printer size={14} />
            <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
          </button>

          {/* Add Devotee (Admin/Manager only) */}
          {isManagerOrAdmin && (
            <Link
              to="/manager/members/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition-all"
            >
              <UserPlus size={14} />
              <span>{language === 'bn' ? 'নতুন ভক্ত যুক্ত' : 'Add Devotee'}</span>
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
      <div id="devotees-list-table-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-1">
        {loading ? (
          <div className="animate-pulse p-6 space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded w-full"></div>
            <div className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded w-full"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">{t('noMembers')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4">#</th>
                  <th className="p-4">Devotee Name</th>
                  <th className="p-4">Cycle Sequence</th>
                  <th className="p-4">Phone / Account Link</th>
                  <th className="p-4">Status</th>
                  {isManagerOrAdmin && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {members.map((member, idx) => (
                  <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="p-4 font-mono text-xs font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {member.fullName}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-xs font-bold">
                      Day {member.cycleOrder + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                          {member.phone || 'No phone'}
                        </span>
                        {member.userId ? (
                          <span className="inline-flex items-center w-max px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            Linked to Account
                          </span>
                        ) : (
                          <span className="inline-flex items-center w-max px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                            Unclaimed Profile
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {member.isActive !== false ? (
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
                          to={`/manager/members/${member.id}`}
                          className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-xl transition-all"
                          title="Edit Devotee Details"
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
