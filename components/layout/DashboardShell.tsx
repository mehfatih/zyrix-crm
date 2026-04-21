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
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { fetchUnreadCount } from "@/lib/api/chat";
import { LanguageSwitcher } from "./LanguageSwitcher";
import ImpersonationBanner from "./ImpersonationBanner";
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

  const navItems = [
    {
      href: `/${locale}/dashboard`,
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    { href: `/${locale}/customers`, icon: Users, label: "Customers" },
    { href: `/${locale}/deals`, icon: Briefcase, label: "Deals" },
    { href: `/${locale}/pipeline`, icon: Activity, label: "Pipeline" },
    { href: `/${locale}/quotes`, icon: FileText, label: "Quotes" },
    { href: `/${locale}/contracts`, icon: FileSignature, label: "Contracts" },
    { href: `/${locale}/loyalty`, icon: Award, label: "Loyalty" },
    { href: `/${locale}/tax`, icon: Percent, label: "Tax" },
    { href: `/${locale}/commission`, icon: DollarSign, label: "Commission" },
    { href: `/${locale}/cashflow`, icon: TrendingUp, label: "Cash Flow" },
    { href: `/${locale}/reports`, icon: BarChart3, label: "Reports" },
    { href: `/${locale}/followup`, icon: Bell, label: "Follow-up" },
    { href: `/${locale}/campaigns`, icon: Mail, label: "Campaigns" },
    {
      href: `/${locale}/ai-cfo`,
      icon: Sparkles,
      label: "AI CFO",
      badge: "AI",
    },
    { href: `/${locale}/tasks`, icon: CheckSquare, label: "Tasks" },
    { href: `/${locale}/chat`, icon: MessageSquare, label: "Team Chat", unreadCount: chatUnread },
    {
      href: `/${locale}/whatsapp`,
      icon: MessageCircle,
      label: "WhatsApp",
      badge: "Beta",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <ImpersonationBanner locale={locale} />
      <div className="flex-1 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-line-soft flex-col fixed h-screen">
        <div className="p-4 border-b border-line-soft">
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo.png"
              alt="Zyrix"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-sm font-bold text-ink leading-tight">
                {company.name}
              </h1>
              <p className="text-[10px] text-ink-muted capitalize">
                {company.plan}
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
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