import React, { useEffect, useState, useRef } from 'react';

interface SplitFlapTextProps {
    text: string;
    className?: string; // For typography matching
    delay?: number; // Optional delay for staggered effect
}

const SplitFlapText: React.FC<SplitFlapTextProps> = ({ text, className = '', delay = 0 }) => {
    const [display, setDisplay] = useState(text);
    const [animating, setAnimating] = useState(false);
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (text !== display) {
            // Text changed - Trigger Animation
            setAnimating(true);
            const timer = setTimeout(() => {
                setDisplay(text);
                setAnimating(false);
            }, 300); // 300ms flip duration
            return () => clearTimeout(timer);
        }
    }, [text, display]);

    // On mount, if it's new, we can animate or just show.
    // User asked: "New email inserted... animate... once".
    // If this component mounts with new text, animate it.
    useEffect(() => {
        if (isFirstRun.current) {
            setAnimating(true);
            setTimeout(() => setAnimating(false), 300 + delay);
            isFirstRun.current = false;
        }
    }, [delay]);

    return (
        <span className={`inline-block relative perspective-300 ${className}`}>
            {/* 3D FLIP CONTAINER */}
            <span
                className={`
                    inline-block transform-style-3d origin-center backface-hidden will-change-transform
                    ${animating ? 'animate-flip-in' : ''}
                `}
                style={{
                    animationDuration: '300ms',
                    animationDelay: `${delay}ms`,
                    animationFillMode: 'both',
                    animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Mechanical bounce
                }}
            >
                {text}
            </span>

            {/* CSS INJECTION FOR KEYFRAMES (Scoped or Global) */}
            <style>{`
                .perspective-300 { perspective: 400px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                
                @keyframes flip-in {
                    0% {
                        opacity: 0;
                        transform: rotateX(-90deg)translateY(-10px);
                    }
                    60% {
                        opacity: 1;
                        transform: rotateX(20deg); /* Overshoot */
                    }
                    100% {
                        opacity: 1;
                        transform: rotateX(0deg) translateY(0);
                    }
                }
            `}</style>
        </span>
    );
};

export default SplitFlapText;
