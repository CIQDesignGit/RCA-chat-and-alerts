import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { TopBar } from "@/components/layout/top-bar";
import "./globals.css";

/* Inter — primary typeface for the design system */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* JetBrains Mono — monospace for code blocks and data.
   Using --font-jetbrains-mono to avoid a name clash with
   Tailwind's own --font-mono theme token. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RCA Agent",
  description: "AI-powered Root Cause Analysis chat and alerts platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex h-full bg-white text-foreground">
        {/* Decorative background blobs — fixed so they stay behind scrolling content */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 overflow-hidden"
        >
          {/* Bottom-left warm rose blob */}
          <div className="absolute -bottom-50 -left-60 h-[500px] w-[500px] rounded-full bg-rose-100 opacity-70 blur-[80px]" />

          {/* Bottom-right violet/lavender blob — the larger outer one */}
          <div className="absolute -bottom-32 -right-32 h-[240px] w-[240px] rounded-full bg-violet-200 opacity-80 blur-[80px]" />

          {/* Bottom-right pink accent blob — sits on top of the violet one */}
          <div className="absolute bottom-20 right-16 h-[440px] w-[440px] rounded-full bg-rose-100 opacity-80 blur-[120px]" />
        </div>

        <TooltipProvider>
          {/* Left icon sidebar — always visible */}
          <SidebarNav />

          {/* Right: top bar + page content */}
          <div className="relative flex flex-1 flex-col overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
