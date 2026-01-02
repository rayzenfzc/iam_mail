import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { GlassModule, GlassBody, GlassButton } from '../ui/GlassKit';

// ============================================
// CONFIRM DIALOG CONTEXT
// ============================================

interface ConfirmOptions {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    dangerConfirm?: boolean;
}

interface ConfirmContextValue {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmProvider');
    }
    return context.confirm;
}

// ============================================
// CONFIRM DIALOG PROVIDER
// ============================================

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setOptions(opts);
            setResolveRef(() => resolve);
            setIsOpen(true);
        });
    }, []);

    const handleConfirm = () => {
        setIsOpen(false);
        resolveRef?.(true);
    };

    const handleCancel = () => {
        setIsOpen(false);
        resolveRef?.(false);
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {/* Dialog Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* Dialog */}
                    <GlassModule noHover className="relative w-full max-w-sm shadow-2xl">
                        <GlassBody className="text-center py-6">
                            {/* Title */}
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                {options?.title}
                            </h3>

                            {/* Message */}
                            <p className="text-sm text-slate-600 mb-6">
                                {options?.message}
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-3 rounded-xl text-[0.6rem] font-bold uppercase tracking-[0.2em] bg-white/50 border border-white/60 text-slate-600 hover:bg-white hover:shadow-md transition-all"
                                >
                                    {options?.cancelLabel || 'Cancel'}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className={`flex-1 px-4 py-3 rounded-xl text-[0.6rem] font-bold uppercase tracking-[0.2em] transition-all ${options?.dangerConfirm
                                            ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
                                            : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-900/10'
                                        }`}
                                >
                                    {options?.confirmLabel || 'Confirm'}
                                </button>
                            </div>
                        </GlassBody>
                    </GlassModule>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};

export default ConfirmProvider;
