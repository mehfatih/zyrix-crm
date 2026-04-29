"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Loader2,
  AlertTriangle,
  FileText,
  Zap,
  ExternalLink,
  ShieldCheck,
  Clock,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import {
  listApiKeys,
  createApiKey,
  revokeApiKey,
  type ApiKeyRecord,
  type ApiKeyWithSecret,
} from "@/lib/api/advanced";

// ============================================================================
// SETTINGS → API KEYS
// ----------------------------------------------------------------------------
// Owner/admin users create keys, copy the plaintext ONCE (it's never
// shown again), name them, and revoke when no longer needed. The page
// doubles as the discovery point for Zapier integration and the
// OpenAPI docs.
// ============================================================================

export default function ApiKeysPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "admin";

  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newlyCreated, setNewlyCreated] =
    useState<ApiKeyWithSecret | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [showRevoked, setShowRevoked] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listApiKeys(showRevoked);
      setKeys(data);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRevoked]);

  const handleRevoke = async (key: ApiKeyRecord) => {
    if (
      !confirm(
        tr(
          `Revoke "${key.name}"? Integrations using this key will stop working immediately.`,
          `إلغاء "${key.name}"؟ التكاملات اللي بتستعمل هذا المفتاح هتقف على طول.`,
          `"${key.name}" iptal edilsin mi? Bu anahtarı kullanan entegrasyonlar hemen çalışmayı durduracak.`
        )
      )
    )
      return;
    setRevoking(key.id);
    try {
      await revokeApiKey(key.id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message);
    } finally {
      setRevoking(null);
    }
  };

  const active = keys.filter((k) => !k.revokedAt);
  const revoked = keys.filter((k) => k.revokedAt);

  return (
    <>
      <div
        className="p-6 max-w-4xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow flex-shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">SETTINGS</p>
            <h1 className="text-2xl font-bold text-foreground">
              {tr("API keys", "مفاتيح API", "API anahtarları")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {tr(
                "Give third-party apps access to your Zyrix data — Zapier, custom scripts, and mobile apps.",
                "امنح التطبيقات الخارجية وصولًا لبيانات Zyrix — Zapier، السكريبتات المخصصة، وتطبيقات الموبايل.",
                "Üçüncü taraf uygulamalara Zyrix verilerinize erişim verin — Zapier, özel betikler ve mobil uygulamalar."
              )}
            </p>
          </div>
        </div>

        {/* Quick links panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={`/${locale}/settings/api/docs`}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-sky-300 hover:bg-muted/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-muted text-cyan-300 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">
                {tr(
                  "API documentation",
                  "توثيق الـ API",
                  "API dokümantasyonu"
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {tr(
                  "OpenAPI spec + endpoint reference",
                  "مواصفات OpenAPI + مرجع الـ endpoints",
                  "OpenAPI spesifikasyonu + endpoint referansı"
                )}
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </Link>
          {/* Sprint 14ae — Zapier card: dark amber gradient (was light amber-50/orange-50) */}
          <a
            href="https://zapier.com/apps/search?q=zyrix"
            target="_blank"
            rel="noopener"
            className="group flex items-center gap-3 p-4 rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/8 hover:border-amber-500/45 transition-colors"
          >
            <div className="w-11 h-11 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base font-semibold text-foreground flex items-center gap-2">
                {tr(
                  "Connect with Zapier",
                  "اربط مع Zapier",
                  "Zapier ile bağlan"
                )}
                <ExternalLink className="w-3.5 h-3.5 text-amber-300 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-sm text-amber-200/80 mt-0.5">
                {tr(
                  "5,000+ apps — Gmail, Sheets, Slack, and more",
                  "5,000+ تطبيق — Gmail، Sheets، Slack، وأكثر",
                  "5.000+ uygulama — Gmail, Sheets, Slack ve daha fazlası"
                )}
              </div>
            </div>
          </a>
        </div>

        {/* Not admin notice */}
        {!canManage && (
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900">
              {tr(
                "Only owners and admins can create or revoke API keys.",
                "فقط المالكين والمسؤولين يقدروا يُنشئوا أو يلغوا مفاتيح API.",
                "Yalnızca sahipler ve yöneticiler API anahtarları oluşturabilir veya iptal edebilir."
              )}
            </p>
          </div>
        )}

        {/* Active keys section */}
        <section>
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {tr("Active keys", "المفاتيح النشطة", "Etkin anahtarlar")}
              <span className="text-xs text-muted-foreground font-normal">
                ({active.length})
              </span>
            </h2>
            {canManage && (
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                {tr("New key", "مفتاح جديد", "Yeni anahtar")}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
              {error}
            </div>
          ) : active.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
              <Key className="w-6 h-6 text-cyan-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">
                {tr(
                  "No active API keys",
                  "لا مفاتيح API نشطة",
                  "Etkin API anahtarı yok"
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {tr(
                  "Create one to start integrating with external tools.",
                  "أنشئ واحد لتبدأ التكامل مع الأدوات الخارجية.",
                  "Harici araçlarla entegre olmaya başlamak için bir tane oluşturun."
                )}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-sky-50">
              {active.map((k) => (
                <KeyRow
                  key={k.id}
                  item={k}
                  locale={locale}
                  tr={tr}
                  canRevoke={canManage}
                  onRevoke={() => handleRevoke(k)}
                  revoking={revoking === k.id}
                />
              ))}
            </div>
          )}
        </section>

        {/* Revoked keys toggle */}
        {revoked.length > 0 ? (
          <section>
            <button
              onClick={() => setShowRevoked((v) => !v)}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold uppercase tracking-wide"
            >
              {showRevoked
                ? tr(
                    "Hide revoked keys",
                    "إخفاء المفاتيح الملغاة",
                    "İptal edilen anahtarları gizle"
                  )
                : tr(
                    `Show revoked keys (${revoked.length})`,
                    `عرض المفاتيح الملغاة (${revoked.length})`,
                    `İptal edilen anahtarları göster (${revoked.length})`
                  )}
            </button>
            {showRevoked && (
              <div className="mt-3 rounded-xl border border-border bg-muted/50 overflow-hidden divide-y divide-border">
                {revoked.map((k) => (
                  <KeyRow
                    key={k.id}
                    item={k}
                    locale={locale}
                    tr={tr}
                    canRevoke={false}
                    onRevoke={() => {}}
                    revoking={false}
                    isRevoked
                  />
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>

      {/* Create modal */}
      {showCreate && (
        <CreateKeyModal
          locale={locale}
          tr={tr}
          onClose={() => setShowCreate(false)}
          onCreated={(key) => {
            setNewlyCreated(key);
            setShowCreate(false);
            load();
          }}
        />
      )}

      {/* 'Copy now, shown once' modal */}
      {newlyCreated && (
        <ShowKeyOnceModal
          keyData={newlyCreated}
          locale={locale}
          tr={tr}
          onClose={() => setNewlyCreated(null)}
        />
      )}
    </>
  );
}

// ============================================================================
// KEY ROW
// ============================================================================

function KeyRow({
  item,
  locale,
  tr,
  canRevoke,
  onRevoke,
  revoking,
  isRevoked,
}: {
  item: ApiKeyRecord;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  canRevoke: boolean;
  onRevoke: () => void;
  revoking: boolean;
  isRevoked?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 ${
        isRevoked ? "opacity-70" : "hover:bg-muted/40"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isRevoked
            ? "bg-muted text-muted-foreground"
            : "bg-muted text-cyan-300"
        }`}
      >
        <Key className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground truncate">
            {item.name}
          </span>
          <span
            className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 border ${
              item.scope === "write"
                ? "bg-indigo-500/10 text-indigo-700 border-indigo-200"
                : "bg-muted text-cyan-300 border-border"
            }`}
          >
            {item.scope}
          </span>
          {isRevoked && (
            <span className="text-[10px] font-bold uppercase rounded px-1.5 py-0.5 border bg-rose-500/10 text-rose-300 border border-rose-500/30">
              {tr("Revoked", "مُلغى", "İptal")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5 flex-wrap">
          <code className="font-mono" dir="ltr">
            zy_live_{item.keyPrefix}…
          </code>
          <span className="text-slate-300">·</span>
          <span>
            {tr("Created", "أُنشئ", "Oluşturuldu")}{" "}
            <time dir="ltr" className="tabular-nums">
              {new Date(item.createdAt).toLocaleDateString(
                locale === "ar"
                  ? "ar-SA"
                  : locale === "tr"
                    ? "tr-TR"
                    : "en-US",
                { year: "numeric", month: "short", day: "numeric" }
              )}
            </time>
          </span>
          {item.lastUsedAt && (
            <>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {tr("Last used", "آخر استعمال", "Son kullanım")}{" "}
                <time dir="ltr" className="tabular-nums">
                  {new Date(item.lastUsedAt).toLocaleDateString(
                    locale === "ar"
                      ? "ar-SA"
                      : locale === "tr"
                        ? "tr-TR"
                        : "en-US",
                    { month: "short", day: "numeric" }
                  )}
                </time>
              </span>
            </>
          )}
          {!item.lastUsedAt && !isRevoked && (
            <>
              <span className="text-slate-300">·</span>
              <span className="italic">
                {tr("Never used", "لم يُستعمل", "Hiç kullanılmadı")}
              </span>
            </>
          )}
        </div>
      </div>
      {canRevoke && (
        <button
          onClick={onRevoke}
          disabled={revoking}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-card border border-rose-500/30 hover:bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-md text-[11px] font-semibold disabled:opacity-50"
        >
          {revoking ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Trash2 className="w-3 h-3" />
          )}
          {tr("Revoke", "إلغاء", "İptal")}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// CREATE MODAL
// ============================================================================

function CreateKeyModal({
  locale,
  tr,
  onClose,
  onCreated,
}: {
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  onClose: () => void;
  onCreated: (key: ApiKeyWithSecret) => void;
}) {
  const [name, setName] = useState("");
  const [scope, setScope] = useState<"read" | "write">("write");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError(tr("Name is required", "الاسم مطلوب", "Ad gereklidir"));
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const key = await createApiKey({ name: name.trim(), scope });
      onCreated(key);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div
        className="bg-card rounded-2xl shadow-xl max-w-md w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">
            {tr("Create API key", "إنشاء مفتاح API", "API anahtarı oluştur")}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300 mb-3">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
              {tr("Label", "التسمية", "Etiket")}
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tr(
                "Zapier integration",
                "تكامل Zapier",
                "Zapier entegrasyonu"
              )}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              {tr(
                "A name only you'll see — e.g. 'Zapier', 'Sales team script'.",
                "اسم تشوفه إنت بس — مثال 'Zapier'، 'سكريبت فريق المبيعات'.",
                "Yalnızca sizin göreceğiniz bir ad — örn. 'Zapier', 'Satış ekibi betiği'."
              )}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
              {tr("Scope", "النطاق", "Kapsam")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScope("read")}
                className={`p-3 rounded-lg border text-left rtl:text-right ${
                  scope === "read"
                    ? "border-sky-400 bg-muted ring-2 ring-cyan-500/30"
                    : "border-border bg-card hover:border-sky-300"
                }`}
              >
                <div className="text-sm font-semibold text-foreground">
                  {tr("Read only", "قراءة فقط", "Yalnızca okuma")}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {tr(
                    "GET endpoints — inspections, reports",
                    "endpoints الـ GET — فحص، تقارير",
                    "GET endpointleri — denetim, raporlar"
                  )}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setScope("write")}
                className={`p-3 rounded-lg border text-left rtl:text-right ${
                  scope === "write"
                    ? "border-sky-400 bg-muted ring-2 ring-cyan-500/30"
                    : "border-border bg-card hover:border-sky-300"
                }`}
              >
                <div className="text-sm font-semibold text-foreground">
                  {tr("Full access", "وصول كامل", "Tam erişim")}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {tr(
                    "Read + create, update, delete",
                    "قراءة + إنشاء، تحديث، حذف",
                    "Okuma + oluşturma, güncelleme, silme"
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            {tr("Cancel", "إلغاء", "İptal")}
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Key className="w-4 h-4" />
            )}
            {tr("Create key", "إنشاء مفتاح", "Anahtar oluştur")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 'SHOWN ONCE' MODAL — the critical UX moment for API keys
// ============================================================================

function ShowKeyOnceModal({
  keyData,
  locale,
  tr,
  onClose,
}: {
  keyData: ApiKeyWithSecret;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(keyData.plaintextKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select the input programmatically
      const el = document.getElementById("key-input") as HTMLInputElement;
      if (el) {
        el.select();
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-5">
        {/* Header with emerald success accent */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">
              {tr(
                "Key created",
                "تم إنشاء المفتاح",
                "Anahtar oluşturuldu"
              )}
            </h2>
            <p className="text-xs text-muted-foreground">{keyData.name}</p>
          </div>
        </div>

        {/* Critical warning banner */}
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 mb-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <div className="font-semibold mb-0.5">
              {tr(
                "Copy this now — it won't be shown again.",
                "انسخ هذا الآن — لن يُعرض مرة أخرى.",
                "Şimdi kopyalayın — bir daha gösterilmeyecek."
              )}
            </div>
            {tr(
              "If you lose it, revoke and create a new one.",
              "لو ضاع منك، ألغه واعمل واحد جديد.",
              "Kaybederseniz iptal edin ve yeni bir tane oluşturun."
            )}
          </div>
        </div>

        {/* Key display */}
        <div className="space-y-2 mb-4">
          <div className="relative">
            <input
              id="key-input"
              type={revealed ? "text" : "password"}
              readOnly
              value={keyData.plaintextKey}
              className="w-full px-3 py-2 pe-20 border border-border rounded-lg text-sm font-mono bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              dir="ltr"
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              className="absolute top-1/2 -translate-y-1/2 end-2 w-7 h-7 rounded text-muted-foreground hover:text-cyan-300 hover:bg-muted flex items-center justify-center"
              aria-label={revealed ? "Hide" : "Show"}
            >
              {revealed ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <button
            onClick={handleCopy}
            className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                {tr("Copied!", "تم النسخ!", "Kopyalandı!")}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                {tr("Copy to clipboard", "نسخ", "Kopyala")}
              </>
            )}
          </button>
        </div>

        {/* Confirm checkbox */}
        <label className="flex items-start gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-cyan-300 focus:ring-primary"
          />
          <span className="text-xs text-foreground">
            {tr(
              "I've saved this key somewhere secure.",
              "حفظت المفتاح في مكان آمن.",
              "Bu anahtarı güvenli bir yere kaydettim."
            )}
          </span>
        </label>

        <button
          onClick={onClose}
          disabled={!confirmed}
          className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold disabled:cursor-not-allowed"
        >
          {tr("Done", "تم", "Tamam")}
        </button>
      </div>
    </div>
  );
}
