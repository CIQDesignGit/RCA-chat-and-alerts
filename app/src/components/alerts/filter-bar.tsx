"use client";

import { useRef, useEffect, useState } from "react";
import { Search } from "lucide-react";
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

interface FilterBarProps {
  onFiltersChange: (filters: FilterState) => void;
}

// ── FilterBar ─────────────────────────────────────────────────────────────────

export function FilterBar({ onFiltersChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    unreadOnly: false,
    brand: null,
    category: null,
    sku: null,
  });
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSkusOpen, setIsSkusOpen] = useState(false);

  const brandsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const skusRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex items-center gap-2 border-b bg-white px-4 py-3">
      {/* Search icon button */}
      <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50">
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
    </div>
  );
}
