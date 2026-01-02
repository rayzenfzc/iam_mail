import React from 'react';
import { GlassModule, GlassHeader, GlassBody } from '../ui/GlassKit';
import { useAppState } from '../../context/AppStateContext';
import { EmailItem } from './InboxList';

// ============================================
// RIGHT PANE - CONTEXT WIDGETS
// ============================================

interface RightPaneProps {
    selectedEmail?: EmailItem | null;
    attachments?: { name: string; size: string }[];
    relatedTasks?: { id: string; title: string; done: boolean }[];
    aiSummary?: string;
}

export const RightPane: React.FC<RightPaneProps> = ({
    selectedEmail,
    attachments = [],
    relatedTasks = [],
    aiSummary
}) => {
    const { state, effectiveAiEnabled } = useAppState();

    // If no email selected, show empty state
    if (!selectedEmail && state.activeView !== 'compose') {
        return (
            <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar p-1">
                <div className="flex-1 flex items-center justify-center opacity-30">
                    <div className="text-center">
                        <div className="text-4xl mb-4">📧</div>
                        <span className="text-xs uppercase tracking-widest text-slate-500">
                            Select an email
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // Compose context
    if (state.activeView === 'compose') {
        return (
            <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar p-1">
                {/* Recipients Preview */}
                <GlassModule noHover className="shadow-sm">
                    <GlassHeader label="Recipients" />
                    <GlassBody className="space-y-2">
                        {state.composeDraft.to ? (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                    {state.composeDraft.to.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-mono text-slate-600">{state.composeDraft.to}</span>
                            </div>
                        ) : (
                            <span className="text-xs text-slate-400">No recipient</span>
                        )}
                    </GlassBody>
                </GlassModule>

                {/* AI Tone Preview (if AI ON) */}
                {effectiveAiEnabled && (
                    <GlassModule noHover className="shadow-sm border-indigo-100 bg-indigo-50/30">
                        <GlassHeader label="Tone Analysis" icon="✨" />
                        <GlassBody>
                            <div className="flex gap-2 flex-wrap">
                                <span className="text-[0.5rem] px-2 py-1 bg-white rounded border border-slate-200 text-slate-600">NEUTRAL</span>
                            </div>
                            <p className="text-xs text-indigo-500 mt-2">
                                Use dock chips to adjust tone
                            </p>
                        </GlassBody>
                    </GlassModule>
                )}
            </div>
        );
    }

    // Thread context
    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar p-1">
            {/* Contact Card (always show) */}
            <GlassModule noHover className="shadow-lg">
                <GlassHeader label="Contact" />
                <GlassBody className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600">
                        {selectedEmail?.sender?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">
                            {selectedEmail?.sender}
                        </div>
                        <div className="text-xs font-mono text-slate-500 truncate">
                            {selectedEmail?.senderEmail}
                        </div>
                    </div>
                </GlassBody>
            </GlassModule>

            {/* Attachments (collapse if empty) */}
            {attachments.length > 0 && (
                <GlassModule noHover className="shadow-sm">
                    <GlassHeader label="Attachments" value={`${attachments.length} files`} />
                    <GlassBody className="space-y-2">
                        {attachments.map((file, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-white/50 px-3 py-2 rounded-lg border border-white/60 cursor-pointer hover:bg-white hover:shadow-sm">
                                <span>📎</span>
                                <span className="flex-1 truncate">{file.name}</span>
                                <span className="text-slate-400">{file.size}</span>
                            </div>
                        ))}
                    </GlassBody>
                </GlassModule>
            )}

            {/* Related Tasks (collapse if empty) */}
            {relatedTasks.length > 0 && (
                <GlassModule noHover className="shadow-sm">
                    <GlassHeader label="Related Tasks" value={`${relatedTasks.length}`} />
                    <GlassBody className="space-y-2">
                        {relatedTasks.map(task => (
                            <div key={task.id} className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded border-2 ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                                    }`}>
                                    {task.done && <span className="text-white text-xs">✓</span>}
                                </div>
                                <span className={`text-xs ${task.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                    {task.title}
                                </span>
                            </div>
                        ))}
                    </GlassBody>
                </GlassModule>
            )}

            {/* AI Summary (collapse if not generated) */}
            {effectiveAiEnabled && aiSummary && (
                <GlassModule noHover className="shadow-sm border-indigo-100 bg-indigo-50/30">
                    <GlassHeader label="AI Summary" icon="✨" />
                    <GlassBody>
                        <p className="text-xs text-slate-700 leading-relaxed">
                            {aiSummary}
                        </p>
                    </GlassBody>
                </GlassModule>
            )}

            {/* Generate Summary Button (if AI ON and no summary yet) */}
            {effectiveAiEnabled && !aiSummary && (
                <GlassModule noHover className="shadow-sm opacity-50 hover:opacity-100 cursor-pointer">
                    <GlassBody className="text-center py-4">
                        <span className="text-xs uppercase tracking-widest text-slate-500">
                            ✨ Generate AI Summary
                        </span>
                    </GlassBody>
                </GlassModule>
            )}
        </div>
    );
};

export default RightPane;
