"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Network,
  Key,
  Plus,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  listScimTokens,
  issueScimToken,
  revokeScimToken,
  type ScimToken,
  type IssuedScimToken,
} from "@/lib/api/advanced";
import { extractErrorMessage } from "@/lib/errors";

type Locale = "en" | "ar" | "tr";

// API URL is a build-time env so we can show the tenant URL in the setup
// snippets without requiring the user to type it.
const API_URL =
  typeof window !== "undefined"
    ? (window as any).__API_URL__ ?? "https://api.crm.zyrix.co"
    : "https://api.crm.zyrix.co";

const SCIM_BASE = `${API_URL}/scim/v2`;

export default function ScimPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as Locale;
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [tokens, setTokens] = useState<ScimToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [justIssued, setJustIssued] = useState<IssuedScimToken | null>(null);
  const [activeProvider, setActiveProvider] = useState<
    "okta" | "azure" | "google" | "jumpcloud"
  >("okta");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTokens(await listScimTokens());
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleIssue = async () => {
    const label = newLabel.trim();
    if (!label) {
      setError(tr("Label required", "الوسم مطلوب", "Etiket gerekli"));
      return;
    }
    setError(null);
    try {
      const token = await issueScimToken(label);
      setJustIssued(token);
      setNewLabel("");
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  const handleRevoke = async (token: ScimToken) => {
    if (
      !confirm(
        tr(
          `Revoke "${token.label}"? The IdP using it will stop provisioning.`,
          `إلغاء "${token.label}"؟ ستتوقف عمليات التوفير من مزود الهوية.`,
          `"${token.label}" iptal edilsin mi? Kimlik sağlayıcı sağlama işlemlerini durduracak.`
        )
      )
    )
      return;
    try {
      await revokeScimToken(token.id);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setSuccess(tr("Copied.", "تم النسخ.", "Kopyalandı."));
      setTimeout(() => setSuccess(null), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-4xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
        <div className="flex items-start gap-3">
          <Link
            href={`/${locale}/settings`}
            className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-cyan-300"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">SETTINGS</p>
            <h1 className="text-2xl font-bold text-foreground">
              {tr(
                "SCIM provisioning",
                "توفير SCIM",
                "SCIM sağlama"
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {tr(
                "Sync users from your identity provider (Okta, Azure AD, Google Workspace, JumpCloud).",
                "مزامنة المستخدمين من مزود الهوية (Okta, Azure AD, Google Workspace, JumpCloud).",
                "Kullanıcıları kimlik sağlayıcınızdan senkronize edin (Okta, Azure AD, Google Workspace, JumpCloud)."
              )}
            </p>
          </div>
        </div>

        {success && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center gap-2 text-sm text-emerald-900">
            <CheckCircle2 className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 flex items-start gap-2 text-sm text-rose-300">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {justIssued && (
          <div className="rounded-xl border border-amber-300 bg-amber-500/10 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-300" />
              <h3 className="text-sm font-bold text-amber-900">
                {tr(
                  "Copy this SCIM token now",
                  "انسخ رمز SCIM الآن",
                  "SCIM jetonunu şimdi kopyalayın"
                )}
              </h3>
              <button
                onClick={() => setJustIssued(null)}
                className="ms-auto rtl:me-auto rtl:ms-0 text-amber-300 hover:text-amber-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <code
                dir="ltr"
                className="flex-1 min-w-0 bg-card px-3 py-2 rounded-lg text-xs font-mono break-all border border-amber-500/30"
              >
                {justIssued.plaintext}
              </code>
              <button
                onClick={() => copyToClipboard(justIssued.plaintext)}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                <Copy className="w-3.5 h-3.5" />
                {tr("Copy", "نسخ", "Kopyala")}
              </button>
            </div>
          </div>
        )}

        {/* Tokens */}
        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm font-bold text-foreground inline-flex items-center gap-2">
              <Key className="w-4 h-4" />
              {tr("SCIM tokens", "رموز SCIM", "SCIM jetonları")}
            </h2>
            <div className="flex items-center gap-2">
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder={tr(
                  "Label (e.g. Okta prod)",
                  "وسم (مثل Okta prod)",
                  "Etiket (örn. Okta prod)"
                )}
                maxLength={120}
                className="px-3 py-1.5 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleIssue}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
              >
                <Plus className="w-3 h-3" />
                {tr("Issue", "إصدار", "Yayınla")}
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-300" />
            </div>
          ) : tokens.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              {tr(
                "No tokens yet — issue one to configure your IdP.",
                "لا رموز بعد — أصدر واحدًا لإعداد مزود الهوية.",
                "Henüz jeton yok — IdP'nizi yapılandırmak için bir tane oluşturun."
              )}
            </p>
          ) : (
            <div className="space-y-2">
              {tokens.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 p-2 rounded-lg border border-border bg-muted/30"
                >
                  <Key className="w-3.5 h-3.5 text-cyan-300" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-foreground">
                        {t.label}
                      </span>
                      <code
                        dir="ltr"
                        className="text-[10px] font-mono text-muted-foreground"
                      >
                        {t.prefix}…
                      </code>
                      {t.revokedAt && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/10 text-rose-300 border border-rose-500/30 border border-rose-500/30">
                          {tr("Revoked", "ملغى", "İptal edildi")}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {t.lastUsedAt
                        ? tr(
                            `Last used ${new Date(t.lastUsedAt).toLocaleDateString()}`,
                            `آخر استخدام ${new Date(t.lastUsedAt).toLocaleDateString()}`,
                            `Son kullanım ${new Date(t.lastUsedAt).toLocaleDateString()}`
                          )
                        : tr("Never used", "لم يُستخدم", "Hiç kullanılmadı")}
                    </div>
                  </div>
                  {!t.revokedAt && (
                    <button
                      onClick={() => handleRevoke(t)}
                      className="px-2 py-1 text-[10px] font-bold uppercase text-rose-300 hover:bg-rose-500/10 rounded"
                    >
                      {tr("Revoke", "إلغاء", "İptal")}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Setup instructions */}
        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-sm font-bold text-foreground">
            {tr("Setup", "الإعداد", "Kurulum")}
          </h2>
          <div className="flex flex-wrap gap-1 text-xs font-semibold">
            {(
              [
                ["okta", "Okta"],
                ["azure", "Azure AD"],
                ["google", "Google"],
                ["jumpcloud", "JumpCloud"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveProvider(key)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  activeProvider === key
                    ? "bg-sky-500 text-white border-sky-500"
                    : "bg-card border-border text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="rounded-lg bg-muted border border-border p-3 space-y-2 text-xs text-foreground">
            <div>
              <div className="font-bold text-foreground text-[10px] uppercase tracking-wide">
                {tr("SCIM base URL", "رابط SCIM", "SCIM temel URL")}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <code
                  dir="ltr"
                  className="flex-1 min-w-0 bg-card px-2 py-1.5 rounded border border-border font-mono break-all"
                >
                  {SCIM_BASE}
                </code>
                <button
                  onClick={() => copyToClipboard(SCIM_BASE)}
                  className="px-2 py-1 rounded bg-sky-500 text-white text-[10px] font-bold uppercase"
                >
                  <Copy className="w-3 h-3 inline" />
                </button>
              </div>
            </div>
            <div>
              <div className="font-bold text-foreground text-[10px] uppercase tracking-wide">
                {tr("Authentication", "المصادقة", "Kimlik doğrulama")}
              </div>
              <p className="mt-1">
                {tr(
                  "OAuth Bearer — paste the scim_* token you issued above into the API token field.",
                  "OAuth Bearer — الصق رمز scim_* الذي أصدرته أعلاه في حقل رمز الـ API.",
                  "OAuth Bearer — yukarıda oluşturduğunuz scim_* jetonunu API jetonu alanına yapıştırın."
                )}
              </p>
            </div>
            <ProviderHints provider={activeProvider} tr={tr} base={SCIM_BASE} />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function ProviderHints({
  provider,
  tr,
  base,
}: {
  provider: "okta" | "azure" | "google" | "jumpcloud";
  tr: (en: string, ar: string, trk: string) => string;
  base: string;
}) {
  switch (provider) {
    case "okta":
      return (
        <ol className="list-decimal ms-5 rtl:me-5 rtl:ms-0 space-y-1">
          <li>
            {tr("Admin → Applications → Browse App Catalog → 'SCIM 2.0 Test App (Header Auth)'",
                "Admin → Applications → Browse App Catalog → 'SCIM 2.0 Test App (Header Auth)'",
                "Admin → Applications → Browse App Catalog → 'SCIM 2.0 Test App (Header Auth)'")}
          </li>
          <li>
            {tr("General → Provisioning → Configure API integration:",
                "General → Provisioning → Configure API integration:",
                "General → Provisioning → Configure API integration:")}
            <br />
            <code className="block mt-1 bg-card px-2 py-1 rounded text-[11px] font-mono">
              Base URL: <span dir="ltr">{base}</span>
              {"\n"}Auth header: <span dir="ltr">Authorization: Bearer scim_…</span>
            </code>
          </li>
          <li>{tr("Enable Create, Update, Deactivate Users.", "فعّل إنشاء، تحديث، إلغاء تنشيط المستخدمين.", "Kullanıcı oluşturma, güncelleme, devre dışı bırakmayı etkinleştir.")}</li>
        </ol>
      );
    case "azure":
      return (
        <ol className="list-decimal ms-5 rtl:me-5 rtl:ms-0 space-y-1">
          <li>{tr("Enterprise applications → New application → Non-gallery.", "Enterprise applications → New application → Non-gallery.", "Enterprise applications → New application → Non-gallery.")}</li>
          <li>
            {tr("Provisioning → Automatic:",
                "Provisioning → Automatic:",
                "Provisioning → Automatic:")}
            <br />
            <code className="block mt-1 bg-card px-2 py-1 rounded text-[11px] font-mono">
              Tenant URL: <span dir="ltr">{base}</span>
              {"\n"}Secret Token: <span dir="ltr">scim_…</span>
            </code>
          </li>
          <li>{tr("Test connection → Save → Start provisioning.", "Test connection → Save → Start provisioning.", "Test connection → Save → Start provisioning.")}</li>
        </ol>
      );
    case "google":
      return (
        <ol className="list-decimal ms-5 rtl:me-5 rtl:ms-0 space-y-1">
          <li>{tr("Admin Console → Apps → Web and mobile apps → Add custom SAML/SCIM app.", "Admin Console → Apps → Web and mobile apps → Add custom SAML/SCIM app.", "Admin Console → Apps → Web and mobile apps → Add custom SAML/SCIM app.")}</li>
          <li>
            <code className="block mt-1 bg-card px-2 py-1 rounded text-[11px] font-mono">
              Endpoint URL: <span dir="ltr">{base}</span>
              {"\n"}Bearer token: <span dir="ltr">scim_…</span>
            </code>
          </li>
          <li>{tr("Map attributes: userName → primaryEmail, name.givenName → givenName, name.familyName → familyName.", "خريطة السمات: userName → primaryEmail، name.givenName → givenName، name.familyName → familyName.", "Özellik eşleme: userName → primaryEmail, name.givenName → givenName, name.familyName → familyName.")}</li>
        </ol>
      );
    case "jumpcloud":
      return (
        <ol className="list-decimal ms-5 rtl:me-5 rtl:ms-0 space-y-1">
          <li>{tr("SSO applications → Custom SCIM Application.", "SSO applications → Custom SCIM Application.", "SSO applications → Custom SCIM Application.")}</li>
          <li>
            <code className="block mt-1 bg-card px-2 py-1 rounded text-[11px] font-mono">
              Base URL: <span dir="ltr">{base}</span>
              {"\n"}Token: <span dir="ltr">scim_…</span>
              {"\n"}SCIM version: 2.0
            </code>
          </li>
          <li>{tr("Test → Activate.", "Test → Activate.", "Test → Activate.")}</li>
        </ol>
      );
  }
}
