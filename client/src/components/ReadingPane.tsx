import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Reply,
  Forward,
  Video,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ListTodo,
  MessageSquare,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { WhisperPanel } from "@/components/whisper-panel";
import type { Email } from "@shared/schema";

interface ReadingPaneProps {
  email: Email | undefined;
  onClose: () => void;
}

const avatarGradients = [
  "gradient-avatar",
  "gradient-avatar-alt", 
  "gradient-avatar-green",
];

function getAvatarGradient(name: string) {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarGradients[hash % avatarGradients.length];
}

export function ReadingPane({ email, onClose }: ReadingPaneProps) {
  const [isAnalystOpen, setIsAnalystOpen] = useState(false);
  const [isWhisperOpen, setIsWhisperOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiTasks, setAiTasks] = useState<string[] | null>(null);

  useEffect(() => {
    if (email?.summary) {
      setIsAnalystOpen(true);
    } else {
      setIsAnalystOpen(false);
    }
    setAiSummary(null);
    setAiTasks(null);
  }, [email?.id]);

  if (!email) {
    return (
      <div
        className="flex-1 flex items-center justify-center bg-white dark:bg-slate-950"
        data-testid="email-view-empty"
      >
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-10 h-10 text-slate-400 dark:text-slate-600" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Select an email to read
          </p>
        </div>
      </div>
    );
  }

  const handleSummarize = () => {
    setAiSummary(
      `This email from ${email.sender} discusses the project timeline and requests feedback on the proposed deliverables. Key points include budget considerations and next steps for approval.`
    );
  };

  const handleExtractTasks = () => {
    setAiTasks([
      "Review attached proposal document",
      "Schedule follow-up meeting for next week",
      "Send updated budget estimates",
      "Confirm stakeholder availability",
    ]);
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 relative" data-testid="email-view-container">
      <div
        className={cn(
          "border-b pane-border transition-all duration-200",
          isAnalystOpen ? "bg-slate-50 dark:bg-white/[0.02]" : ""
        )}
      >
        <button
          onClick={() => setIsAnalystOpen(!isAnalystOpen)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
          data-testid="button-analyst-toggle"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            <span>AI Analyst</span>
          </div>
          {isAnalystOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {isAnalystOpen && (
          <div className="px-5 pb-4 space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSummarize}
                className="pane-border bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white active-press"
                data-testid="button-summarize"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-violet-500 dark:text-violet-400" />
                Summarize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExtractTasks}
                className="pane-border bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white active-press"
                data-testid="button-extract-tasks"
              >
                <ListTodo className="w-3.5 h-3.5 mr-1.5 text-violet-500 dark:text-violet-400" />
                Extract Tasks
              </Button>
            </div>

            {(email.summary || aiSummary) && (
              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-900 pane-border border">
                <p className="text-xs font-medium text-slate-500 mb-2">Summary</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{email.summary || aiSummary}</p>
              </div>
            )}

            {aiTasks && (
              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-900 pane-border border">
                <p className="text-xs font-medium text-slate-500 mb-3">Extracted Tasks</p>
                <ul className="space-y-2">
                  {aiTasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-5 h-5 rounded bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-xs font-medium text-violet-600 dark:text-violet-400 flex-shrink-0">
                        {i + 1}
                      </span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-b pane-border">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white truncate flex-1 mr-4">
          {email.subject}
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 active-press" data-testid="button-reply">
            <Reply className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 active-press" data-testid="button-forward">
            <Forward className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-slate-500 dark:text-slate-400 active-press",
              email.isOnline && "text-emerald-500 dark:text-emerald-400"
            )}
            data-testid="button-video-call"
          >
            <Video className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsWhisperOpen(!isWhisperOpen)}
            className={cn(
              "text-slate-500 dark:text-slate-400 active-press",
              isWhisperOpen && "bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400"
            )}
            data-testid="button-whisper-toggle"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 active-press" data-testid="button-more-options">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative flex-shrink-0">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold",
                getAvatarGradient(email.sender)
              )}>
                {email.sender.charAt(0).toUpperCase()}
              </div>
              {email.isOnline && (
                <Circle className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 fill-emerald-400 text-emerald-400 stroke-white dark:stroke-slate-950 stroke-2" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {email.sender}
                </span>
                {email.isOnline && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    Online
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {email.senderEmail}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {format(new Date(email.timestamp), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>

          <div
            className="prose prose-slate dark:prose-invert prose-sm max-w-none prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-violet-600 dark:prose-a:text-violet-400"
            dangerouslySetInnerHTML={{ __html: email.body }}
            data-testid="email-body"
          />
        </div>
      </ScrollArea>

      {isWhisperOpen && (
        <WhisperPanel emailId={email.id} onClose={() => setIsWhisperOpen(false)} />
      )}
    </div>
  );
}
