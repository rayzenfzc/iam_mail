import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, MapPin, MoreHorizontal } from 'lucide-react';
import TectonicCard from './ui/TectonicCard';

interface CalendarViewProps {
    isDark: boolean;
}

interface Event {
    id: string;
    title: string;
    time: string;
    duration: string;
    subject: string;
    attendees: string[];
    color?: string;
}

const MOCK_SYNC_EVENTS: Event[] = [
    { id: 's1', title: 'Architectural Review', time: '14:00', duration: '45m', subject: 'Architectural Review', attendees: ['AX', 'SY'], color: 'var(--accent-secondary)' },
    { id: 's2', title: 'Root Access Audit', time: '16:30', duration: '1h', subject: 'Root Access Audit', attendees: ['SA'], color: 'var(--accent-glow)' },
    { id: 's3', title: 'End of Cycle Report', time: '18:00', duration: '30m', subject: 'End of Cycle Report', attendees: [], color: 'var(--text-dim)' },
];

const CalendarView: React.FC<CalendarViewProps> = ({ isDark }) => {
    const [selectedDate, setSelectedDate] = useState(13);

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-full overflow-hidden p-6 lg:p-12 relative bg-deep">
            {/* Main Stage (Center in design, but here it's our main view) */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar relative z-10">
                <h2 className="section-label">Temporal Analysis</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Large Calendar View / Detail can go here */}
                    <TectonicCard className="p-8 md:col-span-2">
                        <header className="flex justify-between items-end border-b border-[var(--glass-border)] pb-6 mb-8">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tighter">OCTOBER 2024</h1>
                                <div className="text-[0.6rem] font-mono opacity-40 uppercase tracking-[0.3em] mt-1">Conduit_Schedule_Sync</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 border border-[var(--glass-border)] hover:border-[var(--accent-glow)] transition-colors"><ChevronLeft size={16} /></button>
                                <button className="p-2 border border-[var(--glass-border)] hover:border-[var(--accent-glow)] transition-colors"><ChevronRight size={16} /></button>
                            </div>
                        </header>

                        <div className="cal-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
                            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                                <div key={d} className="text-[0.65rem] font-black opacity-30 py-4 tracking-widest">{d}</div>
                            ))}
                            {Array.from({ length: 31 }).map((_, i) => {
                                const day = i + 1;
                                const hasEvent = [7, 16, 21].includes(day);
                                return (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedDate(day)}
                                        className={`cal-date text-lg h-24 relative p-4 border border-[var(--glass-border)] hover:bg-white/5 transition-all
                                            ${day === selectedDate ? 'bg-[var(--accent-glow)] !text-[var(--bg-deep)] font-extrabold !border-transparent scale-[1.02] shadow-[0_0_30px_rgba(176,133,255,0.3)]' : ''}
                                            ${day > 18 ? 'opacity-20' : ''}
                                        `}
                                    >
                                        <span className="absolute top-3 left-4">{day}</span>
                                        {hasEvent && (
                                            <div className="absolute bottom-4 right-4 flex gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-secondary)]"></div>
                                                {day === 16 && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-glow)]"></div>}
                                            </div>
                                        )}
                                        {day === selectedDate && (
                                            <div className="absolute top-2 right-2 text-[0.5rem] font-mono opacity-50">ACTIVE_NODE</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </TectonicCard>
                </div>
            </div>

            {/* Utility Rail (Right Column) */}
            <aside className="w-full lg:w-[380px] flex flex-col gap-8 relative z-10">
                <TectonicCard className="calendar-widget">
                    <div className="cal-header">
                        <span className="cal-month tracking-[0.2em]">OCTOBER 2024</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <ChevronLeft size={16} className="opacity-50 hover:opacity-100 cursor-pointer" />
                            <ChevronRight size={16} className="opacity-50 hover:opacity-100 cursor-pointer" />
                        </div>
                    </div>
                    <div className="cal-grid">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                            <div key={i} className="cal-day-label font-black">{d}</div>
                        ))}
                        {Array.from({ length: 31 }).map((_, i) => {
                            const day = i + 1;
                            const isSelected = day === selectedDate;
                            const hasEvent = [7, 16].includes(day);
                            return (
                                <div
                                    key={i}
                                    onClick={() => setSelectedDate(day)}
                                    className={`cal-date relative ${isSelected ? 'active' : ''} ${hasEvent ? 'has-event' : ''}`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </TectonicCard>

                <div className="upcoming-syncs flex-1 flex flex-col overflow-hidden">
                    <h2 className="section-label">Active Syncs</h2>
                    <div className="meeting-cards overflow-y-auto no-scrollbar pr-2 pb-8">
                        {MOCK_SYNC_EVENTS.map(event => (
                            <TectonicCard key={event.id} className="meeting-card">
                                <div className="meeting-time-obsidian">
                                    <span className="time-start">{event.time}</span>
                                    <span className="time-dur">{event.duration}</span>
                                </div>
                                <div className="meeting-info">
                                    <div className="meeting-subject" style={{ color: event.color }}>{event.subject}</div>
                                    <div className="meeting-attendees flex items-center mt-3">
                                        {event.attendees.map((at, i) => (
                                            <div key={i} className="mini-avatar" style={{ marginLeft: i > 0 ? '-8px' : '0', zIndex: 10 - i, backgroundColor: at === 'SY' ? 'var(--accent-glow)' : '#333' }}>
                                                {at}
                                            </div>
                                        ))}
                                        {event.attendees.length === 0 && (
                                            <div className="text-[0.6rem] font-mono opacity-30 uppercase tracking-widest">Single Node Sync</div>
                                        )}
                                        {event.id === 's1' && (
                                            <div className="mini-avatar ml-[-8px] z-0" style={{ border: '1px dashed var(--text-dim)', background: 'transparent' }}>+2</div>
                                        )}
                                    </div>
                                </div>
                            </TectonicCard>
                        ))}

                        <div className="p-8 border border-dashed border-white/5 opacity-20 flex flex-col items-center justify-center text-center gap-4 mt-4">
                            <Clock size={20} />
                            <div className="text-[0.55rem] font-mono uppercase tracking-[0.4em]">Monitoring cycle end...</div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default CalendarView;