// Summary card showing last-week promo visibility audit at a glance.
// Sits below the PromoBadgeIssue card in the Missing Promo Badge RCA row.

type StatCellProps = {
  label: string;
  value: string;
  valueClass?: string;
};

function StatCell({ label, value, valueClass = "text-slate-800" }: StatCellProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className={`text-sm font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

export type LastWeekPromoBadgeProps = {
  period: string;               // e.g. "May 10–16"
  badgeMissingDays: string;     // e.g. "7 / 7 days"
  expectedPromoPrice: string;   // e.g. "$299.99"
  avgDealPriceShown: string;    // e.g. "$283.64"
  listPriceShown: string;       // e.g. "$349.99"
  priceCheckStatus: string;     // e.g. "PRICE_MISMATCH"
  badgeShowing: boolean;        // false = BADGE NOT SHOWING (bad state)
};

export function LastWeekPerformancePromoBadge({
  period,
  badgeMissingDays,
  expectedPromoPrice,
  avgDealPriceShown,
  listPriceShown,
  priceCheckStatus,
  badgeShowing,
}: LastWeekPromoBadgeProps) {
  const isBad = !badgeShowing;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-500">
          Promo visibility audit · last week ({period})
        </span>
        {isBad ? (
          <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700">
            Badge Not Showing
          </span>
        ) : (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
            Badge Active
          </span>
        )}
      </div>

      {/* Stat grid — row 1 */}
      <div className="grid grid-cols-3 gap-0 border-b border-slate-100 px-4 py-3">
        <StatCell
          label="Badge Missing"
          value={badgeMissingDays}
          valueClass={isBad ? "text-rose-600" : "text-slate-800"}
        />
        <StatCell label="Expected Promo Price" value={expectedPromoPrice} />
        <StatCell label="Avg Deal Price Shown" value={avgDealPriceShown} />
      </div>

      {/* Stat grid — row 2: same 3-col layout as row 1 so columns align */}
      <div className="grid grid-cols-3 gap-0 px-4 py-3">
        <StatCell label="List Price Shown" value={listPriceShown} />
        <StatCell
          label="Price Check Status"
          value={priceCheckStatus}
          valueClass={priceCheckStatus === "PRICE_MISMATCH" ? "text-rose-600" : "text-emerald-700"}
        />
        <div />
      </div>
    </div>
  );
}
