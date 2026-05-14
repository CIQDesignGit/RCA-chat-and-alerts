"use client";

import { cn } from "@/lib/utils";
import { formatGapDollar, formatGapUnits } from "./filter-chip";
import { DropdownHeader } from "./dropdown-header";
import type { CategoryData } from "./filter-mock-data";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CategoriesDropdownProps {
  categories: CategoryData[];
  achievedSales: number; // brand-level achieved (shown in header)
  targetSales: number;   // brand-level target (shown in header)
  selectedCategory: string | null;
  onSelect: (category: string) => void;
  className?: string;
}

// ── PropBar: proportional fill bar used in each category row ──────────────────

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

// ── CategoriesDropdown ────────────────────────────────────────────────────────
// Opens from the "All Categories" chip. Shows:
//  - Header: brand-level Achieved/Target + progress bar
//  - "All Categories" summary row (non-clickable totals)
//  - Category rows sorted by gap descending (each has proportional bar + issues badge)

export function CategoriesDropdown({
  categories,
  achievedSales,
  targetSales,
  selectedCategory,
  onSelect,
  className,
}: CategoriesDropdownProps) {
  const maxGap = Math.max(...categories.map((c) => Math.abs(c.gapDollar)));
  const totalGapDollar = categories.reduce((s, c) => s + c.gapDollar, 0);
  const totalGapUnits = categories.reduce((s, c) => s + c.gapUnits, 0);

  return (
    <div
      className={cn(
        "absolute left-0 top-full z-50 mt-1 w-[520px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg",
        className,
      )}
    >
      {/* ── "All Categories" summary row — totals, non-clickable ─────────── */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-semibold text-zinc-800">All Categories</span>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-rose-500">
            {formatGapDollar(totalGapDollar)}
          </span>
          <span className="text-sm text-zinc-700">
            {formatGapUnits(totalGapUnits)}
          </span>
        </div>
      </div>

      {/* ── Header: brand-level Achieved vs Target ──────────────────────── */}
      <DropdownHeader achievedSales={achievedSales} targetSales={targetSales} />

      {/* ── Category rows ─────────────────────────────────────────────────── */}
      <div className="max-h-[400px] overflow-y-auto px-2 py-2">
        {categories.map((cat) => {
          const barPct = (Math.abs(cat.gapDollar) / maxGap) * 100;
          const isDimmed = cat.issueCount === 0;

          return (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name)}
              className={cn(
                "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                isDimmed && "opacity-60",
                selectedCategory === cat.name
                  ? "bg-brand-50"
                  : "hover:bg-zinc-50",
              )}
            >
              {/* Line 1: name | proportional bar | gap $ | units */}
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex-1 text-sm font-medium",
                    isDimmed ? "text-zinc-400" : "text-zinc-700",
                  )}
                >
                  {cat.name}
                </span>
                <PropBar pct={barPct} />
                <span className="w-16 shrink-0 text-right text-sm font-normal text-rose-500">
                  {formatGapDollar(cat.gapDollar)}
                </span>
                <span className="w-20 shrink-0 text-right text-sm text-zinc-700">
                  {formatGapUnits(cat.gapUnits)}
                </span>
              </div>

              {/* Line 2: issues badge */}
              <div className="mt-1.5">
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                    isDimmed
                      ? "bg-zinc-100 text-zinc-400"
                      : "bg-zinc-100 text-zinc-600",
                  )}
                >
                  {cat.issueCount} Issues
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
