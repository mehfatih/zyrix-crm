"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, Lock, LogOut, Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { changePasswordApi } from "@/lib/api/auth";
import { extractErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface SecurityTabProps {
  locale: string;
}

export function SecurityTab({ locale }: SecurityTabProps) {
  const t = useTranslations("Settings.security");
  const { logout } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    if (form.newPassword.length < 8) {
      setError(t("passwordTooShort"));
      return;
    }

    setIsSubmitting(true);
    try {
      await changePasswordApi({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      router.push(`/${locale}/signin`);
    }
  };

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-600" />
          {t("changePasswordHeading")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-danger-light text-danger-dark text-sm p-3 rounded-lg border border-danger/20">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-success-light text-success-dark text-sm p-3 rounded-lg border border-success/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {t("success")}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">
              {t("currentPassword")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">
              {t("newPassword")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <p className="text-xs text-ink-muted">{t("passwordHint")}</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">
              {t("confirmNewPassword")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "px-6 py-2.5 text-sm font-medium rounded-lg bg-primary-600 text-white",
              "hover:bg-primary-700 disabled:opacity-60",
              "flex items-center gap-2 transition-all"
            )}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("updatePassword")}
          </button>
        </form>
      </div>

      <div className="border-t border-line pt-6">
        <h3 className="text-lg font-bold text-ink mb-2">{t("sessionsHeading")}</h3>
        <p className="text-sm text-ink-light mb-4">{t("sessionsMessage")}</p>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            "px-6 py-2.5 text-sm font-medium rounded-lg",
            "bg-white border border-danger text-danger",
            "hover:bg-danger hover:text-white disabled:opacity-60",
            "flex items-center gap-2 transition-all"
          )}
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          {t("signOut")}
        </button>
      </div>
    </div>
  );
}
