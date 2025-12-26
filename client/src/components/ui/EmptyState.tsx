import React from 'react';

interface EmptyStateProps {
    /** Icon component to display */
    icon?: React.ReactNode;
    /** Main heading text */
    title: string;
    /** Optional description text */
    description?: string;
    /** Optional action button */
    action?: React.ReactNode;
    /** Size variant: 'sm' for inline, 'lg' for full page */
    size?: 'sm' | 'lg';
}

/**
 * EmptyState - Reusable empty/placeholder state component
 * 
 * Use for:
 * - Empty inbox/folders
 * - No search results
 * - First-time user experience
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    size = 'lg'
}) => {
    const isLarge = size === 'lg';

    return (
        <div
            className={`
                flex flex-col items-center justify-center text-center
                ${isLarge ? 'py-20 px-8' : 'py-8 px-4'}
            `}
        >
            {/* Icon */}
            {icon && (
                <div
                    className={`
                        flex items-center justify-center rounded-full
                        bg-slate-100 dark:bg-slate-800
                        text-slate-400 dark:text-slate-500
                        ${isLarge ? 'w-20 h-20 mb-6' : 'w-12 h-12 mb-4'}
                    `}
                >
                    {icon}
                </div>
            )}

            {/* Title */}
            <h3
                className={`
                    font-semibold text-slate-900 dark:text-white
                    ${isLarge ? 'text-xl mb-2' : 'text-base mb-1'}
                `}
            >
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p
                    className={`
                        text-slate-500 dark:text-slate-400 max-w-sm
                        ${isLarge ? 'text-sm' : 'text-xs'}
                    `}
                >
                    {description}
                </p>
            )}

            {/* Action */}
            {action && (
                <div className={isLarge ? 'mt-6' : 'mt-4'}>
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
