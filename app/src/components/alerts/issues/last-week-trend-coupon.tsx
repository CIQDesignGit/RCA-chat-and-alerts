import { TrendDateColumnHeader } from "./trend-date-header";
import { computeRelativeDelta } from "./trend-snapshot-delta";
import { TrendSnapshotStatCell } from "./trend-snapshot-stat-cell";
import { TrendWidgetHeader } from "./trend-widget-header";

// Merged "Last week trend — Coupon" widget.
// Rendered inside the expanded Coupon root cause row.

// ─── Types ────────────────────────────────────────────────────────────────────

export type CouponTrendDay = {
  date: string;
  // How many crawls detected the coupon vs total crawls run that day (e.g. 3/5)
  detectedCrawls: number;
  totalCrawls: number;
};

function sumCouponTotals(rows: CouponTrendDay[]) {
  return rows.reduce(
    (acc, day) => ({
      detected: acc.detected + day.detectedCrawls,
      total: acc.total + day.totalCrawls,
    }),
    { detected: 0, total: 0 },
  );
}

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

function CouponDetectedCell({
  detectedCrawls,
  totalCrawls,
}: {
  detectedCrawls: number;
  totalCrawls: number;
}) {
  return (
    <TD>
      <span className="font-medium text-slate-700">
        {detectedCrawls}/{totalCrawls}
      </span>
    </TD>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type LastWeekTrendCouponProps = {
  period: string;
  rows: CouponTrendDay[];
  /** 7-day snapshot totals — default to sum of daily rows. */
  totalDetectedCrawls?: number;
  totalCrawls?: number;
  /** Previous 7-day window totals for snapshot delta. */
  prevTotalDetectedCrawls?: number;
  prevTotalCrawls?: number;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendCoupon({
  period,
  rows,
  totalDetectedCrawls,
  totalCrawls,
  prevTotalDetectedCrawls,
}: LastWeekTrendCouponProps) {
  const rowTotals = sumCouponTotals(rows);
  const resolvedDetected = totalDetectedCrawls ?? rowTotals.detected;
  const resolvedTotal = totalCrawls ?? rowTotals.total;

  const detectedDelta =
    prevTotalDetectedCrawls != null
      ? computeRelativeDelta(resolvedDetected, prevTotalDetectedCrawls)
      : null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <TrendWidgetHeader period={period} showPrevWeekLegend />

      {/* ── 7-day snapshot ── */}
      <div className="border-b border-slate-100 px-4 py-3">
        <TrendSnapshotStatCell
          label="Total Coupon Detected (crawls)"
          value={`${resolvedDetected}/${resolvedTotal}`}
          delta={detectedDelta}
          deltaPolarity="normal"
        />
      </div>

      {/* ── 7-day trend table — dates as columns, metrics as rows ── */}
      <div className="overflow-x-auto">
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
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Coupon Detected
              </TD>
              {rows.map((day) => (
                <CouponDetectedCell
                  key={day.date}
                  detectedCrawls={day.detectedCrawls}
                  totalCrawls={day.totalCrawls}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
