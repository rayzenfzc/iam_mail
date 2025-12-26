import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarView: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <div className={`flex-1 h-full backdrop-blur-xl rounded-[3rem] border shadow-inner flex flex-col p-12 overflow-hidden transition-all duration-500 ${isDark ? 'bg-[#121214]/60 border-white/5' : 'bg-white/40 border-white'}`}>
        <div className="flex justify-between items-center mb-12">
            <div>
                <div className={`text-[0.6rem] font-bold uppercase tracking-[0.4em] mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>I.CALENDAR</div>
                <h2 className={`text-4xl font-thin tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>December 2025</h2>
            </div>
            <div className="flex gap-4">
                <button className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 border-white/10 text-slate-600 hover:text-white' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-900'}`}><ChevronLeft size={20}/></button>
                <button className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 border-white/10 text-slate-600 hover:text-white' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-900'}`}><ChevronRight size={20}/></button>
                <button className={`${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} px-8 rounded-2xl text-[0.6rem] font-bold uppercase tracking-widest flex items-center gap-3 transition-colors`}>
                    <Plus size={16}/> New_Event
                </button>
            </div>
        </div>

        <div className={`flex-1 grid grid-cols-7 border-t border-l ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className={`p-4 border-r border-b text-[0.6rem] font-bold uppercase tracking-widest text-center ${isDark ? 'border-white/5 bg-white/5 text-slate-600' : 'border-slate-100 bg-white/30 text-slate-400'}`}>{day}</div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => (
                <div key={i} className={`p-6 border-r border-b group transition-colors relative min-h-[140px] ${isDark ? 'border-white/5 hover:bg-white/10' : 'border-slate-100 hover:bg-white/60'}`}>
                    <span className={`text-xs font-mono transition-colors ${isDark ? 'text-slate-800 group-hover:text-white' : 'text-slate-300 group-hover:text-slate-900'}`}>{i + 1}</span>
                    {i === 14 && (
                        <div className={`mt-4 p-3 rounded-xl text-[0.55rem] font-bold uppercase tracking-widest shadow-lg ${isDark ? 'bg-indigo-500 text-white shadow-indigo-500/20' : 'bg-slate-900 text-white shadow-slate-900/20'}`}>
                            Neural_Sync // 14:00
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};

export default CalendarView;