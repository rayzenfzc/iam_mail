import React, { useState, useMemo } from 'react';
import { Email, ViewType, ViewState, ThemeMode } from './types';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import Composer, { ComposerMode } from './components/Composer';
import SettingsModal from './components/SettingsModal';
import AuthPage from './components/AuthPage';
import OnboardingFlow from './components/OnboardingFlow';
import CalendarView from './components/CalendarView';
import ContactsView from './components/ContactsView';
import SentView from './components/SentView';

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
        folder: 'inbox',
        category: 'focus',
        urgencyScore: 85,
        aiSmartReplies: ["Confirmed", "Reschedule sync", "Request details"],
        attachments: [{ id: 'a1', name: 'Blueprint_v4_Final.pdf', size: '2.4 MB', type: 'pdf' }],
        thread: [
          {
            id: '1-1',
            senderName: 'TOTL Newsletter',
            senderEmail: 'arch@totl.com',
            subject: 'Architecture Season Update',
            preview: 'Our latest research into autonomous building systems is now live...',
            body: `<p>Dear Team,</p><p>Handshake confirmed. We have received the architectural guidelines for the next development sprint regarding the <strong>I AM BUSINESS</strong> core expansion.</p><p>The neural engine is currently running pre-flight optimizations on the localized nodes (RZ-7, RZ-8). Once the diagnostic loops are finalized, the automated mapping sequence will initiate.</p>`,
            time: '14:20',
            read: false,
            folder: 'inbox',
            category: 'focus',
            urgencyScore: 85,
            attachments: [{ id: 'a1', name: 'Blueprint_v4_Final.pdf', size: '2.4 MB', type: 'pdf' }]
          },
          {
            id: '1-2',
            senderName: 'Me',
            senderEmail: 'me@rayzen.ae',
            subject: 'Re: Architecture Season Update',
            preview: 'Acknowledged. Will review the blueprint by EOD.',
            body: `<p>Hi Team,</p><p>Acknowledged. I will review the attached blueprint by EOD and share my feedback on the node calibration requirements.</p><p>Best,<br>Me</p>`,
            time: '15:10',
            read: true,
            folder: 'inbox',
            category: 'focus',
            urgencyScore: 10
          }
        ]
    },
    {
        id: '2',
        senderName: 'Nova Logistics',
        senderEmail: 'dispatch@nova.io',
        subject: 'Invoice INV-992 Dispatch',
        preview: 'The secure packet for the Q4 hardware deployment has been...',
        body: `<p>Logistics update received. Invoice for the secure packet is ready.</p><p>Please find the attached documentation for the Q4 hardware deployment. Ensure all protocols are followed as per the standard operating procedure.</p>`,
        time: '11:05',
        read: true,
        folder: 'inbox',
        category: 'other',
        urgencyScore: 45,
        aiSummary: "Invoice for Q4 hardware deployment attached."
    },
    {
        id: '3',
        senderName: 'Prism Tech',
        senderEmail: 'dev@prism.io',
        subject: 'Neural Node Calibration',
        preview: 'The calibration for the RZ-9 node is complete. Please verify...',
        body: `<p>Node calibration success. The RZ-9 node is now fully operational and synced with the main grid. We are seeing a 15% improvement in processing latency.</p>`,
        time: '09:45',
        read: true,
        folder: 'inbox',
        category: 'focus',
        urgencyScore: 92,
        aiSmartReplies: ["Great work", "Verify logs"]
    },
    {
        id: '4',
        senderName: 'Aura Security',
        senderEmail: 'sec@aura.net',
        subject: 'Protocol Update v4.3',
        preview: 'A new security patch has been deployed to the neural gate...',
        body: `<p>Security protocol v4.3 is now live. This update addresses potential vulnerabilities in the biometric handshake sequence and improves encryption throughput.</p>`,
        time: 'Yesterday',
        read: true,
        folder: 'archive',
        category: 'other',
        urgencyScore: 30
    },
    {
        id: '5',
        senderName: 'Elena Vance',
        senderEmail: 'elena@rayzen.ae',
        subject: 'Workspace Feedback',
        preview: 'I love the new floating design! It feels so much cleaner...',
        body: `<p>The new UI is a massive step forward. The floating cards and the simplified navigation really help with focus. Great work on the I.AM branding!</p>`,
        time: 'Yesterday',
        read: true,
        folder: 'inbox',
        category: 'other',
        urgencyScore: 20
    }
];

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState | 'AUTH' | 'ONBOARDING'>('AUTH');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('inbox');
  
  // Composer State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState<ComposerMode>('new');
  const [composerData, setComposerData] = useState<{to?: string, subject?: string, body?: string, attachments?: any[]}>({});

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Simulated "Backend" State
  const [emails, setEmails] = useState<Email[]>(THREAD_HISTORY);

  const selectedEmail = emails.find(e => e.id === selectedEmailId) || null;
  const isDark = themeMode === 'dark';

  const themeStyles = useMemo(() => {
    if (isDark) {
      return {
        bgColor: '#0A0A0B',
        dotColor: '#1F2937'
      };
    }
    return {
      bgColor: '#E5E5E5',
      dotColor: '#CCCCCC'
    };
  }, [isDark]);

  const handleOpenComposer = (mode: ComposerMode = 'new', data: any = {}) => {
      setComposerMode(mode);
      setComposerData(data);
      setIsComposerOpen(true);
  };

  const handleReply = (email: Email) => {
      handleOpenComposer('reply', {
          to: email.senderEmail,
          subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
          body: `\n\n\n--- Original Message ---\nFrom: ${email.senderName} <${email.senderEmail}>\nSent: ${email.time}\nSubject: ${email.subject}\n\n${email.body.replace(/<[^>]*>?/gm, '')}` // Simple strip tags for quote
      });
  };

  const handleForward = (email: Email) => {
      handleOpenComposer('forward', {
          subject: email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`,
          body: `\n\n\n--- Forwarded Message ---\nFrom: ${email.senderName} <${email.senderEmail}>\nSent: ${email.time}\nSubject: ${email.subject}\n\n${email.body.replace(/<[^>]*>?/gm, '')}`,
          attachments: email.attachments
      });
  };

  if (viewState === 'AUTH') {
    return <AuthPage onLoginSuccess={() => setViewState(ViewState.DASHBOARD)} />;
  }

  if (viewState === 'ONBOARDING') {
      return <OnboardingFlow onComplete={() => setViewState(ViewState.DASHBOARD)} onClose={() => setViewState(ViewState.DASHBOARD)} />;
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView isDark={isDark} onOpenMenu={() => setIsSidebarOpen(true)} />;
      case 'contacts':
        return <ContactsView isDark={isDark} onCompose={() => handleOpenComposer('new')} onOpenMenu={() => setIsSidebarOpen(true)} />;
      case 'sent':
        return (
          <SentView 
            sentEmails={emails.filter(e => e.folder === 'sent')} 
            onComposeFollowUp={(to, subject) => handleOpenComposer('new', { to, subject })}
            isDark={isDark}
            onOpenMenu={() => setIsSidebarOpen(true)}
          />
        );
      default:
        // Inbox, Drafts, Archive, Junk, etc. reuse the main email list
        return (
          <div className="flex flex-1 gap-0 lg:gap-8 overflow-hidden h-full relative">
            {/* Email List - Hidden on mobile if email selected */}
            <div className={`
                w-full lg:w-[380px] flex flex-col h-full overflow-hidden transition-all duration-300
                ${selectedEmailId ? 'hidden lg:flex' : 'flex'}
            `}>
              <EmailList 
                emails={emails}
                selectedId={selectedEmailId}
                onSelect={(id) => {
                  setSelectedEmailId(id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                title={currentView}
                isDark={isDark}
                onOpenMenu={() => setIsSidebarOpen(true)}
                viewType={currentView}
              />
            </div>
            
            {/* Email Detail - Full width/height */}
            <div className={`
                flex-1 relative overflow-hidden h-full flex flex-col
                ${!selectedEmailId && 'hidden lg:flex'}
            `}>
                <EmailDetail 
                    email={selectedEmail} 
                    isDark={isDark} 
                    onClose={() => setSelectedEmailId(null)}
                    onReply={() => selectedEmail && handleReply(selectedEmail)}
                    onForward={() => selectedEmail && handleForward(selectedEmail)}
                />
            </div>
          </div>
        );
    }
  };

  return (
    <div 
        className={`flex h-screen w-screen selection:bg-slate-900/10 overflow-hidden relative font-sans transition-colors duration-500 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}
        style={{
            backgroundColor: themeStyles.bgColor,
            backgroundImage: `radial-gradient(${themeStyles.dotColor} 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
        }}
    >
      <div className="flex flex-1 gap-0 overflow-hidden h-full">
          <Sidebar 
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            currentView={currentView}
            onViewChange={setCurrentView}
            onCompose={() => handleOpenComposer('new')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isDark={isDark}
            toggleTheme={() => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')}
            onGenesis={() => setViewState('ONBOARDING')}
          />
          <div className="flex-1 flex flex-col p-0 lg:p-6 lg:pl-0 overflow-hidden relative">
            <div className="flex-1 h-full w-full">
               {renderMainContent()}
            </div>
          </div>
      </div>

      <Composer 
          isDark={isDark} 
          isOpen={isComposerOpen} 
          onClose={() => setIsComposerOpen(false)}
          mode={composerMode}
          initialData={composerData}
          onSend={(newMail) => {
              // Simulate Sending: Create new email object and add to "sent" folder
              const sentMail: Email = {
                  id: `sent-${Date.now()}`,
                  senderName: 'Me',
                  senderEmail: 'me@rayzen.ae',
                  subject: newMail.subject,
                  preview: newMail.body.substring(0, 50) + '...',
                  body: `<p>${newMail.body}</p>`,
                  time: 'Just now',
                  read: true,
                  folder: 'sent',
                  category: 'other',
                  urgencyScore: 0,
                  tracking: newMail.tracking ? { isEnabled: true, status: 'pending' } : undefined
              };
              setEmails(prev => [sentMail, ...prev]);
          }} 
      />
      
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