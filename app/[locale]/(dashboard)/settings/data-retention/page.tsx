"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Database,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Save,
  Lock,
  Shield,
} from "lucide-react";
import {
  getRetentionStatus,
  upsertRetentionPolicy,
  type RetentionPolicy,
  type RetentionEntity,
} from "@/lib/api/advanced";
import { extractErrorMessage } from "@/lib/errors";

type Locale = "en" | "ar" | "tr";

const ENTITY_LABELS: Record<
  RetentionEntity,
  { en: string; ar: string; tr: string; description: { en: string; ar: string; tr: string } }
> = {
  audit_log: {
    en: "Audit log",
    ar: "سجل التدقيق",
    tr: "Denetim kaydı",
    description: {
      en: "Who did what, when, and from where.",
      ar: "من فعل ماذا ومتى ومن أين.",
      tr: "Kim neyi ne zaman ve nereden yaptı.",
    },
  },
  activity: {
    en: "Activity",
    ar: "النشاط",
    tr: "Etkinlik",
    description: {
      en: "Customer interactions, calls, notes, meetings.",
      ar: "تفاعلات العملاء، المكالمات، الملاحظات، الاجتماعات.",
      tr: "Müşteri etkileşimleri, aramalar, notlar, toplantılar.",
    },
  },
  session_event: {
    en: "Session events",
    ar: "أحداث الجلسة",
    tr: "Oturum olayları",
    description: {
      en: "Sign-ins, idle lockouts, session expirations.",
      ar: "عمليات تسجيل الدخول، إغلاقات الخمول، انتهاء الجلسات.",
      tr: "Oturum açmalar, boşta kilitlenme, oturum sonları.",
    },
  },
  message: {
    en: "Chat messages",
    ar: "رسائل المحادثات",
    tr: "Sohbet mesajları",
    description: {
      en: "Internal chat and WhatsApp message history.",
      ar: "تاريخ الدردشة الداخلية ورسائل واتساب.",
      tr: "Dahili sohbet ve WhatsApp mesaj geçmişi.",
    },
  },
};

const PRESETS: Array<{ days: number; en: string; ar: string; tr: string }> = [
  { days: 30, en: "30 days", ar: "30 يومًا", tr: "30 gün" },
  { days: 90, en: "90 days", ar: "90 يومًا", tr: "90 gün" },
  { days: 180, en: "6 months", ar: "6 أشهر", tr: "6 ay" },
  { days: 365, en: "1 year", ar: "سنة", tr: "1 yıl" },
  { days: 730, en: "2 years", ar: "سنتان", tr: "2 yıl" },
  { days: 2555, en: "7 years", ar: "7 سنوات", tr: "7 yıl" },
  { days: 0, en: "Forever", ar: "للأبد", tr: "Süresiz" },
];

export default function DataRetentionPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as Locale;
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [policies, setPolicies] = useState<Map<string, RetentionPolicy>>(
    new Map()
  );
  const [supported, setSupported] = useState<RetentionEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRetentionStatus();
      const map = new Map<string, RetentionPolicy>();
      for (const p of data.policies) map.set(p.entityType, p);
      setPolicies(map);
      setSupported(data.supportedEntities);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (
    entityType: string,
    retentionDays: number,
    legalHold: boolean,
    legalHoldReason: string | null
  ) => {
    setSaving(entityType);
    setError(null);
    try {
      const updated = await upsertRetentionPolicy({
        entityType,
        retentionDays,
        legalHold,
        legalHoldReason,
      });
      setPolicies((prev) => {
        const next = new Map(prev);
        next.set(entityType, updated);
        return next;
      });
      setSuccess(tr("Policy saved.", "تم حفظ السياسة.", "Politika kaydedildi."));
      setTimeout(() => setSuccess(null), 2500);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSaving(null);
    }
  };

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
        <div className="flex items-start gap-3">
          <Link
            href={`/${locale}/settings`}
            className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-cyan-300"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`} />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">SETTINGS</p>
            <h1 className="text-2xl font-bold text-foreground">
              {tr("Data retention", "الاحتفاظ بالبيانات", "Veri saklama")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {tr(
                "Pick how long we keep each kind of record before permanently deleting it.",
                "اختر مدة الاحتفاظ بكل نوع من السجلات قبل حذفه نهائيًا.",
                "Her kayıt türünü kalıcı olarak silmeden önce ne kadar tutacağımızı seçin."
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

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          </div>
        ) : (
          <div className="space-y-3">
            {supported.map((entity) => {
              const policy = policies.get(entity);
              return (
                <PolicyRow
                  key={entity}
                  entity={entity}
                  policy={policy}
                  locale={locale}
                  tr={tr}
                  saving={saving === entity}
                  onSave={handleSave}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function PolicyRow({
  entity,
  policy,
  locale,
  tr,
  saving,
  onSave,
}: {
  entity: RetentionEntity;
  policy: RetentionPolicy | undefined;
  locale: Locale;
  tr: (en: string, ar: string, trk: string) => string;
  saving: boolean;
  onSave: (
    entityType: string,
    retentionDays: number,
    legalHold: boolean,
    legalHoldReason: string | null
  ) => void;
}) {
  const [days, setDays] = useState<number>(policy?.retentionDays ?? 365);
  const [legalHold, setLegalHold] = useState<boolean>(policy?.legalHold ?? false);
  const [reason, setReason] = useState<string>(policy?.legalHoldReason ?? "");

  useEffect(() => {
    setDays(policy?.retentionDays ?? 365);
    setLegalHold(policy?.legalHold ?? false);
    setReason(policy?.legalHoldReason ?? "");
  }, [policy]);

  const labels = ENTITY_LABELS[entity];
  const dirty =
    days !== (policy?.retentionDays ?? 365) ||
    legalHold !== (policy?.legalHold ?? false) ||
    (legalHold && reason !== (policy?.legalHoldReason ?? ""));

  const handleSaveClick = () => {
    if (legalHold && !reason.trim()) {
      alert(
        tr(
          "Legal hold requires a reason.",
          "الحجز القانوني يتطلب سببًا.",
          "Yasal saklama için sebep gereklidir."
        )
      );
      return;
    }
    onSave(entity, days, legalHold, legalHold ? reason.trim() : null);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center flex-shrink-0">
          <Database className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-foreground">
              {labels[locale]}
            </h3>
            {legalHold && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-800 border border-amber-500/30">
                <Lock className="w-2.5 h-2.5" />
                {tr("Legal hold", "حجز قانوني", "Yasal saklama")}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {labels.description[locale]}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
          {tr("Retention period", "فترة الاحتفاظ", "Saklama süresi")}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.days}
              onClick={() => setDays(p.days)}
              disabled={legalHold}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                days === p.days
                  ? "bg-sky-500 text-white border-sky-500"
                  : "bg-card border-border text-foreground hover:bg-muted"
              } ${legalHold ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {p[locale]}
            </button>
          ))}
        </div>
        {days === 0 ? (
          <p className="text-[11px] text-muted-foreground mt-1">
            {tr(
              "Records will never be automatically deleted.",
              "لن يتم حذف السجلات تلقائيًا أبدًا.",
              "Kayıtlar asla otomatik silinmeyecek."
            )}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground mt-1">
            {tr(
              `Records older than ${days} days will be permanently deleted daily at 03:17 UTC.`,
              `السجلات الأقدم من ${days} يومًا ستُحذف يوميًا الساعة 3:17 UTC.`,
              `${days} günden eski kayıtlar her gün 03:17 UTC'de kalıcı olarak silinecek.`
            )}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-sky-50 space-y-2">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={legalHold}
            onChange={(e) => setLegalHold(e.target.checked)}
            className="accent-amber-600"
          />
          <span className="text-xs font-semibold text-foreground inline-flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            {tr(
              "Legal hold (pause deletion)",
              "حجز قانوني (إيقاف الحذف)",
              "Yasal saklama (silmeyi durdur)"
            )}
          </span>
        </label>
        {legalHold && (
          <div>
            <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
              {tr("Reason (required)", "السبب (مطلوب)", "Sebep (gerekli)")}
            </label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={tr(
                "e.g. Litigation case #2026-04",
                "مثل: قضية #2026-04",
                "örn. Dava #2026-04"
              )}
              maxLength={500}
              className="w-full px-3 py-2 border border-amber-500/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-500/10"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-end">
        <button
          onClick={handleSaveClick}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-sm font-semibold"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {tr("Save", "حفظ", "Kaydet")}
        </button>
      </div>
    </div>
  );
}
