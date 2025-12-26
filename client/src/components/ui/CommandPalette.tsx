import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Mail, Calendar, Settings, Inbox, X, Command } from 'lucide-react';

interface Command {
    id: string;
    label: string;
    shortcut?: string;
    icon: React.ReactNode;
    action: () => void;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    commands: Command[];
}

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Filter commands based on search query
    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Reset selection when filtered commands change
    useEffect(() => {
        setSelectedIndex(0);
    }, [searchQuery]);

    // Focus management
    useEffect(() => {
        if (isOpen) {
            // Store the currently focused element
            previousFocusRef.current = document.activeElement as HTMLElement;
            // Focus the input immediately
            setTimeout(() => inputRef.current?.focus(), 0);
        } else {
            // Restore focus when closing
            if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
                previousFocusRef.current.focus();
            }
        }
    }, [isOpen]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredCommands[selectedIndex]) {
                filteredCommands[selectedIndex].action();
                onClose();
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    }, [selectedIndex, filteredCommands, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl mx-4 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200"
                style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-default)',
                    boxShadow: 'var(--shadow-xl)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="relative border-b" style={{ borderColor: 'var(--border-default)' }}>
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        size={20}
                        style={{ color: 'var(--text-tertiary)' }}
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a command or search..."
                        className="w-full pl-12 pr-12 py-4 bg-transparent text-lg outline-none"
                        style={{ color: 'var(--text-primary)' }}
                    />
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Commands List */}
                <div className="max-h-96 overflow-y-auto py-2">
                    {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd, index) => (
                            <button
                                key={cmd.id}
                                onClick={() => {
                                    cmd.action();
                                    onClose();
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 transition-colors"
                                style={{
                                    backgroundColor: index === selectedIndex ? 'var(--bg-hover)' : 'transparent',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div style={{ color: 'var(--text-secondary)' }}>
                                        {cmd.icon}
                                    </div>
                                    <span className="font-medium">{cmd.label}</span>
                                </div>
                                {cmd.shortcut && (
                                    <kbd
                                        className="px-2 py-1 text-xs font-mono rounded"
                                        style={{
                                            backgroundColor: 'var(--bg-surface)',
                                            color: 'var(--text-tertiary)',
                                            border: '1px solid var(--border-default)'
                                        }}
                                    >
                                        {cmd.shortcut}
                                    </kbd>
                                )}
                            </button>
                        ))
                    ) : (
                        <div
                            className="py-12 text-center text-sm"
                            style={{ color: 'var(--text-tertiary)' }}
                        >
                            No commands found
                        </div>
                    )}
                </div>

                {/* Footer hint */}
                <div
                    className="px-4 py-2 border-t text-xs flex items-center justify-between"
                    style={{
                        borderColor: 'var(--border-default)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-tertiary)'
                    }}
                >
                    <div className="flex items-center gap-4">
                        <span>↑↓ Navigate</span>
                        <span>↵ Select</span>
                        <span>Esc Close</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Command size={12} />
                        <span>+K</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
