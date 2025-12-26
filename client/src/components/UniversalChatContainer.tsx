import React, { useState, useRef, useEffect } from 'react';
import {
    Inbox, Calendar, Send, User, Paperclip, Star, Search, Settings,
    Reply, ReplyAll, Forward, Archive, Trash2, Plus, MoreHorizontal,
    X, Check, Edit3, Clock, Mic
} from 'lucide-react';

// Types for the Universal Chat Container
type ChatMode = 'default' | 'reply' | 'compose' | 'add-event' | 'add-contact' | 'search' | 'attach';
type AppContext = 'inbox' | 'email' | 'calendar' | 'contacts' | 'sent' | 'drafts';

interface QuickAction {
    id: string;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    primary?: boolean;
}

interface UniversalChatContainerProps {
    context: AppContext;
    selectedEmailId?: string | null;
    selectedEmailSubject?: string;
    selectedEmailSender?: string;
    onReply?: (message: string) => void;
    onCompose?: () => void;
    onNavigate?: (view: string) => void;
    onAddEvent?: (event: { title: string; date: string; time: string }) => void;
    onAddContact?: (contact: { name: string; email: string }) => void;
    onSearch?: (query: string) => void;
    onSendEmail?: (to: string, subject: string, body: string) => void;
}

export const UniversalChatContainer: React.FC<UniversalChatContainerProps> = ({
    context,
    selectedEmailId,
    selectedEmailSubject,
    selectedEmailSender,
    onReply,
    onCompose,
    onNavigate,
    onAddEvent,
    onAddContact,
    onSearch,
    onSendEmail
}) => {
    const [mode, setMode] = useState<ChatMode>('default');
    const [inputValue, setInputValue] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Form states for inline forms
    const [eventForm, setEventForm] = useState({ title: '', date: '', time: '' });
    const [contactForm, setContactForm] = useState({ name: '', email: '' });

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Format time display
    const formatTime = () => {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes} ${period}`;
    };

    const formatDate = () => {
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return `${days[currentTime.getDay()]} ${months[currentTime.getMonth()]} ${currentTime.getDate()}`;
    };

    // Context-aware quick actions
    const getQuickActions = (): QuickAction[] => {
        const baseActions: QuickAction[] = [
            { id: 'inbox', icon: <Inbox size={16} />, label: 'Inbox', onClick: () => onNavigate?.('inbox') },
            { id: 'calendar', icon: <Calendar size={16} />, label: 'Event', onClick: () => { setMode('add-event'); setIsExpanded(true); } },
            { id: 'sent', icon: <Send size={16} />, label: 'Sent', onClick: () => onNavigate?.('sent') },
            { id: 'contacts', icon: <User size={16} />, label: 'Contact', onClick: () => { setMode('add-contact'); setIsExpanded(true); } },
            { id: 'attach', icon: <Paperclip size={16} />, label: 'Attach', onClick: () => setMode('attach') },
            { id: 'drafts', icon: <Star size={16} />, label: 'Drafts', onClick: () => onNavigate?.('drafts') },
            { id: 'search', icon: <Search size={16} />, label: 'Search', onClick: () => setMode('search') },
        ];

        // Add context-specific actions
        if (context === 'email' && selectedEmailId) {
            return [
                { id: 'reply', icon: <Reply size={16} />, label: 'Reply', onClick: () => { setMode('reply'); setIsExpanded(true); }, primary: true },
                { id: 'reply-all', icon: <ReplyAll size={16} />, label: 'Reply All', onClick: () => { setMode('reply'); setIsExpanded(true); } },
                { id: 'forward', icon: <Forward size={16} />, label: 'Forward', onClick: () => { setMode('compose'); setIsExpanded(true); } },
                { id: 'archive', icon: <Archive size={16} />, label: 'Archive', onClick: () => { } },
                ...baseActions.slice(1, 4),
            ];
        }

        if (context === 'inbox') {
            return [
                { id: 'compose', icon: <Edit3 size={16} />, label: 'Compose', onClick: () => { setMode('compose'); setIsExpanded(true); }, primary: true },
                ...baseActions,
            ];
        }

        return baseActions;
    };

    // Handle send action based on mode
    const handleSend = () => {
        if (mode === 'reply' && inputValue.trim()) {
            onReply?.(inputValue);
            setInputValue('');
            setMode('default');
            setIsExpanded(false);
        } else if (mode === 'add-event' && eventForm.title.trim()) {
            onAddEvent?.(eventForm);
            setEventForm({ title: '', date: '', time: '' });
            setMode('default');
            setIsExpanded(false);
        } else if (mode === 'add-contact' && contactForm.name.trim()) {
            onAddContact?.(contactForm);
            setContactForm({ name: '', email: '' });
            setMode('default');
            setIsExpanded(false);
        } else if (mode === 'search' && inputValue.trim()) {
            onSearch?.(inputValue);
        }
    };

    // Cancel current action
    const handleCancel = () => {
        setMode('default');
        setIsExpanded(false);
        setInputValue('');
        setEventForm({ title: '', date: '', time: '' });
        setContactForm({ name: '', email: '' });
    };

    // Handle input change with command detection
    const handleInputChange = (value: string) => {
        setInputValue(value);

        // Command detection
        if (value.toLowerCase() === '/reply' || value.toLowerCase() === 'reply') {
            if (selectedEmailId) {
                setMode('reply');
                setIsExpanded(true);
                setInputValue('');
            }
        } else if (value.toLowerCase() === '/event' || value.toLowerCase() === 'add event') {
            setMode('add-event');
            setIsExpanded(true);
            setInputValue('');
        } else if (value.toLowerCase() === '/contact' || value.toLowerCase() === 'add contact') {
            setMode('add-contact');
            setIsExpanded(true);
            setInputValue('');
        } else if (value.toLowerCase() === '/search' || value.toLowerCase() === 'search') {
            setMode('search');
            setInputValue('');
        }
    };

    // Render inline forms based on mode
    const renderExpandedContent = () => {
        switch (mode) {
            case 'reply':
                return (
                    <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                💬 Reply to: {selectedEmailSender}
                            </span>
                            <button onClick={handleCancel} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                                <X size={14} />
                            </button>
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                            Re: {selectedEmailSubject}
                        </div>
                        <textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your reply..."
                            className="w-full h-24 p-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                                    <Paperclip size={16} className="text-slate-500" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                    className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'add-event':
                return (
                    <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                📅 Quick Add Event
                            </span>
                            <button onClick={handleCancel} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                                <X size={14} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={eventForm.title}
                            onChange={(e) => setEventForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="Event title..."
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={eventForm.date}
                                onChange={(e) => setEventForm(f => ({ ...f, date: e.target.value }))}
                                className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="time"
                                value={eventForm.time}
                                onChange={(e) => setEventForm(f => ({ ...f, time: e.target.value }))}
                                className="w-28 px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!eventForm.title.trim()}
                                className="px-4 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
                            >
                                Create Event
                            </button>
                        </div>
                    </div>
                );

            case 'add-contact':
                return (
                    <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                👤 Quick Add Contact
                            </span>
                            <button onClick={handleCancel} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                                <X size={14} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={contactForm.name}
                            onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="Name..."
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        <input
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="Email..."
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!contactForm.name.trim()}
                                className="px-4 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50"
                            >
                                Save Contact
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const quickActions = getQuickActions();

    return (
        <div
            className={`
                fixed bottom-0 left-0 md:left-[80px] right-0 z-[1000]
                bg-white dark:bg-slate-900 
                border-t-2 border-slate-200 dark:border-slate-700
                transition-all duration-300 ease-in-out
                ${isExpanded ? 'shadow-2xl' : 'shadow-lg'}
            `}
            style={{
                height: isExpanded ? 'auto' : '126px',
                maxHeight: isExpanded ? '300px' : '126px'
            }}
        >
            {/* Time Header - Always visible */}
            <div className="h-[30px] px-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
                    <Clock size={12} />
                    <span>{formatTime()}</span>
                    <span className="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
                    <span className="hidden sm:inline">{formatDate()}</span>
                </div>
                <button
                    onClick={() => onNavigate?.('settings')}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <Settings size={14} className="text-slate-400" />
                </button>
            </div>

            {/* Expanded Content (Forms) */}
            {isExpanded && renderExpandedContent()}

            {/* Quick Actions Bar - Horizontally scrollable */}
            <div className="h-[48px] px-2 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b border-slate-100 dark:border-slate-800">
                {quickActions.map(action => (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        className={`
                            h-8 px-3 flex items-center gap-1.5 rounded-full text-xs font-medium whitespace-nowrap
                            transition-all duration-200 flex-shrink-0
                            ${action.primary
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            }
                        `}
                    >
                        {action.icon}
                        <span className="hidden sm:inline">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Chat Input - Main command bar */}
            <div className="h-[48px] px-4 flex items-center gap-3 bg-white dark:bg-slate-900">
                <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <span className="text-slate-400 text-sm">⌘</span>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={mode === 'search' ? 'Search...' : 'Ask i.M... (Type @ to mention)'}
                        className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                    />
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                        <Mic size={16} className="text-slate-400" />
                    </button>
                </div>
                <button
                    onClick={handleSend}
                    className="w-10 h-10 flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:opacity-90 transition-opacity"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

export default UniversalChatContainer;
