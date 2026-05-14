import { cn } from "@/lib/utils";
import type { AlertItem } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

type SkuAlertCardProps = {
  alert: AlertItem;
  /**
   * compact — used on the Home page left panel.
   *   Shows: thumbnail, SKU name, ASIN, gap dollar, first alert tag.
   *
   * full — used on the Alerts page left panel.
   *   Shows: all of the above + accountId·category breadcrumb, all tags,
   *          gap units, unread dot, active selection state.
   */
  variant: "compact" | "full";
  isActive?: boolean;
  onClick?: () => void;
};

// Shared neutral style for all tag chips
const TAG_CLASS = "rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-500";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatGap(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `-$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)     return `-$${(abs / 1_000).toFixed(1)}K`;
  return `-$${abs}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SkuAlertCard({ alert, variant, isActive, onClick }: SkuAlertCardProps) {

  // ── Compact — same structure as full, fewer data points (home sidebar) ──────
  if (variant === "compact") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex cursor-pointer items-start gap-3 border-l-2 px-4 py-3 transition-colors",
          isActive
            ? "border-l-brand-500 bg-white/70"
            : "border-l-transparent hover:bg-black/4",
        )}
      >
        <img
          src={`https://placehold.co/44x44/f4f4f5/71717a?text=${alert.category[0]}`}
          alt={alert.skuName}
          className="mt-0.5 h-11 w-11 shrink-0 rounded-md border border-zinc-200 object-cover"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {/* SKU name — 2-line clamp */}
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-800">
            {alert.skuName}
          </p>

          {/* ASIN · category (no accountId on home) */}
          <p className="text-xs text-zinc-400">
            <span className="font-mono">{alert.asin}</span>
            <span className="mx-1">·</span>
            {alert.category}
          </p>

          {/* Gap + first tag only */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
              Gap {formatGap(alert.gapDollar)}
            </span>
            {alert.tags[0] && (
              <span className={TAG_CLASS}>{alert.tags[0]}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Full — all data points, used on the Alerts page ────────────────────────
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full border-l-2 px-4 py-3 text-left transition-colors",
          isActive
          ? "border-l-brand-500 bg-white/70"
          : "border-l-transparent hover:bg-zinc-50",
      )}
    >
      {/* Unread indicator dot */}
      {alert.hasUnread && (
        <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-brand-500" />
      )}

      <div className="flex items-start gap-3">
        <img
          src={`https://placehold.co/44x44/f4f4f5/71717a?text=${alert.category[0]}`}
          alt={alert.skuName}
          className="mt-0.5 h-11 w-11 shrink-0 rounded-md border border-zinc-200 object-cover"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 pr-4">
          {/* SKU name */}
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-800">
            {alert.skuName}
          </p>

          {/* Breadcrumb — accountId · ASIN · category */}
          <p className="text-[11px] text-zinc-400">
            {alert.accountId}
            <span className="mx-1">·</span>
            <span className="font-mono">{alert.asin}</span>
            <span className="mx-1">·</span>
            {alert.category}
          </p>

          {/* Gap badge + all tags */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
              Gap {formatGap(alert.gapDollar)}
            </span>
            {alert.tags.map((tag) => (
              <span key={tag} className={TAG_CLASS}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
