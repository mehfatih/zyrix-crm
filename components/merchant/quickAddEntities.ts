import {
  AlertTriangle,
  BarChart3,
  Briefcase,
  Building2,
  CheckSquare,
  FileEdit,
  Gift,
  Lightbulb,
  Mail,
  MessageCircle,
  Notebook,
  QrCode,
  Send,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Ticket,
  Users,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface QuickAddEntity {
  id: string;
  labelKey: string;
  icon: LucideIcon;
  accent: string;
  shortcut: string;
  target: string;
}

export const QUICK_ADD_ENTITIES: QuickAddEntity[] = [
  // Row 1
  {
    id: "contact",
    labelKey: "contact",
    icon: Users,
    accent: "#34D399",
    shortcut: "C+O",
    target: "contacts",
  },
  {
    id: "company",
    labelKey: "company",
    icon: Building2,
    accent: "#7DD3FC",
    shortcut: "C+M",
    target: "companies",
  },
  {
    id: "deal",
    labelKey: "deal",
    icon: Briefcase,
    accent: "#FB7185",
    shortcut: "C+D",
    target: "deals",
  },
  {
    id: "task",
    labelKey: "task",
    icon: CheckSquare,
    accent: "#A78BFA",
    shortcut: "C+T",
    target: "tasks",
  },
  // Row 2
  {
    id: "ticket",
    labelKey: "ticket",
    icon: Ticket,
    accent: "#F9A8D4",
    shortcut: "C+K",
    target: "tickets",
  },
  {
    id: "email",
    labelKey: "email",
    icon: Mail,
    accent: "#FDBA74",
    shortcut: "C+E",
    target: "marketing-email",
  },
  {
    id: "note",
    labelKey: "note",
    icon: Notebook,
    accent: "#FCD34D",
    shortcut: "C+N",
    target: "feeds",
  },
  {
    id: "meeting",
    labelKey: "meeting",
    icon: Video,
    accent: "#5EEAD4",
    shortcut: "C+G",
    target: "meeting-links",
  },
  // Row 3
  {
    id: "campaign",
    labelKey: "campaign",
    icon: Send,
    accent: "#FB7185",
    shortcut: "C+P",
    target: "marketing-email",
  },
  {
    id: "segment",
    labelKey: "segment",
    icon: Target,
    accent: "#A78BFA",
    shortcut: "C+S",
    target: "segments",
  },
  {
    id: "report",
    labelKey: "report",
    icon: BarChart3,
    accent: "#7DD3FC",
    shortcut: "C+R",
    target: "dashboards",
  },
  {
    id: "scan",
    labelKey: "scan",
    icon: QrCode,
    accent: "#34D399",
    shortcut: "C+Q",
    target: "contacts",
  },
];

export interface RecommendationIconDef {
  icon: LucideIcon;
}

export const RECOMMENDATION_ICONS: Record<string, LucideIcon> = {
  overdue_task: MessageCircle,
  hot_lead: Zap,
  revenue_forecast: TrendingUp,
  team_celebration: Star,
  stalling_deal: AlertTriangle,
  customer_anniversary: Gift,
  insight_discovery: Lightbulb,
  default: Sparkles,
  write_message: FileEdit,
};
