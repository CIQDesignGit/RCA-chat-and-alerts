// MessageThread — renders the active conversation.
//
// Layout rules (matching reference design):
//   User messages  → right-aligned bubble (slate-100 bg, no avatar)
//   AI messages    → left-aligned plain text (no bubble, no avatar), markdown rendered
//   Loading state  → ThinkingState spinner on the left
//
// Props:
//   hideContextAnchor — skip the ContextAnchorCard (used when the SKU header
//                       is already visible, e.g. inside AlertDetailsPanel)
//   compact           — removes max-w-2xl centering and py-6 vertical padding
//                       (used inside narrow side-panels)

import { useRef, useEffect } from "react";
import { Markdown } from "@/components/ui/markdown";
import { ContextAnchorCard } from "@/components/chat/context-anchor-card";
import { ThinkingState } from "@/components/chat/thinking-state";
import { CompletedSteps } from "@/components/chat/completed-steps";
import { MessageFeedback } from "@/components/chat/message-feedback";
import type { ChatSession } from "@/lib/chat-store";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface MessageThreadProps {
  session: ChatSession;
  isLoading: boolean;
  /** Skip the ContextAnchorCard — use when the SKU header is already visible above */
  hideContextAnchor?: boolean;
  /** Remove max-w-2xl centering + py-6 padding — use inside narrow side-panels */
  compact?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MessageThread({
  session,
  isLoading,
  hideContextAnchor = false,
  compact = false,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages, isLoading]);

  return (
    <div
      className={
        compact
          ? "flex flex-col gap-4"
          : "mx-auto flex max-w-2xl flex-col gap-6 py-6"
      }
    >
      {/* Context anchor — pinned at top for SKU-originated conversations */}
      {!hideContextAnchor && session.source.type === "sku" && (
        <ContextAnchorCard source={session.source} />
      )}

      {session.messages.map((msg) => {
        if (msg.role === "user") {
          // ── User message — right-aligned bubble ──────────────────────────
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="flex max-w-[75%] flex-col items-end gap-1">
                <div className="rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-[2px] bg-violet-50 px-4 py-2.5 text-sm text-slate-600">
                  {msg.content}
                </div>
                <span className="text-[11px] text-slate-400">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        }

        // ── AI message — left-aligned, no bubble, markdown rendered ─────────
        return (
          <div key={msg.id} className="flex flex-col gap-2">
            {/* Collapsible reasoning steps (shown when thinkingSteps exist) */}
            {msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
              <CompletedSteps steps={msg.thinkingSteps} />
            )}

            {/* Response content — rendered as markdown */}
            <Markdown className="prose prose-sm prose-slate max-w-none text-sm text-slate-800 [&_table]:w-full [&_table]:text-sm [&_th]:bg-slate-50 [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_th]:border [&_th]:border-slate-200">
              {msg.content}
            </Markdown>

            {/* Timestamp + feedback */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-slate-400">
                {formatTime(msg.createdAt)}
              </span>
              <MessageFeedback />
            </div>
          </div>
        );
      })}

      {/* Thinking indicator while waiting for AI response */}
      {isLoading && <ThinkingState />}

      <div ref={bottomRef} />
    </div>
  );
}
