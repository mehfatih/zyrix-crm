"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageCircle,
  Activity,
  CheckSquare,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { LanguageSwitcher } from "./LanguageSwitcher";
import ImpersonationBanner from "./ImpersonationBanner";
import type { Locale } from "@/i18n";
import { getInitials, cn } from "@/lib/utils";

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
    { href: `/${locale}/tasks`, icon: CheckSquare, label: "Tasks" },
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
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase bg-cyan-100 text-cyan-700 rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-line-soft space-y-2">
          <LanguageSwitcher currentLocale={locale as Locale} />
          <Link
            href={`/${locale}/settings`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink-light hover:bg-bg-subtle hover:text-ink transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
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
      <main className="flex-1 lg:ml-64">{children}</main>
      </div>
    </div>
  );
}