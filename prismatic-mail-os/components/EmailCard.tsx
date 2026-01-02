import React from 'react';
import { Email } from '../types';

interface EmailCardProps {
  email: Email;
  onClick: () => void;
}

export const EmailCard: React.FC<EmailCardProps> = ({ email, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group w-full bg-white/[0.03] hover:bg-white/[0.08] p-6 border border-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer flex gap-5"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[13px] font-bold text-white/40 group-hover:text-white/80 group-hover:bg-white/10 transition-all">
        {email.initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="text-[14px] font-bold text-white truncate group-hover:text-white transition-colors">{email.sender}</h3>
          <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{email.time}</span>
        </div>
        
        <h4 className="text-[12px] font-semibold text-white/90 mb-1 leading-tight">
          {email.subject}
        </h4>
        
        <p className="text-[12px] text-white/40 line-clamp-2 leading-relaxed font-light group-hover:text-white/60 transition-colors">
          {email.preview}
        </p>
      </div>
    </div>
  );
};