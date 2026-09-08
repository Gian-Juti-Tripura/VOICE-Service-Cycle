import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Eye, EyeOff, Mail, Lock, Sparkles, ArrowLeft, ShieldCheck, 
  UserCheck, KeyRound, Users, CheckCircle2, AlertTriangle, 
  Phone, Copy, Check, HelpCircle, Search, X
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient';
import toast from 'react-hot-toast';
import { triggerHaptic } from '../../utils/haptics';
import { INITIAL_DEVOTEES_DATA, type DevoteeProfile } from '../../data/devoteeProfilesData';

export type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT' | 'RESET';

interface LoginProps {
  defaultMode?: AuthMode;
}

export const Login: React.FC<LoginProps> = ({ defaultMode }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<AuthMode>(defaultMode || 'LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Devotee Directory Modal
  const [showDevoteesModal, setShowDevoteesModal] = useState(false);
  const [devoteeSearch, setDevoteeSearch] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Redirect if already logged in and not in password reset recovery mode
  useEffect(() => {
    if (user && !authLoading && mode !== 'RESET') {
      navigate('/');
    }
  }, [user, authLoading, mode, navigate]);

  // Check URL parameters, hash, or recovery events
  useEffect(() => {
    if (defaultMode) {
      setMode(defaultMode);
      return;
    }

    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);

    if (
      hash.includes('type=recovery') || 
      searchParams.get('type') === 'recovery' || 
      location.pathname === '/reset-password'
    ) {
      setMode('RESET');
      toast.success(
        isBn 
          ? 'পাসওয়ার্ড রিকভারি মোড সক্রিয় হয়েছে। অনুগ্রহ করে নতুন পাসওয়ার্ড দিন।' 
          : 'Password recovery mode active. Please enter your new password.'
      );
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('RESET');
        toast.success(
          isBn 
            ? 'পাসওয়ার্ড রিকভারি মোড সক্রিয় হয়েছে। অনুগ্রহ করে নতুন পাসওয়ার্ড দিন।' 
            : 'Password recovery active. Please enter your new password.'
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [defaultMode, isBn, location.pathname]);

  // Filtered devotees for the directory modal
  const filteredDevotees = useMemo(() => {
    const q = devoteeSearch.trim().toLowerCase();
    if (!q) return INITIAL_DEVOTEES_DATA;
    return INITIAL_DEVOTEES_DATA.filter((d) => 
      d.name.toLowerCase().includes(q) ||
      (d.spiritualName && d.spiritualName.toLowerCase().includes(q)) ||
      d.gmail.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      d.department.toLowerCase().includes(q)
    );
  }, [devoteeSearch]);

  // Handle standard Login or Sign Up
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'LOGIN') {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });
        if (signInErr) throw signInErr;

        triggerHaptic('success');
        toast.success(isBn ? 'স্বাগতম! সফলভাবে লগইন হয়েছে।' : 'Welcome back! Logged in successfully.');
        navigate('/');
      } else if (mode === 'SIGNUP') {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password
        });
        if (signUpErr) throw signUpErr;

        triggerHaptic('success');
        toast.success(isBn ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account created successfully! Welcome.');
        if (data.session) {
          navigate('/');
        } else {
          setSuccessMsg(
            isBn 
              ? 'আপনার ইমেইলে কনফার্মেশন লিংক পাঠানো হয়েছে। অনুগ্রহ করে ইমেইল চেক করুন।' 
              : 'Confirmation link sent to your email. Please verify your account.'
          );
        }
      }
    } catch (err: any) {
      console.error(err);
      triggerHaptic('warning');
      const rawMsg = err.message || err.toString();
      let friendlyMsg = rawMsg;
      if (rawMsg.includes('Invalid login credentials')) {
        friendlyMsg = isBn 
          ? 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়! অনুগ্রহ করে পুনরায় চেষ্টা করুন অথবা পাসওয়ার্ড রিসেট করুন।' 
          : 'Invalid email or password! Please check your credentials or reset your password.';
      }
      setError(friendlyMsg);
      toast.error(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending password reset email
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail) {
      setError(isBn ? 'অনুগ্রহ করে আপনার রেজিস্টার্ড ইমেইল অ্যাড্রেস দিন।' : 'Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const redirectToUrl = `${window.location.origin}/reset-password`;
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: redirectToUrl
      });
      if (resetErr) throw resetErr;

      triggerHaptic('success');
      setSuccessMsg(
        isBn 
          ? `একটি সিকিউর পাসওয়ার্ড রিসেট লিঙ্ক আপনার ইমেইলে (${targetEmail}) পাঠানো হয়েছে! অনুগ্রহ করে ইনবক্স অথবা স্প্যাম (Spam) ফোল্ডার চেক করুন।` 
          : `A secure password reset link has been sent to ${targetEmail}! Please check your inbox and spam folder.`
      );
      toast.success(isBn ? 'পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হয়েছে!' : 'Password reset link sent!');
    } catch (err: any) {
      console.error(err);
      triggerHaptic('warning');
      const rawMsg = err.message || err.toString();
      setError(rawMsg);
      toast.error(rawMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle setting a new password (after clicking reset link)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setError(isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(isBn ? 'উভয় পাসওয়ার্ড মেলেনি! দয়া করে সঠিকভাবে লিখুন।' : 'Passwords do not match! Please check again.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (updateErr) throw updateErr;

      triggerHaptic('success');
      toast.success(
        isBn 
          ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! আপনাকে স্বাগতম।' 
          : 'Password updated successfully! Welcome back.'
      );
      navigate('/');
    } catch (err: any) {
      console.error(err);
      triggerHaptic('warning');
      const rawMsg = err.message || err.toString();
      setError(rawMsg);
      toast.error(rawMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDevotee = (devotee: DevoteeProfile) => {
    triggerHaptic('selection');
    setEmail(devotee.gmail);
    setPassword('voice123456');
    setShowDevoteesModal(false);
    setError('');
    toast.success(
      isBn 
        ? `${devotee.name}-এর রেজিস্টার্ড ইমেইল নির্বাচন করা হয়েছে` 
        : `Selected ${devotee.name}'s email`
    );
  };

  const handleCopyEmail = (e: React.MouseEvent, copyText: string) => {
    e.stopPropagation();
    triggerHaptic('selection');
    navigator.clipboard.writeText(copyText);
    setCopiedEmail(copyText);
    toast.success(isBn ? 'ইমেইল কপি করা হয়েছে' : 'Email copied to clipboard');
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleDemoFill = (demoEmail: string) => {
    triggerHaptic('selection');
    setEmail(demoEmail);
    setPassword('voice123456');
    setError('');
    toast.success(isBn ? 'ডেমো তথ্য পূরণ করা হয়েছে' : 'Demo credentials filled');
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-amber-300 font-medium animate-pulse text-sm">
          {isBn ? 'লগইন যাচাই করা হচ্ছে...' : 'Verifying authentication...'}
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

        <div className="relative bg-slate-950/90 dark:bg-slate-950/95 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-slate-950/80">
          
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
              {mode === 'LOGIN' && (isBn ? 'অদ্বৈত ভয়েস হাব' : 'Advaita VOICE Hub')}
              {mode === 'SIGNUP' && (isBn ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create VOICE Account')}
              {mode === 'FORGOT' && (isBn ? 'পাসওয়ার্ড রিসেট করুন' : 'Reset Password')}
              {mode === 'RESET' && (isBn ? 'নতুন পাসওয়ার্ড তৈরি' : 'Set New Password')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              {mode === 'LOGIN' && (isBn ? 'চট্টগ্রাম বিশ্ববিদ্যালয় ও ইসকন নন্দনকানন' : 'University of Chittagong & ISKCON')}
              {mode === 'SIGNUP' && (isBn ? 'ভয়েস পরিবারের সাথে যুক্ত হোন' : 'Join the Advaita VOICE Family')}
              {mode === 'FORGOT' && (isBn ? 'আপনার রেজিস্টার্ড ইমেইলে রিসেট লিঙ্ক যাবে' : 'We will send a reset link to your email')}
              {mode === 'RESET' && (isBn ? 'আপনার অ্যাকাউন্টের জন্য নতুন পাসওয়ার্ড সেট করুন' : 'Choose a new password for your account')}
            </p>
          </div>

          {/* Mode Switcher Tabs (Only for LOGIN / SIGNUP) */}
          {(mode === 'LOGIN' || mode === 'SIGNUP') && (
            <div className="flex p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => { setMode('LOGIN'); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                  mode === 'LOGIN'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isBn ? 'লগইন (Sign In)' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setMode('SIGNUP'); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                  mode === 'SIGNUP'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isBn ? 'রেজিস্ট্রেশন (Sign Up)' : 'Sign Up'}
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-950/80 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl mb-4 text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-fade-in shadow-inner">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="flex-1 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl mb-4 text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-fade-in shadow-inner">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="flex-1 leading-relaxed">{successMsg}</p>
            </div>
          )}

          {/* ================= FORM 1 & 2: LOGIN OR SIGN UP ================= */}
          {(mode === 'LOGIN' || mode === 'SIGNUP') && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* Email Field with Quick Registered Devotees Picker Button */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="email">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { triggerHaptic('selection'); setShowDevoteesModal(true); }}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                    title={isBn ? 'রেজিস্টার্ড ভক্তদের তালিকা দেখে ইমেইল নির্বাচন করুন' : 'Browse registered devotees list'}
                  >
                    <Users size={12} />
                    <span>{isBn ? 'ভক্ত তালিকা' : 'Devotees List'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type="email" 
                    id="email"
                    className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder:text-slate-500 transition-all outline-none font-medium" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="utpol.acce.cu@gmail.com"
                  />
                </div>
              </div>
              
              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="password">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isBn ? 'পাসওয়ার্ড' : 'Password'}</span>
                  </label>
                  {mode === 'LOGIN' && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('selection');
                        setMode('FORGOT');
                        setError('');
                        setSuccessMsg('');
                      }}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline transition-colors cursor-pointer"
                    >
                      {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="password"
                    className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 rounded-xl pl-4 pr-11 py-3 text-slate-100 text-sm placeholder:text-slate-500 transition-all outline-none font-mono" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="••••••••••••"
                    minLength={6}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1.5 rounded-lg cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'LOGIN' && (
                  <p className="text-[10.5px] text-slate-400 flex items-center gap-1 pt-0.5">
                    <HelpCircle size={11} className="text-amber-400/80 shrink-0" />
                    <span>{isBn ? 'ইনচার্জ কর্তৃক প্রাথমিক ডিফল্ট পাসওয়ার্ড: voice123456' : 'Default initial password: voice123456'}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full mt-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>{isBn ? 'যাচাই করা হচ্ছে...' : 'Processing...'}</span>
                  </span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>
                      {mode === 'LOGIN' 
                        ? (isBn ? 'লগইন করুন' : 'Sign In to Hub') 
                        : (isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= FORM 3: FORGOT PASSWORD REQUEST ================= */}
          {mode === 'FORGOT' && (
            <form onSubmit={handleSendResetEmail} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
                {isBn 
                  ? 'আপনার অ্যাকাউন্টের রেজিস্টার্ড ইমেইল অ্যাড্রেস নিচে লিখুন। আমরা আপনাকে একটি পাসওয়ার্ড রিসেট লিঙ্ক পাঠাব।' 
                  : 'Enter your registered email address below. We will email you a secure link to reset your password.'}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="forgot-email">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isBn ? 'রেজিস্টার্ড ইমেইল অ্যাড্রেস' : 'Registered Email Address'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { triggerHaptic('selection'); setShowDevoteesModal(true); }}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Users size={12} />
                    <span>{isBn ? 'ভক্ত তালিকা' : 'Devotees List'}</span>
                  </button>
                </div>
                <input 
                  type="email" 
                  id="forgot-email"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder:text-slate-500 transition-all outline-none font-medium" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="dipendra.philo.cu@gmail.com"
                />
              </div>

              {/* Action Buttons */}
              <button 
                type="submit" 
                className="w-full mt-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>{isBn ? 'লিঙ্ক পাঠানো হচ্ছে...' : 'Sending Reset Link...'}</span>
                  </span>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>{isBn ? 'রিসেট লিঙ্ক পাঠান (Send Reset Link)' : 'Send Password Reset Link'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setMode('LOGIN');
                  setError('');
                  setSuccessMsg('');
                }}
                className="w-full py-2.5 text-xs sm:text-sm font-bold text-slate-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{isBn ? 'লগইন পেইজে ফিরে যান' : 'Back to Sign In'}</span>
              </button>

              {/* Direct Incharge Contact Card */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Phone size={13} className="text-amber-400" />
                  <span>{isBn ? 'তাৎক্ষণিক সহায়তা প্রয়োজন?' : 'Need Immediate Assistance?'}</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {isBn 
                    ? 'ইমেইল না পেলে অথবা কোনো সমস্যা হলে সরাসরি আইটি ইনচার্জ বা কেয়ারটেকারের সাথে যোগাযোগ করুন:' 
                    : 'If you have trouble resetting your password, contact our IT Incharge or Caretaker:'}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
                  <span>Gian P. (IT): 01571328549</span>
                  <span>Rasvihari Das: 01875835986</span>
                </div>
              </div>
            </form>
          )}

          {/* ================= FORM 4: SET NEW PASSWORD ================= */}
          {mode === 'RESET' && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed">
                {isBn 
                  ? 'আপনার অ্যাকাউন্টের জন্য একটি নতুন নিরাপদ পাসওয়ার্ড সেট করুন।' 
                  : 'Please enter a new, secure password for your VOICE account.'}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="new-password">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isBn ? 'নতুন পাসওয়ার্ড' : 'New Password'}</span>
                </label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? 'text' : 'password'} 
                    id="new-password"
                    className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 rounded-xl pl-4 pr-11 py-3 text-slate-100 text-sm placeholder:text-slate-500 transition-all outline-none font-mono" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="••••••••••••"
                    minLength={6}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1.5 rounded-lg cursor-pointer"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5" htmlFor="confirm-password">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</span>
                </label>
                <input 
                  type={showNewPassword ? 'text' : 'password'} 
                  id="confirm-password"
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder:text-slate-500 transition-all outline-none font-mono" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••••••"
                  minLength={6}
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>{isBn ? 'সংরক্ষণ করা হচ্ছে...' : 'Saving Password...'}</span>
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isBn ? 'পাসওয়ার্ড আপডেট ও লগইন' : 'Update Password & Log In'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setMode('LOGIN');
                  setError('');
                  setSuccessMsg('');
                }}
                className="w-full py-2.5 text-xs sm:text-sm font-bold text-slate-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{isBn ? 'লগইন পেইজে ফিরে যান' : 'Back to Sign In'}</span>
              </button>
            </form>
          )}

          {/* Quick Demo Credentials Assistant (Only shown in LOGIN mode) */}
          {mode === 'LOGIN' && (
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{isBn ? 'কুইক লগইন ও রোল' : 'Quick Role Logins'}</span>
                </span>
                <span className="text-[10px] text-slate-500">1-Click Fill</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill('rasvihari.voice@gmail.com')}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-lg text-left text-[11px] text-slate-300 hover:text-amber-300 transition-all flex items-center gap-1.5 truncate cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">Caretaker / Mentor</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('gianjuti.csecu@gmail.com')}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-lg text-left text-[11px] text-slate-300 hover:text-amber-300 transition-all flex items-center gap-1.5 truncate cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">IT / Admin (Gian P.)</span>
                </button>
              </div>

              <div className="mt-3 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => { triggerHaptic('selection'); setShowDevoteesModal(true); }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
                >
                  <Users size={13} />
                  <span>{isBn ? 'সকল রেজিস্টার্ড ভক্তদের তালিকা দেখুন' : 'View All 14 Registered Devotees'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Back to Hub Navigation */}
          <div className="mt-6 text-center">
            <Link 
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isBn ? 'হোম পেইজে ফিরে যান' : 'Return to Hub Home'}</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ================= MODAL: REGISTERED DEVOTEES DIRECTORY ================= */}
      {showDevoteesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-950 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-amber-200">
                    {isBn ? 'রেজিস্টার্ড ভক্তবৃন্দ ও ইমেইল তালিকা' : 'Registered Devotees & Login Emails'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isBn 
                      ? 'লগইন করতে আপনার নামের পাশে "ইমেইল নির্বাচন" বাটনে চাপ দিন' 
                      : 'Tap "Select Email" to automatically fill your login email'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDevoteesModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-900/50">
              <div className="relative flex items-center">
                <Search size={15} className="absolute left-3.5 text-amber-400" />
                <input
                  type="text"
                  value={devoteeSearch}
                  onChange={(e) => setDevoteeSearch(e.target.value)}
                  placeholder={isBn ? 'নাম, পদবি, বিভাগ বা ইমেইল দিয়ে খুঁজুন...' : 'Search by name, spiritual name, department or email...'}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400"
                />
                {devoteeSearch && (
                  <button
                    type="button"
                    onClick={() => setDevoteeSearch('')}
                    className="absolute right-3 text-slate-400 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Devotees List */}
            <div className="p-3 sm:p-4 overflow-y-auto divide-y divide-slate-800/60 space-y-2 flex-1">
              {filteredDevotees.map((devotee) => (
                <div 
                  key={devotee.id}
                  onClick={() => handleSelectDevotee(devotee)}
                  className="p-3 rounded-2xl bg-slate-900/60 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-400/30 flex items-center justify-center shrink-0 font-bold text-amber-300 text-xs">
                      {devotee.sl === 0 && devotee.id === 'dev_caretaker' ? 'CT' : `SL:${devotee.sl}`}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {devotee.name}
                        </span>
                        {devotee.spiritualName && (
                          <span className="text-[11px] text-amber-400/90 font-serif italic">
                            ({devotee.spiritualName})
                          </span>
                        )}
                        {devotee.roleBadge && (
                          <span className="text-[9.5px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/30">
                            {devotee.roleBadge}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-slate-300 font-mono">
                          <Mail size={11} className="text-amber-400" />
                          {devotee.gmail}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Phone size={11} className="text-emerald-400" />
                          {devotee.phone}
                        </span>
                        <span className="text-slate-400">
                          {devotee.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => handleCopyEmail(e, devotee.gmail)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1 transition-all"
                      title="Copy Email"
                    >
                      {copiedEmail === devotee.gmail ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span className="hidden sm:inline text-[10px]">{copiedEmail === devotee.gmail ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectDevotee(devotee)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xs transition-all flex items-center gap-1"
                    >
                      <UserCheck size={13} />
                      <span>{isBn ? 'ইমেইল নির্বাচন' : 'Select Email'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-between px-4">
              <span>{isBn ? 'মোট রেজিস্টার্ড সদস্য: ১৪ জন' : 'Total Registered Members: 14'}</span>
              <span className="text-[11px] text-amber-400 font-mono">
                {isBn ? 'ডিফল্ট পাসওয়ার্ড: voice123456' : 'Default initial pwd: voice123456'}
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
