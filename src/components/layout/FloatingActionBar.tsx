import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowUp, Palette } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getThemeSettings, THEME_UPDATED_EVENT, type ThemeSettingsState } from '../../utils/themeSettings';
import { ThemeCustomizerModal } from '../theme/ThemeCustomizerModal';

export const FloatingActionBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [settings, setSettings] = useState<ThemeSettingsState>(() => getThemeSettings());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeSettingsState>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      }
    };
    window.addEventListener(THEME_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(THEME_UPDATED_EVENT, handleUpdate);
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (window.history.length > 1 && location.pathname !== '/') {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Only render back button on subpages where back action is useful
  const isSubPage = location.pathname !== '/';

  return (
    <>
      <aside 
        aria-label="Quick Actions" 
        className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-none transition-all duration-300 no-print"
      >
        {/* Floating Theme Customizer Button (Always Accessible, Never Colliding) */}
        <button
          onClick={() => setIsThemeOpen(true)}
          className="pointer-events-auto group flex items-center gap-2 px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-amber-400/50 dark:border-amber-500/40 shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          title={isBn ? 'থিম ও আলোকসজ্জা কাস্টমাইজ করুন' : 'Customize Theme & Effects'}
          aria-label="Customize Theme & Effects"
        >
          <div className="relative flex items-center justify-center">
            <Palette size={16} className="text-amber-500 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>

          <span className="hidden sm:inline text-xs font-black tracking-wide text-slate-800 dark:text-slate-100">
            {isBn ? 'থিম ও স্টাইল' : 'Customize Theme'}
          </span>
          
          <span className="hidden md:inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 uppercase">
            {settings.palette}
          </span>
        </button>

        {/* Floating Back Button (only on sub-pages, stacked below Theme) */}
        {isSubPage && (
          <button
            onClick={handleBack}
            title={isBn ? 'পেছনে ফিরে যান' : 'Go Back'}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-md text-xs font-semibold hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={14} className="text-amber-500" />
            <span className="text-[11px] font-bold">{isBn ? 'পেছনে' : 'Back'}</span>
          </button>
        )}

        {/* Conventional Floating Scroll-To-Top FAB */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            title={isBn ? 'উপরে স্ক্রোল করুন' : 'Scroll to Top'}
            className="pointer-events-auto w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl border border-amber-300/40 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer animate-in fade-in zoom-in-75"
          >
            <ArrowUp size={18} className="stroke-[2.5]" />
          </button>
        )}
      </aside>

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
      />
    </>
  );
};

export default FloatingActionBar;
