"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { adminLogin } from "@/lib/api/admin";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await adminLogin(email.trim(), password);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-cyan-50 to-sky-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Admin mode badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-600 text-white px-4 py-1.5 text-xs font-semibold tracking-wide">
            <ShieldCheck size={14} />
            {t("badge")}
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white border border-cyan-200 shadow-xl shadow-cyan-900/10 p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              {t("loginTitle")}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {t("loginSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                {t("password")}
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 py-2.5 ltr:pl-9 ltr:pr-10 rtl:pr-9 rtl:pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ltr:right-3 rtl:left-3"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-4 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t("signingIn") : t("signIn")}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Zyrix CRM · {t("brand")}
        </p>
      </div>
    </div>
  );
}
