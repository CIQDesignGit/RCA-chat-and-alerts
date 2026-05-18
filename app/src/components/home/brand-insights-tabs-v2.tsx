"use client";

import { useState, useEffect } from "react";
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

interface BrandInsightsTabsV2Props {
  brands: BrandData[];
  // Called with the brand name whenever the active tab changes
  onBrandChange?: (brandName: string) => void;
  // Called when a category row is clicked — applies brand + category filter on the home page
  onViewCategory?: (brandName: string, categoryName: string) => void;
  // Called when user clicks "View all categories" — opens alerts panel filtered by brand only
  onViewAllCategories?: (brandName: string) => void;
  // Controlled active brand — null means no tab selected (e.g. after clearing filters)
  activeBrandName?: string | null;
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
// Browser-tab style: each tab is a self-contained card (brand name, gap $,
// units, achieved/target + progress bar). The active tab merges seamlessly
// with the content panel below via the border-b-white + -mb-px CSS trick.

export function BrandInsightsTabsV2({ brands, onBrandChange, onViewCategory, onViewAllCategories, activeBrandName }: BrandInsightsTabsV2Props) {
  // null = no tab active (cleared state); default to first tab if prop not provided
  const [activeIndex, setActiveIndex] = useState<number | null>(
    activeBrandName === null ? null : 0
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
  const maxGap = active ? Math.max(...active.categories.map((c) => Math.abs(c.gapDollar))) : 0;

  return (
    <div className="flex flex-col">

      {/* ── Tab strip — sits on slate-100 tray, tabs have rounded tops ───────── */}
      <div className={cn(
        "flex gap-1 px-1 pt-1 bg-slate-100",
        active ? "rounded-t-[20px]" : "rounded-[20px] pb-1",
      )}>
        {brands.map((brand, i) => {
          const isActive = i === activeIndex;
          const noSelection = activeIndex === null;
          const pct = Math.min(
            Math.round((brand.achievedSales / brand.targetSales) * 100),
            100,
          );

          return (
            <button
              key={brand.name}
              onClick={() => handleTabClick(i)}
              className={cn(
                "relative flex flex-1 flex-col gap-1.5 border px-4 py-2 text-left transition-all",
                // Both tabs fully rounded when none is selected
                noSelection ? "rounded-[16px]" : "rounded-t-[20px]",
                isActive
                  ? "-mb-px border-slate-200 border-b-white bg-white z-10"
                  : noSelection
                    // "no selection" state — both appear as equal white cards
                    ? "border-slate-200 bg-white shadow-sm hover:bg-slate-50"
                    : "border-transparent bg-slate-50 hover:bg-slate-100",
              )}
            >
              {/* Brand name */}
              <span className="text-lg font-semibold text-slate-800">
                {brand.name}
              </span>

              {/* Gap dollar + units stacked below brand name */}
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "text-medium font-semibold leading-none",
                    isActive || noSelection ? "text-rose-500" : "text-slate-500",
                  )}
                >
                  {fmtDollar(brand.gapDollar)}
                </span>
                <span className={cn("text-sm", isActive || noSelection ? "text-slate-500" : "text-slate-400")}>
                  {fmtUnits(brand.gapUnits)}
                </span>
              </div>

              {/* Progress bar on top, achieved / target text below */}
              <div className="flex flex-col gap-1 pt-0.5">
                <PropBar pct={pct} active={isActive || noSelection} />
                <div className="flex items-center gap-1">
                  <span className={cn("text-sm font-medium", isActive || noSelection ? "text-slate-700" : "text-slate-500")}>
                    {fmtSales(brand.achievedSales)}
                  </span>
                  <span className="text-sm text-slate-400">/</span>
                  <span className="text-sm text-slate-500">
                    {fmtSales(brand.targetSales)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Content panel — only shown when a tab is active ──────────────────── */}
      {active && <div className="rounded-b-[20px] border border-slate-200 bg-white">

        {/* Section label */}
        <div className="px-4 py-2.5">
          <span className="text-sm font-medium text-slate-500">
            Category performance
          </span>
        </div>

        {/* Category rows */}
        <div className="px-2 pt-2 pb-2">
          {active.categories.slice(0, 4).map((cat) => {
            const barPct = (Math.abs(cat.gapDollar) / maxGap) * 100;
            return (
              <button
                key={cat.name}
                onClick={() => onViewCategory?.(active.name, cat.name)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50"
              >
                <span className="flex-1 truncate text-sm font-medium text-slate-700">
                  {cat.name}
                </span>
                {/* Proportional bar — widest = biggest gap */}
                <div className="h-0.5 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${barPct}%` }}
                  />
                </div>
                <span className="w-14 shrink-0 text-right text-sm font-medium text-rose-500">
                  {fmtDollar(cat.gapDollar)}
                </span>
                <span className="w-20 shrink-0 text-right text-sm font-normal text-slate-600">
                  {fmtUnits(cat.gapUnits)}
                </span>
              </button>
            );
          })}
        </div>

      </div>}
    </div>
  );
}
