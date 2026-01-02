// UI Component Barrel Export
// Import from '@/components/ui' for clean imports

export { EmptyState } from './EmptyState';
export { InboxRow } from './InboxRow';
export { RightPanelCard } from './RightPanelCard';
export { ThreadHeader } from './ThreadHeader';
export { ToastProvider, useToast } from './ToastProvider';

// Glass Kit primitives (Dual-World Inbox design system)
export {
    GlassModule,
    GlassHeader,
    GlassBody,
    GlassButton,
    DockAction,
    GlassInput,
    Skeleton,
    GlassModuleSkeleton
} from './GlassKit';

// Re-export types for convenience
export type { InboxRowProps } from './InboxRow';
