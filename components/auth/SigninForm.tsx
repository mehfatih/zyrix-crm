"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { GoogleButton } from "./GoogleButton";
import { extractErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface SigninFormProps {
  locale: string;
}

export function SigninForm({ locale }: SigninFormProps) {
  const t = useTranslations("Auth.signIn");
  const { signin, complete2FAChallenge } = useAuth();
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  // ─── 2FA challenge state ───────────────────────────────────────────
  // When the first step returns { requires2FA }, we store the challenge
  // token here and flip the UI to a TOTP prompt. The email+password
  // form is hidden but kept mounted so Back can return to it without
  // clearing the user's password.
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [useBackup, setUseBackup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await signin(form);
      if (result && result.requires2FA) {
        setChallengeToken(result.challengeToken);
        setIsSubmitting(false);
      }
      // Otherwise signin already routed to /dashboard — nothing to do.
    } catch (err) {
      setError(extractErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  const handleVerify2FA = async (e: FormEvent) => {
    e.preventDefault();
    if (!challengeToken) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await complete2FAChallenge(challengeToken, otp);
    } catch (err) {
      setError(extractErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  // ─── 2FA challenge step ────────────────────────────────────────────
  if (challengeToken) {
    return (
      <form onSubmit={handleVerify2FA} className="space-y-4">
        <div className="flex items-center justify-center mb-2">
          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground">
            {tr(
              "Two-factor verification",
              "التحقق بخطوتين",
              "İki adımlı doğrulama"
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {useBackup
              ? tr(
                  "Enter one of your backup codes",
                  "أدخل أحد رموز الاسترداد",
                  "Yedek kodlarınızdan birini girin"
                )
              : tr(
                  "Enter the 6-digit code from your authenticator app",
                  "أدخل الرمز المكون من 6 أرقام من تطبيق المصادقة",
                  "Kimlik doğrulayıcı uygulamanızdan 6 haneli kodu girin"
                )}
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/30">
            {error}
          </div>
        )}

        <div>
          <input
            type="text"
            inputMode={useBackup ? "text" : "numeric"}
            autoComplete="one-time-code"
            autoFocus
            value={otp}
            onChange={(e) =>
              setOtp(
                useBackup
                  ? e.target.value
                  : e.target.value.replace(/\D/g, "").slice(0, 6)
              )
            }
            placeholder={useBackup ? "XXXX-XXXX" : "000000"}
            maxLength={useBackup ? 9 : 6}
            className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={
            isSubmitting || (useBackup ? otp.length < 8 : otp.length !== 6)
          }
          className="w-full py-3 px-4 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {tr("Verify", "تحقق", "Doğrula")}
        </button>

        <div className="flex items-center justify-between pt-2 text-sm">
          <button
            type="button"
            onClick={() => {
              setChallengeToken(null);
              setOtp("");
              setUseBackup(false);
              setError(null);
            }}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {tr("Back", "رجوع", "Geri")}
          </button>
          <button
            type="button"
            onClick={() => {
              setUseBackup((b) => !b);
              setOtp("");
              setError(null);
            }}
            className="inline-flex items-center gap-1 text-primary hover:text-primary/80 hover:underline"
          >
            <KeyRound className="w-3.5 h-3.5" />
            {useBackup
              ? tr(
                  "Use authenticator instead",
                  "استخدم التطبيق بدلاً من ذلك",
                  "Bunun yerine uygulamayı kullan"
                )
              : tr(
                  "Use a backup code",
                  "استخدم رمز استرداد",
                  "Yedek kod kullan"
                )}
          </button>
        </div>
      </form>
    );
  }

  // ─── Standard email+password step ──────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/30">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          {t("email")}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground transition-all"
            placeholder="you@company.com"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            {t("password")}
          </label>
          <Link
            href={`/${locale}/forgot-password`}
            className="text-xs text-primary hover:text-primary hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground transition-all"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full py-3 px-4 text-sm font-medium rounded-lg mt-6",
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 active:bg-primary/80",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "transition-all shadow-sm hover:shadow-md",
          "flex items-center justify-center gap-2"
        )}
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {t("submit")}
      </button>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground uppercase">
            {t("orContinueWith")}
          </span>
        </div>
      </div>

      {/* Google Sign-in */}
      <GoogleButton mode="signin" onError={setError} />

      {/* Link to Sign Up */}
      <p className="text-center text-sm text-muted-foreground pt-4">
        {t("noAccount")}{" "}
        <Link
          href={`/${locale}/signup`}
          className="text-primary hover:text-primary font-medium hover:underline"
        >
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}
