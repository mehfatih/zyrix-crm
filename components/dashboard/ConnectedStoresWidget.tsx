"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Store,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Plus,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  listEcommerceStores,
  syncEcommerceStore,
  type EcommerceStore,
} from "@/lib/api/advanced";

// ============================================================================
// CONNECTED STORES — dashboard shortcut card
//
// Compact per-store cards with last-sync timestamp + quick re-sync.
// Shown ONLY when the user has at least one store connected. When they
// have none, renders a minimal "Connect a store" CTA that deep-links to
// /settings/integrations.
// ============================================================================

const PLATFORM_COLORS: Record<string, string> = {
  shopify: "#96BF48",
  salla: "#D4AF37",
  zid: "#1E40AF",
  woocommerce: "#96588A",
  youcan: "#0EA5E9",
  easyorders: "#F59E0B",
  expandcart: "#10B981",
  ticimax: "#DC2626",
  ideasoft: "#7C3AED",
  tsoft: "#EA580C",
  ikas: "#18181B",
  turhost: "#0EA5E9",
};

interface Props {
  locale: string;
}

export default function ConnectedStoresWidget({ locale }: Props) {
  const [stores, setStores] = useState<EcommerceStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const load = async () => {
    try {
      const data = await listEcommerceStores();
      setStores(data);
    } catch {
      setStores([]);
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
      await syncEcommerceStore(id);
      await load();
    } catch (e: any) {
      console.error("sync failed:", e?.message || e);
    } finally {
      setSyncingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-sky-100 rounded-xl p-5 flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
      </div>
    );
  }

  // Empty state — nudge to connect
  if (stores.length === 0) {
    return (
      <Link
        href={`/${locale}/settings/integrations`}
        className="group block bg-gradient-to-br from-sky-50 to-sky-50 border border-sky-100 border-dashed rounded-xl p-5 hover:border-sky-300 hover:shadow-sm transition-all"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-sky-200 flex items-center justify-center flex-shrink-0">
            <Store className="w-5 h-5 text-sky-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-sky-900">
              {tr(
                "Connect your e-commerce store",
                "اربط متجرك الإلكتروني",
                "E-ticaret mağazanı bağla"
              )}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(
                "Import customers and orders from 40+ platforms — Shopify, Salla, WooCommerce, and more.",
                "استورد العملاء والطلبات من أكثر من 40 منصة — Shopify و Salla و WooCommerce وأكثر.",
                "40+ platformdan müşteri ve siparişleri içe aktar — Shopify, Salla, WooCommerce ve daha fazlası."
              )}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            {tr("Connect", "ربط", "bağla")}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <section className="bg-white border border-sky-100 rounded-xl overflow-hidden">
      <header className="px-4 py-2.5 flex items-center justify-between gap-2 border-b border-sky-50 bg-sky-50/40">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-sky-500" />
          <h2 className="text-sm font-semibold text-sky-900">
            {tr("Your stores", "متاجرك", "Mağazaların")}
          </h2>
          <span className="px-1.5 py-0.5 text-[10px] bg-sky-100 text-sky-600 rounded-full font-semibold">
            {stores.length}
          </span>
        </div>
        <Link
          href={`/${locale}/settings/integrations`}
          className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-900 font-medium"
        >
          {tr("Manage", "إدارة", "Yönet")}
          <ArrowRight
            className={`w-3 h-3 ${isRtl ? "-scale-x-100" : ""}`}
          />
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-sky-50">
        {stores.slice(0, 6).map((store) => (
          <StoreMiniCard
            key={store.id}
            store={store}
            syncing={syncingId === store.id}
            onSync={() => handleSync(store.id)}
            locale={locale}
            tr={tr}
            isRtl={isRtl}
          />
        ))}
      </div>

      {stores.length > 6 && (
        <div className="px-4 py-2 text-center border-t border-sky-50 bg-sky-50/40">
          <Link
            href={`/${locale}/settings/integrations`}
            className="text-xs text-sky-600 hover:text-sky-900 font-medium"
          >
            {tr(
              `+${stores.length - 6} more stores →`,
              `+${stores.length - 6} متجر آخر ←`,
              `+${stores.length - 6} mağaza daha →`
            )}
          </Link>
        </div>
      )}
    </section>
  );
}

function StoreMiniCard({
  store,
  syncing,
  onSync,
  locale,
  tr,
  isRtl,
}: {
  store: EcommerceStore;
  syncing: boolean;
  onSync: () => void;
  locale: string;
  tr: (en: string, ar: string, trk: string) => string;
  isRtl: boolean;
}) {
  const color = PLATFORM_COLORS[store.platform] || "#0EA5E9";
  const statusBadge = getStatusBadge(store.syncStatus, tr);

  return (
    <div className="bg-white p-3 flex items-start gap-2.5 hover:bg-sky-50/20 transition-colors">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 capitalize"
        style={{ backgroundColor: color }}
      >
        {store.platform.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-sky-900 capitalize">
            {store.platform}
          </span>
          {statusBadge}
        </div>
        <p
          className="text-[11px] text-slate-600 truncate mt-0.5"
          dir="ltr"
          style={{ unicodeBidi: "embed" }}
        >
          {store.shopDomain}
        </p>
        <div className="mt-1 flex items-center gap-2.5 text-[10px] text-slate-500">
          {store.totalCustomersImported > 0 && (
            <span className="inline-flex items-center gap-0.5">
              <Users className="w-2.5 h-2.5" />
              {store.totalCustomersImported}
            </span>
          )}
          {store.totalOrdersImported > 0 && (
            <span className="inline-flex items-center gap-0.5">
              <ShoppingCart className="w-2.5 h-2.5" />
              {store.totalOrdersImported}
            </span>
          )}
          {store.lastSyncAt && (
            <span>
              {tr("synced", "مُزامَن", "senkronize")}{" "}
              {formatTimeAgo(store.lastSyncAt, locale)}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onSync}
        disabled={syncing}
        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        title={tr("Sync now", "مزامنة الآن", "Şimdi senkronize et")}
      >
        {syncing ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <RefreshCw className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

function getStatusBadge(
  status: string | null | undefined,
  tr: (en: string, ar: string, trk: string) => string
) {
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[9px] px-1 py-0.5 bg-emerald-50 text-emerald-700 rounded">
        <CheckCircle2 className="w-2.5 h-2.5" />
        {tr("ok", "جاهز", "tamam")}
      </span>
    );
  }
  if (status === "syncing") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[9px] px-1 py-0.5 bg-sky-50 text-sky-700 rounded">
        <Loader2 className="w-2.5 h-2.5 animate-spin" />
        {tr("syncing", "جارٍ", "senkron")}
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[9px] px-1 py-0.5 bg-rose-50 text-rose-700 rounded">
        <AlertTriangle className="w-2.5 h-2.5" />
        {tr("error", "خطأ", "hata")}
      </span>
    );
  }
  return null;
}

function formatTimeAgo(iso: string, locale: string): string {
  try {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);
    if (diffMin < 1)
      return locale === "ar" ? "الآن" : locale === "tr" ? "şimdi" : "just now";
    if (diffMin < 60)
      return locale === "ar"
        ? `منذ ${diffMin}د`
        : locale === "tr"
          ? `${diffMin}d önce`
          : `${diffMin}m ago`;
    if (diffHr < 24)
      return locale === "ar"
        ? `منذ ${diffHr}س`
        : locale === "tr"
          ? `${diffHr}s önce`
          : `${diffHr}h ago`;
    return locale === "ar"
      ? `منذ ${diffDay}ي`
      : locale === "tr"
        ? `${diffDay}g önce`
        : `${diffDay}d ago`;
  } catch {
    return "";
  }
}
