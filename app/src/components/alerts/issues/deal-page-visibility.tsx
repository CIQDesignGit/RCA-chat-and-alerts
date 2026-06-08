import { ArrowUpRight, CircleHelp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type DealPageVisibilityProps = {
  /** Product image URL — defaults to a placeholder */
  imageUrl?: string;
  imageAlt?: string;
};

// Deals pages checked during the first-fold review — mock until API is wired
const REVIEWED_DEALS_PAGES = [
  { label: "Electronics Deal", url: "https://www.amazon.com/gp/goldbox" },
  { label: "Home & Kitchen", url: "https://www.amazon.com/gp/goldbox" },
  { label: "Furniture", url: "https://www.amazon.com/gp/goldbox" },
  { label: "Office Products", url: "https://www.amazon.com/gp/goldbox" },
  { label: "Lightning Deals", url: "https://www.amazon.com/gp/goldbox" },
];

function DealsPageHoverCard() {
  return (
    <div className="w-72 overflow-hidden rounded-2xl bg-white">
      <p className="border-b border-slate-100 px-4 py-3.5 text-sm font-semibold leading-snug text-slate-800">
        We have reviewed first fold of these 6 deals pages.
      </p>
      <ul>
        {REVIEWED_DEALS_PAGES.map((page) => (
          <li key={page.label} className="border-b border-slate-100 last:border-b-0">
            <a
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              {page.label}
              <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MissingSkuCard({
  imageUrl = "https://placehold.co/160x120/fdf2f8/fbcfe8?text=",
  imageAlt = "Product",
}: {
  imageUrl?: string;
  imageAlt?: string;
}) {
  return (
    <div className="w-[148px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Blurred product image with missing-status badge */}
      <div className="relative flex h-[112px] items-center justify-center bg-rose-50/60">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="h-full w-full object-cover opacity-40 blur-[2px]"
        />
        <div className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-lg font-bold text-rose-500 shadow-sm">
          ?
        </div>
      </div>

      {/* Skeleton lines — second line carries the missing-SKU message */}
      <div className="flex flex-col gap-2 px-3 py-3">
        <div className="h-2 w-full rounded-full bg-rose-100/80" />
        <p className="text-xs font-medium text-rose-500">Your SKU is missing</p>
        <div className="h-2 w-[80%] rounded-full bg-rose-100/80" />
        <div className="h-2 w-[60%] rounded-full bg-rose-100/80" />
      </div>
    </div>
  );
}

export function DealPageVisibilityIssue({
  imageUrl,
  imageAlt = "Product",
}: DealPageVisibilityProps) {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white px-5 py-5">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h4 className="text-base font-semibold text-slate-800">
          Missing on Deals Page
        </h4>
        <p className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
          <span>
            Despite ongoing offer on this product, it is not showing up on the{" "}
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="cursor-default border-b border-dotted border-slate-400 text-slate-500">
                    deals page
                  </span>
                }
              />
              <TooltipContent
                side="bottom"
                align="start"
                sideOffset={8}
                className="max-w-none w-auto flex-col items-stretch gap-0 rounded-2xl border border-slate-200 bg-white p-0 text-slate-800 shadow-lg [&>svg]:hidden"
              >
                <DealsPageHoverCard />
              </TooltipContent>
            </Tooltip>
          </span>
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="inline-flex cursor-default text-slate-400">
                  <CircleHelp className="h-3.5 w-3.5" aria-hidden />
                </span>
              }
            />
            <TooltipContent side="bottom">
              An active deal on your PDP does not guarantee placement on the Deals page
            </TooltipContent>
          </Tooltip>
        </p>
      </div>

      {/* Visual — product card showing missing placement */}
      <MissingSkuCard imageUrl={imageUrl} imageAlt={imageAlt} />
    </div>
  );
}
