"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAccentClasses } from "./page-accents";

// ──────────────────────────────────────────────────────────────────
// PageHeader — Sprint 14n per-page accent identity primitive.
// ──────────────────────────────────────────────────────────────────
// Usage (in any dashboard page):
//   <PageHeader
//     accent="customers"  // slug from PAGE_ACCENTS in DashboardShell
//     eyebrow="CUSTOMERS"
//     title={t("title")}
//     subtitle={t("subtitle")}
//     icon={Users}
//   />
//
// All accent classes resolve via the static lookup table in
// DashboardShell.tsx — Tailwind JIT sees concrete strings, no
// dynamic class construction, no need for a safelist.
// ──────────────────────────────────────────────────────────────────

interface PageHeaderProps {
  /** Slug from PAGE_ACCENTS (e.g. "customers", "deals", "loyalty"). */
  accent: string;
  /** Small uppercase label above the title. */
  eyebrow: string;
  /** Main page title. */
  title: string;
  /** Optional subtitle below the title. */
  subtitle?: string;
  /** Optional Lucide icon rendered inline with the title. */
  icon?: LucideIcon;
  /** Optional right-side action area (buttons, etc.). */
  actions?: React.ReactNode;
  /** Optional extra wrapper className. */
  className?: string;
}

export function PageHeader({
  accent,
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  actions,
  className,
}: PageHeaderProps) {
  const accentClasses = getAccentClasses(accent);
  return (
    <div className={cn("mb-8 flex items-start justify-between gap-4 flex-wrap", className)}>
      <div className="min-w-0">
        <p className={cn("text-xs font-bold uppercase tracking-widest mb-2", accentClasses.text)}>
          {eyebrow}
        </p>
        <h1 className="text-foreground text-3xl md:text-4xl font-bold flex items-center gap-3">
          {Icon && <Icon className={cn("w-7 h-7 flex-shrink-0", accentClasses.icon)} />}
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

export default PageHeader;
