import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Fingerprint, Scan, ShieldCheck } from 'lucide-react';

interface BiometricLoginProps {
  onLogin: () => void;
}

const BiometricLogin: React.FC<BiometricLoginProps> = ({ onLogin }) => {
  const [scanning, setScanning] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuth = () => {
    // 🪄 Haptic Magic: Short "Click"
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
    }

    setScanning(true);
    // Simulate biometric delay
    setTimeout(() => {
      setAuthenticated(true);
      
      // 🪄 Haptic Magic: Success "Thump-Thump"
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([30, 50, 30]);
      }

      setTimeout(() => {
        onLogin();
      }, 800);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <style>{`
        @keyframes float-mesh {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float-mesh-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 50px) scale(1.1); }
          66% { transform: translate(20px, -20px) scale(0.9); }
        }
        .animate-mesh-1 { animation: float-mesh 15s ease-in-out infinite; }
        .animate-mesh-2 { animation: float-mesh-reverse 18s ease-in-out infinite; }
        .animate-mesh-3 { animation: float-mesh 20s ease-in-out infinite reverse; }
        
        .bg-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Mesh Background Layers - Monochrome */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-slate-300/30 rounded-full blur-[100px] mix-blend-multiply animate-mesh-1"></div>
        <div className="absolute top-[10%] right-[-20%] w-[60vw] h-[60vw] bg-slate-200/40 rounded-full blur-[100px] mix-blend-multiply animate-mesh-2"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[80vw] bg-slate-400/20 rounded-full blur-[100px] mix-blend-multiply animate-mesh-3"></div>
      </div>

      {/* Grain Overlay */}
      <div className="absolute inset-0 z-0 bg-grain opacity-[0.04] pointer-events-none mix-blend-overlay"></div>

      {/* Decorative floating lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-slate-400/20 to-transparent z-0"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-slate-400/20 to-transparent z-0"></div>
      
      {/* Navigation / Header */}
      <nav className="p-8 md:p-12 flex justify-between items-center z-10 relative">
        <div className="text-slate-900 font-light text-2xl tracking-tighter leading-none">
          i.<span className="text-slate-900 font-medium">AM</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-normal italic">
          i.GATEWAY
        </div>
      </nav>

      {/* Main Hero */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-20 relative">
        <div className="mb-8 flex items-center gap-4 opacity-40">
           <div className="h-px w-12 bg-slate-900"></div>
           <span className="text-[10px] uppercase tracking-[0.5em] font-normal">i.INTEL</span>
           <div className="h-px w-12 bg-slate-900"></div>
        </div>

        <h1 className="thin-title text-7xl md:text-[10rem] uppercase leading-[0.8] text-slate-900 mb-12 select-none">
          <span className="opacity-20 block translate-y-4">i.DENTITY</span>
          <span className="font-light text-slate-900">i.MAIL</span>
        </h1>

        <p className="max-w-md text-slate-500 font-normal text-xs md:text-sm leading-relaxed tracking-[0.2em] mb-12 uppercase">
          Privacy shield enabled. Verify to access.<br/>
          Decentralized encryption active.
        </p>

        {/* Biometric Visual */}
        <div className="relative group mb-12">
          <div className={`
              relative z-10 bg-white/80 backdrop-blur-sm border border-slate-100 w-24 h-24 md:w-32 md:h-32 rounded-full 
              flex items-center justify-center transition-all duration-700
              ${scanning ? 'scale-90 border-slate-900/30' : 'border-slate-200'}
              ${authenticated ? 'bg-slate-100 border-slate-900 scale-100' : ''}
            `}
          >
            {authenticated ? (
              <ShieldCheck className="w-10 h-10 text-slate-900 animate-in fade-in zoom-in duration-500" strokeWidth={1} />
            ) : scanning ? (
              <Scan className="w-10 h-10 text-slate-900 animate-pulse" strokeWidth={1} />
            ) : (
              <Fingerprint className="w-10 h-10 text-slate-300" strokeWidth={1} />
            )}
          </div>
          
          {/* Ripples */}
          {scanning && !authenticated && (
            <>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border border-slate-900/20 animate-ping"></div>
              <div className="absolute top-[-10px] left-[-10px] right-[-10px] bottom-[-10px] rounded-full border border-slate-900/10 animate-pulse"></div>
            </>
          )}
        </div>

        {/* Authentication Button */}
        <button
            onClick={handleAuth}
            disabled={scanning || authenticated}
            className={`
                bg-slate-900
                text-white text-sm font-medium tracking-[0.2em] uppercase
                px-12 py-4 rounded-2xl shadow-2xl
                hover:bg-black hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5
                transition-all duration-300
                disabled:opacity-70 disabled:cursor-not-allowed
            `}
        >
            Authenticate
        </button>

        <div className="mt-8 h-8">
           {scanning && !authenticated && (
             <span className="text-[10px] uppercase tracking-[0.3em] text-slate-900 animate-pulse">Scanning biometric signature...</span>
           )}
           {authenticated && (
             <span className="text-[10px] uppercase tracking-[0.3em] text-slate-900">Access Granted</span>
           )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-12 text-center opacity-30 z-10">
        <p className="text-[9px] uppercase tracking-[0.8em] font-normal italic">Protected by Aura Shield • v2.4.0</p>
      </footer>
    </div>
  );
};

export default BiometricLogin;