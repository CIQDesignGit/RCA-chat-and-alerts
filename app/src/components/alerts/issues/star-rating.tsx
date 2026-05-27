import { Star, ArrowRight } from "lucide-react";
import { LastWeekSnapshotRating } from "./last-week-snapshot-rating";

function Stars({
  rating,
  active = false,
}: {
  rating: number;
  active?: boolean;
}) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const color = active ? "fill-rose-500 text-rose-500" : "fill-slate-300 text-slate-300";
  const halfColor = active ? "fill-rose-200 text-rose-500" : "fill-slate-200 text-slate-300";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className={`h-5 w-5 ${color}`} />
      ))}
      {half === 1 && <Star className={`h-5 w-5 ${halfColor}`} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className="h-5 w-5 fill-slate-200 text-slate-200" />
      ))}
    </div>
  );
}

export type StarRatingProps = {
  oldRating: number;
  newRating: number;
};

export function StarRatingIssue({ oldRating, newRating }: StarRatingProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Old → New rating comparison */}
      <div className="flex items-center gap-4">
        {/* Old rating box — grey, neutral */}
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-400">{oldRating.toFixed(1)}</span>
            <Stars rating={oldRating} active={false} />
          </div>
          <span className="text-xs text-slate-400">Old</span>
        </div>

        {/* Arrow */}
        <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" />

        {/* New rating box — rose/pink, indicates the drop */}
        <div className="flex flex-col gap-2 rounded-xl border border-rose-100 bg-white px-5 py-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-rose-500">{newRating.toFixed(1)}</span>
            <Stars rating={newRating} active={true} />
          </div>
          <span className="text-xs text-slate-400">New</span>
        </div>
      </div>

      {/* Last-week snapshot — mock data; replace with real API props when ready */}
      <LastWeekSnapshotRating
        period="May 20–26"
        avgRating={4.0}
        reviewCount={736}
        oneStarPct={14}
        twoStarPct={4}
        belowBenchmark={false}
        benchmarkRating={3.5}
      />
    </div>
  );
}
