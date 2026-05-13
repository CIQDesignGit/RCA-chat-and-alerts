import Link from "next/link";
import { Maximize2, ChevronRight } from "lucide-react";

// Exported so SkuDetail and other components can use the same shape
export type SkuAlert = {
  id: string;
  skuName: string;
  asin: string;
  category?: string;  // injected from the group when clicked
  gapValue: number;
  alertType: string;
};

// A category group — holds 2–3 top SKUs and its own total gap
type CategoryGroup = {
  category: string;
  totalGap: number;    // sum of SKU gaps — used to sort categories
  skus: SkuAlert[];
};

// Colors for alert type badges — maps type → Tailwind classes
const ALERT_BADGE: Record<string, string> = {
  "Lost Buy Box":     "bg-red-50 text-red-600",
  "Predictive OOS":   "bg-red-50 text-red-600",
  "Sales Drop":       "bg-orange-50 text-orange-600",
  "Search Exit Pg 1": "bg-amber-50 text-amber-700",
  "Content Change":   "bg-blue-50 text-blue-600",
  "PO Discrepancy":   "bg-purple-50 text-purple-600",
};

// Placeholder data — 4 categories sorted by gap descending.
// In production, this comes from the RCA Landing Page API (FR-002 / FR-003).
const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    category: "Kitchen Appliances",
    totalGap: -3100,
    skus: [
      { id: "k1", skuName: "NutriChef Food Processor - 8-Cup Capacity, Digital Control", asin: "B00I0DI0Z6", gapValue: -1240, alertType: "Lost Buy Box" },
      { id: "k2", skuName: "Vevor Electric Grain Mill Grinder - High Speed, Commercial Grade", asin: "B08H8JZKDF", gapValue: -980, alertType: "Sales Drop" },
      { id: "k3", skuName: "Proctor Silex 2-Slice Toaster - Easy Toasting", asin: "B000BVFYU8", gapValue: -880, alertType: "Predictive OOS" },
    ],
  },
  {
    category: "Home Essentials",
    totalGap: -1990,
    skus: [
      { id: "h1", skuName: "Dyson V11 Animal Cordless Vacuum - Powerful Suction", asin: "B09XKT7FMR", gapValue: -1050, alertType: "Search Exit Pg 1" },
      { id: "h2", skuName: "Shark Navigator Lift-Away Professional Vacuum", asin: "B009NU4E7G", gapValue: -940, alertType: "Content Change" },
    ],
  },
  {
    category: "Personal Care",
    totalGap: -1340,
    skus: [
      { id: "p1", skuName: "Oral-B Pro 1000 Electric Toothbrush - Rechargeable", asin: "B00AEGPQT0", gapValue: -720, alertType: "Lost Buy Box" },
      { id: "p2", skuName: "Philips Sonicare ProtectiveClean 4100", asin: "B07F5GD96J", gapValue: -620, alertType: "Predictive OOS" },
    ],
  },
  {
    category: "Sports & Outdoors",
    totalGap: -870,
    skus: [
      { id: "s1", skuName: "Lifefitness T3 Treadmill - Folding Design", asin: "B01N5DXQMQ", gapValue: -510, alertType: "Sales Drop" },
      { id: "s2", skuName: "Bowflex SelectTech 552 Adjustable Dumbbells", asin: "B001ARYU58", gapValue: -360, alertType: "PO Discrepancy" },
    ],
  },
];

// Formats a negative number as a dollar string — e.g. -1240 → "-$1,240"
function formatGap(value: number): string {
  return `-$${Math.abs(value).toLocaleString()}`;
}

// Total SKU count across all groups (used in the panel header)
const TOTAL_SKUS = CATEGORY_GROUPS.reduce((sum, g) => sum + g.skus.length, 0);

type AlertsPanelProps = {
  onSkuSelect?: (sku: SkuAlert) => void;
};

export function AlertsPanel({ onSkuSelect }: AlertsPanelProps) {
  return (
    <aside className="flex w-80 shrink-0 flex-col border-r bg-white">

      {/* ── Panel header ── */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold text-zinc-800">
          Today&apos;s Alerts{" "}
          <span className="text-zinc-400">({TOTAL_SKUS})</span>
        </span>
        <button className="text-zinc-400 hover:text-zinc-700" aria-label="Expand">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* ── Category groups, sorted by largest gap first ── */}
      <div className="flex-1 overflow-y-auto">
        {CATEGORY_GROUPS.map((group, groupIndex) => (
          <div
            key={group.category}
            className={groupIndex > 0 ? "border-t border-zinc-100" : ""}
          >
            {/* Category header row */}
            <div className="flex items-center justify-between bg-zinc-50 px-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {group.category}
              </span>
              {/* Category-level total gap */}
              <span className="text-xs font-bold text-red-500">
                {formatGap(group.totalGap)}
              </span>
            </div>

            {/* SKU rows for this category */}
            <div className="divide-y divide-zinc-50">
              {group.skus.map((sku) => (
                <div
                  key={sku.id}
                  onClick={() =>
                    onSkuSelect?.({ ...sku, category: group.category })
                  }
                  className="flex items-start gap-3 px-4 py-3 hover:bg-violet-50 cursor-pointer transition-colors"
                >
                  {/* Product image placeholder */}
                  <img
                    src={`https://placehold.co/36x36/f4f4f5/71717a?text=${group.category[0]}`}
                    alt={sku.skuName}
                    className="h-9 w-9 rounded-md object-cover shrink-0 border border-zinc-200"
                  />

                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    {/* SKU name — 2-line clamp */}
                    <p className="text-xs font-medium text-zinc-800 leading-snug line-clamp-2">
                      {sku.skuName}
                    </p>

                    {/* Bottom row: ASIN + gap + alert badge */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] text-zinc-400">
                        {sku.asin}
                      </span>
                      <span className="text-[10px] font-bold text-red-500 shrink-0">
                        {formatGap(sku.gapValue)}
                      </span>
                    </div>

                    {/* Alert type badge */}
                    <span
                      className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        ALERT_BADGE[sku.alertType] ?? "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {sku.alertType}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* "See more SKUs" link per category */}
            <button className="flex w-full items-center justify-end gap-1 px-4 pb-2 text-[11px] font-medium text-violet-600 hover:underline">
              See all {group.category} SKUs
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* ── Footer: navigates to full alerts page ── */}
      <div className="border-t px-4 py-3">
        <Link
          href="/alerts"
          className="block w-full text-center text-sm font-medium text-violet-600 hover:underline"
        >
          View All Alerts
        </Link>
      </div>
    </aside>
  );
}
