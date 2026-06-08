export type FulfillmentType = "prime" | "standard";

export type ShippingLocation = {
  city: string;
  state: string;
  days: number;
  fulfillment: FulfillmentType;
};

export type LayoutConfig = {
  scaleMin: number;
  scaleMax: number;
  trackWidthPx: number;
  chipHeight: number;
  rowGap: number;
  minGap: number;
  trackGap: number;
};

export type LayoutMarker = {
  location: ShippingLocation;
  xPx: number;
  row: number;
  anchorDays: number;
  chipWidth: number;
  /** Horizontal anchor as a percentage of track width (0–100) */
  xPercent: number;
};

export type DayGroupLayout = {
  days: number;
  xPx: number;
  chipWidth: number;
  left: number;
  right: number;
  locations: ShippingLocation[];
};

export type LayoutResult = {
  markers: LayoutMarker[];
  /** Zero-based index of the highest row used */
  maxRow: number;
  /** Total stacked rows required (maxRow + 1) */
  rowCount: number;
  /** Height of the marker layer above the track bar */
  markerAreaHeight: number;
  /** Pixels between the top of one row and the next */
  rowStride: number;
  /** True when any markers required vertical stacking due to horizontal proximity */
  hasClusteredMarkers: boolean;
};

export const DEFAULT_CHIP_HEIGHT = 27;
export const DEFAULT_ROW_GAP = 6;
export const DEFAULT_MIN_GAP = 8;
export const DEFAULT_TRACK_GAP = 12;

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  scaleMin: 1,
  scaleMax: 8,
  trackWidthPx: 520,
  chipHeight: DEFAULT_CHIP_HEIGHT,
  rowGap: DEFAULT_ROW_GAP,
  minGap: DEFAULT_MIN_GAP,
  trackGap: DEFAULT_TRACK_GAP,
};

/** Approximate rendered chip width from label content (11px text + padding). */
export function estimateChipWidth(location: ShippingLocation): number {
  const daysLabel = location.days === 1 ? "1 Day" : `${location.days} Days`;
  const suffix = location.fulfillment === "prime" ? "prime" : "(Standard)";
  const label = `${location.city}, ${location.state} ${daysLabel} ${suffix}`;
  const charWidth = 6.2;
  const horizontalPadding = 20;
  return Math.ceil(label.length * charWidth + horizontalPadding);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function daysToX(days: number, config: LayoutConfig) {
  const { scaleMin, scaleMax, trackWidthPx } = config;
  const ratio = (days - scaleMin) / (scaleMax - scaleMin);
  return ratio * trackWidthPx;
}

function anchorX(days: number, chipWidth: number, config: LayoutConfig) {
  const { trackWidthPx } = config;
  const raw = daysToX(days, config);
  return clamp(raw, chipWidth / 2, trackWidthPx - chipWidth / 2);
}

function groupByDays(locations: ShippingLocation[]): Map<number, ShippingLocation[]> {
  const map = new Map<number, ShippingLocation[]>();

  for (const location of locations) {
    const existing = map.get(location.days) ?? [];
    existing.push(location);
    map.set(location.days, existing);
  }

  return map;
}

/** Build day groups with anchor positions and per-group chip widths. */
export function buildDayGroups(
  locations: ShippingLocation[],
  config: LayoutConfig,
): DayGroupLayout[] {
  return [...groupByDays(locations).entries()]
    .sort(([a], [b]) => a - b)
    .map(([days, groupLocations]) => {
      const chipWidth = Math.max(...groupLocations.map(estimateChipWidth));
      const xPx = anchorX(days, chipWidth, config);

      return {
        days,
        xPx,
        chipWidth,
        left: xPx - chipWidth / 2,
        right: xPx + chipWidth / 2,
        locations: groupLocations,
      };
    });
}

/** True when two groups would overlap if placed on the same row. */
export function areGroupsTooClose(
  a: Pick<DayGroupLayout, "left" | "right">,
  b: Pick<DayGroupLayout, "left" | "right">,
  minGap: number,
) {
  return !(a.right + minGap <= b.left || b.right + minGap <= a.left);
}

function findLowestAvailableRow(
  groupLeft: number,
  rows: { occupiedUntil: number }[],
  minGap: number,
) {
  for (let row = 0; row < rows.length; row += 1) {
    if (groupLeft >= rows[row].occupiedUntil + minGap) {
      return row;
    }
  }

  return rows.length;
}

/** Assign vertical rows to day groups that are horizontally too close. */
export function assignMarkerRows(
  groups: DayGroupLayout[],
  minGap: number,
): { markers: LayoutMarker[]; maxRow: number; hasClusteredMarkers: boolean } {
  const rows: { occupiedUntil: number }[] = [];
  const markers: LayoutMarker[] = [];
  let maxRow = 0;
  let hasClusteredMarkers = false;

  for (const group of groups) {
    const stackSize = group.locations.length;
    const baseRow = findLowestAvailableRow(group.left, rows, minGap);

    if (baseRow > 0 || stackSize > 1) {
      hasClusteredMarkers = true;
    }

    while (rows.length <= baseRow + stackSize - 1) {
      rows.push({ occupiedUntil: Number.NEGATIVE_INFINITY });
    }

    group.locations.forEach((location, index) => {
      const row = baseRow + index;
      maxRow = Math.max(maxRow, row);

      markers.push({
        location,
        xPx: group.xPx,
        xPercent: 0,
        row,
        anchorDays: group.days,
        chipWidth: estimateChipWidth(location),
      });
    });

    for (let row = baseRow; row < baseRow + stackSize; row += 1) {
      rows[row].occupiedUntil = Math.max(rows[row].occupiedUntil, group.right);
    }
  }

  return { markers, maxRow, hasClusteredMarkers };
}

/** Derive marker-layer height from row count — grows when chips stack vertically. */
export function computeMarkerAreaHeight(
  maxRow: number,
  config: Pick<LayoutConfig, "chipHeight" | "rowGap" | "trackGap">,
): number {
  const { chipHeight, rowGap, trackGap } = config;
  const rowStride = chipHeight + rowGap;
  return maxRow * rowStride + chipHeight + trackGap;
}

export function layoutShippingMarkers(
  locations: ShippingLocation[],
  partialConfig: Partial<LayoutConfig> = {},
): LayoutResult {
  const config: LayoutConfig = { ...DEFAULT_LAYOUT_CONFIG, ...partialConfig };
  const groups = buildDayGroups(locations, config);
  const { markers: rawMarkers, maxRow, hasClusteredMarkers } = assignMarkerRows(
    groups,
    config.minGap,
  );
  const markers = rawMarkers.map((marker) => ({
    ...marker,
    xPercent: (marker.xPx / config.trackWidthPx) * 100,
  }));
  const rowStride = config.chipHeight + config.rowGap;
  const markerAreaHeight = computeMarkerAreaHeight(maxRow, config);

  return {
    markers,
    maxRow,
    rowCount: maxRow + 1,
    markerAreaHeight,
    rowStride,
    hasClusteredMarkers,
  };
}

export function slowThresholdRatio(
  slowThreshold: number,
  scaleMin: number,
  scaleMax: number,
) {
  return (slowThreshold - scaleMin) / (scaleMax - scaleMin);
}
