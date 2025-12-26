import React, { useState, useRef, useEffect } from 'react';
import {
    X, Paperclip, Send, Sparkles, Mic, UserPlus, ArrowUp,
    CornerDownLeft, RefreshCw, Check, Trash2, Maximize2, Minimize2,
    ChevronUp, ChevronDown, AlignLeft, Bot, AtSign, Link, Loader2,
    Plus, Image, FileText, MessageSquare, Edit3
} from 'lucide-react';

// --- Types ---
export type ComposerMode = 'new' | 'reply' | 'forward';
type ComposeView = 'manual' | 'ai';

interface ComposerProps {
    isOpen: boolean;
    onClose: () => void;
    isDark?: boolean;
    mode?: ComposerMode;
    initialData?: {
        to?: string;
        subject?: string;
        body?: string;
        attachments?: any[];
    };
    onSend?: (email: { to: string, subject: string, body: string, tracking: boolean }) => void;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    text?: string;
    draft?: EmailDraft;
    isTyping?: boolean;
}

interface EmailDraft {
    to: string[];
    subject: string;
    body: string;
    attachments: string[];
    status: 'drafting' | 'ready';
}

interface Contact {
    name: string;
    email: string;
    avatar: string;
    role: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';

const MOCK_CONTACTS: Contact[] = [
    { name: 'Arjun Rayzen', email: 'arjun@rayzen.ae', role: 'Architect', avatar: 'A' },
    { name: 'Elena Vance', email: 'elena@vance.io', role: 'Security', avatar: 'E' },
    { name: 'Viktor Reznov', email: 'v.reznov@nova.ru', role: 'Logistics', avatar: 'V' },
    { name: 'John Shepard', email: 'shepard@alliance.mil', role: 'Commander', avatar: 'J' },
    { name: 'Sarah Kerrigan', email: 'sarah@swarm.io', role: 'Hive Mind', avatar: 'S' },
];

const Composer: React.FC<ComposerProps> = ({
    isOpen,
    onClose,
    isDark = false,
    mode = 'new',
    initialData,
    onSend
}) => {
    // --- View Mode ---
    const [composeView, setComposeView] = useState<ComposeView>('manual');

    // --- Email Draft State (shared between both views) ---
    const [to, setTo] = useState(initialData?.to || '');
    const [cc, setCc] = useState('');
    const [bcc, setBcc] = useState('');
    const [subject, setSubject] = useState(initialData?.subject || '');
    const [body, setBody] = useState(initialData?.body || '');
    const [showCcBcc, setShowCcBcc] = useState(false);
    const [enableTracking, setEnableTracking] = useState(true);

    // AI Chat State
    const [aiInput, setAiInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // Contact Suggestions
    const [showContacts, setShowContacts] = useState(false);
    const [contactQuery, setContactQuery] = useState('');

    // Sending State
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState('');

    // Refs
    const toInputRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const aiInputRef = useRef<HTMLInputElement>(null);

    // --- Init ---
    useEffect(() => {
        if (isOpen) {
            setTo(initialData?.to || '');
            setSubject(initialData?.subject || '');
            setBody(initialData?.body || '');
            setSendError('');

            // Initialize AI chat
            const greeting = mode === 'new'
                ? "Ready to compose. Who are we emailing, or describe what you want to write?"
                : `Replying to "${initialData?.subject}". What would you like to say?`;
            setMessages([{ id: 'init', role: 'ai', text: greeting }]);

            // Focus based on view
            setTimeout(() => {
                if (composeView === 'manual') {
                    toInputRef.current?.focus();
                } else {
                    aiInputRef.current?.focus();
                }
            }, 100);
        }
    }, [isOpen, initialData, mode]);

    // Auto-scroll AI messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- Helper: Get auth token ---
    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        };
    };

    // --- AI Chat Processing ---
    const processAICommand = async (userText: string) => {
        const userMsgId = Date.now().toString();
        setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userText }]);
        setAiInput('');

        const typingId = 'typing-' + Date.now();
        setMessages(prev => [...prev, { id: typingId, role: 'ai', isTyping: true }]);

        try {
            const response = await fetch(`${API_URL}/api/ai/compose`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    context: userText,
                    to: to || initialData?.to,
                    subject: subject || initialData?.subject,
                    tone: 'professional',
                    length: 'medium'
                })
            });

            if (!response.ok) throw new Error('AI composition failed');

            const data = await response.json();

            setMessages(prev => {
                const filtered = prev.filter(m => m.id !== typingId);
                return [...filtered, {
                    id: Date.now().toString(),
                    role: 'ai',
                    text: 'Here\'s your draft:',
                    draft: {
                        to: to ? [to] : (initialData?.to ? [initialData.to] : []),
                        subject: data.subject || subject || 'New Email',
                        body: data.body || '',
                        attachments: [],
                        status: 'ready'
                    }
                }];
            });
        } catch (error) {
            console.error("AI Error", error);
            setMessages(prev => {
                const filtered = prev.filter(m => m.id !== typingId);
                return [...filtered, {
                    id: Date.now().toString(),
                    role: 'ai',
                    text: "Connection disrupted. Please try again."
                }];
            });
        }
    };

    // --- Use AI Draft ---
    const useDraft = (draft: EmailDraft) => {
        if (draft.to.length > 0) setTo(draft.to.join(', '));
        if (draft.subject) setSubject(draft.subject);
        if (draft.body) setBody(draft.body);
        setComposeView('manual'); // Switch to manual view to review/send
    };

    // --- Send Email ---
    const handleSend = async () => {
        if (!to.trim()) {
            setSendError('Please enter a recipient');
            return;
        }
        if (!subject.trim()) {
            setSendError('Please enter a subject');
            return;
        }

        setIsSending(true);
        setSendError('');

        try {
            const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');

            const response = await fetch(`${API_URL}/api/smtp/send`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'x-user-id': userId || ''
                },
                body: JSON.stringify({
                    to: to,
                    cc: cc || undefined,
                    bcc: bcc || undefined,
                    subject: subject,
                    body: body,
                    html: `<div style="font-family: sans-serif; white-space: pre-wrap;">${body}</div>`,
                    tracking: enableTracking,
                    userId: userId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send email');
            }

            onSend?.({ to, subject, body, tracking: enableTracking });
            onClose();

        } catch (error: any) {
            console.error('Send error:', error);
            setSendError(error.message || 'Failed to send email');
        } finally {
            setIsSending(false);
        }
    };

    // Filter contacts
    const filteredContacts = MOCK_CONTACTS.filter(c =>
        c.name.toLowerCase().includes(contactQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(contactQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[200] flex justify-center pointer-events-none">
            {/* Composer Panel - docked at bottom, no blocking backdrop */}
            <div
                data-testid="composer-panel"
                className={`
                pointer-events-auto w-full max-w-2xl mx-4 mb-0
                rounded-t-[1.5rem] shadow-2xl flex flex-col overflow-hidden
                animate-in slide-in-from-bottom-10 duration-300
                ${isDark ? 'bg-[#121214] border-t border-x border-white/10' : 'bg-white border-t border-x border-slate-200'}
            `}
                style={{ maxHeight: '70vh' }}
            >
                {/* Header with View Toggle */}
                <div className={`px-6 py-4 flex items-center justify-between border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-1 h-6 rounded-full ${isDark ? 'bg-indigo-500' : 'bg-slate-900'}`}></div>
                        <span className={`text-sm font-black uppercase tracking-[0.3em] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {mode === 'new' ? 'COMPOSE' : mode === 'reply' ? 'REPLY' : 'FORWARD'}
                        </span>
                    </div>

                    {/* View Toggle */}
                    <div className={`flex items-center rounded-xl p-1 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                        <button
                            onClick={() => setComposeView('manual')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${composeView === 'manual'
                                ? (isDark ? 'bg-white text-black' : 'bg-slate-900 text-white')
                                : (isDark ? 'text-slate-400' : 'text-slate-500')
                                }`}
                        >
                            <Edit3 size={12} /> Manual
                        </button>
                        <button
                            onClick={() => setComposeView('ai')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${composeView === 'ai'
                                ? (isDark ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white')
                                : (isDark ? 'text-slate-400' : 'text-slate-500')
                                }`}
                        >
                            <Sparkles size={12} /> AI Assist
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ==================== MANUAL VIEW ==================== */}
                {composeView === 'manual' && (
                    <>
                        {/* Email Fields */}
                        <div className={`px-6 py-4 space-y-3 border-b ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                            {/* To Field */}
                            <div className="flex items-center gap-3">
                                <label className={`w-12 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>To</label>
                                <div className="flex-1 relative">
                                    <input
                                        ref={toInputRef}
                                        type="email"
                                        value={to}
                                        onChange={(e) => {
                                            setTo(e.target.value);
                                            setContactQuery(e.target.value);
                                            setShowContacts(e.target.value.length > 0);
                                        }}
                                        onFocus={() => setShowContacts(to.length > 0)}
                                        onBlur={() => setTimeout(() => setShowContacts(false), 200)}
                                        placeholder="recipient@email.com"
                                        className={`w-full bg-transparent text-sm font-medium focus:outline-none ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'}`}
                                    />

                                    {/* Contact Suggestions */}
                                    {showContacts && filteredContacts.length > 0 && (
                                        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50 max-h-48 overflow-y-auto ${isDark ? 'bg-[#1A1A1C] border-white/10' : 'bg-white border-slate-200'}`}>
                                            {filteredContacts.map((contact, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setTo(contact.email);
                                                        setShowContacts(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                                                        {contact.avatar}
                                                    </div>
                                                    <div>
                                                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{contact.name}</div>
                                                        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{contact.email}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowCcBcc(!showCcBcc)}
                                    className={`text-xs font-medium px-2 py-1 rounded transition-colors ${isDark ? 'text-slate-500 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
                                >
                                    Cc/Bcc
                                </button>
                            </div>

                            {/* Cc/Bcc Fields */}
                            {showCcBcc && (
                                <>
                                    <div className="flex items-center gap-3">
                                        <label className={`w-12 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Cc</label>
                                        <input
                                            type="email"
                                            value={cc}
                                            onChange={(e) => setCc(e.target.value)}
                                            placeholder="cc@email.com"
                                            className={`flex-1 bg-transparent text-sm font-medium focus:outline-none ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'}`}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className={`w-12 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Bcc</label>
                                        <input
                                            type="email"
                                            value={bcc}
                                            onChange={(e) => setBcc(e.target.value)}
                                            placeholder="bcc@email.com"
                                            className={`flex-1 bg-transparent text-sm font-medium focus:outline-none ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'}`}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Subject Field */}
                            <div className="flex items-center gap-3">
                                <label className={`w-12 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Subj</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Enter subject..."
                                    className={`flex-1 bg-transparent text-sm font-bold focus:outline-none ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'}`}
                                />
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: '180px', maxHeight: '35vh' }}>
                            <textarea
                                ref={bodyRef}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Write your message here..."
                                className={`w-full h-full min-h-[160px] bg-transparent text-sm leading-relaxed focus:outline-none resize-none ${isDark ? 'text-slate-300 placeholder:text-slate-600' : 'text-slate-700 placeholder:text-slate-400'}`}
                            />
                        </div>
                    </>
                )}

                {/* ==================== AI VIEW ==================== */}
                {composeView === 'ai' && (
                    <div className="flex-1 flex flex-col overflow-hidden" style={{ maxHeight: '60vh' }}>
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    {msg.text && (
                                        <div className={`
                                            max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium
                                            ${msg.role === 'user'
                                                ? (isDark ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-900 text-white rounded-tr-sm')
                                                : (isDark ? 'bg-[#1A1A1C] text-slate-200 rounded-tl-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm')}
                                        `}>
                                            {msg.text}
                                        </div>
                                    )}

                                    {msg.isTyping && (
                                        <div className="flex gap-1 px-4 py-2">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    )}

                                    {/* Draft Card */}
                                    {msg.draft && (
                                        <div className={`w-full mt-3 p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`text-[0.6rem] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    Draft Preview
                                                </span>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            </div>

                                            <div className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                To: {msg.draft.to.join(', ') || '(Not specified)'}
                                            </div>
                                            <div className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {msg.draft.subject}
                                            </div>
                                            <div className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                                                dangerouslySetInnerHTML={{ __html: msg.draft.body.replace(/\n/g, '<br/>') }}
                                            />

                                            <button
                                                onClick={() => useDraft(msg.draft!)}
                                                className="w-full py-2.5 rounded-lg bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors"
                                            >
                                                <Check size={14} /> Use This Draft
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* AI Input */}
                        <div className={`p-4 border-t ${isDark ? 'border-white/10 bg-[#0A0A0B]' : 'border-slate-100 bg-slate-50'}`}>
                            {/* Suggestion Chips */}
                            {messages.length < 2 && (
                                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
                                    {['Write a professional email', 'Draft a quick reply', 'Compose a follow-up'].map((chip, i) => (
                                        <button
                                            key={i}
                                            onClick={() => processAICommand(chip)}
                                            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                        >
                                            <Sparkles size={10} className="inline mr-1.5" />
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className={`flex items-center gap-2 p-2 rounded-xl border ${isDark ? 'bg-[#1A1A1C] border-white/10' : 'bg-white border-slate-200'}`}>
                                <input
                                    ref={aiInputRef}
                                    type="text"
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && aiInput.trim() && processAICommand(aiInput)}
                                    placeholder="Tell AI what to write..."
                                    className={`flex-1 bg-transparent text-sm focus:outline-none px-2 ${isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
                                />
                                <button
                                    onClick={() => aiInput.trim() && processAICommand(aiInput)}
                                    disabled={!aiInput.trim()}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 ${aiInput.trim() ? 'bg-indigo-500 text-white' : (isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-400')}`}
                                >
                                    <ArrowUp size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {sendError && (
                    <div className="px-6 py-2 bg-red-500/10 text-red-500 text-sm font-medium">
                        {sendError}
                    </div>
                )}

                {/* Footer Actions (only show in manual view) */}
                {composeView === 'manual' && (
                    <div className={`px-6 py-4 flex items-center justify-between border-t ${isDark ? 'border-white/10 bg-[#0A0A0B]' : 'border-slate-100 bg-slate-50'}`}>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setComposeView('ai')}
                                className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
                                title="AI Assist"
                            >
                                <Sparkles size={18} />
                            </button>
                            <button className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`} title="Attach File">
                                <Paperclip size={18} />
                            </button>
                            <button className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`} title="Insert Image">
                                <Image size={18} />
                            </button>

                            <div className={`h-6 w-px mx-2 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>

                            {/* Tracking Toggle */}
                            <button
                                onClick={() => setEnableTracking(!enableTracking)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${enableTracking
                                    ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700')
                                    : (isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-500')
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full ${enableTracking ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                                Tracking {enableTracking ? 'On' : 'Off'}
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isSending || !to.trim()}
                                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSending ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Send size={14} />
                                )}
                                {isSending ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Composer;