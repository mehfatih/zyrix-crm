// ============================================================================
// COUNTRY CONFIG — WEB Sprint 1
// ----------------------------------------------------------------------------
// Decouples language (URL locale: /ar, /en, /tr) from country (currency, tax,
// compliance). The mobile app has an identical shape so behaviour stays in
// sync across platforms.
//
// Use-site guidance:
//   - Language is purely a UI choice (route segment).
//   - Country drives: currency, tax rate, eInvoice regime, date format.
//   - Logged-out visitors have country detected from IP (see API below).
//   - Logged-in users: country comes from their profile/company record.
//
// This file is the thin web-facing mirror of lib/locale/country-profiles.ts
// so the sprint spec (src/lib/country.ts) is satisfied verbatim.
// ============================================================================

export type CountryCode =
  | "SA"
  | "AE"
  | "TR"
  | "EG"
  | "IQ"
  | "KW"
  | "QA"
  | "BH"
  | "OM"
  | "JO"
  | "LB"
  | "US";

export type InvoiceRegime = "zatca" | "efatura" | "earsiv" | "none";
export type DateFormat = "dd/MM/yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd";

export interface CountryConfig {
  code: CountryCode;
  name: { en: string; ar: string; tr: string };
  currency: string;
  currencySymbol: string;
  taxName: { en: string; ar: string; tr: string };
  taxRate: number;
  zatca: boolean;
  eFatura: boolean;
  dateFormat: DateFormat;
  locale: string;
  phonePrefix: string;
}

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  SA: {
    code: "SA",
    name: { en: "Saudi Arabia", ar: "المملكة العربية السعودية", tr: "Suudi Arabistan" },
    currency: "SAR",
    currencySymbol: "﷼",
    taxName: { en: "VAT", ar: "ضريبة القيمة المضافة", tr: "KDV" },
    taxRate: 15,
    zatca: true,
    eFatura: false,
    dateFormat: "dd/MM/yyyy",
    locale: "ar-SA",
    phonePrefix: "+966",
  },
  AE: {
    code: "AE",
    name: { en: "UAE", ar: "الإمارات", tr: "BAE" },
    currency: "AED",
    currencySymbol: "د.إ",
    taxName: { en: "VAT", ar: "ضريبة القيمة المضافة", tr: "KDV" },
    taxRate: 5,
    zatca: false,
    eFatura: false,
    dateFormat: "dd/MM/yyyy",
    locale: "ar-AE",
    phonePrefix: "+971",
  },
  TR: {
    code: "TR",
    name: { en: "Türkiye", ar: "تركيا", tr: "Türkiye" },
    currency: "TRY",
    currencySymbol: "₺",
    taxName: { en: "KDV", ar: "KDV", tr: "KDV" },
    taxRate: 20,
    zatca: false,
    eFatura: true,
    dateFormat: "dd/MM/yyyy",
    locale: "tr-TR",
    phonePrefix: "+90",
  },
  EG: {
    code: "EG",
    name: { en: "Egypt", ar: "مصر", tr: "Mısır" },
    currency: "EGP",
    currencySymbol: "ج.م",
    taxName: { en: "VAT", ar: "ضريبة القيمة المضافة", tr: "KDV" },
    taxRate: 14,
    zatca: false,
    eFatura: false,
    dateFormat: "dd/MM/yyyy",
    locale: "ar-EG",
    phonePrefix: "+20",
  },
  IQ: {
    code: "IQ",
    name: { en: "Iraq", ar: "العراق", tr: "Irak" },
    currency: "IQD",
    currencySymbol: "د.ع",
    taxName: { en: "Tax", ar: "ضريبة", tr: "Vergi" },
    taxRate: 0,
    zatca: false,
    eFatura: false,
    dateFormat: "dd/MM/yyyy",
    locale: "ar-IQ",
    phonePrefix: "+964",
  },
  KW: {
    code: "KW",
    name: { en: "Kuwait", ar: "الكويت", tr: "Kuveyt" },
    currency: "KWD",
    currencySymbol: "د.ك",
    taxName: { en: "Tax", ar: "ضريبة", tr: "Vergi" },
    taxRate: 0,
    zatca: false,
    eFatura: false,
    dateFormat: "dd/MM/yyyy",
    locale: "ar-KW",
    phonePrefix: "+965",
  },
  QA: {
    code: "QA",
    name: { en: "Qatar", ar: "قطر", tr: "Katar" },
    currency: "QAR",
    currencySymbol: "ر.ق",
    taxName: { en: "Tax", ar: "ضريبة", tr: "Vergi" },
    taxRate: 0,
    zatca: false,
    eFatura: false,
    dateFormat: "dd/MM/yyyy",
    locale: "ar-QA",
    phonePrefix: "+974",
  },
  BH: {
    code: "BH",
    name: { en: "Bahrain", ar: "البحرين", tr: "Bahreyn" },
    currency: "BHD",
    currencySymbol: "د.ب",
    taxName: { en: "VAT", ar: "ضريبة القيمة المضافة", tr: "KDV" },
    taxRate: 10,
    zatca: true,
    eFatura: false,
    dateFormat: "dd/MM/yyyy",
    locale: "ar-BH",
    phonePrefix: "+973",
  },
  OM: {
    code: "OM",
    name: { en: "Oman", ar: "عُمان", tr: "Umman" },
    currency: "OMR",
    currencySymbol: "ر.ع",
    taxName: { en: "VAT", ar: "ضريبة القيمة المضافة", tr: "KDV" },
    taxRate: 5,
    zatca: true,
    eFatura: false,
    dateFormat: "dd/MM/yyyy",
    locale: "ar-OM",
    phonePrefix: "+968",
  },
  JO: {
    code: "JO",
    name: { en: "Jordan", ar: "الأردن", tr: "Ürdün" },
    currency: "JOD",
    currencySymbol: "د.أ",
    taxName: { en: "Sales Tax", ar: "ضريبة المبيعات", tr: "Satış Vergisi" },
    taxRate: 16,
    zatca: false,
    eFatura: false,
    dateFormat: "dd/MM/yyyy",
    locale: "ar-JO",
    phonePrefix: "+962",
  },
  LB: {
    code: "LB",
    name: { en: "Lebanon", ar: "لبنان", tr: "Lübnan" },
    currency: "LBP",
    currencySymbol: "ل.ل",
    taxName: { en: "VAT", ar: "ضريبة القيمة المضافة", tr: "KDV" },
    taxRate: 11,
    zatca: false,
    eFatura: false,
    dateFormat: "dd/MM/yyyy",
    locale: "ar-LB",
    phonePrefix: "+961",
  },
  US: {
    code: "US",
    name: { en: "United States", ar: "الولايات المتحدة", tr: "Amerika" },
    currency: "USD",
    currencySymbol: "$",
    taxName: { en: "Sales Tax", ar: "ضريبة المبيعات", tr: "Satış Vergisi" },
    // US sales tax is state-dependent. Stored as 0 here as a sensible
    // baseline; per-state rates are managed inside the Tax Engine.
    taxRate: 0,
    zatca: false,
    eFatura: false,
    dateFormat: "MM/dd/yyyy",
    locale: "en-US",
    phonePrefix: "+1",
  },
};

export const COUNTRY_LIST: CountryConfig[] = Object.values(COUNTRIES);
export const COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[];

export const DEFAULT_COUNTRY: CountryCode = "SA";

export function isCountryCode(value: string | null | undefined): value is CountryCode {
  if (!value) return false;
  return (COUNTRY_CODES as string[]).includes(value.toUpperCase());
}

export function getCountry(code: string | null | undefined): CountryConfig | null {
  if (!code) return null;
  const upper = code.toUpperCase();
  return (COUNTRIES as Record<string, CountryConfig>)[upper] ?? null;
}

/**
 * Currency to show on the pricing page for a given country.
 * Falls back to USD when the country isn't in our supported list (unknown
 * visitors from outside MENA/Turkey still get a sensible display).
 */
export function currencyForCountry(code: string | null | undefined): string {
  const c = getCountry(code);
  return c?.currency ?? "USD";
}

export function currencySymbol(currency: string): string {
  const known: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    SAR: "﷼",
    AED: "د.إ",
    TRY: "₺",
    EGP: "ج.م",
    IQD: "د.ع",
    KWD: "د.ك",
    QAR: "ر.ق",
    BHD: "د.ب",
    OMR: "ر.ع",
    JOD: "د.أ",
    LBP: "ل.ل",
  };
  return known[currency] ?? currency;
}
