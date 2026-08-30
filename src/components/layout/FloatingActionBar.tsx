import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowUp } from 'lucide-react';

export const FloatingActionBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (window.history.length > 1 && location.pathname !== '/') {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Only render if scrolled or on a subpage where back action is useful
  const isSubPage = location.pathname !== '/';

  return (
    <aside 
      aria-label="Quick Actions" 
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-30 flex flex-col items-end gap-2 pointer-events-none transition-all duration-300"
    >
      {/* Floating Back Button (only on sub-pages on mobile/tablet) */}
      {isSubPage && (
        <button
          onClick={handleBack}
          title="Go Back"
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-md text-xs font-semibold hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={14} className="text-amber-500" />
          <span className="text-[11px]">Back</span>
        </button>
      )}

      {/* Conventional Floating Scroll-To-Top FAB */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Scroll to Top"
          className="pointer-events-auto w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl border border-amber-300/40 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer animate-in fade-in zoom-in-75"
        >
          <ArrowUp size={18} className="stroke-[2.5]" />
        </button>
      )}
    </aside>
  );
};

export default FloatingActionBar;
