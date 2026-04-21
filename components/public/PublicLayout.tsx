"use client";

import { usePathname } from "next/navigation";
import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";

// ============================================================================
// PUBLIC LAYOUT WRAPPER
// Decides accent color based on current public route so each page
// feels distinct without repetition.
// ============================================================================

type AccentColor =
  | "cyan"
  | "sky"
  | "teal"
  | "indigo"
  | "emerald"
  | "violet"
  | "slate";

const ROUTE_ACCENTS: { match: RegExp; accent: AccentColor; bg: string }[] = [
  { match: /^\/[a-z]{2}\/features/, accent: "teal", bg: "bg-gradient-to-b from-teal-50/60 via-white to-white" },
  { match: /^\/[a-z]{2}\/pricing/, accent: "indigo", bg: "bg-gradient-to-b from-indigo-50/60 via-white to-white" },
  { match: /^\/[a-z]{2}\/about/, accent: "sky", bg: "bg-gradient-to-b from-sky-50/60 via-white to-white" },
  { match: /^\/[a-z]{2}\/contact/, accent: "emerald", bg: "bg-gradient-to-b from-emerald-50/60 via-white to-white" },
  { match: /^\/[a-z]{2}\/demo/, accent: "violet", bg: "bg-gradient-to-b from-violet-50/60 via-white to-white" },
  { match: /^\/[a-z]{2}\/privacy/, accent: "slate", bg: "bg-gradient-to-b from-slate-50 via-white to-white" },
  { match: /^\/[a-z]{2}\/terms/, accent: "slate", bg: "bg-gradient-to-b from-slate-50 via-white to-white" },
];

function getAccent(pathname: string | null): {
  accent: AccentColor;
  bg: string;
} {
  if (!pathname) return { accent: "cyan", bg: "bg-white" };
  for (const r of ROUTE_ACCENTS) {
    if (r.match.test(pathname)) return { accent: r.accent, bg: r.bg };
  }
  // Home + default
  return { accent: "cyan", bg: "bg-white" };
}

interface PublicLayoutProps {
  children: React.ReactNode;
  /** Override the auto-detected accent */
  accent?: AccentColor;
}

export default function PublicLayout({
  children,
  accent: accentOverride,
}: PublicLayoutProps) {
  const pathname = usePathname();
  const detected = getAccent(pathname);
  const accent = accentOverride ?? detected.accent;
  const bg = accentOverride ? "bg-white" : detected.bg;

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>
      <PublicHeader accentColor={accent} />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
