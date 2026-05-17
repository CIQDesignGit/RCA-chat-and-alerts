"use client";

// CompletedSteps — shows a collapsed "Steps completed" header above an
// AI message. Clicking it expands to reveal the reasoning/tool steps.

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CompletedStepsProps {
  steps: string[];
}

export function CompletedSteps({ steps }: CompletedStepsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="flex w-fit items-center gap-1 text-xs text-slate-400 transition-colors hover:text-slate-600"
      >
        {isOpen ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        Steps completed
      </button>

      {isOpen && (
        <ul className="ml-4 flex flex-col gap-1">
          {steps.map((step, i) => (
            <li key={i} className="text-xs text-slate-400">
              · {step}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
