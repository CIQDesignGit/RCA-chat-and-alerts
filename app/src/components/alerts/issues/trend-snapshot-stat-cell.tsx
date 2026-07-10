import {
  DELTA_SENTIMENT_CLASS,
  type DeltaFormat,
  type DeltaPolarity,
  formatPercentPointDelta,
  formatRelativeDelta,
  getDeltaSentiment,
} from "./trend-snapshot-delta";

export type TrendSnapshotStatCellProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Secondary line below the main value (e.g. crawl counts). */
  sub?: string;
  /** Week-over-week delta — omit to hide. */
  delta?: number | null;
  deltaFormat?: DeltaFormat;
  /** `inverse` when a higher value is worse (rank, LBB %, OOS %, etc.). */
  deltaPolarity?: DeltaPolarity;
  /** Optional inline badge beside the value. */
  badge?: { label: string; className: string };
};

function SnapshotDelta({
  delta,
  format,
  polarity,
}: {
  delta: number;
  format: DeltaFormat;
  polarity: DeltaPolarity;
}) {
  const sentiment = getDeltaSentiment(delta, polarity);
  const formatted =
    format === "pp"
      ? formatPercentPointDelta(delta)
      : formatRelativeDelta(delta);

  return (
    <span
      className={`text-xs font-medium leading-none ${DELTA_SENTIMENT_CLASS[sentiment]}`}
    >
      {formatted}
    </span>
  );
}

/** Snapshot metric tile with optional week-over-week delta inline beside the value. */
export function TrendSnapshotStatCell({
  label,
  value,
  sub,
  delta,
  deltaFormat = "relative",
  deltaPolarity = "normal",
  badge,
}: TrendSnapshotStatCellProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="flex flex-col gap-0.5">
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-base font-semibold text-slate-700">{value}</span>
          {delta != null && (
            <SnapshotDelta
              delta={delta}
              format={deltaFormat}
              polarity={deltaPolarity}
            />
          )}
          {badge && (
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badge.className}`}
            >
              {badge.label}
            </span>
          )}
        </div>
        {sub && <span className="text-xs text-slate-400">{sub}</span>}
      </div>
    </div>
  );
}

/** Promo badge values like "7 / 7 days" — splits number from suffix for styling. */
export function PromoDaysValue({ value }: { value: string }) {
  const hasDaysSuffix = value.endsWith(" days");
  const numberPart = hasDaysSuffix ? value.slice(0, -5) : value;

  return (
    <>
      {numberPart}
      {hasDaysSuffix && (
        <span className="text-sm font-normal text-slate-500"> days</span>
      )}
    </>
  );
}
