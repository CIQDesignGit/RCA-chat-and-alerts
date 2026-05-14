"use client";

import { useState } from "react";
import {
  TrendingDown,
  ShoppingCart,
  Tag,
  BarChart2,
  Package,
  Truck,
  Star,
  AlertTriangle,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
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

// ─── Types ────────────────────────────────────────────────────────────────────

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

type RootCause = {
  id: string;
  icon: React.ReactNode;
  label: string;
  impact: string | null;
  statusLabel: string;
  statusStyle: string;
  description: string;
};

type AnalysisBlock = { heading: string; body: string };

type Recommendation = { action: string; detail: string };

type RcaData = {
  kpis: KpiStat[];
  statusPills: StatusPill[];
  alertBanner: string | null;
  chartData: { week: string; plan: number; actual: number | null }[];
  chartCaption: string;
  rootCauses: RootCause[];
  analysisBlocks: AnalysisBlock[];
  recommendations: Recommendation[];
  followUpQuestions: string[];
};

// ─── Mock data (one rich dataset — wire to API in production) ─────────────────

function getRcaData(sku: SkuAlert): RcaData {
  return {
    kpis: [
      {
        label: "LAST WEEK",
        period: "May 3–9",
        value: "-$227.7K",
        valueColor: "text-red-600",
        sub: "$846 of $228.5K plan · 37.0% attainment",
      },
      {
        label: "WTD",
        period: "May 10–13",
        value: "$126.3K",
        valueColor: "text-zinc-800",
        sub: "in sales · 49.2% of week elapsed",
      },
      {
        label: "PROJECTED EOW",
        period: "May 10–16",
        value: "+$29.6K vs plan",
        valueColor: "text-emerald-600",
        sub: "$229K plan · $258.3K projected · 112.9%",
      },
    ],
    statusPills: [
      { label: "Buy Box", value: "Buy Box Won (amazon.com)", status: "ok" },
      { label: "Stock", value: "In Stock", status: "ok" },
      { label: "Deal Visibility", value: "Badge Missing", status: "warning" },
      { label: "Shipping Speed", value: "Thu May 14 (Prime)", status: "info" },
    ],
    alertBanner:
      "Unresolved today: Active promo badge missing on PDP — Matching event at $349.99 (May 10–30) launched without badge visibility. No badge detected on any scrape from May 10–13.",
    chartData: [
      { week: "Mar 24", plan: 285, actual: 272 },
      { week: "Mar 31", plan: 288, actual: 295 },
      { week: "Apr 7",  plan: 291, actual: 318 },
      { week: "Apr 14", plan: 293, actual: 325 },
      { week: "Apr 21", plan: 295, actual: 302 },
      { week: "Apr 28", plan: 295, actual: 88  },
      { week: "May 5",  plan: 298, actual: 126 },
      { week: "May 12", plan: 300, actual: null },
    ],
    chartCaption:
      `Revenue collapsed in the week of May 3 (100% LBB all 7 days) after a strong run through Apr 5–19; recovery is underway this week with buy box reclaimed.`,
    rootCauses: [
      {
        id: "lbb",
        icon: <ShoppingCart className="h-4 w-4" />,
        label: "Lost Buy Box",
        impact: "−$119.7K",
        statusLabel: "Resolved",
        statusStyle: "bg-emerald-100 text-emerald-700",
        description:
          "amazon.com lost the buy box 100% of the time every day from May 3–9 after the SAS price spiked to $529.99, while 3P sellers won at $344–$379 — the single largest driver of the $227.7K weekly gap.",
      },
      {
        id: "deal",
        icon: <Tag className="h-4 w-4" />,
        label: "Deal Visibility",
        impact: null,
        statusLabel: "Badge Missing",
        statusStyle: "bg-amber-100 text-amber-700",
        description:
          "A Matching event at $349.99 vs. $529.99 list is active May 10–30 with the correct price showing, but the deal badge has failed to appear on the PDP every day since launch — this is an active promo visibility failure.",
      },
      {
        id: "media",
        icon: <BarChart2 className="h-4 w-4" />,
        label: "Media Spend",
        impact: null,
        statusLabel: "Spend Cuts",
        statusStyle: "bg-orange-100 text-orange-700",
        description:
          "Ad spend was cut on all top-10 keywords last week, with the largest reduction on 'vacuum cleaners for home' (SFR 6,346, −$1,715 spend, −$37.3K sales WoW), compounding the LBB-driven traffic collapse.",
      },
      {
        id: "oos",
        icon: <Package className="h-4 w-4" />,
        label: "Unavailability",
        impact: null,
        statusLabel: "OK",
        statusStyle: "bg-zinc-100 text-zinc-500",
        description:
          "No stock or availability issues last week — 0% rep OOS and 0% unavailability, ruling out inventory as a contributing factor.",
      },
      {
        id: "ship",
        icon: <Truck className="h-4 w-4" />,
        label: "Shipping",
        impact: null,
        statusLabel: "OK",
        statusStyle: "bg-zinc-100 text-zinc-500",
        description:
          "Shipping speed is healthy — Prime customers receive delivery tomorrow (May 14) and standard customers by May 17, with no extended delay risk detected.",
      },
      {
        id: "review",
        icon: <Star className="h-4 w-4" />,
        label: "Review Sentiment",
        impact: null,
        statusLabel: "OK",
        statusStyle: "bg-zinc-100 text-zinc-500",
        description:
          "Review health is strong — 4.2-star average across 2,298 reviews, with 1-star (11%) and 2-star (3%) rates at benchmark; no low-star flag triggered.",
      },
    ],
    analysisBlocks: [
      {
        heading: `Primary cause — 100% Lost Buy Box all 7 days (May 3–9)`,
        body: `The SAS price was raised sharply to $529.99 on May 3 (from ~$300 the prior weeks), opening a $150–$170 gap vs. 3P sellers offering $344–$379. amazon.com lost every buy box impression for the entire week. The estimated revenue captured by 3P sellers is $119,708 — approximately 53% of the $227.7K plan-vs-actual gap by deterministic SQI attribution. Only 2 units ($846) were sold through the first-party channel for the entire week.`,
      },
      {
        heading: "Price trajectory context",
        body: `Prior weeks (Apr 5–19) show ASP around $299,999, consistent with a lower promotional price, and units of 1,100–1,200/week. The Apr 26 week also showed LBB (avg winning 3P price $376.94 vs. SAS $529.99), with 231 units at $303.98 ASP — suggesting 3P pressure was already building before the full collapse in May 3.`,
      },
      {
        heading: "Secondary cause — media spend cuts amplified the traffic loss",
        body: `Every top-10 keyword by ad spend saw a WoW cut. The highest-volume term 'vacuum cleaners for home' (SFR 6,346) lost $1,715 in spend and $37.3K in ad-attributed sales WoW. Organic rank on 'shark lift away' worsened by 8 positions. With the buy box already lost, reduced paid visibility removed any recovery path.`,
      },
      {
        heading: "Current week recovery context",
        body: `amazon.com has reclaimed the buy box at $349.99 and the current-week RTS projects $258.3K (+12.9% above plan). However, a Matching event badge has not appeared on the PDP on any day from May 10–13, constituting a live promo visibility failure that is suppressing the conversion benefit of the $180 price reduction vs. list.`,
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

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
      {children}
    </h3>
  );
}

// ─── 1. KPI stats row ─────────────────────────────────────────────────────────

function KpiRow({ kpis }: { kpis: KpiStat[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {kpis.map((k) => (
        <div key={k.label} className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">{k.label}</span>
            <span className="text-[10px] text-zinc-300">({k.period})</span>
          </div>
          <p className={`text-2xl font-bold leading-none ${k.valueColor}`}>
            {k.value.includes(" vs ") ? (
              <>
                {k.value.split(" vs ")[0]}
                <span className="ml-1.5 text-sm font-normal text-zinc-400">
                  vs {k.value.split(" vs ")[1]}
                </span>
              </>
            ) : (
              k.value
            )}
          </p>
          <p className="text-[11px] leading-snug text-zinc-400">{k.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── 2. Status pills ──────────────────────────────────────────────────────────

const STATUS_DOT: Record<StatusPill["status"], string> = {
  ok:      "bg-emerald-500",
  warning: "bg-amber-400",
  info:    "bg-zinc-400",
};

function StatusPillsRow({ pills }: { pills: StatusPill[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 mr-1">Live Now</span>
      {pills.map((p) => (
        <span
          key={p.label}
          className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[p.status]}`} />
          <span className="font-medium text-zinc-400">{p.label}:</span>
          <span className={p.status === "warning" ? "font-semibold text-amber-600" : ""}>{p.value}</span>
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

function RevenueChart({
  data,
  caption,
}: {
  data: RcaData["chartData"];
  caption: string;
}) {
  // Format tooltip values as $K
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
            formatter={(value, name) => [typeof value === "number" ? fmtK(value) : value, name === "plan" ? "Plan" : "Actual"]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }}
          />
          {/* Highlight the collapse week */}
          <ReferenceLine x="Apr 28" stroke="#fca5a5" strokeDasharray="3 3" label={{ value: "LBB", position: "top", fontSize: 9, fill: "#f87171" }} />
          {/* Plan line — dashed zinc */}
          <Line
            type="monotone"
            dataKey="plan"
            stroke="#d4d4d8"
            strokeDasharray="5 4"
            strokeWidth={1.5}
            dot={false}
            connectNulls
          />
          {/* Actual line — violet, bolder */}
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
      <p className="max-w-[750px] text-[11px] leading-relaxed text-zinc-400">{caption}</p>
    </div>
  );
}

// ─── 5. Root causes accordion ─────────────────────────────────────────────────

function RootCauses({ causes }: { causes: RootCause[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <SectionHeading>Root causes · last week <span className="normal-case font-normal text-zinc-300 tracking-normal">· ordered by $ impact</span></SectionHeading>
      <div className="overflow-hidden rounded-xl border border-zinc-200">
        {causes.map((cause, i) => {
          const isOpen = openIds.has(cause.id);
          return (
            <div key={cause.id} className={i < causes.length - 1 ? "border-b border-zinc-100" : ""}>
              {/* Row header */}
              <button
                type="button"
                onClick={() => toggle(cause.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 transition-colors"
              >
                <span className="text-zinc-400">{cause.icon}</span>
                <span className="flex-1 text-sm font-medium text-zinc-700">{cause.label}</span>
                {cause.impact && (
                  <span className="text-sm font-semibold text-red-500">{cause.impact}</span>
                )}
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cause.statusStyle}`}>
                  {cause.statusLabel}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Expanded description */}
              {isOpen && (
                <div className="border-t border-zinc-100 bg-zinc-50 px-4 pb-3 pt-2.5">
                  <p className="max-w-[750px] text-sm leading-relaxed text-zinc-500">
                    {cause.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
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
          <p className="mb-1 text-sm font-semibold text-zinc-700">{b.heading}</p>
          <p className="text-sm leading-relaxed text-zinc-500">{b.body}</p>
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
          <li key={r.action} className="flex gap-3 max-w-[750px]">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-zinc-600">
              <span className="font-semibold text-zinc-800">{r.action}</span>{" "}
              {r.detail}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── 8. Feedback row ──────────────────────────────────────────────────────────

function FeedbackRow() {
  return (
    <div className="flex items-center justify-between border-t border-zinc-100 pt-5">
      <p className="text-xs text-zinc-400">
        Please help us improve the responses. Did you find that helpful?
      </p>
      <div className="flex items-center gap-2">
        <button className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700">
          <ThumbsUp className="h-4 w-4" />
        </button>
        <button className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700">
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

export function SkuRca({ sku }: { sku: SkuAlert }) {
  const data = getRcaData(sku);

  return (
    <div className="flex flex-col gap-8">
      {/* 1 — KPI stats */}
      <KpiRow kpis={data.kpis} />

      {/* 2 — Live status pills */}
      <StatusPillsRow pills={data.statusPills} />

      {/* 3 — Alert banner (only when unresolved issue present) */}
      {data.alertBanner && <AlertBanner message={data.alertBanner} />}

      {/* 4 — 8-week revenue trend chart */}
      <RevenueChart data={data.chartData} caption={data.chartCaption} />

      {/* 5 — Root causes accordion */}
      <RootCauses causes={data.rootCauses} />

      {/* 6 — Analysis */}
      <AnalysisSection blocks={data.analysisBlocks} />

      {/* 7 — Recommendations */}
      <RecommendationsSection recs={data.recommendations} />

      {/* 8 — Feedback */}
      <FeedbackRow />
    </div>
  );
}
