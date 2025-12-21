import { useState } from 'react';
import { X, Mail, Shield, Check, AlertCircle } from 'lucide-react';

interface EmailProvider {
    id: string;
    name: string;
    imapHost: string;
    imapPort: number;
    smtpHost: string;
    smtpPort: number;
}

const EMAIL_PROVIDERS: EmailProvider[] = [
    {
        id: 'icloud',
        name: 'iCloud',
        imapHost: 'imap.mail.me.com',
        imapPort: 993,
        smtpHost: 'smtp.mail.me.com',
        smtpPort: 587
    },
    {
        id: 'gmail',
        name: 'Gmail',
        imapHost: 'imap.gmail.com',
        imapPort: 993,
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587
    },
    {
        id: 'titan',
        name: 'Titan',
        imapHost: 'imap.titan.email',
        imapPort: 993,
        smtpHost: 'smtp.titan.email',
        smtpPort: 587
    },
    {
        id: 'outlook',
        name: 'Outlook',
        imapHost: 'outlook.office365.com',
        imapPort: 993,
        smtpHost: 'smtp.office365.com',
        smtpPort: 587
    },
    {
        id: 'custom',
        name: 'Custom',
        imapHost: '',
        imapPort: 993,
        smtpHost: '',
        smtpPort: 587
    }
];

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
}

export function SettingsModal({ isOpen, onClose, isDarkMode }: SettingsModalProps) {
    const [selectedProvider, setSelectedProvider] = useState<string>('icloud');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imapHost, setImapHost] = useState('imap.mail.me.com');
    const [imapPort, setImapPort] = useState(993);
    const [smtpHost, setSmtpHost] = useState('smtp.mail.me.com');
    const [smtpPort, setSmtpPort] = useState(587);
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    if (!isOpen) return null;

    const handleProviderChange = (providerId: string) => {
        setSelectedProvider(providerId);
        const provider = EMAIL_PROVIDERS.find(p => p.id === providerId);
        if (provider) {
            setImapHost(provider.imapHost);
            setImapPort(provider.imapPort);
            setSmtpHost(provider.smtpHost);
            setSmtpPort(provider.smtpPort);
        }
    };

    const handleTestConnection = async () => {
        setIsTestingConnection(true);
        setTestResult(null);

        try {
            const response = await fetch('/api/email/test-connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    imapHost,
                    imapPort,
                    smtpHost,
                    smtpPort
                })
            });

            const data = await response.json();

            if (response.ok) {
                setTestResult({ success: true, message: 'Connection successful! ✓' });
            } else {
                setTestResult({ success: false, message: data.error || 'Connection failed' });
            }
        } catch (error) {
            setTestResult({ success: false, message: 'Network error. Please try again.' });
        } finally {
            setIsTestingConnection(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            const response = await fetch('/api/email/save-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    imapHost,
                    imapPort,
                    smtpHost,
                    smtpPort
                })
            });

            if (response.ok) {
                alert('Email account connected successfully!');
                onClose();
                // Optionally reload emails
                window.location.reload();
            } else {
                const data = await response.json();
                alert(`Failed to save: ${data.error}`);
            }
        } catch (error) {
            alert('Failed to save configuration');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/70 backdrop-blur-2xl p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_60px_150px_-30px_rgba(0,0,0,0.5)] border pane-border overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b pane-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/15 rounded-2xl">
                            <Mail size={24} className="text-accent" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Email Settings</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Connect your email account</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Provider Selection */}
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                            Email Provider
                        </label>
                        <select
                            value={selectedProvider}
                            onChange={(e) => handleProviderChange(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border pane-border rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            {EMAIL_PROVIDERS.map(provider => (
                                <option key={provider.id} value={provider.id}>{provider.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border pane-border rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                            App-Specific Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••••••"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border pane-border rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            For Gmail/iCloud, use an app-specific password. <a href="https://support.apple.com/en-us/HT204397" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Learn more</a>
                        </p>
                    </div>

                    {/* IMAP Settings */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                                IMAP Host
                            </label>
                            <input
                                type="text"
                                value={imapHost}
                                onChange={(e) => setImapHost(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border pane-border rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                                IMAP Port
                            </label>
                            <input
                                type="number"
                                value={imapPort}
                                onChange={(e) => setImapPort(parseInt(e.target.value))}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border pane-border rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                    </div>

                    {/* SMTP Settings */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                                SMTP Host
                            </label>
                            <input
                                type="text"
                                value={smtpHost}
                                onChange={(e) => setSmtpHost(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border pane-border rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                                SMTP Port
                            </label>
                            <input
                                type="number"
                                value={smtpPort}
                                onChange={(e) => setSmtpPort(parseInt(e.target.value))}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border pane-border rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                    </div>

                    {/* Test Result */}
                    {testResult && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${testResult.success
                                ? 'bg-green-500/10 border border-green-500/20'
                                : 'bg-red-500/10 border border-red-500/20'
                            }`}>
                            {testResult.success ? (
                                <Check size={20} className="text-green-500" />
                            ) : (
                                <AlertCircle size={20} className="text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${testResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                {testResult.message}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t pane-border bg-slate-50/50 dark:bg-slate-800/10 flex gap-4">
                    <button
                        onClick={handleTestConnection}
                        disabled={isTestingConnection || !email || !password}
                        className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm uppercase tracking-wider font-bold hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isTestingConnection ? 'Testing...' : 'Test Connection'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !email || !password || !testResult?.success}
                        className="flex-1 px-6 py-3 bg-accent text-white rounded-xl text-sm uppercase tracking-wider font-bold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                        {isSaving ? 'Saving...' : 'Save & Connect'}
                    </button>
                </div>
            </div>
        </div>
    );
}
