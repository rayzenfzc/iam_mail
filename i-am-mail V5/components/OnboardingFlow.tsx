import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Check, Server, Globe, Key, FileSignature, Zap, Mail, ChevronRight, Loader2, AlertCircle, X, Stars, Fingerprint, Lock, Database } from 'lucide-react';

interface OnboardingFlowProps {
    onComplete: () => void;
    onClose: () => void;
}

type Step = 'wish_selection' | 'email_input' | 'genesis_protocol' | 'complete';

const GENESIS_STEPS = [
    { id: 'mx', label: 'Verifying MX Records', icon: Globe },
    { id: 'imap', label: 'Testing IMAP Handshake', icon: Server },
    { id: 'smtp', label: 'Validating SMTP Outbound', icon: Zap },
    { id: 'crypto', label: 'Generating AES-256 Profile', icon: Lock },
    { id: 'sync', label: 'Synchronizing Mailbox Nodes', icon: Database },
];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onClose }) => {
    const [step, setStep] = useState<Step>('wish_selection');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [genesisProgress, setGenesisProgress] = useState(0);
    const emailInputRef = useRef<HTMLInputElement>(null);

    const handleWishSelect = (wish: string) => {
        setStep('email_input');
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes('@')) return;
        // Start Genesis Protocol
        setStep('genesis_protocol');
    };

    // Simulate Genesis Protocol Steps
    useEffect(() => {
        if (step === 'genesis_protocol') {
            const interval = setInterval(() => {
                setGenesisProgress(prev => {
                    if (prev >= GENESIS_STEPS.length - 1) {
                        clearInterval(interval);
                        setTimeout(() => onComplete(), 1000);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1200); // 1.2s per step
            return () => clearInterval(interval);
        }
    }, [step, onComplete]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            {/* 100% Transparent Backdrop with Blur */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-xl transition-all" onClick={onClose}></div>

            <div className="relative w-full max-w-[420px] min-h-[500px] rounded-[3rem] bg-white/40 backdrop-blur-3xl border border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-500">
                <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
                    <X size={20} />
                </button>

                {step === 'wish_selection' && (
                    <div className="w-full text-center">
                        <div className="mb-12">
                             <h2 className="text-2xl font-light text-slate-900 mb-2">Configure_Link</h2>
                             <p className="text-slate-400 text-[10px] uppercase tracking-[0.4em] font-bold">Synchronizing Node</p>
                        </div>
                        <div className="space-y-4">
                            <button 
                                onClick={() => handleWishSelect('connect')}
                                className="w-full p-6 bg-white/80 rounded-[2rem] border border-white shadow-sm flex items-center gap-5 group hover:scale-[1.02] transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/20">
                                    <Mail size={20} />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="text-xs font-bold text-slate-900 mb-1">Add Identity</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">Auto-Detect Provider</div>
                                </div>
                                <ChevronRight className="text-slate-300" size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 'email_input' && (
                    <div className="w-full">
                        <div className="mb-12 text-center">
                            <h2 className="text-2xl font-light text-slate-900 mb-2 tracking-tight">Identify Source</h2>
                            <p className="text-slate-400 text-[9px] uppercase tracking-[0.4em] font-bold">Genesis Protocol Ready</p>
                        </div>
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="relative">
                                <input 
                                    ref={emailInputRef}
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@source.com" 
                                    className="w-full bg-white/60 border border-white rounded-2xl py-5 px-6 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                     <Mail size={18} className="text-slate-400" />
                                </div>
                            </div>
                            <div className="relative">
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Access Key" 
                                    className="w-full bg-white/60 border border-white rounded-2xl py-5 px-6 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                     <Key size={18} className="text-slate-400" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                                Initiate Connection
                            </button>
                        </form>
                    </div>
                )}

                {step === 'genesis_protocol' && (
                   <div className="w-full">
                      <div className="mb-10 text-center">
                         <h2 className="text-xl font-light text-slate-900 mb-2">Genesis Protocol</h2>
                         <p className="text-slate-400 text-[9px] uppercase tracking-[0.4em] font-bold">Establishing Secure Link</p>
                      </div>
                      
                      <div className="space-y-6 pl-4">
                          {GENESIS_STEPS.map((s, index) => {
                              const isActive = index === genesisProgress;
                              const isComplete = index < genesisProgress;
                              const isPending = index > genesisProgress;

                              return (
                                  <div key={s.id} className={`flex items-center gap-4 transition-all duration-500 ${isPending ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}>
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500
                                          ${isActive ? 'bg-indigo-600 border-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/30' : ''}
                                          ${isComplete ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                                          ${isPending ? 'border-slate-300 text-slate-300' : ''}
                                      `}>
                                          {isComplete ? <Check size={14} strokeWidth={3} /> : <s.icon size={14} className={isActive ? 'animate-pulse' : ''} />}
                                      </div>
                                      <div className="flex-1">
                                          <div className={`text-[0.65rem] font-bold uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                                              {s.label}
                                          </div>
                                          {isActive && (
                                              <div className="h-1 w-20 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                                  <div className="h-full bg-indigo-600 animate-[loading_1s_infinite_ease-in-out] w-full origin-left"></div>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                      <style>{`@keyframes loading { 0% { transform: scaleX(0); } 50% { transform: scaleX(0.7); } 100% { transform: scaleX(1); } }`}</style>
                   </div>
                )}
            </div>
        </div>
    );
};

export default OnboardingFlow;