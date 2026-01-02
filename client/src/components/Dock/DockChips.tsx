import React from 'react';
import { DockAction } from '../ui/GlassKit';
import { useAppState, useAppActions, DockMode } from '../../context/AppStateContext';

// ============================================
// DOCK CHIP CONFIGURATIONS
// ============================================

interface DockChip {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    primary?: boolean;
    aiOnly?: boolean;
}

interface DockChipsProps {
    onAiAction?: (prompt: string) => void;
}

export const DockChips: React.FC<DockChipsProps> = ({ onAiAction }) => {
    const { state, dockMode, effectiveAiEnabled } = useAppState();
    const actions = useAppActions();

    const getChipsForMode = (mode: DockMode): DockChip[] => {
        switch (mode) {
            case 'list_view':
                return [
                    {
                        label: 'Unread',
                        active: state.inboxFilter === 'unread',
                        onClick: () => actions.setInboxFilter(state.inboxFilter === 'unread' ? 'all' : 'unread')
                    },
                    {
                        label: 'Urgent',
                        active: state.inboxFilter === 'urgent',
                        onClick: () => actions.setInboxFilter(state.inboxFilter === 'urgent' ? 'all' : 'urgent')
                    },
                    {
                        label: 'Summarize',
                        icon: <span className="text-[10px]">✨</span>,
                        onClick: () => onAiAction?.('Summarize recent emails'),
                        aiOnly: true
                    },
                    {
                        label: 'Compose',
                        primary: true,
                        icon: <span>+</span>,
                        onClick: () => actions.openCompose('new')
                    }
                ];

            case 'thread_view':
                return [
                    {
                        label: 'Back',
                        icon: <span>←</span>,
                        onClick: () => actions.selectItem(null)
                    },
                    {
                        label: 'Reply',
                        primary: true,
                        onClick: () => actions.openCompose('reply')
                    },
                    {
                        label: 'Summarize',
                        icon: <span className="text-[10px]">✨</span>,
                        onClick: () => onAiAction?.('Summarize this thread'),
                        aiOnly: true
                    },
                    {
                        label: 'Tasks',
                        onClick: () => onAiAction?.('Extract tasks'),
                        aiOnly: true
                    }
                ];

            case 'compose_view':
                return [
                    {
                        label: 'Attach',
                        icon: <span>📎</span>,
                        onClick: () => actions.openPicker('attachments')
                    },
                    {
                        label: 'Formal',
                        onClick: () => onAiAction?.('Rewrite professionally'),
                        aiOnly: true
                    },
                    {
                        label: 'Friendly',
                        onClick: () => onAiAction?.('Rewrite casually'),
                        aiOnly: true
                    },
                    {
                        label: 'Send',
                        primary: true,
                        onClick: () => console.log('Send email')  // TODO: Implement send
                    }
                ];

            case 'picker_view':
                return [
                    {
                        label: 'Search',
                        onClick: () => { /* Focus input handled by parent */ }
                    },
                    {
                        label: 'Recent',
                        onClick: () => console.log('Show recent')
                    },
                    {
                        label: 'Done',
                        primary: true,
                        onClick: () => actions.closePicker()
                    },
                    {
                        label: 'Cancel',
                        onClick: () => actions.closePicker()
                    }
                ];

            case 'settings_view':
                return [
                    {
                        label: 'Back',
                        icon: <span>←</span>,
                        onClick: () => actions.goBack()
                    }
                ];

            case 'home_view':
                return [
                    {
                        label: 'Next',
                        icon: <span className="text-[10px]">✨</span>,
                        onClick: () => onAiAction?.('What should I do next'),
                        aiOnly: true
                    },
                    {
                        label: 'Inbox',
                        onClick: () => actions.setActiveView('inbox')
                    },
                    {
                        label: 'Compose',
                        primary: true,
                        onClick: () => actions.openCompose('new')
                    },
                    {
                        label: 'Catch-Up',
                        icon: <span className="text-[10px]">✨</span>,
                        onClick: () => onAiAction?.('Summarize what I missed'),
                        aiOnly: true
                    }
                ];

            default:
                return [];
        }
    };

    const chips = getChipsForMode(dockMode);

    // Filter out AI-only chips if AI is disabled
    const visibleChips = chips.filter(chip => !chip.aiOnly || effectiveAiEnabled);

    return (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(visibleChips.length, 4)}, 1fr)` }}>
            {visibleChips.map((chip, index) => (
                <DockAction
                    key={`${dockMode}-${index}`}
                    label={chip.label}
                    icon={chip.icon}
                    onClick={chip.onClick}
                    active={chip.active}
                    primary={chip.primary}
                    aiOnly={chip.aiOnly}
                    disabled={chip.aiOnly && !effectiveAiEnabled}
                />
            ))}
        </div>
    );
};

export default DockChips;
