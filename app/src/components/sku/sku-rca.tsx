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
  MessageSquareWarning,
  ShoppingBag,
  Funnel,
  Award,
  Shield,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SkuAlert } from "@/components/home/alerts-panel";
import { LostBuyBoxIssue }           from "@/components/alerts/issues/lost-buy-box";
import { PromoBadgeIssue }           from "@/components/alerts/issues/promo-badge";
import { SovDropIssue }              from "@/components/alerts/issues/sov-drop";
import { KeywordRankDropIssue }      from "@/components/alerts/issues/keyword-rank-drop";
import { StarRatingIssue }           from "@/components/alerts/issues/star-rating";
import { LastWeekTrendBuyBox }       from "@/components/alerts/issues/last-week-trend-buy-box";
import { LastWeekTrendPromoBadge }   from "@/components/alerts/issues/last-week-trend-promo-badge";
import { CouponIssue }               from "@/components/alerts/issues/coupon";
import {
  ConversionIssue,
  getConversionIssueProps,
  getConversionDiagnosis,
  type ConversionState,
} from "@/components/alerts/issues/conversion";

// ─── Types ────────────────────────────────────────────────────────────────────

// All 7 issue types that have a designed card.
// "deals-page" and "organic-keyword" share a renderer with "promo-badge"
// and "keyword-rank-drop" respectively until dedicated components are built.
type IssueCardType =
  | "lost-buy-box"       // LostBuyBoxIssue
  | "promo-badge"        // PromoBadgeIssue
  | "deals-page"         // PromoBadgeIssue (reused)
  | "star-rating"        // StarRatingIssue
  | "keyword-rank-drop"  // KeywordRankDropIssue
  | "sov-drop"           // SovDropIssue
  | "organic-keyword"    // KeywordRankDropIssue (reused)
  | "coupon"             // CouponIssue
  | "conversion";        // ConversionIssue

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
  rootCausesLastChecked: string;
  analysisBlocks: AnalysisBlock[];
  recommendations: Recommendation[];
  followUpQuestions: string[];
};

// ─── Text-only root causes (no issue card designed) ───────────────────────────

const CAUSE_BSR: RootCause = {
  id: "bsr",
  icon: <Award className="h-4 w-4" />,
  label: "Best Seller Rank",
  impact: null,
  statusLabel: "Dropped",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description:
    "BSR dropped from #12 → #31 in Vacuum Cleaners over the past two weeks, reducing category browse visibility.",
};

const CAUSE_MEDIA: RootCause = {
  id: "media",
  icon: <DollarSign className="h-4 w-4" />,
  label: "Media Spend",
  impact: null,
  statusLabel: "Threshold Breached",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description:
    "Spend cut on all top-10 keywords last week. Largest reduction on 'vacuum cleaners for home' (−$1,715 spend, −$37.3K sales WoW).",

};

const CAUSE_OOS: RootCause = {
  id: "oos",
  icon: <Package className="h-4 w-4" />,
  label: "Out of Stock",
  impact: null,
  statusLabel: "At Risk",
  statusStyle: "border-amber-100 bg-amber-50/50 text-amber-600",
  liveStatus: "warning",
  description: "No stock issues last week — 0% rep OOS and 0% unavailability.",
};

const CAUSE_SHIP: RootCause = {
  id: "ship",
  icon: <Truck className="h-4 w-4" />,
  label: "Shipping Speed",
  impact: null,
  statusLabel: "OK",
  statusStyle: "border-slate-200 bg-slate-50/50 text-slate-500",
  liveStatus: "ok",
  description: "Prime delivery available tomorrow (May 14). No extended delay risk detected.",
};

const CAUSE_REVIEW_SENTIMENT: RootCause = {
  id: "review",
  icon: <MessageSquareWarning className="h-4 w-4" />,
  label: "Review Sentiment",
  impact: null,
  statusLabel: "OK",
  statusStyle: "border-slate-200 bg-slate-50/50 text-slate-500",
  liveStatus: "ok",
  description: "4.2-star average across 2,298 reviews. 1-star rate at 11% — within benchmark.",
};

// Convenience bundle — attached to every SKU alongside its specific causes
const COMMON_CAUSES: RootCause[] = [CAUSE_MEDIA, CAUSE_OOS, CAUSE_SHIP, CAUSE_REVIEW_SENTIMENT];

// ─── Root causes with designed issue cards ────────────────────────────────────

// 1. Lost Buy Box
const CAUSE_LBB: RootCause = {
  id: "lbb",
  icon: <ShoppingCart className="h-4 w-4" />,
  label: "Buy Box",
  impact: "−$119.7K",
  statusLabel: "Lost",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  impactLabel: "estimated revenue at risk",
  description:
    "100% buy box loss May 3–9 — SAS price at $529.99 ceded every impression to 3P sellers at $344–$379.",
  issueCardType: "lost-buy-box",
  showBuyBoxTrend: true,
};

// 2. Missing promo badge
const CAUSE_PROMO_BADGE: RootCause = {
  id: "deal",
  icon: <Megaphone className="h-4 w-4" />,
  label: "Promo Badge",
  impact: null,
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
  label: "Deal Page Visibility",
  impact: null,
  statusLabel: "Missing",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description:
    "Active Lightning Deal is not surfacing on the Amazon Deals page, removing a high-intent discovery placement.",
  issueCardType: "deals-page",
};

// 4. Coupon detected on PDP
const CAUSE_COUPON: RootCause = {
  id: "coupon",
  icon: <Tag className="h-4 w-4" />,
  label: "Coupon",
  impact: null,
  statusLabel: "Detected",
  statusStyle: "border-amber-100 bg-amber-50/50 text-amber-600",
  liveStatus: "warning",
  description: "Coupon history for this SKU's PDP is available below, detailing status changes and coupon values.",
  issueCardType: "coupon",
};

// 5. Review rating dropped
const CAUSE_STAR_RATING: RootCause = {
  id: "star",
  icon: <Star className="h-4 w-4" />,
  label: "Rating",
  impact: null,
  statusLabel: "Dropped",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description:
    "Rating fell from 4.3 → 3.2 over 3 weeks following a batch of defect-related negative reviews.",
  issueCardType: "star-rating",
};

// 5. Rank Dropped (paid / blended)
const CAUSE_KRD: RootCause = {
  id: "krd",
  icon: <Shield className="h-4 w-4" />,
  label: "Keyword Rank",
  impact: null,
  statusLabel: "Dropped",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description:
    "Top keywords dropped 6–8 positions after a content update, pushing off page 1 for high-volume terms.",
  issueCardType: "keyword-rank-drop",
};

// 6. SoV dropped
const CAUSE_SOV: RootCause = {
  id: "sov",
  icon: <PieChart className="h-4 w-4" />,
  label: "Share of Voice",
  impact: null,
  statusLabel: "Dropped",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description:
    "SP SoV dropped from 5.0% → 4.0% as the leading competitor holds 6% across all tracked terms.",
  issueCardType: "sov-drop",
};

// 7. Conversion rate anomaly — three health states
const CAUSE_CONVERSION_DROPPED: RootCause = {
  id: "conversion-dropped",
  icon: <Funnel className="h-4 w-4" />,
  label: "Conversion",
  impact: null,
  statusLabel: "Dropped",
  statusStyle: "border-rose-100 bg-rose-50/50 text-rose-600",
  liveStatus: "bad",
  description: getConversionDiagnosis("dropped"),
  issueCardType: "conversion",
  conversionState: "dropped",
};

const CAUSE_CONVERSION_DROPPING: RootCause = {
  id: "conversion-dropping",
  icon: <Funnel className="h-4 w-4" />,
  label: "Conversion",
  impact: null,
  statusLabel: "Dropping Fast",
  statusStyle: "border-amber-100 bg-amber-50/50 text-amber-600",
  liveStatus: "warning",
  description: getConversionDiagnosis("dropping-fast"),
  issueCardType: "conversion",
  conversionState: "dropping-fast",
};

const CAUSE_CONVERSION_OK: RootCause = {
  id: "conversion-ok",
  icon: <Funnel className="h-4 w-4" />,
  label: "Conversion",
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
  impact: null,
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
      { label: "Product Reputation", causes: [neutral(CAUSE_BSR), neutral(CAUSE_STAR_RATING), CAUSE_REVIEW_SENTIMENT] },
      { label: "Fulfilment",         causes: [CAUSE_OOS, CAUSE_SHIP] },
      { label: "Search & Traffic",   causes: [CAUSE_SOV, CAUSE_CONVERSION_DROPPING, CAUSE_KRD, CAUSE_MEDIA] },
    ];
  }

  // ── B000BVFYU8  Kettle — reputation & keyword issues ──────────────────────
  if (sku.asin === "B000BVFYU8") {
    return [
      { label: "PDP & Promos",       causes: [neutral(CAUSE_LBB), neutral(CAUSE_PROMO_BADGE), neutral(CAUSE_DEALS_PAGE), neutral(CAUSE_COUPON)] },
      { label: "Product Reputation", causes: [neutral(CAUSE_BSR), CAUSE_STAR_RATING, CAUSE_REVIEW_SENTIMENT] },
      { label: "Fulfilment",         causes: [CAUSE_OOS, CAUSE_SHIP] },
      { label: "Search & Traffic",   causes: [neutral(CAUSE_SOV), CAUSE_CONVERSION_OK, CAUSE_ORGANIC, CAUSE_MEDIA] },
    ];
  }

  // ── B0BJZW4CLC  Cooker — deals page + SoV ─────────────────────────────────
  if (sku.asin === "B0BJZW4CLC") {
    return [
      { label: "PDP & Promos",       causes: [neutral(CAUSE_LBB), neutral(CAUSE_PROMO_BADGE), CAUSE_DEALS_PAGE, neutral(CAUSE_COUPON)] },
      { label: "Product Reputation", causes: [neutral(CAUSE_BSR), neutral(CAUSE_STAR_RATING), CAUSE_REVIEW_SENTIMENT] },
      { label: "Fulfilment",         causes: [CAUSE_OOS, CAUSE_SHIP] },
      { label: "Search & Traffic",   causes: [CAUSE_SOV, neutral(CAUSE_CONVERSION_OK), neutral(CAUSE_KRD), CAUSE_MEDIA] },
    ];
  }

  // ── Default (B00I0DI0Z6 Food Processor) — full active set ──────────────────
  return [
    { label: "PDP & Promos",       causes: [CAUSE_LBB, CAUSE_PROMO_BADGE, CAUSE_DEALS_PAGE, CAUSE_COUPON] },
    { label: "Product Reputation", causes: [CAUSE_BSR, CAUSE_STAR_RATING, CAUSE_REVIEW_SENTIMENT] },
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
    alertBanner:
      "Unresolved today: Active promo badge missing on PDP — Matching event at $349.99 (May 10–30) launched without badge visibility. No badge detected on any scrape from May 10–13.",
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
    rootCausesLastChecked: "Today, 9:42 AM",
    analysisBlocks: [
      {
        heading: "Primary cause — 100% Lost Buy Box all 7 days (May 3–9)",
        body: "The SAS price was raised sharply to $529.99 on May 3 (from ~$300 the prior weeks), opening a $150–$170 gap vs. 3P sellers offering $344–$379. amazon.com lost every buy box impression for the entire week. The estimated revenue captured by 3P sellers is $119,708 — approximately 53% of the $227.7K plan-vs-actual gap by deterministic SQI attribution. Only 2 units ($846) were sold through the first-party channel for the entire week.",
      },
      {
        heading: "Price trajectory context",
        body: "Prior weeks (Apr 5–19) show ASP around $299,999, consistent with a lower promotional price, and units of 1,100–1,200/week. The Apr 26 week also showed LBB (avg winning 3P price $376.94 vs. SAS $529.99), with 231 units at $303.98 ASP — suggesting 3P pressure was already building before the full collapse in May 3.",
      },
      {
        heading: "Secondary cause — media spend cuts amplified the traffic loss",
        body: "Every top-10 keyword by ad spend saw a WoW cut. The highest-volume term 'vacuum cleaners for home' (SFR 6,346) lost $1,715 in spend and $37.3K in ad-attributed sales WoW. Organic rank on 'shark lift away' worsened by 8 positions. With the buy box already lost, reduced paid visibility removed any recovery path.",
      },
      {
        heading: "Current week recovery context",
        body: "amazon.com has reclaimed the buy box at $349.99 and the current-week RTS projects $258.3K (+12.9% above plan). However, a Matching event badge has not appeared on the PDP on any day from May 10–13, constituting a live promo visibility failure that is suppressing the conversion benefit of the $180 price reduction vs. list.",
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
// "deals-page" reuses PromoBadgeIssue and "organic-keyword" reuses
// KeywordRankDropIssue until dedicated components are built.

function RootCauseIssueCard({
  type,
  conversionState = "dropped",
}: {
  type: IssueCardType;
  conversionState?: ConversionState;
}) {
  switch (type) {
    case "lost-buy-box":
      return (
        <LostBuyBoxIssue
          yourBrand="Shark"
          winnerBrand="dyson"
          yourPrice="$18.99"
          winnerPrice="$17.49"
          yourAvailability="In Stock"
          winnerAvailability="In Stock"
          yourRating={3.2}
          winnerRating={4.3}
          yourLbbRate="1/4"
          winnerLbbRate="2/4"
        />
      );

    case "promo-badge":
    case "deals-page":
      return (
        <PromoBadgeIssue
          promoDateRange="28 Apr to 10 May"
          checks={[
            { label: "Is Promo Badge Visible?",             passed: false },
            { label: "Is List Price Visible?",              passed: false },
            { label: "Is List Price Correct (MSRP)?",       passed: false },
            { label: "Does List Price Have Strikethrough?",  passed: true  },
            { label: "Is Selling Price Correct?",           passed: true  },
            { label: "Is Discount % Visible?",              passed: false },
            { label: "Is Discount % Correct?",              passed: true  },
            { label: "Are You the Buy Box Winner?",         passed: false },
          ]}
          currentOriginalPrice="$25.99"
          currentSellingPrice="$25.99"
          expectedOriginalPrice="$18.99"
          expectedSellingPrice="$19.99"
        />
      );

    case "star-rating":
      return <StarRatingIssue oldRating={4.3} newRating={3.2} />;

    case "keyword-rank-drop":
    case "organic-keyword":
      return (
        <KeywordRankDropIssue
          keywords={[
            { keyword: "food processor 8 cup",   previousRank: 3, currentRank: 9,  searchVolume: "180K / mo" },
            { keyword: "digital food processor", previousRank: 5, currentRank: 12, searchVolume: "74K / mo"  },
            { keyword: "food chopper electric",  previousRank: 7, currentRank: 15, searchVolume: "52K / mo"  },
          ]}
        />
      );

    case "coupon": {
      const now = Date.now();
      const hr = 3_600_000;
      return (
        <CouponIssue
          scrapes={[
            {
              // Multiple coupons at the same scrape time
              timestamp: now - 3 * hr,
              detected: true,
              coupons: [
                "Apply $2.95 coupon",
                "Save 10%: Coupon available when you select Subscribe & Save .",
              ],
            },
            {
              // Dollar-off coupon
              timestamp: now - 6 * hr,
              detected: true,
              coupons: ["Apply $2.95 coupon"],
            },
            {
              // No coupon detected
              timestamp: now - 9 * hr,
              detected: false,
            },
            {
              // Percentage coupon
              timestamp: now - 12 * hr,
              detected: true,
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
  }
}

// Mock rows for the Promo Badge 7-day trend table.
const PROMO_BADGE_TREND_ROWS = [
  { date: "May 10", badgeMissing: true,  estRevenueImpact: "-$710", listPriceShown: false, strikethroughOnMsrp: true,  sellingPriceShown: "$349.99", expectedSellingPrice: "$299.99" },
  { date: "May 11", badgeMissing: true,  estRevenueImpact: "-$680", listPriceShown: false, strikethroughOnMsrp: true,  sellingPriceShown: "$349.99", expectedSellingPrice: "$299.99" },
  { date: "May 12", badgeMissing: false, estRevenueImpact: "$0",    listPriceShown: true,  strikethroughOnMsrp: true,  sellingPriceShown: "$299.99", expectedSellingPrice: "$299.99" },
  { date: "May 13", badgeMissing: true,  estRevenueImpact: "-$620", listPriceShown: false, strikethroughOnMsrp: false, sellingPriceShown: "$349.99", expectedSellingPrice: "$299.99" },
  { date: "May 14", badgeMissing: true,  estRevenueImpact: "-$710", listPriceShown: true,  strikethroughOnMsrp: true,  sellingPriceShown: "$349.99", expectedSellingPrice: "$299.99" },
  { date: "May 15", badgeMissing: false, estRevenueImpact: "$0",    listPriceShown: true,  strikethroughOnMsrp: true,  sellingPriceShown: "$299.99", expectedSellingPrice: "$299.99" },
  { date: "May 16", badgeMissing: true,  estRevenueImpact: "-$605", listPriceShown: false, strikethroughOnMsrp: false, sellingPriceShown: "$349.99", expectedSellingPrice: "$299.99" },
];

// Mock rows for the Buy Box 7-day trend table.
const LBB_TREND_ROWS = [
  { date: "May 3",  buyBoxWinner: "Shark",      isYou: true,  revenueImpact: null,      yourPrice: "$379.99", competitorPrice: "$389.00", priceDiff: "+$9.01"   },
  { date: "May 4",  buyBoxWinner: "Dyson (3P)", isYou: false, revenueImpact: "-$17.2K", yourPrice: "$529.99", competitorPrice: "$364.99", priceDiff: "-$165.00" },
  { date: "May 5",  buyBoxWinner: "Dyson (3P)", isYou: false, revenueImpact: "-$16.8K", yourPrice: "$529.99", competitorPrice: "$359.49", priceDiff: "-$170.50" },
  { date: "May 6",  buyBoxWinner: "Dyson (3P)", isYou: false, revenueImpact: "-$17.9K", yourPrice: "$529.99", competitorPrice: "$361.50", priceDiff: "-$168.49" },
  { date: "May 7",  buyBoxWinner: "Shark",      isYou: true,  revenueImpact: null,      yourPrice: "$369.99", competitorPrice: "$371.00", priceDiff: "+$1.01"   },
  { date: "May 8",  buyBoxWinner: "Dyson (3P)", isYou: false, revenueImpact: "-$19.1K", yourPrice: "$529.99", competitorPrice: "$357.99", priceDiff: "-$172.00" },
  { date: "May 9",  buyBoxWinner: "Dyson (3P)", isYou: false, revenueImpact: "-$15.0K", yourPrice: "$529.99", competitorPrice: "$366.49", priceDiff: "-$163.50" },
];

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-sm font-medium text-slate-600">
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

function KpiRow({ kpis }: { kpis: KpiStat[] }) {
  return (
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
      <SectionHeading>8-Week Revenue Trend vs. Plan</SectionHeading>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f4" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
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

function RootCauseRow({
  cause,
  isOpen,
  onToggle,
}: {
  cause: RootCause;
  isOpen: boolean;
  onToggle: () => void;
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

        {/* Group 2: impact value + explanatory label */}
        {cause.impact && (
          <span className="ml-4 flex items-baseline gap-1.5">
            <span className="text-sm font-medium text-slate-700">{cause.impact}</span>
            {cause.impactLabel && (
              <span className="text-sm text-slate-500">{cause.impactLabel}</span>
            )}
          </span>
        )}

        {/* spacer pushes chevron to the far right */}
        <span className="flex-1" />
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="border-t-2 border-slate-200 bg-slate-50 px-4 pb-4 pt-2.5">
          {/* Description + action row — description always present to keep layout stable */}
          <div className="flex items-start gap-10">
            <p className="flex-1 text-sm leading-relaxed text-slate-500">
              {cause.description || "No additional context available for this issue."}
            </p>
            <button
              type="button"
              className="hidden shrink-0 rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-800"
            >
              Mark as resolved
            </button>
          </div>
          {cause.issueCardType && (
            <div className={cause.description ? "mt-3" : ""}>
              <RootCauseIssueCard
                type={cause.issueCardType}
                conversionState={cause.conversionState}
              />
            </div>
          )}
          {cause.showBuyBoxTrend && (
            <div className="mt-3">
              <LastWeekTrendBuyBox
                period="May 3–9"
                lbbPercent="71%"
                revenueLost="-$86.0K"
                primaryCompetitor="Dyson"
                primaryCompetitorType="3P Seller"
                yourAvgPrice="$529.99"
                competitorAvgPrice="$362.09"
                avgPriceGap="-$167.90"
                status="lost"
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
        </div>
      )}
    </div>
  );
}

function RootCauses({
  groups,
  lastChecked,
}: {
  groups: RootCauseGroup[];
  lastChecked: string;
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
      {/* Section heading row */}
      <div className="mb-2 flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-medium text-slate-600">
            Root causes
          </h3>
          <span className="text-xs text-slate-500">From previous 24 hours</span>
        </div>
        {/* Live status legend */}
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Ongoing Issue
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Warning
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              OK
            </span>
          </div>
          <span className="text-xs text-slate-500">
            As of <span className="font-medium text-slate-600">{lastChecked}</span>
          </span>
        </div>
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
    <div className="flex flex-col gap-3">
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
        <RootCauses groups={data.rootCauses} lastChecked={data.rootCausesLastChecked} />
      </div>
    ) : null;
  }

  // ── trimmed variant — metadata + KPIs + alert banner ─────────────────────
  if (variant === "trimmed") {
    return (
      <div className="flex flex-col gap-6">
        <SkuMetaCard sku={sku} />
        {data.kpis.length > 0 && <KpiRow kpis={data.kpis} />}
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
          {data.kpis.length > 0 && <KpiRow kpis={data.kpis} />}
          {data.alertBanner && <AlertBanner message={data.alertBanner} />}
          {data.rootCauses.some((g) => g.causes.length > 0) && (
            <RootCauses groups={data.rootCauses} lastChecked={data.rootCausesLastChecked} />
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
