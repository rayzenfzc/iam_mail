// Merged types from old (working email) + new (v5 design)

export enum ViewState {
    LANDING = 'LANDING',
    LOGIN = 'LOGIN',
    APP = 'APP',
    INTELLIGENCE = 'INTELLIGENCE',
    INBOX = 'INBOX',
    COMPOSE = 'COMPOSE',
    SYSTEM = 'SYSTEM',
    CHILD_ZONE = 'CHILD_ZONE',
    CONNECT = 'CONNECT',
    ADMIN = 'ADMIN',
    ONBOARDING = 'ONBOARDING',
    DASHBOARD = 'DASHBOARD'
}

export type ThemeMode = 'light' | 'dark';
export type AppTheme = 'titanium' | 'onyx' | 'indigo' | 'bronze';

export interface Attachment {
    id: string;
    name: string;
    size: string;
    type: 'pdf' | 'image' | 'spreadsheet' | 'archive' | 'file' | 'other';
    url?: string;
}

export interface TrackingData {
    isEnabled: boolean;
    status: 'pending' | 'delivered' | 'opened' | 'clicked';
    openedAt?: string;
    location?: string;
    device?: string;
    impactScore?: number;
}

export interface Email {
    id: string;
    // Legacy fields (from backend)
    sender?: string;
    senderEmail: string;
    subject: string;
    snippet?: string;
    body: string;
    timestamp?: Date | string;
    isRead?: boolean;
    isOpened?: boolean;
    isClientOnline?: boolean;
    hasViewedQuote?: boolean;
    internalComments?: InternalComment[];

    // UI display fields
    senderName: string;
    preview?: string;
    time: string;
    read: boolean;
    type?: 'focus' | 'other' | 'draft';
    hasReceipt?: boolean;
    isQuote?: boolean;
    attachments?: Attachment[];
    thread?: Email[];
    hasAttachments?: boolean;

    // V5 Design fields
    folder?: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash' | 'junk' | 'history' | 'notes';
    category?: 'focus' | 'other';
    urgencyScore?: number; // 0-100
    aiSummary?: string;
    aiSmartReplies?: string[];
    tracking?: TrackingData;
}

export interface InternalComment {
    id: string;
    user: string;
    text: string;
    timestamp: Date;
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    role: string;
    company: string;
    avatar?: string;
    lastContacted: string;
    relationshipScore: number;
    aiNotes: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    type: 'meeting' | 'focus' | 'ooo';
    participants: string[];
    description?: string;
}

export type TabType = 'focus' | 'other';
export type ViewType = 'inbox' | 'calendar' | 'contacts' | 'archive' | 'drafts' | 'sent' | 'trash' | 'history' | 'junk' | 'notes' | 'security' | 'alerts' | 'settings';

export interface ComposerSnippet {
    trigger: string;
    label: string;
    text: string;
}

export const DEFAULT_SNIPPETS: ComposerSnippet[] = [
    { trigger: '/meet', label: 'Schedule Meeting', text: "I'd love to discuss this further. Are you available for a brief sync later this week? Here is a link to my calendar: [Link]" },
    { trigger: '/follow', label: 'Follow Up', text: "Just bumping this to the top of your inbox. Let me know if you have any questions." },
    { trigger: '/intro', label: 'Introduction', text: "I'd like to introduce you to..." },
    { trigger: '/video', label: 'Video Call', text: "Let's hop on a quick video call to align on this. Link: https://meet.google.com/..." }
];

export interface StudentProfile {
    id: string;
    name: string;
    diagnosis: string;
    ratePerHour: number;
}

export interface GameSessionData {
    gameId: string;
    accuracy: number;
    avgLatencyMs: number;
    timestamp: string;
}

export interface CurriculumDraft {
    week: number;
    focusAreas: string[];
    suggestedActivities: string[];
    rationale: string;
}

export interface ChatMessage {
    id: string;
    sender: 'guide' | 'parent';
    text: string;
    originalText?: string;
    timestamp: Date;
    isTranslated: boolean;
}
