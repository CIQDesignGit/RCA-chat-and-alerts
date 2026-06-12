"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BrandInsightsTabsV2 } from "@/components/home/brand-insights-tabs-v2";
import { BRANDS } from "@/components/home/brands-data";

// ─── Inner — needs useSearchParams so wrapped in Suspense below ───────────────

function CategoriesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read ?brand= from URL to pre-select tab (set by home page "View all" click)
  const initialBrand = searchParams.get("brand");

  // "X issues" on a category row → navigate to /alerts with brand + category filters
  function handleViewCategory(brandName: string, categoryName: string) {
    router.push(
      `/alerts?brand=${encodeURIComponent(brandName)}&category=${encodeURIComponent(categoryName)}`,
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mx-auto flex h-full w-full max-w-[920px] flex-col gap-4 overflow-hidden px-8 py-4">

        {/* Page header — stays fixed at the top */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-slate-900">All Categories</h1>
            <p className="text-xs text-slate-500">Click any issue count to view alerts for that category</p>
          </div>
        </div>

        {/* Brand tabs fill remaining height — tab bar is sticky, list scrolls */}
        <div className="min-h-0 flex-1">
          <BrandInsightsTabsV2
            brands={BRANDS}
            onViewCategory={handleViewCategory}
            activeBrandName={initialBrand ?? BRANDS[0]?.name ?? null}
            fillHeight
          />
        </div>

      </div>
    </div>
  );
}

// ─── Page export — Suspense required for useSearchParams ─────────────────────

export default function CategoriesPage() {
  return (
    <Suspense fallback={null}>
      <CategoriesPageInner />
    </Suspense>
  );
}
