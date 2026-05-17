"use client";

import { Pin } from "lucide-react";
import { BrandInsightsTabsV2 } from "./brand-insights-tabs-v2";

// ─── Data — mirrors the RCA Landing Page API shape (FR-002 / FR-003) ──────────
// Sorted by gapDollar ascending (most negative first) per FR-004.
// achievedSales / targetSales power the Achieved/Target header in each card.

const BRANDS = [
  {
    name: "Shark",
    gapDollar: -3_100_000,
    gapUnits: -12_400,
    achievedSales: 1_400_000,
    targetSales: 1_600_000,
    categories: [
      { name: "Kitchen Appliances", gapDollar: -1_200_000, gapUnits: -4_800 },
      { name: "Home Care",          gapDollar:   -900_000, gapUnits: -3_600 },
      { name: "Personal Care",      gapDollar:   -600_000, gapUnits: -2_400 },
      { name: "Outdoor Living",     gapDollar:   -400_000, gapUnits: -1_600 },
    ],
  },
  {
    name: "Ninja",
    gapDollar: -2_400_000,
    gapUnits: -9_600,
    achievedSales: 980_000,
    targetSales: 1_350_000,
    categories: [
      { name: "Air Fryers",        gapDollar: -1_100_000, gapUnits: -4_400 },
      { name: "Blenders",          gapDollar:   -700_000, gapUnits: -2_800 },
      { name: "Coffee Makers",     gapDollar:   -400_000, gapUnits: -1_600 },
      { name: "Indoor Grills",     gapDollar:   -200_000, gapUnits:   -800 },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDollar(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "+";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface BusinessLevelInsightsProps {
  onBrandChange?: (brandName: string) => void;
}

export function BusinessLevelInsights({ onBrandChange }: BusinessLevelInsightsProps) {
  const overallGap = BRANDS.reduce((sum, b) => sum + b.gapDollar, 0);

  return (
    <div className="flex flex-col gap-3">

      {/* Summary sentence — unchanged */}
      <div className="flex items-start gap-2">
        <Pin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
        <p className="text-xl font-semibold leading-snug text-foreground">
          The overall business is{" "}
          <span className="font-semibold text-red-500">
            {formatDollar(overallGap)} down
          </span>{" "}
          this week, driven by{" "}
          <span className="font-semibold text-slate-800">{BRANDS.length} brands</span>.{" "}
          Largest contributor — {" "}
          <span className="font-semibold text-slate-800">{BRANDS[0].name}</span>{" "}
          at{" "}
          <span className="font-semibold text-red-500">
            {formatDollar(BRANDS[0].gapDollar)}
          </span>.
        </p>
      </div>

      {/* Tabbed brand insights — one tab per brand, active brand shows full detail */}
      <BrandInsightsTabsV2 brands={BRANDS} onBrandChange={onBrandChange} />

    </div>
  );
}
