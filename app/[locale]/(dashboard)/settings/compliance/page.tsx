"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Download,
  Trash2,
  Key,
  Plus,
  Copy,
  FileText,
  X,
} from "lucide-react";
import {
  listComplianceTokens,
  issueComplianceToken,
  revokeComplianceToken,
  downloadUserExport,
  deleteUserForCompliance,
  fetchComplianceReport,
  type ComplianceToken,
  type IssuedComplianceToken,
  type ComplianceAuditReport,
} from "@/lib/api/advanced";
import { listCompanyUsers, type TeamMember } from "@/lib/api/roles";
import { extractErrorMessage } from "@/lib/errors";

type Locale = "en" | "ar" | "tr";

export default function CompliancePage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as Locale;
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [tokens, setTokens] = useState<ComplianceToken[]>([]);
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newTokenLabel, setNewTokenLabel] = useState("");
  const [justIssued, setJustIssued] = useState<IssuedComplianceToken | null>(
    null
  );
  const [selectedUserId, setSelectedUserId] = useState("");
  const [actioning, setActioning] = useState<string | null>(null);
  const [reportFrom, setReportFrom] = useState(() =>
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [reportTo, setReportTo] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [report, setReport] = useState<ComplianceAuditReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tokenList, userList] = await Promise.all([
        listComplianceTokens(),
        listCompanyUsers().catch(() => []),
      ]);
      setTokens(tokenList);
      setUsers(userList);
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
    const label = newTokenLabel.trim();
    if (!label) {
      setError(tr("Label required", "الوسم مطلوب", "Etiket gerekli"));
      return;
    }
    setError(null);
    try {
      const token = await issueComplianceToken(label);
      setJustIssued(token);
      setNewTokenLabel("");
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  const handleRevoke = async (token: ComplianceToken) => {
    if (
      !confirm(
        tr(
          `Revoke "${token.label}"? Any auditor using this token will lose access immediately.`,
          `إلغاء "${token.label}"؟ سيفقد أي مدقق يستخدم هذا الرمز الوصول فورًا.`,
          `"${token.label}" iptal edilsin mi? Bu jetonu kullanan denetçi hemen erişimini kaybedecek.`
        )
      )
    )
      return;
    try {
      await revokeComplianceToken(token.id);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  const handleExport = async () => {
    if (!selectedUserId) return;
    setActioning("export");
    setError(null);
    try {
      await downloadUserExport(selectedUserId);
      setSuccess(
        tr(
          "Export downloaded.",
          "تم تنزيل التصدير.",
          "Dışa aktarım indirildi."
        )
      );
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setActioning(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;
    const target = users.find((u) => u.id === selectedUserId);
    if (
      !confirm(
        tr(
          `Permanently anonymize ${target?.fullName ?? "this user"} and disable their account? This cannot be undone.`,
          `تعطيل ${target?.fullName ?? "هذا المستخدم"} وإخفاء هويته نهائيًا؟ لا يمكن التراجع.`,
          `${target?.fullName ?? "Bu kullanıcı"} kalıcı olarak anonimleştirilsin ve hesabı devre dışı bırakılsın mı? Geri alınamaz.`
        )
      )
    )
      return;
    setActioning("delete");
    setError(null);
    try {
      const result = await deleteUserForCompliance(selectedUserId);
      setSuccess(
        tr(
          `Anonymized. Placeholder email: ${result.anonymizedEmail}`,
          `تم إخفاء الهوية. البريد البديل: ${result.anonymizedEmail}`,
          `Anonimleştirildi. Yer tutucu e-posta: ${result.anonymizedEmail}`
        )
      );
      setTimeout(() => setSuccess(null), 5000);
      setSelectedUserId("");
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setActioning(null);
    }
  };

  const handleReport = async () => {
    setReportLoading(true);
    setError(null);
    try {
      const data = await fetchComplianceReport(
        new Date(reportFrom).toISOString(),
        new Date(reportTo + "T23:59:59").toISOString()
      );
      setReport(data);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setReportLoading(false);
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
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">SETTINGS</p>
            <h1 className="text-2xl font-bold text-foreground">
              {tr("Compliance", "الامتثال", "Uyumluluk")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {tr(
                "GDPR / CCPA data access & deletion, audit reports, and API tokens for external auditors.",
                "وصول وحذف البيانات وفق GDPR/CCPA، تقارير التدقيق، ورموز API للمدققين الخارجيين.",
                "GDPR/CCPA veri erişimi & silme, denetim raporları ve dış denetçiler için API jetonları."
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

        {/* One-time token display */}
        {justIssued && (
          <div className="rounded-xl border border-amber-300 bg-amber-500/10 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-300" />
              <h3 className="text-sm font-bold text-amber-900">
                {tr(
                  "Copy this token now — it won't be shown again",
                  "انسخ الرمز الآن — لن يُعرض مرة أخرى",
                  "Jetonu şimdi kopyalayın — bir daha gösterilmeyecek"
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

        {/* Data export/deletion */}
        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-sm font-bold text-foreground inline-flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {tr(
              "Per-user data access & deletion",
              "وصول وحذف بيانات المستخدم",
              "Kullanıcı başına veri erişimi & silme"
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,auto] gap-2">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">
                {tr(
                  "Select a user…",
                  "اختر مستخدمًا…",
                  "Kullanıcı seçin…"
                )}
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} — {u.email}
                </option>
              ))}
            </select>
            <button
              onClick={handleExport}
              disabled={!selectedUserId || actioning !== null}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-semibold"
            >
              {actioning === "export" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {tr("Export", "تصدير", "Dışa aktar")}
            </button>
            <button
              onClick={handleDelete}
              disabled={!selectedUserId || actioning !== null}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold"
            >
              {actioning === "delete" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              {tr("Anonymize", "إخفاء الهوية", "Anonimleştir")}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {tr(
              "Export returns a JSON file with the user's profile plus every joined record (deals, activities, audits…). Anonymize redacts PII and disables the account; this action cannot be undone.",
              "التصدير يُعيد ملف JSON يحتوي على الملف الشخصي للمستخدم وجميع السجلات المرتبطة. إخفاء الهوية يخفي البيانات ويعطل الحساب — لا يمكن التراجع.",
              "Dışa aktarma, kullanıcının profili ve tüm bağlı kayıtlarla bir JSON dosyası döndürür. Anonimleştirme PII'yi maskeler ve hesabı devre dışı bırakır — geri alınamaz."
            )}
          </p>
        </section>

        {/* Audit report */}
        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-sm font-bold text-foreground">
            {tr(
              "Audit report",
              "تقرير التدقيق",
              "Denetim raporu"
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-2">
            <input
              type="date"
              value={reportFrom}
              onChange={(e) => setReportFrom(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="date"
              value={reportTo}
              onChange={(e) => setReportTo(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleReport}
              disabled={reportLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-semibold"
            >
              {reportLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : null}
              {tr("Generate", "إنشاء", "Oluştur")}
            </button>
          </div>
          {report && (
            <div className="rounded-lg bg-muted border border-border p-3 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">
                  {tr("Total events", "إجمالي الأحداث", "Toplam olay")}
                </span>
                <span className="font-mono tabular-nums text-foreground text-lg">
                  {report.totalEvents}
                </span>
              </div>
              {report.topActions.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    {tr("Top actions", "أعلى الإجراءات", "Başlıca eylemler")}
                  </h3>
                  <ul className="space-y-0.5">
                    {report.topActions.slice(0, 10).map((a) => (
                      <li
                        key={a.action}
                        className="flex items-center justify-between"
                      >
                        <code className="font-mono text-[11px]">{a.action}</code>
                        <span className="font-semibold">{a.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {report.topUsers.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    {tr("Top users", "أعلى المستخدمين", "En aktif kullanıcılar")}
                  </h3>
                  <ul className="space-y-0.5">
                    {report.topUsers.slice(0, 10).map((u) => (
                      <li
                        key={u.userId ?? "unknown"}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {u.user?.fullName ?? u.userId ?? tr("system", "النظام", "sistem")}
                        </span>
                        <span className="font-semibold">{u.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Tokens */}
        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm font-bold text-foreground inline-flex items-center gap-2">
              <Key className="w-4 h-4" />
              {tr(
                "External auditor tokens",
                "رموز المدققين الخارجيين",
                "Dış denetçi jetonları"
              )}
            </h2>
            <div className="flex items-center gap-2">
              <input
                value={newTokenLabel}
                onChange={(e) => setNewTokenLabel(e.target.value)}
                placeholder={tr(
                  "Label (e.g. KPMG 2026)",
                  "وسم (مثل KPMG 2026)",
                  "Etiket (örn. KPMG 2026)"
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
                "No tokens yet.",
                "لا رموز بعد.",
                "Henüz jeton yok."
              )}
            </p>
          ) : (
            <div className="space-y-2">
              {tokens.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 p-2 rounded-lg border border-border bg-muted/30"
                >
                  <Key className="w-3.5 h-3.5 text-cyan-300 flex-shrink-0" />
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
          <p className="text-[11px] text-muted-foreground">
            {tr(
              "Tokens are shown once at issue time and bcrypt-hashed on storage. Cannot be used to manage other tokens. Compliance API is rate-limited to 10 requests / 15 min / IP.",
              "تُعرض الرموز مرة واحدة فقط ومخزّنة كـ bcrypt. لا يمكن استخدامها لإدارة رموز أخرى. الـ API محدود بـ 10 طلبات / 15 دقيقة / IP.",
              "Jetonlar sadece oluşturulduğunda gösterilir ve bcrypt ile hash'lenerek saklanır. Diğer jetonları yönetmek için kullanılamaz. 10 istek / 15 dk / IP ile sınırlıdır."
            )}
          </p>
        </section>
      </div>
    </>
  );
}
