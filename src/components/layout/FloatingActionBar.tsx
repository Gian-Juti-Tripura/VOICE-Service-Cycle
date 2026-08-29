import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowUp, Home, BookOpen, HeartHandshake } from 'lucide-react';

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
    window.addEventListener('scroll', checkScroll);
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

  return (
    <aside aria-label="Quick Actions" className="fixed bottom-5 right-5 z-50 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/90 dark:bg-slate-900/90 text-white backdrop-blur-2xl border border-amber-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all duration-300">
      {/* Back Button (shown if not home) */}
      {location.pathname !== '/' && (
        <button
          onClick={handleBack}
          title="Go Back"
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-amber-500/20 text-xs font-bold text-amber-300 hover:text-amber-200 border border-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} className="text-amber-400" />
          <span className="hidden sm:inline">Back</span>
        </button>
      )}

      {/* Hub Home Button */}
      {location.pathname !== '/' && (
        <button
          onClick={() => navigate('/')}
          title="Hub Home"
          className="p-2 rounded-xl bg-white/10 hover:bg-amber-500/20 text-xs font-bold text-amber-300 hover:text-amber-200 border border-white/10 transition-all cursor-pointer"
        >
          <Home size={15} className="text-amber-300" />
        </button>
      )}

      {/* Quick Library Button */}
      {location.pathname !== '/library' && (
        <button
          onClick={() => navigate('/library')}
          title="Sebananda E-Library"
          className="p-2 rounded-xl bg-white/10 hover:bg-amber-500/20 text-xs font-bold text-amber-300 hover:text-amber-200 border border-white/10 transition-all cursor-pointer"
        >
          <BookOpen size={15} className="text-amber-300" />
        </button>
      )}

      {/* Quick Sadhana Button */}
      {location.pathname !== '/sadhana' && (
        <button
          onClick={() => navigate('/sadhana')}
          title="Digital Sadhana Sheet"
          className="p-2 rounded-xl bg-white/10 hover:bg-amber-500/20 text-xs font-bold text-amber-300 hover:text-amber-200 border border-white/10 transition-all cursor-pointer"
        >
          <HeartHandshake size={15} className="text-amber-300" />
        </button>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Scroll to Top"
          className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md transition-all cursor-pointer"
        >
          <ArrowUp size={15} />
        </button>
      )}
    </aside>
  );
};

export default FloatingActionBar;
