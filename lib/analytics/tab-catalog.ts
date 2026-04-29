// ────────────────────────────────────────────────────────────────────
// Sprint 14w — Analytics Tab Catalog
// Static, deterministic mock data for 13 tabs × 4 widgets.
// Pivot + viz data generated from a per-tab seed so reloads are stable.
// All Tailwind hues are stored as plain strings; the consumer maps them
// to static class lookup tables (Tailwind JIT requirement).
// ────────────────────────────────────────────────────────────────────

export type AnalyticsTabId =
  | "revenue"
  | "pipeline"
  | "customers"
  | "activity"
  | "deals"
  | "team"
  | "quotes"
  | "contracts"
  | "loyalty"
  | "tax"
  | "commission"
  | "cashflow"
  | "campaigns";

export type AnalyticsColor =
  | "emerald"
  | "cyan"
  | "violet"
  | "amber"
  | "rose"
  | "lime"
  | "sky"
  | "indigo"
  | "pink"
  | "yellow"
  | "teal"
  | "fuchsia"
  | "orange";

export type ChartType = "bar" | "line" | "area";
export type VizChartType = "bar" | "line" | "area" | "pie" | "scatter" | "funnel" | "radar";

export interface I18nText {
  en: string;
  ar: string;
  tr: string;
}

export interface AnalyticsWidget {
  id: string;
  label: I18nText;
  color: AnalyticsColor;
  icon: string;
  value: string;
  trend: number;
  sparklineData: { x: number; y: number }[];
}

export interface PivotSeries {
  dataKey: string;
  color: AnalyticsColor;
  label: I18nText;
}

export interface PivotConfig {
  defaultChartType: ChartType;
  series: PivotSeries[];
  data: Record<string, string | number>[];
}

export interface VizOption {
  id: string;
  label: I18nText;
}

export interface VizConfig {
  dimensions: VizOption[];
  measures: VizOption[];
  defaultDimension: string;
  defaultMeasure: string;
}

export interface AnalyticsTab {
  id: AnalyticsTabId;
  name: I18nText;
  description: I18nText;
  color: AnalyticsColor;
  icon: string;
  widgets: AnalyticsWidget[];
  pivot: PivotConfig;
  viz: VizConfig;
}

export const DEFAULT_TAB_IDS: AnalyticsTabId[] = [
  "revenue",
  "pipeline",
  "customers",
  "activity",
];

// Deterministic pseudo-random: xorshift seeded by string hash.
function seedFromString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed: number) {
  let state = seed || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state = state >>> 0;
    return state / 0xffffffff;
  };
}
function spark(id: string, base: number, spread: number): { x: number; y: number }[] {
  const r = rng(seedFromString(id));
  return Array.from({ length: 7 }, (_, x) => ({
    x,
    y: Math.round(base + (r() - 0.5) * spread),
  }));
}
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function pivotData(
  tabId: string,
  series: { key: string; base: number; spread: number }[],
): Record<string, string | number>[] {
  return MONTHS.map((m, i) => {
    const row: Record<string, string | number> = { month: m };
    for (const s of series) {
      const r = rng(seedFromString(`${tabId}.${s.key}.${i}`));
      row[s.key] = Math.round(s.base + (r() - 0.4) * s.spread);
    }
    return row;
  });
}

const COMMON_DIMENSIONS: VizOption[] = [
  { id: "time", label: { en: "Time", ar: "الوقت", tr: "Zaman" } },
  { id: "country", label: { en: "Country", ar: "الدولة", tr: "Ülke" } },
  { id: "stage", label: { en: "Stage", ar: "المرحلة", tr: "Aşama" } },
  { id: "segment", label: { en: "Segment", ar: "الشريحة", tr: "Segment" } },
];
const COMMON_MEASURES: VizOption[] = [
  { id: "revenue", label: { en: "Revenue", ar: "الإيرادات", tr: "Gelir" } },
  { id: "count", label: { en: "Count", ar: "العدد", tr: "Sayı" } },
  { id: "avg", label: { en: "Average", ar: "المتوسط", tr: "Ortalama" } },
  { id: "sum", label: { en: "Sum", ar: "المجموع", tr: "Toplam" } },
];
const STD_VIZ: VizConfig = {
  dimensions: COMMON_DIMENSIONS,
  measures: COMMON_MEASURES,
  defaultDimension: "time",
  defaultMeasure: "revenue",
};

export const ANALYTICS_TAB_CATALOG: Record<AnalyticsTabId, AnalyticsTab> = {
  revenue: {
    id: "revenue",
    name: { en: "Revenue", ar: "الإيرادات", tr: "Gelir" },
    description: {
      en: "Recurring revenue, ARPA, refunds.",
      ar: "الإيرادات المتكررة و ARPA والاسترداد.",
      tr: "Tekrarlayan gelir, ARPA, iadeler.",
    },
    color: "emerald",
    icon: "DollarSign",
    widgets: [
      {
        id: "mrr",
        label: { en: "MRR", ar: "الإيرادات الشهرية", tr: "Aylık Gelir" },
        color: "cyan",
        icon: "Repeat",
        value: "$48.2k",
        trend: 8.4,
        sparklineData: spark("revenue.mrr", 48, 12),
      },
      {
        id: "ytd",
        label: { en: "YTD Revenue", ar: "إيرادات السنة", tr: "Yıllık Gelir" },
        color: "violet",
        icon: "TrendingUp",
        value: "$412k",
        trend: 14.1,
        sparklineData: spark("revenue.ytd", 410, 60),
      },
      {
        id: "arpa",
        label: { en: "ARPA", ar: "متوسط الإيراد لكل عميل", tr: "Müşteri Başına Gelir" },
        color: "amber",
        icon: "Coins",
        value: "$324",
        trend: 2.7,
        sparklineData: spark("revenue.arpa", 320, 30),
      },
      {
        id: "refundRate",
        label: { en: "Refund Rate", ar: "نسبة الاسترداد", tr: "İade Oranı" },
        color: "rose",
        icon: "RotateCcw",
        value: "1.8%",
        trend: -0.4,
        sparklineData: spark("revenue.refund", 2, 1.5),
      },
    ],
    pivot: {
      defaultChartType: "area",
      series: [
        { dataKey: "mrr", color: "cyan", label: { en: "MRR", ar: "الإيرادات الشهرية", tr: "Aylık" } },
        { dataKey: "ytd", color: "violet", label: { en: "YTD", ar: "السنة", tr: "Yıllık" } },
        { dataKey: "arpa", color: "amber", label: { en: "ARPA", ar: "ARPA", tr: "ARPA" } },
        { dataKey: "refundRate", color: "rose", label: { en: "Refund %", ar: "الاسترداد", tr: "İade" } },
      ],
      data: pivotData("revenue", [
        { key: "mrr", base: 45, spread: 14 },
        { key: "ytd", base: 380, spread: 80 },
        { key: "arpa", base: 320, spread: 40 },
        { key: "refundRate", base: 2, spread: 1.5 },
      ]),
    },
    viz: STD_VIZ,
  },

  pipeline: {
    id: "pipeline",
    name: { en: "Pipeline", ar: "المسار", tr: "Pipeline" },
    description: {
      en: "Open value, deal size, win rate, stalled.",
      ar: "القيمة المفتوحة وحجم الصفقة ومعدل الفوز.",
      tr: "Açık değer, anlaşma boyutu, kazanma oranı.",
    },
    color: "cyan",
    icon: "TrendingUp",
    widgets: [
      {
        id: "pipelineValue",
        label: { en: "Pipeline Value", ar: "قيمة المسار", tr: "Pipeline Değeri" },
        color: "emerald",
        icon: "DollarSign",
        value: "$1.24M",
        trend: 11.2,
        sparklineData: spark("pipeline.value", 1240, 200),
      },
      {
        id: "avgDealSize",
        label: { en: "Avg Deal Size", ar: "متوسط الصفقة", tr: "Ort. Anlaşma" },
        color: "violet",
        icon: "Target",
        value: "$8.4k",
        trend: 3.1,
        sparklineData: spark("pipeline.avg", 8, 2),
      },
      {
        id: "winRate",
        label: { en: "Win Rate", ar: "معدل الفوز", tr: "Kazanma Oranı" },
        color: "amber",
        icon: "Trophy",
        value: "32.6%",
        trend: 1.8,
        sparklineData: spark("pipeline.win", 32, 8),
      },
      {
        id: "stalled",
        label: { en: "Stalled Deals", ar: "صفقات راكدة", tr: "Bekleyen Anlaşmalar" },
        color: "rose",
        icon: "AlertCircle",
        value: "14",
        trend: -2.0,
        sparklineData: spark("pipeline.stalled", 14, 6),
      },
    ],
    pivot: {
      defaultChartType: "bar",
      series: [
        { dataKey: "pipelineValue", color: "emerald", label: { en: "Open $", ar: "مفتوح", tr: "Açık" } },
        { dataKey: "avgDealSize", color: "violet", label: { en: "Avg Deal", ar: "متوسط", tr: "Ort." } },
        { dataKey: "winRate", color: "amber", label: { en: "Win %", ar: "الفوز", tr: "Kazanma" } },
        { dataKey: "stalled", color: "rose", label: { en: "Stalled", ar: "راكدة", tr: "Bekleyen" } },
      ],
      data: pivotData("pipeline", [
        { key: "pipelineValue", base: 1200, spread: 240 },
        { key: "avgDealSize", base: 8, spread: 3 },
        { key: "winRate", base: 32, spread: 10 },
        { key: "stalled", base: 14, spread: 6 },
      ]),
    },
    viz: STD_VIZ,
  },

  customers: {
    id: "customers",
    name: { en: "Customers", ar: "العملاء", tr: "Müşteriler" },
    description: {
      en: "Active count, new, NPS, churn.",
      ar: "العدد النشط والجدد و NPS والانسحاب.",
      tr: "Aktif sayısı, yeni, NPS, kayıp.",
    },
    color: "violet",
    icon: "Users",
    widgets: [
      {
        id: "totalCustomers",
        label: { en: "Total Customers", ar: "إجمالي العملاء", tr: "Toplam Müşteri" },
        color: "emerald",
        icon: "Users",
        value: "2,431",
        trend: 4.2,
        sparklineData: spark("customers.total", 2400, 200),
      },
      {
        id: "newThisMonth",
        label: { en: "New This Month", ar: "جدد هذا الشهر", tr: "Bu Ay Yeni" },
        color: "cyan",
        icon: "UserPlus",
        value: "147",
        trend: 9.8,
        sparklineData: spark("customers.new", 140, 60),
      },
      {
        id: "nps",
        label: { en: "NPS", ar: "NPS", tr: "NPS" },
        color: "amber",
        icon: "Star",
        value: "62",
        trend: 3.4,
        sparklineData: spark("customers.nps", 60, 14),
      },
      {
        id: "churn",
        label: { en: "Churn", ar: "الانسحاب", tr: "Kayıp" },
        color: "rose",
        icon: "UserMinus",
        value: "2.4%",
        trend: -0.6,
        sparklineData: spark("customers.churn", 2.5, 1.2),
      },
    ],
    pivot: {
      defaultChartType: "line",
      series: [
        { dataKey: "totalCustomers", color: "emerald", label: { en: "Total", ar: "الإجمالي", tr: "Toplam" } },
        { dataKey: "newThisMonth", color: "cyan", label: { en: "New", ar: "جدد", tr: "Yeni" } },
        { dataKey: "nps", color: "amber", label: { en: "NPS", ar: "NPS", tr: "NPS" } },
        { dataKey: "churn", color: "rose", label: { en: "Churn %", ar: "الانسحاب", tr: "Kayıp" } },
      ],
      data: pivotData("customers", [
        { key: "totalCustomers", base: 2350, spread: 240 },
        { key: "newThisMonth", base: 130, spread: 70 },
        { key: "nps", base: 58, spread: 16 },
        { key: "churn", base: 2.5, spread: 1.4 },
      ]),
    },
    viz: STD_VIZ,
  },

  activity: {
    id: "activity",
    name: { en: "Activity", ar: "النشاط", tr: "Etkinlik" },
    description: {
      en: "Calls, emails, meetings, overdue tasks.",
      ar: "المكالمات والبريد والاجتماعات والمهام المتأخرة.",
      tr: "Aramalar, e-postalar, toplantılar, geciken görevler.",
    },
    color: "amber",
    icon: "Activity",
    widgets: [
      {
        id: "calls",
        label: { en: "Calls", ar: "المكالمات", tr: "Aramalar" },
        color: "emerald",
        icon: "Phone",
        value: "342",
        trend: 6.7,
        sparklineData: spark("activity.calls", 340, 80),
      },
      {
        id: "emails",
        label: { en: "Emails Sent", ar: "البريد المرسل", tr: "Gönderilen E-posta" },
        color: "cyan",
        icon: "Mail",
        value: "1,820",
        trend: 4.1,
        sparklineData: spark("activity.emails", 1800, 300),
      },
      {
        id: "meetings",
        label: { en: "Meetings", ar: "الاجتماعات", tr: "Toplantılar" },
        color: "violet",
        icon: "Calendar",
        value: "87",
        trend: 2.3,
        sparklineData: spark("activity.meetings", 85, 30),
      },
      {
        id: "overdue",
        label: { en: "Tasks Overdue", ar: "مهام متأخرة", tr: "Geciken Görevler" },
        color: "rose",
        icon: "Clock",
        value: "23",
        trend: -1.5,
        sparklineData: spark("activity.overdue", 25, 12),
      },
    ],
    pivot: {
      defaultChartType: "bar",
      series: [
        { dataKey: "calls", color: "emerald", label: { en: "Calls", ar: "المكالمات", tr: "Aramalar" } },
        { dataKey: "emails", color: "cyan", label: { en: "Emails", ar: "البريد", tr: "E-posta" } },
        { dataKey: "meetings", color: "violet", label: { en: "Meetings", ar: "الاجتماعات", tr: "Toplantı" } },
        { dataKey: "overdue", color: "rose", label: { en: "Overdue", ar: "متأخرة", tr: "Geciken" } },
      ],
      data: pivotData("activity", [
        { key: "calls", base: 340, spread: 100 },
        { key: "emails", base: 1800, spread: 400 },
        { key: "meetings", base: 85, spread: 40 },
        { key: "overdue", base: 25, spread: 15 },
      ]),
    },
    viz: STD_VIZ,
  },

  deals: {
    id: "deals",
    name: { en: "Deals", ar: "الصفقات", tr: "Anlaşmalar" },
    description: {
      en: "Won, open, sales cycle, lost.",
      ar: "الفائزة والمفتوحة ودورة البيع والخاسرة.",
      tr: "Kazanılan, açık, satış döngüsü, kaybedilen.",
    },
    color: "rose",
    icon: "Briefcase",
    widgets: [
      {
        id: "won",
        label: { en: "Deals Won", ar: "صفقات فائزة", tr: "Kazanılan Anlaşmalar" },
        color: "emerald",
        icon: "Trophy",
        value: "78",
        trend: 12.3,
        sparklineData: spark("deals.won", 78, 24),
      },
      {
        id: "open",
        label: { en: "Deals Open", ar: "صفقات مفتوحة", tr: "Açık Anlaşmalar" },
        color: "cyan",
        icon: "Box",
        value: "152",
        trend: 5.6,
        sparklineData: spark("deals.open", 150, 50),
      },
      {
        id: "cycle",
        label: { en: "Avg Sales Cycle", ar: "متوسط دورة البيع", tr: "Ort. Satış Döngüsü" },
        color: "violet",
        icon: "Clock",
        value: "21d",
        trend: -3.0,
        sparklineData: spark("deals.cycle", 22, 6),
      },
      {
        id: "lost",
        label: { en: "Deals Lost", ar: "صفقات خاسرة", tr: "Kaybedilen Anlaşmalar" },
        color: "amber",
        icon: "XCircle",
        value: "34",
        trend: -2.0,
        sparklineData: spark("deals.lost", 36, 14),
      },
    ],
    pivot: {
      defaultChartType: "bar",
      series: [
        { dataKey: "won", color: "emerald", label: { en: "Won", ar: "فائزة", tr: "Kazanılan" } },
        { dataKey: "open", color: "cyan", label: { en: "Open", ar: "مفتوحة", tr: "Açık" } },
        { dataKey: "cycle", color: "violet", label: { en: "Cycle", ar: "الدورة", tr: "Döngü" } },
        { dataKey: "lost", color: "amber", label: { en: "Lost", ar: "خاسرة", tr: "Kaybedilen" } },
      ],
      data: pivotData("deals", [
        { key: "won", base: 70, spread: 30 },
        { key: "open", base: 150, spread: 60 },
        { key: "cycle", base: 22, spread: 8 },
        { key: "lost", base: 36, spread: 18 },
      ]),
    },
    viz: STD_VIZ,
  },

  team: {
    id: "team",
    name: { en: "Team", ar: "الفريق", tr: "Ekip" },
    description: {
      en: "Top closer, quota, active reps, idle.",
      ar: "أفضل مغلق وحصة الفريق والمندوبون.",
      tr: "En iyi satışçı, kota, aktif temsilciler.",
    },
    color: "lime",
    icon: "UserCog",
    widgets: [
      {
        id: "topCloser",
        label: { en: "Top Closer", ar: "أفضل مغلق", tr: "En İyi Satışçı" },
        color: "cyan",
        icon: "Award",
        value: "Sara A.",
        trend: 0,
        sparklineData: spark("team.topCloser", 50, 15),
      },
      {
        id: "quotaAttainment",
        label: { en: "Avg Quota Attainment", ar: "متوسط تحقيق الحصة", tr: "Ort. Kota" },
        color: "violet",
        icon: "Target",
        value: "84%",
        trend: 5.4,
        sparklineData: spark("team.quota", 82, 18),
      },
      {
        id: "activeReps",
        label: { en: "Active Reps", ar: "مندوبون نشطون", tr: "Aktif Temsilci" },
        color: "amber",
        icon: "Users",
        value: "18",
        trend: 1.0,
        sparklineData: spark("team.active", 18, 4),
      },
      {
        id: "idleReps",
        label: { en: "Idle Reps (>3d)", ar: "مندوبون خاملون", tr: "Boşta Temsilci" },
        color: "rose",
        icon: "UserX",
        value: "3",
        trend: -1.0,
        sparklineData: spark("team.idle", 3, 3),
      },
    ],
    pivot: {
      defaultChartType: "line",
      series: [
        { dataKey: "topCloser", color: "cyan", label: { en: "Top", ar: "الأفضل", tr: "En İyi" } },
        { dataKey: "quotaAttainment", color: "violet", label: { en: "Quota %", ar: "الحصة", tr: "Kota" } },
        { dataKey: "activeReps", color: "amber", label: { en: "Active", ar: "نشط", tr: "Aktif" } },
        { dataKey: "idleReps", color: "rose", label: { en: "Idle", ar: "خامل", tr: "Boşta" } },
      ],
      data: pivotData("team", [
        { key: "topCloser", base: 48, spread: 20 },
        { key: "quotaAttainment", base: 80, spread: 18 },
        { key: "activeReps", base: 18, spread: 5 },
        { key: "idleReps", base: 3, spread: 3 },
      ]),
    },
    viz: STD_VIZ,
  },

  quotes: {
    id: "quotes",
    name: { en: "Quotes", ar: "العروض", tr: "Teklifler" },
    description: {
      en: "Sent, acceptance, time-to-accept, rejected.",
      ar: "المرسل والموافقة ومدة القبول والمرفوض.",
      tr: "Gönderilen, kabul, kabul süresi, reddedilen.",
    },
    color: "sky",
    icon: "FileText",
    widgets: [
      {
        id: "sent",
        label: { en: "Quotes Sent", ar: "عروض مرسلة", tr: "Gönderilen Teklifler" },
        color: "emerald",
        icon: "Send",
        value: "214",
        trend: 7.1,
        sparklineData: spark("quotes.sent", 210, 60),
      },
      {
        id: "acceptance",
        label: { en: "Acceptance Rate", ar: "نسبة القبول", tr: "Kabul Oranı" },
        color: "violet",
        icon: "CheckCheck",
        value: "47%",
        trend: 2.4,
        sparklineData: spark("quotes.acc", 46, 12),
      },
      {
        id: "ttAccept",
        label: { en: "Avg Time to Accept", ar: "متوسط القبول", tr: "Ort. Kabul Süresi" },
        color: "amber",
        icon: "Clock",
        value: "32h",
        trend: -2.5,
        sparklineData: spark("quotes.tta", 32, 12),
      },
      {
        id: "rejected",
        label: { en: "Rejected", ar: "مرفوضة", tr: "Reddedilen" },
        color: "rose",
        icon: "XCircle",
        value: "41",
        trend: -1.2,
        sparklineData: spark("quotes.rej", 40, 18),
      },
    ],
    pivot: {
      defaultChartType: "area",
      series: [
        { dataKey: "sent", color: "emerald", label: { en: "Sent", ar: "مرسل", tr: "Gönderilen" } },
        { dataKey: "acceptance", color: "violet", label: { en: "Accept %", ar: "القبول", tr: "Kabul" } },
        { dataKey: "ttAccept", color: "amber", label: { en: "TTA (h)", ar: "الوقت", tr: "Süre" } },
        { dataKey: "rejected", color: "rose", label: { en: "Rejected", ar: "مرفوض", tr: "Red" } },
      ],
      data: pivotData("quotes", [
        { key: "sent", base: 210, spread: 80 },
        { key: "acceptance", base: 45, spread: 14 },
        { key: "ttAccept", base: 32, spread: 14 },
        { key: "rejected", base: 40, spread: 22 },
      ]),
    },
    viz: STD_VIZ,
  },

  contracts: {
    id: "contracts",
    name: { en: "Contracts", ar: "العقود", tr: "Sözleşmeler" },
    description: {
      en: "Active, renewals, contract value, churned.",
      ar: "النشطة والتجديد وقيمة العقد والمنتهية.",
      tr: "Aktif, yenileme, sözleşme değeri.",
    },
    color: "indigo",
    icon: "FileCheck2",
    widgets: [
      {
        id: "active",
        label: { en: "Active Contracts", ar: "عقود نشطة", tr: "Aktif Sözleşme" },
        color: "emerald",
        icon: "FileCheck2",
        value: "342",
        trend: 3.6,
        sparklineData: spark("contracts.active", 340, 60),
      },
      {
        id: "renewals30",
        label: { en: "Renewals Due 30d", ar: "تجديد خلال 30 يومًا", tr: "30g Yenileme" },
        color: "cyan",
        icon: "Repeat",
        value: "28",
        trend: 1.4,
        sparklineData: spark("contracts.renew", 28, 12),
      },
      {
        id: "avgValue",
        label: { en: "Avg Contract Value", ar: "متوسط قيمة العقد", tr: "Ort. Değer" },
        color: "amber",
        icon: "DollarSign",
        value: "$24.6k",
        trend: 4.0,
        sparklineData: spark("contracts.avg", 24, 8),
      },
      {
        id: "churned",
        label: { en: "Churned", ar: "منتهية", tr: "Kaybedilen" },
        color: "rose",
        icon: "FileX2",
        value: "9",
        trend: -2.1,
        sparklineData: spark("contracts.churn", 10, 5),
      },
    ],
    pivot: {
      defaultChartType: "line",
      series: [
        { dataKey: "active", color: "emerald", label: { en: "Active", ar: "نشط", tr: "Aktif" } },
        { dataKey: "renewals30", color: "cyan", label: { en: "Renewals", ar: "تجديد", tr: "Yenileme" } },
        { dataKey: "avgValue", color: "amber", label: { en: "Avg $", ar: "متوسط", tr: "Ort." } },
        { dataKey: "churned", color: "rose", label: { en: "Churned", ar: "منتهية", tr: "Kayıp" } },
      ],
      data: pivotData("contracts", [
        { key: "active", base: 340, spread: 70 },
        { key: "renewals30", base: 28, spread: 14 },
        { key: "avgValue", base: 24, spread: 10 },
        { key: "churned", base: 10, spread: 6 },
      ]),
    },
    viz: STD_VIZ,
  },

  loyalty: {
    id: "loyalty",
    name: { en: "Loyalty", ar: "الولاء", tr: "Sadakat" },
    description: {
      en: "Members, points, redemption, at-risk.",
      ar: "الأعضاء والنقاط والاستبدال والمعرضين للمخاطر.",
      tr: "Üyeler, puan, kullanım, risk altında.",
    },
    color: "pink",
    icon: "Heart",
    widgets: [
      {
        id: "members",
        label: { en: "Members", ar: "الأعضاء", tr: "Üyeler" },
        color: "emerald",
        icon: "Users",
        value: "5,142",
        trend: 6.3,
        sparklineData: spark("loyalty.members", 5100, 400),
      },
      {
        id: "pointsIssued",
        label: { en: "Points Issued", ar: "نقاط مصدرة", tr: "Verilen Puan" },
        color: "cyan",
        icon: "Sparkles",
        value: "184k",
        trend: 9.2,
        sparklineData: spark("loyalty.points", 180, 40),
      },
      {
        id: "redemption",
        label: { en: "Redemption Rate", ar: "نسبة الاستبدال", tr: "Kullanım Oranı" },
        color: "violet",
        icon: "Gift",
        value: "31%",
        trend: 1.5,
        sparklineData: spark("loyalty.redeem", 30, 10),
      },
      {
        id: "atRisk",
        label: { en: "At-Risk Members", ar: "أعضاء معرضون للمخاطر", tr: "Risk Altında" },
        color: "amber",
        icon: "AlertTriangle",
        value: "127",
        trend: -2.4,
        sparklineData: spark("loyalty.risk", 130, 40),
      },
    ],
    pivot: {
      defaultChartType: "line",
      series: [
        { dataKey: "members", color: "emerald", label: { en: "Members", ar: "أعضاء", tr: "Üye" } },
        { dataKey: "pointsIssued", color: "cyan", label: { en: "Points", ar: "نقاط", tr: "Puan" } },
        { dataKey: "redemption", color: "violet", label: { en: "Redeem %", ar: "استبدال", tr: "Kullanım" } },
        { dataKey: "atRisk", color: "amber", label: { en: "At-Risk", ar: "خطر", tr: "Risk" } },
      ],
      data: pivotData("loyalty", [
        { key: "members", base: 5100, spread: 600 },
        { key: "pointsIssued", base: 180, spread: 60 },
        { key: "redemption", base: 30, spread: 12 },
        { key: "atRisk", base: 130, spread: 60 },
      ]),
    },
    viz: STD_VIZ,
  },

  tax: {
    id: "tax",
    name: { en: "Tax", ar: "الضريبة", tr: "Vergi" },
    description: {
      en: "Collected, invoices, returns, overdue.",
      ar: "المحصلة والفواتير والإقرارات والمتأخرة.",
      tr: "Toplanan, faturalar, iadeler, gecikmiş.",
    },
    color: "yellow",
    icon: "Receipt",
    widgets: [
      {
        id: "vatCollected",
        label: { en: "VAT Collected", ar: "ضريبة محصلة", tr: "Tahsil Edilen KDV" },
        color: "emerald",
        icon: "DollarSign",
        value: "$62.4k",
        trend: 5.8,
        sparklineData: spark("tax.vat", 62, 18),
      },
      {
        id: "invoicesIssued",
        label: { en: "Invoices Issued", ar: "فواتير صادرة", tr: "Düzenlenen Fatura" },
        color: "cyan",
        icon: "FileText",
        value: "1,184",
        trend: 4.4,
        sparklineData: spark("tax.invoices", 1180, 200),
      },
      {
        id: "returns",
        label: { en: "Pending Returns", ar: "إقرارات معلقة", tr: "Bekleyen İade" },
        color: "violet",
        icon: "Clock",
        value: "6",
        trend: 0,
        sparklineData: spark("tax.returns", 6, 3),
      },
      {
        id: "overdueFilings",
        label: { en: "Overdue Filings", ar: "تقديمات متأخرة", tr: "Geciken Beyan" },
        color: "rose",
        icon: "AlertTriangle",
        value: "2",
        trend: -1.0,
        sparklineData: spark("tax.overdue", 2, 2),
      },
    ],
    pivot: {
      defaultChartType: "bar",
      series: [
        { dataKey: "vatCollected", color: "emerald", label: { en: "VAT $", ar: "ضريبة", tr: "KDV" } },
        { dataKey: "invoicesIssued", color: "cyan", label: { en: "Invoices", ar: "فواتير", tr: "Fatura" } },
        { dataKey: "returns", color: "violet", label: { en: "Returns", ar: "إقرارات", tr: "İade" } },
        { dataKey: "overdueFilings", color: "rose", label: { en: "Overdue", ar: "متأخر", tr: "Geciken" } },
      ],
      data: pivotData("tax", [
        { key: "vatCollected", base: 60, spread: 24 },
        { key: "invoicesIssued", base: 1180, spread: 300 },
        { key: "returns", base: 6, spread: 4 },
        { key: "overdueFilings", base: 2, spread: 2 },
      ]),
    },
    viz: STD_VIZ,
  },

  commission: {
    id: "commission",
    name: { en: "Commission", ar: "العمولة", tr: "Komisyon" },
    description: {
      en: "Owed, paid, pending, top earner.",
      ar: "المستحقة والمدفوعة والمعلقة وأعلى مكسب.",
      tr: "Borçlu, ödenen, bekleyen, en yüksek.",
    },
    color: "teal",
    icon: "Coins",
    widgets: [
      {
        id: "totalOwed",
        label: { en: "Total Owed", ar: "إجمالي المستحق", tr: "Toplam Borç" },
        color: "violet",
        icon: "Coins",
        value: "$24.6k",
        trend: 4.1,
        sparklineData: spark("commission.owed", 24, 8),
      },
      {
        id: "paidCycle",
        label: { en: "Paid This Cycle", ar: "مدفوعة هذه الدورة", tr: "Bu Dönem Ödenen" },
        color: "amber",
        icon: "CheckCircle2",
        value: "$18.2k",
        trend: 2.8,
        sparklineData: spark("commission.paid", 18, 6),
      },
      {
        id: "pendingApproval",
        label: { en: "Pending Approval", ar: "بانتظار الموافقة", tr: "Onay Bekliyor" },
        color: "rose",
        icon: "Clock",
        value: "$3.4k",
        trend: -1.5,
        sparklineData: spark("commission.pending", 3, 2),
      },
      {
        id: "topEarner",
        label: { en: "Top Earner", ar: "أعلى مكسب", tr: "En Yüksek Kazanan" },
        color: "sky",
        icon: "Award",
        value: "Omar K.",
        trend: 0,
        sparklineData: spark("commission.top", 12, 4),
      },
    ],
    pivot: {
      defaultChartType: "bar",
      series: [
        { dataKey: "totalOwed", color: "violet", label: { en: "Owed", ar: "مستحق", tr: "Borç" } },
        { dataKey: "paidCycle", color: "amber", label: { en: "Paid", ar: "مدفوع", tr: "Ödenen" } },
        { dataKey: "pendingApproval", color: "rose", label: { en: "Pending", ar: "معلق", tr: "Bekleyen" } },
        { dataKey: "topEarner", color: "sky", label: { en: "Top", ar: "أعلى", tr: "En Yüksek" } },
      ],
      data: pivotData("commission", [
        { key: "totalOwed", base: 24, spread: 10 },
        { key: "paidCycle", base: 18, spread: 8 },
        { key: "pendingApproval", base: 3, spread: 3 },
        { key: "topEarner", base: 12, spread: 5 },
      ]),
    },
    viz: STD_VIZ,
  },

  cashflow: {
    id: "cashflow",
    name: { en: "Cash Flow", ar: "التدفق النقدي", tr: "Nakit Akışı" },
    description: {
      en: "Net, inflow, outflow, runway.",
      ar: "الصافي والداخل والخارج والمدى.",
      tr: "Net, gelen, giden, dayanıklılık.",
    },
    color: "fuchsia",
    icon: "Banknote",
    widgets: [
      {
        id: "net",
        label: { en: "Net Cash Flow", ar: "صافي التدفق", tr: "Net Akış" },
        color: "emerald",
        icon: "TrendingUp",
        value: "$84.2k",
        trend: 7.1,
        sparklineData: spark("cashflow.net", 84, 24),
      },
      {
        id: "inflow",
        label: { en: "Inflow", ar: "الداخل", tr: "Gelen" },
        color: "cyan",
        icon: "ArrowDownRight",
        value: "$248k",
        trend: 5.4,
        sparklineData: spark("cashflow.in", 248, 60),
      },
      {
        id: "outflow",
        label: { en: "Outflow", ar: "الخارج", tr: "Giden" },
        color: "amber",
        icon: "ArrowUpRight",
        value: "$163.8k",
        trend: 3.8,
        sparklineData: spark("cashflow.out", 164, 50),
      },
      {
        id: "runway",
        label: { en: "Runway", ar: "المدى", tr: "Dayanıklılık" },
        color: "lime",
        icon: "Clock",
        value: "14 mo",
        trend: 0.4,
        sparklineData: spark("cashflow.runway", 14, 4),
      },
    ],
    pivot: {
      defaultChartType: "area",
      series: [
        { dataKey: "net", color: "emerald", label: { en: "Net", ar: "صافي", tr: "Net" } },
        { dataKey: "inflow", color: "cyan", label: { en: "In", ar: "داخل", tr: "Gelen" } },
        { dataKey: "outflow", color: "amber", label: { en: "Out", ar: "خارج", tr: "Giden" } },
        { dataKey: "runway", color: "lime", label: { en: "Runway", ar: "مدى", tr: "Süre" } },
      ],
      data: pivotData("cashflow", [
        { key: "net", base: 80, spread: 30 },
        { key: "inflow", base: 248, spread: 80 },
        { key: "outflow", base: 164, spread: 60 },
        { key: "runway", base: 14, spread: 4 },
      ]),
    },
    viz: STD_VIZ,
  },

  campaigns: {
    id: "campaigns",
    name: { en: "Campaigns", ar: "الحملات", tr: "Kampanyalar" },
    description: {
      en: "Active, CTR, spend, ROAS.",
      ar: "النشطة و CTR والإنفاق و ROAS.",
      tr: "Aktif, CTR, harcama, ROAS.",
    },
    color: "orange",
    icon: "Megaphone",
    widgets: [
      {
        id: "active",
        label: { en: "Active Campaigns", ar: "حملات نشطة", tr: "Aktif Kampanya" },
        color: "emerald",
        icon: "Megaphone",
        value: "12",
        trend: 1.0,
        sparklineData: spark("campaigns.active", 12, 4),
      },
      {
        id: "ctr",
        label: { en: "CTR", ar: "نسبة النقر", tr: "Tıklama Oranı" },
        color: "cyan",
        icon: "MousePointerClick",
        value: "3.2%",
        trend: 0.4,
        sparklineData: spark("campaigns.ctr", 3, 1.5),
      },
      {
        id: "spend",
        label: { en: "Spend", ar: "الإنفاق", tr: "Harcama" },
        color: "violet",
        icon: "DollarSign",
        value: "$48.6k",
        trend: 3.7,
        sparklineData: spark("campaigns.spend", 48, 14),
      },
      {
        id: "roas",
        label: { en: "ROAS", ar: "ROAS", tr: "ROAS" },
        color: "rose",
        icon: "TrendingUp",
        value: "4.2x",
        trend: 0.5,
        sparklineData: spark("campaigns.roas", 4, 2),
      },
    ],
    pivot: {
      defaultChartType: "bar",
      series: [
        { dataKey: "active", color: "emerald", label: { en: "Active", ar: "نشط", tr: "Aktif" } },
        { dataKey: "ctr", color: "cyan", label: { en: "CTR %", ar: "النقر", tr: "Tıklama" } },
        { dataKey: "spend", color: "violet", label: { en: "Spend", ar: "إنفاق", tr: "Harcama" } },
        { dataKey: "roas", color: "rose", label: { en: "ROAS", ar: "ROAS", tr: "ROAS" } },
      ],
      data: pivotData("campaigns", [
        { key: "active", base: 12, spread: 5 },
        { key: "ctr", base: 3, spread: 1.6 },
        { key: "spend", base: 48, spread: 18 },
        { key: "roas", base: 4, spread: 2 },
      ]),
    },
    viz: STD_VIZ,
  },
};

export function getTab(id: AnalyticsTabId): AnalyticsTab | undefined {
  return ANALYTICS_TAB_CATALOG[id];
}

export function isAnalyticsTabId(value: string): value is AnalyticsTabId {
  return value in ANALYTICS_TAB_CATALOG;
}

// Mock viz data: returns deterministic { x, y } points for a (tabId, dim, measure, filters) combo.
// Filter strings are folded into the seed so toggling filters changes the chart visibly.
export function getVizData(
  tabId: AnalyticsTabId,
  dimension: string,
  measure: string,
  filters: string[],
): { x: string; y: number }[] {
  const seed = seedFromString(`${tabId}.${dimension}.${measure}.${filters.join("|")}`);
  const r = rng(seed);
  const buckets = (() => {
    if (dimension === "time") return MONTHS;
    if (dimension === "country") return ["SA", "AE", "TR", "EG", "QA", "KW", "US"];
    if (dimension === "stage") return ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"];
    return ["SMB", "Mid", "Enterprise", "Public", "Other"];
  })();
  const baseByMeasure: Record<string, [number, number]> = {
    revenue: [80, 60],
    count: [120, 60],
    avg: [42, 24],
    sum: [240, 120],
  };
  const [base, spread] = baseByMeasure[measure] ?? [50, 30];
  return buckets.map((b) => ({
    x: b,
    y: Math.max(0, Math.round(base + (r() - 0.4) * spread)),
  }));
}
