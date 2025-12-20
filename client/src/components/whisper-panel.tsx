import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { X, Send, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Comment } from "@shared/schema";

interface WhisperPanelProps {
  emailId: string;
  onClose: () => void;
}

export function WhisperPanel({ emailId, onClose }: WhisperPanelProps) {
  const [newComment, setNewComment] = useState("");

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: [`/api/comments?emailId=${emailId}`],
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/comments", {
        emailId,
        author: "You",
        authorAvatar: null,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/comments?emailId=${emailId}`] });
      setNewComment("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment.mutate(newComment.trim());
    }
  };

  return (
    <div
      className="absolute right-0 top-0 bottom-0 w-80 bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col shadow-lg"
      data-testid="whisper-panel"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <AtSign className="w-4 h-4 text-slate-500" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            The Whisper
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7"
          data-testid="button-close-whisper"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Internal comments - clients cannot see this
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <AtSign className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No internal comments yet
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Use @mentions to notify team members
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-400 dark:to-slate-600 flex items-center justify-center text-white dark:text-slate-900 text-xs font-medium flex-shrink-0">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {comment.author}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      >
        <div className="flex items-center gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="@Team Can we discount this?"
            className="flex-1 h-9 text-sm"
            data-testid="input-whisper-comment"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newComment.trim() || addComment.isPending}
            data-testid="button-send-whisper"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
