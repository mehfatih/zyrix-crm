"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AccentColor, FeatureDef } from "@/lib/features/feature-catalog";

// ────────────────────────────────────────────────────────────────────
// Sprint 14y — UpgradeCard
// Reusable upgrade prompt used by /workflows (inline) and
// /feature-disabled (centered). Static ACCENT_CLASSES lookup keeps
// Tailwind JIT happy.
// ────────────────────────────────────────────────────────────────────

interface AccentClasses {
  border: string;
  bg: string;
  iconBg: string;
  iconText: string;
  titleText: string;
  eyebrowText: string;
  linkText: string;
  checkText: string;
  buttonBg: string;
  buttonHover: string;
  buttonRing: string;
}

const ACCENT_CLASSES: Record<AccentColor, AccentClasses> = {
  cyan: {
    border: "border-cyan-500/25",
    bg: "bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-blue-500/8",
    iconBg: "bg-cyan-500/15 border-cyan-500/40",
    iconText: "text-cyan-300",
    titleText: "text-cyan-100",
    eyebrowText: "text-cyan-300",
    linkText: "text-cyan-300",
    checkText: "text-cyan-300",
    buttonBg: "bg-cyan-500/20 border-cyan-500/40",
    buttonHover: "hover:bg-cyan-500/30",
    buttonRing: "focus-visible:ring-cyan-500/40",
  },
  violet: {
    border: "border-violet-500/25",
    bg: "bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-fuchsia-500/8",
    iconBg: "bg-violet-500/15 border-violet-500/40",
    iconText: "text-violet-300",
    titleText: "text-violet-100",
    eyebrowText: "text-violet-300",
    linkText: "text-violet-300",
    checkText: "text-violet-300",
    buttonBg: "bg-violet-500/20 border-violet-500/40",
    buttonHover: "hover:bg-violet-500/30",
    buttonRing: "focus-visible:ring-violet-500/40",
  },
  fuchsia: {
    border: "border-fuchsia-500/25",
    bg: "bg-gradient-to-br from-fuchsia-500/10 via-fuchsia-500/5 to-violet-500/8",
    iconBg: "bg-fuchsia-500/15 border-fuchsia-500/40",
    iconText: "text-fuchsia-300",
    titleText: "text-fuchsia-100",
    eyebrowText: "text-fuchsia-300",
    linkText: "text-fuchsia-300",
    checkText: "text-fuchsia-300",
    buttonBg: "bg-fuchsia-500/20 border-fuchsia-500/40",
    buttonHover: "hover:bg-fuchsia-500/30",
    buttonRing: "focus-visible:ring-fuchsia-500/40",
  },
  sky: {
    border: "border-sky-500/25",
    bg: "bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-cyan-500/8",
    iconBg: "bg-sky-500/15 border-sky-500/40",
    iconText: "text-sky-300",
    titleText: "text-sky-100",
    eyebrowText: "text-sky-300",
    linkText: "text-sky-300",
    checkText: "text-sky-300",
    buttonBg: "bg-sky-500/20 border-sky-500/40",
    buttonHover: "hover:bg-sky-500/30",
    buttonRing: "focus-visible:ring-sky-500/40",
  },
  rose: {
    border: "border-rose-500/25",
    bg: "bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-pink-500/8",
    iconBg: "bg-rose-500/15 border-rose-500/40",
    iconText: "text-rose-300",
    titleText: "text-rose-100",
    eyebrowText: "text-rose-300",
    linkText: "text-rose-300",
    checkText: "text-rose-300",
    buttonBg: "bg-rose-500/20 border-rose-500/40",
    buttonHover: "hover:bg-rose-500/30",
    buttonRing: "focus-visible:ring-rose-500/40",
  },
  emerald: {
    border: "border-emerald-500/25",
    bg: "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/8",
    iconBg: "bg-emerald-500/15 border-emerald-500/40",
    iconText: "text-emerald-300",
    titleText: "text-emerald-100",
    eyebrowText: "text-emerald-300",
    linkText: "text-emerald-300",
    checkText: "text-emerald-300",
    buttonBg: "bg-emerald-500/20 border-emerald-500/40",
    buttonHover: "hover:bg-emerald-500/30",
    buttonRing: "focus-visible:ring-emerald-500/40",
  },
  indigo: {
    border: "border-indigo-500/25",
    bg: "bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-violet-500/8",
    iconBg: "bg-indigo-500/15 border-indigo-500/40",
    iconText: "text-indigo-300",
    titleText: "text-indigo-100",
    eyebrowText: "text-indigo-300",
    linkText: "text-indigo-300",
    checkText: "text-indigo-300",
    buttonBg: "bg-indigo-500/20 border-indigo-500/40",
    buttonHover: "hover:bg-indigo-500/30",
    buttonRing: "focus-visible:ring-indigo-500/40",
  },
  amber: {
    border: "border-amber-500/25",
    bg: "bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-yellow-500/8",
    iconBg: "bg-amber-500/15 border-amber-500/40",
    iconText: "text-amber-300",
    titleText: "text-amber-100",
    eyebrowText: "text-amber-300",
    linkText: "text-amber-300",
    checkText: "text-amber-300",
    buttonBg: "bg-amber-500/20 border-amber-500/40",
    buttonHover: "hover:bg-amber-500/30",
    buttonRing: "focus-visible:ring-amber-500/40",
  },
};

interface Props {
  feature: FeatureDef;
  locale: "en" | "ar" | "tr";
  variant?: "inline" | "centered";
  onUpgrade?: () => void;
  onBack?: () => void;
}

export function UpgradeCard({
  feature,
  locale,
  variant = "inline",
  onUpgrade,
  onBack,
}: Props) {
  const t = useTranslations("upgrade");
  const router = useRouter();
  const c = ACCENT_CLASSES[feature.accentColor];
  const Icon = feature.icon;

  const handleUpgrade = () => {
    if (onUpgrade) onUpgrade();
    else router.push(`/${locale}/settings/billing`);
  };
  const handleBack = () => {
    if (onBack) onBack();
    else router.push(`/${locale}/dashboard`);
  };

  const card = (
    <div
      className={`rounded-2xl border ${c.border} ${c.bg} p-8 md:p-10 ${
        variant === "centered" ? "max-w-2xl mx-auto" : ""
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl border ${c.iconBg} flex items-center justify-center`}
      >
        <Icon className={`w-6 h-6 ${c.iconText}`} />
      </div>

      <p
        className={`${c.eyebrowText} text-[11px] font-bold uppercase tracking-widest mt-3`}
      >
        {t("eyebrow")}
      </p>
      <h2
        className={`text-3xl md:text-4xl font-bold ${c.titleText} mt-2 leading-tight`}
      >
        {t("unlockTitle", { feature: feature.name[locale] })}
      </h2>
      <p className="text-muted-foreground text-base mt-3 max-w-2xl">
        {feature.shortPitch[locale]}
      </p>

      <div className="mt-6 rounded-xl border border-border bg-card/50 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          {t("whatYouGet")}
        </p>
        <ul className="space-y-2">
          {feature.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
              <Check className={`w-4 h-4 ${c.checkText} flex-shrink-0 mt-0.5`} />
              <span>{b[locale]}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button
          onClick={handleUpgrade}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border font-semibold text-sm ${c.buttonBg} ${c.buttonHover} ${c.titleText} focus-visible:outline-none focus-visible:ring-2 ${c.buttonRing}`}
        >
          <Sparkles className="w-4 h-4" />
          {t("unlockButton")}
        </button>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted font-semibold text-sm"
        >
          <ArrowLeft
            className={`w-4 h-4 ${locale === "ar" ? "-scale-x-100" : ""}`}
          />
          {t("backButton")}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        {t("alreadyPro")}{" "}
        <a
          href="mailto:support@zyrix.co"
          className={`${c.linkText} hover:underline`}
        >
          {t("contactSupport")}
        </a>
      </p>
    </div>
  );

  return card;
}
