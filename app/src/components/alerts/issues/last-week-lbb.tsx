// Summary card showing last-week Buy Box health at a glance.
// Sits below the LostBuyBoxIssue comparison card in the RCA panel.

type LbbStatus = "clean" | "at-risk" | "lost";

const STATUS_CONFIG: Record<LbbStatus, { label: string; badgeClass: string; dotClass: string }> = {
  clean:    { label: "Clean",    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200", dotClass: "bg-emerald-500" },
  "at-risk": { label: "At Risk", badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",       dotClass: "bg-amber-400"   },
  lost:     { label: "Lost",     badgeClass: "bg-rose-50 text-rose-700 border border-rose-200",          dotClass: "bg-rose-500"    },
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
  buyBoxWinner: string;
  lbbDays: string;
  revenueLost: string;
  avgSellingPrice: string;
  status: LbbStatus;
};

export function LastWeekPerformanceLBB({
  buyBoxWinner,
  lbbDays,
  revenueLost,
  avgSellingPrice,
  status,
}: LastWeekLbbProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${cfg.dotClass}`} />
          <span className="text-xs font-medium text-slate-500">Buy Box ownership · last week</span>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cfg.badgeClass}`}>
          {cfg.label}
        </span>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-4 gap-0 px-4 py-3">
        <StatCell label="Buy Box Winner" value={buyBoxWinner} />
        <StatCell label="LBB Days"       value={lbbDays} />
        <StatCell label="Revenue Lost to LBB" value={revenueLost} valueClass={revenueLost === "$0" ? "text-slate-800" : "text-rose-600"} />
        <StatCell label="Avg Selling Price"   value={avgSellingPrice} />
      </div>
    </div>
  );
}
