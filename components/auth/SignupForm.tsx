"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Loader2, Eye, EyeOff, Building2, User, Mail, Phone, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { GoogleButton } from "./GoogleButton";
import { extractErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface SignupFormProps {
  locale: string;
}

export function SignupForm({ locale }: SignupFormProps) {
  const t = useTranslations("Auth.signUp");
  const { signup } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    companyName: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    terms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.terms) {
      setError(t("terms"));
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        companyName: form.companyName,
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });
      // Redirect happens in context
    } catch (err) {
      setError(extractErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error banner */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/30">
          {error}
        </div>
      )}

      {/* Company Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-foreground"
        >
          {t("companyName")}
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            autoComplete="organization"
            value={form.companyName}
            onChange={handleChange}
            className={cn(
              "w-full pl-10 pr-4 py-2.5 text-sm",
              "bg-background border border-border rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "placeholder:text-muted-foreground",
              "transition-all"
            )}
            placeholder="Zyrix Inc."
          />
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-foreground"
        >
          {t("fullName")}
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground transition-all"
            placeholder="Mehmet Fatih"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
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

      {/* Phone (optional) */}
      <div className="space-y-1.5">
        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
          {t("phone")}{" "}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground transition-all"
            placeholder="+90 555 000 0000"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground"
        >
          {t("password")}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            minLength={8}
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
        <p className="text-xs text-muted-foreground">{t("passwordHint")}</p>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2 pt-2">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          checked={form.terms}
          onChange={handleChange}
          className="mt-0.5 w-4 h-4 text-primary border-border rounded focus:ring-primary"
        />
        <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
          {t("terms")}
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full py-3 px-4 text-sm font-medium rounded-lg",
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

      {/* Google Sign-up */}
      <GoogleButton mode="signup" onError={setError} />

      {/* Link to Sign In */}
      <p className="text-center text-sm text-muted-foreground pt-4">
        {t("hasAccount")}{" "}
        <Link
          href={`/${locale}/signin`}
          className="text-primary hover:text-primary font-medium hover:underline"
        >
          {t("signInLink")}
        </Link>
      </p>
    </form>
  );
}