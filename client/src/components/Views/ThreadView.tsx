import React, { useState, useRef } from 'react';
import { GlassModule, GlassHeader, GlassBody } from '../ui/GlassKit';
import { useAppState, useAppActions } from '../../context/AppStateContext';
import { EmailItem } from './InboxList';

// ============================================
// THREAD MESSAGE TYPE
// ============================================

export interface ThreadMessage extends EmailItem {
    index: number;
    total: number;
    isMe?: boolean;
    attachments?: { name: string; size: string }[];
}

// ============================================
// THREAD VIEW (Swipe Model)
// ============================================

interface ThreadViewProps {
    messages: ThreadMessage[];
    onReply?: () => void;
    onForward?: () => void;
}

export const ThreadView: React.FC<ThreadViewProps> = ({
    messages,
    onReply,
    onForward
}) => {
    const { state } = useAppState();
    const actions = useAppActions();

    const [currentIndex, setCurrentIndex] = useState(messages.length - 1);
    const [slideDirection, setSlideDirection] = useState<'up' | 'down'>('up');

    // Touch handling for swipe
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

        // Swipe up = next message
        if (distance > 50 && currentIndex < messages.length - 1) {
            setSlideDirection('up');
            setCurrentIndex(prev => prev + 1);
        }
        // Swipe down = previous message
        if (distance < -50 && currentIndex > 0) {
            setSlideDirection('down');
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowUp' && currentIndex > 0) {
            setSlideDirection('down');
            setCurrentIndex(prev => prev - 1);
        }
        if (e.key === 'ArrowDown' && currentIndex < messages.length - 1) {
            setSlideDirection('up');
            setCurrentIndex(prev => prev + 1);
        }
    };

    const currentMessage = messages[currentIndex];

    if (!currentMessage) {
        return (
            <div className="flex-1 flex items-center justify-center opacity-30">
                <span className="text-xs uppercase tracking-widest">No message selected</span>
            </div>
        );
    }

    // Format timestamp
    const formatTime = (timestamp: string | Date) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div
            className="flex flex-col gap-4 h-full overflow-hidden relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {/* Header Card */}
            <GlassModule noHover className="shadow-lg shrink-0 z-20">
                <div className="flex items-center justify-between p-4 bg-white/50">
                    <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                        <div className="flex flex-col min-w-0">
                            <h1 className="text-sm font-bold uppercase tracking-wide text-slate-900 truncate">
                                {currentMessage.subject}
                            </h1>
                            <span className="text-[0.55rem] font-mono text-slate-400 tracking-wider">
                                ID: {String(currentMessage.id).slice(-4)} // THREAD
                            </span>
                        </div>
                    </div>
                    <span className="text-[0.55rem] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded shrink-0">
                        MSG {currentIndex + 1} / {messages.length}
                    </span>
                </div>
            </GlassModule>

            {/* Message Card with Animation */}
            <div className={`flex-1 flex flex-col min-h-0 ${slideDirection === 'up' ? 'animate-slide-up' : 'animate-slide-down'
                }`}>
                <GlassModule noHover className="flex-1 shadow-lg flex flex-col">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50/30">
                        <div className="p-4 border-r border-slate-100 flex flex-col justify-center">
                            <span className="text-[0.5rem] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                {currentMessage.isMe ? 'To' : 'From'}
                            </span>
                            <span className="text-sm font-bold text-slate-900 truncate">
                                {currentMessage.isMe ? 'Recipient' : currentMessage.sender}
                            </span>
                        </div>
                        <div className="p-4 flex flex-col justify-center">
                            <span className="text-[0.5rem] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                Timestamp
                            </span>
                            <span className="text-xs font-mono text-slate-600">
                                {formatTime(currentMessage.timestamp)}
                            </span>
                        </div>
                    </div>

                    {/* Message Body */}
                    <GlassBody className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className={`text-base leading-loose font-light whitespace-pre-wrap ${currentMessage.isMe ? 'text-indigo-800' : 'text-slate-700'
                            }`}>
                            {currentMessage.body || currentMessage.snippet}
                        </div>
                    </GlassBody>

                    {/* Attachments */}
                    {currentMessage.attachments && currentMessage.attachments.length > 0 && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-3 flex flex-col gap-2">
                            <span className="text-[0.5rem] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                Attachments
                            </span>
                            {currentMessage.attachments.map((file, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-white/50 px-3 py-2 rounded-lg border border-white/60">
                                    <span>📎</span>
                                    <span className="flex-1 truncate">{file.name}</span>
                                    <span className="text-slate-400">{file.size}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </GlassModule>
            </div>

            {/* Swipe Indicator (Mobile) */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30 pointer-events-none lg:hidden">
                {currentIndex > 0 && <span className="text-xs">↑ Previous</span>}
                {currentIndex < messages.length - 1 && <span className="text-xs">↓ Next</span>}
            </div>

            {/* Animation Styles */}
            <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
        </div>
    );
};

export default ThreadView;
