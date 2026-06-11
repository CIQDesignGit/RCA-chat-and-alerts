import { cn } from "@/lib/utils";
import type { AlertItem } from "./types";
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
   *   Bottom:   all tags (full-width)
   */
  variant: "compact" | "full";
  isActive?: boolean;
  onClick?: () => void;
};

function cardShell(isActive?: boolean) {
  return cn(
    "relative w-full cursor-pointer rounded-lg border bg-white text-left transition-colors",
    isActive
      ? "border-brand-400 bg-brand-50/40 shadow-sm"
      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/60",
  );
}

// ─── Shared tag chip ──────────────────────────────────────────────────────────

function TagChip({ tag }: { tag: string }) {
  return (
    <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-500">
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
                <TagChip key={tag} tag={tag} />
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
              <TagChip key={tag} tag={tag} />
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
