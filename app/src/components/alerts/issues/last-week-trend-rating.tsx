import { TrendDateColumnHeader } from "./trend-date-header";

// Combined "Last 7 Day Trend — Rating & Reviews" widget.
// Snapshot summary tiles (top) + day-by-day trend table (bottom) in one card.
// Matches the structure of LastWeekTrendBuyBox and LastWeekTrendPromoBadge.

// ─── Types ────────────────────────────────────────────────────────────────────

export type RatingTrendDay = {
  date: string;
  avgStarRating: number | null;
  totalReviews: number | null; // cumulative review count as of that day
  oneStarPct: number | null;   // 1-star reviews as % of total reviews that day
  twoStarPct: number | null;   // 2-star reviews as % of total reviews that day
};

export type LastWeekTrendRatingProps = {
  period: string;        // e.g. "May 20–26"
  // ── Snapshot summary (top tiles) ──
  avgRating: number;     // e.g. 4.0
  maxRating?: number;    // defaults to 5.0
  reviewCount: number;   // total reviews in period, e.g. 736
  oneStarPct: number;    // e.g. 14  (rendered as "14%")
  twoStarPct: number;    // e.g. 4   (rendered as "4%")
  belowBenchmark: boolean;
  // ── Day-by-day trend (table) ──
  rows: RatingTrendDay[];
  ratingBenchmark?: number; // cells below this get bg-rose-50 — defaults to 4.0
};

// ─── Snapshot stat tile ───────────────────────────────────────────────────────

type StatCellProps = {
  label: string;
  value: string;
  valueClass?: string;
};

function StatCell({ label, value, valueClass = "text-slate-700" }: StatCellProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className={`text-base font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
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

// ─── Trend cell renderers ──────────────────────────────────────────────────────

/** Avg Star Rating — red cell background if below benchmark, text always neutral */
function AvgRatingCell({
  rating,
  benchmark,
}: {
  rating: number | null;
  benchmark: number;
}) {
  const isBad = rating !== null && rating < benchmark;
  return (
    <TD className={isBad ? "bg-rose-50" : ""}>
      <span className={`font-medium ${rating === null ? "text-slate-400" : isBad ? "text-rose-700" : "text-slate-700"}`}>
        {rating === null ? "—" : rating.toFixed(1)}
      </span>
    </TD>
  );
}

/** New Reviews — neutral count */
function ReviewCountCell({ count }: { count: number | null }) {
  return (
    <TD>
      <span className={`font-medium ${count === null ? "text-slate-400" : "text-slate-800"}`}>
        {count === null ? "—" : count.toLocaleString()}
      </span>
    </TD>
  );
}

/** Rating Δ vs prev day — green for improvement, red for decline, grey for first day */
function RatingDeltaCell({ delta }: { delta: number | null }) {
  if (delta === null) {
    return (
      <TD>
        <span className="text-slate-300">—</span>
      </TD>
    );
  }
  const formatted = delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);
  const color = delta > 0 ? "text-emerald-700" : delta < 0 ? "text-rose-700" : "text-slate-400";
  return (
    <TD>
      <span className={`font-medium ${color}`}>{formatted}</span>
    </TD>
  );
}

/** 1★ or 2★ percentage cell — red background when % exceeds threshold */
function LowStarPctCell({
  pct,
  threshold,
}: {
  pct: number | null;
  threshold: number;
}) {
  const isBad = pct !== null && pct > threshold;
  return (
    <TD className={isBad ? "bg-rose-50" : ""}>
      <span className={`font-medium ${pct === null ? "text-slate-400" : isBad ? "text-rose-700" : "text-slate-700"}`}>
        {pct === null ? "—" : `${pct.toFixed(1)}%`}
      </span>
    </TD>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendRating({
  period,
  avgRating,
  maxRating = 5.0,
  reviewCount,
  oneStarPct,
  twoStarPct,
  belowBenchmark,
  rows,
  ratingBenchmark = 4.0,
}: LastWeekTrendRatingProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-600">Last 7 Day Trend</span>
        <span className="text-xs text-slate-400">({period})</span>
      </div>

      {/* ── Snapshot metric tiles ── */}
      <div className="grid grid-cols-4 gap-0 px-4 py-3">
        <StatCell
          label="Avg Rating"
          value={`${avgRating.toFixed(1)} / ${maxRating.toFixed(1)}`}
          valueClass={belowBenchmark ? "text-rose-600" : "text-slate-700"}
        />
        <StatCell
          label="Review Count"
          value={reviewCount.toLocaleString()}
        />
        <StatCell
          label="1-Star %"
          value={`${oneStarPct}%`}
          valueClass={oneStarPct >= 10 ? "text-rose-600" : "text-slate-700"}
        />
        <StatCell
          label="2-Star %"
          value={`${twoStarPct}%`}
          valueClass={twoStarPct >= 8 ? "text-amber-600" : "text-slate-700"}
        />
      </div>

      {/* ── Day-by-day trend table ── */}
      <div className="overflow-x-auto border-t border-slate-200">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <TH align="left">Metric</TH>
              {rows.map((day) => (
                <TrendDateColumnHeader key={day.date} dateLabel={day.date} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Avg Star Rating
              </TD>
              {rows.map((day) => (
                <AvgRatingCell
                  key={day.date}
                  rating={day.avgStarRating}
                  benchmark={ratingBenchmark}
                />
              ))}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Rating Δ vs prev day
              </TD>
              {rows.map((day, i) => {
                const prev = rows[i - 1]?.avgStarRating ?? null;
                const curr = day.avgStarRating;
                const delta =
                  i === 0 || prev === null || curr === null
                    ? null
                    : Math.round((curr - prev) * 10) / 10;
                return <RatingDeltaCell key={day.date} delta={delta} />;
              })}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Total Reviews
              </TD>
              {rows.map((day) => (
                <ReviewCountCell key={day.date} count={day.totalReviews} />
              ))}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                1★ %
              </TD>
              {rows.map((day) => (
                <LowStarPctCell key={day.date} pct={day.oneStarPct} threshold={10} />
              ))}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                2★ %
              </TD>
              {rows.map((day) => (
                <LowStarPctCell key={day.date} pct={day.twoStarPct} threshold={8} />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
