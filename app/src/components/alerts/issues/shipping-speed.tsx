"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_LAYOUT_CONFIG,
  layoutShippingMarkers,
  slowThresholdRatio,
  type LayoutConfig,
  type ShippingLocation,
} from "@/components/alerts/issues/layout-shipping-markers";
import { ShippingSpeedLocationChip } from "@/components/alerts/issues/shipping-speed-location-chip";

export type ShippingSpeedProps = {
  avgDays?: number;
  marketCount?: number;
  /** Days above standard Prime delivery benchmark */
  primeDeltaDays?: number;
  locations?: ShippingLocation[];
  scaleMin?: number;
  scaleMax?: number;
  slowThreshold?: number;
};

const DEFAULT_LOCATIONS: ShippingLocation[] = [
  { city: "New York", state: "NY", days: 2, fulfillment: "prime" },
  { city: "Chicago", state: "IL", days: 3, fulfillment: "prime" },
  { city: "Austin", state: "TX", days: 4, fulfillment: "prime" },
  { city: "San Antonio", state: "TX", days: 7, fulfillment: "standard" },
  { city: "Tahoe", state: "CA", days: 7, fulfillment: "standard" },
];

const TRACK_ROW_PADDING = 12;

function ShippingSpeedSummaryHead({
  avgDays,
  marketCount,
}: {
  avgDays: number;
  marketCount: number;
}) {
  return (
    <>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[28px] font-bold leading-none tabular-nums text-slate-900">
          {avgDays}
        </span>
        <span className="text-sm font-medium text-slate-500">Days</span>
      </div>
      <div className="mt-2 flex flex-col gap-0.5">
        <p className="text-sm font-medium text-slate-700">Avg delivery time</p>
        <p className="text-xs text-slate-400">across {marketCount} markets</p>
      </div>
    </>
  );
}

function ShippingSpeedSummaryDelta({ primeDeltaDays }: { primeDeltaDays: number }) {
  return (
    <p className="text-xs leading-snug text-slate-500">
      <span className="font-semibold text-rose-600">+{primeDeltaDays} days</span>{" "}
      more than standard Prime delivery
    </p>
  );
}

function useTimelineLayout(
  locations: ShippingLocation[],
  scaleMin: number,
  scaleMax: number,
  trackWidth: number,
) {
  return useMemo(() => {
    const effectiveWidth =
      trackWidth > 0 ? trackWidth : DEFAULT_LAYOUT_CONFIG.trackWidthPx;

    const layoutConfig: LayoutConfig = {
      ...DEFAULT_LAYOUT_CONFIG,
      scaleMin,
      scaleMax,
      trackWidthPx: effectiveWidth,
    };

    return layoutShippingMarkers(locations, layoutConfig);
  }, [locations, scaleMin, scaleMax, trackWidth]);
}

export function ShippingSpeedIssue({
  avgDays = 4.2,
  marketCount = 5,
  primeDeltaDays = 2.2,
  locations = DEFAULT_LOCATIONS,
  scaleMin = 1,
  scaleMax = 8,
  slowThreshold = 6,
}: ShippingSpeedProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    const element = trackRef.current;
    if (!element) return;

    const updateWidth = () => {
      setTrackWidth(Math.max(Math.floor(element.clientWidth), 0));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const layout = useTimelineLayout(locations, scaleMin, scaleMax, trackWidth);
  const slowRatio = slowThresholdRatio(slowThreshold, scaleMin, scaleMax);
  const slowPercent = `${slowRatio * 100}%`;
  const markerAreaHeight = layout.markerAreaHeight;

  return (
    <div className="grid grid-cols-1 gap-y-6 rounded-xl border border-slate-200 bg-white px-5 py-5 lg:grid-cols-[180px_minmax(0,1fr)] lg:grid-rows-[1fr_auto] lg:gap-x-8 lg:gap-y-0">
      <div className="lg:col-start-1 lg:row-start-1">
        <ShippingSpeedSummaryHead avgDays={avgDays} marketCount={marketCount} />
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3 lg:col-start-1 lg:row-start-2 lg:mt-0">
        <ShippingSpeedSummaryDelta primeDeltaDays={primeDeltaDays} />
      </div>

      {/* Marker layer — ref must sit on a real box (not display:contents) */}
      <div
        ref={trackRef}
        className="relative min-w-0 overflow-visible lg:col-start-2 lg:row-start-1"
        style={{ minHeight: markerAreaHeight }}
      >
        {layout.markers.map((marker) => {
          const top = marker.row * layout.rowStride;
          const connectorHeight = markerAreaHeight - top + TRACK_ROW_PADDING;

          return (
            <div
              key={`${marker.location.city}-${marker.location.state}-${marker.row}`}
              className="absolute flex flex-col items-center"
              style={{
                left: `${marker.xPercent}%`,
                top,
                height: connectorHeight,
                transform: "translateX(-50%)",
              }}
            >
              <ShippingSpeedLocationChip {...marker.location} />
              <div className="w-px flex-1 bg-slate-300" />
            </div>
          );
        })}
      </div>

      {/* Track bar — always visible; top aligns with delta text via matching pt-3 */}
      <div className="pt-3 lg:col-start-2 lg:row-start-2">
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          <div className="h-full bg-blue-200" style={{ width: slowPercent }} />
          <div className="h-full flex-1 bg-red-200" />
        </div>
        <div className="mt-1 flex w-full justify-between text-[11px] text-slate-400">
          <span>{scaleMin} day</span>
          <span>{scaleMax} days</span>
        </div>
      </div>
    </div>
  );
}
