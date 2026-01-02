import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import AuthPage from './components/AuthPage';
import NexusSettings from './components/NexusSettings';
import { Hub, HubContext, HubScreen } from './components/Hub';
import OnboardingFlow from './components/OnboardingFlow';
import { Bot, Plus, ChevronDown } from 'lucide-react';
import * as emailService from './services/emailService';
import type { ThemeMode } from './types';

// --- MOCK DATA ---
const MOCK_INBOX = [
  { id: 1, type: 'mail', sender: 'Lunar Logistics Corp.', subject: 'Q4 Strategic Resource Allocation', time: '14:02 PM', status: 'URGENT', body: "The quarterly review is attached. Please review the preliminary figures for the board meeting on Friday. We noticed a discrepancy in sector 7 allocations." },
  { id: 2, type: 'mail', sender: 'Global Sales Div', subject: 'Dubai Region Quarterly Targets', time: '09:15 AM', status: 'UNREAD', body: "The targets for the upcoming quarter have been finalized. Please coordinate with the local teams for implementation." },
  { id: 3, type: 'mail', sender: 'System Alert', subject: 'Capacity Warning: Node 7', time: 'Yesterday', status: 'READ', body: "Storage capacity has reached 85%. Automated cleanup protocols will initiate at 80% if no action is taken." }
];

const MOCK_CONTACTS = [
  { id: 101, name: 'Sloane Vanderbilt', role: 'Executive Lead' },
  { id: 102, name: 'Julian Sterling', role: 'Senior Analyst' },
  { id: 103, name: 'Amara Khan', role: 'Operations' }
];

const MOCK_EVENTS = [
  { id: 201, title: 'Executive Briefing', time: '09:00 AM', date: 'OCT 24' },
  { id: 202, title: 'AI Systems Review', time: '13:30 PM', date: 'OCT 25' }
];

// --- COMPONENTS ---
const GlassModule = ({ children, onClick, isActive, noHover, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`
        transition-all duration-700 rounded-[1rem] overflow-hidden
        bg-[rgba(20,20,22,0.8)] border border-white/10 backdrop-blur-[30px] shadow-sm
        ${isActive ? 'ring-1 ring-[#DC143C]/50 bg-[#141416] shadow-md border-[#DC143C]' : ''}
        ${!noHover && 'hover:bg-[rgba(20,20,22,0.9)] hover:border-white/20 hover:-translate-y-0.5 hover:shadow-lg'}
        ${className} ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {children}
      {/* Crimson Glow Accent */}
      <div className="absolute bottom-0 right-0 w-10 h-[1px] bg-[#DC143C] shadow-[0_0_10px_#DC143C]"></div>
    </div>
  );
};

const PrecisionButton = ({ label, onClick, type }) => {
  const colors = {
    compose: "border-[#DC143C] text-[#DC143C] hover:bg-[#DC143C]/10",
    urgent: "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10",
    summarize: "border-[#94a3b8] text-[#94a3b8] hover:bg-[#94a3b8]/10",
    unread: "border-white/20 text-white/60 hover:bg-white/5",
    back: "border-white/20 text-white/40 hover:bg-white/5"
  };

  const colorClass = colors[type] || colors.unread;

  return (
    <button
      onClick={onClick}
      className={`
        w-full h-full rounded-[1rem] text-[10px] font-bold uppercase tracking-[0.2em] 
        transition-all duration-300 border bg-transparent backdrop-blur-md
        active:scale-[0.98]
        ${colorClass}
      `}
    >
      {label}
    </button>
  );
};

// --- MAIN APP ---
const ProductPage = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  });

  // Backend Integration State
  const [realEmails, setRealEmails] = useState<any[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem('iam_email_connected') === 'true';
  });

  // UI State
  const [activeView, setActiveView] = useState('inbox');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [inboxFilter, setInboxFilter] = useState('all');
  const [dockInput, setDockInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [time, setTime] = useState(new Date());

  // Settings & Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Multi-Account State
  const [accounts, setAccounts] = useState<Array<{ id: string; email: string; name: string; isActive: boolean }>>([]);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  // Compose Email State
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Backend Integration Effects
  useEffect(() => {
    const checkAccounts = async () => {
      if (!isAuthenticated) return;
      const connected = await emailService.checkEmailAccounts();
      setIsConnected(connected);
    };
    checkAccounts();
  }, [isAuthenticated]);

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

  // Load accounts
  useEffect(() => {
    const savedAccounts = localStorage.getItem('iam_accounts');
    if (savedAccounts) {
      try {
        setAccounts(JSON.parse(savedAccounts));
      } catch (e) { }
    }
  }, []);

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('iam_email_connected');
    setIsAuthenticated(false);
    setIsConnected(false);
    setRealEmails([]);
  };

  const handleAccountSwitch = (accountId: string) => {
    setAccounts(prev => prev.map(acc => ({
      ...acc,
      isActive: acc.id === accountId
    })));
    setShowAccountSwitcher(false);
    window.location.reload();
  };

  const handleGenesisComplete = () => {
    setShowOnboarding(false);
    setIsConnected(true);
    localStorage.setItem('iam_email_connected', 'true');
    window.location.reload();
  };

  // Email Sending Handler
  const handleSendEmail = async () => {
    if (recipients.length === 0) {
      alert("Please add a recipient");
      return;
    }

    if (!composeSubject.trim()) {
      alert("Please add a subject");
      return;
    }

    setIsSending(true);
    try {
      const result = await emailService.sendEmail({
        to: recipients,
        subject: composeSubject,
        body: composeBody,
      });

      if (result.success) {
        alert("Message Sent Successfully!");
        // Clear form
        setComposeSubject('');
        setComposeBody('');
        setRecipients([]);
        setActiveView('inbox');
      } else {
        alert(result.message || "Failed to send email");
      }
    } catch (error: any) {
      console.error('Send email error:', error);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Transform real emails to match UI format
  const transformedEmails = realEmails.map((e: any) => ({
    id: e.id,
    type: 'mail',
    sender: e.sender || e.senderName || 'Unknown',
    subject: e.subject || '(No Subject)',
    body: e.snippet || e.preview || e.body || '',
    time: emailService.formatEmailTime(e.timestamp),
    status: e.isRead ? 'READ' : 'UNREAD',
  }));

  const inboxData = transformedEmails.length > 0 ? transformedEmails : MOCK_INBOX;

  const filteredInbox = useMemo(() => {
    return inboxData.filter(msg => {
      if (inboxFilter === 'unread') return msg.status === 'UNREAD';
      if (inboxFilter === 'urgent') return msg.status === 'URGENT';
      return true;
    });
  }, [inboxFilter, inboxData]);

  const handleAiAction = async (promptOverride) => {
    const prompt = promptOverride || dockInput;
    if (!prompt) return;
    setIsAiThinking(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      if (!apiKey) {
        setAiResponse("Analysis complete. System optimization recommended for regional node.");
        setIsAiThinking(false);
        setDockInput('');
        return;
      }
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Task: ${prompt}. Keep it brief.` }] }] })
      });
      const data = await response.json();
      setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "Signal Processed.");
    } catch (e) {
      setAiResponse("Analysis complete. System optimization recommended for regional node.");
    } finally {
      setIsAiThinking(false);
      setDockInput('');
    }
  };

  const dockButtons = useMemo(() => {
    if (selectedItemId) return [
      { label: 'BACK', onClick: () => setSelectedItemId(null), type: 'back' },
      { label: 'REPLY', onClick: () => setActiveView('compose'), type: 'compose' },
      { label: 'FORWARD', onClick: () => { }, type: 'unread' },
      { label: 'SUMMARIZE', onClick: () => handleAiAction('Summarize message'), type: 'summarize' }
    ];

    if (activeView === 'compose') return [
      { label: 'BACK', onClick: () => setActiveView('inbox'), type: 'back' },
      { label: 'SEND', onClick: handleSendEmail, type: 'compose' },
      { label: 'DRAFT', onClick: () => { }, type: 'unread' },
      { label: 'DISCARD', onClick: () => { setComposeSubject(''); setComposeBody(''); setRecipients([]); setActiveView('inbox'); }, type: 'back' }
    ];

    return [
      { label: 'UNREAD', onClick: () => setInboxFilter(prev => prev === 'unread' ? 'all' : 'unread'), type: 'unread' },
      { label: 'URGENT', onClick: () => setInboxFilter(prev => prev === 'urgent' ? 'all' : 'urgent'), type: 'urgent' },
      { label: 'ANALYZE', onClick: () => handleAiAction('Analyze signals'), type: 'summarize' },
      { label: 'COMPOSE', onClick: () => setActiveView('compose'), type: 'compose' }
    ];
  }, [selectedItemId, inboxFilter, activeView, composeSubject, composeBody, recipients]);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0A0A0B] text-white font-sans p-8 gap-8">

      {/* 1. SIDEBAR */}
      <aside className="w-[280px] shrink-0 flex flex-col p-10 relative bg-[rgba(20,20,22,0.8)] backdrop-blur-[40px] rounded-[1rem] border border-white/10 shadow-lg">
        <div className="mb-16">
          <div className="w-12 h-12 rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-[10px] font-bold tracking-widest text-slate-600 bg-white/60">
            I.AM
          </div>
          <div className="flex gap-2 mt-4">
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-red-600 animate-pulse shadow-[0_0_8px_#ff1a1a]' : 'bg-slate-200'}`}></div>
            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          {['inbox', 'compose', 'drafts', 'sent', 'contacts', 'calendar'].map(view => (
            <button
              key={view}
              onClick={() => { setActiveView(view); setSelectedItemId(null); }}
              className={`w-full text-left px-6 py-4 rounded-[1rem] text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-500 border
                ${activeView === view
                  ? 'bg-white border-white shadow-md text-slate-900 translate-x-1'
                  : 'text-slate-400 border-transparent hover:text-slate-800 hover:bg-white/40'}
              `}
            >
              {view}
            </button>
          ))}
        </nav>

        {/* Multi-Account Switcher */}
        <div className="relative mb-4">
          <button
            onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
            className="w-full flex items-center gap-3 px-2 py-2 transition-all rounded-lg hover:bg-white/20"
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center text-[0.6rem] font-bold bg-slate-200 text-slate-800">
              {accounts.find(a => a.isActive)?.name?.charAt(0) || 'RM'}
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider truncate">
                {accounts.find(a => a.isActive)?.name || 'Rayzen Main'}
              </span>
              <span className="text-[0.55rem] font-mono truncate text-slate-400">
                {accounts.find(a => a.isActive)?.email || 'ID: 882-991'}
              </span>
            </div>
            <ChevronDown size={14} className={`transition-transform ${showAccountSwitcher ? 'rotate-180' : ''}`} />
          </button>

          {showAccountSwitcher && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border overflow-hidden shadow-2xl bg-white border-slate-200">
              <div className="px-3 py-2 border-b text-[0.55rem] font-bold uppercase tracking-widest border-slate-100 text-slate-500">
                Accounts
              </div>
              <div className="max-h-64 overflow-y-auto">
                {accounts.map(account => (
                  <button
                    key={account.id}
                    onClick={() => handleAccountSwitch(account.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 transition-colors ${account.isActive ? 'bg-red-50 text-[#DC143C]' : 'hover:bg-slate-50 text-slate-900'
                      }`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[0.5rem] font-bold ${account.isActive ? 'bg-[#DC143C] text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                      {account.name.charAt(0)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-[0.6rem] font-bold truncate">{account.name}</div>
                      <div className="text-[0.5rem] truncate text-slate-400">{account.email}</div>
                    </div>
                    {account.isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#DC143C]"></div>}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setShowAccountSwitcher(false); setShowOnboarding(true); }}
                className="w-full flex items-center gap-3 px-3 py-3 border-t transition-colors border-slate-100 hover:bg-slate-50 text-[#DC143C]"
              >
                <Plus size={14} />
                <span className="text-[0.6rem] font-bold uppercase tracking-widest">Add Account</span>
              </button>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="text-3xl font-thin tracking-tighter text-slate-900">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-[9px] uppercase tracking-[0.4em] font-black text-red-600/40 mt-2">Dubai LX Node</div>

          <div className="flex items-center justify-between mt-4">
            <button onClick={handleLogout} className="text-[0.55rem] font-bold uppercase tracking-[0.2em] py-3 px-2 transition-colors text-slate-400 hover:text-red-500">Exit System</button>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsSettingsOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-full transition-colors bg-slate-200 text-slate-600 hover:text-slate-900" title="Settings">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m5.196-15.804L13.464 6.93m-2.828 2.828-3.732-3.732M23 12h-6m-6 0H1m15.804 5.196-3.732-3.732m-2.828-2.828-3.732 3.732"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-12 bottom-12 w-[1px] bg-red-500/40 rounded-full"></div>
      </aside>

      {/* 2. CENTER WORKSPACE */}
      <main className="w-[640px] shrink-0 flex flex-col gap-8">

        <section className="h-[70%] flex flex-col min-h-0">
          <div className="flex justify-between items-end mb-8 px-4">
            <h2 className="text-4xl font-extralight tracking-tighter capitalize text-slate-800">
              {activeView} <span className="text-red-600 font-black text-[10px] align-top">LX</span>
            </h2>
            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400/60">
              {isLoadingEmails ? 'Syncing...' : 'Premium Access'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
            {activeView === 'inbox' && !selectedItemId && filteredInbox.map(item => (
              <GlassModule key={item.id} onClick={() => setSelectedItemId(item.id)}>
                <div className="p-8 relative group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-600">From: {item.sender}</span>
                    <span className="text-[9px] font-mono text-slate-400">{item.time}</span>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight mb-2 text-slate-800 group-hover:text-red-600 transition-colors">{item.subject}</h3>
                  <p className="text-sm font-light text-slate-500 leading-relaxed truncate">{item.body}</p>
                </div>
              </GlassModule>
            ))}

            {selectedItemId && (
              <GlassModule noHover className="h-full flex flex-col">
                <div className="p-6 border-b border-white/40 flex justify-between items-center bg-white/20">
                  <button onClick={() => setSelectedItemId(null)} className="text-[9px] text-red-600 font-bold tracking-widest px-4 py-2 border border-red-200 rounded-[1rem] hover:bg-white transition-all">← RETURN</button>
                  <span className="text-[9px] font-mono text-slate-400">SIGNAL_{selectedItemId}</span>
                </div>
                <div className="p-12 space-y-8 flex-1">
                  <div className="text-[9px] font-bold text-red-600 uppercase tracking-[0.4em]">Decrypted Content</div>
                  <div className="text-2xl font-extralight leading-relaxed text-slate-800">
                    {inboxData.find(m => m.id === selectedItemId)?.body}
                  </div>
                </div>
              </GlassModule>
            )}

            {activeView === 'compose' && (
              <div className="space-y-6 h-full flex flex-col">
                <GlassModule noHover className="p-8">
                  <input
                    type="email"
                    placeholder="TO: recipient@example.com"
                    value={recipients.join(', ')}
                    onChange={(e) => setRecipients(e.target.value.split(',').map(r => r.trim()).filter(Boolean))}
                    className="w-full bg-transparent text-base font-light outline-none text-slate-900 placeholder:text-slate-300"
                  />
                </GlassModule>
                <GlassModule noHover className="p-8">
                  <input
                    type="text"
                    placeholder="SUBJECT"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="w-full bg-transparent text-2xl font-light outline-none text-slate-900 placeholder:text-slate-300"
                  />
                </GlassModule>
                <GlassModule noHover className="flex-1 p-10">
                  <textarea
                    placeholder="Begin encoding..."
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    className="w-full h-full bg-transparent outline-none resize-none text-base font-light leading-loose text-slate-700 placeholder:text-slate-300"
                  ></textarea>
                </GlassModule>
              </div>
            )}
          </div>
        </section>

        {/* 3. DOCK */}
        <section className="h-[30%] flex flex-col">
          <GlassModule noHover className="h-full flex flex-col">
            <div className="grid grid-cols-4 gap-2 p-2 border-b border-white/40">
              {dockButtons.map((btn, i) => (
                <div key={i} className="h-12">
                  <PrecisionButton {...btn} />
                </div>
              ))}
            </div>

            <div className="flex-1 relative p-8 flex items-center">
              {aiResponse && (
                <div className="absolute inset-0 z-20 p-10 backdrop-blur-[60px] overflow-y-auto bg-white/95 border-t border-slate-100 shadow-2xl">
                  <div className="flex justify-between mb-4">
                    <span className="text-[9px] font-bold text-red-600 tracking-widest uppercase">AI Insights</span>
                    <button onClick={() => setAiResponse('')} className="text-xs p-2 hover:text-red-600">✕</button>
                  </div>
                  <div className="text-xs font-mono leading-relaxed text-slate-600">{aiResponse}</div>
                </div>
              )}
              <div className={`w-2 h-2 rounded-full mr-6 ${isAiThinking ? 'bg-red-600 animate-ping' : 'bg-slate-300'}`}></div>
              <input
                value={dockInput}
                onChange={e => setDockInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAiAction()}
                placeholder={isAiThinking ? "SYNCHRONIZING..." : "ENTER COMMAND..."}
                className="flex-1 bg-transparent outline-none text-[10px] font-mono tracking-[0.3em] text-slate-800 placeholder:text-slate-300 font-bold"
              />
            </div>
          </GlassModule>
        </section>
      </main>

      {/* 4. RIGHT COLUMN */}
      <aside className="flex-1 flex flex-col gap-8">
        <GlassModule noHover className="h-1/2 p-10 flex flex-col">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400/60 mb-10">Recent Signals</h3>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
            {inboxData.slice(0, 5).map(item => (
              <div key={item.id} className="group cursor-pointer border-b border-slate-100 pb-6 last:border-0 hover:border-red-600/10 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-bold text-red-600 opacity-40 group-hover:opacity-100 uppercase tracking-widest">{item.sender.split(' ')[0]}</span>
                  <span className="text-[9px] font-mono text-slate-400">{item.time}</span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 group-hover:text-slate-900 transition-colors truncate">
                  {item.subject}
                </p>
              </div>
            ))}
          </div>
        </GlassModule>

        <div className="h-1/2 flex flex-col gap-8">
          <GlassModule noHover className="p-8">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400/60 mb-6">Nodes</h3>
            <div className="flex flex-wrap gap-2">
              {MOCK_CONTACTS.map(c => (
                <div key={c.id} className="px-4 py-2 rounded-[1rem] border border-slate-200 bg-white/60 shadow-sm text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:border-red-600 hover:text-red-600 transition-all cursor-pointer">
                  {c.name}
                </div>
              ))}
            </div>
          </GlassModule>

          <GlassModule noHover className="p-8 flex-1">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400/60 mb-6">Schedule</h3>
            <div className="space-y-6">
              {MOCK_EVENTS.map(e => (
                <div key={e.id} className="p-5 rounded-[1rem] border-l-2 border-red-600 bg-white/40 hover:bg-white/60 transition-all">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-800">{e.title}</div>
                  <div className="text-[9px] mt-1 font-mono uppercase text-slate-400 font-bold">{e.date} // {e.time}</div>
                </div>
              ))}
            </div>
          </GlassModule>
        </div>
      </aside>

      {/* Modals */}
      <NexusSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        themeMode={themeMode}
        onThemeModeChange={setThemeMode}
      />

      {showOnboarding && (
        <OnboardingFlow
          onComplete={handleGenesisComplete}
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {/* Hub FAB */}
      {!isHubOpen && (
        <button
          onClick={() => setIsHubOpen(true)}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group bg-slate-900 text-white shadow-slate-900/30 hover:bg-black"
          title="Open @hub AI Assistant"
        >
          <Bot size={24} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}

      <Hub
        isOpen={isHubOpen}
        onClose={() => setIsHubOpen(false)}
        isDark={false}
        context={{
          currentScreen: (selectedItemId ? 'email-detail' : activeView) as HubScreen,
          selectedEmailId: selectedItemId ? String(selectedItemId) : undefined,
        }}
        onComposeEmail={() => { setActiveView('compose'); setIsHubOpen(false); }}
        onReplyEmail={() => { setActiveView('compose'); setIsHubOpen(false); }}
        onForwardEmail={() => { setActiveView('compose'); setIsHubOpen(false); }}
        onSummarizeEmail={() => { handleAiAction('Summarize this email'); setIsHubOpen(false); }}
        onArchiveEmail={() => { setSelectedItemId(null); setIsHubOpen(false); }}
        onOpenSettings={() => { setIsSettingsOpen(true); setIsHubOpen(false); }}
        onThemeToggle={() => { }}
      />
    </div>
  );
};

// Authentication Wrapper
const AppWithAuth: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  });

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleAuthenticated} />;
  }

  return <ProductPage />;
};

export default AppWithAuth;