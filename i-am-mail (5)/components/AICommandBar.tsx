import React, { useState } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface AICommandBarProps {
  onAction: (action: { type: string; payload?: any }) => void;
  isDark: boolean;
}

const AICommandBar: React.FC<AICommandBarProps> = ({ onAction, isDark }) => {
  const [input, setInput] = useState('');

  return (
    <div className="w-full max-w-xl mx-auto">
        <div className={`
            ${isDark ? 'bg-[#0F0F11]/90 border-white/5' : 'bg-white border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.06)]'} 
            p-1.5 rounded-full border flex items-center gap-4 transition-all backdrop-blur-3xl
        `}>
            <div className={`w-9 h-9 flex items-center justify-center rounded-full shrink-0 ${isDark ? 'text-white/40' : 'text-slate-300'}`}>
                <Sparkles size={16} strokeWidth={1.5} />
            </div>
            
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Commence neural drafting..." 
                className={`flex-1 bg-transparent outline-none text-[0.8rem] font-medium placeholder:text-slate-300 ${isDark ? 'text-white' : 'text-slate-700'}`}
            />
            
            <button 
              onClick={() => {
                if (input.trim()) {
                    onAction({ type: 'GEN_DRAFT', payload: input });
                    setInput('');
                }
              }}
              className={`w-9 h-9 flex items-center justify-center rounded-full shrink-0 transition-all active:scale-90 shadow-lg ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
                <ArrowUpRight size={16} strokeWidth={2.5} />
            </button>
        </div>
        
        {/* Simplified Action Hints - Compact & Minimal */}
        <div className="flex gap-4 mt-2 justify-center opacity-30">
            {['Summarize', 'Followup', 'Sync'].map((hint, i) => (
                <button 
                  key={i} 
                  onClick={() => setInput(hint)}
                  className={`px-1 py-1 text-[0.5rem] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-600 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                >
                    {hint}
                </button>
            ))}
        </div>
    </div>
  );
};

export default AICommandBar;