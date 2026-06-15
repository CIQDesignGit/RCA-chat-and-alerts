// Merged "Last week trend — Coupon" widget.
// Rendered inside the expanded Coupon root cause row.

// ─── Types ────────────────────────────────────────────────────────────────────

export type CouponTrendDay = {
  date: string;
  // How many crawls detected the coupon vs total crawls run that day (e.g. 3/5)
  detectedCrawls: number;
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

// Shows "x/y" — always neutral grey regardless of detection rate
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
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendCoupon({ period, rows }: LastWeekTrendCouponProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-600">Last 7 Day Trend</span>
        <span className="text-xs text-slate-400">({period})</span>
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
