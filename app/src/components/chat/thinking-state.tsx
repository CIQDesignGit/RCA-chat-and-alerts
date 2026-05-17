// ThinkingState — shown while the AI is generating a response.
// Displays a spinner with a step label (e.g. "Analyzing your request...").

import { CircularLoader } from "@/components/ui/loader";

interface ThinkingStateProps {
  step?: string;
}

export function ThinkingState({ step = "Analyzing your request…" }: ThinkingStateProps) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <CircularLoader size="sm" className="shrink-0 text-slate-400" />
      <span className="text-sm text-slate-500">{step}</span>
    </div>
  );
}
