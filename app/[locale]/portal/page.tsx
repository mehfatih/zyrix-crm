"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Mail,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { requestMagicLink } from "@/lib/api/portal";

// ============================================================================
// CUSTOMER PORTAL — LOGIN PAGE
// ============================================================================

export default function PortalLoginPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Portal.login");

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const portalUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/${locale}/portal/callback`
          : "";
      await requestMagicLink(email.trim(), portalUrl);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl shadow-lg mb-3">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("brandTitle")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("brandSubtitle")}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          {sent ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500/10 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">
                {t("sent.title")}
              </h2>
              <p className="text-sm text-muted-foreground mb-1">
                {t("sent.sentTo")}{" "}
                <span className="font-medium text-cyan-300">{email}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-4">{t("sent.hint")}</p>
              <button
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="text-xs text-cyan-300 hover:text-foreground mt-4"
              >
                {t("sent.tryAgain")}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="text-lg font-bold text-foreground mb-1">
                {t("title")}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">{t("subtitle")}</p>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  {t("emailLabel")}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    disabled={loading}
                    className="w-full ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-rose-500/10 text-rose-300 border border-rose-500/30 text-sm p-2 rounded-lg border border-red-100 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                {t("submit")}
              </button>

              <p className="text-xs text-muted-foreground text-center pt-2">
                {t("footerHint")}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
