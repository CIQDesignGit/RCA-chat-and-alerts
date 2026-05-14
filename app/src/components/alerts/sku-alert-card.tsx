import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlertItem, IssueType } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

type SkuAlertCardProps = {
  alert: AlertItem;
  /**
   * compact — home page panel.
   *   Overline: ASIN · category | Gap badge
   *   Middle:   thumbnail + SKU name
   *   Bottom:   first tag (full-width, no image indent)
   *
   * full — alerts page panel.
   *   Overline: ASIN · accountId · category | unread dot + Gap badge
   *   Middle:   thumbnail + SKU name
   *   Bottom:   all tags with resolved checkmarks (full-width)
   */
  variant: "compact" | "full";
  isActive?: boolean;
  onClick?: () => void;
};

// Maps tag labels → issue types to look up resolution status
const TAG_TO_ISSUE_TYPE: Record<string, IssueType> = {
  "Lost Buy Box":      "lost-buy-box",
  "Promo Badge":       "promo-badge",
  "Keyword Rank Drop": "keyword-rank-drop",
  "Star Rating":       "star-rating",
  "SOV Drop":          "sov-drop",
  "Share of Voice":    "sov-drop",
};

function isTagResolved(alert: AlertItem, tag: string): boolean {
  const issueType = TAG_TO_ISSUE_TYPE[tag];
  if (!issueType) return false;
  return alert.issues.some((i) => i.type === issueType && i.status === "resolved");
}

function formatGap(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `-$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)     return `-$${(abs / 1_000).toFixed(1)}K`;
  return `-$${abs}`;
}

function cardShell(isActive?: boolean) {
  return cn(
    "relative w-full cursor-pointer rounded-lg border bg-white text-left transition-colors",
    isActive
      ? "border-brand-400 bg-brand-50/40 shadow-sm"
      : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/60",
  );
}

// ─── Shared tag chip ──────────────────────────────────────────────────────────

function TagChip({ alert, tag }: { alert: AlertItem; tag: string }) {
  const resolved = isTagResolved(alert, tag);
  return (
    <span className="flex items-center gap-0.5 rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-500">
      {resolved && <Check className="h-2.5 w-2.5 text-emerald-500" />}
      {tag}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SkuAlertCard({ alert, variant, isActive, onClick }: SkuAlertCardProps) {

  // ── Compact ───────────────────────────────────────────────────────────────
  if (variant === "compact") {
    return (
      <button onClick={onClick} className={cardShell(isActive)}>
        <div className="flex flex-col gap-2 px-3 py-3">

          {/* Row 1 — overline: breadcrumb left, gap badge right */}
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[11px] text-zinc-400">
              <span className="font-mono">{alert.asin}</span>
              <span className="mx-1">·</span>
              {alert.category}
            </p>
            <span className="shrink-0 rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
              {formatGap(alert.gapDollar)}
            </span>
          </div>

          {/* Row 2 — thumbnail + SKU name */}
          <div className="flex items-start gap-3">
            <img
              src={`https://placehold.co/44x44/f4f4f5/71717a?text=${alert.category[0]}`}
              alt={alert.skuName}
              className="h-11 w-11 shrink-0 rounded-md border border-zinc-200 object-cover"
            />
            <p className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-800">
              {alert.skuName}
            </p>
          </div>

          {/* Row 3 — first tag, full width (no image indent) */}
          {alert.tags[0] && (
            <div className="flex flex-wrap items-center gap-1">
              <TagChip alert={alert} tag={alert.tags[0]} />
            </div>
          )}

        </div>
      </button>
    );
  }

  // ── Full ──────────────────────────────────────────────────────────────────
  return (
    <button onClick={onClick} className={cardShell(isActive)}>
      <div className="flex flex-col gap-2 px-3 py-3">

        {/* Row 1 — overline: breadcrumb left, unread dot + gap badge right */}
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[11px] text-zinc-400">
            <span className="font-mono">{alert.asin}</span>
            <span className="mx-1">·</span>
            {alert.accountId}
            <span className="mx-1">·</span>
            {alert.category}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            {/* Unread dot lives inline so it never overlaps the badge */}
            {alert.hasUnread && (
              <span className="h-2 w-2 rounded-full bg-brand-500" />
            )}
            <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
              {formatGap(alert.gapDollar)}
            </span>
          </div>
        </div>

        {/* Row 2 — thumbnail + SKU name */}
        <div className="flex items-start gap-3">
          <img
            src={`https://placehold.co/44x44/f4f4f5/71717a?text=${alert.category[0]}`}
            alt={alert.skuName}
            className="h-11 w-11 shrink-0 rounded-md border border-zinc-200 object-cover"
          />
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-800">
            {alert.skuName}
          </p>
        </div>

        {/* Row 3 — all tags, full width (no image indent) */}
        {alert.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {alert.tags.map((tag) => (
              <TagChip key={tag} alert={alert} tag={tag} />
            ))}
          </div>
        )}

      </div>
    </button>
  );
}
