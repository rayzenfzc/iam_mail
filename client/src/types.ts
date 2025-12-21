
export interface Email {
    id: string;
    sender: string;
    senderEmail: string;
    subject: string;
    snippet: string;
    body: string;
    timestamp: Date;
    isRead: boolean;
    isOpened: boolean; // For tracking
    isClientOnline: boolean;
    hasViewedQuote: boolean;
    category: 'focus' | 'other';
    internalComments: InternalComment[];
}

export interface InternalComment {
    id: string;
    user: string;
    text: string;
    timestamp: Date;
}

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
    ADMIN = 'ADMIN'
}

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

export const MOCK_EMAILS: Email[] = [
    {
        id: '1',
        sender: 'Arjun Mehta',
        senderEmail: 'arjun@alpha.co',
        subject: 'Project Alpha Synthesis',
        snippet: 'The integration of the new node is complete...',
        body: 'The integration of the new node is complete. We are seeing 40% improvement in throughput.\n\nPlease review the attached quote for the next phase.',
        timestamp: new Date(Date.now() - 1500000),
        isRead: false,
        isOpened: true,
        isClientOnline: true,
        hasViewedQuote: true,
        category: 'focus',
        internalComments: [
            { id: 'c1', user: 'Sarah', text: 'Arjun is ready to move. Approving this today.', timestamp: new Date() }
        ]
    },
    {
        id: '2',
        sender: 'Elena Rossi',
        senderEmail: 'elena@arch.it',
        subject: 'Quarterly Architecture Review',
        snippet: 'Please find the attached design specs...',
        body: 'Please find the attached design specs for the 2026 ecosystem expansion. We need to validate the node infrastructure by EOD.',
        timestamp: new Date(Date.now() - 7200000),
        isRead: true,
        isOpened: false,
        isClientOnline: false,
        hasViewedQuote: false,
        category: 'focus',
        internalComments: []
    },
    {
        id: '3',
        sender: 'Node Update',
        senderEmail: 'system@iammail.app',
        subject: 'Weekly Maintenance Log',
        snippet: 'System node upgrade scheduled for Saturday...',
        body: 'Automated Log: No issues detected in region 4. Next upgrade window opens Saturday 02:00 UTC.',
        timestamp: new Date(Date.now() - 86400000),
        isRead: true,
        isOpened: false,
        isClientOnline: false,
        hasViewedQuote: false,
        category: 'other',
        internalComments: []
    }
];
