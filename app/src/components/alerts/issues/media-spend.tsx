import { ChevronDown, ChevronUp, ChevronsUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Importance = "High" | "Medium" | "Low";

export type MediaSpendKeyword = {
  keyword: string;
  importance: Importance;
  spendLw: number; // spend last week
  spendPw: number; // spend previous week
  salesImpact: number;
};

export type MediaSpendIssueProps = {
  period: string;
  lastWeekRange: string;
  previousWeekRange: string;
  keywords: MediaSpendKeyword[];
};

// ─── Mock data — 10 keywords, sorted by largest spend cut first ───────────────

export const DEFAULT_MEDIA_SPEND_KEYWORDS: MediaSpendKeyword[] = [
  { keyword: "vacuum cleaners for home",  importance: "High",   spendLw: 3_105, spendPw: 4_820, salesImpact: -37_300 },
  { keyword: "robot vacuum cleaner",      importance: "High",   spendLw:     0, spendPw: 12.40, salesImpact: -24_100 },
  { keyword: "shark cordless vacuum",     importance: "High",   spendLw: 2_480, spendPw: 3_640, salesImpact: -28_400 },
  { keyword: "cordless stick vacuum",     importance: "Medium", spendLw:  3.20, spendPw: 18.90, salesImpact: -16_200 },
  { keyword: "stick vacuum cleaner",      importance: "Medium", spendLw: 2_020, spendPw: 2_910, salesImpact: -19_800 },
  { keyword: "upright vacuum",            importance: "Medium", spendLw: 1_780, spendPw: 2_450, salesImpact: -14_200 },
  { keyword: "pet hair vacuum",           importance: "Medium", spendLw: 1_420, spendPw: 1_980, salesImpact: -11_600 },
  { keyword: "shark vacuum deals",        importance: "Medium", spendLw:     0, spendPw:     0, salesImpact:      0 },
  { keyword: "lightweight vacuum",        importance: "Low",    spendLw: 1_290, spendPw: 1_720, salesImpact:  -9_400 },
  { keyword: "hardwood floor vacuum",     importance: "Low",    spendLw: 1_180, spendPw: 1_540, salesImpact:  -8_100 },
];

export function getMediaSpendIssueProps(): MediaSpendIssueProps {
  return {
    period: "Last week (May 3–9)",
    lastWeekRange: "May 3–9",
    previousWeekRange: "Apr 26–May 2",
    keywords: DEFAULT_MEDIA_SPEND_KEYWORDS,
  };
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtSpend(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${(abs / 1_000).toFixed(2)}K`;
  return `$${abs.toFixed(2)}`;
}

function spendCut(pw: number, lw: number): number {
  return pw - lw;
}

// ─── Importance — icon + label, no pill container ─────────────────────────────

const IMPORTANCE_CONFIG: Record<
  Importance,
  { icon: typeof ChevronsUp; iconClassName: string }
> = {
  High:   { icon: ChevronsUp,  iconClassName: "text-rose-500" },
  Medium: { icon: ChevronUp,   iconClassName: "text-warning-600" },
  Low:    { icon: ChevronDown, iconClassName: "text-slate-400" },
};

function ImportanceIndicator({ level }: { level: Importance }) {
  const { icon: Icon, iconClassName } = IMPORTANCE_CONFIG[level];
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
      <Icon className={cn("h-3.5 w-3.5 shrink-0", iconClassName)} aria-hidden />
      {level}
    </span>
  );
}

// ─── Column headers ───────────────────────────────────────────────────────────

// 20px gap between columns via pl-5 on non-first cells
const CELL_FIRST = "py-2.5 pl-4 pr-0 text-left align-top";
const CELL_MID   = "py-2.5 pl-5 pr-0 text-left align-top";
const CELL_LAST  = "py-2.5 pl-5 pr-4 text-left align-top";

function ColHeader({
  children,
  cellClass = CELL_MID,
  tooltip,
}: {
  children: React.ReactNode;
  cellClass?: string;
  tooltip?: string;
}) {
  return (
    <th className={cn("whitespace-nowrap text-xs font-semibold text-slate-600", cellClass)}>
      <span className="inline-flex items-center gap-1">
        {children}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-help">
                <Info className="h-3 w-3 shrink-0 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-56 leading-snug">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </span>
    </th>
  );
}

function SpendColHeader({
  label,
  dateRange,
  cellClass = CELL_MID,
}: {
  label: string;
  dateRange: string;
  cellClass?: string;
}) {
  return (
    <th className={cn("whitespace-nowrap", cellClass)}>
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className="text-[10px] font-medium tabular-nums text-slate-400">
          {dateRange}
        </span>
      </div>
    </th>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MediaSpendIssue({
  period,
  lastWeekRange,
  previousWeekRange,
  keywords,
}: MediaSpendIssueProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700">
        Top Contributing Keywords
        <span className="ml-2 text-xs font-normal text-slate-400">{period}</span>
      </p>
      <div className="w-fit max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-fit table-auto border-collapse">
          <thead className="bg-slate-100">
            <tr className="border-b border-slate-200">
              <ColHeader cellClass={CELL_FIRST}>Keyword</ColHeader>
              <ColHeader
                cellClass={CELL_MID}
                tooltip="How much this keyword matters to your business — ranked using recent sales, spend trends, search visibility, and overall keyword priority."
              >
                Importance
              </ColHeader>
              <SpendColHeader
                label="Spend PW"
                dateRange={previousWeekRange}
                cellClass={CELL_MID}
              />
              <SpendColHeader
                label="Spend LW"
                dateRange={lastWeekRange}
                cellClass={CELL_LAST}
              />
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw) => {
              const hasCut = spendCut(kw.spendPw, kw.spendLw) > 0;

              return (
                <tr
                  key={kw.keyword}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className={cn(CELL_FIRST, "whitespace-nowrap text-sm font-medium text-slate-700")}>
                    {kw.keyword}
                  </td>
                  <td className={CELL_MID}>
                    <ImportanceIndicator level={kw.importance} />
                  </td>
                  <td className={cn(CELL_MID, "text-sm tabular-nums text-slate-500")}>
                    {fmtSpend(kw.spendPw)}
                  </td>
                  <td className={cn(CELL_LAST, "text-sm tabular-nums")}>
                    <span
                      className={cn(
                        hasCut ? "font-medium text-rose-500" : "text-slate-700",
                      )}
                    >
                      {fmtSpend(kw.spendLw)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
