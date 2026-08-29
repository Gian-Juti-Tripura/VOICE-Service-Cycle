import React, { useState } from 'react';
import CoursesPage from './CoursesPage';
import CampsPage from './CampsPage';

export const CoursesAndCamps: React.FC = () => {
  const [tab, setTab] = useState<'COURSES' | 'CAMPS'>('COURSES');

  return (
    <div>
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2 px-4 flex justify-center gap-4">
        <button
          onClick={() => setTab('COURSES')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${tab === 'COURSES' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
        >
          🎓 All Courses
        </button>
        <button
          onClick={() => setTab('CAMPS')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${tab === 'CAMPS' ? 'bg-amber-600 text-white' : 'text-slate-500'}`}
        >
          ⛺ Youth Camps & Retreats
        </button>
      </div>
      {tab === 'COURSES' ? <CoursesPage /> : <CampsPage />}
    </div>
  );
};

export default CoursesAndCamps;
