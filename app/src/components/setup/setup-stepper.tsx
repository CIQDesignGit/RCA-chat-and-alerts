"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { SETUP_STEPS } from "@/components/setup/setup-steps";

// ── Types ─────────────────────────────────────────────────────────────────────

type StepStatus = "completed" | "current" | "upcoming";

export interface SetupStepperProps {
  /** Zero-based index of the active step */
  currentStep: number;
  className?: string;
  /** When true, completed steps become clickable links */
  allowNavigation?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStepStatus(index: number, currentStep: number): StepStatus {
  if (index < currentStep) return "completed";
  if (index === currentStep) return "current";
  return "upcoming";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepIcon({ status, stepNumber }: { status: StepStatus; stepNumber: number }) {
  if (status === "completed") {
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100"
        aria-hidden
      >
        <Check className="h-3.5 w-3.5 stroke-[2.5] text-emerald-700" />
      </span>
    );
  }

  if (status === "current") {
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-info-600 text-xs font-semibold text-white"
        aria-hidden
      >
        {stepNumber}
      </span>
    );
  }

  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-500"
      aria-hidden
    >
      {stepNumber}
    </span>
  );
}

function StepLabel({ status, label }: { status: StepStatus; label: string }) {
  return (
    <span
      className={cn(
        "whitespace-nowrap text-sm font-medium",
        status === "current" && "text-info-600",
        status === "completed" && "text-slate-800",
        status === "upcoming" && "text-slate-600",
      )}
    >
      {label}
    </span>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div
      className={cn(
        "mx-3 h-px min-w-4 flex-1 self-center",
        isComplete ? "bg-emerald-400" : "bg-slate-200",
      )}
      aria-hidden
    />
  );
}

// ── SetupStepper ──────────────────────────────────────────────────────────────
// Horizontal progress stepper used across the setup wizard.
// Matches the design: blue active step, green completed, gray upcoming.

export function SetupStepper({
  currentStep,
  className,
  allowNavigation = false,
}: SetupStepperProps) {
  return (
    <nav
      aria-label="Setup progress"
      className={cn("flex w-full max-w-4xl items-center", className)}
    >
      {SETUP_STEPS.map((step, index) => {
        const status = getStepStatus(index, currentStep);
        const stepNumber = index + 1;
        const canNavigate = allowNavigation && status === "completed";

        const stepContent = (
          <>
            <StepIcon status={status} stepNumber={stepNumber} />
            <StepLabel status={status} label={step.label} />
          </>
        );

        return (
          <Fragment key={step.id}>
            {index > 0 && (
              <StepConnector isComplete={index <= currentStep} />
            )}

            <div className="relative flex shrink-0 items-center gap-2 pb-2.5">
              {canNavigate ? (
                <Link
                  href={step.href}
                  className="flex items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-info-600/40"
                >
                  {stepContent}
                </Link>
              ) : (
                <div
                  className="flex items-center gap-2"
                  aria-current={status === "current" ? "step" : undefined}
                >
                  {stepContent}
                </div>
              )}

              {/* Active step underline — spans icon + label */}
              {status === "current" && (
                <span
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-info-600"
                  aria-hidden
                />
              )}
            </div>
          </Fragment>
        );
      })}
    </nav>
  );
}
