"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CategoryInsight {
  name: string;
  gapDollar: number;
  gapUnits: number;
}

interface BrandData {
  name: string;
  gapDollar: number;
  gapUnits: number;
  achievedSales: number;
  targetSales: number;
  categories: CategoryInsight[];
}

interface BrandInsightsTabsProps {
  brands: BrandData[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDollar(v: number): string {
  const sign = v < 0 ? "-" : "+";
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`;
  return `${sign}$${abs}`;
}

function fmtUnits(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000) return `-${(abs / 1_000).toFixed(1)}k units`;
  return `-${abs} units`;
}

function fmtSales(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${Math.round(abs / 1_000)}K`;
  return `$${abs}`;
}

// ── PropBar ───────────────────────────────────────────────────────────────────

function PropBar({ pct }: { pct: number }) {
  return (
    <div className="h-0.5 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-200">
      <div
        className="h-full rounded-full bg-brand-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── BrandInsightsTabs ─────────────────────────────────────────────────────────
// Single container with:
//   - Tab strip: all 3 brands always visible, active one underlined
//   - Content panel: only the active brand's Achieved/Target header + category rows

export function BrandInsightsTabs({ brands }: BrandInsightsTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const active = brands[activeIndex];
  const maxGap = Math.max(...active.categories.map((c) => Math.abs(c.gapDollar)));
  const progressPct = Math.min(
    Math.round((active.achievedSales / active.targetSales) * 100),
    100,
  );

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">

      {/* ── Tab strip — all brands, always visible ─────────────────────────── */}
      <div className="flex">
        {brands.map((brand, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={brand.name}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "flex flex-1 flex-col items-start border-b-2 px-4 py-3 text-left transition-colors",
                isActive
                  ? "border-brand-500 bg-white"
                  : "border-zinc-100 bg-zinc-50 hover:bg-zinc-100",
                // Separate inactive tabs with a right border
                i < brands.length - 1 && "border-r border-r-zinc-100",
              )}
            >
              <span
                className={cn(
                  "text-sm font-semibold",
                  isActive ? "text-zinc-800" : "text-zinc-500",
                )}
              >
                {brand.name}
              </span>
              <span
                className={cn(
                  "font-semibold",
                  isActive ? "text-rose-500" : "text-rose-400",
                )}
              >
                {fmtDollar(brand.gapDollar)}
              </span>
              <span className="text-xs text-zinc-400">
                {fmtUnits(brand.gapUnits)}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Achieved / Target header — active brand only ───────────────────── */}
      <div className="border-b border-zinc-100 px-4 pt-3 pb-3">
        <div className="mb-2.5 flex items-end justify-between">
          {/* Left — Achieved */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span className="h-2 w-2 rounded-sm bg-brand-500" />
              Achieved
            </div>
            <span className="text-base font-bold text-zinc-900">
              {fmtSales(active.achievedSales)}
            </span>
          </div>
          {/* Right — Target */}
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              Target
              <span className="h-2 w-2 rounded-sm border border-zinc-300" />
            </div>
            <span className="text-base font-bold text-zinc-400">
              {fmtSales(active.targetSales)}
            </span>
          </div>
        </div>
        {/* Progress bar — inline style only for dynamic % */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Category rows — active brand only, clickable → Alerts page ─────── */}
      <div className="px-2 py-2">
        {active.categories.slice(0, 4).map((cat) => {
          const barPct = (Math.abs(cat.gapDollar) / maxGap) * 100;
          return (
            <button
              key={cat.name}
              onClick={() => {
                const params = new URLSearchParams({
                  brand:    active.name,
                  category: cat.name,
                });
                router.push(`/alerts?${params.toString()}`);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-zinc-50"
            >
              <span className="flex-1 truncate text-sm font-medium text-zinc-700">
                {cat.name}
              </span>
              <PropBar pct={barPct} />
              <span className="w-14 shrink-0 text-right text-sm font-normal text-rose-500">
                {fmtDollar(cat.gapDollar)}
              </span>
              <span className="w-20 shrink-0 text-right text-sm text-zinc-700">
                {fmtUnits(cat.gapUnits)}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
