import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { InboxList } from "@/components/InboxList";
import { ReadingPane } from "@/components/ReadingPane";
import { CommandBar, CommandBarRef } from "@/components/CommandBar";
import { Composer } from "@/components/composer";
import { useHotkeys } from "@/hooks/useHotkeys";
import type { Email } from "@shared/schema";

export default function Home() {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [activeCategory, setActiveCategory] = useState<"focus" | "other">("focus");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [useImap, setUseImap] = useState(true);
  
  const commandBarRef = useRef<CommandBarRef>(null);

  useHotkeys([
    { key: "k", ctrl: true, handler: () => commandBarRef.current?.focus() },
    { key: "c", handler: () => setIsComposerOpen(true) },
    { key: "e", handler: () => console.log("Archive action") },
    { key: "r", handler: () => console.log("Reply action") },
    { key: "f", handler: () => console.log("Forward action") },
  ]);

  const { data: emails = [], isLoading, error } = useQuery<Email[]>({
    queryKey: [useImap ? "/api/imap/emails" : "/api/emails"],
    retry: false,
  });

  const filteredEmails = emails.filter(
    (email) => email.folder === activeFolder && email.category === activeCategory
  );

  const selectedEmail = emails.find((e) => e.id === selectedEmailId);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300" data-testid="main-container">
      <div className="desktop-bg" />
      <div className="grain-overlay" />
      
      <Sidebar
        activeFolder={activeFolder}
        onFolderChange={setActiveFolder}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
      />

      <InboxList
        emails={filteredEmails}
        selectedEmailId={selectedEmailId}
        onSelectEmail={setSelectedEmailId}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        isLoading={isLoading}
        error={error as Error | null}
      />

      <ReadingPane
        email={selectedEmail}
        onClose={() => setSelectedEmailId(null)}
      />

      <CommandBar ref={commandBarRef} onCompose={() => setIsComposerOpen(true)} />

      <Composer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
      />
    </div>
  );
}
