// ────────────────────────────────────────────────────────────────────
// Sprint 14ab — Dashboard sidebar catalog
// 23 nav items grouped into 7 logical sections (frequency-of-use first):
//   Daily ops · CRM core · Sales docs · Finance · Growth · Intelligence · AI & automation
// `href` values are the real on-disk routes (locale prefix added at
// render time). `labelKey` is the full next-intl key.
// ────────────────────────────────────────────────────────────────────

import {
  Activity,
  Award,
  BarChart3,
  Bell,
  Bot,
  Briefcase,
  CheckSquare,
  DollarSign,
  FileSignature,
  FileText,
  LayoutDashboard,
  Mail,
  MessageCircle,
  MessageSquare,
  Percent,
  Receipt,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type NavBadge = "AI" | "Beta" | "New";

export interface NavItem {
  id: string;
  /** Route path WITHOUT locale prefix (added at render time). */
  href: string;
  /** Full next-intl key, e.g. "Sidebar.dashboard". */
  labelKey: string;
  icon: LucideIcon;
  badge?: NavBadge;
  /** Manager-only: hide from members. Backend still scope-filters by role. */
  managersOnly?: boolean;
  /** Plan-feature flag from `company.enabledFeatures`. Item hidden when false. */
  featureKey?: string;
  /** When true, render the unreadCount badge (Team Chat). */
  showUnreadCount?: boolean;
}

export interface NavGroup {
  id: string;
  labelKey: string;
  items: NavItem[];
}

export const SIDEBAR_GROUPS: NavGroup[] = [
  {
    id: "daily-ops",
    labelKey: "Sidebar.groups.dailyOps",
    items: [
      { id: "dashboard", href: "/dashboard", labelKey: "Sidebar.dashboard", icon: LayoutDashboard },
      { id: "tasks", href: "/tasks", labelKey: "Sidebar.tasks", icon: CheckSquare },
      { id: "followup", href: "/followup", labelKey: "Sidebar.followup", icon: Bell },
      { id: "team-chat", href: "/chat", labelKey: "Sidebar.teamChat", icon: MessageSquare, showUnreadCount: true },
    ],
  },
  {
    id: "crm-core",
    labelKey: "Sidebar.groups.crmCore",
    items: [
      { id: "customers", href: "/customers", labelKey: "Sidebar.customers", icon: Users },
      { id: "deals", href: "/deals", labelKey: "Sidebar.deals", icon: Briefcase },
      { id: "pipeline", href: "/pipeline", labelKey: "Sidebar.pipeline", icon: Activity },
      { id: "campaigns", href: "/campaigns", labelKey: "Sidebar.campaigns", icon: Mail, featureKey: "marketing_automation" },
    ],
  },
  {
    id: "sales-docs",
    labelKey: "Sidebar.groups.salesDocs",
    items: [
      { id: "quotes", href: "/quotes", labelKey: "Sidebar.quotes", icon: FileText, featureKey: "quotes" },
      { id: "contracts", href: "/contracts", labelKey: "Sidebar.contracts", icon: FileSignature, featureKey: "contracts" },
      { id: "whatsapp", href: "/whatsapp", labelKey: "Sidebar.whatsapp", icon: MessageCircle, badge: "Beta" },
    ],
  },
  {
    id: "finance",
    labelKey: "Sidebar.groups.finance",
    items: [
      { id: "cashflow", href: "/cashflow", labelKey: "Sidebar.cashFlow", icon: TrendingUp },
      { id: "tax", href: "/tax", labelKey: "Sidebar.tax", icon: Percent },
      { id: "tax-invoices", href: "/tax-invoices", labelKey: "Sidebar.taxInvoices", icon: Receipt, featureKey: "tax_invoices" },
      { id: "commission", href: "/commission", labelKey: "Sidebar.commission", icon: DollarSign, featureKey: "commission" },
    ],
  },
  {
    id: "growth",
    labelKey: "Sidebar.groups.growth",
    items: [
      { id: "loyalty", href: "/loyalty", labelKey: "Sidebar.loyalty", icon: Award, featureKey: "loyalty" },
    ],
  },
  {
    id: "intelligence",
    labelKey: "Sidebar.groups.intelligence",
    items: [
      { id: "analytics", href: "/analytics", labelKey: "Sidebar.analytics", icon: BarChart3, featureKey: "analytics_reports" },
      { id: "reports", href: "/reports", labelKey: "Sidebar.reports", icon: BarChart3 },
      { id: "session-kpis", href: "/session-kpis", labelKey: "Sidebar.sessionKpis", icon: Activity, managersOnly: true },
    ],
  },
  {
    id: "ai-automation",
    labelKey: "Sidebar.groups.aiAutomation",
    items: [
      { id: "ai-cfo", href: "/ai-cfo", labelKey: "Sidebar.aiCfo", icon: Sparkles, badge: "AI", featureKey: "ai_cfo" },
      { id: "ai-agents", href: "/ai", labelKey: "Sidebar.aiAgents", icon: Bot, badge: "AI" },
      { id: "automations", href: "/workflows", labelKey: "Sidebar.automations", icon: Zap },
      { id: "templates", href: "/templates", labelKey: "Sidebar.templates", icon: Sparkles },
    ],
  },
];

// Flat list helper for places that need a non-grouped view (search, breadcrumbs).
export const SIDEBAR_ITEMS_FLAT: NavItem[] = SIDEBAR_GROUPS.flatMap((g) => g.items);
