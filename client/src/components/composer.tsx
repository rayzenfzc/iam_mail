import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  X,
  Send,
  Sparkles,
  Calendar,
  DollarSign,
  Paperclip,
  Bold,
  Italic,
  List,
  Link,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface ComposerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Composer({ isOpen, onClose }: ComposerProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const sendEmail = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/smtp/send", {
        to,
        subject,
        body: body,
        html: `<p>${body.replace(/\n/g, "</p><p>")}</p>`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["/api/imap/emails"], exact: false });
      handleClose();
    },
  });

  const handleClose = () => {
    setTo("");
    setSubject("");
    setBody("");
    onClose();
  };

  const handleAiDraft = () => {
    setIsAiProcessing(true);
    setTimeout(() => {
      setBody(
        "Dear valued client,\n\nThank you for reaching out. I've reviewed your request and would be happy to discuss the next steps.\n\nPlease let me know your availability for a quick call this week.\n\nBest regards"
      );
      setIsAiProcessing(false);
    }, 1000);
  };

  const handleInsertCalendar = () => {
    setBody((prev) => prev + "\n\n[Calendar Grid - Select a time slot below]\n\n📅 Monday: 9am | 11am | 2pm | 4pm\n📅 Tuesday: 10am | 1pm | 3pm\n📅 Wednesday: 9am | 2pm | 4pm\n");
  };

  const handleInsertQuote = () => {
    setBody((prev) => prev + "\n\n[Dynamic Quote Card]\n━━━━━━━━━━━━━━━━━━\nEnterprise Package\nPrice: $4,999/month\nStatus: Live Quote\n━━━━━━━━━━━━━━━━━━\n");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden"
        data-testid="composer-dialog"
      >
        <DialogHeader className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              New Message
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-7 w-7 -mr-2"
              data-testid="button-close-composer"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col">
          <div className="border-b border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center px-4">
              <span className="text-sm text-slate-500 dark:text-slate-400 w-12">To:</span>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="border-0 focus-visible:ring-0 px-0 h-10"
                data-testid="input-to"
              />
            </div>
          </div>

          <div className="border-b border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center px-4">
              <span className="text-sm text-slate-500 dark:text-slate-400 w-12">Subject:</span>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="border-0 focus-visible:ring-0 px-0 h-10"
                data-testid="input-subject"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 dark:border-slate-700/50">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Bold className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Italic className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <List className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Link className="w-3.5 h-3.5" />
            </Button>
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Paperclip className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            className="min-h-[240px] border-0 focus-visible:ring-0 resize-none rounded-none text-sm"
            data-testid="input-body"
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAiDraft}
                  disabled={isAiProcessing}
                  data-testid="button-ai-draft"
                >
                  {isAiProcessing ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  AI Draft
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate AI-powered email draft</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInsertCalendar}
                  data-testid="button-insert-calendar"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  Calendar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert calendar grid for booking</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInsertQuote}
                  data-testid="button-insert-quote"
                >
                  <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                  Quote
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert dynamic price quote</TooltipContent>
            </Tooltip>
          </div>

          <Button
            onClick={() => sendEmail.mutate()}
            disabled={!to || !subject || !body || sendEmail.isPending}
            data-testid="button-send-email"
          >
            {sendEmail.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
