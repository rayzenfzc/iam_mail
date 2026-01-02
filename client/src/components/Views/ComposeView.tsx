import React, { useRef, useEffect } from 'react';
import { GlassModule, GlassHeader, GlassBody } from '../ui/GlassKit';
import { useAppState, useAppActions } from '../../context/AppStateContext';

// ============================================
// COMPOSE VIEW (Glass Kit)
// ============================================

interface ComposeViewProps {
    onSend?: (draft: { to: string; subject: string; body: string }) => void;
    onClose?: () => void;
}

export const ComposeView: React.FC<ComposeViewProps> = ({
    onSend,
    onClose
}) => {
    const { state, effectiveAiEnabled } = useAppState();
    const actions = useAppActions();
    const bodyRef = useRef<HTMLTextAreaElement>(null);

    // Focus body on mount
    useEffect(() => {
        bodyRef.current?.focus();
    }, []);

    // Handle send
    const handleSend = () => {
        const draft = state.composeDraft;
        if (!draft.to || !draft.subject || !draft.body) {
            console.warn('Missing required fields');
            return;
        }
        onSend?.({ to: draft.to, subject: draft.subject, body: draft.body });
        actions.closeCompose();
    };

    // Handle close with dirty check
    const handleClose = () => {
        if (state.composeDraft.dirty) {
            // TODO: Show confirm dialog
            const confirm = window.confirm('You have unsaved changes. Discard draft?');
            if (!confirm) return;
        }
        actions.closeCompose();
        onClose?.();
    };

    return (
        <div className="flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar p-1 pb-40 lg:pb-0">
            {/* To Field */}
            <GlassModule noHover className="shadow-lg">
                <GlassHeader label="To" icon="→" />
                <GlassBody>
                    <input
                        type="text"
                        value={state.composeDraft.to}
                        onChange={(e) => actions.updateDraft({ to: e.target.value })}
                        placeholder="recipient@email.com"
                        className="w-full bg-transparent text-sm font-mono text-indigo-600 outline-none placeholder:text-slate-300"
                    />
                </GlassBody>
            </GlassModule>

            {/* CC/BCC (Collapsible) */}
            {(state.composeDraft.cc || state.composeDraft.bcc) && (
                <GlassModule noHover className="shadow-sm">
                    <div className="grid grid-cols-2 divide-x divide-slate-100">
                        <div className="p-4">
                            <span className="text-[0.5rem] font-bold uppercase tracking-widest text-slate-400 block mb-2">CC</span>
                            <input
                                type="text"
                                value={state.composeDraft.cc}
                                onChange={(e) => actions.updateDraft({ cc: e.target.value })}
                                placeholder="cc@email.com"
                                className="w-full bg-transparent text-xs font-mono text-slate-600 outline-none placeholder:text-slate-300"
                            />
                        </div>
                        <div className="p-4">
                            <span className="text-[0.5rem] font-bold uppercase tracking-widest text-slate-400 block mb-2">BCC</span>
                            <input
                                type="text"
                                value={state.composeDraft.bcc}
                                onChange={(e) => actions.updateDraft({ bcc: e.target.value })}
                                placeholder="bcc@email.com"
                                className="w-full bg-transparent text-xs font-mono text-slate-600 outline-none placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                </GlassModule>
            )}

            {/* Main Compose Card */}
            <GlassModule noHover className="flex-1 flex flex-col shadow-lg min-h-[300px]">
                <GlassHeader label="Compose" />

                {/* Subject */}
                <div className="border-b border-slate-100 p-6">
                    <input
                        type="text"
                        value={state.composeDraft.subject}
                        onChange={(e) => actions.updateDraft({ subject: e.target.value })}
                        placeholder="Subject..."
                        className="w-full bg-transparent text-2xl font-thin text-slate-900 outline-none placeholder:text-slate-200 tracking-tight"
                    />
                </div>

                {/* Body */}
                <GlassBody className="flex-1 flex flex-col">
                    <textarea
                        ref={bodyRef}
                        value={state.composeDraft.body}
                        onChange={(e) => actions.updateDraft({ body: e.target.value })}
                        placeholder="Write your message..."
                        className="w-full flex-1 bg-transparent text-sm text-slate-700 outline-none resize-none leading-relaxed font-light min-h-[200px]"
                    />
                </GlassBody>

                {/* Attachments Preview */}
                {state.composeDraft.attachments.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-3 flex flex-wrap gap-2">
                        {state.composeDraft.attachments.map((file, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-white/50 px-3 py-2 rounded-lg border border-white/60">
                                <span>📎</span>
                                <span className="truncate max-w-[150px]">{file.name}</span>
                                <button
                                    onClick={() => {
                                        const newAttachments = [...state.composeDraft.attachments];
                                        newAttachments.splice(i, 1);
                                        actions.updateDraft({ attachments: newAttachments });
                                    }}
                                    className="text-slate-400 hover:text-red-500"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </GlassModule>

            {/* AI Assistance Panel (if AI ON) */}
            {effectiveAiEnabled && (
                <GlassModule noHover className="shadow-sm border-indigo-100 bg-indigo-50/30">
                    <div className="p-4 flex items-center gap-4">
                        <span className="text-lg">✨</span>
                        <div className="flex-1">
                            <span className="text-[0.6rem] font-bold uppercase tracking-widest text-indigo-600">AI Assist Ready</span>
                            <p className="text-xs text-indigo-500 mt-0.5">Use tone chips in dock to rewrite your message</p>
                        </div>
                    </div>
                </GlassModule>
            )}
        </div>
    );
};

export default ComposeView;
