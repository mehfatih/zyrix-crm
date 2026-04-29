import type { ReactNode } from "react";

// ============================================================================
// ADMIN SECTION LAYOUT
// ============================================================================
// Wraps /[locale]/admin/* routes.
// The outer [locale]/layout.tsx already provides i18n + auth provider.
// ============================================================================

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-muted">{children}</div>;
}
