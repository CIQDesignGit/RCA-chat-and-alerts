import { ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type BestSellerRankProps = {
  previousRank: number;
  currentRank: number;
  category: string;
  /** Label under the previous rank shield — defaults to "7d avg" */
  previousLabel?: string;
  /** Label under the current rank shield — defaults to "New" */
  currentLabel?: string;
};

// Vertical shield outline used for both rank states
function RankShield({
  rank,
  label,
  variant,
  labelDotted = false,
}: {
  rank: number;
  label: string;
  variant: "previous" | "current";
  labelDotted?: boolean;
}) {
  const isPrevious = variant === "previous";
  const textColor = isPrevious ? "text-slate-800" : "text-rose-500";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[112px] w-[96px]">
        <svg
          viewBox="0 0 96 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <path
            d="M48 5 L81 19 Q86 21 86 26 L86 59 C86 79 48 101 48 101 C48 101 10 79 10 59 L10 26 Q10 21 15 19 L48 5 Z"
            className={
              isPrevious
                ? "fill-white stroke-slate-300"
                : "fill-rose-50 stroke-rose-400"
            }
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>

        {/* Stack "Rank" / "#N" — single-line "Rank #12" overflows a narrow shield */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-2 text-center">
          <span className={`text-xs font-semibold leading-none ${textColor}`}>Rank</span>
          <span className={`text-base font-bold leading-none ${textColor}`}>#{rank}</span>
        </div>
      </div>

      {labelDotted ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <span className="cursor-default border-b border-dotted border-slate-300 text-xs text-slate-400">
                {label}
              </span>
            }
          />
          <TooltipContent side="bottom" className="max-w-64 leading-snug">
            This baseline rank is calculated based on the available data from the previous 7 days.
          </TooltipContent>
        </Tooltip>
      ) : (
        <span className="text-xs text-slate-400">{label}</span>
      )}
    </div>
  );
}

export function BestSellerRankIssue({
  previousRank,
  currentRank,
  category,
  previousLabel = "7d avg",
  currentLabel = "New",
}: BestSellerRankProps) {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white px-5 py-5">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h4 className="text-base font-semibold text-slate-800">
          Bestseller Rank Issue
        </h4>
        <p className="text-sm text-slate-500">
          Your product&apos;s rank has dropped in{" "}
          <span className="font-semibold text-slate-700">{category}</span>.
        </p>
      </div>

      {/* Previous → current rank comparison */}
      <div className="flex items-center justify-start gap-6">
        <RankShield
          rank={previousRank}
          label={previousLabel}
          variant="previous"
          labelDotted
        />

        <ArrowRight className="-translate-y-4 h-5 w-5 shrink-0 text-slate-400" strokeWidth={1.5} />

        <RankShield
          rank={currentRank}
          label={currentLabel}
          variant="current"
        />
      </div>
    </div>
  );
}
