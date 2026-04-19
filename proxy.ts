import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n";

// ============================================================================
// ZYRIX CRM — Locale Routing Proxy (Next.js 16 replacement for middleware.ts)
// ============================================================================
// Handles:
// 1. Locale detection from URL, cookie, or Accept-Language header
// 2. Auto-redirect to appropriate locale
// 3. Sets NEXT_LOCALE cookie for consistency
// 4. Skips static assets, API routes, and internal Next.js paths
// ============================================================================

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,

  // "as-needed" — show locale prefix only for non-default locales
  // "/en/page" → "/page", but "/ar/page" stays as "/ar/page"
  // CHANGED TO "always" for explicit URLs — better SEO + clearer redirects
  localePrefix: "always",

  // Detect locale from Accept-Language header on first visit
  localeDetection: true,

  // Alternate URLs in response headers (helps SEO)
  alternateLinks: true,
});

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ───────────────────────────────────────────────────────────────
  // SKIP: paths that should not be processed by locale routing
  // ───────────────────────────────────────────────────────────────
  const shouldSkip =
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.includes("/favicon") ||
    pathname.includes(".png") ||
    pathname.includes(".jpg") ||
    pathname.includes(".jpeg") ||
    pathname.includes(".svg") ||
    pathname.includes(".webp") ||
    pathname.includes(".ico") ||
    pathname.includes(".json") ||
    pathname.includes(".xml") ||
    pathname.includes(".txt") ||
    pathname.includes(".woff") ||
    pathname.includes(".woff2") ||
    pathname.includes(".ttf") ||
    pathname.includes(".otf") ||
    pathname.includes(".map") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.json";

  if (shouldSkip) {
    return NextResponse.next();
  }

  // ───────────────────────────────────────────────────────────────
  // Apply next-intl locale routing
  // ───────────────────────────────────────────────────────────────
  const response = intlMiddleware(request);

  // ───────────────────────────────────────────────────────────────
  // Add custom headers for analytics / debugging
  // ───────────────────────────────────────────────────────────────
  if (response) {
    response.headers.set("x-zyrix-app", "crm");
    response.headers.set("x-zyrix-version", "0.1.0");
  }

  return response;
}

// ============================================================================
// MATCHER — Which paths this proxy runs on
// ============================================================================
export const config = {
  matcher: [
    // Match all paths EXCEPT:
    // - api routes
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - static files with extensions
    // - robots.txt, sitemap.xml, manifest.json
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};