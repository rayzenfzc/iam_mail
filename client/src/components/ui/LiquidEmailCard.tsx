import React from 'react';

interface LiquidEmailCardProps {
    sender: string;
    subject: string;
    time: string;
    preview: string;
    initials: string;
    theme?: 'dark' | 'light';
    onClick?: () => void;
}

const LiquidEmailCard: React.FC<LiquidEmailCardProps> = ({
    sender,
    subject,
    time,
    preview,
    initials,
    theme = 'dark',
    onClick
}) => {
    const isDark = theme === 'dark';

    return (
        <div
            onClick={onClick}
            className={`group relative w-full max-w-[672px] mx-auto border rounded-[8px] p-[24px] h-[148px] flex items-start gap-[16px] transition-all duration-300 cursor-pointer backdrop-blur-xl hover:shadow-2xl ${isDark ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20' : 'bg-black/[0.04] border-black/10 hover:bg-black/[0.06] hover:border-black/20'
                }`}
        >
            {/* LEFT SIDE: Avatar */}
            <div className={`flex-shrink-0 w-[48px] h-[48px] rounded-full flex items-center justify-center font-bold border overflow-hidden relative shadow-inner transition-all ${isDark ? 'border-white/20 text-black' : 'border-black/10 text-white'}`}
                style={{ background: isDark ? 'linear-gradient(135deg, #ffffff 0%, #888888 100%)' : 'linear-gradient(135deg, #222222 0%, #666666 100%)' }}>
                <span className="relative z-10 text-[14px] font-sans tracking-tight">
                    {initials || 'U'}
                </span>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-grow min-w-0 flex flex-col gap-[8px]">
                <div className="flex justify-between items-baseline">
                    <h4 className={`font-sans text-[14px] font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                        {sender || 'Unknown'}
                    </h4>
                    <span className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-black/30 group-hover:text-black/60'}`}>
                        {time || ''}
                    </span>
                </div>

                <h5 className={`font-sans text-[12px] font-semibold ${isDark ? 'text-white/90' : 'text-black/80'}`}>
                    {subject || '(No Subject)'}
                </h5>

                <p className={`font-sans text-[12px] line-clamp-2 leading-relaxed font-normal ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                    {preview || ''}
                </p>
            </div>
        </div>
    );
};

export default LiquidEmailCard;
