// ─── Shared alert mock data ───────────────────────────────────────────────────
// Single source of truth for both the Home AlertsPanel and the Alerts page.
//
// Data rules (product_context.md FR-004):
//  - Sorted by gapDollar ascending (most negative first) within each category.
//  - Categories are BRAND-SPECIFIC — every category belongs to exactly one
//    portfolio brand (Shark or Ninja), matching filter-mock-data.ts CATEGORY_DATA.
//
// Brand → Category mapping:
//   Shark  → Kitchen Appliances, Home Essentials
//   Ninja  → Kitchen, Appliances

import type { AlertItem } from "./types";

export const ALERT_ITEMS: AlertItem[] = [

  // ── Shark / Kitchen Appliances ────────────────────────────────────────────
  {
    id: "sk1",
    skuName: "Shark HC450 Professional Food Processor - 8-Cup Capacity",
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
      { id: "i1",  type: "lost-buy-box",     title: "Buy Box Issue",     description: "Lost the Buy Box to a reseller undercutting by 8%.",             analyst: "Sales Analyst", timeAgo: "4 hrs ago", status: "resolved" },
      { id: "i1b", type: "promo-badge",       title: "Promo Badge Issue", description: "Promo badge not rendering on search results despite active deal.", analyst: "Sales Analyst", timeAgo: "4 hrs ago", status: "open"     },
    ],
  },
  {
    id: "sk2",
    skuName: "Shark BladeVac High-Speed Blender - 1500W, 72 oz Pitcher",
    asin: "B08H8JZKDF",
    accountId: "AF101",
    category: "Kitchen Appliances",
    brand: "Shark",
    gapDollar: -38200,
    gapUnits: -120,
    tags: ["Sales Drop", "Keyword Rank Drop"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i2", type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "Blender keywords dropped 6 positions after a content update.", analyst: "Sales Analyst", timeAgo: "6 hrs ago", status: "open" },
    ],
  },
  {
    id: "sk3",
    skuName: "Shark CleanSense Electric Kettle - 1.7L, BPA-Free",
    asin: "B000BVFYU8",
    accountId: "AF101",
    category: "Kitchen Appliances",
    brand: "Shark",
    gapDollar: -29800,
    gapUnits: -95,
    tags: ["Predictive OOS", "Star Rating"],
    date: "Today",
    issues: [
      { id: "i3",  type: "keyword-rank-drop", title: "Keyword Rank Drop",  description: "Top search terms lost page-1 position.",                        analyst: "Sales Analyst", timeAgo: "8 hrs ago", status: "open"     },
      { id: "i3b", type: "star-rating",       title: "Star Rating Drop",   description: "Rating fell to 3.9 after a batch of negative reviews.",          analyst: "Sales Analyst", timeAgo: "8 hrs ago", status: "resolved" },
    ],
  },

  // ── Shark / Home Essentials ───────────────────────────────────────────────
  {
    id: "sh1",
    skuName: "Shark IQ Robot Self-Empty XL R101AE - Wi-Fi Connected",
    asin: "B09XKT7FMR",
    accountId: "AF101",
    category: "Home Essentials",
    brand: "Shark",
    gapDollar: -52100,
    gapUnits: -180,
    tags: ["Search Exit Pg 1", "Best Seller Rank"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i4", type: "sov-drop", title: "Share of Voice Drop", description: "SoV dropped significantly on floor care keywords.", analyst: "Sales Analyst", timeAgo: "2 hrs ago", status: "open" },
    ],
  },
  {
    id: "sh2",
    skuName: "Shark Navigator Lift-Away Professional NV356E Vacuum",
    asin: "B009NU4E7G",
    accountId: "AF101",
    category: "Home Essentials",
    brand: "Shark",
    gapDollar: -31400,
    gapUnits: -98,
    tags: ["Content Change"],
    date: "Today",
    issues: [
      { id: "i5", type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "Content update caused a ranking drop on 5 key terms.", analyst: "Sales Analyst", timeAgo: "10 hrs ago", status: "open" },
    ],
  },
  {
    id: "sh3",
    skuName: "Shark Vertex DuoClean PowerFins Upright AZ2002WD",
    asin: "B09DEF5678",
    accountId: "AF101",
    category: "Home Essentials",
    brand: "Shark",
    gapDollar: -24600,
    gapUnits: -78,
    tags: ["Lost Buy Box"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i5b", type: "lost-buy-box", title: "Buy Box Issue", description: "Third-party seller took the Buy Box with aggressive pricing.", analyst: "Sales Analyst", timeAgo: "3 hrs ago", status: "open" },
    ],
  },

  // ── Ninja / Kitchen ───────────────────────────────────────────────────────
  {
    id: "nk1",
    skuName: "Ninja AF101 Air Fryer - 4 Qt, 1550-Watt, Programmable",
    asin: "B07FDJMC9Q",
    accountId: "AF102",
    category: "Kitchen",
    brand: "Ninja",
    gapDollar: -42000,
    gapUnits: -135,
    tags: ["Lost Buy Box", "Best Seller Rank"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i6", type: "lost-buy-box", title: "Buy Box Issue", description: "Lost Buy Box on a top-selling air fryer SKU.", analyst: "Sales Analyst", timeAgo: "1 hr ago", status: "open" },
    ],
  },
  {
    id: "nk2",
    skuName: "Ninja BL610 Professional 72 oz Countertop Blender",
    asin: "B00NGV4506",
    accountId: "AF102",
    category: "Kitchen",
    brand: "Ninja",
    gapDollar: -28500,
    gapUnits: -90,
    tags: ["Promo Badge", "Sales Drop"],
    date: "Today",
    issues: [
      { id: "i7", type: "promo-badge", title: "Promo Badge Issue", description: "Deal badge not showing despite an active promotion.", analyst: "Sales Analyst", timeAgo: "5 hrs ago", status: "resolved" },
    ],
  },
  {
    id: "nk3",
    skuName: "Ninja QB1004 Master Prep Professional Blender & Food Chopper",
    asin: "B002WE2TXY",
    accountId: "AF102",
    category: "Kitchen",
    brand: "Ninja",
    gapDollar: -19800,
    gapUnits: -63,
    tags: ["Keyword Rank Drop"],
    date: "Today",
    issues: [
      { id: "i8", type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "3 target keywords slipped below page 1 this week.", analyst: "Sales Analyst", timeAgo: "7 hrs ago", status: "open" },
    ],
  },

  // ── Ninja / Appliances ────────────────────────────────────────────────────
  {
    id: "na1",
    skuName: "Ninja CP307 Hot & Cold Brewed System Coffee Bar",
    asin: "B079CDMJB3",
    accountId: "AF102",
    category: "Appliances",
    brand: "Ninja",
    gapDollar: -35000,
    gapUnits: -112,
    tags: ["Search Exit Pg 1", "Keyword Rank Drop"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i9",  type: "sov-drop",          title: "Share of Voice Drop", description: "SoV declined on coffee maker keywords following competitor spend increase.", analyst: "Sales Analyst", timeAgo: "3 hrs ago", status: "open"     },
      { id: "i9b", type: "keyword-rank-drop", title: "Keyword Rank Drop",   description: "2 high-volume coffee terms dropped off page 1.",                          analyst: "Sales Analyst", timeAgo: "3 hrs ago", status: "open"     },
    ],
  },
  {
    id: "na2",
    skuName: "Ninja FD401 Foodi 12-in-1 Deluxe XL Multi-Cooker",
    asin: "B07XFD7YGJ",
    accountId: "AF102",
    category: "Appliances",
    brand: "Ninja",
    gapDollar: -22000,
    gapUnits: -71,
    tags: ["PO Discrepancy", "Sales Drop"],
    date: "Today",
    issues: [],
  },
  {
    id: "na3",
    skuName: "Ninja IG651 Foodi Smart XL Pro 5-in-1 Indoor Grill",
    asin: "B08PH2DJZQ",
    accountId: "AF102",
    category: "Appliances",
    brand: "Ninja",
    gapDollar: -14500,
    gapUnits: -46,
    tags: ["Promo Badge"],
    date: "Today",
    issues: [
      { id: "i10", type: "promo-badge", title: "Promo Badge Issue", description: "Promo badge missing on product detail page.", analyst: "Sales Analyst", timeAgo: "9 hrs ago", status: "resolved" },
    ],
  },
];

// ── Derived lookups ───────────────────────────────────────────────────────────

// Category totals — sum of gapDollar per category
export const CATEGORY_TOTALS: Record<string, number> = ALERT_ITEMS.reduce<
  Record<string, number>
>((acc, item) => {
  acc[item.category] = (acc[item.category] ?? 0) + item.gapDollar;
  return acc;
}, {});

// Category display order — most negative gap first (FR-004)
export const CATEGORY_ORDER = Object.entries(CATEGORY_TOTALS)
  .sort(([, a], [, b]) => a - b)
  .map(([cat]) => cat);

// Brand that owns each category — derived from the data (each category maps to
// exactly one brand, so we just grab the first SKU we find per category)
export const CATEGORY_BRAND: Record<string, string> = Object.fromEntries(
  CATEGORY_ORDER.map((cat) => [
    cat,
    ALERT_ITEMS.find((item) => item.category === cat)!.brand,
  ]),
);
