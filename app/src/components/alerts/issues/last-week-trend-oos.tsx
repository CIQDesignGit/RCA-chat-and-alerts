// Merged "Last 7 Day Trend — Stock Availability (OOS)" widget.
// Adds snapshot metric rows before the day-by-day table,
// matching the same structure as LastWeekTrendBuyBox and LastWeekTrendPromoBadge.

import { TrendDateColumnHeader } from "./trend-date-header";
import {
  computePercentPointDelta,
  computeRelativeDelta,
} from "./trend-snapshot-delta";
import { TrendSnapshotStatCell } from "./trend-snapshot-stat-cell";
import { TrendWidgetHeader } from "./trend-widget-header";

// ─── Severity ─────────────────────────────────────────────────────────────────

type OosSeverity = "High" | "Med" | "Low";

const SEVERITY_STYLES: Record<OosSeverity, string> = {
  High: "border-rose-100 bg-rose-50 text-rose-600",
  Med: "border-amber-100 bg-amber-50 text-amber-600",
  Low: "border-slate-200 bg-slate-50 text-slate-500",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type OosTrendDay = {
  date: string;
  repOosPct: number | null;           // e.g. 42 → shown as "42%"
  unavailabilityPct: number | null;   // e.g. 78 → shown as "78%"
  unavailabilityCrawls?: number | null; // e.g. 5 → shown as "5/6 crawls" below the %
  onHandInventory: number | null;     // e.g. 120 → shown as "120"
  revenueLost: number | null;         // e.g. 4200 → shown as "$4.2K"
};

export type LastWeekTrendOosProps = {
  period: string;                 // e.g. "Jun 1–7"
  // ── Snapshot summary stats (shown above the daily table) ──────────────────
  repOosPct?: number;             // e.g. 100 → "100%"
  revenueLost7d?: number;         // e.g. 24300 → "$24.3K"
  unavailabilityPct?: number;     // e.g. 100 → "100%"
  onHandInventory?: number;       // e.g. 0 → "0 units"
  severity?: OosSeverity;
  // Summary crawl counts for the snapshot stat tile
  unavailabilityCrawls?: number;  // e.g. 20 (out of totalCrawls)
  totalCrawls?: number;           // e.g. 24
  // Total crawls run each day — used to build "X/N crawls" label in each table cell
  dailyTotalCrawls?: number;      // e.g. 6
  // Previous period values — used to render comparison lines in each stat tile
  prevRepOosPct?: number;
  prevRevenueLost7d?: number;
  prevUnavailabilityPct?: number;
  prevOnHandInventory?: number;
  rows: OosTrendDay[];
};

// ─── Revenue formatter — e.g. 24300 → "$24.3K" ───────────────────────────────

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

function PctCell({ value }: { value: number | null }) {
  const isBad = value !== null && value > 0;
  return (
    <TD className={isBad ? "bg-rose-50" : ""}>
      <span
        className={`font-medium ${
          value === null ? "text-slate-400" : isBad ? "text-rose-700" : "text-slate-700"
        }`}
      >
        {value === null ? "—" : `${value}%`}
      </span>
    </TD>
  );
}

function InventoryCell({ value }: { value: number | null }) {
  const isEmpty = value !== null && value === 0;
  return (
    <TD className={isEmpty ? "bg-rose-50" : ""}>
      <span
        className={`font-medium ${
          value === null ? "text-slate-400" : isEmpty ? "text-rose-700" : "text-slate-800"
        }`}
      >
        {value === null ? "—" : value.toLocaleString()}
      </span>
    </TD>
  );
}

function RevenueLostCell({ value }: { value: number | null }) {
  const isBad = value !== null && value > 0;
  return (
    <TD className={isBad ? "bg-rose-50" : ""}>
      <span
        className={`font-medium ${
          value === null ? "text-slate-400" : isBad ? "text-rose-700" : "text-slate-700"
        }`}
      >
        {value === null ? "—" : fmtRevenue(value)}
      </span>
    </TD>
  );
}

// Shows the unavailability % on the first line and "X/N crawls" below it.
function UnavailabilityCell({
  value,
  crawls,
  dailyTotal,
}: {
  value: number | null;
  crawls?: number | null;
  dailyTotal: number;
}) {
  const isBad = value !== null && value > 0;
  return (
    <TD className={isBad ? "bg-rose-50" : ""}>
      <div className="flex flex-col items-end gap-0.5">
        <span
          className={`font-medium ${
            value === null ? "text-slate-400" : isBad ? "text-rose-700" : "text-slate-700"
          }`}
        >
          {value === null ? "—" : `${value}%`}
        </span>
        {crawls != null && (
          <span className="text-[10px] text-slate-500">
            {crawls}/{dailyTotal} crawls
          </span>
        )}
      </div>
    </TD>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LastWeekTrendOos({
  period,
  repOosPct = 100,
  revenueLost7d = 24300,
  unavailabilityPct = 100,
  onHandInventory = 0,
  severity = "High",
  unavailabilityCrawls = 20,
  totalCrawls = 24,
  dailyTotalCrawls = 6,
  prevRepOosPct = 18,
  prevRevenueLost7d = 31800,
  prevUnavailabilityPct = 12,
  prevOnHandInventory = 280,
  rows,
}: LastWeekTrendOosProps) {
  const crawlSub = `${unavailabilityCrawls}/${totalCrawls} crawls`;

  const repOosDelta = computePercentPointDelta(repOosPct, prevRepOosPct);
  const unavailabilityDelta = computePercentPointDelta(
    unavailabilityPct,
    prevUnavailabilityPct,
  );
  const revenueLostDelta = computeRelativeDelta(revenueLost7d, prevRevenueLost7d);
  const inventoryDelta = computeRelativeDelta(onHandInventory, prevOnHandInventory);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <TrendWidgetHeader period={period} showPrevWeekLegend />
      <div className="grid grid-cols-2 gap-0 border-b border-slate-100 px-4 py-3">
        <TrendSnapshotStatCell
          label="Rep OOS %"
          value={`${repOosPct}%`}
          delta={repOosDelta}
          deltaFormat="pp"
          deltaPolarity="inverse"
        />
        <TrendSnapshotStatCell
          label="Revenue Lost (7D)"
          value={fmtRevenue(revenueLost7d)}
          delta={revenueLostDelta}
          deltaPolarity="inverse"
        />
      </div>

      <div className="grid grid-cols-2 gap-0 border-b border-slate-100 px-4 py-3">
        <TrendSnapshotStatCell
          label="Unavailability"
          value={`${unavailabilityPct}%`}
          sub={crawlSub}
          delta={unavailabilityDelta}
          deltaFormat="pp"
          deltaPolarity="inverse"
        />
        <TrendSnapshotStatCell
          label="On-Hand Inventory"
          value={`${onHandInventory.toLocaleString()} units`}
          delta={inventoryDelta}
          deltaPolarity="normal"
        />
      </div>

      {/* ── Day-by-day table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <TH align="left">Metric</TH>
              {rows.map((day) => (
                <TrendDateColumnHeader key={day.date} dateLabel={day.date} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Rep OOS %
              </TD>
              {rows.map((day) => (
                <PctCell key={day.date} value={day.repOosPct} />
              ))}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Unavailability %
              </TD>
              {rows.map((day) => (
                <UnavailabilityCell
                  key={day.date}
                  value={day.unavailabilityPct}
                  crawls={day.unavailabilityCrawls}
                  dailyTotal={dailyTotalCrawls}
                />
              ))}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                On-Hand Inventory
              </TD>
              {rows.map((day) => (
                <InventoryCell key={day.date} value={day.onHandInventory} />
              ))}
            </tr>
            <tr>
              <TD align="left" className="font-medium text-slate-600">
                Revenue Lost
              </TD>
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
