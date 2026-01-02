import React from 'react';
import { GlassModule, GlassHeader, GlassBody, GlassButton } from '../ui/GlassKit';
import { useAppState, useAppActions } from '../../context/AppStateContext';

// ============================================
// HOME HUB (Minimal Dashboard)
// ============================================

interface HomeHubProps {
    stats?: {
        unread: number;
        urgent: number;
        today: number;
    };
}

export const HomeHub: React.FC<HomeHubProps> = ({
    stats = { unread: 0, urgent: 0, today: 0 }
}) => {
    const { state, effectiveAiEnabled } = useAppState();
    const actions = useAppActions();

    return (
        <div className="flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar p-1 pb-40 lg:pb-0">
            {/* Welcome Card */}
            <GlassModule noHover className="shadow-lg">
                <GlassBody className="text-center py-8">
                    <div className="text-4xl mb-4">⬡</div>
                    <h1 className="text-xl font-thin text-slate-900 tracking-wide mb-2">
                        Welcome back
                    </h1>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">
                        {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </GlassBody>
            </GlassModule>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                <GlassModule noHover>
                    <GlassBody className="text-center">
                        <div className="text-2xl font-bold text-indigo-600 mb-1">{stats.unread}</div>
                        <div className="text-[0.5rem] font-bold uppercase tracking-widest text-slate-400">Unread</div>
                    </GlassBody>
                </GlassModule>
                <GlassModule noHover>
                    <GlassBody className="text-center">
                        <div className="text-2xl font-bold text-red-500 mb-1">{stats.urgent}</div>
                        <div className="text-[0.5rem] font-bold uppercase tracking-widest text-slate-400">Urgent</div>
                    </GlassBody>
                </GlassModule>
                <GlassModule noHover>
                    <GlassBody className="text-center">
                        <div className="text-2xl font-bold text-emerald-500 mb-1">{stats.today}</div>
                        <div className="text-[0.5rem] font-bold uppercase tracking-widest text-slate-400">Today</div>
                    </GlassBody>
                </GlassModule>
            </div>

            {/* Quick Actions */}
            <GlassModule noHover className="shadow-lg">
                <GlassHeader label="Quick Actions" />
                <GlassBody className="space-y-3">
                    <GlassButton
                        label="Go to Inbox"
                        onClick={() => actions.setActiveView('inbox')}
                        icon={<span>✉</span>}
                    />
                    <GlassButton
                        label="Compose New"
                        onClick={() => actions.openCompose('new')}
                        primary
                        icon={<span>+</span>}
                    />
                </GlassBody>
            </GlassModule>

            {/* AI Assistant Card (if AI ON) */}
            {effectiveAiEnabled && (
                <GlassModule noHover className="shadow-sm border-indigo-100 bg-indigo-50/30">
                    <GlassBody className="flex items-center gap-4">
                        <span className="text-2xl">✨</span>
                        <div className="flex-1">
                            <span className="text-sm font-bold text-indigo-700">AI Assistant</span>
                            <p className="text-xs text-indigo-500 mt-0.5">
                                Ask me anything via the dock below
                            </p>
                        </div>
                    </GlassBody>
                </GlassModule>
            )}

            {/* AI Status (if AI OFF) */}
            {!effectiveAiEnabled && (
                <div className="text-center py-4 opacity-50">
                    <span className="text-xs uppercase tracking-widest text-slate-400">
                        AI Assistance is OFF
                    </span>
                </div>
            )}
        </div>
    );
};

export default HomeHub;
