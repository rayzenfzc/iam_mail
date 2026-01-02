/**
 * Email Service - Centralized API calls for email operations
 */

const API_URL = import.meta.env.VITE_API_URL || '';

export interface BackendEmail {
    id: string;
    sender: string;
    senderEmail: string;
    subject: string;
    snippet?: string;
    preview?: string;
    body: string;
    timestamp: string;
    isRead: boolean;
    hasAttachments?: boolean;
    category?: string;
}

export interface Contact {
    id: string | number;
    name: string;
    email: string;
    role?: string;
    company?: string;
    phone?: string;
    avatar?: string;
    lastContacted?: string;
    relationshipScore?: number;
    aiNotes?: string;
}

export interface CalendarEvent {
    id: string | number;
    title: string;
    date: string;
    time: string;
    location?: string;
    description?: string;
}

export interface SendEmailData {
    to: string[];
    subject: string;
    body: string;
    attachments?: any[];
}

/**
 * Fetch emails from IMAP backend
 */
export async function fetchEmails(limit: number = 50): Promise<BackendEmail[]> {
    try {
        const response = await fetch(`${API_URL}/api/imap/emails?limit=${limit}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch emails');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch emails:', error);
        throw error;
    }
}

/**
 * Send email via SMTP backend
 */
export async function sendEmail(emailData: SendEmailData): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch(`${API_URL}/api/smtp/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send email');
        }

        const data = await response.json();
        return { success: true, message: data.message || 'Email sent successfully' };
    } catch (error: any) {
        console.error('Failed to send email:', error);
        return { success: false, message: error.message || 'Failed to send email' };
    }
}

/**
 * Fetch contacts from backend
 */
export async function fetchContacts(userId?: string): Promise<Contact[]> {
    try {
        const userParam = userId || localStorage.getItem('iam_email_user') || 'default';
        const response = await fetch(`${API_URL}/api/contacts?userId=${encodeURIComponent(userParam)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }

        const data = await response.json();
        return data.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            role: c.role || '',
            company: c.company || '',
            phone: c.phone || '',
            avatar: c.avatar,
            lastContacted: c.lastContacted ? formatRelativeTime(c.lastContacted) : 'Never',
            relationshipScore: c.relationshipScore || 50,
            aiNotes: c.aiNotes || ''
        }));
    } catch (error) {
        console.error('Failed to fetch contacts:', error);
        return [];
    }
}

/**
 * Fetch calendar events from backend
 */
export async function fetchCalendarEvents(userId?: string): Promise<CalendarEvent[]> {
    try {
        const userParam = userId || localStorage.getItem('iam_email_user') || 'default';
        const response = await fetch(`${API_URL}/api/calendar/events?userId=${encodeURIComponent(userParam)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch calendar events');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch calendar events:', error);
        return [];
    }
}

/**
 * Check if email accounts are configured
 */
export async function checkEmailAccounts(token?: string): Promise<boolean> {
    try {
        const authToken = token || localStorage.getItem('auth_token');
        const userId = localStorage.getItem('user_email') ||
            localStorage.getItem('userEmail') ||
            localStorage.getItem('saved_email') ||
            localStorage.getItem('userId');

        // First try to check for configured accounts with userId
        if (authToken) {
            const accountsUrl = userId
                ? `${API_URL}/api/accounts?userId=${encodeURIComponent(userId)}`
                : `${API_URL}/api/accounts`;

            const response = await fetch(accountsUrl, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (response.ok) {
                const accounts = await response.json();
                if (accounts && accounts.length > 0) {
                    return true;
                }
            }
        }

        // Fallback: Try to fetch emails directly to check if env vars are configured
        const emailCheck = await fetch(`${API_URL}/api/imap/emails?limit=1`);
        if (emailCheck.ok) {
            const emails = await emailCheck.json();
            if (emails && emails.length > 0) {
                return true;
            }
        }

        // If nothing works, still allow local testing
        if (window.location.hostname === 'localhost') {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Failed to check email accounts:', error);
        // On error, still try to connect for local dev
        if (window.location.hostname === 'localhost') {
            return true;
        }
        return false;
    }
}

/**
 * Helper: Format relative time
 */
function formatRelativeTime(dateInput: any): string {
    if (!dateInput) return 'Never';
    const date = dateInput._seconds ? new Date(dateInput._seconds * 1000) : new Date(dateInput);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

/**
 * Helper: Format email time
 */
export function formatEmailTime(timestamp: string): string {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
