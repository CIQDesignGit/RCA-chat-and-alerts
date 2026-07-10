"use client";

import { useState } from "react";
import {
  TrendingDown,
  ShoppingCart,
  Tag,
  Megaphone,
  PieChart,
  DollarSign,
  Package,
  Truck,
  Star,
  AlertTriangle,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  SearchX,
  ShoppingBag,
  Funnel,
  Award,
  Shield,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
} from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SkuAlert } from "@/components/home/alerts-panel";
import { ISSUE_NAME } from "@/components/alerts/issue-names";
import { LostBuyBoxIssue }           from "@/components/alerts/issues/lost-buy-box";
import { OutOfStockIssue }         from "@/components/alerts/issues/out-of-stock";
import { ShippingSpeedIssue }      from "@/components/alerts/issues/shipping-speed";
import { PromoBadgeIssue }           from "@/components/alerts/issues/promo-badge";
import { SovDropIssue }              from "@/components/alerts/issues/sov-drop";
import { BestSellerRankIssue }       from "@/components/alerts/issues/best-seller-rank";
import { DealPageVisibilityIssue }   from "@/components/alerts/issues/deal-page-visibility";
import { KeywordRankDropIssue }      from "@/components/alerts/issues/keyword-rank-drop";
import { StarRatingIssue }           from "@/components/alerts/issues/star-rating";
import { LastWeekTrendBuyBox }       from "@/components/alerts/issues/last-week-trend-buy-box";
import { LastWeekTrendPromoBadge }   from "@/components/alerts/issues/last-week-trend-promo-badge";
import { LastWeekTrendDealPage }     from "@/components/alerts/issues/last-week-trend-deal-page";
import { LastWeekTrendCoupon }       from "@/components/alerts/issues/last-week-trend-coupon";
import { LastWeekTrendBestSellerRank } from "@/components/alerts/issues/last-week-trend-best-seller-rank";
import { LastWeekTrendOos }          from "@/components/alerts/issues/last-week-trend-oos";
import { LastWeekTrendSov }          from "@/components/alerts/issues/last-week-trend-sov";
import { LastWeekTrendMediaSpend }   from "@/components/alerts/issues/last-week-trend-media-spend";
import { LastWeekTrendConversion }   from "@/components/alerts/issues/last-week-trend-conversion";
import { LastWeekTrendKeywordRank }  from "@/components/alerts/issues/last-week-trend-keyword-rank";
import { CouponIssue }               from "@/components/alerts/issues/coupon";
import {
  ConversionIssue,
  getConversionIssueProps,
  getConversionDiagnosis,
  type ConversionState,
} from "@/components/alerts/issues/conversion";
import {
  MediaSpendIssue,
  getMediaSpendIssueProps,
} from "@/components/alerts/issues/media-spend";

// ─── Types ────────────────────────────────────────────────────────────────────

// All issue types that have a designed card.
// "organic-keyword" shares a renderer with "keyword-rank-drop" until a dedicated component is built.
type IssueCardType =
  | "lost-buy-box"       // LostBuyBoxIssue
  | "promo-badge"        // PromoBadgeIssue
  | "deals-page"         // DealPageVisibilityIssue
  | "star-rating"        // StarRatingIssue
  | "best-seller-rank"   // BestSellerRankIssue
  | "keyword-rank-drop"  // KeywordRankDropIssue
  | "sov-drop"           // SovDropIssue
  | "organic-keyword"    // KeywordRankDropIssue (reused)
  | "coupon"             // CouponIssue
  | "conversion"         // ConversionIssue
  | "media-spend"        // MediaSpendIssue
  | "out-of-stock"       // OutOfStockIssue
  | "shipping-speed";   // ShippingSpeedIssue

type KpiStat = {
  label: string;
  period: string;
  value: string;
  valueColor: string;
  sub: string;
};

type StatusPill = {
  label: string;
  value: string;
  status: "ok" | "warning" | "info";
};

type LiveStatus = "ok" | "warning" | "bad";

type RootCause = {
  id: string;
  icon: React.ReactNode;
  label: string;
  impact: string | null;
  // Short label shown next to the impact value, e.g. "revenue at risk"
  impactLabel?: string;
  statusLabel: string;
  statusStyle: string;
  description: string;
  // Current live health of this issue — drives the dot colour in the row header
  liveStatus: LiveStatus;
  // When set, renders the matching issue card inside the expanded row
  issueCardType?: IssueCardType;
  // Conversion issue card — drives OK / Dropping Fast / Dropped mock data
  conversionState?: ConversionState;
  // When true, renders the merged LastWeekTrendBuyBox widget
  showBuyBoxTrend?: boolean;
  // When true, renders the merged LastWeekTrendPromoBadge widget
  showPromoBadgeTrend?: boolean;
  // When true, renders the merged LastWeekTrendDealPage widget
  showDealPageTrend?: boolean;
  // When true, renders the merged LastWeekTrendCoupon widget
  showCouponTrend?: boolean;
  // When true, renders the merged LastWeekTrendBestSellerRank widget
  showBsrTrend?: boolean;
  // When true, renders LastWeekTrendOos
  showOosTrend?: boolean;
  // When true, renders LastWeekTrendSov
  showSovTrend?: boolean;
  // When true, renders LastWeekTrendMediaSpend
  showMediaSpendTrend?: boolean;
  // When true, renders LastWeekTrendConversion
  showConversionTrend?: boolean;
  // When true, renders LastWeekTrendKeywordRank
  showKeywordRankTrend?: boolean;
};

type AnalysisBlock = { heading: string; body: string };

type Recommendation = { action: string; detail: string };

// A named group of root causes rendered as its own card with a label
type RootCauseGroup = { label: string; causes: RootCause[] };

type RcaData = {
  kpis: KpiStat[];
  statusPills: StatusPill[];
  alertBanner: string | null;
  chartData: { week: string; plan: number; actual: number | null }[];
  chartCaption: string;
  rootCauses: RootCauseGroup[];
  rcaSummary: string;
  rootCausesLastChecked: string;
  analysisBlocks: AnalysisBlock[];
  recommendations: Recommendation[];
  followUpQuestions: string[];
};

// ─── Text-only root causes (no issue card designed) ───────────────────────────

// Tooltip shown when hovering the dollar impact chip on each issue row
const REVENUE_IMPACT_TOOLTIP = "Estimated revenue impacted";

const CAUSE_BSR: RootCause = {
  id: "bsr",
  icon: <Award className="h-4 w-4" />,
  label: ISSUE_NAME.BSR.rca,
  impact: "−$18.4K",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  statusLabel: "Dropped",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description: "",
  issueCardType: "best-seller-rank",
  showBsrTrend: true,
};

const CAUSE_MEDIA: RootCause = {
  id: "media",
  icon: <DollarSign className="h-4 w-4" />,
  label: ISSUE_NAME.MEDIA_SPEND.rca,
  impact: "−$42.3K",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  statusLabel: "Threshold Breached",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description:
    "Spend cut on all top-10 keywords in the last 7 days. Total keyword spend (all KWs): $1,240 Last 7 Days vs. $1,580 Previous 7 Days.",
  issueCardType: "media-spend",
  showMediaSpendTrend: true,
};

const CAUSE_OOS: RootCause = {
  id: "oos",
  icon: <Package className="h-4 w-4" />,
  label: ISSUE_NAME.STOCK.rca,
  impact: "−$8.2K",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  statusLabel: "OOS",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description: "SKU is out of stock. Revenue loss accumulating.",
  issueCardType: "out-of-stock",
  showOosTrend: true,
};

const CAUSE_SHIP: RootCause = {
  id: "ship",
  icon: <Truck className="h-4 w-4" />,
  label: ISSUE_NAME.SHIPPING.rca,
  impact: null,
  statusLabel: "Slow",
  statusStyle: "border-amber-100 bg-amber-50/50 text-amber-600",
  liveStatus: "warning",
  description:
    "Delivery is averaging 4.2 days across 5 markets — 2.2 days slower than standard Prime.",
  issueCardType: "shipping-speed",
};

// Convenience bundle — attached to every SKU alongside its specific causes
const COMMON_CAUSES: RootCause[] = [CAUSE_MEDIA, CAUSE_OOS, CAUSE_SHIP];

// ─── Root causes with designed issue cards ────────────────────────────────────

// 1. Lost Buy Box
const CAUSE_LBB: RootCause = {
  id: "lbb",
  icon: <ShoppingCart className="h-4 w-4" />,
  label: ISSUE_NAME.LOST_BUY_BOX.rca,
  impact: "−$119.7K",
  statusLabel: "Lost",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  description:
    "You've lost the Buy Box on an important SKU.",
  issueCardType: "lost-buy-box",
  showBuyBoxTrend: true,
};

// 2. Missing promo badge
const CAUSE_PROMO_BADGE: RootCause = {
  id: "deal",
  icon: <Megaphone className="h-4 w-4" />,
  label: ISSUE_NAME.PROMO_BADGE.rca,
  impact: "−$4.2K",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  statusLabel: "Missing",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description:
    "Matching event ($349.99) active May 10–30 but the deal badge has not appeared on the PDP since launch.",
  issueCardType: "promo-badge",
  showPromoBadgeTrend: true,
};

// 3. Product not on deals page
const CAUSE_DEALS_PAGE: RootCause = {
  id: "deals",
  icon: <ShoppingBag className="h-4 w-4" />,
  label: ISSUE_NAME.DEAL_PAGE.rca,
  impact: "−$12.6K",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  statusLabel: "Missing",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description: "",
  issueCardType: "deals-page",
  showDealPageTrend: true,
};

// 4. Coupon detected on PDP
const CAUSE_COUPON: RootCause = {
  id: "coupon",
  icon: <Tag className="h-4 w-4" />,
  label: ISSUE_NAME.COUPON.rca,
  impact: "−$3.8K",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  statusLabel: "Detected",
  statusStyle: "border-amber-100 bg-amber-50/50 text-amber-600",
  liveStatus: "warning",
  description: "Coupon history for this SKU's PDP is available below, detailing status changes and coupon values.",
  issueCardType: "coupon",
  showCouponTrend: true,
};

// 5. Review rating dropped
const CAUSE_STAR_RATING: RootCause = {
  id: "star",
  icon: <Star className="h-4 w-4" />,
  label: ISSUE_NAME.RATING.rca,
  impact: "−$24.5K",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  statusLabel: "Dropped",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description:
    "Your rating has dropped in the last 24 hours",
  issueCardType: "star-rating",
};

// 5. Rank Dropped (paid / blended)
const CAUSE_KRD: RootCause = {
  id: "krd",
  icon: <Shield className="h-4 w-4" />,
  label: ISSUE_NAME.KEYWORD_RANK.rca,
  impact: "−$31.2K",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  statusLabel: "Dropped",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description:
    "Top keywords dropped 6–8 positions after a content update, pushing off page 1 for high-volume terms.",
  issueCardType: "keyword-rank-drop",
  showKeywordRankTrend: true,
};

// 6. SoV dropped
const CAUSE_SOV: RootCause = {
  id: "sov",
  icon: <PieChart className="h-4 w-4" />,
  label: ISSUE_NAME.SOV.rca,
  impact: "−$28.4K",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  statusLabel: "Dropped",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description:
    "SP SoV dropped from 5.0% → 4.0% as the leading competitor holds 6% across all tracked terms.",
  issueCardType: "sov-drop",
  showSovTrend: true,
};

// 7. Conversion rate anomaly — three health states
const CAUSE_CONVERSION_DROPPED: RootCause = {
  id: "conversion-dropped",
  icon: <Funnel className="h-4 w-4" />,
  label: ISSUE_NAME.CONVERSION.rca,
  impact: "−$56.8K",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  statusLabel: "Dropped",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description: getConversionDiagnosis("dropped"),
  issueCardType: "conversion",
  conversionState: "dropped",
  showConversionTrend: true,
};

const CAUSE_CONVERSION_DROPPING: RootCause = {
  id: "conversion-dropping",
  icon: <Funnel className="h-4 w-4" />,
  label: ISSUE_NAME.CONVERSION.rca,
  impact: "−$22.1K",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  statusLabel: "Dropping Fast",
  statusStyle: "border-amber-100 bg-amber-50/50 text-amber-600",
  liveStatus: "warning",
  description: getConversionDiagnosis("dropping-fast"),
  issueCardType: "conversion",
  conversionState: "dropping-fast",
  showConversionTrend: true,
};

const CAUSE_CONVERSION_OK: RootCause = {
  id: "conversion-ok",
  icon: <Funnel className="h-4 w-4" />,
  label: ISSUE_NAME.CONVERSION.rca,
  impact: null,
  statusLabel: "OK",
  statusStyle: "border-slate-200 bg-slate-50/50 text-slate-500",
  liveStatus: "ok",
  description: getConversionDiagnosis("ok"),
  issueCardType: "conversion",
  conversionState: "ok",
};

// 8. Organic keyword issue
const CAUSE_ORGANIC: RootCause = {
  id: "organic",
  icon: <TrendingDown className="h-4 w-4" />,
  label: "Organic Keyword Issue",
  impact: "−$19.7K",
  impactLabel: REVENUE_IMPACT_TOOLTIP,
  statusLabel: "Dropped",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description:
    "Organic rank declined on 3 high-volume terms after an A+ content change removed keyword-rich copy. Impressions down 34% WoW.",
  issueCardType: "organic-keyword",
};

// ─── neutral() helper ──────────────────────────────────────────────────────────
// Returns a copy of a cause with OK/slate status and no expandable issue card.
// Used to fill in causes that are healthy for a given SKU so every SKU always
// shows the same complete list of root cause rows.

const OK_STYLE = "border-slate-200 bg-slate-50/50 text-slate-500";

function neutral(cause: RootCause): RootCause {
  return {
    ...cause,
    statusLabel: "OK",
    statusStyle: OK_STYLE,
    liveStatus: "ok",
    issueCardType: undefined,
    showBuyBoxTrend: undefined,
    showPromoBadgeTrend: undefined,
    impact: null,
    impactLabel: undefined,
  };
}

// ─── Standard 4-group layout ───────────────────────────────────────────────────
// All SKUs always render the same 4 groups with the same 14 cause rows.
// Per-SKU differences are expressed by passing the active (problem) cause
// constant vs neutral() for healthy rows.

function buildGroups(sku: SkuAlert): RootCauseGroup[] {
  // ── B08H8JZKDF  Blender — traffic & SoV problems ──────────────────────────
  if (sku.asin === "B08H8JZKDF") {
    return [
      { label: "PDP & Promos",       causes: [neutral(CAUSE_LBB), neutral(CAUSE_PROMO_BADGE), neutral(CAUSE_DEALS_PAGE), neutral(CAUSE_COUPON)] },
      { label: "Product Reputation", causes: [neutral(CAUSE_BSR), neutral(CAUSE_STAR_RATING)] },
      { label: "Fulfilment",         causes: [CAUSE_OOS, CAUSE_SHIP] },
      { label: "Search & Traffic",   causes: [CAUSE_SOV, CAUSE_CONVERSION_DROPPING, CAUSE_KRD, CAUSE_MEDIA] },
    ];
  }

  // ── B000BVFYU8  Kettle — reputation & keyword issues ──────────────────────
  if (sku.asin === "B000BVFYU8") {
    return [
      { label: "PDP & Promos",       causes: [neutral(CAUSE_LBB), neutral(CAUSE_PROMO_BADGE), neutral(CAUSE_DEALS_PAGE), neutral(CAUSE_COUPON)] },
      { label: "Product Reputation", causes: [neutral(CAUSE_BSR), CAUSE_STAR_RATING] },
      { label: "Fulfilment",         causes: [CAUSE_OOS, CAUSE_SHIP] },
      { label: "Search & Traffic",   causes: [neutral(CAUSE_SOV), CAUSE_CONVERSION_OK, CAUSE_ORGANIC, CAUSE_MEDIA] },
    ];
  }

  // ── B0BJZW4CLC  Cooker — deals page + SoV ─────────────────────────────────
  if (sku.asin === "B0BJZW4CLC") {
    return [
      { label: "PDP & Promos",       causes: [neutral(CAUSE_LBB), neutral(CAUSE_PROMO_BADGE), CAUSE_DEALS_PAGE, neutral(CAUSE_COUPON)] },
      { label: "Product Reputation", causes: [neutral(CAUSE_BSR), neutral(CAUSE_STAR_RATING)] },
      { label: "Fulfilment",         causes: [CAUSE_OOS, CAUSE_SHIP] },
      { label: "Search & Traffic",   causes: [CAUSE_SOV, neutral(CAUSE_CONVERSION_OK), neutral(CAUSE_KRD), CAUSE_MEDIA] },
    ];
  }

  // ── Default (B00I0DI0Z6 Food Processor) — full active set ──────────────────
  return [
    { label: "PDP & Promos",       causes: [CAUSE_LBB, CAUSE_PROMO_BADGE, CAUSE_DEALS_PAGE, CAUSE_COUPON] },
    { label: "Product Reputation", causes: [CAUSE_BSR, CAUSE_STAR_RATING] },
    { label: "Fulfilment",         causes: [CAUSE_OOS, CAUSE_SHIP] },
    { label: "Search & Traffic",   causes: [CAUSE_SOV, CAUSE_CONVERSION_DROPPED, CAUSE_KRD, CAUSE_MEDIA] },
  ];
}

function getRcaData(sku: SkuAlert): RcaData {

  return {
    kpis: [
      {
        label: "Last Week",
        period: "May 3–9",
        value: "-$227.7K",
        valueColor: "text-red-600",
        sub: "$846 of $228.5K plan · 37.0% attainment",
      },
      {
        label: "WTD",
        period: "May 10–13",
        value: "$126.3K",
        valueColor: "text-slate-800",
        sub: "in sales · 49.2% of week elapsed",
      },
      {
        label: "Projected EOW",
        period: "May 10–16",
        value: "+$29.6K vs plan",
        valueColor: "text-emerald-600",
        sub: "$229K plan · $258.3K projected · 112.9%",
      },
    ],
    statusPills: [
      { label: "Buy Box",         value: "Buy Box Lost (3P Seller)", status: "warning" },
      { label: "Stock",           value: "In Stock",                 status: "ok"      },
      { label: "Deal Visibility", value: "Badge Missing",            status: "warning" },
      { label: "Shipping Speed",  value: "Thu May 14 (Prime)",       status: "info"    },
    ],
    alertBanner: null,
    chartData: [
      { week: "Mar 24", plan: 285, actual: 272  },
      { week: "Mar 31", plan: 288, actual: 295  },
      { week: "Apr 7",  plan: 291, actual: 318  },
      { week: "Apr 14", plan: 293, actual: 325  },
      { week: "Apr 21", plan: 295, actual: 302  },
      { week: "Apr 28", plan: 295, actual: 88   },
      { week: "May 5",  plan: 298, actual: 126  },
      { week: "May 12", plan: 300, actual: null },
    ],
    chartCaption:
      "Revenue collapsed in the week of May 3 (100% LBB all 7 days) after a strong run through Apr 5–19; recovery is underway this week with buy box reclaimed.",
    rootCauses: buildGroups(sku),
    rcaSummary:
      "Revenue collapsed after SAS price jumped to $529.99 on May 3, losing the buy box for the full week. Recovery has started this week, but a missing deal badge is still limiting conversion.",
    rootCausesLastChecked: "11:35 AM today (2h ago)",
    analysisBlocks: [
      {
        heading: "Primary cause — Lost Buy Box (May 3–9)",
        body: "SAS price jumped to $529.99 on May 3 — ~$170 above 3P sellers at $344–$379. amazon.com lost the buy box all week; 3P captured ~$120K (~53% of the gap).",
      },
      {
        heading: "Secondary cause — media spend cuts",
        body: "Top keywords saw WoW spend cuts, including 'vacuum cleaners for home' (−$1.7K spend, −$37K ad sales). Less paid traffic while buy box was lost removed any recovery path.",
      },
      {
        heading: "This week — recovery in progress",
        body: "Buy box reclaimed at $349.99; RTS projects $258K (+13% vs plan). Deal badge still missing May 10–13, limiting conversion on the $180 price cut.",
      },
    ],
    recommendations: [
      {
        action: "Escalate the missing deal badge immediately.",
        detail:
          "The Matching event at $349.99 has been running since May 10 without a deal badge on the PDP. Raise a Vendor Central or Amazon Partner case today — every day the badge is absent is a missed conversion opportunity on an otherwise competitive price against $529.99 list.",
      },
      {
        action: "Investigate the SAS price spike to $529.99.",
        detail:
          "The buy box collapse was directly triggered by the SAS price jumping from ~$300 to $529.99 on May 3. Audit pricing controls and establish guardrails so that SAS price changes exceeding the estimated 3P floor price by more than a defined threshold trigger an alert before going live.",
      },
      {
        action: "Reinvest media on high-SFR, high-volume keywords.",
        detail:
          "'Vacuum cleaners for home' (SFR 6,346) and 'vacuum cleaner' (SFR 3,404) both saw spend cuts last week. With the buy box won and a $349.99 promo price in market, restoring spend on these terms will maximize traffic and conversion recovery.",
      },
      {
        action: "Monitor 3P seller re-entry.",
        detail:
          "AMZDistributor, Choice Electronics, Hello Good Deal, and Hotwired were all competing aggressively at $344–$382 last week. Set price-monitoring alerts so that any of these sellers re-enter below $349.99 — which could trigger another buy box loss during the Matching event window.",
      },
    ],
    followUpQuestions: [
      `Which ${sku.category} SKUs are most at risk of missing plan this week?`,
      "Are there other active promo SKUs missing deal badges this week?",
      `What is the 8-week sales gap trend for the ${sku.category} sub-category overall?`,
      "Which 3P sellers have caused the most LBB revenue loss in the last 4 weeks?",
    ],
  };
}

// ─── Issue card renderer ───────────────────────────────────────────────────────
// "organic-keyword" reuses KeywordRankDropIssue until a dedicated component is built.

function RootCauseIssueCard({
  type,
  conversionState = "dropped",
  asin,
  brand,
}: {
  type: IssueCardType;
  conversionState?: ConversionState;
  asin?: string;
  brand?: string;
}) {
  switch (type) {
    case "lost-buy-box":
      return (
        <LostBuyBoxIssue
          yourBrand="Shark"
          winnerBrand="Choice Electronics"
          yourPrice="$18.99"
          winnerPrice="$17.49"
          yourAvailability="In Stock"
          winnerAvailability="In Stock"
          yourRating={3.2}
          winnerRating={4.3}
        />
      );

    case "promo-badge":
      return (
        <PromoBadgeIssue
          promoDateRange="28 Apr to 10 May"
          badgeSeenCrawls={0}
          checks={[
            { label: "Is Promo Badge Visible?",                  passed: false },
            { label: "Does Original Price Have Strikethrough?",  passed: true  },
            { label: "Is Selling Price Correct?",                passed: true  },
            { label: "Is Discount % Visible?",                   passed: false },
            { label: "Is Discount % Correct?",                   passed: true  },
            { label: "Are You the Buy Box Winner?",              passed: false },
          ]}
          currentOriginalPrice="$25.99"
          currentSellingPrice="$25.99"
          expectedOriginalPrice="$18.99"
          expectedSellingPrice="$19.99"
        />
      );

    case "deals-page":
      return <DealPageVisibilityIssue />;

    case "star-rating":
      return (
        <StarRatingIssue
          oldRating={4.3}
          oldReviewCount={722}
          oldWrittenReviewCount={210}
          newRating={3.2}
          reviewCount={736}
          writtenReviewCount={230}
          newReviewsSinceYesterday={20}
          latestLowStarReview={{
            stars: 1,
            excerpt: "Product stopped working after 3 weeks. Suction completely gone and the battery barely lasts 10 minutes. Extremely disappointed for the price.",
            timeAgo: "3 hours ago",
          }}
        />
      );

    case "best-seller-rank":
      return (
        <BestSellerRankIssue
          previousRank={12}
          currentRank={31}
          category="Food Processors"
        />
      );

    case "keyword-rank-drop":
    case "organic-keyword":
      return (
        <KeywordRankDropIssue
          keywords={[
            {
              keyword: "food processor 8 cup",
              organicPreviousRank: 3,
              organicCurrentRank: 9,
              paidPreviousRank: 5,
              paidCurrentRank: 11,
            },
            {
              keyword: "digital food processor",
              organicPreviousRank: 8,
              organicCurrentRank: 12,
              paidPreviousRank: 10,
              paidCurrentRank: 14,
            },
            {
              keyword: "food chopper electric",
              organicPreviousRank: 12,
              organicCurrentRank: 15,
              paidPreviousRank: null,
              paidCurrentRank: null,
            },
          ]}
        />
      );

    case "coupon": {
      const now = Date.now();
      const hr = 3_600_000;
      return (
        <CouponIssue
          asin={asin}
          yourBrand={brand}
          scrapes={[
            {
              // Multiple coupons at the same scrape time
              timestamp: now - 3 * hr,
              detected: true,
              buyBoxWinner: "Shark",
              coupons: [
                "Apply $2.95 coupon",
                "Save 10%: Coupon available when you select Subscribe & Save .",
              ],
            },
            {
              // Dollar-off coupon
              timestamp: now - 6 * hr,
              detected: true,
              buyBoxWinner: "Dyson (3P)",
              coupons: ["Apply $2.95 coupon"],
            },
            {
              // No coupon detected
              timestamp: now - 9 * hr,
              detected: false,
              buyBoxWinner: "Shark",
            },
            {
              // Percentage coupon
              timestamp: now - 12 * hr,
              detected: true,
              buyBoxWinner: "Hotwired (3P)",
              coupons: ["Apply 15% coupon"],
            },
          ]}
        />
      );
    }

    case "conversion":
      return <ConversionIssue {...getConversionIssueProps(conversionState)} />;

    case "sov-drop":
      return (
        <SovDropIssue
          spPrev={5.0}
          spCurr={4.0}
          spCompetitor={6}
          sbPrev={2.5}
          sbCurr={2.0}
          sbCompetitor={6}
          keywords={[
            { keyword: '"Shark Cordless Vacuum"',           spFrom: 11.4, spTo: 9.5,  sbFrom: 11.4, sbTo: 9.5  },
            { keyword: '"Shark Vacuum"',                    spFrom: 16.3, spTo: 11.5, sbFrom: 16.3, sbTo: 11.5 },
            { keyword: '"Shark Stick Vacuum"',              spFrom: 15.2, spTo: 11.3, sbFrom: 15.2, sbTo: 11.3 },
            { keyword: '"Shark Pro cordless stick Vacuum"', spFrom: 11.0, spTo: 7.8,  sbFrom: 11.0, sbTo: 7.8  },
            { keyword: '"Shark NX23 Vacuum"',               spFrom: 9.0,  spTo: 6.4,  sbFrom: 9.0,  sbTo: 6.4  },
          ]}
        />
      );

    case "media-spend":
      return <MediaSpendIssue {...getMediaSpendIssueProps()} />;

    case "out-of-stock":
      return <OutOfStockIssue />;

    case "shipping-speed":
      return <ShippingSpeedIssue />;
  }
}

// Mock rows for the Promo Badge 7-day trend table.
// Mock days for the Promo Badge 7-day trend table (dates = columns, metrics = rows).
const PROMO_BADGE_TREND_ROWS = [
  { date: "May 10", expectedOnPromo: true,  badgeMissingCrawls: 6, strikethroughMissingCrawls: 0, totalCrawls: 6 },
  { date: "May 11", expectedOnPromo: true,  badgeMissingCrawls: 6, strikethroughMissingCrawls: 0, totalCrawls: 6 },
  { date: "May 12", expectedOnPromo: false, badgeMissingCrawls: 0, strikethroughMissingCrawls: 0, totalCrawls: 6 },
  { date: "May 13", expectedOnPromo: true,  badgeMissingCrawls: 6, strikethroughMissingCrawls: 6, totalCrawls: 6 },
  { date: "May 14", expectedOnPromo: true,  badgeMissingCrawls: 6, strikethroughMissingCrawls: 0, totalCrawls: 6 },
  { date: "May 15", expectedOnPromo: false, badgeMissingCrawls: 0, strikethroughMissingCrawls: 0, totalCrawls: 6 },
  { date: "May 16", expectedOnPromo: true,  badgeMissingCrawls: 6, strikethroughMissingCrawls: 6, totalCrawls: 6 },
];

// Mock days for the BSR 7-day trend table (dates = columns, metrics = rows).
const BSR_TREND_ROWS = [
  { date: "Jun 1", avgCategoryRank: 14, highestRank: 12, lowestRank: 18 },
  { date: "Jun 2", avgCategoryRank: 17, highestRank: 15, lowestRank: 21 }, // +3 → red
  { date: "Jun 3", avgCategoryRank: 15, highestRank: 13, lowestRank: 19 }, // -2 → neutral (improved but < threshold)
  { date: "Jun 4", avgCategoryRank: 22, highestRank: 19, lowestRank: 26 }, // +7 → red
  { date: "Jun 5", avgCategoryRank: 20, highestRank: 17, lowestRank: 24 }, // -2 → neutral
  { date: "Jun 6", avgCategoryRank: 18, highestRank: 15, lowestRank: 22 }, // -2 → neutral
  { date: "Jun 7", avgCategoryRank: 24, highestRank: 21, lowestRank: 28 }, // +6 → red
];

// Mock days for the Coupon 7-day trend table (dates = columns, metrics = rows).
const COUPON_TREND_ROWS = [
  { date: "Jun 1", detectedCrawls: 5, totalCrawls: 5 },
  { date: "Jun 2", detectedCrawls: 0, totalCrawls: 5 },
  { date: "Jun 3", detectedCrawls: 4, totalCrawls: 5 },
  { date: "Jun 4", detectedCrawls: 5, totalCrawls: 5 },
  { date: "Jun 5", detectedCrawls: 1, totalCrawls: 5 },
  { date: "Jun 6", detectedCrawls: 3, totalCrawls: 5 },
  { date: "Jun 7", detectedCrawls: 0, totalCrawls: 5 },
];

// Mock days for the Deal Page 7-day trend table (dates = columns, metrics = rows).
const DEAL_PAGE_TREND_ROWS = [
  { date: "Jun 1", expectedOnDealsPage: true,  visibleOnDealsPage: false, dealPageRank: 12 },
  { date: "Jun 2", expectedOnDealsPage: true,  visibleOnDealsPage: true,  dealPageRank: 4  },
  { date: "Jun 3", expectedOnDealsPage: false, visibleOnDealsPage: false, dealPageRank: 9  },
  { date: "Jun 4", expectedOnDealsPage: true,  visibleOnDealsPage: true,  dealPageRank: 7  },
  { date: "Jun 5", expectedOnDealsPage: true,  visibleOnDealsPage: false, dealPageRank: 15 },
  { date: "Jun 6", expectedOnDealsPage: false, visibleOnDealsPage: false, dealPageRank: 11 },
  { date: "Jun 7", expectedOnDealsPage: true,  visibleOnDealsPage: true,  dealPageRank: 2  },
];

// Mock days for the Buy Box 7-day trend table (dates = columns, metrics = rows).
// priceDiff = your price minus competitor price.
// Positive = you are more expensive (lost Buy Box). Negative = you were cheaper (won Buy Box).
const LBB_TREND_ROWS = [
  { date: "May 3", winRateWins: 6, winRateCrawls: 6, priceDiff: "-$22.40", revenueImpact: null      },
  { date: "May 4", winRateWins: 1, winRateCrawls: 6, priceDiff: "+$35.00", revenueImpact: "-$17.2K" },
  { date: "May 5", winRateWins: 0, winRateCrawls: 6, priceDiff: "+$48.50", revenueImpact: "-$16.8K" },
  { date: "May 6", winRateWins: 1, winRateCrawls: 6, priceDiff: "+$41.99", revenueImpact: "-$17.9K" },
  { date: "May 7", winRateWins: 5, winRateCrawls: 6, priceDiff: "-$18.75", revenueImpact: null      },
  { date: "May 8", winRateWins: 0, winRateCrawls: 6, priceDiff: "+$44.00", revenueImpact: "-$19.1K" },
  { date: "May 9", winRateWins: 1, winRateCrawls: 6, priceDiff: "+$29.50", revenueImpact: "-$15.0K" },
];

// Mock rows for OOS 7-day trend table.
const OOS_TREND_ROWS = [
  { date: "Jun 1", repOosPct: 0,   unavailabilityPct: 0,   unavailabilityCrawls: 0, onHandInventory: 312, revenueLost: 0    },
  { date: "Jun 2", repOosPct: 18,  unavailabilityPct: 24,  unavailabilityCrawls: 2, onHandInventory: 140, revenueLost: 1200 },
  { date: "Jun 3", repOosPct: 42,  unavailabilityPct: 58,  unavailabilityCrawls: 3, onHandInventory: 60,  revenueLost: 2800 },
  { date: "Jun 4", repOosPct: 71,  unavailabilityPct: 78,  unavailabilityCrawls: 5, onHandInventory: 22,  revenueLost: 4100 },
  { date: "Jun 5", repOosPct: 100, unavailabilityPct: 100, unavailabilityCrawls: 6, onHandInventory: 0,   revenueLost: 5600 },
  { date: "Jun 6", repOosPct: 100, unavailabilityPct: 100, unavailabilityCrawls: 6, onHandInventory: 0,   revenueLost: 5400 },
  { date: "Jun 7", repOosPct: 100, unavailabilityPct: 100, unavailabilityCrawls: 6, onHandInventory: 0,   revenueLost: 5200 },
];

// Mock rows for SoV 7-day trend table.
const SOV_TREND_ROWS = [
  { date: "Jun 1", spBrandedSovPct: 5.2, sbBrandedSovPct: 3.1, topCompetitorSovPct: 5.8 },
  { date: "Jun 2", spBrandedSovPct: 5.0, sbBrandedSovPct: 3.0, topCompetitorSovPct: 6.0 },
  { date: "Jun 3", spBrandedSovPct: 4.8, sbBrandedSovPct: 2.9, topCompetitorSovPct: 6.2 },
  { date: "Jun 4", spBrandedSovPct: 4.5, sbBrandedSovPct: 2.7, topCompetitorSovPct: 6.4 },
  { date: "Jun 5", spBrandedSovPct: 4.2, sbBrandedSovPct: 2.4, topCompetitorSovPct: 6.5 },
  { date: "Jun 6", spBrandedSovPct: 4.0, sbBrandedSovPct: 2.1, topCompetitorSovPct: 6.6 },
  { date: "Jun 7", spBrandedSovPct: 3.8, sbBrandedSovPct: 2.0, topCompetitorSovPct: 6.8 },
];

// Mock data for Media Spend 7-day trend table.
const MEDIA_SPEND_TREND_DATES = ["Jun 1", "Jun 2", "Jun 3", "Jun 4", "Jun 5", "Jun 6", "Jun 7"];
const MEDIA_SPEND_TREND_KEYWORDS = [
  { keyword: "vacuum cleaners for home",  dailySpend: [480, 460, 420, 400, 390, 380, 375] },
  { keyword: "robot vacuum cleaner",      dailySpend: [0,   0,   0,   0,   0,   0,   0  ] },
  { keyword: "shark cordless vacuum",     dailySpend: [360, 350, 340, 330, 320, 310, 300] },
  { keyword: "cordless stick vacuum",     dailySpend: [280, 270, 260, 255, 248, 240, 235] },
  { keyword: "stick vacuum cleaner",      dailySpend: [210, 200, 195, 190, 188, 185, 180] },
  { keyword: "Total (all KWs)", isTotal: true,
    dailySpend: [1330, 1280, 1215, 1175, 1146, 1115, 1090] },
];

// Mock rows for Conversion 7-day trend table.
const CONVERSION_TREND_ROWS = [
  { date: "Jun 1", unitCvrPct: 5.1, glanceViews: 12480, orderedUnits: 637 },
  { date: "Jun 2", unitCvrPct: 5.0, glanceViews: 12350, orderedUnits: 618 },
  { date: "Jun 3", unitCvrPct: 4.8, glanceViews: 12290, orderedUnits: 590 },
  { date: "Jun 4", unitCvrPct: 4.5, glanceViews: 12340, orderedUnits: 555 },
  { date: "Jun 5", unitCvrPct: 4.2, glanceViews: 12410, orderedUnits: 521 },
  { date: "Jun 6", unitCvrPct: 3.9, glanceViews: 12280, orderedUnits: 479 },
  { date: "Jun 7", unitCvrPct: 3.8, glanceViews: 12190, orderedUnits: 463 },
];

// Mock data for Keyword Rank 7-day trend table.
// Coloring rule: delta vs PREVIOUS day.
//   drop  > 5  → bg-rose-50    (rank number went up by more than 5 vs yesterday)
//   gain >= 5  → bg-emerald-50 (rank number went down by 5+ vs yesterday)
const KEYWORD_RANK_TREND_DATES = ["Jun 1", "Jun 2", "Jun 3", "Jun 4", "Jun 5", "Jun 6", "Jun 7"];
const KEYWORD_RANK_TREND_KEYWORDS = [
  {
    keyword: "vacuum cleaners for home",
    // Organic drops sharply Jun 4 (+8), partial recovery Jun 6
    organicRanks: [8,  10, 11, 19, 21, 14, 15],
    // Paid holds steady then loses position Jun 5–6
    paidRanks:    [2,   2,  3,  3,  6,  8,  7],
  },
  {
    keyword: "shark cordless vacuum",
    // Organic drops Jun 3 (+7), slow recovery by Jun 7
    organicRanks: [6,   8, 15, 17, 18, 19, 13],
    // Paid relatively stable, slips slightly mid-week
    paidRanks:    [1,   1,  2,  2,  3,  4,  3],
  },
  {
    keyword: "cordless stick vacuum",
    // Organic gradual drift downward — no single big swing
    organicRanks: [12, 13, 14, 15, 16, 17, 18],
    // Paid drops off Jun 4 onward — budget likely paused
    paidRanks:    [3,   3,  4, null, null, null, 5],
  },
];

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-medium text-slate-800">
      {children}
    </h3>
  );
}

// ─── 0. Empty state — shown when ALL sections have no data ────────────────────

function EmptyRcaState() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <SearchX className="h-8 w-8 text-slate-300" />
      <p className="text-sm font-medium text-slate-500">Analysis not yet available</p>
      <p className="text-xs text-slate-400">
        Root cause data will appear here once the investigation completes.
      </p>
    </div>
  );
}

// ─── 1. KPI stats row ─────────────────────────────────────────────────────────

function KpiRow({ kpis, rcaSummary }: { kpis: KpiStat[]; rcaSummary: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-medium text-slate-800 tracking-[0.05px]">{rcaSummary}</h3>
      <div className="grid grid-cols-3 gap-4">
      {kpis.map((k) => (
        <div key={k.label} className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* Title row */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-medium text-slate-600">{k.label}</span>
            <span className="text-sm text-slate-400">({k.period})</span>
          </div>
          {/* Value + sub grouped together */}
          <div className="flex flex-col gap-2">
            <p className={`text-2xl font-semibold leading-none ${k.valueColor}`}>
              {k.value.includes(" vs ") ? (
                <>
                  {k.value.split(" vs ")[0]}
                  <span className="ml-1.5 text-sm font-normal text-slate-400">
                    vs {k.value.split(" vs ")[1]}
                  </span>
                </>
              ) : (
                k.value
              )}
            </p>
            <p className="text-sm leading-snug text-slate-500">{k.sub}</p>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

// ─── 2. Status pills ──────────────────────────────────────────────────────────

const STATUS_DOT: Record<StatusPill["status"], string> = {
  ok:      "bg-emerald-500",
  warning: "bg-amber-400",
  info:    "bg-slate-400",
};

function StatusPillsRow({ pills }: { pills: StatusPill[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-slate-600">
        Live Now
      </span>
      {pills.map((p) => (
        <span
          key={p.label}
          className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[p.status]}`} />
          <span className="font-medium text-slate-400">{p.label}:</span>
          <span className={p.status === "warning" ? "font-semibold text-amber-600" : ""}>
            {p.value}
          </span>
        </span>
      ))}
    </div>
  );
}

// ─── 3. Alert banner ──────────────────────────────────────────────────────────

function AlertBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
      <p className="text-sm leading-relaxed text-amber-800">{message}</p>
    </div>
  );
}

// ─── 4. Revenue trend chart ───────────────────────────────────────────────────

function RevenueChart({ data, caption }: { data: RcaData["chartData"]; caption: string }) {
  const fmtK = (v: number) => `$${v}K`;

  return (
    <div className="flex flex-col gap-2">
      <SectionHeading>8 Week Revenue Trend</SectionHeading>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f4" vertical={false} />
          <YAxis
            tickFormatter={fmtK}
            width={44}
            tick={{ fontSize: 10, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
          />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip
            formatter={(value, name) => [
              typeof value === "number" ? fmtK(value) : value,
              name === "plan" ? "Plan" : "Actual",
            ]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }}
          />
          <ReferenceLine
            x="Apr 28"
            stroke="#fca5a5"
            strokeDasharray="3 3"
            label={{ value: "LBB", position: "top", fontSize: 9, fill: "#f87171" }}
          />
          <Line
            type="monotone"
            dataKey="plan"
            stroke="#d4d4d8"
            strokeDasharray="5 4"
            strokeWidth={1.5}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={{ r: 3, fill: "#7c3aed", strokeWidth: 0 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="max-w-[750px] text-[11px] leading-relaxed text-slate-400">{caption}</p>
    </div>
  );
}

// ─── 5. Root causes accordion ─────────────────────────────────────────────────

// Colour map for the live-status dot
const LIVE_DOT_CLASS: Record<LiveStatus, string> = {
  ok:      "bg-emerald-500",
  warning: "bg-amber-400",
  bad:     "bg-red-500",
};

// Emphasise dollar figures inside diagnosis copy
function highlightDollarAmounts(text: string) {
  return text.split(/(\$[\d,]+(?:\.\d+)?[KMB]?)/g).map((part, i) =>
    /^\$/.test(part) ? (
      <span key={i} className="font-semibold text-slate-700">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function RootCauseRow({
  cause,
  isOpen,
  onToggle,
  asin,
  brand,
}: {
  cause: RootCause;
  isOpen: boolean;
  onToggle: () => void;
  asin?: string;
  brand?: string;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${isOpen ? "bg-white hover:bg-white" : "hover:bg-slate-50"}`}
      >
        {/* Group 1: dot + icon + label + status badge */}
        <span className="flex items-center gap-2">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${LIVE_DOT_CLASS[cause.liveStatus]}`}
            title={`Live: ${cause.liveStatus}`}
          />
          <span className="text-slate-500">{cause.icon}</span>
          <span className="text-sm font-medium text-slate-700">{cause.label}</span>
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cause.statusStyle}`}>
            {cause.statusLabel}
          </span>
        </span>

        {/* Group 2: impact chip — tooltip explains what the dollar figure means */}
        {cause.impact && (
          <Tooltip>
            <TooltipTrigger
              render={
                <span
                  className="ml-4 bg-slate-100 px-1 py-0.5 text-sm font-medium text-slate-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  {cause.impact}
                </span>
              }
            />
            <TooltipContent side="top">
              {cause.impactLabel ?? REVENUE_IMPACT_TOOLTIP}
            </TooltipContent>
          </Tooltip>
        )}

        {/* spacer pushes chevron to the far right */}
        <span className="flex-1" />
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="border-t-2 border-slate-200 bg-slate-50 px-4 pb-4 pt-2.5">
          {/* Description — shown only when there is text (visual cards carry their own copy) */}
          {cause.description && (
            <div className="flex items-start gap-10">
              <p className="flex-1 text-sm leading-relaxed text-slate-500">
                {highlightDollarAmounts(cause.description)}
              </p>
              <button
                type="button"
                className="hidden shrink-0 rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-800"
              >
                Mark as resolved
              </button>
            </div>
          )}
          {cause.issueCardType && (
            <div className={cause.description ? "mt-3" : ""}>
              <RootCauseIssueCard
                type={cause.issueCardType}
                conversionState={cause.conversionState}
                asin={asin}
                brand={brand}
              />
            </div>
          )}
          {cause.showBuyBoxTrend && (
            <div className="mt-3">
              <LastWeekTrendBuyBox
                period="May 3–9"
                lbbPercent="71%"
                revenueLost="-$86.0K"
                primaryCompetitor="ElectroHub Direct"
                primaryCompetitorType="3P Seller"
                yourAvgPrice="$529.99"
                competitorAvgPrice="$362.09"
                avgPriceGap="+$37.60"
                rows={LBB_TREND_ROWS}
              />
            </div>
          )}
          {cause.showPromoBadgeTrend && (
            <div className="mt-3">
              <LastWeekTrendPromoBadge
                period="May 10–16"
                badgeMissingDays="7 / 7 days"
                estRevenueImpact="-$4,200"
                listPriceMismatch="7 / 7 days"
                sellingPriceMismatch="7 / 7 days"
                listPriceVisibility="2 / 7 days"
                noStrikethroughOnMsrp="7 / 7 days"
                badgeShowing={false}
                rows={PROMO_BADGE_TREND_ROWS}
              />
            </div>
          )}
          {cause.showDealPageTrend && (
            <div className="mt-3">
              <LastWeekTrendDealPage period="Jun 1–7" rows={DEAL_PAGE_TREND_ROWS} />
            </div>
          )}
          {cause.showCouponTrend && (
            <div className="mt-3">
              <LastWeekTrendCoupon period="Jun 1–7" rows={COUPON_TREND_ROWS} />
            </div>
          )}
          {cause.showBsrTrend && (
            <div className="mt-3">
              <LastWeekTrendBestSellerRank
                period="Jun 1–7"
                rows={BSR_TREND_ROWS}
                avgRankLast7d={19}
                currentRank={31}
              />
            </div>
          )}
          {cause.showOosTrend && (
            <div className="mt-3">
              <LastWeekTrendOos
                period="Jun 1–7"
                repOosPct={100}
                revenueLost7d={24300}
                unavailabilityPct={100}
                onHandInventory={0}
                severity="High"
                rows={OOS_TREND_ROWS}
              />
            </div>
          )}
          {cause.showSovTrend && (
            <div className="mt-3">
              <LastWeekTrendSov
                period="Jun 1–7"
                rows={SOV_TREND_ROWS}
                spBaseline={3.5}
                sbBaseline={3.5}
              />
            </div>
          )}
          {cause.showMediaSpendTrend && (
            <div className="mt-3">
              <LastWeekTrendMediaSpend
                period="Jun 1–7"
                dates={MEDIA_SPEND_TREND_DATES}
                keywords={MEDIA_SPEND_TREND_KEYWORDS}
              />
            </div>
          )}
          {cause.showConversionTrend && (
            <div className="mt-3">
              <LastWeekTrendConversion
                period="Jun 1–7"
                rows={CONVERSION_TREND_ROWS}
                cvrBaseline={4.5}
              />
            </div>
          )}
          {cause.showKeywordRankTrend && (
            <div className="mt-3">
              <LastWeekTrendKeywordRank
                period="Jun 1–7"
                dates={KEYWORD_RANK_TREND_DATES}
                keywords={KEYWORD_RANK_TREND_KEYWORDS}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RootCauses({
  groups,
  lastChecked,
  asin,
  brand,
}: {
  groups: RootCauseGroup[];
  lastChecked: string;
  asin?: string;
  brand?: string;
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Drop groups that have no causes
  const activeGroups = groups.filter((g) => g.causes.length > 0);

  return (
    <div className="flex flex-col gap-1">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <SectionHeading>Issues</SectionHeading>
        <p className="text-sm text-slate-500">Last updated {lastChecked}</p>
      </div>

      {/* One rounded card per group */}
      <div className="flex flex-col gap-3">
        {activeGroups.map((group) => (
          <div key={group.label}>
            {/* Group label — more prominent: darker, slightly larger */}
            <p className="mb-1.5 px-1 text-xs font-bold tracking-wide text-slate-600">
              {group.label}
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              {group.causes.map((cause, i) => (
                <div
                  key={cause.id}
                  className={i < group.causes.length - 1 ? "border-b border-slate-200" : ""}
                >
                  <RootCauseRow
                    cause={cause}
                    isOpen={openIds.has(cause.id)}
                    onToggle={() => toggle(cause.id)}
                    asin={asin}
                    brand={brand}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 6. Analysis text ─────────────────────────────────────────────────────────

function AnalysisSection({ blocks }: { blocks: AnalysisBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeading>Analysis</SectionHeading>
      {blocks.map((b) => (
        <div key={b.heading} className="max-w-[750px]">
          <p className="mb-1 text-sm font-semibold text-slate-700">{b.heading}</p>
          <p className="text-sm leading-relaxed text-slate-500">{b.body}</p>
        </div>
      ))}
    </div>
  );
}

// ─── 7. Recommendations ───────────────────────────────────────────────────────

function RecommendationsSection({ recs }: { recs: Recommendation[] }) {
  return (
    // Hidden for now — remove `hidden` to show again
    <div className="hidden flex flex-col gap-3">
      <SectionHeading>Recommendations</SectionHeading>
      <ol className="flex flex-col gap-3">
        {recs.map((r, i) => (
          <li key={r.action} className="flex max-w-[750px] gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-slate-800">{r.action}</span>{" "}
              {r.detail}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── 8. Feedback row — always rendered as a visual anchor ─────────────────────

function FeedbackRow() {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 pt-5">
      <p className="text-xs text-slate-400">
        Please help us improve the responses. Did you find that helpful?
      </p>
      <div className="flex items-center gap-2">
        <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
          <ThumbsUp className="h-4 w-4" />
        </button>
        <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Exported helper — lets the parent render follow-up questions separately ──

export function getFollowUpQuestions(sku: SkuAlert): string[] {
  return getRcaData(sku).followUpQuestions;
}

// ─── Main export ──────────────────────────────────────────────────────────────

// Three render variants:
//   "full"         — everything (default)
//   "trimmed"      — SKU metadata card + KPI cards + alert banner; used as the
//                    initial AI response while the full analysis (service B) loads
//   "root-causes"  — root cause groups only (service A data shown before chat triggers)
type SkuRcaVariant = "full" | "trimmed" | "root-causes";

type SkuRcaProps = {
  sku: SkuAlert;
  variant?: SkuRcaVariant;
};

// ── Compact SKU metadata card — shown at the top of the trimmed variant ────────
function SkuMetaCard({ sku }: { sku: SkuAlert }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{sku.skuName}</p>
          <p className="text-xs text-slate-400">
            <span className="font-mono">{sku.asin}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            {sku.category}
            {sku.alertType && (
              <>
                <span className="mx-1.5 text-slate-300">·</span>
                {sku.alertType}
              </>
            )}
          </p>
        </div>
        {sku.gapValue && (
          <span className="shrink-0 text-sm font-bold text-red-600">{sku.gapValue}</span>
        )}
      </div>
    </div>
  );
}

export function SkuRca({ sku, variant = "full" }: SkuRcaProps) {
  const data = getRcaData(sku);

  // ── root-causes variant — service A data, shown before chat triggers ──────
  if (variant === "root-causes") {
    const hasRootCauses = data.rootCauses.some((g) => g.causes.length > 0);
    return hasRootCauses ? (
      <div className="flex flex-col gap-8">
        <RootCauses groups={data.rootCauses} lastChecked={data.rootCausesLastChecked} asin={sku.asin} brand={sku.brand} />
      </div>
    ) : null;
  }

  // ── trimmed variant — metadata + KPIs + alert banner ─────────────────────
  if (variant === "trimmed") {
    return (
      <div className="flex flex-col gap-6">
        <SkuMetaCard sku={sku} />
        {data.kpis.length > 0 && <KpiRow kpis={data.kpis} rcaSummary={data.rcaSummary} />}
        {data.alertBanner && <AlertBanner message={data.alertBanner} />}
      </div>
    );
  }

  // ── full variant (default) ────────────────────────────────────────────────
  const hasContent =
    data.kpis.length > 0 ||
    data.statusPills.length > 0 ||
    !!data.alertBanner ||
    data.chartData.length > 0 ||
    data.rootCauses.some((g) => g.causes.length > 0) ||
    data.analysisBlocks.length > 0 ||
    data.recommendations.length > 0;

  return (
    <div className="flex flex-col gap-8">
      {!hasContent ? (
        <EmptyRcaState />
      ) : (
        <>
          {data.kpis.length > 0 && <KpiRow kpis={data.kpis} rcaSummary={data.rcaSummary} />}
          {data.alertBanner && <AlertBanner message={data.alertBanner} />}
          {data.rootCauses.some((g) => g.causes.length > 0) && (
            <RootCauses groups={data.rootCauses} lastChecked={data.rootCausesLastChecked} asin={sku.asin} brand={sku.brand} />
          )}
          {data.chartData.length > 0 && (
            <RevenueChart data={data.chartData} caption={data.chartCaption} />
          )}
          {data.analysisBlocks.length > 0 && <AnalysisSection blocks={data.analysisBlocks} />}
          {data.recommendations.length > 0 && (
            <RecommendationsSection recs={data.recommendations} />
          )}
        </>
      )}
      <FeedbackRow />
    </div>
  );
}
