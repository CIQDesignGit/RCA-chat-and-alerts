// "Last 7 Day Trend — Media Spend" widget.
// Rows = keywords (+ a "Total" footer row). Columns = dates.
// Each cell shows daily ad spend for that keyword on that day.
// Rendered inside the expanded Media Spend root cause row.

// ─── Types ────────────────────────────────────────────────────────────────────

export type MediaSpendTrendKeyword = {
  keyword: string;
  /** One spend value per date in the `dates` array — null = no data */
  dailySpend: (number | null)[];
  /** If true, renders as a bold "Total" summary row */
  isTotal?: boolean;
};

export type LastWeekTrendMediaSpendProps = {
  period: string;               // e.g. "Jun 1–7"
  dates: string[];              // 7 date labels e.g. ["Jun 1", …, "Jun 7"]
  keywords: MediaSpendTrendKeyword[];
};

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtSpend(value: number | null): string {
  if (value === null) return "—";
  if (value === 0) return "$0";
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

// ─── Shared table primitives ───────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendMediaSpend({
  period,
  dates,
  keywords,
}: LastWeekTrendMediaSpendProps) {
  const bodyRows = keywords.filter((kw) => !kw.isTotal);
  const totalRow = keywords.find((kw) => kw.isTotal);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-600">Last 7 Day Trend</span>
        <span className="text-xs text-slate-400">({period})</span>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <TH align="left">Keyword</TH>
              {dates.map((d) => (
                <TH key={d}>{d}</TH>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bodyRows.map((kw) => (
              <tr key={kw.keyword}>
                <TD align="left" className="max-w-[180px] truncate font-medium text-slate-600">
                  {kw.keyword}
                </TD>
                {kw.dailySpend.map((spend, i) => (
                  <TD key={dates[i]}>
                    <span className={`font-medium ${spend === null ? "text-slate-400" : "text-slate-700"}`}>
                      {fmtSpend(spend)}
                    </span>
                  </TD>
                ))}
              </tr>
            ))}
          </tbody>
          {/* Total row — separated from body with a stronger border */}
          {totalRow && (
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <TD align="left" className="font-semibold text-slate-700">
                  Total (all KWs)
                </TD>
                {totalRow.dailySpend.map((spend, i) => (
                  <TD key={dates[i]}>
                    <span className={`font-semibold ${spend === null ? "text-slate-400" : "text-slate-700"}`}>
                      {fmtSpend(spend)}
                    </span>
                  </TD>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
