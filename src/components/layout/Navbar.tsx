import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LogOut, Globe, Menu, X, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout, role } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLink = ({ to, children, icon: Icon }: { to: string, children: React.ReactNode, icon?: any }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to) && to !== '/manager');
    const isExactManager = location.pathname === '/manager' && to === '/manager';
    const active = isActive || isExactManager;

    return (
      <Link 
        to={to} 
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
          active 
            ? 'bg-primary-50 text-primary-700 shadow-sm' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
        }`}
      >
        {Icon && <Icon size={16} />}
        {children}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border-b border-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain shrink-0 animate-float drop-shadow-sm" />
          <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent truncate tracking-tight">
            {t('app.title')}
          </span>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-2 mr-2">
              {role === 'INTERNAL_MANAGER' || role === 'ADMIN' ? (
                <>
                  <NavLink to="/manager">{t('manager.dashboard')}</NavLink>
                  <NavLink to="/manager/members">{t('membersTitle')}</NavLink>
                  <NavLink to="/manager/services">{t('servicesTitle')}</NavLink>
                  {role === 'ADMIN' && (
                    <NavLink to="/manager/settings" icon={Settings}>Settings</NavLink>
                  )}
                </>
              ) : (
                <>
                  <NavLink to="/member">My Dashboard</NavLink>
                  <NavLink to="/manager">Full Schedule</NavLink>
                </>
              )}
            </div>
          )}

          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-300 shadow-sm"
          >
            <Globe size={14} className="text-primary-500" />
            <span className={language === 'bn' ? 'font-bold text-primary-700' : ''}>বাংলা</span>
            <span className="text-slate-300">|</span>
            <span className={language === 'en' ? 'font-bold text-primary-700' : ''}>EN</span>
          </button>
          
          {user && (
            <div className="flex items-center gap-3">
              <button 
                onClick={logout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300"
              >
                <LogOut size={16} />
                <span>{t('nav.logout')}</span>
              </button>
              
              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2 -mr-2 text-slate-600 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && user && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl animate-fade-in px-4 py-4 flex flex-col gap-2">
          {role === 'INTERNAL_MANAGER' || role === 'ADMIN' ? (
            <>
              <NavLink to="/manager">{t('manager.dashboard')}</NavLink>
              <NavLink to="/manager/members">{t('membersTitle')}</NavLink>
              <NavLink to="/manager/services">{t('servicesTitle')}</NavLink>
              {role === 'ADMIN' && (
                <NavLink to="/manager/settings" icon={Settings}>Settings (Admin)</NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/member">My Dashboard</NavLink>
              <NavLink to="/manager">Full Schedule</NavLink>
            </>
          )}
          <div className="h-px bg-slate-100 my-2"></div>
          <button 
            onClick={() => { logout(); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={16} />
            {t('nav.logout')}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
