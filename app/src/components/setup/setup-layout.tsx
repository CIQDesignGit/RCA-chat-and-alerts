import { SetupHeader } from "@/components/setup/setup-header";

interface SetupLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  title?: string;
  showBackButton?: boolean;
}

// Shared shell for all setup wizard pages.
export function SetupLayout({
  children,
  currentStep,
  title,
  showBackButton = true,
}: SetupLayoutProps) {
  return (
    <div className="-m-6 flex min-h-[calc(100vh-3.5rem)] flex-col bg-slate-100">
      <SetupHeader
        currentStep={currentStep}
        title={title}
        showBackButton={showBackButton}
      />
      <div className="flex-1 px-6 py-6">{children}</div>
    </div>
  );
}
