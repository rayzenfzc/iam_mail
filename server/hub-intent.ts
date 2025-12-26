import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

interface ParsedIntent {
    type: 'email' | 'calendar' | 'contacts' | 'settings' | 'search' | 'analysis' | 'help';
    action: string;
    entities: Record<string, any>;
    preview?: {
        type: string;
        title: string;
        description: string;
        payload: Record<string, any>;
        actions: { id: string; label: string; variant: string }[];
    };
    clarifications?: { field: string; question: string }[];
    confidence: number;
}

interface HubContext {
    currentScreen: string;
    selectedEmail?: {
        id: string;
        subject: string;
        sender: string;
        senderEmail: string;
        body: string;
    };
}

const INTENT_PARSER_PROMPT = `You are the intent parser for i.AM Mail, an AI-powered email client.

Parse the user's message and extract a structured intent. Be smart about understanding natural language.

CURRENT CONTEXT:
- Screen: {currentScreen}
- Selected Email: {selectedEmail}

USER MESSAGE: {userMessage}

DETECT ONE OF THESE INTENTS:

EMAIL INTENTS:
- email.new: User wants to compose a new email
- email.reply: User wants to reply to current email
- email.forward: User wants to forward current email
- email.summarize: User wants a summary of current email
- email.rewrite: User wants to modify draft (shorter, longer, professional, casual)
- email.schedule: User wants to schedule send
- email.archive: User wants to archive email
- email.delete: User wants to delete email
- email.search: User wants to search emails

CALENDAR INTENTS:
- calendar.add: User wants to create a meeting
- calendar.search: User wants to see meetings
- calendar.update: User wants to reschedule
- calendar.delete: User wants to cancel meeting
- calendar.availability: User wants to find free time
- calendar.analyze: User wants meeting analytics

CONTACTS INTENTS:
- contacts.add: User wants to add a contact
- contacts.search: User wants to find contacts
- contacts.update: User wants to update contact

SETTINGS INTENTS:
- settings.toggle: User wants to toggle a setting (theme, notifications, etc)
- settings.update: User wants to change a setting
- settings.account.add: User wants to add email account
- settings.export: User wants to export data

OTHER INTENTS:
- search: General search query
- analysis: Analytics request
- help: User wants help

OUTPUT JSON (strict format):
{
  "type": "<main type>",
  "action": "<specific action>",
  "entities": {
    "recipients": [{"name": "...", "email": "...", "type": "to"}],
    "subject": "...",
    "body": "...",
    "sendTime": "...",
    "rewriteStyle": "shorter|longer|professional|casual|friendly",
    "title": "...",
    "startTime": "ISO datetime",
    "duration": 30,
    "attendees": ["..."],
    "contactName": "...",
    "contactEmail": "...",
    "settingKey": "theme|notifications|...",
    "settingValue": "...",
    "query": "..."
  },
  "preview": {
    "type": "email|calendar|contact|setting",
    "title": "Human readable title",
    "description": "What will happen",
    "payload": { ... complete data for action ... },
    "actions": [
      {"id": "confirm", "label": "Confirm", "variant": "primary"},
      {"id": "edit", "label": "Edit", "variant": "secondary"},
      {"id": "cancel", "label": "Cancel", "variant": "danger"}
    ]
  },
  "clarifications": [
    {"field": "recipient", "question": "Who should I send this to?"}
  ],
  "confidence": 0.95
}

RULES:
1. Extract as much as possible from the message
2. For email drafts, generate professional body text based on context
3. Only add clarifications for CRITICAL missing fields (like recipient for new email)
4. For replies/forwards, use the selected email context
5. Be concise but complete
6. Always include preview for actions that need confirmation
7. Return valid JSON only, no markdown

OUTPUT:`;

export async function parseHubIntent(message: string, context: HubContext): Promise<ParsedIntent> {
    try {
        // Prepare prompt
        const prompt = INTENT_PARSER_PROMPT
            .replace('{currentScreen}', context.currentScreen || 'inbox')
            .replace('{selectedEmail}', context.selectedEmail
                ? JSON.stringify({
                    subject: context.selectedEmail.subject,
                    sender: context.selectedEmail.sender,
                    senderEmail: context.selectedEmail.senderEmail,
                    bodyPreview: context.selectedEmail.body?.slice(0, 500)
                })
                : 'None'
            )
            .replace('{userMessage}', message);

        const response = await genAI.models.generateContent({
            model: 'gemini-2.0-flash-lite',
            contents: prompt,
            config: {
                temperature: 0.3,
                maxOutputTokens: 2000,
            },
        });

        const responseText = response.text || '';

        // Clean up response - remove markdown code blocks if present
        let cleanJson = responseText.trim();
        if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.slice(7);
        }
        if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.slice(3);
        }
        if (cleanJson.endsWith('```')) {
            cleanJson = cleanJson.slice(0, -3);
        }
        cleanJson = cleanJson.trim();

        // Parse JSON response
        const parsed = JSON.parse(cleanJson);

        // Validate and return
        return {
            type: parsed.type || 'help',
            action: parsed.action || 'unknown',
            entities: parsed.entities || {},
            preview: parsed.preview,
            clarifications: parsed.clarifications,
            confidence: parsed.confidence || 0.5,
        };

    } catch (error) {
        console.error('Intent parsing error:', error);

        // Fallback: try to detect intent from keywords
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('email') || lowerMessage.includes('compose') || lowerMessage.includes('write')) {
            return {
                type: 'email',
                action: 'new',
                entities: { body: message },
                confidence: 0.3,
            };
        }

        if (lowerMessage.includes('reply')) {
            return {
                type: 'email',
                action: 'reply',
                entities: { body: message },
                confidence: 0.3,
            };
        }

        if (lowerMessage.includes('meeting') || lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
            return {
                type: 'calendar',
                action: 'add',
                entities: {},
                confidence: 0.3,
            };
        }

        if (lowerMessage.includes('dark') || lowerMessage.includes('theme') || lowerMessage.includes('light')) {
            return {
                type: 'settings',
                action: 'toggle',
                entities: { settingKey: 'theme' },
                confidence: 0.5,
            };
        }

        if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
            return {
                type: 'search',
                action: 'query',
                entities: { query: message },
                confidence: 0.4,
            };
        }

        if (lowerMessage.includes('help') || lowerMessage === '?') {
            return {
                type: 'help',
                action: 'show',
                entities: {},
                confidence: 1.0,
            };
        }

        // Default fallback
        return {
            type: 'help',
            action: 'unknown',
            entities: {},
            clarifications: [{ field: 'intent', question: "I'm not sure what you'd like to do. Can you rephrase?" }],
            confidence: 0.1,
        };
    }
}

// Execute parsed intent
export async function executeHubIntent(intent: ParsedIntent, userId?: string): Promise<{ success: boolean; message: string; data?: any }> {
    try {
        switch (intent.type) {
            case 'email':
                // Email actions are handled client-side via callbacks
                return { success: true, message: 'Email action queued' };

            case 'calendar':
                // Calendar actions would integrate with calendar service
                return { success: true, message: 'Calendar action queued' };

            case 'contacts':
                // Contacts actions would integrate with contacts service
                return { success: true, message: 'Contact action queued' };

            case 'settings':
                // Settings actions are mostly handled client-side
                return { success: true, message: 'Setting updated' };

            case 'search':
                // Search would query the email database
                return { success: true, message: 'Search executed', data: [] };

            case 'help':
                return { success: true, message: 'Help displayed' };

            default:
                return { success: false, message: 'Unknown intent type' };
        }
    } catch (error) {
        console.error('Intent execution error:', error);
        return { success: false, message: 'Execution failed' };
    }
}
