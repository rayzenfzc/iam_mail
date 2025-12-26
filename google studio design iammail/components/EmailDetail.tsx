import React from 'react';
import { Email } from '../types';
import { FileText, Download, Reply, Forward, Trash2 } from 'lucide-react';

interface EmailDetailProps {
  email: Email | null;
  isDark: boolean;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ email, isDark }) => {
  if (!email) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center opacity-30 select-none">
           <div className={`text-[12rem] font-thin tracking-tighter leading-none mb-4 ${isDark ? 'text-white/5' : 'text-slate-300'}`}>i.M</div>
           <div className={`text-[0.7rem] uppercase tracking-[1em] ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>Workspace_Idle</div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full rounded-[3.5rem] shadow-2xl border flex flex-col relative overflow-hidden transition-all duration-500 ${isDark ? 'bg-[#121214]/60 backdrop-blur-3xl border-white/5 shadow-black/40' : 'bg-white border-slate-100'}`}>
        {/* Architectural watermark */}
        <div className={`absolute top-12 right-12 text-[6rem] font-thin pointer-events-none select-none tracking-tighter ${isDark ? 'text-white/5' : 'text-slate-50'}`}>RZ_01</div>
        
        {/* Header Section */}
        <div className="px-12 pt-12 pb-8 flex-shrink-0 z-10">
             <div className="flex items-center gap-3 mb-8">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]' : 'bg-indigo-600'}`}></div>
                <span className={`text-[0.65rem] font-black uppercase tracking-[0.5em] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Identity_Verified</span>
             </div>
             
             <h1 className={`text-4xl md:text-5xl font-thin tracking-tighter mb-10 leading-tight max-w-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {email.subject}
             </h1>
             
             <div className={`flex items-center justify-between border-t pt-8 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                <div className="flex items-center gap-5">
                    <div className={`${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-lg font-black shadow-xl`}>
                        {email.senderName.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-[1rem] font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{email.senderName}</span>
                        <span className={`text-[0.7rem] font-bold tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{email.senderEmail}</span>
                    </div>
                </div>
                
                <div className="text-right hidden sm:block">
                    <div className={`text-[0.65rem] font-mono uppercase tracking-[0.2em] font-black ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>TIMESTAMP // {email.time}</div>
                    <div className="text-[0.65rem] font-black uppercase tracking-[0.2em] mt-1 text-indigo-500">Status: Decrypted</div>
                </div>
             </div>
        </div>

        {/* Action Bar */}
        <div className={`px-10 py-5 flex gap-4 border-b ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
            <button className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[0.7rem] font-black uppercase tracking-widest transition-all ${isDark ? 'text-slate-200 hover:bg-white/10 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}>
                <Reply size={16} strokeWidth={2.5} /> Reply
            </button>
            <button className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[0.7rem] font-black uppercase tracking-widest transition-all ${isDark ? 'text-slate-200 hover:bg-white/10 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}>
                <Forward size={16} strokeWidth={2.5} /> Forward
            </button>
            <button className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[0.7rem] font-black uppercase tracking-widest transition-all ml-auto ${isDark ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}>
                <Trash2 size={16} strokeWidth={2.5} /> Delete
            </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 px-12 pt-12 pb-32 overflow-y-auto custom-scrollbar pr-10">
            <div 
              className={`prose prose-lg max-w-none font-normal leading-[1.8] ${isDark ? 'prose-invert text-slate-200' : 'prose-slate text-slate-800'}`}
              dangerouslySetInnerHTML={{ __html: email.body }}
            />
            
            {email.attachments && email.attachments.length > 0 && (
                <div className={`mt-16 p-10 rounded-[2.5rem] border flex items-center gap-8 group transition-all cursor-pointer ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-indigo-500/30' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-300 hover:shadow-2xl'}`}>
                    <div className={`w-16 h-16 rounded-[1.2rem] border flex items-center justify-center transition-colors ${isDark ? 'bg-[#1a1a1c] border-white/10 text-slate-400 group-hover:text-white' : 'bg-white border-slate-100 text-slate-600 group-hover:text-slate-900'}`}>
                        <FileText size={28} />
                    </div>
                    <div className="flex-1">
                        <div className={`text-[0.8rem] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{email.attachments[0].name}</div>
                        <div className={`text-[0.65rem] font-mono font-bold uppercase mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{email.attachments[0].size} // ACCESS_LINK</div>
                    </div>
                    <Download size={22} className={`${isDark ? 'text-slate-600 group-hover:text-white' : 'text-slate-300 group-hover:text-slate-900'}`} />
                </div>
            )}
        </div>
    </div>
  );
};

export default EmailDetail;