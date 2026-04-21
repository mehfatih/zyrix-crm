"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Trash2,
  RefreshCw,
  ShoppingBag,
  Store as StoreIcon,
  X,
} from "lucide-react";
import {
  getOAuthProviderStatus,
  listOAuthConnections,
  disconnectOAuthConnection,
  initSallaInstall,
  initShopifyInstall,
  type OAuthProviderStatus,
  type OAuthConnection,
} from "@/lib/api/advanced";

// ============================================================================
// OAUTH INSTALL PANEL
// ----------------------------------------------------------------------------
// Stand-alone panel for managing Salla + Shopify OAuth-connected stores.
// Drops into the existing /settings/integrations page above the manual
// platform catalog. Handles:
//   • Success/error banners from ?connected= / ?error= URL params
//   • Install card per provider (hidden if that provider isn't configured
//     in the current deployment — backend returns { salla, shopify: bool })
//   • Shopify card has a shop-domain input field before the Install button
//   • List of OAuth-connected stores with metadata + Disconnect
// ============================================================================

interface Props {
  locale: "en" | "ar" | "tr";
}

export default function OAuthInstallPanel({ locale }: Props) {
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [providers, setProviders] = useState<OAuthProviderStatus | null>(null);
  const [connections, setConnections] = useState<OAuthConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<
    | { kind: "success"; store: string; provider: string }
    | { kind: "error"; message: string }
    | null
  >(null);
  const [installing, setInstalling] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [shopDomain, setShopDomain] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        getOAuthProviderStatus(),
        listOAuthConnections(),
      ]);
      setProviders(p);
      setConnections(c);
    } catch {
      /* leave state as-is on failure; outer page handles global errors */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Read ?connected= / ?error= params for success/error banner
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const connected = url.searchParams.get("connected");
    const errorParam = url.searchParams.get("error");
    const messageParam = url.searchParams.get("message");
    const storeParam = url.searchParams.get("store");

    if (connected) {
      setBanner({
        kind: "success",
        provider: connected,
        store: storeParam ?? "",
      });
      url.searchParams.delete("connected");
      url.searchParams.delete("store");
      window.history.replaceState({}, "", url.toString());
      const timer = setTimeout(() => setBanner(null), 5000);
      return () => clearTimeout(timer);
    }
    if (errorParam) {
      setBanner({
        kind: "error",
        message: messageParam ?? errorParam,
      });
      url.searchParams.delete("error");
      url.searchParams.delete("message");
      window.history.replaceState({}, "", url.toString());
    }
    return undefined;
  }, []);

  const handleSallaInstall = async () => {
    setInstalling("salla");
    try {
      const { url } = await initSallaInstall("/settings/integrations");
      // Full navigation — browser carries the session via the backend's
      // already-validated state row, not via the client cookie.
      window.location.href = url;
    } catch (e: any) {
      setBanner({
        kind: "error",
        message: e?.response?.data?.error?.message || e?.message || "Failed",
      });
      setInstalling(null);
    }
  };

  const handleShopifyInstall = async () => {
    if (!shopDomain.trim()) return;
    setInstalling("shopify");
    try {
      const { url } = await initShopifyInstall(
        shopDomain.trim(),
        "/settings/integrations"
      );
      window.location.href = url;
    } catch (e: any) {
      setBanner({
        kind: "error",
        message: e?.response?.data?.error?.message || e?.message || "Failed",
      });
      setInstalling(null);
    }
  };

  const handleDisconnect = async (conn: OAuthConnection) => {
    if (
      !confirm(
        tr(
          `Disconnect ${conn.shopDomain}? Sync will stop and the token will be revoked.`,
          `فصل ${conn.shopDomain}؟ ستتوقف المزامنة وسيتم إلغاء الـ token.`,
          `${conn.shopDomain} bağlantısı kesilsin mi? Senkronizasyon duracak ve token iptal edilecek.`
        )
      )
    )
      return;
    setDisconnecting(conn.id);
    try {
      await disconnectOAuthConnection(conn.id);
      await loadAll();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message);
    } finally {
      setDisconnecting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-cyan-600" />
      </div>
    );
  }

  const oauthConnections = connections.filter(
    (c) => c.platform === "salla" || c.platform === "shopify"
  );

  return (
    <div
      className="space-y-4 mb-8"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Banner */}
      {banner && banner.kind === "success" && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3 relative">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-emerald-900">
              {tr(
                `Successfully connected${banner.store ? `: ${banner.store}` : ""}!`,
                `تم الربط بنجاح${banner.store ? `: ${banner.store}` : ""}!`,
                `Başarıyla bağlandı${banner.store ? `: ${banner.store}` : ""}!`
              )}
            </div>
            <p className="text-xs text-emerald-800 mt-0.5">
              {tr(
                "Your store is now syncing customers and orders into Zyrix.",
                "متجرك يُزامن العملاء والطلبات إلى Zyrix الآن.",
                "Mağazanız artık müşterileri ve siparişleri Zyrix'e senkronize ediyor."
              )}
            </p>
          </div>
          <button
            onClick={() => setBanner(null)}
            className="w-7 h-7 rounded text-emerald-600 hover:bg-emerald-100 flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {banner && banner.kind === "error" && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3 relative">
          <AlertTriangle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-rose-900">
              {tr("Install failed", "فشل الربط", "Kurulum başarısız")}
            </div>
            <p className="text-xs text-rose-800 mt-0.5 break-words">
              {banner.message}
            </p>
          </div>
          <button
            onClick={() => setBanner(null)}
            className="w-7 h-7 rounded text-rose-600 hover:bg-rose-100 flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Install cards — only show if at least one provider is configured */}
      {(providers?.salla || providers?.shopify) && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600 text-white flex items-center justify-center">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-cyan-900">
                {tr(
                  "Connect your online store",
                  "اربط متجرك الإلكتروني",
                  "Online mağazanızı bağlayın"
                )}
              </h2>
              <p className="text-xs text-slate-600">
                {tr(
                  "One-click install — we'll sync your customers and orders automatically.",
                  "تثبيت بنقرة واحدة — نُزامن العملاء والطلبات تلقائياً.",
                  "Tek tıkla kurulum — müşterileri ve siparişleri otomatik senkronize ederiz."
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {providers?.salla && (
              <div className="rounded-xl border border-sky-100 bg-white p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow">
                    <StoreIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-cyan-900">
                      Salla
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {tr(
                        "Saudi Arabia's #1 e-commerce platform",
                        "منصة التجارة الإلكترونية #1 في السعودية",
                        "Suudi Arabistan'ın 1 numaralı e-ticaret platformu"
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSallaInstall}
                  disabled={installing === "salla"}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold"
                >
                  {installing === "salla" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  {tr(
                    "Install on Salla",
                    "ثبّت على سلة",
                    "Salla'ya yükle"
                  )}
                </button>
                <p className="text-[10px] text-slate-500 mt-2 text-center">
                  {tr(
                    "Redirects you to Salla to authorize Zyrix.",
                    "سيتم تحويلك إلى سلة للموافقة على Zyrix.",
                    "Zyrix'i yetkilendirmek için Salla'ya yönlendirilirsiniz."
                  )}
                </p>
              </div>
            )}

            {providers?.shopify && (
              <div className="rounded-xl border border-sky-100 bg-white p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center flex-shrink-0 shadow">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-cyan-900">
                      Shopify
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {tr(
                        "Global e-commerce platform",
                        "منصة التجارة الإلكترونية العالمية",
                        "Küresel e-ticaret platformu"
                      )}
                    </p>
                  </div>
                </div>
                <label className="block">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
                    {tr(
                      "Your shop handle",
                      "مُعرّف متجرك",
                      "Mağaza adınız"
                    )}
                  </span>
                  <div className="flex items-center mt-1 rounded-lg border border-sky-200 overflow-hidden focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-200">
                    <input
                      value={shopDomain}
                      onChange={(e) => setShopDomain(e.target.value)}
                      placeholder="my-store"
                      className="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent"
                      dir="ltr"
                    />
                    <span className="px-2 text-xs text-slate-500 bg-slate-50 border-l border-sky-100 py-2" dir="ltr">
                      .myshopify.com
                    </span>
                  </div>
                </label>
                <button
                  onClick={handleShopifyInstall}
                  disabled={installing === "shopify" || !shopDomain.trim()}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold"
                >
                  {installing === "shopify" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  {tr(
                    "Install on Shopify",
                    "ثبّت على Shopify",
                    "Shopify'a yükle"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Connected stores list */}
      {oauthConnections.length > 0 && (
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm font-bold text-cyan-900">
              {tr(
                "Connected stores",
                "المتاجر المتصلة",
                "Bağlı mağazalar"
              )}
              <span className="text-xs font-normal text-slate-500 ms-1">
                ({oauthConnections.length})
              </span>
            </h3>
            <button
              onClick={loadAll}
              className="w-7 h-7 rounded text-slate-400 hover:text-cyan-700 hover:bg-sky-50 flex items-center justify-center"
              title={tr("Refresh", "تحديث", "Yenile")}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="rounded-xl border border-sky-100 bg-white overflow-hidden divide-y divide-sky-50">
            {oauthConnections.map((conn) => (
              <ConnectionRow
                key={conn.id}
                conn={conn}
                locale={locale}
                tr={tr}
                disconnecting={disconnecting === conn.id}
                onDisconnect={() => handleDisconnect(conn)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ConnectionRow({
  conn,
  locale,
  tr,
  disconnecting,
  onDisconnect,
}: {
  conn: OAuthConnection;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  disconnecting: boolean;
  onDisconnect: () => void;
}) {
  const platformLabel = conn.platform.charAt(0).toUpperCase() + conn.platform.slice(1);
  const Icon = conn.platform === "shopify" ? ShoppingBag : StoreIcon;
  const tone =
    conn.platform === "shopify"
      ? "from-emerald-500 to-green-600"
      : "from-sky-400 to-blue-600";
  const storeName =
    (conn.metadata?.storeName as string) || conn.shopDomain;

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-sky-50/40">
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tone} text-white flex items-center justify-center flex-shrink-0`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-cyan-900 truncate">
            {storeName}
          </span>
          <span className="text-[10px] font-bold uppercase rounded px-1.5 py-0.5 border bg-sky-50 text-sky-700 border-sky-200">
            {platformLabel}
          </span>
          {!conn.isActive && (
            <span className="text-[10px] font-bold uppercase rounded px-1.5 py-0.5 border bg-slate-100 text-slate-600 border-slate-200">
              {tr("Inactive", "غير نشط", "Etkin değil")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 flex-wrap">
          <code className="font-mono" dir="ltr">
            {conn.shopDomain}
          </code>
          <span className="text-slate-300">·</span>
          <span>
            {conn.totalCustomersImported.toLocaleString()}{" "}
            {tr("customers", "عميل", "müşteri")}
          </span>
          <span className="text-slate-300">·</span>
          <span>
            {conn.totalOrdersImported.toLocaleString()}{" "}
            {tr("orders", "طلب", "sipariş")}
          </span>
          {conn.lastSyncAt && (
            <>
              <span className="text-slate-300">·</span>
              <span>
                {tr("Last sync", "آخر مزامنة", "Son senkronizasyon")}{" "}
                <time dir="ltr" className="tabular-nums">
                  {new Date(conn.lastSyncAt).toLocaleDateString(
                    locale === "ar"
                      ? "ar-SA"
                      : locale === "tr"
                        ? "tr-TR"
                        : "en-US",
                    { month: "short", day: "numeric" }
                  )}
                </time>
              </span>
            </>
          )}
        </div>
        {conn.syncError && (
          <div className="mt-1 text-[11px] text-rose-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span className="truncate">{conn.syncError}</span>
          </div>
        )}
      </div>
      <button
        onClick={onDisconnect}
        disabled={disconnecting}
        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-md text-[11px] font-semibold disabled:opacity-50 flex-shrink-0"
      >
        {disconnecting ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Trash2 className="w-3 h-3" />
        )}
        {tr("Disconnect", "فصل", "Bağlantıyı kes")}
      </button>
    </div>
  );
}
