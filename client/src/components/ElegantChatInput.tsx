import React, { useState, useRef, useEffect } from 'react';
import { Plus, Send, Paperclip, Mic, X, Edit3, Calendar, User, Search, Archive, Settings, Reply, Forward, Star } from 'lucide-react';

type AppContext = 'inbox' | 'email' | 'calendar' | 'contacts' | 'sent' | 'drafts';

interface ElegantChatInputProps {
    context: AppContext;
    selectedEmailSender?: string;
    onSend?: (message: string) => void;
    onCompose?: () => void;
    onAddMeeting?: () => void;
    onViewContacts?: () => void;
    onSearch?: (query: string) => void;
    onReply?: (message: string) => void;
    onSettings?: () => void;
}

/**
 * ElegantChatInput - Claude.ai inspired minimal chat container
 * 
 * Design principles:
 * - Maximum 3 visible buttons
 * - Rounded corners (16px desktop, 24px mobile)
 * - Floating with shadow
 * - Lifted off bottom (16px margin)
 * - Expands on focus
 * - Clean, minimal, elegant
 */
export const ElegantChatInput: React.FC<ElegantChatInputProps> = ({
    context,
    selectedEmailSender,
    onSend,
    onCompose,
    onAddMeeting,
    onViewContacts,
    onSearch,
    onReply,
    onSettings
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [showPlusMenu, setShowPlusMenu] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current && isExpanded) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + 'px';
        }
    }, [inputValue, isExpanded]);

    // Close plus menu on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowPlusMenu(false);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    // Get placeholder text based on context
    const getPlaceholder = () => {
        if (context === 'email' && selectedEmailSender) {
            return `Reply to ${selectedEmailSender}...`;
        }
        return 'How can I help you today?';
    };

    // Handle send
    const handleSend = () => {
        if (!inputValue.trim()) return;

        if (context === 'email' && selectedEmailSender) {
            onReply?.(inputValue);
        } else {
            onSend?.(inputValue);
        }
        setInputValue('');
        setIsExpanded(false);
    };

    // Context menu items - Ordered by usage frequency
    const getMenuItems = () => {
        // Base menu items - ordered by most used first
        const baseItems = [
            { icon: <Search size={16} />, label: 'Search', onClick: () => { setShowPlusMenu(false); inputRef.current?.focus(); } },
            { icon: <Edit3 size={16} />, label: 'Compose', onClick: () => { onCompose?.(); setShowPlusMenu(false); } },
            { icon: <Calendar size={16} />, label: 'Add Meeting', onClick: () => { onAddMeeting?.(); setShowPlusMenu(false); } },
            { icon: <User size={16} />, label: 'Contacts', onClick: () => { onViewContacts?.(); setShowPlusMenu(false); } },
            { icon: <Settings size={16} />, label: 'Settings', onClick: () => { onSettings?.(); setShowPlusMenu(false); } },
        ];

        // Email context - add email-specific actions at top
        if (context === 'email') {
            return [
                { icon: <Search size={16} />, label: 'Search', onClick: () => { setShowPlusMenu(false); inputRef.current?.focus(); } },
                { icon: <Reply size={16} />, label: 'Reply All', onClick: () => { setShowPlusMenu(false); } },
                { icon: <Forward size={16} />, label: 'Forward', onClick: () => { setShowPlusMenu(false); } },
                { icon: <Archive size={16} />, label: 'Archive', onClick: () => { setShowPlusMenu(false); } },
                { icon: <Settings size={16} />, label: 'Settings', onClick: () => { onSettings?.(); setShowPlusMenu(false); } },
            ];
        }

        return baseItems;
    };

    return (
        <div
            ref={containerRef}
            className={`
                fixed z-[1000]
                bottom-4 left-4 right-4
                md:bottom-6 md:left-[96px] md:right-6
                transition-all duration-300 ease-out
            `}
        >
            {/* Plus Menu - Appears above input */}
            {showPlusMenu && (
                <div
                    className="absolute bottom-full mb-2 left-0 
                        bg-white dark:bg-slate-800 
                        rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700
                        p-2 min-w-[180px]
                        animate-in slide-in-from-bottom-2 duration-200"
                >
                    {getMenuItems().map((item, i) => (
                        <button
                            key={i}
                            onClick={item.onClick}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                text-sm font-medium text-slate-700 dark:text-slate-200
                                hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <span className="text-slate-400">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Main Input Container - Claude.ai Style */}
            <div
                className={`
                    bg-white dark:bg-slate-800
                    rounded-2xl md:rounded-xl
                    shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                    border border-slate-150 dark:border-slate-700
                    backdrop-blur-xl
                    transition-all duration-300 ease-out
                    ${isExpanded ? 'p-4' : 'p-3'}
                `}
            >
                {/* Expanded Header - Shows when replying */}
                {isExpanded && context === 'email' && selectedEmailSender && (
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-xs font-medium text-slate-500">
                            Reply to {selectedEmailSender}
                        </span>
                        <button
                            onClick={() => { setIsExpanded(false); setInputValue(''); }}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                        >
                            <X size={14} className="text-slate-400" />
                        </button>
                    </div>
                )}

                {/* Input Row */}
                <div className="flex items-end gap-3">
                    {/* Plus Button */}
                    <button
                        onClick={() => setShowPlusMenu(!showPlusMenu)}
                        className={`
                            w-9 h-9 flex-shrink-0 flex items-center justify-center
                            rounded-lg border border-slate-200 dark:border-slate-600
                            text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                            hover:bg-slate-50 dark:hover:bg-slate-700
                            transition-all duration-200
                            ${showPlusMenu ? 'bg-slate-100 dark:bg-slate-700 rotate-45' : ''}
                        `}
                    >
                        <Plus size={18} strokeWidth={2} />
                    </button>

                    {/* Text Input */}
                    <div className="flex-1 relative">
                        {isExpanded ? (
                            <textarea
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder={getPlaceholder()}
                                className="w-full bg-transparent text-slate-800 dark:text-white 
                                    text-[15px] placeholder-slate-400 
                                    resize-none outline-none min-h-[24px] max-h-[150px]"
                                rows={1}
                                autoFocus
                            />
                        ) : (
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onFocus={() => setIsExpanded(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (inputValue.trim()) handleSend();
                                    }
                                }}
                                placeholder={getPlaceholder()}
                                className="w-full bg-transparent text-slate-800 dark:text-white 
                                    text-[15px] placeholder-slate-400 outline-none h-9"
                            />
                        )}
                    </div>

                    {/* Right Side Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Attach - Only show when expanded */}
                        {isExpanded && (
                            <button
                                className="w-9 h-9 flex items-center justify-center
                                    rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                                    hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <Paperclip size={18} />
                            </button>
                        )}

                        {/* Send Button */}
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className={`
                                w-9 h-9 flex items-center justify-center rounded-lg
                                transition-all duration-200
                                ${inputValue.trim()
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-500 cursor-not-allowed'
                                }
                            `}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>

                {/* Bottom Row - Only when expanded */}
                {isExpanded && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            <button className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 px-2 py-1 rounded">
                                Shift + Enter for new line
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { setIsExpanded(false); setInputValue(''); }}
                                className="text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ElegantChatInput;
