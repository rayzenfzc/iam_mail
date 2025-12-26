import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Minus, Maximize2, Bot, HelpCircle, Trash2 } from 'lucide-react';
import {
    HubMessage as HubMessageType,
    HubContext,
    SuggestedChip,
    CONTEXTUAL_CHIPS,
    HELP_COMMANDS,
    ParsedIntent,
    ActionPreview
} from './types';
import HubMessage from './HubMessage';
import HubInput from './HubInput';
import ActionChips from './ActionChips';

const API_URL = import.meta.env.VITE_API_URL || '';

interface HubProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize?: () => void;
    isDark?: boolean;
    context: HubContext;
    // Callbacks for actions
    onComposeEmail?: (data: { to?: string; subject?: string; body?: string }) => void;
    onReplyEmail?: (data: { body?: string }) => void;
    onForwardEmail?: (data: { to?: string; body?: string }) => void;
    onSummarizeEmail?: () => void;
    onArchiveEmail?: () => void;
    onOpenSettings?: () => void;
    onThemeToggle?: () => void;
    onSearch?: (query: string) => void;
}

const Hub: React.FC<HubProps> = ({
    isOpen,
    onClose,
    onMinimize,
    isDark = false,
    context,
    onComposeEmail,
    onReplyEmail,
    onForwardEmail,
    onSummarizeEmail,
    onArchiveEmail,
    onOpenSettings,
    onThemeToggle,
    onSearch,
}) => {
    const [messages, setMessages] = useState<HubMessageType[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [pendingIntent, setPendingIntent] = useState<ParsedIntent | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Welcome message on open
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMsg: HubMessageType = {
                id: 'welcome',
                role: 'assistant',
                content: "Hi! I'm **@hub**, your AI assistant. I can help you compose emails, schedule meetings, manage contacts, and more.\n\nTry typing a command or tap a suggestion below.",
                chips: CONTEXTUAL_CHIPS[context.currentScreen] || CONTEXTUAL_CHIPS['inbox'],
                timestamp: new Date(),
            };
            setMessages([welcomeMsg]);
        }
    }, [isOpen, context.currentScreen]);

    // Get auth headers
    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }, []);

    // Parse user message with Gemini
    const parseIntent = async (message: string): Promise<ParsedIntent | null> => {
        try {
            const response = await fetch(`${API_URL}/api/hub/parse`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    message,
                    context: {
                        currentScreen: context.currentScreen,
                        selectedEmail: context.selectedEmail,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to parse intent');
            }

            return await response.json();
        } catch (error) {
            console.error('Intent parsing error:', error);
            return null;
        }
    };

    // Execute confirmed action
    const executeAction = async (intent: ParsedIntent): Promise<boolean> => {
        setIsExecuting(true);

        try {
            // Handle different action types
            switch (intent.type) {
                case 'email':
                    if (intent.action === 'new') {
                        onComposeEmail?.({
                            to: intent.entities.recipients?.[0]?.email,
                            subject: intent.entities.subject,
                            body: intent.entities.body,
                        });
                        return true;
                    }
                    if (intent.action === 'reply') {
                        onReplyEmail?.({ body: intent.entities.body });
                        return true;
                    }
                    if (intent.action === 'forward') {
                        onForwardEmail?.({
                            to: intent.entities.recipients?.[0]?.email,
                            body: intent.entities.body,
                        });
                        return true;
                    }
                    if (intent.action === 'summarize') {
                        onSummarizeEmail?.();
                        return true;
                    }
                    if (intent.action === 'archive' || intent.action === 'delete') {
                        onArchiveEmail?.();
                        return true;
                    }
                    break;

                case 'settings':
                    if (intent.action === 'toggle' && intent.entities.settingKey === 'theme') {
                        onThemeToggle?.();
                        return true;
                    }
                    if (intent.action === 'open') {
                        onOpenSettings?.();
                        return true;
                    }
                    break;

                case 'search':
                    if (intent.entities.query) {
                        onSearch?.(intent.entities.query);
                        return true;
                    }
                    break;

                case 'help':
                    // Help is handled locally
                    return true;
            }

            // For actions that need backend execution
            const response = await fetch(`${API_URL}/api/hub/execute`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ intent, confirmed: true }),
            });

            return response.ok;
        } catch (error) {
            console.error('Action execution error:', error);
            return false;
        } finally {
            setIsExecuting(false);
        }
    };

    // Handle user message
    const handleSend = async (message: string) => {
        // Add user message
        const userMsg: HubMessageType = {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);

        // Check for help command
        if (message.toLowerCase().includes('help') || message === '?') {
            const helpMsg: HubMessageType = {
                id: Date.now().toString() + '-help',
                role: 'assistant',
                content: HELP_COMMANDS,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, helpMsg]);
            return;
        }

        // Show typing indicator
        setIsProcessing(true);
        const typingMsg: HubMessageType = {
            id: 'typing',
            role: 'assistant',
            content: '',
            isTyping: true,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, typingMsg]);

        // Parse intent
        const intent = await parseIntent(message);

        // Remove typing indicator
        setMessages(prev => prev.filter(m => m.id !== 'typing'));
        setIsProcessing(false);

        if (!intent) {
            // Fallback response
            const errorMsg: HubMessageType = {
                id: Date.now().toString() + '-error',
                role: 'assistant',
                content: "I'm not sure how to help with that. Try asking me to:\n• Compose an email\n• Schedule a meeting\n• Search your inbox\n• Change settings",
                chips: CONTEXTUAL_CHIPS[context.currentScreen],
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
            return;
        }

        // If clarifications needed, ask them
        if (intent.clarifications && intent.clarifications.length > 0) {
            const clarifyMsg: HubMessageType = {
                id: Date.now().toString() + '-clarify',
                role: 'assistant',
                content: intent.clarifications.map(c => c.question).join('\n'),
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, clarifyMsg]);
            setPendingIntent(intent);
            return;
        }

        // Show preview if available
        if (intent.preview) {
            const previewMsg: HubMessageType = {
                id: Date.now().toString() + '-preview',
                role: 'assistant',
                content: 'Here\'s what I\'ll do:',
                preview: intent.preview,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, previewMsg]);
            setPendingIntent(intent);
        } else {
            // Execute directly for simple actions
            const success = await executeAction(intent);
            const resultMsg: HubMessageType = {
                id: Date.now().toString() + '-result',
                role: 'assistant',
                content: success ? '✓ Done!' : 'Something went wrong. Please try again.',
                chips: CONTEXTUAL_CHIPS[context.currentScreen],
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, resultMsg]);
        }
    };

    // Handle preview action (confirm, edit, cancel)
    const handlePreviewAction = async (actionId: string) => {
        if (!pendingIntent) return;

        if (actionId === 'confirm') {
            setIsExecuting(true);
            const success = await executeAction(pendingIntent);

            const resultMsg: HubMessageType = {
                id: Date.now().toString() + '-result',
                role: 'assistant',
                content: success ? '✓ Done! Action completed successfully.' : 'Something went wrong. Please try again.',
                chips: CONTEXTUAL_CHIPS[context.currentScreen],
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, resultMsg]);
            setPendingIntent(null);
            setIsExecuting(false);
        } else if (actionId === 'cancel') {
            const cancelMsg: HubMessageType = {
                id: Date.now().toString() + '-cancel',
                role: 'assistant',
                content: 'Cancelled. What else can I help with?',
                chips: CONTEXTUAL_CHIPS[context.currentScreen],
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, cancelMsg]);
            setPendingIntent(null);
        } else if (actionId === 'edit') {
            // Open in manual mode
            if (pendingIntent.type === 'email') {
                onComposeEmail?.({
                    to: pendingIntent.entities.recipients?.[0]?.email,
                    subject: pendingIntent.entities.subject,
                    body: pendingIntent.entities.body,
                });
            }
            setPendingIntent(null);
        }
    };

    // Handle chip click
    const handleChipClick = (chip: SuggestedChip) => {
        // Convert chip to a natural language command
        const commandMap: Record<string, string> = {
            'email.new': 'Compose a new email',
            'email.reply': 'Reply to this email',
            'email.forward': 'Forward this email',
            'email.summarize': 'Summarize this email',
            'email.search': 'Search my emails',
            'email.rewrite': chip.payload?.style ? `Make it ${chip.payload.style}` : 'Rewrite this',
            'email.schedule': 'Schedule this email to send later',
            'calendar.add': 'Schedule a new meeting',
            'calendar.search': chip.payload?.range ? `Show my meetings ${chip.payload.range}` : 'Show my calendar',
            'calendar.availability': 'When am I free?',
            'calendar.analyze': 'Give me a monthly meeting summary',
            'contacts.add': 'Add sender to contacts',
            'contacts.search': chip.payload?.filter ? `Show ${chip.payload.filter} contacts` : 'Search contacts',
            'settings.toggle': chip.payload?.key === 'theme' ? 'Toggle dark mode' : 'Open settings',
            'settings.account.add': 'Add an email account',
            'settings.export': 'Export my data',
            'analysis.inbox': 'Summarize my inbox',
        };

        const command = commandMap[chip.action] || chip.label;
        handleSend(command);
    };

    // Clear chat
    const handleClear = () => {
        setMessages([]);
        setPendingIntent(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-end justify-center sm:items-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
                onClick={onClose}
            />

            {/* Hub Panel */}
            <div className={`
        pointer-events-auto w-full sm:w-[420px] sm:max-w-[90vw] h-[85vh] sm:h-[600px] sm:max-h-[80vh]
        flex flex-col overflow-hidden
        rounded-t-3xl sm:rounded-2xl shadow-2xl
        animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300
        ${isDark ? 'bg-[#0F0F11] border border-white/10' : 'bg-white border border-slate-200'}
      `}>
                {/* Header */}
                <div className={`
          flex items-center justify-between px-4 py-3 border-b shrink-0
          ${isDark ? 'border-white/10' : 'border-slate-100'}
        `}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                            <Bot size={18} />
                        </div>
                        <div>
                            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>@hub</div>
                            <div className={`text-[0.6rem] uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                                AI Assistant
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handleSend('help')}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400'}`}
                            title="Help"
                        >
                            <HelpCircle size={18} />
                        </button>
                        <button
                            onClick={handleClear}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400'}`}
                            title="Clear chat"
                        >
                            <Trash2 size={18} />
                        </button>
                        {onMinimize && (
                            <button
                                onClick={onMinimize}
                                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400'}`}
                                title="Minimize"
                            >
                                <Minus size={18} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-400'}`}
                            title="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <HubMessage
                            key={msg.id}
                            message={msg}
                            onPreviewAction={handlePreviewAction}
                            onChipClick={handleChipClick}
                            isDark={isDark}
                            isExecuting={isExecuting}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions (when empty) */}
                {messages.length <= 1 && (
                    <div className={`px-4 pb-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                        <div className="text-[0.65rem] font-bold uppercase tracking-wider mb-2">Quick Actions</div>
                        <ActionChips
                            chips={CONTEXTUAL_CHIPS[context.currentScreen] || CONTEXTUAL_CHIPS['inbox']}
                            onChipClick={handleChipClick}
                            isDark={isDark}
                        />
                    </div>
                )}

                {/* Input */}
                <HubInput
                    onSend={handleSend}
                    isProcessing={isProcessing}
                    isDark={isDark}
                    placeholder={context.selectedEmail ? "Reply, summarize, or ask anything..." : "Ask @hub anything..."}
                />
            </div>
        </div>
    );
};

export default Hub;
