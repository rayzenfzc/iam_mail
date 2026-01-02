import React, { useState } from 'react';
import { Home, Send, Plus, CornerUpLeft, Archive, Trash2 } from 'lucide-react';

interface DockProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export const Dock: React.FC<DockProps> = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-[180px] flex items-center justify-center pointer-events-none z-[100] pb-10">
      <div className="w-full max-w-[800px] flex flex-col items-center pointer-events-auto px-6">
        
        {/* Action Buttons Group */}
        <div className="flex items-center justify-center gap-[12px] mb-[16px]">
          {[
            { icon: <Plus size={20} />, label: 'Compose' },
            { icon: <CornerUpLeft size={20} />, label: 'Reply' },
            { icon: <Archive size={20} />, label: 'Archive' },
            { icon: <Trash2 size={20} />, label: 'Delete' }
          ].map((btn, idx) => (
            <button
              key={idx}
              title={btn.label}
              className="w-[44px] h-[44px] bg-black text-white border border-white/10 rounded-[10px] flex items-center justify-center hover:bg-white hover:text-black hover:translate-y-[-4px] transition-all duration-500 shadow-xl"
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form 
          onSubmit={handleSubmit}
          className="w-full h-[52px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[26px] flex items-center px-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/10 transition-all group focus-within:ring-[#00ff88]/30"
        >
          <button 
            type="button"
            className="w-[20px] h-[20px] flex items-center justify-center text-white/30 hover:text-white transition-colors mr-[16px]"
          >
            <Home size={20} />
          </button>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isSearching ? "Propagating synthetic query..." : "Search mail network..."}
            className="flex-1 bg-transparent border-none outline-none text-[15px] font-light text-white placeholder:text-white/20"
          />

          <button 
            type="submit"
            className={`w-[24px] h-[24px] flex items-center justify-center transition-all ml-[16px] ${query.trim() ? 'text-[#00ff88]' : 'text-white/20'}`}
          >
            {isSearching ? <div className="w-4 h-4 border-2 border-white/10 border-t-[#00ff88] rounded-full animate-spin" /> : <Send size={22} />}
          </button>
        </form>
      </div>
    </div>
  );
};