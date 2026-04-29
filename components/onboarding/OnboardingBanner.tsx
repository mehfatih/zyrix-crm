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
      className="rounded-xl border border-border bg-gradient-to-br from-sky-50 via-sky-50 to-blue-50 p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-foreground">
              {tr(
                "Finish setting up your workspace",
                "أكمل إعداد مساحة العمل",
                "Çalışma alanınızı kurmayı tamamlayın"
              )}
            </h3>
            <span className="text-xs font-semibold text-cyan-300 tabular-nums">
              {percent}%
            </span>
          </div>
          <div className="mt-2 w-full h-1.5 rounded-full bg-card/70 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-sky-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
            {(Object.keys(progress) as OnboardingStep[]).map((step) => {
              const done = progress[step];
              return (
                <li
                  key={step}
                  className={`flex items-center gap-2 text-xs ${
                    done ? "text-emerald-300" : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                      done
                        ? "bg-emerald-500 text-white"
                        : "bg-card border border-border"
                    }`}
                  >
                    {done && <Check className="w-2.5 h-2.5" />}
                  </span>
                  <span className={done ? "line-through" : ""}>
                    {STEP_LABELS[step][locale as "en" | "ar" | "tr"]}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex items-center gap-2">
            <Link
              href={`/${locale}/onboarding`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
            >
              {tr("Resume setup", "استئناف الإعداد", "Kuruluma devam et")}
              <ArrowRight
                className={`w-3.5 h-3.5 ${isAr ? "-scale-x-100" : ""}`}
              />
            </Link>
            <button
              onClick={handleDismiss}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              title={tr(
                "Hide for today",
                "إخفاء اليوم",
                "Bugün için gizle"
              )}
            >
              <X className="w-3 h-3" />
              {tr("Hide for today", "إخفاء اليوم", "Bugün için gizle")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
