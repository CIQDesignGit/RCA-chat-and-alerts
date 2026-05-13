import type { AlertItem } from "./types";

type AlertCardProps = {
  alert: AlertItem;
  isActive: boolean;
  onClick: () => void;
};

// Formats -46500 → "-$46.5K"
function formatGap(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `-$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `-$${(abs / 1_000).toFixed(1)}K`;
  return `-$${abs}`;
}

export function AlertCard({ alert, isActive, onClick }: AlertCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left px-4 py-3 transition-colors border-l-2 ${
        isActive
          ? "border-l-violet-500 bg-violet-50"
          : "border-l-transparent hover:bg-zinc-50"
      }`}
    >
      {/* Unread dot */}
      {alert.hasUnread && (
        <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-violet-500" />
      )}

      <div className="flex items-start gap-3">
        {/* Product image */}
        <img
          src={`https://placehold.co/44x44/f4f4f5/71717a?text=${alert.category[0]}`}
          alt={alert.skuName}
          className="h-11 w-11 rounded-md border border-zinc-200 object-cover shrink-0 mt-0.5"
        />

        <div className="flex flex-col gap-1.5 min-w-0 flex-1 pr-4">
          {/* SKU name */}
          <p className="text-sm font-semibold text-zinc-800 leading-snug line-clamp-2">
            {alert.skuName}
          </p>

          {/* Breadcrumb metadata */}
          <p className="text-[11px] text-zinc-400">
            {alert.accountId}
            <span className="mx-1">·</span>
            <span className="font-mono">{alert.asin}</span>
            <span className="mx-1">·</span>
            {alert.category}
          </p>

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-1">
            {/* Gap is always shown first in pink/red */}
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
              Gap {formatGap(alert.gapDollar)}
            </span>

            {/* Other tags */}
            {alert.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] text-zinc-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
