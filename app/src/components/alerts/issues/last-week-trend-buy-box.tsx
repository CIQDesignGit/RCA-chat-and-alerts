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

export type LbbTrendDay = {
  date: string;
  winRateWins: number;
  winRateCrawls: number;
  priceDiff: string;
  revenueImpact: string | null;
};

const TH = ({
  children,
  align = "right",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) => (
  <th
    scope="col"
    className={`whitespace-nowrap px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 ${
      align === "left" ? "text-left" : "text-right"
    }`}
  >
    {children}
  </th>
);

const TD = ({
  children,
  className = "",
  align = "right",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}) => (
  <td
    className={`whitespace-nowrap px-4 py-2.5 text-xs ${
      align === "left" ? "text-left" : "text-right"
    } ${className}`}
  >
    {children}
  </td>
);

// Cell tone drives background tint — numbers stay neutral for readability.
type CellTone = "good" | "bad" | "neutral";

const CELL_TONE_BG: Record<CellTone, string> = {
  good:    "bg-emerald-50",
  bad:     "bg-rose-50",
  neutral: "",
};

function getWinRateTone(wins: number, crawls: number): CellTone {
  return wins === crawls ? "good" : "bad";
}

function getPriceGapTone(priceDiff: string): CellTone {
  if (priceDiff.startsWith("+")) return "good";
  if (priceDiff.startsWith("-")) return "bad";
  return "neutral";
}

function getRevenueTone(impact: string | null): CellTone {
  if (!impact || impact === "—") return "neutral";
  if (impact.startsWith("-")) return "bad";
  return "good";
}

// Neutral text on a tinted cell background.
function TrendValueCell({ value, tone }: { value: string; tone: CellTone }) {
  return (
    <TD className={CELL_TONE_BG[tone]}>
      <span
        className={`font-medium ${tone === "neutral" && value === "—" ? "text-slate-400" : "text-slate-800"}`}
      >
        {value}
      </span>
    </TD>
  );
}

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
  rows: LbbTrendDay[];
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
  rows,
}: LastWeekTrendBuyBoxProps) {
  const isNegativeGap = avgPriceGap.startsWith("-");

  const primaryCompetitorLabel = (
    <span className="flex items-center gap-1">
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
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-600">Last 7 Day Trend</span>
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

      {/* ── 7-day trend table — dates as columns, metrics as rows ── */}
      <div className="overflow-x-auto border-t border-slate-200">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <TH align="left">Metric</TH>
              {rows.map((day) => (
                <TH key={day.date}>{day.date}</TH>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Row 1: Buy Box win rate */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Buy Box win rate (crawls)
              </TD>
              {rows.map((day) => (
                <TrendValueCell
                  key={day.date}
                  value={`${day.winRateWins}/${day.winRateCrawls}`}
                  tone={getWinRateTone(day.winRateWins, day.winRateCrawls)}
                />
              ))}
            </tr>

            {/* Row 2: Price gap — cell tint signals direction, number stays neutral */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                <span className="flex items-center gap-1">
                  Price gap
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help">
                        <Info className="h-3 w-3 text-slate-300" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Difference between your price and the primary competitor&apos;s price on that day
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </TD>
              {rows.map((day) => (
                <TrendValueCell
                  key={day.date}
                  value={day.priceDiff}
                  tone={getPriceGapTone(day.priceDiff)}
                />
              ))}
            </tr>

            {/* Row 3: Revenue impact */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Revenue impact
              </TD>
              {rows.map((day) => (
                <TrendValueCell
                  key={day.date}
                  value={day.revenueImpact ?? "—"}
                  tone={getRevenueTone(day.revenueImpact)}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
