"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { AlertItem } from "@/components/alerts/types";
import { SkuAlertCard } from "@/components/alerts/sku-alert-card";
import { AlertDetailsPanel } from "@/components/alerts/alert-details-panel";
import { FilterBar, type FilterState } from "@/components/alerts/filter-bar";
import { ALERT_ITEMS } from "@/components/alerts/mock-data";

// ─── Page ─────────────────────────────────────────────────────────────────────

type GroupBy = "category" | "date";

// Wrapped in Suspense by the default export below — required by Next.js because
// useSearchParams() opts this subtree out of static rendering.
function AlertsContent() {
  // Read brand + category pre-filters from URL (set by home page category row clicks)
  const searchParams = useSearchParams();
  const initialFilters: Partial<FilterState> = {
    brand:    searchParams.get("brand")    ?? null,
    category: searchParams.get("category") ?? null,
  };

  const [selectedId, setSelectedId] = useState<string>(ALERT_ITEMS[0].id);
  const [groupBy, setGroupBy] = useState<GroupBy>("category");
  const [filters, setFilters] = useState<FilterState>({
    unreadOnly: false,
    brand:      initialFilters.brand    ?? null,
    category:   initialFilters.category ?? null,
    sku:        null,
  });

  // Apply active filters to the full alerts list
  const filteredAlerts = ALERT_ITEMS.filter((alert) => {
    if (filters.unreadOnly && !alert.hasUnread) return false;
    if (filters.brand && alert.brand !== filters.brand) return false;
    if (filters.category && alert.category !== filters.category) return false;
    if (filters.sku && alert.asin !== filters.sku) return false;
    return true;
  });

  // Keep selected alert valid — if it gets filtered out, default to the first visible one
  const selectedAlert =
    filteredAlerts.find((a) => a.id === selectedId) ?? filteredAlerts[0];

  // Group by either category or date depending on the toggle
  const groups = useMemo(
    () =>
      filteredAlerts.reduce<Record<string, AlertItem[]>>((acc, a) => {
        const key = groupBy === "category" ? a.category : a.date;
        (acc[key] ??= []).push(a);
        return acc;
      }, {}),
    [filteredAlerts, groupBy],
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Filter bar — spans full width above both panels ── */}
      <FilterBar onFiltersChange={setFilters} initialFilters={initialFilters} />

      {/* ── Two-panel body ── */}
      <div className="flex flex-1 overflow-hidden">

      {/* Left: docked alert list */}
      <div className="flex shrink-0 flex-col">
        <aside className="flex w-[368px] flex-1 flex-col overflow-hidden border-r border-slate-200 bg-white/50">

          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-semibold text-slate-800">
              All Alerts{" "}
              <span className="text-slate-400">({filteredAlerts.length})</span>
            </span>

            {/* Group-by dropdown */}
            <div className="relative flex items-center">
              <label className="mr-1 text-[11px] text-slate-400">Group by</label>
              <div className="relative">
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                  className="appearance-none rounded-md border border-slate-200 bg-white py-1 pl-2 pr-6 text-[11px] font-medium text-slate-700 focus:outline-none"
                >
                  <option value="category">Category</option>
                  <option value="date">Date</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Scrollable card list */}
          <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            {Object.entries(groups).map(([groupKey, items], groupIndex) => (
              <div key={groupKey} className={groupIndex > 0 ? "border-t border-slate-100" : ""}>

                {/* Group header */}
                <div className="flex items-center justify-between bg-black/4 px-4 py-2">
                  <span className="text-xs font-semibold text-slate-800">
                    {groupKey}
                  </span>
                  <span className="text-xs text-slate-400">{items.length}</span>
                </div>

                {/* Alert cards — shared card in full mode */}
                <div className="flex flex-col gap-2 p-3">
                  {items.map((alert) => (
                    <SkuAlertCard
                      key={alert.id}
                      alert={alert}
                      variant="full"
                      isActive={alert.id === selectedId}
                      onClick={() => setSelectedId(alert.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Right: alert details panel — white canvas so inner slate-50 cards contrast */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white">
        {selectedAlert ? (
          <AlertDetailsPanel alert={selectedAlert} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
            No alerts match the current filters.
          </div>
        )}
      </div>

      </div>{/* end two-panel body */}
    </div>
  );
}

// Default export wraps AlertsContent in Suspense — this is required by Next.js
// whenever useSearchParams() is used inside a page component.
export default function AlertsPage() {
  return (
    <Suspense>
      <AlertsContent />
    </Suspense>
  );
}
