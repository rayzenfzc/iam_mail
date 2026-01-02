import React from 'react';
import { Send } from 'lucide-react';
import { SurfaceIcon } from '../ui/SinteredIcons';

interface GlassProps {
  children: React.ReactNode;
  className?: string;
  noHover?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  darkMode?: boolean;
  variant?: 'default' | 'filament';
}

export const GlassModule: React.FC<GlassProps> = ({ children, className = '', noHover = false, isActive = false, onClick, darkMode = false, variant = 'default' }) => {
  // Base transitions
  const baseStyles = "relative overflow-hidden transition-all duration-300";

  // Light Mode Styles (Solid Industrial)
  const lightActive = "bg-white border border-[#d4d4d8] shadow-md transform scale-[1.005] rounded-[0.5rem]";
  const lightInactive = "bg-white border border-[#d4d4d8]/50 hover:bg-[#fafafa] rounded-[0.5rem]";

  // Dark Mode Styles (New Refractive Glass & Card Gradient)
  const darkBase = "rounded-[0.5rem] border";

  // Use CSS classes defined in index.css (supports Vitrine override)
  const darkActive = "glass-active-dark";

  // Inactive Refractive State
  const darkInactive = "glass-inactive-dark";

  // Red Filament Variant (Border Left + Glow)
  const filamentStyle = variant === 'filament'
    ? "border-l-[1.5px] border-l-primary shadow-[-5px_0_15px_rgba(var(--primary),0.2)] pl-6 bg-transparent rounded-r-[0.5rem] rounded-l-none border-y-0 border-r-0"
    : "";

  const appliedDarkStyle = variant === 'filament'
    ? filamentStyle
    : (isActive ? `${darkBase} ${darkActive}` : `${darkBase} ${darkInactive}`);

  return (
    <div
      onClick={onClick}
      className={`
        ${baseStyles}
        ${darkMode ? appliedDarkStyle : (isActive ? lightActive : lightInactive)}
        ${noHover ? '' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Glossy sheen for active dark cards */}
      {darkMode && isActive && variant !== 'filament' && (
        <div className="absolute top-0 right-0 w-[40px] h-full bg-gradient-to-r from-transparent to-white/[0.02] pointer-events-none" />
      )}
      {children}
    </div>
  );
};

export const GlassHeader: React.FC<{ label: string; action?: string; onAction?: () => void; darkMode?: boolean }> = ({ label, action, onAction, darkMode }) => (
  <div className={`flex justify-between items-center px-6 py-5 border-b border-[0.5px] ${darkMode ? 'border-white/5' : 'border-slate-100/50'}`}>
    <span className={`text-[10px] font-medium uppercase tracking-[0.3em] ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>{label}</span>
    {action && (
      <button onClick={onAction} className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${darkMode ? 'text-white/40 hover:text-[#ff1a1a]' : 'text-slate-500 hover:text-slate-800'}`}>
        {action}
      </button>
    )}
  </div>
);

export const GlassBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

interface DockActionProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  primary?: boolean;
  darkMode?: boolean;
  count?: number;
  Icon?: React.ElementType;
}

export const DockAction: React.FC<DockActionProps> = ({ label, onClick, active, primary, darkMode, count, Icon }) => {
  // Light Styles (Matching Flip Clock Tiles)
  const lPrimary = "bg-white text-[#18181b] border border-[#d4d4d8] shadow-sm hover:translate-y-[-1px]";
  const lActive = "bg-white text-[#18181b] border border-[#d4d4d8] shadow-inner";
  const lInactive = "bg-white text-[#18181b] border border-[#d4d4d8]/60 shadow-sm hover:bg-[#fafafa]";

  // Dark Styles (Vitrine/FlipClock Match)
  // Matching Flip Clock: bg-[#1A1A1A], border-[#D1D9DD], text-white
  const dPrimary = "bg-[#1A1A1A] text-white shadow-lg border border-[#D1D9DD] hover:bg-[#222]";
  const dActive = "bg-[#1A1A1A] text-white border border-[#D1D9DD]";
  const dInactive = "bg-[#1A1A1A] text-white border border-[#D1D9DD]/30 hover:bg-[#1A1A1A] hover:text-white hover:border-[#D1D9DD]";

  // Special styling for HOME button - small, shaped, red home icon
  const isHomeButton = label === 'HOME';

  // Home button specific styles
  const homeButtonStyles = isHomeButton
    ? `w-12 aspect-square flex items-center justify-center ${darkMode ? 'bg-white/5 border-red-600/30 hover:bg-red-600/10' : 'bg-white border-red-600/20 hover:bg-red-50'}`
    : '';

  return (
    <button
      onClick={onClick}
      className={`
        relative h-full ${isHomeButton ? homeButtonStyles : 'w-full'} rounded-[0.5rem] flex items-center justify-center
        text-[9px] font-[100] font-sans uppercase tracking-[0.15em] transition-all duration-300 overflow-hidden
        ${!isHomeButton && (primary
          ? (darkMode ? dPrimary : lPrimary)
          : active
            ? (darkMode ? dActive : lActive)
            : (darkMode ? dInactive : lInactive))}
      `}
    >
      {/* Clean Minimal Aesthetic (Flip overlays removed per user request) */}

      {isHomeButton ? (
        <div className="z-20">
          {Icon ? <Icon size={18} /> : <SurfaceIcon size={18} className="text-red-600" />}
        </div>
      ) : (
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
          {Icon ? (
            <div className="mb-1 transition-transform group-hover:scale-110 duration-500">
              <Icon
                size={18}
                className={`
                  ${primary ? (darkMode ? "text-white" : "text-black") : ""}
                  ${active ? "text-primary opacity-100" : "opacity-60"}
                  drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]
                `}
              />
            </div>
          ) : null}
          <span className={`
            font-sans tracking-[0.2em] transition-colors
            ${Icon ? "text-[7px]" : "text-[9px]"}
            ${active ? (darkMode ? "text-white" : "text-black") : "opacity-50"}
          `}>
            {label}
          </span>
          {count !== undefined && count > 0 && (
            <div className={`absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] flex items-center justify-center rounded-full text-[8px] font-bold border ${primary ? 'bg-red-600 text-white border-red-500' : (darkMode ? 'bg-white text-black border-black' : 'bg-red-600 text-white border-white')}`}>
              {count}
            </div>
          )}
        </div>
      )}
    </button>
  );
};