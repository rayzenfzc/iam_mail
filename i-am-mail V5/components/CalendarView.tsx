import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Menu, Clock, MoreHorizontal } from 'lucide-react';

interface CalendarViewProps {
  isDark: boolean;
  onOpenMenu?: () => void;
}

type CalendarViewType = 'day' | 'week' | 'month' | 'year';

interface Event {
    id: string;
    title: string;
    time: string;
    duration: string;
    type: 'sync' | 'focus' | 'ooo';
    attendees: string[];
}

const MOCK_EVENTS: Record<number, Event[]> = {
    14: [{ id: 'e1', title: 'Neural Calibration', time: '10:00 AM', duration: '1h', type: 'sync', attendees: ['Arjun', 'Elena'] }],
    15: [{ id: 'e2', title: 'Security Audit', time: '02:00 PM', duration: '45m', type: 'focus', attendees: ['Sarah'] }],
    20: [{ id: 'e3', title: 'Global Node Sync', time: '09:00 AM', duration: '2h', type: 'sync', attendees: ['Viktor', 'John'] }],
};

const CalendarView: React.FC<CalendarViewProps> = ({ isDark, onOpenMenu }) => {
  const [viewType, setViewType] = useState<CalendarViewType>('month');
  const [selectedDay, setSelectedDay] = useState(15);
  const daysInMonth = 31;
  const currentMonthName = "December";
  const currentYear = "2025";

  const renderEventBadge = (event: Event) => (
    <div key={event.id} className={`flex items-center gap-2 p-3 rounded-[0.75rem] border backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer
        ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-white/40 border-white text-slate-900 shadow-sm'}
    `}>
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${event.type === 'sync' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
        <div className="flex-1 min-w-0">
            <div className="text-[0.6rem] font-black uppercase tracking-widest truncate">{event.title}</div>
            <div className="flex items-center gap-2 mt-0.5 opacity-40 text-[0.5rem] font-mono">
                <Clock size={10} /> {event.time}
            </div>
        </div>
    </div>
  );

  const ViewSelector = () => (
    <div className={`flex items-center p-1 rounded-[2rem] border backdrop-blur-xl ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/30 border-white shadow-sm'}`}>
        {(['day', 'week', 'month', 'year'] as CalendarViewType[]).map((type) => (
            <button
                key={type}
                onClick={() => setViewType(type)}
                className={`px-4 py-1.5 rounded-[1.5rem] text-[0.55rem] font-black uppercase tracking-widest transition-all ${
                    viewType === type 
                    ? (isDark ? 'bg-white text-black' : 'bg-slate-900 text-white shadow-lg') 
                    : (isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900')
                }`}
            >
                {type}
            </button>
        ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
        {/* Headless Header - Top Bar */}
        <div className="px-6 py-6 lg:py-8 flex items-center gap-6 shrink-0 bg-transparent z-20">
            {onOpenMenu && (
                <button 
                    onClick={() => onOpenMenu()}
                    className={`lg:hidden flex items-center gap-4 transition-all active:opacity-60 bg-transparent ${isDark ? 'text-white' : 'text-[#2D3748]'}`}
                >
                    <div className={`w-[2px] h-8 ${isDark ? 'bg-slate-700' : 'bg-slate-900'} rounded-full`}></div>
                    <Menu size={24} strokeWidth={2.5} />
                </button>
            )}
            <div className={`text-[0.8rem] font-black uppercase tracking-[0.6em] flex-1 flex justify-between items-center ${isDark ? 'text-white/80' : 'text-slate-900'}`}>
                <span>CALENDAR</span>
                <span className="opacity-20 font-mono text-[0.55rem] hidden sm:block">TEMPORAL_HUB</span>
            </div>
        </div>

        <div className="flex-1 flex flex-col p-4 pt-2 lg:p-12 lg:pt-0 overflow-hidden">
            
            {/* Calendar Controls & Title Block - Redesigned */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4 px-2 lg:px-0">
                <div className="relative">
                    <div className={`text-[0.65rem] font-black uppercase tracking-[0.4em] mb-1 opacity-40 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {currentMonthName} {currentYear}
                    </div>
                    <div className="flex items-center gap-6">
                        <h2 className={`text-6xl lg:text-7xl font-thin tracking-tighter leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentMonthName}</h2>
                        {/* Desktop View Selector */}
                        <div className="hidden lg:block mb-2">
                             <button className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95
                                ${isDark ? 'border-white/10 text-white hover:bg-white/10' : 'bg-white/50 border-white text-slate-400 hover:text-slate-900 shadow-sm'}
                            `}>
                                <Plus size={18} strokeWidth={2.5}/>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-auto">
                    <div className={`flex items-center justify-between p-2 rounded-[1rem] border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/20'}`}>
                         <div className="flex gap-2">
                             <ViewSelector />
                         </div>
                         <div className="flex items-center gap-1 pl-4 border-l border-slate-200/20">
                            <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-white text-slate-500'}`}><ChevronLeft size={14}/></button>
                            <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-white text-slate-500'}`}><ChevronRight size={14}/></button>
                         </div>
                    </div>
                </div>
            </div>

            {/* View Grids */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {viewType === 'month' && (
                    <div className={`grid grid-cols-7 border-t border-l rounded-[1rem] overflow-hidden ${isDark ? 'border-white/5' : 'border-white bg-white/20 shadow-xl shadow-slate-900/[0.03]'}`}>
                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                            <div key={day} className={`p-4 border-r border-b text-[0.55rem] font-black uppercase tracking-widest text-center ${isDark ? 'border-white/5 bg-white/5 text-slate-600' : 'border-white bg-white/20 text-slate-400'}`}>{day}</div>
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => (
                            <div key={i} className={`p-2 border-r border-b group transition-all relative min-h-[120px] ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-white bg-white/10 hover:bg-white/40'}`}>
                                <span className={`text-[0.65rem] font-mono font-bold block mb-2 ${isToday(i+1) ? 'text-indigo-500' : (isDark ? 'text-slate-700 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900')}`}>{i + 1}</span>
                                <div className="space-y-1.5">
                                    {MOCK_EVENTS[i + 1]?.map(renderEventBadge)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );

  function isToday(day: number) { return day === 15; }
};

export default CalendarView;