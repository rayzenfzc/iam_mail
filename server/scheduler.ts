import { db } from './accounts';
import nodemailer from 'nodemailer';

export interface ScheduledEmail {
    id: string;
    userId: string;
    to: string;
    subject: string;
    body: string;
    scheduledAt: Date;
    status: 'pending' | 'sent' | 'failed';
    createdAt: Date;
    sentAt?: Date;
    error?: string;
}

export class SchedulerService {
    private collection = db.collection('scheduled_emails');
    private interval: NodeJS.Timeout | null = null;

    async scheduleEmail(userId: string, email: {
        to: string;
        subject: string;
        body: string;
        scheduledAt: Date;
    }): Promise<ScheduledEmail> {
        const id = require('crypto').randomUUID();

        const scheduled: Omit<ScheduledEmail, 'id'> = {
            userId,
            to: email.to,
            subject: email.subject,
            body: email.body,
            scheduledAt: email.scheduledAt,
            status: 'pending',
            createdAt: new Date()
        };

        await this.collection.doc(id).set(scheduled);
        return { id, ...scheduled };
    }

    async getScheduledEmails(userId: string): Promise<ScheduledEmail[]> {
        const snapshot = await this.collection
            .where('userId', '==', userId)
            .where('status', '==', 'pending')
            .orderBy('scheduledAt', 'asc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<ScheduledEmail, 'id'>
        }));
    }

    async cancelScheduledEmail(userId: string, emailId: string): Promise<void> {
        const doc = await this.collection.doc(emailId).get();
        const data = doc.data() as ScheduledEmail;

        if (data.userId !== userId) {
            throw new Error('Unauthorized');
        }

        await this.collection.doc(emailId).delete();
    }

    // Cron job - Check and send pending emails every minute
    startScheduler() {
        console.log('📅 Starting email scheduler...');

        this.interval = setInterval(async () => {
            try {
                await this.processPendingEmails();
            } catch (error) {
                console.error('Scheduler error:', error);
            }
        }, 60000); // Every minute
    }

    stopScheduler() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    private async processPendingEmails() {
        const now = new Date();

        // Get all pending emails that should be sent
        const snapshot = await this.collection
            .where('status', '==', 'pending')
            .where('scheduledAt', '<=', now)
            .limit(50)
            .get();

        if (snapshot.empty) return;

        console.log(`📨 Processing ${snapshot.size} scheduled emails...`);

        for (const doc of snapshot.docs) {
            const email = { id: doc.id, ...doc.data() } as ScheduledEmail;

            try {
                await this.sendScheduledEmail(email);

                await this.collection.doc(email.id).update({
                    status: 'sent',
                    sentAt: new Date()
                });

                console.log(`✅ Sent scheduled email: ${email.subject} to ${email.to}`);
            } catch (error: any) {
                console.error(`❌ Failed to send ${email.id}:`, error.message);

                await this.collection.doc(email.id).update({
                    status: 'failed',
                    error: error.message
                });
            }
        }
    }

    private async sendScheduledEmail(email: ScheduledEmail) {
        const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT } = process.env;

        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
            throw new Error('SMTP not configured');
        }

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT || '587'),
            secure: parseInt(SMTP_PORT || '587') === 465,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: SMTP_USER,
            to: email.to,
            subject: email.subject,
            text: email.body,
            html: `<p>${email.body.replace(/\n/g, '</p><p>')}</p>`
        });
    }
}

export const schedulerService = new SchedulerService();

// Start scheduler on import (in production)
if (process.env.NODE_ENV === 'production') {
    schedulerService.startScheduler();
}
