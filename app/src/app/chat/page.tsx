"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Square, Sparkles } from "lucide-react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
} from "@/components/ui/prompt-input";
import { Message, MessageContent, MessageAvatar } from "@/components/ui/message";
import { Loader } from "@/components/ui/loader";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

// Quick-start chips — real questions an Ecommerce Manager would ask AllyAI
const SUGGESTIONS = [
  "Why are my Kitchen Appliances sales down this week?",
  "Which SKUs lost the Buy Box in the last 7 days?",
  "What's driving the rank drop for Air Fryers on Amazon?",
  "Which brands are at risk of missing their weekly sales plan?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const messageText = text ?? input.trim();
    if (!messageText || isLoading) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: messageText },
    ]);
    setInput("");
    setIsLoading(true);

    // Placeholder delay — replace with real API call to /api/chat
    await new Promise((r) => setTimeout(r, 1500));

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Placeholder response to: "${messageText}"\n\nWire up a real LLM in /src/app/api/chat/route.ts to get actual answers.`,
      },
    ]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {isEmpty ? (
          // Welcome state shown before first message
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 pt-16 text-center">
            {/* Brand icon container */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100">
              <Sparkles className="h-7 w-7 text-brand-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Ask AllyAI</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask me why your sales are off plan, which SKUs need attention,
                or what&apos;s driving your biggest gaps this week.
              </p>
            </div>
            {/* Quick-start suggestion chips */}
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-full border bg-background px-4 py-2 text-sm text-neutral-600 shadow-xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {messages.map((msg) => (
              <Message key={msg.id} role={msg.role}>
                <MessageAvatar fallback={msg.role === "assistant" ? "AI" : "Me"} />
                {/* User messages get a brand tint; AI messages use the default secondary */}
                <MessageContent
                  className={msg.role === "user" ? "bg-brand-50 text-foreground" : undefined}
                >
                  {msg.content}
                </MessageContent>
              </Message>
            ))}

            {isLoading && (
              <Message role="assistant">
                <MessageAvatar fallback="AI" />
                <MessageContent>
                  <Loader variant="typing" />
                </MessageContent>
              </Message>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Sticky input bar at the bottom */}
      <div className="border-t bg-background px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <PromptInput
            value={input}
            onValueChange={setInput}
            isLoading={isLoading}
            onSubmit={() => handleSend()}
            className="w-full"
          >
            <PromptInputTextarea
              placeholder="e.g. Why are my Air Fryer sales down this week?"
              onKeyDown={handleKeyDown}
              className="min-h-[44px]"
            />
            <PromptInputActions className="justify-end">
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() && !isLoading}
                aria-label={isLoading ? "Stop" : "Send"}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-opacity disabled:opacity-40 hover:opacity-90"
              >
                {isLoading ? (
                  <Square className="h-4 w-4 fill-current" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </button>
            </PromptInputActions>
          </PromptInput>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            AI responses are generated. Always verify critical findings.
          </p>
        </div>
      </div>
    </div>
  );
}
