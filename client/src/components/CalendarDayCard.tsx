import React from 'react';
import { motion } from 'motion/react';

interface CalendarDayCardProps {
    day: number;
    month: string;
    events: number;
    isToday?: boolean;
    hasEvents?: boolean;
    darkMode: boolean;
    onClick?: () => void;
}

export const CalendarDayCard: React.FC<CalendarDayCardProps> = ({ 
    day, 
    month, 
    events, 
    isToday = false, 
    hasEvents = false, 
    darkMode,
    onClick 
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ 
                scale: 1.03, 
                y: -4,
                rotateX: 2,
                rotateY: 2
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                relative p-4 rounded-md border cursor-pointer transition-all duration-300
                ${darkMode 
                    ? 'bg-[#1A1A1A] border-white/5 hover:border-white/10' 
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }
                ${isToday ? (darkMode ? 'ring-1 ring-red-600/30' : 'ring-1 ring-red-600/30') : ''}
                
                /* PREMIUM 3D SHADOW SYSTEM */
                ${darkMode 
                    ? `shadow-[0_2px_8px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.2)]
                       hover:shadow-[0_4px_16px_rgba(0,0,0,0.4),0_12px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.02)]`
                    : `shadow-[0_2px_8px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]
                       hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.02)]`
                }
            `}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
            }}
        >
            {/* Small red accent - TOP LEFT corner (25% width, 2px) */}
            {hasEvents && (
                <div className={`absolute top-0 left-0 h-[2px] w-[25%] transition-all duration-300 ${
                    isToday ? 'bg-red-600' : 'bg-red-600/60'
                }`}></div>
            )}

            {/* Subtle gradient overlay for depth */}
            <div className={`absolute inset-0 rounded-md pointer-events-none ${
                darkMode 
                    ? 'bg-gradient-to-br from-white/[0.02] to-transparent'
                    : 'bg-gradient-to-br from-black/[0.01] to-transparent'
            }`}></div>

            {/* Day number */}
            <div className={`text-3xl font-black mb-1 ${
                isToday 
                    ? 'text-red-600' 
                    : darkMode ? 'text-white' : 'text-black'
            }`}>
                {day}
            </div>

            {/* Month label */}
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2">
                {month}
            </div>

            {/* Event count */}
            {events > 0 && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`text-[10px] font-bold ${
                        darkMode ? 'text-white/60' : 'text-black/60'
                    }`}
                >
                    {events} {events === 1 ? 'event' : 'events'}
                </motion.div>
            )}

            {/* Today indicator dot */}
            {isToday && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            )}

            {/* Hover arrow */}
            <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-30 transition-all duration-300 pointer-events-none">
                <div className="w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-red-600 transform rotate-45"></div>
            </div>
        </motion.div>
    );
};

// Month calendar grid component
export const CalendarMonthView: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
    const today = 24; // October 24
    const daysInMonth = 31;
    
    // Mock event data
    const daysWithEvents: { [key: number]: number } = {
        24: 3, // Today - 3 events
        25: 2,
        26: 4,
        27: 1,
        28: 2,
        30: 1
    };

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="max-w-5xl mx-auto">
            {/* Month header */}
            <div className={`mb-6 pb-4 border-b ${
                darkMode ? 'border-white/5' : 'border-neutral-200'
            }`}>
                <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-black'}`}>
                    October 2024
                </h2>
                <p className="text-sm opacity-40 mt-1">Click any day to view events</p>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
                {days.map((day) => (
                    <CalendarDayCard
                        key={day}
                        day={day}
                        month="OCT"
                        events={daysWithEvents[day] || 0}
                        isToday={day === today}
                        hasEvents={!!daysWithEvents[day]}
                        darkMode={darkMode}
                        onClick={() => console.log(`Clicked day ${day}`)}
                    />
                ))}
            </div>
        </div>
    );
};