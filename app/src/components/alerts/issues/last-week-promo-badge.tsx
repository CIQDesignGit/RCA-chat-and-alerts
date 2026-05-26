// Summary card showing last-week promo visibility audit at a glance.
// Sits below the PromoBadgeIssue card in the Missing Promo Badge RCA row.

type StatCellProps = {
  label: string;
  value: string;
  valueClass?: string;
};

function StatCell({ label, value, valueClass = "text-slate-700" }: StatCellProps) {
  // If value ends with " days", render the number and "days" with different styles
  const hasDaysSuffix = value.endsWith(" days");
  const numberPart = hasDaysSuffix ? value.slice(0, -5) : value; // strip " days"

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className={`text-base font-semibold ${valueClass}`}>
        {numberPart}
        {hasDaysSuffix && (
          <span className="text-sm font-normal text-slate-500"> days</span>
        )}
      </span>
    </div>
  );
}

export type LastWeekPromoBadgeProps = {
  period: string;                    // e.g. "May 10–16"
  badgeMissingDays: string;          // e.g. "7 / 7 days"
  estRevenueImpact: string;          // e.g. "$4,200"
  listPriceMismatch: string;         // e.g. "5 / 7 days" — days the list price didn't match MSRP
  sellingPriceMismatch: string;      // e.g. "7 / 7 days" — days selling price didn't match expected
  listPriceVisibility: string;       // e.g. "2 / 7 days" — days list price was actually visible
  noStrikethroughOnMsrp: string;     // e.g. "7 / 7 days" — days MSRP had no strikethrough
  badgeShowing: boolean;             // false = BADGE NOT SHOWING (problem state)
};

export function LastWeekPerformancePromoBadge({
  period,
  badgeMissingDays,
  estRevenueImpact,
  listPriceMismatch,
  sellingPriceMismatch,
  listPriceVisibility,
  noStrikethroughOnMsrp,
  badgeShowing,
}: LastWeekPromoBadgeProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-500">
          Last week snapshot ({period})
        </span>
      </div>

      {/* Row 1: Badge Missing · Est. Revenue Impact · List Price Mismatch */}
      <div className="grid grid-cols-3 gap-0 border-b border-slate-100 px-4 py-3">
        <StatCell label="Promo Badge Missing"        value={badgeMissingDays} />
        <StatCell
          label="Est. Revenue Impact"
          value={estRevenueImpact}
          valueClass={estRevenueImpact === "$0" ? "text-slate-700" : "text-rose-600"}
        />
        <StatCell label="List Price Mismatch"  value={listPriceMismatch} />
      </div>

      {/* Row 2: Selling Price Mismatch · List Price Visibility · No Strikethrough on MSRP */}
      <div className="grid grid-cols-3 gap-0 px-4 py-3">
        <StatCell label="Selling Price Mismatch"  value={sellingPriceMismatch} />
        <StatCell label="List Price Visibility"    value={listPriceVisibility} />
        <StatCell label="No Strikethrough on MSRP" value={noStrikethroughOnMsrp} />
      </div>
    </div>
  );
}
