"use client";

import {
  Users,
  Briefcase,
  TrendingUp,
  CheckSquare,
  Award,
  DollarSign,
  Crown,
  MessageCircle,
  Calendar,
  GitBranch,
  Activity,
  Layout,
  Target,
  Store,
} from "lucide-react";
import type { ComponentType } from "react";
import type { DashboardWidget } from "@/lib/api/advanced";

// ============================================================================
// WIDGET REGISTRY
// ----------------------------------------------------------------------------
// Single source of truth for "what widgets exist". The add-widget modal
// enumerates this registry; the grid renderer looks up each widget's
// component by type. Adding a new widget is: (1) register entry here,
// (2) implement component, (3) add type to backend VALID_TYPES allow-list.
// ============================================================================

export interface WidgetMeta {
  type: string;
  label: { en: string; ar: string; tr: string };
  description: { en: string; ar: string; tr: string };
  icon: ComponentType<{ className?: string }>;
  defaultWidth: DashboardWidget["width"];
  accent: string;  // tailwind color name — picks the icon bg tint
}

export const WIDGET_REGISTRY: WidgetMeta[] = [
  {
    type: "kpi_row",
    label: {
      en: "KPI summary",
      ar: "ملخص المؤشرات",
      tr: "KPI özeti",
    },
    description: {
      en: "Revenue, deals, customers, win rate at a glance",
      ar: "الإيراد، الصفقات، العملاء، ومعدل الفوز في لمحة",
      tr: "Gelir, anlaşmalar, müşteriler ve kazanma oranına hızlı bakış",
    },
    icon: Layout,
    defaultWidth: "full",
    accent: "cyan",
  },
  {
    type: "revenue_trend",
    label: {
      en: "Revenue trend",
      ar: "اتجاه الإيرادات",
      tr: "Gelir trendi",
    },
    description: {
      en: "Last-90-day revenue, compared to the prior period",
      ar: "إيرادات آخر 90 يوم مقارنة بالفترة السابقة",
      tr: "Son 90 günlük gelir, önceki dönemle karşılaştırmalı",
    },
    icon: TrendingUp,
    defaultWidth: "half",
    accent: "emerald",
  },
  {
    type: "pipeline_snapshot",
    label: {
      en: "Pipeline snapshot",
      ar: "لمحة خط الأنابيب",
      tr: "Pipeline özeti",
    },
    description: {
      en: "Deal value and count by stage",
      ar: "قيمة وعدد الصفقات حسب المرحلة",
      tr: "Aşamaya göre anlaşma değeri ve adedi",
    },
    icon: GitBranch,
    defaultWidth: "half",
    accent: "sky",
  },
  {
    type: "recent_deals",
    label: {
      en: "Recent deals",
      ar: "صفقات حديثة",
      tr: "Son anlaşmalar",
    },
    description: {
      en: "The last 5 deals created or updated",
      ar: "آخر 5 صفقات أُنشئت أو حُدّثت",
      tr: "Oluşturulan veya güncellenen son 5 anlaşma",
    },
    icon: Briefcase,
    defaultWidth: "half",
    accent: "indigo",
  },
  {
    type: "upcoming_tasks",
    label: {
      en: "Upcoming tasks",
      ar: "المهام القادمة",
      tr: "Yaklaşan görevler",
    },
    description: {
      en: "Tasks due today and tomorrow",
      ar: "مهام اليوم والغد",
      tr: "Bugün ve yarın yapılacak görevler",
    },
    icon: CheckSquare,
    defaultWidth: "half",
    accent: "amber",
  },
  {
    type: "connected_stores",
    label: {
      en: "Connected stores",
      ar: "المتاجر المتصلة",
      tr: "Bağlı mağazalar",
    },
    description: {
      en: "E-commerce integrations and sync health",
      ar: "تكاملات التجارة الإلكترونية وحالة المزامنة",
      tr: "E-ticaret entegrasyonları ve senkronizasyon durumu",
    },
    icon: Store,
    defaultWidth: "full",
    accent: "cyan",
  },
  {
    type: "cohort_snapshot",
    label: {
      en: "Cohort retention",
      ar: "الاحتفاظ بالعملاء",
      tr: "Müşteri tutma",
    },
    description: {
      en: "This month's cohort vs last month's at the same age",
      ar: "مجموعة هذا الشهر مقابل الشهر الماضي في نفس العمر",
      tr: "Bu ayki kohort ile geçen ayınkinin aynı yaşta karşılaştırması",
    },
    icon: Users,
    defaultWidth: "third",
    accent: "cyan",
  },
  {
    type: "funnel_snapshot",
    label: {
      en: "Funnel overview",
      ar: "نظرة على المسار",
      tr: "Huni özeti",
    },
    description: {
      en: "Win rate and biggest drop-off stage (last 90 days)",
      ar: "معدل الفوز وأكبر مرحلة تسرب (آخر 90 يوم)",
      tr: "Kazanma oranı ve en büyük düşüş aşaması (son 90 gün)",
    },
    icon: Target,
    defaultWidth: "third",
    accent: "sky",
  },
  {
    type: "customer_count",
    label: {
      en: "Customers",
      ar: "العملاء",
      tr: "Müşteriler",
    },
    description: {
      en: "Total customer count",
      ar: "إجمالي عدد العملاء",
      tr: "Toplam müşteri sayısı",
    },
    icon: Users,
    defaultWidth: "quarter",
    accent: "cyan",
  },
  {
    type: "deal_count",
    label: {
      en: "Open deals",
      ar: "الصفقات المفتوحة",
      tr: "Açık anlaşmalar",
    },
    description: {
      en: "Number of deals not yet won or lost",
      ar: "عدد الصفقات اللي لسه مفتوحة",
      tr: "Henüz kazanılmayan veya kaybedilmeyen anlaşma sayısı",
    },
    icon: Briefcase,
    defaultWidth: "quarter",
    accent: "indigo",
  },
  {
    type: "won_this_month",
    label: {
      en: "Won this month",
      ar: "فوز هذا الشهر",
      tr: "Bu ay kazanılan",
    },
    description: {
      en: "Revenue from deals won since the 1st",
      ar: "إيرادات من صفقات فازت منذ أول الشهر",
      tr: "Ayın 1'inden bu yana kazanılan anlaşmaların geliri",
    },
    icon: Award,
    defaultWidth: "quarter",
    accent: "emerald",
  },
  {
    type: "top_customers",
    label: {
      en: "Top customers",
      ar: "أفضل العملاء",
      tr: "En iyi müşteriler",
    },
    description: {
      en: "Biggest spenders by lifetime value",
      ar: "الأكبر إنفاقًا حسب قيمة العميل الدائمة",
      tr: "Yaşam boyu değere göre en çok harcayanlar",
    },
    icon: Crown,
    defaultWidth: "half",
    accent: "amber",
  },
  {
    type: "tasks_due_today",
    label: {
      en: "Due today",
      ar: "تسليم اليوم",
      tr: "Bugün teslim",
    },
    description: {
      en: "Task count for today only",
      ar: "عدد مهام اليوم فقط",
      tr: "Sadece bugünün görev sayısı",
    },
    icon: Calendar,
    defaultWidth: "quarter",
    accent: "rose",
  },
  {
    type: "unread_messages",
    label: {
      en: "Unread messages",
      ar: "الرسائل غير المقروءة",
      tr: "Okunmamış mesajlar",
    },
    description: {
      en: "Unread chat messages across all conversations",
      ar: "رسائل غير مقروءة عبر كل المحادثات",
      tr: "Tüm sohbetlerdeki okunmamış mesajlar",
    },
    icon: MessageCircle,
    defaultWidth: "quarter",
    accent: "violet",
  },
];

export function getWidgetMeta(type: string): WidgetMeta | undefined {
  return WIDGET_REGISTRY.find((w) => w.type === type);
}

// Tailwind-safe accent class tables — keeping these as static strings so
// the JIT can include them in the final bundle (dynamic `bg-${x}-50` won't work).
export const ACCENT_BG: Record<string, string> = {
  cyan: "bg-cyan-50 text-cyan-700",
  emerald: "bg-emerald-50 text-emerald-700",
  sky: "bg-sky-50 text-sky-700",
  indigo: "bg-indigo-50 text-indigo-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  violet: "bg-violet-50 text-violet-700",
};
