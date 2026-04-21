"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

interface DashboardShellProps {
  locale: string;
  children: ReactNode;
}

export function DashboardShell({ locale, children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, company, isLoading, isAuthenticated, logout } = useAuth();

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
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
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
    const key = (item as { featureKey?: string }).featureKey;
    if (!key) return true;
    return enabledFeatures[key] !== false;
  });

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <ImpersonationBanner locale={locale} />
      <div className="flex-1 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-line-soft flex-col fixed h-screen">
        <div className="p-4 border-b border-line-soft flex items-center gap-2">
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
              <h1 className="text-sm font-bold text-ink leading-tight truncate">
                {company.name}
              </h1>
              <p className="text-[10px] text-ink-muted capitalize">
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

        {/* Sidebar nav — scrolls independently when content exceeds
            viewport height so all items remain reachable on small
            screens without zooming out. min-h-0 is necessary for
            overflow-y-auto to respect the flex parent's height. */}
        <nav className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-ink-light hover:bg-bg-subtle hover:text-ink"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {(item as any).unreadCount && (item as any).unreadCount > 0 ? (
                  <span className="px-1.5 min-w-[18px] h-[18px] text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                    {(item as any).unreadCount > 99 ? "99+" : (item as any).unreadCount}
                  </span>
                ) : item.badge ? (
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase bg-cyan-100 text-cyan-700 rounded">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-line-soft space-y-0.5">
          <LanguageSwitcher currentLocale={locale as Locale} />
          <Link
            href={`/${locale}/settings`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink-light hover:bg-bg-subtle hover:text-ink transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <Link
            href={`/${locale}/settings/templates`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-ink-light hover:bg-bg-subtle hover:text-ink transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Email templates
          </Link>
          <Link
            href={`/${locale}/settings/custom-fields`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-ink-light hover:bg-bg-subtle hover:text-ink transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            Custom fields
          </Link>
          <Link
            href={`/${locale}/settings/integrations`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-ink-light hover:bg-bg-subtle hover:text-ink transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            E-commerce
          </Link>
          <Link
            href={`/${locale}/settings/billing`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-ink-light hover:bg-bg-subtle hover:text-ink transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Billing
          </Link>
          <Link
            href={`/${locale}/settings/security`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-ink-light hover:bg-bg-subtle hover:text-ink transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            Security
          </Link>
          <Link
            href={`/${locale}/settings/audit`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-ink-light hover:bg-bg-subtle hover:text-ink transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            Audit log
          </Link>
          <Link
            href={`/${locale}/settings/api`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-ink-light hover:bg-bg-subtle hover:text-ink transition-colors"
          >
            <Key className="w-3.5 h-3.5" />
            API keys
          </Link>
          <Link
            href={`/${locale}/settings/brand`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-ink-light hover:bg-bg-subtle hover:text-ink transition-colors"
          >
            <Palette className="w-3.5 h-3.5" />
            Branding
          </Link>
          <Link
            href={`/${locale}/settings/brands`}
            className="flex items-center gap-3 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 py-1.5 rounded-lg text-xs text-ink-light hover:bg-bg-subtle hover:text-ink transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            Brands
          </Link>
        </div>

        <div className="p-3 border-t border-line-soft">
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm">
              {getInitials(user.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-ink-muted truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-ink-light hover:text-danger hover:bg-danger-light rounded"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-line-soft px-4 py-2.5 flex items-center gap-3">
          <GlobalSearchBar />
        </div>
        <div className="flex-1">{children}</div>
      </main>
      </div>
    </div>
  );
}