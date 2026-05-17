// ChatEmptyState — welcome screen shown when no conversation is active.
// All content is left-aligned and grouped in a single top-anchored column.

import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "What is my gap to sales plan last week?",
  "What is my projected gap to sales plan this week?",
  "Which SKUs had the largest gap to sales plan last week?",
  "Which SKUs are projected to miss the sales plan the most this week?",
];

interface ChatEmptyStateProps {
  onSendMessage: (text: string) => void;
}

export function ChatEmptyState({ onSendMessage }: ChatEmptyStateProps) {
  return (
    // Scroll container — content starts from the top with generous padding
    <div className="flex flex-col items-start px-10 pt-16">

      {/* Single grouped block: icon → heading → chips, all left-aligned */}
      <div className="flex flex-col items-start gap-5">

        <Sparkles className="h-9 w-9 text-brand-500" />

        <h1 className="text-2xl font-normal text-foreground">
          Hi, what would you like to explore today?
        </h1>

        {/* Suggestion chips — each sized to its text, stacked in a column */}
        <div className="flex flex-col items-start gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSendMessage(s)}
              className="rounded-full border border-slate-100 bg-white px-4 py-2.5 text-left text-sm text-slate-600 shadow-xs transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              {s}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
