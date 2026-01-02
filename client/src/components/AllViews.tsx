import React from 'react';

// This file contains all the view components for the i.AM OS app

interface ViewProps {
  darkMode: boolean;
  data: any;
  onItemClick?: (id: any) => void;
}

export const DraftsView: React.FC<ViewProps> = ({ darkMode, data }) => (
  <div className="sm:max-w-2xl sm:mx-auto">
    <h2 className="font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-8 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent text-[20px]">DRAFTS</h2>
    <div className="space-y-3 sm:space-y-4">
      {data.map((draft: any) => (
        <div key={draft.id} className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${darkMode ? 'bg-[#111] border-white/5 hover:border-red-600/20' : 'bg-white border-neutral-100'}`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Draft</span>
            <span className="text-xs font-mono opacity-40">{draft.time}</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest opacity-50 mb-2">To: {draft.to}</div>
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>{draft.subject}</h3>
          <p className="text-sm opacity-60 line-clamp-2">{draft.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export const SentView: React.FC<ViewProps> = ({ darkMode, data }) => (
  <div className="sm:max-w-2xl sm:mx-auto">
    <h2 className="font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-8 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent text-[20px]">SENT</h2>
    <div className="space-y-3 sm:space-y-4">
      {data.map((mail: any) => (
        <div key={mail.id} className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${darkMode ? 'bg-[#111] border-white/5 hover:border-red-600/20' : 'bg-white border-neutral-100'}`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600">Sent</span>
            <span className="text-xs font-mono opacity-40">{mail.time}</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest opacity-50 mb-2">To: {mail.to}</div>
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>{mail.subject}</h3>
          <p className="text-sm opacity-60 line-clamp-2">{mail.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export const ArchiveView: React.FC<ViewProps> = ({ darkMode, data }) => (
  <div className="sm:max-w-2xl sm:mx-auto">
    <h2 className="font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-8 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent text-[20px]">ARCHIVE</h2>
    <div className="space-y-3 sm:space-y-4">
      {data.map((mail: any) => (
        <div key={mail.id} className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${darkMode ? 'bg-[#111] border-white/5 hover:border-red-600/20' : 'bg-white border-neutral-100'}`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-widest opacity-50">{mail.sender}</span>
            <span className="text-xs font-mono opacity-40">{mail.time}</span>
          </div>
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>{mail.subject}</h3>
          <p className="text-sm opacity-60 line-clamp-2">{mail.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export const TrashView: React.FC<ViewProps> = ({ darkMode, data }) => (
  <div className="sm:max-w-2xl sm:mx-auto">
    <h2 className="font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-8 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent text-[20px]">TRASH</h2>
    <div className="space-y-3 sm:space-y-4">
      {data.map((mail: any) => (
        <div key={mail.id} className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${darkMode ? 'bg-[#111] border-white/5 hover:border-red-500/20' : 'bg-white border-neutral-100'}`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">Trash</span>
            <span className="text-xs font-mono opacity-40">{mail.time}</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest opacity-50 mb-2">{mail.sender}</div>
          <h3 className={`text-lg font-medium mb-2 opacity-50 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>{mail.subject}</h3>
          <p className="text-sm opacity-40 line-clamp-2">{mail.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export const SpamView: React.FC<ViewProps> = ({ darkMode, data }) => (
  <div className="sm:max-w-2xl sm:mx-auto">
    <h2 className="font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-8 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent text-[20px]">SPAM</h2>
    <div className="space-y-3 sm:space-y-4">
      {data.map((mail: any) => (
        <div key={mail.id} className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${darkMode ? 'bg-[#111] border-white/5 hover:border-orange-500/20' : 'bg-white border-neutral-100'}`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Spam</span>
            <span className="text-xs font-mono opacity-40">{mail.time}</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest opacity-50 mb-2">{mail.sender}</div>
          <h3 className={`text-lg font-medium mb-2 opacity-50 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>{mail.subject}</h3>
          <p className="text-sm opacity-40 line-clamp-2">{mail.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export const GroupsView: React.FC<ViewProps> = ({ darkMode, data }) => (
  <div className="sm:max-w-2xl sm:mx-auto">
    <h2 className="font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent text-[20px]">GROUPS</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      {data.map((group: any) => (
        <div key={group.id} className={`p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${darkMode ? 'bg-[#111] border-white/5 hover:border-red-600/20' : 'bg-white border-neutral-100'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg ${
            group.color === 'violet' ? 'bg-gradient-to-br from-red-500 to-red-600' :
            group.color === 'cyan' ? 'bg-gradient-to-br from-red-500 to-red-600' :
            group.color === 'blue' ? 'bg-gradient-to-br from-red-500 to-red-600' :
            'bg-gradient-to-br from-red-500 to-red-600'
          }`}>
            {group.count}
          </div>
          <h3 className="text-lg font-bold mb-2">{group.name}</h3>
          <div className="text-[10px] uppercase tracking-widest opacity-50 mb-3">{group.members.length} Members</div>
          <div className="text-xs opacity-60">{group.members.join(', ')}</div>
        </div>
      ))}
    </div>
  </div>
);

export const TasksView: React.FC<ViewProps> = ({ darkMode, data }) => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-2xl font-thin uppercase tracking-[0.3em] mb-6 bg-gradient-to-r from-red-400 via-orange-300 to-red-400 bg-clip-text text-transparent">TASKS</h2>
    <div className="space-y-3">
      {data.map((task: any) => (
        <div key={task.id} className={`p-4 rounded-lg border flex items-start gap-4 transition-all cursor-pointer active:scale-[0.98] ${task.completed ? 'opacity-50' : ''} ${darkMode ? 'bg-[#111] border-white/5 hover:border-red-600/20' : 'bg-white border-neutral-100'}`}>
          <input type="checkbox" checked={task.completed} readOnly className="mt-1 w-4 h-4 rounded accent-red-600" />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`}>{task.title}</h3>
              <span className={`text-[9px] font-bold px-2 py-1 rounded ${
                task.priority === 'HIGH' ? 'bg-red-500/20 text-red-500' :
                task.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-500' :
                'bg-blue-500/20 text-blue-500'
              }`}>{task.priority}</span>
            </div>
            <div className="flex gap-4 text-[10px] opacity-50">
              <span>📅 {task.due}</span>
              <span>🏷 {task.category}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const NotesView: React.FC<ViewProps> = ({ darkMode, data }) => (
  <div className="sm:max-w-2xl sm:mx-auto">
    <h2 className="font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent text-[20px]">NOTES</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      {data.map((note: any) => (
        <div key={note.id} className={`p-4 sm:p-5 rounded-lg sm:rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${darkMode ? 'bg-[#111] border-white/5 hover:border-violet-500/20' : 'bg-white border-neutral-100'}`}>
          <div className="text-[9px] uppercase tracking-widest text-violet-500 mb-2">{note.category}</div>
          <h3 className="text-sm font-bold mb-2">{note.title}</h3>
          <p className="text-xs opacity-60 mb-3 line-clamp-3">{note.preview}</p>
          <div className="text-[10px] opacity-40">{note.date}</div>
        </div>
      ))}
    </div>
  </div>
);

export const SearchView: React.FC<ViewProps> = ({ darkMode }) => (
  <div className="sm:max-w-2xl sm:mx-auto">
    <h2 className="font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent text-[20px]">SEARCH</h2>
    <div className={`p-4 rounded-lg border mb-6 ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
      <input type="text" placeholder="Search emails, contacts, notes..." className={`w-full bg-transparent outline-none text-sm ${darkMode ? 'text-white placeholder:text-neutral-600' : 'text-black placeholder:text-neutral-400'}`} />
    </div>
    <div className="text-center py-12 opacity-50">
      <div className="text-4xl mb-3">🔍</div>
      <div className="text-sm">Search across all your content</div>
    </div>
  </div>
);

export const FiltersView: React.FC<ViewProps> = ({ darkMode, data }) => (
  <div className="sm:max-w-2xl sm:mx-auto">
    <h2 className="font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent text-[20px]">FILTERS</h2>
    <div className="space-y-3">
      {data.map((filter: any) => (
        <div key={filter.id} className={`p-5 rounded-xl border ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold mb-1">{filter.name}</h3>
              <div className="text-[10px] opacity-50">{filter.condition}</div>
            </div>
            <div className={`w-10 h-6 rounded-full transition-all cursor-pointer ${filter.active ? 'bg-gradient-to-r from-violet-500 to-cyan-500' : darkMode ? 'bg-neutral-700' : 'bg-neutral-300'}`}>
              <div className={`w-4 h-4 rounded-full bg-white mt-1 transition-transform ${filter.active ? 'translate-x-5' : 'translate-x-1'}`}></div>
            </div>
          </div>
          <div className="text-xs text-violet-500">→ {filter.action}</div>
        </div>
      ))}
    </div>
  </div>
);

interface SettingsViewProps extends ViewProps {
  onToggleDarkMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ darkMode, onToggleDarkMode }) => (
  <div className="sm:max-w-2xl sm:mx-auto">
    <h2 className="font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent text-[20px]">SETTINGS</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Appearance</h3>
        <div className={`p-5 rounded-xl border ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold">Dark Mode</div>
              <div className="text-[10px] opacity-50">Cyber Violet theme</div>
            </div>
            <button onClick={onToggleDarkMode} className={`w-12 h-7 rounded-full transition-all ${darkMode ? 'bg-gradient-to-r from-violet-500 to-cyan-500' : 'bg-neutral-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white mt-1 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Account</h3>
        <div className="space-y-2">
          {['Email Signature', 'Notifications', 'Auto-Reply', 'Language'].map(item => (
            <div key={item} className={`p-4 rounded-lg border flex items-center justify-between cursor-pointer hover:border-violet-500/30 transition-all ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
              <span className="text-sm">{item}</span>
              <div className="w-2 h-2 border-t-[2px] border-r-[2px] border-violet-500 transform rotate-45"></div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Privacy</h3>
        <div className="space-y-2">
          {['Data Export', 'Block List', 'Cookie Preferences'].map(item => (
            <div key={item} className={`p-4 rounded-lg border flex items-center justify-between cursor-pointer hover:border-violet-500/30 transition-all ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
              <span className="text-sm">{item}</span>
              <div className="w-2 h-2 border-t-[2px] border-r-[2px] border-violet-500 transform rotate-45"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const StorageView: React.FC<ViewProps> = ({ darkMode }) => (
  <div className="sm:max-w-2xl sm:mx-auto">
    <h2 className="font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent text-[20px]">STORAGE</h2>
    <div className={`p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border mb-4 sm:mb-6 ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="text-3xl font-light">12.4 GB</div>
          <div className="text-xs opacity-50">of 50 GB used</div>
        </div>
        <div className="text-xl opacity-50">24%</div>
      </div>
      <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
        <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" style={{width: '24%'}}></div>
      </div>
    </div>

    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Breakdown</h3>
    <div className="space-y-2">
      {[
        { name: 'Emails & Attachments', size: '8.2 GB', percent: 66 },
        { name: 'Photos', size: '2.1 GB', percent: 17 },
        { name: 'Documents', size: '1.8 GB', percent: 14 },
        { name: 'Other', size: '0.3 GB', percent: 3 }
      ].map(item => (
        <div key={item.name} className={`p-4 rounded-lg border ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
          <div className="flex justify-between mb-2">
            <span className="text-sm">{item.name}</span>
            <span className="text-xs opacity-50">{item.size}</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
            <div className={`h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500`} style={{width: `${item.percent}%`}}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SecurityView: React.FC<ViewProps> = ({ darkMode }) => (
  <div className="sm:max-w-2xl sm:mx-auto">
    <h2 className="font-thin uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent text-[20px]">SECURITY</h2>
    
    <div className={`p-6 rounded-xl border mb-6 ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl">
          ✓
        </div>
        <div>
          <h3 className="text-lg font-bold mb-1">Security Status: Excellent</h3>
          <div className="text-xs opacity-50">Last security audit: Dec 29, 2025</div>
        </div>
      </div>
    </div>

    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Security Features</h3>
    <div className="space-y-2 mb-6">
      {[
        { name: 'Two-Factor Authentication', status: 'Enabled', active: true },
        { name: 'End-to-End Encryption', status: 'Active', active: true },
        { name: 'Login Alerts', status: 'Enabled', active: true },
        { name: 'Biometric Lock', status: 'Disabled', active: false }
      ].map(item => (
        <div key={item.name} className={`p-4 rounded-lg border flex items-center justify-between ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
          <div>
            <div className="text-sm font-medium">{item.name}</div>
            <div className={`text-[10px] ${item.active ? 'text-green-500' : 'opacity-50'}`}>{item.status}</div>
          </div>
          <div className={`w-10 h-6 rounded-full ${item.active ? 'bg-gradient-to-r from-violet-500 to-cyan-500' : darkMode ? 'bg-neutral-700' : 'bg-neutral-300'}`}>
            <div className={`w-4 h-4 rounded-full bg-white mt-1 ${item.active ? 'translate-x-5' : 'translate-x-1'}`}></div>
          </div>
        </div>
      ))}
    </div>

    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Recent Activity</h3>
    <div className="space-y-2">
      {[
        { action: 'Login from Dubai', time: '2 hours ago', device: 'MacBook Pro' },
        { action: 'Password changed', time: 'Yesterday', device: 'iPhone 15' },
        { action: 'New device authorized', time: 'Dec 27', device: 'iPad Air' }
      ].map((item, idx) => (
        <div key={idx} className={`p-4 rounded-lg border ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium">{item.action}</div>
              <div className="text-[10px] opacity-50">{item.device}</div>
            </div>
            <div className="text-[10px] opacity-40">{item.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);