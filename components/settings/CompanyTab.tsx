"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, Building2, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { updateCompanyApi } from "@/lib/api/auth";
import { extractErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

export function CompanyTab() {
  const t = useTranslations("Settings.company");
  const { user, company, refresh } = useAuth();

  const [form, setForm] = useState({
    name: company?.name || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canEdit = user?.role === "owner" || user?.role === "admin";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await updateCompanyApi({ name: form.name });
      await refresh();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-xl">
      <h2 className="text-lg font-bold text-foreground">{t("heading")}</h2>

      {!canEdit && (
        <div className="bg-warning-light text-warning-dark text-sm p-3 rounded-lg border border-warning/20">
          {t("restricted")}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-rose-500/10 text-rose-300 text-sm p-3 rounded-lg border border-rose-500/30/20">
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
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            {t("name")}
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="name"
              type="text"
              required
              disabled={!canEdit}
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-muted disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">{t("slug")}</label>
          <input
            type="text"
            value={company?.slug || ""}
            disabled
            className="w-full px-4 py-2.5 text-sm bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">{t("plan")}</label>
          <div className="flex items-center gap-2 px-4 py-3 bg-primary/15 border border-primary-200 rounded-lg">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary capitalize">
              {company?.plan || "free"}
            </span>
          </div>
        </div>

        {canEdit && (
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "px-6 py-2.5 text-sm font-medium rounded-lg bg-primary text-white",
              "hover:bg-primary disabled:opacity-60",
              "flex items-center gap-2 transition-all"
            )}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("save")}
          </button>
        )}
      </form>
    </div>
  );
}
