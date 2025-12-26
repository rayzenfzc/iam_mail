/**
 * i AM Mail - Theme Switcher
 * Handles theme toggling between Default (light) and Superhuman (dark)
 * Features: localStorage persistence, system preference detection, smooth transitions
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'iam-theme';
    const THEMES = {
        LIGHT: 'default',
        DARK: 'superhuman'
    };

    /**
     * Get user's preferred theme from localStorage or system preference
     */
    function getPreferredTheme() {
        // Check localStorage first
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return stored;

        // Fall back to system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEMES.DARK;
        }

        return THEMES.LIGHT;
    }

    /**
     * Apply theme to document
     */
    function setTheme(theme) {
        const html = document.documentElement;

        // Set data attribute
        html.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === THEMES.DARK ? '#000000' : '#ffffff');
        }

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, theme);

        // Dispatch custom event for React/other frameworks to listen to
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
        const next = current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
        setTheme(next);
        return next;
    }

    /**
     * Get current theme
     */
    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
    }

    /**
     * Initialize theme on page load
     */
    function init() {
        // Prevent flash of wrong theme
        document.documentElement.classList.add('no-transitions');

        // Apply preferred theme
        setTheme(getPreferredTheme());

        // Enable transitions after initial render
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.documentElement.classList.remove('no-transitions');
            });
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set preference
                if (!localStorage.getItem(STORAGE_KEY)) {
                    setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
                }
            });
        }
    }

    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API globally
    window.iamTheme = {
        toggle: toggleTheme,
        set: setTheme,
        get: getCurrentTheme,
        THEMES: THEMES
    };

})();
