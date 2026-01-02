import React from 'react';

interface ContactCardProps {
    name: string;
    role: string;
    initials: string;
    status?: 'online' | 'away' | 'offline';
    email?: string;
    phone?: string;
    theme?: 'dark' | 'light';
}

const ContactCard: React.FC<ContactCardProps> = ({
    name,
    role,
    initials,
    status = 'offline',
    email,
    phone,
    theme = 'dark'
}) => {
    const isDark = theme === 'dark';

    return (
        <div
            className={`relative group w-full h-[100px] p-4 flex items-center transition-all duration-500 overflow-hidden rounded-[10px] border font-sans
        ${isDark
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                    : 'bg-white border-black/5 hover:border-v-crimson/20 shadow-sm'
                } hover:-translate-y-1
      `}
        >
            {/* Avatar Section */}
            <div className="flex-shrink-0 mr-4 relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border transition-all duration-500 ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-black/5 text-black'}`}>
                    {initials}
                </div>
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 ${isDark ? 'border-[#060606]' : 'border-white'} ${status === 'online' ? 'bg-green-500' : status === 'away' ? 'bg-amber-500' : 'bg-gray-400'
                    }`} />
            </div>

            {/* Text Area */}
            <div className="flex-grow min-w-0">
                <h4 className={`text-[15px] font-bold tracking-tight uppercase truncate transition-all duration-500 ${isDark ? 'text-white' : 'text-black'}`}>
                    {name}
                </h4>
                <p className={`text-[12px] opacity-60 transition-all duration-500 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                    {role}
                </p>
            </div>

            {/* Actions Section */}
            <div className="flex gap-2 ml-4">
                {email && (
                    <button className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 border ${isDark ? 'border-white/10 text-white/40 hover:text-white hover:bg-white/10' : 'border-black/5 text-black/30 hover:text-v-crimson hover:bg-v-crimson/5 hover:border-v-crimson/20'}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </button>
                )}
                <button className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 border ${isDark ? 'border-white/10 text-white/40 hover:text-white hover:bg-white/10' : 'border-black/5 text-black/30 hover:text-v-crimson hover:bg-v-crimson/5 hover:border-v-crimson/20'}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                </button>
                {phone && (
                    <button className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 border ${isDark ? 'border-white/10 text-white/40 hover:text-white hover:bg-white/10' : 'border-black/5 text-black/30 hover:text-v-crimson hover:bg-v-crimson/5 hover:border-v-crimson/20'}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ContactCard;
