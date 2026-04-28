"use client";

import { useTranslations } from "next-intl";
import {
  ArrowUpRight,
  MessageSquare,
  Users,
  Zap,
  Clock,
  CheckCheck,
  Sparkles,
  Bot,
} from "lucide-react";

/**
 * Place at: components/experience/LiveDashboard.tsx
 *
 * Sprint 11 — Live Dashboard section (between Testimonials and FinalCTA).
 * Renders a CRM dashboard mockup with diversified KPI colors
 * (emerald / amber / purple / cyan + rose chart accent) to break
 * the persistent purple/blue motif of Sprint 8–10.
 */

// ============================================================
// Color tones — each KPI gets its own to break the monotony
// ============================================================
type Tone = "emerald" | "amber" | "purple" | "cyan";
const TONE_BG: Record<Tone, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 ring-emerald-400/20",
  amber: "bg-amber-500/10 text-amber-400 ring-amber-400/20",
  purple: "bg-purple-500/10 text-purple-400 ring-purple-400/20",
  cyan: "bg-cyan-500/10 text-cyan-400 ring-cyan-400/20",
};

// ============================================================
// KPI card
// ============================================================
const KPI = ({
  icon: Icon,
  label,
  value,
  delta,
  tone,
}: {
  icon: typeof MessageSquare;
  label: string;
  value: string;
  delta: string;
  tone: Tone;
}) => (
  <div className="rounded-xl bg-card/60 border border-border/60 p-3.5 backdrop-blur-sm">
    <div className="flex items-center justify-between">
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ring-1 ${TONE_BG[tone]}`}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
      </span>
      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-400">
        <ArrowUpRight className="w-3 h-3" /> {delta}
      </span>
    </div>
    <div className="mt-2.5 text-[11px] text-muted-foreground">{label}</div>
    <div className="mt-0.5 text-lg font-semibold text-foreground tracking-tight tabular-nums">
      {value}
    </div>
  </div>
);

// ============================================================
// Chart — rose/pink accent (breaks the blue/purple)
// ============================================================
const ChartCard = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  const path =
    "M5,70 C25,60 40,68 55,55 C70,42 85,48 100,38 C115,28 130,32 145,24 C160,18 175,22 190,16 C205,10 220,14 235,10";
  const area = `${path} L235,90 L5,90 Z`;
  const bars = [40, 55, 35, 70, 50, 80, 65];

  return (
    <div className="rounded-xl bg-card/60 border border-border/60 p-4 col-span-2 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] text-muted-foreground">{title}</div>
          <div className="text-base font-semibold text-foreground tracking-tight">
            {subtitle}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted/40 text-muted-foreground border border-border/60">
            7d
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-foreground text-background">
            30d
          </span>
        </div>
      </div>

      <div className="mt-2 relative">
        <svg viewBox="0 0 240 95" className="w-full h-[110px]">
          <defs>
            <linearGradient id="ld-rose-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
            </linearGradient>
            <filter id="ld-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[20, 40, 60, 80].map((y) => (
            <line
              key={y}
              x1="0"
              x2="240"
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeDasharray="2 4"
            />
          ))}

          <path d={area} fill="url(#ld-rose-fill)" />
          <path
            d={path}
            fill="none"
            stroke="#f472b6"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#ld-glow)"
          />

          {[
            [55, 55],
            [100, 38],
            [145, 24],
            [190, 16],
            [235, 10],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="5" fill="#f472b6" opacity="0.18" />
              <circle cx={x} cy={y} r="2.2" fill="#f472b6" />
            </g>
          ))}
        </svg>

        <div className="mt-2 flex items-end gap-1.5 h-8">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-pink-400/20 to-pink-400/60"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Conversation — emerald (WhatsApp green)
// ============================================================
const ConversationCard = ({
  who,
  status,
  channel,
  ago,
  inbound,
  outbound,
  badges,
}: {
  who: string;
  status: string;
  channel: string;
  ago: string;
  inbound: string;
  outbound: string;
  badges: string[];
}) => (
  <div className="rounded-xl bg-card/60 border border-border/60 p-3.5 col-span-2 backdrop-blur-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/20 grid place-items-center">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div>
          <div className="text-[12px] font-medium text-foreground leading-tight">
            {who}
          </div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {status} · {channel}
          </div>
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground">{ago}</span>
    </div>

    <div className="mt-3 space-y-1.5">
      <div className="max-w-[78%] text-[11px] bg-muted/40 text-foreground rounded-2xl rounded-tl-sm px-2.5 py-1.5">
        {inbound}
      </div>
      <div className="ms-auto max-w-[78%] text-[11px] bg-emerald-500/10 text-foreground rounded-2xl rounded-tr-sm px-2.5 py-1.5 flex items-center gap-1.5 ring-1 ring-emerald-400/15">
        <Bot className="w-3 h-3 text-emerald-400 shrink-0" />
        <span className="flex-1">{outbound}</span>
        <CheckCheck className="w-3 h-3 text-emerald-400 ms-auto shrink-0" />
      </div>
    </div>

    <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
      {badges.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 text-[9.5px] text-muted-foreground border border-border/60 rounded-full px-1.5 py-0.5"
        >
          <span className="w-1 h-1 rounded-full bg-emerald-400" /> {t}
        </span>
      ))}
    </div>
  </div>
);

// ============================================================
// Micro badges — diversified colors
// ============================================================
const MicroBadges = ({ labels }: { labels: string[] }) => {
  const styles = [
    "text-purple-400 bg-purple-500/10 ring-purple-400/20",
    "text-amber-400 bg-amber-500/10 ring-amber-400/20",
    "text-emerald-400 bg-emerald-500/10 ring-emerald-400/20",
    "text-cyan-400 bg-cyan-500/10 ring-cyan-400/20",
  ];
  const icons = [Sparkles, Zap, MessageSquare, Clock];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {labels.map((t, i) => {
        const Icon = icons[i % icons.length];
        return (
          <span
            key={t}
            className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ring-1 ${styles[i % styles.length]}`}
          >
            <Icon className="w-3 h-3" />
            {t}
          </span>
        );
      })}
    </div>
  );
};

// ============================================================
// Main section
// ============================================================
export const LiveDashboard = () => {
  const t = useTranslations("Landing.liveDashboard");

  return (
    <section
      id="dashboard"
      className="relative py-24 md:py-28 overflow-hidden section-blend-top section-blend-bottom"
    >
      <div className="container relative">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="reveal text-xs uppercase tracking-[0.2em] text-primary font-medium mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="reveal text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            {t("title")}{" "}
            <span className="text-gradient">{t("titleEmphasis")}</span>
          </h2>
          <p className="reveal text-muted-foreground" data-stagger="120">
            {t("subtitle")}
          </p>
        </div>

        {/* Mockup container */}
        <div className="reveal relative max-w-[680px] mx-auto" data-stagger="200">
          {/* Soft glow underneath — pink/rose to break the blue */}
          <div
            aria-hidden
            className="absolute -inset-10 -z-10 blur-3xl opacity-50 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 60%, rgba(244,114,182,0.25), transparent 70%)",
            }}
          />

          <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-muted/20">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <div className="text-[10px] text-muted-foreground tracking-wide font-mono">
                {t("urlBar")}
              </div>
              <div className="w-10" />
            </div>

            {/* Header row */}
            <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="text-[11px] text-muted-foreground">
                  {t("today")}
                </div>
                <div className="text-sm font-semibold text-foreground tracking-tight">
                  {t("liveOverview")}
                </div>
              </div>
              <MicroBadges
                labels={[
                  t("badgeAi"),
                  t("badgeAutomation"),
                  t("badgeWhatsapp"),
                  t("badgeSpeed"),
                ]}
              />
            </div>

            {/* Grid: 4 KPIs + chart + conversation */}
            <div className="p-4 pt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPI
                icon={MessageSquare}
                label={t("kpiMessagesLabel")}
                value={t("kpiMessagesValue")}
                delta="+12.4%"
                tone="emerald"
              />
              <KPI
                icon={Users}
                label={t("kpiLeadsLabel")}
                value={t("kpiLeadsValue")}
                delta="+8.1%"
                tone="amber"
              />
              <KPI
                icon={Zap}
                label={t("kpiConversionLabel")}
                value={t("kpiConversionValue")}
                delta="+3.2%"
                tone="purple"
              />
              <KPI
                icon={Clock}
                label={t("kpiResponseLabel")}
                value={t("kpiResponseValue")}
                delta="−22%"
                tone="cyan"
              />

              <ChartCard
                title={t("chartTitle")}
                subtitle={t("chartSubtitle")}
              />
              <ConversationCard
                who={t("convWho")}
                status={t("convStatus")}
                channel={t("convChannel")}
                ago={t("convAgo")}
                inbound={t("convInbound")}
                outbound={t("convOutbound")}
                badges={[
                  t("convBadge1"),
                  t("convBadge2"),
                  t("convBadge3"),
                ]}
              />
            </div>
          </div>
        </div>

        <p
          className="reveal text-center text-xs text-muted-foreground mt-8"
          data-stagger="400"
        >
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
};
