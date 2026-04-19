module.exports = [
"[project]/i18n.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "defaultLocale",
    ()=>defaultLocale,
    "getDirection",
    ()=>getDirection,
    "isValidLocale",
    ()=>isValidLocale,
    "localeFlags",
    ()=>localeFlags,
    "localeNames",
    ()=>localeNames,
    "localeToISO",
    ()=>localeToISO,
    "locales",
    ()=>locales,
    "rtlLocales",
    ()=>rtlLocales
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getRequestConfig$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getRequestConfig$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/server/react-server/getRequestConfig.js [app-rsc] (ecmascript) <export default as getRequestConfig>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
const locales = [
    "en",
    "ar",
    "tr"
];
const defaultLocale = "en";
const rtlLocales = [
    "ar"
];
const localeNames = {
    en: "English",
    ar: "العربية",
    tr: "Türkçe"
};
const localeFlags = {
    en: "🇬🇧",
    ar: "🇸🇦",
    tr: "🇹🇷"
};
const localeToISO = {
    en: "en-US",
    ar: "ar-SA",
    tr: "tr-TR"
};
function isValidLocale(value) {
    return locales.includes(value);
}
function getDirection(locale) {
    return rtlLocales.includes(locale) ? "rtl" : "ltr";
}
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getRequestConfig$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getRequestConfig$3e$__["getRequestConfig"])(async ({ requestLocale })=>{
    // `requestLocale` typically comes from URL segment [locale]
    let locale = await requestLocale;
    // Validate + fallback
    if (!locale || !isValidLocale(locale)) {
        locale = defaultLocale;
    }
    // Load messages dynamically
    let messages;
    try {
        messages = (await __turbopack_context__.f({
            "./messages/ar.json": {
                id: ()=>"[project]/messages/ar.json.[json].cjs [app-rsc] (ecmascript, async loader)",
                module: ()=>__turbopack_context__.A("[project]/messages/ar.json.[json].cjs [app-rsc] (ecmascript, async loader)")
            },
            "./messages/en.json": {
                id: ()=>"[project]/messages/en.json.[json].cjs [app-rsc] (ecmascript, async loader)",
                module: ()=>__turbopack_context__.A("[project]/messages/en.json.[json].cjs [app-rsc] (ecmascript, async loader)")
            },
            "./messages/tr.json": {
                id: ()=>"[project]/messages/tr.json.[json].cjs [app-rsc] (ecmascript, async loader)",
                module: ()=>__turbopack_context__.A("[project]/messages/tr.json.[json].cjs [app-rsc] (ecmascript, async loader)")
            }
        }).import(`./messages/${locale}.json`)).default;
    } catch (error) {
        console.error(`[i18n] Failed to load messages for locale "${locale}":`, error);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return {
        locale,
        messages,
        timeZone: "Europe/Istanbul",
        now: new Date(),
        // Default formatting options
        formats: {
            dateTime: {
                short: {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                },
                medium: {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                },
                long: {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                }
            },
            number: {
                currency: {
                    style: "currency",
                    currency: "USD"
                },
                percent: {
                    style: "percent",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }
            }
        }
    };
});
}),
"[project]/app/[locale]/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LocaleLayout,
    "generateMetadata",
    ()=>generateMetadata,
    "generateStaticParams",
    ()=>generateStaticParams,
    "viewport",
    ()=>viewport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$server$2f$NextIntlClientProviderServer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__NextIntlClientProvider$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-server/NextIntlClientProviderServer.js [app-rsc] (ecmascript) <export default as NextIntlClientProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getMessages$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getMessages$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/server/react-server/getMessages.js [app-rsc] (ecmascript) <export default as getMessages>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$RequestLocaleCache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__setCachedRequestLocale__as__setRequestLocale$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/server/react-server/RequestLocaleCache.js [app-rsc] (ecmascript) <export setCachedRequestLocale as setRequestLocale>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/i18n.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
const BASE = "https://crm.zyrix.co";
function generateStaticParams() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["locales"].map((locale)=>({
            locale
        }));
}
const viewport = {
    themeColor: "#0891B2",
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true
};
async function generateMetadata({ params }) {
    const { locale } = await params;
    const meta = {
        en: {
            title: "Zyrix CRM — The CRM Built for MENA & Turkey",
            titleTemplate: "%s | Zyrix CRM",
            description: "WhatsApp-native CRM with Arabic dialect AI. Sales pipeline, customer loyalty, AI CFO dashboard, and commission engine — all in one platform. Built for Saudi, UAE, Turkey, Iraq & Egypt.",
            keywords: "CRM MENA, CRM Turkey, Arabic CRM, WhatsApp CRM, Salesforce alternative, HubSpot alternative, Zoho alternative, Bitrix24 alternative, AI CFO, sales pipeline, customer loyalty"
        },
        ar: {
            title: "Zyrix CRM — أول CRM حقيقي لمنطقة الشرق الأوسط وتركيا",
            titleTemplate: "%s | Zyrix CRM",
            description: "نظام CRM ذكي مع واتساب مدمج ودعم اللهجات العربية. خط مبيعات، ولاء عملاء، لوحة المدير المالي الذكية، ونظام عمولات — كل شيء في منصة واحدة. مصمّم للسعودية والإمارات وتركيا والعراق ومصر.",
            keywords: "CRM عربي, نظام إدارة علاقات العملاء, CRM واتساب, بديل سيلز فورس, بديل هبسبوت, خط المبيعات, ولاء العملاء, المدير المالي الذكي, اللهجات العربية"
        },
        tr: {
            title: "Zyrix CRM — MENA ve Türkiye için Gerçek CRM",
            titleTemplate: "%s | Zyrix CRM",
            description: "WhatsApp entegreli ve Arapça lehçelerini anlayan akıllı CRM. Satış hunisi, müşteri sadakati, AI CFO paneli ve komisyon motoru — hepsi tek platformda. Suudi Arabistan, BAE, Türkiye, Irak ve Mısır için tasarlandı.",
            keywords: "CRM Türkiye, MENA CRM, Arapça CRM, WhatsApp CRM, Salesforce alternatifi, HubSpot alternatifi, satış hunisi, müşteri sadakati, AI CFO, komisyon yönetimi"
        }
    };
    const current = meta[locale] ?? meta.en;
    const path = locale === "en" ? "" : `/${locale}`;
    const isoLocale = __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["localeToISO"][locale] ?? "en-US";
    return {
        title: {
            default: current.title,
            template: current.titleTemplate
        },
        description: current.description,
        keywords: current.keywords,
        applicationName: "Zyrix CRM",
        authors: [
            {
                name: "Mehmet Fatih",
                url: "https://github.com/mehfatih"
            }
        ],
        creator: "Zyrix",
        publisher: "Zyrix",
        metadataBase: new URL(BASE),
        alternates: {
            canonical: `${BASE}${path}`,
            languages: {
                en: `${BASE}/en`,
                ar: `${BASE}/ar`,
                tr: `${BASE}/tr`,
                "x-default": `${BASE}/en`
            }
        },
        openGraph: {
            title: current.title,
            description: current.description,
            url: `${BASE}${path}`,
            siteName: "Zyrix CRM",
            type: "website",
            locale: isoLocale.replace("-", "_"),
            alternateLocale: Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["localeToISO"]).map((l)=>l.replace("-", "_")).filter((l)=>l !== isoLocale.replace("-", "_")),
            images: [
                {
                    url: `${BASE}/og-image.png`,
                    width: 1200,
                    height: 630,
                    alt: current.title,
                    type: "image/png"
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: current.title,
            description: current.description,
            images: [
                `${BASE}/og-image.png`
            ],
            creator: "@zyrixcrm",
            site: "@zyrixcrm"
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1
            }
        },
        icons: {
            icon: [
                {
                    url: "/logo.png",
                    type: "image/png"
                }
            ],
            apple: [
                {
                    url: "/logo.png",
                    sizes: "180x180",
                    type: "image/png"
                }
            ],
            shortcut: "/logo.png"
        },
        other: {
            "msapplication-TileColor": "#0891B2",
            "msapplication-TileImage": "/logo.png"
        },
        category: "business"
    };
}
async function LocaleLayout({ children, params }) {
    const { locale } = await params;
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isValidLocale"])(locale)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$RequestLocaleCache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__setCachedRequestLocale__as__setRequestLocale$3e$__["setRequestLocale"])(locale);
    const messages = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$server$2f$react$2d$server$2f$getMessages$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__getMessages$3e$__["getMessages"])();
    const direction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDirection"])(locale);
    const isArabic = locale === "ar";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: locale,
        dir: direction,
        suppressHydrationWarning: true,
        className: "scroll-smooth",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.googleapis.com"
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/layout.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.gstatic.com",
                        crossOrigin: "anonymous"
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/layout.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this),
                    isArabic && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/layout.tsx",
                        lineNumber: 185,
                        columnNumber: 11
                    }, this),
                    !isArabic && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/layout.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "format-detection",
                        content: "telephone=no"
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/layout.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "apple-mobile-web-app-capable",
                        content: "yes"
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/layout.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "apple-mobile-web-app-status-bar-style",
                        content: "default"
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/layout.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "apple-mobile-web-app-title",
                        content: "Zyrix CRM"
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/layout.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "mobile-web-app-capable",
                        content: "yes"
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/layout.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "color-scheme",
                        content: "light"
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/layout.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/[locale]/layout.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                className: `${isArabic ? "font-cairo" : "font-inter"} bg-bg-base text-ink antialiased`,
                suppressHydrationWarning: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$server$2f$NextIntlClientProviderServer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__NextIntlClientProvider$3e$__["NextIntlClientProvider"], {
                    locale: locale,
                    messages: messages,
                    children: children
                }, void 0, false, {
                    fileName: "[project]/app/[locale]/layout.tsx",
                    lineNumber: 213,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/[locale]/layout.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/[locale]/layout.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/[locale]/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/[locale]/layout.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=_0das4kj._.js.map