
import React from 'react';
import { ThemeMode } from '../../types';

interface CalendarWidgetProps {
    theme?: ThemeMode;
    onClick?: () => void;
}

const LiquidCalendarWidget: React.FC<CalendarWidgetProps> = ({ theme = 'dark', onClick }) => {
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const monthName = 'OCTOBER'; // Changed to UPPERCASE to match image
    const year = '2024';
    const isDark = theme === 'dark';

    const generateDates = () => {
        const dates = [];
        for (let i = 28; i <= 30; i++) dates.push({ d: i, current: false, today: false });
        for (let i = 1; i <= 31; i++) dates.push({ d: i, current: true, today: i === 12 });
        for (let i = 1; i <= 4; i++) dates.push({ d: i, current: false, today: false });
        return dates;
    };

    const dates = generateDates();

    return (
        <div
            onClick={onClick}
            className={`w-full border rounded-lg p-6 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] duration-300 ${isDark ? 'bg-v-dark border-v-border' : 'bg-white border-gray-200 shadow-sm'}`}
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <span className={`font-sans text-sm font-bold block ${isDark ? 'text-v-white' : 'text-black'}`}>{monthName}</span>
                    <span className={`font-sans text-xs ${isDark ? 'text-v-muted' : 'text-gray-400'}`}>{year}</span>
                </div>
                <div className="flex gap-4">
                    <button className={`${isDark ? 'text-v-muted hover:text-v-white' : 'text-gray-400 hover:text-black'} transition-colors`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button className={`${isDark ? 'text-v-muted hover:text-v-white' : 'text-gray-400 hover:text-black'} transition-colors`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekdays.map((day, idx) => (
                    <div key={idx} className="text-center">
                        <span className={`font-mono text-[9px] uppercase ${isDark ? 'text-v-muted' : 'text-gray-400'}`}>{day}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {dates.map((item, idx) => (
                    <div
                        key={idx}
                        className={`h-6 flex items-center justify-center rounded-sm transition-colors cursor-pointer
              ${item.today
                                ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.5)]' // Updated to match image: White glowslab
                                : item.current
                                    ? (isDark ? 'text-v-white hover:bg-v-white/5' : 'text-black hover:bg-gray-100')
                                    : (isDark ? 'text-v-very-muted' : 'text-gray-200')}
            `}
                    >
                        <span className="font-mono text-[9px]">{item.d}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiquidCalendarWidget;
