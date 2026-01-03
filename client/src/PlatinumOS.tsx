import React, { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useMouseRefraction } from './hooks/useMouseRefraction';
import { useKeyboardHeight } from './hooks/useKeyboardHeight';
import { GoogleGenAI } from "@google/genai";
import AuthPage from './components/AuthPage';
import NexusSettings from './components/NexusSettings';
import { Hub, HubContext, HubScreen } from './components/Hub';
import OnboardingFlow from './components/OnboardingFlow';
import { SettingsPage } from './components/settings/SettingsPage';
import CalendarPage from './components/calendar/CalendarPage';
import { GlassModule, GlassHeader, GlassBody, DockAction } from './components/newdesign/Glass';
import { SystemClock, TectonicClock, EtherBar } from './components/SystemClock';
import { Bot, Moon, Sun, Send } from 'lucide-react';
import * as emailService from './services/emailService';
import * as zohoService from './services/zohoService';
import type { ThemeMode } from './types';
import SplitFlapText from './components/ui/SplitFlapText';
import { GlassEmptyState } from './components/ui/GlassEmptyState';
import { EmailCardHorizontal, ContactCardHorizontal, CalendarDayCard, MeetingRowCard, SectionHeader } from './components/ui/InstrumentCards';
import LiquidModuleCard from './components/ui/LiquidModuleCard';
import LiquidEmailCard from './components/ui/LiquidEmailCard';
import LiquidCalendarWidget from './components/ui/LiquidCalendarWidget'; // Added import
import Dock from './components/Dock';
import {
    InboxIcon, ComposeIcon, NeuralAIIcon, SendIcon, UnreadIcon,
    ReturnIcon, SurfaceIcon, QueryIcon, TimelineIcon, DirectoryIcon,
    SystemIcon, VaultIcon, PurgeIcon, ReplyIcon, SeenIcon, ProvisionIcon
} from './components/ui/SinteredIcons';

// --- TYPES ---
interface ActionQueueItem {
    id: number;
    type: 'SEND' | 'DELETE' | 'ARCHIVE';
    status: 'pending' | 'sending' | 'sent' | 'failed' | 'completed';
    data: any; // { email: ... } or { originalFolder: string, emailId: number }
    countdown: number;
}
// --- AI CONFIG ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// --- MOCK DATA ---
const MOCK_ACCOUNTS = [
    { id: 1, label: 'Dubai Office', initials: 'DB', active: true },
    { id: 2, label: 'London HQ', initials: 'LD', active: false }
];

const MOCK_INBOX = [
    { id: 1, sender: 'Sloane Vanderbilt', subject: 'Q4 Strategic Resource Allocation', time: '14:02 PM', status: 'URGENT', body: "The quarterly review is attached. Please review the preliminary figures for the board meeting on Friday. We noticed a discrepancy in sector 7 allocations." },
    { id: 2, sender: 'Julian Sterling', subject: 'Dubai Region Quarterly Targets', time: '09:15 AM', status: 'UNREAD', body: "The targets for the upcoming quarter have been finalized. Please coordinate with the local teams." },
    { id: 3, sender: 'Amara Khan', subject: 'Capacity Warning: Server 7', time: 'Yesterday', status: 'READ', body: "Storage capacity has reached 85%. Automated cleanup protocols will initiate at 80%." },
    { id: 4, sender: 'HM Revenue', subject: 'Tax Compliance Audit Q3', time: '11:00 AM', status: 'URGENT', body: "Please find attached the notification for the upcoming Q3 audit." },
    { id: 5, sender: 'Legal Dept', subject: 'GDPR Policy Updates', time: '08:30 AM', status: 'UNREAD', body: "New regulations regarding data retention have been passed." }
];

const MOCK_CONTACTS = [
    { id: 101, name: 'Sloane Vanderbilt', role: 'Executive Lead', email: 'sloane@dubai.com' },
    { id: 102, name: 'Julian Sterling', role: 'Senior Analyst', email: 'julian@dubai.com' },
    { id: 103, name: 'Amara Khan', role: 'CTO', email: 'amara@tech.com' }
];

const MOCK_EVENTS = [
    { id: 1, title: 'Board Review', time: '10:00 AM', loc: 'Conf Room A' },
    { id: 2, title: 'Team Sync', time: '02:00 PM', loc: 'Online' },
    { id: 3, title: 'Client Dinner', time: '08:00 PM', loc: 'Nobu' }
];

const MOCK_THREADS: Record<number, any[]> = {
    1: [
        { id: 101, sender: 'Sloane Vanderbilt', subject: 'Q4 Strategic Resource Allocation', time: '14:02 PM', body: "The quarterly review is attached. Please review the preliminary figures for the board meeting on Friday. We noticed a discrepancy in sector 7 allocations." },
        { id: 102, sender: 'You', subject: 'Re: Q4 Strategic Resource Allocation', time: '4:15 PM', body: "I've reviewed the figures. The discrepancy seems to be related to the new hiring phase. I've attached the corrected report." },
        { id: 103, sender: 'Sloane Vanderbilt', subject: 'Re: Re: Q4 Strategic Resource Allocation', time: '4:45 PM', body: "Excellent. Let's proceed with these numbers. See you at the board meeting." }
    ],
    2: [
        { id: 201, sender: 'Julian Sterling', subject: 'Dubai Region Quarterly Targets', time: '09:15 AM', body: "The targets for the upcoming quarter have been finalized. Please coordinate with the local teams." }
    ]
};

// --- COMPONENTS ---

const MonolithSidebarCard: React.FC<{
    label: string;
    name: string;
    active: boolean;
    onClick: () => void;
    Icon?: React.ElementType;
}> = ({ label, name, active, onClick, Icon }) => {
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dx = (x - rect.width / 2) / (rect.width / 2);
        const dy = (y - rect.height / 2) / (rect.height / 2);
        cardRef.current.style.transform = `perspective(1000px) rotateY(${dx * 12}deg) rotateX(${-dy * 12}deg) translateY(-10px) scale(1.02)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)`;
    };

    return (
        <div
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`monolith group ${active ? 'monolith-active' : ''}`}
        >
            <div className="sheen"></div>
            <div className="icon-container">
                {Icon && (
                    <div style={{ width: '32px', height: '32px' }}>
                        <Icon style={{ width: '100%', height: '100%' }} />
                    </div>
                )}
            </div>
            {label && <div className="monolith-label">{label}</div>}
            <div className="monolith-name">{name}</div>
        </div>
    );
};


const AccountChip: React.FC<{
    initials: string;
    active: boolean;
    onClick: () => void;
    darkMode: boolean;
}> = ({ initials, active, onClick, darkMode }) => (
    <button
        onClick={onClick}
        className={`
      h-8 min-w-[40px] px-0 rounded-md flex items-center justify-center text-[10px] font-black tracking-wider transition-all border
      ${active
                ? (darkMode ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-black text-white border-black shadow-lg')
                : (darkMode ? 'bg-transparent text-neutral-600 border-neutral-800 hover:border-neutral-600 hover:text-white' : 'bg-white border-neutral-200 text-neutral-400 hover:text-black')
            }
    `}
    >
        {initials}
        {active && <div className="absolute top-1 right-1 w-1 h-1 bg-primary rounded-full"></div>}
    </button>
);

const RightPanel: React.FC<{ darkMode: boolean, time: Date, unreadCount: number, onNavigate: (view: string) => void }> = ({ darkMode, time, unreadCount, onNavigate }) => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const today = new Date().getDate();

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    return (
        <div className="flex flex-col h-full space-y-4 overflow-y-auto no-scrollbar">

            {/* WIDGET 1: CALENDAR */}
            <div>
                <h3
                    className="text-[9px] font-bold uppercase tracking-widest mb-3"
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
                    }}
                >
                    Calendar
                </h3>

                {/* Calendar Widget - Liquid Edition */}
                <LiquidCalendarWidget
                    theme={darkMode ? 'dark' : 'light'}
                    onClick={() => onNavigate && onNavigate('calendar')}
                />
            </div>

            {/* Upcoming Events */}
            <div className="mt-2 space-y-2">
                {
                    MOCK_EVENTS.slice(0, 2).map(ev => (
                        <div
                            key={ev.id}
                            className="p-2 rounded"
                            style={{
                                border: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                                background: darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <span
                                    className="text-[10px] font-bold"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    {ev.title}
                                </span>
                                <span
                                    className="text-[8px]"
                                    style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        color: darkMode ? '#00c8ff' : '#1976d2'
                                    }}
                                >
                                    {ev.time}
                                </span>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* WIDGET 2: SYSTEM STATUS */}
            <div className={`p-4 rounded-xl border backdrop-blur-md ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">System Status</span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[9px] font-bold text-emerald-500">ONLINE</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xl font-light">{unreadCount}</div>
                        <div className="text-[9px] opacity-40">Unread</div>
                    </div>
                    <div>
                        <div className="text-xl font-light">98%</div>
                        <div className="text-[9px] opacity-40">Health</div>
                    </div>
                </div>
            </div>

            {/* WIDGET 3: QUICK ACTIONS */}
            <div>
                <h3 className={`text-[9px] font-bold uppercase tracking-widest mb-3 opacity-50`}>Quick Actions</h3>
                <div className="grid grid-cols-1 gap-2">
                    {['Template: Weekly Report', 'Schedule: Next Week', 'AI: Draft Response'].map((action, i) => (
                        <button key={i} className={`
                            w-full text-left p-3 rounded-lg border text-xs transition-all
                            ${darkMode
                                ? 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
                                : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200'}
                        `}>
                            {action}
                        </button>
                    ))}
                </div>
            </div >

        </div >
    );
};

// --- MAIN APP ---
function ProductPage() {
    // ========== AUTHENTICATION ==========
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const token = localStorage.getItem('auth_token');
        return !!token;
    });




    const [realEmails, setRealEmails] = useState<any[]>([]);
    const [realContacts, setRealContacts] = useState<any[]>([]);
    const [realEvents, setRealEvents] = useState<any[]>([]);
    const [isLoadingEmails, setIsLoadingEmails] = useState(false);
    const [isConnected, setIsConnected] = useState(() => {
        return localStorage.getItem('iam_email_connected') === 'true';
    });

    // ========== DATA FETCHING ==========
    const [accounts, setAccounts] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('iam_accounts');
            if (saved) return JSON.parse(saved);
        }
        return MOCK_ACCOUNTS;
    });

    // Fetch Accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
                const res = await fetch(`/api/accounts?userId=${encodeURIComponent(userId || '')}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        const formatted = data.map((acc: any) => ({
                            id: acc.id,
                            initials: acc.email.substring(0, 2).toUpperCase(),
                            email: acc.email,
                            provider: acc.provider
                        }));
                        setAccounts(formatted);
                        localStorage.setItem('iam_accounts', JSON.stringify(formatted));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch accounts:', err);
            }
        };
        fetchAccounts();
    }, []);

    useEffect(() => {
        const loadEmails = async () => {
            setIsLoadingEmails(true);
            try {
                // Fetch from backend
                const data = await emailService.fetchEmails();
                if (data && data.length > 0) {
                    setRealEmails(data);
                    setIsConnected(true);
                    localStorage.setItem('iam_email_connected', 'true');
                } else {
                    console.log('No emails found from backend, using mock data fallback.');
                    // Don't necessarily set connected to false, as it might just be empty
                }
            } catch (error) {
                console.error('Failed to fetch emails:', error);
                // Optional: setIsConnected(false);
            } finally {
                setIsLoadingEmails(false);
            }
        };

        loadEmails();
    }, []);

    // ========== ZOHO STATE ==========
    const [zohoConfigured, setZohoConfigured] = useState(false);
    const [zohoStatus, setZohoStatus] = useState<zohoService.ZohoStatus | null>(null);

    // ========== KEYBOARD DETECTION ==========
    const keyboardHeight = useKeyboardHeight();

    // ========== UI STATE ==========
    // THEME MODE - Now supports Light/Dark toggle with persistence
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const saved = localStorage.getItem('iam_theme');
        return saved ? saved === 'dark' : true; // Default to dark
    });

    // Apply theme class on mount and when changed
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('iam_theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(!darkMode);

    const [activeAccountId, setActiveAccountId] = useState(1);
    const [activeView, setActiveView] = useState('inbox');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
    const [dockInput, setDockInput] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [time, setTime] = useState(new Date());

    // Selection States
    const [selectedMailId, setSelectedMailId] = useState<number | null>(null);
    const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
    const [composeMode, setComposeMode] = useState<'new' | 'reply' | null>(null);

    // ========== COMPOSE STATE ==========
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');
    const [recipients, setRecipients] = useState<string[]>([]);
    const [isSending, setIsSending] = useState(false);

    // ========== DOCK-COMPOSE SYNC STATE ==========
    const [activeInputMode, setActiveInputMode] = useState<'dock' | 'compose' | null>(null);
    const [enableDockSync, setEnableDockSync] = useState(true);


    // ========== SEND QUEUE ==========
    // ========== SEND QUEUE ==========
    const [sendQueue, setSendQueue] = useState<ActionQueueItem[]>([]);
    const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);

    // ========== THREAD STATE ==========
    const [threadPageIndex, setThreadPageIndex] = useState(0);

    // ========== SEARCH STATE ==========
    const [searchQuery, setSearchQuery] = useState('');

    // ========== DRAFTS STATE ==========
    const [drafts, setDrafts] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('iam_drafts');
            if (saved) return JSON.parse(saved);
        }
        return [{ id: 'draft-1', to: ['investors@iam.ai'], subject: 'Q1 Projections', body: 'Team, here are the numbers for Q1...', time: '10:45 AM' }];
    });

    // Persist drafts
    useEffect(() => {
        localStorage.setItem('iam_drafts', JSON.stringify(drafts));
    }, [drafts]);
    // ========== MAILBOX STATE ==========
    const [inboxEmails, setInboxEmails] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('iam_inbox');
            if (saved) return JSON.parse(saved);
        }
        return MOCK_INBOX; // Initial default
    });

    const [sentEmails, setSentEmails] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('iam_sent');
            if (saved) return JSON.parse(saved);
        }
        return [];
    });

    const [archiveEmails, setArchiveEmails] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('iam_archive');
            if (saved) return JSON.parse(saved);
        }
        return [];
    });

    const [trashEmails, setTrashEmails] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('iam_trash');
            if (saved) return JSON.parse(saved);
        }
        return [];
    });

    // Persist Mailbox States
    useEffect(() => { localStorage.setItem('iam_inbox', JSON.stringify(inboxEmails)); }, [inboxEmails]);
    useEffect(() => { localStorage.setItem('iam_sent', JSON.stringify(sentEmails)); }, [sentEmails]);
    useEffect(() => { localStorage.setItem('iam_archive', JSON.stringify(archiveEmails)); }, [archiveEmails]);
    useEffect(() => { localStorage.setItem('iam_trash', JSON.stringify(trashEmails)); }, [trashEmails]);

    const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

    // Auto-Save Effect
    useEffect(() => {
        if (!composeMode || (!composeSubject && !composeBody)) return;

        const timeoutId = setTimeout(() => {
            handleSaveDraft(true);
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [composeSubject, composeBody, recipients, composeMode]);

    const handleSaveDraft = (isAutoSave: any = false) => {
        // Handle explicit boolean or event object
        const silent = isAutoSave === true;

        if (!composeSubject && !composeBody) return;

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Determine ID to use (existing or new)
        const draftId = currentDraftId || `draft-${Date.now()}`;

        // If this is a new draft being auto-saved, track its ID immediately
        if (silent && !currentDraftId) {
            setCurrentDraftId(draftId);
        }

        setDrafts(prev => {
            const index = prev.findIndex(d => d.id === draftId);
            const draftData = {
                id: draftId,
                to: recipients,
                subject: composeSubject || '(No Subject)',
                body: composeBody,
                time: now
            };

            if (index >= 0) {
                // Update existing
                const updated = [...prev];
                updated[index] = draftData;
                return updated;
            } else {
                // Create new
                return [draftData, ...prev];
            }
        });

        if (!silent) {
            setAiResponse('Draft saved successfully.');
            setComposeMode(null);
            setCurrentDraftId(null);
            setTimeout(() => setAiResponse(''), 3000);
        }
    };

    // Swipe handlers (Must be at top level)
    const threadSwipeHandlers = useSwipeable({
        onSwipedUp: () => {
            if (!selectedMailId) return;
            const thread = MOCK_THREADS[selectedMailId] || [MOCK_INBOX.find(m => m.id === selectedMailId)];
            if (threadPageIndex < (thread?.length || 1) - 1) setThreadPageIndex(prev => prev + 1);
        },
        onSwipedDown: () => {
            if (threadPageIndex > 0) setThreadPageIndex(prev => prev - 1);
        },
        trackMouse: true
    });

    // Reset thread index when opening new mail
    useEffect(() => {
        setThreadPageIndex(0);
    }, [selectedMailId]);

    // ========== SUPERHUMAN-STYLE KEYBOARD SHORTCUTS ==========
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 1. GLOBAL SHORTCUTS
            // Cmd+K: Focus Dock (Works everywhere)
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const dockInput = document.querySelector('input[placeholder*="Ask"]') as HTMLInputElement;
                dockInput?.focus();
                return;
            }

            // Ignore if typing in input/textarea (for other shortcuts)
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            // NAVIGATION: j/k for thread navigation (only when email is selected)
            if (selectedMailId && !composeMode) {
                if (e.key === 'j' || e.key === 'ArrowDown') {
                    const thread = MOCK_THREADS[selectedMailId] || [MOCK_INBOX.find(m => m.id === selectedMailId)];
                    if (threadPageIndex < (thread?.length || 1) - 1) setThreadPageIndex(prev => prev + 1);
                    return;
                }
                if (e.key === 'k' || e.key === 'ArrowUp') {
                    if (threadPageIndex > 0) setThreadPageIndex(prev => prev - 1);
                    return;
                }
            }

            // COMPOSE: c = new, r = reply, a = reply all, f = forward
            // Allow 'c' to work anywhere (not just when email selected)
            if (e.key === 'c' && !composeMode) {
                e.preventDefault();
                setComposeMode('new');
                setRecipients([]);
                setComposeSubject('');
                setComposeBody('');
                return;
            }
            if (selectedMailId) {
                const mail = MOCK_INBOX.find(m => m.id === selectedMailId);
                if (mail) {
                    if (e.key === 'r') {
                        e.preventDefault();
                        setComposeMode('reply');
                        setRecipients([mail.sender]);
                        setComposeSubject(`RE: ${mail.subject}`);
                        return;
                    }
                    if (e.key === 'a') {
                        e.preventDefault();
                        setComposeMode('reply');
                        setRecipients([mail.sender, 'team@iam.os']); // Mock 'Reply All' behavior
                        setComposeSubject(`RE: ${mail.subject}`);
                        return;
                    }
                    if (e.key === 'f') {
                        e.preventDefault();
                        setComposeMode('new');
                        setComposeSubject(`Fwd: ${mail.subject}`);
                        setComposeBody(`\n\n---------- Forwarded message ---------\nFrom: ${mail.sender}\nDate: ${mail.time}\nSubject: ${mail.subject}\n\n${mail.body}`);
                        return;
                    }
                    if (e.key === 'u') {
                        e.preventDefault();
                        console.log('Mark as unread:', selectedMailId);
                        // In a real app: updateMail(selectedMailId, { read: false })
                        return;
                    }
                }
            }

            // ACTIONS: e = archive, # = delete, s = star
            if (e.key === 'e' && selectedMailId) {
                e.preventDefault();
                console.log('Archive:', selectedMailId);
                setSelectedMailId(null);
                return;
            }
            if ((e.key === '#' || e.key === 'Backspace') && selectedMailId) {
                e.preventDefault();
                console.log('Delete:', selectedMailId);
                setSelectedMailId(null);
                return;
            }
            if (e.key === 's' && selectedMailId) {
                e.preventDefault();
                console.log('Star toggle:', selectedMailId);
                return;
            }

            // NAVIGATION: g+i = goto inbox, g+s = goto sent, g+c = goto calendar
            if (e.key === 'g') {
                const handleSecondKey = (e2: KeyboardEvent) => {
                    if (e2.key === 'i') setActiveView('inbox');
                    if (e2.key === 's') setActiveView('sent');
                    if (e2.key === 'c') handleNav('calendar');
                    if (e2.key === 't') handleNav('tasks');
                    window.removeEventListener('keydown', handleSecondKey);
                };
                window.addEventListener('keydown', handleSecondKey);
                setTimeout(() => window.removeEventListener('keydown', handleSecondKey), 2000);
                return;
            }

            // SEARCH: / = focus search
            if (e.key === '/') {
                e.preventDefault();
                // Focus on dock input
                const dockInput = document.querySelector('input[placeholder*="Ask"]') as HTMLInputElement;
                dockInput?.focus();
                return;
            }

            // ESCAPE: close current view
            if (e.key === 'Escape') {
                if (selectedMailId) setSelectedMailId(null);
                else if (selectedContactId) setSelectedContactId(null);
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedMailId, threadPageIndex, composeMode, activeView]);

    // ========== MODALS & FEATURES ==========
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHubOpen, setIsHubOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Swipe gesture handlers for mobile navigation
    const swipeHandlers = useSwipeable({
        onSwipedRight: () => {
            // Swipe right = go back
            if (selectedMailId || selectedContactId || activeView !== 'inbox') {
                handleDockAction('HOME');
            }
        },
        trackMouse: false, // Only track touch, not mouse
        preventScrollOnSwipe: false,
        delta: 50 // Minimum swipe distance
    });

    // ========== EMAIL ACTIONS ==========

    // Generic Helper to move email between lists
    const moveEmail = (id: number, targetFolder: 'inbox' | 'archive' | 'trash' | 'sent', sourceFolder?: string) => {
        // Find email in current source (activeView or specified)
        const currentSource = sourceFolder || activeView;
        let sourceList: any[] = [];
        let setSourceList: any = null;

        // Determine source list
        switch (currentSource) {
            case 'inbox': sourceList = inboxEmails; setSourceList = setInboxEmails; break;
            case 'archive': sourceList = archiveEmails; setSourceList = setArchiveEmails; break;
            case 'trash': sourceList = trashEmails; setSourceList = setTrashEmails; break;
            case 'sent': sourceList = sentEmails; setSourceList = setSentEmails; break;
            default: sourceList = inboxEmails; setSourceList = setInboxEmails;
        }

        const emailToMove = sourceList.find(e => e.id === id);
        if (!emailToMove) return;

        // Remove from source
        setSourceList((prev: any[]) => prev.filter(e => e.id !== id));

        // Add to target
        switch (targetFolder) {
            case 'inbox': setInboxEmails((prev: any[]) => [emailToMove, ...prev]); break;
            case 'archive': setArchiveEmails((prev: any[]) => [emailToMove, ...prev]); break;
            case 'trash': setTrashEmails((prev: any[]) => [emailToMove, ...prev]); break;
            case 'sent': setSentEmails((prev: any[]) => [emailToMove, ...prev]); break;
        }

        // Feedback
        setAiResponse(`Moved to ${targetFolder.charAt(0).toUpperCase() + targetFolder.slice(1)}`);
        setTimeout(() => setAiResponse(''), 2000);

        // If viewing specific mail, close it
        if (selectedMailId === id) setSelectedMailId(null);
    };

    const handleArchive = (id?: number) => {
        const targetId = id || selectedMailId;
        if (targetId) {
            moveEmail(targetId, 'archive');
            // Add to Undo Queue
            const newItem: ActionQueueItem = {
                id: Date.now(),
                type: 'ARCHIVE',
                status: 'pending',
                data: { id: targetId, originalFolder: activeView },
                countdown: 5
            };
            setSendQueue(prev => [...prev, newItem]);
        }
    };

    // --- UNIVERSAL DELETE HANDLERS ---

    // Generic handleDelete now routes or handles standard email logic
    const handleDelete = (id?: number) => {
        // ... (standard email move-to-trash logic is below)
        const targetId = id || selectedMailId;
        if (targetId) {
            moveEmail(targetId, 'trash');
            if (activeView !== 'trash') {
                const newItem: ActionQueueItem = {
                    id: Date.now(),
                    type: 'DELETE',
                    status: 'pending',
                    data: { id: targetId, originalFolder: activeView },
                    countdown: 5
                };
                setSendQueue(prev => [...prev, newItem]);
            }
        }
    };

    // --- UNIVERSAL DELETE HANDLERS ---

    // 1. DELETE DRAFT
    const discardDraft = (id?: string) => {
        const targetDraftId = id || currentDraftId || (activeView === 'drafts' && selectedMailId); // logic for when drafting

        // If we are in 'new' mode but not yet saved (no ID), just close it
        if (!targetDraftId && composeMode) {
            setComposeMode(null);
            setAiResponse('Draft discarded');
            setTimeout(() => setAiResponse(''), 2000);
            return;
        }

        if (targetDraftId) {
            setDrafts(prev => prev.filter(d => d.id !== targetDraftId));
            setComposeMode(null);
            setCurrentDraftId(null);
            setAiResponse('Draft deleted');
            setTimeout(() => setAiResponse(''), 2000);
        }
    };

    // 2. DELETE CONTACT
    const deleteContact = (id?: number) => {
        const targetId = id || selectedContactId;
        if (targetId) {
            // Mock deletion (since we don't have real contact persistence yet beyond mock array)
            // In real app: setContacts(prev => prev.filter(...))
            setAiResponse('Contact deleted');
            setSelectedContactId(null);
            setTimeout(() => setAiResponse(''), 2000);
        }
    };

    // 3. DELETE FOREVER (Trash)
    const deleteEmailForever = (id?: number) => {
        const targetId = id || selectedMailId;
        if (targetId) {
            setTrashEmails(prev => prev.filter(e => e.id !== targetId));
            setSelectedMailId(null);
            setAiResponse('Deleted forever');
            setTimeout(() => setAiResponse(''), 2000);
        }
    };

    // 4. MARK AS READ/UNREAD
    const handleToggleRead = (id?: number) => {
        const targetId = id || selectedMailId;
        if (!targetId) return;

        const toggleInList = (list: any[]) => list.map(e => e.id === targetId ? { ...e, isRead: !e.isRead } : e);

        // Update state based on active view
        if (activeView === 'inbox') setRealEmails(prev => toggleInList(prev));
        else if (activeView === 'sent') setSentEmails(prev => toggleInList(prev));
        else if (activeView === 'archive') setArchiveEmails(prev => toggleInList(prev));
        else if (activeView === 'trash') setTrashEmails(prev => toggleInList(prev));

        // Feedback
        const currentList = activeView === 'inbox' ? realEmails :
            activeView === 'sent' ? sentEmails :
                activeView === 'archive' ? archiveEmails :
                    activeView === 'trash' ? trashEmails : [];

        const item = currentList.find((e: any) => e.id === targetId);
        if (item) {
            setAiResponse(item.isRead ? 'Marked as Unread' : 'Marked as Read');
            setTimeout(() => setAiResponse(''), 2000);
        }
    };

    // ========== BACKEND INTEGRATION ==========
    // Check Zoho configuration
    useEffect(() => {
        const checkZoho = async () => {
            const status = await zohoService.checkZohoStatus();
            setZohoStatus(status);
            setZohoConfigured(status.configured);
        };
        checkZoho();
    }, []);

    // Check email account connection
    useEffect(() => {
        const checkAccounts = async () => {
            if (!isAuthenticated) return;
            const connected = await emailService.checkEmailAccounts();
            setIsConnected(connected);
        };
        checkAccounts();
    }, [isAuthenticated]);

    // Fetch real emails
    useEffect(() => {
        const fetchEmails = async () => {
            if (!isConnected) {
                setRealEmails([]);
                return;
            }
            setIsLoadingEmails(true);
            try {
                const emails = await emailService.fetchEmails(50);
                setRealEmails(emails);
            } catch (error: any) {
                console.error('Failed to fetch emails:', error);
            } finally {
                setIsLoadingEmails(false);
            }
        };
        fetchEmails();
        const interval = setInterval(fetchEmails, 60000);
        return () => clearInterval(interval);
    }, [isConnected]);

    // Fetch contacts
    useEffect(() => {
        const fetchContacts = async () => {
            if (!isConnected) return;
            try {
                const contacts = await emailService.fetchContacts();
                setRealContacts(contacts);
            } catch (error) {
                console.error('Failed to fetch contacts:', error);
            }
        };
        fetchContacts();
    }, [isConnected]);

    // Fetch calendar events
    useEffect(() => {
        const fetchCalendar = async () => {
            if (!isConnected) return;
            try {
                const events = await emailService.fetchCalendarEvents();
                setRealEvents(events);
            } catch (error) {
                console.error('Failed to fetch calendar:', error);
            }
        };
        fetchCalendar();
    }, [isConnected]);

    // AI Action
    const handleAiAction = async () => {
        if (!dockInput) return;
        setIsAiThinking(true);
        setAiResponse('');
        try {
            if (!ai) {
                setAiResponse("AI not configured. Please add VITE_GEMINI_API_KEY to .env");
                return;
            }
            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash-exp',
                contents: `Context: i.AM OS. Current View: ${activeView}. Selection: ${selectedMailId || 'None'}. User: ${dockInput}. Brief response.`
            });
            setAiResponse(response.text || "Processed.");
        } catch (e) {
            setAiResponse("System offline.");
        } finally {
            setIsAiThinking(false);
            setDockInput('');
        }
    };

    // ========== DOCK-COMPOSE SYNC FUNCTIONS ==========

    // Detect if user intends to compose an email
    const detectComposeIntent = (text: string): boolean => {
        const composeKeywords = [
            /^email .+ about/i,
            /^draft .+ to/i,
            /^write to/i,
            /^send .+ to/i,
            /^reply to/i,
            /^tell .+ that/i,
            /^ask .+ about/i,
            /^follow up with/i,
            /^compose/i,
            /^message .+ about/i
        ];
        return composeKeywords.some(pattern => pattern.test(text.trim()));
    };

    // Parse natural language for recipient and subject
    interface ParsedIntent {
        recipient?: string;
        subject?: string;
        action?: 'compose' | 'reply' | 'forward';
    }

    const parseComposeIntent = (text: string): ParsedIntent => {
        const result: ParsedIntent = {};

        // Extract recipient (look for capitalized names)
        const recipientMatch = text.match(/(?:email|write to|tell|ask|message|send to) ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
        if (recipientMatch) {
            result.recipient = recipientMatch[1].trim();
        }

        // Extract subject
        const subjectMatch = text.match(/about\s+(.+?)(?:\s+(?:and|that|saying|mentioning|asking)|\.|$)/i);
        if (subjectMatch) {
            result.subject = subjectMatch[1].trim();
        }

        // Determine action
        if (/reply/i.test(text)) {
            result.action = 'reply';
        } else if (/forward/i.test(text)) {
            result.action = 'forward';
        } else {
            result.action = 'compose';
        }

        return result;
    };

    // Handle dock input with compose sync
    const handleDockInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setDockInput(text);

        // If compose window is open AND dock sync is enabled
        if (composeMode && enableDockSync) {
            setComposeBody(text);
            setActiveInputMode('dock');

            // Parse for recipient/subject hints
            const parsed = parseComposeIntent(text);
            if (parsed.recipient && recipients.length === 0) {
                // Auto-suggest recipient (don't force it)
                setRecipients([parsed.recipient]);
            }
            if (parsed.subject && !composeSubject) {
                setComposeSubject(parsed.subject);
            }
        }
    };

    // Handle compose body direct typing
    const handleComposeBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setComposeBody(text);

        // Disable dock sync when typing directly in compose
        setEnableDockSync(false);
        setActiveInputMode('compose');
    };

    // Re-enable dock sync when user focuses back on dock
    const handleDockFocus = () => {
        if (composeMode) {
            setEnableDockSync(true);
            setActiveInputMode('dock');
        }
    };

    // Auto-open compose on intent detection
    useEffect(() => {
        if (!composeMode && dockInput && detectComposeIntent(dockInput)) {
            // Auto-open compose window
            setComposeMode('new');
            setEnableDockSync(true);
            setActiveInputMode('dock');

            // Parse and pre-fill
            const parsed = parseComposeIntent(dockInput);
            if (parsed.recipient) {
                setRecipients([parsed.recipient]);
            }
            if (parsed.subject) {
                setComposeSubject(parsed.subject);
            }
            // Body will be synced via handleDockInput
            setComposeBody(dockInput);
        }
    }, [dockInput, composeMode]);

    // Reset sync state when compose closes
    useEffect(() => {
        if (!composeMode) {
            setEnableDockSync(true);
            setActiveInputMode(null);
        }
    }, [composeMode]);


    // ========== EMAIL SENDING ==========
    // ========== EMAIL SENDING (WITH QUEUE) ==========
    const handleSendEmail = async () => {
        if (recipients.length === 0) {
            setAiResponse("Please add a recipient");
            return;
        }
        if (!composeSubject.trim()) {
            setAiResponse("Please add a subject");
            return;
        }

        const newItem: ActionQueueItem = {
            id: Date.now(),
            type: 'SEND',
            status: 'pending',
            data: {
                email: {
                    to: recipients,
                    subject: composeSubject,
                    body: composeBody.trim() ? composeBody : " "
                }
            },
            countdown: 5
        };

        setSendQueue(prev => [...prev, newItem]);
        setAiResponse("Message scheduled for sending...");

        // Clear Form & Close
        setComposeMode(null);
        setComposeSubject('');
        setComposeBody('');
        setRecipients([]);
        setActiveView('inbox');
    };

    const handleUndo = (id: number) => {
        const item = sendQueue.find(i => i.id === id);
        if (!item) return;

        // Remove from queue logic
        setSendQueue(prev => prev.filter(i => i.id !== id));

        // Restoration Logic
        if (item.type === 'SEND') {
            setAiResponse("↺ Sending cancelled");
        } else if (item.type === 'DELETE') {
            moveEmail(item.data.id, item.data.originalFolder, 'trash');
            setAiResponse("↺ Email restored");
        } else if (item.type === 'ARCHIVE') {
            moveEmail(item.data.id, item.data.originalFolder, 'archive');
            setAiResponse("↺ Email unarchived");
        }
    };

    // QUEUE PROCESSOR: Countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setSendQueue(prev => prev.map(item => {
                if (item.status === 'pending') {
                    if (item.countdown > 0) return { ...item, countdown: item.countdown - 1 };
                    return { ...item, status: 'sending' };
                }
                return item;
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // QUEUE PROCESSOR: Sending
    useEffect(() => {
        sendQueue.forEach(async (item) => {
            if (item.status === 'sending') {
                if (item.type === 'SEND') {
                    try {
                        console.log(`Sending email ${item.id} to ${item.data.email.to.join(', ')}`);
                        const result = await emailService.sendEmail({
                            to: item.data.email.to,
                            subject: item.data.email.subject,
                            body: item.data.email.body
                        });

                        if (result.success) {
                            setSendQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'sent' } : i));
                            setAiResponse("✓ Message Sent");

                            // Add to Sent Folder (Persistent)
                            const sentItem = {
                                id: Date.now(), // Generate ID
                                to: item.data.email.to,
                                subject: item.data.email.subject,
                                body: item.data.email.body,
                                time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
                                timestamp: new Date().toISOString(),
                                isRead: true,
                                status: 'SENT'
                            };
                            setSentEmails(prev => [sentItem, ...prev]);

                            // Clear from queue after 5s
                            setTimeout(() => setSendQueue(prev => prev.filter(i => i.id !== item.id)), 5000);
                            // Refresh inbox
                            if (isConnected) {
                                const newEmails = await emailService.fetchEmails(50);
                                setRealEmails(newEmails);
                            }
                        } else {
                            console.error('Send failed:', result);
                            setSendQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'failed' } : i));
                            setAiResponse(`❌ Failed: ${result.message}`);
                        }
                    } catch (error) {
                        console.error('Queue processing error:', error);
                        setSendQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'failed' } : i));
                    }
                } else {
                    setSendQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'completed' } : i));
                    setTimeout(() => setSendQueue(prev => prev.filter(i => i.id !== item.id)), 1000);
                }
            }
        });
    }, [sendQueue]); // Trigger on queue updates

    // ========== HANDLERS ==========
    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('iam_email_connected');
        setIsAuthenticated(false);
        setIsConnected(false);
        setRealEmails([]);
    };

    const handleGenesisComplete = () => {
        setShowOnboarding(false);
        setIsConnected(true);
        localStorage.setItem('iam_email_connected', 'true');
        window.location.reload();
    };

    const handleNav = (view: string) => {
        // Special case: Compose is not a view, it's a mode
        if (view === 'compose') {
            setComposeMode('new');
            setRecipients([]);
            setComposeSubject('');
            setComposeBody('');
            setCurrentDraftId(null);
            setMobileMenuOpen(false);
            return;
        }

        setActiveView(view);
        setMobileMenuOpen(false);
        // Reset selections when changing main module
        setSelectedMailId(null);
        setSelectedContactId(null);
        setComposeMode(null);
        setCurrentDraftId(null); // Reset current draft ID when navigating away
    };

    // --- CONTEXT DETECTION LOGIC ---
    const getDockContext = () => {
        // 0. Home Screen Context (Mobile Menu Open OR Desktop Default Inbox)
        // When on Inbox list with no selection, we show the 3C's as requested for "Home Screen"
        if (mobileMenuOpen) return ['INBOX', 'DRAFTS', 'CALENDAR', 'COMPOSE', 'AI'];

        // 1. Compose Mode
        if (composeMode === 'new') return ['SEND', 'SCHEDULE', 'AI DRAFT', 'ATTACH', 'SAVE'];
        if (composeMode === 'reply') return ['SEND', 'SCHEDULE', 'AI DRAFT', 'ATTACH', 'SAVE'];

        // 2. Inbox Context
        if (activeView === 'inbox') {
            if (selectedMailId) {
                // Reading Mode - Show Reply, Forward, Archive, Star, Delete
                return ['REPLY', 'FORWARD', 'ARCHIVE', 'STAR', 'DELETE'];
            }
            // List Mode - Show Select, Archive, Star, Delete, Compose
            return ['SELECT', 'ARCHIVE', 'STAR', 'DELETE', 'COMPOSE'];
        }

        // 2b. Other Mail Folders
        if (['sent', 'archive', 'trash'].includes(activeView)) {
            if (activeView === 'trash' && selectedMailId) return ['DELETE', 'RESTORE'];
            if (activeView === 'trash' && !selectedMailId) return ['EMPTY TRASH'];
            if (selectedMailId) return ['REPLY', 'FORWARD', 'DELETE'];
            return ['INBOX', 'COMPOSE'];
        }

        // 2c. Drafts View
        if (activeView === 'drafts' || composeMode === 'new' || composeMode === 'reply') {
            // In draft mode or viewing drafts
            if (composeMode === 'new' || composeMode === 'reply') return ['SEND', 'SCHEDULE', 'AI DRAFT', 'ATTACH', 'SAVE'];
            if (activeView === 'drafts' && selectedMailId) return ['EDIT', 'DELETE'];
            return ['INBOX', 'COMPOSE'];
        }

        // 3. Contacts Context
        if (activeView === 'contacts') {
            if (selectedContactId) return ['EMAIL', 'CALL', 'EDIT', 'DELETE'];
            return ['NEW CONTACT', 'EMAIL', 'CALL', 'FIND'];
        }

        // 4. Calendar Context
        if (activeView === 'calendar') {
            return ['NEW EVENT', 'TODAY', 'WEEK', 'MONTH', 'FIND TIME'];
        }

        // 5. Settings
        if (activeView === 'settings') {
            return ['BACK'];
        }

        // Default
        return ['COMPOSE', 'CALENDAR', 'CONTACTS', 'AI'];
    };


    const getActionIcon = (action: string) => {
        switch (action) {
            case 'INBOX': return InboxIcon;
            case 'DRAFTS': return VaultIcon;
            case 'SENT': return SendIcon;
            case 'TRASH': return PurgeIcon;
            case 'CALENDAR':
            case 'TIMELINE': return TimelineIcon;
            case 'COMPOSE': return ComposeIcon;
            case 'AI':
            case 'AI DRAFT':
            case 'NEURAL AI': return NeuralAIIcon;
            case 'CONTACTS':
            case 'DIRECTORY': return DirectoryIcon;
            case 'SEND': return SendIcon;
            case 'MARK READ':
            case 'SEEN': return SeenIcon;
            case 'MARK UNREAD': return UnreadIcon;
            case 'ARCHIVE':
            case 'VAULT': return VaultIcon;
            case 'DELETE':
            case 'PURGE': return PurgeIcon;
            case 'REPLY': return ReplyIcon;
            case 'FORWARD': return SendIcon;
            case 'SEARCH':
            case 'QUERY':
            case 'FIND':
            case 'FIND TIME': return QueryIcon;
            case 'NEW CONTACT':
            case 'PROVISION': return ProvisionIcon;
            case 'HOME':
            case 'SURFACE': return SurfaceIcon;
            case 'SETTINGS':
            case 'SYSTEM': return SystemIcon;
            case 'BACK':
            case 'RETURN': return ReturnIcon;
            case 'DRAFT':
            case 'SAVE': return VaultIcon;
            case 'RECIPIENT': return DirectoryIcon;
            case 'FORMAL':
            case 'FRIENDLY':
            case 'EXPLAIN': return NeuralAIIcon;
            case 'EMPTY TRASH': return PurgeIcon;
            case 'TOGGLE': return SystemIcon;
            case 'EMAIL': return SendIcon;
            case 'URGENT': return UnreadIcon;
            case 'STAR': return UnreadIcon;
            case 'SELECT': return SeenIcon;
            case 'SCHEDULE': return TimelineIcon;
            case 'ATTACH': return ComposeIcon;
            case 'NEW EVENT': return ComposeIcon;
            case 'TODAY': return TimelineIcon;
            case 'WEEK': return TimelineIcon;
            case 'MONTH': return TimelineIcon;
            case 'RESTORE': return InboxIcon;
            case 'EDIT': return ComposeIcon;
            case 'CALL': return DirectoryIcon;
            default: return undefined;
        }
    };


    const dockButtons = getDockContext();

    const handleDockAction = (action: string) => {
        // Global Home logic
        if (action === 'HOME') {
            if (selectedMailId) setSelectedMailId(null);
            else if (selectedContactId) setSelectedContactId(null);
            else if (composeMode) setComposeMode(null);
            else setMobileMenuOpen(true);
            setCurrentDraftId(null); // Reset current draft ID when going home
            return;
        }

        if (action === 'COMPOSE' || action === 'Compose' || action === 'New Event' || action === 'New') {
            setMobileMenuOpen(false); // Go to main view
            setComposeMode('new');
            // Clear state
            setRecipients([]);
            setComposeSubject('');
            setComposeBody('');
            setCurrentDraftId(null); // Ensure no draft is being edited when starting new compose
            return;
        }
        if (action === 'CALENDAR') {
            handleNav('calendar');
            return;
        }
        if (action === 'CONTACTS') {
            handleNav('contacts');
            return;
        }
        if (action === 'INBOX') {
            handleNav('inbox');
            return;
        }
        if (action === 'DRAFTS') {
            handleNav('drafts');
            return;
        }

        if (action === 'REPLY') {
            setComposeMode('reply');
            // Preset mock reply data (in real app, use selectedMailId)
            setRecipients(['Julian Sterling']);
            setComposeSubject('Re: Q4 Targets');
            setCurrentDraftId(null); // Ensure no draft is being edited when starting a reply
            return;
        }

        // Email Sending
        if (action === 'DRAFT') {
            handleSaveDraft();
            return;
        }

        // Email Sending
        if (action === 'SEND') {
            handleSendEmail();
            return;
        }

        if (action === 'ARCHIVE') {
            handleArchive();
            return;
        }

        if (action === 'DELETE') {
            // Check context to determine WHAT to delete
            if (activeView === 'contacts') {
                deleteContact();
            } else if (activeView === 'drafts' || composeMode === 'new' || composeMode === 'reply') {
                discardDraft();
            } else if (activeView === 'trash') {
                deleteEmailForever();
            } else {
                handleDelete(); // Standard email move to trash
            }
            return;
        }

        // Settings
        if (action === 'SETTINGS') {
            setIsSettingsOpen(true);
            handleNav('settings');
            return;
        }

        if (action === 'MARK READ' || action === 'MARK UNREAD') {
            handleToggleRead();
            return;
        }

        // Simulate generic action
        setDockInput(`Action: ${action}`);
        setTimeout(() => handleAiAction(), 500);
    };

    // Handle AI/Hub action
    const handleAIAction = () => {
        setIsHubOpen(true);
    };

    // Helper function to strip HTML tags and decode entities
    const stripHtml = (html: string): string => {
        if (!html) return '';
        // Remove HTML tags
        const withoutTags = html.replace(/<[^>]*>/g, '');
        // Decode HTML entities
        const textarea = document.createElement('textarea');
        textarea.innerHTML = withoutTags;
        return textarea.value.trim();
    };

    // Use real data if available, fallback to mock
    // Use real data if available, fallback to mock, then filter by VIEW
    const getCurrentViewData = () => {
        // Base Data: Real vs Mock
        // Note: Real data fetching is currently limited to Inbox in this demo logic
        // For production, we would need realSentEmails, realArchiveEmails etc.

        let sourceData: any[] = [];

        switch (activeView) {
            case 'inbox':
                sourceData = realEmails.length > 0 ? realEmails : inboxEmails;
                break;
            case 'sent':
                sourceData = sentEmails;
                break;
            case 'archive':
                sourceData = archiveEmails;
                break;
            case 'trash':
                sourceData = trashEmails;
                break;
            default:
                sourceData = inboxEmails;
        }

        // Transform/Normalize Data
        return sourceData.map((e: any) => ({
            id: e.id,
            // For Sent view, show 'To: [Recipient]' if available, otherwise just handle sender
            sender: activeView === 'sent' && e.to ? `To: ${e.to[0]}` : (e.sender || e.senderName || 'Unknown'),
            subject: e.subject || '(No Subject)',
            body: stripHtml(e.snippet || e.preview || e.body || ''),
            time: e.time || emailService.formatEmailTime(e.timestamp) || '',
            status: e.isRead ? 'READ' : 'UNREAD',
        }));
    };

    const currentViewData = getCurrentViewData();
    // Filter by search
    const filteredEmails = currentViewData.filter((email: any) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            email.subject.toLowerCase().includes(q) ||
            email.sender.toLowerCase().includes(q) ||
            email.body.toLowerCase().includes(q)
        );
    });

    const contactsData = realContacts.length > 0 ? realContacts : MOCK_CONTACTS;
    const eventsData = realEvents.length > 0 ? realEvents : MOCK_EVENTS;

    // --- DYNAMIC MODULES STATE ---
    const DEFAULT_MODULES = [
        { id: 'inbox', label: 'Inbox', sublabel: 'PRIMARY' },
        { id: 'drafts', label: 'Drafts', sublabel: 'PENDING' },
        { id: 'compose', label: 'Compose', sublabel: 'NEW EMAIL' },
        { id: 'sent', label: 'Sent', sublabel: 'OUTBOUND' },
        { id: 'archive', label: 'Archive', sublabel: 'STORAGE' },
        { id: 'trash', label: 'Trash', sublabel: 'JUNK' },
        { id: 'contacts', label: 'Contacts', sublabel: 'DIRECTORY' },
        { id: 'calendar', label: 'Calendar', sublabel: 'SCHEDULE' },
        { id: 'settings', label: 'Settings', sublabel: 'SYSTEM' }
    ];

    const [modules, setModules] = useState<{ id: string, label: string, sublabel: string }[]>(() => {
        const saved = localStorage.getItem('user_modules_priority');
        return saved ? JSON.parse(saved) : DEFAULT_MODULES;
    });

    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        localStorage.setItem('user_modules_priority', JSON.stringify(modules));
    }, [modules]);

    const moveModule = (id: string, direction: 'up' | 'down') => {
        const index = modules.findIndex(m => m.id === id);
        if (index < 0) return;
        const newModules = [...modules];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= modules.length) return;
        [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
        setModules(newModules);
    };

    const removeModule = (id: string) => {
        setModules(modules.filter(m => m.id !== id));
    };

    const addModule = (item: { id: string, label: string, sublabel: string }) => {
        if (!modules.find(m => m.id === item.id)) {
            setModules([...modules, item]);
        }
    };

    const handleModuleClick = (id: string) => {
        handleNav(id);
    };

    const refractionRef = useMouseRefraction();

    return (
        <div ref={refractionRef} className={`h-[100dvh] w-full flex overflow-hidden font-sans relative transition-colors duration-500
        bg-background text-foreground
    `}>
            {/* Vitreous Noise Filter Overlay */}
            <svg className="grain-overlay">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            {/* 1. SIDEBAR (NAVIGATION) */}
            <aside
                className={`
                fixed inset-0 z-50 w-full flex flex-col h-[100dvh]
                md:relative md:w-[22%] md:min-w-[200px] md:max-w-[320px] md:flex-shrink-0 md:inset-auto md:translate-x-0 md:h-full
                transition-all duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                bg-sidebar border-r border-sidebar-border
                `}
                style={{ backgroundColor: darkMode ? '#060606' : '#ffffff' }}
            >

                {/* Ether Bar Header - Floating Capsule */}
                <div className="px-4 py-4 shrink-0 z-20 flex justify-center">
                    <EtherBar
                        darkMode={darkMode}
                        onSettings={() => setIsSettingsOpen(true)}
                        onGenesis={() => setShowOnboarding(true)}
                        onThemeToggle={toggleTheme}
                        themeMode={darkMode ? 'dark' : 'light'}
                    />
                </div>

                {/* Module List - Monolith Grid - SCROLLABLE */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y monolith-container pb-32 md:pb-20" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {/* Background Effects */}
                    <div className="monolith-glow"></div>
                    <div className="monolith-bg"></div>

                    <div className="relative z-10 p-4">
                        <div className="flex justify-between items-center mb-6 px-1">
                            <h3 className={`text-[9px] font-bold tracking-[0.3em] opacity-30 uppercase ${darkMode ? '' : 'text-black'}`}>System Modules</h3>
                            <button
                                onClick={() => setIsEditMode(!isEditMode)}
                                className={`text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full transition-all duration-300 border ${isEditMode
                                    ? (darkMode ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-black text-white border-black shadow-lg')
                                    : (darkMode ? 'bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/30' : 'bg-transparent border-black/10 text-black/40 hover:text-black hover:border-black/30')
                                    }`}
                            >
                                {isEditMode ? 'Done' : 'Edit'}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 monolith-canvas-refined !p-0 !grid">
                            {modules.map((item, index) => (
                                <div key={item.id} className="relative group perspective-1000">
                                    <div className={`transition-all duration-500 ${isEditMode ? 'scale-[0.9] opacity-70' : 'scale-100 opacity-100'}`}>
                                        <LiquidModuleCard
                                            icon={getActionIcon(item.label.toUpperCase())}
                                            label={item.sublabel}
                                            name={item.label.toUpperCase()}
                                            isActive={activeView === item.id}
                                            theme={darkMode ? 'dark' : 'light'}
                                            onClick={() => !isEditMode && handleModuleClick(item.id)}
                                        />
                                    </div>

                                    {/* Edit Mode Controls */}
                                    {isEditMode && (
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeModule(item.id); }}
                                                className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white hover:bg-red-600 transition-all hover:scale-110 shadow-2xl border border-white/40"
                                            >
                                                ✕
                                            </button>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); moveModule(item.id, 'up'); }}
                                                    disabled={index === 0}
                                                    className={`w-6 h-6 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-[8px] transition-all font-bold ${index === 0 ? 'opacity-20' : 'bg-white/20 hover:bg-white/40'}`}
                                                >
                                                    ▲
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); moveModule(item.id, 'down'); }}
                                                    disabled={index === modules.length - 1}
                                                    className={`w-6 h-6 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-[8px] transition-all font-bold ${index === modules.length - 1 ? 'opacity-20' : 'bg-white/20 hover:bg-white/40'}`}
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Add Module Button - Shows when modules are removed */}
                            {isEditMode && modules.length < DEFAULT_MODULES.length && (
                                <div className="col-span-2 mt-4">
                                    <div className={`text-[9px] font-bold tracking-[0.2em] opacity-30 uppercase mb-3 px-1 ${darkMode ? '' : 'text-black'}`}>Available Modules</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {DEFAULT_MODULES.filter(dm => !modules.find(m => m.id === dm.id)).map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => addModule(item)}
                                                className={`p-3 border border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group ${darkMode ? 'border-white/20 hover:border-white/50 hover:bg-white/5' : 'border-black/20 hover:border-black/50 hover:bg-black/5'}`}
                                            >
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${darkMode ? 'bg-white/10 text-white/60 group-hover:text-white' : 'bg-black/10 text-black/60 group-hover:text-black'}`}>
                                                    +
                                                </span>
                                                <span className={`text-[9px] uppercase tracking-wider transition-colors ${darkMode ? 'text-white/40 group-hover:text-white/80' : 'text-black/40 group-hover:text-black/80'}`}>
                                                    {item.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA (CENTER + RIGHT WIDGET) */}
            <main className={`
        relative flex-1 flex transition-transform duration-500 overflow-hidden
        ${mobileMenuOpen ? 'translate-x-full md:translate-x-0' : 'translate-x-0'}
      `}>

                {/* CENTER COLUMN: LIST/CONTENT */}
                <div className="flex-1 flex flex-col h-full relative z-10" {...swipeHandlers}>

                    {/* Scrollable Content Container */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 lg:p-12 no-scrollbar pb-40 relative">


                        {/* Removed redundant mobile back button - now only in dock */}


                        {/* VIEW: EMAIL LIST (Inbox, Sent, Archive, Trash) */}
                        {
                            ['inbox', 'sent', 'archive', 'trash'].includes(activeView) && !selectedMailId && !composeMode && (
                                <div className="space-y-4 max-w-2xl mx-auto">
                                    <SectionHeader>
                                        {activeView.toUpperCase()} {isLoadingEmails && activeView === 'inbox' && <span className="text-[9px] opacity-50">syncing...</span>}
                                        {currentViewData.length === 0 && <span className="text-[9px] opacity-50 ml-2">(Empty)</span>}
                                    </SectionHeader>
                                    <div className="space-y-3">
                                        {filteredEmails.map(mail => {
                                            const initials = mail.sender.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                            return (
                                                <LiquidEmailCard
                                                    key={mail.id}
                                                    sender={mail.sender}
                                                    subject={mail.subject}
                                                    time={mail.time}
                                                    preview={mail.body.substring(0, 120)}
                                                    initials={initials}
                                                    theme={darkMode ? 'dark' : 'light'}
                                                    onClick={() => setSelectedMailId(mail.id)}
                                                />
                                            );
                                        })}
                                    </div>
                                    {filteredEmails.length === 0 && (
                                        <GlassEmptyState
                                            title={`No ${activeView} Items`}
                                            description={searchQuery ? "No matches found for your search." : `Your ${activeView} is completely empty.`}
                                            icon="📭"
                                            darkMode={darkMode}
                                        />
                                    )}
                                </div>
                            )
                        }

                        {/* VIEW: CONVERSATION PAGE VIEWER (THREAD) */}
                        {/* VIEW: EMAIL DETAIL - Terminal Suite Reading Page */}
                        {
                            activeView === 'inbox' && selectedMailId && !composeMode && (() => {
                                const selectedMail = currentViewData.find((m: any) => m.id === selectedMailId);
                                if (!selectedMail) return null;
                                const initials = selectedMail.sender.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

                                return (
                                    <div className="w-full max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
                                        {/* Reading Header - Monolith Style */}
                                        <div
                                            className="reading-header-monolith relative overflow-hidden p-8 md:p-10 border"
                                            style={{
                                                background: darkMode
                                                    ? 'linear-gradient(165deg, #111113 0%, #050505 100%)'
                                                    : 'linear-gradient(165deg, #ffffff 0%, #f5f5f5 100%)',
                                                borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                                                borderRadius: '0.5rem'
                                            }}
                                        >
                                            {/* Sheen Effect */}
                                            <div className="sheen"></div>

                                            {/* Label Tag */}
                                            <div
                                                className="absolute top-3 right-6 font-mono text-[8px] tracking-widest uppercase px-2 py-1"
                                                style={{
                                                    background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                                                    color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                                                    borderRadius: '0 0 4px 4px'
                                                }}
                                            >
                                                Comms: Secure_Stream
                                            </div>

                                            {/* Subject Line */}
                                            <h1
                                                className="text-2xl md:text-3xl font-extrabold mb-6 leading-tight max-w-[90%]"
                                                style={{
                                                    color: darkMode ? '#fff' : '#000',
                                                    letterSpacing: '-0.02em'
                                                }}
                                            >
                                                {selectedMail.subject}
                                            </h1>

                                            {/* Sender Strip */}
                                            <div
                                                className="flex items-center gap-4 pt-6"
                                                style={{ borderTop: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}
                                            >
                                                <div
                                                    className="w-11 h-11 flex items-center justify-center font-extrabold"
                                                    style={{
                                                        background: darkMode
                                                            ? 'linear-gradient(135deg, #fff 0%, #888 50%, #000 100%)'
                                                            : 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
                                                        color: darkMode ? '#000' : 'rgba(0, 0, 0, 0.6)'
                                                    }}
                                                >
                                                    {initials}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm" style={{ color: darkMode ? '#fff' : '#000' }}>
                                                        {selectedMail.sender.toUpperCase()}
                                                    </div>
                                                    <div className="font-mono text-[11px]" style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                                                        TO: ME • {selectedMail.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Strip */}
                                        <div
                                            className="grid grid-cols-4 gap-px overflow-hidden"
                                            style={{
                                                background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                                                border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                                                borderRadius: '0.5rem'
                                            }}
                                        >
                                            {[
                                                { label: 'Reply', action: () => { setComposeMode('reply'); setRecipients([selectedMail.sender]); setComposeSubject(`RE: ${selectedMail.subject}`); } },
                                                { label: 'Reply All', action: () => { setComposeMode('reply'); setRecipients([selectedMail.sender]); setComposeSubject(`RE: ${selectedMail.subject}`); } },
                                                { label: 'Forward', action: () => { setComposeMode('new'); setComposeSubject(`FW: ${selectedMail.subject}`); setComposeBody(selectedMail.body); } },
                                                { label: 'Delete', action: () => { setSelectedMailId(null); } }
                                            ].map((btn, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={btn.action}
                                                    className="flex items-center justify-center gap-2 py-4 font-mono text-[10px] uppercase tracking-wider transition-all duration-500"
                                                    style={{
                                                        background: darkMode ? '#0d0d0f' : '#fff',
                                                        color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = darkMode ? '#16161a' : '#f5f5f5';
                                                        e.currentTarget.style.color = darkMode ? '#fff' : '#000';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = darkMode ? '#0d0d0f' : '#fff';
                                                        e.currentTarget.style.color = darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
                                                    }}
                                                >
                                                    {btn.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Reading Body */}
                                        <article
                                            className="p-8 md:p-10 border leading-8"
                                            style={{
                                                background: darkMode ? '#0d0d0f' : '#fff',
                                                borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                                                color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                                                fontSize: '15px',
                                                borderRadius: '0.5rem'
                                            }}
                                        >
                                            <div className="whitespace-pre-wrap">{selectedMail.body}</div>

                                            <div
                                                className="mt-12 pt-6 text-[10px] uppercase tracking-widest text-center opacity-30"
                                                style={{ borderTop: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}
                                            >
                                                i.AM Secure Relay • End-to-End Encrypted
                                            </div>
                                        </article>
                                    </div>
                                );
                            })()
                        }

                        {/* VIEW: COMPOSE - Terminal Suite Composer Monolith */}
                        {composeMode && (
                            <div className="w-full max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-300">
                                <div
                                    className="composer-monolith relative overflow-hidden border"
                                    onKeyDown={(e) => {
                                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSendEmail();
                                        }
                                    }}
                                    style={{
                                        background: darkMode
                                            ? 'linear-gradient(165deg, #111113 0%, #050505 100%)'
                                            : 'linear-gradient(165deg, #ffffff 0%, #f5f5f5 100%)',
                                        borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                                        borderRadius: '0.5rem'
                                    }}
                                >
                                    {/* Sheen Effect */}
                                    <div className="sheen"></div>

                                    {/* Composer Header - Input Rows */}
                                    <div
                                        className="px-6"
                                        style={{ borderBottom: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}
                                    >
                                        {/* TO Row */}
                                        <div
                                            className="flex items-center py-4"
                                            style={{ borderBottom: darkMode ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.03)' }}
                                        >
                                            <label
                                                className="w-20 font-mono text-[11px] uppercase"
                                                style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
                                            >
                                                To
                                            </label>
                                            <input
                                                type="text"
                                                value={recipients.join('; ')}
                                                onChange={(e) => setRecipients(e.target.value.split(';').map(s => s.trim()))}
                                                placeholder="email@example.com"
                                                className="flex-1 bg-transparent outline-none text-sm"
                                                style={{ color: darkMode ? '#fff' : '#000' }}
                                            />
                                            <button
                                                className="font-mono text-[10px] uppercase px-2 py-1 transition-all"
                                                style={{
                                                    color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                                                    border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)'
                                                }}
                                            >
                                                CC/BCC
                                            </button>
                                        </div>

                                        {/* SUBJECT Row */}
                                        <div className="flex items-center py-4">
                                            <label
                                                className="w-20 font-mono text-[11px] uppercase"
                                                style={{ color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
                                            >
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                value={composeSubject}
                                                onChange={(e) => setComposeSubject(e.target.value)}
                                                placeholder="Email subject..."
                                                className="flex-1 bg-transparent outline-none text-sm"
                                                style={{ color: darkMode ? '#fff' : '#000' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Composer Body */}
                                    <div className="p-6 min-h-[300px]">
                                        <textarea
                                            value={composeBody}
                                            onChange={handleComposeBodyChange}
                                            onFocus={() => {
                                                setEnableDockSync(false);
                                                setActiveInputMode('compose');
                                            }}
                                            placeholder="Write your message here..."
                                            className="w-full min-h-[250px] bg-transparent outline-none resize-y leading-relaxed"
                                            style={{
                                                color: darkMode ? '#fff' : '#000',
                                                fontSize: '15px'
                                            }}
                                        />
                                    </div>

                                    {/* Attachment Bar - Only show if there are attachments */}
                                    {/* Hidden by default, would show when files are attached */}

                                    {/* Composer Footer */}
                                    <div
                                        className="p-6 flex justify-between items-center"
                                        style={{ borderTop: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}
                                    >
                                        {/* Ghost Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                className="w-11 h-11 flex items-center justify-center border transition-all"
                                                style={{
                                                    background: 'transparent',
                                                    borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                                                    color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
                                                }}
                                                title="Attach Files"
                                            >
                                                📎
                                            </button>
                                            <button
                                                className="w-11 h-11 flex items-center justify-center border transition-all"
                                                style={{
                                                    background: 'transparent',
                                                    borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                                                    color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
                                                }}
                                                onClick={() => handleSaveDraft(false)}
                                                title="Save Draft"
                                            >
                                                💾
                                            </button>
                                        </div>

                                        {/* Send Button - Crimson accent for visibility */}
                                        <button
                                            onClick={handleSendEmail}
                                            disabled={isSending}
                                            className="px-8 py-3.5 font-bold text-[12px] uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-50 rounded flex items-center gap-2"
                                            style={{
                                                background: '#dc2626',
                                                color: '#fff',
                                                border: 'none'
                                            }}
                                        >
                                            <span>➤</span> {isSending ? 'Sending...' : 'Send'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                        }

                        {/* VIEW: CONTACTS */}
                        {
                            activeView === 'contacts' && !selectedContactId && (
                                <div className="w-full max-w-2xl mx-auto">
                                    <SectionHeader>VERIFIED NODES</SectionHeader>
                                    <div className="space-y-3">
                                        {MOCK_CONTACTS.map(contact => (
                                            <ContactCardHorizontal
                                                key={contact.id}
                                                name={contact.name}
                                                role={contact.role}
                                                onPhone={() => alert(`Calling ${contact.name}...`)}
                                                onEmail={() => setSelectedContactId(contact.id)}
                                                onWhatsApp={() => window.open(`https://wa.me/971551234567`, '_blank')}
                                                darkMode={darkMode}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        }

                        {/* VIEW: CONTACT DETAIL */}
                        {
                            activeView === 'contacts' && selectedContactId && (
                                <div className="max-w-2xl mx-auto flex flex-col items-center pt-10">
                                    {MOCK_CONTACTS.filter(c => c.id === selectedContactId).map(c => (
                                        <div key={c.id} className="text-center w-full">
                                            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-black shadow-2xl" style={{ background: 'linear-gradient(135deg, #fff 0%, #888 50%, #000 100%)' }}>
                                                {c.name.charAt(0)}
                                            </div>
                                            <h2 className="text-2xl font-bold mb-1">{c.name}</h2>
                                            <div className="text-xs uppercase tracking-[0.2em] opacity-50 mb-8">{c.role}</div>

                                            <GlassModule darkMode={darkMode} className="p-6 text-left space-y-4">
                                                <div>
                                                    <div className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Email</div>
                                                    <div className="text-sm">{c.email}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Phone</div>
                                                    <div className="text-sm">+971 55 123 4567</div>
                                                </div>
                                            </GlassModule>
                                        </div>
                                    ))}
                                </div>
                            )
                        }

                        {/* VIEW: CALENDAR */}
                        {
                            activeView === 'calendar' && (
                                <div className="w-full absolute inset-0 z-10 animate-in fade-in fill-mode-both duration-700">
                                    <CalendarPage
                                        darkMode={darkMode}
                                        onClose={() => handleNav('inbox')}
                                    />
                                </div>
                            )
                        }

                        {/* VIEW: SETTINGS */}
                        {
                            activeView === 'settings' && (
                                <div className="w-full absolute inset-0 z-10 animate-in fade-in fill-mode-both duration-700">
                                    <SettingsPage
                                        darkMode={darkMode}
                                        onClose={() => handleNav('inbox')}
                                    />
                                </div>
                            )
                        }

                        {/* VIEW: SEARCH */}
                        {
                            activeView === 'search' && (
                                <div className="max-w-2xl mx-auto space-y-6">
                                    <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                        SEARCH
                                    </h2>
                                    <GlassModule darkMode={darkMode} className="p-4 sticky top-0 z-20">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">🔍</span>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                autoFocus
                                                placeholder="Search emails, contacts, calendar..."
                                                className={`flex-1 bg-transparent outline-none text-lg ${darkMode ? 'text-white placeholder-white/30' : 'text-black placeholder-slate-400'}`}
                                            />
                                            {searchQuery && (
                                                <button onClick={() => setSearchQuery('')} className="w-6 h-6 rounded-full bg-neutral-500/20 flex items-center justify-center text-[10px]">✕</button>
                                            )}
                                        </div>
                                    </GlassModule>

                                    {searchQuery ? (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                            {/* Matches: Emails */}
                                            {currentViewData.filter((m: any) =>
                                                m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                m.body.toLowerCase().includes(searchQuery.toLowerCase())
                                            ).length > 0 && (
                                                    <div>
                                                        <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-3 ml-2">Emails</h3>
                                                        <div className="space-y-2">
                                                            {currentViewData.filter((m: any) =>
                                                                m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                                m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                                m.body.toLowerCase().includes(searchQuery.toLowerCase())
                                                            ).map(mail => (
                                                                <GlassModule key={mail.id} onClick={() => { setSelectedMailId(mail.id); setDockInput(''); }} darkMode={darkMode} className="p-4 cursor-pointer hover:scale-[1.01] transition-transform">
                                                                    <div className="flex justify-between mb-1">
                                                                        <span className="font-bold text-sm">{mail.sender}</span>
                                                                        <span className="text-[10px] opacity-50">{mail.time}</span>
                                                                    </div>
                                                                    <div className="text-sm opacity-90 truncate">{mail.subject}</div>
                                                                </GlassModule>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Matches: Contacts */}
                                            {MOCK_CONTACTS.filter(c =>
                                                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                c.email.toLowerCase().includes(searchQuery.toLowerCase())
                                            ).length > 0 && (
                                                    <div>
                                                        <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-3 ml-2">Contacts</h3>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {MOCK_CONTACTS.filter(c =>
                                                                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                                c.email.toLowerCase().includes(searchQuery.toLowerCase())
                                                            ).map(contact => (
                                                                <GlassModule key={contact.id} onClick={() => { setSelectedContactId(contact.id); }} darkMode={darkMode} className="p-3 flex items-center gap-3 cursor-pointer">
                                                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">{contact.name.charAt(0)}</div>
                                                                    <div>
                                                                        <div className="text-sm font-bold">{contact.name}</div>
                                                                        <div className="text-[10px] opacity-50">{contact.email}</div>
                                                                    </div>
                                                                </GlassModule>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Empty State */}
                                            {currentViewData.filter((m: any) => m.subject.toLowerCase().includes(searchQuery.toLowerCase()) || m.sender.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                                                MOCK_CONTACTS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                                    <div className="text-center py-12 opacity-40">
                                                        <div className="text-2xl mb-2">👻</div>
                                                        <div>No matches found</div>
                                                    </div>
                                                )}
                                        </div>
                                    ) : (
                                        <div className="mt-8 text-center opacity-30">
                                            <div className="text-4xl mb-2">⌨️</div>
                                            <div className="text-sm">Type to find anything...</div>
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        {/* VIEW: DRAFTS */}
                        {
                            activeView === 'drafts' && (
                                <div className="max-w-2xl mx-auto">
                                    <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                        DRAFTS ({drafts.length})
                                    </h2>

                                    {drafts.length > 0 ? (
                                        <div className="space-y-3">
                                            {drafts.map(draft => (
                                                <GlassModule
                                                    key={draft.id}
                                                    onClick={() => {
                                                        setComposeMode('new');
                                                        setCurrentDraftId(draft.id);
                                                        setRecipients(draft.to);
                                                        setComposeSubject(draft.subject);
                                                        setComposeBody(draft.body);
                                                    }}
                                                    darkMode={darkMode}
                                                    className="p-4 cursor-pointer hover:border-primary/30 transition-colors"
                                                >
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">DRAFT</span>
                                                        <span className="text-[10px] opacity-50">{draft.time}</span>
                                                    </div>
                                                    <h3 className="font-medium text-sm mb-1">{draft.subject}</h3>
                                                    <p className="text-xs opacity-60 line-clamp-1">{draft.body}</p>
                                                </GlassModule>
                                            ))}
                                        </div>
                                    ) : (
                                        <GlassEmptyState
                                            title="No Drafts"
                                            description="Start writing to see your drafts here."
                                            icon="📝"
                                            darkMode={darkMode}
                                        />
                                    )}
                                </div>
                            )
                        }


                    </div >
                </div >

                {/* RIGHT COLUMN: PREMIUM WIDGETS + CALENDAR (DESKTOP ONLY) */}
                <div className={`hidden lg:flex lg:w-[24%] lg:min-w-[220px] lg:max-w-[360px] lg:flex-shrink-0 p-4 lg:p-6 flex-col border-l transition-all duration-300 border-sidebar-border bg-sidebar`
                }>
                    <RightPanel darkMode={darkMode} time={time} unreadCount={realEmails.length} onNavigate={handleNav} />
                </div >

            </main >



            {/* DOCK - Floating Command Center with Keyboard Avoidance */}
            <div
                className={`fixed bottom-0 left-0 right-0 p-6 z-[60] flex flex-col items-center justify-end pointer-events-none`}
            >
                {/* Gradient Mask for bottom fade */}
                <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${darkMode ? 'from-[#050505] via-[#050505]/95 to-transparent' : 'from-[#FAFAFA] via-[#FAFAFA]/95 to-transparent'}`}></div>

                <div className="relative z-10 w-full max-w-2xl flex flex-col gap-3 pointer-events-auto">
                    {/* Send Queue / Undo Banner */}
                    {sendQueue.filter(q => q.status === 'pending').map(item => (
                        <div key={item.id} className={`p-3 rounded-md border backdrop-blur-md shadow-xl text-[10px] animate-in slide-in-from-bottom-5 flex justify-between items-center w-full ${darkMode ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-white border-neutral-200 text-black'}`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.type === 'SEND' ? 'bg-blue-500' : 'bg-primary'}`}></div>
                                <span className="font-bold">
                                    {item.type === 'SEND' ? `Sending in ${item.countdown}s...` :
                                        item.type === 'DELETE' ? `Moved to Trash (${item.countdown}s)` :
                                            `Archived (${item.countdown}s)`}
                                </span>
                            </div>
                            <button onClick={() => handleUndo(item.id)} className="text-primary font-bold uppercase tracking-wider hover:text-primary/80">
                                UNDO
                            </button>
                        </div>
                    ))}

                    {/* AI Toast Response */}
                    {aiResponse && (
                        <div className={`p-3 rounded-md border backdrop-blur-md shadow-xl text-[10px] animate-in slide-in-from-bottom-5 ${darkMode ? 'bg-[#1A1A1A] border-primary/30 text-white' : 'bg-white border-primary/20 text-black'}`}>
                            <span className="font-bold text-primary mr-2">●</span> {aiResponse}
                        </div>
                    )}

                    {/* NEW REDESIGNED DOCK */}
                    <Dock
                        activeModule={activeView}
                        isDarkMode={darkMode}
                        isMobile={window.innerWidth < 768}
                        dockInput={dockInput}
                        onDockInputChange={handleDockInput}
                        onDockFocus={handleDockFocus}
                        onDockSubmit={handleAiAction}
                        onHome={() => handleDockAction('HOME')}
                        onAction={handleDockAction}
                        keyboardHeight={keyboardHeight}
                    />
                </div>
            </div>

            {/* ========== MODALS & OVERLAYS ========== */}

            {/* Settings Modal - Nexus Control */}
            <NexusSettings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                themeMode={darkMode ? 'dark' : 'light'}
                onThemeModeChange={toggleTheme}
            />

            {/* Hub AI Assistant */}
            <Hub
                isOpen={isHubOpen}
                onClose={() => setIsHubOpen(false)}
                isDark={darkMode}
                context={{
                    currentScreen: (selectedMailId ? 'email-detail' : activeView) as HubScreen,
                    selectedEmailId: selectedMailId?.toString(),
                }}
                onComposeEmail={() => { setComposeMode('new'); setIsHubOpen(false); }}
                onReplyEmail={() => { setComposeMode('reply'); setIsHubOpen(false); }}
                onForwardEmail={() => { setIsHubOpen(false); }}
                onSummarizeEmail={() => { handleAiAction(); setIsHubOpen(false); }}
                onArchiveEmail={() => { setSelectedMailId(null); setIsHubOpen(false); }}
                onOpenSettings={() => { setIsSettingsOpen(true); setIsHubOpen(false); }}
                onThemeToggle={() => { }}
            />



            {/* Genesis Protocol Onboarding */}
            {
                showOnboarding && (
                    <OnboardingFlow
                        onComplete={handleGenesisComplete}
                        onClose={() => setShowOnboarding(false)}
                        isDarkMode={darkMode}
                    />
                )
            }

        </div >
    );
}

// ========== AUTHENTICATION WRAPPER ==========
export default function AppWithAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const token = localStorage.getItem('auth_token');
        console.log('[AppWithAuth] Initial auth check:', { token: !!token });
        return !!token;
    });

    const handleAuthenticated = () => {
        console.log('[AppWithAuth] handleAuthenticated called');
        setIsAuthenticated(true);
    };

    console.log('[AppWithAuth] Rendering, isAuthenticated:', isAuthenticated);

    console.log('[AppWithAuth] Rendering, isAuthenticated:', isAuthenticated);

    try {
        if (!isAuthenticated) {
            console.log('[AppWithAuth] Rendering AuthPage');
            return <AuthPage onLoginSuccess={handleAuthenticated} />;
        }

        console.log('[AppWithAuth] Rendering ProductPage');
        return <ProductPage />;
    } catch (error) {
        console.error('[AppWithAuth] Render error:', error);
        return <div style={{ padding: '20px', color: 'red' }}>Error: {String(error)}</div>;
    }
}