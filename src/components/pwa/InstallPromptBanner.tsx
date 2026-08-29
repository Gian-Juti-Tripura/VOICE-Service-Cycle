import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const InstallPromptBanner: React.FC = () => {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // Check if user dismissed it in this session
    const isDismissed = sessionStorage.getItem('voice_pwa_dismissed');
    if (isDismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('voice_pwa_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40">
      <div className="rounded-2xl p-3.5 sm:p-4 bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 text-white shadow-2xl flex items-center justify-between gap-3">
        
        {/* App Icon */}
        <div className="w-11 h-11 rounded-xl bg-white p-1 shrink-0 shadow-sm flex items-center justify-center overflow-hidden border border-amber-400/30">
          <img src="/logo.png" alt="VOICE Logo" className="w-full h-full object-contain" />
        </div>

        {/* Text Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-xs">
            <Sparkles size={13} />
            <span>{language === 'bn' ? 'অ্যান্ড্রয়েড অ্যাপ ইনস্টল করুন' : 'Install Android App'}</span>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5 font-medium">
            {language === 'bn' ? 'হোম স্ক্রিনে যুক্ত করে ১-ক্লিকে অফলাইনে চালান' : 'Add to home screen for instant 1-tap access'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <Download size={13} />
            <span>{language === 'bn' ? 'ইনস্টল' : 'Install'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
