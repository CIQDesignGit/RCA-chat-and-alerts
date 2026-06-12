// "Last 7 Day Trend — Keyword Organic Rank" widget.
// Rows = keywords. Columns = dates. Each cell shows organic rank (#N) that day.
//
// Cell coloring is delta-based vs the PREVIOUS day:
//   drop  > 5 ranks  (rank number went up by more than 5)  → bg-rose-50
//   gain >= 5 ranks  (rank number went down by 5 or more)  → bg-emerald-50
//   day 1 / no previous data                               → neutral

// ─── Types ────────────────────────────────────────────────────────────────────

export type KeywordRankTrendRow = {
  keyword: string;
  /** One organic rank per date in the `dates` array — null = no data */
  ranks: (number | null)[];
};

export type LastWeekTrendKeywordRankProps = {
  period: string;  // e.g. "Jun 1–7"
  dates: string[]; // 7 date labels e.g. ["Jun 1", …, "Jun 7"]
  keywords: KeywordRankTrendRow[];
};

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

// ─── Rank cell ─────────────────────────────────────────────────────────────────
// baselineRank = rank on day 1 for this keyword (the comparison anchor).
// delta = current - baseline: positive = dropped (worse), negative = improved (better).

function RankCell({
  rank,
  baselineRank,
}: {
  rank: number | null;
  baselineRank: number | null;
}) {
  const delta =
    rank !== null && baselineRank !== null ? rank - baselineRank : null;

  const cellClass =
    delta === null
      ? ""
      : delta > 5
        ? "bg-rose-50"
        : delta <= -5
          ? "bg-emerald-50"
          : "";

  return (
    <TD className={cellClass}>
      <span className={`font-medium ${rank === null ? "text-slate-400" : "text-slate-800"}`}>
        {rank === null ? "—" : `#${rank}`}
      </span>
    </TD>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendKeywordRank({
  period,
  dates,
  keywords,
}: LastWeekTrendKeywordRankProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-600">Last 7 Day Trend</span>
        <span className="text-xs text-slate-400">({period})</span>
      </div>

      {/* ── Keyword × date grid ── */}
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
            {keywords.map((kw) => (
              <tr key={kw.keyword}>
                <TD align="left" className="max-w-[200px] truncate font-medium text-slate-600">
                  {kw.keyword}
                </TD>
                {kw.ranks.map((rank, i) => (
                  <RankCell
                    key={dates[i]}
                    rank={rank}
                    // Day 1 has no previous day — neutral
                    baselineRank={i > 0 ? (kw.ranks[i - 1] ?? null) : null}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
