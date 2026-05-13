type InsightCardProps = {
  // Small label shown above the title, e.g. "Largest Gap · Category"
  label: string;
  // Tailwind text color class — defaults to brand primary
  labelColor?: string;
  title: string;
  description: string;
  // Optional highlighted number inside the description
  highlight?: string;
  // Tailwind text color class for the highlight — defaults to error red
  highlightColor?: string;
};

export function InsightCard({
  label,
  labelColor = "text-brand-500",
  title,
  description,
  highlight,
  highlightColor = "text-error-500",
}: InsightCardProps) {
  // Replace the highlight word in the description with a colored span
  const parts = highlight ? description.split(highlight) : [description];

  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-background p-4 shadow-sm">
      {/* Type label — e.g. "Largest Gap · Category" */}
      <span className={`text-xs font-medium ${labelColor}`}>{label}</span>

      {/* Main metric title */}
      <p className="text-lg font-semibold text-foreground">{title}</p>

      {/* Description with optional colored highlight */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {highlight ? (
          <>
            {parts[0]}
            <span className={`font-semibold ${highlightColor}`}>{highlight}</span>
            {parts[1]}
          </>
        ) : (
          description
        )}
      </p>
    </div>
  );
}
