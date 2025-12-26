import React, { useState, useMemo } from 'react';
import { Email, ViewType, ViewState, ThemeMode } from './types';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import Composer from './components/Composer';
import SettingsModal from './components/SettingsModal';
import AICommandBar from './components/AICommandBar';
import AuthPage from './components/AuthPage';
import CalendarView from './components/CalendarView';
import ContactsView from './components/ContactsView';

const THREAD_HISTORY: Email[] = [
    {
        id: '1',
        senderName: 'TOTL Newsletter',
        senderEmail: 'arch@totl.com',
        subject: 'Architecture Season Update',
        preview: 'Our latest research into autonomous building systems is now live...',
        body: `<p>Dear Team,</p><p>Handshake confirmed. We have received the architectural guidelines for the next development sprint regarding the <strong>I AM BUSINESS</strong> core expansion.</p><p>The neural engine is currently running pre-flight optimizations on the localized nodes (RZ-7, RZ-8). Once the diagnostic loops are finalized, the automated mapping sequence will initiate.</p>`,
        time: '14:20',
        read: false,
        type: 'focus',
        attachments: [{ id: 'a1', name: 'Blueprint_v4_Final.pdf', size: '2.4 MB', type: 'pdf' }]
    },
    {
        id: '2',
        senderName: 'Nova Logistics',
        senderEmail: 'dispatch@nova.io',
        subject: 'Invoice INV-992 Dispatch',
        preview: 'The secure packet for the Q4 hardware deployment has been...',
        body: `<p>Logistics update received. Invoice for the secure packet is ready.</p>`,
        time: '11:05',
        read: true,
        type: 'focus'
    }
];

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState | 'AUTH'>('AUTH');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('inbox');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const selectedEmail = THREAD_HISTORY.find(e => e.id === selectedEmailId) || null;
  const isDark = themeMode === 'dark';

  const themeStyles = useMemo(() => {
    if (isDark) {
      return {
        bgColor: '#0A0A0B',
        dotColor: '#1F2937',
        labelColor: 'text-slate-500'
      };
    }
    return {
      bgColor: '#E5E5E5',
      dotColor: '#CCCCCC',
      labelColor: 'text-slate-500'
    };
  }, [isDark]);

  if (viewState === 'AUTH') {
    return <AuthPage onLoginSuccess={() => setViewState(ViewState.DASHBOARD)} />;
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView isDark={isDark} />;
      case 'contacts':
        return <ContactsView isDark={isDark} onCompose={() => setIsComposerOpen(true)} />;
      default:
        return (
          <div className="flex flex-1 gap-8 overflow-hidden h-full">
            <div className="w-full lg:w-[420px] flex flex-col h-full overflow-hidden">
              <EmailList 
                emails={THREAD_HISTORY}
                selectedId={selectedEmailId}
                onSelect={setSelectedEmailId}
                title={currentView}
                isDark={isDark}
              />
            </div>
            <div className="hidden lg:flex flex-1 relative overflow-hidden">
                <EmailDetail email={selectedEmail} isDark={isDark} />
            </div>
          </div>
        );
    }
  };

  return (
    <div 
        className={`flex h-screen w-screen selection:bg-indigo-500/30 overflow-hidden relative font-sans transition-colors duration-500 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}
        style={{
            backgroundColor: themeStyles.bgColor,
            backgroundImage: `radial-gradient(${themeStyles.dotColor} 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
        }}
    >
      {/* Global Header */}
      <div className="absolute top-0 left-0 w-full h-20 px-10 flex justify-between items-center z-40 pointer-events-none">
             <div className="flex items-center gap-6 pointer-events-auto">
                 <div className={`${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'} w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xl`}>i.M</div>
                 <div className={`h-4 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`}></div>
                 <h2 className={`text-[0.6rem] font-black tracking-[0.4em] uppercase transition-colors ${themeStyles.labelColor}`}>System / {isDark ? 'Dark_Node' : 'Light_Draft'}</h2>
             </div>
             <div className="pointer-events-auto">
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className={`${isDark ? 'bg-white/10 text-white border-white/10 hover:bg-white/20' : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900'} px-6 py-3 rounded-2xl border shadow-sm text-[0.6rem] font-bold uppercase tracking-widest transition-all`}
                >
                    Settings_Key
                </button>
             </div>
      </div>

      <div className="flex flex-1 pt-28 px-10 pb-10 gap-10 overflow-hidden h-full">
          <Sidebar 
            currentView={currentView}
            onViewChange={setCurrentView}
            onCompose={() => setIsComposerOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isDark={isDark}
          />
          {renderMainContent()}
      </div>

      <AICommandBar isDark={isDark} onAction={(a) => console.log(a)} />

      <Composer isDark={isDark} isOpen={isComposerOpen} onClose={() => setIsComposerOpen(false)} />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        themeMode={themeMode}
        onThemeModeChange={setThemeMode}
      />
    </div>
  );
};

export default App;