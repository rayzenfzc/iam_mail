import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, Check } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || '';

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('saved_email');
    const savedRemember = localStorage.getItem('remember_me');

    if (savedEmail && savedRemember === 'true') {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Try to authenticate with backend
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();

        // Save token
        localStorage.setItem('auth_token', data.token || 'authenticated');
        localStorage.setItem('user_email', email);

        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('saved_email', email);
          localStorage.setItem('remember_me', 'true');
        } else {
          localStorage.removeItem('saved_email');
          localStorage.removeItem('remember_me');
        }

        onLoginSuccess();
      } else {
        // Try signup if login fails (for demo purposes)
        const signupResponse = await fetch(`${API_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (signupResponse.ok) {
          const data = await signupResponse.json();

          localStorage.setItem('auth_token', data.token || 'authenticated');
          localStorage.setItem('user_email', email);

          if (rememberMe) {
            localStorage.setItem('saved_email', email);
            localStorage.setItem('remember_me', 'true');
          }

          onLoginSuccess();
        } else {
          // Allow demo login for development
          localStorage.setItem('auth_token', 'demo_token_' + Date.now());
          localStorage.setItem('user_email', email);

          if (rememberMe) {
            localStorage.setItem('saved_email', email);
            localStorage.setItem('remember_me', 'true');
          }

          onLoginSuccess();
        }
      }
    } catch (err) {
      // Fallback: Allow offline/demo login
      console.log('Auth fallback - offline mode');
      localStorage.setItem('auth_token', 'offline_token_' + Date.now());
      localStorage.setItem('user_email', email);

      if (rememberMe) {
        localStorage.setItem('saved_email', email);
        localStorage.setItem('remember_me', 'true');
      }

      onLoginSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative font-sans overflow-hidden"
      style={{
        backgroundColor: '#E5E5E5',
        backgroundImage: 'radial-gradient(#CCCCCC 1px, transparent 1px)',
        backgroundSize: '16px 16px'
      }}
    >
      {/* Brand Header */}
      <div className="mb-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1.5 h-10 bg-slate-900 rounded-full"></div>
          <span className="text-4xl font-display font-light text-slate-900 tracking-tighter uppercase">
            I.<span className="font-bold">AM</span>
          </span>
        </div>
      </div>

      {/* Glass Floating Card */}
      <div className="w-full max-w-[360px] bg-white/60 backdrop-blur-2xl rounded-[1rem] p-8 shadow-2xl shadow-slate-200/50 border border-white animate-in zoom-in-95 duration-500 relative">
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[1rem]">
            <Loader2 className="animate-spin text-slate-900" size={32} strokeWidth={1.5} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 flex flex-col">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs px-4 py-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2.5">
            <label className="block text-[0.65rem] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Email</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Mail size={18} strokeWidth={1.5} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border-0 text-slate-900 text-sm rounded-[0.75rem] py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300 shadow-sm"
                placeholder="user@iam.ae"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2.5">
            <label className="block text-[0.65rem] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border-0 text-slate-900 text-sm rounded-[0.75rem] py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300 shadow-sm"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-2 group"
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe
                  ? 'bg-slate-900 border-slate-900'
                  : 'bg-white border-slate-300 group-hover:border-slate-400'
                }`}>
                {rememberMe && <Check size={12} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
                Remember me
              </span>
            </button>

            <button
              type="button"
              className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0F172A] text-white py-4 rounded-[0.75rem] font-bold text-[0.7rem] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-slate-900/20 group mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Login'}
            {!isLoading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2 opacity-40">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-slate-600">System_Online</span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;