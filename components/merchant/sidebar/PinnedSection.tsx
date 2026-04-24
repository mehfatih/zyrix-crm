"use client";

import { Star } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { NAV_ITEMS } from "./nav-config";

interface PinnedSectionProps {
  locale: string;
  collapsed: boolean;
  pinnedIds: string[];
  togglePin: (id: string) => void;
  labels: Record<string, string>;
  pinLabel: string;
  unpinLabel: string;
  groupLabel: string;
}

export function PinnedSection({
  locale,
  collapsed,
  pinnedIds,
  togglePin,
  labels,
  pinLabel,
  unpinLabel,
  groupLabel,
}: PinnedSectionProps) {
  if (pinnedIds.length === 0) return null;

  const resolved = pinnedIds
    .map((id) => NAV_ITEMS.find((n) => n.id === id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  if (resolved.length === 0) return null;

  return (
    <div className="mt-3">
      {!collapsed && (
        <div className="ltr:pl-3 rtl:pr-3 mb-1.5 flex items-center gap-2">
          <Star className="w-3 h-3 text-orange-500" />
          <span
            className="text-[10px] font-bold uppercase text-orange-500"
            style={{ letterSpacing: "0.15em" }}
          >
            {groupLabel}
          </span>
          <span className="flex-1 h-px bg-sky-100" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        {resolved.map((item) => {
          const href = item.path
            ? `/${locale}/merchant/${item.path}`
            : `/${locale}/merchant`;
          return (
            <SidebarItem
              key={item.id}
              href={href}
              icon={item.icon}
              label={labels[item.labelKey] || item.labelKey}
              group={item.group === "home" ? "system" : item.group}
              collapsed={collapsed}
              pinned
              onTogglePin={() => togglePin(item.id)}
              pinLabel={pinLabel}
              unpinLabel={unpinLabel}
            />
          );
        })}
      </div>
    </div>
  );
}
