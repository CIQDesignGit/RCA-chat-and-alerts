import { X, Check } from "lucide-react";

type CheckItem = {
  label: string;
  passed: boolean;
};

/** Total PDP crawls in the latest review window — shared with trend widgets. */
export const PROMO_BADGE_TOTAL_CRAWLS = 6;

export type PromoBadgeProps = {
  promoDateRange: string;          // e.g. "28 Apr to 10 May"
  checks: CheckItem[];
  badgeSeenCrawls: number;         // crawls where the promo badge was visible
  totalCrawls?: number;          // defaults to PROMO_BADGE_TOTAL_CRAWLS
  currentOriginalPrice: string;    // offer price on PDP today
  currentSellingPrice: string;     // list price (MSRP) — same on both cards, struck through
  expectedOriginalPrice: string;   // expected offer price
  expectedSellingPrice?: string;   // deprecated — list price uses currentSellingPrice
};

const LIST_PRICE_CLASS =
  "text-lg font-bold text-slate-400 line-through";

export function PromoBadgeIssue({
  checks,
  badgeSeenCrawls,
  totalCrawls = PROMO_BADGE_TOTAL_CRAWLS,
  currentOriginalPrice,
  currentSellingPrice,
  expectedOriginalPrice,
}: PromoBadgeProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Checklist card */}
      <div className="w-full max-w-[480px] overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5">
          <span className="text-sm font-medium text-slate-600">
            Latest status for Promo Badge
          </span>
          <span className="shrink-0 text-xs text-slate-500">
            Badge seen in{" "}
            <span className="font-semibold text-slate-700">
              {badgeSeenCrawls}/{totalCrawls}
            </span>{" "}
            crawls (24h)
          </span>
        </div>
        {checks.map((item, i) => (
          <div
            key={item.label}
            className={`flex items-center justify-between gap-6 px-4 py-2.5 ${
              i < checks.length - 1 ? "border-b border-slate-200" : ""
            }`}
          >
            <span className="text-sm text-slate-700">{item.label}</span>
            {item.passed ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-rose-500" />
            )}
          </div>
        ))}
      </div>

      {/* Price comparison cards */}
      <div className="flex gap-3">
        {/* Current selling price — light rose bg to signal something is wrong */}
        <div className="flex flex-col gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
          <p className="text-xs font-semibold text-slate-600">Current</p>
          <div className="flex gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400">Offer Price</span>
              <span className="text-lg font-bold text-slate-800">{currentOriginalPrice}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400">List Price</span>
              <span className={LIST_PRICE_CLASS}>{currentSellingPrice}</span>
            </div>
          </div>
        </div>

        {/* Expected selling price — neutral white */}
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold text-slate-600">Expected</p>
          <div className="flex gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400">Offer Price</span>
              <span className="text-lg font-bold text-slate-800">{expectedOriginalPrice}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400">List Price</span>
              <span className={LIST_PRICE_CLASS}>{currentSellingPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
