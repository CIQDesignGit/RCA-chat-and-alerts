import { CheckCircle2, XCircle, Tag } from "lucide-react";

// One scrape record — timestamp + raw coupon strings from the DB
export type CouponScrape = {
  timestamp: number;     // Unix ms — displayed as relative time ("2 hrs ago")
  detected: boolean;
  coupons?: string[];    // raw strings as returned from DB e.g. ["Apply $2.50 coupon"]
};

export type CouponIssueProps = {
  scrapes: CouponScrape[]; // last 4 scrapes, most recent first
};

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

// ── Time helper ───────────────────────────────────────────────────────────────

function formatTimeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  const hrs  = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 60) return `${mins} min ago`;
  if (hrs < 24)  return `${hrs} hr${hrs !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

// ── CouponIssue component ─────────────────────────────────────────────────────

export function CouponIssue({ scrapes }: CouponIssueProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Column headers */}
      <div className="grid grid-cols-[90px_130px_1fr] gap-x-4 border-b border-slate-100 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Time</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Coupon Detected</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Coupon Value</span>
      </div>

      {/* One row per scrape */}
      {scrapes.map((s, i) => (
        <div
          key={s.timestamp}
          className={[
            "grid grid-cols-[90px_130px_1fr] items-start gap-x-4 px-4 py-2.5",
            i < scrapes.length - 1 ? "border-b border-slate-100" : "",
            i === 0 ? "bg-slate-50/60" : "",
          ].join(" ")}
        >
          {/* Timestamp */}
          <span className="pt-0.5 text-sm text-slate-500">{formatTimeAgo(s.timestamp)}</span>

          {/* Detected */}
          <span className="pt-0.5">
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
          </span>

          {/* Coupon value — stacked pills when multiple coupons */}
          <div className="flex flex-col gap-1.5">
            {s.detected && s.coupons && s.coupons.length > 0 ? (
              s.coupons.map((raw, j) => <CouponPill key={j} raw={raw} />)
            ) : (
              <span className="text-sm text-slate-300">—</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
