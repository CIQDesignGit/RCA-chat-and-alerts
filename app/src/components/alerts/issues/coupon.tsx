import { CheckCircle2, XCircle, Tag } from "lucide-react";

// One scrape record — timestamp + detection result
export type CouponScrape = {
  timestamp: string;   // e.g. "May 20 · 10:42 AM"
  detected: boolean;
  value?: string;      // e.g. "$2.95" — only present when detected
  couponType?: string; // e.g. "off purchase"
};

export type CouponIssueProps = {
  scrapes: CouponScrape[]; // last 4 scrapes, most recent first
};

export function CouponIssue({ scrapes }: CouponIssueProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Column headers */}
      <div className="grid grid-cols-3 gap-0 border-b border-slate-100 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Time
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Coupon Detected
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Coupon Value
        </span>
      </div>

      {/* One row per scrape */}
      {scrapes.map((s, i) => (
        <div
          key={s.timestamp}
          className={`grid grid-cols-3 gap-0 px-4 py-2.5 ${
            i < scrapes.length - 1 ? "border-b border-slate-100" : ""
          } ${i === 0 ? "bg-slate-50/60" : ""}`}
        >
          {/* Timestamp */}
          <span className="text-sm text-slate-500">{s.timestamp}</span>

          {/* Detected */}
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

          {/* Coupon value */}
          {s.detected && s.value ? (
            <span className="flex items-center gap-1.5">
              <span className="flex items-center justify-center rounded bg-amber-100 p-1">
                <Tag className="h-3.5 w-3.5 text-amber-600" />
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {s.value} {s.couponType ?? "off"}
              </span>
            </span>
          ) : (
            <span className="text-sm text-slate-300">—</span>
          )}
        </div>
      ))}
    </div>
  );
}
