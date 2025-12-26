import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

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
    }, 1200);
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

      {/* Glass Floating Card - 1rem radius */}
      <div className="w-full max-w-[360px] bg-white/60 backdrop-blur-2xl rounded-[1rem] p-8 shadow-2xl shadow-slate-200/50 border border-white animate-in zoom-in-95 duration-500 relative">
        {isLoading && (
            <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[1rem]">
                <Loader2 className="animate-spin text-slate-900" size={32} strokeWidth={1.5} />
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
          <div className="space-y-2.5">
            <label className="block text-[0.65rem] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">User Name</label>
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
              />
            </div>
          </div>

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

          <button 
            type="submit"
            className="w-full bg-[#0F172A] text-white py-4 rounded-[0.75rem] font-bold text-[0.7rem] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-slate-900/20 group mt-2"
          >
            Login
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
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