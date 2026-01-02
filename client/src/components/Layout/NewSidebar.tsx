import React from 'react';
import { GlassModule } from '../ui/GlassKit';
import { useAppState, useAppActions, ActiveView } from '../../context/AppStateContext';

// ============================================
// NAVIGATION ITEMS
// ============================================

interface NavItem {
    id: ActiveView;
    label: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'homeHub', label: 'Home', icon: '⬡' },
    { id: 'inbox', label: 'Inbox', icon: '✉' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'contacts', label: 'Contacts', icon: '👤' },
];

// ============================================
// NEW SIDEBAR (Glass Kit)
// ============================================

interface NewSidebarProps {
    onExit?: () => void;
}

export const NewSidebar: React.FC<NewSidebarProps> = ({ onExit }) => {
    const { state, effectiveAiEnabled } = useAppState();
    const actions = useAppActions();

    const handleNavClick = (view: ActiveView) => {
        // If dirty draft exists and switching from compose, warn user
        if (state.activeView === 'compose' && state.composeDraft.dirty && view !== 'compose') {
            // TODO: Show confirm dialog
            console.warn('Dirty draft exists - should show confirm dialog');
        }

        actions.setActiveView(view);
        actions.toggleSidebar(); // Close sidebar on mobile after navigation
    };

    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto">
            {/* ACCOUNT CARD */}
            <GlassModule noHover className="shadow-sm">
                <div className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                        {state.accounts[0]?.email?.charAt(0).toUpperCase() || 'IM'}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-900 truncate">
                            {state.accounts[0]?.email?.split('@')[0] || 'I.AM Mail'}
                        </span>
                        <span className="text-[0.55rem] text-slate-500 font-mono tracking-wider truncate">
                            {state.accounts[0]?.email || 'No account'}
                        </span>
                    </div>
                    {/* AI Status Indicator */}
                    <div className={`w-2 h-2 rounded-full ${effectiveAiEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        title={effectiveAiEnabled ? 'AI ON' : 'AI OFF'} />
                </div>
            </GlassModule>

            {/* NAVIGATION */}
            <div className="flex-1 py-4">
                <div className="px-4 mb-3 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Modules
                </div>
                <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all duration-200
                ${state.activeView === item.id
                                    ? 'bg-white shadow text-indigo-600'
                                    : 'text-slate-600 hover:bg-white/50'
                                }
              `}
                        >
                            <span className="text-sm">{item.icon}</span>
                            <span className="text-[0.7rem] font-bold uppercase tracking-[0.15em]">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* SETTINGS & EXIT */}
            <div className="space-y-2 pt-4 border-t border-slate-200/50">
                <button
                    onClick={() => handleNavClick('settings')}
                    className={`
            flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all duration-200
            ${state.activeView === 'settings'
                            ? 'bg-white shadow text-indigo-600'
                            : 'text-slate-500 hover:bg-white/50'
                        }
          `}
                >
                    <span className="text-sm">⚙</span>
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.15em]">Settings</span>
                </button>

                {onExit && (
                    <button
                        onClick={onExit}
                        className="text-center text-[0.5rem] uppercase tracking-widest text-slate-400 hover:text-slate-600 w-full py-2"
                    >
                        Exit System
                    </button>
                )}
            </div>
        </div>
    );
};

export default NewSidebar;
