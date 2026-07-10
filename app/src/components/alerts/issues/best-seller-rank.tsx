import { useId } from "react";
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
  /** Label under the previous rank shield — defaults to "3D avg" */
  previousLabel?: string;
  /** Label under the current rank shield — defaults to "Last 24 hr avg" */
  currentLabel?: string;
};

const SHIELD_PATH =
  "M48 5 L81 19 Q86 21 86 26 L86 59 C86 79 48 101 48 101 C48 101 10 79 10 59 L10 26 Q10 21 15 19 L48 5 Z";
// Scales the path inward from the shield centroid for the inner highlight rim
const SHIELD_INSET_TRANSFORM = "translate(48 53) scale(0.86) translate(-48 -53)";

// Vertical shield outline used for both rank states
function RankShield({
  rank,
  label,
  variant,
  labelTooltip,
}: {
  rank: number;
  label: string;
  variant: "previous" | "current";
  /** When set, label is dotted and shows this tooltip on hover. */
  labelTooltip?: string;
}) {
  const isPrevious = variant === "previous";
  const textColor = isPrevious ? "text-slate-800" : "text-rose-500";
  const shadowId = useId();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[112px] w-[96px]">
        <svg
          viewBox="0 0 96 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full drop-shadow-sm"
          aria-hidden
        >
          <defs>
            <filter id={shadowId} x="-15%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#64748b" floodOpacity="0.14" />
            </filter>
          </defs>

          {/* Base fill + outer stroke */}
          <path
            d={SHIELD_PATH}
            filter={`url(#${shadowId})`}
            className={
              isPrevious
                ? "fill-white stroke-slate-300"
                : "fill-rose-50 stroke-rose-400"
            }
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Inset rim — grey on previous shield, white on current */}
          <path
            d={SHIELD_PATH}
            transform={SHIELD_INSET_TRANSFORM}
            fill="none"
            className={isPrevious ? "stroke-slate-200" : "stroke-rose-300"}
            strokeWidth="1"
            strokeLinejoin="round"
            opacity={isPrevious ? 1 : 0.75}
          />
        </svg>

        {/* "Rank" sits near the top; "#N" is optically centered in the shield body */}
        <span
          className={`absolute left-1/2 top-[22%] -translate-x-1/2 text-xs font-semibold leading-none ${textColor}`}
        >
          Rank
        </span>
        <span
          className={`absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 text-xl font-bold leading-none ${textColor}`}
        >
          #{rank}
        </span>
      </div>

      {labelTooltip ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <span className="cursor-default border-b border-dotted border-slate-300 text-xs text-slate-400">
                {label}
              </span>
            }
          />
          <TooltipContent side="bottom" className="max-w-64 leading-snug">
            {labelTooltip}
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
  previousLabel = "3D avg",
  currentLabel = "Last 24 hr avg",
}: BestSellerRankProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1">
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
          labelTooltip="This baseline rank is calculated based on the available data from the previous 3 days."
        />

        <ArrowRight className="-translate-y-4 h-5 w-5 shrink-0 text-slate-400" strokeWidth={1.5} />

        <RankShield
          rank={currentRank}
          label={currentLabel}
          variant="current"
          labelTooltip="This rank is calculated based on the available data from the last 24 hours."
        />
      </div>
    </div>
  );
}
