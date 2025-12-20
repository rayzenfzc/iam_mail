import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
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
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      data-testid="command-bar"
    >
      <div
        className={cn(
          "flex items-center gap-2 bg-black/80 backdrop-blur-2xl rounded-full px-2 py-1.5 border border-white/10 transition-all duration-200",
          isFocused && "ring-2 ring-violet-500/30 border-violet-500/30 glow-purple"
        )}
        style={{
          boxShadow: isFocused 
            ? "0 0 40px rgba(139, 92, 246, 0.2), 0 10px 40px rgba(0, 0, 0, 0.5)"
            : "0 10px 40px rgba(0, 0, 0, 0.5)"
        }}
      >
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="flex items-center gap-2 px-3">
            {isSearching ? (
              <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-gray-500" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search with AI..."
              className="w-64 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
              data-testid="input-search"
            />
          </div>
        </form>

        <button
          onClick={onCompose}
          className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center text-white transition-all duration-200 hover:bg-violet-400 active:scale-95 flex-shrink-0 glow-purple"
          data-testid="button-compose"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});
