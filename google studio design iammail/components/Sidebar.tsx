import React from 'react';
import { Mail, Calendar, Users, FileText, Send, Archive, Plus } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onCompose: () => void;
  onOpenSettings: () => void;
  isDark: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  onCompose,
  isDark
}) => {
  return (
    <div className="w-20 lg:w-64 flex flex-col gap-4 shrink-0 h-full overflow-hidden pt-4">
        {/* Navigation Items */}
        <div className="flex flex-col gap-2">
            {[
                { label: 'Inbox_Flow', icon: Mail, id: 'inbox' },
                { label: 'Sent_Packet', icon: Send, id: 'sent' },
                { label: 'Draft_Stack', icon: FileText, id: 'drafts' },
                { label: 'Calendar', icon: Calendar, id: 'calendar' },
                { label: 'Registry', icon: Users, id: 'contacts' },
            ].map((item, i) => {
                const isActive = currentView === item.id;
                return (
                    <button 
                        key={i} 
                        onClick={() => onViewChange(item.id as ViewType)}
                        className={`
                            flex items-center justify-center lg:justify-start gap-5 px-5 py-4 rounded-2xl transition-all group relative
                            ${isActive 
                                ? (isDark ? 'bg-white/10 text-white shadow-lg' : 'bg-slate-900/10 text-slate-900 font-bold') 
                                : (isDark ? 'text-slate-300 hover:bg-white/5 hover:text-white' : 'text-slate-700 hover:bg-slate-900/5 hover:text-slate-900')}
                        `}
                    >
                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                        <span className={`hidden lg:block text-[0.7rem] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-colors`}>
                            {item.label}
                        </span>
                        {isActive && (
                            <div className="absolute left-1 w-1 h-6 bg-indigo-500 rounded-full hidden lg:block"></div>
                        )}
                    </button>
                );
            })}
        </div>
        
        <div className="mt-auto pb-24 px-1">
            <button 
                onClick={onCompose}
                className={`w-full flex items-center justify-center lg:justify-start gap-5 p-5 rounded-2xl transition-all group ${isDark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-900/5 hover:text-slate-900'}`}
            >
                <Plus size={20} strokeWidth={2} className="group-hover:rotate-90 transition-transform" />
                <span className="hidden lg:block text-[0.7rem] font-black uppercase tracking-[0.3em]">New_Packet</span>
            </button>
        </div>
    </div>
  );
};

export default Sidebar;