"use client";

import { Check, X } from "lucide-react";

const POINTS = [
  {
    title: "WhatsApp at the core, not bolted on",
    desc: "Most CRMs treat WhatsApp as a plugin. Zyrix is built around it — every record, deal and automation speaks chat first.",
  },
  {
    title: "Made for MENA, not translated for it",
    desc: "Arabic dialects, RTL layouts, local payment rails (Mada, Tabby, Tamara) and timezone-aware automations from day one.",
  },
  {
    title: "Live in 24 hours, not 6 months",
    desc: "Skip the implementation circus. Import contacts, connect WhatsApp, invite your team — sell the same day.",
  },
];

const COMPARE = [
  { feature: "WhatsApp Business API native", us: true, them: "Add-on" },
  { feature: "Arabic dialect AI replies", us: true, them: false },
  { feature: "RTL-first interface", us: true, them: false },
  { feature: "MENA payment integrations", us: true, them: "Limited" },
  { feature: "Setup time", us: "< 24h", them: "Weeks" },
];

export const WhyZyrix = () => {
  return (
    <section id="why" className="relative py-24 md:py-28 overflow-hidden section-blend-top section-blend-bottom">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 30%, hsl(var(--accent) / 0.12), transparent 70%)",
        }}
      />

      <div className="container relative">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <h2 className="reveal text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Why teams choose <span className="text-gradient">Zyrix</span> over global CRMs
          </h2>
          <p className="reveal text-muted-foreground" data-stagger="120">
            Salesforce and HubSpot weren't designed for the way MENA businesses sell. Zyrix is.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Differentiation points */}
          <div className="space-y-4">
            {POINTS.map((p, i) => (
              <div
                key={p.title}
                className="reveal card-interactive glass rounded-2xl p-6"
                data-stagger={String(i * 100)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-cta flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1.5">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison card */}
          <div className="reveal glass-strong rounded-2xl p-6 md:p-8 shadow-card" data-stagger="200">
            <div className="grid grid-cols-3 gap-3 pb-4 border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
              <div>Capability</div>
              <div className="text-center text-foreground font-semibold normal-case tracking-normal">Zyrix</div>
              <div className="text-center">Generic CRM</div>
            </div>
            <div className="divide-y divide-border/40">
              {COMPARE.map((row) => (
                <div key={row.feature} className="grid grid-cols-3 gap-3 py-3 items-center text-sm">
                  <div className="text-muted-foreground">{row.feature}</div>
                  <div className="text-center">
                    {row.us === true ? (
                      <Check className="w-4 h-4 text-primary inline icon-glow" />
                    ) : (
                      <span className="text-foreground font-medium">{row.us}</span>
                    )}
                  </div>
                  <div className="text-center text-muted-foreground">
                    {row.them === false ? (
                      <X className="w-4 h-4 inline opacity-60" />
                    ) : row.them === true ? (
                      <Check className="w-4 h-4 inline opacity-60" />
                    ) : (
                      row.them
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
