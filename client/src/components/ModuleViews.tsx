import React from 'react';
import { motion } from 'motion/react';
import { CalendarMonthView } from './CalendarDayCard';

// All the additional module views
export const ModuleViews: React.FC<{
    activeView: string;
    darkMode: boolean;
    selectedEventId: number | null;
    setSelectedEventId: (id: number | null) => void;
    MOCK_EVENTS: any[];
    calendarViewMode?: 'list' | 'month';
    setCalendarViewMode?: (mode: 'list' | 'month') => void;
}> = ({ activeView, darkMode, selectedEventId, setSelectedEventId, MOCK_EVENTS, calendarViewMode = 'list', setCalendarViewMode }) => {
    return (
        <>
            {/* COMPOSE MODULE */}
            {activeView === 'compose' && (
                <div className="max-w-2xl mx-auto">
                    <div className={`p-6 rounded-md border space-y-4 ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                        <div className="border-b border-neutral-500/10 pb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50 w-12 inline-block">To</span>
                            <input type="text" placeholder="Recipients..." className="bg-transparent outline-none text-sm flex-1" />
                        </div>
                        <div className="border-b border-neutral-500/10 pb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50 w-12 inline-block">Subj</span>
                            <input type="text" placeholder="Subject" className="bg-transparent outline-none text-sm flex-1" />
                        </div>
                        <textarea className="w-full bg-transparent h-48 outline-none text-sm resize-none pt-2" placeholder="Start typing..."></textarea>
                    </div>
                </div>
            )}

            {/* CALENDAR MODULE - VIEW TOGGLE */}
            {activeView === 'calendar' && !selectedEventId && (
                <div className="max-w-5xl mx-auto">
                    {/* View Toggle Buttons */}
                    {setCalendarViewMode && (
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCalendarViewMode('list')}
                                    className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                                        calendarViewMode === 'list'
                                            ? 'bg-red-600 text-white'
                                            : darkMode ? 'bg-[#1A1A1A] text-white/60 border border-white/5 hover:border-white/10' : 'bg-white text-black/60 border border-neutral-200 hover:border-neutral-300'
                                    }`}
                                >
                                    LIST
                                </button>
                                <button
                                    onClick={() => setCalendarViewMode('month')}
                                    className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                                        calendarViewMode === 'month'
                                            ? 'bg-red-600 text-white'
                                            : darkMode ? 'bg-[#1A1A1A] text-white/60 border border-white/5 hover:border-white/10' : 'bg-white text-black/60 border border-neutral-200 hover:border-neutral-300'
                                    }`}
                                >
                                    MONTH
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MONTH VIEW - Calendar Day Cards */}
                    {calendarViewMode === 'month' && (
                        <CalendarMonthView darkMode={darkMode} />
                    )}

                    {/* LIST VIEW - Event Cards */}
                    {calendarViewMode === 'list' && (
                        <div className="max-w-2xl mx-auto space-y-4">
                            {MOCK_EVENTS.map((event, index) => (
                                <motion.div 
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.01, y: -2 }}
                                    onClick={() => setSelectedEventId(event.id)}
                                    className={`group p-6 rounded-md border cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                        darkMode 
                                          ? 'bg-[#1A1A1A] border-white/5 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]' 
                                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
                                    }`}
                                >
                                    {/* Small red accent - BOTTOM RIGHT corner (18% width, 2px) */}
                                    <div className="absolute bottom-0 right-0 h-[2px] w-[18%] bg-red-600"></div>
                                    
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                                            {event.title}
                                        </h3>
                                        <span className="text-[10px] font-mono opacity-50 shrink-0 ml-4">{event.date}</span>
                                    </div>
                                    <p className="text-sm opacity-50 mb-3">{event.time}</p>
                                    <div className="flex items-center gap-4 text-[10px] opacity-40">
                                        <span>📍 {event.loc}</span>
                                        <span>•</span>
                                        <span>👥 {event.attendees}</span>
                                    </div>
                                    <div className="absolute right-6 bottom-8 opacity-0 group-hover:opacity-30 transition-all duration-300 pointer-events-none">
                                        <div className="w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-red-600 transform rotate-45"></div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* CALENDAR EVENT DETAIL */}
            {activeView === 'calendar' && selectedEventId && (
                <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                    {MOCK_EVENTS.filter(e => e.id === selectedEventId).map(event => (
                        <div key={event.id} className="space-y-6">
                            <div className={`p-8 rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                                <div className={`inline-block px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest mb-4 ${
                                    event.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                    event.color === 'green' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                    'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                }`}>
                                    EVENT
                                </div>
                                <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>{event.title}</h1>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs opacity-50">Date</span>
                                        <span className="text-sm font-mono">{event.date}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs opacity-50">Time</span>
                                        <span className="text-sm font-mono">{event.time}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs opacity-50">Location</span>
                                        <span className="text-sm">{event.loc}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs opacity-50">Attendees</span>
                                        <span className="text-sm">{event.attendees}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* NOTES MODULE */}
            {activeView === 'notes' && (
                <div className="max-w-2xl mx-auto space-y-4">
                    {[1,2,3].map(i => (
                        <div 
                            key={i}
                            className={`p-6 rounded-md border transition-all duration-300 ${
                                darkMode 
                                  ? 'bg-[#0A0A0A]/50 border-white/5 hover:border-white/10 hover:bg-[#111]' 
                                  : 'bg-white border-neutral-100 hover:border-neutral-200 hover:shadow-lg'
                            }`}
                        >
                            <h3 className={`text-base font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                                {i === 1 ? 'Meeting Notes' : i === 2 ? 'Project Ideas' : 'Weekly Review'}
                            </h3>
                            <p className="text-sm opacity-60 mb-3 line-clamp-2">
                                {i === 1 ? 'Discussed Q4 strategy and team alignment...' : i === 2 ? 'New feature concepts for platform enhancement...' : 'Accomplishments and areas for improvement...'}
                            </p>
                            <div className="flex items-center gap-4 text-[10px] opacity-40">
                                <span>{i === 1 ? 'Oct 24, 2024' : i === 2 ? 'Oct 23, 2024' : 'Oct 22, 2024'}</span>
                                <span>•</span>
                                <span>{i} min read</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* SEARCH MODULE */}
            {activeView === 'search' && (
                <div className="max-w-2xl mx-auto">
                    <div className={`p-6 rounded-md border mb-6 ${
                        darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'
                    }`}>
                        <input 
                            type="text" 
                            placeholder="Search emails, contacts, calendar..."
                            className={`w-full bg-transparent outline-none text-base ${darkMode ? 'text-white placeholder:text-white/30' : 'text-black placeholder:text-black/30'}`}
                        />
                    </div>
                    <div className="space-y-4">
                        <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            Recent Searches
                        </h3>
                        {['Q4 Reports', 'Team Meeting', 'Budget 2024'].map((term, i) => (
                            <div 
                                key={i}
                                className={`p-4 rounded-md border cursor-pointer ${
                                    darkMode ? 'bg-[#0A0A0A]/50 border-white/5 hover:border-white/10' : 'bg-white border-neutral-100 hover:border-neutral-200'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-sm opacity-50">🔍</span>
                                    <span className="text-sm">{term}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FILTERS MODULE */}
            {activeView === 'filters' && (
                <div className="max-w-2xl mx-auto space-y-4">
                    {['Unread Messages', 'Starred Items', 'Has Attachments', 'From VIPs', 'This Week'].map((filter, i) => (
                        <div 
                            key={i}
                            className={`p-6 rounded-md border cursor-pointer transition-all ${
                                darkMode ? 'bg-[#0A0A0A]/50 border-white/5 hover:border-white/10' : 'bg-white border-neutral-100 hover:border-neutral-200'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                                        darkMode ? 'bg-white/5' : 'bg-neutral-50'
                                    }`}>
                                        {i === 0 ? '📧' : i === 1 ? '⭐' : i === 2 ? '📎' : i === 3 ? '👑' : '📅'}
                                    </div>
                                    <div>
                                        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{filter}</h3>
                                        <p className="text-xs opacity-50">{Math.floor(Math.random() * 50)} items</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded border-2 ${
                                    i === 0 ? 'bg-red-600 border-red-600' : darkMode ? 'border-white/20' : 'border-neutral-200'
                                }`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* SETTINGS MODULE */}
            {activeView === 'settings' && (
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className={`p-6 rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                        <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Account</h3>
                        <div className="space-y-4">
                            {['Email Address', 'Display Name', 'Signature', 'Time Zone'].map((setting, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-500/10 last:border-0">
                                    <span className="text-sm">{setting}</span>
                                    <span className="text-xs opacity-50">→</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`p-6 rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                        <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Preferences</h3>
                        <div className="space-y-4">
                            {['Notifications', 'Theme', 'Language', 'Auto-Archive'].map((setting, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-500/10 last:border-0">
                                    <span className="text-sm">{setting}</span>
                                    <div className={`w-10 h-5 rounded-full ${
                                        i % 2 === 0 ? 'bg-red-600' : darkMode ? 'bg-white/10' : 'bg-neutral-200'
                                    } relative`}>
                                        <div className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all ${
                                            i % 2 === 0 ? 'right-0.5' : 'left-0.5'
                                        }`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* STORAGE MODULE */}
            {activeView === 'storage' && (
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className={`p-8 rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                        <h3 className={`text-xs font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Storage Usage</h3>
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className={`text-4xl font-thin ${darkMode ? 'text-white' : 'text-black'}`}>42.8</span>
                                <span className="text-sm opacity-50">GB of 100 GB</span>
                            </div>
                            <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-neutral-100'}`}>
                                <div className="h-full bg-red-600" style={{width: '43%'}}></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            {label: 'Emails', size: '28.4 GB', percent: 66},
                            {label: 'Attachments', size: '12.1 GB', percent: 28},
                            {label: 'Other', size: '2.3 GB', percent: 6}
                        ].map((item, i) => (
                            <div key={i} className={`p-4 rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold">{item.label}</span>
                                    <span className="text-xs opacity-50">{item.size}</span>
                                </div>
                                <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-neutral-100'}`}>
                                    <div className={`h-full ${i === 0 ? 'bg-red-600' : i === 1 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{width: `${item.percent}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SECURITY MODULE */}
            {activeView === 'security' && (
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className={`p-8 rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-md bg-green-500/10 flex items-center justify-center text-2xl">
                                🔒
                            </div>
                            <div>
                                <h3 className={`text-base font-bold mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>Secure</h3>
                                <p className="text-xs opacity-50">All systems protected</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                {label: 'Two-Factor Authentication', status: 'Enabled', active: true},
                                {label: 'End-to-End Encryption', status: 'Active', active: true},
                                {label: 'Login Alerts', status: 'Enabled', active: true},
                                {label: 'Auto-Lock', status: '5 minutes', active: false}
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-500/10 last:border-0">
                                    <div>
                                        <div className="text-sm font-bold mb-1">{item.label}</div>
                                        <div className="text-xs opacity-50">{item.status}</div>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                                        item.active 
                                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                            : darkMode ? 'bg-white/5 text-neutral-400' : 'bg-neutral-50 text-neutral-500'
                                    }`}>
                                        {item.active ? 'ON' : 'SET'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};