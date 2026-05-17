// Shared session store for all AllyAI conversations.
// Used by: AlertDetailsPanel (SKU inline chat), ChatPage (standalone chat).
// In-memory only — sessions reset on page refresh (no API yet).

import { create } from "zustand";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;        // ISO string — set automatically by appendMessage
  thinkingSteps?: string[]; // tool/reasoning steps shown above assistant messages
};

// Who started this conversation — standalone (from home/chat page) or a specific SKU alert
export type ChatSource =
  | { type: "standalone" }
  | {
      type: "sku";
      alertId: string;
      skuName: string;
      asin: string;
      category: string;
      brand: string;
      gapDollar: number;
      gapUnits: number;
    };

export type ChatSession = {
  id: string;
  title: string;       // auto-derived from the first user message
  messages: ChatMessage[];
  source: ChatSource;
  createdAt: string;   // ISO string
  updatedAt: string;   // ISO string
};

// ── Store shape ───────────────────────────────────────────────────────────────

type ChatStore = {
  sessions: ChatSession[];
  activeSessionId: string | null;

  // Create a brand-new session and make it active. Returns the new id.
  createSession: (source: ChatSource) => string;

  // Add a message to a session. Auto-sets the session title from the first user msg.
  // createdAt is set automatically — callers should omit it.
  appendMessage: (sessionId: string, message: Omit<ChatMessage, "id" | "createdAt">) => void;

  // Find an existing SKU session by alertId (returns null if none exists yet)
  getSessionByAlertId: (alertId: string) => ChatSession | null;

  // Set which session is currently shown in the chat page
  setActiveSession: (sessionId: string | null) => void;

  // Replace placeholder responses from mock delay
  updateLastAssistantMessage: (sessionId: string, content: string) => void;
};

// ── Helper ────────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function now(): string {
  return new Date().toISOString();
}

// Derive a session title from the first user message (truncated to 50 chars)
function titleFromMessage(content: string): string {
  return content.length > 50 ? content.slice(0, 50).trimEnd() + "…" : content;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useChatStore = create<ChatStore>((set, get) => ({
  sessions: [],
  activeSessionId: null,

  createSession(source) {
    const id = uid();
    const session: ChatSession = {
      id,
      title: "New conversation",
      messages: [],
      source,
      createdAt: now(),
      updatedAt: now(),
    };
    set((s) => ({ sessions: [session, ...s.sessions], activeSessionId: id }));
    return id;
  },

  appendMessage(sessionId, message) {
    const msg: ChatMessage = { id: uid(), createdAt: now(), ...message };
    set((s) => ({
      sessions: s.sessions.map((session) => {
        if (session.id !== sessionId) return session;
        const isFirstUserMsg =
          message.role === "user" && session.messages.every((m) => m.role !== "user");
        return {
          ...session,
          messages: [...session.messages, msg],
          title: isFirstUserMsg ? titleFromMessage(message.content) : session.title,
          updatedAt: now(),
        };
      }),
    }));
  },

  getSessionByAlertId(alertId) {
    return (
      get().sessions.find(
        (s) => s.source.type === "sku" && s.source.alertId === alertId,
      ) ?? null
    );
  },

  setActiveSession(sessionId) {
    set({ activeSessionId: sessionId });
  },

  updateLastAssistantMessage(sessionId, content) {
    set((s) => ({
      sessions: s.sessions.map((session) => {
        if (session.id !== sessionId) return session;
        const msgs = [...session.messages];
        // Find last assistant message and update it
        for (let i = msgs.length - 1; i >= 0; i--) {
          if (msgs[i].role === "assistant") {
            msgs[i] = { ...msgs[i], content };
            break;
          }
        }
        return { ...session, messages: msgs, updatedAt: now() };
      }),
    }));
  },
}));
