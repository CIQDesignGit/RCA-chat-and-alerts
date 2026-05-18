import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlertItem, IssueType } from "./types";
import { GapBadge } from "./gap-badge";

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
  "SoV Drop":          "sov-drop",
  "SOV Drop":          "sov-drop",
  "Share of Voice":    "sov-drop",
};

function isTagResolved(alert: AlertItem, tag: string): boolean {
  const issueType = TAG_TO_ISSUE_TYPE[tag];
  if (!issueType) return false;
  return alert.issues.some((i) => i.type === issueType && i.status === "resolved");
}


function cardShell(isActive?: boolean) {
  return cn(
    "relative w-full cursor-pointer rounded-lg border bg-white text-left transition-colors",
    isActive
      ? "border-brand-400 bg-brand-50/40 shadow-sm"
      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/60",
  );
}

// ─── Shared tag chip ──────────────────────────────────────────────────────────

function TagChip({ alert, tag }: { alert: AlertItem; tag: string }) {
  const resolved = isTagResolved(alert, tag);
  return (
    <span className="flex items-center gap-0.5 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-500">
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
            <p className="truncate text-[11px] text-slate-400">
              <span className="font-mono">{alert.asin}</span>
              <span className="mx-1">·</span>
              {alert.accountId}
              <span className="mx-1">·</span>
              {alert.category}
            </p>
            <GapBadge gapDollar={alert.gapDollar} layout="stacked" showUnits={false} />
          </div>

          {/* Row 2 — thumbnail + SKU name */}
          <div className="flex items-start gap-3">
            <img
              src={`https://placehold.co/44x44/f4f4f5/71717a?text=${alert.category[0]}`}
              alt={alert.skuName}
              className="h-11 w-11 shrink-0 rounded-md border border-slate-200 object-cover"
            />
            <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800">
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

        {/* Unread dot — bottom right corner */}
        {alert.hasUnread && (
          <span className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-brand-500" />
        )}
      </button>
    );
  }

  // ── Full ──────────────────────────────────────────────────────────────────
  return (
    <button onClick={onClick} className={cardShell(isActive)}>
      <div className="flex flex-col gap-2 px-3 py-3">

        {/* Row 1 — overline: breadcrumb left, gap badge right */}
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[11px] text-slate-400">
            <span className="font-mono">{alert.asin}</span>
            <span className="mx-1">·</span>
            {alert.accountId}
            <span className="mx-1">·</span>
            {alert.category}
          </p>
          <GapBadge gapDollar={alert.gapDollar} layout="stacked" showUnits={false} />
        </div>

        {/* Row 2 — thumbnail + SKU name */}
        <div className="flex items-start gap-3">
          <img
            src={`https://placehold.co/44x44/f4f4f5/71717a?text=${alert.category[0]}`}
            alt={alert.skuName}
            className="h-11 w-11 shrink-0 rounded-md border border-slate-200 object-cover"
          />
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800">
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

      {/* Unread dot — bottom right corner of the card */}
      {alert.hasUnread && (
        <span className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-brand-500" />
      )}
    </button>
  );
}
