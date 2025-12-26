import { db } from './firebase';
import crypto from 'crypto';

export interface CalendarEvent {
    id: string;
    userId: string;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    location?: string;
    attendees?: string[];
    color?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Opportunity {
    id: string;
    userId: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
    estimatedValue?: number;
    contactName?: string;
    contactEmail?: string;
    source?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export class CalendarService {
    private eventsCollection = db.collection('calendar_events');
    private opportunitiesCollection = db.collection('opportunities');

    // ============================================
    // EVENTS
    // ============================================

    async createEvent(userId: string, event: Omit<CalendarEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> {
        const id = crypto.randomUUID();

        const newEvent: Omit<CalendarEvent, 'id'> = {
            userId,
            ...event,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await this.eventsCollection.doc(id).set(newEvent);
        return { id, ...newEvent };
    }

    async getEvents(userId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
        let query = this.eventsCollection.where('userId', '==', userId);

        if (startDate) {
            query = query.where('startDate', '>=', startDate) as any;
        }
        if (endDate) {
            query = query.where('endDate', '<=', endDate) as any;
        }

        const snapshot = await query.orderBy('startDate', 'asc').get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<CalendarEvent, 'id'>
        }));
    }

    async getEvent(userId: string, eventId: string): Promise<CalendarEvent | null> {
        const doc = await this.eventsCollection.doc(eventId).get();
        if (!doc.exists) return null;

        const data = doc.data() as CalendarEvent;
        if (data.userId !== userId) return null;

        return { id: doc.id, ...data };
    }

    async updateEvent(userId: string, eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
        const doc = await this.eventsCollection.doc(eventId).get();
        if (!doc.exists) return null;

        const data = doc.data() as CalendarEvent;
        if (data.userId !== userId) return null;

        const updated = {
            ...updates,
            updatedAt: new Date()
        };

        await this.eventsCollection.doc(eventId).update(updated);

        return {
            id: eventId,
            ...data,
            ...updated
        } as CalendarEvent;
    }

    async deleteEvent(userId: string, eventId: string): Promise<void> {
        const doc = await this.eventsCollection.doc(eventId).get();
        if (!doc.exists) return;

        const data = doc.data() as CalendarEvent;
        if (data.userId !== userId) {
            throw new Error('Unauthorized');
        }

        await this.eventsCollection.doc(eventId).delete();
    }

    // ============================================
    // OPPORTUNITIES (i.Stream)
    // ============================================

    async createOpportunity(userId: string, opportunity: Omit<Opportunity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Opportunity> {
        const id = crypto.randomUUID();

        const newOpp: Omit<Opportunity, 'id'> = {
            userId,
            ...opportunity,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await this.opportunitiesCollection.doc(id).set(newOpp);
        return { id, ...newOpp };
    }

    async getOpportunities(userId: string, filters?: {
        status?: string;
        priority?: string;
    }): Promise<Opportunity[]> {
        let query = this.opportunitiesCollection.where('userId', '==', userId);

        if (filters?.status) {
            query = query.where('status', '==', filters.status) as any;
        }
        if (filters?.priority) {
            query = query.where('priority', '==', filters.priority) as any;
        }

        const snapshot = await query.orderBy('createdAt', 'desc').get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Opportunity, 'id'>
        }));
    }

    async updateOpportunity(userId: string, oppId: string, updates: Partial<Opportunity>): Promise<Opportunity | null> {
        const doc = await this.opportunitiesCollection.doc(oppId).get();
        if (!doc.exists) return null;

        const data = doc.data() as Opportunity;
        if (data.userId !== userId) return null;

        const updated = {
            ...updates,
            updatedAt: new Date()
        };

        await this.opportunitiesCollection.doc(oppId).update(updated);

        return {
            id: oppId,
            ...data,
            ...updated
        } as Opportunity;
    }

    async deleteOpportunity(userId: string, oppId: string): Promise<void> {
        const doc = await this.opportunitiesCollection.doc(oppId).get();
        if (!doc.exists) return;

        const data = doc.data() as Opportunity;
        if (data.userId !== userId) {
            throw new Error('Unauthorized');
        }

        await this.opportunitiesCollection.doc(oppId).delete();
    }

    // ============================================
    // CONVERT OPPORTUNITY TO EVENT
    // ============================================

    async convertOpportunityToEvent(
        userId: string,
        oppId: string,
        eventDetails: {
            startDate: Date;
            endDate: Date;
            allDay?: boolean;
            location?: string;
        }
    ): Promise<CalendarEvent> {
        // Get opportunity
        const oppDoc = await this.opportunitiesCollection.doc(oppId).get();
        if (!oppDoc.exists) {
            throw new Error('Opportunity not found');
        }

        const opp = oppDoc.data() as Opportunity;
        if (opp.userId !== userId) {
            throw new Error('Unauthorized');
        }

        // Create event from opportunity
        const event = await this.createEvent(userId, {
            title: opp.title,
            description: opp.description || `Opportunity: ${opp.contactName || 'Unknown'}`,
            startDate: eventDetails.startDate,
            endDate: eventDetails.endDate,
            allDay: eventDetails.allDay || false,
            location: eventDetails.location,
            attendees: opp.contactEmail ? [opp.contactEmail] : [],
            color: opp.priority === 'high' ? '#ef4444' : opp.priority === 'medium' ? '#f59e0b' : '#3b82f6'
        });

        // Update opportunity status
        await this.updateOpportunity(userId, oppId, {
            status: 'qualified'
        });

        return event;
    }
}

export const calendarService = new CalendarService();
