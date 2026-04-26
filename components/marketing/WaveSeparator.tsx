// components/marketing/WaveSeparator.tsx
// Smooth SVG wave between sections. No hard white block.
// Default flips between light and dark sections.

import React from "react";

type Props = {
  fromColor?: string;
  toColor?: string;
  flip?: boolean;
  className?: string;
};

export function WaveSeparator({
  fromColor = "#0A1530",
  toColor = "#0A1530",
  flip = false,
  className = "",
}: Props) {
  return (
    <div
      aria-hidden
      className={`relative w-full overflow-hidden leading-[0] ${className}`}
      style={{ background: fromColor }}
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="block h-[60px] w-full md:h-[100px]"
        style={{ transform: flip ? "scaleY(-1)" : "none" }}
      >
        <path
          d="M0,40 C240,90 480,0 720,40 C960,80 1200,20 1440,50 L1440,100 L0,100 Z"
          fill={toColor}
        />
        <path
          d="M0,60 C320,30 640,80 960,55 C1200,35 1320,70 1440,55 L1440,100 L0,100 Z"
          fill={toColor}
          opacity="0.45"
        />
      </svg>
    </div>
  );
}
