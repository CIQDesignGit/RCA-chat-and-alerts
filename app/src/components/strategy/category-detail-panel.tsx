"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AiInsightBanner } from "./ai-insight-banner";
import { MetricChart } from "./metric-chart";
import type { CategoryMetrics, MetricKey } from "@/components/home/category-insight-accordion";
import type { BrandData } from "@/components/home/brands-data";

// ── Formatters ─────────────────────────────────────────────────────────────

function fmtDollar(v: number): string {
  const sign = v < 0 ? "-" : "+";
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

// ── KPI tiles — double as metric tab switchers ─────────────────────────────

type KpiTile = { key: MetricKey; label: string; value: string; sub: string };

// ── Component ──────────────────────────────────────────────────────────────

interface CategoryDetailPanelProps {
  category: CategoryMetrics;
  brand: BrandData;
}

export function CategoryDetailPanel({ category, brand }: CategoryDetailPanelProps) {
  const router = useRouter();
  const [metric, setMetric] = useState<MetricKey>("traffic");
  const progress = Math.min(
    Math.round((category.achievedSales / category.targetSales) * 100),
    100,
  );
  const paidPct = Math.round((category.traffic.paid / category.traffic.total) * 100);

  return (
    <div className="flex flex-col gap-5 px-6 py-5">

      {/* ── Category header ── */}
      <div>
        <p className="text-xs font-medium text-slate-400">{brand.name}</p>
        <div className="mt-0.5 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">{category.name}</h2>
          <span className="shrink-0 text-xl font-bold tabular-nums text-rose-500">
            {fmtDollar(category.gapDollar)}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-xs tabular-nums text-slate-500">
            <span className="font-medium text-slate-700">{fmtSales(category.achievedSales)}</span>
            <span className="text-slate-400"> / {fmtSales(category.targetSales)}</span>
          </span>
        </div>
      </div>

      {/* ── AI Insight Banner ── */}
      <AiInsightBanner category={category} brandName={brand.name} />

      {/* ── Tabbed metric widget — tiles + chart in one card ── */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">

        {/* Tab header — KPI tiles act as metric selectors */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
          {(
            [
              { key: "conversion", label: "Conversion", value: `${category.conversion}%`, sub: "This week" },
              {
                key: "traffic",
                label: "Traffic",
                value: category.traffic.total >= 1_000
                  ? `${(category.traffic.total / 1_000).toFixed(1)}K`
                  : String(category.traffic.total),
                sub: `${paidPct}% paid`,
              },
              { key: "availability", label: "Availability", value: `${category.availability}%`, sub: "In-stock rate" },
            ] as KpiTile[]
          ).map(({ key, label, value, sub }) => {
            const isActive = metric === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setMetric(key)}
                className={cn(
                  "relative flex flex-col gap-0.5 p-4 text-left transition-colors",
                  isActive ? "bg-brand-50" : "hover:bg-slate-50",
                )}
              >
                <p className={cn("text-xs font-medium", isActive ? "text-brand-600" : "text-slate-600")}>
                  {label}
                </p>
                <p className={cn("text-2xl font-bold tabular-nums", isActive ? "text-brand-700" : "text-slate-900")}>
                  {value}
                </p>
                <p className="text-sm text-slate-500">{sub}</p>
                {/* Bottom-edge accent line marks the active tab */}
                {isActive && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Chart body */}
        <div className="p-5">
          <MetricChart category={category} metric={metric} />
        </div>

      </div>

      {/* ── Issues action row — entire card is clickable ── */}
      <button
        type="button"
        onClick={() =>
          router.push(
            `/?brand=${encodeURIComponent(brand.name)}&category=${encodeURIComponent(category.name)}`,
          )
        }
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs transition-colors hover:bg-slate-50"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning-600" />
          <span className="text-sm font-medium text-slate-700">
            {category.issueCount} active issues across {category.skuCount} SKUs
          </span>
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-brand-600">
          View alerts
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </button>

    </div>
  );
}
