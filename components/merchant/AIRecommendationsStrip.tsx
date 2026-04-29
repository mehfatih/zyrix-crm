"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw, Sparkles } from "lucide-react";

import { AIRecommendationSlide } from "./AIRecommendationSlide";
import { RECOMMENDATION_ICONS } from "./quickAddEntities";
import {
  fetchRecommendations,
  type Recommendation,
} from "@/lib/services/recommendations";

interface AIRecommendationsStripProps {
  locale: string;
  isRTL: boolean;
}

const AUTO_ADVANCE_MS = 7000;

export function AIRecommendationsStrip({
  locale,
  isRTL,
}: AIRecommendationsStripProps) {
  const t = useTranslations("AIRecommendations");

  const [items, setItems] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useMemo(
    () => async (controller?: AbortController) => {
      setLoading(true);
      const data = await fetchRecommendations({
        locale,
        signal: controller?.signal,
      });
      setItems(data);
      setActive(0);
      setLoading(false);
    },
    [locale],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller);
    return () => controller.abort();
  }, [load]);

  // Auto-advance
  useEffect(() => {
    if (paused || items.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [items.length, paused]);

  const handleRefresh = () => {
    void load();
  };

  const goTo = (idx: number) => {
    setActive(idx);
  };

  const localizedHref = (href?: string) => {
    if (!href) return undefined;
    if (href.startsWith("/")) return `/${locale}${href}`;
    return href;
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative w-full rounded-[24px] overflow-hidden"
      style={{
        height: 240,
        background:
          "linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #38bdf8 100%)",
        boxShadow: "0 20px 60px rgba(167,139,250,0.25)",
      }}
      dir={isRTL ? "rtl" : "ltr"}
      aria-live="polite"
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.7), transparent)",
        }}
      />

      {/* Header row */}
      <div className="absolute top-0 left-0 right-0 px-6 pt-4 flex items-center gap-3 z-10">
        <Sparkles className="w-4 h-4 text-white" />
        <span className="text-[14px] font-bold text-white tracking-tight">
          {t("title")}
        </span>

        <div className="flex-1" />

        {/* Pagination dots */}
        {items.length > 1 && (
          <div className="flex items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={t("goToSlide", { index: i + 1 })}
                className="group w-5 h-5 flex items-center justify-center"
              >
                <span
                  className={`rounded-full transition-all duration-200 ${
                    i === active
                      ? "w-5 h-1.5 bg-card"
                      : "w-1.5 h-1.5 bg-card/50 group-hover:bg-card/80"
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleRefresh}
          aria-label={t("refresh")}
          className="w-8 h-8 rounded-full bg-card/15 hover:bg-card/25 text-white flex items-center justify-center transition-colors"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Slides area */}
      <div className="absolute inset-0 pt-14 pb-6">
        {loading && items.length === 0 ? (
          <SkeletonSlide isRTL={isRTL} />
        ) : items.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-white/80 text-sm">
            {t("empty")}
          </div>
        ) : (
          <div className="relative w-full h-full">
            {items.map((item, idx) => {
              const Icon =
                RECOMMENDATION_ICONS[item.type] ?? RECOMMENDATION_ICONS.default;
              const isActive = idx === active;
              return (
                <div
                  key={item.id}
                  className="absolute inset-0 transition-all duration-500 ease-out"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? "translateX(0)"
                      : idx < active
                        ? isRTL
                          ? "translateX(30px)"
                          : "translateX(-30px)"
                        : isRTL
                          ? "translateX(-30px)"
                          : "translateX(30px)",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  aria-hidden={!isActive}
                >
                  <AIRecommendationSlide
                    icon={Icon}
                    title={item.title}
                    body={item.body}
                    ctaLabel={item.ctaLabel}
                    href={localizedHref(item.href)}
                    isRTL={isRTL}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonSlide({ isRTL }: { isRTL: boolean }) {
  return (
    <div className="w-full h-full flex items-center gap-5 px-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-14 h-14 rounded-2xl bg-card/25 animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 rounded bg-card/30 animate-pulse w-2/3" />
        <div className="h-3 rounded bg-card/20 animate-pulse w-1/2" />
      </div>
      <div className="hidden sm:block h-9 w-28 rounded-full bg-card/30 animate-pulse" />
    </div>
  );
}
