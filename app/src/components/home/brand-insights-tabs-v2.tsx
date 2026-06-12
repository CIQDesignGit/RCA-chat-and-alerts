"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  CategoryInsightAccordion,
  type CategoryMetrics,
} from "./category-insight-accordion";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BrandData {
  name: string;
  gapDollar: number;
  gapUnits: number;
  achievedSales: number;
  targetSales: number;
  categories: CategoryMetrics[];
}

interface BrandInsightsTabsV2Props {
  brands: BrandData[];
  onBrandChange?: (brandName: string) => void;
  onViewCategory?: (brandName: string, categoryName: string) => void;
  onViewAllCategories?: (brandName: string) => void;
  activeBrandName?: string | null;
  /** Limit visible categories per brand — omit to show all. */
  maxCategories?: number;
  /**
   * When true the component fills its parent height: the tab bar stays fixed
   * at the top and the category list scrolls independently.
   */
  fillHeight?: boolean;
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

function PropBar({ pct, active }: { pct: number; active: boolean }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300",
          active ? "bg-brand-500" : "bg-slate-300",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── BrandInsightsTabsV2 ───────────────────────────────────────────────────────

export function BrandInsightsTabsV2({
  brands,
  onBrandChange,
  onViewCategory,
  onViewAllCategories,
  activeBrandName,
  maxCategories,
  fillHeight = false,
}: BrandInsightsTabsV2Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    activeBrandName === null ? null : 0,
  );

  useEffect(() => {
    if (activeBrandName === undefined) return;
    if (activeBrandName === null) {
      setActiveIndex(null);
    } else {
      const idx = brands.findIndex((b) => b.name === activeBrandName);
      setActiveIndex(idx >= 0 ? idx : null);
    }
  }, [activeBrandName, brands]);

  function handleTabClick(index: number) {
    setActiveIndex(index);
    onBrandChange?.(brands[index].name);
  }

  const active = activeIndex !== null ? brands[activeIndex] : null;

  return (
    <div className={cn("flex flex-col", fillHeight && "h-full overflow-hidden")}>
      <div
        className={cn(
          "shrink-0 flex gap-1 bg-slate-100 px-1 pt-1",
          active ? "rounded-t-2xl" : "rounded-2xl pb-1",
        )}
      >
        {brands.map((brand, i) => {
          const isActive = i === activeIndex;
          const noSelection = activeIndex === null;
          const pct = Math.min(
            Math.round((brand.achievedSales / brand.targetSales) * 100),
            100,
          );
          const emphasized = isActive || noSelection;

          return (
            <button
              key={brand.name}
              onClick={() => handleTabClick(i)}
              className={cn(
                "relative flex flex-1 flex-col gap-2 border px-4 py-2.5 text-left transition-all",
                noSelection ? "rounded-xl" : "rounded-t-2xl",
                isActive
                  ? "-mb-px z-10 border-slate-200 border-b-white bg-white"
                  : noSelection
                    ? "border-slate-200 bg-white shadow-sm hover:bg-slate-50"
                    : "border-transparent bg-slate-50 hover:bg-slate-100",
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-base font-semibold text-slate-900">
                  {brand.name}
                </span>
                <span
                  className={cn(
                    "shrink-0 whitespace-nowrap tabular-nums",
                    emphasized ? "text-slate-500" : "text-slate-400",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      emphasized ? "text-rose-500" : "text-slate-500",
                    )}
                  >
                    {fmtDollar(brand.gapDollar)}
                  </span>
                  
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <PropBar pct={pct} active={emphasized} />
                </div>
                <div className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-slate-500">
                  <span className={emphasized ? "font-medium text-slate-700" : undefined}>
                    {fmtSales(brand.achievedSales)}
                  </span>
                  <span className="text-slate-400">/</span>
                  <span>{fmtSales(brand.targetSales)}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {active && (
        <div
          className={cn(
            "rounded-b-2xl border border-slate-200 bg-white",
            fillHeight && "flex-1 overflow-y-auto",
          )}
        >
          <CategoryInsightAccordion
            categories={active.categories}
            brandName={active.name}
            onViewCategory={onViewCategory}
            maxCategories={maxCategories}
            onViewAll={
              onViewAllCategories
                ? () => onViewAllCategories(active.name)
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
