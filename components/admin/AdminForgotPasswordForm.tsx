"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { requestAdminPasswordReset } from "@/lib/api/admin";
import type { AxiosError } from "axios";
import { ShieldCheck, Mail, ArrowLeft } from "lucide-react";

export default function AdminForgotPasswordForm({ locale }: { locale: string }) {
  const t = useTranslations("Admin");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  function validEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validEmail(email)) return;
    setLoading(true);
    setRateLimited(false);
    try {
      await requestAdminPasswordReset(email.trim());
      setSubmitted(true);
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: { code: string } }>;
      const status = axiosErr.response?.status;
      if (status === 429 || axiosErr.response?.data?.error?.code === "RATE_LIMITED") {
        setRateLimited(true);
      } else {
        // Network / 5xx — still show neutral success to prevent enumeration.
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-sky-50 to-sky-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500 text-white px-4 py-1.5 text-xs font-semibold tracking-wide">
            <ShieldCheck size={14} />
            {t("badge")}
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border shadow-xl shadow-sky-900/10 p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">
              {t("forgot.title")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("forgot.subtitle")}
            </p>
          </div>

          {submitted ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted border border-border p-4 text-sm text-foreground">
                {t("forgot.neutralSuccess")}
              </div>
              <Link
                href={`/${locale}/admin/login`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-card border border-border hover:bg-muted text-foreground font-medium py-2.5 px-4 text-sm transition-colors"
              >
                <ArrowLeft size={14} className="ltr:inline rtl:hidden" />
                {t("forgot.backToLogin")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("email")}
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute top-1/2 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3"
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card text-foreground py-2.5 ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="admin@zyrix.co"
                  />
                </div>
              </div>

              {rateLimited && (
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-sm text-amber-800">
                  {t("forgot.rateLimited")}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !validEmail(email)}
                className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-4 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? t("forgot.sending") : t("forgot.send")}
              </button>

              <div className="text-center">
                <Link
                  href={`/${locale}/admin/login`}
                  className="text-sm text-cyan-300 hover:text-foreground"
                >
                  {t("forgot.backToLogin")}
                </Link>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Zyrix CRM · {t("brand")}
        </p>
      </div>
    </div>
  );
}
