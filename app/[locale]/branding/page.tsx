import { redirect, notFound } from "next/navigation";
import { isValidLocale } from "@/i18n";

// Audit-doc shortcut: /[locale]/branding → /[locale]/settings/brand.
// The white-label settings UI lives at /settings/brand; this alias
// exists so the URL named in the audit report resolves to the real page.

export default async function BrandingRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  redirect(`/${locale}/settings/brand`);
}
