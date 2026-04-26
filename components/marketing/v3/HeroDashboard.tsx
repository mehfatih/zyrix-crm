// components/marketing/v3/HeroDashboard.tsx
import React from "react";
import { getCopy, type Locale } from "@/lib/marketing/copy";

type Props = { locale: Locale };

export function HeroDashboard({ locale }: Props) {
  const t = getCopy(locale);
  const d = t.hero.dashboard;

  return (
    <div className="relative">
      {/* Outer glass shell */}
      <div className="zyrix-float relative rounded-[2rem] border border-white/14 bg-white/[0.06] p-2.5 shadow-[0_30px_120px_rgba(34,211,238,0.18)] backdrop-blur-2xl">
        {/* Inner panel — black with subtle gradient */}
        <div
          className="rounded-[1.5rem] p-5 md:p-6"
          style={{
            background:
              "linear-gradient(180deg, #0B1424 0%, #0A1530 100%)",
          }}
        >
          {/* Top bar */}
          <div className="mb-5 flex items-center gap-3 border-b border-white/8 pb-4">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-[11px] font-black text-white">
                  Z
                </span>
                <span className="text-sm font-bold text-white/95">{d.title}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[60px_1fr]">
            {/* Sidebar icons */}
            <div className="hidden flex-col gap-2 md:flex">
              {["home", "users", "chat", "chart", "doc", "settings", "bell"].map((icon) => (
                <div
                  key={icon}
                  className="grid h-10 w-10 place-items-center rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <SidebarIcon name={icon} />
                </div>
              ))}
            </div>

            {/* Content area */}
            <div className="space-y-3">
              {/* Top row: Revenue + Open Deals */}
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  label={d.revenue}
                  value={d.revenueValue}
                  delta={d.revenueDelta}
                  trend="up"
                  color="cyan"
                />
                <MetricCard
                  label={d.deals}
                  value={d.dealsValue}
                  delta={d.dealsDelta}
                  trend="up"
                  color="violet"
                />
              </div>

              {/* Mid row: WhatsApp Conversations + Response Time */}
              <div className="grid grid-cols-2 gap-3">
                <SmallMetric
                  icon="whatsapp"
                  label={d.conversations}
                  value={d.conversationsValue}
                  delta={d.conversationsDelta}
                />
                <SmallMetric
                  icon="clock"
                  label={d.responseTime}
                  value={d.responseValue}
                  delta={d.responseDelta}
                />
              </div>

              {/* Pipeline */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/55">
                  {d.pipeline}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(["new", "qualified", "proposal", "won"] as const).map((stage, idx) => {
                    const colors = ["#3B82F6", "#A78BFA", "#F59E0B", "#10B981"];
                    return (
                      <div key={stage} className="rounded-lg bg-white/[0.04] p-2.5">
                        <div className="h-1 w-full rounded-full" style={{ background: colors[idx] }} />
                        <div className="mt-2 text-[10px] font-semibold uppercase text-white/55">
                          {d.stages[stage]}
                        </div>
                        <div className="mt-1 text-base font-black text-white">
                          {d.stageValues[stage]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating chips */}
      <div className="zyrix-float-delayed absolute -top-2 right-4 hidden md:block">
        <FloatChip icon="check" color="#22D3EE" text={d.chips.delivery} />
      </div>

      <div className="zyrix-float absolute right-2 top-1/2 hidden md:block">
        <FloatChip icon="bolt" color="#F59E0B" text={d.chips.setup} />
      </div>

      <div className="zyrix-float-delayed absolute bottom-2 left-2 hidden md:block">
        <FloatChip icon="sparkle" color="#A78BFA" text={d.chips.insights} />
      </div>
    </div>
  );
}

/* ---------- atoms ---------- */

function MetricCard({
  label,
  value,
  delta,
  color,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  color: "cyan" | "violet";
}) {
  const stroke = color === "cyan" ? "#22D3EE" : "#A78BFA";

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="text-[11px] font-semibold text-white/55">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-xl font-black text-white">{value}</span>
        <span className="text-[10px] font-bold text-emerald-300">{delta}</span>
      </div>
      <svg viewBox="0 0 200 50" className="mt-2 h-10 w-full">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.4" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={
            color === "cyan"
              ? "M0,35 C30,32 50,18 80,22 C110,26 140,12 170,15 L200,8 L200,50 L0,50 Z"
              : "M0,40 C30,38 50,30 80,32 C110,34 140,18 170,20 L200,10 L200,50 L0,50 Z"
          }
          fill={`url(#grad-${color})`}
        />
        <path
          d={
            color === "cyan"
              ? "M0,35 C30,32 50,18 80,22 C110,26 140,12 170,15 L200,8"
              : "M0,40 C30,38 50,30 80,32 C110,34 140,18 170,20 L200,10"
          }
          fill="none"
          stroke={stroke}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function SmallMetric({
  icon,
  label,
  value,
  delta,
}: {
  icon: string;
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-400/15">
          <SmallIcon name={icon} />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-semibold text-white/55">{label}</div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-base font-black text-white">{value}</span>
            <span className="text-[10px] font-bold text-emerald-300">{delta}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatChip({ icon, color, text }: { icon: string; color: string; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#0A1530]/85 px-3 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-xl">
      <span
        className="grid h-6 w-6 place-items-center rounded-full"
        style={{ background: `${color}26`, color }}
      >
        <ChipIcon name={icon} />
      </span>
      {text}
    </div>
  );
}

/* ---------- icons ---------- */

function SidebarIcon({ name }: { name: string }) {
  const paths: Record<string, JSX.Element> = {
    home: <path d="M3 12L12 4l9 8M5 10v10h14V10" stroke="currentColor" strokeWidth="1.6" />,
    users: <path d="M16 11a4 4 0 11-8 0 4 4 0 018 0zM3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.6" />,
    chat: <path d="M21 12a8 8 0 11-3.5-6.6L21 4l-1.6 3.6A8 8 0 0121 12z" stroke="currentColor" strokeWidth="1.6" />,
    chart: <path d="M3 20V10m6 10V4m6 16v-7m6 7V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
    doc: <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z" stroke="currentColor" strokeWidth="1.6" />,
    settings: <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />,
    bell: <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16l-2-2zM10 21h4" stroke="currentColor" strokeWidth="1.6" />,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{paths[name]}</svg>;
}

function SmallIcon({ name }: { name: string }) {
  if (name === "whatsapp")
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#34D399">
        <path d="M17 4.5C15.5 3 13.5 2 12 2 7 2 3 6 3 11c0 1.5.5 3 1 4l-1 4 4-1c1 .5 2.5 1 4 1 5 0 9-4 9-9 0-1.5-1-3.5-3-5.5z" />
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#34D399" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChipIcon({ name }: { name: string }) {
  if (name === "check")
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "bolt")
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    );
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
    </svg>
  );
}
