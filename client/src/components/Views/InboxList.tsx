import React, { useEffect, useState, useMemo } from 'react';
import { GlassModule, GlassModuleSkeleton } from '../ui/GlassKit';
import { useAppState, useAppActions } from '../../context/AppStateContext';

// ============================================
// EMAIL ITEM TYPE
// ============================================

export interface EmailItem {
    id: string | number;
    sender: string;
    senderEmail: string;
    subject: string;
    snippet?: string;
    body?: string;
    timestamp: string | Date;
    status?: 'URGENT' | 'UNREAD' | 'PENDING' | 'REVIEW' | 'READ';
    isRead?: boolean;
    isStarred?: boolean;
    hasAttachments?: boolean;
    labels?: string[];
}

// ============================================
// INBOX LIST VIEW (with Glass Kit)
// ============================================

interface InboxListProps {
    emails: EmailItem[];
    isLoading?: boolean;
    onEmailClick?: (email: EmailItem) => void;
}

export const InboxList: React.FC<InboxListProps> = ({
    emails,
    isLoading = false,
    onEmailClick
}) => {
    const { state } = useAppState();
    const actions = useAppActions();

    // Filter emails based on search query and filter
    const filteredEmails = useMemo(() => {
        let result = emails;

        // Apply inbox filter
        if (state.inboxFilter === 'unread') {
            result = result.filter(e => !e.isRead || e.status === 'UNREAD');
        } else if (state.inboxFilter === 'urgent') {
            result = result.filter(e => e.status === 'URGENT');
        }

        // Apply search query
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            result = result.filter(e =>
                e.subject?.toLowerCase().includes(query) ||
                e.sender?.toLowerCase().includes(query) ||
                e.snippet?.toLowerCase().includes(query)
            );
        }

        return result;
    }, [emails, state.inboxFilter, state.searchQuery]);

    // Handle email selection
    const handleEmailClick = (email: EmailItem) => {
        actions.selectItem(email.id);
        onEmailClick?.(email);
    };

    // Format timestamp
    const formatTime = (timestamp: string | Date) => {
        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }

        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <GlassModuleSkeleton key={i} />
                ))}
            </div>
        );
    }

    // Empty state
    if (filteredEmails.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 opacity-50">
                <div className="text-4xl mb-4">📭</div>
                <div className="text-[0.6rem] uppercase tracking-widest text-slate-500">
                    {state.searchQuery ? 'No matches found' : 'No emails'}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between px-2">
                <span className="text-[0.55rem] font-mono text-slate-400 bg-white/50 px-2 py-0.5 rounded border border-white/50">
                    {filteredEmails.length} {state.inboxFilter !== 'all' ? state.inboxFilter.toUpperCase() : 'EMAILS'}
                </span>
            </div>

            {/* Email List */}
            {filteredEmails.map((email) => (
                <GlassModule
                    key={email.id}
                    isActive={state.selectedItemId === email.id}
                    onClick={() => handleEmailClick(email)}
                >
                    <div className="p-4 md:p-5 flex flex-col gap-3">
                        {/* Row 1: Sender + Time */}
                        <div className="flex justify-between items-start">
                            <span className={`text-[10px] md:text-[0.7rem] font-bold uppercase tracking-wider ${state.selectedItemId === email.id ? 'text-indigo-700' : 'text-slate-900'
                                }`}>
                                {email.sender}
                            </span>
                            <span className="text-[10px] md:text-[0.55rem] font-mono text-slate-400 shrink-0 ml-2">
                                {formatTime(email.timestamp)}
                            </span>
                        </div>

                        {/* Row 2: Subject */}
                        <div className={`text-base md:text-sm font-medium leading-tight tracking-tight line-clamp-2 ${email.isRead ? 'text-slate-600' : 'text-slate-900'
                            }`}>
                            {email.subject}
                        </div>

                        {/* Row 3: Snippet (if available) */}
                        {email.snippet && (
                            <div className="text-sm md:text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                {email.snippet}
                            </div>
                        )}

                        {/* Row 4: Status + Attachments */}
                        <div className="flex items-center gap-2">
                            {email.status && email.status !== 'READ' && (
                                <span className={`text-[0.5rem] font-bold uppercase tracking-widest px-2 py-1 rounded border ${email.status === 'URGENT'
                                    ? 'bg-red-50 text-red-600 border-red-200'
                                    : email.status === 'UNREAD'
                                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}>
                                    {email.status}
                                </span>
                            )}
                            {email.hasAttachments && (
                                <span className="text-xs text-slate-400">📎</span>
                            )}
                            {email.isStarred && (
                                <span className="text-xs text-amber-500">★</span>
                            )}
                        </div>
                    </div>
                </GlassModule>
            ))}
        </div>
    );
};

export default InboxList;
