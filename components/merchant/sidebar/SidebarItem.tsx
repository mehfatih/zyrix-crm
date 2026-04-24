"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { GroupId } from "./nav-config";
import { GROUP_ACCENTS } from "./nav-config";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  group: GroupId;
  collapsed: boolean;
  badge?: number;
  pinned?: boolean;
  onTogglePin?: () => void;
  pinLabel?: string;
  unpinLabel?: string;
  /** When provided, used instead of pathname matching */
  isActive?: boolean;
}

export function SidebarItem({
  href,
  icon: Icon,
  label,
  group,
  collapsed,
  badge,
  pinned,
  onTogglePin,
  pinLabel,
  unpinLabel,
  isActive: isActiveOverride,
}: SidebarItemProps) {
  const pathname = usePathname() || "";

  // Active if path ends with the item's href (so both /en/merchant and /en/merchant/ work)
  const active =
    isActiveOverride !== undefined
      ? isActiveOverride
      : pathname === href || pathname === `${href}/` ||
        (href.split("/").length > 3 && pathname.startsWith(`${href}/`));

  const accent = GROUP_ACCENTS[group];

  return (
    <div
      className="group relative"
      onContextMenu={(e) => {
        if (!onTogglePin) return;
        e.preventDefault();
        onTogglePin();
      }}
    >
      <Link
        href={href}
        title={collapsed ? label : undefined}
        className={`relative flex items-center h-10 rounded-[10px] transition-colors ${
          collapsed ? "justify-center px-0" : "ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 gap-3"
        } ${
          active
            ? "bg-cyan-50 text-cyan-700 font-semibold"
            : "text-slate-700 hover:bg-cyan-50/60 hover:text-slate-900"
        }`}
      >
        {/* Left accent bar when active */}
        {active && (
          <span
            aria-hidden
            className="absolute ltr:left-0 rtl:right-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
            style={{ backgroundColor: accent.bar }}
          />
        )}

        <Icon
          className={`w-[18px] h-[18px] flex-shrink-0 ${
            active ? "text-cyan-600" : "text-slate-500 group-hover:text-slate-700"
          }`}
        />

        {!collapsed && (
          <span className="flex-1 text-sm truncate">{label}</span>
        )}

        {!collapsed && badge !== undefined && badge > 0 && (
          <span
            className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white rounded-full"
            style={{ backgroundColor: "#f97373" }}
          >
            {badge > 99 ? "99+" : badge}
          </span>
        )}

        {!collapsed && pinned && (
          <span
            aria-hidden
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: "#f97373" }}
          />
        )}
      </Link>

      {/* Hover pin toggle (expanded only) */}
      {!collapsed && onTogglePin && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTogglePin();
          }}
          title={pinned ? unpinLabel : pinLabel}
          className={`absolute top-1/2 -translate-y-1/2 ltr:right-1 rtl:left-1 w-6 h-6 rounded-md items-center justify-center transition-opacity ${
            pinned
              ? "flex text-orange-500 hover:bg-orange-50"
              : "hidden group-hover:flex text-slate-400 hover:text-cyan-600 hover:bg-cyan-50"
          }`}
        >
          <Pin className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
