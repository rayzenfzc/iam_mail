import React, { useRef } from 'react';

// 3D Tilt Hook - Obsidian Chronos Design (2deg max)
const use3DTilt = (intensity: number = 2) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dx = (x - rect.width / 2) / (rect.width / 2);
        const dy = (y - rect.height / 2) / (rect.height / 2);
        cardRef.current.style.transform = `perspective(1000px) rotateY(${dx * intensity}deg) rotateX(${-dy * intensity}deg) scale3d(1.01, 1.01, 1.01)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
    };

    return { cardRef, handleMouseMove, handleMouseLeave };
};

// Icons
const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const EmailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="m22 6-10 7L2 6" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411zm-8.475 18.3c-1.776 0-3.517-.477-5.033-1.377l-.36-.214-3.742.98 1.001-3.648-.235-.374c-.99-1.574-1.512-3.393-1.511-5.26.003-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898 1.866 1.869 2.893 4.352 2.892 6.993-.003 5.451-4.437 9.886-9.888 9.886z" />
    </svg>
);

// Props interfaces
interface EmailCardProps {
    sender: string;
    subject: string;
    time?: string;
    isRead?: boolean;
    onClick?: () => void;
    darkMode?: boolean;
}

interface ContactCardProps {
    name: string;
    role: string;
    initials?: string;
    photoUrl?: string;
    onPhone?: () => void;
    onEmail?: () => void;
    onWhatsApp?: () => void;
    darkMode?: boolean;
}

interface CalendarCardProps {
    day: number;
    month: string;
    title: string;
    meta: string;
    status?: 'IN PROGRESS' | 'UPCOMING' | 'COMPLETED';
    isActive?: boolean;
    darkMode?: boolean;
}

// Email Card - Horizontal with Avatar and Time (Obsidian Chronos Design)
export const EmailCardHorizontal: React.FC<EmailCardProps> = ({
    sender,
    subject,
    time,
    isRead = false,
    onClick,
    darkMode = true
}) => {
    const { cardRef, handleMouseMove, handleMouseLeave } = use3DTilt(2);
    const initials = sender.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div
            ref={cardRef}
            className="cursor-pointer relative overflow-hidden"
            onClick={onClick}
            onMouseMove={handleMouseMove}
            style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '16px',
                transition: 'background 0.2s ease',
                transformStyle: 'preserve-3d',
                minHeight: '80px'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                handleMouseLeave();
            }}
        >
            {/* Sheen Effect */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: '-150%',
                    left: '-150%',
                    width: '300%',
                    height: '300%',
                    background: `linear-gradient(45deg, 
                        transparent 45%, 
                        rgba(255, 255, 255, 0.05) 50%, 
                        transparent 55%
                    )`,
                    zIndex: 1
                }}
            />



            {/* Avatar - METALLIC GRADIENT */}
            <div
                className="flex-shrink-0 flex items-center justify-center relative z-10"
                style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #fff 0%, #888 50%, #000 100%)',
                    borderRadius: '50%',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#000',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                    flexShrink: 0
                }}
            >
                {initials}
            </div>

            {/* Email Info */}
            <div className="flex-grow min-w-0 relative z-10">
                <div className="flex justify-between items-center mb-1">
                    <span
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            color: darkMode ? '#fff' : '#000'
                        }}
                    >
                        {sender}
                    </span>
                    <span
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '10px',
                            color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                            flexShrink: 0,
                            marginLeft: '12px'
                        }}
                    >
                        {time || 'Just now'}
                    </span>
                </div>
                <div
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '12px',
                        color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {subject}
                </div>
            </div>
        </div>
    );
};

// Contact Card - Horizontal with Photo and Action Buttons (Obsidian Chronos Design)
export const ContactCardHorizontal: React.FC<ContactCardProps> = ({
    name,
    role,
    initials,
    photoUrl,
    onPhone,
    onEmail,
    onWhatsApp,
    darkMode = true
}) => {
    const { cardRef, handleMouseMove, handleMouseLeave } = use3DTilt(2);
    const displayInitials = initials || name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div
            ref={cardRef}
            className="relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                background: darkMode
                    ? 'linear-gradient(165deg, #111113 0%, #050505 100%)'
                    : 'linear-gradient(165deg, #ffffff 0%, #f5f5f5 100%)',
                border: darkMode
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '4px',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '20px',
                boxShadow: darkMode
                    ? '0 40px 80px rgba(0,0,0,0.8)'
                    : '0 12px 32px rgba(0,0,0,0.08)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d',
                minHeight: '90px'
            }}
        >
            {/* Sheen Effect */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: '-150%',
                    left: '-150%',
                    width: '300%',
                    height: '300%',
                    background: `linear-gradient(45deg, 
                        transparent 45%, 
                        rgba(255, 255, 255, 0.05) 50%, 
                        transparent 55%
                    )`,
                    zIndex: 1
                }}
            />



            {/* Photo/Avatar */}
            <div
                className="flex-shrink-0 flex items-center justify-center relative z-10"
                style={{
                    width: '56px',
                    height: '56px',
                    background: darkMode
                        ? 'linear-gradient(45deg, #222, #111)'
                        : 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
                    border: darkMode
                        ? '1px solid rgba(255, 255, 255, 0.08)'
                        : '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '0.5rem',
                    overflow: 'hidden'
                }}
            >
                {photoUrl ? (
                    <img src={photoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <span
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 800,
                            fontSize: '16px',
                            color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
                        }}
                    >
                        {displayInitials}
                    </span>
                )}
            </div>

            {/* Contact Details */}
            <div className="flex-grow min-w-0 relative z-10">
                <div
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        color: darkMode ? '#fff' : '#000',
                        marginBottom: '4px'
                    }}
                >
                    {name}
                </div>
                <div
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
                    }}
                >
                    {role}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 relative z-10">
                <button
                    className="w-8 h-8 flex items-center justify-center transition-all"
                    title="Call"
                    onClick={(e) => { e.stopPropagation(); onPhone?.(); }}
                    style={{
                        border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                        background: darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                        borderRadius: '4px',
                        color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.color = darkMode ? '#fff' : '#000';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)';
                        e.currentTarget.style.color = darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
                    }}
                >
                    <PhoneIcon />
                </button>
                <button
                    className="w-8 h-8 flex items-center justify-center transition-all"
                    title="Email"
                    onClick={(e) => { e.stopPropagation(); onEmail?.(); }}
                    style={{
                        border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                        background: darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                        borderRadius: '4px',
                        color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.color = darkMode ? '#fff' : '#000';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)';
                        e.currentTarget.style.color = darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
                    }}
                >
                    <EmailIcon />
                </button>
                <button
                    className="w-8 h-8 flex items-center justify-center transition-all"
                    title="WhatsApp"
                    onClick={(e) => { e.stopPropagation(); onWhatsApp?.(); }}
                    style={{
                        border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                        background: darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                        borderRadius: '4px',
                        color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.color = darkMode ? '#fff' : '#000';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)';
                        e.currentTarget.style.color = darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
                    }}
                >
                    <WhatsAppIcon />
                </button>
            </div>
        </div>
    );
};

// Calendar Day Card - Date Column + Meeting Info + Status Badge (Obsidian Chronos Design)
export const CalendarDayCard: React.FC<CalendarCardProps> = ({
    day,
    month,
    title,
    meta,
    status = 'UPCOMING',
    isActive = false
}) => {
    const { cardRef, handleMouseMove, handleMouseLeave } = use3DTilt(2);

    const statusColors = {
        'IN PROGRESS': { bg: 'rgba(255, 255, 255, 0.1)', text: '#ffffff' },
        'UPCOMING': { bg: 'rgba(255, 255, 255, 0.05)', text: 'rgba(255, 255, 255, 0.4)' },
        'COMPLETED': { bg: 'rgba(255, 255, 255, 0.08)', text: 'rgba(255, 255, 255, 0.6)' }
    };

    const statusStyle = statusColors[status] || statusColors['UPCOMING'];

    return (
        <div
            ref={cardRef}
            className="relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                background: 'linear-gradient(165deg, #111113 0%, #050505 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d',
                minHeight: '90px'
            }}
        >
            {/* Sheen Effect */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: '-150%',
                    left: '-150%',
                    width: '300%',
                    height: '300%',
                    background: `linear-gradient(45deg, 
                        transparent 45%, 
                        rgba(255, 255, 255, 0.05) 50%, 
                        transparent 55%
                    )`,
                    zIndex: 1
                }}
            />



            {/* Date Column */}
            <div
                className="flex flex-col items-center justify-center flex-shrink-0 relative z-10"
                style={{
                    width: '60px',
                    paddingRight: '20px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                <div
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1
                    }}
                >
                    {day}
                </div>
                <div
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginTop: '4px'
                    }}
                >
                    {month}
                </div>
            </div>

            {/* Meeting Info */}
            <div className="flex-grow min-w-0 relative z-10">
                <div
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        color: isActive ? '#ffffff' : '#fff',
                        marginBottom: '4px'
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.4)'
                    }}
                >
                    {meta}
                </div>
            </div>

            {/* Status Badge */}
            <div
                className="flex-shrink-0 relative z-10"
                style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '9px',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    background: statusStyle.bg,
                    color: statusStyle.text,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 700
                }}
            >
                {status}
            </div>
        </div>
    );
};

// Meeting Row Card (Obsidian Chronos Design)
export const MeetingRowCard: React.FC<{
    time: string;
    label: string;
    tag?: string;
    attendeeCount?: number;
}> = ({ time, label, tag, attendeeCount = 0 }) => {
    const { cardRef, handleMouseMove, handleMouseLeave } = use3DTilt(2);

    return (
        <div
            ref={cardRef}
            className="relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                background: 'linear-gradient(165deg, #111113 0%, #050505 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Sheen Effect */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: '-150%',
                    left: '-150%',
                    width: '300%',
                    height: '300%',
                    background: `linear-gradient(45deg, 
                        transparent 45%, 
                        rgba(255, 255, 255, 0.05) 50%, 
                        transparent 55%
                    )`,
                    zIndex: 1
                }}
            />

            {/* Time */}
            <div
                className="flex-shrink-0 relative z-10"
                style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#ffffff',
                    minWidth: '60px'
                }}
            >
                {time}
            </div>

            {/* Meeting Details */}
            <div className="flex-grow min-w-0 relative z-10">
                <div
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: '13px',
                        color: '#fff',
                        marginBottom: tag ? '4px' : 0
                    }}
                >
                    {label}
                </div>
                {tag && (
                    <div
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '9px',
                            color: 'rgba(255, 255, 255, 0.4)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}
                    >
                        {tag}
                    </div>
                )}
            </div>

            {/* Attendees */}
            {attendeeCount > 0 && (
                <div className="flex gap-1 relative z-10">
                    {Array.from({ length: Math.min(attendeeCount, 4) }).map((_, i) => (
                        <div
                            key={i}
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{
                                background: `hsl(${i * 40}, 10%, ${20 + i * 5}%)`,
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                fontSize: '9px',
                                color: 'rgba(255, 255, 255, 0.6)'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Section Header
export const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="section-header-instrument">{children}</div>
);

export default {
    EmailCardHorizontal,
    ContactCardHorizontal,
    CalendarDayCard,
    MeetingRowCard,
    SectionHeader
};
