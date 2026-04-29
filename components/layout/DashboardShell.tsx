"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useDraggableSplit } from "@/hooks/useDraggableSplit";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";
import { IdleWarningModal } from "@/components/auth/IdleWarningModal";
import { recordSessionEvent } from "@/lib/api/session-events";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageCircle,
  MessageSquare,
  Activity,
  CheckSquare,
  FileText,
  FileSignature,
  Receipt,
  Award,
  Percent,
  TrendingUp,
  Bell,
  Sparkles,
  DollarSign,
  Mail,
  BarChart3,
  Settings,
  LogOut,
  CreditCard,
  Shield,
  History,
  Zap,
  Key,
  Palette,
  Store,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { fetchUnreadCount } from "@/lib/api/chat";
import { LanguageSwitcher } from "./LanguageSwitcher";
import ImpersonationBanner from "./ImpersonationBanner";
import { NotificationBell } from "@/components/collab/NotificationBell";
import { BrandSwitcher } from "@/components/layout/BrandSwitcher";
import type { Locale } from "@/i18n";
import { getInitials, cn } from "@/lib/utils";
import GlobalSearchBar from "@/components/advanced/GlobalSearchBar";
import { useAIStore } from "@/lib/stores/aiStore";
import { AISidePanel } from "@/components/ai/AISidePanel";

import { getAccentClasses } from "./page-accents";

interface DashboardShellProps {
  locale: string;
  children: ReactNode;
}

export function DashboardShell({ locale, children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, company, isLoading, isAuthenticated, logout } = useAuth();

  // Resizable split between the main nav (top) and Settings (bottom)
  // inside the sidebar. splitContainerRef measures the flex height
  // so the hook can translate mouse deltas into percentage deltas.
  const splitContainerRef = useRef<HTMLDivElement | null>(null);
  const { topFlexPercent, startDrag, isDragging, resetToDefault } =
    useDraggableSplit(splitContainerRef);

  // Auto-lock after configured minutes of inactivity. Records a
  // session_events row with eventType='auto_logout_idle' BEFORE
  // clearing tokens so managers' KPI reports show an accurate
  // breakdown of auto vs manual logouts per employee.
  const { warningOpen, secondsLeft, dismissWarning, forceLogout } =
    useIdleTimeout({
      enabled:
        isAuthenticated &&
        !!company &&
        (company?.idleTimeoutMinutes ?? 0) > 0,
      idleMinutes: company?.idleTimeoutMinutes ?? 10,
      onAutoLogout: async () => {
        try {
          await recordSessionEvent("auto_logout_idle");
        } catch {
          /* telemetry must not block logout */
        }
        await logout();
      },
    });

  const handleManualLogoutFromWarning = async () => {
    try {
      await recordSessionEvent("manual_logout", { source: "idle_warning" });
    } catch {
      /* never block */
    }
    await logout();
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/${locale}/signin`);
    }
  }, [isLoading, isAuthenticated, locale, router]);

  const [chatUnread, setChatUnread] = useState<number>(0);
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const load = async () => {
      try {
        const c = await fetchUnreadCount();
        if (!cancelled) setChatUnread(c);
      } catch {
        /* ignore */
      }
    };
    load();
    const id = setInterval(load, 20000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [isAuthenticated]);

  if (isLoading || !user || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Each nav item may specify a `featureKey` that corresponds to a
  // key in the FEATURE_CATALOG on the backend. When the platform
  // owner disables a feature for a merchant from the admin panel,
  // company.enabledFeatures[featureKey] becomes false, and we hide
  // that nav item. Missing keys default to visible.
  const enabledFeatures: Record<string, boolean> =
    company.enabledFeatures ?? {};
  const navItems = [
    {
      href: `/${locale}/dashboard`,
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    { href: `/${locale}/customers`, icon: Users, label: "Customers" },
    { href: `/${locale}/deals`, icon: Briefcase, label: "Deals" },
    { href: `/${locale}/pipeline`, icon: Activity, label: "Pipeline" },
    { href: `/${locale}/quotes`, icon: FileText, label: "Quotes", featureKey: "quotes" },
    { href: `/${locale}/contracts`, icon: FileSignature, label: "Contracts", featureKey: "contracts" },
    { href: `/${locale}/loyalty`, icon: Award, label: "Loyalty", featureKey: "loyalty" },
    { href: `/${locale}/tax`, icon: Percent, label: "Tax" },
    { href: `/${locale}/commission`, icon: DollarSign, label: "Commission", featureKey: "commission" },
    { href: `/${locale}/cashflow`, icon: TrendingUp, label: "Cash Flow" },
    { href: `/${locale}/reports`, icon: BarChart3, label: "Reports" },
    { href: `/${locale}/session-kpis`, icon: Activity, label: "Session KPIs", managersOnly: true },
    { href: `/${locale}/tax-invoices`, icon: Receipt, label: "Tax Invoices", featureKey: "tax_invoices" },
    { href: `/${locale}/analytics`, icon: BarChart3, label: "Analytics", featureKey: "analytics_reports" },
    { href: `/${locale}/followup`, icon: Bell, label: "Follow-up" },
    { href: `/${locale}/campaigns`, icon: Mail, label: "Campaigns", featureKey: "marketing_automation" },
    {
      href: `/${locale}/ai-cfo`,
      icon: Sparkles,
      label: "AI CFO",
      badge: "AI",
      featureKey: "ai_cfo",
    },
    { href: `/${locale}/tasks`, icon: CheckSquare, label: "Tasks" },
    { href: `/${locale}/templates`, icon: Sparkles, label: "Templates" },
    { href: `/${locale}/workflows`, icon: Zap, label: "Automations" },
    { href: `/${locale}/ai`, icon: Sparkles, label: "AI Agents", badge: "AI" },
    { href: `/${locale}/chat`, icon: MessageSquare, label: "Team Chat", unreadCount: chatUnread },
    {
      href: `/${locale}/whatsapp`,
      icon: MessageCircle,
      label: "WhatsApp",
      badge: "Beta",
    },
  ].filter((item) => {
    // Manager-only items (like Session KPIs) are hidden from regular
    // members — they can still access their own row via the direct
    // URL, the backend's role-scope filter ensures they only see
    // their own data, but the sidebar link is managerial-only.
    const managersOnly = (item as { managersOnly?: boolean }).managersOnly;
    if (managersOnly) {
      const role = user.role;
      if (role !== "owner" && role !== "admin" && role !== "manager") {
        return false;
      }
    }
    const key = (item as { featureKey?: string }).featureKey;
    if (!key) return true;
    return enabledFeatures[key] !== false;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ImpersonationBanner locale={locale} />
      <div className="flex-1 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col fixed h-screen">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            {/* Avatar — uses the uploaded user image when available,
                falls back to the Zyrix logo. This was previously a
                hardcoded Zyrix logo for every merchant, which users
                wanted to replace with their own branding. */}
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.fullName || "Profile"}
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <Image
                src="/logo.png"
                alt="Zyrix"
                width={32}
                height={32}
                className="rounded-lg"
              />
            )}
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-foreground leading-tight truncate">
                {company.name}
              </h1>
              <p className="text-[10px] text-muted-foreground capitalize">
                {company.plan}
              </p>
            </div>
          </Link>
          <NotificationBell />
        </div>

        {/* Brand switcher — self-hides if merchant has no brands configured */}
        <div className="px-3 pt-3">
          <BrandSwitcher />
        </div>

        {/* Resizable split region — top scrolls main nav, bottom
            scrolls Settings submenu, draggable divider in between
            lets the user expand whichever section they need more
            of. Position persisted to localStorage. */}
        <div
          ref={splitContainerRef}
          className="flex-1 min-h-0 flex flex-col"
        >
          {/* Main nav — top panel */}
          <nav
            className="min-h-0 overflow-y-auto p-3 space-y-1"
            style={{ flexBasis: `${topFlexPercent}%`, flexGrow: 0, flexShrink: 0 }}
          >
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            const Icon = item.icon;
            // Slug = last URL segment (after /<locale>/)
            const slug = item.href.split("/").filter(Boolean).slice(-1)[0] ?? "";
            const accent = getAccentClasses(slug);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? `${accent.bg} ${accent.text} border-l-2 ${accent.border} font-medium`
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? accent.icon : "")} />
                <span className="flex-1">{item.label}</span>
                {(item as any).unreadCount && (item as any).unreadCount > 0 ? (
                  <span className="px-1.5 min-w-[18px] h-[18px] text-[10px] font-bold bg-rose-500 text-white rounded-full flex items-center justify-center">
                    {(item as any).unreadCount > 99 ? "99+" : (item as any).unreadCount}
                  </span>
                ) : item.badge ? (
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase bg-violet-500/15 text-violet-300 border border-violet-500/30 rounded">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Draggable splitter — drag up/down to resize the two panels.
            Double-click resets to default (55/45). isDragging toggles
            the highlight state so the user sees the active region. */}
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize sidebar sections"
          aria-valuenow={Math.round(topFlexPercent)}
          aria-valuemin={15}
          aria-valuemax={85}
          tabIndex={0}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          onDoubleClick={resetToDefault}
          onKeyDown={(e) => {
            // Arrow keys nudge the split 2% at a time for keyboard users
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
            }
          }}
          className={`group relative h-1.5 cursor-ns-resize flex items-center justify-center flex-shrink-0 border-y transition-colors ${
            isDragging
              ? "bg-cyan-500/20 border-cyan-500/50"
              : "bg-muted border-transparent hover:bg-cyan-500/10 hover:border-cyan-500/30"
          }`}
          title="Drag to resize — double-click to reset"
        >
          {/* Visual grip dots — appear on hover / while dragging */}
          <div
            className={`flex items-center gap-0.5 transition-opacity ${
              isDragging ? "opacity-100" : "opacity-40 group-hover:opacity-80"
            }`}
          >
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          </div>
        </div>

        {/* Settings — bottom panel, scrolls independently */}
        <div
          className="min-h-0 overflow-y-auto p-3 space-y-0.5"
          style={{ flexBasis: `${100 - topFlexPercent}%`, flexGrow: 0, flexShrink: 0 }}
        >
          <LanguageSwitcher currentLocale={locale as Locale} />
          <Link
            href={`/${locale}/settings`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <Link
            href={`/${locale}/settings/templates`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Email templates
          </Link>
          <Link
            href={`/${locale}/settings/custom-fields`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            Custom fields
          </Link>
          <Link
            href={`/${locale}/settings/integrations`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            E-commerce
          </Link>
          <Link
            href={`/${locale}/settings/billing`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Billing
          </Link>
          <Link
            href={`/${locale}/settings/security`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            Security
          </Link>
          <Link
            href={`/${locale}/settings/users`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            Team
          </Link>
          <Link
            href={`/${locale}/settings/roles`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Roles
          </Link>
          <Link
            href={`/${locale}/settings/audit`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            Audit log
          </Link>
          <Link
            href={`/${locale}/settings/api`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Key className="w-3.5 h-3.5" />
            API keys
          </Link>
          <Link
            href={`/${locale}/settings/brand`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Palette className="w-3.5 h-3.5" />
            Branding
          </Link>
          <Link
            href={`/${locale}/settings/brands`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            Brands
          </Link>
        </div>
        </div>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-violet-500 text-primary-foreground flex items-center justify-center font-semibold text-sm">
              {getInitials(user.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <button
              onClick={async () => {
                try {
                  await recordSessionEvent("manual_logout", {
                    source: "sidebar_button",
                  });
                } catch {
                  /* never block logout on telemetry */
                }
                await logout();
              }}
              className="p-1.5 text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10 rounded"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <div className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-4 py-2.5 flex items-center gap-3">
          <GlobalSearchBar />
          <button
            onClick={() => useAIStore.getState().toggle()}
            className="relative flex items-center gap-2 rounded-lg bg-violet-500/15 text-violet-300 border border-violet-500/30 hover:bg-violet-500/25 px-3 py-1.5 text-xs font-bold transition-colors"
            aria-label="Ask AI"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>
        <div className="flex-1">{children}</div>
      </main>
      </div>

      {/* Idle-timeout warning — rendered at root level so it overlays
          every dashboard page. Not a portal since it's already inside
          the shell's root flex container. */}
      <IdleWarningModal
        open={warningOpen}
        secondsLeft={secondsLeft}
        locale={locale as "en" | "ar" | "tr"}
        onContinue={dismissWarning}
        onLogoutNow={handleManualLogoutFromWarning}
      />

      {/* AI side panel — available on every authenticated page */}
      <AISidePanel />
    </div>
  );
}