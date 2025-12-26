/**
 * Contacts Service - I AM MAIL
 * Manages contacts in Firestore with i.Pulse relationship scoring
 */

import { getFirestore } from 'firebase-admin/firestore';

export interface Contact {
    id: string;
    userId: string;
    name: string;
    email: string;
    role?: string;
    company?: string;
    avatar?: string;
    phone?: string;
    lastContacted?: Date;
    relationshipScore: number; // 0-100 i.Pulse score
    aiNotes?: string;
    emailsSent: number;
    emailsReceived: number;
    source: 'gmail' | 'outlook' | 'manual' | 'imported';
    createdAt: Date;
    updatedAt: Date;
}

export class ContactsService {
    private db = getFirestore();
    private collection = this.db.collection('contacts');

    /**
     * Get all contacts for a user
     */
    async getContacts(userId: string): Promise<Contact[]> {
        const snapshot = await this.collection
            .where('userId', '==', userId)
            .orderBy('relationshipScore', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Contact, 'id'>
        }));
    }

    /**
     * Get a single contact
     */
    async getContact(userId: string, contactId: string): Promise<Contact | null> {
        const doc = await this.collection.doc(contactId).get();

        if (!doc.exists) return null;

        const data = doc.data() as Omit<Contact, 'id'>;
        if (data.userId !== userId) return null;

        return { id: doc.id, ...data };
    }

    /**
     * Create a new contact
     */
    async createContact(userId: string, data: Omit<Contact, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'emailsSent' | 'emailsReceived' | 'relationshipScore'>): Promise<Contact> {
        const contact: Omit<Contact, 'id'> = {
            userId,
            name: data.name,
            email: data.email,
            role: data.role || '',
            company: data.company || '',
            avatar: data.avatar,
            phone: data.phone,
            lastContacted: data.lastContacted,
            relationshipScore: 50, // Start with neutral score
            aiNotes: data.aiNotes || '',
            emailsSent: 0,
            emailsReceived: 0,
            source: data.source || 'manual',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await this.collection.add(contact);
        return { id: docRef.id, ...contact };
    }

    /**
     * Update a contact
     */
    async updateContact(userId: string, contactId: string, updates: Partial<Omit<Contact, 'id' | 'userId' | 'createdAt'>>): Promise<Contact> {
        const doc = await this.collection.doc(contactId).get();

        if (!doc.exists) {
            throw new Error('Contact not found');
        }

        const existing = doc.data() as Omit<Contact, 'id'>;
        if (existing.userId !== userId) {
            throw new Error('Unauthorized');
        }

        const updateData = {
            ...updates,
            updatedAt: new Date()
        };

        await this.collection.doc(contactId).update(updateData);

        return {
            id: contactId,
            ...existing,
            ...updateData
        } as Contact;
    }

    /**
     * Delete a contact
     */
    async deleteContact(userId: string, contactId: string): Promise<void> {
        const doc = await this.collection.doc(contactId).get();

        if (!doc.exists) {
            throw new Error('Contact not found');
        }

        const data = doc.data() as Omit<Contact, 'id'>;
        if (data.userId !== userId) {
            throw new Error('Unauthorized');
        }

        await this.collection.doc(contactId).delete();
    }

    /**
     * Update relationship score (i.Pulse)
     * Formula: (emailsSent + emailsReceived) * recencyFactor
     */
    async updateRelationshipScore(userId: string, contactId: string): Promise<number> {
        const contact = await this.getContact(userId, contactId);
        if (!contact) throw new Error('Contact not found');

        // Calculate recency factor (1.0 = today, decays over 30 days)
        const lastContact = contact.lastContacted ? new Date(contact.lastContacted) : new Date(0);
        const daysSinceContact = (Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24);
        const recencyFactor = Math.max(0.1, 1 - (daysSinceContact / 30));

        // Base score from email activity
        const activityScore = Math.min(50, (contact.emailsSent + contact.emailsReceived) * 2);

        // Final score (0-100)
        const score = Math.round(activityScore + (recencyFactor * 50));

        await this.updateContact(userId, contactId, { relationshipScore: score });

        return score;
    }

    /**
     * Increment email counters when sending/receiving
     */
    async recordEmailActivity(userId: string, email: string, type: 'sent' | 'received'): Promise<void> {
        const snapshot = await this.collection
            .where('userId', '==', userId)
            .where('email', '==', email)
            .limit(1)
            .get();

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const data = doc.data() as Omit<Contact, 'id'>;

            const updates: any = {
                lastContacted: new Date(),
                updatedAt: new Date()
            };

            if (type === 'sent') {
                updates.emailsSent = (data.emailsSent || 0) + 1;
            } else {
                updates.emailsReceived = (data.emailsReceived || 0) + 1;
            }

            await this.collection.doc(doc.id).update(updates);

            // Recalculate score
            await this.updateRelationshipScore(userId, doc.id);
        }
    }

    /**
     * Search contacts
     */
    async searchContacts(userId: string, query: string): Promise<Contact[]> {
        // Get all contacts for user (Firestore doesn't support text search natively)
        const all = await this.getContacts(userId);

        const lowerQuery = query.toLowerCase();
        return all.filter(c =>
            c.name.toLowerCase().includes(lowerQuery) ||
            c.email.toLowerCase().includes(lowerQuery) ||
            c.company?.toLowerCase().includes(lowerQuery)
        );
    }
}

export const contactsService = new ContactsService();
