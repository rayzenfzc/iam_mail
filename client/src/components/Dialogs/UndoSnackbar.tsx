import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';

// ============================================
// UNDO SNACKBAR CONTEXT
// ============================================

interface UndoItem {
    id: string;
    message: string;
    onUndo: () => void;
    duration: number;
    createdAt: number;
}

interface UndoContextValue {
    showUndo: (message: string, onUndo: () => void, duration?: number) => string;
    dismissUndo: (id: string) => void;
}

const UndoContext = createContext<UndoContextValue | null>(null);

export function useUndo() {
    const context = useContext(UndoContext);
    if (!context) {
        throw new Error('useUndo must be used within UndoProvider');
    }
    return context;
}

// ============================================
// UNDO SNACKBAR PROVIDER
// ============================================

export const UndoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<UndoItem[]>([]);
    const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    const showUndo = useCallback((message: string, onUndo: () => void, duration = 8000): string => {
        const id = `undo-${Date.now()}-${Math.random()}`;

        const item: UndoItem = {
            id,
            message,
            onUndo,
            duration,
            createdAt: Date.now()
        };

        setItems(prev => [...prev, item]);

        // Auto dismiss after duration
        const timer = setTimeout(() => {
            setItems(prev => prev.filter(i => i.id !== id));
            timersRef.current.delete(id);
        }, duration);

        timersRef.current.set(id, timer);

        return id;
    }, []);

    const dismissUndo = useCallback((id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
        const timer = timersRef.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
    }, []);

    const handleUndo = (item: UndoItem) => {
        item.onUndo();
        dismissUndo(item.id);
    };

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            timersRef.current.forEach(timer => clearTimeout(timer));
        };
    }, []);

    return (
        <UndoContext.Provider value={{ showUndo, dismissUndo }}>
            {children}

            {/* Snackbar Stack */}
            <div className="fixed bottom-24 lg:bottom-20 left-4 right-4 lg:left-[300px] lg:right-[380px] z-[150] flex flex-col gap-2 pointer-events-none">
                {items.map((item) => {
                    const elapsed = Date.now() - item.createdAt;
                    const remaining = Math.max(0, item.duration - elapsed);
                    const progress = (remaining / item.duration) * 100;

                    return (
                        <div
                            key={item.id}
                            className="pointer-events-auto bg-slate-900 text-white rounded-xl px-4 py-3 shadow-xl flex items-center gap-4 animate-slide-up overflow-hidden"
                        >
                            {/* Message */}
                            <span className="flex-1 text-sm font-medium">{item.message}</span>

                            {/* Undo Button */}
                            <button
                                onClick={() => handleUndo(item)}
                                className="text-indigo-400 text-xs font-bold uppercase tracking-wider hover:text-indigo-300 transition-colors"
                            >
                                Undo
                            </button>

                            {/* Dismiss */}
                            <button
                                onClick={() => dismissUndo(item.id)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                ×
                            </button>

                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-700">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-100"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
        </UndoContext.Provider>
    );
};

export default UndoProvider;
