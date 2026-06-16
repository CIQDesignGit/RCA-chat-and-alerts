"use client";

import { useState, useEffect } from "react";
import { ChevronRight, TrendingUp } from "lucide-react";
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
  // Controlled active brand — null means no tab selected (e.g. after clearing filters)
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
  // null = no tab active (cleared state); default to first tab if prop not provided
  const [activeIndex, setActiveIndex] = useState<number | null>(
    activeBrandName === null ? null : 0,
  );

  // Sync when parent drives the active brand (e.g. tab switch or clear filters)
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
      {/* ── Tab strip — sits on slate-100 tray, tabs have rounded tops ───────── */}
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
                  ? "-mb-px z-10 border-slate-200 border-t-2 border-t-brand-500 border-b-white bg-white shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.08),3px_0_8px_-2px_rgba(0,0,0,0.06),-3px_0_8px_-2px_rgba(0,0,0,0.06)]"
                  : noSelection
                    ? "border-slate-200 bg-white shadow-sm hover:bg-slate-50"
                    : "border-transparent bg-slate-100/80 hover:bg-slate-100",
              )}
            >
              {/* Brand name + gap dollar on one row */}
              <div className="flex items-baseline justify-between gap-3">
                <span className={cn("text-base font-semibold", isActive ? "text-slate-900" : "text-slate-600")}>
                  {brand.name}
                </span>
                <span className="shrink-0 whitespace-nowrap tabular-nums">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      brand.gapDollar < 0 ? "text-rose-500" : brand.gapDollar > 0 ? "text-emerald-600" : "text-slate-500",
                    )}
                  >
                    {fmtDollar(brand.gapDollar)}
                  </span>
                </span>
              </div>

              {/* Progress bar + achieved/target */}
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

      {/* ── Content panel — only shown when a tab is active ──────────────────── */}
      {active && (
        <div
          className={cn(
            "rounded-b-2xl border border-slate-200 bg-white shadow-[0_8px_16px_-4px_rgba(0,0,0,0.08),4px_4px_10px_-4px_rgba(0,0,0,0.05),-4px_4px_10px_-4px_rgba(0,0,0,0.05)]",
            fillHeight && "flex-1 overflow-y-auto",
          )}
        >
          <CategoryInsightAccordion
            categories={active.categories}
            brandName={active.name}
            onViewCategory={onViewCategory}
            maxCategories={maxCategories}
          />

          {/* Strategy View entry point — entire row is clickable */}
          {onViewAllCategories && (
            <button
              type="button"
              onClick={() => onViewAllCategories(active.name)}
              className="flex w-full items-center gap-1 border-t border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50"
            >
              <TrendingUp className="h-3.5 w-3.5 text-brand-400" />
              <span className="text-xs font-semibold text-brand-600">
                Open Strategy View
              </span>
              <ChevronRight className="h-3 w-3 text-brand-600" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
