"use client";

import { cn } from "@/lib/utils";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  trendsForCategory,
  buildEvenYAxis,
  mockYoY,
  fmtCount,
} from "@/lib/chart-utils";
import type { CategoryMetrics, MetricKey } from "@/components/home/category-insight-accordion";

// ── Metric metadata ────────────────────────────────────────────────────────

const METRIC_META: Record<
  MetricKey,
  { chartLabel: string; format: (v: number) => string }
> = {
  conversion: { chartLabel: "Conversion rate", format: (v) => `${v}%` },
  traffic: { chartLabel: "Traffic", format: fmtCount },
  availability: { chartLabel: "In-stock rate", format: (v) => `${v}%` },
};

const METRIC_INDEX: Record<MetricKey, number> = {
  conversion: 0,
  traffic: 1,
  availability: 2,
};

// ── Component ──────────────────────────────────────────────────────────────

interface MetricChartProps {
  category: CategoryMetrics;
  metric: MetricKey;
}

export function MetricChart({ category, metric }: MetricChartProps) {
  const meta = METRIC_META[metric];
  const isPercent = metric === "conversion" || metric === "availability";

  const trends = trendsForCategory(category);
  const chartData = trends[metric];
  const yAxis = buildEvenYAxis(chartData.map((d) => d.value));
  const yoyPct = mockYoY(category.name.length, METRIC_INDEX[metric]);

  return (
    <div>
      {/* Chart header */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-600">
          {meta.chartLabel}
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
          {yoyPct >= 0 ? "+" : ""}
          {yoyPct}% YoY
        </span>
      </div>

      {/* Recharts line chart — taller than the home-page accordion version */}
      <ChartContainer
        config={{
          value: {
            label: meta.chartLabel,
            color: "#875bf7", // brand-500 — strategy theme
          },
        }}
        className="h-[280px] w-full"
      >
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 0, bottom: 32 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
            angle={-35}
            textAnchor="end"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={44}
            domain={yAxis.domain}
            ticks={yAxis.ticks}
            allowDecimals={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => (isPercent ? `${v}%` : fmtCount(v))}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  isPercent ? `${value}%` : fmtCount(Number(value))
                }
              />
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "var(--color-value)", strokeWidth: 0 }}
            activeDot={{ r: 5.5, strokeWidth: 0, fill: "var(--color-value)" }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
