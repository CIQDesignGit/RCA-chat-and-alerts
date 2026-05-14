"use client";

import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DropdownHeaderProps {
  achievedSales: number;
  targetSales: number;
  className?: string;
}

// ── Shared sales value formatter ───────────────────────────────────────────────
// Used by all dropdowns (brands, categories, skus) for consistent display.

export function formatSalesValue(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${Math.round(abs / 1_000)}K`;
  return `$${abs}`;
}

// ── DropdownHeader ─────────────────────────────────────────────────────────────
// Shared header used across all three filter dropdowns (brands, categories, SKUs).
// Shows achieved vs target sales + a proportional progress bar.

export function DropdownHeader({ achievedSales, targetSales, className }: DropdownHeaderProps) {
  const progressPct = Math.min(Math.round((achievedSales / targetSales) * 100), 100);

  return (
    <div className={cn("border-b border-slate-100 px-4 pt-4 pb-3", className)}>
      {/* Achieved / Target legend + values */}
      <div className="mb-2.5 flex items-end justify-between">
        {/* Left — Achieved */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            {/* Small filled square = achieved indicator (matches Figma legend) */}
            <span className="h-2 w-2 rounded-sm bg-brand-500 text-slate-600" />
            Achieved
          </div>
          <span className="text-xs font-bold text-slate-900">
            {formatSalesValue(achievedSales)}
          </span>
        </div>

        {/* Right — Target */}
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            {/* Small outlined square = target indicator */}
            <span className="h-2 w-2 rounded-sm border border-slate-300" />
            Target
            
          </div>
          <span className="text-xs font-bold text-slate-900">
            {formatSalesValue(targetSales)}
          </span>
        </div>
      </div>

      {/* Progress bar — inline style only for the dynamic width % */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
