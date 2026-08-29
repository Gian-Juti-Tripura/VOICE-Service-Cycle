import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LogOut, Globe, Menu, X, Sun, Moon, Bell, 
  Sparkles, CheckCircle2, User, Flame
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import NotificationSettingsModal from '../notifications/NotificationSettingsModal';
import { Settings } from 'lucide-react';

export interface NotificationItem {
  id: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  timeEn: string;
  timeBn: string;
  read: boolean;
  type: 'SEVA' | 'EKADASHI' | 'STUDY' | 'ANNOUNCEMENT';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    titleEn: '🌸 Daily Seva Roster Published',
    titleBn: '🌸 আজকের সেবাক্রম প্রকাশিত হয়েছে',
    descEn: 'Please check your seva duty and timing for today in the Service Cycle.',
    descBn: 'সার্ভিস সাইকেলে আজকের সেবা ও সময়সূচি দেখে নিন।',
    timeEn: 'Today, 06:00 AM',
    timeBn: 'আজ, সকাল ৬:০০',
    read: false,
    type: 'SEVA'
  },
  {
    id: 'n2',
    titleEn: '📅 Upcoming Ekadashi Fasting',
    titleBn: '📅 আসন্ন একাদশী ব্রত ও পারণ',
    descEn: 'Annada Ekadashi is approaching. Fasting from grains & beans. Parana timings inside.',
    descBn: 'আসন্ন অন্নদা একাদশী ব্রত। শস্য বর্জন ও পারণ সময়সূচি জেনে নিন।',
    timeEn: 'Yesterday',
    timeBn: 'গতকাল',
    read: false,
    type: 'EKADASHI'
  },
  {
    id: 'n3',
    titleEn: '📖 Study Care Notice (Gian Juti Tripura)',
    titleBn: '📖 স্টাডি কেয়ার বিজ্ঞপ্তি (জ্ঞান জ্যোতি ত্রিপুরা)',
    descEn: 'Semester exam revision circle meeting this Saturday at 8:00 PM.',
    descBn: 'সেমিস্টার পরীক্ষার রিভিশন সার্কেল মিটিং আগামী শনিবার রাত ৮:০০ টায়।',
    timeEn: '2 days ago',
    timeBn: '২ দিন আগে',
    read: true,
    type: 'STUDY'
  }
];

const Navbar: React.FC = () => {
  const { user, logout, role } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const NAV_LINKS = [
    { to: '/', labelEn: 'Hub Home', labelBn: 'হাব হোম' },
    { to: '/syllabus', labelEn: 'Syllabus', labelBn: 'সিলেবাস' },
    { to: '/sadhana', labelEn: 'Sadhana', labelBn: 'সাধনাপত্র' },
    { to: '/service-cycle', labelEn: 'Service Cycle', labelBn: 'সেবাক্রম' },
    { to: '/management', labelEn: 'Advaita Org', labelBn: 'পরিচালনা' },
    { to: '/preaching', labelEn: 'Preachers', labelBn: 'প্রচারক' },
  ];

  const NavLink = ({ to, labelEn, labelBn }: { to: string, labelEn: string, labelBn: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        onClick={() => setMobileMenuOpen(false)}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-r from-primary-600/15 to-amber-600/15 text-primary-700 dark:text-amber-400 shadow-sm border border-primary-500/20' 
            : 'text-slate-600 hover:bg-slate-100/70 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-amber-400'
        }`}
      >
        {language === 'bn' ? labelBn : labelEn}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-sm border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo with Flame Glow */}
        <Link to="/" className="flex items-center gap-2 min-w-0 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-600 via-primary-600 to-rose-500 p-0.5 shadow-md shadow-primary-500/20 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Flame size={18} className="fill-amber-500 text-amber-500 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black text-xs sm:text-base bg-gradient-to-r from-slate-900 via-primary-700 to-amber-600 dark:from-white dark:via-primary-300 dark:to-amber-400 bg-clip-text text-transparent truncate tracking-tight">
              ADVAITA VOICE
            </span>
            <span className="hidden sm:block text-[9px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase -mt-0.5 truncate">
              {language === 'bn' ? 'চট্টগ্রাম বিশ্ববিদ্যালয়' : 'Chittagong University'}
            </span>
          </div>
        </Link>
        
        {/* Nav Items & Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Main Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 mr-2">
            {NAV_LINKS.map(link => (
              <NavLink key={link.to} {...link} />
            ))}
          </div>

          {/* Notification Button */}
          <div className="relative">
            <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-1.5 sm:p-2 rounded-xl bg-slate-100/90 hover:bg-slate-200 text-slate-600 hover:text-primary-600 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:text-amber-400 transition-all border border-slate-200/60 dark:border-slate-700/60"
              title="Notifications"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-[8px] font-black text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel (Responsive & Centered on Mobile) */}
            {notifOpen && (
              <>
                {/* Backdrop Overlay for Dismissal */}
                <div 
                  className="fixed inset-0 z-40 bg-black/20 sm:bg-transparent backdrop-blur-2xs sm:backdrop-blur-none" 
                  onClick={() => setNotifOpen(false)} 
                />

                <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-full mt-1 sm:mt-2 w-auto sm:w-88 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl z-50 p-3.5 animate-scale-in">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                        {language === 'bn' ? 'বিজ্ঞপ্তি ও অ্যালার্ট' : 'Notifications & Alerts'}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setNotifOpen(false);
                          setSettingsOpen(true);
                        }}
                        title="Notification Settings"
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors"
                      >
                        <Settings size={13} />
                      </button>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead} 
                          className="text-[10px] font-bold text-amber-600 hover:underline dark:text-amber-400"
                        >
                          {language === 'bn' ? 'পঠিত চিহ্নিত করুন' : 'Mark read'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-2.5 space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-xl border text-xs transition-all ${
                          n.read 
                            ? 'bg-slate-50/50 border-slate-100 dark:bg-slate-800/30 dark:border-slate-800/60 text-slate-500' 
                            : 'bg-primary-50/40 border-primary-200/60 dark:bg-primary-950/40 dark:border-primary-900/60 text-slate-800 dark:text-slate-200 font-medium'
                        }`}
                      >
                        <div className="font-bold mb-0.5 text-slate-900 dark:text-white flex items-center justify-between">
                          <span>{language === 'bn' ? n.titleBn : n.titleEn}</span>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0"></span>}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed mb-1 font-normal">
                          {language === 'bn' ? n.descBn : n.descEn}
                        </p>
                        <span className="text-[9px] text-slate-400 font-semibold">
                          {language === 'bn' ? n.timeBn : n.timeEn}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Language Switch Trigger */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/60 dark:bg-slate-800/90 dark:border-slate-700/60 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-amber-400 transition-all"
            title="Toggle Language"
          >
            <Globe size={13} className="text-primary-500 dark:text-amber-400" />
            <span className={language === 'bn' ? 'font-black text-primary-600 dark:text-amber-400' : ''}>BN</span>
            <span className="text-slate-300 dark:text-slate-600 text-[10px]">|</span>
            <span className={language === 'en' ? 'font-black text-primary-600 dark:text-amber-400' : ''}>EN</span>
          </button>

          {/* Theme Switch Trigger */}
          <button 
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100/90 border border-slate-200/60 dark:bg-slate-800/90 dark:border-slate-700/60 text-slate-600 hover:text-amber-500 dark:text-amber-400 transition-all group"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Moon size={15} className="group-hover:rotate-45 transition-transform" />
            ) : (
              <Sun size={15} className="group-hover:rotate-90 transition-transform" />
            )}
          </button>

          {/* User Auth Action Pill (Desktop) */}
          {user ? (
            <div className="hidden sm:flex items-center gap-1">
              <Link 
                to="/member" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              >
                <CheckCircle2 size={13} />
                <span>{role === 'ADMIN' ? 'Admin' : role === 'INTERNAL_MANAGER' ? 'Manager' : 'Devotee'}</span>
              </Link>

              <button 
                onClick={logout}
                className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-amber-600 text-white text-xs font-black shadow-sm hover:opacity-95 transition-all"
            >
              <User size={13} />
              <span>{language === 'bn' ? 'লগইন' : 'Login'}</span>
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            className="lg:hidden p-1.5 text-slate-600 hover:text-primary-600 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 shadow-2xl px-4 py-3 space-y-1 animate-slide-down">
          {NAV_LINKS.map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {language === 'bn' ? link.labelBn : link.labelEn}
            </Link>
          ))}

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {user ? (
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {role === 'ADMIN' ? 'Admin' : role === 'INTERNAL_MANAGER' ? 'Manager' : 'Devotee'} Logged In
                </span>
                <button 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:underline"
                >
                  <LogOut size={13} />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-xl bg-primary-600 text-white font-bold text-xs"
              >
                {language === 'bn' ? 'ভক্ত লগইন করুন' : 'Devotee Login'}
              </Link>
            )}
          </div>
        </div>
      )}
      <NotificationSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </nav>
  );
};

export default Navbar;
