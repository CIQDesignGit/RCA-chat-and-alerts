"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Search } from "lucide-react";
import {
  ReadFilterGroup,
  BrandSummaryChip,
  SelectedFilterChip,
  DropdownTriggerChip,
  SkuListChip,
} from "./filter-chip";
import { BrandsDropdown } from "./brands-dropdown";
import { CategoriesDropdown } from "./categories-dropdown";
import { SkusDropdown } from "./skus-dropdown";
import {
  BRAND_DATA,
  CATEGORY_DATA,
  SKU_DATA,
  PORTFOLIO_SUMMARY,
} from "./filter-mock-data";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FilterState {
  unreadOnly: boolean;
  brand: string | null;
  category: string | null;
  sku: string | null; // ASIN of selected SKU
}

export type GroupBy = "category" | "date";

interface FilterBarProps {
  onFiltersChange: (filters: FilterState) => void;
  // Pre-populate filters from URL params (e.g. when navigating from the home page)
  initialFilters?: Partial<FilterState>;
  // Override the back button action — defaults to router.push("/")
  onBack?: () => void;
  // Controls visibility — animates height so there's no layout jump
  isExpanded?: boolean;
  // Show the back button — hidden by default; enable only if explicit back-nav is needed
  showBackButton?: boolean;
  // Group by control
  groupBy?: GroupBy;
  onGroupByChange?: (groupBy: GroupBy) => void;
}

// ── FilterBar ─────────────────────────────────────────────────────────────────

export function FilterBar({ onFiltersChange, initialFilters, onBack, isExpanded = true, showBackButton = false, groupBy = "category", onGroupByChange }: FilterBarProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    unreadOnly: false,
    brand: null,
    category: null,
    sku: null,
    ...initialFilters,
  });
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSkusOpen, setIsSkusOpen] = useState(false);

  const brandsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const skusRef = useRef<HTMLDivElement>(null);

  // Sync brand/category when parent drives a filter change (e.g. "View all X" click).
  // FilterBar is always in the DOM now, so useState initializer only runs once —
  // we need this effect to pick up changes pushed from outside.
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      brand: initialFilters?.brand ?? null,
      category: initialFilters?.category ?? null,
      sku: null,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters?.brand, initialFilters?.category]);

  // Close all dropdowns on click outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      const pairs: [React.RefObject<HTMLDivElement | null>, (v: boolean) => void][] = [
        [brandsRef, setIsBrandsOpen],
        [categoriesRef, setIsCategoriesOpen],
        [skusRef, setIsSkusOpen],
      ];
      pairs.forEach(([ref, setter]) => {
        if (ref.current && !ref.current.contains(e.target as Node)) setter(false);
      });
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function applyFilters(patch: Partial<FilterState>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    onFiltersChange(next);
  }

  // Derived data for each drill-down level
  const selectedBrand = BRAND_DATA.find((b) => b.name === filters.brand);
  const categoryOptions = filters.brand ? (CATEGORY_DATA[filters.brand] ?? []) : [];
  const selectedCategory = categoryOptions.find((c) => c.name === filters.category);
  const skuOptions = filters.category ? (SKU_DATA[filters.category] ?? []) : [];
  const selectedSku = skuOptions.find((s) => s.asin === filters.sku);

  const hasActiveFilters = !!(filters.brand || filters.category || filters.sku || filters.unreadOnly);

  function clearAllFilters() {
    const cleared: FilterState = { unreadOnly: false, brand: null, category: null, sku: null };
    setFilters(cleared);
    onFiltersChange(cleared);
    setIsBrandsOpen(false);
    setIsCategoriesOpen(false);
    setIsSkusOpen(false);
  }

  return (
    // Outer wrapper animates height so the bar slides in/out without a layout jump.
    // max-h must exceed the bar's real height (~56px); 64px gives a safe margin.
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        // overflow-hidden is required for the collapse animation to clip the height.
        // Once fully open, switch to overflow-visible so dropdowns aren't clipped.
        isExpanded ? "overflow-visible" : "overflow-hidden",
      )}
      style={{ maxHeight: isExpanded ? "64px" : "0px" }}
    >
    <div className="flex items-center gap-2 border-b bg-white px-4 py-3">
      {/* Back button — only shown when explicitly enabled (e.g. standalone /alerts page) */}
      {showBackButton && (
        <button
          onClick={() => (onBack ? onBack() : router.push("/"))}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}

      {/* Search icon button */}
      <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
        <Search className="h-4 w-4" />
      </button>

      {/* All / Unread tab toggle */}
      <ReadFilterGroup
        showUnreadOnly={filters.unreadOnly}
        onToggle={(unreadOnly) => applyFilters({ unreadOnly })}
      />

      {/* ── Brand filter ──────────────────────────────────────────────────── */}
      <div className="relative" ref={brandsRef}>
        {filters.brand ? (
          <SelectedFilterChip
            label={filters.brand}
            onRemove={() => applyFilters({ brand: null, category: null, sku: null })}
            gapDollar={selectedBrand?.gapDollar}
            gapUnits={selectedBrand?.gapUnits}
          />
        ) : (
          <BrandSummaryChip
            totalGapDollar={PORTFOLIO_SUMMARY.totalGapDollar}
            totalGapUnits={PORTFOLIO_SUMMARY.totalGapUnits}
            onClick={() => setIsBrandsOpen((p) => !p)}
            isOpen={isBrandsOpen}
          />
        )}
        {isBrandsOpen && (
          <BrandsDropdown
            brands={BRAND_DATA}
            achievedSales={PORTFOLIO_SUMMARY.achievedSales}
            targetSales={PORTFOLIO_SUMMARY.targetSales}
            selectedBrand={filters.brand}
            onSelect={(brand) => {
              applyFilters({ brand, category: null, sku: null });
              setIsBrandsOpen(false);
            }}
          />
        )}
      </div>

      {/* ── Category filter — visible once a brand is selected ────────────── */}
      {filters.brand && (
        <div className="relative" ref={categoriesRef}>
          {filters.category ? (
            <SelectedFilterChip
              label={filters.category}
              onRemove={() => applyFilters({ category: null, sku: null })}
              gapDollar={selectedCategory?.gapDollar}
              gapUnits={selectedCategory?.gapUnits}
            />
          ) : (
            <DropdownTriggerChip
              label="All Categories"
              onClick={() => setIsCategoriesOpen((p) => !p)}
              isOpen={isCategoriesOpen}
            />
          )}
          {isCategoriesOpen && (
            <CategoriesDropdown
              categories={categoryOptions}
              achievedSales={selectedBrand?.achievedSales ?? 0}
              targetSales={selectedBrand?.targetSales ?? 0}
              selectedCategory={filters.category}
              onSelect={(cat) => {
                applyFilters({ category: cat, sku: null });
                setIsCategoriesOpen(false);
              }}
            />
          )}
        </div>
      )}

      {/* ── SKU filter — visible once a category is selected ─────────────── */}
      {filters.category && (
        <div className="relative" ref={skusRef}>
          {filters.sku ? (
            <SelectedFilterChip
              label={filters.sku}
              onRemove={() => applyFilters({ sku: null })}
              gapDollar={selectedSku?.gapDollar}
              gapUnits={selectedSku?.gapUnits}
            />
          ) : (
            <SkuListChip
              count={skuOptions.length}
              onClick={() => setIsSkusOpen((p) => !p)}
              isOpen={isSkusOpen}
            />
          )}
          {isSkusOpen && (
            <SkusDropdown
              skus={skuOptions}
              categoryName={filters.category}
              categoryGapDollar={selectedCategory?.gapDollar ?? 0}
              categoryGapUnits={selectedCategory?.gapUnits ?? 0}
              achievedSales={selectedCategory?.achievedSales ?? 0}
              targetSales={selectedCategory?.targetSales ?? 0}
              selectedAsin={filters.sku}
              onSelect={(asin) => {
                applyFilters({ sku: asin });
                setIsSkusOpen(false);
              }}
            />
          )}
        </div>
      )}

      {/* Clear filters — only visible when filters are active */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="shrink-0 text-xs font-medium text-slate-400 transition-colors hover:text-slate-700"
        >
          Clear filters
        </button>
      )}

      {/* ── Group by dropdown — pinned to the right edge ──────────────────── */}
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <span className="text-xs text-slate-400">Group by</span>
        <select
          value={groupBy}
          onChange={(e) => onGroupByChange?.(e.target.value as GroupBy)}
          className="w-auto cursor-pointer bg-transparent py-0.5 text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="category">Category</option>
          <option value="date">Date</option>
        </select>
      </div>
    </div>
    </div>
  );
}
