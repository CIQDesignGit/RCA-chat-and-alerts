// 7-day Buy Box ownership trend table.
// Rendered inside the expanded Lost Buy Box root cause row.

type LbbTrendRow = {
  date: string;
  buyBoxWinner: string;          // "You" | competitor name
  isYou: boolean;                // true = your brand won
  revenueImpact: string | null;  // "-$18.4K" when lost, null when you hold it
  yourPrice: string;
  competitorPrice: string;
  priceDiff: string;             // e.g. "-$168.50" (negative = you're more expensive)
};

// Mock: Shark held the Buy Box on May 3 & May 7, lost the rest to Dyson (3P)
const ROWS: LbbTrendRow[] = [
  { date: "May 3",  buyBoxWinner: "Shark",      isYou: true,  revenueImpact: null,      yourPrice: "$379.99", competitorPrice: "$389.00", priceDiff: "+$9.01"   },
  { date: "May 4",  buyBoxWinner: "Dyson (3P)", isYou: false, revenueImpact: "-$17.2K", yourPrice: "$529.99", competitorPrice: "$364.99", priceDiff: "-$165.00" },
  { date: "May 5",  buyBoxWinner: "Dyson (3P)", isYou: false, revenueImpact: "-$16.8K", yourPrice: "$529.99", competitorPrice: "$359.49", priceDiff: "-$170.50" },
  { date: "May 6",  buyBoxWinner: "Dyson (3P)", isYou: false, revenueImpact: "-$17.9K", yourPrice: "$529.99", competitorPrice: "$361.50", priceDiff: "-$168.49" },
  { date: "May 7",  buyBoxWinner: "Shark",      isYou: true,  revenueImpact: null,      yourPrice: "$369.99", competitorPrice: "$371.00", priceDiff: "+$1.01"   },
  { date: "May 8",  buyBoxWinner: "Dyson (3P)", isYou: false, revenueImpact: "-$19.1K", yourPrice: "$529.99", competitorPrice: "$357.99", priceDiff: "-$172.00" },
  { date: "May 9",  buyBoxWinner: "Dyson (3P)", isYou: false, revenueImpact: "-$15.0K", yourPrice: "$529.99", competitorPrice: "$366.49", priceDiff: "-$163.50" },
];

const TH = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
  <th
    scope="col"
    className={`px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 ${right ? "text-right" : "text-left"}`}
  >
    {children}
  </th>
);

const TD = ({ children, right, className = "" }: { children: React.ReactNode; right?: boolean; className?: string }) => (
  <td className={`whitespace-nowrap px-5 py-2.5 text-xs ${right ? "text-right" : ""} ${className}`}>
    {children}
  </td>
);

export function LbbTrendTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-500">Last week Buy Box trend (May 3–9)</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-auto border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <TH>Date</TH>
              <TH>Buy Box Winner</TH>
              <TH right>Revenue Impact</TH>
              <TH right>Your Price</TH>
              <TH right>Competitor Price</TH>
              <TH right>Price Gap</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ROWS.map((row) => (
              <tr key={row.date}>
                {/* Date */}
                <TD className="font-medium text-slate-600 w-[64px]">{row.date}</TD>

                {/* Buy Box Winner — you in violet, competitor in rose */}
                <TD className={row.isYou ? "font-medium text-violet-600" : "font-medium text-rose-600"}>
                  {row.buyBoxWinner}
                </TD>

                {/* Revenue Impact */}
                <TD right className={row.revenueImpact ? "font-medium text-rose-600" : "text-slate-400"}>
                  {row.revenueImpact ?? "—"}
                </TD>

                {/* Your Price */}
                <TD right className="text-slate-700">{row.yourPrice}</TD>

                {/* Competitor Price */}
                <TD right className="text-slate-700">{row.competitorPrice}</TD>

                {/* Price Gap */}
                <TD right className={row.priceDiff.startsWith("-") ? "font-medium text-rose-600" : "text-emerald-600"}>
                  {row.priceDiff}
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
