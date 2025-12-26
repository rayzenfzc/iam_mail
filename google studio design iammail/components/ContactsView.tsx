import React from 'react';
import { Search, Plus, Mail, MoreHorizontal } from 'lucide-react';

const ContactsView: React.FC<{ isDark: boolean, onCompose: () => void }> = ({ isDark, onCompose }) => {
  return (
    <div className={`flex-1 h-full backdrop-blur-xl rounded-[3rem] border shadow-inner flex flex-col p-12 overflow-hidden transition-all duration-500 ${isDark ? 'bg-[#121214]/60 border-white/5' : 'bg-white/40 border-white'}`}>
        <div className="flex justify-between items-center mb-12">
            <div>
                <div className={`text-[0.6rem] font-bold uppercase tracking-[0.4em] mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>I.CONTACTS</div>
                <h2 className={`text-4xl font-thin tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Identity Registry</h2>
            </div>
            <div className="flex gap-4">
                <div className="relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} size={16}/>
                    <input type="text" placeholder="Search identities..." className={`rounded-2xl py-3 pl-12 pr-6 text-xs focus:outline-none w-64 border transition-all ${isDark ? 'bg-white/5 border-white/5 text-white focus:border-indigo-500/50' : 'bg-white border-slate-100 text-slate-900 focus:ring-1 focus:ring-slate-900/10'}`}/>
                </div>
                <button className={`${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} px-8 rounded-2xl text-[0.6rem] font-bold uppercase tracking-widest flex items-center gap-3 transition-colors`}>
                    <Plus size={16}/> New_Identity
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
            {[
                { name: 'Arjun Rayzen', role: 'Chief Architect', company: 'Rayzen.ae', initial: 'A' },
                { name: 'Elena Vance', role: 'Security Analyst', company: 'Black Mesa', initial: 'E' },
                { name: 'Viktor Reznov', role: 'Logistics Lead', company: 'Novosibirsk', initial: 'V' },
                { name: 'Sarah Connor', role: 'Defensive Ops', company: 'Resistance', initial: 'S' }
            ].map((contact, i) => (
                <div key={i} className={`p-8 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all group ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-50'}`}>
                    <div className="flex justify-between mb-8">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-xl font-bold shadow-lg transition-transform group-hover:scale-105 ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>
                            {contact.initial}
                        </div>
                        <button className={`transition-colors ${isDark ? 'text-slate-700 hover:text-white' : 'text-slate-200 hover:text-slate-900'}`}><MoreHorizontal/></button>
                    </div>
                    <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{contact.name}</h3>
                    <p className={`text-[0.6rem] font-bold uppercase tracking-widest mb-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{contact.role} // {contact.company}</p>
                    <button 
                        onClick={onCompose}
                        className={`w-full py-4 border rounded-2xl text-[0.6rem] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isDark ? 'border-white/10 text-slate-400 hover:bg-white hover:text-black' : 'border-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white'}`}
                    >
                        <Mail size={14}/> Send_Packet
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};

export default ContactsView;