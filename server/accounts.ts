import { db } from './firebase';
import * as crypto from 'crypto';

// Encryption for passwords
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;

function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift()!, 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export interface EmailAccount {
    id: string;
    userId: string;
    email: string;
    provider: string;
    imapHost: string;
    imapPort: number;
    smtpHost: string;
    smtpPort: number;
    password: string; // Encrypted
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Zoho-specific fields for provisioned accounts
    zohoAccountId?: string;
    displayName?: string;
    createdViaIAM?: boolean;
}

export class AccountsService {
    private collection = db.collection('email_accounts');

    async createAccount(userId: string, accountData: {
        email: string;
        password: string;
        imapHost: string;
        imapPort: number;
        smtpHost: string;
        smtpPort: number;
        provider?: string;
    }): Promise<EmailAccount> {
        // Check if account with same email already exists for this user
        const existingSnapshot = await this.collection
            .where('userId', '==', userId)
            .where('email', '==', accountData.email)
            .limit(1)
            .get();

        if (!existingSnapshot.empty) {
            // Update existing account instead of creating duplicate
            const existingDoc = existingSnapshot.docs[0];
            const encryptedPassword = encrypt(accountData.password);

            await this.collection.doc(existingDoc.id).update({
                imapHost: accountData.imapHost,
                imapPort: accountData.imapPort,
                smtpHost: accountData.smtpHost,
                smtpPort: accountData.smtpPort,
                password: encryptedPassword,
                updatedAt: new Date()
            });

            const updatedDoc = await this.collection.doc(existingDoc.id).get();
            return { id: existingDoc.id, ...updatedDoc.data() as Omit<EmailAccount, 'id'> };
        }

        const encryptedPassword = encrypt(accountData.password);

        const account: Omit<EmailAccount, 'id'> = {
            userId,
            email: accountData.email,
            provider: accountData.provider || this.detectProvider(accountData.email),
            imapHost: accountData.imapHost,
            imapPort: accountData.imapPort,
            smtpHost: accountData.smtpHost,
            smtpPort: accountData.smtpPort,
            password: encryptedPassword,
            isActive: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await this.collection.add(account);
        return { id: docRef.id, ...account };
    }

    async getAccounts(userId: string): Promise<EmailAccount[]> {
        const snapshot = await this.collection.where('userId', '==', userId).get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<EmailAccount, 'id'>
        }));
    }

    async getActiveAccount(userId: string): Promise<EmailAccount | null> {
        const snapshot = await this.collection
            .where('userId', '==', userId)
            .where('isActive', '==', true)
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() as Omit<EmailAccount, 'id'> };
    }

    async setActiveAccount(userId: string, accountId: string): Promise<void> {
        // Deactivate all accounts for this user
        const accounts = await this.getAccounts(userId);
        const batch = db.batch();

        accounts.forEach(account => {
            const ref = this.collection.doc(account.id);
            batch.update(ref, { isActive: account.id === accountId, updatedAt: new Date() });
        });

        await batch.commit();
    }

    async deleteAccount(userId: string, accountId: string): Promise<void> {
        const doc = await this.collection.doc(accountId).get();
        const data = doc.data() as EmailAccount;

        if (data.userId !== userId) {
            throw new Error('Unauthorized');
        }

        await this.collection.doc(accountId).delete();
    }

    async getDecryptedPassword(accountId: string): Promise<string> {
        const doc = await this.collection.doc(accountId).get();
        const data = doc.data() as EmailAccount;
        return decrypt(data.password);
    }

    // Alias for createAccount with more flexible input
    async addAccount(userId: string, accountData: {
        email: string;
        password: string;
        provider?: string;
        imapHost?: string;
        imapPort?: number;
        smtpHost?: string;
        smtpPort?: number;
        displayName?: string;
        zohoAccountId?: string;
        createdViaIAM?: boolean;
        isActive?: boolean;
    }): Promise<EmailAccount> {
        const encryptedPassword = encrypt(accountData.password);

        // Auto-detect IMAP/SMTP settings if not provided
        const provider = accountData.provider || this.detectProvider(accountData.email);
        let imapHost = accountData.imapHost;
        let smtpHost = accountData.smtpHost;

        if (!imapHost || !smtpHost) {
            // Default to i.AM Mail (Zoho) settings for provisioned accounts
            if (provider === 'iam' || provider === 'zoho' || accountData.createdViaIAM) {
                imapHost = imapHost || 'imappro.zoho.com';
                smtpHost = smtpHost || 'smtppro.zoho.com';
            } else {
                // Generic fallback
                const domain = accountData.email.split('@')[1];
                imapHost = imapHost || `imap.${domain}`;
                smtpHost = smtpHost || `smtp.${domain}`;
            }
        }

        const account: Omit<EmailAccount, 'id'> = {
            userId,
            email: accountData.email,
            provider,
            imapHost: imapHost!,
            imapPort: accountData.imapPort || 993,
            smtpHost: smtpHost!,
            smtpPort: accountData.smtpPort || 465,
            password: encryptedPassword,
            isActive: accountData.isActive ?? false,
            createdAt: new Date(),
            updatedAt: new Date(),
            displayName: accountData.displayName,
            zohoAccountId: accountData.zohoAccountId,
            createdViaIAM: accountData.createdViaIAM,
        };

        const docRef = await this.collection.add(account);
        return { id: docRef.id, ...account };
    }

    // Update password for an account
    async updatePassword(userId: string, accountId: string, newPassword: string): Promise<void> {
        const doc = await this.collection.doc(accountId).get();
        const data = doc.data() as EmailAccount;

        if (data.userId !== userId) {
            throw new Error('Unauthorized');
        }

        const encryptedPassword = encrypt(newPassword);
        await this.collection.doc(accountId).update({
            password: encryptedPassword,
            updatedAt: new Date()
        });
    }

    // Deduplicate accounts - remove duplicates, keeping only the most recently updated
    async deduplicateAccounts(userId: string): Promise<{ removed: number; kept: string[] }> {
        const accounts = await this.getAccounts(userId);

        // Group by email
        const emailGroups: Record<string, EmailAccount[]> = {};
        accounts.forEach(acc => {
            if (!emailGroups[acc.email]) {
                emailGroups[acc.email] = [];
            }
            emailGroups[acc.email].push(acc);
        });

        const removed: string[] = [];
        const kept: string[] = [];

        // For each email with multiple accounts, keep only the most recent
        for (const email of Object.keys(emailGroups)) {
            const group = emailGroups[email];
            if (group.length > 1) {
                // Sort by updatedAt desc, keep the newest
                group.sort((a, b) => {
                    const aTime = a.updatedAt instanceof Date ? a.updatedAt.getTime() : new Date(a.updatedAt).getTime();
                    const bTime = b.updatedAt instanceof Date ? b.updatedAt.getTime() : new Date(b.updatedAt).getTime();
                    return bTime - aTime;
                });

                kept.push(group[0].id);

                // Delete the rest
                for (let i = 1; i < group.length; i++) {
                    await this.collection.doc(group[i].id).delete();
                    removed.push(group[i].id);
                }
            } else {
                kept.push(group[0].id);
            }
        }

        console.log(`Deduplication for ${userId}: removed ${removed.length} duplicates, kept ${kept.length} accounts`);
        return { removed: removed.length, kept };
    }

    private detectProvider(email: string): string {
        const domain = email.split('@')[1];
        if (domain.includes('gmail')) return 'Gmail';
        if (domain.includes('icloud') || domain.includes('me.com')) return 'iCloud';
        if (domain.includes('outlook') || domain.includes('hotmail')) return 'Outlook';
        if (domain.includes('titan')) return 'Titan';
        return 'i.AM Mail'; // Default to i.AM Mail for custom domains
    }
}

export const accountsService = new AccountsService();
