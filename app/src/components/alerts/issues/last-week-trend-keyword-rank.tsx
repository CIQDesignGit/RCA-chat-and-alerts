// "Last 7 Day Trend — Keyword Rank" widget.
// Shows top 3 keywords. Each keyword expands into two rows:
//   • Organic rank — position in unpaid search results
//   • Paid rank    — position via sponsored/ads
//
// Cell coloring is delta-based vs the previous day:
//   drop  > 5 ranks  (rank number went up by more than 5)  → bg-rose-50
//   gain >= 5 ranks  (rank number went down by 5 or more)  → bg-emerald-50
//   day 1 / no data                                        → neutral

// ─── Types ────────────────────────────────────────────────────────────────────

export type KeywordRankTrendRow = {
  keyword: string;
  /** Organic rank per date — null = not ranking */
  organicRanks: (number | null)[];
  /** Paid rank per date — null = no active ad / no data */
  paidRanks: (number | null)[];
};

export type LastWeekTrendKeywordRankProps = {
  period: string;   // e.g. "Jun 1–7"
  dates: string[];  // 7 date labels e.g. ["Jun 1", …, "Jun 7"]
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

function RankCell({
  rank,
  prevRank,
}: {
  rank: number | null;
  prevRank: number | null;
}) {
  const delta =
    rank !== null && prevRank !== null ? rank - prevRank : null;

  const cellClass =
    delta === null ? ""
    : delta > 5    ? "bg-rose-50"
    : delta <= -5  ? "bg-emerald-50"
    : "";

  const textClass =
    rank === null  ? "text-slate-300"
    : delta === null ? "text-slate-700"
    : delta > 5    ? "text-rose-700"
    : delta <= -5  ? "text-emerald-700"
    : "text-slate-700";

  return (
    <TD className={cellClass}>
      <span className={`font-medium ${textClass}`}>
        {rank === null ? "N/A" : `#${rank}`}
      </span>
    </TD>
  );
}

// ─── Type badge ───────────────────────────────────────────────────────────────

function RankTypeBadge({ type }: { type: "organic" | "paid" }) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
        type === "organic"
          ? "bg-slate-100 text-slate-500"
          : "bg-violet-50 text-violet-600"
      }`}
    >
      {type === "organic" ? "Organic" : "Paid"}
    </span>
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
              <TH align="left">
                Keyword (Median Rank)
              </TH>
              <TH align="left">Type</TH>
              {dates.map((d) => (
                <TH key={d}>{d}</TH>
              ))}
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw, kwIdx) => (
              <>
                {/* Organic row — shows keyword name */}
                <tr
                  key={`${kw.keyword}-organic`}
                  className={kwIdx > 0 ? "border-t-2 border-slate-200" : "border-t border-slate-100"}
                >
                  {/* rowSpan=2 merges the keyword cell across the organic + paid rows */}
                  <td
                    rowSpan={2}
                    className="whitespace-nowrap px-4 py-2.5 text-xs text-left align-middle max-w-[200px] truncate font-medium text-slate-700"
                  >
                    {kw.keyword}
                  </td>
                  <TD align="left">
                    <RankTypeBadge type="organic" />
                  </TD>
                  {kw.organicRanks.map((rank, i) => (
                    <RankCell
                      key={dates[i]}
                      rank={rank}
                      prevRank={i > 0 ? (kw.organicRanks[i - 1] ?? null) : null}
                    />
                  ))}
                </tr>

                {/* Paid row — keyword column omitted (covered by rowSpan above) */}
                <tr
                  key={`${kw.keyword}-paid`}
                  className="border-t border-slate-100"
                >
                  <TD align="left">
                    <RankTypeBadge type="paid" />
                  </TD>
                  {kw.paidRanks.map((rank, i) => (
                    <RankCell
                      key={dates[i]}
                      rank={rank}
                      prevRank={i > 0 ? (kw.paidRanks[i - 1] ?? null) : null}
                    />
                  ))}
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
