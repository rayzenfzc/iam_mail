import { GoogleGenAI } from "@google/genai";

const AI_API_KEY = process.env.API_KEY;

if (!AI_API_KEY) {
    console.warn('⚠️  No Gemini API key found. AI features will be disabled.');
}

export interface PendingAction {
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

export class AIService {
    private ai: GoogleGenAI | null;

    constructor() {
        this.ai = AI_API_KEY ? new GoogleGenAI({ apiKey: AI_API_KEY }) : null;
    }

    /**
     * Interpret user's natural language command and return structured action
     */
    async interpretCommand(command: string, context?: {
        currentView?: string;
        recentEmails?: string[];
        userName?: string;
    }): Promise<PendingAction> {
        if (!this.ai) {
            throw new Error('AI service not configured');
        }

        const systemPrompt = `You are an AI assistant for an email client called "i AM MAIL". 
Your job is to interpret the user's natural language command and return a JSON response matching this exact schema:

{
  "type": "COMPOSE_EMAIL" | "SCHEDULE_EMAIL" | "SEARCH" | "NAVIGATE" | "SET_REMINDER" | "UNKNOWN",
  "subject": "string (optional)",
  "to": "email@example.com (optional)",
  "body": "string (optional)",
  "scheduledAt": "ISO 8601 datetime (optional)",
  "query": "string (optional)",
  "view": "inbox|sent|drafts|calendar|contacts (optional)",
  "reminderText": "string (optional)",
  "reminderDate": "ISO 8601 datetime (optional)"
}

Rules:
1. COMPOSE_EMAIL: User wants to send/write/draft an email now
2. SCHEDULE_EMAIL: User wants to send email at specific time/date
3. SEARCH: User wants to find specific emails
4. NAVIGATE: User wants to go to different view/folder
5. SET_REMINDER: User wants to set reminder about something
6. UNKNOWN: Can't determine intent

Examples:
- "email john about project" → COMPOSE_EMAIL with to="john@...", subject="project"
- "remind me to call Sarah tomorrow at 2pm" → SET_REMINDER
- "show me emails from last week" → SEARCH with query
- "go to calendar" → NAVIGATE with view="calendar"
- "send happy birthday to mom at 8am tomorrow" → SCHEDULE_EMAIL

Context: ${JSON.stringify(context || {})}

IMPORTANT: Return ONLY valid JSON. No explanations.`;

        try {
            const response = await this.ai.models.generateContent({
                model: "gemini-2.0-flash-lite",
                contents: [{
                    role: 'user',
                    parts: [{ text: `${systemPrompt}\n\nUser command: "${command}"` }]
                }],
                config: {
                    temperature: 0.3,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 500,
                }
            });

            const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

            // Extract JSON from response (in case AI adds markdown)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? jsonMatch[0] : text;

            const action: PendingAction = JSON.parse(jsonText);
            return action;

        } catch (error: any) {
            console.error('AI interpretation error:', error);
            return { type: 'UNKNOWN' };
        }
    }

    /**
     * Generate email draft using AI
     */
    async composeEmail(params: {
        to?: string;
        subject?: string;
        context?: string;
        tone?: 'professional' | 'casual' | 'friendly';
        length?: 'short' | 'medium' | 'long';
    }): Promise<{ subject: string; body: string }> {
        if (!this.ai) {
            throw new Error('AI service not configured');
        }

        const { to, subject, context, tone = 'professional', length = 'medium' } = params;

        const lengthGuidance = {
            short: '2-3 sentences',
            medium: '1 paragraph (4-6 sentences)',
            long: '2-3 paragraphs'
        };

        const prompt = `Compose a ${tone} email with the following details:
To: ${to || 'recipient'}
Subject: ${subject || 'to be determined'}
Context: ${context || 'general correspondence'}

Requirements:
- Tone: ${tone}
- Length: ${lengthGuidance[length]}
- Include appropriate greeting and closing
- Be clear and concise
- Professional formatting

Return JSON with "subject" and "body" keys. The body should be plain text with \n for line breaks.`;

        try {
            const response = await this.ai.models.generateContent({
                model: "gemini-2.0-flash-lite",
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    temperature: 0.7,
                    topP: 0.9,
                    maxOutputTokens: 1000,
                }
            });

            const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? jsonMatch[0] : text;

            const result = JSON.parse(jsonText);
            return {
                subject: result.subject || subject || 'New Email',
                body: result.body || ''
            };

        } catch (error: any) {
            console.error('Email composition error:', error);
            throw new Error('Failed to compose email');
        }
    }

    /**
     * Summarize email thread
     */
    async summarizeEmail(emailContent: {
        subject: string;
        from: string;
        body: string;
        previousMessages?: string[];
    }): Promise<string> {
        if (!this.ai) {
            throw new Error('AI service not configured');
        }

        const prompt = `Summarize this email in 1-2 sentences. Focus on key points and action items.

From: ${emailContent.from}
Subject: ${emailContent.subject}

Body:
${emailContent.body.substring(0, 2000)}

${emailContent.previousMessages?.length ? `\nPrevious messages:\n${emailContent.previousMessages.join('\n---\n')}` : ''}

Return ONLY the summary text, no JSON.`;

        try {
            const response = await this.ai.models.generateContent({
                model: "gemini-2.0-flash-lite",
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    temperature: 0.3,
                    maxOutputTokens: 200,
                }
            });

            return response.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to summarize';

        } catch (error: any) {
            console.error('Email summarization error:', error);
            return 'Summary unavailable';
        }
    }
}

export const aiService = new AIService();
