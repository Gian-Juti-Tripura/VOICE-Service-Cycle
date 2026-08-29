import React, { useState } from 'react';
import { SPIRITUAL_LEADERSHIP, EXECUTIVE_LEADER, DEPARTMENTS_DATA } from '../../data/advaitaOrgData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, 
  Phone, ArrowLeft, CheckSquare, Megaphone, Plus
} from 'lucide-react';
import { PostNoticeModal } from '../../components/announcements/PostNoticeModal';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const AdvaitaOrgPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'ORG_TREE' | 'STUDY_CARE' | 'ALL_DEPTS'>((initialTab as any) || 'ORG_TREE');
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [targetNoticeRole, setTargetNoticeRole] = useState<string>('COORDINATOR');

  // Study Care Activities Data
  const [studyTasks, setStudyTasks] = useState([
    { id: 1, category: 'EXAM', text: 'Finalize CU Semester Exam Revision Circles timetable (Physics, Math, CSE, Arts)', done: true },
    { id: 2, category: 'BCS', text: 'Arrange BCS & Bank Job GK, Bangla & Math weekly mock quiz (Every Friday 8 PM)', done: true },
    { id: 3, category: 'ROUTINE', text: 'Check daily university academic study attendance logs (2 hrs minimum daily commitment)', done: true },
    { id: 4, category: 'LIBRARY', text: 'Provide CU Central Library group study passes and quiet hall schedules', done: false },
    { id: 5, category: 'TUTORING', text: 'Pair senior graduate devotees with 1st year students for subject tutoring', done: false }
  ]);

  const [newTaskText, setNewTaskText] = useState('');
  const [newCategory] = useState<'EXAM' | 'BCS' | 'ROUTINE' | 'LIBRARY'>('EXAM');

  const toggleStudyTask = (id: number) => {
    setStudyTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addStudyTask = () => {
    if (!newTaskText.trim()) return;
    setStudyTasks(prev => [...prev, { id: Date.now(), category: newCategory, text: newTaskText, done: false }]);
    setNewTaskText('');
    toast.success(language === 'bn' ? 'স্টাডি কেয়ার বোর্ডে নতুন দায়িত্ব যুক্ত হয়েছে!' : 'Task added to Study Care Board!');
  };

  const col1Depts = DEPARTMENTS_DATA.filter(d => d.branch === 1);
  const col2Depts = DEPARTMENTS_DATA.filter(d => d.branch === 2);
  const col3Depts = DEPARTMENTS_DATA.filter(d => d.branch === 3);

  const getRoleKeyFromDeptId = (id: string): string => {
    const map: Record<string, string> = {
      internal_manager: 'INTERNAL_MGR',
      morning_program: 'MORNING_PROG',
      kitchen_incharge: 'KITCHEN_INCHARGE',
      study_care: 'STUDY_CARE',
      medical_guest: 'MEDICAL_GUEST',
      security_energy: 'SECURITY_ENERGY',
      accounts: 'ACCOUNTS',
      deity_care: 'DEITY_CARE',
      easy_memberships: 'EASY_MEMBERSHIPS',
      cleanliness_water: 'CLEANLINESS_WATER',
      tulasi_care: 'TULASI_CARE',
      sadhana_resources: 'SADHANA_RESOURCES',
      preaching_coordinator: 'PREACHING_COORD',
      monthly_report: 'MONTHLY_REPORT',
      course_camps: 'COURSE_CAMPS',
      btg_cs: 'BTG_CS',
      course_camp_assistant: 'COURSE_CAMP_ASST',
      programme_festivals: 'PROGRAMME_FESTIVALS'
    };
    return map[id] || 'GENERAL';
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center justify-between pb-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/40 shadow-xs hover:shadow-sm transition-all group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-rose-600 dark:text-rose-400" />
            <span>{language === 'bn' ? 'হাব হোমে ফিরে যান' : 'Back to Hub Home'}</span>
          </Link>
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
            ADVAITA VOICE Management System • University of Chittagong
          </span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-700 via-pink-700 to-rose-900 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <Users size={13} />
              <span>Advaita VOICE Official Hierarchy &amp; Management Board</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'অদ্বৈত ভয়েস পরিচালনা পরিষদ ও সকল বিভাগ' : 'ADVAITA VOICE Management System'}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-3xl leading-relaxed">
              {language === 'bn'
                ? 'চট্টগ্রাম বিশ্ববিদ্যালয় শাখার আধ্যাত্মিক নেতৃত্ব, সার্বিক সমন্বয়ক ও ১৮টি বিভাগীয় দায়িত্বপ্রাপ্ত সেবকদের পূর্ণাঙ্গ পরিচালনা চার্ট।'
                : 'Spiritual leadership, overall coordinator, and the authentic 3-branch operational hierarchy of all 18 departments.'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 flex-wrap">
          <button
            onClick={() => setActiveTab('ORG_TREE')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'ORG_TREE' 
                ? 'bg-rose-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {language === 'bn' ? '🌳 সম্পূর্ণ পরিচালনা চার্ট (Org Tree)' : '🌳 Full Management Chart (Org Tree)'}
          </button>

          <button
            onClick={() => setActiveTab('STUDY_CARE')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'STUDY_CARE' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {language === 'bn' ? '🎓 স্টাডি কেয়ার বোর্ড (জ্ঞান ও প্রান্ত)' : '🎓 Study Care Board (Gian & Pranto)'}
          </button>

          <button
            onClick={() => setActiveTab('ALL_DEPTS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'ALL_DEPTS' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {language === 'bn' ? '📋 ১৮টি বিভাগীয় তালিকা (18 Depts)' : '📋 All 18 Department Cards'}
          </button>
        </div>

        {/* TAB 1: Authentic Organizational Tree matching the PDF Diagram */}
        {activeTab === 'ORG_TREE' && (
          <div className="space-y-6">
            
            {/* Top Spiritual Leadership Section */}
            <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono">
                  SPIRITUAL ADVISERS &amp; GUARDIANS
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {language === 'bn' ? 'আধ্যাত্মিক অভিভাবক ও উপদেষ্টা পরিষদ' : 'Spiritual Leadership & Project Advisers'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SPIRITUAL_LEADERSHIP.map(leader => (
                  <div 
                    key={leader.id}
                    className="rounded-2xl p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono">
                        {leader.level}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-1.5">
                        {leader.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {language === 'bn' ? leader.roleBn : leader.roleEn}
                      </p>
                    </div>

                    {leader.phone && (
                      <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                        <a href={`tel:${leader.phone}`} className="font-mono text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1">
                          <Phone size={11} />
                          <span>{leader.phone}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Central Connector: Overall Co-Ordinator (OC) */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-rose-400 dark:bg-rose-600" />
              
              <div className="w-full max-w-md rounded-3xl p-5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white text-center shadow-xl border-2 border-rose-400/40 space-y-2">
                <span className="text-[10px] font-black uppercase px-3 py-0.5 rounded-full bg-white/20 tracking-wider">
                  CENTRAL EXECUTIVE LEADER
                </span>
                <h3 className="text-lg sm:text-xl font-black">
                  {EXECUTIVE_LEADER.name}
                </h3>
                <p className="text-xs text-rose-100 font-bold">
                  {language === 'bn' ? EXECUTIVE_LEADER.roleBn : EXECUTIVE_LEADER.roleEn}
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  {EXECUTIVE_LEADER.phone && (
                    <a 
                      href={`tel:${EXECUTIVE_LEADER.phone}`} 
                      className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Phone size={12} />
                      <span>{EXECUTIVE_LEADER.phone}</span>
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setTargetNoticeRole('COORDINATOR');
                      setIsNoticeModalOpen(true);
                    }}
                    className="px-3.5 py-1 rounded-xl bg-white text-slate-950 text-xs font-black inline-flex items-center gap-1.5 shadow-md cursor-pointer hover:bg-rose-50"
                  >
                    <Megaphone size={12} className="text-rose-600" />
                    <span>{language === 'bn' ? '📢 নোটিশ দিন' : '📢 Post Notice'}</span>
                  </button>
                </div>
              </div>

              <div className="w-0.5 h-6 bg-rose-400 dark:bg-rose-600" />
            </div>

            {/* 3 Operational Branches (Replica of the 3-Column Diagram) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Column 1: Ashram & Daily Operations */}
              <div className="rounded-3xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider font-mono">
                    BRANCH 1
                  </span>
                  <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">
                    Ashram Operations
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {col1Depts.map(d => (
                    <div 
                      key={d.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {d.nameEn}
                        </h5>
                        <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 truncate">
                          {d.incharge}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setTargetNoticeRole(getRoleKeyFromDeptId(d.id));
                          setIsNoticeModalOpen(true);
                        }}
                        title={`Post notice for ${d.nameEn}`}
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 shadow-2xs cursor-pointer shrink-0"
                      >
                        <Megaphone size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Ashram Services & Maintenance */}
              <div className="rounded-3xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider font-mono">
                    BRANCH 2
                  </span>
                  <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">
                    Services &amp; Maintenance
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {col2Depts.map(d => (
                    <div 
                      key={d.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {d.nameEn}
                        </h5>
                        <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate">
                          {d.incharge}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setTargetNoticeRole(getRoleKeyFromDeptId(d.id));
                          setIsNoticeModalOpen(true);
                        }}
                        title={`Post notice for ${d.nameEn}`}
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 shadow-2xs cursor-pointer shrink-0"
                      >
                        <Megaphone size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Preaching, Courses & Festivals */}
              <div className="rounded-3xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider font-mono">
                    BRANCH 3
                  </span>
                  <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">
                    Preaching &amp; Festivals
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {col3Depts.map(d => (
                    <div 
                      key={d.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {d.nameEn}
                        </h5>
                        <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 truncate">
                          {d.incharge}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setTargetNoticeRole(getRoleKeyFromDeptId(d.id));
                          setIsNoticeModalOpen(true);
                        }}
                        title={`Post notice for ${d.nameEn}`}
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 shadow-2xs cursor-pointer shrink-0"
                      >
                        <Megaphone size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: Study Care Board */}
        {activeTab === 'STUDY_CARE' && (
          <div className="space-y-6">
            
            {/* Header Spotlight */}
            <div className="rounded-2xl p-5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-200 dark:border-blue-900/40 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-blue-600 text-white">
                  Academic &amp; Student Welfare In-Charge
                </span>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 font-mono">
                  University of Chittagong
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Gian Juti Tripura + Pranto C Das
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'bn'
                  ? 'বিশ্ববিদ্যালয় পরীক্ষা প্রস্তুতি, সেমিস্টার স্টাডি সার্কেল, বিসিএস ও চাকরির কুইজ এবং দৈনিক ২ ঘণ্টার পাঠ্যাভ্যাস নিশ্চিতকরণ।'
                  : 'Coordinating university exam schedules, BCS & job preparation quizzes, daily study commitments, and academic tutoring.'}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setTargetNoticeRole('STUDY_CARE');
                    setIsNoticeModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black inline-flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Megaphone size={14} />
                  <span>{language === 'bn' ? '📢 স্টাডি কেয়ার নোটিশ পোস্ট করুন (জ্ঞান ও প্রান্ত)' : '📢 Post Study Care Notice'}</span>
                </button>
              </div>
            </div>

            {/* Study Care 4 Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-base">📚</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Semester Exam Circles</h4>
                <p className="text-[11px] text-slate-500 leading-tight">Subject-wise peer groups &amp; syllabus tracking.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-base">🎯</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">BCS &amp; Job Prep Board</h4>
                <p className="text-[11px] text-slate-500 leading-tight">Weekly GK, Math &amp; Bangla quiz competitions.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-base">⏱️</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Daily 2-Hour Routine</h4>
                <p className="text-[11px] text-slate-500 leading-tight">Strict study hours before evening classes.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-base">🏛️</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Library Access</h4>
                <p className="text-[11px] text-slate-500 leading-tight">CU Library group passes &amp; quiet zone.</p>
              </div>
            </div>

            {/* Interactive Task & Activity Board */}
            <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare size={16} className="text-blue-600" />
                  <span>{language === 'bn' ? 'স্টাডি কেয়ার একশন প্ল্যান ও চেকলিস্ট' : 'Study Care Action Plan & Tasks'}</span>
                </h4>
                <span className="text-xs font-bold text-blue-600">
                  {studyTasks.filter(t => t.done).length}/{studyTasks.length} Completed
                </span>
              </div>

              {/* Add New Task */}
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder={language === 'bn' ? 'নতুন স্টাডি কেয়ার দায়িত্ব লিখুন...' : 'Add new study care activity/task...'}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={addStudyTask}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{language === 'bn' ? 'যুক্ত করুন' : 'Add Task'}</span>
                </button>
              </div>

              {/* Task Items */}
              <div className="space-y-2">
                {studyTasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => toggleStudyTask(task.id)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      task.done 
                        ? 'bg-blue-50/50 border-blue-100 text-slate-400 dark:bg-slate-800/40 dark:border-slate-800' 
                        : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox"
                        checked={task.done}
                        onChange={() => {}}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className={task.done ? 'line-through opacity-80' : 'font-semibold'}>
                        {task.text}
                      </span>
                    </div>

                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 shrink-0">
                      {task.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: All 18 Departments Grid */}
        {activeTab === 'ALL_DEPTS' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {language === 'bn' ? '১৮টি বিভাগীয় দায়িত্বপ্রাপ্ত ভক্তদের পূর্ণাঙ্গ তালিকা' : 'All 18 Department In-Charges'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {DEPARTMENTS_DATA.map(dept => (
                <div 
                  key={dept.id}
                  className="rounded-3xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      Branch {dept.branch} • {dept.category}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                      {dept.nameEn}
                    </h4>
                    <p className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                      In-Charge: {dept.incharge}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === 'bn' ? dept.descriptionBn : dept.descriptionEn}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setTargetNoticeRole(getRoleKeyFromDeptId(dept.id));
                        setIsNoticeModalOpen(true);
                      }}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Megaphone size={13} />
                      <span>{language === 'bn' ? '📢 নোটিশ পোস্ট করুন' : '📢 Post Notice'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Department Notice Modal */}
      <PostNoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        initialRoleKey={targetNoticeRole}
      />
    </div>
  );
};

export default AdvaitaOrgPage;
