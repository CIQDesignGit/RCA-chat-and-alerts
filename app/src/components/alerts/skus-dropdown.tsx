"use client";

import { cn } from "@/lib/utils";
import { formatGapDollar, formatGapUnits } from "./filter-chip";
import { DropdownHeader } from "./dropdown-header";
import type { SkuData } from "./filter-mock-data";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SkusDropdownProps {
  skus: SkuData[];
  categoryName: string;
  categoryGapDollar: number;
  categoryGapUnits: number;
  achievedSales: number; // category-level — shown in header
  targetSales: number;
  selectedAsin: string | null;
  onSelect: (asin: string) => void;
  className?: string;
}

// ── PropBar: matches categories-dropdown exactly (bg-zinc-200 track) ──────────

function PropBar({ pct }: { pct: number }) {
  return (
    <div className="h-0.5 w-20 shrink-0 overflow-hidden rounded-full bg-zinc-200">
      <div
        className="h-full rounded-full bg-brand-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── SkusDropdown ──────────────────────────────────────────────────────────────
// Structure mirrors CategoriesDropdown exactly:
//  1. Title row (category name + gap totals) — top of popup, no border
//  2. DropdownHeader (Achieved/Target + progress bar) — shared component
//  3. SKU rows (scrollable list)

export function SkusDropdown({
  skus,
  categoryName,
  categoryGapDollar,
  categoryGapUnits,
  achievedSales,
  targetSales,
  selectedAsin,
  onSelect,
  className,
}: SkusDropdownProps) {
  const maxGap = Math.max(...skus.map((s) => Math.abs(s.gapDollar)));

  return (
    <div
      className={cn(
        "absolute left-0 top-full z-50 mt-1 w-[560px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg",
        className,
      )}
    >
      {/* 1. Title row — category name + gap totals, no border-b (matches categories) */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-semibold text-zinc-800">{categoryName}</span>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-rose-500">
            {formatGapDollar(categoryGapDollar)}
          </span>
          <span className="text-sm text-zinc-700">
            {formatGapUnits(categoryGapUnits)}
          </span>
        </div>
      </div>

      {/* 2. Shared header — category-level Achieved/Target + progress bar */}
      <DropdownHeader achievedSales={achievedSales} targetSales={targetSales} />

      {/* 3. SKU rows (scrollable) */}
      <div className="max-h-[400px] overflow-y-auto px-2 py-2">
        {skus.map((sku) => {
          const barPct = (Math.abs(sku.gapDollar) / maxGap) * 100;
          const hasIssues = sku.issueCount > 0;

          return (
            <button
              key={sku.asin}
              onClick={() => onSelect(sku.asin)}
              className={cn(
                "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                !hasIssues && "opacity-60",
                selectedAsin === sku.asin ? "bg-violet-50" : "hover:bg-zinc-50",
              )}
            >
              {/* Line 1: thumbnail | name | proportional bar | gap $ | units */}
              <div className="flex items-center gap-3">
                <img
                  src="https://placehold.co/32x32"
                  alt={sku.name}
                  className="h-8 w-8 shrink-0 rounded-md object-cover"
                />
                <span className="flex-1 truncate text-sm font-medium text-zinc-700">
                  {sku.name}
                </span>
                <PropBar pct={barPct} />
                <span className="w-14 shrink-0 text-right text-sm font-normal text-rose-500">
                  {formatGapDollar(sku.gapDollar)}
                </span>
                <span className="w-20 shrink-0 text-right text-sm text-zinc-700">
                  {formatGapUnits(sku.gapUnits)}
                </span>
              </div>

              {/* Line 2: ASIN + issues badge (mirrors categories "issues badge" row) */}
              <div className="mt-1.5 flex items-center gap-2 pl-11">
                <span className="text-xs text-zinc-400">{sku.asin}</span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                    hasIssues
                      ? "bg-zinc-100 text-zinc-600"
                      : "bg-zinc-100 text-zinc-400",
                  )}
                >
                  {sku.issueCount} Issues
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
