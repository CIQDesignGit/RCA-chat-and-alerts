// ─── GapBadge ─────────────────────────────────────────────────────────────────
// Shared badge for displaying sales gap values.
//
// Props:
//   gapDollar  — required, e.g. -46500  → renders "-$46.5K"
//   gapUnits   — optional, e.g. -150    → renders "-150 units"
//   showUnits  — whether to show the units part (default: true)
//   layout     — "inline"  → horizontal pill (default, used in detail panel)
//                "stacked" → dollar + units stacked vertically, no pill bg
//                            (used in the side-panel card list)

type GapBadgeProps = {
  gapDollar: number;
  gapUnits?: number;
  showUnits?: boolean;
  layout?: "inline" | "stacked";
};

function formatDollar(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `-$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)     return `-$${(abs / 1_000).toFixed(1)}K`;
  return `-$${abs}`;
}

function formatUnits(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000) return `-${(abs / 1_000).toFixed(1)}k units`;
  return `-${abs} units`;
}

export function GapBadge({
  gapDollar,
  gapUnits,
  showUnits = true,
  layout = "inline",
}: GapBadgeProps) {
  const showUnitPart = showUnits && gapUnits !== undefined;

  // ── Stacked: dollar on top, units below, no pill background ──────────────
  if (layout === "stacked") {
    return (
      <span className="flex flex-col items-end gap-0.5">
        <span className="text-xs font-semibold text-red-600">
          {formatDollar(gapDollar)}
        </span>
        {showUnitPart && (
          <span className="text-[11px] text-zinc-400">
            {formatUnits(gapUnits!)}
          </span>
        )}
      </span>
    );
  }

  // ── Inline: horizontal pill (default) ────────────────────────────────────
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
      {formatDollar(gapDollar)}
      {showUnitPart && (
        <>
          <span className="text-red-200">·</span>
          <span className="text-zinc-400">{formatUnits(gapUnits!)}</span>
        </>
      )}
    </span>
  );
}
