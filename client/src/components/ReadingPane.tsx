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
        className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900"
        data-testid="email-view-empty"
      >
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600" />
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
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 relative" data-testid="email-view-container">
      <div
        className={cn(
          "border-b border-slate-200 dark:border-slate-700 transition-all duration-200",
          isAnalystOpen ? "bg-slate-50 dark:bg-slate-700/50" : ""
        )}
      >
        <button
          onClick={() => setIsAnalystOpen(!isAnalystOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover-elevate"
          data-testid="button-analyst-toggle"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Analyst</span>
          </div>
          {isAnalystOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {isAnalystOpen && (
          <div className="px-4 pb-3 space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSummarize}
                data-testid="button-summarize"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Summarize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExtractTasks}
                data-testid="button-extract-tasks"
              >
                <ListTodo className="w-3.5 h-3.5 mr-1.5" />
                Extract Tasks
              </Button>
            </div>

            {(email.summary || aiSummary) && (
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Summary</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{email.summary || aiSummary}</p>
              </div>
            )}

            {aiTasks && (
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Extracted Tasks</p>
                <ul className="space-y-1.5">
                  {aiTasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-500 flex-shrink-0">
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

      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate flex-1 mr-4">
          {email.subject}
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" data-testid="button-reply">
            <Reply className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-forward">
            <Forward className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(email.isOnline && "text-green-600 dark:text-green-500")}
            data-testid="button-video-call"
          >
            <Video className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsWhisperOpen(!isWhisperOpen)}
            className={cn(isWhisperOpen && "bg-slate-100 dark:bg-slate-700")}
            data-testid="button-whisper-toggle"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-more-options">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="flex items-start gap-3 mb-6">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-400 dark:to-slate-600 flex items-center justify-center text-white dark:text-slate-900 font-medium">
                {email.sender.charAt(0).toUpperCase()}
              </div>
              {email.isOnline && (
                <Circle className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 fill-green-500 text-green-500 stroke-white dark:stroke-slate-800 stroke-2" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {email.sender}
                </span>
                {email.isOnline && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
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
            className="prose prose-slate dark:prose-invert prose-sm max-w-none"
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
