import { useEffect, useState } from 'react';
import { localDb } from '../../utils/localDb';
import type { Member } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { UserPlus, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MembersList() {
  const { t } = useLanguage();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const membersList = await localDb.getMembers();
        
        // Sort by cycle order
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

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('membersTitle')}</h1>
        <Link
          to="/manager/members/new"
          className="btn-primary"
        >
          <UserPlus size={20} />
          <span className="hidden sm:inline">{t('addMember')}</span>
        </Link>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          {error}
        </div>
      )}

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="animate-pulse p-4">
            <div className="h-10 bg-slate-200/60 rounded mb-4 w-full"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-slate-100/50 rounded w-full"></div>
              ))}
            </div>
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">{t('noMembers')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-sm font-semibold uppercase tracking-wider border-b border-slate-200/60">
                  <th className="p-5">{t('name')}</th>
                  <th className="p-5">Cycle Order</th>
                  <th className="p-5">{t('status')}</th>
                  <th className="p-5 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5 font-semibold text-slate-900">{member.fullName}</td>
                    <td className="p-5 text-slate-500 font-medium">{member.cycleOrder + 1}</td>
                    <td className="p-5">
                      {member.isActive !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-700 border border-emerald-200">
                          <CheckCircle size={14} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100/80 text-rose-700 border border-rose-200">
                          <XCircle size={14} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <Link
                        to={`/manager/members/${member.id}`}
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-saffron-600 hover:bg-saffron-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Edit size={18} />
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
