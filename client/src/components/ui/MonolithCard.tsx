import React, { useRef, ReactNode } from 'react';

interface MonolithCardProps {
    label: string;
    name: string;
    icon: ReactNode;
    onClick?: () => void;
    className?: string;
    active?: boolean;
}

const MonolithCard: React.FC<MonolithCardProps> = ({ label, name, icon, onClick, className = '', active = false }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = (x - rect.width / 2) / (rect.width / 2);
        const dy = (y - rect.height / 2) / (rect.height / 2);

        cardRef.current.style.transform = `perspective(1000px) rotateY(${dx * 2}deg) rotateX(${-dy * 2}deg) translateY(-10px) scale(1.02)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)`;
    };

    return (
        <div
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`monolith group ${active ? 'monolith-active' : ''} ${className}`}
        >
            <div className="sheen"></div>
            <div className="icon-container group-hover:scale-110">
                {icon}
            </div>
            <div className="monolith-label">{label}</div>
            <div className="monolith-name">{name}</div>
        </div>
    );
};

export default MonolithCard;
