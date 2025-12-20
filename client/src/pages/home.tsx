import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { InboxList } from "@/components/InboxList";
import { ReadingPane } from "@/components/ReadingPane";
import { CommandBar } from "@/components/CommandBar";
import { Composer } from "@/components/composer";
import type { Email } from "@shared/schema";

export default function Home() {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [activeCategory, setActiveCategory] = useState<"focus" | "other">("focus");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const { data: emails = [], isLoading } = useQuery<Email[]>({
    queryKey: ["/api/emails"],
  });

  const filteredEmails = emails.filter(
    (email) => email.folder === activeFolder && email.category === activeCategory
  );

  const selectedEmail = emails.find((e) => e.id === selectedEmailId);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900" data-testid="main-container">
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
      />

      <ReadingPane
        email={selectedEmail}
        onClose={() => setSelectedEmailId(null)}
      />

      <CommandBar onCompose={() => setIsComposerOpen(true)} />

      <Composer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
      />
    </div>
  );
}
