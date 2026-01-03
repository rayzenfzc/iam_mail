import React, { useRef, useEffect } from 'react';
import { GlassInput } from '../ui/GlassKit';
import { DockChips } from './DockChips';
import { useAppState, useAppActions } from '../../context/AppStateContext';

// ============================================
// DOCK COMPONENT (Persistent Bottom Bar)
// ============================================

interface DockProps {
    onAiAction?: (prompt: string) => void;
    className?: string;
}

export const Dock: React.FC<DockProps> = ({ onAiAction, className = "" }) => {
    const { state, dockMode, effectiveAiEnabled } = useAppState();
    const actions = useAppActions();
    const inputRef = useRef<HTMLInputElement>(null);

    // AI response state (could be lifted to context if needed)
    const [aiResponse, setAiResponse] = React.useState('');
    const [isAiThinking, setIsAiThinking] = React.useState(false);

    // Get placeholder based on dock mode
    const getPlaceholder = () => {
        switch (dockMode) {
            case 'list_view': return 'Search inbox...';
            case 'thread_view': return 'Quick reply...';
            case 'compose_view': return 'Drafting body...';
            case 'picker_view': return 'Search items...';
            case 'home_view': return 'Ask anything...';
            case 'settings_view': return 'Search settings...';
            case 'calendar_view': return 'Schedule meeting or find time...';
            case 'contacts_view': return 'Email Sarah or find contact...';
            default: return 'Search or Command...';
        }
    };


    // Handle input based on dock mode
    const handleInputChange = (value: string) => {
        if (dockMode === 'list_view') {
            // Search mode: filter inbox
            actions.setSearchQuery(value);
        } else if (dockMode === 'compose_view') {
            // Compose mode: update draft body
            actions.updateDraft({ body: value });
        }
    };

    // Get current input value based on mode
    const getInputValue = () => {
        if (dockMode === 'list_view') return state.searchQuery;
        if (dockMode === 'compose_view') return state.composeDraft.body;
        return '';
    };

    // Handle AI action
    const handleAiAction = async (prompt: string) => {
        if (!effectiveAiEnabled || !prompt.trim()) return;

        setIsAiThinking(true);
        setAiResponse('');

        try {
            // TODO: Integrate with actual AI service
            const response = await fetch('/api/ai/interpret', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, context: dockMode })
            });
            const data = await response.json();
            setAiResponse(data.response || 'Command executed.');
            onAiAction?.(prompt);
        } catch (e) {
            setAiResponse('AI unavailable.');
        } finally {
            setIsAiThinking(false);
        }
    };

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && effectiveAiEnabled && dockMode !== 'compose_view') {
            handleAiAction(getInputValue());
        }
        if (e.key === 'Escape') {
            actions.goBack();
        }
    };

    // Focus input when picker opens
    useEffect(() => {
        if (dockMode === 'picker_view') {
            inputRef.current?.focus();
        }
    }, [dockMode]);

    return (
        <div className={`
      fixed bottom-0 left-0 right-0 z-[100]
      bg-[#E5E5E5]/95 backdrop-blur-2xl border-t border-white/60
      pb-safe transition-all duration-300
      lg:left-[280px] lg:right-[360px]
      ${className}
    `}>
            {/* AI Response Banner */}
            {aiResponse && (
                <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 text-[0.6rem] text-indigo-800 flex justify-between items-center">
                    <span>AI: {aiResponse}</span>
                    <button onClick={() => setAiResponse('')} className="text-indigo-400 hover:text-indigo-600">×</button>
                </div>
            )}

            <div className="p-3 flex flex-col gap-2">
                {/* ROW 1: Smart Input */}
                <div className="bg-white border border-slate-200 rounded-xl h-10 px-4 flex items-center gap-3 shadow-sm focus-within:ring-1 focus-within:ring-indigo-500/30 transition-shadow">
                    <div className="font-bold text-slate-300 text-[0.6rem] tracking-wider shrink-0">
                        {isAiThinking ? '...' : 'i.M'}
                    </div>
                    <input
                        ref={inputRef as any}
                        type="text"
                        value={getInputValue()}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={getPlaceholder()}
                        className="flex-1 bg-transparent h-full text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none tracking-wide"
                    />
                    {getInputValue() && dockMode === 'list_view' && (
                        <button onClick={() => actions.clearSearch()} className="text-slate-400 hover:text-slate-600">
                            ×
                        </button>
                    )}
                    {getInputValue() && effectiveAiEnabled && dockMode !== 'compose_view' && (
                        <button onClick={() => handleAiAction(getInputValue())} className="text-indigo-600 text-xs">
                            ↵
                        </button>
                    )}
                </div>

                {/* ROW 2: Contextual Chips */}
                <DockChips onAiAction={handleAiAction} />
            </div>
        </div>
    );
};

export default Dock;
