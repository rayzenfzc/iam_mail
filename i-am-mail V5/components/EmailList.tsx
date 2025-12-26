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
        return b.urgencyScore - a.urgencyScore; 
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
                    <div className={`flex-1 flex justify-between items-center bg-transparent ${isDark ? 'text-white/80' : 'text-slate-900'}`}>
                        <div className="flex flex-col gap-1">
                            <span className="opacity-20 font-mono text-[0.55rem] uppercase tracking-widest hidden sm:block">MAILBOX_NODE_01</span>
                            <span className="text-[1.2rem] font-black uppercase tracking-[0.4em] leading-none">{title.split('').join(' ')}</span>
                        </div>
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
                        const isHighPriority = mail.urgencyScore > 80;
                        
                        return (
                            <div key={mail.id} className="relative group rounded-[1.5rem]">
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

                                {/* Frosted Glass Card - HIGHLY TRANSPARENT TO SHOW DOTS */}
                                <div 
                                    onTouchStart={(e) => handleTouchStart(e, mail.id)}
                                    onTouchMove={(e) => handleTouchMove(e, mail.id)}
                                    onTouchEnd={() => handleTouchEnd(mail.id)}
                                    onClick={() => onSelect(mail.id)}
                                    style={{ transform: `translateX(${offset}px)` }}
                                    className={`
                                        p-6 lg:p-8 rounded-[1.5rem] border transition-all cursor-pointer relative z-10 backdrop-blur-md
                                        ${selectedId === mail.id 
                                            ? (isDark ? 'bg-white/25 border-white/20 shadow-2xl' : 'bg-white/60 border-slate-900 shadow-2xl') 
                                            : (isDark ? 'bg-[#1A1A1C]/40 border-white/5 hover:bg-[#252528]/60' : 'bg-white/30 border-white/40 shadow-sm hover:bg-white/50 hover:border-white')}
                                    `}
                                >
                                    {!mail.read && (
                                        <div className={`absolute top-8 left-4 w-1.5 h-1.5 rounded-full shadow-lg ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'}`}></div>
                                    )}
                                    <div className="flex justify-between items-start mb-2 pl-2">
                                        <span className={`text-[0.7rem] font-black uppercase tracking-[0.1em] ${isDark ? 'text-white/60' : 'text-slate-700'}`}>
                                            {mail.senderName}
                                        </span>
                                        <span className={`text-[0.6rem] font-mono font-bold opacity-40 ${isDark ? 'text-white' : 'text-slate-900'}`}>{mail.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-1 pl-2">
                                        <h3 className={`text-[1rem] font-bold leading-tight tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {mail.subject}
                                        </h3>
                                        {/* AI Urgency Indicator */}
                                        {isHighPriority && (
                                            <div className="px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                                                <Zap size={10} className="text-amber-500 fill-amber-500" />
                                            </div>
                                        )}
                                    </div>
                                    <p className={`text-[0.85rem] font-medium line-clamp-2 leading-relaxed pl-2 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                                        {mail.preview}
                                    </p>
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