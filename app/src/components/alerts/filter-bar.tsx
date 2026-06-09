"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Award,
  Check,
  ChevronDown,
  DollarSign,
  Funnel,
  List,
  Loader2,
  Megaphone,
  MessageSquareWarning,
  Package,
  PieChart,
  Search,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  ReadFilterGroup,
  BrandSummaryChip,
  LoadingChip,
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
}

// ── Issue type options — grouped to match Root causes accordion ───────────────

type IssueTypeOption = {
  id: string | null;
  label: string;
  icon?: LucideIcon;
  count?: number;
  /** false = shown in list but cannot be selected as a filter yet */
  filterable?: boolean;
};

type IssueTypeGroup = {
  label: string;
  options: IssueTypeOption[];
};

const ALL_ISSUES_OPTION: IssueTypeOption = {
  id: null,
  label: "All Issues",
  icon: List,
  count: 47,
};

const ISSUE_TYPE_GROUPS: IssueTypeGroup[] = [
  {
    label: "PDP & Promos",
    options: [
      { id: "lbb",    label: "Buy Box",              icon: ShoppingCart, count: 6 },
      { id: "promo",  label: "Promo Badge",          icon: Megaphone,    count: 9 },
      { id: "deals",  label: "Deal Page Visibility", icon: ShoppingBag,  count: 4 },
      { id: "coupon", label: "Coupon",               icon: Tag,          count: 3 },
    ],
  },
  {
    label: "Product Reputation",
    options: [
      { id: "bsr",       label: "Best Seller Rank",  icon: Award,                count: 5 },
      { id: "rating",    label: "Rating",            icon: Star,                 count: 7 },
      { id: "sentiment", label: "Review Sentiment",  icon: MessageSquareWarning, count: 4 },
    ],
  },
  {
    label: "Fulfilment",
    options: [
      { id: "oos",      label: "Out of Stock",   icon: Package, count: 2, filterable: false },
      { id: "shipping", label: "Shipping Speed", icon: Truck,   count: 3, filterable: false },
    ],
  },
  {
    label: "Search & Traffic",
    options: [
      { id: "sov",        label: "Share of Voice", icon: PieChart,  count: 2 },
      { id: "krd",        label: "Keyword Rank",   icon: Shield,    count: 1 },
      { id: "conversion", label: "Conversion",     icon: Funnel,    count: 2 },
      { id: "media",      label: "Media Spend",    icon: DollarSign,count: 1 },
    ],
  },
];

// Flat list — used for selected/loading label lookups
const ISSUE_TYPE_OPTIONS: IssueTypeOption[] = [
  ALL_ISSUES_OPTION,
  ...ISSUE_TYPE_GROUPS.flatMap((g) => g.options),
];

function findIssueTypeOption(id: string | null): IssueTypeOption | undefined {
  return ISSUE_TYPE_OPTIONS.find((o) => o.id === id);
}

function IssueTypeOptionButton({
  option,
  isSelected,
  onSelect,
}: {
  option: IssueTypeOption;
  isSelected: boolean;
  onSelect: (option: IssueTypeOption) => void;
}) {
  const Icon = option.icon;
  const isFilterable = option.filterable !== false;

  const row = (
    <>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center",
          isFilterable ? "text-slate-400" : "text-slate-300",
        )}
      >
        {Icon && <Icon className="h-3.5 w-3.5" />}
      </span>
      <span className="flex items-center gap-1">
        <span>{option.label}</span>
        {option.count !== undefined && (
          <span className={cn("text-xs", isFilterable ? "text-slate-500" : "text-slate-400")}>
            ({option.count})
          </span>
        )}
      </span>
      <span className="flex-1" />
      {isFilterable && isSelected && (
        <Check className="h-3.5 w-3.5 shrink-0 text-brand-500" />
      )}
    </>
  );

  if (!isFilterable) {
    return (
      <div
        role="presentation"
        className="flex w-full cursor-default items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-400 opacity-60"
      >
        {row}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      className={cn(
        "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50",
        isSelected ? "text-brand-600" : "text-slate-700",
      )}
    >
      {row}
    </button>
  );
}

// ── FilterBar ─────────────────────────────────────────────────────────────────

export function FilterBar({ onFiltersChange, initialFilters, onBack, isExpanded = true, showBackButton = false }: FilterBarProps) {
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
  const [isIssueTypeOpen, setIsIssueTypeOpen] = useState(false);
  const [selectedIssueType, setSelectedIssueType] = useState<string | null>(null);
  const [isIssueTypeLoading, setIsIssueTypeLoading] = useState(false);
  // Tracks the pending selection while the 2-sec loading simulation runs
  const [pendingIssueType, setPendingIssueType] = useState<string | null | undefined>(undefined);

  // Loading states for brand / category / sku filters
  const [loadingFilter, setLoadingFilter] = useState<"brand" | "category" | "sku" | null>(null);
  const [pendingFilterLabel, setPendingFilterLabel] = useState<string | null>(null);

  const brandsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const skusRef = useRef<HTMLDivElement>(null);
  const issueTypeRef = useRef<HTMLDivElement>(null);

  // Shared close timer — gives a 150ms grace period when the mouse crosses the
  // gap between the trigger chip and the dropdown panel, preventing premature closes.
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openDropdown(setter: (v: boolean) => void) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    // Close all other dropdowns before opening this one
    [setIsBrandsOpen, setIsCategoriesOpen, setIsSkusOpen, setIsIssueTypeOpen].forEach(
      (s) => s !== setter && s(false),
    );
    setter(true);
  }

  function scheduleClose(setter: (v: boolean) => void) {
    closeTimerRef.current = setTimeout(() => setter(false), 150);
  }

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
        [issueTypeRef, setIsIssueTypeOpen],
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

  // Runs a filter change after a 2-second simulated delay, showing a spinner chip
  function applyFilterDelayed(
    filterKey: "brand" | "category" | "sku",
    label: string,
    patch: Partial<FilterState>,
  ) {
    setLoadingFilter(filterKey);
    setPendingFilterLabel(label);
    setTimeout(() => {
      applyFilters(patch);
      setLoadingFilter(null);
      setPendingFilterLabel(null);
    }, 2000);
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
    <div className="flex items-center gap-2 border-b bg-white px-4 py-2">
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

      {/* ── Issue type filter ─────────────────────────────────────────────── */}
      <div className="relative" ref={issueTypeRef} onMouseEnter={() => openDropdown(setIsIssueTypeOpen)} onMouseLeave={() => scheduleClose(setIsIssueTypeOpen)}>
        {/* Loading state — shown while the 2-sec simulation runs */}
        {isIssueTypeLoading ? (
          <button
            disabled
            className="flex items-center gap-1.5 rounded-md border border-brand-300 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700 opacity-80"
          >
            {findIssueTypeOption(pendingIssueType ?? null)?.label ?? "All Issues"}
            <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" />
          </button>
        ) : selectedIssueType ? (
          /* Selected state: clicking label reopens dropdown, X clears */
          <span className="flex items-center gap-1.5 rounded-md border border-brand-300 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
            <button
              onClick={() => setIsIssueTypeOpen((p) => !p)}
              className="text-brand-700 hover:text-brand-800"
            >
              {findIssueTypeOption(selectedIssueType)?.label}
            </button>
            <button
              onClick={() => {
                setSelectedIssueType(null);
                setIsIssueTypeLoading(false);
                setPendingIssueType(undefined);
              }}
              aria-label="Clear issue type filter"
              className="flex h-4 w-4 items-center justify-center rounded-full border border-brand-300 text-brand-400 transition-colors hover:border-brand-400 hover:bg-brand-200 hover:text-brand-700"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ) : (
          /* Default state — "All Issues" trigger chip — matches DropdownTriggerChip style */
          <button
            onClick={() => setIsIssueTypeOpen((p) => !p)}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors",
              isIssueTypeOpen
                ? "border-brand-300 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            All Issues
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isIssueTypeOpen && "rotate-180")} />
          </button>
        )}

        {/* Dropdown panel */}
        {isIssueTypeOpen && (
          <div className="absolute left-0 top-10 z-50 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <IssueTypeOptionButton
              option={ALL_ISSUES_OPTION}
              isSelected={selectedIssueType === null}
              onSelect={() => {
                setIsIssueTypeOpen(false);
                setSelectedIssueType(null);
                setIsIssueTypeLoading(false);
                setPendingIssueType(undefined);
              }}
            />

            {ISSUE_TYPE_GROUPS.map((group) => (
              <div key={group.label} className="border-t border-slate-200">
                <div className="bg-slate-50 px-4 pb-1.5 pt-1">
                  <span className="text-xs font-semibold tracking-wide text-slate-600">
                    {group.label}
                  </span>
                </div>
                {group.options.map((option) => (
                  <IssueTypeOptionButton
                    key={option.id}
                    option={option}
                    isSelected={option.id === selectedIssueType}
                    onSelect={(opt) => {
                      setIsIssueTypeOpen(false);
                      if (opt.id === selectedIssueType) {
                        setSelectedIssueType(null);
                        return;
                      }
                      if (opt.id === null) {
                        setSelectedIssueType(null);
                        return;
                      }
                      setPendingIssueType(opt.id);
                      setIsIssueTypeLoading(true);
                      setTimeout(() => {
                        setSelectedIssueType(opt.id);
                        setIsIssueTypeLoading(false);
                        setPendingIssueType(undefined);
                      }, 2000);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Brand filter ──────────────────────────────────────────────────── */}
      <div className="relative" ref={brandsRef} onMouseEnter={() => openDropdown(setIsBrandsOpen)} onMouseLeave={() => scheduleClose(setIsBrandsOpen)}>
        {loadingFilter === "brand" ? (
          <LoadingChip label={pendingFilterLabel ?? "Brand"} />
        ) : filters.brand ? (
          <SelectedFilterChip
            label={filters.brand}
            onClick={() => setIsBrandsOpen((p) => !p)}
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
              if (brand === filters.brand) {
                // Clicking the already-selected brand deselects it —
                // clear immediately and keep dropdown open so user can pick another
                applyFilters({ brand: null, category: null, sku: null });
              } else {
                // New brand selected — close dropdown and apply with delay
                setIsBrandsOpen(false);
                applyFilterDelayed("brand", brand, { brand, category: null, sku: null });
              }
            }}
          />
        )}
      </div>

      {/* ── Category filter — visible once a brand is selected ────────────── */}
      {filters.brand && (
        <div className="relative" ref={categoriesRef} onMouseEnter={() => openDropdown(setIsCategoriesOpen)} onMouseLeave={() => scheduleClose(setIsCategoriesOpen)}>
          {loadingFilter === "category" ? (
            <LoadingChip label={pendingFilterLabel ?? "Category"} />
          ) : filters.category ? (
            <SelectedFilterChip
              label={filters.category}
              onClick={() => setIsCategoriesOpen((p) => !p)}
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
                setIsCategoriesOpen(false);
                applyFilterDelayed("category", cat, { category: cat, sku: null });
              }}
            />
          )}
        </div>
      )}

      {/* ── SKU filter — visible once a category is selected ─────────────── */}
      {filters.category && (
        <div className="relative" ref={skusRef} onMouseEnter={() => openDropdown(setIsSkusOpen)} onMouseLeave={() => scheduleClose(setIsSkusOpen)}>
          {loadingFilter === "sku" ? (
            <LoadingChip label={pendingFilterLabel ?? "SKU"} />
          ) : filters.sku ? (
            <SelectedFilterChip
              label={filters.sku}
              onClick={() => setIsSkusOpen((p) => !p)}
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
                setIsSkusOpen(false);
                applyFilterDelayed("sku", asin, { sku: asin });
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
          Clear
        </button>
      )}

    </div>
    </div>
  );
}
