import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LogOut, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout, role } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl drop-shadow-sm">🪷</span>
          <span className="font-bold text-lg bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
            {t('app.title')}
          </span>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          {user && role === 'INTERNAL_MANAGER' && (
            <div className="hidden md:flex items-center gap-6 mr-4">
              <Link to="/manager" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                {t('manager.dashboard')}
              </Link>
              <Link to="/manager/members" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                {t('membersTitle')}
              </Link>
              <Link to="/manager/services" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                {t('servicesTitle')}
              </Link>
            </div>
          )}

          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Globe size={16} />
            <span className={language === 'bn' ? 'font-bold text-primary-600' : ''}>বাংলা</span>
            <span className="text-slate-300">|</span>
            <span className={language === 'en' ? 'font-bold text-primary-600' : ''}>EN</span>
          </button>
          
          {user && (
            <button 
              onClick={logout}
              className="flex items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{t('nav.logout')}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
