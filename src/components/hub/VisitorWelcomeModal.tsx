import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Flame, ArrowRight, X, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

export const VisitorWelcomeModal: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('voice_visitor_welcome_seen_v3');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    triggerHaptic('selection');
    if (dontShowAgain) {
      localStorage.setItem('voice_visitor_welcome_seen_v3', 'true');
    }
    setIsOpen(false);
  };

  const handleNavigate = (path: string) => {
    triggerHaptic('selection');
    handleClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={handleClose}>
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl text-white space-y-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Ambient Subtle Glows */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-1 pr-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            <span>{isBn ? 'অদ্বৈত ভয়েস যুব কার্যক্রম' : 'Advaita VOICE Youth Programs'}</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight leading-snug">
            {isBn 
              ? 'আসন্ন প্রোগ্রামে রেজিস্ট্রেশন করুন' 
              : 'Register for Upcoming Programs'}
          </h2>

          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {isBn
              ? 'আপনি কি ডিওয়াইএস (DYS) কোর্স অথবা প্রেরণা ফেস্টিভ্যালে অংশ নিতে চান?'
              : 'Would you like to register for the DYS Course or Prerana Youth Festival?'}
          </p>
        </div>

        {/* Direct Registration Options */}
        <div className="space-y-2.5 pt-1">
          
          {/* Option 1: DYS Course Registration */}
          <button
            onClick={() => handleNavigate('/courses')}
            className="w-full p-3 rounded-xl bg-slate-900/90 hover:bg-amber-500/15 border border-slate-800 hover:border-amber-500/50 text-left transition-all duration-200 group flex items-center justify-between gap-3 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-slate-100 group-hover:text-amber-300 transition-colors">
                    {isBn ? 'DYS কোর্স রেজিস্ট্রেশন' : 'Register for DYS Course'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                    {isBn ? '৬ সেশন' : 'Foundation'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {isBn ? 'Discover Yourself • গীতা সার ও সার্টিফিকেট' : 'Discover Yourself • Gita Study Series'}
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              <ArrowRight size={14} />
            </div>
          </button>

          {/* Option 2: Prerana Festival Registration */}
          <button
            onClick={() => handleNavigate('/camps')}
            className="w-full p-3 rounded-xl bg-slate-900/90 hover:bg-orange-500/15 border border-slate-800 hover:border-orange-500/50 text-left transition-all duration-200 group flex items-center justify-between gap-3 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Flame size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-slate-100 group-hover:text-orange-300 transition-colors">
                    {isBn ? 'প্রেরণা ফেস্টিভ্যাল রেজিস্ট্রেশন' : 'Register for Prerana Festival'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 text-[9px] font-bold">
                    {isBn ? 'যুব উৎসব' : 'Youth Fest'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {isBn ? 'বার্ষিক যুব সম্মেলন, কীর্তন ও রিট্রিট' : 'Grand Youth Fest, Drama, Kirtan & Retreat'}
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-slate-950 transition-all">
              <ArrowRight size={14} />
            </div>
          </button>

        </div>

        {/* Footer: Don't show again & Continue to Hub */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-400 hover:text-slate-300 cursor-pointer select-none text-[11px]">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800 accent-amber-500 cursor-pointer"
            />
            <span>{isBn ? 'পুনরায় দেখাবেন না' : "Don't show again"}</span>
          </label>

          <button
            onClick={handleClose}
            className="text-[11px] font-semibold text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{isBn ? 'হাব-এ যান →' : 'Continue to Hub →'}</span>
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default VisitorWelcomeModal;
