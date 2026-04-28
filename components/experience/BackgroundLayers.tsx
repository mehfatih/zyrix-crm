"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/**
 * Place at: components/experience/BackgroundLayers.tsx
 *
 * Multi-layer cinematic space background (fixed, behind everything).
 *   Layer 1  (z=-3, in body::before from globals.css)
 *   Layer 2  (z=-10) blue/purple radial gradients behind hero
 *   Layer 3  (z=-10) two slow-drifting aurora waves
 *   Layer 4  (z=-10) starfield (3 layers, parallax)
 *   Layer 5  (z=-1) film-grain noise overlay
 *   Layer 6  (z=-10) center vignette for contrast
 */
export const BackgroundLayers = () => {
  const y = useSmoothScroll();

  return (
    <>
      {/* Layer 2 — radial color glow behind hero region (slow parallax) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          transform: `translate3d(0, ${y * -0.04}px, 0)`,
          background:
            "radial-gradient(ellipse 70% 55% at 50% 18%, hsl(250 95% 55% / 0.28), transparent 60%)," +
            "radial-gradient(ellipse 55% 45% at 80% 30%, hsl(220 100% 60% / 0.22), transparent 65%)," +
            "radial-gradient(ellipse 50% 40% at 18% 25%, hsl(280 90% 60% / 0.18), transparent 65%)",
        }}
      />

      {/* Layer 3a — drifting aurora wave */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          opacity: 0.35,
          mixBlendMode: "screen",
          animation: "drift-x 28s ease-in-out infinite",
          transform: `translate3d(0, ${y * -0.08}px, 0)`,
          background:
            "radial-gradient(ellipse 60% 30% at 30% 40%, hsl(260 95% 65% / 0.45), transparent 60%)," +
            "radial-gradient(ellipse 50% 25% at 70% 60%, hsl(195 100% 60% / 0.35), transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      {/* Layer 3b — second aurora wave drifting opposite direction */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          opacity: 0.28,
          mixBlendMode: "screen",
          animation: "drift-x-rev 36s ease-in-out infinite",
          transform: `translate3d(0, ${y * -0.12}px, 0)`,
          background:
            "radial-gradient(ellipse 55% 28% at 65% 25%, hsl(290 90% 65% / 0.4), transparent 60%)," +
            "radial-gradient(ellipse 45% 22% at 25% 75%, hsl(220 100% 65% / 0.35), transparent 60%)",
          filter: "blur(50px)",
        }}
      />

      {/* Layer 4 — Starfield (3 parallax layers) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          transform: `translate3d(0, ${y * -0.02}px, 0)`,
          backgroundImage:
            "radial-gradient(1px 1px at 12% 18%, hsl(220 30% 96% / 0.5) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 78% 42%, hsl(220 30% 96% / 0.4) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 34% 72%, hsl(220 30% 96% / 0.45) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 88% 88%, hsl(220 30% 96% / 0.35) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 6% 54%, hsl(220 30% 96% / 0.4) 50%, transparent 51%)",
          backgroundSize: "1100px 1100px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          transform: `translate3d(0, ${y * -0.06}px, 0)`,
          backgroundImage:
            "radial-gradient(1px 1px at 22% 38%, hsl(220 30% 96% / 0.3) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 58% 12%, hsl(220 30% 96% / 0.25) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 92% 28%, hsl(220 30% 96% / 0.3) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 44% 62%, hsl(220 30% 96% / 0.25) 50%, transparent 51%)",
          backgroundSize: "800px 800px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          transform: `translate3d(0, ${y * -0.14}px, 0)`,
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 16% 82%, hsl(250 100% 85% / 0.55) 50%, transparent 51%)," +
            "radial-gradient(1.5px 1.5px at 72% 18%, hsl(195 100% 80% / 0.55) 50%, transparent 51%)," +
            "radial-gradient(1.5px 1.5px at 50% 50%, hsl(280 100% 85% / 0.45) 50%, transparent 51%)",
          backgroundSize: "1400px 1400px",
        }}
      />

      {/* Layer 5 — film grain / noise (z=-1) */}
      <div aria-hidden className="grain-overlay" />

      {/* Layer 6 — vignette for depth/contrast */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at center, transparent 45%, hsl(var(--background) / 0.85) 100%)",
        }}
      />
    </>
  );
};
