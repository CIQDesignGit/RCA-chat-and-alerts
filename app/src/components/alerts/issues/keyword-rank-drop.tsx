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
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-100 text-xs font-semibold text-slate-500">
            <th className="px-4 py-2.5 text-left">Keyword</th>
            <th className="w-32 px-4 py-2.5 text-center">Prev Rank</th>
            <th className="w-32 px-4 py-2.5 text-center">Current</th>
          </tr>
        </thead>
        <tbody>
          {keywords.map((row) => (
            <tr key={row.keyword} className="border-b border-slate-100 last:border-b-0 text-sm">
              {/* Keyword + volume */}
              <td className="px-4 py-2.5 align-top">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-slate-700">{row.keyword}</span>
                  <span className="text-[10px] text-slate-400">{row.searchVolume}</span>
                </div>
              </td>

              {/* Previous rank */}
              <td className="px-4 py-2.5 text-center text-slate-500">
                #{row.previousRank}
              </td>

              {/* Current rank + delta */}
              <td className="px-4 py-2.5">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-bold text-red-500">#{row.currentRank}</span>
                  <RankDelta prev={row.previousRank} curr={row.currentRank} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
