import { MailItem, ContactItem, EventItem } from '../types';

const SENDERS = ['Sarah Connor', 'Nova Logistics', 'Rayzen Finance', 'System Admin', 'Arjun Mehta', 'Security Ops', 'Cloud Nodes', 'Cyberdyne', 'Nexus 6', 'Tyrell Corp', 'Weyland-Yutani', 'Massive Dynamic'];
const SUBJECTS = [
    'Security Protocol Update', 
    'Shipment #4492 Delayed', 
    'Q4 Projection Analysis', 
    'Resistance Strategy', 
    'Level 7 Diagnostic', 
    'Neural Link Calibration', 
    'Weekly Report', 
    'Meeting Confirmation',
    'Asset Reallocation',
    'Mainframe Breach Attempt',
    'System Optimization',
    'Encrypted Data Packet'
];
const STATUSES: MailItem['status'][] = ['UNREAD', 'URGENT', 'REVIEW', 'PENDING', 'READ'];

function generateMails(count: number): MailItem[] {
    return Array.from({ length: count }, (_, i) => ({
        id: `mail-${i}`,
        type: 'mail',
        sender: SENDERS[Math.floor(Math.random() * SENDERS.length)],
        subject: `${SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]} [REF-${i + 1000}]`,
        time: i < 5 ? 'Just now' : i < 20 ? 'Today' : i < 50 ? 'Yesterday' : 'Dec 12',
        status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
        body: `This is a generated message body for item #${i}. Please review the attached quantum logs for discrepancies. The system has detected a 0.4% variance in the sector 7 grid. Immediate action may be required.`
    }));
}

export const MOCK_INBOX = generateMails(600); 

export const MOCK_CONTACTS: ContactItem[] = [
    { id: 'c1', type: 'contact', name: 'Sarah Connor', role: 'Security Ops', status: 'ONLINE', email: 's.connor@rayzen.io' },
    { id: 'c2', type: 'contact', name: 'Arjun Mehta', role: 'System Architect', status: 'AWAY', email: 'a.mehta@rayzen.io' },
    { id: 'c3', type: 'contact', name: 'Dr. Silberman', role: 'Psychology', status: 'OFFLINE', email: 'dr.s@clinic.net' },
    { id: 'c4', type: 'contact', name: 'Roy Batty', role: 'Field Agent', status: 'URGENT', email: 'r.batty@nexus.com' },
];

export const MOCK_EVENTS: EventItem[] = [
    { id: 'e1', type: 'event', title: 'Neural Sync', time: '10:00 - 11:00', date: 'DEC 12', location: 'Room 404' },
    { id: 'e2', type: 'event', title: 'Client Review', time: '14:30 - 15:30', date: 'DEC 12', location: 'Virtual' },
    { id: 'e3', type: 'event', title: 'Budget Approval', time: '09:00 - 09:30', date: 'DEC 13', location: 'Boardroom A' },
];

export function fetchInboxPage(
    pageIndex: number, 
    pageSize: number, 
    filterText: string, 
    filterMode: 'all' | 'unread' | 'urgent'
): Promise<MailItem[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filtered = MOCK_INBOX.filter(m => {
                if (filterMode === 'unread' && m.status !== 'UNREAD') return false;
                if (filterMode === 'urgent' && m.status !== 'URGENT') return false;
                if (filterText) {
                    const lower = filterText.toLowerCase();
                    return m.subject.toLowerCase().includes(lower) || m.sender.toLowerCase().includes(lower);
                }
                return true;
            });
            
            const start = pageIndex * pageSize;
            const page = filtered.slice(start, start + pageSize);
            resolve(page);
        }, Math.random() * 350 + 350); 
    });
}