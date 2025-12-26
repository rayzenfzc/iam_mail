import React, { useState, useEffect } from 'react';
import { Email } from '../types';
import { FileText, Download, Reply, Forward, Trash2, X, ChevronLeft, ChevronRight, CheckCircle2, MoreVertical, Paperclip, Sparkles, BrainCircuit, Wand2, ReplyAll, Loader2 } from 'lucide-react';
import AICommandBar from './AICommandBar';

const API_URL = import.meta.env.VITE_API_URL || '';

interface EmailDetailProps {
    email: Email | null;
    isDark: boolean;
    onClose?: () => void;
    onReply?: () => void;
    onForward?: () => void;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ email, isDark, onClose, onReply, onForward }) => {
    const [threadIndex, setThreadIndex] = useState(0);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);

    useEffect(() => {
        if (email) {
            setSummary(email.aiSummary || null);
            setThreadIndex(0);
        }
    }, [email]);

    const handleSummarize = async () => {
        if (!email) return;
        setIsSummarizing(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_URL}/api/ai/summarize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                body: JSON.stringify({
                    email: {
                        subject: email.subject,
                        from: email.senderEmail,
                        body: email.body
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Summarization failed');
            }

            const data = await response.json();
            setSummary(data.summary || "Could not generate summary.");
        } catch (e) {
            console.error('Summary error:', e);
            setSummary("Failed to generate summary. Please try again.");
        } finally {
            setIsSummarizing(false);
        }
    };

    if (!email) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center opacity-30 select-none">
                <div className="flex items-center gap-3 mb-6 group cursor-default">
                    <div className="w-1 h-14 bg-slate-300 rounded-full"></div>
                    <span className={`text-6xl lg:text-[8rem] font-display font-light tracking-tighter uppercase ${isDark ? 'text-white/10' : 'text-slate-200'}`}>
                        I.<span className="font-bold">AM</span>
                    </span>
                </div>
                <div className={`text-[0.6rem] uppercase tracking-[1em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Workspace_Idle</div>
            </div>
        );
    }

    // Handle threads if they exist
    const thread = email.thread || [email];
    const currentMessage = thread[threadIndex];
    const totalMessages = thread.length;

    return (
        <div className="flex flex-col h-full bg-transparent relative z-0">

            {/* HEADLESS HEADER - Matches Sent View & Composer */}
            <div className="px-6 py-10 lg:py-8 flex items-center gap-6 shrink-0 bg-transparent z-20">
                <div className="flex items-center gap-4">
                    <div className={`w-[2px] h-9 ${isDark ? 'bg-slate-600' : 'bg-slate-900'} rounded-full`}></div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full transition-all hover:-translate-x-1 ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
                        >
                            <ChevronLeft size={24} strokeWidth={2.5} />
                        </button>
                    )}
                </div>

                <div className={`flex-1 flex justify-between items-center ${isDark ? 'text-white/80' : 'text-slate-900'}`}>
                    <span className="text-[1rem] font-black uppercase tracking-[0.8em]">READING</span>
                    <span className="opacity-20 font-mono text-[0.55rem] hidden sm:block">INCOMING_SECURE</span>
                </div>

                {/* Thread Nav (Mini) */}
                {totalMessages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setThreadIndex(prev => Math.max(0, prev - 1))}
                            disabled={threadIndex === 0}
                            className={`p-2 rounded-full disabled:opacity-20 ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-[0.6rem] font-mono font-bold opacity-50">{threadIndex + 1}/{totalMessages}</span>
                        <button
                            onClick={() => setThreadIndex(prev => Math.min(totalMessages - 1, prev + 1))}
                            disabled={threadIndex === totalMessages - 1}
                            className={`p-2 rounded-full disabled:opacity-20 ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Content - Floating Glass Card below Headless Header */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 relative z-10 custom-scrollbar">
                <div className={`
                min-h-full rounded-[1.5rem] p-8 lg:p-12 border transition-all relative overflow-hidden
                ${isDark ? 'bg-[#121214]/40 backdrop-blur-md border-white/10' : 'bg-white/30 backdrop-blur-md border-white/40 shadow-xl shadow-slate-900/5'}
             `}>
                    {/* Sender Header inside card */}
                    <div className={`flex flex-col gap-6 mb-8 border-b border-dashed pb-8 ${isDark ? 'border-white/10' : 'border-slate-300/50'}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center text-lg font-black border
                                    ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/50 border-white text-slate-900 shadow-sm'}
                                `}>
                                    {currentMessage.senderName.charAt(0)}
                                </div>
                                <div>
                                    <div className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {currentMessage.senderName}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[0.65rem] font-bold uppercase tracking-widest opacity-60">{currentMessage.senderEmail}</span>
                                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.5rem] font-black uppercase tracking-widest border ${isDark ? 'border-indigo-400/30 text-indigo-400' : 'border-indigo-600/20 text-indigo-600 bg-indigo-50/20'}`}>
                                            <CheckCircle2 size={10} strokeWidth={3} /> Verified
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`text-xs font-mono font-bold opacity-50 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {currentMessage.time}
                            </div>
                        </div>

                        {/* Subject Line Large */}
                        <div className={`text-2xl font-black leading-tight tracking-tight mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {email.subject}
                        </div>

                        {/* Actions Toolbar */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2">
                            <button
                                onClick={onReply}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[0.75rem] border text-[0.6rem] font-black uppercase tracking-widest transition-all hover:scale-105 ${isDark ? 'border-white/10 hover:bg-white/5 text-slate-300' : 'bg-white/50 border-slate-200 hover:shadow-sm text-slate-700'}`}
                            >
                                <Reply size={14} strokeWidth={2} /> Reply
                            </button>
                            <button
                                onClick={onReply}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[0.75rem] border text-[0.6rem] font-black uppercase tracking-widest transition-all hover:scale-105 ${isDark ? 'border-white/10 hover:bg-white/5 text-slate-300' : 'bg-white/50 border-slate-200 hover:shadow-sm text-slate-700'}`}
                            >
                                <ReplyAll size={14} strokeWidth={2} /> Reply All
                            </button>
                            <button
                                onClick={onForward}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[0.75rem] border text-[0.6rem] font-black uppercase tracking-widest transition-all hover:scale-105 ${isDark ? 'border-white/10 hover:bg-white/5 text-slate-300' : 'bg-white/50 border-slate-200 hover:shadow-sm text-slate-700'}`}
                            >
                                <Forward size={14} strokeWidth={2} /> Forward
                            </button>
                            <div className={`w-px mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-300/50'}`}></div>
                            <button className={`w-9 h-9 flex items-center justify-center rounded-[0.75rem] border transition-all hover:scale-105 ${isDark ? 'border-white/10 text-slate-500 hover:text-red-400 hover:bg-white/5' : 'bg-white/50 border-slate-200 text-slate-500 hover:text-red-600 hover:shadow-sm'}`}>
                                <Trash2 size={14} strokeWidth={2} />
                            </button>
                        </div>
                    </div>

                    {/* Intelligence Panel - AI Summarization */}
                    <div className={`hidden lg:flex mb-8 p-6 rounded-[1rem] border flex-col gap-4 ${isDark ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50/30 border-indigo-100/50'}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <BrainCircuit size={16} className={isDark ? 'text-indigo-400' : 'text-indigo-600'} />
                                <span className={`text-[0.65rem] font-black uppercase tracking-widest ${isDark ? 'text-indigo-300' : 'text-indigo-900'}`}>Intelligence Suite</span>
                            </div>
                            {!summary && (
                                <button
                                    onClick={handleSummarize}
                                    disabled={isSummarizing}
                                    className={`text-[0.6rem] px-3 py-1.5 rounded-full border flex items-center gap-2 transition-all disabled:opacity-50
                                    ${isDark ? 'border-white/10 hover:bg-white/10' : 'bg-white/50 border-slate-200 hover:shadow-sm'}
                                `}
                                >
                                    {isSummarizing ? (
                                        <>
                                            <Loader2 size={12} className="animate-spin" />
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 size={12} />
                                            Generate Brief
                                        </>
                                    )}
                                </button>
                            )}
                            {summary && (
                                <button
                                    onClick={handleSummarize}
                                    disabled={isSummarizing}
                                    className={`text-[0.5rem] px-2 py-1 rounded-full border flex items-center gap-1 transition-all opacity-50 hover:opacity-100
                                    ${isDark ? 'border-white/10 hover:bg-white/10' : 'bg-white/50 border-slate-200'}
                                `}
                                >
                                    {isSummarizing ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                    Refresh
                                </button>
                            )}
                        </div>
                        {summary && (
                            <div className={`text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 ${isDark ? 'text-indigo-200' : 'text-slate-800'}`}>
                                <div className="markdown-summary prose-sm" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br/>') }} />
                            </div>
                        )}
                    </div>

                    {/* Mobile Summary Button */}
                    <div className="lg:hidden mb-6">
                        <button
                            onClick={handleSummarize}
                            disabled={isSummarizing}
                            className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition-all
                            ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}
                        `}
                        >
                            {isSummarizing ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Analyzing</span>
                                </>
                            ) : summary ? (
                                <>
                                    <Sparkles size={14} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Refresh Summary</span>
                                </>
                            ) : (
                                <>
                                    <BrainCircuit size={14} />
                                    <span className="text-xs font-bold uppercase tracking-widest">AI Summary</span>
                                </>
                            )}
                        </button>
                        {summary && (
                            <div className={`mt-4 p-4 rounded-xl border animate-in fade-in ${isDark ? 'bg-indigo-500/5 border-indigo-500/10 text-indigo-200' : 'bg-indigo-50/50 border-indigo-100 text-slate-700'}`}>
                                <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br/>') }} />
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className={`prose max-w-none font-normal leading-relaxed text-[0.95rem] ${isDark ? 'prose-invert text-slate-200' : 'prose-slate text-slate-900'}`}
                        dangerouslySetInnerHTML={{ __html: currentMessage.body }}
                    />

                    {/* Attachments */}
                    {currentMessage.attachments && currentMessage.attachments.length > 0 && (
                        <div className={`mt-10 pt-8 border-t border-dashed ${isDark ? 'border-white/10' : 'border-slate-300/50'}`}>
                            <div className="flex items-center gap-2 mb-4 opacity-50">
                                <Paperclip size={12} />
                                <span className="text-[0.5rem] font-black uppercase tracking-widest">Attachments ({currentMessage.attachments.length})</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {currentMessage.attachments.map(att => (
                                    <div key={att.id} className={`p-3 rounded-[1rem] border flex items-center gap-3 transition-all cursor-pointer group ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white/40 border-slate-200 hover:shadow-md'}`}>
                                        <div className={`w-10 h-10 rounded-[0.75rem] flex items-center justify-center ${isDark ? 'bg-white/5 text-slate-400' : 'bg-white/60 text-indigo-600'}`}>
                                            <FileText size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-[0.7rem] font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{att.name}</div>
                                            <div className="text-[0.5rem] font-mono opacity-50 uppercase">{att.size}</div>
                                        </div>
                                        <Download size={14} className={`opacity-0 group-hover:opacity-50 transition-opacity ${isDark ? 'text-white' : 'text-slate-900'}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="h-20"></div>
                </div>
            </div>

            {/* AI Command Bar */}
            <div className="absolute bottom-6 left-0 right-0 z-50 px-6 pointer-events-none flex justify-center">
                <div className="pointer-events-auto w-full max-w-2xl transform transition-all hover:scale-[1.01]">
                    <AICommandBar isDark={isDark} onAction={(a) => console.log(a)} />
                </div>
            </div>
        </div>
    );
};

export default EmailDetail;