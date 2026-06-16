// "Last 7 Day Trend — Stock Availability (OOS)" widget.
// Metrics: Rep OOS % · Unavailability % · On-Hand Inventory · Revenue Lost
// Rendered inside the expanded Out-of-Stock root cause row.

// ─── Types ────────────────────────────────────────────────────────────────────

export type OosTrendDay = {
  date: string;
  repOosPct: number | null;       // e.g. 42 (shown as "42%")
  unavailabilityPct: number | null; // e.g. 78 (shown as "78%")
  onHandInventory: number | null; // e.g. 120 (shown as "120 units")
  revenueLost: number | null;     // e.g. 4200 (shown as "$4.2K")
};

export type LastWeekTrendOosProps = {
  period: string; // e.g. "Jun 1–7"
  rows: OosTrendDay[];
};

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtRevenue(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(abs / 1_000).toFixed(1)}K`;
  return `$${abs.toFixed(0)}`;
}

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

/** Percentage cell — red background if non-zero */
function PctCell({ value }: { value: number | null }) {
  const isBad = value !== null && value > 0;
  return (
    <TD className={isBad ? "bg-rose-50" : ""}>
      <span className={`font-medium ${value === null ? "text-slate-400" : isBad ? "text-rose-700" : "text-slate-700"}`}>
        {value === null ? "—" : `${value}%`}
      </span>
    </TD>
  );
}

/** Inventory count — neutral */
function InventoryCell({ value }: { value: number | null }) {
  return (
    <TD>
      <span className={`font-medium ${value === null ? "text-slate-400" : "text-slate-800"}`}>
        {value === null ? "—" : value.toLocaleString()}
      </span>
    </TD>
  );
}

/** Revenue lost — red background if any loss */
function RevenueLostCell({ value }: { value: number | null }) {
  const isBad = value !== null && value > 0;
  return (
    <TD className={isBad ? "bg-rose-50" : ""}>
      <span className={`font-medium ${value === null ? "text-slate-400" : isBad ? "text-rose-700" : "text-slate-700"}`}>
        {value === null ? "—" : fmtRevenue(value)}
      </span>
    </TD>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendOos({ period, rows }: LastWeekTrendOosProps) {
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
              <TD align="left" className="font-medium text-slate-600">Rep OOS %</TD>
              {rows.map((day) => (
                <PctCell key={day.date} value={day.repOosPct} />
              ))}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">Unavailability %</TD>
              {rows.map((day) => (
                <PctCell key={day.date} value={day.unavailabilityPct} />
              ))}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">On-Hand Inventory</TD>
              {rows.map((day) => (
                <InventoryCell key={day.date} value={day.onHandInventory} />
              ))}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">Revenue Lost</TD>
              {rows.map((day) => (
                <RevenueLostCell key={day.date} value={day.revenueLost} />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
