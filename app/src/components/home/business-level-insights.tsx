"use client";

/**
 * BusinessLevelInsights — Option 1
 * Brand tabs across the top, category breakdown cards below.
 * Switching brands swaps the category view.
 * Data shape mirrors the RCA Landing Page API (FR-002 / FR-003).
 */

import { useState } from "react";
import { TrendingDown } from "lucide-react";

// ─── Data types (mirror the API contract from the PRD) ───────────────────────

type CategoryInsight = {
  name: string;
  gapDollar: number;  // negative = underperforming
  gapUnits: number;
};

type BrandInsight = {
  name: string;
  gapDollar: number;
  gapUnits: number;
  categories: CategoryInsight[]; // already sorted largest gap first
};

// ─── Realistic placeholder data — 3 brands × 3-4 categories ─────────────────
// Sorted by gapDollar ascending (most negative first) per PRD FR-004.

const BRANDS: BrandInsight[] = [
  {
    name: "Shark",
    gapDollar: -3_100_000,
    gapUnits: -12_400,
    categories: [
      { name: "Kitchen Appliances", gapDollar: -1_200_000, gapUnits: -4_800 },
      { name: "Home Care",          gapDollar:   -900_000, gapUnits: -3_600 },
      { name: "Personal Care",      gapDollar:   -600_000, gapUnits: -2_400 },
      { name: "Outdoor Living",     gapDollar:   -400_000, gapUnits: -1_600 },
    ],
  },
  {
    name: "Dyson",
    gapDollar: -2_400_000,
    gapUnits: -9_600,
    categories: [
      { name: "Floor Care",    gapDollar: -1_100_000, gapUnits: -4_400 },
      { name: "Air Treatment", gapDollar:   -700_000, gapUnits: -2_800 },
      { name: "Personal Care", gapDollar:   -400_000, gapUnits: -1_600 },
      { name: "Lighting",      gapDollar:   -200_000, gapUnits:   -800 },
    ],
  },
  {
    name: "Instant Brands",
    gapDollar: -1_800_000,
    gapUnits: -7_200,
    categories: [
      { name: "Multi-Cookers", gapDollar: -800_000, gapUnits: -3_200 },
      { name: "Air Fryers",    gapDollar: -600_000, gapUnits: -2_400 },
      { name: "Blenders",      gapDollar: -250_000, gapUnits: -1_000 },
      { name: "Coffee",        gapDollar: -150_000, gapUnits:   -600 },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Formats -1200000 → "-$1.2M", -900000 → "-$900K"
function formatDollar(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "+";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)     return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs}`;
}

// Formats -4800 → "-4,800"
function formatUnits(value: number): string {
  return value.toLocaleString();
}

// Returns what % of the brand's total gap this category represents (0–100)
function gapPercent(categoryGap: number, brandGap: number): number {
  return Math.round((Math.abs(categoryGap) / Math.abs(brandGap)) * 100);
}

// ─── Sub-component: single category card ─────────────────────────────────────

function CategoryCard({
  category,
  brandGap,
}: {
  category: CategoryInsight;
  brandGap: number;
}) {
  const pct = gapPercent(category.gapDollar, brandGap);

  return (
    <div className="flex flex-col justify-between gap-2 rounded-xl border bg-white px-4 py-3 shadow-sm">

      {/* Row 1: name on the left, dollar gap on the right */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-zinc-600 leading-snug">
          {category.name}
        </p>
        <span className="shrink-0 text-base font-bold text-red-500 leading-none">
          {formatDollar(category.gapDollar)}
        </span>
      </div>

      {/* Row 2: progress bar + percentage + unit gap */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-red-400 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="shrink-0 text-[10px] font-semibold text-zinc-400">
          {pct}%
        </span>
        <span className="shrink-0 text-[10px] text-zinc-400">
          {formatUnits(category.gapUnits)} units
        </span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BusinessLevelInsights() {
  // Default to the brand with the largest gap (index 0, already sorted)
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const activeBrand = BRANDS[activeBrandIndex];

  // Sum all brand gaps to get the overall business gap
  const overallGap = BRANDS.reduce((sum, b) => sum + b.gapDollar, 0);

  return (
    <div className="flex flex-col gap-3">

      {/* Summary statement */}
      <div className="flex items-start gap-2">
        <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
        <p className="text-sm text-zinc-600 leading-snug">
          The overall business is{" "}
          <span className="font-bold text-red-500">
            {formatDollar(overallGap)} down
          </span>{" "}
          this week, driven by{" "}
          <span className="font-semibold text-zinc-800">{BRANDS.length} brands</span>.
          {" "}Largest contributor:{" "}
          <span className="font-semibold text-zinc-800">{BRANDS[0].name}</span>{" "}
          at{" "}
          <span className="font-semibold text-red-500">
            {formatDollar(BRANDS[0].gapDollar)}
          </span>.
        </p>
      </div>

      {/* Brand selector tabs — compact, ordered by gap descending */}
      <div className="flex items-stretch gap-2">
        {BRANDS.map((brand, i) => {
          const isActive = i === activeBrandIndex;
          return (
            <button
              key={brand.name}
              onClick={() => setActiveBrandIndex(i)}
              className={`flex flex-1 flex-col items-start rounded-xl border px-3 py-2 text-left transition-all ${
                isActive
                  ? "border-violet-500 bg-violet-50 shadow-sm"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              <span className={`text-xs font-semibold ${isActive ? "text-violet-700" : "text-zinc-600"}`}>
                {brand.name}
              </span>
              <span className={`text-base font-bold leading-tight ${isActive ? "text-red-500" : "text-red-400"}`}>
                {formatDollar(brand.gapDollar)}
              </span>
              <span className="text-[10px] text-zinc-400">
                {formatUnits(brand.gapUnits)} units
              </span>
            </button>
          );
        })}
      </div>

      {/* Category cards — always 4 columns to use full horizontal space */}
      <div className="grid grid-cols-4 gap-2">
        {activeBrand.categories.map((cat) => (
          <CategoryCard
            key={cat.name}
            category={cat}
            brandGap={activeBrand.gapDollar}
          />
        ))}
      </div>
    </div>
  );
}
