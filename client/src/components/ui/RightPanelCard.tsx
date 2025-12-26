import React from 'react';

interface RightPanelCardProps {
    /** Card title */
    title: string;
    /** Optional icon for the header */
    icon?: React.ReactNode;
    /** Optional action button for header */
    action?: React.ReactNode;
    /** Card content */
    children: React.ReactNode;
    /** Whether content is loading */
    loading?: boolean;
    /** Optional className for customization */
    className?: string;
}

/**
 * RightPanelCard - Reusable card for right sidebar panels
 * 
 * Use for:
 * - Intelligence/Brief panels
 * - Calendar event details
 * - Contact info cards
 */
export const RightPanelCard: React.FC<RightPanelCardProps> = ({
    title,
    icon,
    action,
    children,
    loading = false,
    className = ''
}) => {
    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon && (
                        <span className="text-slate-400 dark:text-slate-500">
                            {icon}
                        </span>
                    )}
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-900 dark:text-white font-bold">
                        {title}
                    </h3>
                </div>
                {action}
            </div>

            {/* Content */}
            <div className="p-4">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-slate-200 dark:border-slate-700 border-t-accent-primary rounded-full animate-spin" />
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default RightPanelCard;
