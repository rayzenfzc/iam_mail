import React from 'react';
import { ActiveModule } from '../types';
import { MODULES } from '../constants';
import { ModuleCard } from './ModuleCard';

interface SidebarProps {
  activeModule: ActiveModule;
  onSelect: (module: ActiveModule) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onSelect }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-12">
        <h2 className="font-mono font-bold text-[11px] tracking-[0.5rem] uppercase text-black/40">
          SYSTEM.V4
        </h2>
      </div>

      <nav className="grid grid-cols-2 gap-3 overflow-y-auto scrollbar-hide pr-1">
        {MODULES.map((mod) => (
          <ModuleCard
            key={mod.id}
            module={mod}
            active={activeModule === mod.name}
            onClick={() => onSelect(mod.name as ActiveModule)}
          />
        ))}
        
        {/* New Add Button */}
        <button className="relative aspect-square border border-dashed border-black/10 flex flex-col items-center justify-center text-black/20 hover:text-black/40 hover:border-black/30 transition-all duration-500">
          <div className="mb-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest font-medium">New Add</span>
        </button>
      </nav>

      <div className="mt-auto pt-8 border-t border-black/5">
        <div className="text-[9px] font-mono text-black/30 uppercase tracking-[0.2em] leading-relaxed">
          TERMINAL STATUS // ACTIVE <br />
          USER IDENT // 0X-882
        </div>
      </div>
    </div>
  );
};