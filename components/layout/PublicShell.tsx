import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import PublicLayout from "@/components/public/PublicLayout";

// ============================================================================
// PUBLIC SHELL — compatibility wrapper
// All public marketing pages use this. It delegates to the new PublicLayout
// component which auto-assigns per-route accent colors and includes the
// professional header + footer with brand-colored social icons.
// ============================================================================

interface PublicShellProps {
  locale: string;
  children: ReactNode;
  /** Kept for backward compatibility — no longer used. */
  flatHeader?: boolean;
}

export async function PublicShell({ locale, children }: PublicShellProps) {
  setRequestLocale(locale);
  return <PublicLayout>{children}</PublicLayout>;
}
