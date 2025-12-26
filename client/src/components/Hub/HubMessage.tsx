import React from 'react';
import { Bot, User } from 'lucide-react';
import { HubMessage as HubMessageType } from './types';
import PreviewCard from './PreviewCard';
import ActionChips from './ActionChips';

interface HubMessageProps {
    message: HubMessageType;
    onPreviewAction: (actionId: string) => void;
    onChipClick: (chip: any) => void;
    isDark?: boolean;
    isExecuting?: boolean;
}

const HubMessage: React.FC<HubMessageProps> = ({
    message,
    onPreviewAction,
    onChipClick,
    isDark = false,
    isExecuting = false
}) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {/* Avatar + Name */}
            {!isUser && (
                <div className="flex items-center gap-2 mb-1.5 ml-1">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                        <Bot size={12} />
                    </div>
                    <span className={`text-[0.65rem] font-bold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                        @hub
                    </span>
                </div>
            )}

            {/* Typing Indicator */}
            {message.isTyping && (
                <div className={`px-4 py-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <div className="flex gap-1">
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-white/40' : 'bg-slate-400'}`} style={{ animationDelay: '0ms' }} />
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-white/40' : 'bg-slate-400'}`} style={{ animationDelay: '150ms' }} />
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-white/40' : 'bg-slate-400'}`} style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            )}

            {/* Message Content */}
            {message.content && !message.isTyping && (
                <div className={`
          max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
                        ? (isDark ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-900 text-white rounded-tr-sm')
                        : isSystem
                            ? (isDark ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-amber-50 text-amber-800 border border-amber-200')
                            : (isDark ? 'bg-white/5 text-white/90 rounded-tl-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm')
                    }
        `}>
                    {/* Render markdown-like content */}
                    <div dangerouslySetInnerHTML={{
                        __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br/>')
                            .replace(/• /g, '&bull; ')
                    }} />
                </div>
            )}

            {/* Preview Card */}
            {message.preview && (
                <div className="w-full mt-3">
                    <PreviewCard
                        preview={message.preview}
                        onAction={onPreviewAction}
                        isDark={isDark}
                        isExecuting={isExecuting}
                    />
                </div>
            )}

            {/* Suggested Chips */}
            {message.chips && message.chips.length > 0 && (
                <div className="mt-2">
                    <ActionChips chips={message.chips} onChipClick={onChipClick} isDark={isDark} />
                </div>
            )}

            {/* Timestamp */}
            {!message.isTyping && (
                <div className={`text-[0.6rem] mt-1 ${isUser ? 'mr-1' : 'ml-1'} ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            )}
        </div>
    );
};

export default HubMessage;
