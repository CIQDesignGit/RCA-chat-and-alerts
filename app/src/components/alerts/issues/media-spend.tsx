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
  sfr: number; // search frequency rank — lower = higher search volume
  spendLw: number;
  spendPw: number;
  rankPw: number; // organic rank previous week
  rankLw: number; // organic rank last week
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
  { keyword: "vacuum cleaners for home",  importance: "High",   sfr: 842,  spendLw: 3_105, spendPw: 4_820, rankPw: 8,  rankLw: 14, salesImpact: -37_300 },
  { keyword: "robot vacuum cleaner",      importance: "High",   sfr: 1_240, spendLw:     0, spendPw: 12.40, rankPw: 5,  rankLw: 11, salesImpact: -24_100 },
  { keyword: "shark cordless vacuum",     importance: "High",   sfr: 2_180, spendLw: 2_480, spendPw: 3_640, rankPw: 6,  rankLw: 9,  salesImpact: -28_400 },
  { keyword: "cordless stick vacuum",     importance: "Medium", sfr: 3_450, spendLw:  3.20, spendPw: 18.90, rankPw: 12, rankLw: 10, salesImpact: -16_200 },
  { keyword: "stick vacuum cleaner",      importance: "Medium", sfr: 4_120, spendLw: 2_020, spendPw: 2_910, rankPw: 11, rankLw: 15, salesImpact: -19_800 },
  { keyword: "upright vacuum",            importance: "Medium", sfr: 5_890, spendLw: 1_780, spendPw: 2_450, rankPw: 18, rankLw: 16, salesImpact: -14_200 },
  { keyword: "pet hair vacuum",           importance: "Medium", sfr: 6_240, spendLw: 1_420, spendPw: 1_980, rankPw: 22, rankLw: 24, salesImpact: -11_600 },
  { keyword: "shark vacuum deals",        importance: "Medium", sfr: 8_100, spendLw:     0, spendPw:     0, rankPw: 31, rankLw: 31, salesImpact:      0 },
  { keyword: "lightweight vacuum",        importance: "Low",    sfr: 12_400, spendLw: 1_290, spendPw: 1_720, rankPw: 28, rankLw: 26, salesImpact:  -9_400 },
  { keyword: "hardwood floor vacuum",     importance: "Low",    sfr: 15_800, spendLw: 1_180, spendPw: 1_540, rankPw: 35, rankLw: 38, salesImpact:  -8_100 },
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

// Signed spend delta — LW minus PW
function fmtSpendChange(delta: number): string {
  if (delta === 0) return fmtSpend(0);
  const sign = delta > 0 ? "+" : "−";
  return `${sign}${fmtSpend(Math.abs(delta))}`;
}

function spendChange(pw: number, lw: number): number {
  return lw - pw;
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
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
      <Icon className={cn("h-3.5 w-3.5 shrink-0", iconClassName)} aria-hidden />
      {level}
    </span>
  );
}

// Organic rank change — lower rank number = better position
function RankChangeCell({ rankPw, rankLw }: { rankPw: number; rankLw: number }) {
  const delta = rankLw - rankPw; // positive = dropped, negative = improved

  return (
    <span className="inline-flex items-center text-sm tabular-nums whitespace-nowrap">
      <span className="w-10 text-right text-slate-400">#{rankPw}</span>
      <span className="w-4 shrink-0 pl-2 text-center text-slate-300">→</span>
      <span className="w-10 text-right font-medium text-slate-700">#{rankLw}</span>
      <span
        className={cn(
          "w-11 text-right text-xs font-medium",
          delta > 0 ? "text-rose-500" : delta < 0 ? "text-emerald-600" : "text-slate-400",
        )}
      >
        {delta !== 0 ? `(${delta > 0 ? "+" : ""}${delta})` : ""}
      </span>
    </span>
  );
}

// ─── Column headers ───────────────────────────────────────────────────────────

// 32px gap between columns via pl-8 on non-first cells
const CELL_FIRST = "py-2.5 pl-4 pr-0 text-left align-top";
const CELL_MID   = "py-2.5 pl-8 pr-0 text-left align-top";
const CELL_NUM   = "py-2.5 pl-8 pr-0 text-right align-top";
const CELL_RANK  = "py-2.5 pl-8 pr-4 text-right align-top";
// Absorbs extra width so header bg + row borders reach the container edge
const CELL_FILLER = "w-full p-0";

function ColHeader({
  children,
  cellClass = CELL_MID,
  align = "left",
  tooltip,
}: {
  children: React.ReactNode;
  cellClass?: string;
  align?: "left" | "right";
  tooltip?: string;
}) {
  return (
    <th className={cn("whitespace-nowrap text-xs font-semibold text-slate-600", cellClass)}>
      <span
        className={cn(
          "inline-flex items-center gap-1",
          align === "right" && "w-full justify-end",
        )}
      >
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
  cellClass = CELL_NUM,
  align = "right",
}: {
  label: string;
  dateRange: string;
  cellClass?: string;
  align?: "left" | "right";
}) {
  return (
    <th className={cn("whitespace-nowrap", cellClass)}>
      <div
        className={cn(
          "flex flex-col gap-0.5",
          align === "right" ? "items-end" : "items-start",
        )}
      >
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
      <div className="min-w-0 w-full max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-max table-auto border-collapse">
          <thead className="bg-slate-100">
            <tr className="border-b border-slate-200">
              <ColHeader cellClass={CELL_FIRST}>Keyword</ColHeader>
              <ColHeader
                cellClass={CELL_MID}
                tooltip="How much this keyword matters to your business — ranked using recent sales, spend trends, search visibility, and overall keyword priority."
              >
                Importance
              </ColHeader>
              <ColHeader
                cellClass={CELL_NUM}
                align="right"
                tooltip="Search Frequency Rank — how often shoppers search this term. Lower numbers mean higher search volume."
              >
                SFR
              </ColHeader>
              <SpendColHeader
                label="Spend LW"
                dateRange={lastWeekRange}
              />
              <SpendColHeader
                label="Spend Change"
                dateRange={`vs. ${previousWeekRange}`}
              />
              <ColHeader cellClass={CELL_RANK} align="right">
                Rank (PW → LW)
              </ColHeader>
              <th className={CELL_FILLER} aria-hidden />
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw) => {
              const delta = spendChange(kw.spendPw, kw.spendLw);

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
                  <td className={cn(CELL_NUM, "text-sm tabular-nums text-slate-700")}>
                    {kw.sfr.toLocaleString()}
                  </td>
                  <td className={cn(CELL_NUM, "text-sm tabular-nums text-slate-700")}>
                    {fmtSpend(kw.spendLw)}
                  </td>
                  <td className={cn(CELL_NUM, "text-sm font-semibold tabular-nums text-slate-700")}>
                    {fmtSpendChange(delta)}
                  </td>
                  <td className={CELL_RANK}>
                    <div className="flex justify-end">
                      <RankChangeCell rankPw={kw.rankPw} rankLw={kw.rankLw} />
                    </div>
                  </td>
                  <td className={CELL_FILLER} aria-hidden />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
