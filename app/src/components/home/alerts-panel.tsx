import Link from "next/link";
import { ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlertItem } from "@/components/alerts/types";
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
}: AlertsPanelProps) {
  const hasFilter = !!(filters?.brand || filters?.category);

  // Expanded filter mode — show all items that match the active filter bar state
  const filteredGroups = hasFilter
    ? CATEGORY_GROUPS.map((g) => ({
        ...g,
        items: g.items.filter((item) => {
          if (filters?.brand && item.brand !== filters.brand) return false;
          if (filters?.category && item.category !== filters.category) return false;
          return true;
        }),
      })).filter((g) => g.items.length > 0)
    : CATEGORY_GROUPS;

  // Compact mode — optionally scope to the brand selected in the brand tab strip
  const compactGroups = brandFilter
    ? CATEGORY_GROUPS.filter((g) => g.brand === brandFilter)
    : CATEGORY_GROUPS;

  // Full list mode: no brand scope AND no filter bar filters applied
  const isFullList = !brandFilter && !hasFilter;

  const activeGroups = hasFilter ? filteredGroups : compactGroups;

  const displayCount = hasFilter
    ? filteredGroups.reduce((n, g) => n + g.items.length, 0)
    : compactGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="flex shrink-0 flex-col">
      <aside className="flex w-[368px] flex-1 flex-col overflow-hidden border-r border-slate-200 bg-white/50">

        {/* ── Panel header ── */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold text-slate-800">
            {brandFilter ? "Today\u2019s Alerts" : "All Alerts"}{" "}
            <span className="text-slate-400">({displayCount})</span>
          </span>

          {/* Icon group — filter toggle + maximize */}
          <div className="flex items-center gap-1">
            {/* Filter toggle — highlights when filters are active or bar is open */}
            {onToggleFilters && (
              <button
                onClick={onToggleFilters}
                aria-label={filtersExpanded ? "Close filters" : "Open filters"}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                  filtersExpanded || hasFilter
                    ? "bg-violet-100 text-violet-600"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-700",
                )}
              >
                <Filter className="h-3.5 w-3.5" />
              </button>
            )}

          </div>
        </div>

        {/* ── Scrollable category groups ── */}
        <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          {activeGroups.map((group, groupIndex) => {
            // Snapshot: cap to 3 per category. Full list + filtered: show everything.
            const visibleItems = (hasFilter || isFullList)
              ? group.items
              : group.items.slice(0, HOME_SKU_LIMIT);
            const hiddenCount = (hasFilter || isFullList) ? 0 : group.items.length - visibleItems.length;

            return (
              <div
                key={group.category}
                className={groupIndex > 0 ? "border-t border-slate-100" : ""}
              >
                {/* Category header */}
                <div className="flex items-center justify-between bg-slate-50 px-4 py-2">
                  <span className="text-xs font-semibold text-slate-800">
                    {group.category}
                  </span>
                  <span className="text-xs font-bold text-red-500">
                    {formatGap(group.totalGap)}
                  </span>
                </div>

                {/* Alert cards */}
                <div className="flex flex-col gap-2 p-3">
                  {visibleItems.map((item) => (
                    <SkuAlertCard
                      key={item.id}
                      alert={item}
                      variant={(hasFilter || isFullList) ? "full" : "compact"}
                      isActive={item.id === selectedAlertId}
                      onClick={() => onAlertSelect?.(item)}
                    />
                  ))}
                </div>

                {/* "View all X alerts" — snapshot mode only (not full list, not filtered) */}
                {!hasFilter && !isFullList && (
                  onViewAllCategory ? (
                    <button
                      onClick={() => onViewAllCategory(group.brand, group.category)}
                      className="flex w-full items-center justify-end gap-1 px-4 pb-2 text-[11px] font-medium text-violet-600 hover:underline"
                    >
                      {`View all ${group.category} alerts`}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  ) : (
                    <Link
                      href={`/alerts?brand=${encodeURIComponent(group.brand)}&category=${encodeURIComponent(group.category)}`}
                      className="flex w-full items-center justify-end gap-1 px-4 pb-2 text-[11px] font-medium text-violet-600 hover:underline"
                    >
                      {`View all ${group.category} alerts`}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* ── Footer — hidden when filters are active OR when already showing all brands ── */}
        {!hasFilter && onViewAll && brandFilter && (
          <div className="border-t px-4 py-3">
            <button
              onClick={onViewAll}
              className="block w-full text-center text-sm font-medium text-violet-600 hover:underline"
            >
              View All Alerts
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
