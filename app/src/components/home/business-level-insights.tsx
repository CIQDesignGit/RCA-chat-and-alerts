"use client";

import { BrandInsightsTabsV2 } from "./brand-insights-tabs-v2";
import { BRANDS } from "./brands-data";

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
  onViewCategory?: (brandName: string, categoryName: string) => void;
  onViewAllCategories?: (brandName: string) => void;
  activeBrandName?: string | null;
}

export function BusinessLevelInsights({ onBrandChange, onViewCategory, onViewAllCategories, activeBrandName }: BusinessLevelInsightsProps) {
  const overallGap = BRANDS.reduce((sum, b) => sum + b.gapDollar, 0);

  return (
    <div className="flex flex-col gap-3">

      {/* Summary sentence */}
      <p className="text-xl font-medium leading-snug text-secondary-700">
        The overall business has a{" "}
        <span className="font-semibold text-red-600">
          {formatDollar(overallGap)} gap
        </span>
        .
      </p>

      {/* Tabbed brand insights — one tab per brand, active brand shows full detail */}
      <BrandInsightsTabsV2
        brands={BRANDS}
        onBrandChange={onBrandChange}
        onViewCategory={onViewCategory}
        onViewAllCategories={onViewAllCategories}
        activeBrandName={activeBrandName}
        maxCategories={3}
      />

    </div>
  );
}
