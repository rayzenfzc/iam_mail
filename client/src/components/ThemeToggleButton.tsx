import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleButtonProps {
    isDarkMode: boolean;
    onToggle: () => void;
    className?: string;
}

/**
 * Simple Theme Toggle Button
 * Elegant sun/moon toggle for switching between light and dark modes.
 * Uses design tokens for styling.
 */
export function ThemeToggleButton({ isDarkMode, onToggle, className = '' }: ThemeToggleButtonProps) {
    return (
        <button
            onClick={onToggle}
            className={`
        fixed top-4 right-4 z-50
        w-10 h-10
        flex items-center justify-center
        rounded-full
        bg-[var(--bg-elevated)]
        border border-[var(--border-default)]
        shadow-[var(--shadow-md)]
        transition-all duration-200 ease-in-out
        hover:bg-[var(--bg-hover)]
        hover:scale-105
        active:scale-95
        focus:outline-none
        focus:ring-2
        focus:ring-[var(--border-focus)]
        focus:ring-offset-2
        ${className}
      `}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDarkMode ? (
                <Sun
                    size={20}
                    className="text-[var(--text-primary)] transition-transform duration-200"
                />
            ) : (
                <Moon
                    size={20}
                    className="text-[var(--text-primary)] transition-transform duration-200"
                />
            )}
        </button>
    );
}

export default ThemeToggleButton;
