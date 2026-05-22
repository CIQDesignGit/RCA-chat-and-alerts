"use client";

import { X, ChevronDown, Box, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Shared format helpers (exported so brands-dropdown can reuse them) ─────────

export function formatGapDollar(value: number): string {
  const sign = value < 0 ? "-" : "+";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`;
  return `${sign}$${abs}`;
}

export function formatGapUnits(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "+";
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}k units`;
  return `${sign}${abs} units`;
}

// ── LoadingChip: spinner placeholder shown while a filter is applying ─────────

interface LoadingChipProps {
  label: string;
}

export function LoadingChip({ label }: LoadingChipProps) {
  return (
    <span className="flex items-center gap-1.5 rounded-md border border-brand-300 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700 opacity-80">
      {label}
      <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" />
    </span>
  );
}

// ── ReadFilterGroup: single "Unread" toggle — active = unread only, inactive = all ──

interface ReadFilterGroupProps {
  showUnreadOnly: boolean;
  onToggle: (unreadOnly: boolean) => void;
}

export function ReadFilterGroup({ showUnreadOnly, onToggle }: ReadFilterGroupProps) {
  return (
    <button
      onClick={() => onToggle(!showUnreadOnly)}
      className={cn(
        "rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
        showUnreadOnly
          ? "bg-brand-50 text-brand-500"
          : "border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700",
      )}
    >
      Unread
    </button>
  );
}

// ── BrandSummaryChip: "All Brands  -$650K  -1.2k units  ▾" ──────────────────
// The compound pill shown when NO brand is selected. Clicking opens the dropdown.

interface BrandSummaryChipProps {
  totalGapDollar: number;
  totalGapUnits: number;
  onClick: () => void;
  isOpen?: boolean;
}

export function BrandSummaryChip({
  totalGapDollar,
  totalGapUnits,
  onClick,
  isOpen,
}: BrandSummaryChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-sm transition-colors",
        isOpen
          ? "border-slate-400 bg-slate-50"
          : "border-slate-200 bg-white hover:bg-slate-50",
      )}
    >
      <span className="font-medium text-slate-600">All Brands</span>
      {/* Vertical divider */}
      <span className="h-3.5 w-px bg-slate-200" />
      <span className="font-semibold text-rose-500">
        {formatGapDollar(totalGapDollar)}
      </span>
      <span className="font-medium text-slate-500">
        {formatGapUnits(totalGapUnits)}
      </span>
      <ChevronDown
        className={cn(
          "h-4 w-4 text-slate-400 transition-transform duration-150",
          isOpen && "rotate-180",
        )}
      />
    </button>
  );
}

// ── SelectedFilterChip: "Shark | -$200K -480 units ×" ───────────────────────
// Brand-filled chip for active brand / category / SKU filters.
// Pass gapDollar + gapUnits to show the gap inline after a divider.

interface SelectedFilterChipProps {
  label: string;
  onRemove: () => void;
  onClick?: () => void;
  gapDollar?: number;
  gapUnits?: number;
}

export function SelectedFilterChip({
  label,
  onRemove,
  onClick,
  gapDollar,
  gapUnits,
}: SelectedFilterChipProps) {
  const showGap = gapDollar !== undefined && gapUnits !== undefined;

  return (
    <span className="flex items-center gap-1.5 rounded-md bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
      {/* Clicking the label area reopens the dropdown */}
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 text-brand-700 hover:text-brand-800"
      >
        {label}

        {showGap && (
          <>
            <span className="h-3.5 w-px bg-brand-200" />
            <span className="font-normal text-rose-500">
              {formatGapDollar(gapDollar!)}
            </span>
            <span className="font-normal text-text-tertiary">
              {formatGapUnits(gapUnits!)}
            </span>
          </>
        )}
      </button>

      {/* X clears the filter */}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-brand-300 text-brand-400 transition-colors hover:border-brand-400 hover:bg-brand-200 hover:text-brand-700"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}

// ── DropdownTriggerChip: "All Categories ▾" — outlined pill with chevron ──────
// Shown after a brand is selected, triggers the category picker.

interface DropdownTriggerChipProps {
  label: string;
  onClick: () => void;
  isOpen?: boolean;
}

export function DropdownTriggerChip({
  label,
  onClick,
  isOpen,
}: DropdownTriggerChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors",
        isOpen
          ? "border-slate-400 bg-slate-50 text-slate-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      )}
    >
      {label}
      <ChevronDown
        className={cn(
          "h-4 w-4 text-slate-400 transition-transform duration-150",
          isOpen && "rotate-180",
        )}
      />
    </button>
  );
}

// ── SkuListChip: "⬡ SKU List (16) ▾" — outlined pill with Box icon ───────────
// Appears after a category is selected. The count shows how many SKUs are in
// the selected category.

interface SkuListChipProps {
  count: number;
  onClick: () => void;
  isOpen?: boolean;
}

export function SkuListChip({ count, onClick, isOpen }: SkuListChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors",
        isOpen
          ? "border-slate-400 bg-slate-50 text-slate-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      )}
    >
      <Box className="h-3.5 w-3.5 text-slate-400" />
      SKU List ({count})
      <ChevronDown
        className={cn(
          "h-4 w-4 text-slate-400 transition-transform duration-150",
          isOpen && "rotate-180",
        )}
      />
    </button>
  );
}
