import type { ReactNode } from "react";
import PublicLayout from "@/components/public/PublicLayout";

// ============================================================================
// /[locale]/docs layout — wraps every docs route in the public shell (header
// + footer) and sets the sky accent for the marketing chrome. The 3-column
// layout inside docs pages is handled by DocsShell so static/dynamic routes
// can share it.
// ============================================================================

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <PublicLayout accent="sky">{children}</PublicLayout>;
}
