import React from 'react';

interface MonolithCardProps {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    onClick?: () => void;
    darkMode?: boolean;
}

export const MonolithCard: React.FC<MonolithCardProps> = ({
    id,
    label,
    description,
    icon,
    onClick,
    darkMode = true
}) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const dx = (x - centerX) / centerX;
        const dy = (y - centerY) / centerY;

        // Rotation and lift (Obsidian Chronos: 2deg max)
        cardRef.current.style.transform = `perspective(1000px) rotateY(${dx * 2}deg) rotateX(${-dy * 2}deg) translateZ(10px)`;
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (!cardRef.current) return;
        {/* Reset transform */ }
        cardRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)`;
    };

    return (
        <div
            ref={cardRef}
            className="monolith-settings-card relative overflow-hidden cursor-pointer transition-all duration-100 ease-out"
            style={{
                background: darkMode
                    ? 'linear-gradient(165deg, #0f0f0f 0%, #050505 100%)'
                    : 'linear-gradient(165deg, #f5f5f5 0%, #e8e8e8 100%)',
                border: darkMode
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(0,0,0,0.08)',
                borderRadius: '4px',
                padding: '24px',
                transformStyle: 'preserve-3d',
                transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at top left, rgba(255,255,255,0.03), transparent 70%)'
                }}
            />

            {/* Sheen effect */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: isHovered ? '150%' : '-150%',
                    left: isHovered ? '150%' : '-150%',
                    width: '300%',
                    height: '300%',
                    background: `linear-gradient(
                        45deg, 
                        transparent 45%, 
                        rgba(255, 0, 128, 0.12) 48%, 
                        rgba(255,255,255,0.08) 50%, 
                        rgba(0, 200, 255, 0.12) 52%, 
                        transparent 55%
                    )`,
                    transition: 'all 1.5s cubic-bezier(0.23, 1, 0.32, 1)',
                    zIndex: 1
                }}
            />

            {/* Content */}
            <div className="flex items-center gap-5 relative z-10" style={{ transformStyle: 'preserve-3d' }}>
                {/* Icon Box */}
                <div
                    className="flex-shrink-0 flex items-center justify-center transition-all duration-500"
                    style={{
                        width: '48px',
                        height: '48px',
                        background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                        border: darkMode
                            ? `1px solid rgba(255,255,255,${isHovered ? 0.2 : 0.05})`
                            : `1px solid rgba(0,0,0,${isHovered ? 0.2 : 0.05})`,
                        transform: isHovered ? 'translateZ(20px)' : 'none'
                    }}
                >
                    <div
                        className="transition-all duration-500"
                        style={{
                            color: darkMode
                                ? (isHovered ? '#fff' : 'rgba(255,255,255,0.3)')
                                : (isHovered ? '#000' : 'rgba(0,0,0,0.3)'),
                            filter: isHovered ? 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' : 'none'
                        }}
                    >
                        {icon}
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col gap-0.5">
                    <div
                        className="font-mono text-[10px] tracking-widest"
                        style={{
                            color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                            letterSpacing: '0.1em'
                        }}
                    >
                        {id}
                    </div>
                    <div
                        className="text-sm font-semibold uppercase tracking-wide"
                        style={{
                            color: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                            letterSpacing: '0.02em'
                        }}
                    >
                        {label}
                    </div>
                    <div
                        className="text-[11px] mt-1"
                        style={{
                            color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                        }}
                    >
                        {description}
                    </div>
                </div>

                {/* Status Dot */}
                <div
                    className="flex-shrink-0 transition-all duration-500"
                    style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: darkMode
                            ? (isHovered ? '#fff' : 'rgba(255,255,255,0.3)')
                            : (isHovered ? '#000' : 'rgba(0,0,0,0.3)'),
                        boxShadow: isHovered ? '0 0 8px currentColor' : 'none'
                    }}
                />
            </div>
        </div>
    );
};
