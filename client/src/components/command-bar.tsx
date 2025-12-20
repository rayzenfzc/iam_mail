import { useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandBarProps {
  onCompose: () => void;
}

export function CommandBar({ onCompose }: CommandBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

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
          "flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full px-2 py-1.5 shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-200",
          isFocused && "ring-2 ring-slate-900/10 dark:ring-slate-100/10"
        )}
      >
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="flex items-center gap-2 px-3">
            {isSearching ? (
              <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-slate-400" />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search with AI..."
              className="w-64 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none"
              data-testid="input-search"
            />
          </div>
        </form>

        <button
          onClick={onCompose}
          className="w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
          data-testid="button-compose"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
