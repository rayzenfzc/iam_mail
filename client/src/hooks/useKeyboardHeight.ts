import { useState, useEffect } from 'react';

/**
 * Hook to detect keyboard height on mobile devices
 * Uses Visual Viewport API to calculate keyboard height
 * Returns 0 on desktop or when keyboard is hidden
 */
export function useKeyboardHeight(): number {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        // Check if Visual Viewport API is supported (mobile browsers)
        if (!window.visualViewport) {
            return;
        }

        const handleResize = () => {
            // Calculate keyboard height
            // visualViewport.height = visible viewport (screen minus keyboard)
            // window.innerHeight = full screen height
            const viewport = window.visualViewport;
            if (!viewport) return;

            // Keyboard is visible when visualViewport.height < window.innerHeight
            const keyboardVisible = viewport.height < window.innerHeight;

            if (keyboardVisible) {
                // Keyboard height = difference between full screen and visible viewport
                const height = window.innerHeight - viewport.height;
                setKeyboardHeight(height);
            } else {
                setKeyboardHeight(0);
            }
        };

        // Listen to viewport resize (keyboard show/hide)
        window.visualViewport.addEventListener('resize', handleResize);
        window.visualViewport.addEventListener('scroll', handleResize);

        // Initial check
        handleResize();

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
            window.visualViewport?.removeEventListener('scroll', handleResize);
        };
    }, []);

    return keyboardHeight;
}
