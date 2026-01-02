import React, { useState, useMemo } from 'react';
import { Appointment, ThemeMode } from '../../types';
import { APPOINTMENTS } from '../../constants';
import LiquidDayCard from './LiquidDayCard';

interface CalendarFullViewProps {
    theme?: ThemeMode;
}

type CalendarViewMode = 'Month' | 'Day';

const CalendarFullView: React.FC<CalendarFullViewProps> = ({ theme = 'dark' }) => {
    const isDark = theme === 'dark';
    const [viewMode, setViewMode] = useState<CalendarViewMode>('Day'); // Default to Day for mobile

    // Use current date
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const todayDate = now.getDate();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[month];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const days = useMemo(() => {
        const daysArray: { day: number; current: boolean; weekday: string; date: string; today: boolean }[] = [];
        const date = new Date(year, month, 1);

        // Fill previous month days
        const firstDay = date.getDay();
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDay - 1; i >= 0; i--) {
            daysArray.push({
                day: prevMonthLastDay - i,
                current: false,
                weekday: weekdays[(firstDay - 1 - i + 7) % 7],
                date: `${year}-${month.toString().padStart(2, '0')}-${(prevMonthLastDay - i).toString().padStart(2, '0')}`,
                today: false
            });
        }

        // Current month days
        const lastDay = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= lastDay; i++) {
            const currentDayDate = new Date(year, month, i);
            daysArray.push({
                day: i,
                current: true,
                weekday: weekdays[currentDayDate.getDay()],
                date: `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`,
                today: i === todayDate
            });
        }

        // Next month days
        const remaining = 42 - daysArray.length;
        for (let i = 1; i <= remaining; i++) {
            const nextMonthDate = new Date(year, month + 1, i);
            daysArray.push({
                day: i,
                current: false,
                weekday: weekdays[nextMonthDate.getDay()],
                date: `${year}-${(month + 2).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`,
                today: false
            });
        }

        return daysArray;
    }, [month, year, todayDate]);

    // Get only current month days for Day view
    const currentMonthDays = days.filter(d => d.current);

    return (
        <div className="flex flex-col gap-6 w-full h-full animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDark ? 'bg-white text-black border-white/20' : 'bg-black text-white border-black/10'}`}>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h2 className={`text-3xl font-extrabold tracking-tighter uppercase leading-none ${isDark ? 'text-white' : 'text-black'}`}>
                            {monthName}
                        </h2>
                        <span className={`text-xs font-mono tracking-[0.2em] opacity-30 mt-1 ${isDark ? 'text-white' : 'text-black'}`}>
                            {year} // SYSTEM_TIME
                        </span>
                    </div>
                </div>

                {/* Toggle Controls */}
                <div className={`flex p-1 rounded-xl border backdrop-blur-xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                    {(['Month', 'Day'] as CalendarViewMode[]).map(v => (
                        <button
                            key={v}
                            onClick={() => setViewMode(v)}
                            className={`px-5 py-2 rounded-lg font-mono text-[10px] font-extrabold uppercase transition-all duration-300
                ${viewMode === v
                                    ? (isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg')
                                    : (isDark ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black')
                                }
              `}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {viewMode === 'Month' ? (
                /* MONTH VIEW - Grid */
                <div className="flex flex-col animate-in slide-in-from-left-4 duration-500">
                    {/* Weekday Strip */}
                    <div className="grid grid-cols-7 gap-px mb-4">
                        {weekdays.map(d => (
                            <div key={d} className="py-2 text-center">
                                <span className={`font-mono text-[9px] font-bold uppercase tracking-widest opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>{d}</span>
                            </div>
                        ))}
                    </div>

                    {/* Grid Area */}
                    <div className={`grid grid-cols-7 gap-px border transition-all overflow-hidden rounded-2xl ${isDark ? 'bg-white/10 border-white/10' : 'bg-black/5 border-black/10 shadow-xl'}`}>
                        {days.map((item, idx) => {
                            const dayApps = APPOINTMENTS.filter(a => a.date === item.date);

                            return (
                                <div
                                    key={idx}
                                    className={`group relative h-[100px] sm:h-[120px] flex flex-col p-3 transition-all cursor-pointer overflow-hidden
                    ${item.current
                                            ? `${isDark ? 'bg-v-card hover:bg-white/[0.04]' : 'bg-white hover:bg-black/[0.02]'}`
                                            : `${isDark ? 'bg-black/40 opacity-20' : 'bg-[#fafafa] opacity-20'}`
                                        }
                  `}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`font-mono text-[11px] font-bold transition-all ${item.today ? 'bg-v-crimson text-white px-2 py-0.5 rounded-sm' : isDark ? 'text-white/30 group-hover:text-white/90' : 'text-black/30 group-hover:text-black/90'}`}>
                                            {item.day.toString().padStart(2, '0')}
                                        </span>
                                        {dayApps.length > 0 && item.current && (
                                            <div className="flex gap-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-v-crimson/60" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 overflow-hidden">
                                        {item.current && dayApps.slice(0, 2).map((app, aIdx) => (
                                            <div
                                                key={aIdx}
                                                className={`px-1.5 py-1 rounded-[4px] border text-[8px] font-bold truncate transition-all
                          ${isDark ? 'bg-white/5 border-white/5 text-white/50' : 'bg-black/5 border-transparent text-black/50'}
                        `}
                                            >
                                                {app.title}
                                            </div>
                                        ))}
                                    </div>
                                    <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-v-crimson opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* DAY VIEW - Scrollable Cards */
                <div className="flex-1 overflow-y-auto no-scrollbar pb-24 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {currentMonthDays.map((item, idx) => (
                            <LiquidDayCard
                                key={idx}
                                day={item.day}
                                monthName={monthName}
                                weekday={weekdaysFull[new Date(year, month, item.day).getDay()]}
                                isToday={item.today}
                                isCurrentMonth={item.current}
                                appointments={APPOINTMENTS.filter(a => a.date === item.date)}
                                theme={theme}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarFullView;
