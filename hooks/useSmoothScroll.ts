"use client";

import { useEffect, useState } from "react";

/**
 * Smooth-scroll easing — applies eased momentum to the scroll position
 * via rAF without hijacking native scroll. Lightweight, no deps.
 *
 * Also exposes the eased scrollY for parallax consumers.
 *
 * Place at: hooks/useSmoothScroll.ts
 */
export function useSmoothScroll() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let target = window.scrollY;
    let current = window.scrollY;
    let rafId = 0;

    const tick = () => {
      target = window.scrollY;
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.05) current = target;
      setScrollY(current);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return scrollY;
}
