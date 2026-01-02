import React from 'react';
import MonolithCard from './ui/MonolithCard';
import { Icons } from './ui/MonolithIcons';
import { ViewType } from '../types';

interface DashboardProps {
    isDark: boolean;
    onCompose: () => void;
    onToggleTheme: () => void;
    onViewChange: (view: ViewType) => void;
    onOpenSettings: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isDark, onCompose, onViewChange, onOpenSettings }) => {
    // We map the requested cards to actual app functions
    const cards = [
        { label: 'Primary', name: 'INBOX', icon: <Icons.Inbox />, action: () => onViewChange('inbox') },
        { label: 'Creative', name: 'COMPOSE', icon: <Icons.Compose />, action: onCompose },
        { label: 'Nav', name: 'BACK', icon: <Icons.Back />, action: () => window.history.back() }, // Or previous view if managed
        { label: 'Root', name: 'HOME', icon: <Icons.Home />, action: () => onViewChange('dashboard') },
        { label: 'Action', name: 'SEND', icon: <Icons.Send />, action: () => onViewChange('sent') }, // Assuming 'sent' view exists
        { label: 'Status', name: 'UNREAD', icon: <Icons.Unread />, action: () => onViewChange('inbox') }, // Maybe filter unread
        { label: 'Neural', name: 'AI CORE', icon: <Icons.AICore />, action: () => console.log('AI Core') },
        { label: 'Schedule', name: 'CALENDAR', icon: <Icons.Calendar />, action: () => onViewChange('calendar') },
        { label: 'Social', name: 'CONTACTS', icon: <Icons.Contacts />, action: () => onViewChange('contacts') },
        { label: 'System', name: 'SETTINGS', icon: <Icons.Settings />, action: onOpenSettings },
        { label: 'Cold Storage', name: 'ARCHIVE', icon: <Icons.Archive />, action: () => onViewChange('archive') },
        { label: 'Purge', name: 'DELETE', icon: <Icons.Delete />, action: () => onViewChange('trash') },
        { label: 'Response', name: 'REPLY', icon: <Icons.Reply />, action: () => console.log('Select email to reply') },
        { label: 'Triage', name: 'MARK READ', icon: <Icons.MarkRead />, action: () => console.log('Mark read') },
        { label: 'Comms', name: 'EMAIL', icon: <Icons.Email />, action: () => onViewChange('inbox') },
        { label: 'Query', name: 'SEARCH', icon: <Icons.Search />, action: () => console.log('Focus Search') },
        { label: 'Append', name: 'NEW CONTACT', icon: <Icons.NewContact />, action: () => onViewChange('contacts') },
    ];

    return (
        <div className="min-h-screen w-full flex justify-center bg-[#020202] text-white font-inter relative overflow-x-hidden">
            {/* Background Lines / Gradient */}
            <div className="fixed top-0 left-0 w-full h-full z-0 opacity-50 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #111 0%, #000 100%)' }}>
            </div>

            <main className="canvas relative z-10 w-full max-w-[1100px] p-5 py-16 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
                {cards.map((card, i) => (
                    <MonolithCard
                        key={i}
                        label={card.label}
                        name={card.name}
                        icon={card.icon}
                        onClick={card.action}
                    />
                ))}
            </main>
        </div>
    );
};

export default Dashboard;
