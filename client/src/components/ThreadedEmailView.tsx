import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, ArrowLeft, Paperclip } from 'lucide-react';

interface Message {
  sender: string;
  senderRole: string;
  time: string;
  body: string;
  attachments?: { name: string; size: string }[];
}

interface ThreadedEmail {
  id: number;
  subject: string;
  messages: Message[];
}

interface ThreadedEmailViewProps {
  email: ThreadedEmail;
  currentPage: number;
  onPageChange: (newPage: number) => void;
  onBack: () => void;
  darkMode: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export const ThreadedEmailView: React.FC<ThreadedEmailViewProps> = ({
  email,
  currentPage,
  onPageChange,
  onBack,
  darkMode,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}) => {
  const totalPages = email.messages.length;
  const currentMessage = email.messages[currentPage];
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;
  
  const [animating, setAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down' | null>(null);
  
  // Track previous page for animation direction
  const [prevPage, setPrevPage] = useState(currentPage);
  
  useEffect(() => {
    if (prevPage !== currentPage) {
      setAnimationDirection(currentPage > prevPage ? 'up' : 'down');
      setAnimating(true);
      setPrevPage(currentPage);
      
      setTimeout(() => {
        setAnimating(false);
        setAnimationDirection(null);
      }, 300);
    }
  }, [currentPage, prevPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && !isFirstPage) {
        onPageChange(currentPage - 1);
      } else if (e.key === 'ArrowDown' && !isLastPage) {
        onPageChange(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFirstPage, isLastPage, onPageChange]);

  const getInitials = (name: string) => {
    if (name === 'Me') return 'ME';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    if (name === 'Me') return 'from-cyan-500 to-blue-500';
    if (name.includes('System') || name.includes('Alert') || name.includes('Monitor')) return 'from-orange-500 to-red-500';
    return 'from-violet-500 to-cyan-500';
  };

  return (
    <div 
      className="h-full flex flex-col max-w-3xl mx-auto"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* FIXED HEADER CARD */}
      <div className={`shrink-0 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border mb-3 sm:mb-4 ${
        darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'
      }`}>
        {/* Top Row: Back | Subject | Counter + Nav */}
        <div className="flex items-center justify-between gap-4">
          {/* Back Button */}
          <button 
            onClick={onBack}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Subject (truncated) */}
          <h2 className={`flex-1 text-xs sm:text-sm font-bold text-center truncate ${
            darkMode ? 'text-white' : 'text-black'
          }`}>
            {email.subject}
          </h2>

          {/* Page Counter + Nav Arrows */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className={`text-[10px] font-mono uppercase tracking-wider ${
              darkMode ? 'text-neutral-500' : 'text-neutral-400'
            }`}>
              MSG {currentPage + 1} / {totalPages}
            </span>
            <div className="flex gap-1">
              {/* Up Arrow */}
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={isFirstPage}
                className={`p-1.5 rounded-md border transition-all ${
                  isFirstPage 
                    ? 'opacity-30 cursor-not-allowed' 
                    : (darkMode 
                        ? 'border-white/10 hover:border-violet-500/30 hover:bg-white/5' 
                        : 'border-neutral-200 hover:border-violet-300 hover:bg-violet-50')
                }`}
              >
                <ChevronUp className="w-3 h-3" />
              </button>

              {/* Down Arrow */}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={isLastPage}
                className={`p-1.5 rounded-md border transition-all ${
                  isLastPage 
                    ? 'opacity-30 cursor-not-allowed' 
                    : (darkMode 
                        ? 'border-white/10 hover:border-violet-500/30 hover:bg-white/5' 
                        : 'border-neutral-200 hover:border-violet-300 hover:bg-violet-50')
                }`}
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGE CONTENT CARD (Scrollable) */}
      <div className={`flex-1 overflow-y-auto rounded-lg sm:rounded-xl border transition-all duration-300 ${
        darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'
      } ${animating ? (animationDirection === 'up' ? 'animate-slide-up-fade' : 'animate-slide-down-fade') : ''}`}>
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 px-[10px] py-[0px]">
          {/* Sender Bar */}
          <div className="flex items-center gap-3 sm:gap-4 sm:mb-6 sm:pb-6 border-b border-neutral-500/10 p-[0px] mt-[2px] mr-[0px] mb-[5px] ml-[0px] m-[0px]">
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-[0.75rem] bg-gradient-to-br ${getAvatarColor(currentMessage.sender)} text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.4)] shrink-0`}>
              {getInitials(currentMessage.sender)}
            </div>

            {/* Sender Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">{currentMessage.sender}</div>
              <div className="text-[10px] uppercase tracking-widest opacity-50">{currentMessage.senderRole}</div>
            </div>

            {/* Time */}
            <div className="text-[10px] font-mono opacity-50 shrink-0">{currentMessage.time}</div>
          </div>

          {/* Message Body */}
          <div className="text-sm leading-6 sm:leading-7 opacity-80 whitespace-pre-wrap sm:mb-8 mt-[0px] mr-[0px] mb-[10px] ml-[0px] px-[0px] py-[5px]">
            {currentMessage.body}
          </div>

          {/* Attachments (if present) */}
          {currentMessage.attachments && currentMessage.attachments.length > 0 && (
            <div className={`mt-8 pt-6 border-t border-neutral-500/10 space-y-3`}>
              {currentMessage.attachments.map((file, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    darkMode ? 'bg-white/5 border-white/5' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <Paperclip className="w-4 h-4 text-violet-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{file.name}</div>
                    <div className="text-[10px] opacity-50">{file.size}</div>
                  </div>
                  <button className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors ${
                    darkMode ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30' : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
                  }`}>
                    View
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-[10px] text-xs opacity-30 not-italic mr-[0px] mb-[0px] ml-[0px]">
            --<br/>
            Sent via i.AM Quantum Relay
          </div>
        </div>
      </div>
    </div>
  );
};