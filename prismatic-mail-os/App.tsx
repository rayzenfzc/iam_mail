import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { EmailCard } from './components/EmailCard';
import { CalendarWidget } from './components/CalendarWidget';
import { Dock } from './components/Dock';
import { MOCK_EMAILS } from './constants';
import { ActiveModule, Email } from './types';
import { GeminiService } from './services/geminiService';
import { Sparkles, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>(ActiveModule.MAIL);
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const geminiService = useMemo(() => new GeminiService(), []);

  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    const result = await geminiService.searchEmails(query, emails);
    setAiResponse(result);
    setIsSearching(false);
  }, [emails, geminiService]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setParallax({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      
      <div className="flex w-full h-[90vh] max-w-[1600px] gap-0 relative">
        
        {/* LEFT SLAB (Sidebar) - Glass Black on White bg */}
        <aside 
          className="w-[420px] h-full ml-[5vw] bg-black/[0.04] backdrop-blur-[40px] border border-black/10 text-black z-20 p-12 slab-transition shadow-2xl"
          style={{ transform: `translate(${parallax.x * 0.4}px, ${parallax.y * 0.4}px)` }}
        >
          <Sidebar activeModule={activeModule} onSelect={setActiveModule} />
        </aside>

        {/* RIGHT SLAB (Content Area) - Glass White on Black bg */}
        <main 
          className="flex-grow h-full ml-[-2rem] mr-[5vw] bg-white/[0.04] backdrop-blur-[60px] border border-white/10 z-10 p-16 slab-transition flex flex-col relative overflow-hidden"
          style={{ transform: `translate(${parallax.x * -0.2}px, ${parallax.y * -0.2}px)` }}
        >
          {/* AI Feedback Overlay */}
          {aiResponse && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[90%] z-[60] animate-in fade-in slide-in-from-top-6 duration-700">
              <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-8 shadow-2xl relative">
                <button 
                  onClick={() => setAiResponse(null)}
                  className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3 text-white mb-4">
                  <Sparkles size={20} className="text-[#00ff88]" />
                  <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase opacity-40">Synthetic Logic Engine</span>
                </div>
                <p className="text-[14px] text-white/90 leading-relaxed font-light italic">
                  "{aiResponse}"
                </p>
              </div>
            </div>
          )}

          <header className="mb-16">
            <span className="font-mono text-[12px] opacity-40 tracking-[0.2em] uppercase mb-4 block">Protocol // 001</span>
            <h1 className="text-[80px] font-extrabold text-white leading-[0.8] tracking-tighter mb-6">
              OBSIDIAN<br/>INVERSION
            </h1>
            <p className="text-white/40 text-[14px] max-w-sm leading-relaxed font-light">
              Vitreous module interaction patterns designed for focus-intensive communication. Propagating planar depth through high-contrast refraction.
            </p>
          </header>

          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pb-[220px]">
             <div className="grid grid-cols-1 gap-4">
              {emails.map((email) => (
                <EmailCard key={email.id} email={email} onClick={() => {}} />
              ))}
            </div>
          </div>

          <div className="mt-auto flex gap-16 pt-8 border-t border-white/5 relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div>
              <div className="font-mono text-[9px] opacity-30 uppercase tracking-widest mb-1">Latency</div>
              <div className="text-[20px] font-bold text-white">14ms</div>
            </div>
            <div>
              <div className="font-mono text-[9px] opacity-30 uppercase tracking-widest mb-1">Uptime</div>
              <div className="text-[20px] font-bold text-white">99.98%</div>
            </div>
          </div>
        </main>
      </div>

      {/* Utilities Overlay (Calendar) */}
      <div 
        className="fixed top-12 right-12 w-[320px] z-30 slab-transition"
        style={{ transform: `translate(${parallax.x * -0.3}px, ${parallax.y * -0.3}px)` }}
      >
        <CalendarWidget />
      </div>

      {/* Achromatic Dock */}
      <Dock onSearch={handleSearch} isSearching={isSearching} />
    </div>
  );
};

export default App;