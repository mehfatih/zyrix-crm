"use client";

import type { ReactNode } from "react";
import type { GroupId } from "./nav-config";
import { GROUP_ACCENTS } from "./nav-config";

interface SidebarGroupProps {
  groupId: GroupId;
  label: string;
  collapsed: boolean;
  children: ReactNode;
}

export function SidebarGroup({
  groupId,
  label,
  collapsed,
  children,
}: SidebarGroupProps) {
  const accent = GROUP_ACCENTS[groupId];

  return (
    <div className="mt-5 first:mt-0">
      {!collapsed && (
        <div className="mb-1.5 ltr:pl-3 rtl:pr-3 flex items-center gap-2">
          <span
            className="text-[10px] font-bold uppercase"
            style={{
              letterSpacing: "0.15em",
              color: accent.bar,
            }}
          >
            {label}
          </span>
          <span className="flex-1 h-px bg-sky-100" />
        </div>
      )}
      {collapsed && (
        <div className="mx-2 mb-1.5 h-px bg-sky-100" />
      )}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}
