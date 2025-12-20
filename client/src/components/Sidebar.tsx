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
      className="flex flex-col w-[260px] h-full glass border-r border-white/5 flex-shrink-0"
      data-testid="sidebar-container"
    >
      <div className="p-5 border-b border-white/5">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          <span className="text-violet-400">i</span>.M
        </h1>
      </div>
      
      <nav className="flex-1 p-3 space-y-1" data-testid="nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeFolder === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onFolderChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active-press",
                isActive
                  ? "bg-violet-500/15 text-white border-l-2 border-violet-500 -ml-[2px] pl-[14px]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
              data-testid={`nav-${item.id}`}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", isActive && "text-violet-400")} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-md font-medium",
                    isActive
                      ? "bg-violet-500/20 text-violet-300"
                      : "bg-white/5 text-gray-500"
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-lg glass-card">
          <div className="flex items-center gap-2 flex-1">
            <Video className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">
              Video Room
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Circle
              className={cn(
                "w-2.5 h-2.5 fill-current transition-colors duration-200",
                isOnline ? "text-emerald-400" : "text-gray-600"
              )}
            />
            <Switch
              checked={isOnline}
              onCheckedChange={onToggleOnline}
              data-testid="switch-online-status"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {isOnline ? "You're visible to clients" : "Offline mode"}
        </p>
      </div>
    </aside>
  );
}
