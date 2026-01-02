import React, { useRef, ReactNode } from 'react';

interface TectonicCardProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const TectonicCard: React.FC<TectonicCardProps> = ({ children, className = '', style, onClick }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Obsidian Refraction Effect
        cardRef.current.style.background = `
            radial-gradient(400px circle at ${x}px ${y}px, rgba(255,255,255,0.05), transparent 40%),
            var(--glass-base)
        `;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 50;
        const rotateY = (x - centerX) / 50;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        cardRef.current.style.boxShadow = `
            ${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0,0,0,0.5),
            var(--obsidian-edge)
        `;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.background = `var(--glass-base)`;
        cardRef.current.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
        cardRef.current.style.boxShadow = `var(--tectonic-shadow), var(--obsidian-edge)`;
    };

    return (
        <div
            ref={cardRef}
            className={`tectonic-card ${className}`}
            style={style}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="sintered-texture">
                <svg width="100%" height="100%">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="4" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>
            {children}
        </div>
    );
};

export default TectonicCard;
