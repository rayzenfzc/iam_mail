import React, { useState } from 'react';
import { 
  X, CheckCircle, UserCircle, Users, Bell, Palette, ChevronLeft, Shield, FileSignature, Sun, Moon, Sparkles
} from 'lucide-react';
import { ThemeMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
}

type SettingsCategory = 'general' | 'profiles' | 'accounts' | 'privacy';

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, themeMode, onThemeModeChange }) => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general');
  const isDark = themeMode === 'dark';

  if (!isOpen) return null;

  const renderSidebarItem = (id: SettingsCategory, label: string, Icon: any) => (
    <button
      onClick={() => setActiveCategory(id)}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[0.7rem] font-black uppercase tracking-widest transition-all mb-2
        ${activeCategory === id 
            ? (isDark ? 'bg-white/10 text-white shadow-lg' : 'bg-slate-900 text-white shadow-md') 
            : (isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')}
      `}
    >
      <Icon size={18} strokeWidth={2} className={activeCategory === id ? 'opacity-100' : 'opacity-70'} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className={`absolute inset-0 transition-all duration-700 ${isDark ? 'bg-black/70' : 'bg-slate-900/20'} backdrop-blur-2xl`} onClick={onClose}></div>
      
      <div className={`w-full max-w-5xl h-[75vh] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border flex overflow-hidden animate-in zoom-in-95 duration-500 transition-all ${isDark ? 'bg-[#0F0F11]/95 border-white/5' : 'bg-white border-white'}`}>
        
        {/* Settings Sidebar */}
        <div className={`w-72 border-r flex flex-col h-full shrink-0 ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50/50'}`}>
            <div className="p-10 border-b border-white/5">
                <div className={`text-[0.7rem] uppercase tracking-[0.5em] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>I.SETTINGS</div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {renderSidebarItem('general', 'Aura_System', Palette)}
                {renderSidebarItem('profiles', 'Profile', UserCircle)}
                {renderSidebarItem('accounts', 'Auth Keys', Users)}
                {renderSidebarItem('privacy', 'Neural Guard', Shield)}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-full">
            <div className={`flex justify-between items-center px-10 py-8 border-b ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                <h2 className={`text-[0.65rem] uppercase tracking-[0.4em] font-black ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Section // {activeCategory}</h2>
                <button onClick={onClose} className={`transition-colors p-2 rounded-xl ${isDark ? 'text-slate-500 hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                {activeCategory === 'general' ? (
                    <div className="space-y-12">
                         <div>
                             <label className={`text-[0.65rem] uppercase tracking-widest font-black mb-8 block ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Workspace_Visual_Mode</label>
                             <div className="grid grid-cols-2 gap-8">
                                {/* i.M Light */}
                                <button
                                    onClick={() => onThemeModeChange('light')}
                                    className={`relative p-10 rounded-[2.5rem] border-2 text-left transition-all duration-500 group overflow-hidden ${themeMode === 'light' ? 'border-slate-900 bg-white shadow-xl' : 'border-slate-100 hover:border-slate-300 bg-white/40'}`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-900">
                                            <Sun size={24} strokeWidth={1.5} />
                                        </div>
                                        {themeMode === 'light' && <CheckCircle className="text-slate-900" size={24} />}
                                    </div>
                                    <div className="font-black text-sm text-slate-900 uppercase tracking-widest mb-1">i.M Light</div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Architectural_Draft</div>
                                </button>

                                {/* i.M Dark */}
                                <button
                                    onClick={() => onThemeModeChange('dark')}
                                    className={`relative p-10 rounded-[2.5rem] border-2 text-left transition-all duration-500 group overflow-hidden ${themeMode === 'dark' ? 'border-indigo-500 bg-[#121214] shadow-2xl' : 'border-white/5 hover:border-white/20 bg-white/5'}`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1a1a1c] shadow-2xl border border-white/5 flex items-center justify-center text-white">
                                            <Moon size={24} strokeWidth={1.5} />
                                        </div>
                                        {themeMode === 'dark' && <CheckCircle className="text-indigo-400" size={24} />}
                                    </div>
                                    <div className="font-black text-sm text-white uppercase tracking-widest mb-1">i.M Dark</div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Obsidian_Subsystem</div>
                                    {themeMode === 'dark' && <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none"></div>}
                                </button>
                             </div>
                        </div>

                        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center gap-4 mb-4">
                                <Sparkles size={20} className={isDark ? 'text-indigo-400' : 'text-slate-900'} />
                                <span className={`text-[0.7rem] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Auto_Visual_Sync</span>
                            </div>
                            <p className={`text-[0.7rem] font-bold leading-relaxed uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>The system will automatically calibrate neural rendering based on local timezone and ambient light sensors.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-30">
                        <span className={`text-[0.7rem] uppercase tracking-widest font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Accessing_Restricted_Node...</span>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;