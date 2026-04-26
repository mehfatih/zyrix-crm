// components/marketing/Button.tsx
// Two button styles used throughout the marketing site.
// Both keep min-height of 44px for tap targets.

import React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-bold text-base transition-all duration-200 px-7 py-3.5 min-h-[48px]";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-[0_20px_60px_rgba(34,211,238,0.28)] hover:shadow-[0_24px_70px_rgba(34,211,238,0.40)] hover:-translate-y-0.5",
  secondary:
    "border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/15",
  ghost:
    "text-white/75 hover:text-white",
};

export function ZxButton({
  href,
  variant = "primary",
  children,
  className = "",
  ariaLabel,
}: Props) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
