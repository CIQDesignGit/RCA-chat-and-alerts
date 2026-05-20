import { Info, ChevronRight } from "lucide-react";

// ─── SoV metric card (Sponsored Product / Sponsored Brand) ───────────────────

function SovMetricCard({
  label,
  prevSov,
  currSov,
  competitorSov,
  competitorLabel,
}: {
  label: string;
  prevSov: number;
  currSov: number;
  competitorSov: number;
  competitorLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
      {/* Label + info icon */}
      <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
        {label}
        <Info className="h-3.5 w-3.5 text-slate-400" />
      </div>

      {/* Prev → Curr */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400">{prevSov}%</span>
        <span className="text-slate-300">→</span>
        <span className="font-bold text-rose-500">{currSov}%</span>
      </div>

      {/* Competitor benchmark */}
      <p className="text-xs text-slate-400">
        {competitorLabel} <span className="font-semibold text-slate-600">{competitorSov}%</span>
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export type SovDropProps = {
  spPrev: number;
  spCurr: number;
  spCompetitor: number;
  sbPrev: number;
  sbCurr: number;
  sbCompetitor: number;
  keywords: {
    keyword: string;
    spFrom: number;
    spTo: number;
    sbFrom: number;
    sbTo: number;
  }[];
};

export function SovDropIssue(p: SovDropProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Metric cards row */}
      <div className="flex gap-3">
        <SovMetricCard
          label="Sponsored Product SoV"
          prevSov={p.spPrev}
          currSov={p.spCurr}
          competitorSov={p.spCompetitor}
          competitorLabel="Competitor SP SoV"
        />
        <SovMetricCard
          label="Sponsored Brand SoV"
          prevSov={p.sbPrev}
          currSov={p.sbCurr}
          competitorSov={p.sbCompetitor}
          competitorLabel="Competitor SB SoV"
        />
      </div>

      {/* Top Contributing Keywords table */}
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">
          Top Contributing Keywords
        </p>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 text-xs font-semibold text-slate-500">
                <th className="px-4 py-2.5 text-left">Keyword</th>
                <th className="px-4 py-2.5 text-left">SP SoV (from → to)</th>
                <th className="px-4 py-2.5 text-left">SB SoV (from → to)</th>
              </tr>
            </thead>
            <tbody className="px-4">
              {p.keywords.map((kw) => (
                <tr key={kw.keyword} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5 text-sm text-slate-700">
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {kw.keyword}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-1.5 text-sm">
                      <span className="text-slate-400">{kw.spFrom}%</span>
                      <span className="text-slate-300">→</span>
                      <span className="font-semibold text-slate-700">{kw.spTo}%</span>
                      <span className="font-semibold text-rose-500">
                        ({Math.round(((kw.spTo - kw.spFrom) / kw.spFrom) * 100)}%)
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-1.5 text-sm">
                      <span className="text-slate-400">{kw.sbFrom}%</span>
                      <span className="text-slate-300">→</span>
                      <span className="font-semibold text-slate-700">{kw.sbTo}%</span>
                      <span className="font-semibold text-rose-500">
                        ({Math.round(((kw.sbTo - kw.sbFrom) / kw.sbFrom) * 100)}%)
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
