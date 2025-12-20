import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Command, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandBarProps {
  onCompose: () => void;
}

export interface CommandBarRef {
  focus: () => void;
}

export const CommandBar = forwardRef<CommandBarRef, CommandBarProps>(function CommandBar({ onCompose }, ref) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 1500);
  };

  return (
    <div
      className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50 pointer-events-none"
      data-testid="command-bar"
    >
      <div
        className={cn(
          "pointer-events-auto glass-sexy rounded-full p-1.5 pl-7 flex items-center gap-4 transition-all duration-500",
          isFocused && "ring-2 ring-primary/30"
        )}
        style={{
          boxShadow: isFocused 
            ? "0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.2)"
            : undefined
        }}
      >
        <form onSubmit={handleSearch} className="flex items-center flex-1">
          <div className="flex items-center gap-3 flex-1">
            {isSearching ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : (
              <Command size={16} className={cn(
                "text-slate-400 dark:text-slate-500 transition-colors",
                isFocused && "text-primary"
              )} />
            )}
            <input
              ref={inputRef}
              id="command-bar"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Synthesize command..."
              className="flex-1 bg-transparent text-[14px] font-light outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 h-9"
              data-testid="input-search"
            />
          </div>
        </form>

        <button
          onClick={onCompose}
          className="h-9 w-9 bg-slate-900 dark:bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 shadow-xl transition-all"
          data-testid="button-compose"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});
