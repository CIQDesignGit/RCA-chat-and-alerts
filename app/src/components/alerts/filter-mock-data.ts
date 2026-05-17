// All mock data for the filter system.
// These constants mirror the shape of what the API will return per the PRD:
//   PORTFOLIO_SUMMARY → overall gap (FR-001)
//   BRAND_DATA        → top brands by gap (FR-002)
//   CATEGORY_DATA     → top categories per brand (FR-003)
//   SKU_DATA          → SKUs per category
//
// Canonical Brand → Category mapping (must stay in sync with mock-data.ts):
//   Shark  → Kitchen Appliances, Home Care, Personal Care, Outdoor Living
//   Ninja  → Air Fryers, Blenders, Coffee Makers, Indoor Grills

import type { BrandOption } from "./brands-dropdown";

// ── Shared types for category and SKU data ────────────────────────────────────

export interface CategoryData {
  name: string;
  gapDollar: number;
  gapUnits: number;
  issueCount: number;
  achievedSales: number;
  targetSales: number;
}

export interface SkuData {
  asin: string;
  name: string;
  gapDollar: number;
  gapUnits: number;
  issueCount: number;
}

// ── Portfolio-level summary (shown in brands dropdown header + chip) ───────────

export const PORTFOLIO_SUMMARY = {
  totalGapDollar: -650_000,
  totalGapUnits: -1_200,
  achievedSales: 57_000,
  targetSales: 95_000,
};

// ── Brand data (sorted by gapDollar most-negative first, per FR-004) ──────────

export interface BrandDataWithPerf extends BrandOption {
  achievedSales: number;
  targetSales: number;
}

export const BRAND_DATA: BrandDataWithPerf[] = [
  {
    name: "Shark",
    gapDollar: -200_000,
    gapUnits: -480,
    colorClass: "bg-brand-500",
    achievedSales: 1_400_000,
    targetSales: 1_600_000,
  },
  {
    name: "Ninja",
    gapDollar: -450_000,
    gapUnits: -720,
    colorClass: "bg-blue-500",
    achievedSales: 900_000,
    targetSales: 1_200_000,
  },
];

// ── Category data keyed by brand name (FR-003) ────────────────────────────────

export const CATEGORY_DATA: Record<string, CategoryData[]> = {
  Shark: [
    { name: "Kitchen Appliances", gapDollar: -250_000, gapUnits: -650, issueCount: 7, achievedSales: 150_000, targetSales: 450_000 },
    { name: "Home Care",          gapDollar: -108_100, gapUnits: -356, issueCount: 4, achievedSales: 200_000, targetSales: 380_000 },
    { name: "Personal Care",      gapDollar:  -37_500, gapUnits: -118, issueCount: 2, achievedSales:  90_000, targetSales: 180_000 },
    { name: "Outdoor Living",     gapDollar:  -30_500, gapUnits:  -96, issueCount: 2, achievedSales:  60_000, targetSales: 140_000 },
  ],
  Ninja: [
    { name: "Air Fryers",    gapDollar: -90_100, gapUnits: -289, issueCount: 3, achievedSales: 220_000, targetSales: 400_000 },
    { name: "Blenders",      gapDollar: -48_300, gapUnits: -153, issueCount: 2, achievedSales: 120_000, targetSales: 240_000 },
    { name: "Coffee Makers", gapDollar: -53_600, gapUnits: -171, issueCount: 3, achievedSales: 150_000, targetSales: 280_000 },
    { name: "Indoor Grills", gapDollar: -36_500, gapUnits: -117, issueCount: 1, achievedSales:  80_000, targetSales: 180_000 },
  ],
};

// ── SKU data keyed by category name ───────────────────────────────────────────

export const SKU_DATA: Record<string, SkuData[]> = {
  "Kitchen Appliances": [
    { asin: "B00I0DI0Z6", name: "Shark HC450 Professional Food Processor - 8-Cup Capacity",  gapDollar: -46_500, gapUnits: -150, issueCount: 2 },
    { asin: "B08H8JZKDF", name: "Shark BladeVac High-Speed Blender - 1500W, 72 oz Pitcher",  gapDollar: -38_200, gapUnits: -120, issueCount: 2 },
    { asin: "B000BVFYU8", name: "Shark CleanSense Electric Kettle - 1.7L, BPA-Free",          gapDollar: -29_800, gapUnits:  -95, issueCount: 2 },
    { asin: "B09KIT1234", name: "Shark EasyMix Stand Mixer - 5 Qt, 8-Speed",                  gapDollar: -22_000, gapUnits:  -70, issueCount: 1 },
    { asin: "B09KIT5678", name: "Shark SpeedBrew Coffee & Espresso Maker",                    gapDollar: -18_400, gapUnits:  -59, issueCount: 0 },
    { asin: "B09KIT9012", name: "Shark AirWave Convection Toaster Oven - 6-Slice",            gapDollar: -12_700, gapUnits:  -41, issueCount: 0 },
  ],
  "Home Care": [
    { asin: "B09XKT7FMR", name: "Shark IQ Robot Self-Empty XL R101AE - Wi-Fi Connected",     gapDollar: -52_100, gapUnits: -180, issueCount: 1 },
    { asin: "B009NU4E7G", name: "Shark Navigator Lift-Away Professional NV356E Vacuum",       gapDollar: -31_400, gapUnits:  -98, issueCount: 1 },
    { asin: "B09DEF5678", name: "Shark Vertex DuoClean PowerFins Upright AZ2002WD",           gapDollar: -24_600, gapUnits:  -78, issueCount: 1 },
  ],
  "Personal Care": [
    { asin: "B09PC1001A", name: "Shark HyperAIR Fast-Drying Hair Dryer HD110",                gapDollar: -21_000, gapUnits: -66, issueCount: 1 },
    { asin: "B09PC1002B", name: "Shark FlexStyle 5-in-1 Air Styler & Hair Dryer",             gapDollar: -16_500, gapUnits: -52, issueCount: 1 },
  ],
  "Outdoor Living": [
    { asin: "B09OL1001A", name: "Shark HydroVac Cordless Pro XL Floor Cleaner",               gapDollar: -18_200, gapUnits: -57, issueCount: 1 },
    { asin: "B09OL1002B", name: "Shark WandVac Cordless Stick Vacuum WV201",                  gapDollar: -12_300, gapUnits: -39, issueCount: 1 },
  ],
  "Air Fryers": [
    { asin: "B07FDJMC9Q", name: "Ninja AF101 Air Fryer - 4 Qt, 1550-Watt, Programmable",     gapDollar: -42_000, gapUnits: -135, issueCount: 1 },
    { asin: "B07XHBG334", name: "Ninja AF161 Max XL Air Fryer - 5.5 Qt, Max Crisp",           gapDollar: -28_700, gapUnits:  -92, issueCount: 1 },
    { asin: "B08N4LTML1", name: "Ninja DZ201 Foodi 8 Qt 6-in-1 DualZone Air Fryer",           gapDollar: -19_400, gapUnits:  -62, issueCount: 1 },
  ],
  "Blenders": [
    { asin: "B00NGV4506", name: "Ninja BL610 Professional 72 oz Countertop Blender",          gapDollar: -28_500, gapUnits: -90, issueCount: 1 },
    { asin: "B002WE2TXY", name: "Ninja QB1004 Master Prep Professional Blender & Chopper",    gapDollar: -19_800, gapUnits: -63, issueCount: 1 },
  ],
  "Coffee Makers": [
    { asin: "B079CDMJB3", name: "Ninja CP307 Hot & Cold Brewed System Coffee Bar",            gapDollar: -35_000, gapUnits: -112, issueCount: 2 },
    { asin: "B074VFZQDM", name: "Ninja CE251 Programmable Brewer - 12-Cup Coffee Maker",      gapDollar: -18_600, gapUnits:  -59, issueCount: 1 },
  ],
  "Indoor Grills": [
    { asin: "B07XFD7YGJ", name: "Ninja FD401 Foodi 12-in-1 Deluxe XL Multi-Cooker",          gapDollar: -22_000, gapUnits: -71, issueCount: 0 },
    { asin: "B08PH2DJZQ", name: "Ninja IG651 Foodi Smart XL Pro 5-in-1 Indoor Grill",        gapDollar: -14_500, gapUnits: -46, issueCount: 1 },
  ],
};
