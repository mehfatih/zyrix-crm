import {
  Home,
  Star,
  Users,
  Building2,
  Briefcase,
  CheckSquare,
  Ticket,
  MessageCircle,
  Mail,
  Phone,
  Video,
  Rss,
  BarChart3,
  Target,
  Settings,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export type GroupId = "pinned" | "work" | "engage" | "grow" | "system";

export interface SidebarNavItem {
  id: string;
  path: string;
  icon: LucideIcon;
  labelKey: "home" | "pinned" | "contacts" | "companies" | "deals" | "tasks" |
    "tickets" | "conversations" | "marketingEmail" | "calls" |
    "meetingLinks" | "feeds" | "dashboards" | "segments" | "settings" | "help";
  group: GroupId | "home";
  /** optional live badge source — which counter to render */
  badgeKey?: "unreadConversations";
}

export const NAV_ITEMS: SidebarNavItem[] = [
  // Home is its own section, always at top
  { id: "home", path: "", icon: Home, labelKey: "home", group: "home" },

  // WORK group
  { id: "contacts", path: "contacts", icon: Users, labelKey: "contacts", group: "work" },
  { id: "companies", path: "companies", icon: Building2, labelKey: "companies", group: "work" },
  { id: "deals", path: "deals", icon: Briefcase, labelKey: "deals", group: "work" },
  { id: "tasks", path: "tasks", icon: CheckSquare, labelKey: "tasks", group: "work" },
  { id: "tickets", path: "tickets", icon: Ticket, labelKey: "tickets", group: "work" },

  // ENGAGE group
  {
    id: "conversations",
    path: "conversations",
    icon: MessageCircle,
    labelKey: "conversations",
    group: "engage",
    badgeKey: "unreadConversations",
  },
  { id: "marketing-email", path: "marketing-email", icon: Mail, labelKey: "marketingEmail", group: "engage" },
  { id: "calls", path: "calls", icon: Phone, labelKey: "calls", group: "engage" },
  { id: "meeting-links", path: "meeting-links", icon: Video, labelKey: "meetingLinks", group: "engage" },
  { id: "feeds", path: "feeds", icon: Rss, labelKey: "feeds", group: "engage" },

  // GROW group
  { id: "dashboards", path: "dashboards", icon: BarChart3, labelKey: "dashboards", group: "grow" },
  { id: "segments", path: "segments", icon: Target, labelKey: "segments", group: "grow" },

  // SYSTEM group
  { id: "settings", path: "settings", icon: Settings, labelKey: "settings", group: "system" },
  { id: "help", path: "help", icon: LifeBuoy, labelKey: "help", group: "system" },
];

export const GROUP_ACCENTS: Record<GroupId, { bar: string; label: string }> = {
  pinned: { bar: "#f97316", label: "Pinned" },
  work: { bar: "#10b981", label: "WORK" },
  engage: { bar: "#f97373", label: "ENGAGE" },
  grow: { bar: "#a78bfa", label: "GROW" },
  system: { bar: "#22D3EE", label: "SYSTEM" },
};

export function getItemGroup(id: string): GroupId {
  const item = NAV_ITEMS.find((n) => n.id === id);
  if (!item) return "system";
  if (item.group === "home") return "system";
  return item.group;
}
