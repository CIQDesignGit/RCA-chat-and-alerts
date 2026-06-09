import { Info, Package, ShoppingCart, Star, Tag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const LBB_TOTAL_CRAWLS = 6;

export type BuyBoxWinCheck = {
  crawledAt: string;
};

// Mock win timestamps — relative to now so "ago" labels stay fresh
export function crawlAtHoursAgo(hours: number, minutes = 0): string {
  return new Date(Date.now() - hours * 3_600_000 - minutes * 60_000).toISOString();
}

export const MOCK_YOUR_BUY_BOX_WINS: BuyBoxWinCheck[] = [
  { crawledAt: crawlAtHoursAgo(18, 12) },
];

export const MOCK_WINNER_BUY_BOX_WINS: BuyBoxWinCheck[] = [
  { crawledAt: crawlAtHoursAgo(16) },
  { crawledAt: crawlAtHoursAgo(16, 31) },
];

// Pink/rose stars matching the screenshot
function Stars({ rating, max = 5 }: { rating: number; max?: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = max - full - half;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className="h-4 w-4 fill-rose-500 text-rose-500" />
      ))}
      {half === 1 && <Star className="h-4 w-4 fill-rose-200 text-rose-500" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className="h-4 w-4 fill-slate-200 text-slate-200" />
      ))}
      <span className="ml-1 text-sm font-semibold text-slate-600">{rating.toFixed(1)}</span>
    </span>
  );
}

// Row icons matching the screenshot
const ROW_ICONS: Record<string, React.ReactNode> = {
  Price:        <Tag className="h-3.5 w-3.5 text-slate-400" />,
  Availability: <Package className="h-3.5 w-3.5 text-slate-400" />,
  Ratings:      <Star className="h-3.5 w-3.5 text-slate-400" />,
  "Buy Box Win Rate": <ShoppingCart className="h-3.5 w-3.5 text-slate-400" />,
};

function formatRelativeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  const minutes = Math.floor(diffMs / 60_000);
  if (hours < 1) return `(${minutes}m ago)`;
  return `(${hours}h ago)`;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTimeLabel(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function groupBuyBoxWinChecks(checks: BuyBoxWinCheck[]) {
  const groups = new Map<string, { time: string; ago: string; sortKey: number }[]>();

  for (const check of checks) {
    const date = new Date(check.crawledAt);
    const dateLabel = formatDateLabel(date);
    const entry = {
      time: formatTimeLabel(date),
      ago: formatRelativeAgo(date),
      sortKey: date.getTime(),
    };

    const existing = groups.get(dateLabel) ?? [];
    existing.push(entry);
    groups.set(dateLabel, existing);
  }

  return Array.from(groups.entries())
    .map(([date, times]) => {
      const sorted = times.sort((a, b) => b.sortKey - a.sortKey);
      return {
        date,
        times: sorted,
        sortKey: sorted[0]?.sortKey ?? 0,
      };
    })
    .sort((a, b) => b.sortKey - a.sortKey);
}

function BuyBoxWinsTooltipContent({ checks }: { checks: BuyBoxWinCheck[] }) {
  const groups = groupBuyBoxWinChecks(checks);

  return (
    <div className="flex flex-col gap-2 py-0.5">
      <p className="text-xs font-medium leading-snug text-background">
        This seller owned the Buy Box during these checks
      </p>
      {groups.map((group) => (
        <div key={group.date} className="flex flex-col gap-1">
          <p className="text-[11px] font-medium text-background/80">{group.date}</p>
          <ul className="flex flex-col gap-0.5">
            {group.times.map((entry) => (
              <li
                key={`${group.date}-${entry.time}`}
                className="flex items-center justify-between gap-4 text-[11px] text-background"
              >
                <span>• {entry.time}</span>
                <span className="text-background/60">{entry.ago}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function LbbRateCell({
  wins,
  totalCrawls,
}: {
  wins: BuyBoxWinCheck[];
  totalCrawls: number;
}) {
  const rateLabel = `${wins.length}/${totalCrawls}`;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="cursor-help border-b border-dotted border-slate-400 text-sm text-slate-600">
            {rateLabel}
          </span>
        }
      />
      <TooltipContent side="top" align="start" className="max-w-72 px-3 py-2.5">
        <BuyBoxWinsTooltipContent checks={wins} />
      </TooltipContent>
    </Tooltip>
  );
}

export type LostBuyBoxProps = {
  yourBrand: string;
  winnerBrand: string;
  yourPrice: string;
  winnerPrice: string;
  yourAvailability: string;
  winnerAvailability: string;
  yourRating: number;
  winnerRating: number;
  totalCrawls?: number;
  yourBuyBoxWins?: BuyBoxWinCheck[];
  winnerBuyBoxWins?: BuyBoxWinCheck[];
};

export function LostBuyBoxIssue({
  yourBrand,
  winnerBrand,
  yourPrice,
  winnerPrice,
  yourAvailability,
  winnerAvailability,
  yourRating,
  winnerRating,
  totalCrawls = LBB_TOTAL_CRAWLS,
  yourBuyBoxWins = MOCK_YOUR_BUY_BOX_WINS,
  winnerBuyBoxWins = MOCK_WINNER_BUY_BOX_WINS,
}: LostBuyBoxProps) {
  const rowLabelClass = "flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-slate-500";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Column headers */}
      <div className="grid grid-cols-3 border-b border-slate-200">
        <div className="px-4 py-3" />

        {/* Your brand */}
        <div className="border-l border-slate-200 px-4 py-3 text-center">
          <span className="text-sm font-bold italic text-slate-800">{yourBrand}.</span>
        </div>

        {/* Winner brand */}
        <div className="border-l border-slate-200 px-4 py-3 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold text-slate-700">{winnerBrand}</span>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              Latest Winner
            </span>
          </div>
        </div>
      </div>

      {/* Price row */}
      <div className="grid grid-cols-3 border-b border-slate-200">
        <div className={rowLabelClass}>
          {ROW_ICONS["Price"]} Price
        </div>
        <div className="border-l border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">{yourPrice}</div>
        <div className="border-l border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">{winnerPrice}</div>
      </div>

      {/* Availability row */}
      <div className="grid grid-cols-3 border-b border-slate-200">
        <div className={rowLabelClass}>
          {ROW_ICONS["Availability"]} Availability
        </div>
        <div className="border-l border-slate-200 px-4 py-3 text-sm text-slate-600">{yourAvailability}</div>
        <div className="border-l border-slate-200 px-4 py-3 text-sm text-slate-600">{winnerAvailability}</div>
      </div>

      {/* Ratings row */}
      <div className="grid grid-cols-3 border-b border-slate-200">
        <div className={rowLabelClass}>
          {ROW_ICONS["Ratings"]} Ratings
        </div>
        <div className="border-l border-slate-200 px-4 py-3"><Stars rating={yourRating} /></div>
        <div className="border-l border-slate-200 px-4 py-3"><Stars rating={winnerRating} /></div>
      </div>

      {/* Buy Box Win Rate row */}
      <div className="grid grid-cols-3">
        <div className={rowLabelClass}>
          {ROW_ICONS["Buy Box Win Rate"]}
          <span className="flex items-center gap-1">
            Buy Box Win Rate
            <Info className="h-3.5 w-3.5 text-slate-400" />
          </span>
        </div>
        <div className="border-l border-slate-200 px-4 py-3">
          <LbbRateCell wins={yourBuyBoxWins} totalCrawls={totalCrawls} />
        </div>
        <div className="border-l border-slate-200 px-4 py-3">
          <LbbRateCell wins={winnerBuyBoxWins} totalCrawls={totalCrawls} />
        </div>
      </div>
    </div>
  );
}
