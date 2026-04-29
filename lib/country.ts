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

// Sprint 14v — per-country e-invoice identity. Drives the
// /tax-invoices identity strip + dynamic subtitle. Subtitle is
// localized so RTL/Turkish UIs read naturally.
export interface EInvoiceSystem {
  name: string;
  shortLabel: string;
  subtitle: { en: string; ar: string; tr: string };
}

export interface CountryConfig {
  code: CountryCode;
  name: { en: string; ar: string; tr: string };
  currency: string;
  currencySymbol: string;
  taxName: { en: string; ar: string; tr: string };
  taxRate: number;
  zatca: boolean;
  eFatura: boolean;
  eInvoiceSystem: EInvoiceSystem;
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
    eInvoiceSystem: {
      name: "ZATCA E-Invoice (Fatoora)",
      shortLabel: "ZATCA",
      subtitle: {
        en: "ZATCA-compliant tax invoices with XML + QR code for Saudi Arabia.",
        ar: "فواتير ضريبية متوافقة مع زاتكا مع XML ورمز QR للسعودية.",
        tr: "Suudi Arabistan için ZATCA uyumlu vergi faturaları, XML + QR kod ile.",
      },
    },
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
    eInvoiceSystem: {
      name: "FTA E-Invoice",
      shortLabel: "FTA",
      subtitle: {
        en: "FTA-compliant tax invoices with XML + QR code for the United Arab Emirates.",
        ar: "فواتير ضريبية متوافقة مع FTA مع XML ورمز QR للإمارات العربية المتحدة.",
        tr: "Birleşik Arap Emirlikleri için FTA uyumlu vergi faturaları, XML + QR kod ile.",
      },
    },
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
    eInvoiceSystem: {
      name: "e-Fatura / e-Arşiv",
      shortLabel: "e-Fatura",
      subtitle: {
        en: "e-Fatura and e-Arşiv compliant tax invoices for Turkey.",
        ar: "فواتير ضريبية متوافقة مع e-Fatura و e-Arşiv لتركيا.",
        tr: "Türkiye için e-Fatura ve e-Arşiv uyumlu vergi faturaları.",
      },
    },
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
    eInvoiceSystem: {
      name: "ETA E-Invoice",
      shortLabel: "ETA",
      subtitle: {
        en: "ETA-compliant electronic tax invoices for Egypt.",
        ar: "فواتير ضريبية إلكترونية متوافقة مع ETA لمصر.",
        tr: "Mısır için ETA uyumlu elektronik vergi faturaları.",
      },
    },
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
    eInvoiceSystem: {
      name: "Iraq Tax Invoice",
      shortLabel: "IQ Tax",
      subtitle: {
        en: "Tax invoices for Iraq.",
        ar: "فواتير ضريبية للعراق.",
        tr: "Irak için vergi faturaları.",
      },
    },
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
    eInvoiceSystem: {
      name: "Kuwait Tax Invoice",
      shortLabel: "KW Tax",
      subtitle: {
        en: "Compliant tax invoices for Kuwait under the Ministry of Finance framework.",
        ar: "فواتير ضريبية متوافقة لدولة الكويت تحت إطار وزارة المالية.",
        tr: "Kuveyt için Maliye Bakanlığı çerçevesinde uyumlu vergi faturaları.",
      },
    },
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
    eInvoiceSystem: {
      name: "Dhareeba Tax Invoice",
      shortLabel: "Dhareeba",
      subtitle: {
        en: "Dhareeba-compliant tax invoices for Qatar.",
        ar: "فواتير ضريبية متوافقة مع نظام ضريبة لقطر.",
        tr: "Katar için Dhareeba uyumlu vergi faturaları.",
      },
    },
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
    eInvoiceSystem: {
      name: "NBR E-Invoice",
      shortLabel: "NBR",
      subtitle: {
        en: "NBR-compliant tax invoices for Bahrain.",
        ar: "فواتير ضريبية متوافقة مع NBR للبحرين.",
        tr: "Bahreyn için NBR uyumlu vergi faturaları.",
      },
    },
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
    eInvoiceSystem: {
      name: "OTA E-Invoice",
      shortLabel: "OTA",
      subtitle: {
        en: "OTA-compliant tax invoices for Oman.",
        ar: "فواتير ضريبية متوافقة مع OTA لعُمان.",
        tr: "Umman için OTA uyumlu vergi faturaları.",
      },
    },
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
    eInvoiceSystem: {
      name: "ISTD E-Invoice",
      shortLabel: "ISTD",
      subtitle: {
        en: "ISTD-compliant tax invoices for Jordan.",
        ar: "فواتير ضريبية متوافقة مع ISTD للأردن.",
        tr: "Ürdün için ISTD uyumlu vergi faturaları.",
      },
    },
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
    eInvoiceSystem: {
      name: "Lebanon Tax Invoice",
      shortLabel: "LB Tax",
      subtitle: {
        en: "Tax invoices for Lebanon.",
        ar: "فواتير ضريبية للبنان.",
        tr: "Lübnan için vergi faturaları.",
      },
    },
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
    eInvoiceSystem: {
      name: "US Sales Tax Invoice",
      shortLabel: "Sales Tax",
      subtitle: {
        en: "US sales-tax-compliant invoices with itemized state/local breakdown.",
        ar: "فواتير أمريكية متوافقة مع ضريبة المبيعات مع تفصيل ولاية/محلي.",
        tr: "Eyalet/yerel kalemli ABD satış vergisi uyumlu faturalar.",
      },
    },
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
