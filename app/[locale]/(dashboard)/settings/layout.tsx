import { DashboardShell } from "@/components/layout/DashboardShell";

// ────────────────────────────────────────────────────────────────────
// Sprint 14z — Shared layout for every /settings/* route.
// Wraps once in DashboardShell so individual pages render only their
// inner content. Without this, the index /settings page rendered with
// no sidebar/topbar (the bug from screenshot Apr 29, 2026).
// ────────────────────────────────────────────────────────────────────

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <DashboardShell locale={locale}>{children}</DashboardShell>;
}
