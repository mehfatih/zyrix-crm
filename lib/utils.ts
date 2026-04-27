import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Place at: lib/utils.ts
 *
 * Used by shadcn Button and other UI components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function formatDate(
  date: Date | string,
  locale: string = "en"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const localeMap: Record<string, string> = {
    en: "en-US",
    ar: "ar-SA",
    tr: "tr-TR",
  };
  return new Intl.DateTimeFormat(localeMap[locale] || "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
