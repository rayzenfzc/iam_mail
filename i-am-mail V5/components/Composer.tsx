import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Paperclip, Send, Sparkles, Mic, UserPlus, ArrowUp, 
  CornerDownLeft, RefreshCw, Check, Trash2, Maximize2, Minimize2,
  ChevronUp, ChevronDown, AlignLeft, Bot, AtSign, Link
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
export type ComposerMode = 'new' | 'reply' | 'forward';

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
    draft?: EmailDraft; // If AI returns a draft
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
  // --- State ---
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Init ---
  useEffect(() => {
    if (isOpen) {
        // Initial Greeting
        const greeting = mode === 'new' 
            ? "Ready to compose. Who are we emailing, or paste rough notes?"
            : `Replying to "${initialData?.subject}". What would you like to say?`;
        
        setMessages([{
            id: 'init',
            role: 'ai',
            text: greeting
        }]);

        // If reply, preload context
        if (mode === 'reply' || mode === 'forward') {
           // We don't auto-create a draft yet, we wait for user intent
        }
    } else {
        setMessages([]);
        setInput('');
    }
  }, [isOpen, mode, initialData]);

  // Auto-scroll
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- AI Core ---
  const processAICommand = async (userText: string) => {
      // 1. Add User Message
      const userMsgId = Date.now().toString();
      setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userText }]);
      setInput('');

      // 2. Add AI Typing Indicator
      const typingId = 'typing-' + Date.now();
      setMessages(prev => [...prev, { id: typingId, role: 'ai', isTyping: true }]);

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          // Construct Prompt
          const prompt = `
            You are an AI email assistant for "I AM MAIL". 
            The user is in "${mode}" mode.
            Current Context: ${initialData?.subject ? `Subject: ${initialData.subject}` : 'New Email'}.
            
            User Input: "${userText}"

            Analyze the input.
            1. Parse INTENT: Is the user asking to write an email, edit a draft, or just chatting?
            2. Parse ENTITIES: Extract 'to' (names/emails), 'subject', and 'body' content.
            3. If the user pastes raw text, format it into a professional email body.
            4. If the user mentions a name like "Elena", assume they mean a contact.

            RETURN JSON ONLY:
            {
                "replyText": "Short conversational response (e.g. 'Drafting that for you.')",
                "draft": {
                    "to": ["email string"],
                    "subject": "string",
                    "body": "html string (use <br> for breaks)",
                    "attachments": []
                }
            }
            If no draft is needed (just chat), set "draft" to null.
          `;

          const result = await ai.models.generateContent({
              model: 'gemini-flash-lite-latest',
              contents: prompt,
              config: { responseMimeType: 'application/json' }
          });

          const responseText = result.text;
          const data = JSON.parse(responseText || '{}');

          // 3. Update Messages
          setMessages(prev => {
              const filtered = prev.filter(m => m.id !== typingId);
              return [...filtered, {
                  id: Date.now().toString(),
                  role: 'ai',
                  text: data.replyText,
                  draft: data.draft ? { ...data.draft, status: 'drafting' } : undefined
              }];
          });

      } catch (error) {
          console.error("AI Error", error);
          setMessages(prev => {
              const filtered = prev.filter(m => m.id !== typingId);
              return [...filtered, { id: Date.now().toString(), role: 'ai', text: "Connection disrupted. Please try again." }];
          });
      }
  };

  const handleSendAction = (draft: EmailDraft) => {
     onSend?.({
         to: draft.to.join(', '),
         subject: draft.subject,
         body: draft.body,
         tracking: true
     });
     onClose();
  };

  const handleDraftUpdate = (msgId: string, updates: Partial<EmailDraft>) => {
      setMessages(prev => prev.map(m => {
          if (m.id === msgId && m.draft) {
              return { ...m, draft: { ...m.draft, ...updates } };
          }
          return m;
      }));
  };

  const handleModifyDraftAI = async (msgId: string, currentDraft: EmailDraft, modification: 'shorten' | 'expand' | 'professional' | 'casual') => {
       // Optimistic UI update
       // Call Gemini to rewrite body
       try {
           const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
           const prompt = `Rewrite this email body to be more ${modification}. Keep it HTML formatted. \n\n Body: ${currentDraft.body}`;
           
           const result = await ai.models.generateContent({
               model: 'gemini-flash-lite-latest',
               contents: prompt
           });
           
           if (result.text) {
               handleDraftUpdate(msgId, { body: result.text });
           }
       } catch (e) {
           console.error(e);
       }
  };

  // --- Components ---

  const ContactDrawer = () => (
      <div className={`absolute bottom-24 left-4 right-4 bg-white/80 dark:bg-[#1A1A1C]/90 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl overflow-hidden transition-all duration-300 origin-bottom z-50 ${isContactDrawerOpen ? 'max-h-[300px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-10'}`}>
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest opacity-50 ml-2">Suggested Contacts</span>
              <button onClick={() => setIsContactDrawerOpen(false)}><X size={16} /></button>
          </div>
          <div className="p-2 overflow-y-auto max-h-[240px]">
              {MOCK_CONTACTS.map((c, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                        setInput(prev => prev + ` ${c.name} `);
                        setIsContactDrawerOpen(false);
                        inputRef.current?.focus();
                    }}
                    className="w-full flex items-center gap-4 p-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-colors text-left"
                  >
                      <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                          {c.avatar}
                      </div>
                      <div>
                          <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.name}</div>
                          <div className="text-xs opacity-50">{c.email}</div>
                      </div>
                  </button>
              ))}
          </div>
      </div>
  );

  const DraftCard = ({ msgId, draft }: { msgId: string, draft: EmailDraft }) => (
      <div className="w-full mt-4 mb-2 animate-in zoom-in-95 duration-300">
          <div className={`rounded-[1.5rem] overflow-hidden border backdrop-blur-md shadow-lg transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white'}`}>
              {/* Draft Header */}
              <div className={`px-5 py-4 border-b flex justify-between items-center ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                   <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                       <span className="text-[0.6rem] font-black uppercase tracking-widest opacity-60">Draft Preview</span>
                   </div>
                   <div className="flex gap-2">
                        <button onClick={() => handleModifyDraftAI(msgId, draft, 'shorten')} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10" title="Shorten"><Minimize2 size={14}/></button>
                        <button onClick={() => handleModifyDraftAI(msgId, draft, 'expand')} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10" title="Expand"><Maximize2 size={14}/></button>
                   </div>
              </div>

              {/* Editable Fields */}
              <div className="p-5 space-y-4">
                  <div className="space-y-1">
                      <label className="text-[0.55rem] font-black uppercase tracking-widest opacity-40">To</label>
                      <input 
                        value={draft.to.join(', ')} 
                        onChange={(e) => handleDraftUpdate(msgId, { to: e.target.value.split(',') })}
                        className="w-full bg-transparent text-sm font-medium focus:outline-none border-b border-transparent focus:border-indigo-500/50 transition-colors"
                      />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[0.55rem] font-black uppercase tracking-widest opacity-40">Subject</label>
                      <input 
                        value={draft.subject} 
                        onChange={(e) => handleDraftUpdate(msgId, { subject: e.target.value })}
                        className="w-full bg-transparent text-lg font-bold focus:outline-none border-b border-transparent focus:border-indigo-500/50 transition-colors"
                      />
                  </div>
                  <div className="space-y-1 pt-2">
                      <div 
                        contentEditable
                        onBlur={(e) => handleDraftUpdate(msgId, { body: e.currentTarget.innerHTML })}
                        dangerouslySetInnerHTML={{ __html: draft.body }}
                        className={`w-full bg-transparent text-sm leading-relaxed focus:outline-none min-h-[100px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                      />
                  </div>
              </div>

              {/* Gesture/Action Bar */}
              <div className={`p-2 flex gap-2 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                  <button 
                    onClick={() => handleSendAction(draft)}
                    className="flex-1 py-3 rounded-xl bg-slate-900 text-white flex items-center justify-center gap-2 hover:bg-black transition-colors"
                  >
                      <Send size={14} /> <span className="text-xs font-bold uppercase tracking-widest">Send Now</span>
                  </button>
                  <button 
                    onClick={() => { /* Discard logic */ }}
                    className="w-12 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                  >
                      <Trash2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleModifyDraftAI(msgId, draft, 'professional')}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isDark ? 'border-white/10' : 'border-slate-200'}`}
                  >
                      <Sparkles size={14} /> <span className="text-xs font-bold uppercase tracking-widest">Polishing</span>
                  </button>
              </div>
          </div>
      </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end pointer-events-none">
        {/* Fullscreen Backdrop */}
        <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto transition-opacity duration-500"
            onClick={onClose}
        />

        {/* Main Interface Container - Headless Style */}
        <div className={`
            pointer-events-auto w-full max-w-2xl mx-auto h-[90vh] 
            rounded-t-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative
            animate-in slide-in-from-bottom-20 duration-500
            ${isDark ? 'bg-[#0A0A0B]/95 border-t border-x border-white/10' : 'bg-white/95 border-t border-x border-white'}
            backdrop-blur-3xl
        `}>
            {/* HEADLESS HEADER STYLE - EXACT MATCH TO SENT VIEW */}
            <div className="px-6 py-8 flex items-center gap-6 shrink-0 bg-transparent z-20">
                {/* Vertical Bar + Title Group */}
                <div className="flex items-center gap-6 flex-1">
                     <div className={`w-[2px] h-9 ${isDark ? 'bg-slate-600' : 'bg-slate-900'} rounded-full`}></div>
                     <div className={`flex-1 flex justify-between items-center ${isDark ? 'text-white/80' : 'text-slate-900'}`}>
                        <span className="text-[1rem] font-black uppercase tracking-[0.8em]">
                             {mode === 'new' ? 'COMPOSE' : 'REPLY'}
                        </span>
                        <span className="opacity-20 font-mono text-[0.55rem] hidden sm:block">
                            {mode === 'new' ? 'NEW_MESSAGE' : 'THREAD_REPLY'}
                        </span>
                    </div>
                </div>
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                >
                    <ChevronDown size={20} strokeWidth={2.5} />
                </button>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-4 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {/* Bubble */}
                        {msg.text && (
                            <div className={`
                                max-w-[85%] px-6 py-4 rounded-2xl text-sm font-medium leading-relaxed
                                ${msg.role === 'user' 
                                    ? (isDark ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-900 text-white rounded-tr-sm')
                                    : (isDark ? 'bg-[#1A1A1C] text-slate-200 rounded-tl-sm' : 'bg-slate-100/80 text-slate-800 rounded-tl-sm')}
                            `}>
                                {msg.text}
                            </div>
                        )}
                        
                        {/* Typing Indicator */}
                        {msg.isTyping && (
                            <div className="flex gap-1 px-4 py-2">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        )}

                        {/* Draft Card Rendered In-Stream */}
                        {msg.draft && <DraftCard msgId={msg.id} draft={msg.draft} />}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Contacts Drawer */}
            <ContactDrawer />

            {/* Input Area (Bottom Bar) */}
            <div className={`p-4 pb-8 ${isDark ? 'bg-[#1A1A1C]' : 'bg-slate-50'}`}>
                {/* Suggestion Chips */}
                {messages.length < 2 && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 px-2">
                        {['Draft email to Arjun', 'Reply approving the budget', 'Send invite for Sync'].map((chip, i) => (
                            <button 
                                key={i}
                                onClick={() => processAICommand(chip)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 shadow-sm'}`}
                            >
                                <Sparkles size={12} className="inline mr-2 mb-0.5" />
                                {chip}
                            </button>
                        ))}
                    </div>
                )}

                <div className={`
                    flex items-center gap-3 p-2 pl-4 rounded-[2rem] border shadow-2xl transition-all focus-within:ring-2 ring-indigo-500/20
                    ${isDark ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-white'}
                `}>
                    <button 
                        onClick={() => setIsContactDrawerOpen(!isContactDrawerOpen)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        <AtSign size={20} strokeWidth={2} />
                    </button>
                    
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && input.trim()) processAICommand(input);
                        }}
                        placeholder="Tell AI what to write..."
                        className={`flex-1 bg-transparent border-none outline-none text-sm font-medium h-12 ${isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
                    />

                    <button className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                        <Link size={20} strokeWidth={2} />
                    </button>

                    <button 
                        onClick={() => input.trim() ? processAICommand(input) : setIsListening(!isListening)}
                        className={`w-14 h-12 rounded-[1.5rem] flex items-center justify-center shrink-0 transition-all ${input.trim() ? 'bg-indigo-600 text-white' : (isListening ? 'bg-red-500 text-white animate-pulse' : (isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'))}`}
                    >
                        {input.trim() ? <ArrowUp size={20} strokeWidth={3} /> : <Mic size={20} strokeWidth={2} />}
                    </button>
                </div>
                
                <div className="flex justify-center mt-4 gap-6 opacity-30">
                     <div className="flex items-center gap-1.5 text-[0.55rem] font-black uppercase tracking-widest">
                         <Bot size={10} /> Powered by Gemini Flash-Lite
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Composer;