import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getStoredNotices, type ManagerAnnouncement } from '../../utils/noticesStore';
import { 
  Sun, Moon, Globe, LogOut, User,
  Flame, Sparkles, Bell, Menu, X, CheckCircle2,
  Settings, ArrowRight, Calendar, Megaphone
} from 'lucide-react';
import { NotificationSettingsModal } from '../notifications/NotificationSettingsModal';

interface DynamicNotification {
  id: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  timeEn: string;
  timeBn: string;
  read: boolean;
  type: 'ANNOUNCEMENT' | 'FESTIVAL' | 'SEVA' | 'EKADASHI';
  priority?: 'HIGH' | 'MEDIUM' | 'NORMAL';
  link: string;
}

const STATIC_FESTIVALS_NOTIFS: DynamicNotification[] = [
  {
    id: 'fest_janmastami',
    titleEn: '🌸 Sri Krishna Janmastami (04 Sep 2026)',
    titleBn: '🌸 শ্রীকৃষ্ণ জন্মাষ্টমী মহোৎসব (৪ সেপ্টেম্বর ২০২৬)',
    descEn: 'Fasting till Midnight 12:00 AM • Mahabhisheka & Divine Feast.',
    descBn: 'মধ্যরাত ১২:০০ পর্যন্ত নির্জলা/সজল উপবাস • রাত ১২টায় অভিষেক ও আনন্দ উৎসব।',
    timeEn: 'Upcoming Festival',
    timeBn: 'আসন্ন মহোৎসব',
    read: false,
    type: 'FESTIVAL',
    priority: 'HIGH',
    link: '/calendar'
  },
  {
    id: 'fest_radhastami',
    titleEn: '🌸 Srimati Radhastami (19 Sep 2026)',
    titleBn: '🌸 শ্রীমতী রাধাষ্টমী শুভ আবির্ভাব (১৯ সেপ্টেম্বর ২০২৬)',
    descEn: 'Fasting till Noon 12:00 PM • Radha Kripa Kataksha & Kirtan.',
    descBn: 'দুপুর ১২:০০ পর্যন্ত উপবাস ও শ্রীরাধা কৃপাকটাক্ষ স্তোত্র পাঠ।',
    timeEn: 'Upcoming Festival',
    timeBn: 'আসন্ন মহোৎসব',
    read: false,
    type: 'FESTIVAL',
    priority: 'HIGH',
    link: '/calendar'
  },
  {
    id: 'seva_daily_alert',
    titleEn: '🌸 Daily Seva Duty Roster Active',
    titleBn: '🌸 আজকের সেবাক্রম ও দায়িত্ব সক্রিয়',
    descEn: 'Please check your seva assignment & reporting time in the Service Cycle.',
    descBn: 'সার্ভিস সাইকেলে আপনার আজকের সেবা ও দায়িত্ব দেখে নিন।',
    timeEn: 'Daily Morning 6:00 AM',
    timeBn: 'প্রতিদিন সকাল ৬:০০',
    read: false,
    type: 'SEVA',
    priority: 'NORMAL',
    link: '/service-cycle'
  }
];

export const Navbar: React.FC = () => {
  const { user, logout, role } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const [readNotifIds, setReadNotifIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('advaita_read_notifs') || '[]');
    } catch {
      return [];
    }
  });

  const [storedNotices, setStoredNotices] = useState<ManagerAnnouncement[]>(() => getStoredNotices());

  // Listen for real-time notice posting events
  useEffect(() => {
    const updateNotices = () => {
      setStoredNotices(getStoredNotices());
    };
    window.addEventListener('advaita_notices_updated', updateNotices);
    return () => window.removeEventListener('advaita_notices_updated', updateNotices);
  }, []);

  // Build combined live notifications (Posted notices at top, then festivals & seva)
  const notifications: DynamicNotification[] = [
    // 1. All real manager posted notices from localStorage
    ...storedNotices.map(n => ({
      id: n.id,
      titleEn: `📢 ${n.titleEn}`,
      titleBn: `📢 ${n.titleBn}`,
      descEn: `${n.roleTitleEn} (${n.inchargeNameEn}): ${n.descEn}`,
      descBn: `${n.roleTitleBn} (${n.inchargeNameBn}): ${n.descBn}`,
      timeEn: n.date,
      timeBn: n.date,
      read: readNotifIds.includes(n.id),
      type: 'ANNOUNCEMENT' as const,
      priority: n.priority,
      link: '/announcements'
    })),
    // 2. Real upcoming festivals & seva alerts
    ...STATIC_FESTIVALS_NOTIFS.map(f => ({
      ...f,
      read: readNotifIds.includes(f.id)
    }))
  ];

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
    const allIds = notifications.map(n => n.id);
    setReadNotifIds(allIds);
    localStorage.setItem('advaita_read_notifs', JSON.stringify(allIds));
  };

  const handleNotificationClick = (n: DynamicNotification) => {
    if (!readNotifIds.includes(n.id)) {
      const updated = [...readNotifIds, n.id];
      setReadNotifIds(updated);
      localStorage.setItem('advaita_read_notifs', JSON.stringify(updated));
    }
    setNotifOpen(false);
    navigate(n.link);
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
            ? 'bg-gradient-to-r from-rose-600/15 to-amber-600/15 text-rose-700 dark:text-amber-400 shadow-xs border border-rose-500/20' 
            : 'text-slate-600 hover:bg-slate-100/70 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-amber-400'
        }`}
      >
        {language === 'bn' ? labelBn : labelEn}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-xs border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo with Flame Glow */}
        <Link to="/" className="flex items-center gap-2 min-w-0 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-600 via-rose-600 to-rose-700 p-0.5 shadow-md shadow-rose-500/20 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Flame size={18} className="fill-amber-500 text-amber-500 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black text-xs sm:text-base bg-gradient-to-r from-slate-900 via-rose-700 to-amber-600 dark:from-white dark:via-rose-300 dark:to-amber-400 bg-clip-text text-transparent truncate tracking-tight">
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
              className="relative p-1.5 sm:p-2 rounded-xl bg-slate-100/90 hover:bg-slate-200 text-slate-600 hover:text-rose-600 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:text-amber-400 transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
              title="Notifications"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center animate-pulse shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notifOpen && (
              <>
                {/* Backdrop Overlay for Dismissal */}
                <div 
                  className="fixed inset-0 z-40 bg-black/20 sm:bg-transparent backdrop-blur-2xs sm:backdrop-blur-none" 
                  onClick={() => setNotifOpen(false)} 
                />

                <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-full mt-1 sm:mt-2 w-auto sm:w-96 rounded-3xl bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 animate-scale-in max-h-[85vh] flex flex-col">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        {language === 'bn' ? 'বিজ্ঞপ্তি ও অ্যালার্ট' : 'Notifications & Alerts'}
                      </h4>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setNotifOpen(false);
                          setSettingsOpen(true);
                        }}
                        title="Notification Settings"
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                      >
                        <Settings size={13} />
                      </button>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead} 
                          className="text-[10px] font-black text-rose-600 hover:underline dark:text-rose-400 cursor-pointer"
                        >
                          {language === 'bn' ? 'সব পঠিত' : 'Mark all read'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notification Items List */}
                  <div className="mt-3 space-y-2.5 overflow-y-auto pr-1 flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        {language === 'bn' ? 'কোনো নতুন বিজ্ঞপ্তি নেই' : 'No new notifications'}
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 rounded-2xl border text-xs transition-all cursor-pointer hover:scale-[1.01] ${
                            n.read 
                              ? 'bg-slate-50/60 border-slate-100 dark:bg-slate-800/30 dark:border-slate-800/60 text-slate-500' 
                              : n.priority === 'HIGH'
                              ? 'bg-rose-500/10 border-rose-400/40 dark:bg-rose-950/30 dark:border-rose-800/60 text-slate-800 dark:text-slate-200'
                              : 'bg-amber-500/10 border-amber-400/40 dark:bg-amber-950/30 dark:border-amber-800/60 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="font-bold mb-1 text-slate-900 dark:text-white flex items-start justify-between gap-1.5">
                            <span className="text-xs leading-snug">
                              {language === 'bn' ? n.titleBn : n.titleEn}
                            </span>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1 animate-pulse" />
                            )}
                          </div>

                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed mb-2 font-normal line-clamp-2">
                            {language === 'bn' ? n.descBn : n.descEn}
                          </p>

                          <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500">
                            <span>{language === 'bn' ? n.timeBn : n.timeEn}</span>
                            <span className="flex items-center gap-1 text-rose-600 dark:text-amber-400 font-extrabold">
                              <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                              <ArrowRight size={10} />
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Quick Action Footer */}
                  <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <Link
                      to="/announcements"
                      onClick={() => setNotifOpen(false)}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1"
                    >
                      <Megaphone size={12} />
                      <span>{language === 'bn' ? 'সকল নোটিশ বোর্ড' : 'All Notices'}</span>
                    </Link>
                    <Link
                      to="/calendar"
                      onClick={() => setNotifOpen(false)}
                      className="text-[11px] font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center gap-1"
                    >
                      <Calendar size={12} />
                      <span>{language === 'bn' ? 'উৎসব পঞ্জিকা' : 'Festivals'}</span>
                    </Link>
                  </div>

                </div>
              </>
            )}
          </div>

          {/* Language Switch Trigger */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/60 dark:bg-slate-800/90 dark:border-slate-700/60 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-amber-400 transition-all cursor-pointer"
            title="Toggle Language"
          >
            <Globe size={13} className="text-rose-500 dark:text-amber-400" />
            <span className={language === 'bn' ? 'font-black text-rose-600 dark:text-amber-400' : ''}>BN</span>
            <span className="text-slate-300 dark:text-slate-600 text-[10px]">|</span>
            <span className={language === 'en' ? 'font-black text-rose-600 dark:text-amber-400' : ''}>EN</span>
          </button>

          {/* Theme Switch Trigger */}
          <button 
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100/90 border border-slate-200/60 dark:bg-slate-800/90 dark:border-slate-700/60 text-slate-600 hover:text-amber-500 dark:text-amber-400 transition-all group cursor-pointer"
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
                className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black shadow-xs hover:opacity-95 transition-all"
            >
              <User size={13} />
              <span>{language === 'bn' ? 'লগইন' : 'Login'}</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-xl bg-slate-100/90 text-slate-600 hover:text-rose-600 dark:bg-slate-800/90 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 space-y-1.5 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-2xl shadow-xl animate-fade-in">
          {NAV_LINKS.map(link => (
            <NavLink key={link.to} {...link} />
          ))}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <Link 
                  to="/member" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-300"
                >
                  <CheckCircle2 size={13} />
                  <span>{user.email?.split('@')[0] || 'Devotee'} ({role})</span>
                </Link>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-bold flex items-center gap-1"
                >
                  <LogOut size={13} />
                  <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black text-center shadow-md block"
              >
                {language === 'bn' ? 'লগইন করুন' : 'Login'}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
