import { Info, Tag, Package, Star } from "lucide-react";

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
        <Star key={`e${i}`} className="h-4 w-4 fill-zinc-200 text-zinc-300" />
      ))}
      <span className="ml-1 text-sm font-semibold text-zinc-600">{rating.toFixed(1)}</span>
    </span>
  );
}

// Row icons matching the screenshot
const ROW_ICONS: Record<string, React.ReactNode> = {
  Price:        <Tag className="h-3.5 w-3.5 text-zinc-400" />,
  Availability: <Package className="h-3.5 w-3.5 text-zinc-400" />,
  Ratings:      <Star className="h-3.5 w-3.5 text-zinc-400" />,
};

export type LostBuyBoxProps = {
  yourBrand: string;
  winnerBrand: string;
  yourPrice: string;
  winnerPrice: string;
  yourAvailability: string;
  winnerAvailability: string;
  yourRating: number;
  winnerRating: number;
  yourLbbRate: string;
  winnerLbbRate: string;
};

export function LostBuyBoxIssue(p: LostBuyBoxProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-slate-50">
      {/* Column headers */}
      <div className="grid grid-cols-3 border-b border-zinc-200">
        <div className="px-4 py-3" />

        {/* Your brand */}
        <div className="border-l border-zinc-200 px-4 py-3 text-center">
          <span className="text-sm font-bold italic text-zinc-800">{p.yourBrand}.</span>
        </div>

        {/* Winner brand */}
        <div className="border-l border-zinc-200 px-4 py-3 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold text-zinc-700">{p.winnerBrand}</span>
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
              Latest Winner
            </span>
          </div>
        </div>
      </div>

      {/* Price row */}
      <div className="grid grid-cols-3 border-b border-zinc-200">
        <div className="flex items-center gap-1.5 px-4 py-3 text-sm text-zinc-500">
          {ROW_ICONS["Price"]} Price
        </div>
        <div className="border-l border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700">{p.yourPrice}</div>
        <div className="border-l border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700">{p.winnerPrice}</div>
      </div>

      {/* Availability row */}
      <div className="grid grid-cols-3 border-b border-zinc-200">
        <div className="flex items-center gap-1.5 px-4 py-3 text-sm text-zinc-500">
          {ROW_ICONS["Availability"]} Availability
        </div>
        <div className="border-l border-zinc-200 px-4 py-3 text-sm text-zinc-600">{p.yourAvailability}</div>
        <div className="border-l border-zinc-200 px-4 py-3 text-sm text-zinc-600">{p.winnerAvailability}</div>
      </div>

      {/* Ratings row */}
      <div className="grid grid-cols-3 border-b border-zinc-200">
        <div className="flex items-center gap-1.5 px-4 py-3 text-sm text-zinc-500">
          {ROW_ICONS["Ratings"]} Ratings
        </div>
        <div className="border-l border-zinc-200 px-4 py-3"><Stars rating={p.yourRating} /></div>
        <div className="border-l border-zinc-200 px-4 py-3"><Stars rating={p.winnerRating} /></div>
      </div>

      {/* LBB Rate row */}
      <div className="grid grid-cols-3">
        <div className="flex items-center gap-1.5 px-4 py-3 text-sm text-zinc-500">
          <span className="flex items-center gap-1">LBB Rate <Info className="h-3.5 w-3.5" /></span>
        </div>
        <div className="border-l border-zinc-200 px-4 py-3 text-sm text-zinc-600">{p.yourLbbRate}</div>
        <div className="border-l border-zinc-200 px-4 py-3 text-sm text-zinc-600">{p.winnerLbbRate}</div>
      </div>
    </div>
  );
}
