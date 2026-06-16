const RANK_DROP_THRESHOLD = 5;

type KeywordRow = {
  keyword: string;
  organicPreviousRank: number;
  organicCurrentRank: number;
  /** null = no active ad / no sponsored data */
  paidPreviousRank: number | null;
  paidCurrentRank: number | null;
};

type KeywordRankDropProps = {
  keywords: KeywordRow[];
};

function isThresholdBreached(prev: number, curr: number) {
  return curr - prev >= RANK_DROP_THRESHOLD;
}

function KeywordRankCard({ row }: { row: KeywordRow }) {
  const organicBreached = isThresholdBreached(
    row.organicPreviousRank,
    row.organicCurrentRank,
  );
  const hasPaid = row.paidPreviousRank !== null && row.paidCurrentRank !== null;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
      {/* Keyword + optional threshold badge */}
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-sm text-slate-700">&quot;{row.keyword}&quot;</span>
        {organicBreached && (
          <span className="shrink-0 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-600">
            Threshold Breached
          </span>
        )}
      </div>

      {/* Organic + paid ranks stacked on the right */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        {/* Organic */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[10px] font-medium text-slate-400">Organic</span>
          <span className="font-medium text-slate-500">#{row.organicPreviousRank}</span>
          <span className="text-slate-400">→</span>
          <span className={`font-semibold ${organicBreached ? "text-rose-500" : "text-slate-700"}`}>
            #{row.organicCurrentRank}
          </span>
        </div>

        {/* Paid (only when data exists) */}
        {hasPaid && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[10px] font-medium text-violet-400">Paid</span>
            <span className="font-medium text-slate-500">#{row.paidPreviousRank}</span>
            <span className="text-slate-400">→</span>
            <span
              className={`font-semibold ${
                isThresholdBreached(row.paidPreviousRank!, row.paidCurrentRank!)
                  ? "text-rose-500"
                  : "text-slate-700"
              }`}
            >
              #{row.paidCurrentRank}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function KeywordRankDropIssue({ keywords }: KeywordRankDropProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        {keywords.map((row) => (
          <KeywordRankCard key={row.keyword} row={row} />
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs leading-relaxed text-slate-500">
          <span className="font-medium text-slate-600">Threshold Breached:</span>{" "}
          Organic keyword rank crossed the defined threshold of 5 ranks.
        </p>
        <p className="text-xs leading-relaxed text-slate-400">
          Previous ranks are calculated based on the available data from the previous 7 days.
        </p>
      </div>
    </div>
  );
}
