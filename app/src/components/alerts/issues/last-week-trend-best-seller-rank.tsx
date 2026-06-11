// Merged "Last 7 Day Trend — Best Seller Rank" widget.
// Rendered inside the expanded Best Seller Rank root cause row.

// ─── Types ────────────────────────────────────────────────────────────────────

export type BsrTrendDay = {
  date: string;
  avgCategoryRank: number | null;
  highestRank: number | null;
  lowestRank: number | null;
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

function RankValueCell({ rank }: { rank: number | null }) {
  const display = rank === null ? "—" : `#${rank.toLocaleString()}`;
  return (
    <TD>
      <span
        className={`font-medium ${rank === null ? "text-slate-400" : "text-slate-800"}`}
      >
        {display}
      </span>
    </TD>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type LastWeekTrendBestSellerRankProps = {
  period: string;
  rows: BsrTrendDay[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendBestSellerRank({
  period,
  rows,
}: LastWeekTrendBestSellerRankProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-600">Last 7 Day Trend</span>
        <span className="text-xs text-slate-400">({period})</span>
      </div>

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
                Avg Category Rank
              </TD>
              {rows.map((day) => (
                <RankValueCell key={day.date} rank={day.avgCategoryRank} />
              ))}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Highest Rank
              </TD>
              {rows.map((day) => (
                <RankValueCell key={day.date} rank={day.highestRank} />
              ))}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Lowest Rank
              </TD>
              {rows.map((day) => (
                <RankValueCell key={day.date} rank={day.lowestRank} />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
