import React from 'react';
import { GlassModule } from '../newdesign/Glass';

interface GlassEmptyStateProps {
    title: string;
    description: string;
    icon: string;
    darkMode: boolean;
}

export const GlassEmptyState: React.FC<GlassEmptyStateProps> = ({ title, description, icon, darkMode }) => {
    return (
        <GlassModule darkMode={darkMode} className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className={`text-6xl mb-6 opacity-20 transform transition-transform hover:scale-110 duration-500`}>
                {icon}
            </div>
            <h3 className={`text-lg font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                {title}
            </h3>
            <p className={`text-sm max-w-xs mx-auto ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {description}
            </p>
        </GlassModule>
    );
};
