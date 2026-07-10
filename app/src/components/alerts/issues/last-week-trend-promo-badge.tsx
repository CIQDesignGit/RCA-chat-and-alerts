// Merged "Last week trend — Promo Badge" widget.
// Combines the snapshot metric tiles and the 7-day visibility trend table
// into one card, rendered inside the expanded Promo Badge root cause row.

import { Check, X } from "lucide-react";
import { TrendDateColumnHeader } from "./trend-date-header";
import { computeRelativeDelta, parseDaysCount, parseDollarString } from "./trend-snapshot-delta";
import { PromoDaysValue, TrendSnapshotStatCell } from "./trend-snapshot-stat-cell";
import { TrendWidgetHeader } from "./trend-widget-header";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PromoBadgeTrendDay = {
  date: string;
  expectedOnPromo: boolean;         // true = SKU was scheduled to carry a promo badge that day
  badgeMissingCrawls: number;
  strikethroughMissingCrawls: number;
  totalCrawls: number;
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

type CellTone = "good" | "bad" | "neutral";

const CELL_TONE_BG: Record<CellTone, string> = {
  good:    "bg-emerald-50",
  bad:     "bg-rose-50",
  neutral: "",
};

const CELL_TONE_TEXT: Record<CellTone, string> = {
  good:    "text-emerald-700",
  bad:     "text-red-700",
  neutral: "text-slate-400",
};

// Zero missing crawls = healthy; any missing = problem.
function getMissingCrawlsTone(missing: number): CellTone {
  return missing === 0 ? "good" : "bad";
}

function TrendValueCell({ value, tone }: { value: string; tone: CellTone }) {
  const textClass = value === "—" ? "text-slate-400" : CELL_TONE_TEXT[tone];
  return (
    <TD className={CELL_TONE_BG[tone]}>
      <span className={`font-medium ${textClass}`}>{value}</span>
    </TD>
  );
}

// ✓ / ✗ cell used for boolean rows (Expected on Promo)
function BooleanCell({ value }: { value: boolean }) {
  return (
    <TD>
      <span
        className={`inline-flex ${value ? "text-emerald-500" : "text-rose-500"}`}
        aria-label={value ? "Yes" : "No"}
      >
        {value ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      </span>
    </TD>
  );
}

// When the SKU is not expected on promo that day, render a muted dash
function MutedCell() {
  return (
    <TD>
      <span className="text-slate-300">—</span>
    </TD>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type LastWeekTrendPromoBadgeProps = {
  period: string;               // e.g. "May 10–16"
  badgeMissingDays: string;     // e.g. "7 / 7 days"
  estRevenueImpact: string;     // e.g. "-$4,200"
  listPriceMismatch: string;    // e.g. "7 / 7 days"
  sellingPriceMismatch: string; // e.g. "7 / 7 days"
  listPriceVisibility: string;  // e.g. "2 / 7 days"
  noStrikethroughOnMsrp: string; // e.g. "7 / 7 days"
  badgeShowing: boolean;        // false = badge not showing (problem state)
  rows: PromoBadgeTrendDay[];
  /** Previous 7-day window values for snapshot deltas. */
  prevBadgeMissingDays?: number;
  prevEstRevenueImpact?: number;
  prevListPriceMismatchDays?: number;
  prevSellingPriceMismatchDays?: number;
  prevListPriceVisibilityDays?: number;
  prevNoStrikethroughDays?: number;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendPromoBadge({
  period,
  badgeMissingDays,
  estRevenueImpact,
  listPriceMismatch,
  sellingPriceMismatch,
  listPriceVisibility,
  noStrikethroughOnMsrp,
  rows,
  prevBadgeMissingDays,
  prevEstRevenueImpact,
  prevListPriceMismatchDays,
  prevSellingPriceMismatchDays,
  prevListPriceVisibilityDays,
  prevNoStrikethroughDays,
}: LastWeekTrendPromoBadgeProps) {
  const badgeMissingCount = parseDaysCount(badgeMissingDays);
  const listPriceMismatchCount = parseDaysCount(listPriceMismatch);
  const sellingPriceMismatchCount = parseDaysCount(sellingPriceMismatch);
  const listPriceVisibilityCount = parseDaysCount(listPriceVisibility);
  const noStrikethroughCount = parseDaysCount(noStrikethroughOnMsrp);
  const revenueImpactAmount = parseDollarString(estRevenueImpact);

  const daysDelta = (current: number | null, prev: number | undefined) =>
    current !== null && prev != null
      ? computeRelativeDelta(current, prev)
      : null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <TrendWidgetHeader period={period} showPrevWeekLegend />
      <div className="grid grid-cols-3 gap-0 px-4 py-3">
        <TrendSnapshotStatCell
          label="Promo Badge Missing"
          value={<PromoDaysValue value={badgeMissingDays} />}
          delta={daysDelta(badgeMissingCount, prevBadgeMissingDays)}
          deltaPolarity="inverse"
        />
        <TrendSnapshotStatCell
          label="Est. Revenue Impact"
          value={estRevenueImpact}
          delta={
            revenueImpactAmount !== null && prevEstRevenueImpact != null
              ? computeRelativeDelta(
                  Math.abs(revenueImpactAmount),
                  Math.abs(prevEstRevenueImpact),
                )
              : null
          }
          deltaPolarity="inverse"
        />
        <TrendSnapshotStatCell
          label="List Price Mismatch"
          value={<PromoDaysValue value={listPriceMismatch} />}
          delta={daysDelta(listPriceMismatchCount, prevListPriceMismatchDays)}
          deltaPolarity="inverse"
        />
      </div>

      <div className="grid grid-cols-3 gap-0 px-4 pb-5 pt-0">
        <TrendSnapshotStatCell
          label="Selling Price Mismatch"
          value={<PromoDaysValue value={sellingPriceMismatch} />}
          delta={daysDelta(sellingPriceMismatchCount, prevSellingPriceMismatchDays)}
          deltaPolarity="inverse"
        />
        <TrendSnapshotStatCell
          label="List Price Visibility"
          value={<PromoDaysValue value={listPriceVisibility} />}
          delta={daysDelta(listPriceVisibilityCount, prevListPriceVisibilityDays)}
          deltaPolarity="normal"
        />
        <TrendSnapshotStatCell
          label="No Strikethrough on MSRP"
          value={<PromoDaysValue value={noStrikethroughOnMsrp} />}
          delta={daysDelta(noStrikethroughCount, prevNoStrikethroughDays)}
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
            {/* Row 0: Expected on Promo — gates all other rows */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Expected on Promo
              </TD>
              {rows.map((day) => (
                <BooleanCell key={day.date} value={day.expectedOnPromo} />
              ))}
            </tr>

            {/* Row 1: Badge missing crawls — muted when not expected on promo */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Badge Missing (crawls)
              </TD>
              {rows.map((day) =>
                day.expectedOnPromo ? (
                  <TrendValueCell
                    key={day.date}
                    value={`${day.badgeMissingCrawls}/${day.totalCrawls}`}
                    tone={getMissingCrawlsTone(day.badgeMissingCrawls)}
                  />
                ) : (
                  <MutedCell key={day.date} />
                )
              )}
            </tr>

            {/* Row 2: MSRP strikethrough missing crawls — muted when not expected on promo */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                MSRP Strikethrough Missing (crawls)
              </TD>
              {rows.map((day) =>
                day.expectedOnPromo ? (
                  <TrendValueCell
                    key={day.date}
                    value={`${day.strikethroughMissingCrawls}/${day.totalCrawls}`}
                    tone={getMissingCrawlsTone(day.strikethroughMissingCrawls)}
                  />
                ) : (
                  <MutedCell key={day.date} />
                )
              )}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}
