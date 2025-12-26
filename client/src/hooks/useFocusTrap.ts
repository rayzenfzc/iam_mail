import { useEffect, useRef, useCallback } from 'react';

/**
 * useFocusTrap - Traps keyboard focus within a modal/dialog
 * 
 * Features:
 * - Traps Tab/Shift+Tab within focusable elements
 * - Restores focus to trigger element on close
 * - Handles Escape key to close
 * - Auto-focuses first focusable element on mount
 */
export function useFocusTrap(isActive: boolean, onClose?: () => void) {
    const containerRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Store the previously focused element when trap activates
    useEffect(() => {
        if (isActive) {
            previousFocusRef.current = document.activeElement as HTMLElement;
        }
    }, [isActive]);

    // Restore focus when deactivating
    useEffect(() => {
        return () => {
            if (previousFocusRef.current && !isActive) {
                previousFocusRef.current.focus();
            }
        };
    }, [isActive]);

    // Focus first focusable element when activated
    useEffect(() => {
        if (isActive && containerRef.current) {
            const focusableElements = getFocusableElements(containerRef.current);
            if (focusableElements.length > 0) {
                // Small delay to ensure DOM is ready
                requestAnimationFrame(() => {
                    focusableElements[0].focus();
                });
            }
        }
    }, [isActive]);

    // Handle keyboard events
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!isActive || !containerRef.current) return;

        // Handle Escape
        if (event.key === 'Escape' && onClose) {
            event.preventDefault();
            onClose();
            return;
        }

        // Handle Tab
        if (event.key === 'Tab') {
            const focusableElements = getFocusableElements(containerRef.current);
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
                // Shift+Tab: if on first element, go to last
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab: if on last element, go to first
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }, [isActive, onClose]);

    // Attach/detach keyboard listener
    useEffect(() => {
        if (isActive) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isActive, handleKeyDown]);

    return containerRef;
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const elements = container.querySelectorAll<HTMLElement>(focusableSelectors);
    return Array.from(elements).filter(el => {
        // Filter out hidden elements
        return el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
    });
}

export default useFocusTrap;
