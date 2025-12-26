import React from 'react';
import { Email } from '../types';

interface EmailListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  title: string;
  isDark: boolean;
}

const EmailList: React.FC<EmailListProps> = ({ emails, selectedId, onSelect, title, isDark }) => {
    return (
        <div className="flex flex-col h-full gap-4">
            <div className={`px-4 py-2 text-[0.6rem] font-black uppercase tracking-[0.5em] flex justify-between items-center shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                <span>{title.toUpperCase()} // FLOW</span>
                <span className="opacity-40">RZ_SYS</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-32 flex flex-col gap-4">
                {emails.map((mail) => (
                    <div 
                        key={mail.id} 
                        onClick={() => onSelect(mail.id)}
                        className={`
                            p-7 rounded-[2.5rem] border transition-all cursor-pointer relative group shrink-0
                            ${selectedId === mail.id 
                                ? (isDark ? 'bg-white/10 border-indigo-500/50 shadow-2xl shadow-black/50 -translate-y-1' : 'bg-white border-slate-900 shadow-2xl shadow-slate-900/10 -translate-y-1') 
                                : (isDark ? 'bg-[#121214]/60 border-white/5 hover:border-white/20 hover:bg-[#121214]/80 hover:-translate-y-1' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1')}
                        `}
                    >
                        {!mail.read && (
                            <div className={`absolute top-8 left-4 w-2 h-2 rounded-full shadow-lg ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'}`}></div>
                        )}
                        <div className="flex justify-between items-start mb-3">
                            <span className={`text-[0.75rem] font-black uppercase tracking-[0.1em] ${selectedId === mail.id ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-200' : 'text-slate-900')}`}>
                                {mail.senderName}
                            </span>
                            <span className={`text-[0.6rem] font-mono font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{mail.time}</span>
                        </div>
                        <h3 className={`text-[0.95rem] font-bold mb-2 leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{mail.subject}</h3>
                        <p className={`text-[0.85rem] font-medium line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{mail.preview}</p>
                        
                        {/* Status bar inside card on hover */}
                        <div className={`absolute bottom-4 right-8 text-[0.5rem] font-black tracking-widest uppercase opacity-0 group-hover:opacity-40 transition-opacity ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Packet_Ready // 2.4KB
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmailList;