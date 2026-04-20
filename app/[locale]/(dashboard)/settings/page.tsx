import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Zyrix CRM account and company settings.",
};

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-ink-light mt-1">
          Manage your profile, company, and security preferences.
        </p>
      </div>
      <SettingsTabs locale={locale} />
    </div>
  );
}
