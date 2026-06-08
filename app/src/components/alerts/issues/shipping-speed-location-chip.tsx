import { Check } from "lucide-react";
import type { ShippingLocation } from "@/components/alerts/issues/layout-shipping-markers";

export type { ShippingLocation };

function formatDays(days: number) {
  return days === 1 ? "1 Day" : `${days} Days`;
}

function PrimeBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold">
      <Check className="h-3 w-3 text-amber-500" strokeWidth={2.5} aria-hidden />
      <span className="text-sky-600">prime</span>
    </span>
  );
}

export function ShippingSpeedLocationChip({ city, state, days, fulfillment }: ShippingLocation) {
  return (
    <div className="inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px]">
      <span className="font-semibold text-slate-800">
        {city}, {state}
      </span>
      <span className="shrink-0 text-[10px] font-medium text-slate-500">{formatDays(days)}</span>
      {fulfillment === "prime" ? (
        <PrimeBadge />
      ) : (
        <span className="shrink-0 text-[10px] text-slate-400">(Standard)</span>
      )}
    </div>
  );
}
