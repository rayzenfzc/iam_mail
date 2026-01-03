import React, { useState } from 'react';
import { MonolithCard } from './MonolithCard';
import {
    User, Settings, Eye, PenTool, FileSignature, Inbox, Filter,
    Search, Bell, Calendar, Users, Shield, RefreshCw, Database,
    Keyboard, Umbrella, Info, X, ChevronLeft, Save
} from 'lucide-react';

interface SettingsPageProps {
    onClose: () => void;
    darkMode: boolean;
}

type SettingsPanelId = '01_AUTH' | '02_APPEARANCE' | '03_NOTIFICATIONS' | '04_PRIVACY' | '05_ABOUT' | null;

export const SettingsPage: React.FC<SettingsPageProps> = ({ onClose, darkMode }) => {
    const [activePanel, setActivePanel] = useState<SettingsPanelId>(null);

    const settingsItems = [
        {
            id: '01_AUTH',
            label: 'Profile & Account',
            description: 'Manage your profile, email, and credentials',
            icon: <User size={24} strokeWidth={1.5} />
        },
        {
            id: '02_APPEARANCE',
            label: 'Appearance',
            description: 'Theme, dark mode, and visual preferences',
            icon: <Eye size={24} strokeWidth={1.5} />
        },
        {
            id: '03_NOTIFICATIONS',
            label: 'Notifications',
            description: 'Email alerts and notification preferences',
            icon: <Bell size={24} strokeWidth={1.5} />
        },
        {
            id: '04_PRIVACY',
            label: 'Security & Privacy',
            description: 'Privacy controls and data protection',
            icon: <Shield size={24} strokeWidth={1.5} />
        },
        {
            id: '05_ABOUT',
            label: 'About & Help',
            description: 'App version, documentation, and support',
            icon: <Info size={24} strokeWidth={1.5} />
        }
    ];

    const renderPanel = () => {
        if (!activePanel) return null;

        const bgClass = darkMode
            ? 'bg-[#0A0A0A]/50 border-white/10 text-white'
            : 'bg-white/80 border-black/10 text-slate-900';

        const inputClass = darkMode
            ? 'bg-white/5 border-white/10 text-white placeholder-white/30'
            : 'bg-black/5 border-black/10 text-slate-900 placeholder-slate-400';

        return (
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${darkMode ? 'bg-black/50' : 'bg-white/50'}`}>
                <div className={`w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border backdrop-blur-2xl ${bgClass} animate-in zoom-in-95 duration-200`}>
                    {/* Header */}
                    <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="text-xl font-semibold">
                                {settingsItems.find(s => s.id === activePanel)?.label}
                            </h2>
                        </div>
                        <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {activePanel === '01_AUTH' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:ring-2 focus:ring-white/20 outline-none transition-all`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:ring-2 focus:ring-white/20 outline-none transition-all`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Change Password</label>
                                    <input
                                        type="password"
                                        placeholder="New password"
                                        className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:ring-2 focus:ring-white/20 outline-none transition-all mb-3`}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm password"
                                        className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:ring-2 focus:ring-white/20 outline-none transition-all`}
                                    />
                                </div>
                                <button className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                                    <Save size={16} />
                                    Save Changes
                                </button>
                            </>
                        )}

                        {activePanel === '02_APPEARANCE' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-4">Theme</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Light', 'Dark', 'Auto'].map(theme => (
                                            <button
                                                key={theme}
                                                className={`p-4 rounded-lg border text-center transition-all ${darkMode ? 'border-white/10 hover:bg-white/10' : 'border-black/10 hover:bg-black/5'} ${darkMode && theme === 'Dark' ? 'bg-white/10' : ''}`}
                                            >
                                                {theme}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-4">Font Size</label>
                                    <input type="range" min="12" max="18" className="w-full" />
                                    <div className="flex justify-between text-xs opacity-50 mt-2">
                                        <span>Small</span>
                                        <span>Large</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Density</label>
                                    <select className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:ring-2 focus:ring-white/20 outline-none transition-all`}>
                                        <option>Compact</option>
                                        <option>Comfortable</option>
                                        <option>Spacious</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {activePanel === '03_NOTIFICATIONS' && (
                            <>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Email Notifications', desc: 'Receive email alerts for new messages' },
                                        { label: 'Desktop Notifications', desc: 'Show desktop notifications' },
                                        { label: 'Sound Alerts', desc: 'Play sound for new messages' },
                                        { label: 'Calendar Reminders', desc: 'Get notified of upcoming events' }
                                    ].map(item => (
                                        <div key={item.label} className={`flex items-center justify-between p-4 rounded-lg border ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
                                            <div>
                                                <div className="font-medium">{item.label}</div>
                                                <div className="text-sm opacity-50 mt-1">{item.desc}</div>
                                            </div>
                                            <div className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-white' : 'bg-black'} cursor-pointer`}>
                                                <div className={`absolute top-1 right-1 w-4 h-4 rounded-full ${darkMode ? 'bg-black' : 'bg-white'} transition-transform`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {activePanel === '04_PRIVACY' && (
                            <>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', action: 'Enable' },
                                        { label: 'Session Timeout', desc: 'Auto-logout after inactivity', action: 'Configure' },
                                        { label: 'Data Encryption', desc: 'End-to-end encryption enabled', action: 'Active' },
                                        { label: 'Privacy Mode', desc: 'Hide sensitive information', action: 'Enable' }
                                    ].map(item => (
                                        <div key={item.label} className={`flex items-center justify-between p-4 rounded-lg border ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
                                            <div>
                                                <div className="font-medium">{item.label}</div>
                                                <div className="text-sm opacity-50 mt-1">{item.desc}</div>
                                            </div>
                                            <button className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition-colors`}>
                                                {item.action}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {activePanel === '05_ABOUT' && (
                            <div className="text-center space-y-4">
                                <div className={`text-6xl font-medium ${darkMode ? 'text-white' : 'text-black'}`}>i.AM</div>
                                <div className="text-sm opacity-50">Version 1.0.0</div>
                                <div className="text-sm opacity-50">© 2026 i.AM Mail. All rights reserved.</div>
                                <button className={`mt-6 px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition-colors`}>
                                    View Documentation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className="relative w-full h-full no-scrollbar"
            style={{
                fontFamily: "'Inter', sans-serif"
            }}
        >
            {/* Background Effects */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(${darkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)'} 1px, transparent 1px),
                        linear-gradient(90deg, ${darkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)'} 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                    zIndex: 0
                }}
            />

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: darkMode
                        ? 'radial-gradient(circle at 50% 0%, #0d0d0d 0%, #000 100%)'
                        : 'radial-gradient(circle at 50% 0%, #fff 0%, #f5f5f5 100%)',
                    zIndex: -1
                }}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 pb-40">
                {/* Grid Canvas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {settingsItems.map(item => (
                        <MonolithCard
                            key={item.id}
                            id={`ID: ${item.id}`}
                            label={item.label}
                            description={item.description}
                            icon={item.icon}
                            darkMode={darkMode}
                            onClick={() => setActivePanel(item.id as SettingsPanelId)}
                        />
                    ))}
                </div>
            </div>

            {/* Active Panel */}
            {renderPanel()}
        </div>
    );
};
