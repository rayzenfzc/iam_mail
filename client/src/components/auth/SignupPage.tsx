import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ScanFace, Fingerprint, AlertCircle, CheckCircle } from 'lucide-react';

interface SignupPageProps {
    onSignup: (userId: string, token: string) => void;
    onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || '';

    // Password strength check
    const getPasswordStrength = (pwd: string): { level: number; label: string; color: string } => {
        if (pwd.length === 0) return { level: 0, label: '', color: '' };
        if (pwd.length < 6) return { level: 1, label: 'Weak', color: 'bg-red-500' };
        if (pwd.length < 8) return { level: 2, label: 'Fair', color: 'bg-yellow-500' };
        if (pwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
            return { level: 4, label: 'Strong', color: 'bg-green-500' };
        }
        return { level: 3, label: 'Good', color: 'bg-blue-500' };
    };

    const passwordStrength = getPasswordStrength(password);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passcodes do not match');
            return;
        }

        if (password.length < 6) {
            setError('Passcode must be at least 6 characters');
            return;
        }

        setError(null);
        setIsLoading(true);
        setStatus('Generating Identity Hash...');

        try {
            await new Promise(r => setTimeout(r, 500));
            setStatus('Creating Neural Link...');

            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Identity creation failed');
            }

            setStatus('Identity Established.');
            await new Promise(r => setTimeout(r, 400));

            // Store auth data
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('iam_email_user', data.user.id);
            localStorage.setItem('user_email', data.user.email);

            onSignup(data.user.id, data.token);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            setIsLoading(false);
            setStatus('');
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center relative overflow-hidden font-sans text-slate-900">

            {/* i.AM ATMOSPHERE (Mesh Background) */}
            <style>{`
        @keyframes float-mesh {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-mesh-slow { animation: float-mesh 20s ease-in-out infinite; }
        .bg-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
        }
      `}</style>

            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-slate-200/40 rounded-full blur-[100px] mix-blend-multiply animate-mesh-slow"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-slate-300/30 rounded-full blur-[100px] mix-blend-multiply animate-mesh-slow" style={{ animationDelay: '-10s' }}></div>
            </div>
            <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none z-0"></div>

            {/* THE MONOLITH (Card) */}
            <div className="w-full max-w-[420px] px-6 relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 mb-6 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="text-2xl font-light tracking-tighter text-slate-900">i.<span className="font-bold">M</span></span>
                    </div>
                    <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">i.CREATE</h1>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">New Identity Protocol</p>
                </div>

                {/* Form Container */}
                <div className="w-full bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl shadow-slate-200/40 relative overflow-hidden">

                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                            <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
                                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-t-slate-900 rounded-full animate-spin"></div>
                                <ScanFace size={24} className="text-slate-900" strokeWidth={1.5} />
                            </div>
                            <div className="text-sm font-bold text-slate-900 mb-1">{status}</div>
                            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">v2.4.0 Secure</div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && !isLoading && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
                            <AlertCircle size={18} />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

                        {/* Name */}
                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 ml-1 group-focus-within:text-slate-900 transition-colors">Designation</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                                    <User size={18} strokeWidth={1.5} />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl py-4 pl-11 pr-4 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder:text-slate-300"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 ml-1 group-focus-within:text-slate-900 transition-colors">Identity</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                                    <Mail size={18} strokeWidth={1.5} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl py-4 pl-11 pr-4 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder:text-slate-300"
                                    placeholder="user@rayzen.ae"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 ml-1 group-focus-within:text-slate-900 transition-colors">Passcode</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                                    <Lock size={18} strokeWidth={1.5} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl py-4 pl-11 pr-11 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder:text-slate-300"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {/* Password Strength */}
                            {password.length > 0 && (
                                <div className="mt-2 flex items-center gap-2 ml-1">
                                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                            style={{ width: `${passwordStrength.level * 25}%` }}
                                        />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">{passwordStrength.label}</span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 ml-1 group-focus-within:text-slate-900 transition-colors">Confirm Passcode</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                                    <Lock size={18} strokeWidth={1.5} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full bg-white/50 border text-slate-900 text-sm font-medium rounded-xl py-4 pl-11 pr-11 focus:outline-none focus:bg-white focus:ring-1 focus:border-slate-900 transition-all placeholder:text-slate-300 ${confirmPassword.length > 0
                                            ? passwordsMatch
                                                ? 'border-green-400 focus:ring-green-400'
                                                : 'border-red-400 focus:ring-red-400'
                                            : 'border-slate-200 focus:ring-slate-900'
                                        }`}
                                    placeholder="••••••••"
                                    required
                                />
                                {confirmPassword.length > 0 && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {passwordsMatch ? (
                                            <CheckCircle size={16} className="text-green-500" />
                                        ) : (
                                            <AlertCircle size={16} className="text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action */}
                        <button
                            type="submit"
                            disabled={isLoading || !passwordsMatch}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
                        >
                            Establish Identity
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center">
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            Already have an identity? <span className="text-slate-900">Authenticate</span>
                        </button>
                    </div>

                </div>

                {/* Bottom Metadata */}
                <div className="mt-8 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.2em] text-slate-500 font-medium">
                        <Fingerprint size={12} />
                        <span>Secured by i.AM Core</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SignupPage;
