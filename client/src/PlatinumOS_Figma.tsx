import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- AI CONFIG ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

// --- COMPONENTS ---

const BrickBar: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
  darkMode: boolean;
}> = ({ label, active, onClick, darkMode }) => (
  <div onClick={onClick} className={`
    relative w-full h-12 flex items-center justify-between px-5 mb-2 cursor-pointer transition-all duration-200
    rounded-md shrink-0 select-none overflow-hidden group
    ${active 
      ? (darkMode 
          ? 'bg-[#1A1A1A] text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
          : 'bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.05)]') 
      : (darkMode 
          ? 'bg-[#0F0F0F] text-neutral-500 hover:bg-[#141414] hover:text-neutral-300' 
          : 'bg-[#F4F4F5] text-neutral-400 hover:bg-[#EDEDEF] hover:text-neutral-600')
    }
  `}>
    <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 ${active ? 'bg-red-600' : 'bg-transparent group-hover:bg-red-600/30'}`}></div>
    <span className={`text-[10px] font-bold uppercase tracking-[0.25em] z-10 ${active ? 'opacity-100' : 'opacity-80'}`}>
      {label}
    </span>
    {active && (
       <div className="w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-red-600 transform rotate-45 mr-1"></div>
    )}
  </div>
);

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
    {active && <div className="absolute top-1 right-1 w-1 h-1 bg-red-600 rounded-full"></div>}
  </button>
);

const DockButton: React.FC<{
    label: string;
    onClick: () => void;
    darkMode: boolean;
    urgent?: boolean;
}> = ({ label, onClick, darkMode, urgent }) => (
    <button 
        onClick={onClick}
        className={`
            h-10 flex-1 rounded-md flex items-center justify-center text-[9px] font-bold uppercase tracking-widest border transition-all active:scale-95
            ${urgent 
                ? (darkMode ? 'bg-red-900/20 text-red-500 border-red-900/50 hover:bg-red-900/40' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100')
                : (darkMode ? 'bg-[#151515] text-neutral-300 border-white/10 hover:bg-[#222]' : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50')
            }
        `}
    >
        {label}
    </button>
);

const CalendarWidget: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const today = new Date().getDate();
    
    return (
        <div className="flex flex-col h-full">
             <h3 className={`text-xs font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>October 2024</h3>
             
             {/* Simple Calendar Grid */}
             <div className="grid grid-cols-7 gap-2 mb-8">
                {['S','M','T','W','T','F','S'].map((d,i) => (
                    <div key={i} className="text-[9px] font-bold text-center opacity-30">{d}</div>
                ))}
                {days.map(d => (
                    <div key={d} className={`
                        h-6 flex items-center justify-center text-[10px] rounded-full
                        ${d === today 
                            ? 'bg-red-600 text-white font-bold' 
                            : (d === 24 || d === 25) ? (darkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-black')
                            : 'opacity-40'}
                    `}>
                        {d}
                    </div>
                ))}
             </div>

             <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Upcoming</h3>
             <div className="space-y-3">
                 {MOCK_EVENTS.map(ev => (
                     <div key={ev.id} className={`p-3 rounded-md border ${darkMode ? 'border-white/5 bg-white/5' : 'border-neutral-200 bg-white'}`}>
                         <div className="flex justify-between items-center mb-1">
                             <span className="text-[9px] font-bold text-red-600 uppercase">{ev.time}</span>
                         </div>
                         <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{ev.title}</div>
                         <div className="text-[9px] opacity-50 mt-1">{ev.loc}</div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

// --- MAIN APP ---
export default function ProductPage() {
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

  // Persistent Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('im_mail_theme') === 'dark';
    return false; 
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('im_mail_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // AI Action
  const handleAiAction = async () => {
    if (!dockInput) return;
    setIsAiThinking(true);
    setAiResponse(''); 
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
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

  const handleNav = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    // Reset selections when changing main module
    setSelectedMailId(null);
    setSelectedContactId(null);
    setComposeMode(null);
  };

  // --- CONTEXT DETECTION LOGIC ---
  const getDockContext = () => {
      // 0. Home Screen Context (Mobile Menu Open OR Desktop Default Inbox)
      // When on Inbox list with no selection, we show the 3C's as requested for "Home Screen"
      if (mobileMenuOpen) return ['COMPOSE', 'CALENDAR', 'CONTACTS'];
      
      // 1. Compose Mode
      if (composeMode === 'new') return ['CONTACTS', 'RECIPIENT', 'DRAFT', 'SEND'];
      if (composeMode === 'reply') return ['RECIPIENT', 'FORMAL', 'FRIENDLY', 'SEND'];

      // 2. Inbox Context
      if (activeView === 'inbox') {
          if (selectedMailId) return ['BACK', 'REPLY', 'FORWARD', 'TASKS'];
          // HOME DOCK STATE (Inbox List) -> 3C's
          return ['COMPOSE', 'CALENDAR', 'CONTACTS'];
      }

      // 3. Contacts Context
      if (activeView === 'contacts') {
          if (selectedContactId) return ['EMAIL', 'CALL', 'WHATSAPP', 'EDIT'];
          return ['SEARCH', 'EMAIL', 'NEW CONTACT', 'BACK'];
      }

      // 4. Calendar Context
      if (activeView === 'calendar') {
           return ['TODAY', 'NEW EVENT', 'SCHEDULE', 'BACK'];
      }
      
      // 5. Settings
      if (activeView === 'settings') {
          return ['SEARCH', 'TOGGLE', 'EXPLAIN', 'BACK'];
      }

      // Default
      return ['COMPOSE', 'CALENDAR', 'CONTACTS'];
  };

  const dockButtons = getDockContext();

  const handleDockAction = (action: string) => {
      // Global Back/Home logic
      if (action === 'BACK' || action === 'HOME') {
          if (selectedMailId) setSelectedMailId(null);
          else if (selectedContactId) setSelectedContactId(null);
          else if (composeMode) setComposeMode(null);
          else setMobileMenuOpen(true);
          return;
      }
      
      // Home Screen Actions
      if (action === 'COMPOSE') {
          setMobileMenuOpen(false); // Go to main view
          setComposeMode('new');
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

      // Inbox/Compose Actions
      if (action === 'REPLY') {
          setComposeMode('reply');
          return;
      }

      // Simulate generic action
      setDockInput(`Action: ${action}`);
      setTimeout(() => handleAiAction(), 500);
  };

  const MODULES = [
    { cat: 'CORE', items: ['Inbox', 'Drafts', 'Sent', 'Archive', 'Trash', 'Spam'] },
    { cat: 'PEOPLE', items: ['Contacts', 'Groups'] },
    { cat: 'PLANNING', items: ['Calendar', 'Tasks', 'Notes'] },
    { cat: 'TOOLS', items: ['Compose', 'Search', 'Filters'] },
    { cat: 'SYSTEM', items: ['Settings', 'Storage', 'Security'] }
  ];

  return (
    <div className={`h-screen w-full flex overflow-hidden font-sans relative transition-colors duration-500
        ${darkMode ? 'bg-[#050505] text-white' : 'bg-[#FAFAFA] text-black'}
    `}>
      
      {/* 1. SIDEBAR (NAVIGATION) */}
      <aside className={`
            fixed inset-0 z-50 w-full flex flex-col
            md:relative md:w-[320px] md:inset-auto md:translate-x-0
            transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            ${darkMode ? 'bg-[#050505]' : 'bg-[#FAFAFA]'}
            md:border-r ${darkMode ? 'border-white/5' : 'border-black/5'}
      `}>
        {/* Header */}
        <div className={`px-5 py-6 shrink-0 z-20 flex flex-col gap-4 ${darkMode ? 'bg-[#050505]/95' : 'bg-[#FAFAFA]/95'} backdrop-blur-md`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-red-600 font-black text-sm tracking-tighter">i.AM</span>
                    <div className={`h-3 w-[1px] ${darkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>
                    <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${darkMode ? 'text-white/40' : 'text-neutral-400'}`}>Platinum OS</span>
                </div>
                <div className="flex items-center gap-4">
                     <span className={`text-xs font-mono opacity-50 ${darkMode ? 'text-white' : 'text-black'}`}>
                        {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <button onClick={() => setDarkMode(!darkMode)} className={`w-5 h-5 rounded-full border flex items-center justify-center ${darkMode ? 'border-white/20' : 'border-black/10'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white' : 'bg-black'}`}></div>
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {MOCK_ACCOUNTS.map(acc => (
                    <AccountChip key={acc.id} initials={acc.initials} active={activeAccountId === acc.id} onClick={() => setActiveAccountId(acc.id)} darkMode={darkMode} />
                ))}
                <button className={`h-8 w-8 rounded-md border border-dashed flex items-center justify-center shrink-0 ${darkMode ? 'border-white/10 text-white/30' : 'border-black/10 text-black/30'}`}>
                    <span className="text-xs">+</span>
                </button>
            </div>
        </div>

        {/* Module List */}
        <div className="flex-1 overflow-y-auto px-5 pb-52 space-y-6 no-scrollbar mask-image-b">
            {MODULES.map((section, i) => (
                <div key={i} className="animate-in slide-in-from-bottom-4 fade-in duration-500" style={{animationDelay: `${i * 50}ms`}}>
                    <div className="mb-2 pl-1 flex items-center gap-2 opacity-50">
                         <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>{section.cat}</span>
                    </div>
                    <div>
                        {section.items.map(item => (
                            <BrickBar key={item} label={item} active={activeView === item.toLowerCase()} onClick={() => handleNav(item.toLowerCase())} darkMode={darkMode} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA (CENTER + RIGHT WIDGET) */}
      <main className={`
        relative flex-1 flex transition-transform duration-500
        ${mobileMenuOpen ? 'translate-x-full md:translate-x-0' : 'translate-x-0'}
      `}>
          
          {/* CENTER COLUMN: LIST/CONTENT */}
          <div className="flex-1 flex flex-col h-full relative z-10">
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar pb-48">
                  
                  {/* Back Nav (Mobile) */}
                  {!mobileMenuOpen && (
                      <div className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-neutral-500/10">
                        <button onClick={() => handleDockAction('BACK')} className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="text-red-600">←</span> Back
                        </button>
                        <span className="text-[9px] font-black tracking-widest opacity-30">{activeView.toUpperCase()}</span>
                      </div>
                  )}

                  {/* VIEW: INBOX */}
                  {activeView === 'inbox' && !selectedMailId && !composeMode && (
                      <div className="space-y-3 max-w-2xl mx-auto">
                          <h2 className={`text-3xl font-light tracking-tight mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>Inbox</h2>
                          {MOCK_INBOX.map(mail => (
                             <div key={mail.id} onClick={() => setSelectedMailId(mail.id)} className={`
                                p-5 rounded-lg border transition-all active:scale-[0.98] cursor-pointer
                                ${darkMode ? 'bg-[#111] border-white/5 hover:border-white/10' : 'bg-white border-neutral-100 hover:border-neutral-200'}
                             `}>
                                 <div className="flex justify-between items-start mb-2">
                                     <span className={`text-[9px] font-bold uppercase tracking-widest ${mail.status === 'URGENT' ? 'text-red-600' : 'text-neutral-500'}`}>{mail.sender}</span>
                                     <span className="text-[9px] font-mono opacity-40">{mail.time}</span>
                                 </div>
                                 <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>{mail.subject}</h3>
                                 <p className="text-xs opacity-60 truncate">{mail.body}</p>
                             </div>
                         ))}
                      </div>
                  )}

                  {/* VIEW: INBOX READING */}
                  {activeView === 'inbox' && selectedMailId && !composeMode && (
                      <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                          {MOCK_INBOX.filter(m => m.id === selectedMailId).map(mail => (
                              <div key={mail.id}>
                                  <div className="flex justify-between items-start mb-6">
                                      <h1 className="text-xl font-medium leading-tight">{mail.subject}</h1>
                                      <span className="text-[10px] font-mono opacity-50 shrink-0 ml-4">{mail.time}</span>
                                  </div>
                                  <div className="flex items-center gap-3 mb-8 pb-8 border-b border-neutral-500/10">
                                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">{mail.sender.charAt(0)}</div>
                                      <div>
                                          <div className="text-xs font-bold uppercase tracking-wide">{mail.sender}</div>
                                          <div className="text-[10px] opacity-50">to me</div>
                                      </div>
                                  </div>
                                  <div className="text-sm leading-7 opacity-80 whitespace-pre-wrap">{mail.body}</div>
                                  <div className="mt-8 text-xs opacity-40 italic">--<br/>Sent via i.AM Secure Relay</div>
                              </div>
                          ))}
                      </div>
                  )}

                  {/* VIEW: COMPOSE */}
                  {composeMode && (
                      <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-300">
                          <h2 className="text-2xl font-light mb-6">{composeMode === 'new' ? 'New Message' : 'Reply'}</h2>
                          <div className={`p-6 rounded-xl border space-y-4 ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
                              <div className="border-b border-neutral-500/10 pb-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 w-12 inline-block">To</span>
                                  <span className="text-sm"> Julian Sterling;</span>
                              </div>
                              <div className="border-b border-neutral-500/10 pb-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 w-12 inline-block">Subj</span>
                                  <span className="text-sm">{composeMode === 'reply' ? 'Re: Q4 Targets' : ''}</span>
                              </div>
                              <textarea className="w-full bg-transparent h-48 outline-none text-sm resize-none pt-2" placeholder="Start typing..."></textarea>
                          </div>
                      </div>
                  )}

                  {/* VIEW: CONTACTS */}
                  {activeView === 'contacts' && !selectedContactId && (
                       <div className="max-w-2xl mx-auto">
                            <h2 className={`text-3xl font-light tracking-tight mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>Contacts</h2>
                            <div className="grid grid-cols-1 gap-3">
                                {MOCK_CONTACTS.map(contact => (
                                    <div key={contact.id} onClick={() => setSelectedContactId(contact.id)} className={`p-4 rounded-lg border flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
                                        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">{contact.name.charAt(0)}</div>
                                        <div>
                                            <div className="text-sm font-bold">{contact.name}</div>
                                            <div className="text-[10px] uppercase tracking-widest opacity-50">{contact.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                       </div>
                   )}
                   
                   {/* VIEW: CONTACT DETAIL */}
                   {activeView === 'contacts' && selectedContactId && (
                       <div className="max-w-2xl mx-auto flex flex-col items-center pt-10">
                            {MOCK_CONTACTS.filter(c => c.id === selectedContactId).map(c => (
                                <div key={c.id} className="text-center w-full">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-900 mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-red-900/50">
                                        {c.name.charAt(0)}
                                    </div>
                                    <h2 className="text-2xl font-bold mb-1">{c.name}</h2>
                                    <div className="text-xs uppercase tracking-[0.2em] opacity-50 mb-8">{c.role}</div>
                                    
                                    <div className={`p-6 rounded-xl border text-left space-y-4 ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
                                        <div>
                                            <div className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Email</div>
                                            <div className="text-sm">{c.email}</div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Phone</div>
                                            <div className="text-sm">+971 55 123 4567</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                       </div>
                   )}
                   
                   {/* VIEW: CALENDAR */}
                   {activeView === 'calendar' && (
                       <div className="max-w-2xl mx-auto">
                            <h2 className={`text-3xl font-light tracking-tight mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>Calendar</h2>
                            <div className="space-y-4">
                                {[1,2,3].map(i => (
                                    <div key={i} className={`p-4 rounded-lg border flex gap-4 ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
                                        <div className="flex flex-col items-center justify-center w-12 border-r border-neutral-500/10 pr-4">
                                            <span className="text-[10px] font-bold uppercase text-red-600">Oct</span>
                                            <span className="text-xl font-light">2{3+i}</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">Strategy Review</div>
                                            <div className="text-[10px] opacity-50">10:00 AM - 11:30 AM • Room 404</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                       </div>
                   )}
              </div>
          </div>

          {/* RIGHT COLUMN: CALENDAR WIDGET (DESKTOP ONLY) */}
          <div className={`hidden xl:flex w-[320px] p-6 flex-col border-l ${darkMode ? 'border-white/5 bg-[#050505]' : 'border-black/5 bg-[#FAFAFA]'}`}>
                <CalendarWidget darkMode={darkMode} />
          </div>

      </main>

      {/* GLOBAL DOCK CONTAINER (FIXED BOTTOM CENTERED) */}
      <div className={`fixed bottom-0 left-0 right-0 p-5 z-[60] flex flex-col items-center justify-end pointer-events-none`}>
         {/* Gradient Mask for bottom fade */}
         <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${darkMode ? 'from-[#050505] via-[#050505]/95 to-transparent' : 'from-[#FAFAFA] via-[#FAFAFA]/95 to-transparent'}`}></div>
         
         <div className="relative z-10 w-full max-w-2xl flex flex-col gap-3 pointer-events-auto">
             {/* AI Toast Response */}
             {aiResponse && (
                <div className={`p-3 rounded-md border backdrop-blur-md shadow-xl text-[10px] animate-in slide-in-from-bottom-5 ${darkMode ? 'bg-[#1A1A1A] border-red-600/30 text-white' : 'bg-white border-red-600/20 text-black'}`}>
                    <span className="font-bold text-red-600 mr-2">●</span> {aiResponse}
                </div>
             )}

             {/* ROW 1: CONTEXT BUTTONS (THE 4-SET) */}
             <div className="flex gap-2">
                 {dockButtons.map((btnLabel, idx) => (
                     <DockButton 
                        key={idx} 
                        label={btnLabel} 
                        onClick={() => handleDockAction(btnLabel)} 
                        darkMode={darkMode}
                        urgent={btnLabel === 'URGENT' || btnLabel === 'DELETE'}
                     />
                 ))}
             </div>

             {/* ROW 2: AI INPUT (ALWAYS AVAILABLE) */}
             <div className={`
                w-full h-12 rounded-lg flex items-center gap-3 px-2 shadow-2xl border
                ${darkMode ? 'bg-[#151515] border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]' : 'bg-white border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)]'}
             `}>
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full ml-3 shrink-0 animate-pulse"></div>
                <input 
                    value={dockInput}
                    onChange={(e) => setDockInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiAction()}
                    placeholder={isAiThinking ? "Processing..." : "Ask AI or Enter Command..."}
                    className={`flex-1 bg-transparent h-full outline-none text-[11px] font-medium placeholder:text-neutral-400 ${darkMode ? 'text-white' : 'text-black'}`}
                />
                <button onClick={handleAiAction} className={`h-8 px-3 rounded-md text-[9px] font-bold tracking-widest uppercase transition-colors border ${darkMode ? 'bg-[#222] border-white/5 text-white' : 'bg-neutral-100 border-neutral-200 text-neutral-600'}`}>
                    RET
                </button>
             </div>
         </div>
      </div>

    </div>
  );
}