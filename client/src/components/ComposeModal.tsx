import React from 'react';
import { X, Minimize2, Maximize2, Paperclip, Image, Link2, Bold, Italic, Send } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    isMobile: boolean;
}

const ComposeModal: React.FC<Props> = ({ isOpen, onClose, isDarkMode, isMobile }) => {
    if (!isOpen) return null;

    const bgClass = isDarkMode
        ? "bg-[#0A0A0A]/80 border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        : "bg-white/80 border-white/40 text-slate-800 shadow-2xl";

    const inputClass = isDarkMode
        ? "placeholder-white/20 text-white border-white/5 focus:border-white/20"
        : "placeholder-black/20 text-slate-800 border-black/5 focus:border-black/10";

    // Desktop classes now use 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' to center the modal
    const mobileClasses = isMobile
        ? "fixed inset-0 z-[100] rounded-none animate-in slide-in-from-bottom duration-300"
        : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-2xl z-50 animate-in zoom-in-95 duration-200 fade-in";

    return (
        <div className={`flex flex-col border backdrop-blur-2xl ${bgClass} ${mobileClasses}`}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 select-none">
                <span className="text-[12px] font-mono font-bold tracking-widest uppercase opacity-50">New Message</span>
                <div className="flex items-center gap-2">
                    {!isMobile && (
                        <>
                            <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors"><Minimize2 size={14} className="opacity-50" /></button>
                            <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors"><Maximize2 size={14} className="opacity-50" /></button>
                        </>
                    )}
                    <button onClick={onClose} className="p-1.5 hover:bg-red-500/20 hover:text-red-500 rounded-md transition-colors">
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Inputs */}
            <div className="flex flex-col px-6 py-4 gap-4 flex-1 overflow-y-auto">
                <div className="space-y-1">
                    <input
                        type="text"
                        placeholder="Recipients"
                        className={`w-full bg-transparent border-b py-2 text-sm outline-none transition-colors font-mono ${inputClass}`}
                        autoFocus
                    />
                </div>
                <div className="space-y-1">
                    <input
                        type="text"
                        placeholder="Subject"
                        className={`w-full bg-transparent border-b py-2 text-lg font-medium outline-none transition-colors ${inputClass}`}
                    />
                </div>

                {/* Editor Toolbar */}
                <div className="flex items-center gap-1 py-2 opacity-50">
                    <button className="p-1.5 hover:bg-white/10 rounded"><Bold size={14} /></button>
                    <button className="p-1.5 hover:bg-white/10 rounded"><Italic size={14} /></button>
                    <div className="w-px h-3 bg-current mx-1 opacity-20"></div>
                    <button className="p-1.5 hover:bg-white/10 rounded"><Link2 size={14} /></button>
                    <button className="p-1.5 hover:bg-white/10 rounded"><Image size={14} /></button>
                    <button className="p-1.5 hover:bg-white/10 rounded"><Paperclip size={14} /></button>
                </div>

                <textarea
                    className={`w-full flex-1 bg-transparent resize-none outline-none leading-relaxed opacity-90 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}
                    placeholder="Write your message..."
                />
            </div>

            {/* Footer */}
            <div className="p-4 flex items-center justify-between border-t border-white/5">
                <span className="text-[10px] opacity-30 font-mono">Draft saved 10:24 AM</span>

                <button
                    onClick={onClose}
                    className={`
            px-6 py-2 rounded-lg flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all active:scale-95
            ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}
          `}
                >
                    <span>Send</span>
                    <Send size={12} />
                </button>
            </div>
        </div>
    );
};

export default ComposeModal;
