// Merged "Last week trend — Buy Box" widget.
// Combines the snapshot metric tiles and the 7-day ownership trend table
// into one card, rendered inside the expanded Lost Buy Box root cause row.

import { Info } from "lucide-react";
import { TrendDateColumnHeader } from "./trend-date-header";
import {
  computePercentPointDelta,
  computeRelativeDelta,
  parseDollarString,
  parsePercentString,
} from "./trend-snapshot-delta";
import { TrendSnapshotStatCell } from "./trend-snapshot-stat-cell";
import { TrendWidgetHeader } from "./trend-widget-header";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// Positive gap = you are more expensive than competitor = bad (red).
// Negative gap = you are cheaper than competitor = good (green).
function getPriceGapTone(priceDiff: string): CellTone {
  if (priceDiff.startsWith("+")) return "bad";
  if (priceDiff.startsWith("-")) return "good";
  return "neutral";
}

function getRevenueTone(impact: string | null): CellTone {
  if (!impact || impact === "—") return "neutral";
  if (impact.startsWith("-")) return "bad";
  return "good";
}

const CELL_TONE_TEXT: Record<CellTone, string> = {
  good:    "text-emerald-700",
  bad:     "text-red-700",
  neutral: "text-slate-400",
};

function TrendValueCell({ value, tone }: { value: string; tone: CellTone }) {
  const textClass = value === "—" ? "text-slate-400" : CELL_TONE_TEXT[tone];
  return (
    <TD className={CELL_TONE_BG[tone]}>
      <span className={`font-medium ${textClass}`}>{value}</span>
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
  /** Previous 7-day window values for snapshot deltas. */
  prevLbbPercent?: number;
  prevRevenueLost?: number;
  prevYourAvgPrice?: number;
  prevCompetitorAvgPrice?: number;
  prevAvgPriceGap?: number;
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
  prevLbbPercent,
  prevRevenueLost,
  prevYourAvgPrice,
  prevCompetitorAvgPrice,
  prevAvgPriceGap,
}: LastWeekTrendBuyBoxProps) {
  const lbbPct = parsePercentString(lbbPercent);
  const lbbDelta =
    lbbPct !== null && prevLbbPercent != null
      ? computePercentPointDelta(lbbPct, prevLbbPercent)
      : null;

  const revenueLostAmount = parseDollarString(revenueLost);
  const revenueLostDelta =
    revenueLostAmount !== null && prevRevenueLost != null
      ? computeRelativeDelta(
          Math.abs(revenueLostAmount),
          Math.abs(prevRevenueLost),
        )
      : null;

  const yourPrice = parseDollarString(yourAvgPrice);
  const yourPriceDelta =
    yourPrice !== null && prevYourAvgPrice != null
      ? computeRelativeDelta(yourPrice, prevYourAvgPrice)
      : null;

  const competitorPrice = parseDollarString(competitorAvgPrice);
  const competitorPriceDelta =
    competitorPrice !== null && prevCompetitorAvgPrice != null
      ? computeRelativeDelta(competitorPrice, prevCompetitorAvgPrice)
      : null;

  const priceGap = parseDollarString(avgPriceGap);
  const priceGapDelta =
    priceGap !== null && prevAvgPriceGap != null
      ? computeRelativeDelta(priceGap, prevAvgPriceGap)
      : null;

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
      <TrendWidgetHeader period={period} showPrevWeekLegend />
      <div className="grid grid-cols-3 gap-0 px-4 py-3">
        <TrendSnapshotStatCell
          label="LBB %"
          value={lbbPercent}
          delta={lbbDelta}
          deltaFormat="pp"
          deltaPolarity="inverse"
        />
        <TrendSnapshotStatCell
          label="Avg Revenue Lost"
          value={revenueLost}
          delta={revenueLostDelta}
          deltaPolarity="inverse"
        />
        {/* Primary competitor — no week-over-week delta (name label) */}
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
        <TrendSnapshotStatCell
          label="Your Avg Price"
          value={yourAvgPrice}
          delta={yourPriceDelta}
          deltaPolarity="inverse"
        />
        <TrendSnapshotStatCell
          label="Competitor's Avg Price"
          value={competitorAvgPrice}
          delta={competitorPriceDelta}
          deltaPolarity="normal"
        />
        <TrendSnapshotStatCell
          label="Avg Price Gap"
          value={avgPriceGap}
          delta={priceGapDelta}
          deltaPolarity="inverse"
        />
      </div>

      {/* ── 7-day trend table — dates as columns, metrics as rows ── */}
      <div className="overflow-x-auto border-t border-slate-200">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <TH align="left">Metric</TH>
              {rows.map((day) => (
                <TrendDateColumnHeader key={day.date} dateLabel={day.date} />
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
                        Average amount by which your price exceeds the Buy Box winner&apos;s price when you lose the Buy Box.
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

            {/* Row 3: Revenue impact — strip leading sign for display; tone uses raw value */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Revenue impact
              </TD>
              {rows.map((day) => (
                <TrendValueCell
                  key={day.date}
                  value={day.revenueImpact ? day.revenueImpact.replace(/^[+-]/, "") : "—"}
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
