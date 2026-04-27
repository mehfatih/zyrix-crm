"use client";

import { useTranslations } from "next-intl";
import {
  MessageSquare,
  Slack,
  CreditCard,
  Calendar,
  Mail,
  FileSpreadsheet,
  Webhook,
  Database,
} from "lucide-react";

const INTEGRATIONS = [
  { key: "whatsapp", icon: MessageSquare, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { key: "slack", icon: Slack, color: "text-purple-400", bg: "bg-purple-500/10" },
  { key: "stripe", icon: CreditCard, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { key: "calendar", icon: Calendar, color: "text-amber-400", bg: "bg-amber-500/10" },
  { key: "email", icon: Mail, color: "text-pink-400", bg: "bg-pink-500/10" },
  { key: "sheets", icon: FileSpreadsheet, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { key: "webhooks", icon: Webhook, color: "text-purple-400", bg: "bg-purple-500/10" },
  { key: "api", icon: Database, color: "text-cyan-400", bg: "bg-cyan-500/10" },
] as const;

export const Integrations = () => {
  const t = useTranslations("Landing.integrations");

  return (
    <section
      id="integrations"
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {INTEGRATIONS.map((it, i) => {
            const Icon = it.icon;
            return (
              <div
                key={it.key}
                className="reveal group relative rounded-xl glass p-5 overflow-hidden flex flex-col items-center justify-center gap-3 aspect-square sm:aspect-auto sm:py-7"
                data-stagger={String(i * 50)}
              >
                <div
                  className={`w-10 h-10 rounded-lg ${it.bg} ${it.color} grid place-items-center transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground/80 text-center">
                  {t(`${it.key}Name`)}
                </span>
              </div>
            );
          })}
        </div>

        <p
          className="reveal text-center text-sm text-muted-foreground mt-10 max-w-xl mx-auto"
          data-stagger="500"
        >
          {t("footer")}
        </p>
      </div>
    </section>
  );
};
