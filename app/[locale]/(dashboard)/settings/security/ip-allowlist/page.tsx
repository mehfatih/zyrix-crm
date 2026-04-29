"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Network,
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Save,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  getIpAllowlist,
  addIpAllowlistEntry,
  removeIpAllowlistEntry,
  type IpAllowlistEntry,
} from "@/lib/api/advanced";
import { extractErrorMessage } from "@/lib/errors";

type Locale = "en" | "ar" | "tr";

export default function IpAllowlistPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as Locale;
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [entries, setEntries] = useState<IpAllowlistEntry[]>([]);
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newCidr, setNewCidr] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIpAllowlist();
      setEntries(data.entries);
      setCurrentIp(data.currentIp);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const containsCurrent = useMemo(() => {
    if (!currentIp) return false;
    // The server-side matcher is authoritative; this is only a UX hint
    // so we can do a cheap string-based check against /32 and /128
    // suffixes plus exact-match IP without a CIDR.
    const target = currentIp.trim();
    return entries.some((e) => {
      const cidr = e.cidr.trim();
      if (cidr === target) return true;
      if (cidr === `${target}/32` || cidr === `${target}/128`) return true;
      return false;
    });
  }, [entries, currentIp]);

  const handleAdd = async () => {
    const cidr = newCidr.trim();
    const label = newLabel.trim();
    if (!cidr) {
      setError(tr("CIDR is required", "CIDR مطلوب", "CIDR gereklidir"));
      return;
    }
    if (!label) {
      setError(tr("Label is required", "الوسم مطلوب", "Etiket gereklidir"));
      return;
    }
    // Warn if this save would exclude the current user
    if (currentIp && !containsCurrent) {
      const isSelfEntry =
        cidr === currentIp ||
        cidr === `${currentIp}/32` ||
        cidr === `${currentIp}/128`;
      if (!isSelfEntry) {
        const ok = confirm(
          tr(
            `Warning: your current IP ${currentIp} is not in the allowlist yet. Saving may lock you out. Continue?`,
            `تحذير: عنوان IP الحالي ${currentIp} غير مدرج في القائمة. الحفظ قد يمنعك. متابعة؟`,
            `Uyarı: mevcut IP'niz ${currentIp} henüz listede değil. Kaydetmek sizi kilitleyebilir. Devam?`
          )
        );
        if (!ok) return;
      }
    }
    setAdding(true);
    setError(null);
    try {
      await addIpAllowlistEntry({ cidr, label });
      setNewCidr("");
      setNewLabel("");
      await load();
      setSuccess(tr("Added.", "تمت الإضافة.", "Eklendi."));
      setTimeout(() => setSuccess(null), 2500);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (entry: IpAllowlistEntry) => {
    if (
      !confirm(
        tr(
          `Remove "${entry.label}" (${entry.cidr})?`,
          `حذف "${entry.label}" (${entry.cidr})؟`,
          `"${entry.label}" (${entry.cidr}) kaldırılsın mı?`
        )
      )
    )
      return;
    try {
      await removeIpAllowlistEntry(entry.id);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  const addSelfShortcut = () => {
    if (!currentIp) return;
    setNewCidr(`${currentIp}/32`);
    setNewLabel(tr("My network", "شبكتي", "Benim ağım"));
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-4xl mx-auto space-y-5" dir={isRtl ? "rtl" : "ltr"}>
        <div className="flex items-start gap-3">
          <Link
            href={`/${locale}/settings/security`}
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
              {tr("IP allowlist", "قائمة IP المسموحة", "IP izin listesi")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {tr(
                "Restrict sign-ins to specific networks (CIDR blocks).",
                "قيّد تسجيل الدخول إلى شبكات محددة (نطاقات CIDR).",
                "Oturum açmayı belirli ağlara (CIDR blokları) kısıtla."
              )}
            </p>
          </div>
        </div>

        {currentIp && (
          <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-2 text-xs text-foreground">
            <Globe className="w-3.5 h-3.5 text-cyan-300" />
            <span>
              {tr("Your current IP:", "عنوان IP الحالي:", "Mevcut IP'niz:")}{" "}
              <code className="font-mono font-semibold text-foreground" dir="ltr">
                {currentIp}
              </code>
            </span>
            <button
              onClick={addSelfShortcut}
              className="ms-auto rtl:me-auto rtl:ms-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-muted border border-border text-cyan-300 hover:bg-sky-100"
            >
              <Plus className="w-3 h-3" />
              {tr("Add my IP", "أضف IP الخاص بي", "IP'imi ekle")}
            </button>
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-start gap-2 text-sm text-emerald-900">
            <CheckCircle2 className="w-4 h-4 mt-0.5" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 flex items-start gap-2 text-sm text-rose-300">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {!loading && entries.length > 0 && currentIp && !containsCurrent && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2 text-sm text-amber-900">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            <span>
              {tr(
                "Your current IP is not covered by any existing rule. If the rules become stricter, you may lose access.",
                "عنوان IP الحالي غير مشمول بأي قاعدة حالية. إذا أصبحت القواعد أكثر صرامة قد تفقد الوصول.",
                "Mevcut IP'niz hiçbir kurala dahil değil. Kurallar sıkılaştırılırsa erişimi kaybedebilirsiniz."
              )}
            </span>
          </div>
        )}

        {/* Add form */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
          <h2 className="text-sm font-bold text-foreground">
            {tr("Add a new range", "إضافة نطاق جديد", "Yeni aralık ekle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
                {tr("CIDR or IP", "CIDR أو IP", "CIDR veya IP")}
              </label>
              <input
                value={newCidr}
                onChange={(e) => setNewCidr(e.target.value)}
                placeholder="203.0.113.0/24"
                dir="ltr"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary bg-card"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1">
                {tr("Label", "وسم", "Etiket")}
              </label>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder={tr("Office VPN", "VPN المكتب", "Ofis VPN")}
                maxLength={120}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card"
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={handleAdd}
              disabled={adding}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-sm font-semibold"
            >
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {tr("Add range", "إضافة", "Ekle")}
            </button>
          </div>
        </div>

        {/* Existing entries */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <Network className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {tr(
                "No rules yet — everyone can sign in from any network.",
                "لا قواعد بعد — يمكن للجميع تسجيل الدخول من أي شبكة.",
                "Henüz kural yok — herkes her ağdan oturum açabilir."
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((e) => {
              const isSelf =
                currentIp &&
                (e.cidr === currentIp ||
                  e.cidr === `${currentIp}/32` ||
                  e.cidr === `${currentIp}/128`);
              return (
                <div
                  key={e.id}
                  className="rounded-xl border border-border bg-card p-3 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center flex-shrink-0">
                    <Network className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-sm font-mono font-semibold text-foreground" dir="ltr">
                        {e.cidr}
                      </code>
                      {isSelf && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 border border-emerald-500/30">
                          {tr("You", "أنت", "Sen")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{e.label}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(e)}
                    className="w-7 h-7 rounded text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center"
                    title={tr("Remove", "حذف", "Kaldır")}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
