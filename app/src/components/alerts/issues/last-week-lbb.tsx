// Summary card showing last-week Buy Box health at a glance.
// Sits below the LostBuyBoxIssue comparison card in the RCA panel.

type LbbStatus = "clean" | "at-risk" | "lost";

const STATUS_CONFIG: Record<LbbStatus, { label: string; badgeClass: string; dotClass: string }> = {
  clean:     { label: "Clean",   badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200", dotClass: "bg-emerald-500" },
  "at-risk": { label: "At Risk", badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",       dotClass: "bg-amber-400"   },
  lost:      { label: "Lost",    badgeClass: "bg-rose-50 text-rose-700 border border-rose-200",          dotClass: "bg-rose-500"    },
};

type StatCellProps = {
  label: string;
  value: string;
  valueClass?: string;
};

function StatCell({ label, value, valueClass = "text-slate-800" }: StatCellProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className={`text-sm font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

export type LastWeekLbbProps = {
  // How many of last 7 days the Buy Box was lost — e.g. "3 / 7"
  lbbDays: string;
  // Total revenue lost due to LBB — e.g. "$4,200"
  revenueLost: string;
  // Who won the Buy Box — e.g. "Dyson", "amazon.com", "3P Seller"
  primaryCompetitor: string;
  // Your average price during the loss period — e.g. "$219.99"
  yourAvgPrice: string;
  // Competitor's average price during the loss period — e.g. "$204.99"
  competitorAvgPrice: string;
  // Difference between your price and theirs — e.g. "-$15.00"
  avgPriceGap: string;
  status: LbbStatus;
};

export function LastWeekPerformanceLBB({
  lbbDays,
  revenueLost,
  primaryCompetitor,
  yourAvgPrice,
  competitorAvgPrice,
  avgPriceGap,
  status,
}: LastWeekLbbProps) {
  const cfg = STATUS_CONFIG[status];

  // Price gap is negative (you're more expensive) → red; zero or positive → normal
  const isNegativeGap = avgPriceGap.startsWith("-");

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${cfg.dotClass}`} />
          <span className="text-xs font-medium text-slate-500">Last week snapshot</span>
        </div>
      </div>

      {/* Row 1: LBB Days · Revenue Lost · Primary Competitor */}
      <div className="grid grid-cols-3 gap-0 border-b border-slate-100 px-4 py-3">
        <StatCell
          label="LBB Days"
          value={lbbDays}
          valueClass={lbbDays.startsWith("0") ? "text-slate-800" : "text-rose-600"}
        />
        <StatCell
          label="Revenue Lost"
          value={revenueLost}
          valueClass={revenueLost === "$0" ? "text-slate-800" : "text-rose-600"}
        />
        <StatCell label="Primary Competitor" value={primaryCompetitor} />
      </div>

      {/* Row 2: Your Avg Price · Competitor's Avg Price · Avg Price Gap */}
      <div className="grid grid-cols-3 gap-0 px-4 py-3">
        <StatCell label="Your Avg Price"        value={yourAvgPrice} />
        <StatCell label="Competitor's Avg Price" value={competitorAvgPrice} />
        <StatCell
          label="Avg Price Gap"
          value={avgPriceGap}
          valueClass={isNegativeGap ? "text-rose-600" : "text-slate-800"}
        />
      </div>
    </div>
  );
}
