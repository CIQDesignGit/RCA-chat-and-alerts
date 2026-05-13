"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
} from "@/components/ui/prompt-input";
import { AlertsPanel, type SkuAlert } from "@/components/home/alerts-panel";
import { BusinessLevelInsights } from "@/components/home/business-level-insights";
import { SkuDetail } from "@/components/sku/sku-detail";

// Suggestion chips — real ecommerce questions an Ecommerce Manager would ask AllyAI
const SUGGESTIONS = [
  "Conduct brand and category level performance breakdown for this week?",
  "How is my total business performing this week vs. last week across all channels?",
  "How much of my total brand sales is driven by advertising?",
];

export default function HomePage() {
  const [input, setInput] = useState("");
  // null = show home overview; SkuAlert = show SKU detail view
  const [selectedSku, setSelectedSku] = useState<SkuAlert | null>(null);

  // When the user clicks a suggestion chip, fill the input with that text
  const handleSuggestion = (text: string) => setInput(text);

  // Pressing Enter submits (placeholder — wire to real API later)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // TODO: navigate to /chat and send this message
    }
  };

  return (
    <div className="flex h-full">
      {/* Left: Today's Alerts panel — always visible */}
      <AlertsPanel onSkuSelect={setSelectedSku} />

      {/* Right: switches between home overview and SKU detail */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedSku ? (
          // ── SKU detail view ──────────────────────────────────────────────
          <SkuDetail sku={selectedSku} onBack={() => setSelectedSku(null)} />
        ) : (
          // ── Home overview — no scroll, fits the viewport ─────────────────
          <div className="flex h-full flex-col justify-between px-8 py-5">

            {/* Top: greeting + business insights */}
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                Good Morning, Steve
              </h1>
              <BusinessLevelInsights />
            </div>

            {/* Bottom: suggestion chips (row) + chat input */}
            <div className="flex flex-col gap-3">
              {/* Chips wrap into a row so they use horizontal space */}
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="rounded-full border bg-background px-3 py-1.5 text-xs text-neutral-600 shadow-xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <PromptInput
                value={input}
                onValueChange={setInput}
                isLoading={false}
                onSubmit={() => {}}
                className="w-full bg-background shadow-sm"
              >
                <PromptInputTextarea
                  placeholder="Ask AllyAI — e.g. What were my sales last week?"
                  onKeyDown={handleKeyDown}
                  className="min-h-[44px]"
                />
                <PromptInputActions className="justify-end">
                  <button
                    type="button"
                    onClick={() => {}}
                    disabled={!input.trim()}
                    aria-label="Send message"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-opacity disabled:opacity-40 hover:opacity-90"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </PromptInputActions>
              </PromptInput>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
