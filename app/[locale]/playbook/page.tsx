import { setRequestLocale, getTranslations } from "next-intl/server";
import { PublicShell } from "@/components/layout/PublicShell";
import Link from "next/link";
import {
  MessageCircle,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  Users,
  TrendingUp,
  Zap,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CHAPTERS = [
  { id: "ch1", icon: MessageCircle, anchor: "first-reply" },
  { id: "ch2", icon: Clock, anchor: "response-time" },
  { id: "ch3", icon: Target, anchor: "templates" },
  { id: "ch4", icon: Users, anchor: "team" },
  { id: "ch5", icon: TrendingUp, anchor: "automation" },
  { id: "ch6", icon: Zap, anchor: "advanced" },
];

export default async function PlaybookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Playbook");

  return (
    <PublicShell locale={locale}>
      <div>
        {/* Hero */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl py-20 md:py-28 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-6">
              <BookOpen className="w-3.5 h-3.5" />
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

        {/* Table of contents */}
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3 text-center">
              {t("toc.eyebrow")}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              {t("toc.title")}
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {CHAPTERS.map((ch, i) => {
                const Icon = ch.icon;
                return (
                  <a
                    key={ch.id}
                    href={`#${ch.anchor}`}
                    className="rounded-xl bg-card border border-border p-5 hover:border-primary/40 transition-colors flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {t("toc.chapter")} {i + 1}
                      </div>
                      <h3 className="font-bold text-foreground">{t(`${ch.id}.title`)}</h3>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Chapter 1: First reply */}
        <Chapter id="first-reply" number={1} t={t} keyPrefix="ch1">
          <Lesson kind="rule" t={t} prefix="ch1.rule1" />
          <Lesson kind="example" t={t} prefix="ch1.example1" />
          <Lesson kind="rule" t={t} prefix="ch1.rule2" />
          <Lesson kind="warning" t={t} prefix="ch1.warning1" />
        </Chapter>

        {/* Chapter 2: Response time */}
        <Chapter id="response-time" number={2} t={t} keyPrefix="ch2">
          <Lesson kind="rule" t={t} prefix="ch2.rule1" />
          <Lesson kind="example" t={t} prefix="ch2.example1" />
          <Lesson kind="rule" t={t} prefix="ch2.rule2" />
        </Chapter>

        {/* Chapter 3: Templates */}
        <Chapter id="templates" number={3} t={t} keyPrefix="ch3">
          <Lesson kind="rule" t={t} prefix="ch3.rule1" />
          <Lesson kind="example" t={t} prefix="ch3.example1" />
          <Lesson kind="example" t={t} prefix="ch3.example2" />
          <Lesson kind="warning" t={t} prefix="ch3.warning1" />
        </Chapter>

        {/* Chapter 4: Team */}
        <Chapter id="team" number={4} t={t} keyPrefix="ch4">
          <Lesson kind="rule" t={t} prefix="ch4.rule1" />
          <Lesson kind="rule" t={t} prefix="ch4.rule2" />
          <Lesson kind="example" t={t} prefix="ch4.example1" />
        </Chapter>

        {/* Chapter 5: Automation */}
        <Chapter id="automation" number={5} t={t} keyPrefix="ch5">
          <Lesson kind="rule" t={t} prefix="ch5.rule1" />
          <Lesson kind="example" t={t} prefix="ch5.example1" />
          <Lesson kind="warning" t={t} prefix="ch5.warning1" />
        </Chapter>

        {/* Chapter 6: Advanced */}
        <Chapter id="advanced" number={6} t={t} keyPrefix="ch6">
          <Lesson kind="rule" t={t} prefix="ch6.rule1" />
          <Lesson kind="rule" t={t} prefix="ch6.rule2" />
          <Lesson kind="example" t={t} prefix="ch6.example1" />
        </Chapter>

        {/* CTA */}
        <section className="py-20 md:py-24 border-t border-border">
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

function Chapter({
  id,
  number,
  t,
  keyPrefix,
  children,
}: {
  id: string;
  number: number;
  t: (k: string) => string;
  keyPrefix: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-16 md:py-20 border-b border-border scroll-mt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            {t("toc.chapter")} {number.toString().padStart(2, "0")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t(`${keyPrefix}.title`)}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t(`${keyPrefix}.intro`)}
          </p>
        </div>
        <div className="space-y-6">{children}</div>
      </div>
    </section>
  );
}

const LESSON_STYLES: Record<
  "rule" | "example" | "warning",
  { cardBg: string; cardBorder: string; iconBg: string; iconColor: string; Icon: LucideIcon }
> = {
  rule: {
    cardBg: "bg-card",
    cardBorder: "border-border",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    Icon: CheckCircle2,
  },
  example: {
    cardBg: "bg-emerald-500/5",
    cardBorder: "border-emerald-500/20",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-300",
    Icon: MessageCircle,
  },
  warning: {
    cardBg: "bg-amber-500/5",
    cardBorder: "border-amber-500/20",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-300",
    Icon: AlertCircle,
  },
};

function Lesson({
  kind,
  t,
  prefix,
}: {
  kind: "rule" | "example" | "warning";
  t: (k: string) => string;
  prefix: string;
}) {
  const s = LESSON_STYLES[kind];
  const Icon = s.Icon;
  return (
    <div className={`rounded-2xl ${s.cardBg} border ${s.cardBorder} p-6 md:p-8`}>
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-lg ${s.iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${s.iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-foreground mb-2">{t(`${prefix}.title`)}</h3>
          <p className="text-base text-muted-foreground leading-relaxed">{t(`${prefix}.body`)}</p>
        </div>
      </div>
    </div>
  );
}
