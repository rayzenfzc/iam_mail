import React from 'react';
import { Archive, Trash2 } from 'lucide-react';

export interface InboxRowProps {
    /** Unique email ID */
    id: string;
    /** Sender name */
    senderName: string;
    /** Email subject */
    subject: string;
    /** Preview text */
    preview: string;
    /** Formatted time string */
    time: string;
    /** Whether email has been read */
    read?: boolean;
    /** Whether this row is selected */
    isSelected?: boolean;
    /** Whether email has attachments */
    hasAttachments?: boolean;
    /** Row click handler */
    onClick?: () => void;
    /** Archive handler */
    onArchive?: () => void;
    /** Delete handler */
    onDelete?: () => void;
}

/**
 * InboxRow - Reusable component for email list items
 * 
 * Features:
 * - Fixed 72px height (80px on mobile via CSS variable)
 * - Unread indicator
 * - Hover actions
 * - Dark mode support
 * - Token-based styling
 */
export const InboxRow: React.FC<InboxRowProps> = ({
    senderName,
    subject,
    preview,
    time,
    read = false,
    isSelected = false,
    onClick,
    onArchive,
    onDelete
}) => {
    return (
        <div
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            className="group relative"
            style={{
                height: 'var(--height-email-row, 72px)',
                minHeight: 'var(--height-email-row, 72px)',
            }}
        >
            {/* Main Card */}
            <div
                className={`
                    h-full bg-white dark:bg-slate-900 rounded-xl border transition-all duration-200 cursor-pointer
                    flex flex-col justify-center overflow-hidden
                    px-[var(--space-4,16px)] py-[var(--space-3,12px)]
                    ${isSelected
                        ? 'border-slate-900 dark:border-slate-200 shadow-md ring-1 ring-slate-900 dark:ring-slate-200 z-10'
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm'
                    }
                    ${read ? 'opacity-70' : 'opacity-100'}
                `}
            >
                {/* Row 1: Sender + Timestamp */}
                <div className="flex justify-between items-center gap-2 mb-[var(--space-1,4px)]">
                    <div className="flex items-center gap-[var(--space-2,8px)] min-w-0 flex-1">
                        {!read && (
                            <div
                                className="w-2 h-2 rounded-full bg-[var(--accent-primary,#3B82F6)] flex-shrink-0"
                                aria-label="Unread"
                            />
                        )}
                        <span
                            className="text-[var(--text-base,14px)] font-semibold text-[var(--text-primary)] truncate"
                        >
                            {senderName}
                        </span>
                    </div>
                    <span
                        className="text-[var(--text-sm,12px)] text-[var(--text-tertiary)] font-medium flex-shrink-0 ml-2"
                    >
                        {time}
                    </span>
                </div>

                {/* Row 2: Subject (single line, truncated) */}
                <div
                    className="text-[var(--text-base,14px)] text-[var(--text-primary)] font-semibold truncate mb-[var(--space-1,4px)] pr-24"
                >
                    {subject}
                </div>

                {/* Row 3: Preview (single line) */}
                <div
                    className="text-[var(--text-base,14px)] text-[var(--text-secondary)] line-clamp-1 pr-24"
                >
                    {preview}
                </div>

                {/* Hover Actions */}
                {(onArchive || onDelete) && (
                    <div
                        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {onArchive && (
                            <button
                                onClick={onArchive}
                                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                aria-label="Archive"
                            >
                                <Archive size={16} className="text-slate-600 dark:text-slate-300" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                aria-label="Delete"
                            >
                                <Trash2 size={16} className="text-slate-600 dark:text-slate-300 hover:text-red-500" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InboxRow;
