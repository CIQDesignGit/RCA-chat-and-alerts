"use client";

import { useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import type { AlertItem } from "@/components/alerts/types";
import { AlertCard } from "@/components/alerts/alert-card";
import { AlertDetailsPanel } from "@/components/alerts/alert-details-panel";

// ─── Placeholder data — realistic CIQ-style SKU alerts ───────────────────────

const ALERTS: AlertItem[] = [
  {
    id: "1",
    skuName: "NutriChef Food Processor - 8-Cup Capacity, Digital Control",
    asin: "B00I0DI0Z6",
    accountId: "AF101",
    category: "Kitchen",
    brand: "Shark",
    gapDollar: -46500,
    gapUnits: -150,
    tags: ["Lost Buy Box", "Promo Badge"],
    date: "Today",
    hasUnread: true,
    issues: [
      {
        id: "i1",
        type: "lost-buy-box",
        title: "Buy Box Issue",
        description: "You've lost the Buy Box on an important SKU.",
        analyst: "Sales Analyst",
        timeAgo: "4 hrs ago",
        status: "resolved",
      },
      {
        id: "i1b",
        type: "star-rating",
        title: "Star Rating Issue",
        description: "Your product's rating has dropped.",
        analyst: "Sales Analyst",
        timeAgo: "4 hrs ago",
        status: "resolved",
      },
      {
        id: "i2",
        type: "keyword-rank-drop",
        title: "Keyword Rank Drop",
        description: "3 high-volume keywords dropped significantly in ranking this week.",
        analyst: "Sales Analyst",
        timeAgo: "4 hrs ago",
        status: "open",
      },
    ],
  },
  {
    id: "2",
    skuName: "Vevor Electric Grain Mill Grinder - High Speed, Commercial Grade",
    asin: "B08H8JZKDF",
    accountId: "AF101",
    category: "Kitchen",
    brand: "Shark",
    gapDollar: -38200,
    gapUnits: -120,
    tags: ["Buy Box", "Promo Badge"],
    date: "Today",
    hasUnread: true,
    issues: [
      {
        id: "i3",
        type: "sov-drop",
        title: "Share of Voice Drop",
        description: "Your share of voice dropped across key search terms.",
        analyst: "Sales Analyst",
        timeAgo: "6 hrs ago",
        status: "open",
      },
    ],
  },
  {
    id: "3",
    skuName: "Proctor Silex 2-Slice Toaster - Easy Toasting",
    asin: "B000BVFYU8",
    accountId: "AF101",
    category: "Kitchen",
    brand: "Shark",
    gapDollar: -29800,
    gapUnits: -95,
    tags: ["Buy Box", "Promo Badge", "Best Seller Rank", "Rating"],
    date: "Today",
    issues: [
      {
        id: "i4",
        type: "keyword-rank-drop",
        title: "Keyword Rank Drop",
        description: "Multiple keywords lost ranking due to content score drop.",
        analyst: "Sales Analyst",
        timeAgo: "8 hrs ago",
        status: "open",
      },
      {
        id: "i4b",
        type: "promo-badge",
        title: "Promo Badge Issue",
        description:
          "Your product is on discount from 28 Apr to 10 May, but there is some issue with the display. View Promo Calendar",
        analyst: "Sales Analyst",
        timeAgo: "8 hrs ago",
        status: "resolved",
      },
    ],
  },
  {
    id: "4",
    skuName: "Dyson V11 Animal Cordless Vacuum - Powerful Suction",
    asin: "B09XKT7FMR",
    accountId: "AF101",
    category: "Home Essentials",
    brand: "Dyson",
    gapDollar: -52100,
    gapUnits: -180,
    tags: ["Best Seller Rank", "Promo Badge"],
    date: "Today",
    hasUnread: true,
    issues: [
      {
        id: "i5",
        type: "sov-drop",
        title: "Share of Voice Drop",
        description: "Significant SoV decline on floor care keywords this week.",
        analyst: "Sales Analyst",
        timeAgo: "2 hrs ago",
        status: "open",
      },
    ],
  },
  {
    id: "5",
    skuName: "Proctor Silex 2-Slice Toaster - Easy Toasting (Refurb)",
    asin: "B000BVFYU9",
    accountId: "AF101",
    category: "Kitchen",
    brand: "Shark",
    gapDollar: -18600,
    gapUnits: -60,
    tags: ["Buy Box", "Promo Badge", "Best Seller Rank", "Rating"],
    date: "Today",
    issues: [
      {
        id: "i6",
        type: "lost-buy-box",
        title: "Buy Box Issue",
        description: "Refurbished variant lost Buy Box to a third-party seller.",
        analyst: "Sales Analyst",
        timeAgo: "12 hrs ago",
        status: "resolved",
      },
    ],
  },
];

// ─── Filter chip data ─────────────────────────────────────────────────────────
// Three distinct chip types match the three filter categories:
//   "issue"  — e.g. "Lost Buy Box"  → lavender fill, violet text
//   "brand"  — e.g. "Shark"         → lavender fill, violet text (same visual, different semantic)
//   "unread" — toggle, no remove    → outlined pill

type FilterChip =
  | { type: "issue" | "brand"; label: string }
  | { type: "unread" };

const CHIPS: FilterChip[] = [
  { type: "unread" },
  { type: "issue", label: "Lost Buy Box" },
  { type: "brand", label: "Shark" },
];

// ─── Filter bar ───────────────────────────────────────────────────────────────

function FilterBar() {
  return (
    <div className="flex items-center gap-2 border-b bg-white px-4 py-3">

      {/* Search — square icon button with a border, matches screenshot */}
      <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50">
        <Search className="h-4 w-4" />
      </button>

      {CHIPS.map((chip, i) => {
        // ── Unread toggle chip — outlined, no × ──
        if (chip.type === "unread") {
          return (
            <button
              key="unread"
              className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Unread
            </button>
          );
        }

        // ── Issue / Brand active filter chip — light lavender fill, violet text, × ──
        return (
          <span
            key={i}
            className="flex items-center gap-2 rounded-full bg-violet-100 px-3.5 py-1.5 text-sm font-semibold text-violet-700"
          >
            {chip.label}
            <button
              className="flex h-4 w-4 items-center justify-center rounded-full text-violet-500 hover:bg-violet-200 hover:text-violet-700 transition-colors"
              aria-label={`Remove ${chip.label} filter`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        );
      })}

      {/* All Categories dropdown — outlined pill, pushed to the right */}
      <button className="ml-auto flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
        All Categories
        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [selectedId, setSelectedId] = useState<string>(ALERTS[0].id);
  const selectedAlert = ALERTS.find((a) => a.id === selectedId) ?? ALERTS[0];

  // Group alerts by date
  const groups = ALERTS.reduce<Record<string, AlertItem[]>>((acc, a) => {
    (acc[a.date] ??= []).push(a);
    return acc;
  }, {});

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Filter bar — spans full width above both panels ── */}
      <FilterBar />

      {/* ── Two-panel body ── */}
      <div className="flex flex-1 overflow-hidden">

      {/* Left: alert card list */}
      <div className="flex w-80 shrink-0 flex-col border-r bg-white">
        {/* Scrollable card list grouped by date */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(groups).map(([date, items]) => (
            <div key={date}>
              {/* Date group header */}
              <div className="sticky top-0 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-500">
                {date} ({items.length})
              </div>

              {/* Alert cards for this date */}
              <div className="divide-y divide-zinc-50">
                {items.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    isActive={alert.id === selectedId}
                    onClick={() => setSelectedId(alert.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: alert details panel — white canvas so inner zinc-50 cards contrast */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white">
        <AlertDetailsPanel alert={selectedAlert} />
      </div>

      </div>{/* end two-panel body */}
    </div>
  );
}
