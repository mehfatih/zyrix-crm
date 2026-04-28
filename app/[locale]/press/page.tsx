import { setRequestLocale, getTranslations } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import { Calendar, Download, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRESS_RELEASES = [
  { date: "April 2026", titleKey: "release1.title", bodyKey: "release1.body" },
  { date: "March 2026", titleKey: "release2.title", bodyKey: "release2.body" },
  { date: "February 2026", titleKey: "release3.title", bodyKey: "release3.body" },
];

export default async function PressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Press");

  return (
    <PublicShell locale={locale}>
      <div>
        {/* Hero */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl py-20 md:py-28">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {t("eyebrow")}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Press kit */}
        <section className="py-20 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="rounded-2xl bg-card border border-border p-8 md:p-10">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                  <Download className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-3">{t("kit.title")}</h2>
                  <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                    {t("kit.body")}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <KitItem labelKey="kit.logos" t={t} />
                    <KitItem labelKey="kit.brandGuide" t={t} />
                    <KitItem labelKey="kit.screenshots" t={t} />
                    <KitItem labelKey="kit.factSheet" t={t} />
                  </div>
                  <div className="mt-6">
                    <Button asChild>
                      <a href="mailto:press@zyrix.co?subject=Press Kit Request">
                        <Mail className="w-4 h-4 me-2" />
                        {t("kit.cta")}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company facts */}
        <section className="py-20 border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="max-w-3xl mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                {t("facts.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("facts.title")}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FactItem labelKey="facts.founded" valueKey="facts.foundedValue" t={t} />
              <FactItem labelKey="facts.hq" valueKey="facts.hqValue" t={t} />
              <FactItem labelKey="facts.markets" valueKey="facts.marketsValue" t={t} />
              <FactItem labelKey="facts.employees" valueKey="facts.employeesValue" t={t} />
              <FactItem labelKey="facts.languages" valueKey="facts.languagesValue" t={t} />
              <FactItem labelKey="facts.industries" valueKey="facts.industriesValue" t={t} />
            </div>
          </div>
        </section>

        {/* Press releases */}
        <section className="py-20 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="max-w-3xl mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                {t("releases.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("releases.title")}
              </h2>
            </div>
            <div className="space-y-4">
              {PRESS_RELEASES.map((release, i) => (
                <article
                  key={i}
                  className="rounded-2xl bg-card border border-border p-6 md:p-8 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <time className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                        {release.date}
                      </time>
                      <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                        {t(release.titleKey)}
                      </h3>
                      <p className="text-base text-muted-foreground leading-relaxed mb-3">
                        {t(release.bodyKey)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Media contact */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-8 md:p-10 text-center">
              <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                {t("contact.title")}
              </h2>
              <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                {t("contact.body")}
              </p>
              <Button asChild>
                <a href="mailto:press@zyrix.co">press@zyrix.co</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}

function KitItem({ labelKey, t }: { labelKey: string; t: (k: string) => string }) {
  return <div className="text-sm text-muted-foreground">• {t(labelKey)}</div>;
}

function FactItem({
  labelKey,
  valueKey,
  t,
}: {
  labelKey: string;
  valueKey: string;
  t: (k: string) => string;
}) {
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
        {t(labelKey)}
      </div>
      <div className="text-base font-semibold text-foreground">{t(valueKey)}</div>
    </div>
  );
}
