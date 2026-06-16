"use client";

import { Sparkles } from "lucide-react";
import type { CategoryMetrics } from "@/components/home/category-insight-accordion";

// ── Insight generation ─────────────────────────────────────────────────────
// Produces a deterministic, data-driven narrative per category.
// Replace this function with a real LLM call when the API is ready.

function generateInsight(cat: CategoryMetrics, brandName: string): string {
  const paidPct = Math.round((cat.traffic.paid / cat.traffic.total) * 100);
  const absGap = Math.abs(cat.gapDollar);
  const gapStr =
    absGap >= 1_000_000
      ? `$${(absGap / 1_000_000).toFixed(1)}M`
      : `$${Math.round(absGap / 1_000)}K`;

  const convHealth =
    cat.conversion < 35
      ? "critically low"
      : cat.conversion < 42
        ? "below target"
        : "healthy";

  const organicRisk =
    paidPct > 65
      ? "Organic share is eroding — paid is carrying the category."
      : "Organic traffic is holding steady.";

  return (
    `${cat.name} is underperforming by ${gapStr} against plan for ${brandName}. ` +
    `Conversion is ${convHealth} at ${cat.conversion}%, with ${paidPct}% of traffic from paid channels. ` +
    `${organicRisk} ` +
    `${cat.issueCount} active issues detected across ${cat.skuCount} SKUs. ` +
    `Investigate keyword rank changes and content compliance on high-volume ASINs.`
  );
}

// ── Component ─────────────────────────────────────────────────────────────

interface AiInsightBannerProps {
  category: CategoryMetrics;
  brandName: string;
}

export function AiInsightBanner({ category, brandName }: AiInsightBannerProps) {
  const insight = generateInsight(category, brandName);

  // Gradient border: 1px outer div with gradient bg acts as the visible border.
  // Inner div has a brand tint that fades to white — subtle, not solid.
  return (
    <div className="rounded-xl bg-gradient-to-br from-brand-300 via-brand-200 to-violet-200 p-px">
      <div className="rounded-[11px] bg-white p-4 shadow-[inset_0_0_10px_4px_rgb(196_181_253_/_0.25)]">

        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-brand-500" />
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
            Ally Insight · {category.name}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-slate-700">{insight}</p>

      </div>
    </div>
  );
}
