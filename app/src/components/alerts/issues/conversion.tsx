import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

// Healthy → OK | Risky → Dropping Fast | Broken → Dropped
export type ConversionState = "ok" | "dropping-fast" | "dropped";

export type ConversionIssueProps = {
  state: ConversionState;
  baselineRate: number;
  baselinePeriod: string;
  currentRate: number;
  currentPeriod: string;
  changePp: number;
  iqrMagnitude: number;
  iqrValue: number;
  iqrRange: string;
  dropMagnitudeLabel: string;
  comparison: string;
  comparisonSub: string;
};

// Diagnosis copy — shown in RootCauseRow description, not inside the issue card
export const CONVERSION_DIAGNOSIS: Record<ConversionState, string> = {
  ok:
    "Conversion rate is stable and within the normal 7-day range. Traffic and PDP performance are healthy.",
  "dropping-fast":
    "Conversion rate is declining faster than the 7-day baseline. Monitor PDP and pricing — may worsen if unchecked.",
  dropped:
    "Conversion rate dropped abnormally while traffic remained stable. Likely PDP or pricing issue.",
};

export function getConversionDiagnosis(state: ConversionState): string {
  return CONVERSION_DIAGNOSIS[state];
}

// Mock props per state — used in RCA panel and issue threads
export function getConversionIssueProps(state: ConversionState): ConversionIssueProps {
  switch (state) {
    case "ok":
      return {
        state: "ok",
        baselineRate: 5.1,
        baselinePeriod: "D-2 through D-8",
        currentRate: 5.0,
        currentPeriod: "Yesterday (D-1)",
        changePp: -0.1,
        iqrMagnitude: 0.2,
        iqrValue: 0.52,
        iqrRange: "Q25: 4.8% - Q75: 5.3%",
        dropMagnitudeLabel: "Within range",
        comparison: "D-1 vs D-2→D-8",
        comparisonSub: "7-day baseline",
      };
    case "dropping-fast":
      return {
        state: "dropping-fast",
        baselineRate: 5.1,
        baselinePeriod: "D-2 through D-8",
        currentRate: 4.5,
        currentPeriod: "Yesterday (D-1)",
        changePp: -0.6,
        iqrMagnitude: 1.2,
        iqrValue: 0.52,
        iqrRange: "Q25: 4.8% - Q75: 5.3%",
        dropMagnitudeLabel: "Approaching threshold",
        comparison: "D-1 vs D-2→D-8",
        comparisonSub: "7-day baseline",
      };
    case "dropped":
      return {
        state: "dropped",
        baselineRate: 5.1,
        baselinePeriod: "D-2 through D-8",
        currentRate: 3.8,
        currentPeriod: "Yesterday (D-1)",
        changePp: -1.3,
        iqrMagnitude: 2.5,
        iqrValue: 0.52,
        iqrRange: "Q25: 4.8% - Q75: 5.3%",
        dropMagnitudeLabel: "Well outside range",
        comparison: "D-1 vs D-2→D-8",
        comparisonSub: "7-day baseline",
      };
  }
}

const STATE_STYLES: Record<
  ConversionState,
  {
    currentBorder: string;
    currentValue: string;
  }
> = {
  ok: {
    currentBorder: "border-slate-200",
    currentValue: "text-slate-400",
  },
  "dropping-fast": {
    currentBorder: "border-amber-100",
    currentValue: "text-amber-600",
  },
  dropped: {
    currentBorder: "border-rose-100",
    currentValue: "text-rose-500",
  },
};

function formatPp(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}pp`;
}

export function ConversionIssue(props: ConversionIssueProps) {
  const styles = STATE_STYLES[props.state];

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Col 1/4 — Conversion Drop card */}
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
        {/* Title + info icon with date-range tooltip */}
        <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
          Conversion Drop
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-help">
                <Info className="h-3.5 w-3.5 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-56 leading-snug">
                Yesterday (D-1) vs. 7-day baseline ({props.baselinePeriod})
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Values: prev → current */}
        <div className="flex items-center gap-2">
          <span className="text-base font-medium text-slate-500">{props.baselineRate.toFixed(1)}%</span>
          <span className="text-slate-400">→</span>
          <span className={cn("text-base font-semibold", styles.currentValue)}>
            {props.currentRate.toFixed(1)}%
          </span>
        </div>

        {/* Subline: drop magnitude */}
        <p className="text-xs text-slate-400">
          Drop magnitude: <span className="font-medium text-slate-600">{formatPp(props.changePp)}</span>
        </p>
      </div>

      {/* Cols 2–4 — Glance Views (3/4 width) */}
      <div className="col-span-3 grid grid-cols-3 gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
        {/* Section label spans all 3 inner columns */}
        <div className="col-span-3 -mb-1">
          <span className="text-sm font-semibold text-slate-700">Glance Views</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-slate-700">Yesterday</span>
          <span className="text-sm font-semibold text-slate-800">12,340</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1">
            <span className="text-sm text-slate-700">7-Day Avg</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="cursor-help">
                  <Info className="h-3 w-3 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent side="top" className="leading-snug">
                  Average of D-2 through D-8
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-sm font-semibold text-slate-800">12,480</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-slate-700">Deviation</span>
          <span className="text-sm font-semibold text-rose-500">−140 (−1.1%)</span>
        </div>
      </div>

      {/* Detail metrics — hidden, preserved for future use */}
      <div className="hidden col-span-4 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-700">IQR (7-day)</span>
          <span className="text-sm font-semibold text-slate-800">
            {props.iqrValue.toFixed(2)}pp
          </span>
          <span className="text-xs text-slate-500">{props.iqrRange}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-700">Comparison</span>
          <span className="text-sm font-semibold text-slate-800">{props.comparison}</span>
          <span className="text-xs text-slate-500">{props.comparisonSub}</span>
        </div>
      </div>
    </div>
  );
}
