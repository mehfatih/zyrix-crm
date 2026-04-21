import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  locales,
  type Locale,
  isValidLocale,
  getDirection,
  localeToISO,
} from "@/i18n";
import { AuthProvider } from "@/lib/auth/context";
import "../globals.css";

const BASE = "https://crm.zyrix.co";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0891B2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const meta = {
    en: {
      title: "Zyrix CRM — The CRM Built for MENA & Turkey",
      titleTemplate: "%s | Zyrix CRM",
      description:
        "WhatsApp-native CRM with Arabic dialect AI. Sales pipeline, customer loyalty, AI CFO dashboard, and commission engine — all in one platform. Built for Saudi, UAE, Turkey, Iraq & Egypt.",
      keywords:
        "CRM MENA, CRM Turkey, Arabic CRM, WhatsApp CRM, enterprise CRM alternative, AI CFO, sales pipeline, customer loyalty",
    },
    ar: {
      title: "Zyrix CRM — أول CRM حقيقي لمنطقة الشرق الأوسط وTürkiye",
      titleTemplate: "%s | Zyrix CRM",
      description:
        "نظام CRM ذكي مع واتساب مدمج ودعم اللهجات العربية. خط مبيعات، ولاء عملاء، لوحة المدير المالي الذكية، ونظام عمولات — كل شيء في منصة واحدة. مصمّم للسعودية والإمارات وTürkiye والعراق ومصر.",
      keywords:
        "CRM عربي, نظام إدارة علاقات العملاء, CRM واتساب, بديل أنظمة CRM المؤسسية, خط المبيعات, ولاء العملاء, المدير المالي الذكي, اللهجات العربية",
    },
    tr: {
      title: "Zyrix CRM — MENA ve Türkiye için Gerçek CRM",
      titleTemplate: "%s | Zyrix CRM",
      description:
        "WhatsApp entegreli ve Arapça lehçelerini anlayan akıllı CRM. Satış hunisi, müşteri sadakati, AI CFO paneli ve komisyon motoru — hepsi tek platformda. Suudi Arabistan, BAE, Türkiye, Irak ve Mısır için tasarlandı.",
      keywords:
        "CRM Türkiye, MENA CRM, Arapça CRM, WhatsApp CRM, kurumsal CRM alternatifi, satış hunisi, müşteri sadakati, AI CFO, komisyon yönetimi",
    },
  } as const;

  const current = meta[locale as Locale] ?? meta.en;
  const path = locale === "en" ? "" : `/${locale}`;
  const isoLocale = localeToISO[locale as Locale] ?? "en-US";

  return {
    title: {
      default: current.title,
      template: current.titleTemplate,
    },
    description: current.description,
    keywords: current.keywords,
    applicationName: "Zyrix CRM",
    authors: [{ name: "Mehmet Fatih", url: "https://github.com/mehfatih" }],
    creator: "Zyrix",
    publisher: "Zyrix",
    metadataBase: new URL(BASE),

    alternates: {
      canonical: `${BASE}${path}`,
      languages: {
        en: `${BASE}/en`,
        ar: `${BASE}/ar`,
        tr: `${BASE}/tr`,
        "x-default": `${BASE}/en`,
      },
    },

    openGraph: {
      title: current.title,
      description: current.description,
      url: `${BASE}${path}`,
      siteName: "Zyrix CRM",
      type: "website",
      locale: isoLocale.replace("-", "_"),
      alternateLocale: Object.values(localeToISO)
        .map((l) => l.replace("-", "_"))
        .filter((l) => l !== isoLocale.replace("-", "_")),
      images: [
        {
          url: `${BASE}/og-image.png`,
          width: 1200,
          height: 630,
          alt: current.title,
          type: "image/png",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: current.title,
      description: current.description,
      images: [`${BASE}/og-image.png`],
      creator: "@zyrixcrm",
      site: "@zyrixcrm",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    icons: {
      icon: [
        { url: "/logo.png", type: "image/png" },
      ],
      apple: [
        { url: "/logo.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: "/logo.png",
    },

    other: {
      "msapplication-TileColor": "#0891B2",
      "msapplication-TileImage": "/logo.png",
    },

    category: "business",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const direction = getDirection(locale);
  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className="scroll-smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {isArabic && (
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        )}

        {!isArabic && (
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        )}

        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        <meta name="apple-mobile-web-app-title" content="Zyrix CRM" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="color-scheme" content="light" />
      </head>

      <body
        className={`${isArabic ? "font-cairo" : "font-inter"} bg-bg-base text-ink antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider locale={locale}>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}