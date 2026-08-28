import React, { useState } from 'react';
import { ALL_COURSES_DATA, ALL_CAMPS_DATA } from '../../data/campsData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Compass, Award, Tent, BookOpen, MapPin, Clock, ArrowLeft, CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CoursesAndCamps: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'COURSES' | 'CAMPS'>('COURSES');

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/40 shadow-xs hover:shadow-sm transition-all group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-amber-600 dark:text-amber-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
            {language === 'bn' ? 'সকল কোর্স ও যুব শিবির' : 'All Courses & Youth Camps'}
          </span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <Compass size={13} />
              <span>Advaita VOICE • Academic Courses &amp; Youth Retreats</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'সকল কোর্স ও ইয়ুথ ক্যাম্প পোর্টাল' : 'All Courses & Youth Camps Directory'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'বিশ্ববিদ্যালয় শিক্ষার্থীদের জন্য প্রণীত ডিসকভার ইয়োর সেলফ (DYS) থেকে শুরু করে শাস্ত্রীয় ডিপ্লোমা ও বার্ষিক আধ্যাত্মিক ক্যাম্প তালিকা।'
                : 'From foundational Discover Your Self (DYS) to Bhakti Shastri diplomas and annual spiritual youth adventure retreats.'}
            </p>
          </div>
        </div>

        {/* Switch Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('COURSES')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'COURSES'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <BookOpen size={14} />
            <span>{language === 'bn' ? 'আধ্যাত্মিক কোর্সসমূহ (৫টি কোর্স)' : 'Spiritual Courses (5 Modules)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('CAMPS')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'CAMPS'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Tent size={14} />
            <span>{language === 'bn' ? 'বার্ষিক ইয়ুথ ক্যাম্প ও পরিক্রমা' : 'Youth Camps & Retreats'}</span>
          </button>
        </div>

        {/* Tab 1: Courses Grid */}
        {activeTab === 'COURSES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALL_COURSES_DATA.map(course => (
              <div 
                key={course.id}
                className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between hover:border-amber-500/50 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                      {language === 'bn' ? course.badgeBn : course.badgeEn}
                    </span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      <span>{language === 'bn' ? course.durationBn : course.durationEn}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    {language === 'bn' ? course.titleBn : course.titleEn}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'bn' ? course.descBn : course.descEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Award size={13} className="text-amber-500" />
                    <span>{course.topicsCount} {language === 'bn' ? 'টি সেশন' : 'Sessions'}</span>
                  </span>
                  
                  <Link 
                    to="/syllabus"
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    {language === 'bn' ? 'সিলেবাসে দেখুন →' : 'View Syllabus →'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Camps & Retreats Grid */}
        {activeTab === 'CAMPS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALL_CAMPS_DATA.map(camp => (
              <div 
                key={camp.id}
                className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5 flex flex-col justify-between hover:border-orange-500/50 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      <span>{language === 'bn' ? camp.durationBn : camp.durationEn}</span>
                    </span>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      <MapPin size={13} />
                      <span>{language === 'bn' ? camp.locationBn : camp.locationEn}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                    {language === 'bn' ? camp.titleBn : camp.titleEn}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'bn' ? camp.descBn : camp.descEn}
                  </p>

                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Highlights:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(language === 'bn' ? camp.highlightsBn : camp.highlightsEn).map((h, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60">
                          <CheckCircle2 size={10} className="text-orange-500" />
                          <span>{h}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Advaita VOICE Official</span>
                  <span className="text-orange-600 dark:text-orange-400">Registration Open</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CoursesAndCamps;
