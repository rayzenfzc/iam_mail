import React from 'react';
import { useAppState, useAppActions } from '../../context/AppStateContext';
import { Dock } from '../Dock/Dock';

// ============================================
// THREE PANE LAYOUT (Responsive)
// ============================================

interface ThreePaneLayoutProps {
    // Pane content
    sidebar: React.ReactNode;
    centerContent: React.ReactNode;
    rightContent?: React.ReactNode;

    // AI handler
    onAiAction?: (prompt: string) => void;
}

export const ThreePaneLayout: React.FC<ThreePaneLayoutProps> = ({
    sidebar,
    centerContent,
    rightContent,
    onAiAction
}) => {
    const { state } = useAppState();
    const actions = useAppActions();

    // Mobile: Show center OR workspace (not both)
    const showCenterOnMobile = !state.selectedItemId && state.activeView !== 'compose';

    return (
        <div
            className="h-screen font-sans flex flex-col overflow-hidden bg-[#E5E5E5] relative"
            style={{
                backgroundImage: 'radial-gradient(#CCCCCC 1px, transparent 1px)',
                backgroundSize: '16px 16px'
            }}
        >
            {/* SIDEBAR OVERLAY (Mobile) */}
            {state.isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-[90] lg:hidden backdrop-blur-sm"
                    onClick={() => actions.toggleSidebar()}
                />
            )}

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex overflow-hidden p-3 lg:p-8 gap-6 relative">

                {/* LEFT PANE - Sidebar */}
                <aside className={`
          fixed inset-y-0 left-0 z-[100] w-[280px] 
          lg:static lg:w-[280px] lg:shrink-0
          transition-transform duration-500 
          bg-[#E5E5E5] lg:bg-transparent 
          p-6 lg:p-0 
          border-r border-slate-300 lg:border-none
          ${state.isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
                    {sidebar}
                </aside>

                {/* CENTER PANE - Main Workspace */}
                <main className={`
          flex-1 flex flex-col min-w-0
          transition-all duration-500
          ${showCenterOnMobile ? 'flex' : 'hidden lg:flex'}
        `}>
                    <div className="flex-1 overflow-y-auto pb-40 lg:pb-20">
                        {centerContent}
                    </div>
                </main>

                {/* RIGHT PANE - Context/Assistant (Desktop only) */}
                <aside className="hidden lg:flex lg:w-[360px] lg:shrink-0 flex-col">
                    {rightContent || (
                        <div className="flex-1 flex items-center justify-center opacity-30 select-none text-xs uppercase tracking-widest">
                            i.M READY
                        </div>
                    )}
                </aside>

            </div>

            {/* DOCK - Always visible at bottom */}
            <Dock onAiAction={onAiAction} />

            {/* Safe area padding for iOS */}
            <style>{`.pb-safe { padding-bottom: env(safe-area-inset-bottom); }`}</style>
        </div>
    );
};

export default ThreePaneLayout;
