import { setRequestLocale, getTranslations } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import Link from "next/link";
import { ArrowRight, Quote, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CASE_STUDIES = [
  {
    id: "ecommerce",
    industryKey: "case1.industry",
    locationKey: "case1.location",
    logo: "Northwave",
    metric1: { value: "3.2x", labelKey: "case1.metric1" },
    metric2: { value: "47%", labelKey: "case1.metric2" },
    metric3: { value: "12s", labelKey: "case1.metric3" },
    quoteKey: "case1.quote",
    rolesKey: "case1.role",
    accent: "emerald" as const,
  },
  {
    id: "realestate",
    industryKey: "case2.industry",
    locationKey: "case2.location",
    logo: "Levantra",
    metric1: { value: "73%", labelKey: "case2.metric1" },
    metric2: { value: "2.5x", labelKey: "case2.metric2" },
    metric3: { value: "15min", labelKey: "case2.metric3" },
    quoteKey: "case2.quote",
    rolesKey: "case2.role",
    accent: "amber" as const,
  },
  {
    id: "clinic",
    industryKey: "case3.industry",
    locationKey: "case3.location",
    logo: "Atlasium",
    metric1: { value: "68%", labelKey: "case3.metric1" },
    metric2: { value: "4.2x", labelKey: "case3.metric2" },
    metric3: { value: "95%", labelKey: "case3.metric3" },
    quoteKey: "case3.quote",
    rolesKey: "case3.role",
    accent: "rose" as const,
  },
  {
    id: "agency",
    industryKey: "case4.industry",
    locationKey: "case4.location",
    logo: "Veridyn",
    metric1: { value: "10x", labelKey: "case4.metric1" },
    metric2: { value: "40%", labelKey: "case4.metric2" },
    metric3: { value: "5min", labelKey: "case4.metric3" },
    quoteKey: "case4.quote",
    rolesKey: "case4.role",
    accent: "violet" as const,
  },
];

const ALL_LOGOS = [
  "Northwave",
  "Levantra",
  "Atlasium",
  "Veridyn",
  "Bytecraft",
  "Solara",
  "oMarquis",
];

const ACCENTS = {
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30" },
  amber: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
  rose: { bg: "bg-rose-500/15", text: "text-rose-300", border: "border-rose-500/30" },
  violet: { bg: "bg-violet-500/15", text: "text-violet-300", border: "border-violet-500/30" },
};

export default async function CustomersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Customers");

  return (
    <PublicShell locale={locale}>
      <div>
        {/* Hero */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 max-w-6xl py-20 md:py-28 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {t("eyebrow")}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Logo grid */}
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-center text-sm text-muted-foreground uppercase tracking-wider mb-10">
              {t("logosTitle")}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {ALL_LOGOS.map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-center h-16 rounded-lg bg-card border border-border"
                >
                  <span className="text-base font-semibold text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatBlock value="500+" labelKey="stats.businesses" t={t} />
              <StatBlock value="12" labelKey="stats.countries" t={t} />
              <StatBlock value="3" labelKey="stats.languages" t={t} />
              <StatBlock value="99.9%" labelKey="stats.uptime" t={t} />
            </div>
          </div>
        </section>

        {/* Case studies */}
        <section className="py-20 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                {t("casesEyebrow")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("casesTitle")}
              </h2>
            </div>

            <div className="space-y-6">
              {CASE_STUDIES.map((cs) => {
                const accent = ACCENTS[cs.accent];
                return (
                  <article
                    key={cs.id}
                    className="rounded-2xl bg-card border border-border overflow-hidden"
                  >
                    <div className="p-8 md:p-10">
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${accent.bg} ${accent.text} border ${accent.border}`}
                        >
                          {t(cs.industryKey)}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5" />
                          {t(cs.locationKey)}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <MetricBlock
                          value={cs.metric1.value}
                          labelKey={cs.metric1.labelKey}
                          t={t}
                          accent={cs.accent}
                        />
                        <MetricBlock
                          value={cs.metric2.value}
                          labelKey={cs.metric2.labelKey}
                          t={t}
                          accent={cs.accent}
                        />
                        <MetricBlock
                          value={cs.metric3.value}
                          labelKey={cs.metric3.labelKey}
                          t={t}
                          accent={cs.accent}
                        />
                      </div>

                      <blockquote className="border-l-2 border-primary/40 ps-6 mb-6">
                        <Quote className={`w-5 h-5 ${accent.text} mb-3 opacity-60`} />
                        <p className="text-base md:text-lg text-foreground leading-relaxed mb-4">
                          {t(cs.quoteKey)}
                        </p>
                        <cite className="text-sm text-muted-foreground not-italic">
                          — {t(cs.rolesKey)}, {cs.logo}
                        </cite>
                      </blockquote>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link href={`/${locale}/signup`}>
                  {t("cta.primary")}
                  <ArrowRight className="w-4 h-4 ms-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/contact`}>{t("cta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}

function StatBlock({
  value,
  labelKey,
  t,
}: {
  value: string;
  labelKey: string;
  t: (k: string) => string;
}) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{t(labelKey)}</div>
    </div>
  );
}

function MetricBlock({
  value,
  labelKey,
  t,
  accent,
}: {
  value: string;
  labelKey: string;
  t: (k: string) => string;
  accent: keyof typeof ACCENTS;
}) {
  return (
    <div>
      <div className={`text-3xl md:text-4xl font-bold ${ACCENTS[accent].text} mb-1`}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{t(labelKey)}</div>
    </div>
  );
}
