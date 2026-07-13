// 7-day Promo Badge visibility trend table.
// Rendered inside the expanded Promo Badge root cause row.

import { Check, X } from "lucide-react";

type PromoBadgeTrendRow = {
  date: string;
  badgeMissing: boolean;          // true = badge NOT showing (bad)
  estRevenueImpact: string;       // e.g. "-$710"
  listPriceShown: boolean;        // true = list price (MSRP) visible
  strikethroughOnMsrp: boolean;   // true = strikethrough shown on MSRP
  sellingPriceShown: string;      // actual price shoppers see
  expectedSellingPrice: string;   // intended promo price
};

// Mock: badge present on May 12 & May 15, missing the other 5 days
const ROWS: PromoBadgeTrendRow[] = [
  { date: "May 10", badgeMissing: true,  estRevenueImpact: "-$710", listPriceShown: false, strikethroughOnMsrp: true,  sellingPriceShown: "$349.99", expectedSellingPrice: "$299.99" },
  { date: "May 11", badgeMissing: true,  estRevenueImpact: "-$680", listPriceShown: false, strikethroughOnMsrp: true,  sellingPriceShown: "$349.99", expectedSellingPrice: "$299.99" },
  { date: "May 12", badgeMissing: false, estRevenueImpact: "$0",    listPriceShown: true,  strikethroughOnMsrp: true,  sellingPriceShown: "$299.99", expectedSellingPrice: "$299.99" },
  { date: "May 13", badgeMissing: true,  estRevenueImpact: "-$620", listPriceShown: false, strikethroughOnMsrp: false, sellingPriceShown: "$349.99", expectedSellingPrice: "$299.99" },
  { date: "May 14", badgeMissing: true,  estRevenueImpact: "-$710", listPriceShown: true,  strikethroughOnMsrp: true,  sellingPriceShown: "$349.99", expectedSellingPrice: "$299.99" },
  { date: "May 15", badgeMissing: false, estRevenueImpact: "$0",    listPriceShown: true,  strikethroughOnMsrp: true,  sellingPriceShown: "$299.99", expectedSellingPrice: "$299.99" },
  { date: "May 16", badgeMissing: true,  estRevenueImpact: "-$605", listPriceShown: false, strikethroughOnMsrp: false, sellingPriceShown: "$349.99", expectedSellingPrice: "$299.99" },
];

const TH = ({ children, center, right }: { children: React.ReactNode; center?: boolean; right?: boolean }) => (
  <th
    scope="col"
    className={`px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 ${center ? "text-center" : right ? "text-right" : "text-left"}`}
  >
    {children}
  </th>
);

const TD = ({ children, center, right, className = "" }: { children: React.ReactNode; center?: boolean; right?: boolean; className?: string }) => (
  <td className={`whitespace-nowrap px-5 py-2.5 text-xs ${center ? "text-center" : right ? "text-right" : ""} ${className}`}>
    {children}
  </td>
);

// Renders a green check or red X icon for boolean columns
function BoolCell({ value, trueIsGood = true }: { value: boolean; trueIsGood?: boolean }) {
  const isGood = trueIsGood ? value : !value;
  return (
    <span className={`inline-flex items-center justify-center ${isGood ? "text-emerald-500" : "text-rose-500"}`}>
      {isGood ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
    </span>
  );
}

export function PromoBadgeTrendTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-500">Last week promo badge trend (May 10–16)</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-auto border-collapse">
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
          <tbody className="divide-y divide-slate-50">
            {ROWS.map((row) => (
              <tr key={row.date}>
                {/* Date */}
                <TD className="w-[64px] font-medium text-slate-600">{row.date}</TD>

                {/* Badge Missing — bad when true */}
                <TD>
                  <BoolCell value={row.badgeMissing} trueIsGood={false} />
                </TD>

                {/* Est. Revenue Impact */}
                <TD right className="font-medium text-rose-600">{row.estRevenueImpact}</TD>

                {/* List Price Shown */}
                <TD>
                  <BoolCell value={row.listPriceShown} trueIsGood={true} />
                </TD>

                {/* Strikethrough on MSRP */}
                <TD>
                  <BoolCell value={row.strikethroughOnMsrp} trueIsGood={true} />
                </TD>

                {/* Selling Price Shown */}
                <TD right className={row.sellingPriceShown !== row.expectedSellingPrice ? "font-medium text-rose-600" : "text-slate-700"}>
                  {row.sellingPriceShown}
                </TD>

                {/* Expected Selling Price */}
                <TD right className="text-slate-500">{row.expectedSellingPrice}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
