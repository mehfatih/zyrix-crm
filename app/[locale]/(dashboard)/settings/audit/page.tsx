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
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  listAuditLogs,
  listAuditActions,
  type AuditLogEntry,
  type AuditLogPage,
} from "@/lib/api/advanced";

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
  if (action === "user.login") return { Icon: LogIn, color: "text-emerald-600 bg-emerald-50" };
  if (action === "user.login_failed" || action === "user.2fa_challenge_failed")
    return { Icon: AlertCircle, color: "text-rose-700 bg-rose-50" };
  if (action === "user.logout") return { Icon: LogOut, color: "text-slate-600 bg-slate-100" };
  if (action.startsWith("2fa.")) return { Icon: Shield, color: "text-cyan-700 bg-cyan-50" };
  if (action.includes(".create") || action.includes(".add"))
    return { Icon: Plus, color: "text-emerald-600 bg-emerald-50" };
  if (action.includes(".delete") || action.includes(".remove"))
    return { Icon: Trash2, color: "text-rose-700 bg-rose-50" };
  if (action.includes(".update") || action.includes(".edit"))
    return { Icon: Edit, color: "text-amber-700 bg-amber-50" };
  if (action.includes(".invite")) return { Icon: UserPlus, color: "text-cyan-700 bg-cyan-50" };
  if (action.includes("password") || action.includes("token") || action.includes("key"))
    return { Icon: KeyRound, color: "text-violet-700 bg-violet-50" };
  return { Icon: History, color: "text-slate-600 bg-slate-100" };
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
  const [actions, setActions] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter state
  const [actionFilter, setActionFilter] = useState("");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  const [offset, setOffset] = useState(0);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, acts] = await Promise.all([
        listAuditLogs({
          limit: PAGE_SIZE,
          offset,
          action: actionFilter || undefined,
          since: since || undefined,
          until: until || undefined,
        }),
        actions.length === 0 ? listAuditActions() : Promise.resolve(actions),
      ]);
      setPage(data);
      if (actions.length === 0) setActions(acts as string[]);
    } catch (e: any) {
      setError(
        e?.response?.data?.error?.message || e?.message || "Failed to load"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, actionFilter, since, until]);

  const totalPages = page
    ? Math.max(1, Math.ceil(page.pagination.total / PAGE_SIZE))
    : 1;
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  const clearFilters = () => {
    setActionFilter("");
    setSince("");
    setUntil("");
    setOffset(0);
  };
  const hasFilters = actionFilter || since || until;

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-5xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white flex items-center justify-center shadow">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cyan-900">
                {tr("Audit log", "سجل التدقيق", "Denetim kaydı")}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                {tr(
                  "Timeline of security events and changes.",
                  "سجل زمني للأحداث الأمنية والتغييرات.",
                  "Güvenlik olaylarının ve değişikliklerin zaman çizelgesi."
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              filterOpen || hasFilters
                ? "bg-cyan-50 border-cyan-300 text-cyan-700"
                : "bg-white border-sky-200 text-slate-700 hover:bg-sky-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            {tr("Filter", "تصفية", "Filtrele")}
            {hasFilters && (
              <span className="ml-1 rtl:ml-0 rtl:mr-1 w-2 h-2 rounded-full bg-cyan-500" />
            )}
          </button>
        </div>

        {/* Filter bar */}
        {filterOpen && (
          <div className="rounded-xl border border-sky-200 bg-white p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {tr("Action", "الإجراء", "Eylem")}
              </label>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setOffset(0);
                }}
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {tr("Since", "من", "Başlangıç")}
              </label>
              <input
                type="date"
                value={since}
                onChange={(e) => {
                  setSince(e.target.value);
                  setOffset(0);
                }}
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {tr("Until", "إلى", "Bitiş")}
              </label>
              <input
                type="date"
                value={until}
                onChange={(e) => {
                  setUntil(e.target.value);
                  setOffset(0);
                }}
                className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="col-span-full inline-flex items-center justify-center gap-1 text-xs text-slate-600 hover:text-cyan-700"
              >
                <X className="w-3 h-3" />
                {tr("Clear filters", "إزالة المرشحات", "Filtreleri temizle")}
              </button>
            )}
          </div>
        )}

        {/* Timeline */}
        {loading && !page ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : !page || page.items.length === 0 ? (
          <div className="rounded-xl border border-sky-100 bg-white p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center mb-3">
              <History className="w-6 h-6 text-cyan-600" />
            </div>
            <p className="text-sm font-semibold text-cyan-900">
              {tr(
                "No events yet",
                "لا توجد أحداث بعد",
                "Henüz olay yok"
              )}
            </p>
            <p className="text-xs text-slate-500 mt-1">
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
            <div className="rounded-xl border border-sky-100 bg-white overflow-hidden">
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
                <span className="text-xs text-slate-500">
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
                    className="p-2 rounded-lg bg-white border border-sky-200 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft
                      className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => setOffset(offset + PAGE_SIZE)}
                    disabled={offset + PAGE_SIZE >= page.pagination.total}
                    className="p-2 rounded-lg bg-white border border-sky-200 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
    </DashboardShell>
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
  const hasDetails =
    entry.changes ||
    (entry.metadata && Object.keys(entry.metadata).length > 0) ||
    entry.ipAddress ||
    entry.userAgent;

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
      className={`px-4 py-3 flex items-start gap-3 hover:bg-sky-50/40 transition-colors ${
        !isLast ? "border-b border-sky-100" : ""
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-semibold text-cyan-900">
            {humanizeAction(entry.action, locale)}
          </span>
          {entry.user && (
            <span className="text-xs text-slate-500">
              · {entry.user.fullName}
            </span>
          )}
          <time
            className="ltr:ml-auto rtl:mr-auto text-xs text-slate-400 tabular-nums"
            dir="ltr"
            style={{ unicodeBidi: "embed" }}
            title={new Date(entry.createdAt).toLocaleString()}
          >
            {relativeTime}
          </time>
        </div>

        {/* Entity reference if available */}
        {entry.entityType && entry.entityId && (
          <p className="text-xs text-slate-500 mt-0.5">
            {entry.entityType}: <code className="font-mono">{entry.entityId}</code>
          </p>
        )}

        {hasDetails && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-1 text-xs text-cyan-700 hover:underline"
          >
            {expanded
              ? tr("Hide details", "إخفاء التفاصيل", "Detayları gizle")
              : tr("Show details", "عرض التفاصيل", "Detayları göster")}
          </button>
        )}

        {expanded && (
          <div className="mt-2 p-3 rounded-lg bg-sky-50 border border-sky-100 text-xs space-y-2">
            {entry.ipAddress && (
              <div className="flex items-center gap-1.5 text-slate-700">
                <Globe className="w-3 h-3" />
                <span className="font-medium">IP:</span>
                <code dir="ltr" className="font-mono">
                  {entry.ipAddress}
                </code>
              </div>
            )}
            {entry.userAgent && (
              <div className="text-slate-600">
                <span className="font-medium">User agent:</span>{" "}
                <span className="font-mono break-all" dir="ltr">
                  {entry.userAgent}
                </span>
              </div>
            )}
            {entry.metadata && Object.keys(entry.metadata).length > 0 && (
              <div>
                <div className="font-medium text-slate-700 mb-1">
                  {tr("Metadata", "بيانات إضافية", "Meta veri")}
                </div>
                <pre className="bg-white p-2 rounded border border-sky-200 text-[10px] overflow-x-auto" dir="ltr">
                  {JSON.stringify(entry.metadata, null, 2)}
                </pre>
              </div>
            )}
            {entry.changes && Object.keys(entry.changes).length > 0 && (
              <div>
                <div className="font-medium text-slate-700 mb-1">
                  {tr("Changes", "التغييرات", "Değişiklikler")}
                </div>
                <div className="space-y-1">
                  {Object.entries(entry.changes).map(([field, { before, after }]) => (
                    <div
                      key={field}
                      className="bg-white p-2 rounded border border-sky-200"
                    >
                      <div className="font-mono font-semibold text-slate-800 mb-0.5">
                        {field}
                      </div>
                      <div className="text-rose-700 text-[10px]">
                        − {JSON.stringify(before)}
                      </div>
                      <div className="text-emerald-700 text-[10px]">
                        + {JSON.stringify(after)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
