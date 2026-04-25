"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { UserCard } from "./sidebar/UserCard";
import { GlobalSearch } from "./sidebar/GlobalSearch";
import { SidebarGroup } from "./sidebar/SidebarGroup";
import { SidebarItem } from "./sidebar/SidebarItem";
import { PinnedSection } from "./sidebar/PinnedSection";
import { LanguagePills } from "./sidebar/LanguagePills";
import { NAV_ITEMS, type GroupId } from "./sidebar/nav-config";
import { usePinnedItems } from "./sidebar/pinnedItemsStore";
import { openQuickAdd } from "./MerchantGlobalShortcuts";

const COLLAPSED_KEY = "zyrix_merchant_sidebar_collapsed";

interface SmartSidebarProps {
  locale: string;
  isRTL: boolean;
  user: {
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
  company: {
    name: string;
    plan: string;
  };
  onLogout: () => void;
  /** badges for live counters */
  badges?: {
    unreadConversations?: number;
  };
  /** optional close handler for mobile drawer */
  onCloseMobile?: () => void;
}

export function SmartSidebar({
  locale,
  isRTL,
  user,
  company,
  onLogout,
  badges,
  onCloseMobile,
}: SmartSidebarProps) {
  const t = useTranslations("MerchantSidebar");
  const [collapsed, setCollapsed] = useState(false);
  const { pinnedIds, togglePin } = usePinnedItems();

  // Restore collapsed preference. Also auto-collapse on tablet width.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(COLLAPSED_KEY);
      if (saved === "1") {
        setCollapsed(true);
        return;
      }
      if (saved === "0") {
        setCollapsed(false);
        return;
      }
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  // Labels
  const groupLabels = {
    pinned: t("groups.pinned"),
    work: t("groups.work"),
    engage: t("groups.engage"),
    grow: t("groups.grow"),
    system: t("groups.system"),
  };
  const itemLabels: Record<string, string> = {
    home: t("items.home"),
    pinned: t("items.pinned"),
    contacts: t("items.contacts"),
    companies: t("items.companies"),
    deals: t("items.deals"),
    tasks: t("items.tasks"),
    tickets: t("items.tickets"),
    conversations: t("items.conversations"),
    marketingEmail: t("items.marketingEmail"),
    calls: t("items.calls"),
    meetingLinks: t("items.meetingLinks"),
    feeds: t("items.feeds"),
    dashboards: t("items.dashboards"),
    segments: t("items.segments"),
    settings: t("items.settings"),
    help: t("items.help"),
  };

  const planLabels: Record<string, string> = {
    free: t("planBadge.free"),
    starter: t("planBadge.starter"),
    business: t("planBadge.business"),
    enterprise: t("planBadge.enterprise"),
  };

  const homeHref = `/${locale}/merchant`;
  const homeItem = NAV_ITEMS.find((n) => n.id === "home")!;

  // Grouped rendering
  const groups: GroupId[] = ["work", "engage", "grow", "system"];

  const width = collapsed ? "w-[68px]" : "w-[280px]";

  return (
    <aside
      dir={isRTL ? "rtl" : "ltr"}
      className={`${width} h-screen sticky top-0 bg-white ${
        isRTL ? "border-l border-sky-100" : "border-r border-sky-100"
      } flex flex-col transition-[width] duration-200`}
    >
      {/* Brand row */}
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "ltr:pl-4 rtl:pr-4 ltr:pr-2 rtl:pl-2"
        } h-[60px] border-b border-sky-100 gap-2`}
      >
        <Link
          href={homeHref}
          onClick={onCloseMobile}
          className="flex items-center gap-2 flex-1 min-w-0"
        >
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-sky-400 to-sky-600 shadow-sm flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Zyrix"
              fill
              sizes="36px"
              className="object-contain p-1"
              priority
            />
          </div>
          {!collapsed && (
            <span className="text-lg font-extrabold tracking-tight text-[#0C4A6E]">
              Zyrix
            </span>
          )}
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={toggleCollapsed}
            title={t("collapse")}
            aria-label={t("collapse")}
            className="w-7 h-7 rounded-md text-slate-400 hover:text-sky-600 hover:bg-sky-50 flex items-center justify-center"
          >
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Collapsed: tiny expand button */}
      {collapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          title={t("expand")}
          aria-label={t("expand")}
          className="mx-auto mt-2 w-8 h-8 rounded-md text-slate-400 hover:text-sky-600 hover:bg-sky-50 flex items-center justify-center"
        >
          {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      )}

      {/* User card */}
      <div className={collapsed ? "" : "px-3 pt-3"}>
        <UserCard
          locale={locale}
          collapsed={collapsed}
          fullName={user.fullName}
          email={user.email}
          avatarUrl={user.avatarUrl}
          companyName={company.name}
          plan={company.plan}
          planLabels={planLabels}
          t={{
            profile: t("items.settings"),
            settings: t("items.settings"),
            logout: t("logout"),
          }}
          onLogout={onLogout}
        />
      </div>

      {/* Divider */}
      <div className="mt-3 mx-3 h-px bg-sky-100" />

      {/* Global search */}
      <div className={collapsed ? "mt-3 px-2" : "mt-3 px-3"}>
        <GlobalSearch
          collapsed={collapsed}
          placeholder={t("searchPlaceholder")}
          shortcutHint={t("shortcutHint")}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-2 mt-3 pb-3">
        {/* Home (always first) */}
        <SidebarItem
          href={homeHref}
          icon={homeItem.icon}
          label={itemLabels.home}
          group="system"
          collapsed={collapsed}
          isActive={undefined}
        />

        {/* Pinned */}
        <PinnedSection
          locale={locale}
          collapsed={collapsed}
          pinnedIds={pinnedIds}
          togglePin={togglePin}
          labels={itemLabels}
          pinLabel={t("pinItem")}
          unpinLabel={t("unpinItem")}
          groupLabel={groupLabels.pinned}
        />

        {/* "New" button — opens QuickAdd modal */}
        <div className={collapsed ? "mt-2 px-1" : "mt-2 px-2"}>
          <button
            type="button"
            onClick={() => openQuickAdd()}
            title={t("newButton")}
            className={`w-full inline-flex items-center ${
              collapsed ? "justify-center h-10" : "gap-2 h-10 px-3"
            } rounded-xl border border-dashed border-sky-300 text-sky-600 hover:bg-sky-50 hover:border-sky-300 transition-colors`}
          >
            <Plus className="w-4 h-4" />
            {!collapsed && (
              <>
                <span className="text-[13px] font-semibold flex-1 text-left rtl:text-right">
                  {t("newButton")}
                </span>
                <kbd className="text-[10px] font-semibold text-slate-500 bg-sky-50 border border-sky-100 rounded px-1.5 py-0.5">
                  C
                </kbd>
              </>
            )}
          </button>
        </div>

        {/* Groups */}
        {groups.map((g) => {
          const items = NAV_ITEMS.filter((n) => n.group === g);
          if (items.length === 0) return null;
          return (
            <SidebarGroup
              key={g}
              groupId={g}
              label={groupLabels[g]}
              collapsed={collapsed}
            >
              {items.map((item) => {
                const href = `/${locale}/merchant/${item.path}`;
                const badge =
                  item.badgeKey === "unreadConversations"
                    ? badges?.unreadConversations
                    : undefined;
                return (
                  <SidebarItem
                    key={item.id}
                    href={href}
                    icon={item.icon}
                    label={itemLabels[item.labelKey] || item.labelKey}
                    group={item.group === "home" ? "system" : item.group}
                    collapsed={collapsed}
                    badge={badge}
                    pinned={pinnedIds.includes(item.id)}
                    onTogglePin={() => togglePin(item.id)}
                    pinLabel={t("pinItem")}
                    unpinLabel={t("unpinItem")}
                  />
                );
              })}
            </SidebarGroup>
          );
        })}
      </nav>

      {/* Footer — language + version */}
      <div className="border-t border-sky-100 px-3 py-3 space-y-2.5">
        <LanguagePills current={locale} collapsed={collapsed} />
        {!collapsed && (
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{t("version")}</span>
            <button
              type="button"
              onClick={onLogout}
              className="hover:text-rose-600 transition-colors"
            >
              {t("logout")}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
