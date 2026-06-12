"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Check,
  ArrowUp,
  ArrowUpRight,
  X,
  History,
} from "lucide-react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
} from "@/components/ui/prompt-input";
import { MessageThread } from "@/components/chat/message-thread";
import { ThinkingState } from "@/components/chat/thinking-state";
import type { AlertItem, Issue } from "./types";
import { GapBadge } from "./gap-badge";
import { SkuRca, getFollowUpQuestions } from "@/components/sku/sku-rca";
import { LostBuyBoxIssue } from "./issues/lost-buy-box";
import { StarRatingIssue } from "./issues/star-rating";
import { SovDropIssue } from "./issues/sov-drop";
import { PromoBadgeIssue } from "./issues/promo-badge";
import { KeywordRankDropIssue } from "./issues/keyword-rank-drop";
import { ConversionIssue, getConversionIssueProps } from "./issues/conversion";
import { useChatStore } from "@/lib/chat-store";


// ─── Issue body — renders the right visual per type ──────────────────────────

function IssueBody({ issue }: { issue: Issue }) {
  switch (issue.type) {
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
    case "star-rating":
      return (
        <StarRatingIssue
          oldRating={4.3}
          oldReviewCount={722}
          oldWrittenReviewCount={210}
          newRating={3.2}
          reviewCount={736}
          writtenReviewCount={230}
          newReviewsSinceYesterday={14}
          latestLowStarReview={{
            stars: 1,
            excerpt: "Product stopped working after 3 weeks. Suction completely gone and the battery barely lasts 10 minutes. Extremely disappointed for the price.",
          }}
        />
      );
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
            { label: "Is Promo Badge Visible?",            passed: false },
            { label: "Is List Price Visible?",             passed: false },
            { label: "Is List Price Correct (MSRP)?",      passed: false },
            { label: "Does List Price Have Strikethrough?", passed: true  },
            { label: "Is Selling Price Correct?",          passed: true  },
            { label: "Is Discount % Visible?",             passed: false },
            { label: "Is Discount % Correct?",             passed: true  },
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
            { keyword: "food processor 8 cup", previousRank: 3, currentRank: 9 },
            { keyword: "digital food processor", previousRank: 8, currentRank: 12 },
            { keyword: "food chopper electric", previousRank: 12, currentRank: 15 },
          ]}
        />
      );
    case "conversion":
      return <ConversionIssue {...getConversionIssueProps("dropped")} />;
    default:
      return null;
  }
}

// ─── Single issue thread card ─────────────────────────────────────────────────

function IssueThread({ issue }: { issue: Issue }) {
  const isResolved = issue.status === "resolved";

  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 bg-white py-6 px-6 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-700">
            SA
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-blue-700">
              {issue.analyst}
            </span>
            <span className="text-xs text-slate-400">· {issue.timeAgo}</span>
          </div>
        </div>

        {isResolved ? (
          <span className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
            <Check className="h-4 w-4" />
            Resolved
          </span>
        ) : (
          <button
            type="button"
            className="hidden flex items-center rounded-2xl border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-slate-50"
          >
            Mark as Resolved
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-base font-bold text-slate-800">{issue.title}</h4>
        <p className="text-sm leading-relaxed text-slate-500">{issue.description}</p>
      </div>

      <IssueBody issue={issue} />

      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-slate-400">Helpful</span>
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

// Delay in ms before the trimmed RCA is revealed after landing on a not-ready SKU.
const RCA_SIMULATE_MS = 5000;

// ─── Helpers ─────────────────────────────────────────────────────────────────


// ─── Map issue type → SkuRca alertType string ────────────────────────────────

function issueTypeToAlertType(type: Issue["type"] | undefined): string {
  switch (type) {
    case "lost-buy-box":      return "Lost Buy Box";
    case "star-rating":       return "Sales Drop";
    case "sov-drop":          return "Sales Drop";
    case "promo-badge":       return "Sales Drop";
    case "keyword-rank-drop": return "Sales Drop";
    default: return "";
  }
}

// ─── PDP crawl-history dropdown ───────────────────────────────────────────────
// Shows a list of past crawl timestamps, each linking to the live PDP snapshot.

// Mock crawl history — replace with real API data when available.
// Each entry represents a point-in-time crawl of the Amazon PDP.
const MOCK_CRAWL_HISTORY = [
  { label: "Today, 2:30 PM",       url: "https://www.amazon.com/dp/B00I0DI0Z6" },
  { label: "Today, 8:00 AM",       url: "https://www.amazon.com/dp/B00I0DI0Z6" },
  { label: "Yesterday, 11:45 PM",  url: "https://www.amazon.com/dp/B00I0DI0Z6" },
  { label: "Yesterday, 6:15 PM",   url: "https://www.amazon.com/dp/B00I0DI0Z6" },
  { label: "May 25, 2026 · 9:00 AM", url: "https://www.amazon.com/dp/B00I0DI0Z6" },
  { label: "May 24, 2026 · 3:00 PM", url: "https://www.amazon.com/dp/B00I0DI0Z6" },
];

function PdpPageLink({ asin }: { asin: string }) {
  return (
    <a
      href={`https://www.amazon.com/dp/${asin}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
    >
      <img
        src="/amazon-logo.png"
        alt="Amazon"
        className="h-3.5 w-auto shrink-0"
      />
      PDP Page
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

function PdpHistoryDropdown({
  asin,
  align = "left",
}: {
  asin: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the dropdown
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* History icon button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="PDP snapshots"
        className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
      >
        <History className="h-3.5 w-3.5 shrink-0" />
        PDP Snapshots
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className={`absolute top-full z-50 mt-1.5 w-60 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {/* Header */}
          <div className="border-b border-slate-100 px-3 py-2">
            <p className="text-xs font-semibold text-slate-500">PDP Snapshots</p>
            <p className="mt-1.5 text-[12px] leading-snug text-slate-400">
              Product page snapshots saved at the time of each crawl.
            </p>
          </div>

          {/* List of crawl timestamps */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {MOCK_CRAWL_HISTORY.map((entry) => (
              <li key={entry.label}>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-slate-600 transition-colors hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  <span>{entry.label}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function AlertDetailsPanel({
  alert,
  onClose,
}: {
  alert: AlertItem;
  onClose?: () => void;
}) {
  const router = useRouter();

  // ── Store ──────────────────────────────────────────────────────────────────
  const getSessionByAlertId = useChatStore((s) => s.getSessionByAlertId);
  const createSession = useChatStore((s) => s.createSession);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const setActiveSession = useChatStore((s) => s.setActiveSession);
  const sessions = useChatStore((s) => s.sessions);

  // Resolve the session for this specific SKU (create lazily on first send)
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return getSessionByAlertId(alert.id)?.id ?? null;
  });

  // Derive messages from the store so they stay in sync
  const sessionMessages =
    sessions.find((s) => s.id === sessionId)?.messages ?? [];

  // ── Local UI state ─────────────────────────────────────────────────────────
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const skuShortName = alert.skuName.split(" ").slice(0, 4).join(" ");

  // rcaStatus drives what we render in the main panel body.
  //  "generating" — on-demand RCA triggered (rcaReady=false); shows intro msg + steps
  //  "ready"      — full RCA available; shows SkuRca component
  //  "failed"     — agent ran but couldn't fetch RCA (rcaFetchFailed=true); shows issue-card fallback
  // Both on-demand (rcaReady=false) and failed-fetch (rcaFetchFailed=true) SKUs
  // start in "generating" — they share the same user message + ThinkingState flow.
  // The timeout then resolves to "ready" or "failed" depending on the SKU flag.
  const [rcaStatus, setRcaStatus] = useState<"generating" | "ready" | "failed">(() => {
    if (alert.rcaFetchFailed === true || alert.rcaReady === false) return "generating";
    return "ready";
  });

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    setScrolled(e.currentTarget.scrollTop > 24);
  }

  const hasMessages = sessionMessages.length > 0;

  // Auto-scroll when new messages arrive — skip on initial open (no messages yet)
  useEffect(() => {
    if (!hasMessages && !isLoading) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessionMessages, isLoading, hasMessages]);

  // After RCA_SIMULATE_MS: resolve to "failed" for fetch-failed SKUs, "ready" otherwise.
  useEffect(() => {
    if (rcaStatus !== "generating") return;
    const timer = setTimeout(
      () => setRcaStatus(alert.rcaFetchFailed === true ? "failed" : "ready"),
      RCA_SIMULATE_MS,
    );
    return () => clearTimeout(timer);
  }, [rcaStatus, alert.rcaFetchFailed]);

  // ── Send a message in the SKU inline chat ──────────────────────────────────
  async function handleSend(text?: string) {
    const content = (text ?? chatInput).trim();
    if (!content || isLoading) return;

    // Create the session on first message
    let sid = sessionId;
    if (!sid) {
      sid = createSession({
        type: "sku",
        alertId: alert.id,
        skuName: alert.skuName,
        asin: alert.asin,
        category: alert.category,
        brand: alert.brand,
        gapDollar: alert.gapDollar,
        gapUnits: alert.gapUnits,
      });
      setSessionId(sid);
      setActiveSession(sid);
    }

    appendMessage(sid, { role: "user", content });
    setChatInput("");
    setIsLoading(true);

    // Placeholder — replace with real API call
    await new Promise((r) => setTimeout(r, 1500));

    appendMessage(sid, {
      role: "assistant",
      content: `Placeholder response to: "${content}"\n\nWire up a real LLM in /src/app/api/chat/route.ts to get actual answers.`,
      thinkingSteps: ["Fetched RCA use cases", "Matched question to SKU data"],
    });
    setIsLoading(false);
  }

  // ── "Continue in Chat" — open this conversation in the full chat page ──────
  function handleContinueInChat() {
    if (sessionId) {
      router.push(`/chat?sessionId=${encodeURIComponent(sessionId)}`);
    }
  }

  const alertType = issueTypeToAlertType(alert.issues[0]?.type);
  const skuForRca = {
    id: alert.id,
    skuName: alert.skuName,
    asin: alert.asin,
    category: alert.category,
    brand: alert.brand,
    alertType,
    gapValue: alert.gapDollar,
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden">

      {/* ── SKU header — collapses to compact strip on scroll ── */}
      <div className="border-b bg-white transition-all duration-200">
        {scrolled ? (
          <div className="flex items-center gap-3 px-6 py-2.5 pr-14">
            <img
              src={`https://placehold.co/32x32/f4f4f5/71717a?text=${alert.category[0]}`}
              alt={alert.skuName}
              className="h-8 w-8 shrink-0 rounded-md border border-slate-200 object-cover"
            />
            <h2 className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">
              {alert.skuName}
            </h2>
            {/* Buttons sit right of the title, left of the close icon — 32px min gap */}
            <div className="ml-8 flex shrink-0 items-center gap-1">
              <PdpPageLink asin={alert.asin} />
              <PdpHistoryDropdown asin={alert.asin} align="right" />
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4 px-6 py-4 pr-14">
            <img
              src={`https://placehold.co/64x64/f4f4f5/71717a?text=${alert.category[0]}`}
              alt={alert.skuName}
              className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <h2 className="text-base font-bold leading-snug text-slate-900">
                {alert.skuName}
              </h2>
              <p className="text-xs text-slate-400">
                {alert.accountId}
                <span className="mx-1.5 text-slate-300">·</span>
                <span className="font-mono">{alert.asin}</span>
                <span className="mx-1.5 text-slate-300">·</span>
                {alert.category}
                <span className="mx-1.5 text-slate-300">·</span>
                {alert.brand}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {/* PDP link + history button grouped tightly — they belong together */}
                <div className="flex items-center gap-1">
                  <PdpPageLink asin={alert.asin} />
                  <PdpHistoryDropdown asin={alert.asin} />
                </div>
                <GapBadge gapDollar={alert.gapDollar} gapUnits={alert.gapUnits} />
              </div>
            </div>
          </div>
        )}

        {/* Close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Scrollable body — RCA + follow-up chips + chat messages ── */}
      <div className="flex-1 overflow-y-auto pb-28" onScroll={handleScroll}>

        {/* Issue threads hidden for now — component preserved in file */}

        {/* Root causes — shown immediately before chat, for both on-demand and
            fetch-failed SKUs. Service A data is always available up front. */}
        {(alert.rcaReady === false || alert.rcaFetchFailed === true) && (
          <div className="px-6 py-5">
            <SkuRca sku={skuForRca} variant="root-causes" />
          </div>
        )}

        {/* User message bubble — mirrors the user typing "Do RCA for <ASIN>" */}
        {(alert.rcaReady === false || alert.rcaFetchFailed === true) && (
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex justify-end">
              <div className="rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-[2px] bg-violet-50 px-4 py-2.5 text-sm text-slate-600">
                Do RCA for {alert.asin}
              </div>
            </div>
          </div>
        )}

        {/* RCA response section */}
        <div className="bg-white">
          {rcaStatus === "generating" ? (
            <div className="px-6 py-5">
              <ThinkingState />
            </div>
          ) : rcaStatus === "failed" ? (
            /* Agent ran but couldn't fetch RCA — plain message response */
            <div className="px-6 py-5">
              <p className="text-sm leading-relaxed text-slate-500">
                We couldn't fetch the root cause analysis for this SKU right now.
                Please try again in some time.
              </p>
            </div>
          ) : (
            <div className="px-6 py-5">
              {/* trimmed for on-demand SKUs, full for pre-computed ones */}
              <SkuRca
                sku={skuForRca}
                variant={alert.rcaReady === false ? "trimmed" : "full"}
              />
            </div>
          )}
        </div>

        {/* Follow-up question chips — hidden while generating or once the user starts a conversation */}
        {rcaStatus !== "generating" && !hasMessages && (
          <div className="border-t border-slate-100 px-6 py-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Follow-up questions
            </p>
            <div className="flex flex-wrap gap-2">
              {getFollowUpQuestions(skuForRca).slice(0, 3).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="rounded-full border bg-background px-3 py-1 text-sm text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Inline chat messages — same layout as the full chat page ── */}
        {hasMessages && sessionId && (() => {
          const session = sessions.find((s) => s.id === sessionId);
          return session ? (
            <div className="border-t border-slate-100 px-6 pt-2 pb-4">
              <MessageThread
                session={session}
                isLoading={isLoading}
                hideContextAnchor
                compact
              />
            </div>
          ) : null;
        })()}

        <div ref={bottomRef} />
      </div>

      {/* ── Floating chat bar — shown once RCA is ready or in failed/partial state ── */}
      {rcaStatus !== "generating" && (
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-slate-50 via-slate-50/95 to-transparent px-6 pb-5 pt-8">

        {/* "Continue in Chat" escape hatch — appears after first message */}
        {hasMessages && (
          <button
            type="button"
            onClick={handleContinueInChat}
            className="mb-2 flex w-full items-center justify-end gap-1 text-xs font-medium text-brand-600 hover:underline"
          >
            Continue this conversation in Chat
            <ArrowUpRight className="h-3 w-3" />
          </button>
        )}

        <PromptInput
          value={chatInput}
          onValueChange={setChatInput}
          isLoading={isLoading}
          onSubmit={() => handleSend()}
          maxHeight={44}
          className="flex w-full items-center rounded-full border-slate-200 bg-white shadow-md"
        >
          <PromptInputTextarea
            disableAutosize
            rows={1}
            placeholder={`Ask AllyAI about ${skuShortName}…`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="min-h-0 flex-1 py-1.5"
          />
          <PromptInputActions>
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!chatInput.trim() || isLoading}
              aria-label="Send"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </PromptInputActions>
        </PromptInput>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          AI responses are generated. Always verify critical findings.{" "}
          <a href="/chat" className="underline underline-offset-2 transition-colors hover:text-foreground">
            View previous conversations in chat history
          </a>.
        </p>
        </div>
      )}
    </div>
  );
}
