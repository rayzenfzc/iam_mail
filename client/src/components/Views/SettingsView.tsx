import React from 'react';
import { GlassModule, GlassHeader, GlassBody } from '../ui/GlassKit';
import { useAppState, useAppActions } from '../../context/AppStateContext';

// ============================================
// SETTINGS VIEW
// ============================================

interface SettingItem {
    id: string;
    label: string;
    value: string;
    type: 'toggle' | 'text' | 'link';
    action?: () => void;
}

export const SettingsView: React.FC = () => {
    const { state, effectiveAiEnabled } = useAppState();
    const actions = useAppActions();

    const settingsGroups = [
        {
            title: 'Account',
            items: [
                { id: 'email', label: 'Email', value: state.accounts[0]?.email || 'Not connected', type: 'text' as const },
                { id: 'provider', label: 'Provider', value: state.accounts[0]?.provider || 'IMAP', type: 'text' as const },
            ]
        },
        {
            title: 'AI Assistant',
            items: [
                {
                    id: 'ai-toggle',
                    label: 'AI Assistance',
                    value: effectiveAiEnabled ? 'ON' : 'OFF',
                    type: 'toggle' as const,
                    action: () => actions.setAiEnabled(!state.aiEnabled)
                },
                { id: 'ai-account', label: 'Account AI Policy', value: state.accounts[0]?.aiAllowed ? 'Allowed' : 'Blocked', type: 'text' as const },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { id: 'notifications', label: 'Notifications', value: 'Enabled', type: 'text' as const },
                { id: 'signature', label: 'Signature', value: 'Configured', type: 'link' as const },
            ]
        }
    ];

    return (
        <div className="flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar p-1 pb-40 lg:pb-0">
            {/* Header */}
            <div className="px-2">
                <h1 className="text-xl font-thin text-slate-900 tracking-wide">Settings</h1>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">System Configuration</p>
            </div>

            {/* Settings Groups */}
            {settingsGroups.map(group => (
                <GlassModule key={group.title} noHover className="shadow-lg">
                    <GlassHeader label={group.title} />
                    <div className="divide-y divide-slate-100">
                        {group.items.map(item => (
                            <div
                                key={item.id}
                                className={`px-5 py-4 flex items-center justify-between ${item.action ? 'cursor-pointer hover:bg-white/50' : ''}`}
                                onClick={item.action}
                            >
                                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                {item.type === 'toggle' ? (
                                    <div className={`
                    relative w-10 h-6 rounded-full transition-colors
                    ${item.value === 'ON' ? 'bg-indigo-500' : 'bg-slate-300'}
                  `}>
                                        <div className={`
                      absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform
                      ${item.value === 'ON' ? 'left-5' : 'left-1'}
                    `} />
                                    </div>
                                ) : (
                                    <span className={`text-xs font-mono ${item.type === 'link' ? 'text-indigo-600' : 'text-slate-500'
                                        }`}>
                                        {item.value}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </GlassModule>
            ))}

            {/* Danger Zone */}
            <GlassModule noHover className="shadow-sm border-red-100">
                <GlassHeader label="Danger Zone" />
                <GlassBody>
                    <button className="text-xs text-red-500 hover:text-red-600 uppercase tracking-widest">
                        Remove Account
                    </button>
                </GlassBody>
            </GlassModule>

            {/* Version Info */}
            <div className="text-center py-4 opacity-50">
                <span className="text-[0.5rem] uppercase tracking-widest text-slate-400">
                    I.AM Mail v1.0 • Dual-World Inbox
                </span>
            </div>
        </div>
    );
};

export default SettingsView;
