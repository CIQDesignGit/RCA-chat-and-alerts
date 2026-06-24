// "Out of Stock" issue card.
// Left: OosVisualCard (OUT OF STOCK illustration).
// Right: OosCrawlTimeline — white card with compact single-line rows showing
//        timestamp, OOS status badge, location icon + zip code per crawl.
// The full 7-day snapshot + daily table lives in LastWeekTrendOos.

import { MapPin } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OosCrawlEntry = {
  // ISO timestamp string — used to compute relative display label
  crawledAt: string;
  isOos: boolean;
  city: string;
  zipCode: string;
};

export type OutOfStockProps = {
  crawls?: OosCrawlEntry[];
  // How many of the last N crawls were OOS — drives the summary line
  oosInWindow?: number;
  totalWindowCrawls?: number;
};

// ─── Timestamp formatter ──────────────────────────────────────────────────────
// < 1h   → "45m ago · 2:30 PM"
// < 24h  → "2h ago · 2:30 PM"
// Yesterday → "Yesterday · 9:00 PM"
// Older  → "Jun 23 · 9:00 PM"

function fmtTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatCrawlTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = diffMs / (1000 * 60);
  const diffHours = diffMs / (1000 * 60 * 60);
  const timeStr = fmtTime(date);

  if (diffMins < 60) {
    const m = Math.round(diffMins);
    return `${m}m ago · ${timeStr}`;
  }

  if (diffHours < 24) {
    const h = Math.round(diffHours);
    return `${h}h ago · ${timeStr}`;
  }

  // Check if it was yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday · ${timeStr}`;
  }

  // Older — show short date + time
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${dateStr} · ${timeStr}`;
}

// ─── Mock crawl data — timestamps relative to now ────────────────────────────

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

const DEFAULT_CRAWLS: OosCrawlEntry[] = [
  { crawledAt: hoursAgo(2.5), isOos: true,  city: "New York",   zipCode: "10001" },
  { crawledAt: hoursAgo(8),   isOos: true,  city: "New York",   zipCode: "10001" },
  { crawledAt: hoursAgo(14),  isOos: true,  city: "Beverly Hills", zipCode: "90210" },
  { crawledAt: hoursAgo(20),  isOos: false, city: "Chicago",    zipCode: "60601" },
  { crawledAt: hoursAgo(36),  isOos: true,  city: "Houston",    zipCode: "77001" },
  { crawledAt: hoursAgo(48),  isOos: false, city: "Atlanta",    zipCode: "30301" },
];

// ─── OOS visual card — the OUT OF STOCK illustration ─────────────────────────

function OosVisualCard({ lastOosCrawl }: { lastOosCrawl: OosCrawlEntry | null }) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Diagonal stripe background with stamp */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[repeating-linear-gradient(45deg,#ffe4e6_0,#ffe4e6_10px,#ffffff_10px,#ffffff_20px)]">
        <div className="-rotate-12 rounded-md border-2 border-red-500 bg-white px-2.5 py-1 shadow-sm">
          <span className="text-[10px] font-bold tracking-wide text-red-500">
            OUT OF STOCK
          </span>
        </div>
      </div>

      {/* Bottom info — last known OOS location */}
      <div className="flex shrink-0 flex-col gap-1.5 px-2.5 py-3">
        <p className="text-sm font-semibold leading-tight text-red-500">
          Currently unavailable
        </p>
        {lastOosCrawl ? (
          <>
            {/* City + zip chip */}
            <span className="flex items-center gap-0.5 self-start rounded bg-slate-100 px-1.5 py-0.5 text-sm font-medium text-slate-500">
              <MapPin className="h-2.5 w-2.5 text-slate-400" />
              {lastOosCrawl.city} ({lastOosCrawl.zipCode})
            </span>
            {/* Relative timestamp of that crawl */}
            <span className="text-sm text-slate-400">
              {formatCrawlTimestamp(lastOosCrawl.crawledAt)}
            </span>
          </>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="h-2 w-full rounded-full bg-slate-100" />
            <div className="h-2 w-full rounded-full bg-slate-100" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Crawl timeline ───────────────────────────────────────────────────────────
// Single-line row per crawl: dot → timestamp + status badge → zip chip
// Status badge is inline next to the timestamp (proximity = same fact)

function OosCrawlTimeline({
  crawls,
  oosInWindow,
  totalWindowCrawls,
}: {
  crawls: OosCrawlEntry[];
  oosInWindow: number;
  totalWindowCrawls: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      {/* Summary line */}
      <p className="mb-3 text-sm leading-snug text-slate-600">
        This SKU was OOS for{" "}
        <span className="font-semibold text-slate-700">
          {oosInWindow}/{totalWindowCrawls} crawls
        </span>{" "}
        in the previous {totalWindowCrawls} hours. Here are the latest{" "}
        {crawls.length} crawls.
      </p>
      <div className="flex flex-col">
        {crawls.map((crawl, index) => {
          const isLast = index === crawls.length - 1;
          const label = formatCrawlTimestamp(crawl.crawledAt);

          return (
            <div key={index} className="flex gap-2.5">
              {/* Left column: dot + connector */}
              <div className="flex flex-col items-center">
                <div
                  className={`mt-[5px] h-2 w-2 shrink-0 rounded-full ${
                    crawl.isOos ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                />
                {!isLast && (
                  <div className="mt-1 w-px flex-1 bg-slate-200" style={{ minHeight: "14px" }} />
                )}
              </div>

              {/* Right column: timestamp · status badge · zip */}
              <div className={`flex min-w-0 flex-1 items-center gap-3 ${!isLast ? "pb-4" : ""}`}>
                <span className="text-sm text-slate-600">{label}</span>

                {/* Status badge */}
                <span
                  className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                    crawl.isOos
                      ? "bg-rose-50 text-rose-600"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {crawl.isOos ? "OOS" : "In Stock"}
                </span>

                {/* Location icon + zip code */}
                <span className="flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-sm font-medium text-slate-500">
                  <MapPin className="h-2.5 w-2.5 text-slate-400" />
                  {crawl.city} ({crawl.zipCode})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OutOfStockIssue({
  crawls = DEFAULT_CRAWLS,
  oosInWindow = 20,
  totalWindowCrawls = 24,
}: OutOfStockProps) {
  // Find the most recent crawl that was OOS (crawls are newest-first)
  const lastOosCrawl = crawls.find((c) => c.isOos) ?? null;

  return (
    <div className="grid grid-cols-[200px_1fr] gap-3">
      <OosVisualCard lastOosCrawl={lastOosCrawl} />
      <OosCrawlTimeline
        crawls={crawls}
        oosInWindow={oosInWindow}
        totalWindowCrawls={totalWindowCrawls}
      />
    </div>
  );
}
