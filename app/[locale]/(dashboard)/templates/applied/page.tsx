"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  History,
  Loader2,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/lib/auth/context";
import {
  listMarketplaceApplications,
  revertMarketplaceApplication,
  type TemplateApplication,
} from "@/lib/api/advanced";

// ============================================================================
// TEMPLATES — applied history
// ----------------------------------------------------------------------------
// Chronological list of past template applications with Revert button.
// Owner/admin only can revert; members see read-only list.
// ============================================================================

export default function TemplateApplicationsPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;
  const { user } = useAuth();
  const canRevert = user?.role === "owner" || user?.role === "admin";

  const [apps, setApps] = useState<TemplateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reverting, setReverting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMarketplaceApplications();
      setApps(data);
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
  }, []);

  const handleRevert = async (id: string) => {
    if (
      !confirm(
        tr(
          "Revert this template? All records it created will be deleted. This cannot be undone.",
          "التراجع عن هذا القالب؟ سيتم حذف جميع السجلات التي أنشأها. لا يمكن التراجع عن هذا.",
          "Bu şablon geri alınsın mı? Oluşturduğu tüm kayıtlar silinecek. Bu işlem geri alınamaz."
        )
      )
    )
      return;
    setReverting(id);
    try {
      await revertMarketplaceApplication(id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message || "Revert failed");
    } finally {
      setReverting(null);
    }
  };

  const nameFor = (a: TemplateApplication): string =>
    locale === "ar" ? a.nameAr || a.name : locale === "tr" ? a.nameTr || a.name : a.name;

  const countCreated = (records: Record<string, string[]>): number =>
    Object.values(records || {}).reduce(
      (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
      0
    );

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-4xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/templates`}
            className="w-9 h-9 rounded-lg bg-white border border-sky-200 hover:bg-sky-50 flex items-center justify-center text-slate-500 hover:text-cyan-700"
          >
            <ArrowLeft
              className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
            />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white flex items-center justify-center shadow">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cyan-900">
              {tr(
                "Applied templates",
                "القوالب المُطبَّقة",
                "Uygulanan şablonlar"
              )}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              {tr(
                "Everything your team has applied, with the option to revert.",
                "كل ما طبّقه فريقك، مع إمكانية التراجع.",
                "Ekibinizin uyguladığı her şey, geri alma seçeneğiyle."
              )}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : apps.length === 0 ? (
          <div className="rounded-xl border border-sky-100 bg-white p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center mb-3">
              <History className="w-6 h-6 text-cyan-600" />
            </div>
            <p className="text-sm font-semibold text-cyan-900">
              {tr(
                "No templates applied yet",
                "لم يتم تطبيق أي قوالب بعد",
                "Henüz şablon uygulanmadı"
              )}
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {tr(
                "Browse the marketplace to find a setup that fits.",
                "تصفح المتجر لتجد إعدادًا مناسبًا.",
                "Size uygun bir kurulum bulmak için pazara göz atın."
              )}
            </p>
            <Link
              href={`/${locale}/templates`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold"
            >
              {tr("Browse templates", "تصفح القوالب", "Şablonlara göz at")}
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-sky-100 bg-white overflow-hidden divide-y divide-sky-50">
            {apps.map((app) => {
              const count = countCreated(app.createdRecords);
              const statusIcon =
                app.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : app.status === "reverted" ? (
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600" />
                );
              const statusLabel =
                app.status === "completed"
                  ? tr("Applied", "مُطبَّق", "Uygulandı")
                  : app.status === "reverted"
                    ? tr("Reverted", "مُعاد", "Geri alındı")
                    : tr("Failed", "فشل", "Başarısız");
              return (
                <div
                  key={app.id}
                  className="p-4 flex items-center gap-4 hover:bg-sky-50/40"
                >
                  <div className="text-3xl flex-shrink-0">{app.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-cyan-900 truncate">
                        {nameFor(app)}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-600 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5">
                        {statusIcon}
                        {statusLabel}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                      <span>{app.industry}</span>
                      <span className="text-slate-300">·</span>
                      <time dir="ltr" className="tabular-nums">
                        {new Date(app.appliedAt).toLocaleDateString(
                          locale === "ar"
                            ? "ar-SA"
                            : locale === "tr"
                              ? "tr-TR"
                              : "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </time>
                      {app.status === "completed" && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span>
                            {count}{" "}
                            {tr("records", "سجل", "kayıt")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {canRevert && app.status === "completed" && (
                    <button
                      onClick={() => handleRevert(app.id)}
                      disabled={reverting === app.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold disabled:opacity-50"
                    >
                      {reverting === app.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5" />
                      )}
                      {tr("Revert", "تراجع", "Geri al")}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
