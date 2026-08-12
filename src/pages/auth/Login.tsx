import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const { t } = useLanguage();
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
          email,
          password
        });
        if (error) throw error;
        toast.success(t('login.success') || 'Welcome back!');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        
        if (data.user) {
          // We no longer auto-create a member profile here.
          // Users will be prompted to link to an existing profile in the dashboard.
          // If they don't have a profile, they simply remain a guest viewer.
        }
        
        toast.success(t('signup.success') || 'Account created successfully! Welcome.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || err.toString());
      toast.error(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8 px-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDuration: '10s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>

      <div className="glass-card animate-fade-in w-full max-w-md p-8 relative z-10">
        
        <div className="flex flex-col items-center mt-2 mb-8 text-center">
          <span className="text-5xl mb-4 animate-float inline-block">🪷</span>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
            {isLogin ? t('login.title') : t('signup.title')}
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            {t('app.title')}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* We removed name, phone, and dob fields because users will now link to an existing profile later. */}

          <div className="input-group">
            <label className="input-label" htmlFor="email">{t('login.email')}</label>
            <input 
              type="email" 
              id="email"
              className="input-field bg-white/70 backdrop-blur" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="name@example.com"
            />
          </div>
          
          <div className="input-group relative">
            <label className="input-label" htmlFor="password">{t('login.password')}</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password"
                className="input-field bg-white/70 backdrop-blur pr-12" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors p-1"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-4 py-3 text-lg relative overflow-hidden group" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {t('login.loading')}
              </span>
            ) : (
              isLogin ? t('login.button') : t('signup.button')
            )}
            
            {/* Shimmer effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm mb-2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline transition-all"
            disabled={loading}
          >
            {isLogin ? t('auth.toggle.toSignup') : t('auth.toggle.toLogin')}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
