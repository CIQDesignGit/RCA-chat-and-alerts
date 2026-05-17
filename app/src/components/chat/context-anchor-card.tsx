// ContextAnchorCard — shown at the top of the message list in the chat page
// whenever the active session was started from a SKU alert.
//
// Pattern: "Source reference card" (same mechanic as Linear's "Created from PR",
// GitHub Copilot's file-context chip, Notion's database record origin).
// Stays pinned above the first message so the user always knows what they were
// investigating when they find this conversation in their history.

"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import type { ChatSource } from "@/lib/chat-store";
import { GapBadge } from "@/components/alerts/gap-badge";

interface ContextAnchorCardProps {
  source: ChatSource & { type: "sku" };
}

export function ContextAnchorCard({ source }: ContextAnchorCardProps) {
  const router = useRouter();

  function handleViewAlert() {
    // Navigate home and deep-link to this specific alert
    router.push(`/?alertId=${encodeURIComponent(source.alertId)}`);
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
      {/* Product thumbnail */}
      <img
        src={`https://placehold.co/32x32/f1f5f9/64748b?text=${source.category[0]}`}
        alt={source.skuName}
        className="h-8 w-8 shrink-0 rounded-md border border-slate-200 object-cover"
      />

      {/* SKU info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">
          {source.skuName}
        </p>
        <p className="text-xs text-slate-400">
          {source.category}
          <span className="mx-1 text-slate-300">·</span>
          {source.brand}
        </p>
      </div>

      {/* Gap badge */}
      <GapBadge gapDollar={source.gapDollar} gapUnits={source.gapUnits} />

      {/* Deep-link back to the alert on the home page */}
      <button
        type="button"
        onClick={handleViewAlert}
        className="ml-1 flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-800"
      >
        View Alert
        <ArrowUpRight className="h-3 w-3" />
      </button>
    </div>
  );
}
