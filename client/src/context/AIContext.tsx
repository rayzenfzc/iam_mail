
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AIContextType {
    currentModule: 'inbox' | 'calendar' | 'compose' | 'contacts';
    setModule: (module: 'inbox' | 'calendar' | 'compose' | 'contacts') => void;
    contextData: any; // Flexible payload for "what am I looking at?"
    setContext: (data: any) => void;
    aiState: 'idle' | 'thinking' | 'speaking';
    askAI: (prompt: string) => Promise<string>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentModule, setModule] = useState<'inbox' | 'calendar' | 'compose' | 'contacts'>('inbox');
    const [contextData, setContext] = useState<any>(null);
    const [aiState, setAiState] = useState<'idle' | 'thinking' | 'speaking'>('idle');

    // Simulate AI "awareness"
    const askAI = async (prompt: string): Promise<string> => {
        setAiState('thinking');

        // In a real app, this would call the Gemini API with the `contextData` included in the system prompt.
        console.log(`[AI Core] Processing prompt: "${prompt}" within module: ${currentModule}`);
        console.log(`[AI Core] Context:`, contextData);

        return new Promise((resolve) => {
            setTimeout(() => {
                setAiState('idle');
                resolve(`[AI Analysis of ${currentModule}]: I see you are focused on ${contextData?.title || 'this view'}. Based on that, I think... (Simulated Response)`);
            }, 1000); // 1s latency simulation
        });
    };

    return (
        <AIContext.Provider value={{ currentModule, setModule, contextData, setContext, aiState, askAI }}>
            {children}
        </AIContext.Provider>
    );
};

export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
};
