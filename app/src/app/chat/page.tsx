"use client";

// Chat page — two-panel layout.
// Left: HistorySidebar (dark, with Popular Prompts + History tabs)
// Right: conversation title header + message area + sticky input bar
//
// URL params handled on mount:
//   ?q=<message>    → create a new standalone session and auto-send
//   ?sessionId=<id> → load and display an existing session

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HistorySidebar } from "@/components/chat/history-sidebar";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { MessageThread } from "@/components/chat/message-thread";
import { ChatInputBar } from "@/components/chat/chat-input-bar";
import { useChatStore } from "@/lib/chat-store";

// ── Inner page ────────────────────────────────────────────────────────────────

function ChatPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const createSession = useChatStore((s) => s.createSession);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const setActiveSession = useChatStore((s) => s.setActiveSession);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Guard against React Strict Mode double-firing this effect in development,
  // which would call createSession twice and produce two identical history entries.
  const didHandleParams = useRef(false);

  // ── Handle URL params on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (didHandleParams.current) return;
    didHandleParams.current = true;

    const q = searchParams.get("q");
    const sid = searchParams.get("sessionId");

    if (sid) {
      const exists = sessions.find((s) => s.id === sid);
      if (exists) setActiveSession(sid);
      router.replace("/chat");
      return;
    }

    if (q) {
      const decoded = decodeURIComponent(q);
      const newId = createSession({ type: "standalone" });
      sendMessage(decoded, newId);
      router.replace("/chat");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Send a message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string, explicitSessionId?: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      let sid = explicitSessionId ?? activeSessionId;
      if (!sid) {
        sid = createSession({ type: "standalone" });
      }

      appendMessage(sid, { role: "user", content: trimmed });
      setInput("");
      setIsLoading(true);

      // Placeholder — replace with real LLM call at /api/chat
      await new Promise((r) => setTimeout(r, 1500));

      appendMessage(sid, {
        role: "assistant",
        content: `Placeholder response to: "${trimmed}"\n\nWire up a real LLM in /src/app/api/chat/route.ts to get actual answers.`,
        // Mock reasoning steps — will appear as collapsible "Steps completed" above the response
        thinkingSteps: [
          "Fetched RCA use cases",
          "Matched question to Mode 1 flow",
          "Analyzed portfolio data",
        ],
      });
      setIsLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSessionId, isLoading],
  );

  // ── Sidebar handlers ───────────────────────────────────────────────────────
  function handleNewChat() {
    setActiveSession(null);
    setInput("");
  }

  function handleSelectSession(sessionId: string) {
    setActiveSession(sessionId);
    setInput("");
  }

  function handleSelectPrompt(prompt: string) {
    const newId = createSession({ type: "standalone" });
    sendMessage(prompt, newId);
  }

  const isEmpty = !activeSession || activeSession.messages.length === 0;
  const conversationTitle = activeSession?.title ?? "New Chat";

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Left: dark sidebar ── */}
      <HistorySidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onSelectPrompt={handleSelectPrompt}
      />

      {/* ── Right: conversation panel ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Conversation title header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <span className="text-sm font-semibold text-slate-800">
            {conversationTitle}
          </span>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <span className="text-base leading-none">+</span>
            New Chat
          </button>
        </div>

        {/* Message area — flex-1 with h-full so empty state can center itself */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {isEmpty ? (
            <ChatEmptyState onSendMessage={(text) => sendMessage(text)} />
          ) : (
            <div className="px-6">
              <MessageThread
                session={activeSession}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        {/* Sticky input bar */}
        <ChatInputBar
          value={input}
          onChange={setInput}
          onSubmit={() => sendMessage(input)}
          isLoading={isLoading}
        />

      </div>
    </div>
  );
}

// ── Page export — Suspense required for useSearchParams ───────────────────────

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    }>
      <ChatPageInner />
    </Suspense>
  );
}
