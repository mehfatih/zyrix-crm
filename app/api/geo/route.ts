import { NextResponse } from "next/server";
import { isCountryCode, DEFAULT_COUNTRY, type CountryCode } from "@/lib/country";

// ============================================================================
// GEO DETECTION ENDPOINT
// ----------------------------------------------------------------------------
// Returns the visitor's best-guess country code so the pricing page can show
// local currency before the user has created an account. Priority order:
//
//   1. Vercel's edge-provided `x-vercel-ip-country` header (best signal).
//   2. Accept-Language header heuristic (last-resort geographic guess).
//   3. Fallback to DEFAULT_COUNTRY (SA) so MENA-first product still feels
//      localized even when geo fails.
//
// Never touches currency for logged-in users — that comes from their account
// profile and is completely independent of the URL locale.
// ============================================================================

export const runtime = "edge";

export async function GET(request: Request) {
  const headers = request.headers;

  // 1. Vercel / Cloudflare edge-provided country header
  const vercelCountry =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    headers.get("x-country-code");

  let country: CountryCode | null = null;
  let source = "fallback";

  if (vercelCountry && isCountryCode(vercelCountry)) {
    country = vercelCountry.toUpperCase() as CountryCode;
    source = "edge-header";
  }

  // 2. Accept-Language as soft fallback
  if (!country) {
    const acceptLang = headers.get("accept-language") ?? "";
    const guess = guessCountryFromAcceptLanguage(acceptLang);
    if (guess) {
      country = guess;
      source = "accept-language";
    }
  }

  if (!country) {
    country = DEFAULT_COUNTRY;
  }

  return NextResponse.json(
    { country, source },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    }
  );
}

function guessCountryFromAcceptLanguage(accept: string): CountryCode | null {
  const tags = accept
    .split(",")
    .map((t) => t.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const tag of tags) {
    if (!tag) continue;
    const parts = tag.split("-");
    const region = parts[1]?.toUpperCase();
    if (region && isCountryCode(region)) return region as CountryCode;

    const base = parts[0];
    if (base === "tr") return "TR";
    if (base === "ar") return "SA";
  }
  return null;
}
