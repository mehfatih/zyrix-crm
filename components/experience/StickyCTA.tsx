"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, ArrowLeft } from "lucide-react";

/**
 * Sticky bottom CTA — floating pill that appears after scrolling past hero,
 * hides when the final CTA section is in view.
 * RTL-aware (arrow flips for Arabic).
 */
export const StickyCTA = () => {
  const t = useTranslations("Landing.stickyCta");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const finalCta = document.getElementById("final-cta") || document.getElementById("footer");
      const ctaTop = finalCta
        ? finalCta.getBoundingClientRect().top + window.scrollY - window.innerHeight
        : Infinity;
      setShow(y > 800 && y < ctaTop);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div
      aria-hidden={!show}
      className={`fixed bottom-4 inset-x-4 md:inset-x-auto ${
        isRTL ? "md:left-6 md:right-auto" : "md:right-6 md:left-auto"
      } z-40 transition-all duration-500 ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <a
        href="#final-cta"
        className={`flex items-center justify-between gap-4 md:gap-6 rounded-full border border-primary/30 bg-background/90 backdrop-blur-xl shadow-[0_20px_60px_-10px_hsl(var(--primary)/0.4)] ${
          isRTL ? "pr-5 pl-2" : "pl-5 pr-2"
        } py-2`}
      >
        <span className="text-sm text-foreground">
          <span className="hidden sm:inline">{t("text")} </span>
          <span className="text-primary font-medium">{t("cta")}</span>
        </span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
          <Arrow className="h-4 w-4" />
        </span>
      </a>
    </div>
  );
};

export default StickyCTA;
