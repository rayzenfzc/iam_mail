// Hub Types
export type HubScreen = 'inbox' | 'email-detail' | 'compose' | 'calendar' | 'contacts' | 'settings';

export interface HubContext {
    currentScreen: HubScreen;
    selectedEmailId?: string;
    selectedEmail?: {
        id: string;
        subject: string;
        sender: string;
        senderEmail: string;
        body: string;
    };
    recentContacts?: string[];
}

export interface HubMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    preview?: ActionPreview;
    chips?: SuggestedChip[];
    timestamp: Date;
    isTyping?: boolean;
}

export interface SuggestedChip {
    id: string;
    label: string;
    icon?: string;
    action: string;
    payload?: Record<string, any>;
}

export interface ActionPreview {
    type: 'email' | 'calendar' | 'contact' | 'setting';
    title: string;
    description: string;
    payload: Record<string, any>;
    actions: PreviewAction[];
}

export interface PreviewAction {
    id: string;
    label: string;
    variant: 'primary' | 'secondary' | 'danger';
    action: string;
}

export interface ParsedIntent {
    type: 'email' | 'calendar' | 'contacts' | 'settings' | 'search' | 'analysis' | 'help';
    action: string;
    entities: IntentEntities;
    preview?: ActionPreview;
    clarifications?: ClarificationQuestion[];
    confidence: number;
}

export interface IntentEntities {
    // Email
    recipients?: { name?: string; email?: string; type: 'to' | 'cc' | 'bcc' }[];
    subject?: string;
    body?: string;
    attachments?: string[];
    sendTime?: string;
    rewriteStyle?: 'shorter' | 'longer' | 'professional' | 'casual' | 'friendly';

    // Calendar
    title?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
    attendees?: string[];
    location?: string;
    videoLink?: string;
    recurrence?: string;

    // Contacts
    contactName?: string;
    contactEmail?: string;
    company?: string;
    notes?: string;

    // Settings
    settingKey?: string;
    settingValue?: any;

    // Search
    query?: string;
    filters?: Record<string, any>;
}

export interface ClarificationQuestion {
    field: string;
    question: string;
    options?: string[];
}

export interface HubState {
    isOpen: boolean;
    isMinimized: boolean;
    messages: HubMessage[];
    context: HubContext;
    pendingIntent: ParsedIntent | null;
    isProcessing: boolean;
}

// Context-based suggested chips
export const CONTEXTUAL_CHIPS: Record<HubScreen, SuggestedChip[]> = {
    'inbox': [
        { id: 'compose', label: 'Compose email', icon: 'edit', action: 'email.new', payload: {} },
        { id: 'search', label: 'Search emails', icon: 'search', action: 'email.search', payload: {} },
        { id: 'unread', label: 'Show unread', icon: 'mail', action: 'email.filter', payload: { filter: 'unread' } },
        { id: 'summary', label: 'Inbox summary', icon: 'sparkles', action: 'analysis.inbox', payload: {} },
    ],
    'email-detail': [
        { id: 'reply', label: 'Reply', icon: 'reply', action: 'email.reply', payload: {} },
        { id: 'summarize', label: 'Summarize', icon: 'sparkles', action: 'email.summarize', payload: {} },
        { id: 'meeting', label: 'Schedule meeting', icon: 'calendar', action: 'calendar.add', payload: {} },
        { id: 'contact', label: 'Add to contacts', icon: 'user-plus', action: 'contacts.add', payload: {} },
        { id: 'forward', label: 'Forward', icon: 'forward', action: 'email.forward', payload: {} },
    ],
    'compose': [
        { id: 'shorten', label: 'Shorten', icon: 'minimize', action: 'email.rewrite', payload: { style: 'shorter' } },
        { id: 'professional', label: 'Professional', icon: 'briefcase', action: 'email.rewrite', payload: { style: 'professional' } },
        { id: 'schedule', label: 'Schedule send', icon: 'clock', action: 'email.schedule', payload: {} },
        { id: 'attach', label: 'Add attachment', icon: 'paperclip', action: 'email.attach', payload: {} },
    ],
    'calendar': [
        { id: 'add', label: 'New meeting', icon: 'plus', action: 'calendar.add', payload: {} },
        { id: 'today', label: 'Today\'s schedule', icon: 'calendar', action: 'calendar.search', payload: { range: 'today' } },
        { id: 'free', label: 'Find free time', icon: 'search', action: 'calendar.availability', payload: {} },
        { id: 'analytics', label: 'Monthly summary', icon: 'chart', action: 'calendar.analyze', payload: {} },
    ],
    'contacts': [
        { id: 'add', label: 'Add contact', icon: 'user-plus', action: 'contacts.add', payload: {} },
        { id: 'recent', label: 'Recent contacts', icon: 'clock', action: 'contacts.search', payload: { filter: 'recent' } },
        { id: 'important', label: 'Important', icon: 'star', action: 'contacts.search', payload: { filter: 'important' } },
    ],
    'settings': [
        { id: 'dark', label: 'Toggle dark mode', icon: 'moon', action: 'settings.toggle', payload: { key: 'theme' } },
        { id: 'account', label: 'Add account', icon: 'plus', action: 'settings.account.add', payload: {} },
        { id: 'notifications', label: 'Notifications', icon: 'bell', action: 'settings.update', payload: { key: 'notifications' } },
        { id: 'export', label: 'Export data', icon: 'download', action: 'settings.export', payload: {} },
    ],
};

// Help messages
export const HELP_COMMANDS = `
**Email Commands:**
• "Email [name] about [topic]" - Compose new email
• "Reply to this" - Reply to current email
• "Make it shorter/professional/casual"
• "Schedule send for [time]"
• "Summarize this email"

**Calendar Commands:**
• "Schedule [duration] with [name]" - Create meeting
• "Show my meetings [today/tomorrow]"
• "When am I free [this week]?"

**Contacts Commands:**
• "Add [sender] to contacts"
• "Find [name/company]"

**Settings Commands:**
• "Dark mode on/off"
• "Add Gmail/Outlook account"
• "Mute notifications [duration]"
`;
