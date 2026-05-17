// ChatInputBar — sticky input bar at the bottom of the chat panel.
//
// Two visual modes driven by whether the value contains a newline (Shift+Enter):
//   Single-line  → pill shape (rounded-full), button on right, vertically centered
//   Multi-line   → box shape (rounded-2xl), button on bottom-right, textarea at top
//
// NOTE: PromptInputTextarea already handles Enter → submit internally via context.
// Do NOT add a separate onKeyDown that also calls onSubmit — it fires twice.
//
// Max width: 800px

"use client";

import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
} from "@/components/ui/prompt-input";

interface ChatInputBarProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ChatInputBar({ value, onChange, onSubmit, isLoading }: ChatInputBarProps) {
  const isMultiline = value.includes("\n");

  const sendButton = (
    <button
      type="button"
      onClick={onSubmit}
      disabled={!value.trim() && !isLoading}
      aria-label={isLoading ? "Stop" : "Send"}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
    >
      {isLoading ? (
        <Square className="h-4 w-4 fill-current" />
      ) : (
        <ArrowUp className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div className="px-6 pb-6 pt-3">
      <div className="mx-auto max-w-[800px]">
        <PromptInput
          value={value}
          onValueChange={onChange}
          isLoading={isLoading}
          onSubmit={onSubmit}
          className={
            isMultiline
              ? "flex w-full flex-row items-end gap-2 rounded-2xl p-3"
              : "flex w-full items-center"
          }
        >
          {/* No onKeyDown here — PromptInputTextarea handles Enter→submit via context */}
          <PromptInputTextarea
            disableAutosize={!isMultiline}
            rows={isMultiline ? undefined : 1}
            placeholder="Ask AllyAI — e.g. What were my sales last week?"
            className={cn(
              "text-sm",
              isMultiline
                ? "min-h-[60px] flex-1 self-start"
                : "min-h-0 flex-1 py-2 pl-2",
              value.trim() ? "text-slate-600" : "",
            )}
          />

          <PromptInputActions className="shrink-0">
            {sendButton}
          </PromptInputActions>
        </PromptInput>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          AI responses are generated. Always verify critical findings.
        </p>
      </div>
    </div>
  );
}
