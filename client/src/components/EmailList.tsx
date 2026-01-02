import React, { useState, useRef } from 'react';
import { Email, ViewType } from '../types';
import { Menu, Archive, CheckCircle, MailOpen, Trash2, Zap } from 'lucide-react';

interface EmailListProps {
    emails: Email[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    title: string;
    isDark: boolean;
    onOpenMenu?: () => void;
    viewType: ViewType;
}

const EmailList: React.FC<EmailListProps> = ({ emails, selectedId, onSelect, title, isDark, onOpenMenu, viewType }) => {
    const [swipeStates, setSwipeStates] = useState<Record<string, number>>({});
    const [activeTab, setActiveTab] = useState<'focus' | 'other'>('focus');
    const touchStart = useRef<number>(0);

    const handleTouchStart = (e: React.TouchEvent, id: string) => {
        touchStart.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent, id: string) => {
        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStart.current;
        if (Math.abs(diff) < 150) {
            setSwipeStates(prev => ({ ...prev, [id]: diff }));
        }
    };

    const handleTouchEnd = (id: string) => {
        setSwipeStates(prev => ({ ...prev, [id]: 0 }));
    };

    // Filter emails based on view and tab
    const displayEmails = emails.filter(e => {
        if (viewType === 'inbox') {
            return e.category === activeTab && e.folder === 'inbox';
        }
        return e.folder === viewType;
    }).sort((a, b) => {
        // Simple sort by AI urgency then time
        const scoreA = a.urgencyScore ?? 0;
        const scoreB = b.urgencyScore ?? 0;
        return scoreB - scoreA;
    });

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Headless Header */}
            <div className="px-6 py-10 lg:py-6 flex flex-col gap-6 shrink-0 bg-transparent">
                <div className="flex items-center gap-6">
                    {onOpenMenu && (
                        <button
                            onClick={onOpenMenu}
                            className={`lg:hidden flex items-center gap-4 transition-all active:opacity-60 bg-transparent ${isDark ? 'text-white' : 'text-slate-900'}`}
                        >
                            <div className={`w-[2px] h-9 ${isDark ? 'bg-white/20' : 'bg-slate-900'} rounded-full`}></div>
                            <Menu size={28} strokeWidth={2.5} />
                        </button>
                    )}
                    <div className={`flex-1 ${isDark ? 'text-white/80' : 'text-slate-900'}`}>
                        <h2 className="section-label">
                            {title === 'Inbox' ? 'Inbound Flux' : title === 'Archive' ? 'Deep Storage' : title === 'Trash' ? 'Null Sector' : title}
                        </h2>
                    </div>
                </div>

                {/* Tabs for Inbox only - Styled to match screenshot */}
                {viewType === 'inbox' && (
                    <div className={`flex p-1 rounded-full border w-full max-w-[240px] ${isDark ? 'bg-white/10 border-white/5' : 'bg-white/30 border-slate-200'}`}>
                        <button
                            onClick={() => setActiveTab('focus')}
                            className={`flex-1 py-2 text-[0.6rem] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'focus' ? (isDark ? 'bg-white text-black shadow-lg' : 'bg-slate-900 text-white shadow-md') : (isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                        >
                            Focus
                        </button>
                        <button
                            onClick={() => setActiveTab('other')}
                            className={`flex-1 py-2 text-[0.6rem] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'other' ? (isDark ? 'bg-white text-black shadow-lg' : 'bg-slate-900 text-white shadow-md') : (isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                        >
                            Other
                        </button>
                    </div>
                )}
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto px-5 lg:px-4 custom-scrollbar pb-40 flex flex-col gap-4">
                {displayEmails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <CheckCircle size={40} className={isDark ? 'text-white' : 'text-slate-900'} />
                        <span className="mt-4 text-[0.6rem] font-black uppercase tracking-widest">No Messages</span>
                    </div>
                ) : (
                    displayEmails.map((mail) => {
                        const offset = swipeStates[mail.id] || 0;
                        const isHighPriority = (mail.urgencyScore ?? 0) > 80;

                        return (
                            <div key={mail.id} className="relative group rounded-md">
                                {/* Swipe Background Actions */}
                                <div className="absolute inset-0 flex items-center justify-between px-10">
                                    <div className={`flex items-center gap-3 transition-opacity duration-300 ${offset > 20 ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg">
                                            {mail.read ? <CheckCircle size={24} /> : <MailOpen size={24} />}
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-3 transition-opacity duration-300 ${offset < -20 ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                                            {viewType === 'trash' ? <Trash2 size={24} /> : <Archive size={24} />}
                                        </div>
                                    </div>
                                </div>

                                {/* Vitreous Glass Card */}
                                <div
                                    onTouchStart={(e) => handleTouchStart(e, mail.id)}
                                    onTouchMove={(e) => handleTouchMove(e, mail.id)}
                                    onTouchEnd={() => handleTouchEnd(mail.id)}
                                    onClick={() => onSelect(mail.id)}
                                    style={{ transform: `translateX(${offset}px)` }}
                                    className={`
                                        card-vitreous p-5 flex items-center gap-6 border backdrop-blur-[var(--sintered-blur)]
                                        ${selectedId === mail.id
                                            ? (isDark ? 'bg-white/10 border-[var(--vitreous-secondary)]/50' : 'bg-white border-slate-900')
                                            : (isDark ? 'bg-[var(--vitreous-glass)] border-[var(--vitreous-border)]' : 'bg-white/30 border-white/40')}
                                    `}
                                >
                                    {/* Sintered Texture Overlay */}
                                    <div className="sintered-texture">
                                        <svg width="100%" height="100%">
                                            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                                        </svg>
                                    </div>

                                    <div className="email-meta-left">
                                        <div className="avatar-vessel" style={{ width: '40px', height: '40px', fontSize: '0.8rem' }}>
                                            {mail.senderName.charAt(0)}
                                        </div>
                                        {!mail.read && <div className="unread-indicator"></div>}
                                    </div>

                                    <div className="email-content">
                                        <div className="flex items-center gap-2">
                                            <div className="email-sender">{mail.senderName}</div>
                                            {isHighPriority && (
                                                <div className="px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                                                    <Zap size={10} className="text-amber-500 fill-amber-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="email-subject">{mail.subject}</div>
                                        <div className="email-preview">{mail.preview}</div>
                                    </div>

                                    <div className="email-time">{mail.time}</div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default EmailList;