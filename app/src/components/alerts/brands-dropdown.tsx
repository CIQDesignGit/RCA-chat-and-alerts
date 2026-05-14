"use client";

import { cn } from "@/lib/utils";
import { formatGapDollar, formatGapUnits } from "./filter-chip";
import { DropdownHeader } from "./dropdown-header";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BrandOption {
  name: string;
  gapDollar: number;
  gapUnits: number;
  // Tailwind bg class for the brand's legend color indicator, e.g. "bg-brand-500"
  colorClass: string;
}

interface BrandsDropdownProps {
  brands: BrandOption[];
  achievedSales: number; // portfolio-level — shown in header
  targetSales: number;
  selectedBrand: string | null;
  onSelect: (brand: string) => void;
  className?: string;
}

// ── BrandsDropdown popup ───────────────────────────────────────────────────────
// Appears below the BrandSummaryChip. Header uses the shared DropdownHeader,
// then shows a ranked list of brands by gap (FR-002 sort order).

export function BrandsDropdown({
  brands,
  achievedSales,
  targetSales,
  selectedBrand,
  onSelect,
  className,
}: BrandsDropdownProps) {
  return (
    <div
      className={cn(
        "absolute left-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg",
        className,
      )}
    >
      {/* ── Shared header: portfolio Achieved vs Target ────────────────────── */}
      <DropdownHeader achievedSales={achievedSales} targetSales={targetSales} />

      {/* ── Brand list ─────────────────────────────────────────────────────── */}
      <div className="px-2 py-3">
        <p className="mb-1.5 px-2 text-xs font-semibold tracking-wide text-slate-400">
          Total Weekly Sales
        </p>

        <div className="space-y-0.5">
          {brands.map((brand) => (
            <button
              key={brand.name}
              onClick={() => onSelect(brand.name)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm transition-colors",
                selectedBrand === brand.name ? "bg-brand-50" : "hover:bg-slate-50",
              )}
            >
              {/* Short horizontal dash — brand legend indicator */}
              <span className={cn("h-0.5 w-4 shrink-0 rounded-full", brand.colorClass)} />

              <span className="flex-1 font-medium text-slate-700">{brand.name}</span>

              <span className="font-semibold text-rose-500">
                {formatGapDollar(brand.gapDollar)}
              </span>
              <span className="text-slate-400">{formatGapUnits(brand.gapUnits)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
