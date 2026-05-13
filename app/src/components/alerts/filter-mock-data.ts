// All mock data for the filter system.
// These constants mirror the shape of what the API will return per the PRD:
//   PORTFOLIO_SUMMARY → overall gap (FR-001)
//   BRAND_DATA        → top brands by gap (FR-002)
//   CATEGORY_DATA     → top categories per brand (FR-003)
//   SKU_DATA          → SKUs per category

import type { BrandOption } from "./brands-dropdown";

// ── Shared types for category and SKU data ────────────────────────────────────

export interface CategoryData {
  name: string;
  gapDollar: number;
  gapUnits: number;
  issueCount: number;
  achievedSales: number; // used as categories dropdown header when this category is selected
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
// achievedSales / targetSales are shown in the categories dropdown header when
// this brand is selected.

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
    { name: "Kitchen Appliances",               gapDollar: -250_000, gapUnits: -650,   issueCount: 4, achievedSales: 150_000, targetSales: 450_000 },
    { name: "Home Essentials",                  gapDollar: -250_000, gapUnits: -650,   issueCount: 4, achievedSales: 200_000, targetSales: 380_000 },
    { name: "Wash Supplies & Kitchen Appliances",gapDollar: -210_000, gapUnits: -900,   issueCount: 4, achievedSales: 90_000,  targetSales: 300_000 },
    { name: "Fitness Equipment",                gapDollar: -175_000, gapUnits: -300,   issueCount: 4, achievedSales: 120_000, targetSales: 280_000 },
    { name: "Outdoor Gear",                     gapDollar: -120_000, gapUnits: -450,   issueCount: 4, achievedSales: 80_000,  targetSales: 200_000 },
    { name: "Office Supplies",                  gapDollar: -95_000,  gapUnits: -1_200, issueCount: 4, achievedSales: 55_000,  targetSales: 150_000 },
    { name: "Stationary & Office Products",     gapDollar: -250_000, gapUnits: -650,   issueCount: 0, achievedSales: 30_000,  targetSales: 280_000 },
  ],
  Ninja: [
    { name: "Kitchen",     gapDollar: -180_000, gapUnits: -540, issueCount: 3, achievedSales: 220_000, targetSales: 400_000 },
    { name: "Appliances",  gapDollar: -270_000, gapUnits: -810, issueCount: 5, achievedSales: 150_000, targetSales: 420_000 },
  ],
};

// ── SKU data keyed by category name ───────────────────────────────────────────

export const SKU_DATA: Record<string, SkuData[]> = {
  "Kitchen Appliances": [
    { asin: "B00I0DI0Z6", name: "NutriChef Food Processor - 8-Cup Capacity, Digital Control", gapDollar: -38_000, gapUnits: -90,  issueCount: 4 },
    { asin: "B09XKT7FMR", name: "Dyson V11 Animal Cordless Vacuum - Powerful Suction",         gapDollar: -32_000, gapUnits: -75,  issueCount: 4 },
    { asin: "B000BVFYU8", name: "Proctor Silex 2-Slice Toaster - Easy Toasting",               gapDollar: -24_000, gapUnits: -55,  issueCount: 4 },
    { asin: "B09ABC1234", name: "Hamilton Beach Wave Crusher Blender",                          gapDollar: -18_000, gapUnits: -40,  issueCount: 4 },
    { asin: "B09KIT5678", name: "KitchenAid Cold Brew Coffee Maker",                            gapDollar: -20_000, gapUnits: -50,  issueCount: 0 },
    { asin: "B08H8JZKDF", name: "Vevor Electric Grain Mill Grinder - High Speed, Commercial",   gapDollar: -28_000, gapUnits: -65,  issueCount: 0 },
  ],
  "Home Essentials": [
    { asin: "B09XKT7FMR", name: "Dyson V11 Animal Cordless Vacuum - Powerful Suction", gapDollar: -52_100, gapUnits: -180, issueCount: 3 },
    { asin: "B09DEF5678", name: "Shark IQ Robot Self-Empty XL",                        gapDollar: -45_000, gapUnits: -120, issueCount: 2 },
    { asin: "B09GHI9012", name: "iRobot Roomba j7+ Self-Emptying Robot Vacuum",        gapDollar: -30_000, gapUnits: -90,  issueCount: 1 },
  ],
};
