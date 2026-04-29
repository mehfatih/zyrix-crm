"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  History,
  Loader2,
  Filter,
  Calendar,
  User as UserIcon,
  Shield,
  LogIn,
  LogOut,
  UserPlus,
  Edit,
  Trash2,
  Plus,
  KeyRound,
  RefreshCw,
  Globe,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Download,
  FileJson,
  FileSpreadsheet,
} from "lucide-react";
import {
  listAuditLogs,
  listAuditActions,
  downloadAuditExport,
  type AuditLogEntry,
  type AuditLogPage,
  type AuditLogQuery,
} from "@/lib/api/advanced";
import { listCompanyUsers, type TeamMember } from "@/lib/api/roles";
import { extractErrorMessage } from "@/lib/errors";
import { UpgradeCard } from "@/components/upgrade/UpgradeCard";
import { getFeatureDef } from "@/lib/features/feature-catalog";

// ============================================================================
// SETTINGS → AUDIT LOG
// ----------------------------------------------------------------------------
// Company-scoped event timeline for security & compliance. Lets admins see
// who did what, when, and from where. Filters by action type (populated
// dynamically from the backend so the dropdown only shows actions that
// actually happened) and by date window.
// ============================================================================

const PAGE_SIZE = 50;

// Map action prefix → icon + color. Unknown actions fall back to History.
function iconForAction(action: string): { Icon: any; color: string } {
  if (action === "user.login") return { Icon: LogIn, color: "text-emerald-300 bg-emerald-500/10" };
  if (action === "user.login_failed" || action === "user.2fa_challenge_failed")
    return { Icon: AlertCircle, color: "text-rose-300 bg-rose-500/10" };
  if (action === "user.logout") return { Icon: LogOut, color: "text-muted-foreground bg-muted" };
  if (action.startsWith("2fa.")) return { Icon: Shield, color: "text-cyan-300 bg-muted" };
  if (action.includes(".create") || action.includes(".add"))
    return { Icon: Plus, color: "text-emerald-300 bg-emerald-500/10" };
  if (action.includes(".delete") || action.includes(".remove"))
    return { Icon: Trash2, color: "text-rose-300 bg-rose-500/10" };
  if (action.includes(".update") || action.includes(".edit"))
    return { Icon: Edit, color: "text-amber-300 bg-amber-500/10" };
  if (action.includes(".invite")) return { Icon: UserPlus, color: "text-cyan-300 bg-muted" };
  if (action.includes("password") || action.includes("token") || action.includes("key"))
    return { Icon: KeyRound, color: "text-violet-700 bg-violet-500/10" };
  return { Icon: History, color: "text-muted-foreground bg-muted" };
}

function humanizeAction(action: string, locale: "en" | "ar" | "tr"): string {
  const LABELS: Record<string, { en: string; ar: string; tr: string }> = {
    "user.login": {
      en: "Signed in",
      ar: "تسجيل دخول",
      tr: "Giriş yapıldı",
    },
    "user.login_failed": {
      en: "Failed sign-in attempt",
      ar: "محاولة تسجيل دخول فاشلة",
      tr: "Başarısız giriş denemesi",
    },
    "user.2fa_challenge_failed": {
      en: "2FA challenge failed",
      ar: "فشل التحقق الثنائي",
      tr: "2FA doğrulaması başarısız",
    },
    "user.logout": { en: "Signed out", ar: "تسجيل خروج", tr: "Çıkış yapıldı" },
    "2fa.begin_enroll": {
      en: "Started 2FA enrolment",
      ar: "بدأ تسجيل 2FA",
      tr: "2FA kaydı başlatıldı",
    },
    "2fa.enabled": {
      en: "Enabled 2FA",
      ar: "تم تفعيل 2FA",
      tr: "2FA etkinleştirildi",
    },
    "2fa.disabled": {
      en: "Disabled 2FA",
      ar: "تم تعطيل 2FA",
      tr: "2FA devre dışı bırakıldı",
    },
    "2fa.backup_codes_regenerated": {
      en: "Regenerated backup codes",
      ar: "أعاد إنشاء رموز الاسترداد",
      tr: "Yedek kodları yeniden oluşturdu",
    },
  };
  const label = LABELS[action];
  if (label) return label[locale] || label.en;
  // Fall back to raw action for unknown ones
  return action;
}

export default function AuditLogPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [page, setPage] = useState<AuditLogPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Sprint 14ac — detect FEATURE_DISABLED so we render <UpgradeCard /> inline.
  const [featureGated, setFeatureGated] = useState(false);
  const [actions, setActions] = useState<string[]>([]);
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [exporting, setExporting] = useState<"csv" | "json" | null>(null);

  // Filter state
  const [actionFilter, setActionFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  const [offset, setOffset] = useState(0);

  const currentQuery: AuditLogQuery = useMemo(
    () => ({
      limit: PAGE_SIZE,
      offset,
      action: actionFilter || undefined,
      userId: userFilter || undefined,
      entityType: entityTypeFilter || undefined,
      since: since || undefined,
      until: until || undefined,
    }),
    [offset, actionFilter, userFilter, entityTypeFilter, since, until]
  );

  const load = async () => {
    setLoading(true);
    setError(null);
    setFeatureGated(false);
    try {
      const [data, acts, team] = await Promise.all([
        listAuditLogs(currentQuery),
        actions.length === 0 ? listAuditActions() : Promise.resolve(actions),
        users.length === 0 ? listCompanyUsers().catch(() => []) : Promise.resolve(users),
      ]);
      setPage(data);
      if (actions.length === 0) setActions(acts as string[]);
      if (users.length === 0) setUsers(team as TeamMember[]);
    } catch (e) {
      const code = (e as { response?: { data?: { error?: { code?: string } } } })
        ?.response?.data?.error?.code;
      if (code === "FEATURE_DISABLED") {
        setFeatureGated(true);
      } else {
        setError(extractErrorMessage(e));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, actionFilter, userFilter, entityTypeFilter, since, until]);

  const totalPages = page
    ? Math.max(1, Math.ceil(page.pagination.total / PAGE_SIZE))
    : 1;
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  const clearFilters = () => {
    setActionFilter("");
    setUserFilter("");
    setEntityTypeFilter("");
    setSince("");
    setUntil("");
    setOffset(0);
  };
  const hasFilters =
    actionFilter || userFilter || entityTypeFilter || since || until;

  // Distinct entity types observed in the current page — gives a light-
  // weight filter dropdown without needing a dedicated backend endpoint.
  const entityTypes = useMemo(() => {
    const set = new Set<string>();
    if (page) {
      for (const it of page.items) {
        if (it.entityType) set.add(it.entityType);
      }
    }
    // Always keep whatever is currently selected in the list so the
    // dropdown reflects the active filter even when the page is empty.
    if (entityTypeFilter) set.add(entityTypeFilter);
    return Array.from(set).sort();
  }, [page, entityTypeFilter]);

  const handleExport = async (format: "csv" | "json") => {
    setExporting(format);
    setError(null);
    try {
      // Drop pagination params — the export endpoint returns up to 10k
      // matching rows regardless of the on-screen page size.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { limit, offset: _off, ...filters } = currentQuery;
      await downloadAuditExport(format, filters);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setExporting(null);
    }
  };

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">SETTINGS</p>
              <h1 className="text-2xl font-bold text-foreground">
                {tr("Audit log", "سجل التدقيق", "Denetim kaydı")}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {tr(
                  "Timeline of security events and changes.",
                  "سجل زمني للأحداث الأمنية والتغييرات.",
                  "Güvenlik olaylarının ve değişikliklerin zaman çizelgesi."
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleExport("csv")}
              disabled={exporting !== null || featureGated}
              title={
                featureGated
                  ? tr("Upgrade to enable", "قم بالترقية للتفعيل", "Etkinleştirmek için yükseltin")
                  : tr(
                      "Download current filtered results as CSV",
                      "تنزيل النتائج المصفاة كـ CSV",
                      "Filtrelenmiş sonuçları CSV olarak indir"
                    )
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border bg-card border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting === "csv" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-3.5 h-3.5" />
              )}
              {tr("CSV", "CSV", "CSV")}
            </button>
            <button
              onClick={() => handleExport("json")}
              disabled={exporting !== null || featureGated}
              title={
                featureGated
                  ? tr("Upgrade to enable", "قم بالترقية للتفعيل", "Etkinleştirmek için yükseltin")
                  : tr(
                      "Download current filtered results as JSON",
                      "تنزيل النتائج المصفاة كـ JSON",
                      "Filtrelenmiş sonuçları JSON olarak indir"
                    )
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border bg-card border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting === "json" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileJson className="w-3.5 h-3.5" />
              )}
              {tr("JSON", "JSON", "JSON")}
            </button>
            <button
              onClick={() => setFilterOpen((o) => !o)}
              disabled={featureGated}
              title={
                featureGated
                  ? tr("Upgrade to enable", "قم بالترقية للتفعيل", "Etkinleştirmek için yükseltin")
                  : undefined
              }
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                filterOpen || hasFilters
                  ? "bg-muted border-sky-300 text-cyan-300"
                  : "bg-card border-border text-foreground hover:bg-muted"
              }`}
            >
              <Filter className="w-4 h-4" />
              {tr("Filter", "تصفية", "Filtrele")}
              {hasFilters && (
                <span className="ml-1 rtl:ml-0 rtl:mr-1 w-2 h-2 rounded-full bg-sky-400" />
              )}
            </button>
          </div>
        </div>

        {/* Sprint 14ac — feature-gated upgrade card + skeleton preview */}
        {featureGated && (
          <>
            <UpgradeCard
              feature={getFeatureDef("audit_advanced")}
              locale={locale}
              variant="inline"
              targetPlan="business"
            />
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                {tr("Preview", "معاينة", "Önizleme")}
              </p>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card/30 border border-border/30"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted/50 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-muted/50 rounded animate-pulse w-1/3" />
                      <div className="h-2 bg-muted/30 rounded animate-pulse w-1/2" />
                    </div>
                    <div className="h-2 bg-muted/30 rounded animate-pulse w-16" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Filter bar — sprint 14ac: hide when feature is gated */}
        {filterOpen && !featureGated && (
          <div className="rounded-xl border border-border bg-card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {tr("Action", "الإجراء", "Eylem")}
              </label>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setOffset(0);
                }}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{tr("All actions", "كل الإجراءات", "Tüm eylemler")}</option>
                {actions.map((a) => (
                  <option key={a} value={a}>
                    {humanizeAction(a, locale)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {tr("User", "المستخدم", "Kullanıcı")}
              </label>
              <select
                value={userFilter}
                onChange={(e) => {
                  setUserFilter(e.target.value);
                  setOffset(0);
                }}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">
                  {tr("All users", "كل المستخدمين", "Tüm kullanıcılar")}
                </option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {tr("Entity type", "نوع الكيان", "Varlık türü")}
              </label>
              <select
                value={entityTypeFilter}
                onChange={(e) => {
                  setEntityTypeFilter(e.target.value);
                  setOffset(0);
                }}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">
                  {tr("All types", "كل الأنواع", "Tüm türler")}
                </option>
                {entityTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {tr("Since", "من", "Başlangıç")}
              </label>
              <input
                type="date"
                value={since}
                onChange={(e) => {
                  setSince(e.target.value);
                  setOffset(0);
                }}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {tr("Until", "إلى", "Bitiş")}
              </label>
              <input
                type="date"
                value={until}
                onChange={(e) => {
                  setUntil(e.target.value);
                  setOffset(0);
                }}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="col-span-full inline-flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-cyan-300"
              >
                <X className="w-3 h-3" />
                {tr("Clear filters", "إزالة المرشحات", "Filtreleri temizle")}
              </button>
            )}
          </div>
        )}

        {/* Timeline — sprint 14ac: hide entirely when feature is gated */}
        {featureGated ? null : loading && !page ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        ) : !page || page.items.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <History className="w-6 h-6 text-cyan-300" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {tr(
                "No events yet",
                "لا توجد أحداث بعد",
                "Henüz olay yok"
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {hasFilters
                ? tr(
                    "Try clearing your filters.",
                    "جرّب إزالة المرشحات.",
                    "Filtreleri temizlemeyi deneyin."
                  )
                : tr(
                    "Events will appear here as you use Zyrix.",
                    "ستظهر الأحداث هنا أثناء استخدامك Zyrix.",
                    "Zyrix'i kullandıkça olaylar burada görünecek."
                  )}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {page.items.map((entry, idx) => (
                <EventRow
                  key={entry.id}
                  entry={entry}
                  locale={locale}
                  isLast={idx === page.items.length - 1}
                />
              ))}
            </div>

            {/* Pagination */}
            {page.pagination.total > PAGE_SIZE && (
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  {tr(
                    `Page ${currentPage} of ${totalPages} — ${page.pagination.total} total events`,
                    `الصفحة ${currentPage} من ${totalPages} — ${page.pagination.total} حدث`,
                    `Sayfa ${currentPage} / ${totalPages} — toplam ${page.pagination.total} olay`
                  )}
                </span>
                <div className="inline-flex items-center gap-1">
                  <button
                    onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                    disabled={offset === 0}
                    className="p-2 rounded-lg bg-card border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft
                      className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => setOffset(offset + PAGE_SIZE)}
                    disabled={offset + PAGE_SIZE >= page.pagination.total}
                    className="p-2 rounded-lg bg-card border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight
                      className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
                    />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// ============================================================================
// EVENT ROW
// ============================================================================

function EventRow({
  entry,
  locale,
  isLast,
}: {
  entry: AuditLogEntry;
  locale: "en" | "ar" | "tr";
  isLast: boolean;
}) {
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const { Icon, color } = iconForAction(entry.action);
  const [expanded, setExpanded] = useState(false);
  const hasSnapshot =
    (entry.before && Object.keys(entry.before).length > 0) ||
    (entry.after && Object.keys(entry.after).length > 0);
  const hasDetails =
    entry.changes ||
    hasSnapshot ||
    (entry.metadata && Object.keys(entry.metadata).length > 0) ||
    entry.ipAddress ||
    entry.userAgent ||
    entry.sessionId;

  const relativeTime = useMemo(() => {
    const ms = Date.now() - new Date(entry.createdAt).getTime();
    const min = Math.round(ms / 60000);
    if (min < 1) return tr("just now", "الآن", "az önce");
    if (min < 60)
      return tr(
        `${min}m ago`,
        `منذ ${min}د`,
        `${min}d önce`
      );
    const hr = Math.round(min / 60);
    if (hr < 24)
      return tr(
        `${hr}h ago`,
        `منذ ${hr}س`,
        `${hr}s önce`
      );
    const day = Math.round(hr / 24);
    return tr(
      `${day}d ago`,
      `منذ ${day}ي`,
      `${day}g önce`
    );
  }, [entry.createdAt, locale]);

  return (
    <div
      className={`px-4 py-3 flex items-start gap-3 hover:bg-muted/40 transition-colors ${
        !isLast ? "border-b border-border" : ""
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">
            {humanizeAction(entry.action, locale)}
          </span>
          {entry.user && (
            <span className="text-xs text-muted-foreground">
              · {entry.user.fullName}
            </span>
          )}
          <time
            className="ltr:ml-auto rtl:mr-auto text-xs text-muted-foreground tabular-nums"
            dir="ltr"
            style={{ unicodeBidi: "embed" }}
            title={new Date(entry.createdAt).toLocaleString()}
          >
            {relativeTime}
          </time>
        </div>

        {/* Entity reference if available */}
        {entry.entityType && entry.entityId && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {entry.entityType}: <code className="font-mono">{entry.entityId}</code>
          </p>
        )}

        {hasDetails && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-1 text-xs text-cyan-300 hover:underline"
          >
            {expanded
              ? tr("Hide details", "إخفاء التفاصيل", "Detayları gizle")
              : tr("Show details", "عرض التفاصيل", "Detayları göster")}
          </button>
        )}

        {expanded && (
          <div className="mt-2 p-3 rounded-lg bg-muted border border-border text-xs space-y-2">
            {entry.ipAddress && (
              <div className="flex items-center gap-1.5 text-foreground">
                <Globe className="w-3 h-3" />
                <span className="font-medium">IP:</span>
                <code dir="ltr" className="font-mono">
                  {entry.ipAddress}
                </code>
              </div>
            )}
            {entry.userAgent && (
              <div className="text-muted-foreground">
                <span className="font-medium">User agent:</span>{" "}
                <span className="font-mono break-all" dir="ltr">
                  {entry.userAgent}
                </span>
              </div>
            )}
            {entry.sessionId && (
              <div className="text-muted-foreground">
                <span className="font-medium">
                  {tr("Session", "الجلسة", "Oturum")}:
                </span>{" "}
                <code className="font-mono text-[10px]" dir="ltr">
                  {entry.sessionId}
                </code>
              </div>
            )}
            {entry.metadata && Object.keys(entry.metadata).length > 0 && (
              <div>
                <div className="font-medium text-foreground mb-1">
                  {tr("Metadata", "بيانات إضافية", "Meta veri")}
                </div>
                <pre className="bg-card p-2 rounded border border-border text-[10px] overflow-x-auto" dir="ltr">
                  {JSON.stringify(entry.metadata, null, 2)}
                </pre>
              </div>
            )}
            {entry.changes && Object.keys(entry.changes).length > 0 && (
              <div>
                <div className="font-medium text-foreground mb-1">
                  {tr("Changes", "التغييرات", "Değişiklikler")}
                </div>
                <div className="space-y-1">
                  {Object.entries(entry.changes).map(([field, { before, after }]) => (
                    <div
                      key={field}
                      className="bg-card p-2 rounded border border-border"
                    >
                      <div className="font-mono font-semibold text-foreground mb-0.5">
                        {field}
                      </div>
                      <div className="text-rose-300 text-[10px]">
                        − {JSON.stringify(before)}
                      </div>
                      <div className="text-emerald-300 text-[10px]">
                        + {JSON.stringify(after)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {hasSnapshot && (
              <div>
                <div className="font-medium text-foreground mb-1">
                  {tr("Record snapshot", "لقطة السجل", "Kayıt görüntüsü")}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-rose-300 mb-1">
                      {tr("Before", "قبل", "Önce")}
                    </div>
                    <pre
                      className="bg-card p-2 rounded border border-rose-500/30 text-[10px] overflow-x-auto max-h-64"
                      dir="ltr"
                    >
                      {entry.before
                        ? JSON.stringify(entry.before, null, 2)
                        : tr("— (empty)", "— (فارغ)", "— (boş)")}
                    </pre>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-300 mb-1">
                      {tr("After", "بعد", "Sonra")}
                    </div>
                    <pre
                      className="bg-card p-2 rounded border border-emerald-500/30 text-[10px] overflow-x-auto max-h-64"
                      dir="ltr"
                    >
                      {entry.after
                        ? JSON.stringify(entry.after, null, 2)
                        : tr("— (empty)", "— (فارغ)", "— (boş)")}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
