import React, { useEffect, useState } from 'react';

interface EtherBarProps {
    darkMode: boolean;
    onSettings?: () => void;
    onGenesis?: () => void;
    onThemeToggle?: () => void;
    themeMode?: string;
}

// Glass Card Component - Ultra Compact
const GlassCard: React.FC<{ digit: string; darkMode: boolean }> = ({ digit, darkMode }) => (
    <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
            width: '26px',
            height: '38px',
            background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
            border: darkMode ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
            borderRadius: '3px',
            fontSize: '22px',
            color: darkMode ? '#fff' : '#000',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 300
        }}
    >
        {/* Cyan gradient sheen */}
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: darkMode
                    ? 'linear-gradient(135deg, transparent, rgba(0,242,255,0.1), transparent)'
                    : 'linear-gradient(135deg, transparent, rgba(0,100,255,0.05), transparent)'
            }}
        />
        <span className="relative z-10">{digit}</span>
    </div>
);

// Pulse Dot separator - Fixed colors for light theme
const PulseDot: React.FC<{ darkMode: boolean }> = ({ darkMode }) => (
    <div
        className="mx-0.5 self-center animate-pulse"
        style={{
            width: '2px',
            height: '2px',
            background: darkMode ? '#00f2ff' : '#0066ff',
            borderRadius: '50%',
            boxShadow: darkMode ? '0 0 6px #00f2ff' : '0 0 4px #0066ff',
            animationDuration: '1s'
        }}
    />
);

// Wire Button - Ultra Compact
const WireButton: React.FC<{
    label: string;
    darkMode: boolean;
    onClick?: () => void;
    icon?: React.ReactNode;
}> = ({ label, darkMode, onClick, icon }) => (
    <button
        onClick={onClick}
        className="transition-all duration-400 flex items-center justify-center"
        style={{
            border: darkMode ? '0.5px solid rgba(255,255,255,0.2)' : '0.5px solid rgba(0,0,0,0.2)',
            background: 'transparent',
            color: darkMode ? '#fff' : '#000',
            padding: icon ? '3px 6px' : '3px 10px',
            borderRadius: '12px',
            fontSize: '7px',
            letterSpacing: '1px',
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            minWidth: icon ? '20px' : 'auto'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = darkMode ? '#fff' : '#000';
            e.currentTarget.style.color = darkMode ? '#000' : '#fff';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(255,255,255,0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = darkMode ? '#fff' : '#000';
            e.currentTarget.style.boxShadow = 'none';
        }}
    >
        {icon || label}
    </button>
);

// Main Ether Bar Component - Ultra Compact Horizontal Layout
export const EtherBar: React.FC<EtherBarProps> = ({
    darkMode,
    onSettings,
    onGenesis,
    onThemeToggle,
    themeMode = 'dark'
}) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');

    // Theme icon
    const ThemeIcon = () => {
        if (themeMode === 'light') return <span style={{ fontSize: '10px' }}>☀️</span>;
        if (themeMode === 'vitrine') return <span style={{ fontSize: '10px' }}>💎</span>;
        return <span style={{ fontSize: '10px' }}>🌙</span>;
    };

    return (
        <div
            className="flex items-center justify-between w-full gap-2 transition-all duration-300"
            style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                background: darkMode ? 'rgba(15, 15, 18, 0.8)' : 'rgba(255, 255, 255, 0.85)',
                border: darkMode ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.08)',
                padding: '6px 12px',
                borderRadius: '14px',
                boxShadow: '0 0 25px rgba(0,0,0,0.3)',
                height: '52px'
            }}
        >
            {/* Left Actions: Brand & System */}
            <div className="flex items-center gap-3">
                {/* Brand / Genesis Button */}
                <button
                    onClick={onGenesis}
                    className="flex flex-col gap-0.5 shrink-0 group hover:opacity-80 transition-opacity text-left"
                >
                    <div
                        style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: darkMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)',
                            letterSpacing: '0.05em',
                            fontFamily: "'JetBrains Mono', monospace"
                        }}
                    >
                        i.AM
                    </div>
                    {/* Spectral underline */}
                    <div
                        className="group-hover:w-full transition-all duration-500"
                        style={{
                            width: '60%',
                            height: '1.5px',
                            background: darkMode
                                ? 'linear-gradient(90deg, #ff0080, #00f2ff)'
                                : 'linear-gradient(90deg, #ff0066, #0066ff)'
                        }}
                    />
                </button>

                {/* Vertical Divider */}
                <div className="h-4 w-[1px] bg-neutral-500/20"></div>

                {/* System Buttons */}
                <div className="flex items-center gap-1">
                    <WireButton
                        label="SET"
                        darkMode={darkMode}
                        onClick={onSettings}
                        icon={<span style={{ fontSize: '12px' }}>⚙️</span>}
                    />
                    <WireButton
                        label=""
                        darkMode={darkMode}
                        onClick={onThemeToggle}
                        icon={<ThemeIcon />}
                    />
                </div>
            </div>

            {/* Right: Clock */}
            <div className="flex gap-0.5 items-center">
                <GlassCard digit={h[0]} darkMode={darkMode} />
                <GlassCard digit={h[1]} darkMode={darkMode} />
                <PulseDot darkMode={darkMode} />
                <GlassCard digit={m[0]} darkMode={darkMode} />
                <GlassCard digit={m[1]} darkMode={darkMode} />
            </div>
        </div>
    );
};

// Keep TectonicClock for backward compatibility
export const TectonicClock: React.FC<{ darkMode: boolean; showSeconds?: boolean; size?: 'compact' | 'full' }> = ({ darkMode, showSeconds = false }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');

    return (
        <div className="flex gap-0.5 items-center">
            <GlassCard digit={h[0]} darkMode={darkMode} />
            <GlassCard digit={h[1]} darkMode={darkMode} />
            <PulseDot darkMode={darkMode} />
            <GlassCard digit={m[0]} darkMode={darkMode} />
            <GlassCard digit={m[1]} darkMode={darkMode} />
            {showSeconds && (
                <>
                    <PulseDot darkMode={darkMode} />
                    <GlassCard digit={s[0]} darkMode={darkMode} />
                    <GlassCard digit={s[1]} darkMode={darkMode} />
                </>
            )}
        </div>
    );
};

// Keep SystemClock for backward compatibility
export const SystemClock: React.FC<{ time: Date; darkMode: boolean }> = ({ darkMode }) => {
    return <TectonicClock darkMode={darkMode} showSeconds={false} size="compact" />;
};

export default EtherBar;
