import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { Plus, Search, Mail, Clock, Calendar, Archive, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";

interface CommandBarProps {
  onCompose: () => void;
}

export interface CommandBarRef {
  focus: () => void;
}

export const CommandBar = forwardRef<CommandBarRef, CommandBarProps>(function CommandBar({ onCompose }, ref) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
      setOpen(true);
    },
  }));

  return (
    <div
      className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
      data-testid="command-bar"
    >
      <div className="relative">
        {open && (
          <div className="absolute bottom-full left-0 w-full mb-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <Command className="bg-transparent border-none">
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Actions">
                  <CommandItem onSelect={() => console.log("Snooze")}>
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Snooze 3h</span>
                    <CommandShortcut>⌘S</CommandShortcut>
                  </CommandItem>
                  <CommandItem onSelect={() => console.log("Remind")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Remind tomorrow 9am</span>
                    <CommandShortcut>⌘R</CommandShortcut>
                  </CommandItem>
                  <CommandItem onSelect={() => console.log("Archive All")}>
                    <Archive className="mr-2 h-4 w-4" />
                    <span>Archive all from newsletters</span>
                  </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Navigation">
                  <CommandItem onSelect={onCompose}>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Compose new email</span>
                    <CommandShortcut>C</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}

        <div
          className={cn(
            "glass-sexy rounded-full p-1.5 pl-5 flex items-center gap-2 transition-all duration-500",
            open ? "ring-2 ring-primary/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)]" : "shadow-xl"
          )}
        >
          <Search className={cn("w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors", open && "text-primary")} />
          <Command className="bg-transparent border-none flex-1">
            <CommandInput
              ref={inputRef}
              placeholder="Synthesize command..."
              className="h-9 border-none focus:ring-0 text-[14px] font-light bg-transparent"
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 200)} // Delay to allow click
            />
          </Command>

          <button
            onClick={onCompose}
            className="h-9 w-9 bg-slate-900 dark:bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg transition-all flex-shrink-0"
            data-testid="button-compose"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
});
