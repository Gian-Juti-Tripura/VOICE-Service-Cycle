import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, Users, Briefcase, Shield, UserCheck, ArrowLeft } from 'lucide-react';

export const ServiceCycleHeader: React.FC<{ title?: string; subtitle?: string }> = ({ 
  title, 
  subtitle 
}) => {
  const { role } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();

  const isManagerOrAdmin = role === 'INTERNAL_MANAGER' || role === 'ADMIN';
  const isAdmin = role === 'ADMIN';

  const NAV_ITEMS = [
    {
      to: '/service-cycle',
      labelEn: 'My Duties',
      labelBn: 'আমার সেবা',
      icon: UserCheck,
      show: true,
    },
    {
      to: '/manager',
      labelEn: 'Daily Roster',
      labelBn: 'দৈনিক রোস্টার',
      icon: Calendar,
      show: true,
    },
    {
      to: '/manager/members',
      labelEn: 'Devotees',
      labelBn: 'ভক্তবৃন্দ',
      icon: Users,
      show: true,
    },
    {
      to: '/manager/services',
      labelEn: 'Services',
      labelBn: 'সেবাসমূহ',
      icon: Briefcase,
      show: true,
    },
    {
      to: '/manager/settings',
      labelEn: 'Admin Settings',
      labelBn: 'অ্যাডমিন সেটিংস',
      icon: Shield,
      show: isAdmin,
    },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/40 shadow-xs hover:shadow-sm transition-all group shrink-0"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-amber-600 dark:text-amber-400" />
          <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
        </Link>
        <span className="text-[11px] font-black tracking-widest uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          {role === 'ADMIN' ? 'Admin Portal' : role === 'INTERNAL_MANAGER' ? 'Manager Portal' : 'Seva Portal'}
        </span>
      </div>

      {/* Title Header if provided */}
      {title && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pt-1 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs (Available for all members) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 p-1.5 bg-slate-100/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        {NAV_ITEMS.filter(item => item.show).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || 
            (item.to === '/manager/members' && (location.pathname.startsWith('/manager/members') || location.pathname.startsWith('/members'))) ||
            (item.to === '/manager/services' && (location.pathname.startsWith('/manager/services') || location.pathname.startsWith('/services')));

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-500/20 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-amber-600 dark:text-amber-400' : 'opacity-70'} />
              <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCycleHeader;
