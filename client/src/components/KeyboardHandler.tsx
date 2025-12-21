import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useHotkeys } from "@/hooks/useHotkeys";

interface KeyboardHandlerProps {
    onFocusCommandBar: () => void;
    onCompose: () => void;
    onArchive: () => void;
    onReply: () => void;
    onForward: () => void;
    onSearch: () => void;
}

export function KeyboardHandler({
    onFocusCommandBar,
    onCompose,
    onArchive,
    onReply,
    onForward,
    onSearch,
}: KeyboardHandlerProps) {
    const [showHelp, setShowHelp] = useState(false);

    useHotkeys([
        { key: "k", ctrl: true, handler: onFocusCommandBar },
        { key: "c", handler: onCompose },
        { key: "e", handler: onArchive },
        { key: "r", handler: onReply },
        { key: "f", handler: onForward },
        { key: "/", handler: onSearch },
        { key: "?", shift: true, handler: () => setShowHelp((prev) => !prev) },
    ]);

    const shortcuts = [
        { key: "Cmd+K", description: "Focus command bar" },
        { key: "C", description: "Compose new email" },
        { key: "E", description: "Archive selected email" },
        { key: "R", description: "Reply to email" },
        { key: "F", description: "Forward email" },
        { key: "/", description: "Search" },
        { key: "?", description: "Show keyboard shortcuts" },
    ];

    return (
        <Dialog open={showHelp} onOpenChange={setShowHelp}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        {shortcuts.map((shortcut) => (
                            <div
                                key={shortcut.key}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
                            >
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {shortcut.description}
                                </span>
                                <kbd className="px-2 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-md dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800">
                                    {shortcut.key}
                                </kbd>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
