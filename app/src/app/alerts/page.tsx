"use client";

import { useState } from "react";
import type { AlertItem } from "@/components/alerts/types";
import { AlertCard } from "@/components/alerts/alert-card";
import { AlertDetailsPanel } from "@/components/alerts/alert-details-panel";
import { FilterBar, type FilterState } from "@/components/alerts/filter-bar";

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [selectedId, setSelectedId] = useState<string>(ALERTS[0].id);
  const [filters, setFilters] = useState<FilterState>({
    unreadOnly: false,
    brand: null,
    category: null,
    sku: null,
  });

  // Apply active filters to the full alerts list
  const filteredAlerts = ALERTS.filter((alert) => {
    if (filters.unreadOnly && !alert.hasUnread) return false;
    if (filters.brand && alert.brand !== filters.brand) return false;
    if (filters.category && alert.category !== filters.category) return false;
    if (filters.sku && alert.asin !== filters.sku) return false;
    return true;
  });

  // Keep selected alert valid — if it gets filtered out, default to the first visible one
  const selectedAlert =
    filteredAlerts.find((a) => a.id === selectedId) ?? filteredAlerts[0];

  // Group visible alerts by date for the left panel
  const groups = filteredAlerts.reduce<Record<string, AlertItem[]>>((acc, a) => {
    (acc[a.date] ??= []).push(a);
    return acc;
  }, {});

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Filter bar — spans full width above both panels ── */}
      <FilterBar onFiltersChange={setFilters} />

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
        {selectedAlert ? (
          <AlertDetailsPanel alert={selectedAlert} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">
            No alerts match the current filters.
          </div>
        )}
      </div>

      </div>{/* end two-panel body */}
    </div>
  );
}
