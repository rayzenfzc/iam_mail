
import React from 'react';

// Design system types
export type DesignVersion = 'prismatic' | 'tectonic' | 'liquid';
export type ViewMode = 'list' | 'view' | 'compose';
export type ThemeMode = 'dark' | 'light';
export type ViewType = 'inbox' | 'sent' | 'contacts' | 'calendar' | 'signature' | 'settings';

// App state enum (for App.tsx compatibility)
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

export interface Module {
    id: string;
    name: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

export interface Email {
    id: string;
    sender: string;
    initials: string;
    time: string;
    subject: string;
    preview: string;
    body?: string;
}

export interface Contact {
    id: string;
    name: string;
    initials: string;
    role: string;
    email: string;
    phone: string;
    status: 'online' | 'offline' | 'away';
}

export interface Appointment {
    id: string;
    title: string;
    time: string;
    duration: string;
    location?: string;
    date: string; // ISO format YYYY-MM-DD
    type: 'meeting' | 'task' | 'event';
}

// Alias for backward compatibility
export type CalendarEvent = Appointment;

export interface SettingItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    tier: number;
}

export interface CalendarDay {
    date: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
    isToday: boolean;
}

export interface Signature {
    id: string;
    title: string;
    content: string;
    isDefault: boolean;
    lastEdited: string;
}
