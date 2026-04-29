"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useDraggableSplit } from "@/hooks/useDraggableSplit";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";
import { recordSessionEvent } from "@/lib/api/session-events";
import {
  Activity,
  CreditCard,
  History,
  Key,
  LogOut,
  Mail,
  Palette,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { SIDEBAR_GROUPS } from "@/lib/nav/sidebar-catalog";
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


interface DashboardShellProps {
  locale: string;
  children: ReactNode;
}

const SIDEBAR_SCROLL_KEY = "zyrix.sidebar.scrollTop";

export function DashboardShell({ locale, children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const { user, company, isLoading, isAuthenticated, logout } = useAuth();

  // Sprint 14ab — preserve sidebar scroll across navigations.
  // sessionStorage so the position dies with the tab; rAF throttling
  // so we don't slam storage on every wheel tick.
  const sidebarNavRef = useRef<HTMLElement | null>(null);

  // Restore on every pathname change (including first mount).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
    const el = sidebarNavRef.current;
    if (saved && el) {
      const value = parseInt(saved, 10);
      if (!Number.isNaN(value)) el.scrollTop = value;
    }
  }, [pathname]);

  // Persist on scroll, throttled via requestAnimationFrame.
  useEffect(() => {
    const el = sidebarNavRef.current;
    if (!el) return;
    let frame: number | null = null;
    const handler = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(el.scrollTop));
        } catch {
          /* sessionStorage unavailable / quota — ignore */
        }
        frame = null;
      });
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => {
      el.removeEventListener("scroll", handler);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  // Resizable split between the main nav (top) and Settings (bottom)
  // inside the sidebar. splitContainerRef measures the flex height
  // so the hook can translate mouse deltas into percentage deltas.
  const splitContainerRef = useRef<HTMLDivElement | null>(null);
  const { topFlexPercent, startDrag, isDragging, resetToDefault } =
    useDraggableSplit(splitContainerRef);

  // Silent auto-logout after configured minutes of inactivity (default 15).
  // Records a session_events row with eventType='auto_logout_idle' BEFORE
  // clearing tokens so managers' KPI reports show an accurate breakdown
  // of auto vs manual logouts per employee. No warning UI — the user is
  // routed straight to /signin once the timer fires.
  useIdleTimeout({
    enabled:
      isAuthenticated &&
      !!company &&
      (company?.idleTimeoutMinutes ?? 0) > 0,
    idleMinutes: company?.idleTimeoutMinutes ?? 15,
    onAutoLogout: async () => {
      try {
        await recordSessionEvent("auto_logout_idle");
      } catch {
        /* telemetry must not block logout */
      }
      await logout();
    },
  });

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

  const userRole = user.role;
  const isManagerOrAbove =
    userRole === "owner" || userRole === "admin" || userRole === "manager";

  // Sprint 14ab — apply the same role / feature-flag filter rules to
  // the new grouped catalog. Empty groups are dropped from rendering.
  const visibleGroups = SIDEBAR_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (item.managersOnly && !isManagerOrAbove) return false;
      if (item.featureKey && enabledFeatures[item.featureKey] === false) return false;
      return true;
    }),
  })).filter((group) => group.items.length > 0);

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
          {/* Main nav — top panel. Sprint 14ab: 7 groups + scroll preserve. */}
          <nav
            ref={sidebarNavRef}
            className="min-h-0 overflow-y-auto p-3 space-y-1"
            style={{ flexBasis: `${topFlexPercent}%`, flexGrow: 0, flexShrink: 0 }}
          >
            {visibleGroups.map((group, groupIdx) => (
              <div key={group.id}>
                {/* Group header — small uppercase label flanked by thin lines */}
                <div className={cn("px-1 pb-2", groupIdx === 0 ? "pt-1" : "pt-5")}>
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border/50" />
                    <span className="text-[13px] font-bold uppercase tracking-wider text-zinc-300 whitespace-nowrap">
                      {t(group.labelKey)}
                    </span>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                </div>

                {group.items.map((item) => {
                  const fullHref = `/${locale}${item.href}`;
                  // Sprint 14ae — unified violet active state across the entire sidebar.
                  // Dashboard is special-cased to exact match so it doesn't stay
                  // highlighted when the user navigates to other top-level routes.
                  const isActive =
                    item.id === "dashboard"
                      ? pathname === fullHref
                      : pathname?.startsWith(fullHref) ?? false;
                  const Icon = item.icon;
                  const unread = item.showUnreadCount ? chatUnread : 0;
                  return (
                    <Link
                      key={item.id}
                      href={fullHref}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm border transition-colors",
                        isActive
                          ? "bg-violet-500/15 border-violet-500/35 text-violet-100 font-semibold ring-1 ring-violet-500/20 ring-inset"
                          : "border-transparent text-foreground/80 hover:bg-card/60 hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 flex-shrink-0",
                          isActive ? "text-violet-300" : "text-muted-foreground"
                        )}
                      />
                      <span className="flex-1">{t(item.labelKey)}</span>
                      {unread > 0 ? (
                        <span className="px-1.5 min-w-[18px] h-[18px] text-[10px] font-bold bg-rose-500 text-white rounded-full flex items-center justify-center">
                          {unread > 99 ? "99+" : unread}
                        </span>
                      ) : item.badge ? (
                        <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase bg-violet-500/15 text-violet-300 border border-violet-500/30 rounded">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ))}
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
          {/* Sprint 14ad — language switcher framed with thin dividers */}
          <div className="border-t border-border/40 mb-2" />
          <LanguageSwitcher currentLocale={locale as Locale} />
          <div className="border-t border-border/40 mt-2 mb-2" />
          {/* Sprint 14ae — settings sub-sidebar with violet active state */}
          {(() => {
            const settingsItems: Array<{
              slug: string;
              icon: typeof Settings;
              label: string;
            }> = [
              { slug: "templates", icon: Mail, label: "Email templates" },
              { slug: "custom-fields", icon: Activity, label: "Custom fields" },
              { slug: "integrations", icon: Sparkles, label: "E-commerce" },
              { slug: "billing", icon: CreditCard, label: "Billing" },
              { slug: "security", icon: Shield, label: "Security" },
              { slug: "users", icon: Users, label: "Team" },
              { slug: "roles", icon: ShieldCheck, label: "Roles" },
              { slug: "audit", icon: History, label: "Audit log" },
              { slug: "api", icon: Key, label: "API keys" },
              { slug: "brand", icon: Palette, label: "Branding" },
              { slug: "brands", icon: Store, label: "Brands" },
            ];
            const settingsRoot = `/${locale}/settings`;
            const settingsRootActive = pathname === settingsRoot;
            return (
              <>
                <Link
                  href={settingsRoot}
                  aria-current={settingsRootActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm border transition-colors",
                    settingsRootActive
                      ? "bg-violet-500/12 border-violet-500/30 text-violet-100 font-semibold"
                      : "border-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground"
                  )}
                >
                  <Settings
                    className={cn(
                      "w-4 h-4",
                      settingsRootActive
                        ? "text-violet-300"
                        : ""
                    )}
                  />
                  Settings
                </Link>
                {settingsItems.map((s) => {
                  const href = `/${locale}/settings/${s.slug}`;
                  const isActive =
                    pathname === href || pathname?.startsWith(`${href}/`);
                  const SubIcon = s.icon;
                  return (
                    <Link
                      key={s.slug}
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs border transition-colors",
                        isActive
                          ? "bg-violet-500/12 border-violet-500/30 text-violet-100 font-medium"
                          : "border-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground"
                      )}
                    >
                      <SubIcon
                        className={cn(
                          "w-3.5 h-3.5",
                          isActive ? "text-violet-300" : ""
                        )}
                      />
                      {s.label}
                    </Link>
                  );
                })}
              </>
            );
          })()}
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

      {/* AI side panel — available on every authenticated page */}
      <AISidePanel />
    </div>
  );
}