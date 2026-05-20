// ─── Shared alert mock data ───────────────────────────────────────────────────
// Single source of truth for both the Home AlertsPanel and the Alerts page.
//
// Data rules (product_context.md FR-004):
//  - Sorted by gapDollar ascending (most negative first) within each category.
//  - Categories are BRAND-SPECIFIC — every category belongs to exactly one
//    portfolio brand (Shark or Ninja), matching filter-mock-data.ts CATEGORY_DATA.
//
// Canonical Brand → Category mapping:
//   Shark  → Kitchen Appliances, Home Care, Personal Care, Outdoor Living
//   Ninja  → Air Fryers, Blenders, Coffee Makers, Indoor Grills

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
      { id: "i1",  type: "lost-buy-box", title: "Buy Box Issue",     description: "Lost the Buy Box to a reseller undercutting by 8%.",             analyst: "Sales Analyst", timeAgo: "4 hrs ago", status: "resolved" },
      { id: "i1b", type: "promo-badge",  title: "Promo Badge Issue", description: "Promo badge not rendering on search results despite active deal.", analyst: "Sales Analyst", timeAgo: "4 hrs ago", status: "open"     },
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
    tags: ["SoV Drop", "Keyword Rank Drop"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i2a", type: "sov-drop",          title: "SoV Drop",          description: "Competitor increased ad spend and captured share of voice on key blender terms.", analyst: "Sales Analyst", timeAgo: "6 hrs ago", status: "open" },
      { id: "i2b", type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "Blender keywords dropped 6 positions after a content update.",                    analyst: "Sales Analyst", timeAgo: "6 hrs ago", status: "open" },
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
      { id: "i3",  type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "Top search terms lost page-1 position.",              analyst: "Sales Analyst", timeAgo: "8 hrs ago", status: "open"     },
      { id: "i3b", type: "star-rating",       title: "Star Rating Drop",  description: "Rating fell to 3.9 after a batch of negative reviews.", analyst: "Sales Analyst", timeAgo: "8 hrs ago", status: "resolved" },
    ],
  },
  {
    id: "sk4",
    skuName: "Shark Ninja PS201 Foodi Possible Cooker Pro 8.5 Qt",
    asin: "B0BJZW4CLC",
    accountId: "AF101",
    category: "Kitchen Appliances",
    brand: "Shark",
    gapDollar: -22400,
    gapUnits: -71,
    tags: ["SoV Drop"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i3c", type: "sov-drop", title: "SoV Drop", description: "Share of voice on multi-cooker terms declined vs. Instant Pot.", analyst: "Sales Analyst", timeAgo: "12 hrs ago", status: "open" },
    ],
  },
  {
    id: "sk5",
    skuName: "Shark Toaster Oven SB500 - Digital Controls, 6-Slice",
    asin: "B0C1XYZ123",
    accountId: "AF101",
    category: "Kitchen Appliances",
    brand: "Shark",
    gapDollar: -17600,
    gapUnits: -56,
    tags: ["Promo Badge"],
    date: "Yesterday",
    hasUnread: false,
    issues: [
      { id: "i3d", type: "promo-badge", title: "Promo Badge Issue", description: "Deal badge not rendering for the weekend flash sale.", analyst: "Sales Analyst", timeAgo: "1 day ago", status: "open" },
    ],
  },
  {
    id: "sk6",
    skuName: "Shark Cordless Hand Blender HB152 - 3-Speed Settings",
    asin: "B0C1XYZ456",
    accountId: "AF101",
    category: "Kitchen Appliances",
    brand: "Shark",
    gapDollar: -11200,
    gapUnits: -36,
    tags: ["Keyword Rank Drop"],
    date: "Yesterday",
    hasUnread: false,
    issues: [
      { id: "i3e", type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "Immersion blender terms slipped to page 2 this week.", analyst: "Sales Analyst", timeAgo: "1 day ago", status: "open" },
    ],
  },

  // ── Shark / Home Care ─────────────────────────────────────────────────────
  {
    id: "sh1",
    skuName: "Shark IQ Robot Self-Empty XL R101AE - Wi-Fi Connected",
    asin: "B09XKT7FMR",
    accountId: "AF101",
    category: "Home Care",
    brand: "Shark",
    gapDollar: -52100,
    gapUnits: -180,
    tags: ["Search Exit Pg 1", "Best Seller Rank"],
    date: "Today",
    hasUnread: true,
    // RCA not yet computed for this SKU — triggers on-demand generation
    rcaReady: false,
    issues: [
      { id: "i4", type: "sov-drop", title: "Share of Voice Drop", description: "SoV dropped significantly on floor care keywords.", analyst: "Sales Analyst", timeAgo: "2 hrs ago", status: "open" },
    ],
  },
  {
    id: "sh2",
    skuName: "Shark Navigator Lift-Away Professional NV356E Vacuum",
    asin: "B009NU4E7G",
    accountId: "AF101",
    category: "Home Care",
    brand: "Shark",
    gapDollar: -31400,
    gapUnits: -98,
    tags: ["Content Change"],
    date: "Today",
    // Agent ran but RCA fetch failed — show issue-card fallback
    rcaFetchFailed: true,
    issues: [
      { id: "i5", type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "Content update caused a ranking drop on 5 key terms.", analyst: "Sales Analyst", timeAgo: "10 hrs ago", status: "open" },
    ],
  },
  {
    id: "sh3",
    skuName: "Shark Vertex DuoClean PowerFins Upright AZ2002WD",
    asin: "B09DEF5678",
    accountId: "AF101",
    category: "Home Care",
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
  {
    id: "sh4",
    skuName: "Shark Rocket Pet Pro Corded Stick Vacuum HV370",
    asin: "B08HC1001C",
    accountId: "AF101",
    category: "Home Care",
    brand: "Shark",
    gapDollar: -18900,
    gapUnits: -60,
    tags: ["Star Rating"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i5c", type: "star-rating", title: "Star Rating Drop", description: "Rating dipped to 3.7 following a firmware update complaint wave.", analyst: "Sales Analyst", timeAgo: "5 hrs ago", status: "open" },
    ],
  },
  {
    id: "sh5",
    skuName: "Shark Stratos Cordless Upright Vacuum IZ862H",
    asin: "B08HC1002D",
    accountId: "AF101",
    category: "Home Care",
    brand: "Shark",
    gapDollar: -14100,
    gapUnits: -45,
    tags: ["SoV Drop"],
    date: "Yesterday",
    hasUnread: false,
    issues: [
      { id: "i5d", type: "sov-drop", title: "SoV Drop", description: "Cordless vacuum share of voice declined after Dyson campaign.", analyst: "Sales Analyst", timeAgo: "1 day ago", status: "open" },
    ],
  },
  {
    id: "sh6",
    skuName: "Shark Air Purifier 4 with True HEPA Filter HC400",
    asin: "B08HC1003E",
    accountId: "AF101",
    category: "Home Care",
    brand: "Shark",
    gapDollar: -9800,
    gapUnits: -31,
    tags: ["Promo Badge"],
    date: "Yesterday",
    hasUnread: false,
    issues: [
      { id: "i5e", type: "promo-badge", title: "Promo Badge Issue", description: "Air purifier seasonal deal badge missing from the listing.", analyst: "Sales Analyst", timeAgo: "1 day ago", status: "resolved" },
    ],
  },

  // ── Shark / Personal Care ─────────────────────────────────────────────────
  {
    id: "sp1",
    skuName: "Shark HyperAIR Fast-Drying Hair Dryer HD110",
    asin: "B09PC1001A",
    accountId: "AF101",
    category: "Personal Care",
    brand: "Shark",
    gapDollar: -21000,
    gapUnits: -66,
    tags: ["Keyword Rank Drop"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i6a", type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "Main hair dryer keywords dropped to page 2.", analyst: "Sales Analyst", timeAgo: "5 hrs ago", status: "open" },
    ],
  },
  {
    id: "sp2",
    skuName: "Shark FlexStyle 5-in-1 Air Styler & Hair Dryer",
    asin: "B09PC1002B",
    accountId: "AF101",
    category: "Personal Care",
    brand: "Shark",
    gapDollar: -16500,
    gapUnits: -52,
    tags: ["Promo Badge"],
    date: "Today",
    issues: [
      { id: "i6b", type: "promo-badge", title: "Promo Badge Issue", description: "Deal badge missing despite an active styling promotion.", analyst: "Sales Analyst", timeAgo: "7 hrs ago", status: "resolved" },
    ],
  },

  // ── Shark / Outdoor Living ────────────────────────────────────────────────
  {
    id: "so1",
    skuName: "Shark HydroVac Cordless Pro XL Floor Cleaner",
    asin: "B09OL1001A",
    accountId: "AF101",
    category: "Outdoor Living",
    brand: "Shark",
    gapDollar: -18200,
    gapUnits: -57,
    tags: ["SoV Drop"],
    date: "Today",
    issues: [
      { id: "i7a", type: "sov-drop", title: "SoV Drop", description: "Competitor gained share of voice on outdoor cleaning terms.", analyst: "Sales Analyst", timeAgo: "6 hrs ago", status: "open" },
    ],
  },
  {
    id: "so2",
    skuName: "Shark WandVac Cordless Stick Vacuum WV201",
    asin: "B09OL1002B",
    accountId: "AF101",
    category: "Outdoor Living",
    brand: "Shark",
    gapDollar: -12300,
    gapUnits: -39,
    tags: ["Content Change"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i7b", type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "Outdoor vacuum keywords slipped off page 1.", analyst: "Sales Analyst", timeAgo: "9 hrs ago", status: "open" },
    ],
  },

  // ── Ninja / Air Fryers ────────────────────────────────────────────────────
  {
    id: "naf1",
    skuName: "Ninja AF101 Air Fryer - 4 Qt, 1550-Watt, Programmable",
    asin: "B07FDJMC9Q",
    accountId: "AF102",
    category: "Air Fryers",
    brand: "Ninja",
    gapDollar: -42000,
    gapUnits: -135,
    tags: ["Lost Buy Box", "Best Seller Rank"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i8a", type: "lost-buy-box", title: "Buy Box Issue", description: "Lost Buy Box on a top-selling air fryer SKU.", analyst: "Sales Analyst", timeAgo: "1 hr ago", status: "open" },
    ],
  },
  {
    id: "naf2",
    skuName: "Ninja AF161 Max XL Air Fryer - 5.5 Qt, Max Crisp Technology",
    asin: "B07XHBG334",
    accountId: "AF102",
    category: "Air Fryers",
    brand: "Ninja",
    gapDollar: -28700,
    gapUnits: -92,
    tags: ["Keyword Rank Drop"],
    date: "Today",
    issues: [
      { id: "i8b", type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "Air fryer keywords dropped after a competitor's new listing.", analyst: "Sales Analyst", timeAgo: "4 hrs ago", status: "open" },
    ],
  },
  {
    id: "naf3",
    skuName: "Ninja DZ201 Foodi 8 Qt 6-in-1 DualZone Air Fryer",
    asin: "B08N4LTML1",
    accountId: "AF102",
    category: "Air Fryers",
    brand: "Ninja",
    gapDollar: -19400,
    gapUnits: -62,
    tags: ["SoV Drop"],
    date: "Today",
    issues: [
      { id: "i8c", type: "sov-drop", title: "SoV Drop", description: "Share of voice on dual-basket air fryer terms declined.", analyst: "Sales Analyst", timeAgo: "8 hrs ago", status: "open" },
    ],
  },

  // ── Ninja / Blenders ──────────────────────────────────────────────────────
  {
    id: "nb1",
    skuName: "Ninja BL610 Professional 72 oz Countertop Blender",
    asin: "B00NGV4506",
    accountId: "AF102",
    category: "Blenders",
    brand: "Ninja",
    gapDollar: -28500,
    gapUnits: -90,
    tags: ["Promo Badge", "Sales Drop"],
    date: "Today",
    issues: [
      { id: "i9a", type: "promo-badge", title: "Promo Badge Issue", description: "Deal badge not showing despite an active promotion.", analyst: "Sales Analyst", timeAgo: "5 hrs ago", status: "resolved" },
    ],
  },
  {
    id: "nb2",
    skuName: "Ninja QB1004 Master Prep Professional Blender & Food Chopper",
    asin: "B002WE2TXY",
    accountId: "AF102",
    category: "Blenders",
    brand: "Ninja",
    gapDollar: -19800,
    gapUnits: -63,
    tags: ["Keyword Rank Drop"],
    date: "Today",
    issues: [
      { id: "i9b", type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "3 target keywords slipped below page 1 this week.", analyst: "Sales Analyst", timeAgo: "7 hrs ago", status: "open" },
    ],
  },

  // ── Ninja / Coffee Makers ─────────────────────────────────────────────────
  {
    id: "nc1",
    skuName: "Ninja CP307 Hot & Cold Brewed System Coffee Bar",
    asin: "B079CDMJB3",
    accountId: "AF102",
    category: "Coffee Makers",
    brand: "Ninja",
    gapDollar: -35000,
    gapUnits: -112,
    tags: ["Search Exit Pg 1", "Keyword Rank Drop"],
    date: "Today",
    hasUnread: true,
    issues: [
      { id: "i10a", type: "sov-drop",          title: "Share of Voice Drop", description: "SoV declined on coffee maker keywords following competitor spend increase.", analyst: "Sales Analyst", timeAgo: "3 hrs ago", status: "open" },
      { id: "i10b", type: "keyword-rank-drop", title: "Keyword Rank Drop",   description: "2 high-volume coffee terms dropped off page 1.",                          analyst: "Sales Analyst", timeAgo: "3 hrs ago", status: "open" },
    ],
  },
  {
    id: "nc2",
    skuName: "Ninja CE251 Programmable Brewer - 12-Cup Coffee Maker",
    asin: "B074VFZQDM",
    accountId: "AF102",
    category: "Coffee Makers",
    brand: "Ninja",
    gapDollar: -18600,
    gapUnits: -59,
    tags: ["Content Change"],
    date: "Today",
    issues: [
      { id: "i10c", type: "keyword-rank-drop", title: "Keyword Rank Drop", description: "Standard drip coffee keywords lost position after a content change.", analyst: "Sales Analyst", timeAgo: "11 hrs ago", status: "open" },
    ],
  },

  // ── Ninja / Indoor Grills ─────────────────────────────────────────────────
  {
    id: "ng1",
    skuName: "Ninja FD401 Foodi 12-in-1 Deluxe XL Multi-Cooker",
    asin: "B07XFD7YGJ",
    accountId: "AF102",
    category: "Indoor Grills",
    brand: "Ninja",
    gapDollar: -22000,
    gapUnits: -71,
    tags: ["PO Discrepancy", "Sales Drop"],
    date: "Today",
    issues: [],
  },
  {
    id: "ng2",
    skuName: "Ninja IG651 Foodi Smart XL Pro 5-in-1 Indoor Grill",
    asin: "B08PH2DJZQ",
    accountId: "AF102",
    category: "Indoor Grills",
    brand: "Ninja",
    gapDollar: -14500,
    gapUnits: -46,
    tags: ["Promo Badge"],
    date: "Today",
    issues: [
      { id: "i11", type: "promo-badge", title: "Promo Badge Issue", description: "Promo badge missing on product detail page.", analyst: "Sales Analyst", timeAgo: "9 hrs ago", status: "resolved" },
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
