import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

export interface FeatureCardProps {
  id: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  categoryEn: string;
  categoryBn: string;
  icon: any;
  link: string;
  colorScheme: {
    bgLight: string;
    bgDark: string;
    borderLight: string;
    borderDark: string;
    iconBg: string;
    iconText: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
  };
  badgeEn?: string;
  badgeBn?: string;
  statEn?: string;
  statBn?: string;
  isMemberOnly?: boolean;
  isLoggedIn?: boolean;
  onLockedClick?: () => void;
  lang?: 'en' | 'bn';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  titleEn,
  titleBn,
  descEn,
  descBn,
  icon: Icon,
  link,
  colorScheme,
  badgeEn,
  badgeBn,
  isMemberOnly = false,
  isLoggedIn = false,
  onLockedClick,
  lang = 'en'
}) => {
  const isLocked = isMemberOnly && !isLoggedIn;
  const badgeText = lang === 'bn' ? (badgeBn || badgeEn) : badgeEn;

  const CardContent = (
    <div 
      className={`group relative flex flex-col justify-between h-full rounded-2xl p-2.5 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg border ${
        isLocked
          ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      {/* Top Accent Line */}
      <div className={`absolute top-0 left-3 right-3 h-[2px] rounded-b-full ${colorScheme.iconBg}`} />

      <div className="space-y-1 sm:space-y-1.5">
        {/* Top Header Row: Icon + Badges */}
        <div className="flex items-center justify-between gap-1 mb-1.5 pt-0.5">
          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center ${colorScheme.iconBg} ${colorScheme.iconText} shadow-xs group-hover:scale-105 transition-transform shrink-0`}>
            <Icon size={15} />
          </div>

          <div className="flex items-center gap-1 flex-wrap justify-end">
            {badgeText && (
              <span className={`text-[8px] xs:text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${colorScheme.badgeBg} ${colorScheme.badgeText} truncate max-w-[85px] sm:max-w-none`}>
                {badgeText}
              </span>
            )}
            {isMemberOnly && (
              <span className="flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                <Lock size={8} />
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[11px] xs:text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-primary-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
          {lang === 'bn' ? (titleBn || titleEn) : titleEn}
        </h3>

        {/* Description */}
        <p className="text-[9.5px] xs:text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight font-normal">
          {lang === 'bn' ? (descBn || descEn) : descEn}
        </p>
      </div>

      {/* Footer Link / Button */}
      <div className="pt-1.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[9.5px] xs:text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
          {isLocked 
            ? (lang === 'bn' ? 'লগইন' : 'Locked') 
            : (lang === 'bn' ? 'প্রবেশ' : 'Open')}
        </span>

        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center transition-all ${
          isLocked
            ? 'bg-slate-100 text-slate-400 dark:bg-slate-800'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-primary-600 group-hover:text-white'
        }`}>
          {isLocked ? <Lock size={8} /> : <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />}
        </div>
      </div>
    </div>
  );

  if (isLocked) {
    return (
      <button 
        onClick={onLockedClick}
        className="text-left w-full h-full cursor-pointer focus:outline-none"
      >
        {CardContent}
      </button>
    );
  }

  return (
    <Link 
      to={link}
      className="block w-full h-full no-underline focus:outline-none"
    >
      {CardContent}
    </Link>
  );
};
