"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { confirmAdminPasswordReset } from "@/lib/api/admin";
import type { AxiosError } from "axios";
import { ShieldCheck, Lock, Eye, EyeOff, Check, Circle, X } from "lucide-react";

interface Check {
  ok: boolean;
  label: string;
}

export default function AdminResetPasswordForm({ locale }: { locale: string }) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const checks: Check[] = useMemo(
    () => [
      { ok: password.length >= 12, label: t("reset.reqLength") },
      { ok: /[A-Za-z]/.test(password), label: t("reset.reqLetter") },
      { ok: /\d/.test(password), label: t("reset.reqDigit") },
    ],
    [password, t]
  );

  const allValid = checks.every((c) => c.ok);
  const matches = password.length > 0 && password === confirm;

  useEffect(() => {
    if (!success) return;
    const id = window.setTimeout(() => {
      router.push(`/${locale}/admin/login`);
    }, 2000);
    return () => window.clearTimeout(id);
  }, [success, router, locale]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!allValid || !matches) return;
    setLoading(true);
    setError(null);
    try {
      await confirmAdminPasswordReset(token, password);
      setSuccess(true);
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: { code: string; message: string } }>;
      const message = axiosErr.response?.data?.error?.message;
      if (message?.includes("already been used")) {
        setError(t("reset.usedLink"));
      } else if (message?.includes("expired")) {
        setError(t("reset.expiredLink"));
      } else if (message?.includes("Invalid")) {
        setError(t("reset.invalidLink"));
      } else {
        setError(message ?? t("reset.genericError"));
      }
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-sky-50 to-sky-100 px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-card border border-border shadow-xl shadow-sky-900/10 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
              <X size={22} />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {t("reset.invalidLink")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("reset.invalidLinkBody")}
            </p>
            <Link
              href={`/${locale}/admin/forgot-password`}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-5 text-sm transition-colors"
            >
              {t("reset.requestNew")}
            </Link>
          </div>
        </div>
      </div>
    );
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
              {t("reset.title")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("reset.subtitle")}
            </p>
          </div>

          {success ? (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-900 flex items-center gap-2">
              <Check size={16} />
              {t("reset.successToast")}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("reset.newPassword")}
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute top-1/2 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3"
                  />
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card text-foreground py-2.5 ltr:pl-9 ltr:pr-10 rtl:pr-9 rtl:pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground ltr:right-3 rtl:left-3"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    {t("reset.requirementsTitle")}
                  </p>
                  <ul className="space-y-1">
                    {checks.map((c) => (
                      <li
                        key={c.label}
                        className={`flex items-center gap-2 text-xs ${
                          c.ok ? "text-emerald-300" : "text-muted-foreground"
                        }`}
                      >
                        {c.ok ? (
                          <Check size={12} className="text-emerald-300" />
                        ) : (
                          <Circle size={10} className="text-muted-foreground" />
                        )}
                        {c.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  {t("reset.confirmPassword")}
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute top-1/2 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3"
                  />
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card text-foreground py-2.5 ltr:pl-9 ltr:pr-10 rtl:pr-9 rtl:pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground ltr:right-3 rtl:left-3"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirm.length > 0 && !matches && (
                  <p className="mt-1.5 text-xs text-rose-300">
                    {t("reset.mismatch")}
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-red-800 space-y-2">
                  <p>{error}</p>
                  <Link
                    href={`/${locale}/admin/forgot-password`}
                    className="inline-block text-xs font-medium text-cyan-300 hover:text-foreground underline"
                  >
                    {t("reset.requestNew")}
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !allValid || !matches}
                className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-4 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? t("reset.submitting") : t("reset.submit")}
              </button>
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
