import { useEffect, useCallback } from "react";

type HotkeyHandler = () => void;

interface HotkeyConfig {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  handler: HotkeyHandler;
}

export function useHotkeys(configs: HotkeyConfig[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

    for (const config of configs) {
      const ctrlOrMeta = config.ctrl || config.meta;
      const matchesModifier = ctrlOrMeta 
        ? (event.ctrlKey || event.metaKey)
        : (!event.ctrlKey && !event.metaKey);
      
      const matchesShift = config.shift ? event.shiftKey : !event.shiftKey;
      const matchesKey = event.key.toLowerCase() === config.key.toLowerCase();

      if (matchesKey && matchesModifier && matchesShift) {
        if (ctrlOrMeta || !isInput) {
          event.preventDefault();
          event.stopPropagation();
          config.handler();
          return;
        }
      }
    }
  }, [configs]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [handleKeyDown]);
}
