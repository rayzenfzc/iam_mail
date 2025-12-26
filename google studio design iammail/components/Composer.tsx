
import React, { useState, useRef, useEffect } from 'react';
import { X, Paperclip, Maximize2, Send, Wand2, Loader2, ListPlus, Type, Save } from 'lucide-react';
import { ComposerSnippet } from '../types';
// Correctly import GoogleGenAI from @google/genai
import { GoogleGenAI } from "@google/genai";

interface ComposerProps {
  isOpen: boolean;
  onClose: () => void;
  // Fix for line 137 error in App.tsx: Add isDark to ComposerProps
  isDark?: boolean;
  to?: string;
  subject?: string;
  initialBody?: string;
  onSaveDraft?: (draft: { to: string, subject: string, body: string }) => void;
  onSend?: (email: { to: string, subject: string, body: string }) => void;
}

const Composer: React.FC<ComposerProps> = ({ 
  isOpen, 
  onClose, 
  isDark = false, // Destructure isDark prop
  to = '', 
  subject = '', 
  initialBody = '', 
  onSaveDraft, 
  onSend 
}) => {
  const [body, setBody] = useState(initialBody);
  const [currentTo, setCurrentTo] = useState(to);
  const [currentSubject, setCurrentSubject] = useState(subject);
  const [aiState, setAiState] = useState<'idle' | 'expanding' | 'polishing' | 'optimizing_subject'>('idle');
  const [tone, setTone] = useState<'PROFESSIONAL' | 'CASUAL' | 'ASSERTIVE'>('PROFESSIONAL');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setBody(initialBody);
      setCurrentTo(to);
      setCurrentSubject(subject);
    }
  }, [isOpen, initialBody, to, subject]);

  // Use process.env.API_KEY directly for initialization as per guidelines
  const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

  const handlePolish = async () => {
    if (!body || body.length < 5) return;
    setAiState('polishing');
    try {
      // Use gemini-3-flash-preview for basic text tasks like polishing an email
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Rewrite this email to be more ${tone.toLowerCase()}. Maintain intent. \n\n Draft: ${body}`,
      });
      // Correctly access .text property from response
      if (response.text) setBody(response.text.trim());
    } catch (error) {
      console.error(error);
    } finally {
      setAiState('idle');
    }
  };

  const handleSend = () => {
    if (!currentTo) return;
    setIsSending(true);
    setTimeout(() => {
      onSend?.({ to: currentTo, subject: currentSubject, body });
      setIsSending(false);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 100% Transparent Backdrop with Blur - Updated for isDark */}
      <div className={`absolute inset-0 transition-all ${isDark ? 'bg-black/60 backdrop-blur-xl' : 'bg-white/20 backdrop-blur-xl'}`} onClick={onClose}></div>

      <div className={`w-full max-w-3xl rounded-xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border relative animate-in zoom-in-95 duration-300 flex flex-col h-[750px] overflow-hidden transition-colors ${isDark ? 'bg-[#0F0F11]/90 border-white/5 shadow-black/40' : 'bg-white/80 backdrop-blur-2xl border-white'}`}>
        
        {/* Header - Matching Screenshot with isDark support */}
        <div className={`flex justify-between items-center px-10 py-8 border-b ${isDark ? 'border-white/5' : 'border-slate-50/50'}`}>
          <span className={`text-[0.65rem] uppercase tracking-[0.4em] font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>I.COMPOSE</span>
          <div className={`flex gap-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            <button className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}><Maximize2 size={16} strokeWidth={1.5} /></button>
            <button onClick={onClose} className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}><X size={20} strokeWidth={1.5} /></button>
          </div>
        </div>

        {/* Recipient Input */}
        <div className={`px-10 py-6 border-b group ${isDark ? 'border-white/5' : 'border-slate-50/50'}`}>
           <div className="flex items-center">
             <span className={`text-sm font-medium mr-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>To:</span>
             <input 
               type="text" 
               value={currentTo}
               onChange={(e) => setCurrentTo(e.target.value)}
               className={`flex-1 text-sm font-light focus:outline-none bg-transparent ${isDark ? 'text-white' : 'text-slate-900'}`}
             />
           </div>
        </div>

        {/* Subject Input */}
        <div className={`px-10 py-8 border-b flex items-center ${isDark ? 'border-white/5' : 'border-slate-50/50'}`}>
           <span className={`text-sm font-bold mr-4 ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>Subject:</span>
           <input 
             type="text" 
             value={currentSubject}
             onChange={(e) => setCurrentSubject(e.target.value)}
             className={`flex-1 text-sm font-bold focus:outline-none bg-transparent ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
           />
           <button className={`transition-colors ${isDark ? 'text-slate-700 hover:text-slate-500' : 'text-slate-300 hover:text-slate-500'}`}>
               <Type size={18} strokeWidth={1.5} />
           </button>
        </div>

        {/* Body Area */}
        <div className="flex-1 p-10 flex flex-col relative overflow-hidden">
          {/* Tone Selector Pills */}
          <div className="flex gap-3 mb-8">
              {(['PROFESSIONAL', 'CASUAL', 'ASSERTIVE'] as const).map(t => (
                  <button 
                    key={t} 
                    onClick={() => setTone(t)}
                    className={`text-[0.6rem] uppercase tracking-widest px-6 py-2.5 rounded-full border transition-all font-bold ${tone === t ? (isDark ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-indigo-50/50 text-indigo-600 border-indigo-100 shadow-sm shadow-indigo-100') : (isDark ? 'bg-transparent text-slate-600 border-white/5 hover:border-white/10' : 'bg-transparent text-slate-400 border-slate-100 hover:border-slate-200')}`}
                  >
                      {t}
                  </button>
              ))}
          </div>

          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Compose your message... (Type bullets to expand, or '/' for snippets)"
            className={`w-full flex-1 resize-none focus:outline-none font-light leading-relaxed text-[0.85rem] bg-transparent custom-scrollbar ${isDark ? 'text-slate-400 placeholder:text-slate-800' : 'text-slate-500 placeholder:text-slate-300'}`}
          />
          
          {aiState !== 'idle' && (
            <div className={`absolute inset-0 flex items-center justify-center z-20 ${isDark ? 'bg-black/60' : 'bg-white/40'} backdrop-blur-sm`}>
                <Loader2 className={`animate-spin ${isDark ? 'text-indigo-400' : 'text-slate-900'}`} size={32} strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Footer tray - Matching Screenshot */}
        <div className={`px-10 py-8 border-t flex justify-between items-center ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-50/50 bg-white/30'}`}>
          <div className={`flex gap-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
             <button className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}><Paperclip size={20} strokeWidth={1.5} /></button>
             <button className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}><ListPlus size={20} strokeWidth={1.5} /></button>
             <button onClick={handlePolish} className={`transition-colors ${isDark ? 'hover:text-indigo-400' : 'hover:text-slate-900'}`}><Wand2 size={20} strokeWidth={1.5} /></button>
             <button className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}><Save size={20} strokeWidth={1.5} /></button>
          </div>
          
          {/* Send Button Capsule */}
          <button 
             onClick={handleSend}
             disabled={isSending || !currentTo}
             className={`px-8 py-3 rounded-full hover:shadow-lg transition-all flex items-center gap-3 group disabled:opacity-50 ${isDark ? 'bg-white text-black border-transparent' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
             <span className="text-xs font-bold text-slate-700 tracking-wide">
                 {isSending ? 'Sending...' : 'Send'}
             </span>
             <Send size={16} strokeWidth={1.5} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Composer;
