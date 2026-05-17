"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare } from "lucide-react";

// Each nav item maps a label to a URL and an icon
const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Chat", href: "/chat", icon: MessageSquare },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-14 flex-col items-center gap-2 border-r bg-background py-4">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        // Highlight the icon for the currently active page
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            title={label}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              isActive
                ? "bg-brand-100 text-brand-600"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            }`}
          >
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}
    </aside>
  );
}
