/**
 * AI Service Client - Frontend utilities for calling backend AI APIs
 */

const API_URL = import.meta.env.VITE_API_URL || '';

interface AIComposeParams {
    to?: string;
    subject?: string;
    context?: string;
    tone?: 'professional' | 'casual' | 'friendly';
    length?: 'short' | 'medium' | 'long';
}

interface AIComposeResult {
    subject: string;
    body: string;
}

interface AISummarizeParams {
    subject: string;
    from: string;
    body: string;
}

interface AIInterpretResult {
    type: 'COMPOSE_EMAIL' | 'SCHEDULE_EMAIL' | 'SEARCH' | 'NAVIGATE' | 'SET_REMINDER' | 'UNKNOWN';
    subject?: string;
    to?: string;
    body?: string;
    scheduledAt?: string;
    query?: string;
    view?: string;
    reminderText?: string;
    reminderDate?: string;
}

/**
 * Interpret a natural language command into a structured action
 */
export async function interpretCommand(command: string, context?: {
    currentView?: string;
    userName?: string;
}): Promise<AIInterpretResult> {
    const token = localStorage.getItem('auth_token');

    const response = await fetch(`${API_URL}/api/ai/interpret`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({ command, context })
    });

    if (!response.ok) {
        throw new Error('AI service unavailable');
    }

    return response.json();
}

/**
 * Generate an email draft using AI
 */
export async function composeEmail(params: AIComposeParams): Promise<AIComposeResult> {
    const token = localStorage.getItem('auth_token');

    const response = await fetch(`${API_URL}/api/ai/compose`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify(params)
    });

    if (!response.ok) {
        throw new Error('Failed to compose email');
    }

    return response.json();
}

/**
 * Summarize an email thread
 */
export async function summarizeEmail(params: AISummarizeParams): Promise<string> {
    const token = localStorage.getItem('auth_token');

    const response = await fetch(`${API_URL}/api/ai/summarize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({
            subject: params.subject,
            from: params.from,
            body: params.body
        })
    });

    if (!response.ok) {
        throw new Error('Failed to summarize email');
    }

    const data = await response.json();
    return data.summary || 'Unable to summarize';
}

/**
 * Generate smart reply suggestions for an email
 */
export async function generateSmartReplies(email: {
    subject: string;
    from: string;
    body: string;
}): Promise<string[]> {
    const token = localStorage.getItem('auth_token');

    try {
        const response = await fetch(`${API_URL}/api/ai/smart-replies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token || ''}`
            },
            body: JSON.stringify(email)
        });

        if (!response.ok) {
            return getDefaultReplies();
        }

        const data = await response.json();
        return data.replies || getDefaultReplies();
    } catch {
        return getDefaultReplies();
    }
}

function getDefaultReplies(): string[] {
    return [
        "Thanks for your email. I'll get back to you soon.",
        "Got it, I'll follow up on this shortly.",
        "Thanks for letting me know!"
    ];
}
