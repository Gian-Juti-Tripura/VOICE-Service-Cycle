import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowLeft, ShieldCheck, UserCheck, KeyRound } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (error) throw error;
        toast.success(language === 'bn' ? 'স্বাগতম! সফলভাবে লগইন হয়েছে।' : 'Welcome back! Logged in successfully.');
        navigate('/');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password
        });
        if (error) throw error;
        
        toast.success(language === 'bn' ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account created successfully! Welcome.');
        if (data.session) {
          navigate('/');
        }
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.message || err.toString();
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('voice123456');
    toast.success(language === 'bn' ? 'ডেমো তথ্য পূরণ করা হয়েছে' : 'Demo credentials filled');
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-amber-300 font-medium animate-pulse text-sm">
          {language === 'bn' ? 'লগইন যাচাই করা হচ্ছে...' : 'Verifying authentication...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-10 px-4 sm:px-6 relative z-10">
      
      {/* Background Ambience Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <div className="w-full max-w-md relative">
        
        {/* Outer Glow Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>

        <div className="relative bg-slate-950/90 dark:bg-slate-950/95 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-slate-950/80">
          
          {/* Header & Emblem */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-indigo-600/20 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <span className="text-3xl">🪷</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-950 animate-ping" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-950" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
              {isLogin 
                ? (language === 'bn' ? 'অদ্বৈত ভয়েস হাব' : 'Advaita VOICE Hub') 
                : (language === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create VOICE Account')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              {language === 'bn' ? 'চট্টগ্রাম বিশ্ববিদ্যালয় ও ইসকন নন্দনকানন' : 'University of Chittagong & ISKCON'}
            </p>
          </div>

          {/* Tab Switcher (Sign In vs Sign Up) */}
          <div className="flex p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'bn' ? 'লগইন (Sign In)' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'bn' ? 'রেজিস্ট্রেশন (Sign Up)' : 'Sign Up'}
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-950/80 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl mb-5 text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-fade-in shadow-inner">
              <span className="text-rose-400 text-base mt-0.5">⚠️</span>
              <p className="flex-1 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="email">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                {language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder:text-slate-500 transition-all outline-none" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="gianjuti.csecu@gmail.com"
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="password">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 rounded-xl pl-4 pr-11 py-3 text-slate-100 text-sm placeholder:text-slate-500 transition-all outline-none" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••••••"
                  minLength={6}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1.5 rounded-lg"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full mt-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>{language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Processing...'}</span>
                </span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{isLogin ? (language === 'bn' ? 'লগইন করুন' : 'Sign In to Hub') : (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {language === 'bn' ? 'কুইক ডেমো লগইন' : 'Quick Demo Logins'}
              </span>
              <span className="text-[10px] text-slate-500">1-Click Fill</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('rasvihari.voice@gmail.com')}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-lg text-left text-[11px] text-slate-300 hover:text-amber-300 transition-all flex items-center gap-1.5 truncate"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">Caretaker / Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('gianjyoti.cse.cu@gmail.com')}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-lg text-left text-[11px] text-slate-300 hover:text-amber-300 transition-all flex items-center gap-1.5 truncate"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">IT / Manager</span>
              </button>
            </div>
          </div>

          {/* Back to Hub Navigation */}
          <div className="mt-6 text-center">
            <Link 
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'হোম পেইজে ফিরে যান' : 'Return to Hub Home'}</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
