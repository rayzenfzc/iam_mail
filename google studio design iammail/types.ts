
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

export interface Email {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  read: boolean;
  type: 'focus' | 'other' | 'draft';
  hasReceipt?: boolean;
  isQuote?: boolean;
  attachments?: Attachment[];
  thread?: Email[]; // For conversation view
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

export type TabType = 'focus' | 'other';
export type ViewType = 'inbox' | 'calendar' | 'contacts' | 'archive' | 'drafts' | 'sent' | 'deleted' | 'history' | 'junk' | 'notes' | 'security' | 'alerts' | 'settings';

export interface ComposerSnippet {
  trigger: string;
  label: string;
  text: string;
}
