import React, { useState, useEffect, useRef } from 'react';
import { Bell, Timer, Mic, Activity, Phone, Play, Pause, RotateCcw, Plus, X, Clock, StopCircle } from 'lucide-react';

/**
 * DEVELOPER NOTE:
 * This component handles two distinct UI modes based on the `isMobile` prop:
 * 1. Desktop: A minimalist flip-style digital clock.
 * 2. Mobile: A "Dynamic Island" style widget that sits in the header.
 *    - Default state: Collapsed pill showing time.
 *    - Expanded state: Full card overlay with Tabs (Clock, Timer, Alarm, Stopwatch).
 */

interface Props {
    isDarkMode?: boolean;
    isMobile?: boolean;
}

type Tab = 'clock' | 'timer' | 'alarm' | 'stopwatch';

const FlipClock: React.FC<Props> = ({ isDarkMode = true, isMobile = false }) => {
    const [time, setTime] = useState(new Date());

    // --- MOBILE STATE ---
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('clock');

    // Timer State
    const [timerDuration, setTimerDuration] = useState(300); // 5 minutes default
    const [timeLeft, setTimeLeft] = useState(300);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Stopwatch State
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);

    // Refs for intervals
    const timerRef = useRef<any>(null);
    const stopwatchRef = useRef<any>(null);

    // Clock Ticker (Runs every second)
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Timer Logic
    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerRunning(false);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerRunning, timeLeft]);

    // Stopwatch Logic
    useEffect(() => {
        if (isStopwatchRunning) {
            stopwatchRef.current = setInterval(() => {
                setStopwatchTime((prev) => prev + 10); // 10ms increments
            }, 10);
        }
        return () => {
            if (stopwatchRef.current) clearInterval(stopwatchRef.current);
        };
    }, [isStopwatchRunning]);


    const format = (num: number) => num.toString().padStart(2, '0');

    const formatStopwatch = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centis = Math.floor((ms % 1000) / 10);
        return `${format(minutes)}:${format(seconds)}.${format(centis)}`;
    };

    const formatTimer = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${format(minutes)}:${format(seconds)}`;
    };

    // --- MOBILE: DYNAMIC ISLAND (FLIP STATION) ---
    if (isMobile) {
        const containerClass = isDarkMode
            ? "bg-[#0A0A0A] border-white/10 shadow-2xl text-white"
            : "bg-[#F0F0F0] border-black/5 shadow-xl text-slate-800";

        const collapsedClass = isDarkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10"
            : "bg-white/40 border-black/5 hover:bg-white/80";

        const activeTabClass = isDarkMode
            ? "bg-white/10 text-white shadow-sm border border-white/10"
            : "bg-white text-black shadow-sm border border-black/5";

        const inactiveTabClass = "opacity-50 hover:opacity-100";

        return (
            // WRAPPER: Maintains space in the flex header row.
            <div className="relative w-[80px] h-9 z-50">

                {/* ANIMATING CONTAINER: Expands absolutely relative to wrapper */}
                <div
                    className={`
             absolute top-0 right-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden flex flex-col items-center border
             ${isExpanded ? `w-[320px] h-[300px] rounded-2xl right-[-80px] sm:right-0 backdrop-blur-3xl ${containerClass}` : `w-full h-full rounded-md backdrop-blur-md ${collapsedClass}`}
          `}
                >
                    {/* COLLAPSED VIEW (Tap to expand) */}
                    <div
                        onClick={() => setIsExpanded(true)}
                        className={`
               absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 z-20
               ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}
             `}
                    >
                        <div className="flex gap-0.5 items-center scale-90">
                            <span className={`font-mono text-[11px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                {format(time.getHours())}:{format(time.getMinutes())}
                            </span>
                        </div>
                    </div>

                    {/* EXPANDED VIEW (Tabs & Tools) */}
                    <div className={`
             w-full h-full flex flex-col transition-all duration-500 delay-75
             ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
          `}>

                        {/* Header / Tabs */}
                        <div className="flex items-center justify-between p-3 border-b border-white/5">
                            <div className="flex gap-1 p-1 rounded-lg bg-black/5 dark:bg-white/5">
                                <button onClick={() => setActiveTab('clock')} className={`p-1.5 rounded-md transition-all ${activeTab === 'clock' ? activeTabClass : inactiveTabClass}`}>
                                    <Clock size={14} />
                                </button>
                                <button onClick={() => setActiveTab('timer')} className={`p-1.5 rounded-md transition-all ${activeTab === 'timer' ? activeTabClass : inactiveTabClass}`}>
                                    <Timer size={14} />
                                </button>
                                <button onClick={() => setActiveTab('alarm')} className={`p-1.5 rounded-md transition-all ${activeTab === 'alarm' ? activeTabClass : inactiveTabClass}`}>
                                    <Bell size={14} />
                                </button>
                                <button onClick={() => setActiveTab('stopwatch')} className={`p-1.5 rounded-md transition-all ${activeTab === 'stopwatch' ? activeTabClass : inactiveTabClass}`}>
                                    <Activity size={14} />
                                </button>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                            >
                                <X size={14} className="opacity-50" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">

                            {/* CLOCK TAB */}
                            {activeTab === 'clock' && (
                                <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                                    <div className="flex gap-2 mb-2 scale-125 origin-center">
                                        <DigitGroup value={format(time.getHours())} isDarkMode={isDarkMode} />
                                        <span className="opacity-20 animate-pulse text-2xl relative top-1">:</span>
                                        <DigitGroup value={format(time.getMinutes())} isDarkMode={isDarkMode} />
                                    </div>
                                    <div className="mt-4 text-[10px] font-mono opacity-40 uppercase tracking-[0.2em]">
                                        {time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="mt-6 flex gap-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-[9px] opacity-40 uppercase">London</span>
                                            <span className="text-[10px] font-mono font-bold opacity-80">00:00</span>
                                        </div>
                                        <div className="w-px h-6 bg-current opacity-10"></div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-[9px] opacity-40 uppercase">Tokyo</span>
                                            <span className="text-[10px] font-mono font-bold opacity-80">09:00</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TIMER TAB */}
                            {activeTab === 'timer' && (
                                <div className="flex flex-col items-center w-full animate-in slide-in-from-right-4 duration-300">
                                    <div className="text-4xl font-mono font-bold tracking-widest mb-6 tabular-nums">
                                        {formatTimer(timeLeft)}
                                    </div>

                                    <div className="flex gap-4 w-full justify-center">
                                        {!isTimerRunning ? (
                                            <button
                                                onClick={() => setIsTimerRunning(true)}
                                                className="h-10 px-6 rounded-md bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-slate-200 active:scale-95 transition-all flex items-center gap-2"
                                            >
                                                <Play size={12} fill="currentColor" /> Start
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setIsTimerRunning(false)}
                                                className="h-10 px-6 rounded-md bg-orange-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-orange-600 active:scale-95 transition-all flex items-center gap-2"
                                            >
                                                <Pause size={12} fill="currentColor" /> Pause
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { setIsTimerRunning(false); setTimeLeft(timerDuration); }}
                                            className="h-10 w-10 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
                                        >
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STOPWATCH TAB */}
                            {activeTab === 'stopwatch' && (
                                <div className="flex flex-col items-center w-full animate-in slide-in-from-right-4 duration-300">
                                    <div className="text-4xl font-mono font-bold tracking-widest mb-6 tabular-nums">
                                        {formatStopwatch(stopwatchTime)}
                                    </div>

                                    <div className="flex gap-4 w-full justify-center">
                                        <button
                                            onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                                            className={`
                            h-10 px-6 rounded-md font-bold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center gap-2
                            ${isStopwatchRunning ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}
                          `}
                                        >
                                            {isStopwatchRunning ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                                            {isStopwatchRunning ? 'Stop' : 'Start'}
                                        </button>

                                        <button
                                            onClick={() => { setIsStopwatchRunning(false); setStopwatchTime(0); }}
                                            className="h-10 w-10 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
                                        >
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ALARM TAB */}
                            {activeTab === 'alarm' && (
                                <div className="w-full h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
                                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                                        {[
                                            { time: '07:00', label: 'Morning', active: true },
                                            { time: '08:30', label: 'Standup', active: false },
                                        ].map((alarm, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-xl font-mono font-bold leading-none">{alarm.time}</span>
                                                    <span className="text-[10px] opacity-40 uppercase tracking-wide mt-1">{alarm.label}</span>
                                                </div>
                                                <div className={`
                               w-8 h-4 rounded-full relative transition-colors duration-300 cursor-pointer
                               ${alarm.active ? 'bg-green-500' : 'bg-white/10'}
                             `}>
                                                    <div className={`
                                  absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-300 shadow-sm
                                  ${alarm.active ? 'left-[18px]' : 'left-0.5'}
                                `}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- DESKTOP: STANDARD FLIP CLOCK ---
    const colonClass = isDarkMode ? "text-white" : "text-black";
    return (
        <div className={`flex items-center gap-1 font-mono text-[10px] select-none ${colonClass}`}>
            <DigitGroup value={format(time.getHours())} isDarkMode={isDarkMode} />
            <span className="opacity-40 animate-pulse">:</span>
            <DigitGroup value={format(time.getMinutes())} isDarkMode={isDarkMode} />
        </div>
    );
};

const DigitGroup: React.FC<{ value: string, isDarkMode: boolean, isMobileCompact?: boolean }> = ({ value, isDarkMode, isMobileCompact }) => {
    const containerClass = isDarkMode
        ? "bg-white/10 border-white/10 text-white/90"
        : "bg-black/5 border-black/5 text-slate-800";
    const lineClass = isDarkMode ? "bg-black/40" : "bg-white/40";

    const sizeClass = isMobileCompact ? "w-3 h-4 text-[10px]" : "w-4 h-5 text-[10px]";

    return (
        <div className="flex gap-0.5">
            {value.split('').map((digit, idx) => (
                <div
                    key={idx}
                    className={`${sizeClass} border rounded-sm flex items-center justify-center relative overflow-hidden ${containerClass}`}
                >
                    <div className={`absolute inset-x-0 top-1/2 h-px z-10 ${lineClass}`} />
                    <span className="font-bold leading-none relative z-0">{digit}</span>
                </div>
            ))}
        </div>
    );
};

export default FlipClock;
