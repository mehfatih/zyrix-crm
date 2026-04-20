"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { requestPasswordResetApi } from "@/lib/api/auth";
import { extractErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface ForgotPasswordClientProps {
  locale: string;
}

export function ForgotPasswordClient({ locale }: ForgotPasswordClientProps) {
  const t = useTranslations("Auth.forgotPassword");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await requestPasswordResetApi(email);
      setSent(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">{t("checkEmail")}</h2>
        <p className="text-sm text-ink-light mb-6">
          {t("checkEmailMessage", { email })}
        </p>
        <Link
          href={`/${locale}/signin`}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToSignIn")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-danger-light text-danger-dark text-sm p-3 rounded-lg border border-danger/20">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          {t("email")}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-ink-muted transition-all"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full py-3 px-4 text-sm font-medium rounded-lg mt-6",
          "bg-primary-600 text-white",
          "hover:bg-primary-700 active:bg-primary-800",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "transition-all shadow-sm hover:shadow-md",
          "flex items-center justify-center gap-2"
        )}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {t("submit")}
      </button>

      <p className="text-center text-sm text-ink-light pt-4">
        <Link
          href={`/${locale}/signin`}
          className="text-primary-600 hover:text-primary-700 font-medium hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t("backToSignIn")}
        </Link>
      </p>
    </form>
  );
}
