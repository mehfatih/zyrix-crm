"use client";

import { Clock, LogOut, ShieldCheck } from "lucide-react";

// ============================================================================
// IDLE WARNING MODAL — countdown before auto-logout fires
// ----------------------------------------------------------------------------
// Shown by useIdleTimeout 60 seconds before the real logout. Gives the
// user three explicit paths:
//   1. Click "Continue session" → resets the timer, stays logged in
//   2. Click "Logout now"        → immediate manual logout
//   3. Do nothing                → auto-logout fires at T-0 on its own
// ============================================================================

export interface IdleWarningModalProps {
  open: boolean;
  secondsLeft: number;
  locale: "en" | "ar" | "tr";
  onContinue: () => void;
  onLogoutNow: () => void;
}

export function IdleWarningModal({
  open,
  secondsLeft,
  locale,
  onContinue,
  onLogoutNow,
}: IdleWarningModalProps) {
  if (!open) return null;

  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  // Progress ring: 60 seconds maps to 0..100% of the circle circumference.
  // Shrinks from full to empty as the countdown ticks.
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, secondsLeft / 60));
  const strokeOffset = circumference * (1 - progress);

  // Color shifts from cyan (safe) → amber (warning) → rose (urgent)
  const ringColor =
    secondsLeft > 30
      ? "stroke-cyan-500"
      : secondsLeft > 10
        ? "stroke-amber-500"
        : "stroke-rose-500";

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4"
      dir={isRtl ? "rtl" : "ltr"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="idle-warning-title"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        {/* Countdown ring */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-100"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className={`${ringColor} transition-all duration-500 ease-linear`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Clock className="w-4 h-4 text-slate-500 mb-0.5" />
            <span className="text-2xl font-bold tabular-nums text-slate-900">
              {secondsLeft}
            </span>
          </div>
        </div>

        <h2
          id="idle-warning-title"
          className="text-lg font-bold text-cyan-900 mb-1"
        >
          {tr(
            "Still there?",
            "هل ما زلت موجودًا؟",
            "Hâlâ burada mısınız?"
          )}
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          {tr(
            `Your session will end in ${secondsLeft} seconds unless you continue working.`,
            `ستنتهي جلستك خلال ${secondsLeft} ثانية ما لم تستأنف العمل.`,
            `Devam etmezseniz ${secondsLeft} saniye içinde oturumunuz kapanacak.`
          )}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={onLogoutNow}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            {tr("Logout now", "تسجيل الخروج", "Şimdi çıkış")}
          </button>
          <button
            onClick={onContinue}
            autoFocus
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {tr(
              "Continue session",
              "متابعة الجلسة",
              "Oturuma devam et"
            )}
          </button>
        </div>

        <p className="text-[10px] text-slate-400 mt-3">
          {tr(
            "Zyrix auto-locks after inactivity to protect your data.",
            "يُقفل Zyrix تلقائيًا بعد عدم النشاط لحماية بياناتك.",
            "Zyrix, verilerinizi korumak için hareketsizlik sonrası otomatik kilitlenir."
          )}
        </p>
      </div>
    </div>
  );
}
