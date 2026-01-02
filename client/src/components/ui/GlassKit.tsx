import React from 'react';

// ============================================
// GLASS MODULE (Base Container)
// ============================================

interface GlassModuleProps {
    children: React.ReactNode;
    onClick?: () => void;
    isActive?: boolean;
    className?: string;
    noHover?: boolean;
}

export const GlassModule: React.FC<GlassModuleProps> = ({
    children,
    onClick,
    isActive = false,
    className = "",
    noHover = false
}) => (
    <div
        onClick={onClick}
        className={`
      relative bg-white/60 backdrop-blur-md border transition-all duration-300 overflow-hidden group
      rounded-xl shadow-sm
      ${isActive
                ? 'border-indigo-500/50 ring-1 ring-indigo-500/20 shadow-xl shadow-indigo-500/10 bg-white z-10 translate-x-1'
                : `border-white/60 ${!noHover && onClick ? 'hover:bg-white hover:border-white hover:shadow-md hover:-translate-y-0.5' : ''}`
            }
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `}
    >
        {children}
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
    </div>
);

// ============================================
// GLASS HEADER
// ============================================

interface GlassHeaderProps {
    label: string;
    value?: string;
    status?: string;
    icon?: React.ReactNode;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
    label,
    value,
    status,
    icon
}) => (
    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/50 bg-slate-50/30 min-h-[44px]">
        <div className="flex items-center gap-3">
            {icon && <span className="text-slate-400">{icon}</span>}
            <span className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</span>
        </div>
        <div className="flex items-center gap-4">
            {value && <span className="text-[0.6rem] font-mono font-medium text-slate-500 tracking-wide">{value}</span>}
            {status && (
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'ONLINE' || status === 'ACTIVE' ? 'bg-emerald-500' :
                        status === 'URGENT' ? 'bg-red-500' : 'bg-slate-300'
                        }`}></div>
                    <span className="text-[0.5rem] font-bold uppercase tracking-widest text-slate-500">{status}</span>
                </div>
            )}
        </div>
    </div>
);

// ============================================
// GLASS BODY
// ============================================

interface GlassBodyProps {
    children: React.ReactNode;
    className?: string;
}

export const GlassBody: React.FC<GlassBodyProps> = ({
    children,
    className = ""
}) => (
    <div className={`p-5 ${className}`}>
        {children}
    </div>
);

// ============================================
// GLASS BUTTON
// ============================================

interface GlassButtonProps {
    label: string;
    onClick?: () => void;
    primary?: boolean;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
    label,
    onClick,
    primary = false,
    icon,
    disabled = false
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
      flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-[0.6rem] font-bold uppercase tracking-[0.2em] transition-all w-full
      ${primary
                ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/20'
                : 'bg-white/50 border border-white/60 text-slate-600 hover:bg-white hover:shadow-md'
            }
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
    >
        {icon}
        {label}
    </button>
);

// ============================================
// DOCK ACTION (Contextual Chip)
// ============================================

interface DockActionProps {
    label: string;
    onClick: () => void;
    active?: boolean;
    icon?: React.ReactNode;
    primary?: boolean;
    disabled?: boolean;
    aiOnly?: boolean;
}

export const DockAction: React.FC<DockActionProps> = ({
    label,
    onClick,
    active,
    icon,
    primary,
    disabled = false,
    aiOnly = false
}) => (
    <button
        onClick={(e) => { e.stopPropagation(); if (!disabled) onClick(); }}
        disabled={disabled}
        className={`
      relative flex flex-col items-center justify-center h-10 w-full rounded-lg transition-all duration-200 border
      ${active
                ? 'bg-slate-800 text-white border-slate-700 shadow-md scale-[1.02]'
                : primary
                    ? 'bg-white text-indigo-600 border-indigo-100 shadow-sm font-bold'
                    : 'bg-white/40 text-slate-500 border-transparent hover:bg-white hover:border-slate-200 hover:text-slate-800'
            }
      ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      ${aiOnly ? 'relative' : ''}
    `}
    >
        {icon && <span className="mb-0.5">{icon}</span>}
        <span className="text-[0.5rem] uppercase tracking-[0.2em] z-10">{label}</span>
        {active && <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-emerald-400"></div>}
        {aiOnly && <span className="absolute -top-1 -right-1 text-[8px]">✨</span>}
    </button>
);

// ============================================
// GLASS INPUT
// ============================================

interface GlassInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    className?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    autoFocus?: boolean;
}

export const GlassInput: React.FC<GlassInputProps> = ({
    value,
    onChange,
    placeholder,
    onKeyDown,
    className = "",
    prefix,
    suffix,
    autoFocus
}) => (
    <div className={`
    bg-white border border-slate-200 rounded-xl h-10 px-4 flex items-center gap-3 
    shadow-sm focus-within:ring-1 focus-within:ring-indigo-500/30 transition-shadow
    ${className}
  `}>
        {prefix}
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="flex-1 bg-transparent h-full text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none tracking-wide"
        />
        {suffix}
    </div>
);

// ============================================
// SKELETON LOADER
// ============================================

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
    <div className={`animate-pulse bg-slate-200/50 rounded ${className}`} />
);

export const GlassModuleSkeleton: React.FC = () => (
    <GlassModule noHover>
        <div className="p-5 space-y-3">
            <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-16" />
        </div>
    </GlassModule>
);

// ============================================
// EXPORTS
// ============================================

export default {
    GlassModule,
    GlassHeader,
    GlassBody,
    GlassButton,
    DockAction,
    GlassInput,
    Skeleton,
    GlassModuleSkeleton
};
