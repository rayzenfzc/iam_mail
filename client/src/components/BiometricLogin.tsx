import React, { useState } from 'react';
import { Fingerprint, Cpu, Sun, Moon, Globe, ShieldCheck } from 'lucide-react';

interface BiometricLoginProps {
  onLogin: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const BiometricLogin: React.FC<BiometricLoginProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuth = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center transition-colors duration-700 md:p-6">

      {/* Dynamic Background Elements for Depth */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      {/* Main Glass Portal */}
      <div className={`
        relative z-10 flex flex-col justify-between overflow-hidden transition-all duration-700
        w-full h-full md:w-[460px] md:h-[820px] md:max-h-[90vh]
        bg-white/80 dark:bg-slate-950/90 backdrop-blur-3xl
        md:rounded-[64px] rounded-none
        border-[3px] border-slate-900/10 dark:border-white/10
        shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)]
      `}>

        {/* Floating Controls Inside */}
        <button
          onClick={toggleTheme}
          className="absolute top-8 right-8 p-3.5 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 transition-all hover:scale-105 active:scale-95 text-slate-500 z-[210] shadow-sm"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* 1. Branding Header */}
        <div className="px-10 pt-16 md:pt-14 space-y-6">
          <div className="font-light text-6xl md:text-7xl tracking-tighter leading-none dark:text-white transition-all select-none text-center">
            <span className="text-slate-300 dark:text-slate-600">i.</span><span className="text-slate-900 dark:text-slate-100 font-medium">M</span>
          </div>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-slate-900/5 dark:bg-white/5 rounded-full border border-slate-900/5 dark:border-white/5 shadow-inner">
              <Cpu size={12} className="text-accent animate-pulse" />
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400 font-black">SECURE NODE ENTRY</p>
            </div>
          </div>
        </div>

        {/* 2. Authentication Core */}
        <div className="flex flex-col items-center gap-10 flex-1 justify-center px-10">
          <button
            onClick={handleAuth}
            disabled={isAuthenticating}
            className={`relative group p-14 rounded-[56px] transition-all duration-1000 ${isAuthenticating ? 'scale-90 opacity-40 grayscale' : 'hover:scale-105 active:scale-95'
              }`}
          >
            {/* Neural Scanning Rings */}
            <div className={`absolute inset-0 rounded-[56px] border-[2px] border-dashed border-accent/30 transition-opacity duration-500 ${isAuthenticating ? 'animate-spin opacity-100' : 'opacity-20 group-hover:opacity-100 group-hover:animate-[spin_20s_linear_infinite]'}`}></div>
            <div className="absolute inset-4 rounded-[40px] border border-accent/10"></div>

            <Fingerprint
              size={88}
              strokeWidth={0.5}
              className={`transition-all duration-700 ${isAuthenticating ? 'text-accent' : 'text-slate-300 dark:text-slate-700 group-hover:text-accent group-hover:scale-110'}`}
            />
          </button>

          <div className="space-y-6 w-full">
            <h2 className="text-2xl md:text-3xl thin-title text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-tight select-none text-center">Neural Identity Protocol</h2>

            <div className="w-full space-y-5">
              <div className="flex flex-col items-center gap-2">
                <p className="text-[14px] text-slate-400 dark:text-slate-500 font-light">
                  Authorized access for
                </p>
                <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold tracking-[0.12em] text-lg uppercase transition-all hover:tracking-[0.18em] cursor-default">
                  <Globe size={18} className="text-accent" />
                  <span>I AM MAIL.CLOUD</span>
                </div>
              </div>

              <div className="flex flex-col items-center pt-2">
                <p className="text-[10px] text-slate-300 dark:text-slate-600 italic font-black tracking-[0.6em] uppercase transition-all">
                  {isAuthenticating ? 'Synthesizing...' : 'Touch to Begin'}
                </p>
                <div className="mt-4 w-12 h-[1.5px] bg-slate-100 dark:bg-slate-900"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Integrated Infrastructure Footer */}
        <div className="px-10 pb-12 md:pb-14 flex flex-col items-center gap-8">
          <div className="space-y-3 flex flex-col items-center">
            <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
              <ShieldCheck size={14} className="text-accent" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400 dark:text-slate-500">ENCRYPTED NODE</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              <span className="text-[10px] uppercase tracking-[0.5em] font-black text-green-600">NODE ACTIVE</span>
            </div>
          </div>

          {/* Subtle Embossed Branding */}
          <div className="embossed-text text-[14px] uppercase tracking-[1.8em] font-black text-center whitespace-nowrap opacity-10 pointer-events-none select-none">
            I AM MAIL
          </div>
        </div>
      </div>

      <style>{`
        .embossed-text {
          background: linear-gradient(to bottom, #475569, #0f172a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.8);
        }
        .dark .embossed-text {
          background: linear-gradient(to bottom, #ffffff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.8);
        }
        
        /* Thin Lean Border Detail */
        .glass-login {
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 50px 100px -20px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default BiometricLogin;
