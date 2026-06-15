// Merged "Last week trend — Deal Page Visibility" widget.
// Rendered inside the expanded Deal Page Visibility root cause row.

import { Check, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DealPageTrendDay = {
  date: string;
  visibleOnDealsPage: boolean;
  dealPageRank: number | null; // null means not on the deals page that day
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

function VisibilityCell({ visible }: { visible: boolean }) {
  return (
    <TD>
      <span
        className={`inline-flex ${visible ? "text-emerald-500" : "text-rose-500"}`}
        aria-label={visible ? "Visible on deals page" : "Not visible on deals page"}
      >
        {visible ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      </span>
    </TD>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type LastWeekTrendDealPageProps = {
  period: string;
  rows: DealPageTrendDay[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendDealPage({ period, rows }: LastWeekTrendDealPageProps) {
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
            {/* Row 1: Was the SKU visible on the deals page that day? */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Visible on deals page
              </TD>
              {rows.map((day) => (
                <VisibilityCell key={day.date} visible={day.visibleOnDealsPage} />
              ))}
            </tr>

            {/* Row 2: What position/rank did it hold on the deals page? null = not present */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Deal-Page Rank
              </TD>
              {rows.map((day) => (
                <TD key={day.date}>
                  {day.dealPageRank !== null ? (
                    <span className="font-medium text-slate-700">#{day.dealPageRank}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </TD>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
