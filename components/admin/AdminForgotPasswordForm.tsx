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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-cyan-50 to-sky-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-600 text-white px-4 py-1.5 text-xs font-semibold tracking-wide">
            <ShieldCheck size={14} />
            {t("badge")}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-cyan-200 shadow-xl shadow-cyan-900/10 p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              {t("forgot.title")}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {t("forgot.subtitle")}
            </p>
          </div>

          {submitted ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-cyan-50 border border-cyan-200 p-4 text-sm text-cyan-900">
                {t("forgot.neutralSuccess")}
              </div>
              <Link
                href={`/${locale}/admin/login`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 px-4 text-sm transition-colors"
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
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  {t("email")}
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute top-1/2 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3"
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 py-2.5 ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="admin@zyrix.co"
                  />
                </div>
              </div>

              {rateLimited && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                  {t("forgot.rateLimited")}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !validEmail(email)}
                className="w-full rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-4 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? t("forgot.sending") : t("forgot.send")}
              </button>

              <div className="text-center">
                <Link
                  href={`/${locale}/admin/login`}
                  className="text-sm text-cyan-700 hover:text-cyan-900"
                >
                  {t("forgot.backToLogin")}
                </Link>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Zyrix CRM · {t("brand")}
        </p>
      </div>
    </div>
  );
}
