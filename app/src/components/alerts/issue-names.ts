import type { IssueType } from "./types";

/** Canonical issue display names across filter dropdown, left-panel chips, and RCA pane. */
export const ISSUE_NAME = {
  LOST_BUY_BOX: {
    filter: "Lost Buy Box",
    chip: "Buy Box",
    rca: "Buy Box",
  },
  PROMO_BADGE: {
    filter: "Promo Badge",
    chip: "Promo Badge",
    rca: "Promo Badge",
  },
  DEAL_PAGE: {
    filter: "Deal Page Visibility",
    chip: "Deal Page",
    rca: "Deal Page Visibility",
  },
  COUPON: {
    filter: "Coupon",
    chip: "Coupon",
    rca: "Coupon",
  },
  BSR: {
    filter: "Best Seller Rank",
    chip: "Best Seller Rank",
    rca: "Best Seller Rank",
  },
  RATING: {
    filter: "Rating & Reviews",
    chip: "Rating",
    rca: "Rating & Reviews",
  },
  STOCK: {
    filter: "Stock Availability",
    chip: "Stock",
    rca: "Stock Availability",
  },
  SHIPPING: {
    filter: "Shipping Speed",
    chip: "Shipping",
    rca: "Shipping Speed",
  },
  SOV: {
    filter: "Sponsored Share of Voice",
    chip: "SOV",
    rca: "Sponsored Share of Voice",
  },
  KEYWORD_RANK: {
    filter: "Keyword Rank",
    chip: "Keyword Rank",
    rca: "Keyword Rank",
  },
  MEDIA_SPEND: {
    filter: "Media Spend",
    chip: "Media Spend",
    rca: "Media Spend",
  },
  CONVERSION: {
    filter: "Conversion Drop",
    chip: "Conversion",
    rca: "Conversion",
  },
} as const;

/** Maps left-panel chip labels → issue types for resolved-state checkmarks. */
export const CHIP_TO_ISSUE_TYPE: Record<string, IssueType> = {
  [ISSUE_NAME.LOST_BUY_BOX.chip]: "lost-buy-box",
  [ISSUE_NAME.PROMO_BADGE.chip]: "promo-badge",
  [ISSUE_NAME.KEYWORD_RANK.chip]: "keyword-rank-drop",
  [ISSUE_NAME.RATING.chip]: "star-rating",
  [ISSUE_NAME.SOV.chip]: "sov-drop",
  [ISSUE_NAME.CONVERSION.chip]: "conversion",
  // Legacy chip labels (mock data / older alerts)
  "Lost Buy Box": "lost-buy-box",
  "Keyword Rank Drop": "keyword-rank-drop",
  "Star Rating": "star-rating",
  SoV: "sov-drop",
  "SoV Drop": "sov-drop",
  "Share of Voice": "sov-drop",
  [ISSUE_NAME.SOV.rca]: "sov-drop",
};
