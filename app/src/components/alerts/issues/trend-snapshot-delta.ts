// Helpers for week-over-week snapshot deltas in Last 7 Day Trend widgets.

export type DeltaPolarity = "normal" | "inverse";

export type DeltaFormat = "relative" | "pp";

/** Relative % change: ((current − previous) / |previous|) × 100 */
export function computeRelativeDelta(
  current: number,
  previous: number,
): number | null {
  if (previous === 0) {
    if (current === 0) return 0;
    return null;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}

/** Percentage-point change for %-type metrics (e.g. 71% − 50% = +21pp). */
export function computePercentPointDelta(
  currentPct: number,
  previousPct: number,
): number {
  return currentPct - previousPct;
}

export function formatRelativeDelta(delta: number): string {
  const sign = delta > 0 ? "+" : delta < 0 ? "" : "";
  const decimals = Math.abs(delta) >= 10 ? 0 : 1;
  return `${sign}${delta.toFixed(decimals)}%`;
}

export function formatPercentPointDelta(delta: number): string {
  const sign = delta > 0 ? "+" : delta < 0 ? "" : "";
  const decimals = Math.abs(delta) >= 10 ? 0 : 1;
  return `${sign}${delta.toFixed(decimals)}pp`;
}

/** Maps raw delta sign + metric polarity to good / bad / neutral for coloring. */
export function getDeltaSentiment(
  delta: number,
  polarity: DeltaPolarity,
): "good" | "bad" | "neutral" {
  if (delta === 0) return "neutral";
  const isPositive = delta > 0;
  if (polarity === "normal") return isPositive ? "good" : "bad";
  return isPositive ? "bad" : "good";
}

export const DELTA_SENTIMENT_CLASS: Record<
  ReturnType<typeof getDeltaSentiment>,
  string
> = {
  good: "text-emerald-600",
  bad: "text-rose-600",
  neutral: "text-slate-400",
};

/** Parses "71%" → 71 */
export function parsePercentString(value: string): number | null {
  const match = value.match(/(-?\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

/** Parses "-$86.0K", "$4,200", "+$37.60" → numeric dollars (sign preserved). */
export function parseDollarString(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—" || trimmed === "$0") {
    return trimmed === "$0" ? 0 : null;
  }

  const isNegative = trimmed.startsWith("-");
  const isPositive = trimmed.startsWith("+");
  const numericPart = trimmed.replace(/[^0-9.]/g, "");
  if (!numericPart) return null;

  let amount = Number(numericPart);
  if (Number.isNaN(amount)) return null;

  const upper = trimmed.toUpperCase();
  if (upper.includes("K")) amount *= 1_000;
  else if (upper.includes("M")) amount *= 1_000_000;

  if (isNegative) amount = -amount;
  else if (!isPositive && trimmed.includes("-")) amount = -amount;

  return amount;
}

/** Parses "7 / 7 days" → 7 (numerator = days with the issue). */
export function parseDaysCount(value: string): number | null {
  const match = value.match(/^(\d+(?:\.\d+)?)\s*\/\s*\d+/);
  return match ? Number(match[1]) : null;
}
