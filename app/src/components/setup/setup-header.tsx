"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SetupStepper } from "@/components/setup/setup-stepper";
import { SETUP_STEPS } from "@/components/setup/setup-steps";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SetupHeaderProps {
  /** Zero-based index of the active step */
  currentStep: number;
  title?: string;
  backHref?: string;
  showBackButton?: boolean;
  className?: string;
}

// ── SetupHeader ───────────────────────────────────────────────────────────────
// Page header for setup wizard pages. Shows title + stepper (desktop & mobile).

export function SetupHeader({
  currentStep,
  title = SETUP_STEPS[currentStep]?.label ?? "Setup",
  backHref = "/",
  showBackButton = true,
  className,
}: SetupHeaderProps) {
  return (
    <div className={cn("border-b border-slate-200 bg-white", className)}>
      {/* Title row */}
      <div className="flex items-center gap-3 px-6 py-4">
        {showBackButton ? (
          <Link
            href={backHref}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : null}
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>

      {/* Desktop stepper — hidden on small screens */}
      <div className="hidden border-t border-slate-100 px-6 py-4 lg:flex lg:justify-center">
        <SetupStepper currentStep={currentStep} allowNavigation />
      </div>

      {/* Mobile stepper — matches the screenshot layout */}
      <div className="flex justify-center border-t border-slate-100 px-6 py-3 lg:hidden">
        <SetupStepper currentStep={currentStep} allowNavigation />
      </div>
    </div>
  );
}
