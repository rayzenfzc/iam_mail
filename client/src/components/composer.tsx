import React, { useState, useRef, useEffect } from 'react';
import {
    X, Paperclip, Send, Sparkles, Mic, UserPlus, ArrowUp,
    CornerDownLeft, RefreshCw, Check, Trash2, Maximize2, Minimize2,
    ChevronUp, ChevronDown, AlignLeft, Bot, AtSign, Link, Loader2,
    Plus, Image, FileText, MessageSquare, Edit3
} from 'lucide-react';
import TectonicCard from './ui/TectonicCard';

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Attachments State
    const [attachments, setAttachments] = useState<File[]>([]);

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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-12 pointer-events-none">
            {/* Backdrop blur when open */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

            <TectonicCard
                data-testid="composer-panel"
                className="pointer-events-auto w-full max-w-4xl h-full max-h-[90vh] flex flex-col overflow-hidden"
            >
                {/* Header: Obsidian Style */}
                <div className="px-10 py-8 flex items-center justify-between border-b border-[var(--glass-border)] relative z-10">
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase">New Transmission</h1>
                        <div className="text-[0.6rem] font-mono text-[var(--accent-glow)] uppercase tracking-[0.3em] mt-1">Draft // 0xAF44</div>
                    </div>

                    <button
                        data-testid="composer-close"
                        onClick={onClose}
                        className="w-10 h-10 border border-[var(--glass-border)] flex items-center justify-center hover:border-red-500/50 hover:text-red-500 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                    {composeView === 'manual' ? (
                        <div className="flex-1 flex flex-col p-10 space-y-8 overflow-y-auto no-scrollbar">
                            {/* RECIPIENT NODE */}
                            <div className="input-group">
                                <label className="input-label">Recipients</label>
                                <input
                                    ref={toInputRef}
                                    type="text"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    placeholder="search_directory.sh"
                                    className="input-field"
                                />
                            </div>

                            {/* SUBJECT HEADER */}
                            <div className="input-group">
                                <label className="input-label">Subject Line</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Enter transmission header..."
                                    className="input-field font-bold"
                                />
                            </div>

                            {/* DATA PAYLOAD */}
                            <div className="input-group flex-1 flex flex-col">
                                <label className="input-label">Message Payload</label>
                                <textarea
                                    ref={bodyRef}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Initiate conduit connection..."
                                    className="editor-area"
                                />
                            </div>

                            {/* FOOTER ACTIONS */}
                            <div className="flex items-center justify-between pt-6">
                                <div className="flex items-center gap-6">
                                    <div className="flex gap-4">
                                        <Paperclip size={20} className="text-[var(--text-dim)] cursor-pointer hover:text-[var(--accent-glow)] transition-colors" />
                                        <Image size={20} className="text-[var(--text-dim)] cursor-pointer hover:text-[var(--accent-glow)] transition-colors" />
                                        <Sparkles
                                            size={20}
                                            className="text-[var(--text-dim)] hover:text-[var(--accent-glow)] cursor-pointer transition-colors"
                                            onClick={() => setComposeView('ai')}
                                        />
                                    </div>
                                    <div className="h-4 w-[1px] bg-[var(--glass-border)]"></div>
                                    <div className="flex items-center gap-2 text-[0.6rem] font-mono text-[var(--text-dim)]">
                                        <div className={`w-2 h-2 rounded-full ${enableTracking ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500/30'}`}></div>
                                        TRACKING: {enableTracking ? 'ACTIVE' : 'DISABLED'}
                                    </div>
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={isSending || !to.trim()}
                                    className="btn-send"
                                >
                                    {isSending ? 'TRANSMITTING...' : 'EXECUTE SEND'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* AI VIEW - Keep existing logic but match aesthetic */
                        <div className="flex-1 flex flex-col overflow-hidden relative z-10" style={{ maxHeight: '60vh' }}>
                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto px-8 py-4 space-y-4 custom-scrollbar">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        {msg.text && (
                                            <div className={`
                                                max-w-[85%] px-5 py-3 rounded-md text-sm font-medium border
                                                ${msg.role === 'user'
                                                    ? (isDark ? 'bg-[var(--vitreous-glow)]/10 border-[var(--vitreous-glow)]/30 text-white font-mono' : 'bg-slate-900 text-white')
                                                    : (isDark ? 'bg-[var(--vitreous-glass)] border-[var(--vitreous-border)] text-slate-200' : 'bg-slate-100 text-slate-800')}
                                            `}>
                                                {msg.text}
                                            </div>
                                        )}

                                        {msg.isTyping && (
                                            <div className="flex gap-1 px-4 py-2 opacity-50">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        )}

                                        {msg.draft && (
                                            <div className={`w-full mt-4 card-vitreous p-6 border backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                                <div className="sintered-texture">
                                                    <svg width="100%" height="100%">
                                                        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                                                    </svg>
                                                </div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="section-label mb-0" style={{ fontSize: '0.6rem' }}>Draft Payload</span>
                                                    <div className="w-2 h-2 rounded-full bg-[var(--vitreous-glow)] status-pulse-anim"></div>
                                                </div>

                                                <div className="space-y-4 relative z-10">
                                                    <div>
                                                        <div className="compose-label">Recipient</div>
                                                        <div className="text-sm font-mono text-[var(--vitreous-secondary)]">{msg.draft.to.join(', ') || '(NOT SPECIFIED)'}</div>
                                                    </div>
                                                    <div>
                                                        <div className="compose-label">Subject</div>
                                                        <div className="text-sm font-bold">{msg.draft.subject}</div>
                                                    </div>
                                                    <div>
                                                        <div className="compose-label">Encrypted Content</div>
                                                        <div className="text-xs leading-relaxed opacity-70 font-mono"
                                                            dangerouslySetInnerHTML={{ __html: msg.draft.body.replace(/\n/g, '<br/>') }}
                                                        />
                                                    </div>

                                                    <button
                                                        onClick={() => useDraft(msg.draft!)}
                                                        className="transmit-btn w-full mt-2"
                                                        style={{ padding: '0.6rem' }}
                                                    >
                                                        SYNC_LOAD_DRAFT
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* AI Input */}
                            <div className={`p-6 border-t ${isDark ? 'border-white/10 bg-[#050505]' : 'border-slate-100 bg-slate-50'}`}>
                                <div className="flex items-center gap-3 p-3 rounded-md border backdrop-blur-md relative overflow-hidden bg-[var(--vitreous-glass)] border-[var(--vitreous-border)]">
                                    <div className="sintered-texture">
                                        <svg width="100%" height="100%">
                                            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                                        </svg>
                                    </div>
                                    <input
                                        ref={aiInputRef}
                                        type="text"
                                        value={aiInput}
                                        onChange={(e) => setAiInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && aiInput.trim() && processAICommand(aiInput)}
                                        placeholder="Enter conduit commands..."
                                        className="flex-1 bg-transparent text-sm focus:outline-none px-2 font-mono relative z-10"
                                    />
                                    <button
                                        onClick={() => aiInput.trim() && processAICommand(aiInput)}
                                        disabled={!aiInput.trim()}
                                        className={`relative z-10 transition-all ${aiInput.trim() ? 'text-[var(--vitreous-glow)]' : 'text-[var(--vitreous-dim)] opacity-40'}`}
                                    >
                                        <ArrowUp size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

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

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
                                    }
                                }}
                            />
                            <button
                                data-testid="attach-button"
                                onClick={() => fileInputRef.current?.click()}
                                className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
                                title="Attach File"
                            >
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
            </TectonicCard>
        </div>
    );
};

export default Composer;