"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUp } from "lucide-react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
} from "@/components/ui/prompt-input";
import { CategoryNavList } from "@/components/strategy/category-nav-list";
import { CategoryDetailPanel } from "@/components/strategy/category-detail-panel";
import { BRANDS } from "@/components/home/brands-data";
import type { CategoryMetrics } from "@/components/home/category-insight-accordion";

// ─── Inner — needs useSearchParams, wrapped in Suspense below ─────────────

function CategoriesPageInner() {
  const searchParams = useSearchParams();

  // Pre-select the brand passed from the home page "Open Strategy View" link
  const initialBrandName = searchParams.get("brand") ?? BRANDS[0]?.name ?? "";
  const initialBrand = BRANDS.find((b) => b.name === initialBrandName) ?? BRANDS[0];

  const [activeBrandName, setActiveBrandName] = useState(initialBrandName);
  const [activeCategory, setActiveCategory] = useState<CategoryMetrics>(
    initialBrand.categories[0],
  );

  // Chat bar state
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeBrand = BRANDS.find((b) => b.name === activeBrandName) ?? BRANDS[0];

  // Switching brands resets the selected category to the first (worst-gap) one
  function handleBrandChange(name: string) {
    setActiveBrandName(name);
    const brand = BRANDS.find((b) => b.name === name);
    if (brand) setActiveCategory(brand.categories[0]);
  }

  function handleSend() {
    const content = chatInput.trim();
    if (!content || isLoading) return;
    // TODO: wire to chat store / AllyAI session for the selected category
    setIsLoading(true);
    setTimeout(() => {
      setChatInput("");
      setIsLoading(false);
    }, 1200);
  }

  return (
    <div className="flex h-full overflow-hidden">

      {/* Left — Category navigation (brand switcher + ranked category list) */}
      <div className="w-[280px] shrink-0">
        <CategoryNavList
          brands={BRANDS}
          activeBrandName={activeBrandName}
          activeCategoryName={activeCategory.name}
          onBrandChange={handleBrandChange}
          onCategorySelect={setActiveCategory}
        />
      </div>

      {/* Right — flex-col: scrollable detail content + pinned chat bar */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-slate-50/60">

        {/* Scrollable detail area — extra bottom padding avoids chat bar overlap */}
        <div className="flex-1 overflow-y-auto pb-[84px]">
          <CategoryDetailPanel
            // key forces a full re-render + metric tab reset when the selection changes
            key={`${activeBrandName}-${activeCategory.name}`}
            category={activeCategory}
            brand={activeBrand}
          />
        </div>

        {/* Sticky chat bar — gradient fade blends with content above */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-slate-50 via-slate-50/95 to-transparent px-6 pb-5 pt-8">
          <PromptInput
            value={chatInput}
            onValueChange={setChatInput}
            isLoading={isLoading}
            onSubmit={handleSend}
            maxHeight={44}
            className="mx-auto flex w-full max-w-[800px] items-center rounded-full border-slate-200 bg-white shadow-md"
          >
            <PromptInputTextarea
              disableAutosize
              rows={1}
              placeholder={`Ask AllyAI about ${activeCategory.name}…`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="min-h-0 flex-1 py-1.5"
            />
            <PromptInputActions>
              <button
                type="button"
                onClick={handleSend}
                disabled={!chatInput.trim() || isLoading}
                aria-label="Send"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </PromptInputActions>
          </PromptInput>
        </div>

      </div>
    </div>
  );
}

// ─── Page export — Suspense required for useSearchParams ─────────────────

export default function CategoriesPage() {
  return (
    <Suspense fallback={null}>
      <CategoriesPageInner />
    </Suspense>
  );
}
