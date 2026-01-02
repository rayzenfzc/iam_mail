
import React, { useState, useEffect } from 'react';
import { ThemeMode } from '../../types';

interface PerformanceWidgetProps {
    theme?: ThemeMode;
}

const PerformanceWidget: React.FC<PerformanceWidgetProps> = ({ theme = 'dark' }) => {
    const isDark = theme === 'dark';
    const [load, setLoad] = useState(12);
    const [history, setHistory] = useState<number[]>(Array(20).fill(12));

    useEffect(() => {
        const interval = setInterval(() => {
            const nextLoad = Math.max(5, Math.min(45, load + (Math.random() * 10 - 5)));
            setLoad(nextLoad);
            setHistory(prev => [...prev.slice(1), nextLoad]);
        }, 1000);
        return () => clearInterval(interval);
    }, [load]);

    return (
        <div className={`p-4 rounded-[8px] border transition-all ${isDark ? 'bg-white/5 border-white/12' : 'bg-white border-black/5 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-[11px] font-bold font-sans uppercase opacity-80">System Load</h4>
                <span className="text-[10px] font-mono text-v-crimson font-bold">{load.toFixed(1)}%</span>
            </div>

            <div className="h-12 flex items-end gap-0.5 mb-3">
                {history.map((val, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-v-crimson/40 rounded-t-[1px] transition-all duration-500"
                        style={{ height: `${val * 2}%`, opacity: 0.2 + (i / history.length) * 0.8 }}
                    />
                ))}
            </div>

            <div className="flex justify-between text-[9px] font-mono opacity-30 uppercase tracking-tighter">
                <span>Cores: 08</span>
                <span>Temp: 42°C</span>
            </div>
        </div>
    );
};

export default PerformanceWidget;
