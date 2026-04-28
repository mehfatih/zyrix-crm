"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PublicLayout from "@/components/public/PublicLayout";
import {
  Map as MapIcon,
  Home,
  LayoutDashboard,
  Users,
  Briefcase,
  MessageCircle,
  MessageSquare,
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
  CheckSquare,
  Activity,
  Settings,
  Shield,
  Code2,
  BookOpen,
  Lock,
  UserCircle,
  Package,
  Building2,
  Globe,
  ArrowRight,
  GitBranch,
  Sparkles as SparklesIcon,
} from "lucide-react";

// ============================================================================
// INTERACTIVE ANIMATED SITEMAP
// ============================================================================

type NodeCategory =
  | "marketing"
  | "product"
  | "admin"
  | "portal"
  | "resources";

interface MapNode {
  id: string;
  label: { en: string; ar: string; tr: string };
  href: string;
  Icon: typeof Home;
  category: NodeCategory;
  description?: { en: string; ar: string; tr: string };
}

const CATEGORIES: Record<
  NodeCategory,
  {
    label: { en: string; ar: string; tr: string };
    gradient: string;
    color: string;
    ring: string;
    Icon: typeof Home;
  }
> = {
  marketing: {
    label: { en: "Marketing", ar: "التسويق", tr: "Pazarlama" },
    gradient: "from-sky-400 to-sky-600",
    color: "text-sky-500",
    ring: "ring-sky-300",
    Icon: Globe,
  },
  product: {
    label: { en: "Product (App)", ar: "المنتج (التطبيق)", tr: "Ürün (Uygulama)" },
    gradient: "from-emerald-500 to-teal-600",
    color: "text-emerald-600",
    ring: "ring-emerald-400",
    Icon: Package,
  },
  admin: {
    label: { en: "Admin", ar: "الإدارة", tr: "Yönetim" },
    gradient: "from-violet-500 to-purple-600",
    color: "text-violet-600",
    ring: "ring-violet-400",
    Icon: Shield,
  },
  portal: {
    label: { en: "Customer Portal", ar: "بوابة العملاء", tr: "Müşteri Portalı" },
    gradient: "from-amber-500 to-orange-600",
    color: "text-amber-600",
    ring: "ring-amber-400",
    Icon: UserCircle,
  },
  resources: {
    label: { en: "Resources", ar: "المصادر", tr: "Kaynaklar" },
    gradient: "from-indigo-500 to-blue-600",
    color: "text-indigo-600",
    ring: "ring-indigo-400",
    Icon: BookOpen,
  },
};

const NODES: MapNode[] = [
  // MARKETING
  { id: "home", category: "marketing", Icon: Home, href: "/", label: { en: "Home", ar: "الرئيسية", tr: "Ana sayfa" } },
  { id: "features", category: "marketing", Icon: SparklesIcon, href: "/features", label: { en: "Features", ar: "المميزات", tr: "Özellikler" } },
  { id: "pricing", category: "marketing", Icon: DollarSign, href: "/pricing", label: { en: "Pricing", ar: "الأسعار", tr: "Fiyatlandırma" } },
  { id: "about", category: "marketing", Icon: Building2, href: "/about", label: { en: "About", ar: "من نحن", tr: "Hakkımızda" } },
  { id: "contact", category: "marketing", Icon: Mail, href: "/contact", label: { en: "Contact", ar: "تواصل", tr: "İletişim" } },

  // PRODUCT (app)
  { id: "dashboard", category: "product", Icon: LayoutDashboard, href: "/dashboard", label: { en: "Dashboard", ar: "لوحة التحكم", tr: "Panel" } },
  { id: "customers", category: "product", Icon: Users, href: "/customers", label: { en: "Customers", ar: "العملاء", tr: "Müşteriler" } },
  { id: "deals", category: "product", Icon: Briefcase, href: "/deals", label: { en: "Deals", ar: "الصفقات", tr: "Anlaşmalar" } },
  { id: "pipeline", category: "product", Icon: Activity, href: "/pipeline", label: { en: "Pipeline", ar: "خط المبيعات", tr: "Huni" } },
  { id: "quotes", category: "product", Icon: FileText, href: "/quotes", label: { en: "Quotes", ar: "العروض", tr: "Teklifler" } },
  { id: "contracts", category: "product", Icon: FileSignature, href: "/contracts", label: { en: "Contracts", ar: "العقود", tr: "Sözleşmeler" } },
  { id: "loyalty", category: "product", Icon: Award, href: "/loyalty", label: { en: "Loyalty", ar: "الولاء", tr: "Sadakat" } },
  { id: "tax", category: "product", Icon: Percent, href: "/tax", label: { en: "Tax Engine", ar: "محرك الضرائب", tr: "Vergi Motoru" } },
  { id: "commission", category: "product", Icon: DollarSign, href: "/commission", label: { en: "Commission", ar: "العمولات", tr: "Komisyon" } },
  { id: "cashflow", category: "product", Icon: TrendingUp, href: "/cashflow", label: { en: "Cash Flow", ar: "التدفق النقدي", tr: "Nakit Akışı" } },
  { id: "reports", category: "product", Icon: BarChart3, href: "/reports", label: { en: "Reports", ar: "التقارير", tr: "Raporlar" } },
  { id: "followup", category: "product", Icon: Bell, href: "/followup", label: { en: "Follow-up", ar: "المتابعة", tr: "Takip" } },
  { id: "campaigns", category: "product", Icon: Mail, href: "/campaigns", label: { en: "Campaigns", ar: "الحملات", tr: "Kampanyalar" } },
  { id: "ai-cfo", category: "product", Icon: Sparkles, href: "/ai-cfo", label: { en: "AI CFO", ar: "المدير المالي الذكي", tr: "AI CFO" } },
  { id: "tasks", category: "product", Icon: CheckSquare, href: "/tasks", label: { en: "Tasks", ar: "المهام", tr: "Görevler" } },
  { id: "chat", category: "product", Icon: MessageSquare, href: "/chat", label: { en: "Team Chat", ar: "دردشة الفريق", tr: "Ekip Sohbeti" } },
  { id: "whatsapp", category: "product", Icon: MessageCircle, href: "/whatsapp", label: { en: "WhatsApp", ar: "واتساب", tr: "WhatsApp" } },
  { id: "settings", category: "product", Icon: Settings, href: "/settings", label: { en: "Settings", ar: "الإعدادات", tr: "Ayarlar" } },

  // ADMIN
  { id: "admin-home", category: "admin", Icon: LayoutDashboard, href: "/admin", label: { en: "Admin Dashboard", ar: "لوحة الإدارة", tr: "Yönetim Paneli" } },
  { id: "admin-companies", category: "admin", Icon: Building2, href: "/admin/companies", label: { en: "Companies", ar: "الشركات", tr: "Şirketler" } },
  { id: "admin-users", category: "admin", Icon: Users, href: "/admin/users", label: { en: "Users", ar: "المستخدمون", tr: "Kullanıcılar" } },
  { id: "admin-plans", category: "admin", Icon: Package, href: "/admin/plans", label: { en: "Plans", ar: "الخطط", tr: "Planlar" } },
  { id: "admin-support", category: "admin", Icon: MessageCircle, href: "/admin/support", label: { en: "Support Tickets", ar: "تذاكر الدعم", tr: "Destek Biletleri" } },

  // PORTAL
  { id: "portal-login", category: "portal", Icon: Lock, href: "/portal", label: { en: "Portal Login", ar: "دخول البوابة", tr: "Portal Girişi" } },
  { id: "portal-dashboard", category: "portal", Icon: LayoutDashboard, href: "/portal/dashboard", label: { en: "Portal Dashboard", ar: "لوحة البوابة", tr: "Portal Paneli" } },

  // RESOURCES
  { id: "blog", category: "resources", Icon: BookOpen, href: "/blog", label: { en: "Blog", ar: "المدوّنة", tr: "Blog" } },
  { id: "changelog", category: "resources", Icon: GitBranch, href: "/changelog", label: { en: "Changelog", ar: "سجل التحديثات", tr: "Değişiklik günlüğü" } },
  { id: "docs", category: "resources", Icon: BookOpen, href: "/docs", label: { en: "Documentation", ar: "الوثائق", tr: "Dokümantasyon" } },
  { id: "api", category: "resources", Icon: Code2, href: "/api-reference", label: { en: "API Reference", ar: "مرجع API", tr: "API Referansı" } },
  { id: "status", category: "resources", Icon: Activity, href: "/status", label: { en: "System Status", ar: "حالة النظام", tr: "Sistem Durumu" } },
  { id: "security", category: "resources", Icon: Shield, href: "/security", label: { en: "Security", ar: "الأمان", tr: "Güvenlik" } },
  { id: "privacy", category: "resources", Icon: Lock, href: "/privacy", label: { en: "Privacy", ar: "الخصوصية", tr: "Gizlilik" } },
  { id: "terms", category: "resources", Icon: FileText, href: "/terms", label: { en: "Terms", ar: "الشروط", tr: "Şartlar" } },
];

export default function SitemapPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const L = locale as "en" | "ar" | "tr";

  const [filter, setFilter] = useState<NodeCategory | "all">("all");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const copy = {
    en: {
      badge: "Site Map",
      title: "Every page in Zyrix, mapped",
      subtitle:
        "An interactive diagram of the entire platform. Tap any node to jump there directly.",
      filterAll: "All sections",
      totalPages: "total pages",
      searchHint: "Hover over any node to see details. Click to navigate.",
      categories: {
        marketing: "Public marketing pages",
        product: "Main CRM application",
        admin: "Super-admin tools",
        portal: "Customer-facing portal",
        resources: "Documentation & legal",
      },
    },
    ar: {
      badge: "خريطة الموقع",
      title: "كل صفحة في Zyrix، مُخطَّطة",
      subtitle:
        "مخطط تفاعلي لكامل المنصة. اضغط على أي عقدة للانتقال إليها مباشرة.",
      filterAll: "جميع الأقسام",
      totalPages: "إجمالي الصفحات",
      searchHint: "مرّر فوق أي عقدة لرؤية التفاصيل. اضغط للانتقال.",
      categories: {
        marketing: "صفحات التسويق العامة",
        product: "تطبيق CRM الرئيسي",
        admin: "أدوات المسؤول الأعلى",
        portal: "بوابة العملاء",
        resources: "الوثائق والقانون",
      },
    },
    tr: {
      badge: "Site Haritası",
      title: "Zyrix'teki her sayfa, haritada",
      subtitle:
        "Tüm platformun etkileşimli diyagramı. Doğrudan gitmek için herhangi bir düğüme dokunun.",
      filterAll: "Tüm bölümler",
      totalPages: "toplam sayfa",
      searchHint: "Detayları görmek için herhangi bir düğümün üzerine gelin. Gitmek için tıklayın.",
      categories: {
        marketing: "Genel pazarlama sayfaları",
        product: "Ana CRM uygulaması",
        admin: "Süper yönetici araçları",
        portal: "Müşteri portalı",
        resources: "Dokümantasyon & yasal",
      },
    },
  };
  const t = copy[L];

  const filteredNodes = useMemo(() => {
    if (filter === "all") return NODES;
    return NODES.filter((n) => n.category === filter);
  }, [filter]);

  const countByCategory = useMemo(() => {
    const map: Record<NodeCategory, number> = {
      marketing: 0,
      product: 0,
      admin: 0,
      portal: 0,
      resources: 0,
    };
    NODES.forEach((n) => {
      map[n.category]++;
    });
    return map;
  }, []);

  const linkify = (href: string) => {
    if (href === "/") return `/${locale}`;
    return `/${locale}${href}`;
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-200 rounded-full mb-4">
            <MapIcon className="w-3.5 h-3.5" />
            {t.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-10">
          <FilterChip
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label={t.filterAll}
            count={NODES.length}
            color="slate"
            Icon={MapIcon}
          />
          {(Object.keys(CATEGORIES) as NodeCategory[]).map((cat) => {
            const c = CATEGORIES[cat];
            return (
              <FilterChip
                key={cat}
                active={filter === cat}
                onClick={() => setFilter(cat)}
                label={c.label[L]}
                count={countByCategory[cat]}
                color={cat}
                Icon={c.Icon}
              />
            );
          })}
        </div>

        {/* Central radial diagram */}
        <div className="relative mb-12 min-h-[880px] md:min-h-[1020px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-sky-50/40 border border-slate-200 shadow-inner">
          <RadialMap
            nodes={filteredNodes}
            locale={L}
            hoveredNode={hoveredNode}
            setHoveredNode={setHoveredNode}
            linkify={linkify}
          />
          <p className="text-center text-xs text-slate-400 pb-4">
            {t.searchHint}
          </p>
        </div>

        {/* Category grids (below radial for clarity / fallback on mobile) */}
        <div className="space-y-10">
          {(Object.keys(CATEGORIES) as NodeCategory[])
            .filter((cat) => filter === "all" || filter === cat)
            .map((cat) => {
              const c = CATEGORIES[cat];
              const CIcon = c.Icon;
              const nodes = NODES.filter((n) => n.category === cat);
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} text-white flex items-center justify-center shadow-lg`}
                    >
                      <CIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {c.label[L]}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {t.categories[cat]} · {nodes.length} {t.totalPages}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {nodes.map((n) => {
                      const Icon = n.Icon;
                      return (
                        <Link
                          key={n.id}
                          href={linkify(n.href)}
                          className="group bg-card border border-slate-200 hover:border-slate-300 rounded-xl p-3 flex items-center gap-2.5 transition-all hover:shadow-md"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.gradient} bg-opacity-10 ${c.color} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 flex-1 truncate">
                            {n.label[L]}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 flex-shrink-0 ltr:translate-x-0 rtl:-scale-x-100 transition-transform" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </PublicLayout>
  );
}

// ============================================================================
// Radial animated map
// ============================================================================
function RadialMap({
  nodes,
  locale,
  hoveredNode,
  setHoveredNode,
  linkify,
}: {
  nodes: MapNode[];
  locale: "en" | "ar" | "tr";
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
  linkify: (href: string) => string;
}) {
  // Layout: group nodes by category on rings around center
  const centerX = 50; // percent
  const centerY = 50;

  // Angular position for each node, based on category and index within category
  const { positions, centerCategory } = useMemo(() => {
    // First pass: assign angle ranges per category present
    const presentCats: NodeCategory[] = [];
    const byCat: Record<string, MapNode[]> = {};
    for (const n of nodes) {
      if (!byCat[n.category]) {
        byCat[n.category] = [];
        presentCats.push(n.category);
      }
      byCat[n.category].push(n);
    }

    const catCount = presentCats.length;
    const positions: Record<
      string,
      { x: number; y: number; ring: number; angleDeg: number }
    > = {};

    const anglePerCat = 360 / Math.max(catCount, 1);

    presentCats.forEach((cat, catIdx) => {
      const catNodes = byCat[cat];
      const catStart = catIdx * anglePerCat - 90; // start at top
      const catEnd = catStart + anglePerCat;
      const catSpan = catEnd - catStart;
      const ring = 1;
      // Use multiple rings if too many in category — smaller perRing
      // creates more rings (taller stack of concentric circles) which
      // gives each individual node more breathing room. Previously the
      // Math.sqrt formula packed most nodes into the first ring; now
      // we cap at 4 per ring so densely-populated categories (like
      // 'product' with 15+ items) spread across 4+ outer rings.
      const perRing = Math.min(4, Math.ceil(catNodes.length / 2));

      catNodes.forEach((n, i) => {
        const r = (i % perRing === 0 && i > 0) ? ring + 1 : ring;
        const positionsInRing = Math.ceil(catNodes.length / perRing);
        const localI = i;
        const angle =
          catStart +
          (catSpan / (catNodes.length + 1)) * (localI + 1);
        const rad = (angle * Math.PI) / 180;
        // Wider radius spacing: 30% (inner) + 12% per additional ring
        // — was 24% + 10%. This pushes nodes farther out so labels
        // below them don't collide with labels of adjacent nodes.
        const radiusPct = 30 + (Math.floor(i / perRing) * 12);
        positions[n.id] = {
          x: centerX + radiusPct * Math.cos(rad),
          y: centerY + radiusPct * Math.sin(rad),
          ring: r,
          angleDeg: angle,
        };
      });
    });

    return { positions, centerCategory: presentCats[0] || "marketing" };
  }, [nodes]);

  return (
    <div className="relative w-full h-[860px] md:h-[980px]">
      {/* SVG connecting lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="bg-glow">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Center glow */}
        <circle cx="50" cy="50" r="20" fill="url(#bg-glow)" />
        <circle cx="50" cy="50" r="35" fill="url(#bg-glow)" opacity="0.5" />

        {/* Lines from center to each node */}
        {nodes.map((n) => {
          const pos = positions[n.id];
          if (!pos) return null;
          const cat = CATEGORIES[n.category];
          return (
            <line
              key={n.id}
              x1={centerX}
              y1={centerY}
              x2={pos.x}
              y2={pos.y}
              stroke="url(#line-gradient)"
              strokeWidth="0.15"
              className={
                hoveredNode === n.id
                  ? "opacity-100 transition-opacity"
                  : "opacity-30 transition-opacity"
              }
            />
          );
        })}

        {/* Pulsing ring at center */}
        <circle
          cx="50"
          cy="50"
          r="4"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="0.3"
          opacity="0.5"
        >
          <animate
            attributeName="r"
            from="4"
            to="20"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.5"
            to="0"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="50"
          cy="50"
          r="4"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="0.3"
          opacity="0.5"
        >
          <animate
            attributeName="r"
            from="4"
            to="20"
            dur="3s"
            begin="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.5"
            to="0"
            dur="3s"
            begin="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Center node (Zyrix logo) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
        style={{ left: `${centerX}%`, top: `${centerY}%` }}
      >
        <Link
          href={`/${locale}`}
          className="group w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow-2xl shadow-sky-400/40 hover:scale-110 transition-transform"
        >
          <div className="flex flex-col items-center">
            <MapIcon className="w-7 h-7" />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
              Zyrix
            </span>
          </div>
        </Link>
      </div>

      {/* Nodes */}
      {nodes.map((n, idx) => {
        const pos = positions[n.id];
        if (!pos) return null;
        const cat = CATEGORIES[n.category];
        const Icon = n.Icon;
        const isHovered = hoveredNode === n.id;
        // Stagger appearance slightly for a reveal effect
        const delay = (idx * 30) % 500;

        return (
          <Link
            key={n.id}
            href={linkify(n.href)}
            onMouseEnter={() => setHoveredNode(n.id)}
            onMouseLeave={() => setHoveredNode(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              animation: `sitemapNodeIn 600ms ${delay}ms ease-out backwards`,
            }}
          >
            <div
              className={`relative flex flex-col items-center transition-all ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            >
              {/* Node circle */}
              <div
                className={`w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-lg transition-all ${
                  isHovered ? `ring-2 ring-offset-2 ${cat.ring} shadow-xl` : ""
                }`}
              >
                <Icon className="w-5 h-5" />
                {/* Pulse */}
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${cat.gradient} opacity-50 animate-ping`}
                  style={{ animationDuration: `${2 + (idx % 3)}s` }}
                />
              </div>

              {/* Label — rendered as a compact chip on a white pill
                  so it stays readable even when another node's circle
                  sits behind it. Drop-shadow adds separation from the
                  gradient background. */}
              <span
                className={`absolute top-full mt-2 px-2 py-0.5 rounded-md bg-card/95 backdrop-blur-sm border border-slate-200/60 text-[10px] md:text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                  isHovered
                    ? `${cat.color} scale-110 border-current/30`
                    : "text-slate-700 group-hover:text-slate-900 group-hover:border-slate-300"
                }`}
              >
                {n.label[locale]}
              </span>
            </div>
          </Link>
        );
      })}

      <style jsx>{`
        @keyframes sitemapNodeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  color,
  Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color: NodeCategory | "slate";
  Icon: typeof Home;
}) {
  const colors: Record<string, { active: string; inactive: string }> = {
    marketing: {
      active: "bg-sky-500 text-white ring-sky-300",
      inactive: "bg-card text-slate-700 hover:bg-sky-50 ring-slate-200",
    },
    product: {
      active: "bg-emerald-600 text-white ring-emerald-400",
      inactive: "bg-card text-slate-700 hover:bg-emerald-50 ring-slate-200",
    },
    admin: {
      active: "bg-violet-600 text-white ring-violet-400",
      inactive: "bg-card text-slate-700 hover:bg-violet-50 ring-slate-200",
    },
    portal: {
      active: "bg-amber-600 text-white ring-amber-400",
      inactive: "bg-card text-slate-700 hover:bg-amber-50 ring-slate-200",
    },
    resources: {
      active: "bg-indigo-600 text-white ring-indigo-400",
      inactive: "bg-card text-slate-700 hover:bg-indigo-50 ring-slate-200",
    },
    slate: {
      active: "bg-slate-800 text-white ring-slate-400",
      inactive: "bg-card text-slate-700 hover:bg-slate-100 ring-slate-200",
    },
  };
  const c = colors[color];
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border ring-1 transition-all ${
        active ? c.active : c.inactive
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      <span
        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
          active ? "bg-white/20" : "bg-slate-100"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
