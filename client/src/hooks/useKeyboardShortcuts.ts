import { useEffect, useCallback } from 'react';
import { useAppState, useAppActions } from '../../context/AppStateContext';

// ============================================
// KEYBOARD SHORTCUTS HOOK
// ============================================

interface ShortcutOptions {
    onFocusDock?: () => void;
}

export function useKeyboardShortcuts(options: ShortcutOptions = {}) {
    const { state, dockMode } = useAppState();
    const actions = useAppActions();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

        // Cmd/Ctrl + K: Focus dock input
        if (cmdOrCtrl && e.key === 'k') {
            e.preventDefault();
            options.onFocusDock?.();
            return;
        }

        // Cmd/Ctrl + N: New compose
        if (cmdOrCtrl && e.key === 'n') {
            e.preventDefault();
            actions.openCompose('new');
            return;
        }

        // Cmd/Ctrl + Enter: Send (in compose mode)
        if (cmdOrCtrl && e.key === 'Enter' && dockMode === 'compose_view') {
            e.preventDefault();
            // TODO: Trigger send
            console.log('Send shortcut triggered');
            return;
        }

        // Escape: Back/Close (priority order)
        if (e.key === 'Escape') {
            e.preventDefault();

            // Priority 1: Close picker
            if (state.pickerOpen) {
                actions.closePicker();
                return;
            }

            // Priority 2: Clear search
            if (state.activeView === 'inbox' && state.searchQuery) {
                actions.clearSearch();
                return;
            }

            // Priority 3: Close compose (without dirty check - caller should handle)
            if (state.activeView === 'compose') {
                // Note: In real implementation, check dirty state first
                actions.closeCompose();
                return;
            }

            // Priority 4: Deselect thread
            if (state.selectedItemId) {
                actions.selectItem(null);
                return;
            }

            // Priority 5: Close sidebar (mobile)
            if (state.isSidebarOpen) {
                actions.toggleSidebar();
                return;
            }
        }

        // R: Reply (in thread view)
        if (e.key === 'r' && !cmdOrCtrl && dockMode === 'thread_view' && !isTyping()) {
            e.preventDefault();
            actions.openCompose('reply');
            return;
        }

        // F: Forward (in thread view)
        if (e.key === 'f' && !cmdOrCtrl && dockMode === 'thread_view' && !isTyping()) {
            e.preventDefault();
            actions.openCompose('forward');
            return;
        }

        // Arrow keys for thread navigation
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (dockMode === 'thread_view' && !isTyping()) {
                // Thread navigation handled by ThreadView component
            }
        }

    }, [state, dockMode, actions, options]);

    // Check if user is typing in an input
    const isTyping = () => {
        const active = document.activeElement;
        return active?.tagName === 'INPUT' ||
            active?.tagName === 'TEXTAREA' ||
            (active as HTMLElement)?.isContentEditable;
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

export default useKeyboardShortcuts;
