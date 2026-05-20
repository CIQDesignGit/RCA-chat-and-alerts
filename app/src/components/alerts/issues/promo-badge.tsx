import { X, Check } from "lucide-react";

type CheckItem = {
  label: string;
  passed: boolean;
};

export type PromoBadgeProps = {
  promoDateRange: string;          // e.g. "28 Apr to 10 May"
  checks: CheckItem[];
  currentOriginalPrice: string;    // e.g. "$25.99"
  currentSellingPrice: string;     // e.g. "$25.99"
  expectedOriginalPrice: string;   // e.g. "$18.99"
  expectedSellingPrice: string;    // e.g. "$19.99" (shown struck through)
};

export function PromoBadgeIssue({
  checks,
  currentOriginalPrice,
  currentSellingPrice,
  expectedOriginalPrice,
  expectedSellingPrice,
}: PromoBadgeProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Checklist card */}
      <div className="w-[370px] overflow-hidden rounded-xl border border-slate-200 bg-white">
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
        {/* Current Price — light rose bg to signal something is wrong */}
        <div className="flex flex-col gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
          <p className="text-xs font-semibold text-slate-600">Current Price</p>
          <div className="flex gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400">Original</span>
              <span className="text-lg font-bold text-slate-800">{currentOriginalPrice}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400">Selling</span>
              <span className="text-lg font-bold text-slate-800">{currentSellingPrice}</span>
            </div>
          </div>
        </div>

        {/* Expected Price — neutral white */}
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold text-slate-600">Expected Price</p>
          <div className="flex gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400">Original</span>
              <span className="text-lg font-bold text-slate-800">{expectedOriginalPrice}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400">Selling</span>
              {/* Struck through to show price mismatch */}
              <span className="text-lg font-bold text-slate-400 line-through">
                {expectedSellingPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
