
import React from 'react';
import { ThemeMode } from '../../types';

interface LiquidModuleCardProps {
    icon: React.ReactNode | React.ComponentType<any>;
    label?: string;
    name: string;
    isActive: boolean;
    theme?: ThemeMode;
    onClick: () => void;
}

const LiquidModuleCard: React.FC<LiquidModuleCardProps> = ({ icon, name, isActive, theme = 'dark', onClick }) => {
    const isDark = theme === 'dark';

    // Render icon - handle both component and element
    const renderIcon = () => {
        if (!icon) return null;

        // If it's a component (function), render it
        if (typeof icon === 'function') {
            const IconComponent = icon as React.ComponentType<any>;
            return <IconComponent className="w-[28px] h-[28px] stroke-[1.5]" />;
        }

        // If it's already a React element, clone with className
        if (React.isValidElement(icon)) {
            return React.cloneElement(icon as React.ReactElement<any>, {
                className: 'w-[28px] h-[28px] stroke-[1.5]'
            });
        }

        // Otherwise just return as-is
        return icon;
    };

    return (
        <button
            onClick={onClick}
            className={`relative group w-full aspect-[0.85/1] p-[16px] flex flex-col justify-start transition-all duration-500 overflow-hidden rounded-[10px] border font-sans
        ${isActive
                    ? `${isDark ? 'bg-white/10 border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]' : 'bg-white border-v-crimson/50 shadow-[0_10px_25px_rgba(225,29,72,0.1)]'}`
                    : `${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30' : 'bg-white border-black/5 hover:border-v-crimson/20 shadow-sm'} hover:-translate-y-1`
                }
      `}
        >
            {/* Icon Area - 28x28 */}
            <div className={`mb-[16px] transition-all duration-500 flex items-center justify-center w-[28px] h-[28px]
        ${isActive ? (isDark ? 'text-white' : 'text-v-crimson') : (isDark ? 'text-white/40 group-hover:text-white/80' : 'text-black/30 group-hover:text-black/80')}
      `}>
                {renderIcon()}
            </div>

            {/* Text Area - Only Name */}
            <div className="mt-auto flex flex-col items-start text-left">
                <span className={`text-[11px] font-bold tracking-tight uppercase transition-all duration-500 ${isActive ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-white/70 group-hover:text-white' : 'text-black/60 group-hover:text-black')}`}>
                    {name}
                </span>
            </div>

            {/* Active Indicator - Neo-Mint Glow */}
            {isActive && (
                <div className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#00ffc3] shadow-[0_0_8px_#00ffc3]' : 'bg-v-crimson shadow-[0_0_8px_rgba(225,29,72,0.5)]'}`} />
            )}
        </button>
    );
};

export default LiquidModuleCard;
