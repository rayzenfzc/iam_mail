
export enum ViewState {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD'
}

export type ThemeMode = 'light' | 'dark';
export type AppTheme = 'titanium' | 'onyx' | 'indigo' | 'bronze';

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'archive' | 'other';
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
  senderName: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  read: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash' | 'junk' | 'history' | 'notes';
  category: 'focus' | 'other';
  urgencyScore: number; // 0-100
  aiSummary?: string;
  aiSmartReplies?: string[];
  tracking?: TrackingData;
  attachments?: Attachment[];
  thread?: Email[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  avatar?: string;
  lastContacted: string;
  relationshipScore: number; // 0-100
  aiNotes: string; // e.g., "Prefer morning meetings"
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;
  type: 'meeting' | 'focus' | 'ooo';
  participants: string[];
  description?: string;
}

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
