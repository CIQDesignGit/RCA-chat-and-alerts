"use client";

import { useState } from "react";
import {
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Check,
  ArrowUp,
  ChevronDown,
} from "lucide-react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
} from "@/components/ui/prompt-input";
import type { AlertItem, Issue } from "./types";
import { GapBadge } from "./gap-badge";
import { SkuRca, getFollowUpQuestions } from "@/components/sku/sku-rca";
import { LostBuyBoxIssue } from "./issues/lost-buy-box";
import { StarRatingIssue } from "./issues/star-rating";
import { SovDropIssue } from "./issues/sov-drop";
import { PromoBadgeIssue } from "./issues/promo-badge";
import { KeywordRankDropIssue } from "./issues/keyword-rank-drop";


// ─── Issue body — renders the right visual per type ──────────────────────────

function IssueBody({ issue }: { issue: Issue }) {
  switch (issue.type) {
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
    case "star-rating":
      return <StarRatingIssue oldRating={4.3} newRating={3.2} />;
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
            { keyword: '"Shark Cordless Vacuum"', spFrom: 11.4, spTo: 9.5, sbFrom: 11.4, sbTo: 9.5 },
            { keyword: '"Shark Vacuum"', spFrom: 16.3, spTo: 11.5, sbFrom: 16.3, sbTo: 11.5 },
            { keyword: '"Shark Stick Vacuum"', spFrom: 15.2, spTo: 11.3, sbFrom: 15.2, sbTo: 11.3 },
            { keyword: '"Shark Pro cordless stick Vacuum"', spFrom: 11.0, spTo: 7.8, sbFrom: 11.0, sbTo: 7.8 },
            { keyword: '"Shark NX23 Vacuum"', spFrom: 9.0, spTo: 6.4, sbFrom: 9.0, sbTo: 6.4 },
          ]}
        />
      );
    case "promo-badge":
      return (
        <PromoBadgeIssue
          promoDateRange="28 Apr to 10 May"
          checks={[
            // Promo badge
            { label: "Is Promo Badge Visible?",            passed: false },
            // List price group
            { label: "Is List Price Visible?",             passed: false },
            { label: "Is List Price Correct (MSRP)?",      passed: false },
            { label: "Does List Price Have Strikethrough?", passed: true  },
            // Selling price + discount group
            { label: "Is Selling Price Correct?",          passed: true  },
            { label: "Is Discount % Visible?",             passed: false },
            { label: "Is Discount % Correct?",             passed: true  },
            // Buy Box
            { label: "Are You the Buy Box Winner?",        passed: false },
          ]}
          currentOriginalPrice="$25.99"
          currentSellingPrice="$25.99"
          expectedOriginalPrice="$18.99"
          expectedSellingPrice="$19.99"
        />
      );
    case "keyword-rank-drop":
      return (
        <KeywordRankDropIssue
          keywords={[
            { keyword: "food processor 8 cup", previousRank: 3, currentRank: 9, searchVolume: "180K / mo" },
            { keyword: "digital food processor", previousRank: 5, currentRank: 12, searchVolume: "74K / mo" },
            { keyword: "food chopper electric", previousRank: 7, currentRank: 15, searchVolume: "52K / mo" },
          ]}
        />
      );
    default:
      return null;
  }
}

// ─── Single issue thread card ─────────────────────────────────────────────────

function IssueThread({ issue }: { issue: Issue }) {
  const isResolved = issue.status === "resolved";

  return (
    <div className="flex flex-col gap-4 border-b border-zinc-100 bg-white py-6 px-6 last:border-b-0">
      {/* Thread header: avatar + analyst name + time + status */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Orange analyst avatar — matches screenshot */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-700">
            SA
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-blue-700">
              {issue.analyst}
            </span>
            <span className="text-xs text-zinc-400">· {issue.timeAgo}</span>
          </div>
        </div>

        {/* Status badge */}
        {isResolved ? (
          <span className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
            <Check className="h-4 w-4" />
            Resolved
          </span>
        ) : (
          <button
            type="button"
            className="flex items-center rounded-2xl border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-slate-50"
          >
            Mark as Resolved
          </button>
        )}
      </div>

      {/* Issue title + description */}
      <div className="flex flex-col gap-1">
        <h4 className="text-base font-bold text-zinc-800">{issue.title}</h4>
        <p className="text-sm leading-relaxed text-zinc-500">{issue.description}</p>
      </div>

      {/* Issue-type-specific content */}
      <IssueBody issue={issue} />

      {/* Helpful feedback row */}
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-zinc-400">Helpful</span>
        <button className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors">
          <ThumbsUp className="h-4 w-4" />
        </button>
        <button className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors">
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Map issue type → SkuRca alertType string ────────────────────────────────
// SkuRca uses string-switch on alertType; map our enum values to match.

function issueTypeToAlertType(type: Issue["type"] | undefined): string {
  switch (type) {
    case "lost-buy-box":  return "Lost Buy Box";
    case "star-rating":   return "Sales Drop";
    case "sov-drop":      return "Sales Drop";
    case "promo-badge":   return "Sales Drop";
    case "keyword-rank-drop": return "Sales Drop";
    default: return "";
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function AlertDetailsPanel({ alert }: { alert: AlertItem }) {
  const [chatInput, setChatInput] = useState("");
  const [rcaOpen, setRcaOpen] = useState(true); // open by default
  const skuShortName = alert.skuName.split(" ").slice(0, 4).join(" ");

  return (
    <div className="relative flex h-full flex-col overflow-hidden">

      {/* ── SKU header ── */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-start gap-4">
          {/* Product image */}
          <img
            src={`https://placehold.co/64x64/f4f4f5/71717a?text=${alert.category[0]}`}
            alt={alert.skuName}
            className="h-16 w-16 shrink-0 rounded-lg border border-zinc-200 object-cover"
          />

          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {/* SKU name */}
            <h2 className="text-base font-bold leading-snug text-zinc-900">
              {alert.skuName}
            </h2>

            {/* Breadcrumb */}
            <p className="text-xs text-zinc-400">
              {alert.accountId}
              <span className="mx-1.5 text-zinc-300">·</span>
              <span className="font-mono">{alert.asin}</span>
              <span className="mx-1.5 text-zinc-300">·</span>
              {alert.category}
              <span className="mx-1.5 text-zinc-300">·</span>
              {alert.brand}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Amazon PDP link */}
              <a
                href={`https://www.amazon.com/dp/${alert.asin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
              >
                <span className="text-[10px] font-bold text-amber-600">a</span>
                PDP Content
                <ExternalLink className="h-3 w-3" />
              </a>

              {/* Gap dollar + units */}
              <GapBadge gapDollar={alert.gapDollar} gapUnits={alert.gapUnits} />

              {/* Date — pushed to the right */}
              <span className="ml-auto text-xs text-zinc-400">{alert.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Issues thread list + SKU RCA — extra pb clears the floating chat bar ── */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Issue threads */}
        {alert.issues.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-400">
            No issues found for this SKU.
          </p>
        ) : (
          alert.issues.map((issue) => (
            <IssueThread key={issue.id} issue={issue} />
          ))
        )}

        {/* ── SKU RCA accordion — open by default, collapsible ── */}
        <div className="border-t-2 border-brand-100 bg-brand-50/30">
          {/* Accordion header — click to toggle */}
          <button
            type="button"
            onClick={() => setRcaOpen((prev) => !prev)}
            className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-brand-100 transition-colors"
          >
            <span className="text-sm font-semibold tracking-wide text-foreground">
              SKU Root Cause Analysis
            </span>
            <ChevronDown
              className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${
                rcaOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Accordion body — shown/hidden */}
          {rcaOpen && (
            <div className="px-6 pb-6">
              <SkuRca
                sku={{
                  id: alert.id,
                  skuName: alert.skuName,
                  asin: alert.asin,
                  category: alert.category,
                  alertType: issueTypeToAlertType(alert.issues[0]?.type),
                  gapValue: alert.gapDollar,
                }}
              />
            </div>
          )}
        </div>

        {/* ── Follow-up questions — outside the accordion, always visible ── */}
        <div className="border-t border-zinc-100 bg-white px-6 py-5 pb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Follow-up questions
          </p>
          <div className="flex flex-wrap gap-2">
            {getFollowUpQuestions({
              id: alert.id,
              skuName: alert.skuName,
              asin: alert.asin,
              category: alert.category,
              alertType: issueTypeToAlertType(alert.issues[0]?.type),
              gapValue: alert.gapDollar,
            }).map((q) => (
              <button
                key={q}
                type="button"
                className="rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating chat bar ── */}
      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-zinc-50 via-zinc-50 to-transparent px-6 pb-5 pt-3">
        <PromptInput
          value={chatInput}
          onValueChange={setChatInput}
          isLoading={false}
          onSubmit={() => {}}
          maxHeight={44}
          className="flex w-full items-center rounded-full border-zinc-200 bg-white shadow-md"
        >
          <PromptInputTextarea
            disableAutosize
            rows={1}
            placeholder={`Ask AllyAI about ${skuShortName}…`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
            }}
            className="min-h-0 flex-1 py-1.5"
          />
          <PromptInputActions>
            <button
              type="button"
              disabled={!chatInput.trim()}
              aria-label="Send"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  );
}
