import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, type Locale } from "./i18n";

// ============================================================================
// ZYRIX CRM — Locale Routing Proxy (Next.js 16 replacement for middleware.ts)
// ============================================================================
// Handles:
// 1. Country-based locale detection (Cloudflare/Vercel IP headers)
// 2. Accept-Language fallback
// 3. Cookie persistence (zyrix_locale)
// 4. Auto-redirect to appropriate locale
// 5. Skips static assets, API routes, and internal Next.js paths
// ============================================================================

// Country → preferred locale mapping (for IP-based detection)
const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  // Arabic-speaking countries
  SA: "ar", AE: "ar", KW: "ar", QA: "ar", BH: "ar", OM: "ar",
  JO: "ar", LB: "ar", SY: "ar", IQ: "ar", PS: "ar", YE: "ar",
  EG: "ar", LY: "ar", TN: "ar", DZ: "ar", MA: "ar", SD: "ar",
  MR: "ar", SO: "ar", DJ: "ar", KM: "ar",
  // Turkish
  TR: "tr",
};

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
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
  // Country-based locale hint
  // Inject preferred locale into Accept-Language header when no cookie exists
  // This way next-intl picks it up during its own detection
  // ───────────────────────────────────────────────────────────────
  const hasLocaleCookie =
    request.cookies.has("zyrix_locale") ||
    request.cookies.has("NEXT_LOCALE");

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocaleCookie && !pathnameHasLocale) {
    const country =
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-vercel-ip-country") ||
      "";
    const countryLocale = COUNTRY_TO_LOCALE[country.toUpperCase()];

    if (countryLocale) {
      // Prepend country locale to Accept-Language so next-intl prefers it
      const originalAcceptLang = request.headers.get("accept-language") || "";
      const newAcceptLang = `${countryLocale},${originalAcceptLang}`;
      request.headers.set("accept-language", newAcceptLang);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // Apply next-intl locale routing
  // ───────────────────────────────────────────────────────────────
  const response = intlMiddleware(request);

  // ───────────────────────────────────────────────────────────────
  // Sync zyrix_locale cookie with the resolved locale
  // ───────────────────────────────────────────────────────────────
  if (response && pathnameHasLocale) {
    const currentLocale = pathname.split("/")[1] as Locale;
    if ((locales as readonly string[]).includes(currentLocale)) {
      response.cookies.set("zyrix_locale", currentLocale, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
      });
    }
  }

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
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
