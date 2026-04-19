"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { extractErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface SigninFormProps {
  locale: string;
}

export function SigninForm({ locale }: SigninFormProps) {
  const t = useTranslations("Auth.signIn");
  const { signin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signin(form);
    } catch (err) {
      setError(extractErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-danger-light text-danger-dark text-sm p-3 rounded-lg border border-danger/20">
          {error}
        </div>
      )}

      {/* Email */}
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
            value={form.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-ink-muted transition-all"
            placeholder="you@company.com"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-ink"
          >
            {t("password")}
          </label>
          <Link
            href={`/${locale}/forgot-password`}
            className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-ink-muted transition-all"
            placeholder="••••••••"
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full py-3 px-4 text-sm font-medium rounded-lg mt-6",
          "bg-primary-600 text-white",
          "hover:bg-primary-700 active:bg-primary-800",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "transition-all shadow-sm hover:shadow-md",
          "flex items-center justify-center gap-2"
        )}
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {t("submit")}
      </button>

      {/* Link to Sign Up */}
      <p className="text-center text-sm text-ink-light pt-4">
        {t("noAccount")}{" "}
        <Link
          href={`/${locale}/signup`}
          className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
        >
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}