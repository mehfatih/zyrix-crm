// components/marketing/BackgroundFX.tsx
// Decorative background effects: dotted grid, glow blobs, orbit rings.
// Drop inside any relative+overflow-hidden parent.

import React from "react";

type Props = {
  variant?: "hero" | "section" | "subtle";
  className?: string;
};

export function BackgroundFX({ variant = "section", className = "" }: Props) {
  const showOrbits = variant === "hero";
  const showStrong = variant !== "subtle";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Glow blobs */}
      {showStrong && (
        <>
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        </>
      )}

      {/* Dotted grid */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Orbit rings (hero only) */}
      {showOrbits && (
        <>
          <div className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full border border-cyan-300/10" />
          <div className="absolute -right-24 top-36 h-[360px] w-[360px] rounded-full border border-cyan-300/10" />
          <div className="absolute -right-8 top-52 h-[220px] w-[220px] rounded-full border border-cyan-300/10" />
        </>
      )}

      {/* Diagonal sheen */}
      {showStrong && (
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, transparent 0%, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%, transparent 100%)",
          }}
        />
      )}
    </div>
  );
}
