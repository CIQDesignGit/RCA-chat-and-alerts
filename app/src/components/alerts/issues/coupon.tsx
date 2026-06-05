import { CheckCircle2, ExternalLink, XCircle, Tag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// One scrape record — timestamp + raw coupon strings from the DB
export type CouponScrape = {
  timestamp: number;     // Unix ms — displayed as heading + clock time (e.g. "2 hours ago" / "11:42 AM")
  detected: boolean;
  coupons?: string[];    // raw strings as returned from DB e.g. ["Apply $2.50 coupon"]
  buyBoxWinner?: string; // seller/brand holding the Buy Box at scrape time
  pdpUrl?: string;       // archived PDP snapshot URL for this scrape (falls back to asin + timestamp)
};

export type CouponIssueProps = {
  scrapes: CouponScrape[]; // last 4 scrapes, most recent first
  asin?: string;           // used to build point-in-time PDP links when pdpUrl is omitted
  yourBrand?: string;      // when buyBoxWinner matches, appends "(You)"
};

function formatBuyBoxWinner(winner: string | undefined, yourBrand?: string): string {
  if (!winner) return "—";
  if (yourBrand && winner.toLowerCase() === yourBrand.toLowerCase()) {
    return `${winner} (You)`;
  }
  return winner;
}

function getPdpUrl(scrape: CouponScrape, asin?: string): string | null {
  if (scrape.pdpUrl) return scrape.pdpUrl;
  if (asin) {
    return `https://www.amazon.com/dp/${asin}?ciq_snapshot=${scrape.timestamp}`;
  }
  return null;
}

// ── Single coupon pill — shows raw string exactly as received ─────────────────

function CouponPill({ raw }: { raw: string }) {
  return (
    <span className="flex items-start gap-1.5">
      <span className="mt-0.5 flex shrink-0 items-center justify-center rounded bg-amber-100 p-1">
        <Tag className="h-3.5 w-3.5 text-amber-600" />
      </span>
      <span className="text-sm text-slate-800">{raw}</span>
    </span>
  );
}

// ── Time helpers — two-line format: relative/date heading + exact clock time ──

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function formatClockTime(ms: number): string {
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatTimeHeading(ms: number): string {
  const date = new Date(ms);
  const now = new Date();
  const dayMs = startOfDay(date);
  const todayMs = startOfDay(now);
  const yesterdayMs = todayMs - 86_400_000;

  if (dayMs === todayMs) {
    const diff = now.getTime() - ms;
    const mins = Math.floor(diff / 60_000);
    const hrs = Math.floor(diff / 3_600_000);
    if (mins < 60) {
      return mins <= 1 ? "1 minute ago" : `${mins} minutes ago`;
    }
    return hrs === 1 ? "1 hour ago" : `${hrs} hours ago`;
  }

  if (dayMs === yesterdayMs) return "Yesterday";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── CouponIssue component ─────────────────────────────────────────────────────

export function CouponIssue({ scrapes, asin, yourBrand }: CouponIssueProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-100 text-xs font-semibold text-slate-500">
            <th className="whitespace-nowrap px-4 py-2.5 text-left">Time</th>
            <th className="w-[140px] px-4 py-2.5 text-left">Coupon Detected</th>
            <th className="px-4 py-2.5 text-left">Coupon Value</th>
            <th className="w-[130px] px-4 py-2.5 text-left">Buy Box Winner</th>
          </tr>
        </thead>
        <tbody>
          {scrapes.map((s, i) => {
            const pdpUrl = getPdpUrl(s, asin);

            return (
              <tr
                key={s.timestamp}
                className={[
                  "border-b border-slate-100 last:border-b-0",
                  i === 0 ? "bg-slate-50/60" : "",
                ].join(" ")}
              >
                {/* Timestamp + inline PDP snapshot link */}
                <td className="whitespace-nowrap px-4 py-2.5 align-top">
                  <div className="flex w-max flex-col gap-0.5">
                    <div className="flex items-center gap-1">
                      <span className="whitespace-nowrap text-sm font-medium text-slate-800">
                        {formatTimeHeading(s.timestamp)}
                      </span>
                      {pdpUrl && (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <a
                                href={pdpUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`View PDP snapshot from ${formatTimeHeading(s.timestamp)}`}
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                              />
                            }
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </TooltipTrigger>
                          <TooltipContent side="top">View PDP snapshot</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <span className="whitespace-nowrap text-sm text-slate-500">
                      {formatClockTime(s.timestamp)}
                    </span>
                  </div>
                </td>

                {/* Detected */}
                <td className="px-4 py-2.5 align-top">
                  {s.detected ? (
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                      <XCircle className="h-4 w-4" />
                      No
                    </span>
                  )}
                </td>

                {/* Coupon value — stacked pills when multiple coupons */}
                <td className="px-4 py-2.5 align-top">
                  <div className="flex flex-col gap-1.5">
                    {s.detected && s.coupons && s.coupons.length > 0 ? (
                      s.coupons.map((raw, j) => <CouponPill key={j} raw={raw} />)
                    ) : (
                      <span className="text-sm text-slate-300">—</span>
                    )}
                  </div>
                </td>

                {/* Buy Box winner at time of scrape */}
                <td className="px-4 py-2.5 align-top text-sm text-slate-700">
                  {formatBuyBoxWinner(s.buyBoxWinner, yourBrand)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
