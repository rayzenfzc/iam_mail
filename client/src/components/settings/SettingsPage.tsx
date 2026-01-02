import React from 'react';
import { MonolithCard } from './MonolithCard';
import {
    User, Settings, Eye, PenTool, FileSignature, Inbox, Filter,
    Search, Bell, Calendar, Users, Shield, RefreshCw, Database,
    Keyboard, Umbrella, Info, X
} from 'lucide-react';

interface SettingsPageProps {
    onClose: () => void;
    darkMode: boolean;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onClose, darkMode }) => {
    const settingsItems = [
        {
            id: 'ID: 01_AUTH',
            label: 'Profile & Account',
            description: 'Manage your profile, email, and credentials',
            icon: <User size={24} strokeWidth={1.5} />
        },
        {
            id: 'ID: 02_APPEARANCE',
            label: 'Appearance',
            description: 'Theme, dark mode, and visual preferences',
            icon: <Eye size={24} strokeWidth={1.5} />
        },
        {
            id: 'ID: 03_NOTIFICATIONS',
            label: 'Notifications',
            description: 'Email alerts and notification preferences',
            icon: <Bell size={24} strokeWidth={1.5} />
        },
        {
            id: 'ID: 04_PRIVACY',
            label: 'Security & Privacy',
            description: 'Privacy controls and data protection',
            icon: <Shield size={24} strokeWidth={1.5} />
        },
        {
            id: 'ID: 05_ABOUT',
            label: 'About & Help',
            description: 'App version, documentation, and support',
            icon: <Info size={24} strokeWidth={1.5} />
        }
    ];

    return (
        <div
            className="relative w-full h-full no-scrollbar"
            style={{
                fontFamily: "'Inter', sans-serif"
            }}
        >
            {/* Background Effects - Now Absolute to the inline container */}
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
                            id={item.id}
                            label={item.label}
                            description={item.description}
                            icon={item.icon}
                            darkMode={darkMode}
                            onClick={() => console.log('Clicked', item.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
