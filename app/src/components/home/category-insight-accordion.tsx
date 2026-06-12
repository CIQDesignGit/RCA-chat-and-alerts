"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ── Types ─────────────────────────────────────────────────────────────────────

export type MetricKey = "conversion" | "traffic" | "availability";

export type CategoryMetrics = {
  name: string;
  gapDollar: number;
  gapUnits: number;
  skuCount: number;
  issueCount: number;
  achievedSales: number;
  targetSales: number;
  conversion: number;
  traffic: { total: number; paid: number; organic: number };
  availability: number;
};

type TrendPoint = { week: string; value: number };

const METRIC_KEYS: MetricKey[] = ["conversion", "traffic", "availability"];

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtDollar(v: number, signed = true): string {
  const sign = signed && v < 0 ? "-" : signed && v > 0 ? "+" : "";
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`;
  return `${sign}$${abs}`;
}

function fmtSales(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${Math.round(abs / 1_000)}K`;
  return `$${abs}`;
}

function fmtUnitGap(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000) return `-${(abs / 1_000).toFixed(1)}k units`;
  return `-${abs} units`;
}

function fmtCount(v: number): string {
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

/** Returns the Monday of the week containing `date`. */
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun … 6=Sat
  const diff = (day === 0 ? -6 : 1 - day); // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Last 8 week-start dates (Mon), oldest first, formatted as "Jun 2". */
const WEEK_LABELS: string[] = (() => {
  const thisMonday = getMondayOf(new Date());
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date(thisMonday);
    d.setDate(d.getDate() - (7 - i) * 7);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
})();

function buildTrend(seed: number, base: number, drift = 0.08): TrendPoint[] {
  return Array.from({ length: 8 }, (_, i) => ({
    week: WEEK_LABELS[i],
    value: Math.round(base + Math.sin(i * 0.9 + seed) * base * 0.12 - i * base * drift),
  }));
}

function trendsForCategory(cat: CategoryMetrics) {
  const seed = cat.name.length;
  return {
    conversion: buildTrend(seed, cat.conversion, 0.02),
    traffic: buildTrend(seed + 1, cat.traffic.total, 0.06),
    availability: buildTrend(seed + 2, cat.availability, 0.015),
  };
}

/**
 * Deterministic pseudo-YoY change (%) derived from the category name + metric.
 * Range: roughly -15 to +15. Positive = better vs last year.
 */
function mockYoY(seed: number, metricIndex: number): number {
  return Math.round(Math.sin(seed * 1.7 + metricIndex * 2.3) * 12);
}

/** Pin domain to first/last tick so horizontal grid lines are evenly spaced. */
function buildEvenYAxis(values: number[], lineCount = 4) {
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

const METRIC_META: Record<
  MetricKey,
  { label: string; format: (v: number) => string; chartLabel: string }
> = {
  conversion: {
    label: "Conversion",
    format: (v) => `${v}%`,
    chartLabel: "Conversion rate",
  },
  traffic: {
    label: "Traffic",
    format: fmtCount,
    chartLabel: "Traffic",
  },
  availability: {
    label: "Availability",
    format: (v) => `${v}%`,
    chartLabel: "In-stock rate",
  },
};

// ── Metric cell ───────────────────────────────────────────────────────────────

function MetricCell({
  metricKey,
  category,
  active,
  onSelect,
}: {
  metricKey: MetricKey;
  category: CategoryMetrics;
  active: boolean;
  onSelect: () => void;
}) {
  const meta = METRIC_META[metricKey];
  const value =
    metricKey === "conversion"
      ? category.conversion
      : metricKey === "traffic"
        ? category.traffic.total
        : category.availability;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "flex w-full flex-col gap-0.5 px-3 py-2 text-left transition-colors",
        active ? "bg-brand-50" : "hover:bg-slate-50/80",
      )}
    >
      <span className="text-xs font-medium text-slate-500">
        {meta.label}
      </span>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums text-slate-900",
          active && "text-brand-700",
        )}
      >
        {meta.format(value)}
      </span>
      {metricKey === "traffic" && (
        <span className="flex items-center gap-0.5 text-[11px] text-slate-500">
          {fmtCount(category.traffic.paid)}
          <Tooltip>
            <TooltipTrigger className="cursor-default text-slate-400">(P)</TooltipTrigger>
            <TooltipContent>Paid traffic</TooltipContent>
          </Tooltip>
          <span className="mx-0.5 text-slate-300">·</span>
          {fmtCount(category.traffic.organic)}
          <Tooltip>
            <TooltipTrigger className="cursor-default text-slate-400">(O)</TooltipTrigger>
            <TooltipContent>Organic traffic</TooltipContent>
          </Tooltip>
        </span>
      )}
    </button>
  );
}

// ── Category row ──────────────────────────────────────────────────────────────

function CategoryRow({
  category,
  brandName,
  isOpen,
  onToggle,
  onViewCategory,
}: {
  category: CategoryMetrics;
  brandName: string;
  isOpen: boolean;
  onToggle: () => void;
  onViewCategory?: (brand: string, category: string) => void;
}) {
  const [metric, setMetric] = useState<MetricKey>("traffic");
  const progress = Math.min(
    Math.round((category.achievedSales / category.targetSales) * 100),
    100,
  );
  const trends = trendsForCategory(category);
  const activeMeta = METRIC_META[metric];
  const chartData = trends[metric];
  const yAxis = buildEvenYAxis(chartData.map((d) => d.value));
  const seed = category.name.length;
  const yoyPct = mockYoY(seed, METRIC_KEYS.indexOf(metric));

  function selectMetric(key: MetricKey) {
    setMetric(key);
    if (!isOpen) onToggle();
  }

  return (
    <>
      {/* Main row — entire row is clickable to toggle the accordion */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={onToggle}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
        className="flex cursor-pointer flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-6"
      >
        {/* Left — identity + progress */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-2 sm:flex-[4]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className={cn("text-sm font-semibold", isOpen ? "text-slate-900" : "text-slate-600")}>
                {category.name}
              </span>
            </div>
            <div className="flex shrink-0 items-start gap-2">
              <p className="whitespace-nowrap text-right tabular-nums">
                <span className="text-sm font-medium text-rose-500">
                  {fmtDollar(category.gapDollar)}
                </span>
              </p>
              {/* Mobile chevron */}
              <span className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 sm:hidden">
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </span>
            </div>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-slate-300 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-1 flex items-center justify-between gap-3 text-[11px] text-slate-500">
            <span className="min-w-0 truncate">
              {category.skuCount} SKUs
              <span className="mx-1.5 text-slate-300">·</span>
              {onViewCategory ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewCategory(brandName, category.name);
                  }}
                  className="font-medium text-brand-600 hover:underline"
                >
                  {category.issueCount} issues
                </button>
              ) : (
                <span>{category.issueCount} issues</span>
              )}
            </span>
            <span className="shrink-0 tabular-nums">
              <span className="font-medium text-slate-700">
                {fmtSales(category.achievedSales)}
              </span>
              <span className="text-slate-400"> / </span>
              {fmtSales(category.targetSales)}
            </span>
          </div>
        </div>

        {/* Right — KPI columns */}
        <div className="grid grid-cols-3 gap-3 sm:flex-[4]">
          {METRIC_KEYS.map((key) => (
            <MetricCell
              key={key}
              metricKey={key}
              category={category}
              active={isOpen && metric === key}
              onSelect={() => selectMetric(key)}
            />
          ))}
        </div>

        {/* Desktop chevron */}
        <div className="hidden w-8 shrink-0 items-center justify-center text-slate-400 sm:flex">
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </div>

      {/* Expanded chart */}
      {isOpen && (
        <div className="border-t border-slate-100 py-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-slate-600">
              {activeMeta.chartLabel}
              <span className="font-normal text-slate-400"> · last 8 weeks</span>
            </p>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums",
                yoyPct >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-600",
              )}
            >
              {yoyPct >= 0 ? "+" : ""}{yoyPct}% YoY
            </span>
          </div>

          <ChartContainer
            config={{
              value: {
                label: activeMeta.chartLabel,
                color: "#0ea5e9",
              },
            }}
            className="h-[160px] w-full"
          >
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 12, left: 0, bottom: 28 }}
            >
              {/* ChartContainer's built-in CSS styles the grid lines via [stroke='#ccc'] */}
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                interval={0}
                angle={-35}
                textAnchor="end"
                tick={{ fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={40}
                domain={yAxis.domain}
                ticks={yAxis.ticks}
                allowDecimals={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(v) =>
                  metric === "conversion" || metric === "availability"
                    ? `${v}%`
                    : fmtCount(v)
                }
              />
              {/* ChartTooltipContent reads label from XAxis dataKey automatically */}
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      metric === "conversion" || metric === "availability"
                        ? `${value}%`
                        : fmtCount(Number(value))
                    }
                  />
                }
              />
              {/* stroke uses the CSS var injected by ChartContainer from config.value.color */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--color-value)", strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0, fill: "var(--color-value)" }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      )}
    </>
  );
}

// ── List ──────────────────────────────────────────────────────────────────────

export function CategoryInsightAccordion({
  categories,
  brandName,
  onViewCategory,
  maxCategories,
  onViewAll,
}: {
  categories: CategoryMetrics[];
  brandName: string;
  onViewCategory?: (brand: string, category: string) => void;
  /** When set, only this many rows are shown and a "View all" link appears below. */
  maxCategories?: number;
  /** Called when the user clicks the "View all N categories" link. */
  onViewAll?: () => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = maxCategories ? categories.slice(0, maxCategories) : categories;
  const hiddenCount = maxCategories ? categories.length - maxCategories : 0;

  return (
    <div className="flex flex-col px-4 pb-2 pt-1">
      {visible.map((cat, i) => (
        <div
          key={cat.name}
          className={cn(
            "-mx-4 px-4 transition-colors duration-150",
            i < visible.length - 1 && "border-b border-slate-100",
            openIndex === i ? "bg-sky-50/50" : "hover:bg-slate-50/50",
          )}
        >
          <CategoryRow
            category={cat}
            brandName={brandName}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            onViewCategory={onViewCategory}
          />
        </div>
      ))}

      {hiddenCount > 0 && onViewAll && (
        <div className="border-t border-slate-100 pt-2 pb-1">
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-medium text-brand-600 hover:underline"
          >
            View all {categories.length} categories →
          </button>
        </div>
      )}
    </div>
  );
}
