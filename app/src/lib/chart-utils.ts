// Shared chart utility functions used by CategoryInsightAccordion (home)
// and the Strategy page components. Keep pure — no React imports here.

export type TrendPoint = { week: string; value: number };

/** Returns the Monday of the week containing `date`. */
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun … 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Last 8 week-start dates (Mon), oldest first, formatted as "Jun 2". */
export const WEEK_LABELS: string[] = (() => {
  const thisMonday = getMondayOf(new Date());
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date(thisMonday);
    d.setDate(d.getDate() - (7 - i) * 7);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
})();

export function buildTrend(seed: number, base: number, drift = 0.08): TrendPoint[] {
  return Array.from({ length: 8 }, (_, i) => ({
    week: WEEK_LABELS[i],
    value: Math.round(base + Math.sin(i * 0.9 + seed) * base * 0.12 - i * base * drift),
  }));
}

/** Accepts any object that has the required metric fields (structural typing). */
type TrendInput = {
  name: string;
  conversion: number;
  traffic: { total: number };
  availability: number;
};

export function trendsForCategory(cat: TrendInput) {
  const seed = cat.name.length;
  return {
    conversion: buildTrend(seed, cat.conversion, 0.02),
    traffic: buildTrend(seed + 1, cat.traffic.total, 0.06),
    availability: buildTrend(seed + 2, cat.availability, 0.015),
  };
}

/** Pin domain to first/last tick so horizontal grid lines are evenly spaced. */
export function buildEvenYAxis(
  values: number[],
  lineCount = 4,
): { domain: [number, number]; ticks: number[] } {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    const offset = min === 0 ? 10 : Math.max(1, Math.round(Math.abs(min) * 0.1));
    const domain: [number, number] = [min - offset, max + offset];
    const step = (domain[1] - domain[0]) / (lineCount - 1);
    const ticks = Array.from({ length: lineCount }, (_, i) =>
      Math.round(domain[0] + step * i),
    );
    return { domain, ticks };
  }

  const step = (max - min) / (lineCount - 1);
  const ticks = Array.from({ length: lineCount }, (_, i) => Math.round(min + step * i));
  return {
    domain: [ticks[0], ticks[ticks.length - 1]] as [number, number],
    ticks,
  };
}

/**
 * Deterministic pseudo-YoY change (%) derived from the category name + metric.
 * Range: roughly -15 to +15. Positive = better vs last year.
 */
export function mockYoY(seed: number, metricIndex: number): number {
  return Math.round(Math.sin(seed * 1.7 + metricIndex * 2.3) * 12);
}

export function fmtCount(v: number): string {
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}
