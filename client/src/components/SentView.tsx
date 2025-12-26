import React, { useState, useEffect } from 'react';
import { Email } from '../types';
import { Search, Eye, MousePointer, CheckCheck, Clock, Ghost, Menu, ArrowUpRight, Target, RefreshCw, Smartphone } from 'lucide-react';

interface SentViewProps {
    sentEmails: Email[];
    onComposeFollowUp: (to: string, subject: string) => void;
    isDark?: boolean;
    onOpenMenu?: () => void;
}

interface TrackingInfo {
    isEnabled: boolean;
    status: 'delivered' | 'opened' | 'clicked';
    openedAt?: string;
    clickedAt?: string;
    location?: string;
    device?: string;
    impactScore: number;
    ghosted: boolean;
    openCount?: number;
}

interface TrackedEmail extends Email {
    recipientEmail?: string;
    tracking: TrackingInfo;
}

const SentView: React.FC<SentViewProps> = ({ sentEmails, onComposeFollowUp, isDark = false, onOpenMenu }) => {
    const [emails, setEmails] = useState<TrackedEmail[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const API_URL = import.meta.env.VITE_API_URL || '';

    // Fetch sent emails with tracking data
    const fetchSentEmails = async () => {
        try {
            const response = await fetch(`${API_URL}/api/sent-emails`);
            if (response.ok) {
                const data = await response.json();
                setEmails(data);
                if (data.length > 0 && !selectedId) {
                    setSelectedId(data[0].id);
                }
            }
        } catch (error) {
            console.error('Failed to fetch sent emails:', error);
        } finally {
            setIsLoading(false);
            setLastRefresh(new Date());
        }
    };

    // Initial fetch and polling every 10 seconds
    useEffect(() => {
        fetchSentEmails();
        const interval = setInterval(fetchSentEmails, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [API_URL]);

    // Also include passed sentEmails as fallback
    const displayEmails = emails.length > 0 ? emails : sentEmails.map(e => ({
        ...e,
        tracking: { isEnabled: true, status: 'delivered', impactScore: 60, ghosted: false } as TrackingInfo
    }));

    const filteredEmails = displayEmails.filter(e =>
        e.subject.toLowerCase().includes(search.toLowerCase()) ||
        (e.recipientEmail && e.recipientEmail.toLowerCase().includes(search.toLowerCase()))
    );

    const selectedEmail = filteredEmails.find(e => e.id === selectedId) || filteredEmails[0];

    const renderTimelineItem = (active: boolean, icon: any, label: string, time?: string) => (
        <div className={`flex gap-4 relative ${active ? 'opacity-100' : 'opacity-30 grayscale'}`}>
            <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${active ? (isDark ? 'border-indigo-400 text-indigo-400 bg-black' : 'border-indigo-600 text-indigo-600 bg-white') : 'border-slate-200 text-slate-300'}`}>
                    {icon}
                </div>
                <div className={`w-0.5 h-full -mt-2 -mb-2 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}></div>
            </div>
            <div className="pb-8">
                <div className={`text-sm font-bold ${active ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-400'}`}>{label}</div>
                {time && <div className="text-xs text-slate-500 font-mono">{time}</div>}
            </div>
        </div>
    );

    return (
        <div className="flex flex-1 gap-0 lg:gap-8 overflow-hidden h-full relative">
            {/* LEFT: Sent List */}
            <div className={`w-full lg:w-[380px] flex flex-col h-full overflow-hidden transition-all duration-300`}>
                {/* Header */}
                <div className="px-6 py-10 lg:py-4 flex items-center gap-6 shrink-0 bg-transparent">
                    {onOpenMenu && (
                        <button onClick={onOpenMenu} className={`lg:hidden flex items-center gap-4 transition-all ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <div className={`w-[2px] h-9 ${isDark ? 'bg-slate-600' : 'bg-slate-900'} rounded-full`}></div>
                            <Menu size={26} strokeWidth={2.5} />
                        </button>
                    )}
                    <div className={`flex-1 flex justify-between items-center ${isDark ? 'text-white/80' : 'text-slate-900'}`}>
                        <span className="text-[1rem] font-black uppercase tracking-[0.8em]">SENT</span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchSentEmails}
                                className={`p-2 rounded-lg transition-all hover:scale-105 ${isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                            </button>
                            <span className="opacity-20 font-mono text-[0.55rem] hidden sm:block">
                                {filteredEmails.length} emails
                            </span>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="px-5 lg:px-4 mb-4">
                    <div className="relative group">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={14} />
                        <input
                            type="text"
                            placeholder="Search sent mail..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full text-sm py-4 pl-12 pr-4 rounded-[1rem] focus:outline-none transition-all ${isDark ? 'bg-white/5 border border-white/5 text-white placeholder:text-slate-600' : 'bg-white/30 backdrop-blur-md border border-white text-slate-900 focus:bg-white focus:shadow-sm'}`}
                        />
                    </div>
                </div>

                {/* Email List */}
                <div className="flex-1 overflow-y-auto px-5 lg:px-4 custom-scrollbar pb-40 flex flex-col gap-4">
                    {filteredEmails.length === 0 ? (
                        <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <Clock size={40} className="mx-auto mb-4 opacity-30" />
                            <p className="text-sm">No sent emails yet</p>
                        </div>
                    ) : (
                        filteredEmails.map(email => (
                            <div
                                key={email.id}
                                onClick={() => setSelectedId(email.id)}
                                className={`p-6 rounded-[1rem] cursor-pointer border transition-all relative backdrop-blur-md
                                    ${selectedId === email.id
                                        ? (isDark ? 'bg-white/25 border-white/20 shadow-2xl' : 'bg-white/60 border-slate-900 shadow-xl')
                                        : (isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white/30 border-white/40 hover:bg-white/50 hover:shadow-md')}
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`text-[0.6rem] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                                        TO: {email.recipientEmail?.split('@')[0] || 'Unknown'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Tracking Status Badge */}
                                        {email.tracking.status === 'opened' && (
                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20">
                                                <Eye size={10} className="text-emerald-500" />
                                                <span className="text-[0.55rem] text-emerald-500 font-bold">
                                                    {email.tracking.openCount && email.tracking.openCount > 1
                                                        ? `${email.tracking.openCount}x`
                                                        : 'OPENED'}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`text-[0.55rem] font-mono opacity-50 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {email.time}
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-[0.95rem] font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {email.subject}
                                </div>
                                {/* Ghost indicator */}
                                {email.tracking.ghosted && (
                                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT: Pursuit Dashboard */}
            <div className="flex-1 relative overflow-hidden h-full hidden lg:flex flex-col pr-8 pb-8 pt-20">
                {selectedEmail && (
                    <div className={`
                        w-full h-full rounded-[1rem] border flex flex-col relative overflow-hidden transition-all duration-500
                        ${isDark ? 'bg-[#121214]/60 backdrop-blur-3xl border-white/5 shadow-black/40' : 'bg-white/40 backdrop-blur-xl border-white/60 shadow-xl shadow-slate-900/[0.03]'}
                    `}>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
                            <div className="max-w-3xl mx-auto w-full space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Impact Card */}
                                    <div className={`p-8 rounded-[1rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/30 border-white'}`}>
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="text-[0.6rem] uppercase tracking-[0.5em] font-black text-slate-400">Impact_Metric</span>
                                            <Target size={20} className="text-slate-300" />
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <span className={`text-6xl font-display font-light ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {selectedEmail.tracking.impactScore}
                                            </span>
                                            <span className="text-sm text-slate-400 mb-2">/ 100</span>
                                        </div>
                                        {/* Device and Location info */}
                                        {(selectedEmail.tracking.device || selectedEmail.tracking.location) && (
                                            <div className="mt-4 pt-4 border-t border-slate-200/10">
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    {selectedEmail.tracking.device && (
                                                        <span className="flex items-center gap-1">
                                                            <Smartphone size={12} />
                                                            {selectedEmail.tracking.device}
                                                        </span>
                                                    )}
                                                    {selectedEmail.tracking.location && (
                                                        <span>• {selectedEmail.tracking.location}</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Card */}
                                    <div className={`p-8 rounded-[1rem] border flex flex-col items-center text-center justify-center 
                                        ${selectedEmail.tracking.ghosted
                                            ? 'bg-red-500/10 border-red-500/20'
                                            : selectedEmail.tracking.status === 'opened'
                                                ? 'bg-emerald-500/10 border-emerald-500/20'
                                                : (isDark ? 'bg-white/5 border-white/5' : 'bg-white/30 border-white')}
                                    `}>
                                        {selectedEmail.tracking.ghosted ? (
                                            <>
                                                <Ghost size={32} className="mb-4 text-red-500 animate-pulse" />
                                                <h3 className="text-sm font-black uppercase tracking-widest text-red-500">THREAD_GHOSTED</h3>
                                                <p className="text-xs text-red-400/70 mt-2">No response in 3+ days</p>
                                                <button
                                                    onClick={() => onComposeFollowUp(selectedEmail.recipientEmail || '', `BUMP: ${selectedEmail.subject}`)}
                                                    className={`mt-4 px-6 py-2 rounded-[0.5rem] text-[0.6rem] font-black uppercase tracking-[0.2em] transition-transform hover:scale-105 ${isDark ? 'bg-red-500 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-500/30'}`}
                                                >
                                                    RE_ENGAGE
                                                </button>
                                            </>
                                        ) : selectedEmail.tracking.status === 'opened' ? (
                                            <>
                                                <Eye size={32} className="mb-4 text-emerald-500" />
                                                <h3 className={`text-sm font-black uppercase tracking-widest text-emerald-500`}>EMAIL_OPENED</h3>
                                                {selectedEmail.tracking.openCount && selectedEmail.tracking.openCount > 1 && (
                                                    <p className="text-xs text-emerald-400/70 mt-2">
                                                        Viewed {selectedEmail.tracking.openCount} times
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Clock size={32} className="mb-4 text-amber-500" />
                                                <h3 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>AWAITING_PULSE</h3>
                                                <p className="text-xs text-slate-400 mt-2">Waiting for recipient to open</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Timeline Card */}
                                <div className={`p-10 rounded-[1rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/30 border-white'}`}>
                                    <h3 className={`text-[0.6rem] font-black uppercase tracking-[0.5em] mb-12 flex items-center gap-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        <ArrowUpRight size={16} /> i.JOURNEY_LOG
                                    </h3>
                                    <div className="pl-4">
                                        {renderTimelineItem(true, <CheckCheck size={14} />, "SENT_CONFIRMED", selectedEmail.time)}
                                        {renderTimelineItem(
                                            selectedEmail.tracking.status === 'opened' || selectedEmail.tracking.status === 'clicked',
                                            <Eye size={14} />,
                                            "RECIPIENT_OPENED",
                                            selectedEmail.tracking.openedAt
                                        )}
                                        {renderTimelineItem(
                                            selectedEmail.tracking.status === 'clicked',
                                            <MousePointer size={14} />,
                                            "ACTION_CLICKED",
                                            selectedEmail.tracking.clickedAt
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SentView;