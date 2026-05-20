import { ArrowDown, ArrowUp, Minus } from "lucide-react";

type KeywordRow = {
  keyword: string;
  previousRank: number;
  currentRank: number;
  searchVolume: string; // e.g. "180K / mo"
};

type KeywordRankDropProps = {
  keywords: KeywordRow[];
};

function RankDelta({ prev, curr }: { prev: number; curr: number }) {
  const delta = curr - prev; // positive = dropped (rank number went up = worse)
  if (delta === 0) return <Minus className="h-3.5 w-3.5 text-slate-400" />;
  if (delta > 0)
    return (
      <span className="flex items-center gap-0.5 text-[11px] font-semibold text-red-500">
        <ArrowDown className="h-3 w-3" />
        {delta}
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
      <ArrowUp className="h-3 w-3" />
      {Math.abs(delta)}
    </span>
  );
}

export function KeywordRankDropIssue({ keywords }: KeywordRankDropProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-4 border-b bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <div className="col-span-2 px-4 py-2">Keyword</div>
        <div className="border-l px-4 py-2 text-center">Prev Rank</div>
        <div className="border-l px-4 py-2 text-center">Current</div>
      </div>

      {/* Keyword rows */}
      {keywords.map((row) => (
        <div
          key={row.keyword}
          className="grid grid-cols-4 items-center border-b last:border-b-0 text-sm"
        >
          {/* Keyword + volume */}
          <div className="col-span-2 flex flex-col gap-0.5 px-4 py-2.5">
            <span className="font-medium text-slate-700">{row.keyword}</span>
            <span className="text-[10px] text-slate-400">{row.searchVolume}</span>
          </div>

          {/* Previous rank */}
          <div className="border-l px-4 py-2.5 text-center text-slate-500">
            #{row.previousRank}
          </div>

          {/* Current rank + delta */}
          <div className="flex items-center justify-center gap-2 border-l px-4 py-2.5">
            <span className="font-bold text-red-500">#{row.currentRank}</span>
            <RankDelta prev={row.previousRank} curr={row.currentRank} />
          </div>
        </div>
      ))}
    </div>
  );
}
