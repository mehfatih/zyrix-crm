"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X, Check } from "lucide-react";
import {
  getOnboardingStatus,
  type OnboardingStep,
  type OnboardingProgress,
} from "@/lib/api/advanced";

// ============================================================================
// ONBOARDING BANNER (P3)
// ----------------------------------------------------------------------------
// Shows on the dashboard while any of the five onboarding steps is still
// incomplete. Dismissible per-session via localStorage flag; reappears
// next login until all steps are checked off or explicitly completed via
// the /onboarding flow. Cool-tone, matches Zyrix brand palette.
// ============================================================================

const STEP_LABELS: Record<
  OnboardingStep,
  { en: string; ar: string; tr: string }
> = {
  profile: {
    en: "Company profile",
    ar: "ملف الشركة",
    tr: "Şirket profili",
  },
  country: {
    en: "Country & currency",
    ar: "الدولة والعملة",
    tr: "Ülke ve para birimi",
  },
  firstCustomer: {
    en: "Add your first customer",
    ar: "أضف أول عميل",
    tr: "İlk müşterinizi ekleyin",
  },
  invitedTeam: {
    en: "Invite your team",
    ar: "ادعُ فريقك",
    tr: "Ekibinizi davet edin",
  },
  firstDeal: {
    en: "Create your first deal",
    ar: "أنشئ أول صفقة",
    tr: "İlk anlaşmanızı oluşturun",
  },
};

const DISMISS_KEY = "zyrix_onboarding_banner_dismissed_at";

export function OnboardingBanner({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [percent, setPercent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Dismissed within last 24h? hide.
    try {
      const at = localStorage.getItem(DISMISS_KEY);
      if (at) {
        const ageMs = Date.now() - Number(at);
        if (!Number.isNaN(ageMs) && ageMs < 24 * 60 * 60 * 1000) {
          setDismissed(true);
        }
      }
    } catch {
      // ignore
    }

    (async () => {
      try {
        const status = await getOnboardingStatus();
        if (status.progress) {
          setProgress(status.progress);
          setPercent(status.percent ?? 0);
        }
      } catch {
        // 401/network etc. — silently hide banner
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || dismissed || !progress) return null;

  const steps = (Object.keys(progress) as OnboardingStep[]).filter(
    (s) => !progress[s]
  );
  if (steps.length === 0) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setDismissed(true);
  };

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="bg-card border border-emerald-500/20 rounded-2xl p-5 md:p-6"
    >
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/15 border border-emerald-500/30 p-2.5 rounded-lg flex-shrink-0">
            <Sparkles className="text-emerald-300 w-5 h-5" />
          </div>
          <div>
            <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest">
              {tr("GETTING STARTED", "البدء", "BAŞLARKEN")}
            </p>
            <h3 className="font-bold text-foreground">
              {tr(
                "Finish setting up your workspace",
                "أكمل إعداد مساحة العمل",
                "Çalışma alanınızı kurmayı tamamlayın"
              )}
            </h3>
          </div>
        </div>
        <div className="text-emerald-300 font-bold text-lg tabular-nums flex-shrink-0">
          {percent}%
        </div>
      </div>

      <div className="bg-background border border-border h-2 rounded-full overflow-hidden mb-5">
        <div
          className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-full rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {(Object.keys(progress) as OnboardingStep[]).map((step) => {
          const done = progress[step];
          return (
            <li
              key={step}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-colors ${
                done
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-background border-border hover:border-emerald-500/30"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                  done
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                    : "bg-card border border-border text-muted-foreground"
                }`}
              >
                {done && <Check className="w-2.5 h-2.5" />}
              </span>
              <span
                className={
                  done
                    ? "text-foreground text-sm"
                    : "text-muted-foreground text-sm"
                }
              >
                {STEP_LABELS[step][locale as "en" | "ar" | "tr"]}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex items-center gap-3">
        <Link
          href={`/${locale}/onboarding`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold"
        >
          {tr("Resume setup", "استئناف الإعداد", "Kuruluma devam et")}
          <ArrowRight
            className={`w-3.5 h-3.5 ${isAr ? "-scale-x-100" : ""}`}
          />
        </Link>
        <button
          onClick={handleDismiss}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          title={tr("Hide for today", "إخفاء اليوم", "Bugün için gizle")}
        >
          <X className="w-3.5 h-3.5" />
          {tr("Hide for today", "إخفاء اليوم", "Bugün için gizle")}
        </button>
      </div>
    </div>
  );
}
