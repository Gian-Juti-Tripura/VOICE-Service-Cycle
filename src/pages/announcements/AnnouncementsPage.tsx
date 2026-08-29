import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MANAGER_ANNOUNCEMENTS, type ManagerAnnouncement } from '../../data/announcementsData';
import { 
  Bell, Clock, Share2, ArrowLeft, 
  AlertTriangle, UserCheck, 
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const AnnouncementsPage: React.FC = () => {
  const { language } = useLanguage();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAnnouncements = MANAGER_ANNOUNCEMENTS.filter(item => {
    const matchesRole = selectedRoleFilter === 'ALL' || item.roleKey === selectedRoleFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = item.titleEn.toLowerCase().includes(q) ||
      item.titleBn.toLowerCase().includes(q) ||
      item.descEn.toLowerCase().includes(q) ||
      item.descBn.toLowerCase().includes(q) ||
      item.inchargeNameEn.toLowerCase().includes(q) ||
      item.inchargeNameBn.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const handleShareAnnouncementWhatsApp = (item: ManagerAnnouncement) => {
    const msg = `*📢 আশ্রম নোটিশ — Advaita VOICE*\n` +
      `📌 *ভূমিকা:* ${item.roleTitleBn} (${item.roleTitleEn})\n` +
      `👤 *ইনচার্জ:* ${item.inchargeNameBn}\n` +
      `🔖 *বিষয়:* ${item.titleBn}\n\n` +
      `📝 ${item.descBn}\n\n` +
      `⚠️ *করণীয়:* ${item.actionRequiredBn || item.actionRequiredEn}\n\n` +
      `অদ্বৈত ভয়েস, চট্টগ্রাম বিশ্ববিদ্যালয়। 🙏`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
    toast.success(language === 'bn' ? 'নোটিশ হোয়াটসঅ্যাপে শেয়ার করা হয়েছে' : 'Notice shared to WhatsApp');
  };

  const roles = [
    { key: 'ALL', labelEn: 'All Notices', labelBn: 'সকল নোটিশ' },
    { key: 'COORDINATOR', labelEn: 'Coordinator', labelBn: 'প্রধান সমন্বয়ক' },
    { key: 'INTERNAL_MGR', labelEn: 'Internal Manager', labelBn: 'অভ্যন্তরীণ ব্যবস্থাপক' },
    { key: 'MORNING_PROG', labelEn: 'Morning Program', labelBn: 'মর্নিং প্রোগ্রাম' },
    { key: 'SECURITY_MGR', labelEn: 'Security Manager', labelBn: 'নিরাপত্তা ব্যবস্থাপক' },
    { key: 'STUDY_CARE', labelEn: 'Study Care', labelBn: 'স্টাডি কেয়ার' },
    { key: 'KITCHEN_MGR', labelEn: 'Kitchen Incharge', labelBn: 'রান্না ও প্রসাদম' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 shadow-xs hover:shadow-md transition-all duration-200 group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-rose-600 dark:text-rose-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900">
              {language === 'bn' ? 'আশ্রম নোটিশ ও ব্যবস্থাপনা পোর্টাল' : 'Ashram Management Notice Board'}
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 text-white shadow-xl">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md inline-flex items-center gap-1.5">
                <Bell size={13} />
                <span>অফিসিয়াল ইনচার্জ ও ব্যবস্থাপনা নোটিশ</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold uppercase">
                Active Directives
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'ব্যবস্থাপক ও ইনচার্জ নোটিশ বোর্ড' : 'Managers & Operational Incharge Notice Board'}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'অভ্যন্তরীণ ব্যবস্থাপক, নিরাপত্তা ব্যবস্থাপক, প্রধান সমন্বয়ক, মর্নিং প্রোগ্রাম ইনচার্জ, স্টাডি কেয়ার ও রান্নাঘরের দৈনন্দিন নিয়ম ও নোটিশসমূহ।'
                : 'Directives and daily standard operating procedures for Internal Manager, Security, Morning Program, Study Care, and Coordinators.'}
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'নোটিশ, ইনচার্জের নাম বা বিষয় দিয়ে খুঁজুন...' : 'Search notices by title, incharge name, role or keyword...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            {roles.map(r => (
              <button
                key={r.key}
                onClick={() => setSelectedRoleFilter(r.key)}
                className={`px-3.5 py-2 rounded-xl border transition-all shrink-0 cursor-pointer ${
                  selectedRoleFilter === r.key
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-102'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <span>{language === 'bn' ? r.labelBn : r.labelEn}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              {filteredAnnouncements.length} {language === 'bn' ? 'টি নোটিশ পাওয়া গেছে' : 'Notices Available'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-rose-500/50 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-mono">
                      {language === 'bn' ? item.roleTitleBn : item.roleTitleEn}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors leading-snug">
                    {language === 'bn' ? item.titleBn : item.titleEn}
                  </h3>

                  <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <UserCheck size={13} />
                    <span>{language === 'bn' ? item.inchargeNameBn : item.inchargeNameEn}</span>
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'bn' ? item.descBn : item.descEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle size={13} className="shrink-0" />
                    <span>{language === 'bn' ? item.actionRequiredBn : item.actionRequiredEn}</span>
                  </div>

                  <button
                    onClick={() => handleShareAnnouncementWhatsApp(item)}
                    title="Share Notice to WhatsApp"
                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-all cursor-pointer shrink-0"
                  >
                    <Share2 size={14} />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AnnouncementsPage;
