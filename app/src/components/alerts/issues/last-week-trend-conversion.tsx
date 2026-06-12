// "Last 7 Day Trend — Conversion" widget.
// Metrics: Unit CVR % · Glance Views · Ordered Units
// Rendered inside the expanded Conversion root cause row.

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConversionTrendDay = {
  date: string;
  unitCvrPct: number | null;   // e.g. 4.8 (shown as "4.8%")
  glanceViews: number | null;  // e.g. 12340
  orderedUnits: number | null; // e.g. 592
};

export type LastWeekTrendConversionProps = {
  period: string;            // e.g. "Jun 1–7"
  rows: ConversionTrendDay[];
  cvrBaseline?: number;      // CVR below this gets bg-rose-50 — defaults to 4.5
};

// ─── Shared table primitives ───────────────────────────────────────────────────

const TH = ({
  children,
  align = "right",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) => (
  <th
    scope="col"
    className={`whitespace-nowrap px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 ${
      align === "left" ? "text-left" : "text-right"
    }`}
  >
    {children}
  </th>
);

const TD = ({
  children,
  className = "",
  align = "right",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}) => (
  <td
    className={`whitespace-nowrap px-4 py-2.5 text-xs ${
      align === "left" ? "text-left" : "text-right"
    } ${className}`}
  >
    {children}
  </td>
);

// ─── Cell renderers ────────────────────────────────────────────────────────────

/** Unit CVR % — red background if below baseline */
function CvrCell({ value, baseline }: { value: number | null; baseline: number }) {
  const isBad = value !== null && value < baseline;
  return (
    <TD className={isBad ? "bg-rose-50" : ""}>
      <span className={`font-medium ${value === null ? "text-slate-400" : "text-slate-800"}`}>
        {value === null ? "—" : `${value.toFixed(1)}%`}
      </span>
    </TD>
  );
}

/**
 * Computes the day-over-day % delta between two counts.
 * Returns null when either value is missing or the previous value is 0.
 */
function dayOverDayDelta(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

/** Count cell — shows value + optional day-over-day delta in smaller text */
function CountCell({
  value,
  delta,
}: {
  value: number | null;
  delta: number | null;
}) {
  const deltaColor =
    delta === null ? ""
    : delta > 0 ? "text-emerald-600"
    : "text-rose-500";

  const deltaLabel =
    delta === null ? null
    : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%`;

  return (
    <TD className="align-top">
      <div className="flex flex-col items-end gap-0.5">
        <span className={`font-medium ${value === null ? "text-slate-400" : "text-slate-800"}`}>
          {value === null ? "—" : value.toLocaleString()}
        </span>
        {deltaLabel && (
          <span className={`text-[10px] font-medium ${deltaColor}`}>{deltaLabel}</span>
        )}
      </div>
    </TD>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendConversion({
  period,
  rows,
  cvrBaseline = 4.5,
}: LastWeekTrendConversionProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-medium text-slate-600">Last 7 Day Trend</span>
        <span className="text-xs text-slate-400">({period})</span>
      </div>

      {/* ── Day-by-day table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <TH align="left">Metric</TH>
              {rows.map((day) => (
                <TH key={day.date}>{day.date}</TH>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <TD align="left" className="font-medium text-slate-600">Unit CVR %</TD>
              {rows.map((day) => (
                <CvrCell key={day.date} value={day.unitCvrPct} baseline={cvrBaseline} />
              ))}
            </tr>
            <tr>
              <TD align="left" className="align-top font-medium text-slate-600">Glance Views</TD>
              {rows.map((day, i) => (
                <CountCell
                  key={day.date}
                  value={day.glanceViews}
                  delta={dayOverDayDelta(day.glanceViews, i > 0 ? rows[i - 1].glanceViews : null)}
                />
              ))}
            </tr>
            <tr>
              <TD align="left" className="align-top font-medium text-slate-600">Ordered Units</TD>
              {rows.map((day, i) => (
                <CountCell
                  key={day.date}
                  value={day.orderedUnits}
                  delta={dayOverDayDelta(day.orderedUnits, i > 0 ? rows[i - 1].orderedUnits : null)}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
