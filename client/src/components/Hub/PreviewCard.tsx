import React from 'react';
import { Send, Calendar, User, Settings, Check, X, RefreshCw, Edit2 } from 'lucide-react';
import { ActionPreview } from './types';

interface PreviewCardProps {
    preview: ActionPreview;
    onAction: (actionId: string) => void;
    isDark?: boolean;
    isExecuting?: boolean;
}

const TYPE_ICONS = {
    email: Send,
    calendar: Calendar,
    contact: User,
    setting: Settings,
};

const TYPE_COLORS = {
    email: 'indigo',
    calendar: 'emerald',
    contact: 'amber',
    setting: 'slate',
};

const PreviewCard: React.FC<PreviewCardProps> = ({ preview, onAction, isDark = false, isExecuting = false }) => {
    const IconComponent = TYPE_ICONS[preview.type];
    const color = TYPE_COLORS[preview.type];

    return (
        <div className={`
      rounded-xl border overflow-hidden animate-in slide-in-from-bottom-2 duration-300
      ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}
    `}>
            {/* Header */}
            <div className={`px-4 py-3 flex items-center gap-3 border-b ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}-500/20 text-${color}-500`}>
                    <IconComponent size={16} />
                </div>
                <div className="flex-1">
                    <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                        {preview.type} Preview
                    </div>
                    <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {preview.title}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {preview.type === 'email' && preview.payload && (
                    <div className="space-y-2">
                        {preview.payload.to && (
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium ${isDark ? 'text-white/40' : 'text-slate-400'}`}>To:</span>
                                <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {Array.isArray(preview.payload.to) ? preview.payload.to.join(', ') : preview.payload.to}
                                </span>
                            </div>
                        )}
                        {preview.payload.subject && (
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Subject:</span>
                                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {preview.payload.subject}
                                </span>
                            </div>
                        )}
                        {preview.payload.body && (
                            <div className={`text-sm leading-relaxed mt-3 p-3 rounded-lg ${isDark ? 'bg-white/5 text-white/80' : 'bg-slate-50 text-slate-700'}`}>
                                <div dangerouslySetInnerHTML={{ __html: preview.payload.body.replace(/\n/g, '<br/>').slice(0, 300) }} />
                                {preview.payload.body.length > 300 && <span className="opacity-50">...</span>}
                            </div>
                        )}
                    </div>
                )}

                {preview.type === 'calendar' && preview.payload && (
                    <div className="space-y-2">
                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {preview.payload.title}
                        </div>
                        {preview.payload.startTime && (
                            <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                                📅 {new Date(preview.payload.startTime).toLocaleString()}
                                {preview.payload.duration && ` (${preview.payload.duration} min)`}
                            </div>
                        )}
                        {preview.payload.attendees && preview.payload.attendees.length > 0 && (
                            <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                                👥 {preview.payload.attendees.join(', ')}
                            </div>
                        )}
                    </div>
                )}

                {preview.type === 'contact' && preview.payload && (
                    <div className="space-y-2">
                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {preview.payload.name}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                            {preview.payload.email}
                        </div>
                        {preview.payload.company && (
                            <div className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                                {preview.payload.company}
                            </div>
                        )}
                    </div>
                )}

                {preview.type === 'setting' && (
                    <div className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                        {preview.description}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className={`px-4 py-3 flex gap-2 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                {preview.actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => onAction(action.id)}
                        disabled={isExecuting}
                        className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${action.variant === 'primary'
                                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                                : action.variant === 'danger'
                                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                    : isDark
                                        ? 'bg-white/10 text-white hover:bg-white/20'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }
            `}
                    >
                        {isExecuting && action.variant === 'primary' ? (
                            <RefreshCw size={14} className="animate-spin" />
                        ) : action.id === 'confirm' ? (
                            <Check size={14} />
                        ) : action.id === 'edit' ? (
                            <Edit2 size={14} />
                        ) : action.id === 'cancel' ? (
                            <X size={14} />
                        ) : null}
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PreviewCard;
