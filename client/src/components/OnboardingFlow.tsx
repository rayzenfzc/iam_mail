import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Check, Server, Globe, Key, FileSignature, Zap, Mail, ChevronRight, Loader2, AlertCircle, X, Stars, Fingerprint, Lock, Database } from 'lucide-react';

interface OnboardingFlowProps {
    onComplete: () => void;
    onClose: () => void;
    isDarkMode?: boolean;
}

type Step = 'wish_selection' | 'email_input' | 'genesis_protocol' | 'complete';

const GENESIS_STEPS = [
    { id: 'mx', label: 'Verifying MX Records', icon: Globe },
    { id: 'imap', label: 'Testing IMAP Handshake', icon: Server },
    { id: 'smtp', label: 'Validating SMTP Outbound', icon: Zap },
    { id: 'crypto', label: 'Generating AES-256 Profile', icon: Lock },
    { id: 'sync', label: 'Synchronizing Mailbox Nodes', icon: Database },
];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onClose, isDarkMode = true }) => {
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
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 overflow-hidden pointer-events-none">
            {/* NO backdrop - 100% transparent, no view blocking */}

            <div className={`relative w-full max-w-[420px] mb-24 rounded-t-[3rem] backdrop-blur-2xl border shadow-[0_-20px_70px_-15px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center p-8 animate-in slide-in-from-bottom-10 duration-700 pointer-events-auto ${isDarkMode
                ? 'bg-black/40 border-white/10 text-white'
                : 'bg-white/90 border-black/10 text-slate-900'
                }`}>
                <button onClick={onClose} className={`absolute top-6 right-6 transition-colors ${isDarkMode
                    ? 'text-white/40 hover:text-white/80'
                    : 'text-slate-400 hover:text-slate-900'
                    }`}>
                    <X size={18} />
                </button>

                {step === 'wish_selection' && (
                    <div className="w-full text-center">
                        <div className="mb-12">
                            <h2 className={`text-2xl font-light mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Configure_Link</h2>
                            <p className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>Synchronizing Node</p>
                        </div>
                        <div className="space-y-4">
                            <button
                                onClick={() => handleWishSelect('connect')}
                                className={`w-full p-6 backdrop-blur-xl rounded-[2rem] border shadow-sm flex items-center gap-5 group hover:scale-[1.02] transition-all ${isDarkMode
                                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                                    : 'bg-black/5 border-black/10 hover:bg-black/10'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-900 text-white'
                                    }`}>
                                    <Mail size={20} />
                                </div>
                                <div className="text-left flex-1">
                                    <div className={`text-xs font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add Identity</div>
                                    <div className={`text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>Auto-Detect Provider</div>
                                </div>
                                <ChevronRight className={isDarkMode ? 'text-white/30' : 'text-slate-400'} size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 'email_input' && (
                    <div className="w-full">
                        <div className="mb-12 text-center">
                            <h2 className={`text-2xl font-light mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Identify Source</h2>
                            <p className={`text-[9px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>Genesis Protocol Ready</p>
                        </div>
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="relative">
                                <input
                                    ref={emailInputRef}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@source.com"
                                    className={`w-full backdrop-blur-xl border rounded-2xl py-5 px-6 text-sm focus:outline-none focus:ring-1 ${isDarkMode
                                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-white/20 focus:bg-white/10'
                                        : 'bg-black/5 border-black/10 text-slate-900 placeholder:text-slate-400 focus:ring-slate-900 focus:bg-black/10'
                                        }`}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Mail size={18} className={isDarkMode ? 'text-white/40' : 'text-slate-400'} />
                                </div>
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Access Key"
                                    className={`w-full backdrop-blur-xl border rounded-2xl py-5 px-6 text-sm focus:outline-none focus:ring-1 ${isDarkMode
                                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-white/20 focus:bg-white/10'
                                        : 'bg-black/5 border-black/10 text-slate-900 placeholder:text-slate-400 focus:ring-slate-900 focus:bg-black/10'
                                        }`}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Key size={18} className={isDarkMode ? 'text-white/40' : 'text-slate-400'} />
                                </div>
                            </div>
                            <button type="submit" className={`w-full backdrop-blur-xl border py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${isDarkMode
                                ? 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                                : 'bg-slate-900 border-slate-900 text-white hover:bg-black'
                                }`}>
                                Initiate Connection
                            </button>
                        </form>
                    </div>
                )}

                {step === 'genesis_protocol' && (
                    <div className="w-full">
                        <div className="mb-10 text-center">
                            <h2 className={`text-xl font-light mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Genesis Protocol</h2>
                            <p className={`text-[9px] uppercase tracking-[0.4em] font-bold ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>Establishing Secure Link</p>
                        </div>

                        <div className="space-y-6 pl-4">
                            {GENESIS_STEPS.map((s, index) => {
                                const isActive = index === genesisProgress;
                                const isComplete = index < genesisProgress;
                                const isPending = index > genesisProgress;

                                return (
                                    <div key={s.id} className={`flex items-center gap-4 transition-all duration-500 ${isPending ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500
                                          ${isActive ? (isDarkMode ? 'bg-white/20 border-white/40 text-white scale-110 shadow-lg shadow-white/10' : 'bg-slate-900/20 border-slate-900/40 text-slate-900 scale-110 shadow-lg shadow-slate-900/10') : ''}
                                          ${isComplete ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-600' : ''}
                                          ${isPending ? (isDarkMode ? 'border-white/20 text-white/30' : 'border-slate-300 text-slate-400') : ''}
                                      `}>
                                            {isComplete ? <Check size={14} strokeWidth={3} /> : <s.icon size={14} className={isActive ? 'animate-pulse' : ''} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-[0.65rem] font-bold uppercase tracking-widest ${isActive ? (isDarkMode ? 'text-white' : 'text-slate-900') : (isDarkMode ? 'text-white/50' : 'text-slate-500')
                                                }`}>
                                                {s.label}
                                            </div>
                                            {isActive && (
                                                <div className={`h-1 w-20 rounded-full mt-2 overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
                                                    <div className={`h-full animate-[loading_1s_infinite_ease-in-out] w-full origin-left ${isDarkMode ? 'bg-white/40' : 'bg-slate-900'}`}></div>
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