import React from 'react';
import { ThemeMode, Appointment } from '../../types';

interface LiquidDayCardProps {
    day: number;
    monthName: string;
    weekday: string;
    isToday?: boolean;
    isCurrentMonth?: boolean;
    appointments: Appointment[];
    theme?: ThemeMode;
    onClick?: () => void;
}

const LiquidDayCard: React.FC<LiquidDayCardProps> = ({
    day,
    monthName,
    weekday,
    isToday,
    isCurrentMonth = true,
    appointments,
    theme = 'dark',
    onClick
}) => {
    const isLight = theme === 'light';
    const hasEvents = appointments.length > 0;

    return (
        <div
            onClick={onClick}
            className={`relative group w-full aspect-[0.85/1] p-5 flex flex-col justify-between transition-all duration-500 overflow-hidden border rounded-xl cursor-pointer
        ${!isCurrentMonth ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100'}
        ${isToday
                    ? (isLight
                        ? 'bg-v-white text-v-black border-v-border-black shadow-[0_15px_40px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(0,0,0,0.02)] scale-105 z-10'
                        : 'bg-white/10 text-v-white border-white/30 shadow-[inset_0_0_25px_rgba(255,255,255,0.05)] scale-105 z-10')
                    : (isLight
                        ? 'bg-black/5 border-v-border-black/5 text-black/40 hover:bg-black/10 hover:text-v-black hover:border-black/10'
                        : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10 hover:text-v-white hover:border-white/20')
                }
      `}
        >
            {/* Active Indicator Dot */}
            {isToday && (
                <div className={`absolute top-4 right-4 w-1.5 h-1.5 rounded-full transition-all duration-500 ${isLight ? 'bg-v-black' : 'bg-v-accent shadow-[0_0_12px_#00ffc3]'}`} />
            )}

            {/* Date Header */}
            <div className="flex flex-col items-start">
                <span className={`font-mono text-[9px] uppercase tracking-[0.2em] mb-1 transition-all duration-500 
          ${isToday ? 'opacity-100 font-bold' : 'opacity-40'}
        `}>
                    {weekday}
                </span>
                <span className={`text-4xl font-[800] tracking-tighter leading-none transition-all duration-500
          ${isToday ? 'scale-110 origin-left' : ''}
        `}>
                    {day.toString().padStart(2, '0')}
                </span>
            </div>

            {/* Appointment Area (Micro-Grid) */}
            <div className="flex flex-col gap-1.5">
                {hasEvents ? (
                    <div className="flex flex-col gap-1">
                        {appointments.slice(0, 2).map((app, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col p-1.5 rounded-[4px] border transition-all
                  ${isToday
                                        ? (isLight ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5')
                                        : (isLight ? 'bg-black/5 border-transparent' : 'bg-white/5 border-transparent')
                                    }
                `}
                            >
                                <span className={`text-[9px] font-bold truncate leading-tight ${isToday ? 'opacity-90' : 'opacity-60'}`}>
                                    {app.title}
                                </span>
                                <span className="text-[7px] font-mono opacity-30 uppercase tracking-tighter">
                                    {app.time} — {app.duration || '1h'}
                                </span>
                            </div>
                        ))}
                        {appointments.length > 2 && (
                            <div className="text-[8px] font-mono opacity-20 uppercase tracking-widest pl-1">
                                + {appointments.length - 2} Overlap
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-4 flex items-center">
                        <div className={`w-full h-[1px] opacity-10 ${isLight ? 'bg-black' : 'bg-white'}`} />
                    </div>
                )}

                <div className="flex justify-between items-center mt-1">
                    <span className="font-mono text-[8px] opacity-30 uppercase tracking-widest">
                        {monthName.substring(0, 3)} // {isToday ? 'NOW' : 'LOG'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LiquidDayCard;
