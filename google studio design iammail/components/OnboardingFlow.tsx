import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Check, Server, Globe, Key, FileSignature, Zap, Mail, ChevronRight, Loader2, AlertCircle, X, Stars, Fingerprint } from 'lucide-react';

interface OnboardingFlowProps {
    onComplete: () => void;
    onClose: () => void;
}

type Step = 'wish_selection' | 'email_input' | 'analyzing' | 'auth' | 'granting_wish' | 'complete';

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onClose }) => {
    const [step, setStep] = useState<Step>('wish_selection');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [domainType, setDomainType] = useState<'google' | 'microsoft' | 'custom' | null>(null);
    const [scanText, setScanText] = useState('Reading aura...');
    const [techDetails, setTechDetails] = useState<string[]>([]);
    
    const emailInputRef = useRef<HTMLInputElement>(null);

    const handleWishSelect = (wish: string) => {
        setStep('email_input');
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes('@')) return;
        setStep('analyzing');
        setTimeout(() => setStep('auth'), 3000);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('granting_wish');
        setTimeout(() => onComplete(), 2000);
    };

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
                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">Secure_Protocol_v2</div>
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
                            <p className="text-slate-400 text-[9px] uppercase tracking-[0.4em] font-bold">Awaiting_Input</p>
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
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-xl">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {/* Simplified step representations for visibility */}
                {step === 'analyzing' && <div className="text-slate-900 text-xs font-bold animate-pulse uppercase tracking-[0.5em]">Scanning_Domain...</div>}
                
                {step === 'auth' && (
                   <div className="w-full">
                      <div className="mb-10 text-center">
                         <h2 className="text-xl font-light text-slate-900 mb-2">Final Seal</h2>
                      </div>
                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                         <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/60 border border-white rounded-2xl py-5 px-6 text-sm"
                            placeholder="Passcode"
                         />
                         <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest">Connect_Link</button>
                      </form>
                   </div>
                )}
            </div>
        </div>
    );
};

export default OnboardingFlow;