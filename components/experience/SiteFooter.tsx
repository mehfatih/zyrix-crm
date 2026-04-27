"use client";

import { useTranslations, useLocale } from "next-intl";
import { ZyrixLogo } from "./ZyrixLogo";
import {
  ArrowRight,
  ArrowLeft,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  MessageCircle,
} from "lucide-react";

const COLUMNS = [
  {
    key: "product",
    links: ["features", "aiAgents", "pricing", "integrations", "changelog"],
  },
  {
    key: "solutions",
    links: ["sales", "ecommerce", "realEstate", "clinics", "agencies"],
  },
  {
    key: "company",
    links: ["about", "customers", "careers", "press", "contact"],
  },
  {
    key: "resources",
    links: ["docs", "api", "blog", "playbook", "status"],
  },
] as const;

const SOCIAL_ICONS = [
  { Icon: Twitter, key: "twitter", href: "https://twitter.com/zyrixapp" },
  { Icon: Linkedin, key: "linkedin", href: "https://linkedin.com/company/zyrix" },
  { Icon: Youtube, key: "youtube", href: "https://youtube.com/@zyrix" },
  { Icon: MessageCircle, key: "whatsapp", href: "https://wa.me/" },
  { Icon: Mail, key: "email", href: "mailto:hello@zyrix.co" },
] as const;

export const SiteFooter = () => {
  const t = useTranslations("Landing.footer");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const year = new Date().getFullYear();

  return (
    <>
      {/* === Top: Final CTA Banner === */}
      <section
        id="final-cta"
        className="relative py-20 md:py-28 border-t border-white/5 overflow-hidden"
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-br from-primary/20 via-fuchsia-500/10 to-cyan-500/10 blur-[120px] pointer-events-none"
        />

        <div className="relative container mx-auto px-4 max-w-4xl text-center">
          <div className="reveal">
            <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-primary/80 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
              {t("cta.eyebrow")}
            </span>
            <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-foreground">
              {t("cta.title")}{" "}
              <span className="bg-gradient-to-r from-primary via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                {t("cta.titleAccent")}
              </span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("cta.subtitle")}
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#signup"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)] hover:shadow-[0_10px_50px_-5px_hsl(var(--primary)/0.8)] transition-shadow"
              >
                {t("cta.primary")}
                <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </a>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-foreground hover:bg-white/10 hover:border-white/20 transition-colors"
              >
                {t("cta.secondary")}
              </a>
            </div>

            <p className="mt-5 text-xs text-muted-foreground/70">
              {t("cta.disclaimer")}
            </p>
          </div>
        </div>
      </section>

      {/* === Main Footer === */}
      <footer
        id="footer"
        className="relative border-t border-white/5 bg-gradient-to-b from-transparent to-black/30"
      >
        <div className="container mx-auto px-4 max-w-6xl py-16">
          {/* Top grid: brand + 4 link columns */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8">
            {/* Brand column (spans 2) */}
            <div className="col-span-2">
              <ZyrixLogo variant="white" size={36} />
              <p className="mt-5 text-sm text-muted-foreground max-w-xs leading-relaxed">
                {t("brand.tagline")}
              </p>

              {/* Social */}
              <div className="mt-6 flex items-center gap-2">
                {SOCIAL_ICONS.map(({ Icon, key, href }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(`social.${key}`)}
                    className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 inline-flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>

              {/* Email signup mini */}
              <div className="mt-7">
                <p className="text-xs font-medium uppercase tracking-wider text-foreground/80 mb-3">
                  {t("newsletter.title")}
                </p>
                <form
                  className="flex items-center gap-2 max-w-xs"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder={t("newsletter.placeholder")}
                    className="flex-1 h-10 px-3.5 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-colors"
                    aria-label={t("newsletter.placeholder")}
                  />
                  <button
                    type="submit"
                    className="h-10 w-10 rounded-lg bg-primary text-primary-foreground inline-flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
                    aria-label={t("newsletter.cta")}
                  >
                    <Arrow className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* 4 Link columns */}
            {COLUMNS.map((col) => (
              <div key={col.key}>
                <div className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
                  {t(`columns.${col.key}.title`)}
                </div>
                <ul className="space-y-2.5">
                  {col.links.map((linkKey) => (
                    <li key={linkKey}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {t(`columns.${col.key}.links.${linkKey}`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="mt-14 pt-8 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              {/* Left: copyright + region */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <p className="text-xs text-muted-foreground">
                  {t("legal.copyright", { year })}
                </p>
                <span className="hidden sm:inline text-muted-foreground/30">•</span>
                <p className="text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {t("legal.madeIn")}
                  </span>
                </p>
              </div>

              {/* Right: legal links */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("legal.privacy")}
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("legal.terms")}
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("legal.security")}
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("legal.dpa")}
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("legal.cookies")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default SiteFooter;
