import { Appointment } from './types';

export const APPOINTMENTS: Appointment[] = [
    {
        id: 'a1',
        title: 'Design Review',
        time: '09:00',
        duration: '1h',
        location: 'Conference Room A',
        date: '2024-10-12',
        type: 'meeting'
    },
    {
        id: 'a2',
        title: 'Weekly Sync',
        time: '14:00',
        duration: '45m',
        location: 'Virtual',
        date: '2024-10-12',
        type: 'meeting'
    },
    {
        id: 'a3',
        title: 'Submit Q3 Reports',
        time: '17:00',
        duration: '15m',
        date: '2024-10-15',
        type: 'task'
    },
    {
        id: 'a4',
        title: 'Company All-Hands',
        time: '10:00',
        duration: '2h',
        location: 'Main Hall',
        date: '2024-10-20',
        type: 'event'
    }
];
