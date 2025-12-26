import React, { useState, useEffect, useMemo } from 'react';
import { Email, ViewType, ViewState, ThemeMode, CalendarEvent, Contact } from './types';
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
import AuthWrapper from './components/auth';
import { AIProvider } from './context/AIContext';
import { ToastProvider } from './components/ui/ToastProvider';
import { Hub, HubContext, HubScreen } from './components/Hub';
import { Bot } from 'lucide-react';

const App: React.FC = () => {
  // =============================
  // Authentication State
  // =============================
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  });

  // =============================
  // V5 Design State
  // =============================
  const [viewState, setViewState] = useState<ViewState | 'AUTH' | 'ONBOARDING'>('AUTH');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('inbox');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Composer State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState<ComposerMode>('new');
  const [composerData, setComposerData] = useState<{ to?: string, subject?: string, body?: string, attachments?: any[] }>({});

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);
  const isDark = themeMode === 'dark';

  // =============================
  // Backend Connection State
  // =============================
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem('iam_email_connected') === 'true';
  });
  const API_URL = import.meta.env.VITE_API_URL || '';

  // =============================
  // Email State (From Backend)
  // =============================
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Calendar and Contacts
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // =============================
  // Theme Styles
  // =============================
  const themeStyles = useMemo(() => {
    if (isDark) {
      return { bgColor: '#0A0A0B', dotColor: '#1F2937' };
    }
    return { bgColor: '#E5E5E5', dotColor: '#CCCCCC' };
  }, [isDark]);

  // =============================
  // Load Theme from Storage
  // =============================
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme_mode') as ThemeMode;
    if (savedTheme) setThemeMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme_mode', themeMode);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode, isDark]);

  // =============================
  // Check Auth & Email Accounts
  // =============================
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      setViewState(ViewState.DASHBOARD);
    }
  }, []);

  useEffect(() => {
    const checkEmailAccounts = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/api/accounts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const accounts = await response.json();
          if (accounts && accounts.length > 0) {
            setIsConnected(true);
            localStorage.setItem('iam_email_connected', 'true');
          }
        }
      } catch (error) {
        console.error('Failed to check email accounts:', error);
      }
    };

    checkEmailAccounts();
  }, [API_URL, isAuthenticated]);

  // =============================
  // Fetch Emails from Backend
  // =============================
  useEffect(() => {
    const fetchEmails = async () => {
      if (!isConnected) {
        setEmails([]);
        return;
      }

      setIsLoading(true);
      setFetchError(null);

      try {
        const response = await fetch(`${API_URL}/api/imap/emails?limit=50`);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch emails');
        }

        const data = await response.json();

        const transformedEmails: Email[] = data.map((e: any) => ({
          id: e.id,
          senderName: e.sender || 'Unknown',
          senderEmail: e.senderEmail || '',
          subject: e.subject || '(No Subject)',
          preview: e.snippet || e.preview || '',
          body: e.body || '',
          time: formatEmailTime(e.timestamp),
          read: e.isRead || false,
          folder: 'inbox' as const,
          category: (e.category || 'focus') as 'focus' | 'other',
          urgencyScore: Math.floor(Math.random() * 100), // Simulate AI scoring
          attachments: e.hasAttachments ? [{ id: '1', name: 'attachment', size: '', type: 'other' as const }] : undefined
        }));

        setEmails(transformedEmails);
      } catch (error: any) {
        console.error('Failed to fetch emails:', error);
        setFetchError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
    const interval = setInterval(fetchEmails, 60000);
    return () => clearInterval(interval);
  }, [isConnected, API_URL]);

  // =============================
  // Fetch Contacts
  // =============================
  useEffect(() => {
    const fetchContacts = async () => {
      if (!isConnected) return;

      try {
        const userId = localStorage.getItem('iam_email_user') || 'default';
        const response = await fetch(`${API_URL}/api/contacts?userId=${encodeURIComponent(userId)}`);

        if (response.ok) {
          const data = await response.json();
          const formattedContacts: Contact[] = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            role: c.role || '',
            company: c.company || '',
            avatar: c.avatar,
            lastContacted: c.lastContacted ? formatRelativeTime(c.lastContacted) : 'Never',
            relationshipScore: c.relationshipScore || 50,
            aiNotes: c.aiNotes || ''
          }));
          setContacts(formattedContacts);
        }
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      }
    };

    fetchContacts();
  }, [isConnected, API_URL]);

  // =============================
  // Fetch Calendar Events
  // =============================
  useEffect(() => {
    const fetchEvents = async () => {
      if (!isConnected) return;

      try {
        const userId = localStorage.getItem('iam_email_user') || 'default';
        const response = await fetch(`${API_URL}/api/calendar/events?userId=${encodeURIComponent(userId)}`);

        if (response.ok) {
          const data = await response.json();
          setCalendarEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, [isConnected, API_URL]);

  // =============================
  // Helper Functions
  // =============================
  const formatRelativeTime = (dateInput: any): string => {
    if (!dateInput) return 'Never';
    const date = dateInput._seconds ? new Date(dateInput._seconds * 1000) : new Date(dateInput);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatEmailTime = (timestamp: string): string => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // =============================
  // Composer Handlers
  // =============================
  const selectedEmail = emails.find(e => e.id === selectedEmailId) || null;

  const handleOpenComposer = (mode: ComposerMode = 'new', data: any = {}) => {
    setComposerMode(mode);
    setComposerData(data);
    setIsComposerOpen(true);
  };

  const handleReply = (email: Email) => {
    handleOpenComposer('reply', {
      to: email.senderEmail,
      subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
      body: `\n\n\n--- Original Message ---\nFrom: ${email.senderName} <${email.senderEmail}>\nSent: ${email.time}\nSubject: ${email.subject}\n\n${email.body.replace(/<[^>]*>?/gm, '')}`
    });
  };

  const handleForward = (email: Email) => {
    handleOpenComposer('forward', {
      subject: email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`,
      body: `\n\n\n--- Forwarded Message ---\nFrom: ${email.senderName} <${email.senderEmail}>\nSent: ${email.time}\nSubject: ${email.subject}\n\n${email.body.replace(/<[^>]*>?/gm, '')}`,
      attachments: email.attachments
    });
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setViewState(ViewState.DASHBOARD);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('iam_email_connected');
    localStorage.removeItem('iam_email_user');
    setIsAuthenticated(false);
    setIsConnected(false);
    setViewState('AUTH');
    setEmails([]);
  };

  // =============================
  // Auth Screen
  // =============================
  if (!isAuthenticated || viewState === 'AUTH') {
    return <AuthPage onLoginSuccess={handleAuthenticated} />;
  }

  if (viewState === 'ONBOARDING') {
    return <OnboardingFlow onComplete={() => setViewState(ViewState.DASHBOARD)} onClose={() => setViewState(ViewState.DASHBOARD)} />;
  }

  // =============================
  // Main Content Renderer
  // =============================
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
        return (
          <div className="flex flex-1 gap-0 lg:gap-8 overflow-hidden h-full relative">
            {/* Email List */}
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

            {/* Email Detail */}
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

  // =============================
  // Main Render
  // =============================
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
          onLogout={handleLogout}
          onAddAccount={() => setViewState('ONBOARDING')}
          isConnected={isConnected}
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

      {/* @Hub AI Assistant */}
      <Hub
        isOpen={isHubOpen}
        onClose={() => setIsHubOpen(false)}
        isDark={isDark}
        context={{
          currentScreen: (selectedEmailId ? 'email-detail' : currentView) as HubScreen,
          selectedEmailId: selectedEmailId || undefined,
          selectedEmail: selectedEmail ? {
            id: selectedEmail.id,
            subject: selectedEmail.subject,
            sender: selectedEmail.senderName,
            senderEmail: selectedEmail.senderEmail,
            body: selectedEmail.body
          } : undefined,
        }}
        onComposeEmail={(data) => {
          handleOpenComposer('new', data);
          setIsHubOpen(false);
        }}
        onReplyEmail={(data) => {
          if (selectedEmail) {
            handleOpenComposer('reply', {
              to: selectedEmail.senderEmail,
              subject: selectedEmail.subject.startsWith('Re:') ? selectedEmail.subject : `Re: ${selectedEmail.subject}`,
              body: data.body
            });
          }
          setIsHubOpen(false);
        }}
        onForwardEmail={(data) => {
          if (selectedEmail) {
            handleOpenComposer('forward', {
              to: data.to,
              subject: selectedEmail.subject.startsWith('Fwd:') ? selectedEmail.subject : `Fwd: ${selectedEmail.subject}`,
              body: data.body || `\n\n--- Forwarded ---\nFrom: ${selectedEmail.senderName}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body.replace(/<[^>]*>?/gm, '')}`
            });
          }
          setIsHubOpen(false);
        }}
        onSummarizeEmail={() => {
          // Trigger summarize in EmailDetail (if we had a ref or callback)
          // For now, we'll just show a toast or console log
          console.log('Summarize requested for email:', selectedEmail?.id);
          setIsHubOpen(false);
        }}
        onArchiveEmail={() => {
          if (selectedEmail) {
            // Remove from emails list (archive)
            setEmails(prev => prev.filter(e => e.id !== selectedEmail.id));
            setSelectedEmailId(null);
          }
          setIsHubOpen(false);
        }}
        onOpenSettings={() => {
          setIsSettingsOpen(true);
          setIsHubOpen(false);
        }}
        onThemeToggle={() => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')}
      />

      {/* Hub FAB Button */}
      {!isHubOpen && (
        <button
          onClick={() => setIsHubOpen(true)}
          className={`
            fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full shadow-2xl
            flex items-center justify-center transition-all duration-300
            hover:scale-110 active:scale-95 group
            ${isDark
              ? 'bg-indigo-600 text-white shadow-indigo-500/30 hover:bg-indigo-500'
              : 'bg-slate-900 text-white shadow-slate-900/30 hover:bg-black'
            }
          `}
          title="Open @hub AI Assistant"
        >
          <Bot size={24} className="group-hover:rotate-12 transition-transform" />

          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full animate-ping bg-indigo-500/30 opacity-75"></span>
        </button>
      )}
    </div>
  );
};

export default function AppWrapper() {
  return (
    <AIProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AIProvider>
  );
}
