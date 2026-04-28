"use client";

import Image from "next/image";
import Link from "next/link";

interface ZyrixLogoProps {
  /** Variant: "white" for dark backgrounds, "blue" for light backgrounds */
  variant?: "white" | "blue";
  /** Logo height in pixels (width auto-calculated) */
  size?: number;
  /** Optional className */
  className?: string;
  /** If true, renders as a link to home; otherwise just the image */
  asLink?: boolean;
  /** ARIA label */
  ariaLabel?: string;
}

/**
 * Zyrix CRM Logo — reusable component.
 * Used in Nav (header) and Footer.
 * Defaults to white variant for the dark cinematic theme.
 */
export const ZyrixLogo = ({
  variant = "white",
  size = 36,
  className = "",
  asLink = true,
  ariaLabel = "Zyrix CRM",
}: ZyrixLogoProps) => {
  const src = variant === "white" ? "/zyrix-logo.png" : "/zyrix-logo-blue.png";

  const img = (
    <Image
      src={src}
      alt={ariaLabel}
      width={size}
      height={size}
      priority
      className="object-contain"
      style={{ height: size, width: "auto" }}
    />
  );

  if (!asLink) {
    return <span className={`inline-flex items-center ${className}`}>{img}</span>;
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center transition-opacity hover:opacity-90 ${className}`}
      aria-label={ariaLabel}
    >
      {img}
    </Link>
  );
};

export default ZyrixLogo;
