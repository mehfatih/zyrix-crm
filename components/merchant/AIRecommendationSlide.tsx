"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AIRecommendationSlideProps {
  icon: LucideIcon;
  title: string;
  body: string;
  ctaLabel: string;
  href?: string;
  isRTL: boolean;
}

export function AIRecommendationSlide({
  icon: Icon,
  title,
  body,
  ctaLabel,
  href,
  isRTL,
}: AIRecommendationSlideProps) {
  const ArrowIcon = (
    <ArrowRight
      className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`}
    />
  );

  const content = (
    <div className="w-full h-full flex items-center gap-5 px-6">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "rgba(255,255,255,0.22)" }}
      >
        <Icon className="w-7 h-7 text-white" strokeWidth={2.2} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[18px] font-semibold text-white truncate">
          {title}
        </p>
        <p className="text-[13px] text-white/85 mt-1 line-clamp-2">{body}</p>
      </div>

      <span
        className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-card text-cyan-300 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow flex-shrink-0"
      >
        {ctaLabel}
        {ArrowIcon}
      </span>
    </div>
  );

  if (!href) {
    return <div className="w-full h-full">{content}</div>;
  }

  return (
    <Link
      href={href}
      className="block w-full h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      {content}
    </Link>
  );
}
