// "Last 7 Day Trend — Sponsored SoV" widget.
// Metrics: SP Branded SOV % · SB Branded SOV % · Top Competitor SOV %
// Rendered inside the expanded SoV Drop root cause row.

// ─── Types ────────────────────────────────────────────────────────────────────

export type SovTrendDay = {
  date: string;
  spBrandedSovPct: number | null; // e.g. 4.0
  sbBrandedSovPct: number | null; // e.g. 2.1
  topCompetitorSovPct: number | null; // e.g. 6.0
};

export type LastWeekTrendSovProps = {
  period: string; // e.g. "Jun 1–7"
  rows: SovTrendDay[];
  // Baselines used to decide cell tint — SOV below baseline = bad for own metrics
  spBaseline?: number;
  sbBaseline?: number;
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

/** Own SOV metric — red background if below baseline */
function OwnSovCell({
  value,
  baseline,
}: {
  value: number | null;
  baseline: number;
}) {
  const isBad = value !== null && value < baseline;
  return (
    <TD className={isBad ? "bg-rose-50" : ""}>
      <span className={`font-medium ${value === null ? "text-slate-400" : isBad ? "text-rose-700" : "text-slate-700"}`}>
        {value === null ? "—" : `${value.toFixed(1)}%`}
      </span>
    </TD>
  );
}

/** Competitor SOV — neutral (no tint; we just observe) */
function CompetitorSovCell({ value }: { value: number | null }) {
  return (
    <TD>
      <span className={`font-medium ${value === null ? "text-slate-400" : "text-slate-800"}`}>
        {value === null ? "—" : `${value.toFixed(1)}%`}
      </span>
    </TD>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendSov({
  period,
  rows,
  spBaseline = 5.0,
  sbBaseline = 3.0,
}: LastWeekTrendSovProps) {
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
              <TD align="left" className="font-medium text-slate-600">SP Branded SOV %</TD>
              {rows.map((day) => (
                <OwnSovCell key={day.date} value={day.spBrandedSovPct} baseline={spBaseline} />
              ))}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">SB Branded SOV %</TD>
              {rows.map((day) => (
                <OwnSovCell key={day.date} value={day.sbBrandedSovPct} baseline={sbBaseline} />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
