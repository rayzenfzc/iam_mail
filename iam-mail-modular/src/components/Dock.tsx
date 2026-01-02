import React, { useEffect, useState } from 'react';
import { DockAction } from './Glass';
import { ActiveView, DockContext, SendQueueItem, SmartAction } from '../types';

interface DockProps {
    activeView: ActiveView;
    selectedItemId: string | number | null;
    input: string;
    setInput: (val: string) => void;
    onAction: (action: string) => void;
    onChangeView: (view: ActiveView) => void;
    onBack: () => void;
    aiThinking: boolean;
    aiResponse: string;
    clearAi: () => void;
    
    // Queue / Banner Props
    pendingItems: SendQueueItem[];
    failedItems: SendQueueItem[];
    onUndo: () => void;
    
    // New: Shared Actions
    customActions?: SmartAction[];
    
    // Positioning
    className?: string;
}

export const Dock: React.FC<DockProps> = ({ 
    input, setInput, onAction, 
    aiThinking, aiResponse, clearAi,
    pendingItems, failedItems, onUndo,
    customActions = [],
    className = ""
}) => {

    const [secondsLeft, setSecondsLeft] = useState(0);
    const newestPending = pendingItems.find(i => i.status === 'pending');
    
    useEffect(() => {
        if (!newestPending) {
            setSecondsLeft(0);
            return;
        }
        const timer = setInterval(() => {
            const left = Math.ceil((newestPending.sendAt - Date.now()) / 1000);
            setSecondsLeft(left > 0 ? left : 0);
        }, 200);
        return () => clearInterval(timer);
    }, [newestPending]);

    const handleEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') onAction('enter');
    };

    return (
        <div className={`pointer-events-none z-[100] flex justify-center pb-safe ${className}`}>
             <div className="w-full max-w-xl pointer-events-auto flex flex-col bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[1.25rem] overflow-hidden transition-all duration-300 ring-1 ring-slate-100 p-2">
                {/* BANNERS STACK */}
                <div className="flex flex-col-reverse rounded-xl overflow-hidden mb-1">
                    {aiResponse && (
                        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 text-[0.65rem] text-slate-800 flex justify-between items-center animate-slide-up">
                            <span className="truncate mr-3 font-mono leading-relaxed"><span className="font-bold text-slate-500">AI //</span> {aiResponse}</span>
                            <button onClick={clearAi} className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-300 font-bold transition-colors">×</button>
                        </div>
                    )}
                    {newestPending && secondsLeft > 0 && (
                        <div className="px-5 py-2 bg-slate-900 flex justify-between items-center animate-slide-up">
                            <span className="text-[0.6rem] text-white font-mono tracking-wide">SENDING IN {secondsLeft}s...</span>
                            <button onClick={onUndo} className="text-[0.55rem] font-bold uppercase tracking-widest text-slate-300 hover:text-white bg-white/10 px-3 py-1 rounded-full">UNDO</button>
                        </div>
                    )}
                </div>

                {/* UNIFIED CHAT INTERFACE */}
                <div className="flex flex-col gap-1">
                     {/* Input Row */}
                     <div className="flex items-center gap-3 px-4 pt-2 pb-1">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/20 group">
                             <div className={`font-bold text-white text-[0.55rem] tracking-widest group-hover:scale-110 transition-transform ${aiThinking ? 'animate-pulse' : ''}`}>I.M</div>
                        </div>
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleEnter}
                            placeholder="Command or draft..."
                            className="flex-1 bg-transparent h-full py-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none tracking-tight"
                        />
                     </div>
                     
                     {/* Actions Row */}
                     <div className="grid grid-cols-4 gap-1 px-1">
                        {customActions.slice(0, 4).map((action, i) => (
                             <DockAction 
                                key={i}
                                label={action.label} 
                                onClick={action.handler} 
                                icon={action.icon}
                                primary={action.primary}
                                disabled={action.disabled}
                             />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};