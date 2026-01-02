import React from 'react';
import { GlassModule, GlassHeader, GlassBody } from './Glass';
import { MessageThreadItem, SystemItem } from '../types';

interface WorkspacePanelProps {
    selectedItemId: string | number | null;
    currentThread: MessageThreadItem[];
    threadIndex: number;
    dockInput: string;
    setDockInput: (s: string) => void;
    activeView: string;
}

export const RightToolsPanel: React.FC<WorkspacePanelProps> = ({ 
    selectedItemId, currentThread, threadIndex, dockInput, setDockInput, activeView
}) => {
    
    // COMPOSE MODE
    if (activeView === 'compose') {
         return (
            <div className="flex flex-col gap-4 h-full pb-4 lg:pb-0 animate-slide-up">
                <GlassModule noHover className="shadow-lg border-slate-300">
                    <GlassHeader label="Target" />
                    <GlassBody><input type="text" placeholder="RECIPIENT..." className="w-full bg-transparent text-sm font-mono text-slate-800 outline-none placeholder:text-slate-400" /></GlassBody>
                </GlassModule>
                <GlassModule noHover className="flex-1 flex flex-col shadow-lg border-slate-300">
                    <GlassHeader label="Content" />
                    <div className="border-b border-slate-200 p-6">
                        <input type="text" placeholder="SUBJECT //" className="w-full bg-transparent text-2xl font-thin text-slate-900 outline-none placeholder:text-slate-300" />
                    </div>
                    <GlassBody className="flex-1">
                        <textarea 
                            value={dockInput}
                            onChange={(e) => setDockInput(e.target.value)}
                            className="w-full h-full bg-transparent text-sm text-slate-700 outline-none resize-none leading-relaxed font-light placeholder:text-slate-400"
                            placeholder="Drafting area..."
                        />
                    </GlassBody>
                </GlassModule>
            </div>
        );
    }

    // THREAD READING MODE
    const msg = currentThread[threadIndex];
    if (selectedItemId && msg) {
        return (
            <div className="flex flex-col h-full gap-4 animate-slide-up">
                <GlassModule noHover className="flex-1 flex flex-col shadow-lg overflow-hidden border-slate-300">
                    <GlassHeader label="Reading Pane" value={`THREAD ${threadIndex + 1}/${currentThread.length}`} />
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h1 className="text-lg font-bold text-slate-900 leading-tight mb-3">{msg.subject}</h1>
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-300">{msg.sender?.charAt(0)}</div>
                                <div>
                                    <div className="text-sm text-slate-800 font-bold">{msg.sender}</div>
                                    <div className="text-[0.6rem] text-slate-400 uppercase tracking-wide">To: Me</div>
                                </div>
                            </div>
                            <span className="text-[0.6rem] font-mono text-slate-400">{msg.time}</span>
                        </div>
                    </div>
                    <GlassBody className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-light">{msg.body}</div>
                    </GlassBody>
                    {msg.attachments && (
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2 overflow-x-auto">
                            {msg.attachments.map((a,i) => (
                                <span key={i} className="px-3 py-1.5 bg-white border border-slate-300 rounded text-[0.6rem] font-mono text-slate-600 uppercase tracking-wider flex items-center gap-2 shadow-sm">
                                    <span className="font-bold">FILE</span> {a.name}
                                </span>
                            ))}
                        </div>
                    )}
                </GlassModule>
            </div>
        );
    }

    // EMPTY STATE (Desktop)
    return (
        <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-slate-200 flex items-center justify-center text-2xl font-bold">i.M</div>
            <div className="text-xs uppercase tracking-[0.3em]">Select Item</div>
        </div>
    );
};