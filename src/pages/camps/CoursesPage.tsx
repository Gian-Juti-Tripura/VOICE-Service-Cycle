import React, { useState } from 'react';
import { DETAILED_COURSES_DATA, type CourseDetailItem } from '../../data/campsData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  GraduationCap, Clock, ArrowLeft, CheckCircle2, 
  BookOpen, Award, FileText,
  Search, Layers, UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const CoursesPage: React.FC = () => {
  const { language } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<CourseDetailItem>(DETAILED_COURSES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLevelFilter, setActiveLevelFilter] = useState<'ALL' | 'FOUNDATION' | 'INTERMEDIATE' | 'DIPLOMA' | 'LEADERSHIP'>('ALL');

  const filteredCourses = DETAILED_COURSES_DATA.filter(course => {
    const matchesSearch = course.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeLevelFilter === 'FOUNDATION') return course.code === 'DYS';
    if (activeLevelFilter === 'INTERMEDIATE') return course.code === 'EBG' || course.code === 'VVS';
    if (activeLevelFilter === 'DIPLOMA') return course.code === 'BBS';
    if (activeLevelFilter === 'LEADERSHIP') return course.code === 'PTC' || course.code === 'VES';
    return true;
  });

  const handleInquireWhatsApp = (course: CourseDetailItem) => {
    const msg = `Hare Krishna! I am interested in enrolling in the "${course.titleEn}" (${course.code}) at Advaita VOICE. Please provide details regarding the next batch registration. 🙏`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
    toast.success('Inquiry opened in WhatsApp!');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs hover:shadow-md transition-all duration-200 group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-indigo-600 dark:text-indigo-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/camps"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <span>{language === 'bn' ? '⛺ যুব শিবির ও ক্যাম্প দেখুন' : '⛺ View Youth Camps & Retreats →'}</span>
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <GraduationCap size={14} />
              <span>Advaita VOICE • Academic Curriculum &amp; Diplomas</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'সকল বৈদিক কোর্স ও ডিপ্লোমা পাঠ্যক্রম' : 'All VOICE Vedic Courses & Certifications'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'ডিসকভার ইয়োর সেলফ (DYS) থেকে শুরু করে ভক্তি শাস্ত্রী ডিপ্লোমা ও প্রচারক প্রশিক্ষণ—সকল কোর্সের বিস্তারিত সেশন, কারিকুলাম ও মূল্যায়ন নির্দেশিকা।'
                : 'Systematic study from foundational Discover Your Self (DYS) to authoritative Bhakti Shastri diplomas and Youth Leadership certificates.'}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
          {[
            { key: 'ALL', labelEn: 'All 6 Courses', labelBn: 'সকল ৬টি কোর্স' },
            { key: 'FOUNDATION', labelEn: 'Foundation (DYS)', labelBn: 'ভিত্তিপ্রস্তর (DYS)' },
            { key: 'INTERMEDIATE', labelEn: 'Intermediate (EBG, VVS)', labelBn: 'ইন্টারমিডিয়েট (EBG, VVS)' },
            { key: 'DIPLOMA', labelEn: 'Bhakti Shastri Diploma', labelBn: 'ভক্তি শাস্ত্রী ডিপ্লোমা' },
            { key: 'LEADERSHIP', labelEn: 'Leadership & Preaching (PTC, VES)', labelBn: 'নেতৃত্ব ও প্রচার (PTC, VES)' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveLevelFilter(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                activeLevelFilter === tab.key
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {language === 'bn' ? tab.labelBn : tab.labelEn}
            </button>
          ))}
        </div>

        {/* 2-Column Layout: Left = Course Directory, Right = Selected Course Detailed Sub-sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 6 Courses Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  {language === 'bn' ? 'কোর্স তালিকা' : 'Available Courses'}
                </h3>
                <span className="text-[10px] font-bold text-slate-400">
                  {filteredCourses.length} Courses
                </span>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'কোর্স খুঁজুন (DYS, EBG)...' : 'Search course code or name...'}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {filteredCourses.map(course => {
                  const isSelected = selectedCourse.id === course.id;
                  return (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 shadow-sm scale-101'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono">
                          {course.code} • {language === 'bn' ? course.levelBn : course.levelEn}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={11} />
                          <span>{course.sessions.length} Sessions</span>
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug">
                        {language === 'bn' ? course.titleBn : course.titleEn}
                      </h4>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {language === 'bn' ? course.descBn : course.descEn}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right Column: Detailed Sections & Sub-sections for Selected Course (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              
              {/* Header Box */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-mono">
                    {selectedCourse.code} • {language === 'bn' ? selectedCourse.levelBn : selectedCourse.levelEn}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock size={13} className="text-indigo-600" />
                    <span>{language === 'bn' ? selectedCourse.durationBn : selectedCourse.durationEn}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {language === 'bn' ? selectedCourse.titleBn : selectedCourse.titleEn}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'bn' ? selectedCourse.descBn : selectedCourse.descEn}
                </p>
              </div>

              {/* Sub-section 1: Target Audience & Prerequisites */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1">
                    <UserCheck size={12} />
                    <span>{language === 'bn' ? 'উদ্দিষ্ট শিক্ষার্থী (Target Audience)' : 'Target Audience'}</span>
                  </span>
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    {language === 'bn' ? selectedCourse.targetAudienceBn : selectedCourse.targetAudienceEn}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide flex items-center gap-1">
                    <Layers size={12} />
                    <span>{language === 'bn' ? 'পূর্বশর্ত (Prerequisites)' : 'Prerequisites'}</span>
                  </span>
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    {language === 'bn' ? selectedCourse.prerequisitesBn : selectedCourse.prerequisitesEn}
                  </p>
                </div>
              </div>

              {/* Sub-section 2: Curriculum & Session-by-Session Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    {language === 'bn' ? 'সেশনভিত্তিক বিস্তারিত কারিকুলাম' : 'Curriculum & Session Breakdown'}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {selectedCourse.sessions.map((sess, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5"
                    >
                      <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {language === 'bn' ? sess.titleBn : sess.titleEn}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {language === 'bn' ? sess.summaryBn : sess.summaryEn}
                      </p>
                      
                      {/* Key Topics Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(language === 'bn' ? sess.keyTopicsBn : sess.keyTopicsEn).map((topic, tIdx) => (
                          <span 
                            key={tIdx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          >
                            • {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-section 3: Study Materials & Books */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-amber-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    {language === 'bn' ? 'পাঠ্যপুস্তক ও অধ্যয়ন সামগ্রী' : 'Study Materials & Reference Books'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(language === 'bn' ? selectedCourse.materialsBn : selectedCourse.materialsEn).map((mat, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      <span className="font-medium text-[11px]">{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-section 4: Examination & Certification */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-amber-600 dark:text-amber-400" />
                  <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase">
                    {language === 'bn' ? 'মূল্যায়ন ও সনদপত্র (Assessment & Certificate)' : 'Assessment & Certification'}
                  </h4>
                </div>
                <div className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                  <div><strong>{language === 'bn' ? 'পরীক্ষা পদ্ধতি:' : 'Exam Format:'}</strong> {language === 'bn' ? selectedCourse.examFormatBn : selectedCourse.examFormatEn}</div>
                  <div><strong>{language === 'bn' ? 'সনদপত্র:' : 'Certificate:'}</strong> {language === 'bn' ? selectedCourse.certificationBn : selectedCourse.certificationEn}</div>
                </div>
              </div>

              {/* Action Button: Inquire via WhatsApp */}
              <div className="pt-2">
                <button
                  onClick={() => handleInquireWhatsApp(selectedCourse)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:scale-101 transition-all cursor-pointer"
                >
                  <GraduationCap size={15} />
                  <span>{language === 'bn' ? `হোয়াটসঅ্যাপে ${selectedCourse.code} কোর্সে রেজিস্ট্রেশন ও তথ্য জানুন` : `Inquire & Register for ${selectedCourse.code} via WhatsApp`}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CoursesPage;
