import React from 'react';

interface SettingsCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    theme?: 'dark' | 'light';
    onClick?: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, icon, theme = 'dark', onClick }) => {
    const isDark = theme === 'dark';

    return (
        <button
            onClick={onClick}
            className={`relative group w-full h-[88px] p-4 flex items-center transition-all duration-500 overflow-hidden rounded-[10px] border font-sans text-left
        ${isDark
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                    : 'bg-white border-black/5 hover:border-v-crimson/20 shadow-sm'
                } hover:-translate-y-1
      `}
        >
            {/* Icon Area - 32x32 */}
            <div className={`flex-shrink-0 mr-4 transition-all duration-500 flex items-center justify-center w-[32px] h-[32px]
        ${isDark ? 'text-white/40 group-hover:text-white/80' : 'text-black/30 group-hover:text-v-crimson'}
      `}>
                {icon}
            </div>

            {/* Text Area */}
            <div className="flex flex-col min-w-0">
                <span className={`text-[14px] font-bold tracking-tight uppercase transition-all duration-500 truncate ${isDark ? 'text-white/90 group-hover:text-white' : 'text-black/80 group-hover:text-black'}`}>
                    {title}
                </span>
                <span className={`text-[12px] opacity-50 line-clamp-1 transition-all duration-500 ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-black/40 group-hover:text-black/60'}`}>
                    {description}
                </span>
            </div>

            {/* Decorative Chevron */}
            <div className={`ml-auto opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0 ${isDark ? 'text-white/20' : 'text-v-crimson/30'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </div>
        </button>
    );
};

export default SettingsCard;
