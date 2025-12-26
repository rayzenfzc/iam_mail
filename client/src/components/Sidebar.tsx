import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Users, FileText, Send, Plus, Settings, Archive, Trash2, AlertOctagon, Clock, StickyNote, Sun, Moon, Database, LogOut, UserPlus } from 'lucide-react';
import { ViewType } from '../types';

interface EmailAccount {
  id: string;
  email: string;
  provider: string;
  isActive: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onCompose: () => void;
  onOpenSettings: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  onGenesis: () => void;
  onLogout?: () => void;
  onAddAccount?: () => void;
  isConnected?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  currentView,
  onViewChange,
  onCompose,
  onOpenSettings,
  isDark,
  toggleTheme,
  onGenesis,
  onLogout,
  onAddAccount,
  isConnected = false
}) => {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [isAccountsExpanded, setIsAccountsExpanded] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '';

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await fetch(`${API_URL}/api/accounts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        }
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };

    fetchAccounts();
  }, [API_URL, isConnected]);

  // Switch account
  const handleSwitchAccount = async (accountId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${API_URL}/api/accounts/switch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ accountId })
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch account:', error);
    }
  };

  // Get provider badge color
  const getProviderColor = (provider: string) => {
    switch (provider?.toLowerCase()) {
      case 'gmail': return 'bg-red-500';
      case 'icloud': return 'bg-blue-500';
      case 'outlook': return 'bg-blue-600';
      case 'titan': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  const MENU_ITEMS = [
    { label: 'Inbox', icon: Mail, id: 'inbox' },
    { label: 'Sent', icon: Send, id: 'sent' },
    { label: 'Drafts', icon: FileText, id: 'drafts' },
    { label: 'Archive', icon: Archive, id: 'archive' },
    { label: 'Junk', icon: AlertOctagon, id: 'junk' },
    { label: 'History', icon: Clock, id: 'history' },
    { label: 'Notes', icon: StickyNote, id: 'notes' },
    { label: 'Trash', icon: Trash2, id: 'trash' },
  ];

  const APP_APPS = [
    { label: 'Calendar', icon: Calendar, id: 'calendar' },
    { label: 'Contacts', icon: Users, id: 'contacts' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/5 backdrop-blur-sm z-[80]"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:relative z-[90] h-full flex flex-col transition-all duration-500 ease-in-out
        ${isOpen ? 'w-72 translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'}
        bg-transparent
      `}>
        <div className={`flex flex-col h-full ${!isOpen && 'hidden lg:flex'}`}>

          {/* Account Switcher - NEW */}
          {accounts.length > 0 && (
            <div className={`p-4 mt-16 lg:mt-6 ${!isOpen && 'lg:items-center lg:flex lg:flex-col'}`}>
              <div
                className={`flex items-center gap-3 p-3 rounded-[0.75rem] cursor-pointer transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}
                onClick={() => setIsAccountsExpanded(!isAccountsExpanded)}
              >
                {/* Active account avatar */}
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${getProviderColor(accounts.find(a => a.isActive)?.provider || '')}`}>
                    {accounts.find(a => a.isActive)?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {isOpen && (
                  <div className="flex-1 min-w-0">
                    <p className={`text-[0.7rem] font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {accounts.find(a => a.isActive)?.email || 'No Account'}
                    </p>
                    <p className={`text-[0.6rem] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      {accounts.find(a => a.isActive)?.provider || 'Unknown'}
                    </p>
                  </div>
                )}
              </div>

              {/* Expanded account list */}
              {isAccountsExpanded && isOpen && (
                <div className={`mt-2 p-2 rounded-[0.75rem] ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                  {accounts.filter(a => !a.isActive).map(account => (
                    <button
                      key={account.id}
                      onClick={() => handleSwitchAccount(account.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getProviderColor(account.provider)}`}>
                        {account.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[0.65rem] truncate">{account.email}</span>
                    </button>
                  ))}

                  {/* Add account button */}
                  {accounts.length < 5 && (
                    <button
                      onClick={onAddAccount || onGenesis}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/10 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
                    >
                      <UserPlus size={16} />
                      <span className="text-[0.65rem]">Add Account</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Main Navigation */}
          <div className={`flex flex-col gap-1 p-4 ${accounts.length === 0 ? 'mt-16 lg:mt-6' : ''} ${!isOpen && 'lg:items-center'} overflow-y-auto custom-scrollbar flex-1`}>
            <div className={`px-4 mb-2 text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-40 ${!isOpen && 'hidden'} ${isDark ? 'text-white' : 'text-slate-900'}`}>Mailbox</div>
            {MENU_ITEMS.map((item, i) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={i}
                  onClick={() => {
                    onViewChange(item.id as ViewType);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`
                                  flex items-center gap-5 p-3.5 rounded-[0.75rem] transition-all group relative w-full
                                  ${isActive
                      ? (isDark ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'bg-slate-900 text-white shadow-xl')
                      : (isDark ? 'text-white/40 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900')}
                              `}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                  <span className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-opacity duration-300 ${!isOpen && 'lg:opacity-0 pointer-events-none'}`}>
                    {item.label}
                  </span>
                  {item.id === 'inbox' && (
                    <div className={`w-1.5 h-1.5 rounded-full bg-indigo-500 absolute right-4 ${!isOpen && 'hidden'}`}></div>
                  )}
                </button>
              );
            })}

            <div className={`px-4 mt-8 mb-2 text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-40 ${!isOpen && 'hidden'} ${isDark ? 'text-white' : 'text-slate-900'}`}>Apps</div>
            {APP_APPS.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id as ViewType);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`
                                  flex items-center gap-5 p-3.5 rounded-[0.75rem] transition-all group relative w-full
                                  ${isActive
                      ? (isDark ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'bg-slate-900 text-white shadow-xl')
                      : (isDark ? 'text-white/40 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900')}
                               `}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                  <span className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-opacity duration-300 ${!isOpen && 'lg:opacity-0 pointer-events-none'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className={`
                           flex items-center gap-5 p-3.5 rounded-[0.75rem] transition-all group relative w-full mt-4
                           ${isDark ? 'text-white/40 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'}
                       `}
            >
              <Settings size={18} strokeWidth={2} className="shrink-0" />
              <span className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-opacity duration-300 ${!isOpen && 'lg:opacity-0 pointer-events-none'}`}>
                Settings
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`
                           flex items-center gap-5 p-3.5 rounded-[0.75rem] transition-all group relative w-full
                           ${isDark ? 'text-white/40 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'}
                       `}
            >
              {isDark ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
              <span className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-opacity duration-300 ${!isOpen && 'lg:opacity-0 pointer-events-none'}`}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className={`
                             flex items-center gap-5 p-3.5 rounded-[0.75rem] transition-all group relative w-full
                             ${isDark ? 'text-red-400/70 hover:bg-red-500/10 hover:text-red-400' : 'text-red-500/70 hover:bg-red-50 hover:text-red-600'}
                         `}
              >
                <LogOut size={18} strokeWidth={2} className="shrink-0" />
                <span className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-opacity duration-300 ${!isOpen && 'lg:opacity-0 pointer-events-none'}`}>
                  Logout
                </span>
              </button>
            )}
          </div>

          {/* Compose Button */}
          <div className={`mt-4 mb-4 px-4 ${!isOpen && 'lg:items-center'}`}>
            <button
              data-testid="compose-button"
              onClick={() => {
                onCompose();
                if (window.innerWidth < 1024) onToggle();
              }}
              className={`w-full h-12 flex items-center justify-center gap-3 rounded-[0.75rem] border transition-all group
                        ${isDark ? 'border-white/10 text-white hover:bg-white/10' : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-white shadow-sm'}
                      `}
            >
              <Plus size={20} strokeWidth={2.5} />
              <span className={`text-[0.7rem] font-black uppercase tracking-[0.2em] transition-opacity duration-300 ${!isOpen ? 'lg:hidden' : ''}`}>Compose</span>
            </button>
          </div>

          {/* Genesis Protocol Button */}
          <div className={`mt-auto pb-8 flex flex-col px-4 ${!isOpen && 'lg:items-center'}`}>
            <button
              onClick={onGenesis}
              className={`
                        w-full py-5 px-5 rounded-[1rem] border transition-all group flex items-center gap-4
                        ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-[#0F172A] text-white border-slate-900 shadow-xl shadow-slate-900/30 hover:bg-black hover:scale-[1.02]'}
                      `}
            >
              <div className={`w-1 h-8 rounded-full ${isDark ? 'bg-indigo-500' : 'bg-white'}`}></div>
              <div className={`flex flex-col items-start ${!isOpen && 'hidden'}`}>
                <span className="text-base font-sans font-bold tracking-tight uppercase leading-none mb-1 text-white">
                  I.AM
                </span>
                <span className="text-[0.6rem] font-mono font-medium uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
                  Genesis Protocol
                </span>
              </div>
              {!isOpen && <Database size={16} className="ml-1 text-white" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;