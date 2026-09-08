import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getThemeSettings, THEME_UPDATED_EVENT, type ThemeSettingsState } from '../../utils/themeSettings';
import { ThemeCustomizerModal } from './ThemeCustomizerModal';

export const CornerThemeButton: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <>
      {/* Corner Floating Theme Button (Chrome Browser Style) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 no-print">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-amber-400/50 dark:border-amber-500/40 shadow-[0_8px_30px_rgba(245,158,11,0.25)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          title={language === 'bn' ? 'থিম ও আলোকসজ্জা কাস্টমাইজ করুন' : 'Customize Theme & Effects'}
          aria-label="Customize Theme & Effects"
        >
          <div className="relative">
            <Palette size={16} className="text-amber-500 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>

          <span className="hidden sm:inline text-xs font-black tracking-wide text-slate-800 dark:text-slate-100">
            {language === 'bn' ? 'থিম ও স্টাইল' : 'Customize Theme'}
          </span>
          
          <span className="hidden md:inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 uppercase">
            {settings.palette}
          </span>
        </button>
      </div>

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default CornerThemeButton;
