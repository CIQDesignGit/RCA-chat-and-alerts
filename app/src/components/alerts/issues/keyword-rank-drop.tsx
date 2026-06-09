const RANK_DROP_THRESHOLD = 5;

type KeywordRow = {
  keyword: string;
  previousRank: number;
  currentRank: number;
};

function isThresholdBreached(previousRank: number, currentRank: number) {
  return currentRank - previousRank >= RANK_DROP_THRESHOLD;
}

type KeywordRankDropProps = {
  keywords: KeywordRow[];
};

function KeywordRankCard({ row }: { row: KeywordRow }) {
  const breached = isThresholdBreached(row.previousRank, row.currentRank);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
      {/* Keyword + optional threshold badge */}
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-sm text-slate-700">&quot;{row.keyword}&quot;</span>
        {breached && (
          <span className="shrink-0 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-600">
            Threshold Breached
          </span>
        )}
      </div>

      {/* Rank transition — old → new */}
      <div className="flex shrink-0 items-center gap-2 text-sm">
        <span className="font-medium text-slate-700">#{row.previousRank}</span>
        <span className="text-slate-400">→</span>
        <span className="font-bold text-rose-500">#{row.currentRank}</span>
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
