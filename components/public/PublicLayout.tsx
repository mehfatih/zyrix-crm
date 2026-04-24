"use client";

import { usePathname } from "next/navigation";
import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";
import StickyCTA from "./StickyCTA";

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
  {
    match: /^\/[a-z]{2}\/features/,
    accent: "teal",
    bg: "bg-gradient-to-br from-teal-50 via-cyan-50/40 to-white",
  },
  {
    match: /^\/[a-z]{2}\/pricing/,
    accent: "indigo",
    bg: "bg-gradient-to-br from-indigo-50 via-sky-50/40 to-white",
  },
  {
    match: /^\/[a-z]{2}\/about/,
    accent: "sky",
    bg: "bg-gradient-to-br from-sky-50 via-blue-50/40 to-white",
  },
  {
    match: /^\/[a-z]{2}\/contact/,
    accent: "emerald",
    bg: "bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white",
  },
  {
    match: /^\/[a-z]{2}\/privacy/,
    accent: "slate",
    bg: "bg-gradient-to-br from-slate-50 via-slate-50/60 to-white",
  },
  {
    match: /^\/[a-z]{2}\/terms/,
    accent: "slate",
    bg: "bg-gradient-to-br from-slate-50 via-slate-50/60 to-white",
  },
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

  // Map each accent to a bold color halo visible behind hero sections
  const haloMap: Record<AccentColor, string> = {
    cyan: "bg-cyan-400/20",
    sky: "bg-sky-400/20",
    teal: "bg-teal-400/20",
    indigo: "bg-indigo-400/20",
    emerald: "bg-emerald-400/20",
    violet: "bg-violet-400/20",
    slate: "bg-slate-400/20",
  };

  return (
    <div className={`min-h-screen flex flex-col ${bg} relative`}>
      {/* Colored halo at top — gives each page a distinct vibe */}
      <div
        className={`pointer-events-none absolute top-0 left-0 right-0 h-[500px] ${haloMap[accent]} blur-3xl -z-0 opacity-70`}
        aria-hidden="true"
      />
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full blur-3xl -z-0 pointer-events-none opacity-40"
           style={{ background: `radial-gradient(circle, var(--halo-color, transparent), transparent)` }}
           aria-hidden="true" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicHeader accentColor={accent} />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>

      {/* Persistent "Start free" CTA for logged-out visitors only */}
      <StickyCTA />
    </div>
  );
}
