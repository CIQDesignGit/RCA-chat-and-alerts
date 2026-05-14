import Link from "next/link";
import { Maximize2, ChevronRight } from "lucide-react";
import type { AlertItem } from "@/components/alerts/types";
import { SkuAlertCard } from "@/components/alerts/sku-alert-card";
import {
  ALERT_ITEMS,
  CATEGORY_TOTALS,
  CATEGORY_ORDER,
  CATEGORY_BRAND,
} from "@/components/alerts/mock-data";

// ─── Backward-compat type ─────────────────────────────────────────────────────
// SkuDetail still uses this shape — keep it exported until SkuDetail is updated.
export type SkuAlert = {
  id: string;
  skuName: string;
  asin: string;
  category: string;
  gapValue: number;   // same as AlertItem.gapDollar
  alertType: string;  // same as AlertItem.tags[0]
};

// ─── Data helpers ─────────────────────────────────────────────────────────────

// Max SKUs shown per category on the home panel — the rest are behind "See all"
const HOME_SKU_LIMIT = 3;

// Group all items by category in the dollar-gap sort order
const CATEGORY_GROUPS = CATEGORY_ORDER.map((cat) => ({
  category: cat,
  totalGap: CATEGORY_TOTALS[cat],
  items: ALERT_ITEMS.filter((a) => a.category === cat),
}));

const TOTAL_SKUS = ALERT_ITEMS.length;

function formatGap(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `-$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)     return `-$${(abs / 1_000).toFixed(1)}K`;
  return `-$${abs}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

type AlertsPanelProps = {
  onSkuSelect?: (sku: SkuAlert) => void;
  selectedSkuId?: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AlertsPanel({ onSkuSelect, selectedSkuId }: AlertsPanelProps) {
  function handleSelect(item: AlertItem) {
    onSkuSelect?.({
      id:        item.id,
      skuName:   item.skuName,
      asin:      item.asin,
      category:  item.category,
      gapValue:  item.gapDollar,
      alertType: item.tags[0] ?? "",
    });
  }

  return (
    <div className="flex shrink-0 flex-col">
      <aside className="flex w-[368px] flex-1 flex-col overflow-hidden border-r border-zinc-200 bg-white/50">

        {/* ── Panel header ── */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold text-zinc-800">
            Today&apos;s Alerts{" "}
            <span className="text-zinc-400">({TOTAL_SKUS})</span>
          </span>
          <button className="text-zinc-400 hover:text-zinc-700" aria-label="Expand">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable category groups ── */}
        <div className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          {CATEGORY_GROUPS.map((group, groupIndex) => {
            const visibleItems = group.items.slice(0, HOME_SKU_LIMIT);
            const hiddenCount  = group.items.length - visibleItems.length;

            return (
              <div
                key={group.category}
                className={groupIndex > 0 ? "border-t border-zinc-100" : ""}
              >
                {/* Category header */}
                <div className="flex items-center justify-between bg-black/4 px-4 py-2">
                  <span className="text-xs font-semibold text-zinc-800">
                    {group.category}
                  </span>
                  <span className="text-xs font-bold text-red-500">
                    {formatGap(group.totalGap)}
                  </span>
                </div>

                {/* First N SKUs */}
                <div className="flex flex-col gap-2 p-3">
                  {visibleItems.map((item) => (
                    <SkuAlertCard
                      key={item.id}
                      alert={item}
                      variant="compact"
                      isActive={item.id === selectedSkuId}
                      onClick={() => handleSelect(item)}
                    />
                  ))}
                </div>

                {/* Link to alerts page pre-filtered to this brand + category */}
                <Link
                  href={`/alerts?brand=${encodeURIComponent(CATEGORY_BRAND[group.category])}&category=${encodeURIComponent(group.category)}`}
                  className="flex w-full items-center justify-end gap-1 px-4 pb-2 text-[11px] font-medium text-violet-600 hover:underline"
                >
                  {`View all ${group.category} alerts`}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div className="border-t px-4 py-3">
          <Link
            href="/alerts"
            className="block w-full text-center text-sm font-medium text-violet-600 hover:underline"
          >
            View All Alerts
          </Link>
        </div>
      </aside>
    </div>
  );
}
