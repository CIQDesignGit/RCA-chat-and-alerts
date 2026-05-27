// Snapshot card showing last-week star rating health at a glance.
// Shows avg rating, review count, negative-review percentages, and benchmark flag.
// Day-wise trend table is not included yet — will be added in a later iteration.

type RatingStatus = "healthy" | "at-risk" | "critical";

// Status is derived from props — callers don't pass it explicitly.
// critical  → rating is below the benchmark threshold
// at-risk   → 1-star % is high but rating is still above benchmark
// healthy   → all signals within acceptable range
const STATUS_DOT: Record<RatingStatus, string> = {
  healthy:   "bg-emerald-500",
  "at-risk": "bg-amber-400",
  critical:  "bg-rose-500",
};

// ─── Shared stat cell ─────────────────────────────────────────────────────────

type StatCellProps = {
  label: string;
  value: string;
  valueClass?: string;
};

function StatCell({ label, value, valueClass = "text-slate-800" }: StatCellProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className={`text-sm font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type LastWeekSnapshotRatingProps = {
  /** Display period — e.g. "May 20–26" */
  period: string;
  /** Numeric average rating — e.g. 4.0 */
  avgRating: number;
  /** Max scale — defaults to 5.0 */
  maxRating?: number;
  /** Total review count — e.g. 736 */
  reviewCount: number;
  /** % of reviews that are 1-star — e.g. 14 */
  oneStarPct: number;
  /** % of reviews that are 2-star — e.g. 4 */
  twoStarPct: number;
  /** True when avg rating falls below the configured benchmark */
  belowBenchmark: boolean;
  /** The benchmark threshold to show in the header — e.g. 3.5 */
  benchmarkRating?: number;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekSnapshotRating({
  period,
  avgRating,
  maxRating = 5.0,
  reviewCount,
  oneStarPct,
  twoStarPct,
  belowBenchmark,
  benchmarkRating,
}: LastWeekSnapshotRatingProps) {
  // Derive visual status from the data signals
  const status: RatingStatus = belowBenchmark
    ? "critical"
    : oneStarPct >= 15
      ? "at-risk"
      : "healthy";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[status]}`} />
          <span className="text-xs font-medium text-slate-500">
            Last week snapshot · Rating ({period})
          </span>
        </div>
        {/* Benchmark threshold — gives reviewers instant context */}
        {benchmarkRating !== undefined && (
          <span className="text-[10px] text-slate-400">
            Benchmark: {benchmarkRating.toFixed(1)}★
          </span>
        )}
      </div>

      {/* ── Row 1: Avg Rating · Review Count · Below-Benchmark Flag ── */}
      <div className="grid grid-cols-3 gap-0 border-b border-slate-100 px-4 py-3">
        <StatCell
          label="Avg Rating"
          value={`${avgRating.toFixed(1)} / ${maxRating.toFixed(1)}`}
          valueClass={belowBenchmark ? "text-rose-600" : "text-slate-800"}
        />
        <StatCell
          label="Review Count"
          value={reviewCount.toLocaleString()}
        />
        <StatCell
          label="Below-Benchmark Flag"
          value={belowBenchmark ? "Yes" : "No"}
          valueClass={belowBenchmark ? "text-rose-600" : "text-emerald-600"}
        />
      </div>

      {/* ── Row 2: Negative-review breakdown ── */}
      <div className="grid grid-cols-3 gap-0 px-4 py-3">
        {/* 1-star % ≥ 10 is a concern — highlight in red */}
        <StatCell
          label="1-Star %"
          value={`${oneStarPct}%`}
          valueClass={oneStarPct >= 10 ? "text-rose-600" : "text-slate-800"}
        />
        {/* 2-star % ≥ 8 is a concern — highlight in amber */}
        <StatCell
          label="2-Star %"
          value={`${twoStarPct}%`}
          valueClass={twoStarPct >= 8 ? "text-amber-600" : "text-slate-800"}
        />
      </div>
    </div>
  );
}
