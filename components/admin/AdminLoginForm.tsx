"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  adminLogin,
  getAdminRememberMePref,
  setAdminRememberMePref,
} from "@/lib/api/admin";
import type { AxiosError } from "axios";
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";

// ============================================================================
// ADMIN LOGIN FORM
// ============================================================================

export default function AdminLoginForm({ locale }: { locale: string }) {
  const t = useTranslations("Admin");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRememberMe(getAdminRememberMePref());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setAdminRememberMePref(rememberMe);

    try {
      await adminLogin(email.trim(), password, rememberMe);
      router.push(`/${locale}/admin/dashboard`);
    } catch (err) {
      const axiosErr = err as AxiosError<{
        error?: { code: string; message: string };
      }>;
      const code = axiosErr.response?.data?.error?.code;
      if (code === "FORBIDDEN") {
        setError(t("forbidden"));
      } else {
        setError(t("wrongCredentials"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-sky-50 to-sky-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Admin mode badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500 text-white px-4 py-1.5 text-xs font-semibold tracking-wide">
            <ShieldCheck size={14} />
            {t("badge")}
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-card border border-border shadow-xl shadow-sky-900/10 p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">
              {t("loginTitle")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("loginSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                {t("password")}
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card text-foreground py-2.5 ltr:pl-9 ltr:pr-10 rtl:pr-9 rtl:pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground ltr:right-3 rtl:left-3"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="mt-1.5 text-end ltr:text-right rtl:text-left">
                <Link
                  href={`/${locale}/admin/forgot-password`}
                  className="text-xs font-medium text-cyan-300 hover:text-foreground"
                >
                  {t("forgot.linkFromLogin")}
                </Link>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border text-cyan-300 focus:ring-primary"
              />
              {t("rememberMe")}
            </label>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-4 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t("signingIn") : t("signIn")}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Zyrix CRM · {t("brand")}
        </p>
      </div>
    </div>
  );
}
