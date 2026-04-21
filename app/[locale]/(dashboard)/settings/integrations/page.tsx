"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ShoppingBag,
  Plug,
  Plus,
  Trash2,
  RefreshCw,
  Loader2,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Users,
  ShoppingCart,
} from "lucide-react";
import {
  listShopifyStores,
  connectShopifyStore,
  disconnectShopifyStore,
  syncShopifyStore,
  type ShopifyStore,
} from "@/lib/api/advanced";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// SHOPIFY INTEGRATIONS PAGE
// ============================================================================

export default function ShopifyIntegrationsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Shopify");

  const [stores, setStores] = useState<ShopifyStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnect, setShowConnect] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await listShopifyStores();
      setStores(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      const result = await syncShopifyStore(id);
      alert(t("sync.success", { count: result.imported }));
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Sync failed");
    } finally {
      setSyncingId(null);
    }
  };

  const handleDisconnect = async (id: string, domain: string) => {
    if (!confirm(t("confirmDisconnect", { domain }))) return;
    try {
      await disconnectShopifyStore(id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Disconnect failed");
    }
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cyan-900">{t("title")}</h1>
              <p className="text-sm text-slate-600 mt-0.5">{t("subtitle")}</p>
            </div>
          </div>
          <button
            onClick={() => setShowConnect(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t("connectStore")}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : stores.length === 0 ? (
          <div className="bg-white border border-sky-100 rounded-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-3">
              <Plug className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-cyan-900 mb-1">
              {t("empty.title")}
            </h3>
            <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
              {t("empty.subtitle")}
            </p>
            <button
              onClick={() => setShowConnect(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg"
            >
              {t("connectFirst")}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                syncing={syncingId === store.id}
                onSync={() => handleSync(store.id)}
                onDisconnect={() => handleDisconnect(store.id, store.shopDomain)}
                t={t}
                locale={locale}
              />
            ))}
          </div>
        )}

        {/* How it works */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-6">
          <h3 className="text-base font-semibold text-cyan-900 mb-3">
            {t("howItWorks.title")}
          </h3>
          <ol className="space-y-2 text-sm text-slate-700">
            <StepItem n={1}>{t("howItWorks.step1")}</StepItem>
            <StepItem n={2}>{t("howItWorks.step2")}</StepItem>
            <StepItem n={3}>{t("howItWorks.step3")}</StepItem>
            <StepItem n={4}>{t("howItWorks.step4")}</StepItem>
          </ol>
        </div>
      </div>

      {showConnect && (
        <ConnectDialog
          onClose={() => setShowConnect(false)}
          onConnected={async () => {
            setShowConnect(false);
            await load();
          }}
          t={t}
        />
      )}
    </DashboardShell>
  );
}

function StoreCard({
  store,
  syncing,
  onSync,
  onDisconnect,
  t,
  locale,
}: {
  store: ShopifyStore;
  syncing: boolean;
  onSync: () => void;
  onDisconnect: () => void;
  t: any;
  locale: string;
}) {
  const statusMeta: Record<string, { bg: string; text: string; Icon: any; label: string }> = {
    idle: { bg: "bg-slate-50", text: "text-slate-600", Icon: Clock, label: t("status.idle") },
    syncing: { bg: "bg-sky-50", text: "text-sky-700", Icon: RefreshCw, label: t("status.syncing") },
    success: { bg: "bg-emerald-50", text: "text-emerald-700", Icon: CheckCircle2, label: t("status.success") },
    error: { bg: "bg-red-50", text: "text-red-700", Icon: AlertTriangle, label: t("status.error") },
  };
  const s = statusMeta[store.syncStatus] || statusMeta.idle;
  const SIcon = s.Icon;

  return (
    <div className="bg-white border border-sky-100 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-cyan-900 flex items-center gap-2">
              {store.shopDomain}
              <a
                href={`https://${store.shopDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-600"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded ${s.bg} ${s.text}`}
              >
                <SIcon className={`w-2.5 h-2.5 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? t("status.syncing") : s.label}
              </span>
              {store.lastSyncAt && (
                <span className="text-[10px] text-slate-500">
                  {t("lastSync")}: {formatDate(store.lastSyncAt, locale)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg"
          >
            {syncing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            {t("syncNow")}
          </button>
          <button
            onClick={onDisconnect}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            title={t("disconnect")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {store.syncError && (
        <div className="mt-3 p-2 bg-red-50 border border-red-100 text-red-700 text-xs rounded flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {store.syncError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-sky-50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <div>
            <div className="text-xs text-slate-500">{t("stats.customers")}</div>
            <div className="text-lg font-bold text-cyan-900">{store.totalCustomersImported}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-emerald-600" />
          <div>
            <div className="text-xs text-slate-500">{t("stats.orders")}</div>
            <div className="text-lg font-bold text-cyan-900">{store.totalOrdersImported}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectDialog({
  onClose,
  onConnected,
  t,
}: {
  onClose: () => void;
  onConnected: () => void;
  t: any;
}) {
  const [domain, setDomain] = useState("");
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!domain.trim() || !token.trim()) {
      setError(t("connect.errors.required"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await connectShopifyStore(domain.trim(), token.trim());
      onConnected();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Connect failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-cyan-900">{t("connect.title")}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t("connect.domain")} *
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="your-shop.myshopify.com"
              className="w-full px-3 py-2 text-sm border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">{t("connect.domainHint")}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t("connect.token")} *
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="shpat_..."
              className="w-full px-3 py-2 text-sm font-mono border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">{t("connect.tokenHint")}</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-sky-100 bg-sky-50/30 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg"
          >
            {t("connect.cancel")}
          </button>
          <button
            onClick={save}
            disabled={saving || !domain || !token}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("connect.connect")}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepItem({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

function formatDate(iso: string, locale: string): string {
  const loc = locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Date(iso).toLocaleString(loc, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
