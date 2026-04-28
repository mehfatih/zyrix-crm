"use client";

import { useEffect } from "react";

/**
 * Reveals any element with .reveal class once it enters the viewport.
 * Uses IntersectionObserver — staggered via data-stagger attr (ms).
 *
 * Place at: hooks/useRevealOnScroll.ts
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = Number(el.dataset.stagger ?? 0);
            window.setTimeout(() => el.classList.add("in-view"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
