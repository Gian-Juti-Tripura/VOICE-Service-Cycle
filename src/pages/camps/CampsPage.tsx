import React, { useState } from 'react';
import { DETAILED_CAMPS_DATA, type CampDetailItem } from '../../data/campsData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Tent, MapPin, Clock, ArrowLeft, 
  Calendar, ShieldAlert,
  Search, Sparkles, Send, CheckCircle2,
  Backpack, Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const CampsPage: React.FC = () => {
  const { language } = useLanguage();
  const [selectedCamp, setSelectedCamp] = useState<CampDetailItem>(DETAILED_CAMPS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCamps = DETAILED_CAMPS_DATA.filter(camp => {
    return camp.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.locationEn.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleRegisterWhatsApp = (camp: CampDetailItem) => {
    const msg = `Hare Krishna! I would like to register for the "${camp.titleEn}" (${camp.durationEn}) organized by Advaita VOICE. Please guide me with seat confirmation & registration details. 🙏`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
    toast.success('Camp registration opened in WhatsApp!');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 shadow-xs hover:shadow-md transition-all duration-200 group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-amber-600 dark:text-amber-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/courses"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <span>{language === 'bn' ? '🎓 সকল কোর্স ও কারিকুলাম দেখুন' : '🎓 View Academic Courses →'}</span>
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <Tent size={14} />
              <span>Advaita VOICE • Youth Retreats &amp; Holy Dham Yatras</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'বার্ষিক ইয়ুথ ক্যাম্প, রিট্রিট ও ধাম পরিক্রমা' : 'Youth Retreats, Camps & Dham Yatras'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'বান্দরবান আবাসিক যুব রিট্রিট, উদ্ঘোষ মেগা ফেস্ট, শ্রীমায়াপুর-বৃন্দাবন পরিক্রমা ও সাপ্তাহিক আশ্রমিক সাধনা ক্যাম্পের বিস্তারিত সূচি।'
                : 'Full details, day-by-day schedules, packing guidelines, and 1-tap registration for residential retreats and holy pilgrimages.'}
            </p>
          </div>
        </div>

        {/* 2-Column Layout: Left = Camps Directory, Right = Selected Camp Detailed Sub-sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 5 Camps Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  {language === 'bn' ? 'ক্যাম্প ও রিট্রিট তালিকা' : 'Camps & Retreats'}
                </h3>
                <span className="text-[10px] font-bold text-slate-400">
                  6 Sacred Step Camps
                </span>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'ক্যাম্প বা স্থান খুঁজুন...' : 'Search camp or location...'}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {filteredCamps.map(camp => {
                  const isSelected = selectedCamp.id === camp.id;
                  return (
                    <div
                      key={camp.id}
                      onClick={() => setSelectedCamp(camp)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-500 shadow-sm scale-101'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-mono">
                          {language === 'bn' ? camp.categoryBn : camp.categoryEn}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={11} />
                          <span>{language === 'bn' ? camp.durationBn : camp.durationEn}</span>
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug">
                        {language === 'bn' ? camp.titleBn : camp.titleEn}
                      </h4>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin size={12} className="text-rose-500 shrink-0" />
                        <span className="truncate">{language === 'bn' ? camp.locationBn : camp.locationEn}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right Column: Detailed Sections & Sub-sections for Selected Camp (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              
              {/* Header Box */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-amber-600 text-white font-mono">
                    {language === 'bn' ? selectedCamp.categoryBn : selectedCamp.categoryEn}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock size={13} className="text-amber-600" />
                    <span>{language === 'bn' ? selectedCamp.durationBn : selectedCamp.durationEn}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {language === 'bn' ? selectedCamp.titleBn : selectedCamp.titleEn}
                </h2>

                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <MapPin size={14} />
                  <span>{language === 'bn' ? selectedCamp.locationBn : selectedCamp.locationEn}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {language === 'bn' ? selectedCamp.descBn : selectedCamp.descEn}
                </p>
              </div>

              {/* Sub-section 1: Vision & Spiritual Purpose */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1 text-xs">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>{language === 'bn' ? 'ক্যাম্পের লক্ষ্য ও দূরদৃষ্টি (Vision)' : 'Camp Vision & Purpose'}</span>
                </span>
                <p className="font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                  {language === 'bn' ? selectedCamp.visionBn : selectedCamp.visionEn}
                </p>
              </div>

              {/* Sub-section 2: Schedule & Daily Timeline */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-amber-600 dark:text-amber-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    {language === 'bn' ? 'দিনভিত্তিক পূর্ণাঙ্গ কার্যসূচি ও সময়সারণী' : 'Day-by-Day Detailed Schedule'}
                  </h3>
                </div>

                <div className="space-y-3">
                  {selectedCamp.schedule.map((day, dIdx) => (
                    <div 
                      key={dIdx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                        {language === 'bn' ? day.dayTitleBn : day.dayTitleEn}
                      </h4>

                      <div className="space-y-1.5 text-[11px]">
                        {day.timeline.map((entry, eIdx) => (
                          <div key={eIdx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                            <span className="font-mono font-bold text-slate-400 shrink-0 w-24">
                              {entry.time}
                            </span>
                            <span className="font-medium">
                              {language === 'bn' ? entry.activityBn : entry.activityEn}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-section 3: Key Highlights */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-orange-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    {language === 'bn' ? 'প্রধান আকর্ষণ ও আধ্যাত্মিক কর্মকাণ্ড' : 'Key Highlights & Spiritual Activities'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(language === 'bn' ? selectedCamp.highlightsBn : selectedCamp.highlightsEn).map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      <span className="font-medium text-[11px]">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-section 4: Packing List & Guidelines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Packing List */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1">
                    <Backpack size={13} />
                    <span>{language === 'bn' ? 'প্রয়োজনীয় সাথে আনার তালিকা' : 'Packing Checklist'}</span>
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    {(language === 'bn' ? selectedCamp.packingListBn : selectedCamp.packingListEn).map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Guidelines */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide flex items-center gap-1">
                    <ShieldAlert size={13} />
                    <span>{language === 'bn' ? 'আশ্রমিক নিয়মানুবর্তিতা' : 'Camp Guidelines'}</span>
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    {(language === 'bn' ? selectedCamp.guidelinesBn : selectedCamp.guidelinesEn).map((g, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-500">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sub-section 5: Coordinator & Registration */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {language === 'bn' ? 'ক্যাম্প সমন্বয়ক ও দায়িত্বপ্রাপ্ত' : 'Camp Coordinators'}
                  </span>
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {language === 'bn' ? selectedCamp.coordinatorBn : selectedCamp.coordinatorEn}
                </p>
              </div>

              {/* Action Button: Register via WhatsApp */}
              <div className="pt-1">
                <button
                  onClick={() => handleRegisterWhatsApp(selectedCamp)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:scale-101 transition-all cursor-pointer"
                >
                  <Send size={15} />
                  <span>{language === 'bn' ? `হোয়াটসঅ্যাপে ${selectedCamp.titleBn} রেজিস্ট্রেশন করুন` : `Register for ${selectedCamp.titleEn} via WhatsApp`}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CampsPage;
