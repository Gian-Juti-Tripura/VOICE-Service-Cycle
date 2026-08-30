import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Utensils, HeartHandshake, RefreshCw, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';

export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const navItems = [
    {
      id: 'home',
      label: isBn ? 'হোম' : 'Home',
      icon: Home,
      path: '/',
      activeMatch: (pathname: string) => pathname === '/'
    },
    {
      id: 'meals',
      label: isBn ? 'মিল' : 'Meals',
      icon: Utensils,
      path: '/meals',
      activeMatch: (pathname: string) => pathname.startsWith('/meals')
    },
    {
      id: 'sadhana',
      label: isBn ? 'সাধনা' : 'Sadhana',
      icon: HeartHandshake,
      path: '/sadhana',
      activeMatch: (pathname: string) => pathname === '/sadhana' || pathname === '/counselor'
    },
    {
      id: 'cycle',
      label: isBn ? 'সেবাক্রম' : 'Seva',
      icon: RefreshCw,
      path: '/service-cycle',
      activeMatch: (pathname: string) => pathname.startsWith('/service-cycle') || pathname.startsWith('/manager') || pathname.startsWith('/member')
    },
    {
      id: 'profiles',
      label: isBn ? 'প্রোফাইল' : 'Profiles',
      icon: Users,
      path: '/profiles',
      activeMatch: (pathname: string) => pathname === '/profiles'
    }
  ];

  const handleNav = (path: string) => {
    triggerHaptic('selection');
    navigate(path);
  };

  return (
    <nav 
      aria-label="Bottom Navigation"
      className="block md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200/90 dark:border-slate-800/80 backdrop-blur-xl px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 pb-safe"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.activeMatch(location.pathname);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.path)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'text-amber-600 dark:text-amber-400 font-black' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active Pill Indicator */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              )}

              <div className={`p-1 rounded-xl transition-all ${
                isActive 
                  ? 'bg-amber-500/10 dark:bg-amber-400/15 scale-110' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}>
                <Icon size={19} className={isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'} />
              </div>

              <span className={`text-[10px] tracking-tight transition-all ${
                isActive ? 'text-amber-700 dark:text-amber-300 font-black' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
