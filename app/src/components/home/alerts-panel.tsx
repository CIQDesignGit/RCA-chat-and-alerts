import Link from "next/link";
import { ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlertItem } from "@/components/alerts/types";
import type { GroupBy } from "@/components/alerts/filter-bar";
import { SkuAlertCard } from "@/components/alerts/sku-alert-card";
import {
  ALERT_ITEMS,
  CATEGORY_TOTALS,
  CATEGORY_ORDER,
  CATEGORY_BRAND,
} from "@/components/alerts/mock-data";

// ─── Backward-compat type ─────────────────────────────────────────────────────
// Keep exported so any legacy consumers aren't broken.
export type SkuAlert = {
  id: string;
  skuName: string;
  asin: string;
  category: string;
  gapValue: number;
  alertType: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const HOME_SKU_LIMIT = 3;

// All categories grouped + sorted by dollar gap (most negative first)
const CATEGORY_GROUPS = CATEGORY_ORDER.map((cat) => ({
  category: cat,
  brand: CATEGORY_BRAND[cat],
  totalGap: CATEGORY_TOTALS[cat],
  items: ALERT_ITEMS.filter((a) => a.category === cat),
}));

const TOTAL_SKUS = ALERT_ITEMS.length;

function formatGap(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `-$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `-$${(abs / 1_000).toFixed(1)}K`;
  return `-$${abs}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

type ActiveFilters = { brand: string | null; category: string | null };

type AlertsPanelProps = {
  onAlertSelect?: (alert: AlertItem) => void;
  selectedAlertId?: string;
  // "View all X alerts" per-category — stays on home page
  onViewAllCategory?: (brand: string, category: string) => void;
  // "View All Alerts" footer — clears brand scope, opens filter bar
  onViewAll?: () => void;
  filters?: ActiveFilters;
  onToggleFilters?: () => void;
  filtersExpanded?: boolean;
  brandFilter?: string | null;
  groupBy?: GroupBy;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AlertsPanel({
  onAlertSelect,
  selectedAlertId,
  onViewAllCategory,
  onViewAll,
  filters,
  onToggleFilters,
  filtersExpanded,
  brandFilter,
  groupBy = "category",
}: AlertsPanelProps) {
  const hasFilter = !!(filters?.brand || filters?.category);

  // All items that pass the active filters (or brand scope)
  const visibleItems = ALERT_ITEMS.filter((item) => {
    if (filters?.brand && item.brand !== filters.brand) return false;
    if (filters?.category && item.category !== filters.category) return false;
    if (!hasFilter && brandFilter && item.brand !== brandFilter) return false;
    return true;
  });

  // Full list mode: no brand scope AND no filter bar filters applied
  const isFullList = !brandFilter && !hasFilter;

  // Build groups based on groupBy setting
  type Group = { key: string; label: string; totalGap: number; brand: string; items: AlertItem[] };

  const activeGroups: Group[] = groupBy === "date"
    ? // Group by date — collect unique dates preserving order of first appearance
      Array.from(new Set(visibleItems.map((i) => i.date))).map((date) => {
        const items = visibleItems.filter((i) => i.date === date);
        return {
          key: date,
          label: date,
          brand: "",
          totalGap: items.reduce((sum, i) => sum + i.gapDollar, 0),
          items,
        };
      })
    : // Group by category — use canonical order from CATEGORY_GROUPS
      CATEGORY_GROUPS.map((g) => ({
        key: g.category,
        label: g.category,
        brand: g.brand,
        totalGap: g.totalGap,
        items: visibleItems.filter((i) => i.category === g.category),
      })).filter((g) => g.items.length > 0);

  const displayCount = visibleItems.length;

  return (
    <div className="flex shrink-0 flex-col">
      <aside className="flex w-[368px] flex-1 flex-col overflow-hidden border-r border-slate-200 bg-white/50">

        {/* ── Panel header ── */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold text-slate-800">
            SKUs{" "}
            <span className="text-slate-400">({displayCount})</span>
          </span>
        </div>

        {/* ── Scrollable category groups ── */}
        <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          {activeGroups.map((group, groupIndex) => {
            // Snapshot mode: cap to 3 per group. Full list + filtered: show everything.
            const shownItems = (hasFilter || isFullList)
              ? group.items
              : group.items.slice(0, HOME_SKU_LIMIT);

            return (
              <div
                key={group.key}
                className={groupIndex > 0 ? "border-t border-slate-100" : ""}
              >
                {/* Group header */}
                <div className="flex items-center justify-between bg-slate-50 px-4 py-2">
                  <span className="text-xs font-semibold text-slate-800">
                    {group.label}
                  </span>
                  <span className="text-xs font-bold text-red-500">
                    {formatGap(group.totalGap)}
                  </span>
                </div>

                {/* Alert cards */}
                <div className="flex flex-col gap-2 p-3">
                  {shownItems.map((item) => (
                    <SkuAlertCard
                      key={item.id}
                      alert={item}
                      variant={(hasFilter || isFullList) ? "full" : "compact"}
                      isActive={item.id === selectedAlertId}
                      onClick={() => onAlertSelect?.(item)}
                    />
                  ))}
                </div>

                {/* "View all X SKUs" buttons removed — filter bar handles navigation */}
              </div>
            );
          })}
        </div>

      </aside>
    </div>
  );
}
