"use client";

import { useState } from "react";
import { ArrowLeft, ExternalLink, Tag, BarChart2, ArrowUp } from "lucide-react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
} from "@/components/ui/prompt-input";
import type { SkuAlert } from "@/components/home/alerts-panel";
import { SkuRca } from "./sku-rca";

// Color for the alert type badge — same map as alerts-panel
const ALERT_BADGE: Record<string, string> = {
  "Buy Box":          "bg-red-100 text-red-700",
  "Stock":            "bg-red-100 text-red-700",
  "Keyword Rank":     "bg-blue-100 text-blue-600",
  "SOV":              "bg-blue-100 text-blue-600",
  "Rating":           "bg-amber-100 text-amber-700",
  "Sales Drop":       "bg-orange-100 text-orange-700",
  "PO Discrepancy":   "bg-purple-100 text-purple-700",
};

function formatGap(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `-$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)     return `-$${(abs / 1_000).toFixed(0)}K`;
  return `-$${abs}`;
}

type SkuDetailProps = {
  sku: SkuAlert;
  onBack: () => void;
};

export function SkuDetail({ sku, onBack }: SkuDetailProps) {
  const [chatInput, setChatInput] = useState("");

  // Short SKU label used in the chat placeholder so it feels contextual
  const skuShortName = sku.skuName.split(" ").slice(0, 4).join(" ");

  return (
    // relative so the floating chat bar is positioned against this container
    <div className="relative flex flex-col h-full overflow-hidden">

      {/* ── Scrollable content area — extra bottom padding clears the chat bar ── */}
      <div className="flex flex-col gap-6 px-10 py-8 overflow-y-auto pb-28">

      {/* ── Back button ── */}
      <button
        onClick={onBack}
        className="flex w-fit items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Overview
      </button>

      {/* ── SKU header card ── */}
      <div className="flex items-start gap-5 rounded-xl border bg-white p-5 shadow-sm">
        {/* Product image placeholder */}
        <img
          src={`https://placehold.co/80x80/f4f4f5/71717a?text=${(sku.category ?? "?")[0]}`}
          alt={sku.skuName}
          className="h-20 w-20 rounded-lg border border-slate-200 object-cover shrink-0"
        />

        {/* SKU info */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <h2 className="text-lg font-bold text-slate-900 leading-snug">
            {sku.skuName}
          </h2>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {/* ASIN */}
            <div className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              <span className="font-mono">{sku.asin}</span>
              <a
                href={`https://www.amazon.com/dp/${sku.asin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-500 hover:text-violet-700"
                aria-label="View on Amazon"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Category */}
            <div className="flex items-center gap-1">
              <BarChart2 className="h-3.5 w-3.5" />
              <span>{sku.category}</span>
            </div>
          </div>

          {/* Alert type badge + gap */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                ALERT_BADGE[sku.alertType] ?? "bg-slate-100 text-slate-600"
              }`}
            >
              {sku.alertType}
            </span>
            <span className="text-sm font-bold text-red-500">
              {formatGap(sku.gapValue)} gap
            </span>
          </div>
        </div>
      </div>

      {/* ── SKU RCA — root cause analysis section ── */}
      <SkuRca sku={sku} />
    </div>

    {/* ── Floating chat bar ── */}
    <div className="absolute bottom-0 left-0 right-0 px-10 pb-5 pt-3 bg-linear-to-t from-slate-50 via-slate-50 to-transparent">
      <div className="mx-auto w-full max-w-[750px]">
      <PromptInput
        value={chatInput}
        onValueChange={setChatInput}
        isLoading={false}
        onSubmit={() => {}}
        className="w-full bg-white shadow-md border-slate-200"
        maxHeight={44} // single-line — prevents growing
      >
        <PromptInputTextarea
          disableAutosize
          rows={1}
          placeholder={`Ask AllyAI about ${skuShortName}…`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              // TODO: send chatInput to /api/chat with SKU context
            }
          }}
          className="min-h-0 h-7 resize-none py-0 leading-7"
        />
        <PromptInputActions className="justify-end">
          <button
            type="button"
            disabled={!chatInput.trim()}
            aria-label="Send"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white transition-opacity disabled:opacity-40 hover:opacity-90"
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
