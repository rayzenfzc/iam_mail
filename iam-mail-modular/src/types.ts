import React from 'react';

export type ActiveView =
  | 'inbox'
  | 'outbox_pending'
  | 'outbox_failed'
  | 'sent'
  | 'calendar'
  | 'contacts'
  | 'settings'
  | 'compose';

export type SendStatus = 'pending' | 'sending' | 'sent' | 'failed' | 'queued_offline';

export interface SendQueueItem {
  id: string;
  to: string;
  subject: string;
  body: string;
  createdAt: number;
  sendAt: number; // createdAt + 5000
  status: SendStatus;
  error?: string;
}

export interface MailItem {
  id: string | number;
  type: 'mail';
  sender: string;
  subject: string;
  time: string;
  status: 'UNREAD' | 'URGENT' | 'REVIEW' | 'PENDING' | 'READ';
  body: string;
}

export interface ContactItem {
  id: string | number;
  type: 'contact';
  name: string;
  role: string;
  status: string;
  email: string;
}

export interface EventItem {
  id: string | number;
  type: 'event';
  title: string;
  time: string;
  date: string;
  location: string;
}

export interface SystemItem {
  id: string | number;
  type: string;
  label?: string; // For settings
  value?: string; // For settings
  
  // Unify status to generic string to avoid conflicts between MailItem and ContactItem
  status?: string;

  // MailItem properties
  sender?: string;
  subject?: string;
  time?: string;
  body?: string;

  // ContactItem properties
  name?: string;
  role?: string;
  email?: string;

  // EventItem properties
  title?: string;
  date?: string;
  location?: string;
}

export interface MessageThreadItem extends SystemItem {
  index: number;
  total: number;
  isMe?: boolean;
  attachments?: { name: string; size: string }[];
}

export interface SmartAction {
  label: string;
  handler: () => void;
  icon?: React.ReactNode;
  primary?: boolean;
  disabled?: boolean;
}

export type DockContext = 
  | 'inbox_home'
  | 'reading'
  | 'compose'
  | 'contacts'
  | 'calendar'
  | 'settings'
  | 'list_view' 
  | 'thread_view' 
  | 'compose_view' 
  | 'picker_view';
