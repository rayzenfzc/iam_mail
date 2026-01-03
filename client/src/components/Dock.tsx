import React, { useMemo } from 'react';
import {
    Sparkles,
    PenBox, CheckCircle2, Archive, Star, Trash2, MoreHorizontal, // Mail
    CalendarPlus, CalendarDays, LayoutGrid, Search, // Calendar
    Plus, ListTodo, Flag, // Tasks
    FilePlus, Pin, Share2, // Notes
    UserPlus, MessageSquare, // Contacts
    Upload, FolderPlus, // Files
    Settings as SettingsIcon, Shield, Bell, // Settings
    Command,
    Home
} from 'lucide-react';

/**
 * DEVELOPER NOTE:
 * The Dock is "Context Aware". It does not simply show static buttons.
 * It listens to `activeModule` (passed from App.tsx) and dynamically renders 
 * the relevant action buttons (config object).
 * 
 * When a button is clicked, it emits `onAction(label)` back to the parent.
 */

interface DockProps {
    activeModule: string;
    isDarkMode?: boolean;
    isMobile?: boolean;
    onHome?: () => void;
    onAction?: (action: string) => void;
    dockInput?: string;
    onDockInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDockFocus?: () => void;
    onDockSubmit?: () => void;
    keyboardHeight?: number;
}

const Dock: React.FC<DockProps> = ({
    activeModule,
    isDarkMode = true,
    isMobile = false,
    onHome,
    onAction,
    dockInput = '',
    onDockInputChange,
    onDockFocus,
    onDockSubmit,
    keyboardHeight = 0
}) => {

    // Dynamic Configuration based on Active Module
    const config = useMemo(() => {
        switch (activeModule) {
            case 'calendar':
                return {
                    placeholder: "Find time or schedule...",
                    actions: [
                        { icon: <CalendarPlus size={20} />, label: "New", hotkey: "N" },
                        { icon: <CalendarDays size={20} />, label: "Today" },
                        { icon: <Search size={20} />, label: "Search" },
                    ]
                };
            case 'tasks':
                return {
                    placeholder: "Add task or prioritize...",
                    actions: [
                        { icon: <Plus size={20} />, label: "New", hotkey: "N" },
                        { icon: <CheckCircle2 size={20} />, label: "Done" },
                        { icon: <Flag size={20} />, label: "Priority" },
                    ]
                };
            case 'settings':
                return {
                    placeholder: "Search settings...",
                    actions: [
                        { icon: <SettingsIcon size={20} />, label: "General" },
                        { icon: <Shield size={20} />, label: "Security" },
                        { icon: <Bell size={20} />, label: "Notifs" },
                    ]
                };
            case 'inbox':
            default:
                return {
                    placeholder: "Ask i.AM to write...",
                    actions: [
                        { icon: <PenBox size={20} />, label: "Compose", hotkey: "C" },
                        { icon: <Archive size={20} />, label: "Archive" },
                        { icon: <Trash2 size={20} />, label: "Delete", activeColor: isDarkMode ? "text-white" : "text-black" },
                    ]
                };
        }
    }, [activeModule, isDarkMode]);

    // Styles based on theme
    const glassClass = isDarkMode
        ? "bg-[#050505]/70 border-white/10"
        : "bg-white/80 border-white/60 shadow-2xl ring-1 ring-black/5";

    const separatorClass = isDarkMode ? "bg-white/10" : "bg-black/10";
    const glowClass = isDarkMode ? "shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]" : "shadow-xl";

    const inputContainerClass = isDarkMode
        ? "bg-white/5 border-white/5 hover:bg-white/10 focus-within:bg-white/10 focus-within:border-white/20 text-white"
        : "bg-black/5 border-black/5 hover:bg-black/10 focus-within:bg-white focus-within:shadow-md text-slate-800";

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onDockSubmit) {
            onDockSubmit();
        }
    };

    // --- MOBILE LAYOUT ---
    if (isMobile) {
        // "Brushed Metal / Premium Glass" Style for Mobile
        const metalContainerClass = isDarkMode
            ? "bg-neutral-900/90 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            : "bg-gradient-to-b from-white/95 to-slate-100/95 border-t border-white/40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]";

        const projectedKeyClass = isDarkMode
            ? "bg-neutral-800 border-t-white/10 border-b-black/50 border-x-transparent shadow active:bg-neutral-900 active:shadow-none active:translate-y-[1px]"
            : "bg-gradient-to-b from-white to-slate-50 border-t-white border-b-slate-200 border-x-transparent shadow-sm active:bg-slate-100 active:shadow-none active:translate-y-[1px]";

        const projectedInputClass = isDarkMode
            ? "bg-[#0A0A0A] border-b-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
            : "bg-slate-100/50 border-b-white/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]";

        return (
            <div
                className={`w-full rounded-2xl p-3 flex flex-col gap-3 backdrop-blur-xl ${metalContainerClass}`}
                style={{ paddingBottom: keyboardHeight > 0 ? `${keyboardHeight + 12}px` : '12px' }}
            >

                {/* Row 1: App Controls & Context Actions */}
                <div className="grid grid-cols-6 gap-2">
                    {/* Home Button */}
                    <button
                        onClick={onHome}
                        className={`col-span-1 aspect-square rounded-lg flex items-center justify-center border transition-all ${projectedKeyClass} ${isDarkMode ? 'text-white border-white/5' : 'text-slate-700 border-slate-200'}`}
                    >
                        <Home size={20} />
                    </button>

                    {/* Context Actions */}
                    <div className="col-span-5 flex items-center justify-between gap-2 px-1">
                        {config.actions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => onAction && onAction(action.label)}
                                className={`flex-1 h-12 rounded-lg flex items-center justify-center border transition-all ${projectedKeyClass} ${isDarkMode ? 'text-white border-white/5' : 'text-slate-700 border-slate-200'}`}
                            >
                                {action.icon}
                            </button>
                        ))}
                        <div className={`w-px h-6 ${separatorClass}`}></div>
                        <button className={`flex-1 h-12 rounded-lg flex items-center justify-center border transition-all ${projectedKeyClass} ${isDarkMode ? 'text-white border-white/5' : 'text-slate-700 border-slate-200'}`}>
                            <Star size={18} />
                        </button>
                    </div>
                </div>

                {/* Row 2: Input (Neutral & Brushed) */}
                <div className={`
          relative group flex items-center w-full h-[54px] rounded-lg px-3 border transition-colors
          ${projectedInputClass} ${isDarkMode ? 'border-white/5' : 'border-slate-200/50'}
        `}>
                    {/* i.AM Logo on Glass */}
                    <div className={`
             mr-3 px-1.5 py-0.5 rounded text-[9px] font-black tracking-tighter font-mono border
             ${isDarkMode ? 'bg-white/10 border-white/10 text-white' : 'bg-black/5 border-black/5 text-black/70'}
          `}>
                        i.AM
                    </div>

                    <input
                        type="text"
                        placeholder={config.placeholder}
                        value={dockInput}
                        onChange={onDockInputChange}
                        onFocus={onDockFocus}
                        onKeyDown={handleKeyDown}
                        className={`flex-1 bg-transparent border-none outline-none text-[14px] font-medium placeholder-opacity-40 min-w-0 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}
                    />
                    <button
                        onClick={onDockSubmit}
                        className={`
              h-8 px-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all
              ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white shadow-sm border border-slate-100 text-slate-600'}
            `}
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    }

    // --- DESKTOP LAYOUT ---
    return (
        <div
            className="w-full flex justify-center pb-2"
            style={{ paddingBottom: keyboardHeight > 0 ? `${keyboardHeight + 8}px` : '8px' }}
        >
            {/* THE NEURAL BAR - Single Capsule Design */}
            <div className={`
        relative flex items-center h-[72px] px-3 gap-1 rounded-[1.5rem] backdrop-blur-3xl border transition-all duration-500
        ${glassClass} ${glowClass}
      `}>

                {/* Left Action Cluster */}
                <div className="flex items-center gap-1 px-1">
                    {config.actions.map((action, idx) => (
                        <DockButton
                            key={idx}
                            icon={action.icon}
                            label={action.label}
                            hotkey={action.hotkey}
                            activeColor={action.activeColor}
                            isDarkMode={isDarkMode}
                            onClick={() => onAction && onAction(action.label)}
                        />
                    ))}

                    <div className="mx-1">
                        <DockButton icon={<MoreHorizontal size={20} />} label="More" isDarkMode={isDarkMode} />
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className={`w-px h-8 ${separatorClass} mx-1`}></div>

                {/* Central Intelligence Unit (Input) */}
                <div className={`
          relative group flex items-center transition-all duration-300 ease-out w-[280px] focus-within:w-[340px] h-[48px] rounded-[1.5rem] px-4 border
          ${inputContainerClass}
        `}>
                    <Sparkles size={16} className={`mr-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} animate-pulse`} />

                    <input
                        type="text"
                        placeholder={config.placeholder}
                        value={dockInput}
                        onChange={onDockInputChange}
                        onFocus={onDockFocus}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none outline-none text-[13px] font-medium placeholder-opacity-50 min-w-0"
                    />

                    <div className={`flex items-center gap-2 text-[10px] opacity-40 font-mono ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        <Command size={10} /> <span>K</span>
                    </div>
                </div>

                {/* Right Action Cluster (System) */}
                <div className={`w-px h-8 ${separatorClass} mx-1`}></div>

                <div className="flex items-center gap-1 px-1">
                    <DockButton icon={<Star size={20} />} label="Star" activeColor="text-yellow-400" isDarkMode={isDarkMode} />
                    <DockButton icon={<Share2 size={20} />} label="Share" isDarkMode={isDarkMode} />
                </div>

            </div>
        </div>
    );
};

interface DockButtonProps {
    icon: React.ReactNode;
    label: string;
    hotkey?: string;
    activeColor?: string;
    isDarkMode?: boolean;
    onClick?: () => void;
}

const DockButton: React.FC<DockButtonProps> = ({ icon, label, hotkey, activeColor, isDarkMode = true, onClick }) => {
    const baseColor = isDarkMode ? "text-white/50" : "text-slate-500";
    const hoverBg = isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5";
    const hoverText = isDarkMode ? "hover:text-white" : "hover:text-slate-900";

    // Dynamic color for hover state if activeColor is provided
    const activeClass = activeColor
        ? `group-hover:${activeColor}`
        : hoverText;

    return (
        <button
            onClick={onClick}
            className={`
        group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-out
        hover:scale-110 active:scale-95
        ${baseColor} ${hoverBg} ${activeClass}
    `}>
            {icon}

            {/* Floating Tooltip */}
            <div className={`
        absolute -top-10 px-2 py-1 rounded text-[10px] font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap
        ${isDarkMode ? 'bg-white text-black' : 'bg-slate-800 text-white'}
      `}>
                {label}
            </div>

            {/* Active Dot Indicator (Decorative) */}
            <div className={`absolute bottom-2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
        </button>
    );
};

export default Dock;
