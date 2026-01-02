import { useEffect, useRef } from 'react';

export const useMouseRefraction = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const cards = container.querySelectorAll('.card-vitreous, .search-conduit');
            cards.forEach((card: any) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Only apply if mouse is within a reasonable distance or inside
                if (x > -100 && x < rect.width + 100 && y > -100 && y < rect.height + 100) {
                    card.style.background = `
                        radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 40%),
                        var(--vitreous-glass)
                    `;

                    // Slight tilt
                    const centerX = rect.width / 2;
                    const rotateY = (x - centerX) / 100;
                    card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) translateX(${card.matches(':hover') ? '10px' : '0'})`;
                } else {
                    card.style.background = 'var(--vitreous-glass)';
                    card.style.transform = 'perspective(1000px) rotateY(0deg) translateX(0)';
                }
            });
        };

        const handleMouseLeave = () => {
            const cards = container.querySelectorAll('.card-vitreous, .search-conduit');
            cards.forEach((card: any) => {
                card.style.background = 'var(--vitreous-glass)';
                card.style.transform = 'perspective(1000px) rotateY(0deg) translateX(0)';
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return containerRef;
};
