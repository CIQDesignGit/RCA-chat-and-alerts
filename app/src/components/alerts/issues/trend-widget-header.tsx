import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TrendWidgetHeaderProps = {
  period: string;
  /** When true, shows "vs prev week" on the right (snapshot widgets with deltas). */
  showPrevWeekLegend?: boolean;
};

export function TrendWidgetHeader({
  period,
  showPrevWeekLegend = false,
}: TrendWidgetHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-600">Last Week Trend</span>
        <span className="text-xs text-slate-400">({period})</span>
      </div>
      {showPrevWeekLegend && (
        <Tooltip>
          <TooltipTrigger
            render={
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <span>vs prev week</span>
                <Info className="h-3 w-3 shrink-0 text-slate-300" />
              </span>
            }
          />
          <TooltipContent side="top">
            Delta values compared to the previous week
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
