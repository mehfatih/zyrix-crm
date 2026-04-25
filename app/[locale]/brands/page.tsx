import { redirect, notFound } from "next/navigation";
import { isValidLocale } from "@/i18n";

// Audit-doc shortcut: /[locale]/brands → /[locale]/settings/brands.
// The multi-brand CRUD UI lives at /settings/brands; this alias exists
// so the URL named in the audit report resolves to the real page.

export default async function BrandsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  redirect(`/${locale}/settings/brands`);
}
