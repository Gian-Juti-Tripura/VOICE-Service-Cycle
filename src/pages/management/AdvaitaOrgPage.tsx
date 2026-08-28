import React, { useState } from 'react';
import { SPIRITUAL_LEADERSHIP, EXECUTIVE_LEADER, DEPARTMENTS_DATA } from '../../data/advaitaOrgData';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, Sparkles, 
  Phone, ArrowLeft, CheckSquare, Plus
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const AdvaitaOrgPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'ORG' | 'STUDY_CARE' | 'ALL_DEPTS' | 'FESTIVALS'>((initialTab as any) || 'ORG');

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

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
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
            {language === 'bn' ? 'অদ্বৈত পরিচালনা ও সকল বিভাগ' : 'Advaita VOICE Org (All Depts)'}
          </span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-700 via-pink-700 to-rose-900 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <Users size={13} />
              <span>Advaita VOICE Management System • University of Chittagong</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'bn' ? 'অদ্বৈত ভয়েস পরিচালনা পরিষদ ও সকল বিভাগ' : 'Advaita VOICE Org (All Depts)'}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'চট্টগ্রাম বিশ্ববিদ্যালয় শাখার আধ্যাত্মিক নেতৃত্ব, সার্বিক সমন্বয়ক ও বিভাগীয় দায়িত্বপ্রাপ্ত ভক্তদের পরিচালনা প্ল্যাটফর্ম।'
                : 'Spiritual leadership council, executive coordination, Study Care board, and all active department action trees.'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 flex-wrap">
          <button
            onClick={() => setActiveTab('ORG')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ORG' 
                ? 'bg-rose-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {language === 'bn' ? '🏛️ পরিচালনা পরিষদ' : '🏛️ Leadership Council'}
          </button>

          <button
            onClick={() => setActiveTab('STUDY_CARE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'STUDY_CARE' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {language === 'bn' ? '🎓 স্টাডি কেয়ার বোর্ড (জ্ঞান জ্যোতি ও প্রান্ত)' : '🎓 Study Care Board (Gian & Pranto)'}
          </button>

          <button
            onClick={() => setActiveTab('ALL_DEPTS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ALL_DEPTS' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {language === 'bn' ? '📋 সকল বিভাগসমূহ (All Depts)' : '📋 All Departments'}
          </button>
        </div>

        {/* TAB 1: Leadership Council */}
        {activeTab === 'ORG' && (
          <div className="space-y-6">
            
            {/* Overall Coordinator Banner */}
            <div className="rounded-2xl p-5 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-transparent border border-rose-200 dark:border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-600 text-white">
                  Executive Leadership
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {EXECUTIVE_LEADER.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {language === 'bn' ? EXECUTIVE_LEADER.roleBn : EXECUTIVE_LEADER.roleEn} • {language === 'bn' ? EXECUTIVE_LEADER.descriptionBn : EXECUTIVE_LEADER.descriptionEn}
                </p>
              </div>

              {EXECUTIVE_LEADER.phone && (
                <a 
                  href={`tel:${EXECUTIVE_LEADER.phone}`} 
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <Phone size={13} />
                  <span>{EXECUTIVE_LEADER.phone}</span>
                </a>
              )}
            </div>

            {/* Spiritual Guardians Grid */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>{language === 'bn' ? 'আধ্যাত্মিক অভিভাবক ও উপদেষ্টা পরিষদ' : 'Spiritual Guardians & Advisers'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {SPIRITUAL_LEADERSHIP.map(leader => (
                  <div 
                    key={leader.id}
                    className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                        {leader.level}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                        {leader.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {language === 'bn' ? leader.roleBn : leader.roleEn}
                      </p>
                    </div>

                    {leader.phone && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
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

          </div>
        )}

        {/* TAB 2: Study Care Board (Gian Juti Tripura & Pranto C Das) */}
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
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-blue-700 shadow-xs"
                >
                  <Plus size={14} />
                  <span>{language === 'bn' ? 'যুক্ত করুন' : 'Add'}</span>
                </button>
              </div>

              {/* Task Items */}
              <div className="space-y-2 pt-1">
                {studyTasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => toggleStudyTask(task.id)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      task.done 
                        ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/40 text-slate-700 dark:text-slate-300' 
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

        {/* TAB 3: All Departments */}
        {activeTab === 'ALL_DEPTS' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'সকল বিভাগীয় দায়িত্বপ্রাপ্ত ভক্তদের তালিকা' : 'All Department Heads & Boards'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {DEPARTMENTS_DATA.map(dept => (
                <div 
                  key={dept.id}
                  className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {dept.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                      {language === 'bn' ? dept.nameBn : dept.nameEn}
                    </h4>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      In-Charge: {dept.incharge}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {language === 'bn' ? dept.descriptionBn : dept.descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdvaitaOrgPage;
