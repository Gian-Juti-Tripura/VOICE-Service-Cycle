import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Utensils, HeartHandshake, ShieldCheck, RefreshCw, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';
import { getThemeSettings, THEME_UPDATED_EVENT, type ThemeSettingsState } from '../../utils/themeSettings';

export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [, setThemeSettings] = useState<ThemeSettingsState>(() => getThemeSettings());

  useEffect(() => {
    const handleThemeUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeSettingsState>;
      if (customEvent.detail) {
        setThemeSettings(customEvent.detail);
      }
    };
    window.addEventListener(THEME_UPDATED_EVENT, handleThemeUpdate);
    return () => window.removeEventListener(THEME_UPDATED_EVENT, handleThemeUpdate);
  }, []);

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
      id: 'discipline',
      label: isBn ? 'শৃঙ্খলা' : 'Discipline',
      icon: ShieldCheck,
      path: '/discipline-audit',
      activeMatch: (pathname: string) => pathname.startsWith('/discipline')
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
      style={{
        backgroundColor: 'var(--advaita-nav-bg)',
        borderColor: 'var(--advaita-nav-border)'
      }}
      className="block md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-1 py-1 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_-10px_35px_rgba(0,0,0,0.6)] transition-colors duration-500 pb-safe"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = item.activeMatch(location.pathname);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.path)}
              className={`relative flex flex-col items-center justify-center py-0.5 px-0.5 rounded-xl transition-all duration-200 cursor-pointer flex-1 min-w-0 ${
                isActive 
                  ? 'font-black' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active Theme Pill Indicator */}
              {isActive && (
                <span 
                  style={{
                    backgroundColor: 'var(--advaita-primary)',
                    boxShadow: '0 0 8px var(--advaita-glow)'
                  }}
                  className="absolute -top-1 w-6 h-0.5 rounded-full transition-colors duration-500" 
                />
              )}

              <div 
                style={{
                  backgroundColor: isActive ? 'var(--advaita-badge-bg)' : undefined
                }}
                className={`p-1 rounded-lg transition-all ${
                  isActive 
                    ? 'scale-105 shadow-2xs' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon 
                  size={18} 
                  style={{ color: isActive ? 'var(--advaita-nav-active-text)' : undefined }}
                  className={!isActive ? 'text-slate-500 dark:text-slate-400' : ''} 
                />
              </div>

              <span 
                style={{ color: isActive ? 'var(--advaita-nav-active-text)' : undefined }}
                className={`text-[9.5px] tracking-tight transition-all leading-tight truncate max-w-[56px] mt-0.5 ${
                  isActive ? 'font-black' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
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
