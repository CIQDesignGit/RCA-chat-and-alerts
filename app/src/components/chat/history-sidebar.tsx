"use client";

// HistorySidebar — left panel of the Chat page.
// Collapses to a 48px strip (toggle button only) when isCollapsed = true.
// Expands back to 300px showing full content.

import { useState } from "react";
import { AlignJustify, PenLine, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatSession } from "@/lib/chat-store";

// ── Brand-specific sequential diagnostic prompt flows ─────────────────────────

const BRAND_FLOWS: Record<string, string[]> = {
  Ninja: [
    "For the brand Ninja, which category had the largest gap to sales plan last week?",
    "For the category that had the largest gap to sales plan, which SKUs missed the plan the most?",
    "Run root cause analysis for the worst performing SKU in this category?",
    "What is the projected gap to sales plan for this SKU this week?",
    "Show the current Digital Shelf Health of this SKU?",
    "Show the last 8 week trend of gap to sales plan for this SKU?",
  ],
  Shark: [
    "For the brand Shark, which category had the largest gap to sales plan last week?",
    "For the category that had the largest gap to sales plan, which SKUs missed the plan the most?",
    "Run root cause analysis for the worst performing SKU in this category?",
    "What is the projected gap to sales plan for this SKU this week?",
    "Show the current Digital Shelf Health of this SKU?",
    "Show the last 8 week trend of gap to sales plan for this SKU?",
  ],
};

const BRANDS = Object.keys(BRAND_FLOWS);

// ── Helpers ───────────────────────────────────────────────────────────────────

// Formats as "May 17, '26 · 6:44 PM"
function formatSessionDate(isoString: string): string {
  const d = new Date(isoString);
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  const year = d.getFullYear().toString().slice(2);
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${month} ${day}, '${year} · ${time}`;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface HistorySidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onSelectPrompt: (prompt: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HistorySidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onSelectPrompt,
}: HistorySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"prompts" | "history">("history");
  const [activeBrand, setActiveBrand] = useState<string>(BRANDS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter sessions by title when the user types in the search box
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-slate-200 bg-slate-50 transition-all duration-200",
        isCollapsed ? "w-12 overflow-hidden" : "w-[300px]",
      )}
    >
      {/* ── Header — always visible ── */}
      <div
        className={cn(
          "flex items-center pt-4 pb-3",
          isCollapsed ? "justify-center px-0" : "justify-between px-4",
        )}
      >
        {!isCollapsed && (
          <span className="text-sm font-medium text-slate-500">Ask AI</span>
        )}
        <button
          onClick={() => setIsCollapsed((p) => !p)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
        >
          <AlignJustify className="h-4 w-4" />
        </button>
      </div>

      {/* ── Content — hidden when collapsed ── */}
      {!isCollapsed && (
        <>
          {/* New Chat row */}
          <div className="px-4 pb-4">
            <button
              onClick={onNewChat}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900"
            >
              <PenLine className="h-4 w-4 text-violet-600" />
              New Chat
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 px-4">
            {(["prompts", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "mr-6 pb-2.5 text-sm transition-colors",
                  activeTab === tab
                    ? "border-b-2 border-violet-600 font-medium text-slate-900"
                    : "font-normal text-slate-400 hover:text-slate-600",
                )}
              >
                {tab === "prompts" ? "Popular Prompts" : "History"}
              </button>
            ))}
          </div>

          {/* Popular Prompts tab */}
          {activeTab === "prompts" && (
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Brand filter chips */}
              <div className="flex gap-2 px-4 pt-3 pb-2">
                {BRANDS.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setActiveBrand(brand)}
                    className={cn(
                      "rounded-lg border px-3 py-1 text-xs font-medium transition-colors",
                      activeBrand === brand
                        ? "border-transparent bg-violet-100 text-violet-700"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-800",
                    )}
                  >
                    RCA ({brand})
                  </button>
                ))}
              </div>

              {/* Prompt cards */}
              <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden">
                <div className="flex flex-col gap-2">
                  {BRAND_FLOWS[activeBrand].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => onSelectPrompt(prompt)}
                      className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-left text-sm leading-snug text-slate-700 shadow-sm transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* History tab */}
          {activeTab === "history" && (
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Search input */}
              <div className="relative px-4 pt-3 pb-2">
                <Search className="pointer-events-none absolute left-7 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
              </div>

              {/* Session list */}
              <div className="flex-1 overflow-y-auto px-2 pb-3 scrollbar-none [&::-webkit-scrollbar]:hidden">
                {filteredSessions.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-400">
                    {searchQuery
                      ? "No matching conversations."
                      : "No conversations yet."}
                  </p>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    {filteredSessions.map((session) => {
                      const isActive = session.id === activeSessionId;
                      return (
                        <button
                          key={session.id}
                          onClick={() => onSelectSession(session.id)}
                          className={cn(
                            "flex w-full flex-col items-start rounded-lg px-3 py-2.5 text-left transition-colors",
                            isActive
                              ? "bg-slate-200 text-slate-900"
                              : "text-slate-700 hover:bg-slate-100",
                          )}
                        >
                          <span className="line-clamp-2 text-sm leading-snug">
                            {session.title}
                          </span>
                          <span className="mt-0.5 text-[11px] text-slate-400">
                            {formatSessionDate(session.updatedAt)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
