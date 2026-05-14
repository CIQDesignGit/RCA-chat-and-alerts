"use client";

import { X, ChevronDown, Box } from "lucide-react";
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

// ── ReadFilterGroup: "All" (dark-filled active) / "Unread" (outlined) ─────────
// These work as a mutually exclusive tab toggle.

interface ReadFilterGroupProps {
  showUnreadOnly: boolean;
  onToggle: (unreadOnly: boolean) => void;
}

export function ReadFilterGroup({ showUnreadOnly, onToggle }: ReadFilterGroupProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onToggle(false)}
        className={cn(
          "rounded-md px-2.5 py-1 text-sm font-semibold transition-colors",
          !showUnreadOnly
            ? "bg-brand-50 text-brand-500"
            : "text-zinc-400 hover:text-zinc-600",
        )}
      >
        All
      </button>

      <button
        onClick={() => onToggle(true)}
        className={cn(
          "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
          showUnreadOnly
            ? "bg-brand-50 text-brand-500"
            : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50",
        )}
      >
        Unread
      </button>
    </div>
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
          ? "border-zinc-400 bg-zinc-50"
          : "border-zinc-200 bg-white hover:bg-zinc-50",
      )}
    >
      <span className="font-medium text-zinc-600">All Brands</span>
      {/* Vertical divider */}
      <span className="h-3.5 w-px bg-zinc-200" />
      <span className="font-semibold text-rose-500">
        {formatGapDollar(totalGapDollar)}
      </span>
      <span className="font-medium text-zinc-500">
        {formatGapUnits(totalGapUnits)}
      </span>
      <ChevronDown
        className={cn(
          "h-4 w-4 text-zinc-400 transition-transform duration-150",
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
  gapDollar?: number;
  gapUnits?: number;
}

export function SelectedFilterChip({
  label,
  onRemove,
  gapDollar,
  gapUnits,
}: SelectedFilterChipProps) {
  const showGap = gapDollar !== undefined && gapUnits !== undefined;

  return (
    <span className="flex items-center gap-1.5 rounded-md bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
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
          ? "border-zinc-400 bg-zinc-50 text-zinc-700"
          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50",
      )}
    >
      {label}
      <ChevronDown
        className={cn(
          "h-4 w-4 text-zinc-400 transition-transform duration-150",
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
          ? "border-zinc-400 bg-zinc-50 text-zinc-700"
          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50",
      )}
    >
      <Box className="h-3.5 w-3.5 text-zinc-400" />
      SKU List ({count})
      <ChevronDown
        className={cn(
          "h-4 w-4 text-zinc-400 transition-transform duration-150",
          isOpen && "rotate-180",
        )}
      />
    </button>
  );
}
