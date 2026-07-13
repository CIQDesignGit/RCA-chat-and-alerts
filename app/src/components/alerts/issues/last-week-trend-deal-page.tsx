// Merged "Last week trend — Deal Page Visibility" widget.
// Rendered inside the expanded Deal Page Visibility root cause row.

import { Check, X } from "lucide-react";
import { TrendDateColumnHeader } from "./trend-date-header";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DealPageTrendDay = {
  date: string;
  expectedOnDealsPage: boolean;   // true = SKU was scheduled to appear on the deals page that day
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

function BooleanCell({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
  return (
    <TD>
      <span
        className={`inline-flex ${value ? "text-emerald-500" : "text-rose-500"}`}
        aria-label={value ? trueLabel : falseLabel}
      >
        {value ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      </span>
    </TD>
  );
}

// Muted dash for days not expected on deals page
function MutedCell() {
  return (
    <TD>
      <span className="text-slate-300">—</span>
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
        <span className="text-xs font-medium text-slate-600">Last Week Trend</span>
        <span className="text-xs text-slate-400">({period})</span>
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
            {/* Row 0: Expected on deals page — gates all other rows */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Expected on deals page
              </TD>
              {rows.map((day) => (
                <BooleanCell
                  key={day.date}
                  value={day.expectedOnDealsPage}
                  trueLabel="Expected on deals page"
                  falseLabel="Not expected on deals page"
                />
              ))}
            </tr>

            {/* Row 1: Was the SKU visible? — muted when not expected on deals page */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Visible on deals page
              </TD>
              {rows.map((day) =>
                day.expectedOnDealsPage ? (
                  <BooleanCell
                    key={day.date}
                    value={day.visibleOnDealsPage}
                    trueLabel="Visible on deals page"
                    falseLabel="Not visible on deals page"
                  />
                ) : (
                  <MutedCell key={day.date} />
                )
              )}
            </tr>

            {/* Row 2: Deal-Page Rank — muted when not expected on deals page */}
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Deal-Page Rank
              </TD>
              {rows.map((day) => {
                if (!day.expectedOnDealsPage) return <MutedCell key={day.date} />;
                return (
                  <TD key={day.date}>
                    {day.dealPageRank !== null ? (
                      <span className="font-medium text-slate-700">#{day.dealPageRank}</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </TD>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
