import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GlobalSearchBar } from '../components/hub/GlobalSearchBar';
import { VisitorWelcomeModal } from '../components/hub/VisitorWelcomeModal';
import { Footer } from '../components/layout/Footer';
import { VOICE_HANDBOOK_DATA } from '../data/voiceHandbookData';
import { triggerHaptic } from '../utils/haptics';
import { 
  Users, BookOpen, Clock, Utensils, HeartHandshake, RefreshCw, ShieldCheck,
  GraduationCap, Tent, Calendar, Compass, Phone,
  Sparkles, PlayCircle,
  Flame, Landmark, MapPin, ChevronDown, ChevronUp,
  Bell, ArrowRight, Zap, X
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const HubHome: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showIskconCenters, setShowIskconCenters] = useState(false);
  const [selectedDeityModal, setSelectedDeityModal] = useState<'RADHA_MADHAV' | 'GAURA_NITAI' | 'BOTH' | null>(null);

  // Closest 3 Upcoming Festivals from August 2026 onwards in compact format
  const CLOSEST_UPCOMING_FESTIVALS = [
    {
      id: 'f_janmastami',
      nameEn: 'Sri Krishna Janmastami (Appearance Day of Supreme Lord)',
      nameBn: 'শ্রীকৃষ্ণ জন্মাষ্টমী (ভগবান শ্রীকৃষ্ণের আবির্ভাব মহোৎসব)',
      dateEn: '04 Sep 2026',
      dateBn: '৪ সেপ্টেম্বর ২০২৬',
      fastingEn: 'Fasting till Midnight 12:00 AM • Mahabhisheka',
      fastingBn: 'মধ্যরাত পর্যন্ত নির্জলা/সজল উপবাস • রাত ১২টায় অভিষেক',
      badgeColor: 'bg-amber-500 text-slate-950 font-black'
    },
    {
      id: 'f_radhastami',
      nameEn: 'Srimati Radhastami (Appearance of Srimati Radharani)',
      nameBn: 'শ্রীমতী রাধাষ্টমী (শ্রীমতী রাধারাণীর শুভ আবির্ভাব তিথি)',
      dateEn: '19 Sep 2026',
      dateBn: '১৯ সেপ্টেম্বর ২০২৬',
      fastingEn: 'Fasting till Noon 12:00 PM • Radha Kripa Kataksha',
      fastingBn: 'দুপুর ১২:০০ পর্যন্ত উপবাস ও শ্রীরাধা কৃপাকটাক্ষ স্তোত্র পাঠ',
      badgeColor: 'bg-rose-500 text-white font-bold'
    },
    {
      id: 'f_govardhana',
      nameEn: 'Sri Govardhana Puja & Annakut Mahotsav',
      nameBn: 'শ্রী গোবর্ধন পূজা ও অন্নকূট মহোৎসব (দীপাবলির পরদিন)',
      dateEn: '10 Nov 2026',
      dateBn: '১০ নভেম্বর ২০২৬',
      fastingEn: 'Grand Feast & 108 Offering Darshan',
      fastingBn: 'গিরিরাজ পূজা, গো-সেবা ও শত ব্যঞ্জনের মহাপ্রসাদ বিতরণ',
      badgeColor: 'bg-indigo-600 text-white font-bold'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-28 sm:pb-16">
      
      {/* First-time Visitor Welcome Modal */}
      <VisitorWelcomeModal />

      {/* ================= DISTINCT STYLISH ITALIC BANNER: DARE TO BE RARE & GLOBAL SEARCH BAR ================= */}
      <div className="w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/30 py-4 px-4 sm:px-6 lg:px-8 shadow-lg transition-colors duration-300">
        <div className="max-w-4xl lg:max-w-5xl mx-auto space-y-3.5">
          
          {/* Dare to be Rare Title Header */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="h-[1px] flex-1 max-w-xs bg-gradient-to-r from-transparent via-amber-400/40 to-amber-400/90" />
            <span className="text-xs sm:text-sm md:text-base font-serif italic tracking-[0.25em] font-extrabold bg-gradient-to-r from-amber-300 via-orange-200 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)] select-none">
              ✦ Dare to be Rare ✦
            </span>
            <div className="h-[1px] flex-1 max-w-xs bg-gradient-to-l from-transparent via-amber-400/40 to-amber-400/90" />
          </div>

          {/* Majestic Global Search Bar */}
          <GlobalSearchBar />

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ================= 1. MAJESTIC HERO SECTION WITH IYF LOGO & RESTYLED NAMES ================= */}
        <div className="relative overflow-hidden rounded-[32px] p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/90 text-white shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-amber-500/25">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -top-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6 lg:space-y-8">
            
            {/* Top Desktop Row: Left 7 Columns (Identity + Prabhupada Tribute) | Right 5 Columns (Presiding Deities Divine Darshan) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              
              {/* LEFT COLUMN: IYF Branding + Srila Prabhupada Oasis Quote */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-5 sm:space-y-6">
                
                {/* Header Identity Row: Official IYF Logo + Restyled Titles */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  
                  {/* Official IYF Emblem Logo with Illuminating Light Rays & Glowing Aura */}
                  <div className="relative shrink-0 group flex items-center justify-center">
                    {/* Divine Sunbeams & Illuminating Light Rays reaching across the screen */}
                    <div className="divine-sunrays-layer1" />
                    <div className="divine-sunrays-layer2" />

                    {/* Layer 1: Ambient Pulsing Golden Glow Aura */}
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 opacity-90 blur-2xl animate-glow-aura pointer-events-none" />

                    {/* Layer 2: Rotating Radiant Halo Ring */}
                    <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 opacity-95 blur-md animate-aura-spin pointer-events-none" />

                    {/* Main Circular Emblem Container */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-500 shadow-[0_0_45px_rgba(251,191,36,0.85)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_60px_rgba(251,191,36,1)]">
                      <img 
                        src="/assets/iyf_logo.png" 
                        alt="ISKCON Youth Forum (IYF)" 
                        className="w-full h-full object-cover rounded-full bg-slate-950 ring-2 ring-yellow-300/80"
                      />
                    </div>

                    {/* High-Contrast Golden Badge */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-[9px] uppercase font-mono shadow-md border border-white/90 whitespace-nowrap z-10">
                      IYF • VOICE
                    </div>
                  </div>

                  {/* Restyled Names & Sacred Motto */}
                  <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                    
                    {/* Prestigious Eyebrow: Full Meaning of VOICE */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest border border-amber-400/25 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
                      <span>{language === 'bn' ? 'বৈদিক ওয়েসিস ফর ইন্সপায়ারেশন, কালচার অ্যান্ড এডুকেশন' : 'Vedic Oasis for Inspiration, Culture & Education'}</span>
                    </div>
                    
                    {/* Main Heading Styled as "ADVAITA VOICE HUB" */}
                    <div className="space-y-1">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black tracking-wider uppercase leading-tight bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(245,158,11,0.35)]">
                        {language === 'bn' ? 'অদ্বৈত ভয়েস হাব' : 'ADVAITA VOICE HUB'}
                      </h1>
                      
                      {/* University Affiliation & Sacred Motto Bar */}
                      <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 text-xs sm:text-sm font-semibold text-amber-300/90 font-mono">
                        <span className="inline-flex items-center gap-1 text-amber-300 font-bold bg-white/5 px-2.5 py-0.5 rounded-lg border border-white/10">
                          <MapPin size={12} className="text-amber-400" />
                          {language === 'bn' ? 'চট্টগ্রাম বিশ্ববিদ্যালয় শাখা' : 'University of Chittagong'}
                        </span>
                        <span className="text-white/30 hidden sm:inline">•</span>
                        <span className="text-amber-200/90 font-serif italic text-xs sm:text-sm">
                          "{language === 'bn' ? VOICE_HANDBOOK_DATA.mottoBn : VOICE_HANDBOOK_DATA.mottoEn}"
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Srila Prabhupada Oasis Quote & Founder-Acharya Tribute Box */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-950/60 border border-amber-400/25 backdrop-blur-md flex flex-col sm:flex-row items-center gap-4 shadow-xl flex-1 justify-center">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-lg ring-4 ring-amber-500/20">
                      <img
                        src="/assets/srila_prabhupada.jpg"
                        alt="His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-right-1 px-2 py-0.2 rounded-md bg-amber-500 text-slate-950 text-[8.5px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm">
                      Founder-Acharya
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                      <span className="text-xs font-black text-amber-300 tracking-wide uppercase font-serif">
                        {language === 'bn' ? 'শ্রীল প্রভুপাদ বাণী ও আদর্শ' : 'His Divine Grace A.C. Bhaktivedanta Swami Prabhupada'}
                      </span>
                      <span className="text-[10px] text-amber-200/70 font-mono hidden sm:inline">• ISKCON Founder-Acharya</span>
                    </div>
                    <p className="italic text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
                      "{language === 'bn' ? VOICE_HANDBOOK_DATA.oasisQuoteBn : VOICE_HANDBOOK_DATA.oasisQuoteEn}"
                    </p>
                    <div className="text-center sm:text-right text-[11px] font-bold text-amber-400/90 font-mono">
                      — {language === 'bn' ? VOICE_HANDBOOK_DATA.oasisSourceBn : VOICE_HANDBOOK_DATA.oasisSourceEn}
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Presiding Deities Divine Darshan Card */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-indigo-950/70 border border-amber-400/40 backdrop-blur-xl space-y-4 shadow-[0_10px_40px_rgba(0,0,0,0.6)] h-full flex flex-col justify-between">
                  {/* Ambient Altar Glow Background */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Header Title */}
                  <div className="relative z-10 flex items-center justify-between gap-2 border-b border-amber-400/20 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm animate-pulse">🪔</span>
                      <div>
                        <h2 className="text-xs sm:text-sm font-black text-amber-200 font-serif tracking-wide flex items-center gap-1.5">
                          <span>{language === 'bn' ? 'শ্রীশ্রী রাধামাধব ও শ্রীশ্রী গৌর নিতাই নিত্য দর্শন' : 'Presiding Deities Divine Darshan'}</span>
                        </h2>
                        <p className="text-[9.5px] sm:text-[10.5px] text-amber-300/80 font-mono">
                          Radhamadhav Temple & Gour Nitai Ashram, CU
                        </p>
                      </div>
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-400/40 shadow-xs flex items-center gap-1">
                      <span>✨</span>
                      <span>{language === 'bn' ? 'দর্শন মন্ত্র' : 'Tap for Mantras'}</span>
                    </span>
                  </div>

                  {/* Side-by-Side Deity Portraits with Divine Glowing Halos */}
                  <div className="relative z-10 grid grid-cols-2 gap-3.5 sm:gap-4 my-auto">
                    
                    {/* LEFT: Sri Sri Radha Madhava */}
                    <div
                      onClick={() => { triggerHaptic('selection'); setSelectedDeityModal('RADHA_MADHAV'); }}
                      className="group flex flex-col items-center cursor-pointer active:scale-95 transition-all"
                    >
                      <div className="relative w-full aspect-[3/4] rounded-2xl p-1 bg-gradient-to-tr from-amber-400/60 via-yellow-300/40 to-amber-500/60 shadow-[0_0_25px_rgba(251,191,36,0.35)] group-hover:shadow-[0_0_40px_rgba(251,191,36,0.7)] group-hover:border-amber-300 transition-all duration-300">
                        {/* Glowing Aura Behind Frame */}
                        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-amber-500/30 via-yellow-400/40 to-amber-600/30 blur-md opacity-75 group-hover:opacity-100 group-hover:blur-lg transition-all animate-glow-aura pointer-events-none" />
                        
                        {/* Deity Image Container */}
                        <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-950 ring-1 ring-amber-300/50">
                          <img
                            src="/assets/sri_sri_radha_madhava.jpg"
                            alt="Sri Sri Radha Madhava"
                            className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                          />
                        </div>
                      </div>
                      <div className="mt-2.5 text-center">
                        <h3 className="text-xs sm:text-sm font-black text-amber-200 font-serif leading-tight group-hover:text-amber-100 transition-colors drop-shadow-xs">
                          {language === 'bn' ? 'শ্রীশ্রী রাধামাধব' : 'Sri Sri Radha Madhav'}
                        </h3>
                        <p className="text-[9.5px] sm:text-[10px] text-amber-300/70 font-serif italic mt-0.5">
                          {language === 'bn' ? 'নিত্য যুগলকিশোর' : 'Divine Couple'}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT: Sri Sri Gaura Nitai */}
                    <div
                      onClick={() => { triggerHaptic('selection'); setSelectedDeityModal('GAURA_NITAI'); }}
                      className="group flex flex-col items-center cursor-pointer active:scale-95 transition-all"
                    >
                      <div className="relative w-full aspect-[3/4] rounded-2xl p-1 bg-gradient-to-tr from-amber-400/60 via-yellow-300/40 to-amber-500/60 shadow-[0_0_25px_rgba(251,191,36,0.35)] group-hover:shadow-[0_0_40px_rgba(251,191,36,0.7)] group-hover:border-amber-300 transition-all duration-300">
                        {/* Glowing Aura Behind Frame */}
                        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-amber-500/30 via-yellow-400/40 to-amber-600/30 blur-md opacity-75 group-hover:opacity-100 group-hover:blur-lg transition-all animate-glow-aura pointer-events-none" />
                        
                        {/* Deity Image Container */}
                        <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-950 ring-1 ring-amber-300/50">
                          <img
                            src="/assets/sri_sri_gaura_nitai.jpg"
                            alt="Sri Sri Gaura Nitai"
                            className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                          />
                        </div>
                      </div>
                      <div className="mt-2.5 text-center">
                        <h3 className="text-xs sm:text-sm font-black text-amber-200 font-serif leading-tight group-hover:text-amber-100 transition-colors drop-shadow-xs">
                          {language === 'bn' ? 'শ্রীশ্রী গৌর নিতাই' : 'Sri Sri Gaura Nitai'}
                        </h3>
                        <p className="text-[9.5px] sm:text-[10px] text-amber-300/70 font-serif italic mt-0.5">
                          {language === 'bn' ? 'পরম করুণ অবতারদ্বয়' : 'Merciful Lords'}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Radiant Maha-Mantra */}
                  <div className="relative z-10 pt-2 text-center border-t border-amber-400/15">
                    <p className="text-[11px] sm:text-xs text-amber-300 font-serif italic tracking-wide drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                      "হরে কৃষ্ণ হরে কৃষ্ণ কৃষ্ণ কৃষ্ণ হরে হরে • হরে রাম হরে রাম রাম রাম হরে হরে"
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* ================= 4 SPIRITUAL GUARDIANS & PILLARS IN EXACT ORDER ================= */}
            <div className="p-4 sm:p-6 rounded-3xl bg-slate-950/60 border border-amber-400/25 backdrop-blur-md space-y-3 shadow-xl">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-amber-400" />
                  <span className="text-xs sm:text-sm font-black text-amber-200 tracking-wide uppercase font-serif">
                    {language === 'bn' ? 'আমাদের পরম আধ্যাত্মিক অভিভাবক ও পথপ্রদর্শক' : 'Spiritual Guardians & Lineage of VOICE'}
                  </span>
                </div>
                <Link
                  to="/profiles?tab=lineage"
                  onClick={() => triggerHaptic('selection')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>{language === 'bn' ? 'বিস্তারিত জানুন (Know More)' : 'Know More'}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                {/* 1. Srila Prabhupada */}
                <button
                  onClick={() => { triggerHaptic('selection'); navigate('/profiles?tab=lineage&person=sp_prabhupada'); }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-amber-400/20 hover:border-amber-400/70 flex flex-col items-center text-center space-y-2 group hover:bg-amber-400/5 transition-all duration-300 cursor-pointer text-left w-full hover:-translate-y-1"
                >
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-amber-400 ring-4 ring-amber-500/20 shadow-md group-hover:scale-105 transition-transform duration-300">
                      <img src="/assets/srila_prabhupada_white.png" alt="Srila Prabhupada" className="w-full h-full object-cover object-top" />
                    </div>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[8px] font-black uppercase whitespace-nowrap shadow-xs">
                      1. Founder-Acharya
                    </span>
                  </div>
                  <div className="w-full">
                    <h4 className="text-xs sm:text-sm font-black text-white leading-tight font-serif mt-1 group-hover:text-amber-300 transition-colors">
                      {language === 'bn' ? 'শ্রীল প্রভুপাদ' : 'Srila Prabhupada'}
                    </h4>
                    <p className="text-[9.5px] text-amber-300 font-medium truncate">
                      HDG A.C. Bhaktivedanta Swami
                    </p>
                    <span className="inline-block mt-1.5 text-[9.5px] font-bold text-amber-400/80 group-hover:text-amber-300 group-hover:underline">
                      {language === 'bn' ? 'বিস্তারিত জানুন →' : 'Know More →'}
                    </span>
                  </div>
                </button>

                {/* 2. HH Jayapataka Swami Gurumaharaja */}
                <button
                  onClick={() => { triggerHaptic('selection'); navigate('/profiles?tab=lineage&person=hh_jayapataka_swami'); }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-amber-400/20 hover:border-amber-400/70 flex flex-col items-center text-center space-y-2 group hover:bg-amber-400/5 transition-all duration-300 cursor-pointer text-left w-full hover:-translate-y-1"
                >
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-amber-400 ring-4 ring-amber-500/20 shadow-md group-hover:scale-105 transition-transform duration-300">
                      <img src="/assets/hh_jayapataka_swami.jpg" alt="HH Jayapataka Swami Gurumaharaja" className="w-full h-full object-cover object-top" />
                    </div>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[8px] font-black uppercase whitespace-nowrap shadow-xs">
                      2. Guru Maharaja
                    </span>
                  </div>
                  <div className="w-full">
                    <h4 className="text-xs sm:text-sm font-black text-white leading-tight font-serif mt-1 group-hover:text-amber-300 transition-colors">
                      {language === 'bn' ? 'জয়পতাকা স্বামী মহারাজ' : 'HH Jayapataka Swami'}
                    </h4>
                    <p className="text-[9.5px] text-amber-300 font-medium truncate">
                      {language === 'bn' ? 'জিবিসি • আধ্যাত্মিক গুরুদেব' : 'ISKCON GBC • Spiritual Master'}
                    </p>
                    <span className="inline-block mt-1.5 text-[9.5px] font-bold text-amber-400/80 group-hover:text-amber-300 group-hover:underline">
                      {language === 'bn' ? 'বিস্তারিত জানুন →' : 'Know More →'}
                    </span>
                  </div>
                </button>

                {/* 3. HH Bhakti Purushottama Swami Maharaj */}
                <button
                  onClick={() => { triggerHaptic('selection'); navigate('/profiles?tab=lineage&person=hh_bhakti_purusottama_swami'); }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-amber-400/20 hover:border-amber-400/70 flex flex-col items-center text-center space-y-2 group hover:bg-amber-400/5 transition-all duration-300 cursor-pointer text-left w-full hover:-translate-y-1"
                >
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-amber-400 ring-4 ring-amber-500/20 shadow-md group-hover:scale-105 transition-transform duration-300">
                      <img src="/assets/hh_bhaktipurusottam_swami.png" alt="HH Bhakti Purushottama Swami Maharaj" className="w-full h-full object-cover object-top" />
                    </div>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[8px] font-black uppercase whitespace-nowrap shadow-xs">
                      3. Spiritual Mentor
                    </span>
                  </div>
                  <div className="w-full">
                    <h4 className="text-xs sm:text-sm font-black text-white leading-tight font-serif mt-1 group-hover:text-amber-300 transition-colors">
                      {language === 'bn' ? 'ভক্তিপুরুষোত্তম স্বামী' : 'HH Bhakti Purusottam Swami'}
                    </h4>
                    <p className="text-[9.5px] text-amber-300 font-medium truncate">
                      {language === 'bn' ? 'জিবিসি • মায়াপুর ডিরেক্টর' : 'ISKCON GBC • Mayapur Director'}
                    </p>
                    <span className="inline-block mt-1.5 text-[9.5px] font-bold text-amber-400/80 group-hover:text-amber-300 group-hover:underline">
                      {language === 'bn' ? 'বিস্তারিত জানুন →' : 'Know More →'}
                    </span>
                  </div>
                </button>

                {/* 4. HG Radheshyam Das Prabhu */}
                <button
                  onClick={() => { triggerHaptic('selection'); navigate('/profiles?tab=lineage&person=hg_radheshyam_prabhu'); }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-amber-400/20 hover:border-amber-400/70 flex flex-col items-center text-center space-y-2 group hover:bg-amber-400/5 transition-all duration-300 cursor-pointer text-left w-full hover:-translate-y-1"
                >
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-amber-400 ring-4 ring-amber-500/20 shadow-md group-hover:scale-105 transition-transform duration-300">
                      <img src="/assets/hg_radheshyam_prabhu.png" alt="HG Radheshyam Das Prabhu" className="w-full h-full object-cover object-top" />
                    </div>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[8px] font-black uppercase whitespace-nowrap shadow-xs">
                      4. VOICE Architect
                    </span>
                  </div>
                  <div className="w-full">
                    <h4 className="text-xs sm:text-sm font-black text-white leading-tight font-serif mt-1 group-hover:text-amber-300 transition-colors">
                      {language === 'bn' ? 'রাধেশ্যাম দাস প্রভু' : 'HG Radheshyam Das'}
                    </h4>
                    <p className="text-[9.5px] text-amber-300 font-medium truncate">
                      {language === 'bn' ? 'আইআইটি বোম্বে • ভয়েস প্রতিষ্ঠাতা' : 'IIT Bombay • VOICE Founder'}
                    </p>
                    <span className="inline-block mt-1.5 text-[9.5px] font-bold text-amber-400/80 group-hover:text-amber-300 group-hover:underline">
                      {language === 'bn' ? 'বিস্তারিত জানুন →' : 'Know More →'}
                    </span>
                  </div>
                </button>

              </div>
            </div>

          </div>
        </div>

        {/* ================= 1. DAILY ASHRAM OPERATIONS & DEVOTEE CARE ================= */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{language === 'bn' ? '১. দৈনিক আশ্রম সেবা ও যত্ন' : '1. Daily Ashram Operations & Care'}</span>
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
              Daily Utilities • 6 Tools
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
            {/* 1. Prasad & Meals */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/meals'); }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-between group cursor-pointer h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Utensils size={22} />
              </div>
              <div className="mt-3">
                <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'মিল ও প্রসাদ' : 'Prasad & Meal'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal leading-tight">
                  {language === 'bn' ? 'মিল গণনা ও বাজার লেজার' : 'Live Counts & Ledger'}
                </p>
              </div>
            </button>

            {/* 2. Digital Sadhana */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/sadhana'); }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-between group cursor-pointer h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <HeartHandshake size={22} />
              </div>
              <div className="mt-3">
                <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'ডিজিটাল সাধনা' : 'Digital Sadhana'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal leading-tight">
                  {language === 'bn' ? '১৬ মালা জপ ও রিপোর্ট' : '16 Rounds & Reports'}
                </p>
              </div>
            </button>

            {/* 3. Seva Cycle Duty */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/service-cycle'); }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-between group cursor-pointer h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <RefreshCw size={22} />
              </div>
              <div className="mt-3">
                <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'সেবাক্রম রোস্টার' : 'Seva Cycle'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal leading-tight">
                  {language === 'bn' ? 'দৈনিক পূজা ও রান্না সেবা' : 'Duty Rotation Roster'}
                </p>
              </div>
            </button>

            {/* 4. Discipline Audit */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/discipline-audit'); }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-between group cursor-pointer h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Clock size={22} />
              </div>
              <div className="mt-3">
                <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'আশ্রম শৃঙ্খলা' : 'Discipline Audit'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal leading-tight">
                  {language === 'bn' ? 'ভয়েস ৪:০০ ও লোটাস ৫:০০' : '4:00 AM & 5:00 AM'}
                </p>
              </div>
            </button>

            {/* 5. Voice Devotee Profiles */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/profiles'); }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-between group cursor-pointer h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Users size={22} />
              </div>
              <div className="mt-3">
                <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'ভয়েস প্রোফাইল' : 'Devotee Profiles'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal leading-tight">
                  {language === 'bn' ? 'ভক্ত ডিরেক্টরি ও নেক্টার' : 'Directory & Nectar'}
                </p>
              </div>
            </button>

            {/* 6. Counselor Desk */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/counselor'); }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-between group cursor-pointer h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck size={22} />
              </div>
              <div className="mt-3">
                <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'কাউন্সেলর ডেস্ক' : 'Counselor Desk'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal leading-tight">
                  {language === 'bn' ? 'কাউন্সেলিং ও ৩টি রিপোর্ট' : 'Student Care & Guidance'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ================= 2. VEDIC ACADEMY, COURSES & RESIDENTIAL CAMPS ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{language === 'bn' ? '২. বেদিক একাডেমি ও প্রশিক্ষণ' : '2. Vedic Academy & Courses'}</span>
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
              Syllabus &amp; Diplomas • 3 Portals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. All Courses & Diplomas */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/courses'); }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 shadow-xs hover:shadow-md transition-all duration-200 flex items-start gap-4 text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-1">
                  6 Courses
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'সকল বেদিক কোর্স ও ডিপ্লোমা' : 'All Courses & Diplomas'}
                </h4>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-normal">
                  {language === 'bn' ? 'DYS (৬ সেশন), স্পিরিচুয়াল সায়েন্টিস্ট, পজিট্রন, প্রোটন ও ভক্তি শাস্ত্রী।' : 'DYS (6 Sessions), SS, Positron, Protons, Spiritual Master & Bhakti Shastri.'}
                </p>
              </div>
            </button>

            {/* 2. Full VOICE Syllabus */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/syllabus'); }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all duration-200 flex items-start gap-4 text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Compass size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-1">
                  854 Topics
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                  {language === 'bn' ? '৮৫৪-টপিক পূর্ণাঙ্গ সিলেবাস' : 'Full VOICE Syllabus (854 Topics)'}
                </h4>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-normal">
                  {language === 'bn' ? 'পুনে ভয়েস হ্যান্ডবুক, সকল অধ্যায়, লেকচার ও ট্রানস্ক্রিপ্ট।' : 'Official VOICE handbook, all chapters, lecture slides & outlines.'}
                </p>
              </div>
            </button>

            {/* 3. Official Residential Camps */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/camps'); }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-md transition-all duration-200 flex items-start gap-4 text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Tent size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-1">
                  13 Official Camps
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors tracking-tight">
                  {language === 'bn' ? '১৩টি ভয়েস আবাসিক ক্যাম্প' : '13 Residential Camps'}
                </h4>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-normal">
                  {language === 'bn' ? 'সংকল্প, স্ফূর্তি, উৎসাহ, উৎকর্ষ, নিষ্ঠা, FTW, FEC ও আশ্রয় ক্যাম্প।' : 'Sankalpa, Sphurti, Utsaha, Utkarsha, Nistha, FTW, FEC & Ashraya.'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ================= 3. DIGITAL MEDIA & SEBANANDA LIBRARY ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{language === 'bn' ? '৩. অডিও, ভিডিও ও সেবানন্দ গ্রন্থাগার' : '3. Digital Media & Sebananda Library'}</span>
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
              Media &amp; E-Books • 2 Archives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Audio & Video Library */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/lectures-library'); }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 shadow-xs hover:shadow-md transition-all duration-200 flex items-start gap-4 text-left group cursor-pointer"
            >
              <div className="w-13 h-13 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <PlayCircle size={26} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 mb-1">
                  Prabhupada Vani + RSP Lectures
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'ভয়েস অডিও ও ভিডিও লাইব্রেরি' : 'VOICE Audio & Video Library'}
                </h4>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-normal">
                  {language === 'bn' ? 'শ্রীল প্রভুপাদের প্রাতঃকালীন বাণী এবং শ্রীল রাধেশ্যাম প্রভুর ভিডিও লেকচার সংকলন।' : 'Srila Prabhupada morning SB lectures & HG Radheshyam Prabhu video discourse archive.'}
                </p>
              </div>
            </button>

            {/* 2. Sebananda Library */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/library'); }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-xs hover:shadow-md transition-all duration-200 flex items-start gap-4 text-left group cursor-pointer"
            >
              <div className="w-13 h-13 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen size={26} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mb-1">
                  E-Books &amp; PDFs
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'সেবানন্দ ডিজিটাল গ্রন্থাগার' : 'Sebananda Digital Library'}
                </h4>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-normal">
                  {language === 'bn' ? 'শ্রীল প্রভুপাদের সকল প্রামাণ্য গ্রন্থ, গীতা, ভাগবতম, ভজন গান ও DYS স্লাইডস।' : 'Authentic Prabhupada E-books, Gita, Bhagavatam, Songbooks & DYS slides.'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ================= 4. GOVERNANCE, FESTIVALS & CAMPUS PREACHING ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{language === 'bn' ? '৪. পরিচালনা, পঞ্জিকা ও প্রচার' : '4. Governance, Festivals & Outreach'}</span>
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
              Admin &amp; Outreach • 4 Portals
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            {/* 1. Advaita Org & Management */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/management'); }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-between group cursor-pointer h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Landmark size={22} />
              </div>
              <div className="mt-3">
                <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'পরিচালনা পরিষদ' : 'Advaita Org Tree'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal leading-tight">
                  {language === 'bn' ? '১৮টি বিভাগ ও স্টাডি কেয়ার' : '18 Depts & Board'}
                </p>
              </div>
            </button>

            {/* 2. Vaishnava Calendar */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/calendar'); }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-between group cursor-pointer h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Calendar size={22} />
              </div>
              <div className="mt-3">
                <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'বৈষ্ণব পঞ্জিকা' : 'Vaishnava Calendar'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal leading-tight">
                  {language === 'bn' ? 'একাদশী ও মহোৎসব তিথি' : 'Ekadashi & Feasts'}
                </p>
              </div>
            </button>

            {/* 3. Incharge Notices */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/announcements'); }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-between group cursor-pointer h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Bell size={22} />
              </div>
              <div className="mt-3">
                <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'ইনচার্জ নোটিশ' : 'Incharge Notices'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal leading-tight">
                  {language === 'bn' ? 'বিভাগীয় জরুরি নির্দেশনা' : 'Directives Board'}
                </p>
              </div>
            </button>

            {/* 4. Preacher's Toolkit */}
            <button
              onClick={() => { triggerHaptic('selection'); navigate('/preaching'); }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-between group cursor-pointer h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Flame size={22} />
              </div>
              <div className="mt-3">
                <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors tracking-tight">
                  {language === 'bn' ? 'প্রচারক টুলকিট' : 'Preacher Toolkit'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal leading-tight">
                  {language === 'bn' ? 'ক্যাম্পাস প্রচার প্রশ্নোত্তর' : 'Campus Q&A & Slokas'}
                </p>
              </div>
            </button>
          </div>

          {/* Compact Upcoming Festivals Strip */}
          <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-amber-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                  {language === 'bn' ? 'আসন্ন মহোৎসব ও তিথি' : 'Upcoming Festivals & Ekadashi'}
                </span>
              </div>
              <Link
                to="/calendar"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                <span>{language === 'bn' ? 'সম্পূর্ণ পঞ্জিকা' : 'Full Calendar'}</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {CLOSEST_UPCOMING_FESTIVALS.map((fest) => (
                <div
                  key={fest.id}
                  className="flex flex-col justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs shadow-2xs hover:border-amber-400 transition-all"
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-bold shadow-2xs shrink-0 ${fest.badgeColor}`}>
                      {language === 'bn' ? fest.dateBn : fest.dateEn}
                    </span>
                  </div>
                  <h5 className="font-bold text-[11.5px] text-slate-900 dark:text-white truncate">
                    {language === 'bn' ? fest.nameBn : fest.nameEn}
                  </h5>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                    {language === 'bn' ? fest.fastingBn : fest.fastingEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= 4. THE 6 PILLARS & 8 CORE OBJECTIVES (MAGNIFICENT DESKTOP & MOBILE REDESIGN) ================= */}
        <div className="rounded-[32px] p-6 sm:p-8 lg:p-10 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-8 relative overflow-hidden">
          
          {/* Subtle Ambient Light Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-indigo-500/10 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/20 shadow-2xs">
                <Sparkles size={13} className="text-amber-500" />
                <span>{language === 'bn' ? 'মৌলিক নীতিমালা ও লক্ষ্য' : 'Foundational Framework'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'bn' ? 'ভয়েসের ৬টি স্তম্ভ ও ৮টি মূল উদ্দেশ্য' : 'The 6 Pillars & 8 Core Objectives of VOICE'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-serif italic max-w-md">
              "{language === 'bn' ? 'চরিত্র গঠন, আধ্যাত্মিক একাগ্রতা ও আত্মউন্নয়নের সার্বিক পরিকল্পনা।' : 'A systematic spiritual framework for youth character, competence and love of God.'}"
            </p>
          </div>

          {/* Section 1: 6 Pillars Horizontal Grid with Vibrant Icons & Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
                {language === 'bn' ? 'ভয়েসের ৬টি স্তম্ভ (The 6 Pillars):' : 'The 6 Core Pillars:'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
              {VOICE_HANDBOOK_DATA.sixPillars.map((p, i) => {
                const pillarThemes = [
                  { icon: Flame, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
                  { icon: Sparkles, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
                  { icon: Users, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
                  { icon: Zap, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
                  { icon: GraduationCap, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
                  { icon: BookOpen, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
                ];
                const theme = pillarThemes[i % pillarThemes.length];
                const Icon = theme.icon;

                return (
                  <div 
                    key={i} 
                    className="group relative p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/70 hover:border-amber-400/40 dark:hover:border-amber-500/40 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs group-hover:scale-110 transition-transform ${theme.color}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {language === 'bn' ? p.titleBn : p.titleEn}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-normal">
                          {language === 'bn' ? p.descBn : p.descEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: 8 Core Objectives in Balanced 4-Column Desktop Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
                {language === 'bn' ? '৮টি মূল উদ্দেশ্য (8 Objectives):' : '8 Core Mission Objectives:'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {VOICE_HANDBOOK_DATA.objectives.map(obj => (
                <div 
                  key={obj.number} 
                  className="group relative p-4.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400/40 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-start gap-3.5"
                >
                  <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-600 to-amber-600 text-white font-mono text-xs font-black flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform mt-0.5">
                    {obj.number.toString().padStart(2, '0')}
                  </span>
                  
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">
                      {language === 'bn' ? obj.titleBn : obj.titleEn}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                      {language === 'bn' ? obj.descBn : obj.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= 5. AUTHENTIC 4-YEAR VOICE SYLLABUS & CAMPS MATRIX ================= */}
        <div className="rounded-[32px] p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/90 text-white shadow-2xl space-y-6 border border-amber-500/25 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center space-y-2 max-w-2xl mx-auto relative z-10">
            <span className="inline-block px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-400/30 text-amber-300 text-xs font-mono font-black uppercase tracking-widest shadow-sm">
              VOICE Syllabus
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'bn' ? '৪-বর্ষীয় ভয়েস সিলেবাস ও কোর্স-ক্যাম্প কাঠামো' : '4-Year VOICE Academic & Camp Progression Roadmap'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/80 font-serif italic">
              "Introducing Krishna Consciousness to youths by one time seminars on Art of Mind Control, Power of Habit, Stress Management etc."
            </p>
          </div>

          {/* 4 Years Golden Plaque Grid */}
          <div className="space-y-5 relative z-10">
            
            {/* --- FIRST YEAR --- */}
            <div className="space-y-2.5">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-mono px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 shadow-2xs">
                  FIRST YEAR
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Plaque */}
                <div className="p-4.5 rounded-2xl bg-slate-900/80 border border-amber-400/35 shadow-lg backdrop-blur-md space-y-2.5">
                  <div className="text-center pb-2 border-b border-amber-400/20">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-mono">COURSE</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-slate-200 font-medium">
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Discover Yourself (DYS)</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Spiritual Scientist (SS)</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Positive Thinker (PT)</li>
                  </ul>
                </div>
                {/* Camp Plaque */}
                <div className="p-4.5 rounded-2xl bg-slate-900/80 border border-amber-400/35 shadow-lg backdrop-blur-md space-y-2.5">
                  <div className="text-center pb-2 border-b border-amber-400/20">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-mono">CAMP</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-slate-200 font-medium">
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Sankalpa</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Sphurti</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Utsaha</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Utkarsha</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* --- SECOND YEAR --- */}
            <div className="space-y-2.5">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-mono px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 shadow-2xs">
                  SECOND YEAR
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Plaque */}
                <div className="p-4.5 rounded-2xl bg-slate-900/80 border border-amber-400/35 shadow-lg backdrop-blur-md space-y-2.5">
                  <div className="text-center pb-2 border-b border-amber-400/20">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-mono">COURSE</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-slate-200 font-medium">
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Self Manager (SM)</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Hearing Srila Prabhupada-100 Lecture</li>
                  </ul>
                </div>
                {/* Camp Plaque */}
                <div className="p-4.5 rounded-2xl bg-slate-900/80 border border-amber-400/35 shadow-lg backdrop-blur-md space-y-2.5">
                  <div className="text-center pb-2 border-b border-amber-400/20">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-mono">CAMP</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-slate-200 font-medium">
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">SRCGD</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Nistha Camp</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Follow up Training Workshop (FTW)</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Facilitator Empowerment Course (FEC)</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">DYS Preachers Training</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* --- THIRD YEAR --- */}
            <div className="space-y-2.5">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-mono px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 shadow-2xs">
                  THIRD YEAR
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Plaque */}
                <div className="p-4.5 rounded-2xl bg-slate-900/80 border border-amber-400/35 shadow-lg backdrop-blur-md space-y-2.5">
                  <div className="text-center pb-2 border-b border-amber-400/20">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-mono">COURSE</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-slate-200 font-medium">
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Proactive Leader</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Hearing Srila Prabhupada &amp; Gurumaharaj 100 Lecture</li>
                  </ul>
                </div>
                {/* Camp Plaque */}
                <div className="p-4.5 rounded-2xl bg-slate-900/80 border border-amber-400/35 shadow-lg backdrop-blur-md space-y-2.5">
                  <div className="text-center pb-2 border-b border-amber-400/20">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-mono">CAMP</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-slate-200 font-medium">
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Ashraya Camp</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Gauranga Sabha Camp &amp; Nityananda Sabha Camp</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* --- FOURTH YEAR --- */}
            <div className="space-y-2.5">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-mono px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 shadow-2xs">
                  FOURTH YEAR
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Plaque */}
                <div className="p-4.5 rounded-2xl bg-slate-900/80 border border-amber-400/35 shadow-lg backdrop-blur-md space-y-2.5">
                  <div className="text-center pb-2 border-b border-amber-400/20">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-mono">COURSE</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-slate-200 font-medium">
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Proactive Leader</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Personality Development Course</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Hearing Srila Prabhupada &amp; Gurumaharaj 100 Lecture</li>
                  </ul>
                </div>
                {/* Camp Plaque */}
                <div className="p-4.5 rounded-2xl bg-slate-900/80 border border-amber-400/35 shadow-lg backdrop-blur-md space-y-2.5">
                  <div className="text-center pb-2 border-b border-amber-400/20">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-mono">CAMP</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-center text-slate-200 font-medium">
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Sharanagati Camp</li>
                    <li className="p-2 rounded-xl bg-white/5 border border-white/5">Gauranga Sabha Camp &amp; Nityananda Sabha Camp</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= 6. DEVOTEE'S ADVANCEMENT MATRIX ================= */}
        <div className="rounded-[32px] p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          <div className="text-center space-y-1 max-w-2xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold uppercase tracking-wider border border-rose-200 dark:border-rose-900">
              Spiritual Evolution Matrix
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'bn' ? 'ভক্তের উন্নতির পাঠ্যক্রম' : "Devotee's Advancement Curriculum Matrix"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'bn' ? 'শুরু থেকে ৭+ বছর পর্যন্ত আধ্যাত্মিক শাস্ত্রজ্ঞান, আচার্য নিষ্ঠা, বৈষ্ণব সদাচার ও সেবার পর্যায়ক্রমিক সারণি' : 'Chronological matrix from initiation to 7+ years of spiritual study, Acharya dedication and devotional service.'}
            </p>
          </div>

          {/* 4 Column Progression Table Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VOICE_HANDBOOK_DATA.devoteeAdvancementMatrix.map((stage, idx) => (
              <div 
                key={idx}
                className={`rounded-2xl border-2 ${stage.borderColor} bg-gradient-to-b ${stage.color} overflow-hidden shadow-sm flex flex-col justify-between`}
              >
                <div>
                  {/* Stage Header */}
                  <div className={`p-3 text-center font-black text-xs sm:text-sm tracking-wide shadow-xs ${stage.headerBg}`}>
                    {language === 'bn' ? stage.stageBn : stage.stageEn}
                  </div>

                  {/* Stage Items */}
                  <div className="p-3 space-y-2">
                    {stage.items.map((item, iIdx) => (
                      <div 
                        key={iIdx}
                        className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 font-semibold shadow-2xs leading-snug flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                        <span>{language === 'bn' ? item.bn : item.en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Official Accreditations */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-xs font-mono font-black text-slate-700 dark:text-slate-300">
            <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              🎓 BHAKTISASTRI
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              📜 TTC1
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              📜 TTC2
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              🏛️ BSTTC
            </span>
          </div>

        </div>

        {/* ================= 7. BLESSINGS & CENTRAL LEADERSHIP ================= */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/30 space-y-3 shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
              Invocations &amp; Blessings
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed font-serif">
              "{language === 'bn' ? VOICE_HANDBOOK_DATA.swamiBlessingBn : VOICE_HANDBOOK_DATA.swamiBlessingEn}"
            </p>
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
              — {language === 'bn' ? VOICE_HANDBOOK_DATA.swamiTitleBn : VOICE_HANDBOOK_DATA.swamiTitleEn}
            </p>
          </div>
        </div>

        {/* ================= 8. ISKCON BANGLADESH CENTRES DIRECTORY ================= */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div 
            onClick={() => setShowIskconCenters(!showIskconCenters)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Landmark size={20} className="text-indigo-600 dark:text-amber-400" />
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {language === 'bn' ? 'বাংলাদেশে ইসকন কেন্দ্রসমূহের তালিকা (ফোন ও ঠিকানা)' : 'ISKCON Centres in Bangladesh Directory'}
              </h3>
            </div>
            <button className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              {showIskconCenters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {showIskconCenters && (
            <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
              {VOICE_HANDBOOK_DATA.iskconDivisions.map((div, dIdx) => (
                <div key={dIdx} className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-amber-400 font-mono">
                    {language === 'bn' ? div.divisionNameBn : div.divisionNameEn}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {div.centers.map((c, cIdx) => (
                      <div key={cIdx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 hover:border-amber-400/40 transition-all">
                        <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <MapPin size={12} className="text-rose-500 shrink-0" />
                          <span>{c.address}</span>
                        </div>
                        <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                          <Phone size={11} />
                          <span>{c.phones.join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ================= PRESIDING DEITIES HIGH-RES DARSHAN MODAL ================= */}
      {selectedDeityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-[32px] bg-slate-950 border border-amber-500/50 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-white">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedDeityModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-amber-950 via-slate-900 to-purple-950 border-b border-amber-500/30 text-center space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs font-mono uppercase tracking-wider shadow-md">
                {language === 'bn' ? 'শ্রীবিগ্রহ নিত্য দর্শন' : 'Daily Deity Darshan'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-serif text-amber-200">
                {selectedDeityModal === 'RADHA_MADHAV'
                  ? (language === 'bn' ? 'শ্রীশ্রী রাধামাধব জিউ' : 'Sri Sri Radha Madhava')
                  : selectedDeityModal === 'GAURA_NITAI'
                    ? (language === 'bn' ? 'শ্রীশ্রী গৌর নিতাই জিউ' : 'Sri Sri Gaura Nitai')
                    : (language === 'bn' ? 'শ্রীশ্রী রাধামাধব ও শ্রীশ্রী গৌর নিতাই জিউ' : 'Sri Sri Radha Madhava & Sri Sri Gaura Nitai')}
              </h2>
              <p className="text-xs text-amber-300/80 font-mono">
                Radhamadhav Temple & Gour Nitai Ashram • Advaita VOICE, CU
              </p>
            </div>

            {/* Modal Darshan Showcase */}
            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
              
              {/* If BOTH selected, show side-by-side with full mantras */}
              {selectedDeityModal === 'BOTH' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Sri Sri Radha Madhava Column */}
                    <div className="space-y-3">
                      <div className="rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl bg-slate-900 aspect-[4/3]">
                        <img 
                          src="/assets/sri_sri_radha_madhava.jpg" 
                          alt="Sri Sri Radha Madhava" 
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2 text-center">
                        <div>
                          <span className="text-[10px] uppercase font-mono font-bold text-amber-400">
                            {language === 'bn' ? 'শ্রীকৃষ্ণ প্রণাম মন্ত্র' : 'Sri Krishna Pranama Mantra'}
                          </span>
                          <p className="text-xs sm:text-sm font-serif italic text-amber-200 mt-0.5">
                            "হে কৃষ্ণ করুণাসিন্ধো দীনবন্ধো জগৎপতে । গোপেশ গোপিকাকান্ত রাধাকান্ত নমোঽস্তু তে ॥"
                          </p>
                        </div>
                        <div className="pt-2 border-t border-amber-500/20">
                          <span className="text-[10px] uppercase font-mono font-bold text-amber-400">
                            {language === 'bn' ? 'শ্রীমতী রাধারাণী প্রণাম মন্ত্র' : 'Srimati Radharani Pranama Mantra'}
                          </span>
                          <p className="text-xs sm:text-sm font-serif italic text-amber-200 mt-0.5">
                            "তপ্তকাঞ্চনগৌরাঙ্গি রাধে বৃন্দাবনেশ্বরী । বৃষভানুসুতে দেবি প্রণমামি হরিপ্রিয়ে ॥"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sri Sri Gaura Nitai Column */}
                    <div className="space-y-3">
                      <div className="rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl bg-slate-900 aspect-[4/3]">
                        <img 
                          src="/assets/sri_sri_gaura_nitai.jpg" 
                          alt="Sri Sri Gaura Nitai" 
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/25 space-y-2 text-center">
                        <div>
                          <span className="text-[10px] uppercase font-mono font-bold text-orange-400">
                            {language === 'bn' ? 'শ্রীগৌরাঙ্গ মহাপ্রভু প্রণাম মন্ত্র' : 'Sri Gauranga Mahaprabhu Pranama Mantra'}
                          </span>
                          <p className="text-xs sm:text-sm font-serif italic text-amber-200 mt-0.5">
                            "নমো মহাবদান্যায় কৃষ্ণপ্রেমপ্রদায় তে । কৃষ্ণায় কৃষ্ণচৈতন্যনাম্নে গৌরত্বিষে নমঃ ॥"
                          </p>
                        </div>
                        <div className="pt-2 border-t border-orange-500/20">
                          <span className="text-[10px] uppercase font-mono font-bold text-orange-400">
                            {language === 'bn' ? 'শ্রীশ্রীনিত্যানন্দ প্রভু প্রণাম মন্ত্র' : 'Sri Nityananda Prabhu Pranama Mantra'}
                          </span>
                          <p className="text-xs sm:text-sm font-serif italic text-amber-200 mt-0.5">
                            "নিত্যানন্দ নমস্তুভ্যং প্রেমানন্দ-প্রদায়িনে । কলৌ কল্মষনাশায় জাহ্নবাপতয়ে নমঃ ॥"
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ) : selectedDeityModal === 'RADHA_MADHAV' ? (
                <div className="space-y-4">
                  <div className="max-w-xl mx-auto rounded-3xl overflow-hidden border-3 border-amber-400/80 shadow-2xl bg-slate-900">
                    <img 
                      src="/assets/sri_sri_radha_madhava.jpg" 
                      alt="Sri Sri Radha Madhava" 
                      className="w-full h-auto object-cover max-h-[480px] mx-auto"
                    />
                  </div>

                  {/* Both Sri Krishna & Sri Radharani Mantras */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
                      <span className="text-[10.5px] uppercase font-mono font-bold text-amber-400">
                        {language === 'bn' ? 'শ্রীকৃষ্ণ প্রণাম মন্ত্র' : 'Sri Krishna Pranama Mantra'}
                      </span>
                      <p className="text-xs sm:text-sm font-serif italic text-amber-200 leading-relaxed">
                        "হে কৃষ্ণ করুণাসিন্ধো দীনবন্ধো জগৎপতে ।<br />গোপেশ গোপিকাকান্ত রাধাকান্ত নমোঽস্তু তে ॥"
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
                      <span className="text-[10.5px] uppercase font-mono font-bold text-amber-400">
                        {language === 'bn' ? 'শ্রীমতী রাধারাণী প্রণাম মন্ত্র' : 'Srimati Radharani Pranama Mantra'}
                      </span>
                      <p className="text-xs sm:text-sm font-serif italic text-amber-200 leading-relaxed">
                        "তপ্তকাঞ্চনগৌরাঙ্গি রাধে বৃন্দাবনেশ্বরী ।<br />বৃষভানুসুতে দেবি প্রণমামি হরিপ্রিয়ে ॥"
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="max-w-xl mx-auto rounded-3xl overflow-hidden border-3 border-amber-400/80 shadow-2xl bg-slate-900">
                    <img 
                      src="/assets/sri_sri_gaura_nitai.jpg" 
                      alt="Sri Sri Gaura Nitai" 
                      className="w-full h-auto object-cover max-h-[480px] mx-auto"
                    />
                  </div>

                  {/* Both Sri Gauranga & Sri Nityananda Mantras */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center space-y-1">
                      <span className="text-[10.5px] uppercase font-mono font-bold text-orange-400">
                        {language === 'bn' ? 'শ্রীগৌরাঙ্গ মহাপ্রভু প্রণাম মন্ত্র' : 'Sri Gauranga Mahaprabhu Pranama Mantra'}
                      </span>
                      <p className="text-xs sm:text-sm font-serif italic text-amber-200 leading-relaxed">
                        "নমো মহাবদান্যায় কৃষ্ণপ্রেমপ্রদায় তে ।<br />কৃষ্ণায় কৃষ্ণচৈতন্যনাম্নে গৌরত্বিষে নমঃ ॥"
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center space-y-1">
                      <span className="text-[10.5px] uppercase font-mono font-bold text-orange-400">
                        {language === 'bn' ? 'শ্রীশ্রীনিত্যানন্দ প্রভু প্রণাম মন্ত্র' : 'Sri Nityananda Prabhu Pranama Mantra'}
                      </span>
                      <p className="text-xs sm:text-sm font-serif italic text-amber-200 leading-relaxed">
                        "নিত্যানন্দ নমস্তুভ্যং প্রেমানন্দ-প্রদায়িনে ।<br />কলৌ কল্মষনাশায় জাহ্নবাপতয়ে নমঃ ॥"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Universal Maha Mantra Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-500/15 border border-amber-400/30 text-center space-y-1.5">
                <span className="text-[10px] uppercase font-mono font-black text-amber-400 tracking-wider">
                  The Maha-Mantra for Kali-Yuga
                </span>
                <p className="text-sm sm:text-base font-black text-white font-serif leading-relaxed">
                  হরে কৃষ্ণ হরে কৃষ্ণ কৃষ্ণ কৃষ্ণ হরে হরে ।<br />
                  হরে রাম হরে রাম রাম রাম হরে হরে ॥
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-black/70 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Advaita VOICE • Presiding Deities
              </span>
              <button
                onClick={() => setSelectedDeityModal(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                {language === 'bn' ? 'জয় শ্রীল প্রভুপাদ (Close)' : 'Jay Srila Prabhupada'}
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HubHome;
