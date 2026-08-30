import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Tent, Calendar, ArrowRight, X, GraduationCap } from 'lucide-react';

export const VisitorWelcomeModal: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('voice_visitor_welcome_seen_v2');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('voice_visitor_welcome_seen_v2', 'true');
    }
    setIsOpen(false);
  };

  const handleNavigate = (path: string) => {
    handleClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-white space-y-6 overflow-hidden">
        
        {/* Glowing Background Auras */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/60 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header Badge & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="animate-spin-slow text-amber-400" />
            <span>{language === 'bn' ? 'স্বাগতম • অদ্বৈত ভয়েস ডিজিটাল হাব' : 'Welcome to Advaita VOICE Hub'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-200 via-orange-100 to-amber-300 bg-clip-text text-transparent leading-tight font-serif">
            {language === 'bn' 
              ? 'চট্টগ্রাম বিশ্ববিদ্যালয় ভয়েস পরিবারে আপনাকে স্বাগতম!' 
              : 'Empowering Youth with Vedic Wisdom & Values'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {language === 'bn'
              ? 'আধ্যাত্মিক বিকাশ, চারিত্রিক উৎকর্ষ ও পরমেশ্বর ভগবানের সেবায় চট্টগ্রাম বিশ্ববিদ্যালয় শিক্ষার্থীদের প্ল্যাটফর্ম।'
              : 'Discover 4-Year Spiritual Syllabus, Youth Camps, Audio Library, and Gita Courses for university students.'}
          </p>
        </div>

        {/* Quick Discovery Cards */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleNavigate('/camps')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-slate-800/60 hover:bg-amber-500/15 border border-slate-700/60 hover:border-amber-500/40 text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 mb-2 group-hover:scale-110 transition-transform">
              <Tent size={18} />
            </div>
            <span className="text-xs font-black text-white group-hover:text-amber-300">
              {language === 'bn' ? 'ইউথ ক্যাম্প ২০২৬' : 'Youth Retreats'}
            </span>
            <span className="text-[10px] text-slate-400 line-clamp-1">
              {language === 'bn' ? 'অনলাইন রেজিস্ট্রেশন চালু' : 'Register online now'}
            </span>
          </button>

          <button
            onClick={() => handleNavigate('/courses')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-slate-800/60 hover:bg-orange-500/15 border border-slate-700/60 hover:border-orange-500/40 text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 mb-2 group-hover:scale-110 transition-transform">
              <GraduationCap size={18} />
            </div>
            <span className="text-xs font-black text-white group-hover:text-orange-300">
              {language === 'bn' ? 'গীতা ও ডিওয়াইএস কোর্স' : 'Gita & DYS Courses'}
            </span>
            <span className="text-[10px] text-slate-400 line-clamp-1">
              {language === 'bn' ? 'সার্টিফিকেট ও স্টাডি মেটেরিয়াল' : 'Enroll & Get Certified'}
            </span>
          </button>

          <button
            onClick={() => handleNavigate('/syllabus')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-slate-800/60 hover:bg-indigo-500/15 border border-slate-700/60 hover:border-indigo-500/40 text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 mb-2 group-hover:scale-110 transition-transform">
              <BookOpen size={18} />
            </div>
            <span className="text-xs font-black text-white group-hover:text-indigo-300">
              {language === 'bn' ? '৪ বছরের সিলেবাস' : '4-Year Syllabus'}
            </span>
            <span className="text-[10px] text-slate-400 line-clamp-1">
              {language === 'bn' ? 'ভয়েস স্টাডি মডিউল' : 'Curriculum & Slokas'}
            </span>
          </button>

          <button
            onClick={() => handleNavigate('/calendar')}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-slate-800/60 hover:bg-emerald-500/15 border border-slate-700/60 hover:border-emerald-500/40 text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
              <Calendar size={18} />
            </div>
            <span className="text-xs font-black text-white group-hover:text-emerald-300">
              {language === 'bn' ? 'বৈষ্ণব ক্যালেন্ডার' : 'Vaishnava Calendar'}
            </span>
            <span className="text-[10px] text-slate-400 line-clamp-1">
              {language === 'bn' ? 'একাদশী ও পারণ সময়' : 'Ekadashi & Festivals'}
            </span>
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleNavigate('/camps')}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm shadow-[0_4px_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Tent size={18} />
            <span>{language === 'bn' ? 'চট্টগ্রাম ইউথ ক্যাম্পে অংশ নিন' : 'Join Upcoming Youth Camp 2026'}</span>
            <ArrowRight size={16} />
          </button>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800"
              />
              <span>{language === 'bn' ? 'পরবর্তীতে আর দেখাবেন না' : "Don't show again"}</span>
            </label>

            <button
              onClick={handleClose}
              className="text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
            >
              {language === 'bn' ? 'সরাসরি প্ল্যাটফর্মে যান →' : 'Continue to Hub →'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
