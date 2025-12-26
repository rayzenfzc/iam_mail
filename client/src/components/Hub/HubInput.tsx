import React, { useState, useRef, useEffect } from 'react';
import { Mic, ArrowUp, Paperclip, Loader2 } from 'lucide-react';

interface HubInputProps {
    onSend: (message: string) => void;
    isProcessing: boolean;
    isDark?: boolean;
    placeholder?: string;
}

const HubInput: React.FC<HubInputProps> = ({
    onSend,
    isProcessing,
    isDark = false,
    placeholder = "Ask @hub anything..."
}) => {
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
        }
    }, [input]);

    const handleSubmit = () => {
        if (input.trim() && !isProcessing) {
            onSend(input.trim());
            setInput('');
            if (inputRef.current) {
                inputRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleVoice = () => {
        // Voice input using Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + transcript);
            };

            recognition.start();
        }
    };

    return (
        <div className={`
      flex items-end gap-2 p-3 border-t
      ${isDark ? 'border-white/10 bg-[#0A0A0B]' : 'border-slate-200 bg-white'}
    `}>
            {/* Attachment Button */}
            <button
                className={`p-2 rounded-full transition-colors shrink-0 ${isDark ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                title="Attach file"
            >
                <Paperclip size={18} />
            </button>

            {/* Input Field */}
            <div className={`
        flex-1 flex items-end rounded-2xl border transition-all
        ${isDark ? 'bg-white/5 border-white/10 focus-within:border-indigo-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500'}
      `}>
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    disabled={isProcessing}
                    className={`
            flex-1 px-4 py-3 bg-transparent text-sm resize-none focus:outline-none
            ${isDark ? 'text-white placeholder:text-white/40' : 'text-slate-900 placeholder:text-slate-400'}
            disabled:opacity-50
          `}
                    style={{ maxHeight: '120px' }}
                />
            </div>

            {/* Voice Button */}
            <button
                onClick={handleVoice}
                disabled={isProcessing}
                className={`
          p-2 rounded-full transition-all shrink-0
          ${isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : isDark
                            ? 'text-white/40 hover:text-white hover:bg-white/10'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }
          disabled:opacity-50
        `}
                title="Voice input"
            >
                <Mic size={18} />
            </button>

            {/* Send Button */}
            <button
                onClick={handleSubmit}
                disabled={!input.trim() || isProcessing}
                className={`
          w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all
          ${input.trim() && !isProcessing
                        ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25'
                        : isDark
                            ? 'bg-white/10 text-white/40'
                            : 'bg-slate-100 text-slate-400'
                    }
          disabled:cursor-not-allowed
        `}
            >
                {isProcessing ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <ArrowUp size={18} />
                )}
            </button>
        </div>
    );
};

export default HubInput;
