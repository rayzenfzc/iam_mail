
import React, { useState, useEffect, useRef } from 'react';
import { Email, MOCK_EMAILS } from '@/types';
import { GoogleGenAI, Modality } from "@google/genai";
import {
    Search, Mail, Shield, Send, FileText, Video, MoreHorizontal,
    ChevronRight, MessageSquare, Zap, Calendar, DollarSign, Command,
    Moon, Sun, Menu, X, Bell, Sparkles, SendHorizontal, Plus, ArrowLeft,
    Activity, Layers, Sliders, Volume2, Info, CheckCircle2, ListFilter
} from 'lucide-react';
import { useCaretPosition, getTextAreaCaretCoordinates } from '@/hooks/useCaretPosition';
import { subscribeToPushNotifications } from '@/lib/pushNotifications';
import { useSwipeable } from 'react-swipeable';
import { classifyEmail } from '@/lib/emailClassification';
import { SettingsModal } from '@/components/SettingsModal';

const DEFAULT_SNIPPETS = [
    { trigger: 'meeting', label: 'Schedule Meeting', template: "Hi [Name],\n\nLet's schedule a time to meet. Here is my calendar link: [Calendar Link]\n\nBest,\n[Your Name]" },
    { trigger: 'followup', label: 'Follow Up', template: "Hi [Name],\n\nJust following up on our last conversation. Do you have any updates?\n\nBest,\n[Your Name]" },
    { trigger: 'intro', label: 'Introduction', template: "Hi [Name],\n\nI wanted to introduce myself. I am [Your Name] from Rayzen.\n\nBest,\n[Your Name]" },
    { trigger: 'video', label: 'Video Call Room', template: "Join the video room here: [Video Room Link]" }
];

interface ThreePaneLayoutProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

// Helper for Base64 Decoding
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

const EmailItem = ({ email, selectedEmail, setSelectedEmail }: { email: Email, selectedEmail: Email | null, setSelectedEmail: (e: Email) => void }) => {
    const handlers = useSwipeable({
        onSwipedLeft: () => {
            // Placeholder for archive logic
            console.log("Archived", email.id);
            alert(`Archived ${email.subject}`);
        },
        onSwipedRight: () => {
            console.log("Marked as read/unread", email.id);
        },
        trackMouse: true
    });

    return (
        <div
            {...handlers}
            onClick={() => setSelectedEmail(email)}
            className={`p-10 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900/40 relative group ${selectedEmail?.id === email.id ? 'bg-slate-50 dark:bg-slate-900/60' : ''}`}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 animate-neural ${email.category === 'focus' ? 'bg-accent' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
            <div className="flex justify-between items-start mb-4">
                <span className={`text-[12px] uppercase tracking-[0.2em] font-bold ${!email.isRead ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500'}`}>{email.sender}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{email.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h4 className={`text-[17px] mb-3 line-clamp-1 ${!email.isRead ? 'font-bold text-slate-800 dark:text-white' : 'font-light text-slate-600 dark:text-slate-400'}`}>{email.subject}</h4>
            <p className="text-[14px] text-slate-500 dark:text-slate-400 line-clamp-2 font-light leading-relaxed mb-4">{email.snippet}</p>
        </div>
    );
};

const ThreePaneLayout: React.FC<ThreePaneLayoutProps> = ({ isDarkMode, toggleTheme }) => {
    const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [tab, setTab] = useState<'focus' | 'other'>('focus');
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
    const [isBriefingLoading, setIsBriefingLoading] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLoadingEmails, setIsLoadingEmails] = useState(false);

    // Tab counts
    const [focusCount, setFocusCount] = useState(0);
    const [otherCount, setOtherCount] = useState(0);

    // Snippet System State
    const [showSnippetMenu, setShowSnippetMenu] = useState(false);
    const [snippetMenuPosition, setSnippetMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedSnippetIndex, setSelectedSnippetIndex] = useState(0);
    const [snippetSearch, setSnippetSearch] = useState('');
    const composerRef = useRef<HTMLTextAreaElement>(null);

    const audioContextRef = useRef<AudioContext | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || '';

    // Fetch real emails from API on mount
    useEffect(() => {
        const fetchEmails = async () => {
            setIsLoadingEmails(true);
            try {
                const response = await fetch(`${API_URL}/api/imap/emails?limit=50`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setEmails(data);
                        console.log(`Loaded ${data.length} real emails from IMAP`);
                    }
                } else {
                    console.log('Could not fetch real emails, using mock data');
                }
            } catch (error) {
                console.log('Email fetch failed, using mock data:', error);
            } finally {
                setIsLoadingEmails(false);
            }
        };

        fetchEmails();
    }, [API_URL]);

    // Update counts whenever emails change
    useEffect(() => {
        const focus = emails.filter(e => !e.category || e.category === 'focus').length;
        const other = emails.filter(e => e.category === 'other').length;
        setFocusCount(focus);
        setOtherCount(other);
    }, [emails]);

    // Auto-classify emails without category
    useEffect(() => {
        emails.forEach(async (email) => {
            if (!email.category) {
                try {
                    const category = await classifyEmail({
                        id: email.id,
                        sender: email.sender,
                        senderEmail: email.senderEmail,
                        subject: email.subject,
                        snippet: email.snippet,
                        preview: email.snippet
                    });

                    setEmails(prev => prev.map(e =>
                        e.id === email.id ? { ...e, category } : e
                    ));
                } catch (err) {
                    console.error('Classification failed:', err);
                }
            }
        });
    }, [emails]);

    // Keyboard shortcuts for tab switching
    useEffect(() => {
        const handleTabShortcut = (e: KeyboardEvent) => {
            if (e.key === '1' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setTab('focus');
            }
            if (e.key === '2' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setTab('other');
            }
        };
        window.addEventListener('keydown', handleTabShortcut);
        return () => window.removeEventListener('keydown', handleTabShortcut);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('command-bar')?.focus();
            }
            if (e.key === 'c' && !isComposerOpen) {
                setIsComposerOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isComposerOpen]);

    const handleAudioBriefing = async () => {
        if (isBriefingLoading) return;
        setIsBriefingLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Synthesize a brief audio summary.Tone: Minimalist, clinical excellence.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: prompt }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                    },
                },
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                }
                const ctx = audioContextRef.current;
                const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.start();
                source.onended = () => setIsBriefingLoading(false);
            }
        } catch (e) {
            console.error("Audio error", e);
            setIsBriefingLoading(false);
        }
    };

    const handleComposerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (showSnippetMenu) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedSnippetIndex(prev => (prev + 1) % filteredSnippets.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedSnippetIndex(prev => (prev - 1 + filteredSnippets.length) % filteredSnippets.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredSnippets[selectedSnippetIndex]) {
                    insertSnippet(filteredSnippets[selectedSnippetIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowSnippetMenu(false);
            }
        }
    };

    const handleComposerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const selectionStart = e.target.selectionStart;

        const lastSlashIndex = value.lastIndexOf('/', selectionStart);
        if (lastSlashIndex !== -1 && lastSlashIndex >= selectionStart - 10) {
            const query = value.substring(lastSlashIndex + 1, selectionStart);
            if (!query.includes(' ') && !query.includes('\n')) {
                if (!showSnippetMenu) {
                    const coords = getTextAreaCaretCoordinates(e.target, selectionStart);
                    // Adjust for the modal/container reference if needed, but relative to viewport/screen 
                    // or relative to the textarea makes a difference. 
                    // Our hook returns coordinates somewhat relative to the viewport/client rects.
                    // We need to ensure the menu is positioned absolutely relative to the container or fixed.
                    // The snippet menu uses `fixed` or `absolute`.
                    // Looking at CSS, .snippet-menu is position: absolute.

                    // We'll update the state with the coordinates relative to the textarea top-left + textarea position on screen?
                    // actually getTextAreaCaretCoordinates returns {x,y} relative to the viewport (because of getBoundingClientRect).
                    // If the menu is fixed/absolute relative to a container, we might need to adjust.
                    // For now, let's try using the coords directly, assuming the menu will be rendered fixed or we handle the offset.

                    // Note: The menu is rendered inside the composer overlay which is fixed.
                    // We might need to adjust for the composer overlay's position if it wasn't full screen fixed.
                    // But the composer IS fixed inset-0.

                    // Let's just pass the raw coords.
                    setSnippetMenuPosition(coords);
                    setShowSnippetMenu(true);
                }
                setSnippetSearch(query);
                setSelectedSnippetIndex(0);
            } else {
                setShowSnippetMenu(false);
            }
        } else {
            setShowSnippetMenu(false);
        }
    };

    const insertSnippet = (snippet: typeof DEFAULT_SNIPPETS[0]) => {
        if (!composerRef.current) return;
        const textarea = composerRef.current;

        const cursor = textarea.selectionStart;
        const text = textarea.value;
        const lastSlash = text.lastIndexOf('/', cursor);

        if (lastSlash === -1) return;

        const before = text.substring(0, lastSlash);
        const after = text.substring(cursor);

        let content = snippet.template;
        const recipientName = "Valued Client";
        const userName = "Rayzen Sales";
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        content = content
            .replace(/\[Name\]/g, recipientName)
            .replace(/\[Your Name\]/g, userName)
            .replace(/\[Date\]/g, today)
            .replace(/\[Calendar Link\]/g, "https://cal.com/iammail")
            .replace(/\[Video Room Link\]/g, `https://meet.iammail.cloud/${Math.random().toString(36).substring(7)}`);

        // Use setRangeText for better undo history support if possible, but value setter is reliably simple
        const newText = before + content + after;
        textarea.value = newText;

        // Update cursor position: tricky with React refs and uncontrolled inputs, but we do our best
        const newCursorPos = before.length + content.length;

        setShowSnippetMenu(false);

        // Defer focus to ensure UI updates
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const filteredSnippets = DEFAULT_SNIPPETS.filter(s => s.trigger.startsWith(snippetSearch));

    const filteredEmails = emails.filter(e => e.category === tab);

    return (
        <div className="app-container h-full w-full overflow-hidden transition-all duration-1000 relative font-sans flex flex-col md:rounded-[48px] border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">

            {/* Global Command Bar - Hides when Sidebar is Open */}
            <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-[250] transition-all duration-500 pointer-events-none ${isSidebarOpen ? 'opacity-0 translate-y-10 scale-90' : 'opacity-100 translate-y-0 scale-100'}`}>
                <div className="pointer-events-auto glass-sexy rounded-full p-1.5 pl-7 flex items-center gap-4 group hover:scale-[1.01] transition-all duration-700">
                    <Command size={16} className="text-slate-500 dark:text-slate-400 group-focus-within:text-accent transition-colors" />
                    <input
                        id="command-bar"
                        type="text"
                        placeholder="Synthesize command..."
                        className="flex-1 bg-transparent text-[14px] font-light outline-none dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 h-9"
                    />
                    <button
                        onClick={() => setIsComposerOpen(true)}
                        className="h-9 w-9 bg-slate-900 dark:bg-accent text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 shadow-xl transition-all"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            {/* Sidebar Drawer */}
            <div className={`fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-700 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
            <aside className={`fixed inset-y-0 left-0 z-[120] w-[340px] border-r pane-border transition-transform duration-700 bg-white dark:bg-slate-900 flex flex-col shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-12 flex justify-between items-center">
                    <div>
                        <div className="font-light text-4xl tracking-tighter leading-none mb-2 dark:text-white">
                            <span className="text-slate-400">i.</span><span className="text-slate-700 dark:text-slate-100 font-medium">M</span>
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.6em] text-slate-400 font-bold">NODE HUB</div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-3 text-slate-400 hover:text-slate-600 transition-colors"><X size={26} /></button>
                </div>

                <nav className="flex-1 px-8 space-y-4">
                    {[
                        { id: 'inbox', label: 'Inbound', icon: Mail, count: 12 },
                        { id: 'sent', label: 'Outbound', icon: Send },
                        { id: 'drafts', label: 'Synthesis', icon: FileText },
                        { id: 'shield', label: 'Security', icon: Shield, highlight: true },
                    ].map((item) => (
                        <button key={item.id} className={`w-full flex items-center px-8 py-5 rounded-[24px] transition-all hover:bg-slate-50 dark:hover:bg-slate-800 group ${item.highlight ? 'text-accent' : 'text-slate-600 dark:text-slate-300'}`}>
                            <div className="flex items-center gap-6">
                                <item.icon size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[13px] uppercase tracking-[0.2em] font-bold">{item.label}</span>
                            </div>
                            {item.count && <span className="ml-auto text-[10px] bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full font-bold">{item.count}</span>}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto p-10 flex flex-col gap-5">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="w-full flex items-center px-8 py-5 rounded-[24px] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-all border pane-border shadow-sm"
                    >
                        <div className="min-w-[24px]"><Sliders size={24} /></div>
                        <span className="text-[13px] uppercase tracking-[0.2em] font-bold ml-6">Settings</span>
                    </button>

                    <button
                        onClick={() => subscribeToPushNotifications().then(success => success && alert("Notifications Enabled!"))}
                        className="w-full flex items-center px-8 py-5 rounded-[24px] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-all border pane-border shadow-sm"
                    >
                        <div className="min-w-[24px]"><Bell size={24} /></div>
                        <span className="text-[13px] uppercase tracking-[0.2em] font-bold ml-6">Alerts</span>
                    </button>

                    <button onClick={toggleTheme} className="w-full flex items-center px-8 py-5 rounded-[24px] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-all border pane-border shadow-sm">
                        <div className="min-w-[24px]">{isDarkMode ? <Sun size={24} /> : <Moon size={24} />}</div>
                        <span className="text-[13px] uppercase tracking-[0.2em] font-bold ml-6">Luminary</span>
                    </button>
                </div>
            </aside>

            {/* Header */}
            <header className="h-28 border-b pane-border flex items-center justify-between px-14 bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl z-[100]">
                <div className="flex items-center gap-12">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-slate-900 transition-all border pane-border shadow-sm">
                        <Menu size={24} />
                    </button>
                    <div className="hidden sm:block font-light text-2xl tracking-tighter leading-none dark:text-white uppercase">
                        <span className="text-slate-400">i.</span><span className="text-slate-700 dark:text-slate-100 font-medium">M</span>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden lg:flex items-center gap-4 bg-slate-50 dark:bg-slate-900 px-6 py-2.5 rounded-full border pane-border">
                        <Activity size={14} className="text-green-500 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">SYNC: 14MS</span>
                    </div>
                    <button className="p-3 text-slate-400"><Bell size={26} /></button>
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold border pane-border shadow-lg">AM</div>
                </div>
            </header>

            {/* Main Framework Area */}
            <div className="flex flex-1 overflow-hidden relative">
                <section className={`flex flex-col border-r pane-border bg-white dark:bg-slate-950 transition-all duration-700 ${selectedEmail ? 'hidden lg:flex lg:w-[480px]' : 'flex-1'}`}>
                    <div className="p-10 border-b pane-border">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setTab('focus')}
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 ${tab === 'focus'
                                    ? 'bg-accent/10 border-2 border-accent text-slate-900 dark:text-white'
                                    : 'bg-transparent border-2 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="text-lg">⚡</span>
                                <span className="text-[11px] uppercase tracking-[0.3em] font-bold">Focus</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${tab === 'focus'
                                    ? 'bg-accent/20 text-accent'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                    }`}>
                                    {focusCount}
                                </span>
                            </button>

                            <button
                                onClick={() => setTab('other')}
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 ${tab === 'other'
                                    ? 'bg-accent/10 border-2 border-accent text-slate-900 dark:text-white'
                                    : 'bg-transparent border-2 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="text-lg">📦</span>
                                <span className="text-[11px] uppercase tracking-[0.3em] font-bold">Other</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${tab === 'other'
                                    ? 'bg-accent/20 text-accent'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                    }`}>
                                    {otherCount}
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto hide-scrollbar divide-y divide-slate-50 dark:divide-slate-900/30">
                        {filteredEmails.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-20 text-center">
                                {tab === 'focus' ? (
                                    <>
                                        <div className="text-8xl mb-8 opacity-50">🎉</div>
                                        <div className="text-3xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">Inbox Zero</div>
                                        <div className="text-lg text-slate-500 dark:text-slate-400">All caught up!</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-8xl mb-8 opacity-50">📭</div>
                                        <div className="text-3xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">No bulk emails</div>
                                        <div className="text-lg text-slate-500 dark:text-slate-400">Newsletters and automated messages appear here</div>
                                    </>
                                )}
                            </div>
                        ) : (
                            filteredEmails.map((email) => (
                                <EmailItem key={email.id} email={email} selectedEmail={selectedEmail} setSelectedEmail={setSelectedEmail} />
                            ))
                        )}
                    </div>
                </section>

                <main className={`flex-1 flex flex-col bg-slate-50/5 dark:bg-slate-950 relative overflow-hidden transition-all duration-700 ${selectedEmail ? 'flex' : 'hidden lg:flex'}`}>
                    {selectedEmail ? (
                        <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in zoom-in-95 duration-700 relative">
                            <div className="lg:hidden p-8 border-b pane-border">
                                <button onClick={() => setSelectedEmail(null)} className="flex items-center gap-4 text-slate-500 font-bold uppercase text-[12px] tracking-[0.2em]"><ArrowLeft size={20} /> Back</button>
                            </div>

                            <div className="bg-slate-900/95 dark:bg-slate-900/90 backdrop-blur-2xl text-white px-12 py-5 flex items-center justify-between z-10 shadow-xl">
                                <div className="flex items-center gap-10 text-accent">
                                    <Sparkles size={20} className="animate-pulse" />
                                    <span className="text-[12px] uppercase tracking-[0.5em] font-bold italic">Node Synthesis</span>
                                </div>
                                <button onClick={() => setIsIntelligenceOpen(!isIntelligenceOpen)} className={`p-2.5 rounded-xl transition-all ${isIntelligenceOpen ? 'bg-accent' : 'hover:bg-white/10 text-slate-400'}`}><Info size={22} /></button>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 overflow-y-auto hide-scrollbar scroll-smooth">
                                    <div className="p-16 lg:p-32 max-w-5xl mx-auto w-full">
                                        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">
                                            <h2 className="text-5xl lg:text-8xl thin-title text-slate-800 dark:text-slate-100 uppercase leading-[1] tracking-tight">{selectedEmail.subject}</h2>
                                            <button className="px-14 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] text-[12px] uppercase tracking-[0.5em] font-bold shadow-2xl">REPLY</button>
                                        </div>

                                        <div className="flex items-center gap-8 mb-20">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-[24px] flex items-center justify-center font-bold text-slate-400 text-2xl uppercase border pane-border">{selectedEmail.sender.charAt(0)}</div>
                                            <div>
                                                <div className="text-lg font-bold text-slate-700 dark:text-white uppercase tracking-[0.1em]">{selectedEmail.sender}</div>
                                                <div className="text-[13px] text-slate-400 font-medium italic mt-2 tracking-widest">{selectedEmail.senderEmail}</div>
                                            </div>
                                        </div>

                                        <div className="text-2xl font-light text-slate-600 dark:text-slate-300 leading-[1.65] whitespace-pre-wrap max-w-4xl tracking-tight mb-32">
                                            {selectedEmail.body}
                                        </div>
                                    </div>
                                </div>

                                <div className={`border-l pane-border bg-white dark:bg-slate-900/40 backdrop-blur-3xl transition-all duration-700 ${isIntelligenceOpen ? 'w-[400px]' : 'w-0 opacity-0 overflow-hidden'}`}>
                                    <div className="p-12 space-y-16 min-w-[400px]">
                                        <div className="space-y-8">
                                            <h5 className="text-[11px] uppercase tracking-[0.4em] text-accent font-bold">Intelligence Extract</h5>
                                            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[28px] border pane-border">
                                                <p className="text-sm font-light text-slate-500 mb-4 leading-relaxed uppercase italic tracking-wide">Analysis complete. Priority 1.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-16 lg:p-32 text-center bg-white dark:bg-slate-950 transition-all">
                            <div className="mb-20 relative">
                                <div className={`absolute inset-0 bg-accent/20 blur-[120px] rounded-full scale-[4] transition-all duration-1000 ${isBriefingLoading ? 'animate-pulse' : 'opacity-20'}`}></div>
                                <div className="w-40 h-40 bg-slate-50 dark:bg-slate-900 rounded-[48px] flex items-center justify-center border pane-border relative z-10 shadow-2xl">
                                    {isBriefingLoading ? (
                                        <div className="flex items-center gap-1.5 h-10">
                                            {[1, 2, 3, 2, 1, 4, 2].map((h, i) => <div key={i} className="w-1 bg-accent rounded-full animate-bounce" style={{ height: `${h * 8}px`, animationDelay: `${i * 0.1}s` }}></div>)}
                                        </div>
                                    ) : (
                                        <Activity size={64} className="text-slate-300 dark:text-slate-700" strokeWidth={1} />
                                    )}
                                </div>
                            </div>
                            <h3 className="text-7xl lg:text-9xl thin-title text-slate-800 dark:text-white uppercase mb-8 tracking-tighter">Iamthemail</h3>
                            <p className="max-w-lg text-slate-400 font-light text-xl leading-relaxed mb-20 tracking-wide">Cognitive synthesis optimized.</p>
                            <button onClick={handleAudioBriefing} disabled={isBriefingLoading} className="flex items-center gap-5 px-14 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[28px] text-[13px] uppercase tracking-[0.5em] font-bold shadow-3xl hover:scale-105 transition-all">
                                <Volume2 size={22} /> {isBriefingLoading ? 'Processing...' : 'Listen Briefing'}
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <style>{`
        .glass-sexy {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(15, 23, 42, 0.45);
          box-shadow: 0 20px 50px -10px rgba(0,0,0,0.15);
        }
        .dark .glass-sexy {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 50px -10px rgba(0,0,0,0.5);
        }
        .snippet-menu {
            position: absolute;
            background: var(--bg-color, white); /* Use CSS variables for theme */
            border: 1px solid var(--border-color, #e2e8f0);
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            z-index: 100;
            padding: 8px;
            min-width: 250px;
            max-height: 300px;
            overflow-y: auto;
            left: 16px; /* Adjust as needed */
            bottom: 16px; /* Adjust as needed */
        }

        .dark .snippet-menu {
            background: var(--dark-bg-color, #1e293b);
            border: 1px solid var(--dark-border-color, #475569);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .snippet-item {
            padding: 12px 16px;
            cursor: pointer;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.2s ease;
        }

        .snippet-item:hover {
            background-color: var(--hover-bg-color, #f1f5f9);
        }

        .dark .snippet-item:hover {
            background-color: var(--dark-hover-bg-color, #334155);
        }

        .snippet-item.active {
            background-color: var(--accent-color, #6366f1); /* Accent color for active */
            color: white;
        }

        .snippet-item.active .snippet-trigger,
        .snippet-item.active .snippet-label {
            color: white;
        }

        .snippet-trigger {
            font-weight: bold;
            color: var(--text-color-primary, #1e293b);
            margin-right: 8px;
        }

        .dark .snippet-trigger {
            color: var(--dark-text-color-primary, #f8fafc);
        }

        .snippet-label {
            font-size: 0.875rem;
            color: var(--text-color-secondary, #64748b);
        }

        .dark .snippet-label {
            color: var(--dark-text-color-secondary, #94a3b8);
        }
`}</style>

            {/* Composer Overlay */}
            {isComposerOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/70 backdrop-blur-2xl p-12 lg:p-24 animate-in fade-in duration-500">
                    <div className="w-full max-w-6xl bg-white dark:bg-slate-900 shadow-[0_60px_150px_-30px_rgba(0,0,0,0.5)] rounded-[64px] overflow-hidden flex flex-col h-[85vh] transition-all border pane-border relative">
                        <div className="p-12 border-b pane-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-accent/15 rounded-2xl"><Sparkles size={24} className="text-accent animate-pulse" /></div>
                                <span className="text-[14px] uppercase tracking-[0.6em] font-bold text-slate-400 italic">Neural Ghostwriter</span>
                            </div>
                            <button onClick={() => setIsComposerOpen(false)} className="text-[12px] uppercase tracking-[0.3em] font-bold bg-slate-200 dark:bg-slate-800 px-10 py-4 rounded-[24px]">DISCARD</button>
                        </div>
                        <div className="p-16 lg:p-28 flex-1 space-y-16 overflow-y-auto hide-scrollbar relative">
                            <input type="text" placeholder="NODE" className="w-full bg-transparent text-4xl font-light outline-none dark:text-white border-b pane-border pb-6" />
                            <textarea
                                ref={composerRef}
                                onChange={handleComposerChange}
                                onKeyDown={handleComposerKeyDown}
                                className="w-full h-full min-h-[400px] resize-none outline-none font-light text-4xl leading-[1.6] bg-transparent text-slate-600 dark:text-slate-300"
                                placeholder="Commence neural intent..."
                            />

                            {/* Snippet Menu */}
                            {showSnippetMenu && (
                                <div
                                    className="snippet-menu"
                                    style={{ top: 'auto', bottom: '20px', left: '20px', maxHeight: '400px', overflowY: 'auto' }}
                                >
                                    {filteredSnippets.length > 0 ? (
                                        filteredSnippets.map((snippet, idx) => (
                                            <div
                                                key={snippet.trigger}
                                                className={`snippet-item ${idx === selectedSnippetIndex ? 'active' : ''}`}
                                                onClick={() => insertSnippet(snippet)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="snippet-trigger">/{snippet.trigger}</span>
                                                    <span className="snippet-label">{snippet.label}</span>
                                                </div>
                                                {idx === selectedSnippetIndex && <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Returns</span>}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-slate-500 text-sm text-center italic">No matching synthesis patterns</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="p-16 border-t pane-border bg-slate-50/50 dark:bg-slate-800/10 flex justify-end">
                            <button className="bg-slate-900 dark:bg-accent text-white px-24 py-6 rounded-[28px] text-[14px] uppercase tracking-[0.6em] font-bold shadow-2xl">TRANSMIT</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};

export default ThreePaneLayout;

