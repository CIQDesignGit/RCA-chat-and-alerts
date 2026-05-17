"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
} from "@/components/ui/prompt-input";
import { AlertsPanel } from "@/components/home/alerts-panel";
import { BusinessLevelInsights } from "@/components/home/business-level-insights";
import { AlertDetailsPanel } from "@/components/alerts/alert-details-panel";
import { FilterBar, type FilterState } from "@/components/alerts/filter-bar";
import type { AlertItem } from "@/components/alerts/types";

// ─── Suggestion chips ────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "Conduct brand and category level performance breakdown for this week?",
  "How is my total business performing this week vs. last week across all channels?",
  "How much of my total brand sales is driven by advertising?",
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [input, setInput] = useState("");

  // Which alert card is selected — null = show landing overview on the right
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  // Which brand tab is active — drives the compact left-panel snapshot.
  // null means "show all brands" (triggered by View All Alerts)
  const [activeBrandTab, setActiveBrandTab] = useState<string | null>("Shark");

  // Filter bar visibility — hidden on landing, expands on alert select or "View all" click
  const [filterBarExpanded, setFilterBarExpanded] = useState(false);

  // Active filter state — drives the left panel's filtered/full view
  const [filters, setFilters] = useState<FilterState>({
    unreadOnly: false,
    brand: null,
    category: null,
    sku: null,
  });

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

  // "View All Alerts" footer — clear brand scope so all categories show.
  // Filter bar is deliberately NOT touched; user opens it themselves if needed.
  // Does NOT touch selectedAlert so RCA panel stays visible if one is open.
  function handleViewAll() {
    setActiveBrandTab(null);
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
  // Scenario 3 — when ALL filters are cleared → treat as landing reset.
  function handleFiltersChange(f: typeof filters) {
    setFilters(f);
    const allClear = !f.brand && !f.category && !f.sku && !f.unreadOnly;
    if (allClear) {
      setActiveBrandTab("Shark");
      setFilterBarExpanded(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // TODO: navigate to /chat and send this message
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Filter bar — always in DOM, height-animated open/closed ── */}
      <FilterBar
        isExpanded={filterBarExpanded}
        initialFilters={{ brand: filters.brand, category: filters.category }}
        onFiltersChange={handleFiltersChange}
        onBack={handleCollapseFilterBar}
      />

      {/* ── Two-panel body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: alerts panel — compact by default, full when filter active */}
        <AlertsPanel
          selectedAlertId={selectedAlert?.id}
          onAlertSelect={handleAlertSelect}
          onViewAllCategory={handleViewAllCategory}
          onViewAll={handleViewAll}
          filters={{ brand: filters.brand, category: filters.category }}
          filtersExpanded={filterBarExpanded}
          onToggleFilters={() => setFilterBarExpanded((prev) => !prev)}
          brandFilter={activeBrandTab}
        />

        {/* Right: landing overview OR selected alert detail */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {selectedAlert ? (
            // ── Alert detail view ───────────────────────────────────────────
            <AlertDetailsPanel
              alert={selectedAlert}
              onClose={handleCloseRca}
            />
          ) : (
            // ── Landing overview — greeting + insights + chat input ─────────
            <div className="flex h-full flex-col items-center justify-between py-5">

              {/* Top: greeting + business insights — max 800px, centered */}
              <div className="flex w-full max-w-[800px] flex-col gap-3 px-8">
                <p className="text-xl text-muted-foreground">
                  Good Morning, Steve
                </p>
                <BusinessLevelInsights onBrandChange={setActiveBrandTab} />
              </div>

              {/* Bottom: suggestion chips + chat input — max 800px, centered */}
              <div className="flex w-full max-w-[800px] flex-col gap-3 px-8 pb-10">
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="rounded-full border bg-background px-3 py-1.5 text-sm text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <PromptInput
                  value={input}
                  onValueChange={setInput}
                  isLoading={false}
                  onSubmit={() => {}}
                  maxHeight={44}
                  className="flex w-full items-center rounded-full bg-background shadow-md"
                >
                  <PromptInputTextarea
                    disableAutosize
                    rows={1}
                    placeholder="Ask AllyAI — e.g. What were my sales last week?"
                    onKeyDown={handleKeyDown}
                    className="min-h-0 flex-1 py-1.5"
                  />
                  <PromptInputActions>
                    <button
                      type="button"
                      onClick={() => {}}
                      disabled={!input.trim()}
                      aria-label="Send message"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-opacity disabled:opacity-40 hover:opacity-90"
                    >
                      <SendHorizontal className="h-4 w-4" />
                    </button>
                  </PromptInputActions>
                </PromptInput>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
