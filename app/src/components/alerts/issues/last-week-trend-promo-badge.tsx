// Merged "Last week trend — Promo Badge" widget.
// Combines the snapshot metric tiles and the 7-day visibility trend table
// into one card, rendered inside the expanded Promo Badge root cause row.

import { Check, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatCellProps = {
  label: string;
  value: string;
  valueClass?: string;
};

// Renders a metric tile. Values ending in " days" get the suffix styled lighter.
function StatCell({ label, value, valueClass = "text-slate-700" }: StatCellProps) {
  const hasDaysSuffix = value.endsWith(" days");
  const numberPart = hasDaysSuffix ? value.slice(0, -5) : value;

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

export type PromoBadgeTrendRow = {
  date: string;
  badgeMissing: boolean;         // true = badge NOT showing (bad)
  estRevenueImpact: string;      // e.g. "-$710"
  listPriceShown: boolean;       // true = list price (MSRP) visible
  strikethroughOnMsrp: boolean;  // true = strikethrough shown on MSRP
  sellingPriceShown: string;     // actual price shoppers see
  expectedSellingPrice: string;  // intended promo price
};

const TH = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
  <th
    scope="col"
    className={`whitespace-nowrap px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 ${right ? "text-right" : "text-left"}`}
  >
    {children}
  </th>
);

const TD = ({ children, right, className = "" }: { children: React.ReactNode; right?: boolean; className?: string }) => (
  <td className={`whitespace-nowrap px-5 py-2.5 text-xs ${right ? "text-right" : ""} ${className}`}>
    {children}
  </td>
);

// Green check or red X for boolean columns
function BoolCell({ value, trueIsGood = true }: { value: boolean; trueIsGood?: boolean }) {
  const isGood = trueIsGood ? value : !value;
  return (
    <span className={`inline-flex items-center ${isGood ? "text-emerald-500" : "text-rose-500"}`}>
      {isGood ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
    </span>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type LastWeekTrendPromoBadgeProps = {
  period: string;               // e.g. "May 10–16"
  badgeMissingDays: string;     // e.g. "7 / 7 days"
  estRevenueImpact: string;     // e.g. "-$4,200"
  listPriceMismatch: string;    // e.g. "7 / 7 days"
  sellingPriceMismatch: string; // e.g. "7 / 7 days"
  listPriceVisibility: string;  // e.g. "2 / 7 days"
  noStrikethroughOnMsrp: string; // e.g. "7 / 7 days"
  badgeShowing: boolean;        // false = badge not showing (problem state)
  rows: PromoBadgeTrendRow[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendPromoBadge({
  period,
  badgeMissingDays,
  estRevenueImpact,
  listPriceMismatch,
  sellingPriceMismatch,
  listPriceVisibility,
  noStrikethroughOnMsrp,
  rows,
}: LastWeekTrendPromoBadgeProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        {/* Status dot: rose when badge is missing */}
        <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />
        <span className="text-xs font-medium text-slate-600">Last week trend · Promo Badge</span>
        <span className="text-xs text-slate-400">({period})</span>
      </div>

      {/* ── Snapshot metrics row 1 ── */}
      <div className="grid grid-cols-3 gap-0 px-4 py-3">
        <StatCell label="Promo Badge Missing" value={badgeMissingDays} />
        <StatCell
          label="Est. Revenue Impact"
          value={estRevenueImpact}
          valueClass={estRevenueImpact === "$0" ? "text-slate-700" : "text-rose-600"}
        />
        <StatCell label="List Price Mismatch" value={listPriceMismatch} />
      </div>

      {/* ── Snapshot metrics row 2 ── */}
      <div className="grid grid-cols-3 gap-0 px-4 pb-5 pt-0">
        <StatCell label="Selling Price Mismatch"  value={sellingPriceMismatch} />
        <StatCell label="List Price Visibility"    value={listPriceVisibility} />
        <StatCell label="No Strikethrough on MSRP" value={noStrikethroughOnMsrp} />
      </div>

      {/* ── 7-day trend table ── */}
      <div className="overflow-x-auto border-t border-slate-300">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <TH>Date</TH>
              <TH>Badge Missing</TH>
              <TH right>Est. Rev. Impact</TH>
              <TH>List Price Shown</TH>
              <TH>Strike-through</TH>
              <TH right>Selling Price</TH>
              <TH right>Expected Selling Price</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.date}>
                <TD className="font-medium text-slate-600">{row.date}</TD>
                <TD>
                  <BoolCell value={row.badgeMissing} trueIsGood={false} />
                </TD>
                <TD right className={row.estRevenueImpact !== "$0" ? "font-medium text-rose-600" : "text-slate-400"}>
                  {row.estRevenueImpact}
                </TD>
                <TD>
                  <BoolCell value={row.listPriceShown} trueIsGood={true} />
                </TD>
                <TD>
                  <BoolCell value={row.strikethroughOnMsrp} trueIsGood={true} />
                </TD>
                <TD right className={row.sellingPriceShown !== row.expectedSellingPrice ? "font-medium text-rose-600" : "text-slate-700"}>
                  {row.sellingPriceShown}
                </TD>
                <TD right className="text-slate-500">{row.expectedSellingPrice}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
