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
                        label: 'Select',
                        icon: <span>☑</span>,
                        onClick: () => console.log('Toggle selection mode')  // TODO: Implement bulk select
                    },
                    {
                        label: 'Archive',
                        icon: <span>📥</span>,
                        onClick: () => console.log('Archive selected')  // TODO: Implement archive
                    },
                    {
                        label: 'Star',
                        icon: <span>⭐</span>,
                        onClick: () => console.log('Star selected')  // TODO: Implement star
                    },
                    {
                        label: 'Delete',
                        icon: <span>🗑</span>,
                        onClick: () => console.log('Delete selected')  // TODO: Implement delete
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
                        label: 'Reply',
                        primary: true,
                        icon: <span>↩</span>,
                        onClick: () => actions.openCompose('reply')
                    },
                    {
                        label: 'Forward',
                        icon: <span>↪</span>,
                        onClick: () => actions.openCompose('forward')
                    },
                    {
                        label: 'Archive',
                        icon: <span>📥</span>,
                        onClick: () => console.log('Archive this email')  // TODO: Implement archive
                    },
                    {
                        label: 'Star',
                        icon: <span>⭐</span>,
                        onClick: () => console.log('Star this email')  // TODO: Implement star
                    },
                    {
                        label: 'Delete',
                        icon: <span>🗑</span>,
                        onClick: () => console.log('Delete this email')  // TODO: Implement delete
                    }
                ];


            case 'compose_view':
                return [
                    {
                        label: 'Send',
                        primary: true,
                        icon: <span>➤</span>,
                        onClick: () => console.log('Send email')  // TODO: Implement send
                    },
                    {
                        label: 'Schedule',
                        icon: <span>🕐</span>,
                        onClick: () => actions.openPicker('date')
                    },
                    {
                        label: 'AI Draft',
                        icon: <span className="text-[10px]">✨</span>,
                        onClick: () => onAiAction?.('Improve this email'),
                        aiOnly: true
                    },
                    {
                        label: 'Attach',
                        icon: <span>📎</span>,
                        onClick: () => actions.openPicker('attachments')
                    },
                    {
                        label: 'Save',
                        icon: <span>💾</span>,
                        onClick: () => console.log('Save draft')  // TODO: Save as draft
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

            case 'calendar_view':
                return [
                    {
                        label: 'New Event',
                        icon: <span>+</span>,
                        primary: true,
                        onClick: () => console.log('Create new event')  // TODO: Open event creator
                    },
                    {
                        label: 'Today',
                        onClick: () => console.log('Jump to today')
                    },
                    {
                        label: 'Week',
                        onClick: () => console.log('Week view')
                    },
                    {
                        label: 'Month',
                        onClick: () => console.log('Month view')
                    },
                    {
                        label: 'Find Time',
                        icon: <span className="text-[10px]">✨</span>,
                        onClick: () => onAiAction?.('Find available time slots this week'),
                        aiOnly: true
                    }
                ];

            case 'contacts_view':
                return [
                    {
                        label: 'New',
                        icon: <span>+</span>,
                        primary: true,
                        onClick: () => console.log('Add new contact')  // TODO: Open contact form
                    },
                    {
                        label: 'Email',
                        icon: <span>✉️</span>,
                        onClick: () => actions.openCompose('new')
                    },
                    {
                        label: 'Call',
                        icon: <span>📞</span>,
                        onClick: () => console.log('Initiate call')
                    },
                    {
                        label: 'Find',
                        icon: <span className="text-[10px]">✨</span>,
                        onClick: () => onAiAction?.('Find contact'),
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
