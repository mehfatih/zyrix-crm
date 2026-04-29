"use client";

import { useEffect, useState } from "react";
import {
  Webhook,
  Plus,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Power,
  PowerOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  X,
  Key,
  Info,
  Radio,
  Skull,
  RotateCw,
} from "lucide-react";
import {
  listWebhookSubscriptions,
  createWebhookSubscription,
  updateWebhookSubscription,
  deleteWebhookSubscription,
  rotateWebhookSecret,
  getSupportedWebhookPlatforms,
  listWebhookEvents,
  retryWebhookEvent,
  type WebhookSubscription,
  type WebhookSubscriptionWithSecret,
  type WebhookEvent,
} from "@/lib/api/advanced";

// ============================================================================
// WEBHOOKS PANEL — /settings/integrations
//
// Manages inbound webhook subscriptions for connected e-commerce platforms.
// Key UX principles:
//  • Secret is revealed ONCE on create or rotate — user must copy it
//    immediately. Reload = gone. Enforced by a modal with explicit
//    "I've saved this" confirmation.
//  • Public URL is always visible + copyable next to each subscription.
//  • Recent delivery log gives instant "is this wired up?" feedback.
//  • Preset topics per platform so users don't have to memorize strings.
// ============================================================================

// Common topics per platform — shown as quick-pick buttons in the Add dialog.
// These match the normalized topic slugs our backend dispatcher handles.
const TOPIC_PRESETS: Record<string, string[]> = {
  shopify: [
    "customers/create",
    "customers/update",
    "orders/create",
    "orders/paid",
    "orders/updated",
  ],
  salla: [
    "customer.created",
    "customer.updated",
    "order.created",
    "order.updated",
  ],
  zid: ["customer.created", "order.created", "order.updated"],
  woocommerce: [
    "customer.created",
    "customer.updated",
    "order.created",
    "order.updated",
  ],
  youcan: ["customer.created", "order.created", "order.paid"],
};

export default function WebhooksPanel({ locale }: { locale: string }) {
  const isRtl = locale === "ar";
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [subs, setSubs] = useState<WebhookSubscription[]>([]);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newSecret, setNewSecret] = useState<WebhookSubscriptionWithSecret | null>(
    null
  );
  const [rotated, setRotated] = useState<{
    sub: WebhookSubscription;
    secret: string;
  } | null>(null);

  const load = async () => {
    try {
      const [p, s, e] = await Promise.all([
        getSupportedWebhookPlatforms(),
        listWebhookSubscriptions(),
        listWebhookEvents({ limit: 20 }),
      ]);
      setPlatforms(p);
      setSubs(s);
      setEvents(e);
    } catch {
      // Backend may not be deployed yet — fall back to empty state quietly
      setPlatforms([]);
      setSubs([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (s: WebhookSubscription) => {
    try {
      await updateWebhookSubscription(s.id, { isActive: !s.isActive });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Failed to update");
    }
  };

  const handleDelete = async (s: WebhookSubscription) => {
    if (
      !confirm(
        locale === "ar"
          ? `حذف اشتراك ${s.platform} / ${s.topic}؟ المنصة لن تعود لترسل هذا الحدث.`
          : locale === "tr"
            ? `${s.platform} / ${s.topic} aboneliğini sil? Platform bu olayı artık göndermeyecek.`
            : `Delete ${s.platform} / ${s.topic} subscription? The platform will stop sending this event.`
      )
    )
      return;
    try {
      await deleteWebhookSubscription(s.id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Failed to delete");
    }
  };

  const handleRotate = async (s: WebhookSubscription) => {
    if (
      !confirm(
        locale === "ar"
          ? "إعادة توليد السر ستبطل السر القديم فوراً. تأكد من تحديث إعدادات المنصة قبل المتابعة."
          : locale === "tr"
            ? "Yeni gizli anahtar, eskisini anında geçersiz kılar. Devam etmeden önce platform ayarlarını güncellediğinizden emin olun."
            : "Rotating the secret invalidates the old one immediately. Update the platform before continuing."
      )
    )
      return;
    try {
      const r = await rotateWebhookSecret(s.id);
      setRotated({ sub: s, secret: r.secret });
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Failed to rotate");
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-cyan-300" />
      </div>
    );
  }

  // Don't render the panel at all if backend doesn't support webhooks yet
  if (platforms.length === 0 && subs.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Webhook className="w-4 h-4 text-cyan-300" />
            {locale === "ar"
              ? "استقبال الويب هوكس"
              : locale === "tr"
                ? "Webhook dinleyicileri"
                : "Webhook listeners"}
            {subs.length > 0 && (
              <span className="px-2 py-0.5 text-[10px] bg-sky-100 text-cyan-300 rounded-full font-semibold">
                {subs.length}
              </span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
            {locale === "ar"
              ? "اجعل منصات التجارة الإلكترونية تُرسل إليك التحديثات فوراً بدلاً من الانتظار لدورة المزامنة التالية."
              : locale === "tr"
                ? "E-ticaret platformlarının bir sonraki senkron döngüsünü beklemek yerine size anında güncelleme göndermesini sağlayın."
                : "Have your e-commerce platforms push updates to you in real time instead of waiting for the next sync cycle."}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          {locale === "ar"
            ? "إضافة ويب هوك"
            : locale === "tr"
              ? "Webhook ekle"
              : "Add webhook"}
        </button>
      </div>

      {/* Subscription list */}
      {subs.length === 0 ? (
        <div className="bg-card border border-border border-dashed rounded-xl p-6 text-center">
          <Radio className="w-8 h-8 text-sky-300 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {locale === "ar"
              ? "لم تضف أي ويب هوك بعد."
              : locale === "tr"
                ? "Henüz webhook eklemediniz."
                : "No webhooks yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {subs.map((s) => (
            <WebhookRow
              key={s.id}
              sub={s}
              isRtl={isRtl}
              locale={locale}
              onToggle={() => handleToggle(s)}
              onRotate={() => handleRotate(s)}
              onDelete={() => handleDelete(s)}
            />
          ))}
        </div>
      )}

      {/* Recent events */}
      {events.length > 0 && (
        <details className="bg-card border border-border rounded-xl overflow-hidden">
          <summary className="px-4 py-2.5 text-xs font-semibold text-foreground cursor-pointer hover:bg-muted flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            {locale === "ar"
              ? `آخر ${events.length} حدث`
              : locale === "tr"
                ? `Son ${events.length} olay`
                : `Recent ${events.length} events`}
          </summary>
          <div className="border-t border-sky-50 divide-y divide-sky-50">
            {events.map((ev) => (
              <EventRow key={ev.id} event={ev} locale={locale} onReload={load} />
            ))}
          </div>
        </details>
      )}

      {/* Add dialog */}
      {showAdd && (
        <AddWebhookDialog
          platforms={platforms}
          locale={locale}
          onCancel={() => setShowAdd(false)}
          onCreated={(sub) => {
            setShowAdd(false);
            setNewSecret(sub);
            load();
          }}
        />
      )}

      {/* Secret reveal — shown after create */}
      {newSecret && (
        <SecretRevealDialog
          title={
            locale === "ar"
              ? "تم إنشاء الويب هوك"
              : locale === "tr"
                ? "Webhook oluşturuldu"
                : "Webhook created"
          }
          platform={newSecret.platform}
          topic={newSecret.topic}
          publicUrl={newSecret.publicUrl}
          secret={newSecret.secret}
          locale={locale}
          onClose={() => setNewSecret(null)}
        />
      )}

      {/* Secret reveal — shown after rotate */}
      {rotated && (
        <SecretRevealDialog
          title={
            locale === "ar"
              ? "تم توليد سر جديد"
              : locale === "tr"
                ? "Yeni gizli anahtar üretildi"
                : "New secret generated"
          }
          platform={rotated.sub.platform}
          topic={rotated.sub.topic}
          publicUrl={rotated.sub.publicUrl}
          secret={rotated.secret}
          locale={locale}
          onClose={() => setRotated(null)}
        />
      )}
    </section>
  );
}

// ─── Row ───────────────────────────────────────────────────────────────

function WebhookRow({
  sub,
  locale,
  isRtl,
  onToggle,
  onRotate,
  onDelete,
}: {
  sub: WebhookSubscription;
  locale: string;
  isRtl: boolean;
  onToggle: () => void;
  onRotate: () => void;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(sub.publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  };

  const hasFailures = sub.failedCount > 0;

  return (
    <div
      className={`bg-card border rounded-xl p-3 ${
        sub.isActive ? "border-border" : "border-border opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-foreground capitalize">
              {sub.platform}
            </span>
            <span className="text-slate-300">·</span>
            <code className="text-[11px] font-mono px-1.5 py-0.5 bg-muted text-foreground rounded">
              {sub.topic}
            </code>
            {!sub.isActive && (
              <span className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                {locale === "ar" ? "متوقف" : locale === "tr" ? "pasif" : "inactive"}
              </span>
            )}
            {hasFailures && (
              <span
                className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded flex items-center gap-1"
                title={`${sub.failedCount} failed`}
              >
                <AlertTriangle className="w-2.5 h-2.5" />
                {sub.failedCount}
              </span>
            )}
          </div>

          {/* Public URL */}
          <div className="mt-2 flex items-center gap-1.5 min-w-0">
            <code
              className="flex-1 min-w-0 text-[10px] font-mono px-2 py-1 bg-muted text-muted-foreground rounded border border-border truncate"
              dir="ltr"
              style={{ unicodeBidi: "embed" }}
            >
              {sub.publicUrl}
            </code>
            <button
              onClick={copyUrl}
              className="p-1.5 text-muted-foreground hover:text-cyan-300 hover:bg-muted rounded"
              title={locale === "ar" ? "نسخ" : locale === "tr" ? "kopyala" : "copy"}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
            <span>
              {locale === "ar"
                ? `مستلم: ${sub.receivedCount}`
                : locale === "tr"
                  ? `alınan: ${sub.receivedCount}`
                  : `received: ${sub.receivedCount}`}
            </span>
            {sub.lastReceivedAt && (
              <span>
                {locale === "ar" ? "آخر استلام: " : locale === "tr" ? "son: " : "last: "}
                <time dir="ltr" style={{ unicodeBidi: "embed" }}>
                  {new Date(sub.lastReceivedAt).toLocaleString()}
                </time>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            title={
              sub.isActive
                ? locale === "ar"
                  ? "إيقاف"
                  : locale === "tr"
                    ? "durdur"
                    : "pause"
                : locale === "ar"
                  ? "تشغيل"
                  : locale === "tr"
                    ? "başlat"
                    : "resume"
            }
            className="p-1.5 text-muted-foreground hover:text-cyan-300 hover:bg-muted rounded"
          >
            {sub.isActive ? (
              <Power className="w-3.5 h-3.5" />
            ) : (
              <PowerOff className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={onRotate}
            title={
              locale === "ar"
                ? "إعادة توليد السر"
                : locale === "tr"
                  ? "gizli anahtarı yenile"
                  : "rotate secret"
            }
            className="p-1.5 text-muted-foreground hover:text-cyan-300 hover:bg-muted rounded"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            title={
              locale === "ar" ? "حذف" : locale === "tr" ? "sil" : "delete"
            }
            className="p-1.5 text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10 rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Event row (recent deliveries) ────────────────────────────────────

function EventRow({
  event,
  locale,
  onReload,
}: {
  event: WebhookEvent;
  locale: string;
  onReload: () => void;
}) {
  const [retrying, setRetrying] = useState(false);

  const statusConfig: Record<
    WebhookEvent["status"],
    { bg: string; text: string; icon: typeof Check; label: { en: string; ar: string; tr: string } }
  > = {
    done: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      icon: CheckCircle2,
      label: { en: "done", ar: "تم", tr: "tamam" },
    },
    pending: {
      bg: "bg-muted",
      text: "text-cyan-300",
      icon: Clock,
      label: { en: "pending", ar: "قيد الانتظار", tr: "bekliyor" },
    },
    processing: {
      bg: "bg-muted",
      text: "text-cyan-300",
      icon: Loader2,
      label: { en: "processing", ar: "جارٍ", tr: "işleniyor" },
    },
    failed: {
      bg: "bg-rose-500/10",
      text: "text-rose-300",
      icon: AlertTriangle,
      label: { en: "failed", ar: "فشل", tr: "başarısız" },
    },
    skipped: {
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      icon: AlertTriangle,
      label: { en: "skipped", ar: "تم تخطيه", tr: "atlandı" },
    },
    dead_letter: {
      bg: "bg-rose-100",
      text: "text-rose-900",
      icon: Skull,
      label: { en: "dead letter", ar: "متوقف نهائياً", tr: "ölü mektup" },
    },
  };
  const cfg = statusConfig[event.status] || statusConfig.pending;
  const Icon = cfg.icon;
  const isRetryable = event.status === "failed" || event.status === "dead_letter";

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await retryWebhookEvent(event.id);
      onReload();
    } catch (e: any) {
      alert(
        e?.response?.data?.error?.message ||
          e?.message ||
          "Retry failed"
      );
    } finally {
      setRetrying(false);
    }
  };

  // Format nextRetryAt relative to now — "retry in 3 min" vs "retry overdue"
  const retryHint = (): string | null => {
    if (!event.nextRetryAt) return null;
    const ms = new Date(event.nextRetryAt).getTime() - Date.now();
    if (ms <= 0) {
      return locale === "ar"
        ? "سيُعاد قريباً"
        : locale === "tr"
          ? "yakında yeniden denenecek"
          : "retry pending";
    }
    const min = Math.round(ms / 60000);
    if (min < 60) {
      return locale === "ar"
        ? `إعادة بعد ${min}د`
        : locale === "tr"
          ? `${min}d sonra yeniden`
          : `retry in ${min}m`;
    }
    const hr = Math.round(ms / 3600000);
    return locale === "ar"
      ? `إعادة بعد ${hr}س`
      : locale === "tr"
        ? `${hr}s sonra yeniden`
        : `retry in ${hr}h`;
  };
  const nextRetry = retryHint();

  return (
    <div className="px-4 py-2 flex items-center gap-3 text-[11px] hover:bg-muted/40 flex-wrap">
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text} font-medium`}
      >
        <Icon className={`w-2.5 h-2.5 ${event.status === "processing" ? "animate-spin" : ""}`} />
        {cfg.label[locale as "en" | "ar" | "tr"] || cfg.label.en}
      </span>

      <span className="text-foreground font-medium capitalize">
        {event.platform}
      </span>
      <code className="text-[10px] font-mono text-muted-foreground">{event.topic}</code>

      {/* Attempt counter — show only when retries have happened */}
      {event.attempts > 1 && (
        <span
          className="text-[10px] text-muted-foreground tabular-nums"
          title={locale === "ar" ? "المحاولات" : locale === "tr" ? "deneme" : "attempts"}
        >
          #{event.attempts}
        </span>
      )}

      {!event.signatureOk && (
        <span className="text-[10px] px-1 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded">
          {locale === "ar"
            ? "توقيع غير صالح"
            : locale === "tr"
              ? "imza geçersiz"
              : "bad signature"}
        </span>
      )}

      {/* Next retry timestamp for failed events */}
      {nextRetry && event.status === "failed" && (
        <span className="text-[10px] text-muted-foreground inline-flex items-center gap-0.5">
          <Clock className="w-2.5 h-2.5" />
          {nextRetry}
        </span>
      )}

      {/* Tooltip with error message on hover for failed/dead_letter */}
      {event.lastError && (event.status === "failed" || event.status === "dead_letter") && (
        <span
          className="text-[10px] text-rose-300 max-w-[200px] truncate"
          title={event.lastError}
        >
          · {event.lastError}
        </span>
      )}

      <time
        className="ltr:ml-auto rtl:mr-auto text-muted-foreground"
        dir="ltr"
        style={{ unicodeBidi: "embed" }}
      >
        {new Date(event.receivedAt).toLocaleTimeString()}
      </time>

      {isRetryable && (
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="p-1 text-muted-foreground hover:text-cyan-300 hover:bg-muted rounded disabled:opacity-50"
          title={
            locale === "ar"
              ? "إعادة المحاولة الآن"
              : locale === "tr"
                ? "şimdi tekrar dene"
                : "retry now"
          }
        >
          {retrying ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RotateCw className="w-3 h-3" />
          )}
        </button>
      )}
    </div>
  );
}

// ─── Add dialog ────────────────────────────────────────────────────────

function AddWebhookDialog({
  platforms,
  locale,
  onCancel,
  onCreated,
}: {
  platforms: string[];
  locale: string;
  onCancel: () => void;
  onCreated: (sub: WebhookSubscriptionWithSecret) => void;
}) {
  const [platform, setPlatform] = useState(platforms[0] || "shopify");
  const [topic, setTopic] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const presets = TOPIC_PRESETS[platform] || [];

  const submit = async () => {
    if (!topic.trim()) return;
    setSaving(true);
    setErr(null);
    try {
      const sub = await createWebhookSubscription({
        platform,
        topic: topic.trim(),
      });
      onCreated(sub);
    } catch (e: any) {
      setErr(
        e?.response?.data?.error?.message ||
          e?.message ||
          "Failed to create webhook"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-card rounded-xl shadow-2xl max-w-md w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">
            {locale === "ar"
              ? "إضافة ويب هوك"
              : locale === "tr"
                ? "Webhook ekle"
                : "Add webhook"}
          </h3>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {locale === "ar"
                ? "المنصة"
                : locale === "tr"
                  ? "Platform"
                  : "Platform"}
            </label>
            <select
              value={platform}
              onChange={(e) => {
                setPlatform(e.target.value);
                setTopic("");
              }}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card capitalize"
            >
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {locale === "ar"
                ? "الحدث"
                : locale === "tr"
                  ? "Olay"
                  : "Topic"}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={presets[0] || "customers/create"}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg font-mono"
              dir="ltr"
            />
            {presets.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1 flex-wrap">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTopic(p)}
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      topic === p
                        ? "bg-sky-500 text-white border-sky-500"
                        : "bg-card text-muted-foreground border-border hover:border-sky-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-muted border border-border rounded-lg p-2.5 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-300 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-foreground leading-relaxed">
              {locale === "ar"
                ? "بعد الإنشاء، سنعرض لك السر الموقع ورابط الاستقبال. تلصقهما في لوحة تحكم المنصة."
                : locale === "tr"
                  ? "Oluşturulduktan sonra size imzalama anahtarını ve alıcı URL'yi göstereceğiz. Bunları platform paneline yapıştırın."
                  : "After creating, we'll show you the signing secret and the receiver URL. Paste them into the platform's admin panel."}
            </p>
          </div>

          {err && (
            <div className="bg-rose-500/10 border border-rose-100 rounded-lg p-2 text-[11px] text-rose-300">
              {err}
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-foreground hover:bg-muted rounded-lg"
          >
            {locale === "ar" ? "إلغاء" : locale === "tr" ? "iptal" : "Cancel"}
          </button>
          <button
            onClick={submit}
            disabled={saving || !topic.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            {locale === "ar"
              ? "إنشاء"
              : locale === "tr"
                ? "oluştur"
                : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Secret reveal dialog ──────────────────────────────────────────────

function SecretRevealDialog({
  title,
  platform,
  topic,
  publicUrl,
  secret,
  locale,
  onClose,
}: {
  title: string;
  platform: string;
  topic: string;
  publicUrl: string;
  secret: string;
  locale: string;
  onClose: () => void;
}) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const copy = async (
    value: string,
    set: (v: boolean) => void
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      set(true);
      setTimeout(() => set(false), 1500);
    } catch {
      // noop
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-lg w-full p-5">
        <div className="flex items-start gap-2 mb-3">
          <Key className="w-5 h-5 text-cyan-300 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">
              {platform} · <span className="font-mono text-foreground">{topic}</span>
            </p>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            {locale === "ar"
              ? "احفظ هذا السر الآن. لن يتم عرضه مرة أخرى. إن فقدته، استخدم زر إعادة التوليد."
              : locale === "tr"
                ? "Gizli anahtarı şimdi kaydet. Tekrar gösterilmeyecek. Kaybedersen, yenileme düğmesini kullan."
                : "Save this secret now. It will not be shown again. If lost, use the rotate button to generate a new one."}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              {locale === "ar"
                ? "رابط الاستقبال"
                : locale === "tr"
                  ? "Alıcı URL"
                  : "Receiver URL"}
            </label>
            <div className="flex items-center gap-1.5">
              <code
                className="flex-1 min-w-0 text-[11px] font-mono px-2.5 py-2 bg-muted text-foreground rounded border border-border truncate"
                dir="ltr"
                style={{ unicodeBidi: "embed" }}
              >
                {publicUrl}
              </code>
              <button
                onClick={() => copy(publicUrl, setCopiedUrl)}
                className="p-2 text-muted-foreground hover:text-cyan-300 hover:bg-muted rounded border border-border"
              >
                {copiedUrl ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              {locale === "ar"
                ? "سر التوقيع (مخفي في المستقبل)"
                : locale === "tr"
                  ? "İmza anahtarı (tekrar gösterilmez)"
                  : "Signing secret (shown once)"}
            </label>
            <div className="flex items-center gap-1.5">
              <code
                className="flex-1 min-w-0 text-[11px] font-mono px-2.5 py-2 bg-amber-500/10 text-amber-900 rounded border border-amber-500/30 break-all"
                dir="ltr"
                style={{ unicodeBidi: "embed" }}
              >
                {secret}
              </code>
              <button
                onClick={() => copy(secret, setCopiedSecret)}
                className="p-2 text-muted-foreground hover:text-cyan-300 hover:bg-muted rounded border border-border"
              >
                {copiedSecret ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <label className="mt-4 flex items-start gap-2 text-xs text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 rounded border-sky-300 text-cyan-300 focus:ring-primary"
          />
          <span>
            {locale === "ar"
              ? "قمت بنسخ السر وألصقته في لوحة تحكم المنصة"
              : locale === "tr"
                ? "Anahtarı kopyaladım ve platform paneline yapıştırdım"
                : "I've copied the secret and pasted it into the platform's admin panel"}
          </span>
        </label>

        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={onClose}
            disabled={!confirmed}
            className="px-4 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {locale === "ar" ? "تم" : locale === "tr" ? "tamam" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
