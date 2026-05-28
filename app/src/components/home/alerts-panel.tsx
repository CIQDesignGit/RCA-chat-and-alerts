"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

function formatGap(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `-$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `-$${(abs / 1_000).toFixed(1)}K`;
  return `-$${abs}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

type ActiveFilters = { brand: string | null; category: string | null; unreadOnly?: boolean };

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
    if (filters?.unreadOnly && !item.hasUnread) return false;
    return true;
  });

  // Only show today's SKUs
  const todayItems = visibleItems.filter((i) => i.date === "Today");

  // Full list mode: no brand scope AND no filter bar filters applied
  const isFullList = !brandFilter && !hasFilter;

  // Category filter drives the "show all vs top-3" decision independently of brand filter.
  // Brand-only filter (no category) → snapshot (top 3 + links).
  // Category filter → show all SKUs in that category, hide links.
  const categoryFiltered = !!filters?.category;

  // Build groups for a given item set based on groupBy setting
  type Group = { key: string; label: string; totalGap: number; brand: string; items: AlertItem[] };

  function buildGroups(items: AlertItem[]): Group[] {
    if (groupBy === "date") {
      return Array.from(new Set(items.map((i) => i.date))).map((date) => {
        const dateItems = items.filter((i) => i.date === date);
        return {
          key: date,
          label: date,
          brand: "",
          totalGap: dateItems.reduce((sum, i) => sum + i.gapDollar, 0),
          items: dateItems,
        };
      });
    }
    return CATEGORY_GROUPS.map((g) => ({
      key: g.category,
      label: g.category,
      brand: g.brand,
      totalGap: g.totalGap,
      items: items.filter((i) => i.category === g.category),
    })).filter((g) => g.items.length > 0);
  }

  const todayGroups = buildGroups(todayItems);


  return (
    <div className="flex shrink-0 flex-col">
      <aside className="flex w-[368px] flex-1 flex-col overflow-hidden border-r border-slate-200 bg-white/50">

        {/* ── Scrollable category groups ── */}
        <div className="flex-1 overflow-y-auto pb-48 scrollbar-none [&::-webkit-scrollbar]:hidden">

          {/* ── Today's SKUs ── */}
          <div className="bg-white px-4 py-3">
            <span className="text-sm font-semibold text-slate-800">Today's SKUs</span>
            <p className="mt-0.5 text-xs text-slate-400">Based on previous 24 hrs of data</p>
          </div>

          {todayGroups.map((group, groupIndex) => {
            const shownItems = (categoryFiltered || isFullList)
              ? group.items
              : group.items.slice(0, HOME_SKU_LIMIT);

            return (
              <div
                key={group.key}
                className={groupIndex > 0 ? "border-t border-slate-100" : ""}
              >
                <div className="flex items-center justify-between bg-slate-50 px-4 py-2">
                  <span className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-800">{group.label}</span>
                    <span className="text-xs text-slate-500">({group.items.length})</span>
                  </span>
                  <span className="text-xs font-bold text-red-500">{formatGap(group.totalGap)}</span>
                </div>

                <div className="flex flex-col gap-2 p-3">
                  {shownItems.map((item) => (
                    <SkuAlertCard
                      key={item.id}
                      alert={item}
                      variant={(categoryFiltered || isFullList) ? "full" : "compact"}
                      isActive={item.id === selectedAlertId}
                      onClick={() => onAlertSelect?.(item)}
                    />
                  ))}
                </div>

                {!categoryFiltered && !isFullList && groupBy === "category" && (
                  onViewAllCategory ? (
                    <button
                      onClick={() => onViewAllCategory(group.brand, group.label)}
                      className="flex w-full items-center justify-end gap-1 px-4 pb-2 text-[11px] font-medium text-violet-600 hover:underline"
                    >
                      {`View all ${group.label} SKUs`}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  ) : (
                    <Link
                      href={`/alerts?brand=${encodeURIComponent(group.brand)}&category=${encodeURIComponent(group.label)}`}
                      className="flex w-full items-center justify-end gap-1 px-4 pb-2 text-[11px] font-medium text-violet-600 hover:underline"
                    >
                      {`View all ${group.label} SKUs`}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  )
                )}
              </div>
            );
          })}

        </div>

      </aside>
    </div>
  );
}
