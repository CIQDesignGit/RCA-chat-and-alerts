import { ArrowRight, Info, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LastWeekTrendRating } from "./last-week-trend-rating";

function RatingLabel({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <div className="inline-flex w-fit items-center gap-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <Tooltip>
        <TooltipTrigger className="cursor-help">
          <Info className="h-3 w-3 shrink-0 text-slate-400" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-56 leading-snug">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

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
  /** Total star ratings (rating count) at the start of the comparison period */
  oldReviewCount: number;
  /** Written text reviews at the start of the comparison period */
  oldWrittenReviewCount: number;
  newRating: number;
  /** Total star ratings (rating count) — shown inline next to the number as (N) */
  reviewCount: number;
  /** Written text reviews — shown as "N reviews" below the stars */
  writtenReviewCount: number;
  /** Net-new reviews since yesterday */
  newReviewsSinceYesterday: number;
  /**
   * Only pass when a fresh ≤2★ review actually landed.
   * When absent the flag card is suppressed entirely.
   */
  latestLowStarReview?: {
    stars: 1 | 2;
    excerpt: string;
    timeAgo?: string; // e.g. "3 hours ago"
  };
};

export function StarRatingIssue({
  oldRating,
  oldReviewCount,
  oldWrittenReviewCount,
  newRating,
  reviewCount,
  writtenReviewCount,
  newReviewsSinceYesterday,
  latestLowStarReview,
}: StarRatingProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Old → New rating comparison */}
      <div className="flex items-stretch gap-4">
        {/* Old rating box — grey, neutral */}
        <div className="flex w-fit flex-col gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4">
          <RatingLabel
            label="Old Rating"
            tooltip="Average star rating from the previous 7 days."
          />
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-2xl font-bold text-slate-400">{oldRating.toFixed(1)}</span>
            <Stars rating={oldRating} active={false} />
            <span className="text-sm text-slate-400">({oldReviewCount.toLocaleString()})</span>
          </div>
          <span className="text-xs text-slate-700">
            {oldWrittenReviewCount.toLocaleString()} reviews
          </span>
        </div>

        {/* Arrow — centered vertically between the two cards */}
        <div className="flex items-center">
          <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" />
        </div>

        {/* New rating box — rose/pink, shows review count + new reviews delta */}
        <div className="flex w-fit flex-col gap-2 rounded-xl border border-rose-100 bg-white px-5 py-4">
          <RatingLabel
            label="New Rating"
            tooltip="Current star rating from the latest PDP crawl."
          />
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-2xl font-bold text-rose-500">{newRating.toFixed(1)}</span>
            <Stars rating={newRating} active={true} />
            <span className="text-sm text-slate-700">({reviewCount.toLocaleString()})</span>
          </div>
          {/* Written review count + new-since-yesterday */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-700">
              {writtenReviewCount.toLocaleString()} reviews
            </span>
            {newReviewsSinceYesterday > 0 && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                +{newReviewsSinceYesterday} since yesterday
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Low-star flag — only rendered when a fresh ≤2★ review landed */}
      {latestLowStarReview && (
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              {/* Star badge */}
              <span className="inline-flex items-center rounded-full border border-rose-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-rose-600">
                {latestLowStarReview.stars}★
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 line-clamp-2">
              &ldquo;{latestLowStarReview.excerpt}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Combined snapshot + trend — mock data; replace with real API props when ready */}
      <LastWeekTrendRating
        period="May 20–26"
        avgRating={4.0}
        reviewCount={736}
        oneStarPct={14}
        twoStarPct={4}
        belowBenchmark={false}
        rows={[
          { date: "May 20", avgStarRating: 4.3, totalReviews: 718, newOneStar: 0, newTwoStar: 1 },
          { date: "May 21", avgStarRating: 4.2, totalReviews: 740, newOneStar: 1, newTwoStar: 1 },
          { date: "May 22", avgStarRating: 4.1, totalReviews: 755, newOneStar: 1, newTwoStar: 2 },
          { date: "May 23", avgStarRating: 3.9, totalReviews: 786, newOneStar: 3, newTwoStar: 5 },
          { date: "May 24", avgStarRating: 3.7, totalReviews: 813, newOneStar: 4, newTwoStar: 5 },
          { date: "May 25", avgStarRating: 3.4, totalReviews: 832, newOneStar: 3, newTwoStar: 4 },
          { date: "May 26", avgStarRating: 3.2, totalReviews: 846, newOneStar: 2, newTwoStar: 4 },
        ]}
      />
    </div>
  );
}
