import React, { useState } from 'react';
import { Email } from '../types';
import { Search, Eye, MousePointer, CheckCheck, Clock, Ghost, MoreHorizontal, ArrowUpRight, Zap, Target } from 'lucide-react';

interface SentViewProps {
    sentEmails: Email[];
    onComposeFollowUp: (to: string, subject: string) => void;
}

// Extended mock type for "Sent" features
interface TrackingInfo {
    status: 'delivered' | 'opened' | 'clicked';
    openedAt?: string;
    clickedAt?: string;
    location?: string;
    device?: string;
    impactScore: number; // 0-100
    ghosted: boolean; // No reply > 3 days
}

// Mock wrapper to add tracking data to standard emails
const MOCK_SENT_DATA: (Email & { tracking: TrackingInfo })[] = [
    {
        id: 's1',
        senderName: 'Me',
        senderEmail: 'me@rayzen.ae',
        subject: 'Q3 Partnership Proposal - Rayzen x Global',
        preview: 'Hi Elena, attaching the proposal we discussed...',
        body: '...',
        time: '2 days ago',
        read: true,
        type: 'other',
        tracking: {
            status: 'clicked',
            openedAt: '2 days ago, 10:45 AM',
            clickedAt: '2 days ago, 10:48 AM',
            location: 'Dubai, UAE',
            impactScore: 92,
            ghosted: false
        }
    },
    {
        id: 's2',
        senderName: 'Me',
        senderEmail: 'me@rayzen.ae',
        subject: 'Follow up: Contract Signing',
        preview: 'Just checking in on the status of the contract...',
        body: '...',
        time: '4 days ago',
        read: true,
        type: 'other',
        tracking: {
            status: 'delivered',
            impactScore: 45,
            ghosted: true
        }
    },
    {
        id: 's3',
        senderName: 'Me',
        senderEmail: 'me@rayzen.ae',
        subject: 'Quick Coffee?',
        preview: 'Are you free next Tuesday?',
        body: '...',
        time: '1 hour ago',
        read: true,
        type: 'other',
        tracking: {
            status: 'opened',
            openedAt: '15 mins ago',
            impactScore: 78,
            ghosted: false
        }
    }
];

const SentView: React.FC<SentViewProps> = ({ sentEmails, onComposeFollowUp }) => {
    // Merge real sent emails with mock tracking data (for demo purposes)
    // In production, you'd match IDs or fetch from backend
    const [selectedId, setSelectedId] = useState<string | null>(MOCK_SENT_DATA[0].id);
    const [search, setSearch] = useState('');

    const displayEmails = [...MOCK_SENT_DATA, ...sentEmails.map(e => ({
        ...e,
        tracking: { status: 'delivered', impactScore: 60, ghosted: false } as TrackingInfo
    }))].filter(e => e.subject.toLowerCase().includes(search.toLowerCase()));

    const selectedEmail = displayEmails.find(e => e.id === selectedId) || displayEmails[0];

    const renderTimelineItem = (active: boolean, icon: any, label: string, time?: string) => (
        <div className={`flex gap-4 relative ${active ? 'opacity-100' : 'opacity-30 grayscale'}`}>
            <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white ${active ? 'border-indigo-600 text-indigo-600' : 'border-slate-200 text-slate-300'}`}>
                    {icon}
                </div>
                <div className="w-0.5 h-full bg-slate-100 -mt-2 -mb-2"></div>
            </div>
            <div className="pb-8">
                <div className={`text-sm font-bold ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</div>
                {time && <div className="text-xs text-slate-500 font-mono">{time}</div>}
            </div>
        </div>
    );

    return (
        <div className="flex-1 h-full bg-white flex overflow-hidden">
            {/* LEFT: Sent List */}
            <div className="w-full md:w-96 border-r border-slate-100 flex flex-col">
                {/* Header - Adjusted Padding for Mobile Menu */}
                <div className="px-6 py-6 border-b border-slate-100 pl-16 md:pl-6">
                    <h1 className="text-xl font-display font-medium text-slate-900 mb-4">i.Sent</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search sent mail..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border-none text-sm py-2.5 pl-9 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-200"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {displayEmails.map(email => (
                        <div 
                            key={email.id}
                            onClick={() => setSelectedId(email.id)}
                            className={`p-4 rounded-xl cursor-pointer border transition-all group
                                ${selectedId === email.id ? 'bg-white text-slate-900 border-slate-300 shadow-md ring-1 ring-slate-200' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className={`text-xs font-bold ${selectedId === email.id ? 'text-slate-900' : 'text-slate-900'}`}>
                                    To: {email.senderEmail === 'me@rayzen.ae' ? 'Unknown' : 'Recipient'} {/* Simplified for mock */}
                                </div>
                                <div className={`text-[10px] ${selectedId === email.id ? 'text-slate-500' : 'text-slate-400'}`}>{email.time}</div>
                            </div>
                            <div className={`text-sm font-medium mb-1 truncate ${selectedId === email.id ? 'text-slate-800' : 'text-slate-800'}`}>
                                {email.subject}
                            </div>
                            
                            {/* Tracking Pills */}
                            <div className="flex items-center gap-2 mt-3">
                                {email.tracking.status === 'clicked' && (
                                    <span className="flex items-center gap-1 text-[9px] bg-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                        <MousePointer size={10} /> Clicked
                                    </span>
                                )}
                                {email.tracking.status === 'opened' && (
                                    <span className="flex items-center gap-1 text-[9px] bg-blue-500/20 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                        <Eye size={10} /> Opened
                                    </span>
                                )}
                                {email.tracking.status === 'delivered' && (
                                    <span className="flex items-center gap-1 text-[9px] bg-slate-500/20 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                        <CheckCheck size={10} /> Delivered
                                    </span>
                                )}
                                {email.tracking.ghosted && (
                                    <span className="flex items-center gap-1 text-[9px] bg-red-500/20 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                                        <Ghost size={10} /> Ghosted
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Pursuit Dashboard - Hidden on mobile if viewing list (optional, but for now we stack) */}
            <div className={`
                flex-1 bg-slate-50 flex-col h-full overflow-hidden
                ${selectedId ? 'hidden md:flex' : 'hidden md:flex'} 
                /* Note: In a real mobile app, we'd toggle list/detail visibility similar to ContactsView. 
                   For now, we keep desktop layout structure but hide detail on very small screens to avoid confusion if needed, 
                   or just let it stack. Given the prompt, alignment was the key issue. */
                hidden md:flex
            `}>
                {selectedEmail ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                        <div className="max-w-3xl mx-auto space-y-8">
                            
                            {/* Top Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">i.Impact</span>
                                        <Target size={16} className="text-slate-300" />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-5xl font-display font-medium text-slate-900">{selectedEmail.tracking.impactScore}</span>
                                        <span className="text-sm text-slate-400 mb-1">/ 100</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
                                        <div className="bg-slate-900 h-full rounded-full" style={{ width: `${selectedEmail.tracking.impactScore}%` }}></div>
                                    </div>
                                    <div className="mt-2 text-xs text-slate-500">
                                        {selectedEmail.tracking.impactScore > 80 ? "High probability of reply based on subject line." : "Subject line could be more actionable."}
                                    </div>
                                </div>

                                <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-center items-center text-center
                                    ${selectedEmail.tracking.ghosted ? 'bg-red-50 border-red-100' : 'bg-white border-slate-200'}
                                `}>
                                    {selectedEmail.tracking.ghosted ? (
                                        <>
                                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3 animate-pulse">
                                                <Ghost size={24} />
                                            </div>
                                            <h3 className="text-sm font-bold text-red-900 mb-1">i.Ghosted</h3>
                                            <p className="text-xs text-red-700 mb-4">No reply in 4+ days. Time to bump?</p>
                                            <button 
                                                onClick={() => onComposeFollowUp(selectedEmail.senderEmail, `Re: ${selectedEmail.subject}`)}
                                                className="bg-red-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-2"
                                            >
                                                <Zap size={12} /> Auto-Bump Thread
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                                                <Clock size={24} />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 mb-1">i.Waiting</h3>
                                            <p className="text-xs text-slate-500">Engagement looks normal. Give it 24h.</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Timeline Journey */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-8 flex items-center gap-2">
                                    <ArrowUpRight size={16} /> i.Journey
                                </h3>
                                <div className="pl-2">
                                    {renderTimelineItem(true, <CheckCheck size={14} />, "Delivered to Server", selectedEmail.time)}
                                    {renderTimelineItem(
                                        selectedEmail.tracking.status === 'opened' || selectedEmail.tracking.status === 'clicked', 
                                        <Eye size={14} />, 
                                        "Opened by Recipient", 
                                        selectedEmail.tracking.openedAt
                                    )}
                                    {renderTimelineItem(
                                        selectedEmail.tracking.status === 'clicked', 
                                        <MousePointer size={14} />, 
                                        "Link Clicked (Engagement)", 
                                        selectedEmail.tracking.clickedAt
                                    )}
                                </div>
                            </div>

                            {/* Preview of Sent Content */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm opacity-70 hover:opacity-100 transition-opacity">
                                <div className="flex justify-between mb-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">i.Preview</h3>
                                    <MoreHorizontal size={16} className="text-slate-300" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900 mb-4">{selectedEmail.subject}</h2>
                                <div className="text-sm text-slate-600 leading-relaxed font-serif">
                                    {selectedEmail.preview}...
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">Select an email to track</div>
                )}
            </div>
        </div>
    );
};

export default SentView;