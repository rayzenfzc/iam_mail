import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, Fingerprint } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess();
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden"
      style={{
          backgroundColor: '#E5E5E5',
          backgroundImage: 'radial-gradient(#CCCCCC 1px, transparent 1px)',
          backgroundSize: '16px 16px'
      }}
    >
      {/* Decorative architectural lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-slate-300/30"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-slate-300/30"></div>
      <div className="absolute left-0 top-1/3 w-full h-px bg-slate-300/30"></div>
      
      {/* Logo & Header from Screenshot */}
      <div className="mb-12 flex flex-col items-center text-center z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-14 h-14 bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-white flex items-center justify-center mb-8 transform hover:scale-105 transition-transform">
          <span className="text-xl font-light text-slate-900 tracking-tighter">i.<span className="font-bold">M</span></span>
        </div>
        <h1 className="text-2xl font-display font-medium text-slate-900 tracking-tight mb-2">i.IDENTIFY</h1>
        <p className="text-[10px] uppercase tracking-[0.5em] text-slate-400 font-bold">Secure Neural Link</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[460px] bg-white/80 backdrop-blur-2xl rounded-[3rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-white relative z-10 animate-in zoom-in-95 duration-500">
        {isLoading && (
            <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-[3rem]">
                <Loader2 className="animate-spin text-slate-900" size={32} strokeWidth={1} />
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Identity Field */}
          <div className="space-y-4">
            <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Identity</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                <Mail size={18} strokeWidth={1.5} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-100 text-slate-900 text-sm font-medium rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all placeholder:text-slate-200"
                placeholder="user@rayzen.ae"
              />
            </div>
          </div>

          {/* Passcode Field */}
          <div className="space-y-4">
            <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Passcode</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F8FAFC]/50 border border-slate-50 text-slate-900 text-sm font-medium rounded-2xl py-5 pl-14 pr-14 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all placeholder:text-slate-200"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-bold text-[12px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-black hover:scale-[1.01] transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
          >
            Authenticate
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-12 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-slate-400">
          <button className="hover:text-slate-900 transition-colors">Create Identity</button>
          <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
          <button className="hover:text-slate-900 transition-colors">Reset Key</button>
        </div>
      </div>

      {/* Bottom Brand */}
      <div className="mt-16 z-10 flex flex-col items-center gap-4 opacity-40 animate-pulse">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
          <Fingerprint size={14} />
          Secured by i.AM Core
        </div>
        <div className="text-[8px] uppercase tracking-[0.5em] text-slate-300 font-mono">v4.2.0_STABLE</div>
      </div>
    </div>
  );
};

export default AuthPage;