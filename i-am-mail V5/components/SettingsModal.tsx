import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, UserCircle, Users, Bell, Palette, ChevronLeft, Shield, FileSignature, Sun, Moon, Sparkles, Menu,
  Layout, Mail, Calendar as CalendarIcon, Server, Plus, Trash2, Globe, Clock, Smartphone, HardDrive, Key, Check,
  RefreshCw, Edit2, AlertCircle, Save, Lock, ArrowRight, Database
} from 'lucide-react';
import { ThemeMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
}

type SettingsCategory = 'general' | 'mail' | 'accounts' | 'calendar' | 'advanced';

interface AccountData {
    id: string;
    email: string;
    provider: string;
    isDefault: boolean;
    lastSync: string;
    quota: number;
    status: 'active' | 'error' | 'syncing';
    avatarColor?: string;
    // Config
    imapHost?: string;
    imapPort?: string;
    smtpHost?: string;
    smtpPort?: string;
    syncFreq?: string;
    encryption?: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, themeMode, onThemeModeChange }) => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general');
  const isDark = themeMode === 'dark';

  // --- Account Management State ---
  const [accounts, setAccounts] = useState<AccountData[]>([
      { id: '1', email: 'me@rayzen.ae', provider: 'Custom IMAP', isDefault: true, lastSync: '2 mins ago', quota: 45, status: 'active', avatarColor: 'bg-indigo-500', imapHost: 'imap.rayzen.ae', imapPort: '993', smtpHost: 'smtp.rayzen.ae', smtpPort: '587' },
      { id: '2', email: 'personal@gmail.com', provider: 'Gmail', isDefault: false, lastSync: '1 hour ago', quota: 78, status: 'active', avatarColor: 'bg-emerald-500', imapHost: 'imap.gmail.com', imapPort: '993', smtpHost: 'smtp.gmail.com', smtpPort: '587' }
  ]);
  
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingAccount, setEditingAccount] = useState<Partial<AccountData>>({});
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [archiveBeforeDelete, setArchiveBeforeDelete] = useState(true);

  // --- Helpers ---
  
  const handleEdit = (account: AccountData) => {
      setEditingAccount({ ...account });
      setViewMode('form');
      setTestStatus('idle');
  };

  const handleAdd = () => {
      setEditingAccount({ 
          id: `new_${Date.now()}`, 
          provider: 'Gmail', 
          email: '', 
          isDefault: false, 
          status: 'active',
          quota: 0,
          lastSync: 'Never',
          imapHost: 'imap.gmail.com', imapPort: '993',
          smtpHost: 'smtp.gmail.com', smtpPort: '587',
          syncFreq: '15m',
          encryption: true
      });
      setViewMode('form');
      setTestStatus('idle');
  };

  const handleProviderChange = (provider: string) => {
      let defaults = {};
      switch(provider) {
          case 'Gmail': defaults = { imapHost: 'imap.gmail.com', smtpHost: 'smtp.gmail.com' }; break;
          case 'Outlook': defaults = { imapHost: 'outlook.office365.com', smtpHost: 'smtp.office365.com' }; break;
          case 'iCloud': defaults = { imapHost: 'imap.mail.me.com', smtpHost: 'smtp.mail.me.com' }; break;
          case 'Zoho': defaults = { imapHost: 'imap.zoho.com', smtpHost: 'smtp.zoho.com' }; break;
          case 'Titan': defaults = { imapHost: 'imap.titan.email', smtpHost: 'smtp.titan.email' }; break;
          default: defaults = { imapHost: '', smtpHost: '' }; break;
      }
      setEditingAccount(prev => ({ ...prev, provider, ...defaults }));
  };

  const handleTestConnection = () => {
      setTestStatus('testing');
      setTimeout(() => {
          // Simulate simple validation
          if (editingAccount.email && editingAccount.imapHost) {
              setTestStatus('success');
          } else {
              setTestStatus('error');
          }
      }, 1500);
  };

  const handleSaveAccount = () => {
      if (testStatus !== 'success') {
          // Optional: force test before save
      }
      setAccounts(prev => {
          const exists = prev.find(a => a.id === editingAccount.id);
          if (exists) {
              return prev.map(a => a.id === editingAccount.id ? { ...a, ...editingAccount } as AccountData : a);
          }
          return [...prev, { ...editingAccount, avatarColor: 'bg-slate-500' } as AccountData];
      });
      setViewMode('list');
  };

  const handleDeleteAccount = () => {
      if (deleteConfirmId) {
          setAccounts(prev => prev.filter(a => a.id !== deleteConfirmId));
          setDeleteConfirmId(null);
      }
  };

  // --- Renderers ---

  if (!isOpen) return null;

  const renderSidebarItem = (id: SettingsCategory, label: string, Icon: any) => (
    <button
      onClick={() => { setActiveCategory(id); setViewMode('list'); }}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[0.7rem] font-black uppercase tracking-widest transition-all mb-2
        ${activeCategory === id 
            ? (isDark ? 'bg-white/10 text-white shadow-lg' : 'bg-slate-900 text-white shadow-md') 
            : (isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')}
      `}
    >
      <Icon size={18} strokeWidth={2} className={activeCategory === id ? 'opacity-100' : 'opacity-70'} />
      <span>{label}</span>
    </button>
  );

  const SectionTitle = ({ title }: { title: string }) => (
      <h3 className={`text-[0.65rem] uppercase tracking-widest font-black mb-6 mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{title}</h3>
  );

  const Toggle = ({ label, enabled = false, onChange }: { label: string, enabled?: boolean, onChange?: () => void }) => (
      <div className="flex items-center justify-between py-3 cursor-pointer" onClick={onChange}>
          <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
          <button className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? (isDark ? 'bg-indigo-500' : 'bg-slate-900') : (isDark ? 'bg-white/10' : 'bg-slate-200')}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-7' : 'left-1'}`}></div>
          </button>
      </div>
  );

  const InputField = ({ label, placeholder, type = "text", value, onChange }: { label: string, placeholder?: string, type?: string, value?: string, onChange?: (val: string) => void }) => (
      <div className="space-y-2">
          <label className={`text-[0.6rem] uppercase tracking-wider font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</label>
          <input 
            type={type} 
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full p-3 rounded-xl border bg-transparent text-sm focus:outline-none transition-all
                ${isDark ? 'border-white/10 text-white focus:border-white/30 placeholder:text-slate-600' : 'border-slate-200 text-slate-900 focus:border-slate-400 placeholder:text-slate-300'}
            `}
          />
      </div>
  );

  return (
    <div className="fixed inset-0 z-[110] flex flex-col h-full w-full overflow-hidden">
      {/* Background with Dotted Pattern */}
      <div 
        className="absolute inset-0 z-0"
        style={{
            backgroundColor: isDark ? '#0A0A0B' : '#E5E5E5',
            backgroundImage: `radial-gradient(${isDark ? '#1F2937' : '#CCCCCC'} 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
        }}
      ></div>

      {/* Header */}
      <div className="relative z-20 px-6 py-8 flex items-center gap-6 shrink-0 bg-transparent">
          <button 
              onClick={onClose}
              className={`flex items-center gap-4 transition-all active:opacity-60 bg-transparent ${isDark ? 'text-white' : 'text-[#2D3748]'}`}
          >
              <div className={`w-[2px] h-8 ${isDark ? 'bg-slate-600' : 'bg-slate-400'} rounded-full`}></div>
              <X size={24} strokeWidth={2.5} />
          </button>
          <div className={`text-[0.75rem] font-black uppercase tracking-[0.6em] flex-1 flex justify-between items-center ${isDark ? 'text-slate-500' : 'text-[#4A5568]'}`}>
              <span>SETTINGS</span>
              <span className="opacity-40 font-mono text-[0.55rem] hidden sm:block">SYS_CONFIG_V2</span>
          </div>
      </div>
      
      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row p-4 lg:p-10 gap-6 overflow-hidden">
        
        {/* Sidebar */}
        <div className={`w-full lg:w-72 rounded-[2rem] border p-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto shrink-0 backdrop-blur-3xl ${isDark ? 'bg-[#121214]/40 border-white/5' : 'bg-white/30 border-white'}`}>
            <div className="hidden lg:block p-6 mb-4">
                <div className={`text-[0.6rem] uppercase tracking-[0.5em] font-black ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Modules</div>
            </div>
            {renderSidebarItem('general', 'General', Palette)}
            {renderSidebarItem('mail', 'Mail', Mail)}
            {renderSidebarItem('accounts', 'Accounts', Users)}
            {renderSidebarItem('calendar', 'Calendar', CalendarIcon)}
            {renderSidebarItem('advanced', 'Advanced', Server)}
        </div>

        {/* Content Card */}
        <div className={`flex-1 rounded-[2.5rem] border shadow-2xl overflow-y-auto custom-scrollbar flex flex-col backdrop-blur-3xl ${isDark ? 'bg-[#121214]/40 border-white/5 shadow-black/40' : 'bg-white/30 border-white shadow-slate-900/10'}`}>
            <div className="p-8 lg:p-12 max-w-4xl mx-auto w-full">
                
                {/* --- ACCOUNTS CATEGORY --- */}
                {activeCategory === 'accounts' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                        
                        {/* LIST VIEW */}
                        {viewMode === 'list' && !deleteConfirmId && (
                            <div className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <SectionTitle title="Connected Accounts" />
                                    <button 
                                        onClick={handleAdd}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all
                                            ${isDark ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-black'}
                                        `}
                                    >
                                        <Plus size={14} strokeWidth={3} /> Add Account
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {accounts.map(acc => (
                                        <div key={acc.id} className={`p-6 rounded-2xl border flex items-center justify-between group transition-all ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white/40 border-slate-200 hover:shadow-md'}`}>
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${acc.avatarColor || 'bg-slate-500'}`}>
                                                        <Mail size={20} />
                                                    </div>
                                                    {acc.status === 'active' && <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#121214]"></div>}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{acc.email}</div>
                                                        {acc.isDefault && (
                                                            <span className={`text-[0.5rem] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>Default</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{acc.provider}</div>
                                                        <div className={`text-[0.6rem] uppercase tracking-wider font-bold opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sync: {acc.lastSync}</div>
                                                    </div>
                                                    {/* Quota Bar */}
                                                    <div className="mt-3 w-32 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500" style={{ width: `${acc.quota}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleEdit(acc)}
                                                    className={`p-3 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                                                    title="Edit Settings"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => setDeleteConfirmId(acc.id)}
                                                    className={`p-3 rounded-xl transition-colors text-slate-400 hover:text-red-500 hover:bg-red-500/10`}
                                                    title="Remove Account"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center mt-8">
                                    <p className={`text-[0.65rem] uppercase tracking-widest opacity-40 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Max 5 Connected Accounts • End-to-End Encrypted
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* DELETE CONFIRMATION */}
                        {deleteConfirmId && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in-95">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                                    <AlertCircle size={32} />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Remove Account?</h3>
                                    <p className={`text-sm max-w-xs mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Are you sure you want to disconnect this account? Local data will be wiped from this device.
                                    </p>
                                </div>
                                
                                <div className={`flex items-center gap-3 p-4 rounded-xl border mb-4 text-left w-full max-w-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-slate-200'}`}>
                                    <Database size={18} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                                    <div className="flex-1">
                                        <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Archive Data First</div>
                                        <div className="text-[0.6rem] opacity-60">Save a local copy before deleting</div>
                                    </div>
                                    <Toggle label="" enabled={archiveBeforeDelete} onChange={() => setArchiveBeforeDelete(!archiveBeforeDelete)} />
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setDeleteConfirmId(null)}
                                        className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleDeleteAccount}
                                        className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
                                    >
                                        Confirm Remove
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ADD / EDIT FORM */}
                        {viewMode === 'form' && (
                            <div className="space-y-8 h-full flex flex-col">
                                <div className="flex items-center gap-4 mb-2">
                                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-900'}`}>
                                        <ChevronLeft size={24} />
                                    </button>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {editingAccount.id?.startsWith('new') ? 'Add New Account' : 'Edit Account'}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar pr-2 pb-4">
                                    {/* Left Column: Credentials */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className={`text-[0.6rem] uppercase tracking-wider font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Email Provider</label>
                                            <div className="relative">
                                                <select 
                                                    value={editingAccount.provider}
                                                    onChange={(e) => handleProviderChange(e.target.value)}
                                                    className={`w-full p-3 rounded-xl border bg-transparent text-sm focus:outline-none appearance-none cursor-pointer relative z-10
                                                        ${isDark ? 'border-white/10 text-white bg-[#1A1A1C]' : 'border-slate-200 text-slate-900 bg-white'}
                                                    `}
                                                >
                                                    <option>Gmail</option>
                                                    <option>Outlook</option>
                                                    <option>iCloud</option>
                                                    <option>Titan</option>
                                                    <option>Zoho</option>
                                                    <option>Custom IMAP</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <InputField 
                                            label="Email Address" 
                                            placeholder="name@company.com" 
                                            value={editingAccount.email} 
                                            onChange={(val) => setEditingAccount(prev => ({...prev, email: val}))}
                                        />
                                        <InputField 
                                            label="Password / App Password" 
                                            type="password" 
                                            placeholder="••••••••" 
                                        />
                                        
                                        <div className={`p-4 rounded-xl border mt-6 ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                                            <h4 className={`text-xs font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-indigo-300' : 'text-indigo-800'}`}>
                                                <Shield size={14} /> Sync & Security
                                            </h4>
                                            <div className="space-y-1">
                                                <Toggle 
                                                    label="High-Frequency Sync (Push)" 
                                                    enabled={editingAccount.syncFreq === 'push'} 
                                                    onChange={() => setEditingAccount(prev => ({...prev, syncFreq: prev.syncFreq === 'push' ? '15m' : 'push'}))}
                                                />
                                                <div className={`h-px w-full opacity-10 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                                                <Toggle 
                                                    label="Local Encryption (AES-256)" 
                                                    enabled={editingAccount.encryption} 
                                                    onChange={() => setEditingAccount(prev => ({...prev, encryption: !prev.encryption}))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Right Column: Server Settings */}
                                    <div className={`p-6 rounded-2xl border flex flex-col h-full ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/40 border-slate-200'}`}>
                                        <SectionTitle title="Advanced Server Configuration" />
                                        
                                        <div className="space-y-4 mb-8 flex-1">
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="col-span-2"><InputField label="IMAP Host" placeholder="imap.server.com" value={editingAccount.imapHost} onChange={(v) => setEditingAccount(p => ({...p, imapHost: v}))} /></div>
                                                <div className="col-span-1"><InputField label="Port" placeholder="993" value={editingAccount.imapPort} onChange={(v) => setEditingAccount(p => ({...p, imapPort: v}))} /></div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="col-span-2"><InputField label="SMTP Host" placeholder="smtp.server.com" value={editingAccount.smtpHost} onChange={(v) => setEditingAccount(p => ({...p, smtpHost: v}))} /></div>
                                                <div className="col-span-1"><InputField label="Port" placeholder="587" value={editingAccount.smtpPort} onChange={(v) => setEditingAccount(p => ({...p, smtpPort: v}))} /></div>
                                            </div>
                                        </div>

                                        {/* Test Connection Area */}
                                        <div className="pt-4 border-t border-dashed border-white/10">
                                            <button 
                                                onClick={handleTestConnection}
                                                disabled={testStatus === 'testing' || testStatus === 'success'}
                                                className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all
                                                    ${testStatus === 'success' 
                                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                                        : testStatus === 'error'
                                                            ? 'bg-red-500 text-white'
                                                            : (isDark ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-900 text-white hover:bg-black')
                                                    }
                                                `}
                                            >
                                                {testStatus === 'testing' ? (
                                                    <RefreshCw size={16} className="animate-spin" />
                                                ) : testStatus === 'success' ? (
                                                    <Check size={16} strokeWidth={3} />
                                                ) : testStatus === 'error' ? (
                                                    <AlertCircle size={16} />
                                                ) : (
                                                    <Server size={16} />
                                                )}
                                                
                                                {testStatus === 'testing' ? 'Verifying Handshake...' : 
                                                 testStatus === 'success' ? 'Connection Secured' : 
                                                 testStatus === 'error' ? 'Connection Failed - Retry' : 'Test Connection'}
                                            </button>

                                            {testStatus === 'success' && (
                                                <button 
                                                    onClick={handleSaveAccount}
                                                    className="w-full mt-3 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 bg-[#121214] text-white border border-white/20 hover:bg-black"
                                                >
                                                    <Save size={16} /> Save Account Config
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- GENERAL SETTINGS --- */}
                {activeCategory === 'general' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                             <SectionTitle title="Appearance & Experience" />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <button
                                    onClick={() => onThemeModeChange('light')}
                                    className={`p-6 rounded-[1.5rem] border-2 text-left transition-all duration-300 ${themeMode === 'light' ? 'border-slate-900 bg-white shadow-xl' : 'border-transparent bg-slate-50/50 hover:bg-white'}`}
                                >
                                    <Sun size={24} className="mb-4 text-slate-900" />
                                    <div className="font-black text-xs text-slate-900 uppercase tracking-widest">Light Mode</div>
                                </button>
                                <button
                                    onClick={() => onThemeModeChange('dark')}
                                    className={`p-6 rounded-[1.5rem] border-2 text-left transition-all duration-300 ${themeMode === 'dark' ? 'border-indigo-500 bg-slate-900 shadow-xl' : 'border-transparent bg-slate-900/40 hover:bg-slate-900'}`}
                                >
                                    <Moon size={24} className="mb-4 text-white" />
                                    <div className="font-black text-xs text-white uppercase tracking-widest">Dark Mode</div>
                                </button>
                             </div>
                             <div className="space-y-4">
                                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/40 border-slate-100'}`}>
                                    <Toggle label="Compact Density" />
                                    <div className={`h-px w-full my-2 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                                    <Toggle label="Show Reading Pane on Bottom" />
                                </div>
                             </div>
                        </div>

                        <div>
                            <SectionTitle title="Regional & Startup" />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <InputField label="Language" value="English (US)" />
                                 <InputField label="Time Zone" value="(UTC+04:00) Abu Dhabi, Muscat" />
                             </div>
                             <div className="mt-6">
                                 <Toggle label="Open to Inbox on Startup" enabled={true} />
                             </div>
                        </div>
                    </div>
                )}

                {/* --- MAIL SETTINGS --- */}
                {activeCategory === 'mail' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <SectionTitle title="Composing & Layout" />
                            <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/40 border-slate-100'}`}>
                                <Toggle label="Focused Inbox" enabled={true} />
                                <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                                <Toggle label="Message Preview (2 Lines)" enabled={true} />
                                <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                                <Toggle label="Show Avatars" enabled={true} />
                            </div>
                        </div>

                        <div>
                            <SectionTitle title="Signatures" />
                            <div className="space-y-4">
                                <textarea 
                                    className={`w-full h-32 p-4 rounded-2xl border bg-transparent text-sm focus:outline-none resize-none
                                        ${isDark ? 'border-white/10 text-white placeholder:text-slate-600' : 'border-slate-200 text-slate-900 placeholder:text-slate-400'}
                                    `}
                                    placeholder="Write your email signature here..."
                                    defaultValue="Best regards,\n\nArjun Rayzen\nChief Architect | I.AM Protocols"
                                />
                                <div className="flex gap-4">
                                    <button className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>Save Signature</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- CALENDAR SETTINGS --- */}
                {activeCategory === 'calendar' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                             <SectionTitle title="View Options" />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className={`text-[0.6rem] uppercase tracking-wider font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Default View</label>
                                    <select className={`w-full p-3 rounded-xl border bg-transparent text-sm focus:outline-none cursor-pointer
                                        ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'}
                                    `}>
                                        <option>Month</option>
                                        <option>Week</option>
                                        <option>Day</option>
                                        <option>Agenda</option>
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className={`text-[0.6rem] uppercase tracking-wider font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>First Day of Week</label>
                                    <select className={`w-full p-3 rounded-xl border bg-transparent text-sm focus:outline-none cursor-pointer
                                        ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'}
                                    `}>
                                        <option>Sunday</option>
                                        <option>Monday</option>
                                    </select>
                                 </div>
                             </div>
                        </div>
                    </div>
                )}

                {/* --- ADVANCED SETTINGS --- */}
                {activeCategory === 'advanced' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div>
                             <SectionTitle title="Notifications" />
                             <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/40 border-slate-100'}`}>
                                 <Toggle label="Desktop Notifications" enabled={true} />
                                 <Toggle label="Sound Effects (Haptic UI)" enabled={true} />
                                 <Toggle label="Badge Count on App Icon" enabled={true} />
                             </div>
                         </div>

                         <div>
                             <SectionTitle title="Storage & Quota" />
                             <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/40 border-slate-100'}`}>
                                 <div className="flex justify-between items-end mb-4">
                                     <div>
                                         <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>2.4 GB</div>
                                         <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>used of 15 GB</div>
                                     </div>
                                     <button className={`px-4 py-2 rounded-lg text-[0.6rem] font-bold uppercase tracking-widest border ${isDark ? 'border-white/10 text-white' : 'bg-white border-slate-200 text-slate-700'}`}>Manage</button>
                                 </div>
                                 <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                     <div className="h-full bg-indigo-500 w-[16%]"></div>
                                 </div>
                             </div>
                         </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;