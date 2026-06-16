// Merged "Last week trend — Promo Badge" widget.
// Combines the snapshot metric tiles and the 7-day visibility trend table
// into one card, rendered inside the expanded Promo Badge root cause row.

// ─── Types ────────────────────────────────────────────────────────────────────

type StatCellProps = {
  label: string;
  value: string;
  valueClass?: string;
};

// Renders a metric tile. Values ending in " days" get the suffix styled lighter.
function StatCell({ label, value, valueClass = "text-slate-700" }: StatCellProps) {
  const hasDaysSuffix = value.endsWith(" days");
  const numberPart = hasDaysSuffix ? value.slice(0, -5) : value;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className={`text-base font-semibold ${valueClass}`}>
        {numberPart}
        {hasDaysSuffix && (
          <span className="text-sm font-normal text-slate-500"> days</span>
        )}
      </span>
    </div>
  );
}

export type PromoBadgeTrendDay = {
  date: string;
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
}: LastWeekTrendPromoBadgeProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-600">Last 7 Day Trend</span>
        <span className="text-xs text-slate-400">({period})</span>
      </div>

      {/* ── Snapshot metrics row 1 ── */}
      <div className="grid grid-cols-3 gap-0 px-4 py-3">
        <StatCell label="Promo Badge Missing" value={badgeMissingDays} />
        <StatCell
          label="Est. Revenue Impact"
          value={estRevenueImpact}
          valueClass={estRevenueImpact === "$0" ? "text-slate-700" : "text-rose-600"}
        />
        <StatCell label="List Price Mismatch" value={listPriceMismatch} />
      </div>

      {/* ── Snapshot metrics row 2 ── */}
      <div className="grid grid-cols-3 gap-0 px-4 pb-5 pt-0">
        <StatCell label="Selling Price Mismatch"  value={sellingPriceMismatch} />
        <StatCell label="List Price Visibility"    value={listPriceVisibility} />
        <StatCell label="No Strikethrough on MSRP" value={noStrikethroughOnMsrp} />
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
            {/* Row 1: Badge missing crawls */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Badge Missing (crawls)
              </TD>
              {rows.map((day) => (
                <TrendValueCell
                  key={day.date}
                  value={`${day.badgeMissingCrawls}/${day.totalCrawls}`}
                  tone={getMissingCrawlsTone(day.badgeMissingCrawls)}
                />
              ))}
            </tr>

            {/* Row 2: MSRP strikethrough missing crawls */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                MSRP Strikethrough Missing (crawls)
              </TD>
              {rows.map((day) => (
                <TrendValueCell
                  key={day.date}
                  value={`${day.strikethroughMissingCrawls}/${day.totalCrawls}`}
                  tone={getMissingCrawlsTone(day.strikethroughMissingCrawls)}
                />
              ))}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}
