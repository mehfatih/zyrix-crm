"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Store,
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
  Search,
  Globe,
  MapPin,
  Info,
  Sparkles,
  Zap,
  FileText,
} from "lucide-react";
import {
  listPlatformCatalog,
  listEcommerceStores,
  connectEcommerceStore,
  disconnectEcommerceStore,
  syncEcommerceStore,
  type PlatformDefinition,
  type EcommerceStore,
  type PlatformRegion,
  type ConnectEcommerceDto,
} from "@/lib/api/advanced";
import { DashboardShell } from "@/components/layout/DashboardShell";
import WebhooksPanel from "@/components/settings/WebhooksPanel";
import OAuthInstallPanel from "@/components/settings/OAuthInstallPanel";

type RegionFilter = "all" | PlatformRegion;

const REGION_LABELS: Record<RegionFilter, { en: string; ar: string; tr: string; icon: typeof Globe }> = {
  all: { en: "All platforms", ar: "كل المنصات", tr: "Tüm platformlar", icon: Sparkles },
  mena: { en: "Arab region", ar: "المنطقة العربية", tr: "Arap bölgesi", icon: Globe },
  turkey: { en: "Türkiye", ar: "Türkiye", tr: "Türkiye", icon: Globe },
  global: { en: "Global", ar: "عالمي", tr: "Küresel", icon: Globe },
};

export default function EcommerceIntegrationsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Ecommerce");

  const [catalog, setCatalog] = useState<PlatformDefinition[]>([]);
  const [stores, setStores] = useState<EcommerceStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectingPlatform, setConnectingPlatform] = useState<PlatformDefinition | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const [cat, st] = await Promise.all([
        listPlatformCatalog(),
        listEcommerceStores(),
      ]);
      setCatalog(cat);
      setStores(st);
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
      const result = await syncEcommerceStore(id);
      alert(`${result.imported} customers imported successfully`);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message || "Sync failed");
    } finally {
      setSyncingId(null);
    }
  };

  const handleDisconnect = async (id: string, name: string) => {
    if (!confirm(`Disconnect ${name}? Imported customers will remain.`)) return;
    try {
      await disconnectEcommerceStore(id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Disconnect failed");
    }
  };

  const filtered = catalog.filter((p) => {
    if (regionFilter !== "all" && p.region !== regionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.description.en.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const connectedPlatforms = new Set(stores.map((s) => s.platform));

  const counts = {
    all: catalog.length,
    mena: catalog.filter((p) => p.region === "mena").length,
    turkey: catalog.filter((p) => p.region === "turkey").length,
    global: catalog.filter((p) => p.region === "global").length,
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow-lg">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">SETTINGS</p>
              <h1 className="text-2xl font-bold text-foreground">
                {t("title")}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t("subtitle", { count: catalog.length })}
              </p>
            </div>
          </div>
        </div>

        {stores.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              {t("connectedStores")} ({stores.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stores.map((store) => (
                <ConnectedStoreCard
                  key={store.id}
                  store={store}
                  syncing={syncingId === store.id}
                  onSync={() => handleSync(store.id)}
                  onDisconnect={() => handleDisconnect(store.id, store.shopDomain)}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
          </section>
        )}

        {/* OAuth install panel — Salla/Shopify one-click install flow.
            Self-hides sections if provider env vars aren't set or there
            are no oauth-installed stores yet. */}
        <OAuthInstallPanel locale={locale as "en" | "ar" | "tr"} />

        {/* Webhooks panel — self-hides when backend has no active subscriptions */}
        <WebhooksPanel locale={locale} />

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Plug className="w-4 h-4 text-cyan-300" />
              {t("availablePlatforms")}
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlatforms")}
                className="ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-2 text-sm border border-border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "mena", "turkey", "global"] as RegionFilter[]).map((r) => {
              const label = REGION_LABELS[r];
              const Icon = label.icon;
              const active = regionFilter === r;
              return (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    active ? "bg-sky-500 text-white shadow-sm" : "bg-card border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label[locale as "en" | "ar" | "tr"] || label.en}
                  <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${active ? "bg-card/20" : "bg-muted"}`}>
                    {counts[r]}
                  </span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <Search className="w-10 h-10 text-sky-300 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-foreground mb-1">{t("noResults")}</h3>
              <p className="text-sm text-muted-foreground">{t("noResultsHint")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  isConnected={connectedPlatforms.has(platform.id)}
                  onConnect={() => setConnectingPlatform(platform)}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
          )}
        </section>

        <div className="bg-gradient-to-br from-sky-50 to-sky-50 border border-border rounded-xl p-5">
          <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {t("howItWorks.title")}
          </h3>
          <ol className="space-y-1.5 text-sm text-foreground">
            <li className="flex items-start gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">1</span><span>{t("howItWorks.step1")}</span></li>
            <li className="flex items-start gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">2</span><span>{t("howItWorks.step2")}</span></li>
            <li className="flex items-start gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">3</span><span>{t("howItWorks.step3")}</span></li>
            <li className="flex items-start gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">4</span><span>{t("howItWorks.step4")}</span></li>
          </ol>
        </div>
      </div>

      {connectingPlatform && (
        <ConnectDialog
          platform={connectingPlatform}
          onClose={() => setConnectingPlatform(null)}
          onConnected={async () => {
            setConnectingPlatform(null);
            await load();
          }}
          locale={locale}
          t={t}
        />
      )}
    </DashboardShell>
  );
}

function PlatformCard({ platform, isConnected, onConnect, locale, t }: any) {
  const description = platform.description[locale as "en" | "ar" | "tr"] || platform.description.en;
  const canConnect = platform.status === "native" || platform.status === "api";
  const statusColors: Record<string, string> = {
    native: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    api: "bg-sky-100 text-cyan-300",
    csv_only: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    planned: "bg-muted text-muted-foreground",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start gap-3 mb-2">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center font-bold text-white text-lg flex-shrink-0 shadow-sm"
          style={{ backgroundColor: platform.brandColor }}
        >
          {platform.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foreground truncate flex items-center gap-1">
            {platform.name}
            {platform.popularity >= 85 && <Zap className="w-3 h-3 text-amber-500 flex-shrink-0" />}
          </h3>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
            <MapPin className="w-2.5 h-2.5" />
            {platform.country}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-3 flex-1">{description}</p>

      <div className="flex items-center gap-1 mb-3 flex-wrap">
        {platform.supports.customers && (
          <span className="inline-flex items-center gap-0.5 text-[10px] text-cyan-300 bg-muted px-1.5 py-0.5 rounded">
            <Users className="w-2.5 h-2.5" />
            {t("cap.customers")}
          </span>
        )}
        {platform.supports.orders && (
          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            <ShoppingCart className="w-2.5 h-2.5" />
            {t("cap.orders")}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded ${statusColors[platform.status]}`}>
          {platform.status === "native" && <Zap className="w-2.5 h-2.5" />}
          {platform.status === "csv_only" && <FileText className="w-2.5 h-2.5" />}
          {platform.status === "planned" && <Clock className="w-2.5 h-2.5" />}
          {t(`status.${platform.status}`)}
        </span>
        <a href={platform.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan-300" title={t("visitWebsite")}>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {isConnected ? (
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t("connected")}
        </div>
      ) : canConnect ? (
        <button onClick={onConnect} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-3.5 h-3.5" />
          {t("connect")}
        </button>
      ) : platform.status === "csv_only" ? (
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 border border-amber-500/30">
          <FileText className="w-3.5 h-3.5" />
          {t("useCSVImport")}
        </div>
      ) : (
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground border border-border">
          <Clock className="w-3.5 h-3.5" />
          {t("comingSoon")}
        </div>
      )}
    </div>
  );
}

function ConnectedStoreCard({ store, syncing, onSync, onDisconnect, locale, t }: any) {
  const statusMeta: Record<string, { bg: string; text: string; Icon: any }> = {
    idle: { bg: "bg-muted", text: "text-muted-foreground", Icon: Clock },
    syncing: { bg: "bg-muted", text: "text-cyan-300", Icon: RefreshCw },
    success: { bg: "bg-emerald-500/10", text: "text-emerald-300", Icon: CheckCircle2 },
    error: { bg: "bg-rose-500/10", text: "text-rose-300", Icon: AlertTriangle },
  };
  const s = statusMeta[store.syncStatus] || statusMeta.idle;
  const SIcon = s.Icon;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className="w-10 h-10 rounded-lg text-white flex items-center justify-center flex-shrink-0 font-bold shadow-sm"
            style={{ backgroundColor: store.platformInfo?.brandColor || "#0EA5E9" }}
          >
            {(store.platformInfo?.name || store.platform).charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
              {store.platformInfo?.name || store.platform}
            </div>
            <h3 className="text-sm font-bold text-foreground truncate flex items-center gap-1 mt-0.5">
              {store.shopDomain}
              <a href={`https://${store.shopDomain}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan-300 flex-shrink-0">
                <ExternalLink className="w-3 h-3" />
              </a>
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded ${s.bg} ${s.text}`}>
                <SIcon className={`w-2.5 h-2.5 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? t("status.syncing") : t(`status.${store.syncStatus}`)}
              </span>
              {store.lastSyncAt && (
                <span className="text-[10px] text-muted-foreground">{formatDate(store.lastSyncAt, locale)}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onSync} disabled={syncing} className="flex items-center gap-1 px-2.5 py-1.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg">
            {syncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            {t("sync")}
          </button>
          <button onClick={onDisconnect} className="p-1.5 text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10 rounded" title={t("disconnect")}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {store.syncError && (
        <div className="mt-2 p-2 bg-rose-500/10 border border-red-100 text-rose-300 text-[10px] rounded flex items-start gap-1.5">
          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
          {store.syncError}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-sky-50">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-cyan-300" />
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">{t("stats.customers")}</div>
            <div className="text-sm font-bold text-foreground">{store.totalCustomersImported}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <ShoppingCart className="w-3.5 h-3.5 text-emerald-300" />
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">{t("stats.orders")}</div>
            <div className="text-sm font-bold text-foreground">{store.totalOrdersImported}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectDialog({ platform, onClose, onConnected, locale, t }: any) {
  const [form, setForm] = useState<ConnectEcommerceDto>({
    platform: platform.id,
    shopDomain: "",
    accessToken: "",
    apiKey: "",
    apiSecret: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiresSecret = platform.authScheme === "api_key_secret";
  const tokenLabel = platform.authScheme === "access_token"
    ? t("fields.accessToken")
    : platform.authScheme === "api_key_secret"
      ? t("fields.consumerKey")
      : t("fields.apiKey");
  const tokenHint = platform.authScheme === "access_token"
    ? t("fields.accessTokenHint")
    : platform.authScheme === "api_key_secret"
      ? t("fields.consumerKeyHint")
      : t("fields.apiKeyHint");

  const description = platform.description[locale as "en" | "ar" | "tr"] || platform.description.en;

  const save = async () => {
    if (!form.shopDomain.trim() || !form.accessToken.trim()) {
      setError(t("errors.required"));
      return;
    }
    if (requiresSecret && !form.apiSecret?.trim()) {
      setError(t("errors.secretRequired"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const dto: ConnectEcommerceDto = {
        platform: platform.id,
        shopDomain: form.shopDomain.trim(),
        accessToken: form.accessToken.trim(),
      };
      if (requiresSecret) {
        dto.apiKey = form.accessToken.trim();
        dto.apiSecret = form.apiSecret?.trim();
      }
      await connectEcommerceStore(dto);
      onConnected();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Connect failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-xl max-w-md w-full my-8" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 rounded-t-xl text-white relative" style={{ backgroundColor: platform.brandColor }}>
          <button onClick={onClose} className="absolute top-3 ltr:right-3 rtl:left-3 p-1 text-white/80 hover:text-white hover:bg-card/20 rounded">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-card/20 flex items-center justify-center font-bold text-xl">
              {platform.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold">{t("connectTitle", { name: platform.name })}</h2>
              <div className="text-xs opacity-90 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {platform.country}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">{t("fields.domain")} *</label>
            <input
              type="text"
              value={form.shopDomain}
              onChange={(e) => setForm({ ...form, shopDomain: e.target.value })}
              placeholder={getDomainPlaceholder(platform.id)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-[10px] text-muted-foreground mt-1">{t("fields.domainHint")}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">{tokenLabel} *</label>
            <input
              type="password"
              value={form.accessToken}
              onChange={(e) => setForm({ ...form, accessToken: e.target.value })}
              placeholder={getTokenPlaceholder(platform.id)}
              className="w-full px-3 py-2 text-sm font-mono border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-[10px] text-muted-foreground mt-1">{tokenHint}</p>
          </div>

          {requiresSecret && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">{t("fields.consumerSecret")} *</label>
              <input
                type="password"
                value={form.apiSecret || ""}
                onChange={(e) => setForm({ ...form, apiSecret: e.target.value })}
                placeholder="cs_..."
                className="w-full px-3 py-2 text-sm font-mono border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {platform.authHelpUrl && (
            <a href={platform.authHelpUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:underline">
              <ExternalLink className="w-3 h-3" />
              {t("howToGetCredentials")}
            </a>
          )}

          {error && (
            <div className="p-3 bg-rose-500/10 border border-red-100 text-rose-300 text-sm rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border hover:bg-muted text-foreground text-sm font-medium rounded-lg">
            {t("cancel")}
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-semibold rounded-lg disabled:opacity-50" style={{ backgroundColor: platform.brandColor }}>
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("connectButton")}
          </button>
        </div>
      </div>
    </div>
  );
}

function getDomainPlaceholder(platformId: string): string {
  switch (platformId) {
    case "shopify": return "your-shop.myshopify.com";
    case "salla": return "salla.sa/mystore";
    case "zid": return "mystore.zid.store";
    case "youcan": return "mystore.youcan.shop";
    case "woocommerce": return "mystore.com";
    case "easyorders": return "app.easy-orders.net";
    case "expandcart": return "mystore.expandcart.com";
    case "ticimax": return "mystore.ticimax.com.tr";
    case "ideasoft": return "mystore.ideasoft.com.tr";
    case "tsoft": return "mystore.tsoft.com.tr";
    case "ikas": return "mystore.myikas.com";
    case "turhost": return "mystore.turhost.com";
    default: return "example.com";
  }
}

function getTokenPlaceholder(platformId: string): string {
  switch (platformId) {
    case "shopify": return "shpat_...";
    case "salla":
    case "zid":
    case "youcan":
    case "ideasoft":
    case "turhost": return "eyJhbGciOi... (JWT token)";
    case "woocommerce": return "ck_...";
    default: return "API key";
  }
}

function formatDate(iso: string, locale: string): string {
  const loc = locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Date(iso).toLocaleString(loc, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}
