import React from 'react';
import { ChevronLeft, MoreHorizontal, Star, Archive, Trash2 } from 'lucide-react';

interface ThreadHeaderProps {
    /** Email subject line */
    subject: string;
    /** Sender name */
    senderName: string;
    /** Sender email */
    senderEmail?: string;
    /** Number of messages in thread */
    messageCount?: number;
    /** Whether email is starred */
    isStarred?: boolean;
    /** Back button handler */
    onBack?: () => void;
    /** Star toggle handler */
    onToggleStar?: () => void;
    /** Archive handler */
    onArchive?: () => void;
    /** Delete handler */
    onDelete?: () => void;
    /** More actions handler */
    onMoreActions?: () => void;
}

/**
 * ThreadHeader - Header component for email detail/thread view
 * 
 * Features:
 * - Back navigation
 * - Subject + sender info
 * - Quick actions (star, archive, delete, more)
 */
export const ThreadHeader: React.FC<ThreadHeaderProps> = ({
    subject,
    senderName,
    senderEmail,
    messageCount = 1,
    isStarred = false,
    onBack,
    onToggleStar,
    onArchive,
    onDelete,
    onMoreActions
}) => {
    return (
        <div
            className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800"
            style={{ height: 'var(--height-header, 64px)' }}
        >
            <div className="h-full px-4 flex items-center justify-between gap-4">
                {/* Left: Back + Subject */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            aria-label="Go back"
                        >
                            <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
                        </button>
                    )}

                    <div className="flex-1 min-w-0">
                        <h1 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                            {subject}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="truncate">{senderName}</span>
                            {senderEmail && (
                                <span className="text-slate-400 dark:text-slate-500 truncate">
                                    &lt;{senderEmail}&gt;
                                </span>
                            )}
                            {messageCount > 1 && (
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                    {messageCount} messages
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1">
                    {onToggleStar && (
                        <button
                            onClick={onToggleStar}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            aria-label={isStarred ? 'Unstar' : 'Star'}
                        >
                            <Star
                                size={18}
                                className={isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}
                            />
                        </button>
                    )}

                    {onArchive && (
                        <button
                            onClick={onArchive}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            aria-label="Archive"
                        >
                            <Archive size={18} className="text-slate-400" />
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                            aria-label="Delete"
                        >
                            <Trash2 size={18} className="text-slate-400 hover:text-red-500" />
                        </button>
                    )}

                    {onMoreActions && (
                        <button
                            onClick={onMoreActions}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            aria-label="More actions"
                        >
                            <MoreHorizontal size={18} className="text-slate-400" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThreadHeader;
