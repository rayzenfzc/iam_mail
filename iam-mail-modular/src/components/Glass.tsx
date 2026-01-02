import React from 'react';

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
                    <div className={`w-1.5 h-1.5 rounded-full ${
                         status === 'ONLINE' || status === 'ACTIVE' ? 'bg-emerald-500' :
                         status === 'URGENT' ? 'bg-red-500' : 'bg-slate-300'
                    }`}></div>
                    <span className="text-[0.5rem] font-bold uppercase tracking-widest text-slate-500">{status}</span>
                </div>
            )}
        </div>
    </div>
);

interface GlassBodyProps {
    children: React.ReactNode;
    className?: string;
}

export const GlassBody: React.FC<GlassBodyProps> = ({ children, className = "" }) => (
    <div className={`p-5 ${className}`}>
        {children}
    </div>
);

interface GlassButtonProps {
    label: string;
    onClick?: () => void;
    primary?: boolean;
    icon?: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ label, onClick, primary = false, icon }) => (
    <button 
        onClick={onClick}
        className={`
            flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-[0.6rem] font-bold uppercase tracking-[0.2em] transition-all w-full
            ${primary 
                ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/20' 
                : 'bg-white/50 border border-white/60 text-slate-600 hover:bg-white hover:shadow-md'}
        `}
    >
        {icon}
        {label}
    </button>
);

interface DockActionProps {
    label: string;
    onClick: () => void;
    active?: boolean;
    icon?: React.ReactNode;
    primary?: boolean;
}

export const DockAction: React.FC<DockActionProps> = ({ label, onClick, active, icon, primary }) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`
            relative flex flex-col items-center justify-center h-10 w-full rounded-lg transition-all duration-200 border
            ${active 
                ? 'bg-slate-800 text-white border-slate-700 shadow-md scale-[1.02]' 
                : primary 
                    ? 'bg-white text-indigo-600 border-indigo-100 shadow-sm font-bold' 
                    : 'bg-white/40 text-slate-500 border-transparent hover:bg-white hover:border-slate-200 hover:text-slate-800'
            }
        `}
    >
        {icon && <span className="mb-0.5">{icon}</span>}
        <span className="text-[0.5rem] uppercase tracking-[0.2em] z-10">{label}</span>
        {active && <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-emerald-400"></div>}
    </button>
);