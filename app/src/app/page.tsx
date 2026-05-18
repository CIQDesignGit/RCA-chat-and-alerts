"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pin, X } from "lucide-react";
import { AlertsPanel } from "@/components/home/alerts-panel";
import { BusinessLevelInsights } from "@/components/home/business-level-insights";
import { AlertDetailsPanel } from "@/components/alerts/alert-details-panel";
import { FilterBar, type FilterState, type GroupBy } from "@/components/alerts/filter-bar";
import { MessageThread } from "@/components/chat/message-thread";
import { ChatInputBar } from "@/components/chat/chat-input-bar";
import { useChatStore } from "@/lib/chat-store";
import type { AlertItem } from "@/components/alerts/types";
import { ALERT_ITEMS } from "@/components/alerts/mock-data";

// ─── Suggestion chips ────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "Conduct brand and category level performance breakdown for this week?",
  "How is my total business performing this week vs. last week across all channels?",
  "How much of my total brand sales is driven by advertising?",
];

// ─── Inner page — needs useSearchParams so wrapped in Suspense below ─────────

function HomePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");

  // Which alert card is selected — null = show landing overview on the right
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  // Which brand tab is active — drives the compact left-panel snapshot.
  const [activeBrandTab, setActiveBrandTab] = useState<string | null>("Shark");

  const [filterBarExpanded, setFilterBarExpanded] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>("category");
  const [filters, setFilters] = useState<FilterState>({
    unreadOnly: false,
    brand: null,
    category: null,
    sku: null,
  });

  // ── Inline home-page chat ──────────────────────────────────────────────────
  const [homeSessionId, setHomeSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const sessions = useChatStore((s) => s.sessions);
  const createSession = useChatStore((s) => s.createSession);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const setActiveSession = useChatStore((s) => s.setActiveSession);

  const homeSession = homeSessionId
    ? (sessions.find((s) => s.id === homeSessionId) ?? null)
    : null;
  const hasChat = !!(homeSession && homeSession.messages.length > 0);

  // On mount — if ?alertId param is present (e.g. from "View Alert →" in chat page),
  // auto-select that SKU so the RCA panel opens immediately.
  useEffect(() => {
    const alertId = searchParams.get("alertId");
    if (alertId) {
      const found = ALERT_ITEMS.find((a) => a.id === alertId);
      if (found) setSelectedAlert(found);
      router.replace("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Selecting an alert card: show detail panel only — filter bar is NOT affected
  function handleAlertSelect(alert: AlertItem) {
    setSelectedAlert(alert);
  }

  // Clicking "View all X alerts": apply brand/category filter + open filter bar
  // Right panel returns to landing overview (no specific alert selected)
  function handleViewAllCategory(brand: string, category: string) {
    setFilters((prev) => ({ ...prev, brand, category }));
    setFilterBarExpanded(true);
    setSelectedAlert(null);
  }

  // Collapsing the filter bar hides it but KEEPS filter state and selected alert intact
  function handleCollapseFilterBar() {
    setFilterBarExpanded(false);
  }

  // "View All Alerts" footer — expand snapshot into a full brand-scoped list.
  // Applies the active brand tab as a brand filter so every card for that brand
  // is visible (no 3-per-category truncation). Filter bar is NOT opened —
  // it only opens when the user explicitly picks a filtered view.
  function handleViewAll() {
    if (activeBrandTab) {
      setFilters((prev) => ({ ...prev, brand: activeBrandTab, category: null }));
      setSelectedAlert(null);
    }
  }

  // Brand tab click — update active tab.
  // If the user is in "view all for brand" mode (brand filter applied, no category/sku),
  // also update filters.brand so the left panel list stays in sync with the tab.
  function handleBrandChange(brandName: string) {
    setActiveBrandTab(brandName);
    if (filters.brand && !filters.category && !filters.sku) {
      setFilters((prev) => ({ ...prev, brand: brandName }));
    }
  }

  // "View all categories" from the brand insights tab — apply brand filter + open filter bar
  function handleViewAllCategories(brandName: string) {
    setFilters((prev) => ({ ...prev, brand: brandName, category: null }));
    setFilterBarExpanded(true);
    setSelectedAlert(null);
  }

  // Helper — true when the user is in a non-default state (filters applied, or view-all mode)
  function hasActiveState(f: typeof filters) {
    return !!(f.brand || f.category || f.sku || f.unreadOnly) || activeBrandTab === null;
  }

  // Closing the RCA panel:
  //   Scenario 1 — filters active → keep filters + filter bar, just deselect the alert
  //   Scenario 2 — no active state → full landing reset
  function handleCloseRca() {
    setSelectedAlert(null);
    if (!hasActiveState(filters)) {
      setActiveBrandTab("Shark");
      setFilterBarExpanded(false);
    }
  }

  // Filters changed from FilterBar.
  // When ALL filters are cleared → enter "no brand selected" state:
  //   - activeBrandTab = null so tabs component shows no active tab
  //   - AlertsPanel shows all brands in full-list mode (isFullList = true)
  //   - Filter bar stays open so user can see the cleared state
  function handleFiltersChange(f: typeof filters) {
    setFilters(f);
    const allClear = !f.brand && !f.category && !f.sku && !f.unreadOnly;
    if (allClear) {
      setActiveBrandTab(null);
    }
  }

  // Send a message inline — creates a session on first send, replaces overview with thread
  async function handleSend(message?: string) {
    const text = (message ?? input).trim();
    if (!text || isLoading) return;

    let sid = homeSessionId;
    if (!sid) {
      sid = createSession({ type: "standalone" });
      setHomeSessionId(sid);
      setActiveSession(sid);
    }

    appendMessage(sid, { role: "user", content: text });
    setInput("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1500));

    appendMessage(sid, {
      role: "assistant",
      content: `Placeholder response to: "${text}"\n\nWire up a real LLM in /src/app/api/chat/route.ts to get actual answers.`,
      thinkingSteps: ["Fetched RCA use cases", "Matched question to Mode 1 flow"],
    });
    setIsLoading(false);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Filter bar — always visible, persistent ── */}
      <FilterBar
        isExpanded={true}
        initialFilters={{ brand: filters.brand ?? activeBrandTab, category: filters.category }}
        onFiltersChange={handleFiltersChange}
        onBack={handleCollapseFilterBar}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
      />

      {/* ── Two-panel body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: alerts panel — compact by default, full when filter active */}
        <AlertsPanel
          selectedAlertId={selectedAlert?.id}
          onAlertSelect={handleAlertSelect}
          onViewAllCategory={handleViewAllCategory}
          onViewAll={handleViewAll}
          filters={{ brand: filters.brand, category: filters.category, unreadOnly: filters.unreadOnly }}
          brandFilter={activeBrandTab}
          groupBy={groupBy}
        />

        {/* Right: landing overview OR selected alert detail */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {selectedAlert ? (
            // ── Alert detail view ─────────────────────────────────────────────
            <AlertDetailsPanel
              alert={selectedAlert}
              onClose={handleCloseRca}
            />
          ) : hasChat && homeSession ? (
            // ── Inline chat — replaces business overview after first message ──
            <div className="flex h-full flex-col overflow-hidden">
              {/* Header with close button */}
              <div className="flex items-center justify-end px-6 pt-3 pb-1">
                <button
                  onClick={() => setHomeSessionId(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <MessageThread session={homeSession} isLoading={isLoading} />
              </div>
              <ChatInputBar
                value={input}
                onChange={setInput}
                onSubmit={() => handleSend()}
                isLoading={isLoading}
              />
            </div>
          ) : (
            // ── Landing overview — greeting + insights + chat input ───────────
            <div className="flex h-full flex-col items-center justify-between py-5">

              {/* Top: greeting + business insights */}
              <div className="flex w-full max-w-[800px] flex-col gap-3 px-8">
                <div className="flex items-center gap-2">
                  <Pin className="h-4 w-4 shrink-0 text-slate-400" />
                  <p className="text-lg text-muted-foreground">
                    Good Morning, Steve!
                  </p>
                </div>
                <BusinessLevelInsights
                  onBrandChange={handleBrandChange}
                  onViewCategory={handleViewAllCategory}
                  onViewAllCategories={handleViewAllCategories}
                  activeBrandName={activeBrandTab}
                />
              </div>

              {/* Bottom: suggestion chips + chat input */}
              <div className="flex w-full max-w-[800px] flex-col gap-3 px-8 pb-10">
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="rounded-full border bg-background px-3 py-1.5 text-sm text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <ChatInputBar
                  value={input}
                  onChange={setInput}
                  onSubmit={() => handleSend()}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Page export — wraps inner in Suspense (required for useSearchParams) ─────

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageInner />
    </Suspense>
  );
}
