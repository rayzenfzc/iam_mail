import React, { useState } from 'react';
import { Command } from 'lucide-react';

interface AICommandBarProps {
  onAction: (action: { type: string; payload?: any }) => void;
  isDark: boolean;
}

const AICommandBar: React.FC<AICommandBarProps> = ({ onAction, isDark }) => {
  const [input, setInput] = useState('');

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-50">
        <div className="flex gap-4 mb-5 justify-center">
            {['Neural_Summarize', 'Draft_Followup', 'Schedule_Sync'].map((hint, i) => (
                <button 
                  key={i} 
                  onClick={() => setInput(hint)}
                  className={`${isDark ? 'bg-white/5 border-white/10 text-slate-500 hover:text-white' : 'bg-white/90 border-white text-slate-400 hover:text-slate-900'} backdrop-blur-md px-5 py-2.5 rounded-2xl border shadow-sm text-[0.6rem] font-bold uppercase tracking-[0.2em] transition-all`}
                >
                    {hint}
                </button>
            ))}
        </div>

        <div className={`${isDark ? 'bg-[#1a1a1c]/90 border-white/10 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.5)]' : 'bg-white border-white shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)]'} p-3 rounded-[2.5rem] border flex items-center gap-4 transition-all hover:shadow-2xl`}>
            <div className={`w-14 h-14 flex items-center justify-center rounded-[1.5rem] border transition-colors ${isDark ? 'bg-white/5 border-white/10 text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                <Command size={22} strokeWidth={1.2} />
            </div>
            
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Commence neural drafting..." 
                className={`flex-1 bg-transparent px-2 outline-none text-[0.9rem] font-light placeholder:text-slate-600 ${isDark ? 'text-white' : 'text-slate-800'}`}
            />
            
            <button 
              onClick={() => onAction({ type: 'GEN_DRAFT', payload: input })}
              className={`${isDark ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-black'} px-10 py-5 rounded-[1.8rem] text-[0.7rem] font-bold uppercase tracking-[0.3em] hover:scale-[1.02] transition-all flex items-center gap-4 shadow-xl active:scale-95`}
            >
                Gen_Draft
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
            </button>
        </div>
    </div>
  );
};

export default AICommandBar;