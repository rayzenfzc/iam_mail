import React, { useState } from 'react';
import { X, Mail, Lock, Shield, CheckCircle, Loader, Server, Key, ChevronDown } from 'lucide-react';

interface GenesisProtocolProps {
  darkMode: boolean;
  onComplete: (email: string, provider: string) => void;
  onCancel: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

interface VerificationStep {
  name: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'complete' | 'error';
}

export const GenesisProtocol: React.FC<GenesisProtocolProps> = ({
  darkMode,
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    { name: 'MX Records Verification', icon: <Server className="w-4 h-4" />, status: 'pending' },
    { name: 'IMAP Handshake Testing', icon: <Mail className="w-4 h-4" />, status: 'pending' },
    { name: 'SMTP Outbound Validation', icon: <Shield className="w-4 h-4" />, status: 'pending' },
    { name: 'AES-256 Profile Generation', icon: <Lock className="w-4 h-4" />, status: 'pending' },
    { name: 'Mailbox Node Synchronization', icon: <Key className="w-4 h-4" />, status: 'pending' }
  ]);

  const detectProvider = (email: string): string => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return 'Unknown';
    
    if (domain.includes('gmail')) return 'Gmail';
    if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live')) return 'Outlook';
    if (domain.includes('yahoo')) return 'Yahoo';
    if (domain.includes('icloud') || domain.includes('me.com')) return 'iCloud';
    if (domain.includes('proton')) return 'ProtonMail';
    return 'IMAP/SMTP';
  };

  const handleNext = () => {
    if (step === 1 && email) {
      setStep(2);
    } else if (step === 2 && password) {
      setStep(3);
      startVerification();
    }
  };

  const startVerification = async () => {
    setIsVerifying(true);
    
    // Simulate verification process
    for (let i = 0; i < verificationSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setVerificationSteps(prev => prev.map((vstep, idx) => {
        if (idx === i) return { ...vstep, status: 'active' };
        if (idx < i) return { ...vstep, status: 'complete' };
        return vstep;
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setVerificationSteps(prev => prev.map((vstep, idx) => {
        if (idx === i) return { ...vstep, status: 'complete' };
        return vstep;
      }));
    }
    
    setIsVerifying(false);
    setStep(4);
    
    // Auto-advance to success screen
    setTimeout(() => {
      setStep(5);
    }, 1500);
    
    // Auto-complete after showing success
    setTimeout(() => {
      const provider = detectProvider(email);
      onComplete(email, provider);
    }, 3000);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Genesis Protocol';
      case 2: return 'Security Credentials';
      case 3: return 'System Verification';
      case 4: return 'Account Initialized';
      case 5: return 'Welcome to i.AM OS';
      default: return 'Genesis Protocol';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1: return 'Enter your email address to begin initialization';
      case 2: return 'Provide access credentials for secure connection';
      case 3: return 'Establishing secure connection...';
      case 4: return 'Account verification complete';
      case 5: return 'Your account is now connected';
      default: return '';
    }
  };

  return (
    <>
      {/* Backdrop - semi-transparent, non-blocking */}
      <div 
        className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm"
        onClick={step < 3 ? onCancel : undefined}
      ></div>

      {/* Slide-up Panel from Bottom */}
      <div className={`fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom duration-300`}>
        <div className={`max-w-2xl mx-auto mb-4 mx-4 rounded-2xl border shadow-2xl overflow-hidden ${
          darkMode ? 'bg-[#0A0A0A] border-violet-500/20' : 'bg-white border-violet-200'
        }`}>
          
          {/* Drag Handle */}
          <div className={`flex items-center justify-center py-2 border-b cursor-pointer ${
            darkMode ? 'border-violet-500/10' : 'border-violet-200'
          }`} onClick={step < 3 ? onCancel : undefined}>
            <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-white/30' : 'text-black/30'}`} />
          </div>

          {/* Header */}
          <div className={`relative p-6 border-b ${
            darkMode ? 'border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-cyan-500/10' : 'border-violet-200 bg-gradient-to-br from-violet-50 to-cyan-50'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-cyan-500/5"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-mono uppercase tracking-[0.3em] text-violet-500">
                  Step {step}/5
                </div>
                {step < 3 && (
                  <button
                    onClick={onCancel}
                    className={`p-1 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-200'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <h2 className="text-2xl font-light mb-1">{getStepTitle()}</h2>
              <p className="text-xs opacity-60">{getStepSubtitle()}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Step 1: Email Input */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className={`p-4 rounded-xl border ${
                  darkMode ? 'bg-[#111] border-violet-500/20' : 'bg-violet-50 border-violet-200'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Email Account</div>
                      <div className="text-xs opacity-50">Connect any email provider</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    autoFocus
                    className={`w-full p-3 rounded-lg border outline-none text-sm transition-all ${
                      darkMode 
                        ? 'bg-[#111] border-white/10 text-white placeholder:text-neutral-600 focus:border-violet-500/50' 
                        : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400 focus:border-violet-500'
                    }`}
                  />
                  {email && (
                    <div className="mt-2 text-xs opacity-50 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Provider: {detectProvider(email)}
                    </div>
                  )}
                </div>

                <div className={`p-3 rounded-lg text-xs ${
                  darkMode ? 'bg-violet-500/10 text-violet-300' : 'bg-violet-100 text-violet-700'
                }`}>
                  <strong>Supported Providers:</strong> Gmail, Outlook, Yahoo, iCloud, ProtonMail, and any IMAP/SMTP service
                </div>
              </div>
            )}

            {/* Step 2: Password Input */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className={`p-4 rounded-xl border ${
                  darkMode ? 'bg-[#111] border-violet-500/20' : 'bg-violet-50 border-violet-200'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Secure Connection</div>
                      <div className="text-xs opacity-50">End-to-end encrypted</div>
                    </div>
                  </div>
                  <div className="text-xs opacity-60">
                    Connecting: <span className="font-mono text-violet-500">{email}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 block">
                    Access Key / Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoFocus
                    className={`w-full p-3 rounded-lg border outline-none text-sm transition-all ${
                      darkMode 
                        ? 'bg-[#111] border-white/10 text-white placeholder:text-neutral-600 focus:border-violet-500/50' 
                        : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400 focus:border-violet-500'
                    }`}
                  />
                </div>

                <div className={`p-3 rounded-lg text-xs ${
                  darkMode ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-100 text-amber-700'
                }`}>
                  <strong>App-Specific Passwords:</strong> Gmail and Outlook users may need to generate an app-specific password instead of using their main password.
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-violet-500 hover:underline"
                >
                  ← Back to email
                </button>
              </div>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
              <div className="space-y-3 animate-in fade-in duration-300">
                {verificationSteps.map((vstep, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                      vstep.status === 'active' 
                        ? (darkMode ? 'bg-violet-500/20 border-violet-500/50' : 'bg-violet-100 border-violet-300')
                        : vstep.status === 'complete'
                        ? (darkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-100 border-green-300')
                        : (darkMode ? 'bg-[#111] border-white/10' : 'bg-neutral-50 border-neutral-200')
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {vstep.status === 'active' && (
                        <Loader className="w-4 h-4 text-violet-500 animate-spin" />
                      )}
                      {vstep.status === 'complete' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {vstep.status === 'pending' && (
                        <div className="w-4 h-4 rounded-full border-2 border-neutral-500/30"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{vstep.name}</div>
                    </div>
                    {vstep.status === 'active' && vstep.icon}
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Verification Complete */}
            {step === 4 && (
              <div className="text-center py-8 animate-in fade-in duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-500/50">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verification Complete</h3>
                <p className="text-sm opacity-60 mb-4">Your account has been successfully initialized</p>
                <div className="text-xs font-mono text-violet-500">{email}</div>
              </div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <div className="text-center py-8 animate-in fade-in duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 via-violet-600 to-cyan-500 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-violet-500/50 animate-pulse">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Welcome to i.AM OS</h3>
                <p className="text-sm opacity-60 mb-4">Your email account is now connected</p>
                <div className={`inline-block px-4 py-2 rounded-full text-xs font-bold ${
                  darkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'
                }`}>
                  {detectProvider(email)} • Connected
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {step < 3 && (
            <div className={`p-6 border-t ${darkMode ? 'border-white/10' : 'border-neutral-200'}`}>
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !email) ||
                  (step === 2 && !password)
                }
                className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all ${
                  (step === 1 && !email) || (step === 2 && !password)
                    ? 'opacity-30 cursor-not-allowed bg-neutral-500'
                    : 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-violet-500/50'
                }`}
              >
                {step === 1 ? 'Continue' : 'Initialize Connection'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
