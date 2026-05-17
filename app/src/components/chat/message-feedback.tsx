"use client";

// MessageFeedback — feedback row shown below each assistant message.
// Once the user votes, the thumbs icons reflect the selection.

import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function MessageFeedback() {
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  return (
    <div className="flex flex-col gap-1.5 pt-2">
      <span className="text-xs text-slate-400">
        Please help us improve the responses. Did you find that helpful?
      </span>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setVoted("up")}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors",
            voted === "up"
              ? "text-green-600"
              : "text-slate-400 hover:text-slate-600",
          )}
        >
          Helpful?
          <ThumbsUp className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setVoted("down")}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors",
            voted === "down"
              ? "text-red-500"
              : "text-slate-400 hover:text-slate-600",
          )}
        >
          Not helpful?
          <ThumbsDown className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
