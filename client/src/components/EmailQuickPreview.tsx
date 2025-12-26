import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronUp, Reply, Archive, Trash2, Forward, MoreHorizontal } from 'lucide-react';
import { Email } from '../types';

interface EmailQuickPreviewProps {
    email: Email | null;
    isOpen: boolean;
    onClose: () => void;
    onReply?: () => void;
    onArchive?: () => void;
    onDelete?: () => void;
    onOpenFull?: () => void;
}

/**
 * EmailQuickPreview - Mobile-friendly slide-up preview panel
 * 
 * Features:
 * - Slide up from bottom
 * - Drag to expand/collapse
 * - Quick actions (Reply, Archive, Delete)
 * - Swipe down to dismiss
 */
export const EmailQuickPreview: React.FC<EmailQuickPreviewProps> = ({
    email,
    isOpen,
    onClose,
    onReply,
    onArchive,
    onDelete,
    onOpenFull
}) => {
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const startY = useRef(0);
    const contentRef = useRef<HTMLDivElement>(null);

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            setDragY(0);
            setIsExpanded(false);
        }
    }, [isOpen]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleTouchStart = (e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        // Only allow dragging down (positive diff) or up to expand
        if (diff > 0) {
            setDragY(diff);
        } else if (diff < -50 && !isExpanded) {
            setIsExpanded(true);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        // If dragged down more than 100px, close
        if (dragY > 100) {
            onClose();
        }
        setDragY(0);
    };

    if (!isOpen || !email) return null;

    const message = email.thread?.[0] || {
        senderName: email.senderName,
        preview: email.preview,
        time: email.time,
        body: email.preview
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-40 md:hidden animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Preview Panel */}
            <div
                className={`
                    fixed left-0 right-0 bottom-0 z-50 md:hidden
                    bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl
                    transition-transform duration-300 ease-out
                    ${isExpanded ? 'h-[85vh]' : 'h-[60vh]'}
                `}
                style={{
                    transform: `translateY(${dragY}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out, height 0.3s ease-out'
                }}
            >
                {/* Drag Handle */}
                <div
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
                >
                    <div className="w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <button
                        onClick={onClose}
                        className="p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X size={20} />
                    </button>

                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Quick Look
                    </span>

                    <button
                        onClick={() => { onOpenFull?.(); onClose(); }}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <ChevronUp size={20} />
                    </button>
                </div>

                {/* Email Content */}
                <div
                    ref={contentRef}
                    className="flex-1 overflow-y-auto px-5 py-4"
                    style={{ maxHeight: isExpanded ? 'calc(85vh - 180px)' : 'calc(60vh - 180px)' }}
                >
                    {/* Sender & Time */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium">
                                {email.senderName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-medium text-slate-900 dark:text-white">{email.senderName}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{email.time}</div>
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        {email.subject}
                    </h2>

                    {/* Body Preview */}
                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {message.body || email.preview}
                        {!isExpanded && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => setIsExpanded(true)}
                                    className="text-xs text-blue-500 font-medium"
                                >
                                    Swipe up to read more...
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-around">
                        <button
                            onClick={() => { onReply?.(); onClose(); }}
                            className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Reply size={20} className="text-blue-500" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">Reply</span>
                        </button>

                        <button
                            onClick={() => { onArchive?.(); onClose(); }}
                            className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Archive size={20} className="text-slate-500" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">Archive</span>
                        </button>

                        <button
                            onClick={() => { onDelete?.(); onClose(); }}
                            className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Trash2 size={20} className="text-red-500" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">Delete</span>
                        </button>

                        <button
                            className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Forward size={20} className="text-slate-500" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">Forward</span>
                        </button>

                        <button
                            className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <MoreHorizontal size={20} className="text-slate-500" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">More</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmailQuickPreview;
