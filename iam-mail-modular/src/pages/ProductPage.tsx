import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GlassModule, GlassHeader, GlassBody, DockAction } from '../components/Glass';
import { VirtualList } from '../components/VirtualList';
import { SendQueueItem, SendStatus } from '../types';
import { MOCK_INBOX, MOCK_CONTACTS, MOCK_EVENTS } from '../lib/mockMail';

// --- SYSTEM INTERFACES ---
interface SystemItem {
  id: string | number;
  type: string;
  sender?: string;
  subject?: string;
  time?: string;
  status?: string;
  body?: string;
  name?: string;
  role?: string;
  email?: string;
  title?: string;
  date?: string;
  location?: string;
  label?: string;
  value?: string;
}

interface MessageThreadItem extends SystemItem {
    index: number;
    total: number;
    isMe?: boolean;
    attachments?: { name: string; size: string }[];
}

// --- AI INTEGRATION ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- HELPER: MOCK THREAD GENERATOR ---
const generateThread = (rootItem: SystemItem): MessageThreadItem[] => {
    if (rootItem.type !== 'mail') return [{ ...rootItem, index: 1, total: 1 } as MessageThreadItem];

    return [
        {
            ...rootItem,
            id: `${rootItem.id}-1`,
            index: 1,
            total: 3,
            body: rootItem.body + "\n\nAttached are the preliminary scan results from the sector 7 nodes. Please advise on next steps.",
            attachments: [{ name: 'scan_log.dat', size: '2.4MB' }]
        },
        {
            ...rootItem,
            id: `${rootItem.id}-2`,
            index: 2,
            total: 3,
            sender: 'Me',
            time: '11:05 AM',
            isMe: true,
            body: "Received. I am initiating a Level 2 diagnostic based on these logs. Will report back shortly.",
        },
        {
            ...rootItem,
            id: `${rootItem.id}-3`,
            index: 3,
            total: 3,
            time: '11:20 AM',
            body: "Understood. Keep the channel open for real-time telemetry updates.",
        }
    ] as MessageThreadItem[];
};

// --- MAIN COMPONENT ---
interface ProductPageProps {
  productId: string;
  onBack: () => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ productId, onBack }) => {
  // VIEW STATE
  const [activeView, setActiveView] = useState<'inbox' | 'drafts' | 'sent' | 'calendar' | 'contacts' | 'settings' | 'compose'>('inbox');
  const [selectedItemId, setSelectedItemId] = useState<string | number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // CONTEXTUAL FILTER STATE
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  
  // THREAD STATE
  const [currentThread, setCurrentThread] = useState<MessageThreadItem[]>([]);
  const [threadIndex, setThreadIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'up' | 'down'>('up');
  
  // SEND QUEUE STATE
  const [sendQueue, setSendQueue] = useState<SendQueueItem[]>([]);
  const [now, setNow] = useState(Date.now()); // For countdown

  // AI & INPUT STATE
  const [dockInput, setDockInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // SETTINGS MOCK
  const settingsItems = [
    { id: 'profile', type: 'setting', label: 'Identity & Profile', value: 'Active' },
    { id: 'notifs', type: 'setting', label: 'Neural Alerts', value: 'Enabled' },
    { id: 'security', type: 'setting', label: 'Encryption Keys', value: 'Rotated 2d ago' },
  ];

  // LOGIC
  const handleViewChange = (view: typeof activeView) => {
    setActiveView(view);
    setSelectedItemId(null);
    setIsSidebarOpen(false);
    setInboxFilter('all');
    setDockInput('');
    setAiResponse('');
  };

  const handleItemSelect = (id: string | number) => {
    const allItems: SystemItem[] = [...MOCK_INBOX, ...MOCK_CONTACTS, ...MOCK_EVENTS, ...settingsItems];
    const item = allItems.find(i => i.id === id);
    if (item) {
        const thread = generateThread(item);
        setCurrentThread(thread);
        setThreadIndex(thread.length - 1);
        setSelectedItemId(id);
    }
  };

  const handleAiAction = async (promptOverride?: string) => {
    const prompt = promptOverride || dockInput;
    if (!prompt.trim()) return;
    
    setIsAiThinking(true);
    setAiResponse('');
    
    try {
        const result = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ role: 'user', parts: [{ text: `Act as a minimalist business AI. Context: ${activeView}. Task: ${prompt}. Keep it brief.` }] }]
        });
        setAiResponse(result.text || "Command executed.");
    } catch (e) {
        setAiResponse("System offline.");
    } finally {
        setIsAiThinking(false);
    }
  };

  // --- SEND QUEUE LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
        setNow(Date.now());
        setSendQueue(prev => prev.map(item => {
            if (item.status === 'pending' && Date.now() >= item.sendAt) {
                // Mock failure randomly for demo, else sent
                const isFailure = item.body.includes('fail');
                return { 
                    ...item, 
                    status: isFailure ? 'failed' : 'sent',
                    error: isFailure ? 'Network Interruption' : undefined
                } as SendQueueItem;
            }
            return item;
        }));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handleSend = () => {
      const newItem: SendQueueItem = {
          id: Date.now().toString(),
          to: 'Sarah Connor', // Mock
          subject: 'Draft Message', // Mock
          body: dockInput || 'Attachment Only',
          createdAt: Date.now(),
          sendAt: Date.now() + 5000, // 5s Undo window
          status: 'pending'
      };
      setSendQueue(prev => [...prev, newItem]);
      setDockInput('');
      handleViewChange('inbox');
  };

  const handleUndo = () => {
      setSendQueue(prev => {
          const pending = prev.filter(i => i.status === 'pending');
          const last = pending[pending.length - 1];
          if (last) {
              return prev.filter(i => i.id !== last.id);
          }
          return prev;
      });
  };

  const handleClearErrors = () => {
      setSendQueue(prev => prev.filter(i => i.status !== 'failed'));
  };

  // --- DOCK ACTIONS ---
  const focusInput = () => {
      inputRef.current?.focus();
  };

  const toggleFilter = (mode: 'unread' | 'urgent') => {
      setInboxFilter(prev => prev === mode ? 'all' : mode);
  };

  // --- GESTURE LOGIC (Thread) ---
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientY);
  };
  const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      if (distance > 50 && threadIndex < currentThread.length - 1) {
          setSlideDirection('up'); setThreadIndex(prev => prev + 1);
      }
      if (distance < -50 && threadIndex > 0) {
          setSlideDirection('down'); setThreadIndex(prev => prev - 1);
      }
  };

  if (productId !== 'MAIL') return null;

  // --- RENDERERS ---

  // 1. SIDEBAR (Desktop / Mobile Overlay)
  const renderSidebar = () => (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
        <div className="p-4 flex items-center gap-4 bg-white/40 backdrop-blur-md rounded-xl border border-white/50 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-bold">RM</div>
            <div className="flex flex-col">
                <span className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-900">Rayzen Main</span>
                <span className="text-[0.55rem] text-slate-500 font-mono tracking-wider">ID: 882-991</span>
            </div>
        </div>
        <div className="flex-1 py-4">
            <div className="px-4 mb-2 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-slate-400">Modules</div>
            {['inbox', 'calendar', 'contacts'].map((id) => (
                 <button key={id} onClick={() => handleViewChange(id as any)} className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left ${activeView === id ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:bg-white/50'}`}>
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.15em]">{id}</span>
                 </button>
            ))}
        </div>
        <button onClick={onBack} className="text-center text-[0.5rem] uppercase tracking-widest text-slate-400">Exit System</button>
    </div>
  );

  // 2. QUEUE RENDERER (Smart Filtered with VirtualList)
  const renderQueue = () => {
      let items: any[] = [];
      if (activeView === 'inbox') {
          items = MOCK_INBOX.filter(msg => {
              if (inboxFilter === 'unread') return msg.status === 'UNREAD';
              if (inboxFilter === 'urgent') return msg.status === 'URGENT';
              if (dockInput && !selectedItemId) { // Search Filter
                   return msg.subject?.toLowerCase().includes(dockInput.toLowerCase()) || msg.sender?.toLowerCase().includes(dockInput.toLowerCase());
              }
              return true;
          });
      }
      else if (activeView === 'contacts') items = MOCK_CONTACTS;
      else if (activeView === 'calendar') items = MOCK_EVENTS;

      return (
        <div className="flex flex-col h-full gap-2 pt-4 lg:pt-0">
             {/* HEADLESS HEADER (Fixed) */}
             <div className="flex items-center justify-between px-2 shrink-0">
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-1 text-slate-400 hover:text-slate-900">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-slate-500">{activeView}</span>
                </div>
                <span className="text-[0.55rem] font-mono text-slate-400 bg-white/50 px-2 py-0.5 rounded border border-white/50">{items.length} NODES</span>
             </div>

             {/* VIRTUAL LIST */}
             <div className="flex-1 min-h-0 pr-1">
                 {items.length > 0 ? (
                    <VirtualList 
                        items={items} 
                        selectedItemId={selectedItemId} 
                        onSelect={handleItemSelect}
                        itemSize={140}
                        paddingBottom={160} // Bottom padding for dock clearance
                    />
                 ) : (
                    <div className="text-center text-[0.6rem] text-slate-400 mt-10">NO DATA FOUND</div>
                 )}
             </div>
        </div>
      );
  };

  // 3. WORKSPACE (Detail View + Widgets)
  const renderWorkspace = () => {
    // A. COMPOSE VIEW
    if (activeView === 'compose') {
        return (
            <div className="flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar p-1 pb-40 lg:pb-0 pt-4 lg:pt-0">
                <GlassModule noHover className="shadow-lg">
                    <GlassHeader label="Target" />
                    <GlassBody><input type="text" placeholder="RECIPIENT_ID..." className="w-full bg-transparent text-sm font-mono text-indigo-600 outline-none placeholder:text-slate-300" autoFocus /></GlassBody>
                </GlassModule>
                <GlassModule noHover className="flex-1 flex flex-col shadow-lg">
                    <GlassHeader label="Payload" />
                    <div className="border-b border-slate-100 p-6">
                        <input type="text" placeholder="SUBJECT //" className="w-full bg-transparent text-2xl font-thin text-slate-900 outline-none placeholder:text-slate-200 tracking-tight" />
                    </div>
                    <GlassBody className="flex-1 flex flex-col">
                        <textarea 
                            value={dockInput} 
                            onChange={e => setDockInput(e.target.value)} 
                            className="w-full flex-1 bg-transparent text-sm text-slate-700 outline-none resize-none leading-relaxed font-light" 
                            placeholder="Drafting area linked to Dock..."
                        />
                    </GlassBody>
                </GlassModule>
            </div>
        );
    }

    // B. THREAD VIEW + WIDGETS
    if (selectedItemId && currentThread.length > 0) {
        const msg = currentThread[threadIndex];
        return (
            <div className="flex h-full gap-4 pb-40 lg:pb-0 pt-4 lg:pt-0">
                {/* READING PANE */}
                <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden relative" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                    <GlassModule noHover className="shadow-lg shrink-0 z-20">
                        <div className="flex items-center justify-between p-4 bg-white/50">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="flex flex-col min-w-0">
                                    <h1 className="text-sm font-bold uppercase tracking-wide text-slate-900 truncate">{msg.subject}</h1>
                                    <span className="text-[0.55rem] font-mono text-slate-400 tracking-wider">ID: {String(msg.id).slice(-4)} // THREAD</span>
                                </div>
                            </div>
                            <span className="text-[0.55rem] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded">MSG {threadIndex + 1} / {currentThread.length}</span>
                        </div>
                    </GlassModule>

                    <div className={`flex-1 flex flex-col min-h-0 ${slideDirection === 'up' ? 'animate-slide-up' : 'animate-slide-down'}`}>
                        <GlassModule noHover className="flex-1 shadow-lg flex flex-col">
                            <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50/30">
                                <div className="p-4 border-r border-slate-100 flex flex-col justify-center">
                                    <span className="text-[0.5rem] font-bold uppercase tracking-widest text-slate-400 mb-1">Origin</span>
                                    <span className="text-sm font-bold text-slate-900 truncate">{msg.sender}</span>
                                </div>
                                <div className="p-4 flex flex-col justify-center">
                                    <span className="text-[0.5rem] font-bold uppercase tracking-widest text-slate-400 mb-1">Timestamp</span>
                                    <span className="text-xs font-mono text-slate-600">{msg.time}</span>
                                </div>
                            </div>
                            <GlassBody className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="text-base text-slate-700 leading-loose font-light whitespace-pre-wrap">{msg.body}</div>
                            </GlassBody>
                            {msg.attachments && <div className="border-t border-slate-100 bg-slate-50/50 p-3 flex flex-col gap-2">{msg.attachments.map((f, i) => <div key={i} className="text-xs">{f.name}</div>)}</div>}
                        </GlassModule>
                    </div>
                </div>

                {/* WIDGETS COLUMN (Visible on XL Screens) */}
                <div className="w-80 hidden xl:flex flex-col gap-4 shrink-0">
                    {/* Time/Date Widget */}
                    <GlassModule noHover className="shadow-lg p-6 flex flex-col justify-center items-center text-center gap-1 min-h-[160px]">
                        <div className="text-4xl font-light text-slate-800 tracking-tighter">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-[0.3em]">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                        <div className="mt-4 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[0.55rem] font-bold uppercase tracking-widest border border-emerald-100">System Online</div>
                    </GlassModule>

                    {/* Upcoming Meeting Widget */}
                    <GlassModule noHover className="shadow-lg p-5 flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                             <span className="text-[0.55rem] font-bold text-slate-400 uppercase tracking-widest">Next Event</span>
                             <span className="text-[0.55rem] font-mono text-red-400 font-bold">IN 15 MIN</span>
                        </div>
                        <div>
                             <div className="text-sm font-bold text-slate-900 leading-tight">Neural Sync</div>
                             <div className="text-xs text-slate-500 mt-1">Room 404 • S. Connor</div>
                        </div>
                        <button className="w-full mt-2 py-2 bg-slate-900 text-white rounded-lg text-[0.6rem] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-colors">Join Sync</button>
                    </GlassModule>
                </div>
            </div>
        );
    }
    return <div className="flex-1 flex items-center justify-center opacity-30 select-none">i.M READY</div>;
  };

  // 4. CONTEXTUAL DOCK (The "Smart Toolbar")
  const renderContextualDock = () => {
      // Determine Context
      let context: 'inbox_list' | 'thread_view' | 'compose_view' | 'picker_view' = 'inbox_list';
      if (activeView === 'compose') context = 'compose_view';
      else if (selectedItemId) context = 'thread_view';
      else if (activeView === 'contacts' || activeView === 'calendar') context = 'picker_view';

      // Input Placeholder Logic
      let placeholder = "Search or Command...";
      if (context === 'inbox_list') placeholder = "Search inbox...";
      if (context === 'thread_view') placeholder = "Quick reply...";
      if (context === 'compose_view') placeholder = "Drafting body...";
      if (context === 'picker_view') placeholder = "Search items...";

      // Banner Logic
      const pendingItem = sendQueue.find(i => i.status === 'pending');
      const failedItems = sendQueue.filter(i => i.status === 'failed');
      const secondsLeft = pendingItem ? Math.ceil((pendingItem.sendAt - now) / 1000) : 0;
      const showUndo = pendingItem && secondsLeft > 0;
      const showError = failedItems.length > 0;

      return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#E5E5E5]/95 backdrop-blur-2xl border-t border-white/60 pb-safe transition-all duration-300">
            
            {/* BANNER STACK */}
            <div className="flex flex-col-reverse">
                {aiResponse && (
                    <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 text-[0.6rem] text-indigo-800 flex justify-between items-center animate-slide-up">
                        <span className="truncate mr-2"><span className="font-bold">AI //</span> {aiResponse}</span>
                        <button onClick={() => setAiResponse('')} className="text-indigo-400 font-bold px-2">×</button>
                    </div>
                )}
                {showError && (
                    <div className="px-4 py-2 bg-red-500 text-white text-[0.6rem] flex justify-between items-center animate-slide-up shadow-md">
                        <span className="font-bold tracking-wide uppercase">Transmission Failed ({failedItems.length})</span>
                        <button onClick={handleClearErrors} className="font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">DISMISS</button>
                    </div>
                )}
                {showUndo && (
                    <div className="px-4 py-2 bg-slate-900 text-white text-[0.6rem] flex justify-between items-center animate-slide-up shadow-md">
                        <span className="font-mono tracking-wide">SENDING IN {secondsLeft}s...</span>
                        <button onClick={handleUndo} className="font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">UNDO</button>
                    </div>
                )}
            </div>

            <div className="p-3 flex flex-col gap-2">
                 {/* ROW 1: SMART INPUT */}
                 <div className="bg-white border border-slate-200 rounded-xl h-10 px-4 flex items-center gap-3 shadow-sm focus-within:ring-1 focus-within:ring-indigo-500/30 transition-shadow">
                    <div className="font-bold text-slate-300 text-[0.6rem] tracking-wider shrink-0">{isAiThinking ? '...' : 'i.M'}</div>
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={dockInput}
                        onChange={(e) => setDockInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiAction()}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent h-full text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none tracking-wide"
                    />
                    {dockInput && <button onClick={() => handleAiAction()} className="text-indigo-600 text-xs">↵</button>}
                 </div>
                 
                 {/* ROW 2: DYNAMIC BUTTONS */}
                 <div className="grid grid-cols-4 gap-2 h-10">
                    {context === 'inbox_list' && (
                        <>
                            <DockAction label="Unread" active={inboxFilter === 'unread'} onClick={() => toggleFilter('unread')} />
                            <DockAction label="Urgent" active={inboxFilter === 'urgent'} onClick={() => toggleFilter('urgent')} />
                            <DockAction label="Summarize" onClick={() => handleAiAction('Summarize recent emails')} icon={<span className="text-[10px]">✨</span>} />
                            <DockAction label="Compose" primary onClick={() => handleViewChange('compose')} icon={<span>+</span>} />
                        </>
                    )}

                    {context === 'thread_view' && (
                        <>
                            <DockAction label="Back" onClick={() => setSelectedItemId(null)} icon={<span>←</span>} />
                            <DockAction label="Reply" primary onClick={() => handleViewChange('compose')} />
                            <DockAction label="Summarize" onClick={() => handleAiAction('Summarize this thread')} icon={<span className="text-[10px]">✨</span>} />
                            <DockAction label="Tasks" onClick={() => handleAiAction('Extract tasks')} />
                        </>
                    )}

                    {context === 'compose_view' && (
                        <>
                            <DockAction label="Attach" onClick={() => alert('Opening File Picker...')} icon={<span>📎</span>} />
                            <DockAction label="Formal" onClick={() => handleAiAction('Rewrite professionally')} />
                            <DockAction label="Friendly" onClick={() => handleAiAction('Rewrite casually')} />
                            <DockAction label="Send" primary onClick={handleSend} />
                        </>
                    )}

                    {context === 'picker_view' && (
                        <>
                            <DockAction label="Search" onClick={focusInput} />
                            <DockAction label="Select" primary onClick={() => {}} />
                            <DockAction label="Recent" onClick={() => {}} />
                            <DockAction label="Back" onClick={() => handleViewChange('inbox')} />
                        </>
                    )}
                </div>
            </div>
        </div>
      );
  };

  // --- LAYOUT ---
  return (
    <div className="h-screen font-sans flex flex-col overflow-hidden bg-[#E5E5E5] relative" style={{ backgroundImage: 'radial-gradient(#CCCCCC 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
      
      {/* SIDEBAR OVERLAY */}
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 z-[90] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>}

      <div className="flex-1 flex overflow-hidden p-3 lg:p-8 gap-6 relative">
        <div className={`fixed inset-y-0 left-0 z-[100] w-[280px] lg:static transition-transform duration-500 bg-[#E5E5E5] lg:bg-transparent p-6 lg:p-0 border-r border-slate-300 lg:border-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            {renderSidebar()}
        </div>
        <div className={`w-full lg:w-[400px] flex flex-col transition-all duration-500 ${(selectedItemId || activeView === 'compose') ? 'hidden lg:flex' : 'flex'}`}>
             {renderQueue()}
        </div>
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ${(!selectedItemId && activeView !== 'compose') ? 'hidden lg:flex' : 'flex'}`}>
             <div className="h-full w-full">{renderWorkspace()}</div>
        </div>
      </div>
      
      {renderContextualDock()}
      <style>{`.pb-safe { padding-bottom: env(safe-area-inset-bottom); }`}</style>
    </div>
  );
};

export default ProductPage;