"use client";

import { CheckCircle2, Clock, Users } from "lucide-react";
import { useTranslations } from "next-intl";

// ────────────────────────────────────────────────────────────────────
// Sprint 14x — FollowupAllCaughtUp
// Replaces the near-white empty-state card with an emerald-tinted
// gradient that stays unmistakably part of the dark theme.
// ────────────────────────────────────────────────────────────────────

interface Props {
  contactedLast7d?: number;
  avgResponseHours?: number;
}

export function FollowupAllCaughtUp({
  contactedLast7d,
  avgResponseHours,
}: Props) {
  const t = useTranslations("Followup");
  const showSupporting =
    typeof contactedLast7d === "number" || typeof avgResponseHours === "number";

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 p-12">
      <div className="flex flex-col items-center justify-center text-center min-h-[280px]">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-300" />
        </div>
        <h3 className="text-2xl font-bold text-emerald-200 mt-4">
          {t("empty.title")}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          {t("empty.subtitle")}
        </p>

        {showSupporting && (
          <div className="bg-card border border-border rounded-lg p-3 mt-6 w-full max-w-sm">
            {typeof contactedLast7d === "number" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5 text-emerald-300" />
                <span>
                  {t("empty.contactedLast7d", { count: contactedLast7d })}
                </span>
              </div>
            )}
            {typeof avgResponseHours === "number" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                <span>
                  {t("empty.avgResponseHours", {
                    hours: avgResponseHours.toFixed(1),
                  })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
