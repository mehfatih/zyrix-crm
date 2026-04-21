// ============================================================================
// LOCALE REGISTRY — country → currency + tax profile mapping
// ----------------------------------------------------------------------------
// Single source of truth for "which options should a merchant see based on
// their country?" Before this, dropdowns showed a mixed list of Gulf + TR
// currencies and both KDV and ZATCA tax schemes, which confused merchants
// who only operate in one region. Now each merchant sees ONLY the options
// relevant to their country.
//
// Used by:
//   • Company settings for base currency dropdown
//   • Deal/Quote/Invoice pricing widgets
//   • Tax invoice issuance flow (regime defaults to country's scheme)
//   • Pricing + settings surfaces that previously showed all currencies
//
// How to add a country:
//   1. Add a CountryProfile entry below with iso2 + currency + tax info
//   2. That's it — dropdowns adapt automatically
// ============================================================================

export type TaxScheme = "vat_zatca" | "kdv" | "none";

export interface CountryProfile {
  iso2: string;
  name: { en: string; ar: string; tr: string };
  currency: string;
  currencySymbol: string;
  taxScheme: TaxScheme;
  defaultTaxRate: number;
  taxName: { en: string; ar: string; tr: string };
  /** Invoice regime for e-invoicing (maps to TaxInvoice.regime) */
  invoiceRegime: "zatca" | "efatura" | "earsiv" | null;
  /** BCP 47 locale for Intl.NumberFormat */
  locale: string;
  /** Phone country code for phone-number widgets */
  phonePrefix: string;
}

export const COUNTRY_PROFILES: CountryProfile[] = [
  {
    iso2: "SA",
    name: { en: "Saudi Arabia", ar: "المملكة العربية السعودية", tr: "Suudi Arabistan" },
    currency: "SAR",
    currencySymbol: "﷼",
    taxScheme: "vat_zatca",
    defaultTaxRate: 15,
    taxName: { en: "VAT", ar: "ضريبة القيمة المضافة", tr: "KDV" },
    invoiceRegime: "zatca",
    locale: "ar-SA",
    phonePrefix: "+966",
  },
  {
    iso2: "TR",
    name: { en: "Türkiye", ar: "تركيا", tr: "Türkiye" },
    currency: "TRY",
    currencySymbol: "₺",
    taxScheme: "kdv",
    defaultTaxRate: 20,
    taxName: { en: "KDV", ar: "KDV", tr: "KDV" },
    invoiceRegime: "efatura",
    locale: "tr-TR",
    phonePrefix: "+90",
  },
  {
    iso2: "AE",
    name: { en: "UAE", ar: "الإمارات", tr: "BAE" },
    currency: "AED",
    currencySymbol: "د.إ",
    taxScheme: "vat_zatca",
    defaultTaxRate: 5,
    taxName: { en: "VAT", ar: "ضريبة القيمة المضافة", tr: "KDV" },
    invoiceRegime: null, // UAE has its own regime; not yet implemented
    locale: "ar-AE",
    phonePrefix: "+971",
  },
  {
    iso2: "EG",
    name: { en: "Egypt", ar: "مصر", tr: "Mısır" },
    currency: "EGP",
    currencySymbol: "ج.م",
    taxScheme: "vat_zatca",
    defaultTaxRate: 14,
    taxName: { en: "VAT", ar: "ضريبة القيمة المضافة", tr: "KDV" },
    invoiceRegime: null,
    locale: "ar-EG",
    phonePrefix: "+20",
  },
  {
    iso2: "KW",
    name: { en: "Kuwait", ar: "الكويت", tr: "Kuveyt" },
    currency: "KWD",
    currencySymbol: "د.ك",
    taxScheme: "none",
    defaultTaxRate: 0,
    taxName: { en: "Tax", ar: "ضريبة", tr: "Vergi" },
    invoiceRegime: null,
    locale: "ar-KW",
    phonePrefix: "+965",
  },
  {
    iso2: "QA",
    name: { en: "Qatar", ar: "قطر", tr: "Katar" },
    currency: "QAR",
    currencySymbol: "ر.ق",
    taxScheme: "none",
    defaultTaxRate: 0,
    taxName: { en: "Tax", ar: "ضريبة", tr: "Vergi" },
    invoiceRegime: null,
    locale: "ar-QA",
    phonePrefix: "+974",
  },
  {
    iso2: "BH",
    name: { en: "Bahrain", ar: "البحرين", tr: "Bahreyn" },
    currency: "BHD",
    currencySymbol: "د.ب",
    taxScheme: "vat_zatca",
    defaultTaxRate: 10,
    taxName: { en: "VAT", ar: "ضريبة القيمة المضافة", tr: "KDV" },
    invoiceRegime: null,
    locale: "ar-BH",
    phonePrefix: "+973",
  },
  {
    iso2: "OM",
    name: { en: "Oman", ar: "عُمان", tr: "Umman" },
    currency: "OMR",
    currencySymbol: "ر.ع",
    taxScheme: "vat_zatca",
    defaultTaxRate: 5,
    taxName: { en: "VAT", ar: "ضريبة القيمة المضافة", tr: "KDV" },
    invoiceRegime: null,
    locale: "ar-OM",
    phonePrefix: "+968",
  },
  {
    iso2: "IQ",
    name: { en: "Iraq", ar: "العراق", tr: "Irak" },
    currency: "IQD",
    currencySymbol: "د.ع",
    taxScheme: "none",
    defaultTaxRate: 0,
    taxName: { en: "Tax", ar: "ضريبة", tr: "Vergi" },
    invoiceRegime: null,
    locale: "ar-IQ",
    phonePrefix: "+964",
  },
];

// ──────────────────────────────────────────────────────────────────────
// Lookups
// ──────────────────────────────────────────────────────────────────────

export function getCountryProfile(iso2: string | null | undefined): CountryProfile | null {
  if (!iso2) return null;
  return COUNTRY_PROFILES.find((c) => c.iso2 === iso2.toUpperCase()) ?? null;
}

/**
 * Get the list of currencies appropriate for a given country. When the
 * country has its own profile, we return just that currency plus USD
 * (always included as a universal reserve option). When no profile
 * exists, we return a fallback list.
 */
export function availableCurrencies(iso2: string | null | undefined): Array<{
  code: string;
  symbol: string;
  label: { en: string; ar: string; tr: string };
}> {
  const profile = getCountryProfile(iso2);
  const universal = {
    code: "USD",
    symbol: "$",
    label: { en: "US Dollar", ar: "دولار أمريكي", tr: "ABD Doları" },
  };
  if (!profile) {
    return [
      universal,
      { code: "EUR", symbol: "€", label: { en: "Euro", ar: "يورو", tr: "Euro" } },
    ];
  }
  const primary = {
    code: profile.currency,
    symbol: profile.currencySymbol,
    label: profile.name,
  };
  return [primary, universal];
}

/**
 * Is the given regime relevant to this country? Used to show/hide the
 * invoice regime picker — a Turkish merchant shouldn't see ZATCA and
 * vice-versa.
 */
export function regimesForCountry(
  iso2: string | null | undefined
): Array<"zatca" | "efatura" | "earsiv"> {
  const profile = getCountryProfile(iso2);
  if (!profile) return ["zatca", "efatura", "earsiv"]; // no filter when unknown
  if (profile.iso2 === "TR") return ["efatura", "earsiv"];
  if (profile.iso2 === "SA") return ["zatca"];
  return [];
}
