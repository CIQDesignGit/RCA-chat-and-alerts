// Shared date column header for Last 7 Day Trend tables.
// Renders the date label (uppercase) with a 3-letter day-of-week below.

/** Reference year for mock trend labels like "May 3" or "Jun 1". */
const TREND_REFERENCE_YEAR = 2025;

/** Parses a trend date label (e.g. "May 3") into a 3-char weekday abbreviation. */
export function getTrendDayOfWeek(dateLabel: string): string {
  const parsed = new Date(`${dateLabel}, ${TREND_REFERENCE_YEAR}`);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", { weekday: "short" });
}

type TrendDateColumnHeaderProps = {
  dateLabel: string;
  align?: "left" | "right";
};

export function TrendDateColumnHeader({
  dateLabel,
  align = "right",
}: TrendDateColumnHeaderProps) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-4 py-2.5 ${
        align === "left" ? "text-left" : "text-right"
      }`}
    >
      <div className={`flex flex-col gap-0.5 ${align === "right" ? "items-end" : "items-start"}`}>
        <span className="text-xs font-medium text-slate-600">
          {dateLabel}
        </span>
        <span className="text-[11px] font-normal normal-case text-slate-500">
          {getTrendDayOfWeek(dateLabel)}
        </span>
      </div>
    </th>
  );
}
