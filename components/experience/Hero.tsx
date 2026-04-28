"use client";

import { useTranslations } from "next-intl";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import Link from "next/link";
import { ArrowRight, MessageCircle, CheckCircle2, Phone, Users, BarChart3, Inbox, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Place at: components/experience/Hero.tsx
 *
 * Product hero — copy is CRM-positioned, WhatsApp-first, MENA-focused.
 * All text from Landing.hero translation namespace.
 */
export const Hero = () => {
  const t = useTranslations("Landing.hero");
  const tm = useTranslations("Landing.hero.mockup");
  const y = useSmoothScroll();

  // Mockup contacts (translated)
  const contacts = [
    { key: "1", name: tm("contact1Name"), msg: tm("contact1Msg"), time: tm("contact1Time"), unread: true },
    { key: "2", name: tm("contact2Name"), msg: tm("contact2Msg"), time: tm("contact2Time"), unread: true },
    { key: "3", name: tm("contact3Name"), msg: tm("contact3Msg"), time: tm("contact3Time"), unread: false },
    { key: "4", name: tm("contact4Name"), msg: tm("contact4Msg"), time: tm("contact4Time"), unread: false },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col items-center pt-32 pb-40">
      {/* Hero-local glow accent */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate3d(0, ${y * 0.08}px, 0)`,
          background:
            "radial-gradient(ellipse 55% 45% at 50% 30%, hsl(255 95% 65% / 0.18), transparent 65%)",
          opacity: Math.max(0, 1 - y / 900),
          mixBlendMode: "screen",
        }}
      />

      {/* Light trails */}
      <div className="absolute right-[8%] top-0 h-full pointer-events-none hidden md:block">
        <div className="light-trail h-[60%]" style={{ top: "20%", animationDelay: "0s" }} />
        <div className="light-trail h-[50%]" style={{ top: "10%", left: "40px", animationDelay: "1.4s", opacity: 0.5 }} />
      </div>

      {/* Eyebrow + Headline + Subhead */}
      <div
        className="relative z-10 container max-w-4xl text-center px-6"
        style={{ transform: `translate3d(0, ${y * -0.06}px, 0)` }}
      >
        <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6" data-stagger="0">
          <MessageCircle className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">{t("badge")}</span>
        </div>

        <h1
          className="reveal text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
          data-stagger="100"
        >
          {t("titleStart")}{" "}
          <span className="text-gradient">{t("titleEmphasis")}</span>
        </h1>

        <p className="reveal text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-9" data-stagger="200">
          {t("subtitle")}
        </p>

        <div className="reveal flex flex-wrap items-center justify-center gap-3 mb-6" data-stagger="300">
          <Button asChild size="lg" className="btn-glow bg-gradient-cta text-primary-foreground border-0 h-12 px-7">
            <Link href="/signin">
              <User className="mr-2 w-4 h-4" />
              {t("customerDashboard")}
              <ArrowRight className="ml-2 w-4 h-4 rtl:rotate-180" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-5">
            <Link href="/admin/login">
              <Shield className="mr-2 w-4 h-4" />
              {t("adminDashboard")}
            </Link>
          </Button>
        </div>

        <div className="reveal flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground" data-stagger="400">
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> {t("trustItem1")}</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> {t("trustItem2")}</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> {t("trustItem3")}</span>
        </div>
      </div>

      {/* DOMINANT DASHBOARD MOCKUP */}
      <div
        className="reveal relative z-10 mt-16 w-full max-w-6xl px-4 md:px-6 perspective-stage"
        data-stagger="500"
        style={{ transform: `translate3d(0, ${y * -0.10}px, 0)` }}
      >
        {/* Halo behind dashboard */}
        <div
          aria-hidden
          className="absolute -inset-16 rounded-[2.5rem] pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, hsl(255 95% 65% / 0.55), transparent 65%)," +
              "radial-gradient(ellipse 55% 45% at 80% 70%, hsl(220 100% 60% / 0.45), transparent 65%)," +
              "radial-gradient(ellipse 50% 40% at 20% 30%, hsl(285 90% 65% / 0.35), transparent 65%)",
            opacity: 0.85,
          }}
        />

        {/* Contact shadow */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] w-[80%] h-12 rounded-[50%] blur-2xl pointer-events-none"
          style={{ background: "hsl(255 95% 55% / 0.5)" }}
        />

        <div
          className="relative glass-strong rounded-2xl p-2 shadow-elevated tilt-3d"
          style={{
            transform: "rotateX(8deg) scale(1.12)",
            transformOrigin: "50% 0%",
            animation: "hero-float 9s ease-in-out infinite",
            boxShadow:
              "0 60px 120px -30px hsl(255 95% 55% / 0.45), 0 30px 60px -20px hsl(220 100% 50% / 0.35), 0 0 0 1px hsl(var(--border))",
          }}
        >
          {/* Mac window chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <div className="ml-3 text-[11px] text-muted-foreground">{tm("url")}</div>
          </div>

          {/* Dashboard body — force LTR direction so the layout doesn't flip in Arabic */}
          <div className="rounded-xl bg-gradient-to-br from-secondary to-card border border-border/60 overflow-hidden" dir="ltr">
            <div className="grid grid-cols-12 min-h-[460px]">
              {/* Sidebar */}
              <aside className="col-span-2 hidden md:flex flex-col gap-1 p-3 border-r border-border/60 bg-card/40">
                {[
                  { icon: Inbox, label: tm("sidebarInbox"), active: true },
                  { icon: Users, label: tm("sidebarContacts"), active: false },
                  { icon: BarChart3, label: tm("sidebarPipeline"), active: false },
                  { icon: Phone, label: tm("sidebarCalls"), active: false },
                ].map((it) => (
                  <div
                    key={it.label}
                    className={`flex items-center gap-2 text-xs px-2.5 py-2 rounded-md transition-colors ${
                      it.active
                        ? "bg-primary/15 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <it.icon className="w-3.5 h-3.5" />
                    {it.label}
                  </div>
                ))}
              </aside>

              {/* Conversation list */}
              <div className="col-span-12 md:col-span-4 border-r border-border/60 p-3 space-y-1.5">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground px-2 mb-2">
                  {tm("channelLabel")}
                </div>
                {contacts.map((c, i) => (
                  <div
                    key={c.key}
                    className={`flex items-start gap-2.5 px-2.5 py-2 rounded-lg transition-colors ${
                      i === 0 ? "bg-primary/10" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-cta shrink-0 flex items-center justify-center text-[10px] font-semibold text-primary-foreground">
                      {c.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium truncate">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground">{c.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{c.msg}</p>
                    </div>
                    {c.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />}
                  </div>
                ))}
              </div>

              {/* Conversation panel */}
              <div className="col-span-12 md:col-span-6 flex flex-col p-4 gap-3">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-cta flex items-center justify-center text-[11px] font-semibold text-primary-foreground">
                      {tm("activeName").charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{tm("activeName")}</div>
                      <div className="text-[10px] text-muted-foreground">{tm("activeMeta")}</div>
                    </div>
                  </div>
                  <span className="badge-pulse text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                    {tm("hotLead")}
                  </span>
                </div>

                <div className="flex-1 space-y-2.5 overflow-hidden">
                  <div className="flex">
                    <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-muted/50 px-3 py-2 text-xs" dir="auto">
                      {tm("incomingMsg")}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary/20 border border-primary/30 px-3 py-2 text-xs" dir="auto">
                      {tm("outgoingMsg")}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-muted/50 px-3 py-2 text-xs" dir="auto">
                      {tm("incoming2Msg")}
                    </div>
                  </div>
                </div>

                {/* AI suggestion bar */}
                <div className="rounded-lg glass border border-primary/30 px-3 py-2 flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">AI</span>
                  <span className="text-[11px] text-muted-foreground truncate" dir="auto">
                    {tm("aiSuggestion")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breathing wave bottom */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ opacity: Math.max(0, 1 - y / 1100) }}
      >
        <svg
          className="w-full h-24 md:h-32 animate-wave-breathe origin-bottom"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.4)" />
              <stop offset="50%" stopColor="hsl(var(--accent) / 0.3)" />
              <stop offset="100%" stopColor="hsl(var(--primary-glow) / 0.4)" />
            </linearGradient>
          </defs>
          <path
            d="M0,120 C240,40 480,180 720,120 C960,60 1200,160 1440,100 L1440,200 L0,200 Z"
            fill="url(#waveGrad)"
            opacity="0.3"
          />
          <path
            d="M0,140 C240,80 480,200 720,140 C960,80 1200,180 1440,120 L1440,200 L0,200 Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};
