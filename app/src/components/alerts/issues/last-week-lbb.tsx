// Summary card showing last-week Buy Box health at a glance.
// Sits below the LostBuyBoxIssue comparison card in the RCA panel.

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

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
  // e.g. "May 10–16"
  period: string;
  // % of impressions where Buy Box was lost — e.g. "100%"
  lbbPercent: string;
  // Total revenue lost due to LBB — e.g. "$4,200"
  revenueLost: string;
  // Display name of the competitor who won most — e.g. "Dyson"
  primaryCompetitor: string;
  // Seller type shown below the name — e.g. "3P Seller", "amazon.com"
  primaryCompetitorType?: string;
  // Your average price during the loss period — e.g. "$219.99"
  yourAvgPrice: string;
  // Competitor's average price during the loss period — e.g. "$204.99"
  competitorAvgPrice: string;
  // Difference between your price and theirs — e.g. "-$15.00"
  avgPriceGap: string;
  status: LbbStatus;
};

export function LastWeekPerformanceLBB({
  period,
  lbbPercent,
  revenueLost,
  primaryCompetitor,
  primaryCompetitorType,
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
          <span className="text-xs font-medium text-slate-500">Last week snapshot ({period})</span>
        </div>
      </div>

      {/* Row 1: LBB % · Revenue Lost · Primary Competitor */}
      <div className="grid grid-cols-3 gap-0 border-b border-slate-100 px-4 py-3">
        <StatCell
          label="LBB %"
          value={lbbPercent}
          valueClass={lbbPercent === "0%" ? "text-slate-800" : "text-rose-600"}
        />
        <StatCell
          label="Revenue Lost"
          value={revenueLost}
          valueClass={revenueLost === "$0" ? "text-slate-800" : "text-rose-600"}
        />
        {/* Primary Competitor — name + seller type, with tooltip on the label */}
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Primary Competitor
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="cursor-help">
                  <Info className="h-3 w-3 text-slate-300" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  The seller who won the Buy Box most frequently during this period
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          <span className="text-sm font-bold text-slate-800">{primaryCompetitor}</span>
          {primaryCompetitorType && (
            <span className="text-[10px] text-slate-400">{primaryCompetitorType}</span>
          )}
        </div>
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
