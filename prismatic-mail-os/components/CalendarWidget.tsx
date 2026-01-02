import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarWidget: React.FC = () => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dates = Array.from({ length: 35 }, (_, i) => i - 4);

  return (
    <div className="w-full p-6 bg-white/30 backdrop-blur-xl border border-black/5 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-bold text-black">November</span>
          <span className="text-[12px] text-black/40 font-normal">2024</span>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-black/5 rounded-full transition-colors"><ChevronLeft size={16} /></button>
          <button className="p-1.5 hover:bg-black/5 rounded-full transition-colors"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day, idx) => (
          <div key={idx} className="h-6 flex items-center justify-center text-[9px] font-mono font-medium text-black/30">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, idx) => {
          const isCurrent = date === 15;
          const isOtherMonth = date <= 0 || date > 30;
          return (
            <div
              key={idx}
              className={`h-6 flex items-center justify-center text-[9px] font-mono rounded-md cursor-pointer transition-all ${
                isCurrent ? 'bg-black text-white font-bold' : 
                isOtherMonth ? 'text-black/10' : 'text-black/60 hover:bg-black/5'
              }`}
            >
              {date > 0 && date <= 30 ? date : date <= 0 ? 31 + date : date - 30}
            </div>
          );
        })}
      </div>
    </div>
  );
};