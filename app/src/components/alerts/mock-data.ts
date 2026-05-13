// ─── Shared alert mock data ───────────────────────────────────────────────────
// Single source of truth used by both the Home AlertsPanel and the Alerts page.
// Sorted by gapDollar ascending (most negative first) within each category,
// matching the dollar-first rule from product_context.md (FR-004).

import type { AlertItem } from "./types";

export const ALERT_ITEMS: AlertItem[] = [
  // ── Kitchen Appliances ────────────────────────────────────────────────────
  {
    id: "k1",
    skuName: "NutriChef Food Processor - 8-Cup Capacity, Digital Control",
    asin: "B00I0DI0Z6",
    accountId: "AF101",
    category: "Kitchen Appliances",
    brand: "Shark",
    gapDollar: -46500,
    gapUnits: -150,
    tags: ["Lost Buy Box", "Promo Badge"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i1",  type: "lost-buy-box",      title: "Buy Box Issue",       description: "You've lost the Buy Box on an important SKU.",                        analyst: "Sales Analyst", timeAgo: "4 hrs ago",  status: "resolved" },
      { id: "i1b", type: "star-rating",        title: "Star Rating Issue",   description: "Your product's rating has dropped below 4 stars.",                  analyst: "Sales Analyst", timeAgo: "4 hrs ago",  status: "resolved" },
      { id: "i2",  type: "keyword-rank-drop",  title: "Keyword Rank Drop",   description: "3 high-volume keywords dropped significantly in ranking this week.", analyst: "Sales Analyst", timeAgo: "4 hrs ago",  status: "open"     },
    ],
  },
  {
    id: "k2",
    skuName: "Vevor Electric Grain Mill Grinder - High Speed, Commercial Grade",
    asin: "B08H8JZKDF",
    accountId: "AF101",
    category: "Kitchen Appliances",
    brand: "Shark",
    gapDollar: -38200,
    gapUnits: -120,
    tags: ["Sales Drop", "Promo Badge"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i3", type: "sov-drop", title: "Share of Voice Drop", description: "Your share of voice dropped across key search terms.", analyst: "Sales Analyst", timeAgo: "6 hrs ago", status: "open" },
    ],
  },
  {
    id: "k3",
    skuName: "Proctor Silex 2-Slice Toaster - Easy Toasting",
    asin: "B000BVFYU8",
    accountId: "AF101",
    category: "Kitchen Appliances",
    brand: "Shark",
    gapDollar: -29800,
    gapUnits: -95,
    tags: ["Predictive OOS", "Best Seller Rank"],
    date: "Today",
    issues: [
      { id: "i4",  type: "keyword-rank-drop", title: "Keyword Rank Drop",  description: "Multiple keywords lost ranking due to content score drop.", analyst: "Sales Analyst", timeAgo: "8 hrs ago", status: "open"     },
      { id: "i4b", type: "promo-badge",       title: "Promo Badge Issue",  description: "Promo is active but not displaying correctly on the listing.",  analyst: "Sales Analyst", timeAgo: "8 hrs ago", status: "resolved" },
    ],
  },

  // ── Home Essentials ───────────────────────────────────────────────────────
  {
    id: "h1",
    skuName: "Dyson V11 Animal Cordless Vacuum - Powerful Suction",
    asin: "B09XKT7FMR",
    accountId: "AF101",
    category: "Home Essentials",
    brand: "Dyson",
    gapDollar: -52100,
    gapUnits: -180,
    tags: ["Search Exit Pg 1", "Best Seller Rank"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i5", type: "sov-drop", title: "Share of Voice Drop", description: "Significant SoV decline on floor care keywords this week.", analyst: "Sales Analyst", timeAgo: "2 hrs ago", status: "open" },
    ],
  },
  {
    id: "h2",
    skuName: "Shark Navigator Lift-Away Professional Vacuum",
    asin: "B009NU4E7G",
    accountId: "AF101",
    category: "Home Essentials",
    brand: "Shark",
    gapDollar: -31400,
    gapUnits: -98,
    tags: ["Content Change"],
    date: "Today",
    issues: [
      { id: "i6", type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "Content update caused a ranking drop on 5 key terms.", analyst: "Sales Analyst", timeAgo: "10 hrs ago", status: "open" },
    ],
  },

  // ── Personal Care ─────────────────────────────────────────────────────────
  {
    id: "p1",
    skuName: "Oral-B Pro 1000 Electric Toothbrush - Rechargeable",
    asin: "B00AEGPQT0",
    accountId: "AF101",
    category: "Personal Care",
    brand: "Oral-B",
    gapDollar: -24700,
    gapUnits: -82,
    tags: ["Lost Buy Box"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i7", type: "lost-buy-box", title: "Buy Box Issue", description: "Lost Buy Box to a reseller offering a lower price.", analyst: "Sales Analyst", timeAgo: "5 hrs ago", status: "open" },
    ],
  },
  {
    id: "p2",
    skuName: "Philips Sonicare ProtectiveClean 4100",
    asin: "B07F5GD96J",
    accountId: "AF101",
    category: "Personal Care",
    brand: "Philips",
    gapDollar: -18900,
    gapUnits: -63,
    tags: ["Predictive OOS"],
    date: "Today",
    issues: [
      { id: "i8", type: "sov-drop", title: "Share of Voice Drop", description: "Ad spend reduction impacted SoV on personal care terms.", analyst: "Sales Analyst", timeAgo: "7 hrs ago", status: "resolved" },
    ],
  },

  // ── Sports & Outdoors ─────────────────────────────────────────────────────
  {
    id: "s1",
    skuName: "Lifefitness T3 Treadmill - Folding Design",
    asin: "B01N5DXQMQ",
    accountId: "AF101",
    category: "Sports & Outdoors",
    brand: "Lifefitness",
    gapDollar: -15200,
    gapUnits: -48,
    tags: ["Sales Drop"],
    date: "Today",
    issues: [],
  },
  {
    id: "s2",
    skuName: "Bowflex SelectTech 552 Adjustable Dumbbells",
    asin: "B001ARYU58",
    accountId: "AF101",
    category: "Sports & Outdoors",
    brand: "Bowflex",
    gapDollar: -9800,
    gapUnits: -31,
    tags: ["PO Discrepancy"],
    date: "Today",
    issues: [],
  },
];

// Pre-computed category totals (sum of gapDollar per category)
// Used by the home panel header rows
export const CATEGORY_TOTALS: Record<string, number> = ALERT_ITEMS.reduce<
  Record<string, number>
>((acc, item) => {
  acc[item.category] = (acc[item.category] ?? 0) + item.gapDollar;
  return acc;
}, {});

// Category display order — most negative gap first (dollar-first rule)
export const CATEGORY_ORDER = Object.entries(CATEGORY_TOTALS)
  .sort(([, a], [, b]) => a - b)
  .map(([cat]) => cat);
