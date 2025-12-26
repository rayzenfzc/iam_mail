import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { X, Undo2 } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming basic clsx/tailwind-merge utility exists or we'll make simple one

type ToastType = 'default' | 'success' | 'destructive' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    undoLabel?: string;
    onUndo?: () => void;
    duration?: number;
}

interface ToastContextType {
    toast: (props: Omit<Toast, 'id'>) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback(({ message, type = 'default', undoLabel = 'Undo', onUndo, duration = 5000 }: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = { id, message, type, undoLabel, onUndo, duration };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                dismiss(id);
            }, duration);
        }
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={cn(
                            "pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border animate-in slide-in-from-bottom-5 fade-in duration-300",
                            "bg-surface border-default text-primary",
                            // Style variants based on type using our tokens
                            t.type === 'destructive' && "border-red-500/20 bg-red-50 dark:bg-red-950/20",
                            t.type === 'success' && "border-green-500/20 bg-green-50 dark:bg-green-950/20",
                        )}
                        style={{
                            backgroundColor: 'var(--bg-elevated)',
                            color: 'var(--text-primary)',
                            borderColor: t.type === 'destructive' ? 'var(--status-error)' : 'var(--border-default)',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        <span className="text-sm font-medium">{t.message}</span>
                        <div className="flex items-center gap-3">
                            {t.onUndo && (
                                <button
                                    onClick={() => {
                                        t.onUndo?.();
                                        dismiss(t.id);
                                    }}
                                    className="text-sm font-bold text-accent-primary hover:text-accent-hover active:text-accent-active flex items-center gap-1 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                    style={{ color: 'var(--accent-primary)' }}
                                >
                                    <Undo2 size={16} />
                                    {t.undoLabel}
                                </button>
                            )}
                            <button
                                onClick={() => dismiss(t.id)}
                                className="text-tertiary hover:text-secondary p-1"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
