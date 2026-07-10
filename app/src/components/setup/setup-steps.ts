// Shared step definitions for the setup wizard flow.
// Import this anywhere you need the step list or route mapping.

export const SETUP_STEPS = [
  { id: "general", label: "General", href: "/" },
  { id: "goals-budgets", label: "Goals & Budgets", href: "/setup/goals-budgets" },
  { id: "constraints", label: "Constraints", href: "/setup/constraints" },
  { id: "optimizer", label: "Optimizer", href: "/setup/optimizer" },
] as const;

export type SetupStepId = (typeof SETUP_STEPS)[number]["id"];
