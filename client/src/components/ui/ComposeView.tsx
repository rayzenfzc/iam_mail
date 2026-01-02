import React from 'react';

interface ComposeViewProps {
    theme?: 'dark' | 'light';
    onCancel: () => void;
    onSend: () => void;
}

const ComposeView: React.FC<ComposeViewProps> = ({ theme = 'dark', onCancel, onSend }) => {
    const isDark = theme === 'dark';

    return (
        <div className="w-full max-w-[672px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-bold tracking-widest font-sans opacity-60">
                    New Message // Draft
                </h2>
                <button
                    onClick={onCancel}
                    className={`text-[10px] font-mono uppercase tracking-widest opacity-40 hover:opacity-100 transition-all ${isDark ? 'text-white' : 'text-black'}`}
                >
                    [ ESC to Discard ]
                </button>
            </div>

            <div className={`p-8 rounded-lg border flex flex-col gap-4 shadow-2xl transition-all duration-700 backdrop-blur-3xl
        ${isDark ? 'bg-white/[0.04] border-white/10 text-white' : 'bg-black/[0.04] border-black/10 text-black'}`}>

                <div className="flex items-center gap-4 border-b border-current/10 pb-4">
                    <span className="text-[10px] font-mono uppercase opacity-40 w-12 shrink-0">To:</span>
                    <input
                        type="text"
                        placeholder="recipient@vitreous.io"
                        className="bg-transparent border-none outline-none text-sm w-full placeholder-current/20 font-sans"
                    />
                </div>

                <div className="flex items-center gap-4 border-b border-current/10 pb-4">
                    <span className="text-[10px] font-mono uppercase opacity-40 w-12 shrink-0">Sub:</span>
                    <input
                        type="text"
                        placeholder="Enter subject..."
                        className="bg-transparent border-none outline-none text-sm w-full placeholder-current/20 font-sans font-bold"
                    />
                </div>

                <div className="mt-4">
                    <textarea
                        placeholder="Begin transmission..."
                        rows={12}
                        className="bg-transparent border-none outline-none text-sm w-full placeholder-current/10 resize-none leading-relaxed font-sans"
                    ></textarea>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 border border-current/10 rounded-full text-xs font-mono uppercase hover:bg-current/5 transition-all"
                    >
                        Discard
                    </button>
                    <button
                        onClick={onSend}
                        className={`px-8 py-2 rounded-full text-xs font-bold uppercase transition-all shadow-xl hover:-translate-y-1
              ${isDark ? 'bg-white text-black hover:shadow-white/20' : 'bg-black text-white hover:shadow-black/20'}`}
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComposeView;
