import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import { isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.privacy" });
  return {
    title: `${t("title")} — Zyrix CRM`,
    description: t("intro"),
    alternates: {
      canonical: `https://crm.zyrix.co/${locale}/privacy`,
      languages: {
        en: "https://crm.zyrix.co/en/privacy",
        ar: "https://crm.zyrix.co/ar/privacy",
        tr: "https://crm.zyrix.co/tr/privacy",
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Legal.privacy" });

  return (
    <PublicShell locale={locale}>
      <article className="container mx-auto px-4 max-w-3xl py-12 md:py-16">
        {/* Header */}
        <header className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            {t("eyebrow")}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("lastUpdated")}: {t("lastUpdatedDate")}
          </p>
        </header>

        {/* Intro */}
        <div className="prose-like mb-8 p-6 rounded-2xl bg-card border border-border">
          <p className="text-base text-foreground leading-relaxed m-0">
            {t("intro")}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          <Section title={t("s1.title")}>
            <p>{t("s1.p1")}</p>
            <ul>
              <li>
                <strong>{t("s1.l1.label")}:</strong> {t("s1.l1.body")}
              </li>
              <li>
                <strong>{t("s1.l2.label")}:</strong> {t("s1.l2.body")}
              </li>
              <li>
                <strong>{t("s1.l3.label")}:</strong> {t("s1.l3.body")}
              </li>
              <li>
                <strong>{t("s1.l4.label")}:</strong> {t("s1.l4.body")}
              </li>
              <li>
                <strong>{t("s1.l5.label")}:</strong> {t("s1.l5.body")}
              </li>
            </ul>
          </Section>

          <Section title={t("s2.title")}>
            <p>{t("s2.p1")}</p>
            <ul>
              <li>{t("s2.l1")}</li>
              <li>{t("s2.l2")}</li>
              <li>{t("s2.l3")}</li>
              <li>{t("s2.l4")}</li>
              <li>{t("s2.l5")}</li>
            </ul>
          </Section>

          <Section title={t("s3.title")}>
            <p>{t("s3.p1")}</p>
            <ul>
              <li>
                <strong>Iyzico</strong> — {t("s3.iyzico")}
              </li>
              <li>
                <strong>HyperPay</strong> — {t("s3.hyperpay")}
              </li>
              <li>
                <strong>Resend</strong> — {t("s3.resend")}
              </li>
              <li>
                <strong>Google OAuth</strong> — {t("s3.google")}
              </li>
              <li>
                <strong>Google Gemini</strong> — {t("s3.gemini")}
              </li>
              <li>
                <strong>Railway / Vercel / Cloudflare</strong> — {t("s3.infra")}
              </li>
            </ul>
            <p>{t("s3.p2")}</p>
          </Section>

          <Section title={t("s4.title")}>
            <p>{t("s4.p1")}</p>
            <ul>
              <li>{t("s4.l1")}</li>
              <li>{t("s4.l2")}</li>
              <li>{t("s4.l3")}</li>
              <li>{t("s4.l4")}</li>
            </ul>
          </Section>

          <Section title={t("s5.title")}>
            <p>{t("s5.p1")}</p>
            <ul>
              <li>{t("s5.l1")}</li>
              <li>{t("s5.l2")}</li>
              <li>{t("s5.l3")}</li>
              <li>{t("s5.l4")}</li>
              <li>{t("s5.l5")}</li>
              <li>{t("s5.l6")}</li>
            </ul>
            <p>{t("s5.p2")}</p>
          </Section>

          <Section title={t("s6.title")}>
            <p>{t("s6.p1")}</p>
            <ul>
              <li>
                <strong>{t("s6.l1.label")}:</strong> {t("s6.l1.body")}
              </li>
              <li>
                <strong>{t("s6.l2.label")}:</strong> {t("s6.l2.body")}
              </li>
              <li>
                <strong>{t("s6.l3.label")}:</strong> {t("s6.l3.body")}
              </li>
              <li>
                <strong>{t("s6.l4.label")}:</strong> {t("s6.l4.body")}
              </li>
            </ul>
          </Section>

          <Section title={t("s7.title")}>
            <p>{t("s7.p1")}</p>
            <p>{t("s7.p2")}</p>
          </Section>

          <Section title={t("s8.title")}>
            <p>{t("s8.p1")}</p>
          </Section>

          <Section title={t("s9.title")}>
            <p>{t("s9.p1")}</p>
          </Section>

          <Section title={t("s10.title")}>
            <p>{t("s10.p1")}</p>
            <div className="not-prose rounded-xl bg-primary/10 border border-primary/20 p-5 mt-4">
              <p className="text-sm text-foreground m-0">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:privacy@zyrix.co"
                  className="text-primary hover:underline"
                >
                  privacy@zyrix.co
                </a>
              </p>
              <p className="text-sm text-foreground mt-2 mb-0">
                <strong>Company:</strong> Zyrix, Istanbul, Türkiye
              </p>
            </div>
          </Section>
        </div>
      </article>
    </PublicShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
        {title}
      </h2>
      <div className="text-muted-foreground leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-2 [&_ul_li]:text-sm [&_p]:text-sm md:[&_p]:text-base [&_a]:text-primary [&_a:hover]:underline [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
