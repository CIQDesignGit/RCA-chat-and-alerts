import { Bell, HelpCircle, Settings, Rocket, MessageSquare } from "lucide-react";

// Top-right icon bar — mirrors the header icons in the screenshot
export function TopBar() {
  return (
    <header className="flex items-center justify-end gap-1 border-b bg-background px-4 py-2">
      {/* Notification bell with unread badge */}
      <button
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
          8
        </span>
      </button>

      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100"
        aria-label="Help"
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5" />
      </button>

      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100"
        aria-label="Launch"
      >
        <Rocket className="h-5 w-5" />
      </button>

      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100"
        aria-label="Chat"
      >
        <MessageSquare className="h-5 w-5" />
      </button>

      {/* User avatar — initials in a colored circle */}
      <button
        className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white"
        aria-label="Profile"
      >
        MP
      </button>
    </header>
  );
}
