import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getStoredNotices, type ManagerAnnouncement } from '../../utils/noticesStore';
import { 
  Sun, Moon, Globe, LogOut, User,
  Sparkles, Bell, Menu, X, CheckCircle2,
  Settings, ArrowRight, Calendar, Megaphone, AlertCircle, Palette
} from 'lucide-react';
import { NotificationSettingsModal } from '../notifications/NotificationSettingsModal';
import { UserProfileModal } from '../profile/UserProfileModal';
import { ThemeCustomizerModal } from '../theme/ThemeCustomizerModal';
import { getUserProfile, PROFILE_UPDATED_EVENT, type UserProfileState } from '../../utils/userProfile';
import { getThemeSettings, THEME_UPDATED_EVENT, isDarkEffective, type ThemeSettingsState } from '../../utils/themeSettings';

interface DynamicNotification {
  id: string;
  titleEn: string;
  titleBn: string;
  roleTitleEn?: string;
  roleTitleBn?: string;
  inchargeEn?: string;
  inchargeBn?: string;
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
    titleEn: 'Sri Krishna Janmastami (04 Sep 2026)',
    titleBn: 'শ্রীকৃষ্ণ জন্মাষ্টমী মহোৎসব (৪ সেপ্টেম্বর ২০২৬)',
    descEn: 'Fasting till Midnight 12:00 AM • Mahabhisheka & Divine Feast.',
    descBn: 'মধ্যরাত ১২:০০ পর্যন্ত নির্জলা/সজল উপবাস • রাত ১২টায় অভিষেক ও আনন্দ উৎসব।',
    timeEn: '04 Sep 2026',
    timeBn: '৪ সেপ্টে ২০২৬',
    read: false,
    type: 'FESTIVAL',
    priority: 'HIGH',
    link: '/calendar'
  },
  {
    id: 'fest_radhastami',
    titleEn: 'Srimati Radhastami (19 Sep 2026)',
    titleBn: 'শ্রীমতী রাধাষ্টমী শুভ আবির্ভাব (১৯ সেপ্টেম্বর ২০২৬)',
    descEn: 'Fasting till Noon 12:00 PM • Radha Kripa Kataksha & Kirtan.',
    descBn: 'দুপুর ১২:০০ পর্যন্ত উপবাস ও শ্রীরাধা কৃপাকটাক্ষ স্তোত্র পাঠ।',
    timeEn: '19 Sep 2026',
    timeBn: '১৯ সেপ্টে ২০২৬',
    read: false,
    type: 'FESTIVAL',
    priority: 'HIGH',
    link: '/calendar'
  },
  {
    id: 'seva_daily_alert',
    titleEn: 'Daily Seva Duty Roster Active',
    titleBn: 'আজকের সেবাক্রম ও দায়িত্ব সক্রিয়',
    descEn: 'Please check your seva assignment & reporting time in the Service Cycle.',
    descBn: 'সার্ভিস সাইকেলে আপনার আজকের সেবা ও দায়িত্ব দেখে নিন।',
    timeEn: 'Today 6:00 AM',
    timeBn: 'আজ সকাল ৬:০০',
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
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [themeSettings, setThemeSettings] = useState<ThemeSettingsState>(() => getThemeSettings());

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

  const fallbackDevoteeName = user?.user_metadata?.full_name || 
                              user?.email?.split('@')[0] || 
                              (language === 'bn' ? 'জ্ঞান জ্যোতি ত্রিপুরা' : 'Gian Juti Tripura');

  const [userProfile, setUserProfile] = useState<UserProfileState>(() => getUserProfile(fallbackDevoteeName));

  // Keep profile synchronized across app
  useEffect(() => {
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfileState>;
      if (customEvent.detail) {
        setUserProfile(customEvent.detail);
      }
    };
    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);
  }, []);
  
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
      titleEn: n.titleEn,
      titleBn: n.titleBn,
      roleTitleEn: n.roleTitleEn,
      roleTitleBn: n.roleTitleBn,
      inchargeEn: n.inchargeNameEn,
      inchargeBn: n.inchargeNameBn,
      descEn: n.descEn,
      descBn: n.descBn,
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

  const isDark = isDarkEffective(themeSettings.mode);

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
        style={{
          color: isActive ? 'var(--advaita-nav-active-text)' : undefined,
          backgroundColor: isActive ? 'var(--advaita-badge-bg)' : undefined,
          borderColor: isActive ? 'var(--advaita-nav-border)' : undefined
        }}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
          isActive 
            ? 'shadow-xs border font-extrabold' 
            : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60'
        }`}
      >
        {language === 'bn' ? labelBn : labelEn}
      </Link>
    );
  };

  return (
    <nav 
      style={{
        backgroundColor: 'var(--advaita-nav-bg)',
        borderColor: 'var(--advaita-nav-border)'
      }}
      className="sticky top-0 z-50 backdrop-blur-2xl shadow-xs border-b transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-2">
        
        {/* Brand Official VOICE Logo */}
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 min-w-0 group shrink-0">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-0.5 sm:p-1 shadow-sm group-hover:scale-105 transition-all flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src="/voice-logo-transparent.png" 
              className="w-full h-full object-contain dark:hidden" 
              alt="Advaita VOICE Official Logo" 
            />
            <img 
              src="/voice-logo-white.png" 
              className="w-full h-full object-contain hidden dark:block" 
              alt="Advaita VOICE Official Logo" 
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium sm:font-bold text-[10.5px] sm:text-sm md:text-base text-slate-800 dark:text-white whitespace-nowrap tracking-tight">
              ADVAITA <span style={{ color: 'var(--advaita-primary)' }} className="font-bold">VOICE</span>
            </span>
            <span className="hidden sm:block text-[9px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase -mt-0.5 truncate">
              {language === 'bn' ? 'চট্টগ্রাম বিশ্ববিদ্যালয়' : 'Chittagong University'}
            </span>
          </div>
        </Link>
        
        {/* Nav Items & Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

          
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
                  className="fixed inset-0 z-[90] bg-slate-950/60 backdrop-blur-xs" 
                  onClick={() => setNotifOpen(false)} 
                />

                {/* Solid Opaque Dropdown Container */}
                <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-full mt-2 w-auto sm:w-[420px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] z-[100] p-4 sm:p-5 animate-scale-in max-h-[85vh] flex flex-col space-y-3">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        <Sparkles size={14} />
                      </div>
                      <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        {language === 'bn' ? 'বিজ্ঞপ্তি ও অ্যালার্ট' : 'Notifications & Alerts'}
                      </h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black shadow-xs">
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
                        className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                      >
                        <Settings size={14} />
                      </button>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead} 
                          className="text-[11px] font-black text-rose-600 hover:underline dark:text-rose-400 cursor-pointer"
                        >
                          {language === 'bn' ? 'সব পঠিত' : 'Mark read'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notification Items List (Solid, high contrast cards) */}
                  <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[60vh]">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        {language === 'bn' ? 'কোনো নতুন বিজ্ঞপ্তি নেই' : 'No new notifications'}
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3.5 rounded-2xl border text-xs transition-all cursor-pointer shadow-xs ${
                            n.read 
                              ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 opacity-85 hover:opacity-100' 
                              : n.priority === 'HIGH'
                              ? 'bg-rose-50/80 dark:bg-slate-800 border-rose-300 dark:border-rose-900/80 ring-1 ring-rose-500/20' 
                              : 'bg-amber-50/80 dark:bg-slate-800 border-amber-300 dark:border-amber-900/80 ring-1 ring-amber-500/20'
                          }`}
                        >
                          {/* Card Top: Department / Incharge Pill & Unread indicator */}
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {n.type === 'ANNOUNCEMENT' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider">
                                  <Megaphone size={9} />
                                  <span>{language === 'bn' ? n.roleTitleBn : n.roleTitleEn}</span>
                                </span>
                              ) : n.type === 'FESTIVAL' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-600 text-white font-black text-[9px] uppercase tracking-wider">
                                  <Calendar size={9} />
                                  <span>{language === 'bn' ? 'উৎসব' : 'Festival'}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-600 text-white font-black text-[9px] uppercase tracking-wider">
                                  <AlertCircle size={9} />
                                  <span>{language === 'bn' ? 'সেবা' : 'Seva'}</span>
                                </span>
                              )}

                              {n.inchargeBn && (
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                  • {language === 'bn' ? n.inchargeBn : n.inchargeEn}
                                </span>
                              )}
                            </div>

                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                            )}
                          </div>

                          {/* Notice Title */}
                          <h5 className="font-black text-xs sm:text-[13px] text-slate-900 dark:text-white leading-snug mb-1">
                            {language === 'bn' ? n.titleBn : n.titleEn}
                          </h5>

                          {/* Notice Description */}
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed mb-2 font-normal line-clamp-2">
                            {language === 'bn' ? n.descBn : n.descEn}
                          </p>

                          {/* Card Footer: Timestamp & Action Link */}
                          <div className="flex items-center justify-between text-[10px] font-bold pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                            <span className="text-slate-400 dark:text-slate-500 font-mono">
                              {language === 'bn' ? n.timeBn : n.timeEn}
                            </span>
                            <span className="flex items-center gap-1 text-rose-600 dark:text-amber-400 font-black">
                              <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                              <ArrowRight size={11} />
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Quick Action Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <Link
                      to="/announcements"
                      onClick={() => setNotifOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Megaphone size={12} className="text-rose-500" />
                      <span>{language === 'bn' ? 'সকল নোটিশ বোর্ড' : 'All Notices Board'}</span>
                    </Link>
                    <Link
                      to="/calendar"
                      onClick={() => setNotifOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 hover:text-teal-600 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Calendar size={12} className="text-teal-500" />
                      <span>{language === 'bn' ? 'বৈষ্ণব পঞ্জিকা' : 'Vaishnava Calendar'}</span>
                    </Link>
                  </div>

                </div>
              </>
            )}
          </div>

          {/* Language Switch Flip Trigger (Flips between BN <-> EN one at a time) */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/60 dark:bg-slate-800/90 dark:border-slate-700/60 font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer active:scale-95 shrink-0 group select-none shadow-2xs"
            title={language === 'bn' ? 'Switch to English (EN)' : 'বাংলায় দেখুন (BN)'}
            aria-label="Flip Language"
          >
            <Globe size={12} style={{ color: 'var(--advaita-primary)' }} className="group-hover:rotate-45 transition-transform duration-300 shrink-0" />
            <span 
              key={language}
              style={{ color: 'var(--advaita-primary)' }}
              className="font-black text-[10px] sm:text-xs tracking-wider uppercase animate-lang-flip inline-block min-w-[16px] text-center"
            >
              {language === 'bn' ? 'BN' : 'EN'}
            </span>
          </button>

          {/* Theme & Visual Style Trigger */}
          <button 
            onClick={() => setThemeModalOpen(true)}
            className="flex items-center gap-1 p-1.5 sm:px-2 sm:py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/60 dark:bg-slate-800/90 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 transition-all group cursor-pointer shrink-0"
            title={language === 'bn' ? 'থিম ও আলোকসজ্জা কাস্টমাইজ করুন' : 'Customize Theme & Effects'}
            aria-label="Customize Theme & Effects"
          >
            <Palette size={13} style={{ color: 'var(--advaita-primary)' }} className="group-hover:rotate-12 transition-transform shrink-0" />
            <span className="hidden sm:inline-flex items-center">
              {isDark ? (
                <Moon size={13} style={{ color: 'var(--advaita-accent)' }} />
              ) : (
                <Sun size={13} style={{ color: 'var(--advaita-accent)' }} />
              )}
            </span>
          </button>

          {/* User Profile Avatar Trigger (Always accessible on Mobile & Desktop) */}
          <button
            onClick={() => setProfileModalOpen(true)}
            style={{
              boxShadow: '0 0 0 2px var(--advaita-primary)'
            }}
            className="relative p-0.5 rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer group bg-slate-100 dark:bg-slate-800 shrink-0"
            title={language === 'bn' ? `${userProfile.displayName} (প্রোফাইল ও ফটো)` : `Profile: ${userProfile.displayName}`}
            aria-label="Devotee Profile"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden shadow-xs bg-slate-100 dark:bg-slate-800">
              <img 
                src={userProfile.avatarUrl} 
                alt={userProfile.displayName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </button>

          {/* User Auth Action Pill (Desktop) */}
          {user ? (
            <div className="hidden sm:flex items-center gap-1 shrink-0">
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
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black shadow-xs hover:opacity-95 transition-all shrink-0"
            >
              <User size={13} />
              <span>{language === 'bn' ? 'লগইন' : 'Login'}</span>
            </Link>
          )}

          {/* Mobile Menu Button (3-bar hamburger) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-xl bg-slate-100/90 text-slate-600 hover:text-slate-900 dark:bg-slate-800/90 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer shrink-0 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          style={{
            backgroundColor: 'var(--advaita-nav-bg)',
            borderColor: 'var(--advaita-nav-border)'
          }}
          className="lg:hidden px-4 pt-2 pb-4 space-y-2 backdrop-blur-2xl border-b shadow-xl animate-fade-in"
        >
          
          {/* Mobile Profile Trigger Card */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setProfileModalOpen(true);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-left transition-all hover:bg-amber-500/20 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-500/50 shrink-0 bg-slate-100 dark:bg-slate-800">
                <img src={userProfile.avatarUrl} alt={userProfile.displayName} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                  {userProfile.displayName}
                </div>
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  {language === 'bn' ? 'ছবি ও নাম পরিবর্তন করুন' : 'Edit Photo & Name'}
                </div>
              </div>
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-300 font-extrabold px-2.5 py-1 bg-white/80 dark:bg-slate-800 rounded-xl shadow-2xs">
              {language === 'bn' ? 'প্রোফাইল' : 'Profile'}
            </span>
          </button>

          {/* Mobile Theme Customizer Card */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setThemeModalOpen(true);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/30 text-left transition-all hover:bg-indigo-500/20 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Palette size={18} />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white">
                  {language === 'bn' ? 'থিম ও ভিজ্যুয়াল স্টাইল' : 'Theme & Visual Style'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {language === 'bn' ? '৬টি কালার থিম ও আলোকসজ্জা' : '6 Personal Color Themes & Effects'}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 uppercase shadow-2xs">
              {themeSettings.palette}
            </span>
          </button>

          {/* Mobile Language Flip Card */}
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/30 text-left transition-all hover:bg-rose-500/20 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Globe size={18} />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white">
                  {language === 'bn' ? 'ভাষা: বাংলা (BN)' : 'Language: English (EN)'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {language === 'bn' ? 'ইংরেজিতে পরিবর্তন করতে ট্যাপ করুন' : 'Tap to switch to Bengali'}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-800 text-rose-600 dark:text-amber-400 uppercase shadow-2xs">
              {language === 'bn' ? 'BN ⇄ EN' : 'EN ⇄ BN'}
            </span>
          </button>

          {NAV_LINKS.map(link => (
            <NavLink key={link.to} {...link} />
          ))}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <Link 
                  to={role === 'ADMIN' || role === 'INTERNAL_MANAGER' ? '/manager' : '/service-cycle'} 
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

      {/* Devotee Profile Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
