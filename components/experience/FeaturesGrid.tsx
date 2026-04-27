"use client";

import { MessageCircle, Inbox, Workflow, BarChart3, Bot, Languages } from "lucide-react";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "WhatsApp Business API, native",
    desc: "Send broadcasts, run templates, sell from chat. Verified green tick supported on day one.",
    tint: "150 80% 55%",
  },
  {
    icon: Inbox,
    title: "Unified team inbox",
    desc: "WhatsApp, Instagram, email and calls in a single inbox with assignments, notes and SLAs.",
    tint: "250 95% 68%",
  },
  {
    icon: Workflow,
    title: "Visual sales pipeline",
    desc: "Drag deals across stages. Auto-trigger follow-ups, payments and reminders without leaving chat.",
    tint: "195 100% 60%",
  },
  {
    icon: Bot,
    title: "AI agents for Arabic & English",
    desc: "Auto-reply, qualify leads and summarize threads in dialect — Khaleeji, Egyptian, Levantine.",
    tint: "290 90% 65%",
  },
  {
    icon: BarChart3,
    title: "Pipeline & agent analytics",
    desc: "See revenue, response time and agent performance in real time. Export to Sheets in one click.",
    tint: "30 100% 65%",
  },
  {
    icon: Languages,
    title: "Built RTL-first",
    desc: "Full Arabic interface, right-to-left layouts, Hijri calendar and local payment integrations.",
    tint: "330 90% 70%",
  },
];

export const FeaturesGrid = () => {
  return (
    <section id="features" className="relative py-24 md:py-28 overflow-hidden section-blend-top section-blend-bottom">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{ background: "var(--gradient-aurora)", mixBlendMode: "screen" }}
      />

      <div className="container relative">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <h2 className="reveal text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Everything your team needs to{" "}
            <span className="text-gradient">close on chat</span>
          </h2>
          <p className="reveal text-muted-foreground" data-stagger="120">
            One platform for sales, support and operations — purpose-built for WhatsApp-led businesses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="reveal card-interactive group relative rounded-2xl glass p-7 overflow-hidden"
                data-stagger={String(i * 90)}
              >
                <div
                  aria-hidden
                  className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-25 group-hover:opacity-60 transition-opacity duration-700 ease-cinematic blur-3xl pointer-events-none"
                  style={{ background: `hsl(${f.tint} / 0.6)` }}
                />
                <div className="relative">
                  <div
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5 transition-transform duration-500 ease-cinematic group-hover:scale-110"
                    style={{ background: `hsl(${f.tint} / 0.15)`, color: `hsl(${f.tint})` }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
