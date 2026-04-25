"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Code2,
  Zap,
  Globe,
  Loader2,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// API DOCUMENTATION PAGE
// ----------------------------------------------------------------------------
// Self-hosted reference without pulling in a heavyweight Swagger UI lib
// (would add ~400KB). Renders the key endpoint reference inline as HTML
// for the common cases, with a link to the raw OpenAPI spec for anyone
// who wants to consume it via Postman or codegen.
// ============================================================================

const BASE_URL = "https://api.crm.zyrix.co";

interface EndpointSpec {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  label: { en: string; ar: string; tr: string };
  description: { en: string; ar: string; tr: string };
  scope: "read" | "write";
  requestBody?: string; // JSON sample
  response?: string; // JSON sample
}

const ENDPOINTS: {
  section: { en: string; ar: string; tr: string };
  items: EndpointSpec[];
}[] = [
  {
    section: { en: "Authentication", ar: "المصادقة", tr: "Kimlik doğrulama" },
    items: [
      {
        method: "GET",
        path: "/v1/auth/test",
        label: {
          en: "Verify API key",
          ar: "التحقق من مفتاح API",
          tr: "API anahtarını doğrula",
        },
        description: {
          en: "Returns 200 with company id if key is valid.",
          ar: "يرجع 200 مع معرّف الشركة لو المفتاح صالح.",
          tr: "Anahtar geçerliyse şirket kimliği ile 200 döndürür.",
        },
        scope: "read",
        response: `{
  "data": {
    "authenticated": true,
    "companyId": "abc-123...",
    "apiVersion": "v1"
  }
}`,
      },
    ],
  },
  {
    section: { en: "Customers", ar: "العملاء", tr: "Müşteriler" },
    items: [
      {
        method: "GET",
        path: "/v1/customers",
        label: {
          en: "List customers",
          ar: "قائمة العملاء",
          tr: "Müşterileri listele",
        },
        description: {
          en: "Supports page, limit, search, status, since (ISO date) filters.",
          ar: "يدعم page، limit، search، status، since (تاريخ ISO) مرشحات.",
          tr: "page, limit, search, status, since (ISO tarih) filtrelerini destekler.",
        },
        scope: "read",
        response: `{
  "data": [
    {
      "id": "uuid",
      "fullName": "Ahmed Al-Farsi",
      "email": "ahmed@example.com",
      "phone": "+966 50 111 2233",
      "status": "customer",
      "source": "instagram",
      "createdAt": "2026-04-01T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 150 }
}`,
      },
      {
        method: "POST",
        path: "/v1/customers",
        label: {
          en: "Create customer",
          ar: "إنشاء عميل",
          tr: "Müşteri oluştur",
        },
        description: {
          en: "Only fullName is required.",
          ar: "fullName فقط مطلوب.",
          tr: "Yalnızca fullName gereklidir.",
        },
        scope: "write",
        requestBody: `{
  "fullName": "Maria Silva",
  "email": "maria@example.com",
  "phone": "+55 11 99999 8888",
  "source": "website"
}`,
        response: `{
  "data": { "id": "uuid", "fullName": "Maria Silva", ... }
}`,
      },
    ],
  },
  {
    section: { en: "Deals", ar: "الصفقات", tr: "Anlaşmalar" },
    items: [
      {
        method: "GET",
        path: "/v1/deals",
        label: {
          en: "List deals",
          ar: "قائمة الصفقات",
          tr: "Anlaşmaları listele",
        },
        description: {
          en: "Supports page, limit, stage, customerId, since filters.",
          ar: "يدعم page، limit، stage، customerId، since مرشحات.",
          tr: "page, limit, stage, customerId, since filtrelerini destekler.",
        },
        scope: "read",
        response: `{
  "data": [
    {
      "id": "uuid",
      "title": "Q4 Enterprise Deal",
      "value": 24000,
      "currency": "USD",
      "stage": "proposal",
      "probability": 60
    }
  ]
}`,
      },
      {
        method: "POST",
        path: "/v1/deals",
        label: {
          en: "Create deal",
          ar: "إنشاء صفقة",
          tr: "Anlaşma oluştur",
        },
        description: {
          en: "Requires title + customerId.",
          ar: "يحتاج title + customerId.",
          tr: "title + customerId gerektirir.",
        },
        scope: "write",
        requestBody: `{
  "title": "New renewal",
  "customerId": "uuid",
  "value": 12000,
  "currency": "USD",
  "stage": "negotiation"
}`,
      },
    ],
  },
  {
    section: { en: "Activities", ar: "الأنشطة", tr: "Etkinlikler" },
    items: [
      {
        method: "POST",
        path: "/v1/activities",
        label: {
          en: "Create activity",
          ar: "إنشاء نشاط",
          tr: "Etkinlik oluştur",
        },
        description: {
          en: "Log a note, call, email, meeting, or task.",
          ar: "سجّل ملاحظة، مكالمة، بريد، اجتماع، أو مهمة.",
          tr: "Not, arama, e-posta, toplantı veya görev kaydedin.",
        },
        scope: "write",
        requestBody: `{
  "type": "call",
  "title": "Discovery call",
  "customerId": "uuid",
  "content": "15 min overview"
}`,
      },
    ],
  },
];

export default function ApiDocsPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const copyUrl = async (path: string) => {
    await navigator.clipboard.writeText(`${BASE_URL}${path}`);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <DashboardShell locale={locale}>
      <div
        className="p-6 max-w-4xl mx-auto space-y-5"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/settings/api`}
            className="w-9 h-9 rounded-lg bg-white border border-sky-200 hover:bg-sky-50 flex items-center justify-center text-slate-500 hover:text-sky-600"
          >
            <ArrowLeft
              className={`w-4 h-4 ${isRtl ? "-scale-x-100" : ""}`}
            />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sky-900">
              {tr(
                "API documentation",
                "توثيق الـ API",
                "API dokümantasyonu"
              )}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              {tr(
                "REST endpoints for programmatic access to Zyrix CRM.",
                "REST endpoints للوصول البرمجي لـ Zyrix CRM.",
                "Zyrix CRM'e programatik erişim için REST uç noktaları."
              )}
            </p>
          </div>
        </div>

        {/* Base URL + OpenAPI links */}
        <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/40 to-sky-50/40 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
                {tr("Base URL", "الرابط الأساسي", "Temel URL")}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 px-2 py-1 bg-white border border-sky-200 rounded text-xs font-mono text-slate-700 overflow-x-auto" dir="ltr">
                  {BASE_URL}
                </code>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wide">
                {tr("OpenAPI spec", "مواصفات OpenAPI", "OpenAPI spesifikasyonu")}
              </div>
              <a
                href={`${BASE_URL}/v1/openapi.json`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 bg-white border border-sky-200 hover:border-sky-300 rounded text-xs font-semibold text-sky-600"
              >
                <Code2 className="w-3.5 h-3.5" />
                /v1/openapi.json
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Auth example */}
        <section>
          <h2 className="text-sm font-bold text-sky-900 mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {tr(
              "Authentication",
              "المصادقة",
              "Kimlik doğrulama"
            )}
          </h2>
          <div className="rounded-xl border border-sky-100 bg-white p-4">
            <p className="text-sm text-slate-700 mb-3">
              {tr(
                "Include your API key in the Authorization header:",
                "ضع مفتاح الـ API في ترويسة Authorization:",
                "API anahtarınızı Authorization başlığına ekleyin:"
              )}
            </p>
            <pre
              className="bg-slate-900 text-slate-100 rounded-lg p-3 text-xs font-mono overflow-x-auto"
              dir="ltr"
            >
{`Authorization: Bearer zy_live_YOUR_KEY_HERE

# Example with curl:
curl -H "Authorization: Bearer zy_live_..." \\
     ${BASE_URL}/v1/customers`}
            </pre>
          </div>
        </section>

        {/* Endpoint sections */}
        {ENDPOINTS.map((section, si) => (
          <section key={si}>
            <h2 className="text-sm font-bold text-sky-900 mb-2">
              {section.section[locale]}
            </h2>
            <div className="space-y-2">
              {section.items.map((ep, i) => (
                <EndpointCard
                  key={i}
                  endpoint={ep}
                  locale={locale}
                  tr={tr}
                  copiedPath={copiedPath}
                  onCopy={copyUrl}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Zapier link */}
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white text-orange-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-amber-900">
              {tr(
                "Using Zapier instead?",
                "بتستعمل Zapier بدالها؟",
                "Bunun yerine Zapier mi kullanıyorsunuz?"
              )}
            </div>
            <p className="text-xs text-amber-800 mt-0.5">
              {tr(
                "Skip the code — connect Zyrix to 5,000+ apps with no-code Zaps.",
                "تخطَّ الكود — اربط Zyrix بـ 5,000+ تطبيق بـ Zaps بدون برمجة.",
                "Kodu atlayın — Zyrix'i kodsuz Zaps ile 5.000+ uygulamaya bağlayın."
              )}
            </p>
          </div>
          <a
            href="https://zapier.com/apps/search?q=zyrix"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold flex-shrink-0"
          >
            {tr("Open Zapier", "افتح Zapier", "Zapier'ı aç")}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// ENDPOINT CARD
// ============================================================================

function EndpointCard({
  endpoint,
  locale,
  tr,
  copiedPath,
  onCopy,
}: {
  endpoint: EndpointSpec;
  locale: "en" | "ar" | "tr";
  tr: (en: string, ar: string, trk: string) => string;
  copiedPath: string | null;
  onCopy: (path: string) => void;
}) {
  const methodColor: Record<string, string> = {
    GET: "bg-sky-100 text-sky-800 border-sky-200",
    POST: "bg-emerald-100 text-emerald-800 border-emerald-200",
    PATCH: "bg-amber-100 text-amber-800 border-amber-200",
    DELETE: "bg-rose-100 text-rose-800 border-rose-200",
  };
  return (
    <div className="rounded-xl border border-sky-100 bg-white overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-sky-50/40 border-b border-sky-100">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${methodColor[endpoint.method]}`}
        >
          {endpoint.method}
        </span>
        <code className="text-xs font-mono text-slate-700 flex-1 truncate" dir="ltr">
          {endpoint.path}
        </code>
        <span
          className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 border ${
            endpoint.scope === "write"
              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
              : "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          {endpoint.scope}
        </span>
        <button
          onClick={() => onCopy(endpoint.path)}
          className="w-6 h-6 rounded text-slate-400 hover:text-sky-600 hover:bg-sky-50 flex items-center justify-center"
          title={tr("Copy URL", "نسخ الرابط", "URL'yi kopyala")}
        >
          {copiedPath === endpoint.path ? (
            <Check className="w-3 h-3 text-emerald-600" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>
      <div className="p-3 space-y-2">
        <div className="text-sm font-semibold text-sky-900">
          {endpoint.label[locale]}
        </div>
        <p className="text-xs text-slate-600">
          {endpoint.description[locale]}
        </p>
        {endpoint.requestBody && (
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-500 mt-2 mb-1">
              {tr("Request body", "محتوى الطلب", "İstek gövdesi")}
            </div>
            <pre
              className="bg-slate-900 text-slate-100 rounded p-2 text-[11px] font-mono overflow-x-auto"
              dir="ltr"
            >
              {endpoint.requestBody}
            </pre>
          </div>
        )}
        {endpoint.response && (
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-500 mt-2 mb-1">
              {tr("Response", "الاستجابة", "Yanıt")}
            </div>
            <pre
              className="bg-slate-50 border border-slate-200 rounded p-2 text-[11px] font-mono overflow-x-auto text-slate-700"
              dir="ltr"
            >
              {endpoint.response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
