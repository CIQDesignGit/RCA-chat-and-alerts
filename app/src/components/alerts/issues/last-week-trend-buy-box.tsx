// Merged "Last week trend — Buy Box" widget.
// Combines the snapshot metric tiles and the 7-day ownership trend table
// into one card, rendered inside the expanded Lost Buy Box root cause row.

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

// ─── Types ────────────────────────────────────────────────────────────────────

type LbbStatus = "clean" | "at-risk" | "lost";

const STATUS_DOT: Record<LbbStatus, string> = {
  clean:     "bg-emerald-500",
  "at-risk": "bg-amber-400",
  lost:      "bg-rose-500",
};

type StatCellProps = {
  label: React.ReactNode;
  value: string;
  valueClass?: string;
};

function StatCell({ label, value, valueClass = "text-slate-700" }: StatCellProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className={`text-base font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

type LbbTrendRow = {
  date: string;
  buyBoxWinner: string;
  isYou: boolean;
  revenueImpact: string | null;
  yourPrice: string;
  competitorPrice: string;
  priceDiff: string;
};

const TH = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
  <th
    scope="col"
    className={`whitespace-nowrap px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 ${right ? "text-right" : "text-left"}`}
  >
    {children}
  </th>
);

const TD = ({ children, right, className = "" }: { children: React.ReactNode; right?: boolean; className?: string }) => (
  <td className={`whitespace-nowrap px-5 py-2.5 text-xs ${right ? "text-right" : ""} ${className}`}>
    {children}
  </td>
);

// ─── Props ────────────────────────────────────────────────────────────────────

export type LastWeekTrendBuyBoxProps = {
  period: string;               // e.g. "May 3–9"
  lbbPercent: string;           // e.g. "71%"
  revenueLost: string;          // e.g. "-$86.0K"
  primaryCompetitor: string;    // e.g. "Dyson"
  primaryCompetitorType?: string; // e.g. "3P Seller"
  yourAvgPrice: string;         // e.g. "$529.99"
  competitorAvgPrice: string;   // e.g. "$362.09"
  avgPriceGap: string;          // e.g. "-$167.90"
  status: LbbStatus;
  rows: LbbTrendRow[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendBuyBox({
  period,
  lbbPercent,
  revenueLost,
  primaryCompetitor,
  primaryCompetitorType,
  yourAvgPrice,
  competitorAvgPrice,
  avgPriceGap,
  status,
  rows,
}: LastWeekTrendBuyBoxProps) {
  const isNegativeGap = avgPriceGap.startsWith("-");

  const primaryCompetitorLabel = (
    <span className="flex items-center gap-1">
      Primary Competitor
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">
              <Info className="h-3 w-3 text-slate-300" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            The seller who won the Buy Box most frequently during this period
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[status]}`} />
        <span className="text-xs font-medium text-slate-600">Last week trend · Buy Box</span>
        <span className="text-xs text-slate-400">({period})</span>
      </div>

      {/* ── Snapshot metrics ── */}
      <div className="grid grid-cols-3 gap-0 px-4 py-3">
        <StatCell
          label="LBB %"
          value={lbbPercent}
          valueClass={lbbPercent === "0%" ? "text-slate-700" : "text-rose-600"}
        />
        <StatCell
          label="Avg Revenue Lost"
          value={revenueLost}
          valueClass={revenueLost === "$0" ? "text-slate-700" : "text-rose-600"}
        />
        {/* Primary competitor — label + name + seller type */}
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {primaryCompetitorLabel}
          </span>
          <span className="text-base font-semibold text-slate-700">
            {primaryCompetitor}
            {primaryCompetitorType && (
              <span className="ml-1 text-sm font-normal text-slate-400">({primaryCompetitorType})</span>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0 px-4 pb-5 pt-3">
        <StatCell label="Your Avg Price"        value={yourAvgPrice} />
        <StatCell label="Competitor's Avg Price" value={competitorAvgPrice} />
        <StatCell
          label="Avg Price Gap"
          value={avgPriceGap}
          valueClass={isNegativeGap ? "text-rose-600" : "text-slate-700"}
        />
      </div>

      {/* ── 7-day trend table ── */}
      <div className="overflow-x-auto border-t border-slate-200">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <TH>Date</TH>
              <TH>Buy Box Winner</TH>
              <TH right>Revenue Impact</TH>
              <TH right>Your Price</TH>
              <TH right>Competitor Price</TH>
              <TH right>Price Gap</TH>
              {/* Spacer — stretches to fill remaining width so row dividers reach the right edge */}
              <th className="w-full" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.date}>
                <TD className="font-medium text-slate-600">{row.date}</TD>
                <TD className={row.isYou ? "font-medium text-violet-600" : "font-medium text-slate-700"}>
                  {row.buyBoxWinner}
                </TD>
                <TD right className={row.revenueImpact ? "font-medium text-rose-600" : "text-slate-400"}>
                  {row.revenueImpact ?? "—"}
                </TD>
                <TD right className="text-slate-700">{row.yourPrice}</TD>
                <TD right className="text-slate-700">{row.competitorPrice}</TD>
                <TD right className={row.priceDiff.startsWith("-") ? "font-medium text-rose-600" : "text-emerald-600"}>
                  {row.priceDiff}
                </TD>
                <td className="w-full" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
