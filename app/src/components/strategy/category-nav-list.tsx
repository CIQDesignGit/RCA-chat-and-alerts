"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrandData } from "@/components/home/brands-data";
import type { CategoryMetrics } from "@/components/home/category-insight-accordion";

// ── Formatters ─────────────────────────────────────────────────────────────

function fmtGap(v: number): string {
  const sign = v > 0 ? "+" : v < 0 ? "-" : "";
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`;
  if (abs === 0) return "$0";
  return `${sign}$${abs}`;
}

function gapColor(v: number): string {
  if (v < 0) return "text-rose-500";
  if (v > 0) return "text-emerald-600";
  return "text-slate-400";
}

// ── Props ──────────────────────────────────────────────────────────────────

interface CategoryNavListProps {
  brands: BrandData[];
  activeBrandName: string;
  activeCategoryName: string;
  onBrandChange: (name: string) => void;
  onCategorySelect: (category: CategoryMetrics) => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export function CategoryNavList({
  brands,
  activeBrandName,
  activeCategoryName,
  onBrandChange,
  onCategorySelect,
}: CategoryNavListProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  const activeBrand = brands.find((b) => b.name === activeBrandName) ?? brands[0];

  // Case-insensitive substring filter on category name
  const filteredCategories = query.trim()
    ? activeBrand.categories.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      )
    : activeBrand.categories;

  function openSearch() {
    setIsSearching(true);
    // Defer focus so the input is in the DOM first
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function closeSearch() {
    setIsSearching(false);
    setQuery("");
  }

  // Clicking a category row exits search mode for a clean slate on next open
  function handleCategorySelect(cat: CategoryMetrics) {
    closeSearch();
    onCategorySelect(cat);
  }

  // Switching brands also resets search
  function handleBrandChange(name: string) {
    closeSearch();
    onBrandChange(name);
  }

  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white">

      {/* Back to home */}
      <div className="shrink-0 border-b border-slate-100 px-3 py-1.5">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Home</span>
        </button>
      </div>

      {/* Brand switcher */}
      <div className="shrink-0 border-b border-slate-100 px-3 pb-3 pt-3">
        <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Brand
        </p>
        <div className="flex flex-col gap-0.5">
          {brands.map((brand) => {
            const isActive = brand.name === activeBrandName;
            return (
              <button
                key={brand.name}
                onClick={() => handleBrandChange(brand.name)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-left transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <span className={cn("text-sm", isActive ? "font-semibold" : "font-medium")}>
                  {brand.name}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold tabular-nums",
                    isActive ? gapColor(brand.gapDollar) : "text-slate-400",
                  )}
                >
                  {fmtGap(brand.gapDollar)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category list — ranked by gap (most negative first, per FR-004) */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header row: label + search toggle OR search input */}
        <div className="shrink-0 px-4 pb-1 pt-2">
          {isSearching ? (
            // ── Search input (active state) ──────────────────────────────
            <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
              <Search className="h-3 w-3 shrink-0 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                placeholder="Filter categories…"
                className="flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
              />
              {/* Clear / close button */}
              <button
                onClick={closeSearch}
                aria-label="Clear search"
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-slate-400 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            // ── Default label + search icon ──────────────────────────────
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                Categories
              </p>
              <button
                onClick={openSearch}
                aria-label="Search categories"
                className="flex h-10 w-10 items-center justify-center rounded text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <Search className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable category list */}
        <div className="flex-1 overflow-y-auto pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden">

          {filteredCategories.length === 0 ? (
            // ── Empty state ──────────────────────────────────────────────
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-slate-400">
                No categories match
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-600">
                &ldquo;{query}&rdquo;
              </p>
              <button
                onClick={closeSearch}
                className="mt-3 text-xs font-medium text-brand-600 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const isActive = cat.name === activeCategoryName;
              const progress = Math.min(
                Math.round((cat.achievedSales / cat.targetSales) * 100),
                100,
              );

              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat)}
                  className={cn(
                    "flex w-full flex-col gap-1.5 border-l-2 px-4 py-4 text-left transition-all",
                    isActive
                      ? "border-brand-500 bg-brand-50"
                      : "border-transparent hover:bg-slate-50",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium leading-tight",
                        isActive ? "font-semibold text-slate-900" : "text-slate-600",
                      )}
                    >
                      {cat.name}
                    </span>
                    <span className={cn("shrink-0 text-xs font-semibold tabular-nums", gapColor(cat.gapDollar))}>
                      {fmtGap(cat.gapDollar)}
                    </span>
                  </div>

                  <div className={cn("h-1 w-full overflow-hidden rounded-full", isActive ? "bg-brand-100" : "bg-slate-100")}>
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        isActive ? "bg-brand-400" : "bg-slate-300",
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </button>
              );
            })
          )}

        </div>
      </div>
    </div>
  );
}
