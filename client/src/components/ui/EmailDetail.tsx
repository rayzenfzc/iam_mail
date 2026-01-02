import React from 'react';

interface EmailDetailProps {
    sender: string;
    initials: string;
    time: string;
    subject: string;
    body: string;
    theme?: 'dark' | 'light';
    onBack: () => void;
}

const EmailDetail: React.FC<EmailDetailProps> = ({
    sender,
    initials,
    time,
    subject,
    body,
    theme = 'dark',
    onBack
}) => {
    const isDark = theme === 'dark';

    return (
        <div className="w-full max-w-[672px] mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={onBack}
                className={`flex items-center gap-2 mb-8 group w-fit transition-all ${isDark ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-black'} font-sans text-sm`}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                <span>Back to Inbox</span>
            </button>

            <div className={`p-8 rounded-lg border flex flex-col gap-6 backdrop-blur-3xl
        ${isDark ? 'bg-white/[0.04] border-white/10 text-white' : 'bg-black/[0.04] border-black/10 text-black'}`}>

                <div className="flex justify-between items-start border-b border-current/10 pb-6">
                    <div className="flex gap-4 items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            {initials}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">{sender}</h1>
                            <p className="text-xs opacity-50 font-mono tracking-wider">{time}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 border border-current/20 rounded hover:bg-current/5 transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6m-6-6l6-6" /></svg>
                        </button>
                        <button className="p-2 border border-current/20 rounded hover:bg-current/5 transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        </button>
                    </div>
                </div>

                <h2 className="text-xl font-bold leading-tight">
                    {subject}
                </h2>

                <div className="text-sm leading-loose whitespace-pre-wrap opacity-80 font-sans">
                    {body || "No message body provided."}
                </div>
            </div>
        </div>
    );
};

export default EmailDetail;
