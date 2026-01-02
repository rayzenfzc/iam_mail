import React from 'react';
import { Module } from '../types';

interface ModuleCardProps {
  module: Module;
  active: boolean;
  onClick: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative aspect-square border transition-all duration-500 flex flex-col items-center justify-center cursor-pointer group ${
        active 
          ? 'bg-black text-white border-black shadow-[0_20px_40px_rgba(0,0,0,0.2)] translate-y-[-4px]' 
          : 'bg-black/[0.02] border-black/10 text-black hover:bg-black hover:text-white hover:border-black hover:translate-y-[-4px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]'
      }`}
    >
      {/* Badge Top-Left */}
      {module.badge && (
        <div className={`absolute top-3 left-3 font-mono text-[9px] px-1.5 py-0.5 min-w-[20px] text-center transition-colors duration-500 ${
          active ? 'bg-white text-black' : 'bg-black text-white group-hover:bg-white group-hover:text-black'
        }`}>
          {module.badge}
        </div>
      )}

      {/* Active Dot Top-Right */}
      {active && (
        <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 bg-[#00ff88] rounded-full shadow-[0_0_10px_#00ff88]" />
      )}
      
      <div className="mb-3 transition-transform duration-500 group-hover:scale-110">
        {React.cloneElement(module.icon as React.ReactElement, { size: 28, strokeWidth: 1.5 })}
      </div>
      
      <span className="text-[10px] uppercase font-mono tracking-widest font-medium">
        {module.name}
      </span>
    </button>
  );
};