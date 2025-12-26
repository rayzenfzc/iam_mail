import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Loader2 } from 'lucide-react';

interface AICommandBarProps {
  onAction: (action: { type: string; payload?: any }) => void;
  isDark: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || '';

const AICommandBar: React.FC<AICommandBarProps> = ({ onAction, isDark }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const command = input.trim();
    setInput('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/ai/interpret`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ command })
      });

      if (!response.ok) {
        throw new Error('AI interpretation failed');
      }

      const action = await response.json();

      // Map AI response to frontend actions
      switch (action.type) {
        case 'COMPOSE_EMAIL':
          onAction({
            type: 'OPEN_COMPOSER',
            payload: {
              to: action.to,
              subject: action.subject,
              body: action.body
            }
          });
          break;
        case 'NAVIGATE':
          onAction({
            type: 'NAVIGATE',
            payload: { view: action.view }
          });
          break;
        case 'SEARCH':
          onAction({
            type: 'SEARCH',
            payload: { query: action.query }
          });
          break;
        case 'SET_REMINDER':
          onAction({
            type: 'SET_REMINDER',
            payload: {
              text: action.reminderText,
              date: action.reminderDate
            }
          });
          break;
        default:
          // For unknown or GEN_DRAFT, open composer with the raw input
          onAction({
            type: 'OPEN_COMPOSER',
            payload: { context: command }
          });
      }
    } catch (error) {
      console.error('AI command error:', error);
      // Fallback: open composer with the input as context
      onAction({
        type: 'OPEN_COMPOSER',
        payload: { context: command }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (hint: string) => {
    setInput(hint);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className={`
            ${isDark ? 'bg-[#0F0F11]/90 border-white/5' : 'bg-white border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.06)]'} 
            p-1.5 rounded-full border flex items-center gap-4 transition-all backdrop-blur-3xl
        `}>
        <div className={`w-9 h-9 flex items-center justify-center rounded-full shrink-0 ${isDark ? 'text-white/40' : 'text-slate-300'}`}>
          {isLoading ? (
            <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
          ) : (
            <Sparkles size={16} strokeWidth={1.5} />
          )}
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          placeholder="Ask AI... (e.g., 'email John about the meeting')"
          className={`flex-1 bg-transparent outline-none text-[0.8rem] font-medium placeholder:text-slate-300 ${isDark ? 'text-white' : 'text-slate-700'}`}
          disabled={isLoading}
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className={`w-9 h-9 flex items-center justify-center rounded-full shrink-0 transition-all active:scale-90 shadow-lg disabled:opacity-50 ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-black'}`}
        >
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Quick Action Hints */}
      <div className="flex gap-4 mt-2 justify-center opacity-30">
        {['Summarize', 'Compose', 'Search'].map((hint, i) => (
          <button
            key={i}
            onClick={() => handleQuickAction(hint)}
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