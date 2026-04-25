"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Loader2,
  Check,
  Copy,
  Download,
  RefreshCw,
  AlertTriangle,
  X,
  Key,
  Smartphone,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  get2FAStatus,
  begin2FAEnroll,
  confirm2FAEnroll,
  disable2FA,
  regenerate2FABackupCodes,
  type TwoFactorStatus,
  type BeginEnroll2FAResult,
} from "@/lib/api/advanced";

// ============================================================================
// SETTINGS → SECURITY
// ----------------------------------------------------------------------------
// Manages the user's two-factor authentication state. The page itself is a
// simple status card — all the dangerous actions (enrol / disable /
// regenerate backup codes) happen in modals that enforce confirmation and
// the one-time backup-code display pattern.
// ============================================================================

type ModalKind =
  | { kind: "none" }
  | { kind: "enroll"; stage: "loading" | "ready" | "confirming"; data?: BeginEnroll2FAResult }
  | { kind: "disable" }
  | { kind: "regenerate" }
  | { kind: "backup_codes"; codes: string[]; context: "enroll" | "regenerate" };

export default function SecuritySettingsPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const t = (en: string, ar: string, tr: string) =>
    locale === "ar" ? ar : locale === "tr" ? tr : en;

  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalKind>({ kind: "none" });

  const refresh = async () => {
    try {
      const s = await get2FAStatus();
      setStatus(s);
    } catch (e: any) {
      setError(
        e?.response?.data?.error?.message || e?.message || "Failed to load"
      );
    }
  };

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, []);

  // ─── Enroll flow ─────────────────────────────────────────────────────
  const startEnroll = async () => {
    setModal({ kind: "enroll", stage: "loading" });
    try {
      const data = await begin2FAEnroll();
      setModal({ kind: "enroll", stage: "ready", data });
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message || "Failed");
      setModal({ kind: "none" });
    }
  };

  const confirmEnrollWithCode = async (code: string) => {
    try {
      const result = await confirm2FAEnroll(code);
      setModal({
        kind: "backup_codes",
        codes: result.backupCodes,
        context: "enroll",
      });
      await refresh();
    } catch (e: any) {
      throw new Error(
        e?.response?.data?.error?.message || e?.message || "Incorrect code"
      );
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-3xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sky-900">
              {t("Security", "الأمان", "Güvenlik")}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              {t(
                "Protect your account with two-factor authentication.",
                "احمِ حسابك بالتحقق الثنائي.",
                "Hesabınızı iki adımlı doğrulama ile koruyun."
              )}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <>
            {/* 2FA card */}
            <div className="rounded-2xl border border-sky-100 bg-white shadow-sm overflow-hidden">
              <div className="p-5 flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    status?.enabled
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {status?.enabled ? (
                    <ShieldCheck className="w-6 h-6" />
                  ) : (
                    <ShieldOff className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-sky-900">
                      {t(
                        "Two-factor authentication (2FA)",
                        "المصادقة الثنائية (2FA)",
                        "İki adımlı doğrulama (2FA)"
                      )}
                    </h2>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        status?.enabled
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {status?.enabled
                        ? t("Enabled", "مُفعّل", "Etkin")
                        : t("Not enabled", "غير مُفعّل", "Devre dışı")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {status?.enabled
                      ? t(
                          `You have ${status.backupCodesRemaining} backup code${status.backupCodesRemaining === 1 ? "" : "s"} remaining.`,
                          `لديك ${status.backupCodesRemaining} من رموز الاسترداد المتبقية.`,
                          `${status.backupCodesRemaining} yedek kodunuz kaldı.`
                        )
                      : t(
                          "Add an extra layer of protection by requiring a 6-digit code from an authenticator app when you sign in.",
                          "أضف طبقة حماية إضافية بطلب رمز مكون من 6 أرقام من تطبيق المصادقة عند تسجيل الدخول.",
                          "Giriş yaparken kimlik doğrulayıcı uygulamadan 6 haneli bir kod gerektirerek ekstra güvenlik katmanı ekleyin."
                        )}
                  </p>

                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    {!status?.enabled ? (
                      <button
                        onClick={startEnroll}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-semibold"
                      >
                        <Smartphone className="w-4 h-4" />
                        {t("Enable 2FA", "تفعيل 2FA", "2FA'yı etkinleştir")}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setModal({ kind: "regenerate" })}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-lg text-sm font-semibold"
                        >
                          <RefreshCw className="w-4 h-4" />
                          {t(
                            "Regenerate backup codes",
                            "إعادة إنشاء رموز الاسترداد",
                            "Yedek kodları yeniden oluştur"
                          )}
                        </button>
                        <button
                          onClick={() => setModal({ kind: "disable" })}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg text-sm font-semibold"
                        >
                          <ShieldOff className="w-4 h-4" />
                          {t("Disable 2FA", "تعطيل 2FA", "2FA'yı devre dışı bırak")}
                        </button>
                      </>
                    )}
                  </div>

                  {status?.enabled && status.backupCodesRemaining <= 3 && (
                    <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-900">
                        {t(
                          "You're running low on backup codes. Regenerate a new set before you run out.",
                          "رموز الاسترداد لديك شارفت على النفاد. أعد إنشاء مجموعة جديدة قبل أن تنفد.",
                          "Yedek kodlarınız azalıyor. Tükenmeden önce yeni bir set oluşturun."
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Helpful link to audit log */}
            <a
              href={`/${locale}/settings/audit`}
              className="block rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 to-sky-50 p-4 hover:border-sky-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-sky-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-sky-900">
                    {t(
                      "Review recent activity",
                      "راجع النشاط الأخير",
                      "Son etkinliği inceleyin"
                    )}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {t(
                      "See a full timeline of security events and changes on your account.",
                      "اطّلع على سجل زمني كامل للأحداث الأمنية والتغييرات على حسابك.",
                      "Hesabınızdaki güvenlik olaylarının ve değişikliklerin tam zaman çizelgesini görün."
                    )}
                  </p>
                </div>
              </div>
            </a>
          </>
        )}
      </div>

      {/* ─── Modals ──────────────────────────────────────────────────── */}
      {modal.kind === "enroll" && (
        <EnrollModal
          stage={modal.stage}
          data={modal.data}
          locale={locale}
          onConfirm={confirmEnrollWithCode}
          onClose={() => setModal({ kind: "none" })}
        />
      )}
      {modal.kind === "disable" && (
        <DisableModal
          locale={locale}
          onClose={() => setModal({ kind: "none" })}
          onSuccess={async () => {
            setModal({ kind: "none" });
            await refresh();
          }}
        />
      )}
      {modal.kind === "regenerate" && (
        <RegenerateModal
          locale={locale}
          onClose={() => setModal({ kind: "none" })}
          onSuccess={async (codes) => {
            setModal({
              kind: "backup_codes",
              codes,
              context: "regenerate",
            });
            await refresh();
          }}
        />
      )}
      {modal.kind === "backup_codes" && (
        <BackupCodesModal
          codes={modal.codes}
          context={modal.context}
          locale={locale}
          onClose={() => setModal({ kind: "none" })}
        />
      )}
    </DashboardShell>
  );
}

// ============================================================================
// MODALS
// ============================================================================

function Modal({
  children,
  onClose,
  locale,
}: {
  children: React.ReactNode;
  onClose: () => void;
  locale: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      dir={locale === "ar" ? "rtl" : "ltr"}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function EnrollModal({
  stage,
  data,
  locale,
  onConfirm,
  onClose,
}: {
  stage: "loading" | "ready" | "confirming";
  data?: BeginEnroll2FAResult;
  locale: "en" | "ar" | "tr";
  onConfirm: (code: string) => Promise<void>;
  onClose: () => void;
}) {
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    setErr(null);
    try {
      await onConfirm(code);
    } catch (e: any) {
      setErr(e?.message || "Incorrect");
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} locale={locale}>
      <h2 className="text-lg font-bold text-sky-900">
        {tr("Enable 2FA", "تفعيل 2FA", "2FA'yı etkinleştir")}
      </h2>

      {stage === "loading" && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      )}

      {stage === "ready" && data && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-slate-700">
            {tr(
              "1. Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc).",
              "١. امسح رمز QR هذا باستخدام تطبيق المصادقة الخاص بك (Google Authenticator أو Authy أو 1Password...).",
              "1. Bu QR kodu kimlik doğrulayıcı uygulamanızla (Google Authenticator, Authy, 1Password, vb.) tarayın."
            )}
          </p>
          <div className="flex justify-center">
            <img
              src={data.qrDataUrl}
              alt="2FA QR code"
              className="w-48 h-48 rounded-lg border border-sky-200 p-2 bg-white"
            />
          </div>

          <details className="rounded-lg border border-sky-200 bg-sky-50 p-3">
            <summary className="text-xs font-semibold text-sky-800 cursor-pointer">
              {tr(
                "Can't scan? Enter the secret manually",
                "لا يمكنك المسح؟ أدخل السر يدويًا",
                "Tarayamıyor musunuz? Anahtarı elle girin"
              )}
            </summary>
            <div className="mt-2 flex items-center gap-2">
              <code
                className="flex-1 text-xs font-mono bg-white px-2 py-1.5 rounded border border-sky-200 break-all"
                dir="ltr"
              >
                {data.secret}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(data.secret);
                  setSecretCopied(true);
                  setTimeout(() => setSecretCopied(false), 2000);
                }}
                className="p-1.5 text-slate-500 hover:text-sky-500 hover:bg-sky-100 rounded"
              >
                {secretCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </details>

          <div>
            <p className="text-sm text-slate-700 mb-2">
              {tr(
                "2. Enter the 6-digit code your app shows:",
                "٢. أدخل الرمز المكون من 6 أرقام الذي يعرضه تطبيقك:",
                "2. Uygulamanızın gösterdiği 6 haneli kodu girin:"
              )}
            </p>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {err && <p className="text-sm text-rose-700">{err}</p>}

          <button
            onClick={submit}
            disabled={code.length !== 6 || submitting}
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold text-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {tr("Confirm and enable", "تأكيد وتفعيل", "Onayla ve etkinleştir")}
          </button>
        </div>
      )}
    </Modal>
  );
}

function DisableModal({
  locale,
  onClose,
  onSuccess,
}: {
  locale: "en" | "ar" | "tr";
  onClose: () => void;
  onSuccess: () => Promise<void>;
}) {
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setSubmitting(true);
    setErr(null);
    try {
      await disable2FA(password);
      await onSuccess();
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message || e?.message || "Failed");
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} locale={locale}>
      <h2 className="text-lg font-bold text-rose-900">
        {tr("Disable 2FA?", "تعطيل 2FA؟", "2FA'yı devre dışı bırakılsın mı?")}
      </h2>
      <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-rose-900">
          {tr(
            "This will make your account less secure. Confirm with your password.",
            "سيؤدي هذا إلى جعل حسابك أقل أمانًا. أكّد بكلمة المرور.",
            "Bu, hesabınızı daha az güvenli hale getirir. Parolanızla onaylayın."
          )}
        </p>
      </div>
      <div className="mt-4">
        <label className="block text-xs font-medium text-slate-700 mb-1">
          {tr("Your password", "كلمة المرور", "Parolanız")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>
      {err && <p className="text-sm text-rose-700 mt-2">{err}</p>}
      <div className="mt-5 flex items-center gap-2 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          {tr("Cancel", "إلغاء", "İptal")}
        </button>
        <button
          onClick={submit}
          disabled={!password || submitting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {tr("Disable 2FA", "تعطيل 2FA", "2FA'yı devre dışı bırak")}
        </button>
      </div>
    </Modal>
  );
}

function RegenerateModal({
  locale,
  onClose,
  onSuccess,
}: {
  locale: "en" | "ar" | "tr";
  onClose: () => void;
  onSuccess: (codes: string[]) => Promise<void>;
}) {
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setSubmitting(true);
    setErr(null);
    try {
      const result = await regenerate2FABackupCodes();
      await onSuccess(result.backupCodes);
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message || e?.message || "Failed");
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} locale={locale}>
      <h2 className="text-lg font-bold text-sky-900">
        {tr(
          "Regenerate backup codes?",
          "إعادة إنشاء رموز الاسترداد؟",
          "Yedek kodları yeniden oluşturulsun mu?"
        )}
      </h2>
      <p className="text-sm text-slate-700 mt-3 leading-relaxed">
        {tr(
          "Your existing backup codes will stop working. You'll get 10 fresh codes — shown once, so save them immediately.",
          "ستتوقف رموز الاسترداد الحالية عن العمل. ستحصل على 10 رموز جديدة — تُعرض مرة واحدة فقط، لذا احفظها فورًا.",
          "Mevcut yedek kodlarınız çalışmayı durduracak. 10 yeni kod alacaksınız — yalnızca bir kez gösterilir, hemen kaydedin."
        )}
      </p>
      {err && <p className="text-sm text-rose-700 mt-2">{err}</p>}
      <div className="mt-5 flex items-center gap-2 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          {tr("Cancel", "إلغاء", "İptal")}
        </button>
        <button
          onClick={submit}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {tr("Generate new codes", "إنشاء رموز جديدة", "Yeni kodlar oluştur")}
        </button>
      </div>
    </Modal>
  );
}

function BackupCodesModal({
  codes,
  context,
  locale,
  onClose,
}: {
  codes: string[];
  context: "enroll" | "regenerate";
  locale: "en" | "ar" | "tr";
  onClose: () => void;
}) {
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const [copied, setCopied] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const copyAll = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const download = () => {
    const blob = new Blob(
      [
        `Zyrix CRM — 2FA backup codes\nGenerated: ${new Date().toISOString()}\n\n${codes.join("\n")}\n\nEach code can be used once.\nKeep this file in a safe place.\n`,
      ],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zyrix-backup-codes-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <Modal onClose={acknowledged ? onClose : () => {}} locale={locale}>
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-bold text-emerald-900">
          {context === "enroll"
            ? tr("2FA enabled!", "تم تفعيل 2FA!", "2FA etkinleştirildi!")
            : tr("New backup codes", "رموز استرداد جديدة", "Yeni yedek kodlar")}
        </h2>
      </div>

      <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          {tr(
            "Save these codes NOW. They will not be shown again. Each can be used once if you lose access to your authenticator.",
            "احفظ هذه الرموز الآن. لن تُعرض مرة أخرى. يمكن استخدام كل منها مرة واحدة إذا فقدت الوصول إلى تطبيق المصادقة.",
            "Bu kodları ŞİMDİ kaydedin. Bir daha gösterilmeyecek. Kimlik doğrulayıcınıza erişiminizi kaybederseniz her biri bir kez kullanılabilir."
          )}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {codes.map((code) => (
          <code
            key={code}
            className="text-center text-sm font-mono py-2 bg-slate-50 border border-slate-200 rounded"
            dir="ltr"
          >
            {code}
          </code>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={copyAll}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-sky-200 hover:bg-sky-50 rounded-lg text-sm font-semibold text-slate-700"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied
            ? tr("Copied!", "تم النسخ!", "Kopyalandı!")
            : tr("Copy all", "انسخ الكل", "Tümünü kopyala")}
        </button>
        <button
          onClick={download}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-sky-200 hover:bg-sky-50 rounded-lg text-sm font-semibold text-slate-700"
        >
          <Download className="w-4 h-4" />
          {tr("Download", "تنزيل", "İndir")}
        </button>
      </div>

      <label className="mt-5 flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="mt-0.5 w-4 h-4 text-sky-500 rounded"
        />
        <span className="text-sm text-slate-700">
          {tr(
            "I've saved these codes in a safe place.",
            "لقد حفظت هذه الرموز في مكان آمن.",
            "Bu kodları güvenli bir yerde kaydettim."
          )}
        </span>
      </label>

      <button
        onClick={onClose}
        disabled={!acknowledged}
        className="mt-4 w-full py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm"
      >
        {tr("Done", "تم", "Tamam")}
      </button>
    </Modal>
  );
}
