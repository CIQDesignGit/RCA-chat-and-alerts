export type OutOfStockProps = {
  representativeOosPct?: number;
  daysOutOfStock?: number;
  unavailabilityPct?: number;
  onHandInventoryUnits?: number;
  representativeOosSeverity?: OosSeverity;
};

type OosSeverity = "High" | "Med" | "Low";

const SEVERITY_STYLES: Record<OosSeverity, string> = {
  High: "border-rose-100 bg-rose-50 text-rose-600",
  Med: "border-amber-100 bg-amber-50 text-amber-600",
  Low: "border-slate-200 bg-slate-50 text-slate-500",
};

function OosVisualCard() {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Grows to fill card — bottom section stays natural height (~62px) */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[repeating-linear-gradient(45deg,#ffe4e6_0,#ffe4e6_10px,#ffffff_10px,#ffffff_20px)]">
        <div className="-rotate-12 rounded-md border-2 border-red-500 bg-white px-2.5 py-1 shadow-sm">
          <span className="text-[10px] font-bold tracking-wide text-red-500">
            OUT OF STOCK
          </span>
        </div>
      </div>

      {/* Bottom placeholders */}
      <div className="flex shrink-0 flex-col gap-1 px-2.5 py-3">
        <div className="h-2 w-[70%] rounded-full bg-slate-100" />
        <p className="text-[11px] font-semibold leading-tight text-red-500">Currently unavailable</p>
        <div className="flex flex-col gap-1">
          <div className="h-2 w-full rounded-full bg-slate-100" />
          <div className="h-2 w-full rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function OosMetricCard({
  label,
  value,
  unit,
  valueClassName = "text-slate-700",
  severity,
}: {
  label: string;
  value: string | number;
  unit?: string;
  valueClassName?: string;
  severity?: OosSeverity;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div className="flex items-center gap-2">
        <div className="flex items-baseline gap-1">
          <span className={`text-lg font-semibold leading-none ${valueClassName}`}>{value}</span>
          {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
        </div>
        {severity && (
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${SEVERITY_STYLES[severity]}`}
          >
            {severity}
          </span>
        )}
      </div>
    </div>
  );
}

export function OutOfStockIssue({
  representativeOosPct = 42,
  daysOutOfStock = 6,
  unavailabilityPct = 78,
  onHandInventoryUnits = 120,
  representativeOosSeverity = "High",
}: OutOfStockProps) {
  return (
    <div className="grid grid-cols-[148px_1fr] gap-3">
      <OosVisualCard />

      <div className="grid grid-cols-2 gap-3">
        <OosMetricCard
          label="Representative OOS%"
          value={representativeOosPct}
          unit="%"
          valueClassName="text-red-500"
          severity={representativeOosSeverity}
        />
        <OosMetricCard
          label="No. of Days OOS"
          value={daysOutOfStock}
          unit="days"
        />
        <OosMetricCard
          label="Unavailability"
          value={unavailabilityPct}
          unit="%"
          valueClassName="text-red-500"
        />
        <OosMetricCard
          label="On hand inventory"
          value={onHandInventoryUnits}
          unit="units"
          valueClassName="text-slate-700"
        />
      </div>
    </div>
  );
}
