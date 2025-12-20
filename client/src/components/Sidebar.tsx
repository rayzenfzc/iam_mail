import { Inbox, Send, FileText, Shield, Video, Circle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeFolder: string;
  onFolderChange: (folder: string) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
}

const navItems = [
  { id: "inbox", label: "Inbox", icon: Inbox, count: 12 },
  { id: "sent", label: "Sent", icon: Send },
  { id: "drafts", label: "Drafts", icon: FileText, count: 3 },
  { id: "shield", label: "The Shield", icon: Shield, count: 5 },
];

export function Sidebar({
  activeFolder,
  onFolderChange,
  isOnline,
  onToggleOnline,
}: SidebarProps) {
  return (
    <aside
      className="flex flex-col w-[260px] h-full bg-[#f8fafc] dark:bg-slate-800 border-r border-[#e2e8f0] dark:border-slate-700 flex-shrink-0"
      data-testid="sidebar-container"
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">i.M</h1>
      </div>
      <nav className="flex-1 p-2" data-testid="nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeFolder === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onFolderChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                "hover-elevate active-elevate-2",
                isActive
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400"
              )}
              data-testid={`nav-${item.id}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-md font-medium",
                    isActive
                      ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
          <div className="flex items-center gap-2 flex-1">
            <Video className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Video Room
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Circle
              className={cn(
                "w-2.5 h-2.5 fill-current",
                isOnline ? "text-green-500" : "text-slate-400"
              )}
            />
            <Switch
              checked={isOnline}
              onCheckedChange={onToggleOnline}
              data-testid="switch-online-status"
            />
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          {isOnline ? "You're visible to clients" : "Offline mode"}
        </p>
      </div>
    </aside>
  );
}
