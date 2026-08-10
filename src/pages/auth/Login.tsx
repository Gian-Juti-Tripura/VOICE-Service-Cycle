import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { t } = useLanguage();
  const { user, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  
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
      // Fake delay
      await new Promise(r => setTimeout(r, 500));
      
      // We'll just call the fake login whether it's sign in or sign up
      // In a real app we'd validate, etc. For demo mode this is fine.
      await login(email);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || err.toString());
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - 4rem)', padding: '2rem 1rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        
        <div className="flex flex-col items-center mt-2 mb-6">
          <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🪷</span>
          <h2>{isLogin ? t('login.title') : t('signup.title')}</h2>
          <p className="text-muted text-sm mt-2" style={{ textAlign: 'center' }}>
            {t('app.title')}
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          {!isLogin && (
            <>
              <div className="input-group">
                <label className="input-label" htmlFor="name">{t('signup.name')}</label>
                <input 
                  type="text" 
                  id="name"
                  className="input-field" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="phone">{t('signup.phone')}</label>
                <input 
                  type="tel" 
                  id="phone"
                  className="input-field" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="dob">{t('signup.dob')}</label>
                <input 
                  type="date" 
                  id="dob"
                  className="input-field" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label" htmlFor="email">{t('login.email')}</label>
            <input 
              type="email" 
              id="email"
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group relative">
            <div className="flex justify-between items-end">
              <label className="input-label" htmlFor="password">{t('login.password')}</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password"
                className="input-field" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{ width: '100%', paddingRight: '2.5rem' }}
              />
              <button 
                type="button"
                className="text-muted"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary mt-6" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? t('login.loading') : (isLogin ? t('login.button') : t('signup.button'))}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm font-medium"
            style={{ color: 'var(--color-primary)' }}
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
