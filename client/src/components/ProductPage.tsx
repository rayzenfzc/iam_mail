import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ModuleViews } from './ModuleViews';
import { CalendarMonthView } from './CalendarDayCard';
import { motion, AnimatePresence } from 'motion/react';
import { toast, Toaster } from 'sonner@2.0.3';

// --- AI CONFIG ---
const getAI = () => {
  try {
    return new GoogleGenAI({ apiKey: 'demo-key' });
  } catch {
    return null;
  }
};

// --- MOCK DATA ---
const MOCK_ACCOUNTS = [
  { id: 1, label: 'Dubai Office', initials: 'DB', active: true },
  { id: 2, label: 'London HQ', initials: 'LD', active: false }
];

const MOCK_INBOX = [
  { id: 1, sender: 'Sloane Vanderbilt', subject: 'Q4 Strategic Resource Allocation', time: '14:02 PM', status: 'URGENT', body: "The quarterly review is attached. Please review the preliminary figures for the board meeting on Friday. We noticed a discrepancy in sector 7 allocations.", avatar: 'S', hasAttachment: true },
  { id: 2, sender: 'Julian Sterling', subject: 'Dubai Region Quarterly Targets', time: '09:15 AM', status: 'UNREAD', body: "The targets for the upcoming quarter have been finalized. Please coordinate with the local teams.", avatar: 'J', hasAttachment: false },
  { id: 3, sender: 'Amara Khan', subject: 'Capacity Warning: Server 7', time: 'Yesterday', status: 'READ', body: "Storage capacity has reached 85%. Automated cleanup protocols will initiate at 80%.", avatar: 'A', hasAttachment: true },
  { id: 4, sender: 'HM Revenue', subject: 'Tax Compliance Audit Q3', time: '11:00 AM', status: 'URGENT', body: "Please find attached the notification for the upcoming Q3 audit.", avatar: 'H', hasAttachment: true },
  { id: 5, sender: 'Legal Dept', subject: 'GDPR Policy Updates', time: '08:30 AM', status: 'UNREAD', body: "New regulations regarding data retention have been passed.", avatar: 'L', hasAttachment: false }
];

const MOCK_DRAFTS = [
  { id: 101, sender: 'Draft', subject: 'Re: Partnership Proposal', time: '2 hours ago', body: 'Thank you for your interest in...', avatar: 'D' },
  { id: 102, sender: 'Draft', subject: 'Team Update - October', time: 'Yesterday', body: 'Hi team, following up on...', avatar: 'D' },
  { id: 103, sender: 'Draft', subject: 'Budget Review Notes', time: '3 days ago', body: 'Here are my notes from the budget meeting...', avatar: 'D' }
];

const MOCK_SENT = [
  { id: 201, sender: 'Me', recipient: 'Board Members', subject: 'Q3 Results Summary', time: '2 days ago', body: 'Please find attached the Q3 results...', avatar: 'M' },
  { id: 202, sender: 'Me', recipient: 'IT Department', subject: 'Security Protocol Update', time: '3 days ago', body: 'New security measures have been implemented...', avatar: 'M' },
  { id: 203, sender: 'Me', recipient: 'Team Lead', subject: 'Project Timeline', time: '1 week ago', body: 'The updated timeline is attached...', avatar: 'M' }
];

const MOCK_ARCHIVED = [
  { id: 301, sender: 'Finance Dept', subject: 'Budget Approval 2024', time: 'Oct 12', body: 'The 2024 budget has been approved...', avatar: 'F' },
  { id: 302, sender: 'HR Team', subject: 'Annual Review Schedule', time: 'Oct 8', body: 'Annual reviews will begin next month...', avatar: 'H' },
  { id: 303, sender: 'Marketing', subject: 'Campaign Results Q2', time: 'Oct 1', body: 'Q2 campaign exceeded expectations...', avatar: 'M' }
];

const MOCK_TRASH = [
  { id: 401, sender: 'Newsletter', subject: 'Weekly Tech Digest', time: '1 week ago', deletesIn: '23 days', body: 'This week in technology...', avatar: 'N' },
  { id: 402, sender: 'Marketing', subject: 'Campaign Results', time: '1 week ago', deletesIn: '23 days', body: 'See how your campaign performed...', avatar: 'M' },
  { id: 403, sender: 'Social Media', subject: 'Monthly Report', time: '2 weeks ago', deletesIn: '16 days', body: 'Your social stats for September...', avatar: 'S' }
];

const MOCK_SPAM = [
  { id: 501, sender: 'unknown@spam.com', subject: 'You won a prize!', time: 'Today', body: 'Click here to claim your prize...', avatar: '!' },
  { id: 502, sender: 'phishing@fake.net', subject: 'Urgent: Verify account', time: 'Today', body: 'Your account will be suspended...', avatar: '!' },
  { id: 503, sender: 'lottery@scam.com', subject: 'Congratulations winner!', time: 'Yesterday', body: 'You have been selected...', avatar: '!' }
];

const MOCK_CONTACTS = [
  { id: 101, name: 'Sloane Vanderbilt', role: 'Executive Lead', email: 'sloane@dubai.com', phone: '+971 55 123 4567', group: 'Executive', company: 'Dubai Holdings', location: 'Dubai, UAE', lastContact: '2 days ago' },
  { id: 102, name: 'Julian Sterling', role: 'Senior Analyst', email: 'julian@dubai.com', phone: '+971 55 234 5678', group: 'Team', company: 'Analytics Corp', location: 'London, UK', lastContact: '1 week ago' },
  { id: 103, name: 'Amara Khan', role: 'CTO', email: 'amara@tech.com', phone: '+971 55 345 6789', group: 'Executive', company: 'TechVentures', location: 'Silicon Valley, USA', lastContact: 'Yesterday' },
  { id: 104, name: 'David Chen', role: 'Developer', email: 'david@tech.com', phone: '+971 55 456 7890', group: 'Team', company: 'DevStudio', location: 'Singapore', lastContact: '3 days ago' },
  { id: 105, name: 'Sarah Williams', role: 'Designer', email: 'sarah@design.com', phone: '+971 55 567 8901', group: 'Team', company: 'Creative Labs', location: 'New York, USA', lastContact: '1 day ago' },
  { id: 106, name: 'Mohammed Al-Rashid', role: 'Partner', email: 'mohammed@partners.ae', phone: '+971 55 678 9012', group: 'Executive', company: 'Gulf Ventures', location: 'Abu Dhabi, UAE', lastContact: '5 days ago' }
];

const MOCK_GROUPS = [
  { id: 1, name: 'Executive Team', members: 3, color: 'red', description: 'C-level executives and board members', contacts: [101, 103, 106] },
  { id: 2, name: 'Development', members: 8, color: 'blue', description: 'Engineering and technical team', contacts: [104] },
  { id: 3, name: 'Marketing', members: 5, color: 'green', description: 'Marketing and communications team', contacts: [] },
  { id: 4, name: 'Design Team', members: 4, color: 'purple', description: 'Product and UX designers', contacts: [105] }
];

const MOCK_EVENTS = [
  { id: 1, title: 'Board Review', time: '10:00 AM - 11:30 AM', date: 'Oct 24', fullDate: '2024-10-24', loc: 'Conf Room A', type: 'meeting', attendees: 12 },
  { id: 2, title: 'Team Sync', time: '02:00 PM - 02:30 PM', date: 'Oct 24', fullDate: '2024-10-24', loc: 'Online', type: 'meeting', attendees: 6 },
  { id: 3, title: 'Client Dinner', time: '08:00 PM - 10:00 PM', date: 'Oct 24', fullDate: '2024-10-24', loc: 'Nobu', type: 'dinner', attendees: 4 },
  { id: 4, title: 'Sprint Planning', time: '09:00 AM - 11:00 AM', date: 'Oct 25', fullDate: '2024-10-25', loc: 'War Room', type: 'meeting', attendees: 8 },
  { id: 5, title: 'Product Demo', time: '03:00 PM - 04:00 PM', date: 'Oct 26', fullDate: '2024-10-26', loc: 'Main Hall', type: 'presentation', attendees: 25 },
  { id: 6, title: 'Quarterly Review', time: '10:00 AM - 12:00 PM', date: 'Oct 27', fullDate: '2024-10-27', loc: 'Boardroom', type: 'meeting', attendees: 15 }
];

const MOCK_TASKS = [
  { id: 1, title: 'Review Q4 Budget', priority: 'high', dueDate: 'Oct 25', completed: false, project: 'Finance', description: 'Review and approve the Q4 budget allocation', assignee: 'You' },
  { id: 2, title: 'Update security protocols', priority: 'urgent', dueDate: 'Oct 24', completed: false, project: 'IT', description: 'Implement new security measures across all systems', assignee: 'You' },
  { id: 3, title: 'Prepare board presentation', priority: 'high', dueDate: 'Oct 26', completed: false, project: 'Executive', description: 'Create slides for quarterly board meeting', assignee: 'You' },
  { id: 4, title: 'Code review - Auth module', priority: 'medium', dueDate: 'Oct 27', completed: false, project: 'Development', description: 'Review authentication module pull request', assignee: 'David Chen' },
  { id: 5, title: 'Client feedback analysis', priority: 'low', dueDate: 'Oct 30', completed: true, project: 'Product', description: 'Analyze customer feedback from Q3', assignee: 'You' },
  { id: 6, title: 'Design system updates', priority: 'medium', dueDate: 'Oct 28', completed: false, project: 'Design', description: 'Update component library with new patterns', assignee: 'Sarah Williams' },
  { id: 7, title: 'Database optimization', priority: 'high', dueDate: 'Oct 26', completed: false, project: 'IT', description: 'Optimize database queries for performance', assignee: 'Amara Khan' }
];

const MOCK_NOTES = [
  { id: 1, title: 'Meeting Notes - Oct 23', content: 'Discussed Q4 strategy and resource allocation. Key decisions: 1) Expand Dubai team by 3 members, 2) Launch new product line in Q1 2025, 3) Increase marketing budget by 15%.', lastEdited: '2 hours ago', category: 'Meetings' },
  { id: 2, title: 'Project Ideas', content: 'AI integration for email categorization\nMobile app redesign with dark mode\nAnalytics dashboard for executives\nAutomated reporting system\nCustomer portal improvements', lastEdited: 'Yesterday', category: 'Ideas' },
  { id: 3, title: 'Personal Goals 2024', content: 'Professional: Learn new framework, Improve presentation skills, Complete leadership training\nPersonal: Read 24 books, Exercise 4x per week, Learn Arabic', lastEdited: '3 days ago', category: 'Personal' },
  { id: 4, title: 'Research Notes - AI Integration', content: 'Exploring options for AI-powered email assistant. Key features needed: Smart categorization, Priority detection, Response suggestions, Meeting scheduling.', lastEdited: '1 week ago', category: 'Research' }
];

const SETTINGS_CATEGORIES = [
  { id: 'account', title: 'Account', desc: 'Manage your account settings and preferences', icon: '👤' },
  { id: 'notifications', title: 'Notifications', desc: 'Configure email and system notifications', icon: '🔔' },
  { id: 'appearance', title: 'Appearance', desc: 'Customize theme and visual settings', icon: '🎨' },
  { id: 'privacy', title: 'Privacy', desc: 'Control your data and privacy options', icon: '🔒' },
  { id: 'signature', title: 'Signature', desc: 'Edit your email signature', icon: '✍️' },
  { id: 'integrations', title: 'Integrations', desc: 'Connect third-party services', icon: '🔗' }
];

// --- COMPONENTS ---

const BrickBar: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
  darkMode: boolean;
  count?: number;
}> = ({ label, active, onClick, darkMode, count }) => (
  <motion.div 
    onClick={onClick}
    whileHover={{ scale: 1.02, x: 4 }}
    whileTap={{ scale: 0.98 }}
    className={`
      relative w-full h-12 flex items-center justify-between px-5 mb-2 cursor-pointer transition-all duration-200
      rounded-md shrink-0 select-none overflow-hidden group
      ${darkMode 
        ? 'bg-[#1A1A1A] text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
        : 'bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.05)]'}
    `}
  >
    {/* Small titanium red accent - LEFT edge (15% height, 2px) */}
    <div className={`absolute left-0 top-[42.5%] w-[2px] h-[15%] transition-all duration-300 bg-red-600`}></div>
    <span className={`text-[10px] font-bold uppercase tracking-[0.25em] z-10`}>
      {label}
    </span>
    <div className="flex items-center gap-2">
      {count && count > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="min-w-[20px] h-5 px-1.5 rounded-md bg-red-600 flex items-center justify-center"
        >
          <span className="text-[9px] font-black text-white">{count > 99 ? '99+' : count}</span>
        </motion.div>
      )}
      <div className="w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-red-600 transform rotate-45 mr-1"></div>
    </div>
  </motion.div>
);

const AccountChip: React.FC<{
  initials: string;
  active: boolean;
  onClick: () => void;
  darkMode: boolean;
}> = ({ initials, active, onClick, darkMode }) => (
  <button 
    onClick={onClick}
    className={`
      h-8 min-w-[40px] px-0 rounded-md flex items-center justify-center text-[10px] font-black tracking-wider transition-all border relative
      ${active 
        ? (darkMode ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-black text-white border-black shadow-lg') 
        : (darkMode ? 'bg-transparent text-neutral-600 border-neutral-800 hover:border-neutral-600 hover:text-white' : 'bg-white border-neutral-200 text-neutral-400 hover:text-black')
      }
    `}
  >
    {initials}
    {active && <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-red-600"></div>}
  </button>
);

const DockButton: React.FC<{
    label: string;
    onClick: () => void;
    darkMode: boolean;
    urgent?: boolean;
}> = ({ label, onClick, darkMode, urgent }) => (
    <button 
        onClick={onClick}
        className={`
            h-10 flex-1 rounded-md flex items-center justify-center text-[9px] font-bold uppercase tracking-widest border transition-all active:scale-95
            ${urgent 
                ? (darkMode ? 'bg-red-900/20 text-red-500 border-red-900/50 hover:bg-red-900/40' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100')
                : (darkMode ? 'bg-[#151515] text-neutral-300 border-white/10 hover:bg-[#222]' : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50')
            }
        `}
    >
        {label}
    </button>
);

const EmailCard: React.FC<{
  mail: any;
  onClick: () => void;
  darkMode: boolean;
  showRecipient?: boolean;
  showDeleteTimer?: boolean;
  onArchive?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onStar?: (e: React.MouseEvent) => void;
}> = ({ mail, onClick, darkMode, showRecipient = false, showDeleteTimer = false, onArchive, onDelete, onStar }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        group relative p-6 rounded-md border transition-all duration-300 cursor-pointer overflow-hidden
        ${darkMode 
          ? 'bg-[#1A1A1A] border-white/5 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
        }
      `}
    >
      {/* Small red accent - BOTTOM LEFT corner (15% width, 2px) */}
      <div className={`absolute bottom-0 left-0 h-[2px] w-[15%] transition-all duration-300 ${
        mail.status === 'URGENT' ? 'bg-red-600' : isHovered ? 'bg-red-600/60' : 'bg-red-600/30'
      }`}></div>

      <div className="flex items-center gap-4 mb-4">
        <div className={`w-11 h-11 rounded-md flex items-center justify-center font-black text-base shrink-0 ${
          darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black'
        }`}>
          {mail.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
            {showRecipient ? `To: ${mail.recipient}` : mail.sender}
          </div>
          <div className="text-[10px] opacity-40 font-mono mt-0.5">{mail.time}</div>
        </div>
        <div className="flex items-center gap-2">
          {mail.hasAttachment && (
            <div className="text-[10px] opacity-40">📎</div>
          )}
          {mail.status === 'URGENT' && (
            <div className="px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest bg-red-600/10 text-red-600 border border-red-600/20">
              URGENT
            </div>
          )}
          {mail.status === 'UNREAD' && !isHovered && (
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
          )}
          {showDeleteTimer && mail.deletesIn && (
            <div className="text-[8px] opacity-40">Deletes in {mail.deletesIn}</div>
          )}
        </div>
      </div>

      <h3 className={`text-base font-semibold mb-2 ${darkMode ? 'text-neutral-50' : 'text-neutral-900'}`}>
        {mail.subject}
      </h3>

      <p className={`text-sm leading-relaxed line-clamp-2 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
        {mail.body}
      </p>
      
      {/* Quick Actions on Hover */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2"
      >
        {onArchive && (
          <button
            onClick={onArchive}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
              darkMode ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-400 hover:text-black'
            }`}
            title="Archive"
          >
            📦
          </button>
        )}
        {onStar && (
          <button
            onClick={onStar}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
              darkMode ? 'hover:bg-white/10 text-neutral-400 hover:text-yellow-500' : 'hover:bg-neutral-100 text-neutral-400 hover:text-yellow-500'
            }`}
            title="Star"
          >
            ⭐
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
              darkMode ? 'hover:bg-red-900/20 text-neutral-400 hover:text-red-500' : 'hover:bg-red-50 text-neutral-400 hover:text-red-600'
            }`}
            title="Delete"
          >
            🗑️
          </button>
        )}
      </motion.div>
      
      {/* Right Arrow */}
      <div className={`absolute right-6 bottom-6 opacity-0 group-hover:opacity-30 transition-all duration-300 pointer-events-none ${
        isHovered ? 'translate-x-0' : 'translate-x-2'
      }`}>
        <div className="w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-red-600 transform rotate-45"></div>
      </div>
    </motion.div>
  );
};

// Flip Clock Component
const FlipClock: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
    const [time, setTime] = useState(new Date());
    
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const isPM = hours >= 12;
    const displayHours = hours % 12 || 12;
    
    const formatNumber = (num: number) => num.toString().padStart(2, '0');
    
    const FlipDigit: React.FC<{ value: string }> = ({ value }) => (
        <div className={`relative w-16 h-20 ${darkMode ? 'bg-[#0A0A0A]' : 'bg-white'} rounded-md border ${darkMode ? 'border-white/10' : 'border-neutral-200'} flex items-center justify-center overflow-hidden`}>
            {/* Red accent line - left side */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-16 bg-red-600"></div>
            
            {/* Middle divider */}
            <div className={`absolute left-0 right-0 top-1/2 h-[1px] ${darkMode ? 'bg-white/5' : 'bg-neutral-200'}`}></div>
            
            {/* Number */}
            <span className={`text-4xl font-thin tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
                {value}
            </span>
        </div>
    );
    
    return (
        <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-3">
                <FlipDigit value={formatNumber(displayHours)[0]} />
                <FlipDigit value={formatNumber(displayHours)[1]} />
                
                <div className="flex flex-col gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/30' : 'bg-black/30'}`}></div>
                    <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/30' : 'bg-black/30'}`}></div>
                </div>
                
                <FlipDigit value={formatNumber(minutes)[0]} />
                <FlipDigit value={formatNumber(minutes)[1]} />
            </div>
            
            <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {isPM ? 'PM' : 'AM'}
            </div>
        </div>
    );
};

const CalendarWidget: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const today = new Date().getDate();
    
    return (
        <div className="flex flex-col h-full">
             <h3 className={`text-xs font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>October 2024</h3>
             
             <div className="grid grid-cols-7 gap-2 mb-8">
                {['S','M','T','W','T','F','S'].map((d,i) => (
                    <div key={i} className="text-[9px] font-bold text-center opacity-30">{d}</div>
                ))}
                {days.map(d => (
                    <div key={d} className={`
                        h-6 flex items-center justify-center text-[10px] rounded-md
                        ${d === today 
                            ? 'bg-red-600 text-white font-bold' 
                            : (d === 24 || d === 25) ? (darkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-black')
                            : 'opacity-40'}
                    `}>
                        {d}
                    </div>
                ))}
             </div>

             <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Upcoming</h3>
             <div className="space-y-3">
                 {MOCK_EVENTS.slice(0, 3).map(ev => (
                     <div key={ev.id} className={`p-3 rounded-md border ${darkMode ? 'border-white/5 bg-white/5' : 'border-neutral-200 bg-white'}`}>
                         <div className="flex justify-between items-center mb-1">
                             <span className={`text-[9px] font-bold uppercase tracking-wider ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>{ev.time.split(' - ')[0]}</span>
                         </div>
                         <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{ev.title}</div>
                         <div className="text-[9px] opacity-50 mt-1">{ev.loc}</div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

// --- GENESIS PROTOCOL ONBOARDING ---
const GenesisProtocol: React.FC<{
  onComplete: () => void;
  darkMode: boolean;
}> = ({ onComplete, darkMode }) => {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  const steps = [
    {
      title: 'WELCOME TO i.AM OS',
      subtitle: 'Premium Productivity Intelligence',
      content: 'Your premium email and productivity interface. Designed for executives who demand excellence.',
    },
    {
      title: 'IDENTIFY YOURSELF',
      subtitle: 'Personal Configuration',
      content: 'Let\'s personalize your experience.',
      hasInput: true,
    },
    {
      title: 'SYSTEM READY',
      subtitle: 'Genesis Protocol Complete',
      content: 'Your workspace is configured and ready. Welcome to the future of productivity.',
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${darkMode ? 'bg-[#050505]' : 'bg-[#FAFAFA]'}`}>
      <div className="max-w-2xl w-full px-8">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-red-600 font-black text-2xl tracking-tighter">i.AM</span>
            <div className={`h-6 w-[1px] ${darkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>
            <span className={`text-xs uppercase tracking-[0.3em] font-bold ${darkMode ? 'text-white/40' : 'text-neutral-400'}`}>PLATINUM OS</span>
          </div>
          
          <h1 className={`text-4xl font-thin mb-3 bg-gradient-to-r ${
            darkMode 
              ? 'from-neutral-100 via-neutral-300 to-neutral-100' 
              : 'from-neutral-700 via-neutral-900 to-neutral-700'
          } bg-clip-text text-transparent`}>
            {currentStep.title}
          </h1>
          
          <p className={`text-sm uppercase tracking-[0.2em] mb-8 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {currentStep.subtitle}
          </p>

          <p className={`text-base leading-relaxed mb-12 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {currentStep.content}
          </p>

          {currentStep.hasInput && (
            <div className="space-y-4 mb-12">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name"
                className={`w-full px-6 py-4 rounded-md border outline-none text-center ${
                  darkMode 
                    ? 'bg-[#111] border-white/10 text-white placeholder:text-neutral-600' 
                    : 'bg-white border-neutral-200 text-black placeholder:text-neutral-400'
                }`}
              />
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="Your Role"
                className={`w-full px-6 py-4 rounded-md border outline-none text-center ${
                  darkMode 
                    ? 'bg-[#111] border-white/10 text-white placeholder:text-neutral-600' 
                    : 'bg-white border-neutral-200 text-black placeholder:text-neutral-400'
                }`}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 w-12 rounded-full transition-all ${
                i === step 
                  ? 'bg-red-600' 
                  : (darkMode ? 'bg-white/10' : 'bg-black/10')
              }`} />
            ))}
          </div>

          <button
            onClick={handleNext}
            className={`px-8 py-3 rounded-md text-sm font-bold uppercase tracking-widest transition-all ${
              darkMode 
                ? 'bg-white text-black hover:bg-neutral-200' 
                : 'bg-black text-white hover:bg-neutral-800'
            }`}
          >
            {step === steps.length - 1 ? 'BEGIN' : 'CONTINUE'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function ProductPage() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== 'undefined') return !localStorage.getItem('im_onboarding_complete');
    return true;
  });

  const [activeAccountId, setActiveAccountId] = useState(1);
  const [activeView, setActiveView] = useState('inbox');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
  const [dockInput, setDockInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [time, setTime] = useState(new Date());
  
  // Selection States
  const [selectedMailId, setSelectedMailId] = useState<number | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedSettingId, setSelectedSettingId] = useState<string | null>(null);
  const [composeMode, setComposeMode] = useState<'new' | 'reply' | null>(null);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState('all');
  const [calendarViewMode, setCalendarViewMode] = useState<'list' | 'month'>('list');

  // Persistent Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('im_mail_theme') === 'dark';
    return false; 
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('im_mail_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // CMD/CTRL + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleNav('search');
        toast.success('Search opened (⌘K)');
      }
      // Number keys for quick navigation (only when not typing)
      if (!['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        const shortcuts: {[key: string]: string} = {
          '1': 'inbox',
          '2': 'drafts',
          '3': 'sent',
          '4': 'contacts',
          '5': 'calendar',
          '6': 'tasks',
          '7': 'notes',
          '8': 'compose',
          '9': 'settings',
        };
        if (shortcuts[e.key]) {
          handleNav(shortcuts[e.key]);
          toast.success(`Switched to ${shortcuts[e.key]}`);
        }
        // C for compose
        if (e.key === 'c' && !composeMode) {
          setComposeMode('new');
          toast.success('New message (C)');
        }
        // ESC to go back
        if (e.key === 'Escape') {
          if (selectedMailId || selectedContactId || selectedTaskId || selectedEventId) {
            setSelectedMailId(null);
            setSelectedContactId(null);
            setSelectedTaskId(null);
            setSelectedEventId(null);
            setSelectedGroupId(null);
            setSelectedNoteId(null);
            setSelectedSettingId(null);
            toast.success('Back');
          } else if (composeMode) {
            setComposeMode(null);
            toast.success('Compose closed');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [composeMode, selectedMailId, selectedContactId, selectedTaskId, selectedEventId]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('im_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  // AI Action
  const handleAiAction = async () => {
    if (!dockInput) return;
    setIsAiThinking(true);
    setAiResponse(''); 
    const ai = getAI();
    if (!ai) {
      setAiResponse("System offline.");
      setIsAiThinking(false);
      setDockInput('');
      return;
    }
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Context: i.AM OS. Current View: ${activeView}. Selection: ${selectedMailId || selectedTaskId || 'None'}. User: ${dockInput}. Brief response.`
      });
      setAiResponse(response.text || "Processed.");
    } catch (e) {
      setAiResponse("System offline.");
    } finally {
      setIsAiThinking(false);
      setDockInput('');
    }
  };

  const handleNav = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    setSelectedMailId(null);
    setSelectedContactId(null);
    setSelectedGroupId(null);
    setSelectedTaskId(null);
    setSelectedNoteId(null);
    setSelectedEventId(null);
    setSelectedSettingId(null);
    setComposeMode(null);
  };

  const toggleTaskComplete = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Get current mail list based on view
  const getCurrentMailList = () => {
    switch(activeView) {
      case 'inbox': return MOCK_INBOX;
      case 'drafts': return MOCK_DRAFTS;
      case 'sent': return MOCK_SENT;
      case 'archive': return MOCK_ARCHIVED;
      case 'trash': return MOCK_TRASH;
      case 'spam': return MOCK_SPAM;
      default: return [];
    }
  };

  // --- CONTEXT DETECTION LOGIC ---
  const getDockContext = () => {
      // When sidebar is open (home state), show primary actions
      if (mobileMenuOpen) return ['COMPOSE', 'CALENDAR', 'CONTACTS'];
      
      if (composeMode === 'new') return ['BACK', 'CONTACTS', 'DRAFT', 'SEND'];
      if (composeMode === 'reply') return ['BACK', 'FORMAL', 'FRIENDLY', 'SEND'];

      if (['inbox', 'drafts', 'sent', 'archive', 'trash', 'spam'].includes(activeView)) {
          if (selectedMailId) return ['BACK', 'REPLY', 'FORWARD', 'TASKS'];
          return ['BACK', 'COMPOSE', 'SEARCH', 'FILTER'];
      }

      if (activeView === 'contacts') {
          if (selectedContactId) return ['BACK', 'CALL', 'WHATSAPP', 'EDIT'];
          return ['BACK', 'COMPOSE', 'NEW', 'SEARCH'];
      }

      if (activeView === 'groups') {
          if (selectedGroupId) return ['BACK', 'EDIT', 'EMAIL ALL', 'DELETE'];
          return ['BACK', 'NEW GROUP', 'EDIT', 'SEARCH'];
      }

      if (activeView === 'calendar') {
          if (selectedEventId) return ['BACK', 'EDIT', 'DELETE', 'SHARE'];
          return ['BACK', 'TODAY', 'NEW EVENT', 'SCHEDULE'];
      }

      if (activeView === 'tasks') {
          if (selectedTaskId) return ['BACK', 'EDIT', 'DELETE', 'COMPLETE'];
          return ['BACK', 'NEW TASK', 'FILTER', 'SORT'];
      }

      if (activeView === 'notes') {
          if (selectedNoteId) return ['BACK', 'SHARE', 'DELETE', 'SAVE'];
          return ['BACK', 'NEW NOTE', 'SEARCH', 'SORT'];
      }
      
      if (activeView === 'settings') {
          if (selectedSettingId) return ['BACK', 'SAVE', 'RESET', 'EXPORT'];
          return ['BACK', 'SEARCH', 'RESET', 'EXPORT'];
      }

      if (activeView === 'storage' || activeView === 'security') {
          return ['BACK', 'CLEAN UP', 'EXPORT', 'SETTINGS'];
      }

      if (activeView === 'search') {
          return ['BACK', 'EXECUTE', 'CLEAR', 'FILTERS'];
      }

      if (activeView === 'filters') {
          return ['BACK', 'APPLY', 'SAVE', 'CLEAR'];
      }

      if (activeView === 'compose') {
          return ['BACK', 'NEW EMAIL', 'TEMPLATE', 'DRAFT'];
      }

      return ['COMPOSE', 'CALENDAR', 'CONTACTS'];
  };

  const dockButtons = getDockContext();

  const handleDockAction = (action: string) => {
      if (action === 'BACK') {
          if (selectedMailId) { setSelectedMailId(null); return; }
          if (selectedContactId) { setSelectedContactId(null); return; }
          if (selectedGroupId) { setSelectedGroupId(null); return; }
          if (selectedTaskId) { setSelectedTaskId(null); return; }
          if (selectedNoteId) { setSelectedNoteId(null); return; }
          if (selectedEventId) { setSelectedEventId(null); return; }
          if (selectedSettingId) { setSelectedSettingId(null); return; }
          if (composeMode) { setComposeMode(null); return; }
          setActiveView('inbox');
          setMobileMenuOpen(true);
          return;
      }
      
      if (action === 'COMPOSE') {
          setMobileMenuOpen(false);
          setActiveView('inbox');
          setComposeMode('new');
          return;
      }
      if (action === 'CALENDAR') { handleNav('calendar'); return; }
      if (action === 'CONTACTS') { handleNav('contacts'); return; }
      if (action === 'REPLY') { setComposeMode('reply'); return; }
      if (action === 'COMPLETE' && selectedTaskId) { toggleTaskComplete(selectedTaskId); return; }
      if (action === 'SEND') { handleAiAction(); return; }
      if (action === 'EXECUTE' && activeView === 'search') {
          // Execute search
          return;
      }
      if (action === 'APPLY' && activeView === 'filters') {
          // Apply filters
          return;
      }
      
      // TASKS button - Extract tasks from email
      if (action === 'TASKS' && selectedMailId) {
          const mail = getCurrentMailList().find(m => m.id === selectedMailId);
          if (mail) {
              // AI extraction simulation
              setIsAiThinking(true);
              setAiResponse('Analyzing email for tasks...');
              setTimeout(() => {
                  const extractedTasks = [
                      `Review: ${mail.subject}`,
                      `Respond to ${mail.sender}`,
                      mail.hasAttachment ? 'Review attached documents' : null
                  ].filter(Boolean);
                  setAiResponse(`${extractedTasks.length} tasks extracted:\n${extractedTasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}`);
                  setIsAiThinking(false);
              }, 1500);
          }
          return;
      }
      
      // NEW TASK action
      if (action === 'NEW TASK') {
          setDockInput('');
          setAiResponse('Type your task in the dock (e.g., "Call supplier about shipment")');
          return;
      }
      
      // FILTER action
      if (action === 'FILTER' && activeView === 'tasks') {
          const filters = ['all', 'active', 'completed'];
          const currentIndex = filters.indexOf(taskFilter);
          const nextFilter = filters[(currentIndex + 1) % filters.length];
          setTaskFilter(nextFilter);
          setAiResponse(`Filter: Showing ${nextFilter} tasks`);
          return;
      }
      
      // SORT action
      if (action === 'SORT' && activeView === 'tasks') {
          setAiResponse('Tasks sorted by priority and due date');
          return;
      }
      
      // DELETE task action
      if (action === 'DELETE' && selectedTaskId) {
          setTasks(tasks.filter(t => t.id !== selectedTaskId));
          setSelectedTaskId(null);
          setAiResponse('Task deleted');
          return;
      }
      
      // EDIT task action
      if (action === 'EDIT' && selectedTaskId) {
          const task = tasks.find(t => t.id === selectedTaskId);
          if (task) {
              setDockInput(task.title);
              setAiResponse('Edit task in the dock and press Enter');
          }
          return;
      }

      // Simulate generic action
      setDockInput(`Action: ${action}`);
      setTimeout(() => handleAiAction(), 500);
  };

  const MODULES = [
    { cat: 'CORE', items: ['Inbox', 'Drafts', 'Sent', 'Archive', 'Trash', 'Spam'] },
    { cat: 'PEOPLE', items: ['Contacts', 'Groups'] },
    { cat: 'PLANNING', items: ['Calendar', 'Tasks', 'Notes'] },
    { cat: 'TOOLS', items: ['Compose', 'Search', 'Filters'] },
    { cat: 'SYSTEM', items: ['Settings', 'Storage', 'Security'] }
  ];

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'active') return !task.completed;
    if (taskFilter === 'completed') return task.completed;
    return true;
  });

  if (showOnboarding) {
    return <GenesisProtocol onComplete={handleOnboardingComplete} darkMode={darkMode} />;
  }

  return (
    <div className={`h-screen w-full flex overflow-hidden font-sans relative transition-colors duration-500
        ${darkMode ? 'bg-[#050505] text-white' : 'bg-[#FAFAFA] text-black'}
    `}>
      
      {/* 1. SIDEBAR (NAVIGATION) */}
      <aside className={`
            fixed inset-0 z-50 w-full flex flex-col
            md:relative md:w-[320px] md:inset-auto md:translate-x-0
            transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            ${darkMode ? 'bg-[#050505]' : 'bg-[#FAFAFA]'}
            md:border-r ${darkMode ? 'border-white/5' : 'border-black/5'}
      `}>
        <div className={`px-5 py-6 shrink-0 z-20 flex flex-col gap-4 ${darkMode ? 'bg-[#050505]/95' : 'bg-[#FAFAFA]/95'} backdrop-blur-md`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-red-600 font-black text-sm tracking-tighter">i.AM</span>
                    <div className={`h-3 w-[1px] ${darkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>
                    <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${darkMode ? 'text-white/40' : 'text-neutral-400'}`}>Platinum OS</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setDarkMode(!darkMode)} className={`w-5 h-5 rounded-full border flex items-center justify-center ${darkMode ? 'border-white/20' : 'border-black/10'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white' : 'bg-black'}`}></div>
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {MOCK_ACCOUNTS.map(acc => (
                    <AccountChip key={acc.id} initials={acc.initials} active={activeAccountId === acc.id} onClick={() => setActiveAccountId(acc.id)} darkMode={darkMode} />
                ))}
                <button className={`h-8 w-8 rounded-md border border-dashed flex items-center justify-center shrink-0 ${darkMode ? 'border-white/10 text-white/30' : 'border-black/10 text-black/30'}`}>
                    <span className="text-xs">+</span>
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-52 space-y-6 no-scrollbar mask-image-b">
            {MODULES.map((section, i) => (
                <div key={i} className="animate-in slide-in-from-bottom-4 fade-in duration-500" style={{animationDelay: `${i * 50}ms`}}>
                    <div className="mb-2 pl-1 flex items-center gap-2 opacity-50">
                         <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>{section.cat}</span>
                    </div>
                    <div>
                        {section.items.map(item => {
                            const itemKey = item.toLowerCase();
                            let count = 0;
                            // Add count badges for key modules
                            if (itemKey === 'inbox') count = MOCK_INBOX.filter(m => m.status === 'UNREAD').length;
                            if (itemKey === 'drafts') count = MOCK_DRAFTS.length;
                            if (itemKey === 'spam') count = MOCK_SPAM.length;
                            if (itemKey === 'tasks') count = tasks.filter(t => !t.completed).length;
                            
                            return (
                                <BrickBar 
                                    key={item} 
                                    label={item} 
                                    active={activeView === itemKey} 
                                    onClick={() => handleNav(itemKey)} 
                                    darkMode={darkMode}
                                    count={count}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className={`
        relative flex-1 flex transition-transform duration-500
        ${mobileMenuOpen ? 'translate-x-full md:translate-x-0' : 'translate-x-0'}
      `}>
          
          <div className="flex-1 flex flex-col h-full relative z-10">
              
              {/* Scrollable Content - HEADLESS DESIGN */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar pb-48">

                  {/* EMAIL VIEWS (Inbox, Drafts, Sent, Archive, Trash, Spam) */}
                  {['inbox', 'drafts', 'sent', 'archive', 'trash', 'spam'].includes(activeView) && !selectedMailId && !composeMode && (
                      <div className="space-y-4 max-w-2xl mx-auto">
                          {getCurrentMailList().length > 0 ? (
                            getCurrentMailList().map(mail => (
                              <EmailCard 
                                  key={mail.id}
                                  mail={mail}
                                  onClick={() => setSelectedMailId(mail.id)}
                                  darkMode={darkMode}
                                  showRecipient={activeView === 'sent'}
                                  showDeleteTimer={activeView === 'trash'}
                                  onArchive={(e) => {
                                    e.stopPropagation();
                                    toast.success('Email archived');
                                  }}
                                  onDelete={(e) => {
                                    e.stopPropagation();
                                    toast.success('Email moved to trash');
                                  }}
                                  onStar={(e) => {
                                    e.stopPropagation();
                                    toast.success('Email starred');
                                  }}
                              />
                            ))
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`p-16 text-center rounded-md border ${
                                darkMode ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-neutral-200'
                              }`}
                            >
                              <div className="text-6xl mb-4 opacity-20">📭</div>
                              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Nothing here
                              </h3>
                              <p className="text-sm opacity-40">
                                Your {activeView} is empty
                              </p>
                            </motion.div>
                          )}
                      </div>
                  )}

                  {/* EMAIL READING VIEW */}
                  {['inbox', 'drafts', 'sent', 'archive', 'trash', 'spam'].includes(activeView) && selectedMailId && !composeMode && (
                      <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                          {getCurrentMailList().filter(m => m.id === selectedMailId).map(mail => (
                              <div key={mail.id}>
                                  <div className="flex justify-between items-start mb-6">
                                      <h1 className="text-xl font-medium leading-tight">{mail.subject}</h1>
                                      <span className="text-[10px] font-mono opacity-50 shrink-0 ml-4">{mail.time}</span>
                                  </div>
                                  <div className="flex items-center gap-3 mb-8 pb-8 border-b border-neutral-500/10">
                                      <div className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm ${darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black'}`}>{mail.avatar}</div>
                                      <div>
                                          <div className="text-sm font-bold">{mail.sender}</div>
                                          <div className="text-[10px] opacity-50">to me</div>
                                      </div>
                                  </div>
                                  <div className="text-sm leading-7 opacity-80 whitespace-pre-wrap">{mail.body}</div>
                                  {mail.hasAttachment && (
                                      <div className={`mt-6 p-4 rounded-md border ${darkMode ? 'bg-[#111] border-white/5' : 'bg-neutral-50 border-neutral-200'}`}>
                                          <div className="text-xs opacity-50 mb-2">ATTACHMENTS</div>
                                          <div className="text-sm">📄 Q4_Report.pdf (2.4 MB)</div>
                                      </div>
                                  )}
                                  <div className="mt-8 text-xs opacity-40 italic">--<br/>Sent via i.AM Secure Relay</div>
                              </div>
                          ))}
                      </div>
                  )}

                  {/* COMPOSE */}
                  {composeMode && (
                      <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-300">
                          <div className={`p-6 rounded-md border space-y-4 ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-neutral-100'}`}>
                              <div className="border-b border-neutral-500/10 pb-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 w-12 inline-block">To</span>
                                  <input type="text" placeholder="Recipients..." className="bg-transparent outline-none text-sm flex-1" />
                              </div>
                              <div className="border-b border-neutral-500/10 pb-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 w-12 inline-block">Subj</span>
                                  <input type="text" placeholder="Subject" defaultValue={composeMode === 'reply' ? 'Re: Q4 Targets' : ''} className="bg-transparent outline-none text-sm flex-1" />
                              </div>
                              <textarea className="w-full bg-transparent h-48 outline-none text-sm resize-none pt-2" placeholder="Start typing..."></textarea>
                          </div>
                      </div>
                  )}

                  {/* CONTACTS - List View */}
                  {activeView === 'contacts' && !selectedContactId && (
                       <div className="max-w-2xl space-y-4 m-[0px] p-[0px]">
                            {MOCK_CONTACTS.map((contact, index) => (
                                <motion.div 
                                    key={contact.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.01, y: -2 }}
                                    onClick={() => {
                                      setSelectedContactId(contact.id);
                                      toast.success(`Opening ${contact.name}`);
                                    }}
                                    className={`
                                        group p-6 rounded-md border cursor-pointer transition-all duration-300 relative overflow-hidden
                                        ${darkMode 
                                          ? 'bg-[#1A1A1A] border-white/5 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]' 
                                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
                                        }
                                    `}
                                >
                                    {/* Small red accent - TOP RIGHT corner (20% width, 2px) */}
                                    <div className="absolute top-0 right-0 h-[2px] w-[20%] bg-red-600"></div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-md flex items-center justify-center font-black text-xl shrink-0 ${
                                            darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black'
                                        }`}>
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-base font-bold mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                {contact.name}
                                            </h3>
                                            <p className="text-xs opacity-50 mb-2">{contact.role}</p>
                                            <div className="flex items-center gap-4 text-[10px] opacity-40">
                                                <span>{contact.company}</span>
                                                <span>•</span>
                                                <span>{contact.location}</span>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-md text-[8px] font-bold uppercase tracking-widest ${
                                            darkMode ? 'bg-white/5 text-neutral-400' : 'bg-neutral-50 text-neutral-500'
                                        }`}>
                                            {contact.group}
                                        </div>
                                    </div>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-all duration-300 pointer-events-none">
                                        <div className="w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-red-600 transform rotate-45"></div>
                                    </div>
                                </motion.div>
                            ))}
                       </div>
                   )}
                   
                   {/* CONTACTS - Detail View */}
                   {activeView === 'contacts' && selectedContactId && (
                       <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                           {MOCK_CONTACTS.filter(c => c.id === selectedContactId).map(contact => (
                               <div key={contact.id} className="space-y-6">
                                   {/* Header Card */}
                                   <div className={`p-8 rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                                       <div className="flex items-start gap-6 mb-6">
                                           <div className={`w-20 h-20 rounded-md flex items-center justify-center font-black text-3xl shrink-0 ${
                                               darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black'
                                           }`}>
                                               {contact.name.charAt(0)}
                                           </div>
                                           <div className="flex-1">
                                               <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                   {contact.name}
                                               </h1>
                                               <p className="text-sm opacity-60 mb-3">{contact.role}</p>
                                               <div className={`inline-flex px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${
                                                   darkMode ? 'bg-white/5 text-neutral-400' : 'bg-neutral-50 text-neutral-500'
                                               }`}>
                                                   {contact.group}
                                               </div>
                                           </div>
                                       </div>
                                   </div>

                                   {/* Contact Information Card */}
                                   <div className={`p-6 rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                                       <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                           Contact Information
                                       </h3>
                                       <div className="space-y-4">
                                           <div className="flex items-center justify-between">
                                               <span className="text-xs opacity-50">Email</span>
                                               <span className="text-sm font-medium">{contact.email}</span>
                                           </div>
                                           <div className="flex items-center justify-between">
                                               <span className="text-xs opacity-50">Phone</span>
                                               <span className="text-sm font-medium">{contact.phone}</span>
                                           </div>
                                           <div className="flex items-center justify-between">
                                               <span className="text-xs opacity-50">Company</span>
                                               <span className="text-sm font-medium">{contact.company}</span>
                                           </div>
                                           <div className="flex items-center justify-between">
                                               <span className="text-xs opacity-50">Location</span>
                                               <span className="text-sm font-medium">{contact.location}</span>
                                           </div>
                                           <div className="flex items-center justify-between">
                                               <span className="text-xs opacity-50">Last Contact</span>
                                               <span className="text-sm font-medium">{contact.lastContact}</span>
                                           </div>
                                       </div>
                                   </div>

                                   {/* Recent Activity Card */}
                                   <div className={`p-6 rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                                       <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                           Recent Activity
                                       </h3>
                                       <div className="space-y-3">
                                           <div className="text-sm opacity-60">
                                               <span className="text-[10px] opacity-50 block mb-1">2 days ago</span>
                                               Email: Q4 Strategic Resource Allocation
                                           </div>
                                           <div className="text-sm opacity-60">
                                               <span className="text-[10px] opacity-50 block mb-1">1 week ago</span>
                                               Meeting: Board Review Session
                                           </div>
                                           <div className="text-sm opacity-60">
                                               <span className="text-[10px] opacity-50 block mb-1">2 weeks ago</span>
                                               Call: Project Timeline Discussion
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}
                   
                   {/* TASKS - List View */}
                   {activeView === 'tasks' && !selectedTaskId && (
                       <div className="max-w-2xl mx-auto space-y-4">
                           {filteredTasks.map(task => (
                               <div
                                   key={task.id}
                                   onClick={() => setSelectedTaskId(task.id)}
                                   className={`
                                       group p-6 rounded-md border cursor-pointer transition-all duration-300 relative overflow-hidden
                                       ${darkMode 
                                           ? 'bg-[#0A0A0A]/50 border-white/5 hover:border-white/10 hover:bg-[#111] backdrop-blur-xl' 
                                           : 'bg-white border-neutral-100 hover:border-neutral-200 hover:shadow-lg'
                                       }
                                       ${task.completed ? 'opacity-50' : ''}
                                   `}
                               >
                                   {/* Priority indicator line */}
                                   {task.priority === 'urgent' && !task.completed && (
                                       <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[1px] h-16 bg-red-600"></div>
                                   )}
                                   {task.priority === 'high' && !task.completed && (
                                       <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[1px] h-16 bg-orange-500"></div>
                                   )}

                                   <div className="flex items-start gap-4">
                                       {/* Checkbox */}
                                       <button
                                           onClick={(e) => {
                                               e.stopPropagation();
                                               toggleTaskComplete(task.id);
                                           }}
                                           className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                                               task.completed
                                                   ? 'bg-red-600 border-red-600'
                                                   : darkMode
                                                   ? 'border-white/20 hover:border-white/40'
                                                   : 'border-neutral-300 hover:border-neutral-400'
                                           }`}
                                       >
                                           {task.completed && (
                                               <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                               </svg>
                                           )}
                                       </button>

                                       <div className="flex-1 min-w-0">
                                           <div className="flex items-center gap-3 mb-2">
                                               <h3 className={`text-base font-bold ${task.completed ? 'line-through' : ''} ${darkMode ? 'text-white' : 'text-black'}`}>
                                                   {task.title}
                                               </h3>
                                               {task.priority === 'urgent' && !task.completed && (
                                                   <div className="px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest bg-red-600/10 text-red-600 border border-red-600/20">
                                                       URGENT
                                                   </div>
                                               )}
                                               {task.priority === 'high' && !task.completed && (
                                                   <div className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                                                       darkMode ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-orange-50 text-orange-600 border border-orange-200'
                                                   }`}>
                                                       HIGH
                                                   </div>
                                               )}
                                           </div>
                                           <p className="text-sm opacity-60 mb-3">{task.description}</p>
                                           <div className="flex items-center gap-4 text-[10px] opacity-40">
                                               <span>📅 {task.dueDate}</span>
                                               <span>•</span>
                                               <span>📁 {task.project}</span>
                                               <span>•</span>
                                               <span>👤 {task.assignee}</span>
                                           </div>
                                       </div>
                                   </div>

                                   <div className={`absolute right-6 bottom-6 opacity-0 group-hover:opacity-30 transition-all duration-300 text-xl ${darkMode ? 'text-white' : 'text-black'}`}>
                                       →
                                   </div>
                               </div>
                           ))}
                           
                           {filteredTasks.length === 0 && (
                               <div className={`p-12 text-center rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                                   <p className="text-sm opacity-40">No {taskFilter} tasks</p>
                               </div>
                           )}
                       </div>
                   )}

                   {/* TASKS - Detail View */}
                   {activeView === 'tasks' && selectedTaskId && (
                       <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                           {tasks.filter(t => t.id === selectedTaskId).map(task => (
                               <div key={task.id} className="space-y-6">
                                   {/* Header Card */}
                                   <div className={`p-8 rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                                       <div className="flex items-start gap-6 mb-6">
                                           <button
                                               onClick={() => toggleTaskComplete(task.id)}
                                               className={`w-12 h-12 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                                                   task.completed
                                                       ? 'bg-red-600 border-red-600'
                                                       : darkMode
                                                       ? 'border-white/20 hover:border-white/40'
                                                       : 'border-neutral-300 hover:border-neutral-400'
                                               }`}
                                           >
                                               {task.completed && (
                                                   <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                   </svg>
                                               )}
                                           </button>
                                           <div className="flex-1">
                                               <h1 className={`text-2xl font-bold mb-3 ${task.completed ? 'line-through opacity-50' : ''} ${darkMode ? 'text-white' : 'text-black'}`}>
                                                   {task.title}
                                               </h1>
                                               <div className="flex items-center gap-3">
                                                   {task.priority === 'urgent' && (
                                                       <div className="px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-red-600/10 text-red-600 border border-red-600/20">
                                                           URGENT
                                                       </div>
                                                   )}
                                                   {task.priority === 'high' && (
                                                       <div className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                           darkMode ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-orange-50 text-orange-600 border border-orange-200'
                                                       }`}>
                                                           HIGH PRIORITY
                                                       </div>
                                                   )}
                                                   {task.priority === 'medium' && (
                                                       <div className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                           darkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-200'
                                                       }`}>
                                                           MEDIUM
                                                       </div>
                                                   )}
                                                   {task.completed && (
                                                       <div className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                           darkMode ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-600 border border-green-200'
                                                       }`}>
                                                           COMPLETED
                                                       </div>
                                                   )}
                                               </div>
                                           </div>
                                       </div>
                                   </div>

                                   {/* Task Details Card */}
                                   <div className={`p-6 rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                                       <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                           Task Details
                                       </h3>
                                       <div className="space-y-4">
                                           <div className="flex items-center justify-between">
                                               <span className="text-xs opacity-50">Due Date</span>
                                               <span className="text-sm font-medium">{task.dueDate}</span>
                                           </div>
                                           <div className="flex items-center justify-between">
                                               <span className="text-xs opacity-50">Project</span>
                                               <span className="text-sm font-medium">{task.project}</span>
                                           </div>
                                           <div className="flex items-center justify-between">
                                               <span className="text-xs opacity-50">Assigned to</span>
                                               <span className="text-sm font-medium">{task.assignee}</span>
                                           </div>
                                           <div className="flex items-center justify-between">
                                               <span className="text-xs opacity-50">Priority</span>
                                               <span className="text-sm font-medium capitalize">{task.priority}</span>
                                           </div>
                                           <div className="flex items-center justify-between">
                                               <span className="text-xs opacity-50">Status</span>
                                               <span className="text-sm font-medium">{task.completed ? 'Completed' : 'In Progress'}</span>
                                           </div>
                                       </div>
                                   </div>

                                   {/* Description Card */}
                                   <div className={`p-6 rounded-md border ${darkMode ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white border-neutral-100'}`}>
                                       <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                           Description
                                       </h3>
                                       <p className="text-sm leading-relaxed opacity-80">
                                           {task.description}
                                       </p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}

              </div>
          </div>

          {/* RIGHT COLUMN: FLIP CLOCK & CALENDAR WIDGET (DESKTOP ONLY) */}
          <div className={`hidden xl:flex w-[320px] p-6 flex-col border-l ${darkMode ? 'border-white/5 bg-[#050505]' : 'border-black/5 bg-[#FAFAFA]'}`}>
                <FlipClock darkMode={darkMode} />
                <CalendarWidget darkMode={darkMode} />
          </div>

      </main>

      {/* GLOBAL DOCK CONTAINER */}
      <div className={`fixed bottom-0 left-0 right-0 p-5 z-[60] flex flex-col items-center justify-end pointer-events-none`}>
         <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${darkMode ? 'from-[#050505] via-[#050505]/95 to-transparent' : 'from-[#FAFAFA] via-[#FAFAFA]/95 to-transparent'}`}></div>
         
         <div className="relative z-10 w-full max-w-2xl flex flex-col gap-3 pointer-events-auto px-[0px] py-[20px] mx-[0px] my-[15px]">
             {aiResponse && (
                <div className={`p-3 rounded-md border backdrop-blur-md shadow-xl text-[10px] animate-in slide-in-from-bottom-5 ${darkMode ? 'bg-[#1A1A1A] border-red-600/30 text-white' : 'bg-white border-red-600/20 text-black'}`}>
                    <span className="font-bold text-red-600 mr-2 rounded-full">●</span> {aiResponse}
                </div>
             )}

             <div className="flex gap-2">
                 {dockButtons.map((btnLabel, idx) => (
                     <DockButton 
                        key={idx} 
                        label={btnLabel} 
                        onClick={() => handleDockAction(btnLabel)} 
                        darkMode={darkMode}
                        urgent={btnLabel === 'DELETE'}
                     />
                 ))}
             </div>

             <div className={`
                w-full h-12 rounded-md flex items-center gap-3 px-2 shadow-2xl border
                ${darkMode ? 'bg-[#151515] border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]' : 'bg-white border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)]'}
             `}>
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 ml-3 shrink-0 animate-pulse"></div>
                <input 
                    value={dockInput}
                    onChange={(e) => setDockInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiAction()}
                    placeholder={isAiThinking ? "Processing..." : "Ask AI or Enter Command..."}
                    className={`flex-1 bg-transparent h-full outline-none text-[11px] font-medium placeholder:text-neutral-400 ${darkMode ? 'text-white' : 'text-black'}`}
                />
                <button onClick={handleAiAction} className={`h-8 px-3 rounded-md text-[9px] font-bold tracking-widest uppercase transition-colors border ${darkMode ? 'bg-[#222] border-white/5 text-white' : 'bg-neutral-100 border-neutral-200 text-neutral-600'}`}>
                    SEND
                </button>
             </div>
         </div>
      </div>

      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        richColors
        theme={darkMode ? 'dark' : 'light'}
        toastOptions={{
          style: {
            borderRadius: '0.75rem',
            border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.1)',
          }
        }}
      />

      {/* Floating Compose Button (Mobile/Quick Access) */}
      {!composeMode && activeView !== 'compose' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setComposeMode('new');
            toast.success('New message');
          }}
          className={`
            fixed bottom-24 right-6 md:bottom-28 md:right-8 z-40
            w-14 h-14 rounded-full bg-red-600 shadow-[0_10px_40px_rgba(220,38,38,0.5)]
            flex items-center justify-center
            hover:shadow-[0_15px_50px_rgba(220,38,38,0.6)]
            transition-shadow duration-300
          `}
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      )}

    </div>
  );
}