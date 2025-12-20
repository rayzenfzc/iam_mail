import { formatDistanceToNow } from "date-fns";
import { Circle, FileText, AlertTriangle, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Email } from "@shared/schema";

interface InboxListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
  activeCategory: "focus" | "other";
  onCategoryChange: (category: "focus" | "other") => void;
  isLoading: boolean;
  error?: Error | null;
}

export function InboxList({
  emails,
  selectedEmailId,
  onSelectEmail,
  activeCategory,
  onCategoryChange,
  isLoading,
  error,
}: InboxListProps) {
  return (
    <div
      className="flex flex-col w-[350px] h-full bg-[#f8fafc] dark:bg-slate-800 border-r border-[#e2e8f0] dark:border-slate-700 flex-shrink-0"
      data-testid="email-list-container"
    >
      <div className="flex items-center gap-1 p-3 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => onCategoryChange("focus")}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
            "hover-elevate active-elevate-2",
            activeCategory === "focus"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400"
          )}
          data-testid="tab-focus"
        >
          Focus
        </button>
        <button
          onClick={() => onCategoryChange("other")}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
            "hover-elevate active-elevate-2",
            activeCategory === "other"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400"
          )}
          data-testid="tab-other"
        >
          Other
        </button>
      </div>

      <div className="flex-1 overflow-y-auto" data-testid="email-list">
        {isLoading ? (
          <div className="p-3 space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-3 space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">
              Connection Error
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-[200px]">
              Check your IMAP credentials in Secrets panel
            </p>
          </div>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No emails in this folder
            </p>
          </div>
        ) : (
          emails.map((email) => (
            <EmailListItem
              key={email.id}
              email={email}
              isSelected={selectedEmailId === email.id}
              onSelect={() => onSelectEmail(email.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  onSelect: () => void;
}

function EmailListItem({ email, isSelected, onSelect }: EmailListItemProps) {
  const emailDate = email.timestamp;
  const timeAgo = emailDate 
    ? formatDistanceToNow(new Date(emailDate), { addSuffix: true })
    : "";

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-3 border-b border-slate-100 dark:border-slate-700/50 transition-colors",
        "hover-elevate active-elevate-2",
        isSelected && "bg-slate-50 dark:bg-slate-700/50",
        !email.isRead && "bg-slate-50/50 dark:bg-slate-800/50"
      )}
      data-testid={`email-item-${email.id}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-400 dark:to-slate-600 flex items-center justify-center text-white dark:text-slate-900 text-sm font-medium">
            {email.sender.charAt(0).toUpperCase()}
          </div>
          {email.isOnline && (
            <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-green-500 text-green-500 stroke-white dark:stroke-slate-800 stroke-2" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span
              className={cn(
                "text-sm truncate",
                !email.isRead
                  ? "font-semibold text-slate-900 dark:text-slate-100"
                  : "font-medium text-slate-700 dark:text-slate-300"
              )}
            >
              {email.sender}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {email.folder === "sent" && email.readAt && (
                <CheckCheck className="w-3.5 h-3.5 text-green-500" data-testid={`read-receipt-${email.id}`} />
              )}
              {email.hasQuoteOpen && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
                  Quote Open
                </span>
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {timeAgo.replace(" ago", "")}
              </span>
            </div>
          </div>

          <p
            className={cn(
              "text-sm truncate mb-0.5",
              !email.isRead
                ? "text-slate-800 dark:text-slate-200"
                : "text-slate-600 dark:text-slate-400"
            )}
          >
            {email.subject}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {email.preview}
          </p>
        </div>
      </div>
    </button>
  );
}
