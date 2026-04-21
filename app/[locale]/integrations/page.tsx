import { setRequestLocale } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import IntegrationsClient from "./IntegrationsClient";

// ============================================================================
// PUBLIC INTEGRATIONS — server wrapper
//
// The page itself must be a Server Component so it can call setRequestLocale
// and render the async <PublicShell>. All interactive state (filters, search,
// catalog fetch) lives in IntegrationsClient, which is marked 'use client'.
// ============================================================================

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PublicShell locale={locale}>
      <IntegrationsClient locale={locale} />
    </PublicShell>
  );
}
