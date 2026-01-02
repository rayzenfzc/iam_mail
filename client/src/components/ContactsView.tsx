import React, { useState } from 'react';
import { Search, Plus, Mail, Menu, Phone, MessageCircle, X, Shield, Activity, MapPin, ExternalLink } from 'lucide-react';

interface ContactData {
    name: string;
    role: string;
    company: string;
    initial: string;
    phone: string;
    email: string;
    location: string;
    bio: string;
}

const CONTACTS: ContactData[] = [
    { name: 'Arjun Rayzen', role: 'Chief Architect', company: 'Rayzen.ae', initial: 'A', phone: '+971501234567', email: 'arjun@rayzen.ae', location: 'Dubai, UAE', bio: 'Specializing in neural architecture and decentralized systems.' },
    { name: 'Elena Vance', role: 'Security Analyst', company: 'Black Mesa', initial: 'E', phone: '+14155550192', email: 'elena@vance.io', location: 'San Francisco, USA', bio: 'Lead researcher on biometric handshake protocols.' },
    { name: 'Viktor Reznov', role: 'Logistics Lead', company: 'Novosibirsk', initial: 'V', phone: '+74951112233', email: 'v.reznov@nova.ru', location: 'Moscow, Russia', bio: 'Optimizing global node distribution and supply chains.' },
    { name: 'John Shepard', role: 'Commander', company: 'Alliance', initial: 'J', phone: '+16175553456', email: 'shepard.j@alliance.mil', location: 'Vancouver, Canada', bio: 'Strategic command and interstellar communication specialist.' }
];

interface ContactsViewProps {
    isDark: boolean;
    onCompose: () => void;
    onOpenMenu?: () => void;
}

const ContactsView: React.FC<ContactsViewProps> = ({ isDark, onCompose, onOpenMenu }) => {
    const [selectedContact, setSelectedContact] = useState<ContactData | null>(null);

    return (
        <div className="flex flex-col h-full relative">
            <div className="px-6 py-4 lg:py-6 flex items-center gap-6 shrink-0 bg-transparent z-20">
                {onOpenMenu && (
                    <button
                        onClick={onOpenMenu}
                        className={`lg:hidden flex items-center gap-4 transition-all active:opacity-60 bg-transparent ${isDark ? 'text-white' : 'text-[#2D3748]'}`}
                    >
                        <div className={`w-[2px] h-8 ${isDark ? 'bg-slate-700' : 'bg-slate-900'} rounded-full`}></div>
                        <Menu size={24} strokeWidth={2.5} />
                    </button>
                )}
                <div className={`text-[0.8rem] font-black uppercase tracking-[0.6em] flex-1 flex justify-between items-center ${isDark ? 'text-white/80' : 'text-slate-900'}`}>
                    <span>CONTACTS</span>
                    <span className="opacity-20 font-mono text-[0.55rem] hidden sm:block">IDENTITY_HUB</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col p-4 pt-2 lg:p-12 lg:pt-0 overflow-hidden">
                <div className="mb-4">
                    <h2 className="section-label">Active Directory</h2>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2 space-y-3 pb-32">
                    {CONTACTS.map((contact, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedContact(contact)}
                            className={`
                            card-vitreous flex items-center gap-6 p-4 border backdrop-blur-[var(--sintered-blur)] group
                            ${isDark ? 'bg-[var(--vitreous-glass)] border-[var(--vitreous-border)]' : 'bg-white/40 border-white'}
                        `}
                        >
                            {/* Sintered Texture Overlay */}
                            <div className="sintered-texture">
                                <svg width="100%" height="100%">
                                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                                </svg>
                            </div>

                            <div className="avatar-vessel">
                                {contact.initial}
                                {i === 0 && <div className="status-pulse status-pulse-anim"></div>}
                            </div>

                            <div className="flex-1 min-w-0 relative z-10">
                                <h3 className={`text-[0.95rem] font-bold tracking-tight truncate ${isDark ? 'text-[var(--vitreous-text)]' : 'text-slate-900'}`}>{contact.name}</h3>
                                <p className={`text-[0.65rem] font-mono uppercase tracking-[0.2em] truncate mt-1 ${isDark ? 'text-[var(--vitreous-dim)]' : 'text-slate-500'}`}>{contact.role} // LEVEL 0{i + 1}</p>
                            </div>

                            <ExternalLink size={16} className={`relative z-10 transition-opacity ${isDark ? 'text-[var(--vitreous-dim)] group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                        </div>
                    ))}
                </div>
            </div>

            {selectedContact && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={() => setSelectedContact(null)}></div>
                    <div className={`w-full max-w-[360px] rounded-[1rem] border relative overflow-hidden animate-in zoom-in-95 duration-300 p-8 flex flex-col items-center ${isDark ? 'bg-[#121214]/90 border-white/10' : 'bg-white/80 border-white shadow-2xl shadow-slate-900/10'} backdrop-blur-3xl`}>
                        <button onClick={() => setSelectedContact(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
                            <X size={20} />
                        </button>
                        <div className={`w-16 h-16 rounded-[1rem] flex items-center justify-center text-2xl font-black mb-6 border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-white text-slate-900 shadow-sm'}`}>
                            {selectedContact.initial}
                        </div>
                        <h2 className={`text-xl font-black tracking-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedContact.name}</h2>
                        <p className={`text-[0.6rem] font-black uppercase tracking-[0.4em] mb-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{selectedContact.role}</p>
                        <div className="w-full flex gap-3">
                            <button className={`flex-1 py-3.5 rounded-[0.75rem] border font-black text-[0.65rem] uppercase tracking-widest transition-transform active:scale-95 ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'bg-slate-900 text-white border-slate-900'}`}>Call</button>
                            <button onClick={onCompose} className={`flex-1 py-3.5 rounded-[0.75rem] border font-black text-[0.65rem] uppercase tracking-widest transition-transform active:scale-95 ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'bg-white border-white text-slate-900 shadow-sm hover:shadow-md'}`}>Email</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactsView;