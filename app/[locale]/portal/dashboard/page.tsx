"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Loader2,
  Sparkles,
  LogOut,
  FileText,
  FileSignature,
  Award,
  ExternalLink,
  User,
  Mail,
  Phone,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import {
  fetchPortalDashboard,
  portalLogout,
  getPortalSession,
  type PortalDashboard,
  type PortalQuote,
  type PortalContract,
} from "@/lib/api/portal";

// ============================================================================
// CUSTOMER PORTAL — DASHBOARD
// ============================================================================

export default function PortalDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Portal.dashboard");

  const [data, setData] = useState<PortalDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getPortalSession();
    if (!token) {
      router.replace(`/${locale}/portal`);
      return;
    }

    (async () => {
      try {
        const d = await fetchPortalDashboard();
        setData(d);
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 401) {
          router.replace(`/${locale}/portal`);
          return;
        }
        setError(e instanceof Error ? e.message : "Failed");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await portalLogout();
    router.replace(`/${locale}/portal`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-50 flex items-center justify-center p-4">
        <div className="max-w-md bg-white border border-red-200 rounded-xl p-6 shadow-xl text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-sm text-slate-600">{error}</p>
          <button
            onClick={() => router.push(`/${locale}/portal`)}
            className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium"
          >
            {t("backToLogin")}
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50/30 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-sky-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-sky-900">
                {data.customer.company.name}
              </div>
              <div className="text-xs text-slate-500">{t("customerPortal")}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-sky-600 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            {t("logout")}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-sky-900">
            {t("welcome", { name: data.customer.fullName })}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{t("welcomeSubtitle")}</p>
        </div>

        {/* Profile card */}
        <div className="bg-white border border-sky-100 rounded-xl p-5">
          <h2 className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {t("profile.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {data.customer.companyName && (
              <InfoRow
                icon={Building2}
                label={t("profile.company")}
                value={data.customer.companyName}
              />
            )}
            {data.customer.email && (
              <InfoRow
                icon={Mail}
                label={t("profile.email")}
                value={data.customer.email}
              />
            )}
            {data.customer.phone && (
              <InfoRow
                icon={Phone}
                label={t("profile.phone")}
                value={data.customer.phone}
              />
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatTile
            icon={FileText}
            label={t("stats.quotes")}
            value={data.quotes.length}
            color="cyan"
          />
          <StatTile
            icon={FileSignature}
            label={t("stats.contracts")}
            value={data.contracts.length}
            color="sky"
          />
          <StatTile
            icon={Award}
            label={t("stats.loyaltyBalance")}
            value={formatNumber(data.loyaltyBalance)}
            color="amber"
          />
        </div>

        {/* Quotes */}
        <Section
          icon={FileText}
          title={t("quotes.title")}
          subtitle={t("quotes.subtitle")}
        >
          {data.quotes.length === 0 ? (
            <EmptyRow label={t("quotes.empty")} />
          ) : (
            <div className="divide-y divide-sky-50">
              {data.quotes.map((q, idx) => (
                <QuoteRow
                  key={idx}
                  quote={q}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
          )}
        </Section>

        {/* Contracts */}
        <Section
          icon={FileSignature}
          title={t("contracts.title")}
          subtitle={t("contracts.subtitle")}
        >
          {data.contracts.length === 0 ? (
            <EmptyRow label={t("contracts.empty")} />
          ) : (
            <div className="divide-y divide-sky-50">
              {data.contracts.map((c, idx) => (
                <ContractRow
                  key={idx}
                  contract={c}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
          )}
        </Section>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 py-6">
          {t("footer.needHelp")}{" "}
          <span className="text-sky-600 font-medium">
            {data.customer.company.name}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Section wrapper
// ============================================================================
function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof FileText;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-sky-100 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-sky-100 bg-sky-50/50 flex items-center gap-2">
        <Icon className="w-4 h-4 text-sky-500" />
        <div>
          <h3 className="text-sm font-bold text-sky-900">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="py-10 text-center text-sm text-slate-500">
      <Sparkles className="w-8 h-8 mx-auto mb-2 text-sky-300" />
      {label}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-sky-50/40 border border-sky-100 rounded-lg px-3 py-2">
      <div className="text-xs text-slate-500 flex items-center gap-1.5">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="text-sm text-sky-900 font-medium mt-0.5 truncate">
        {value}
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof FileText;
  label: string;
  value: string | number;
  color: "cyan" | "sky" | "amber";
}) {
  const colors: Record<string, { iconBg: string; iconText: string }> = {
    cyan: { iconBg: "bg-sky-50", iconText: "text-sky-500" },
    sky: { iconBg: "bg-sky-50", iconText: "text-sky-600" },
    amber: { iconBg: "bg-amber-50", iconText: "text-amber-600" },
  };
  const c = colors[color];
  return (
    <div className="bg-white border border-sky-100 rounded-xl p-4 flex items-center gap-3">
      <div className={`${c.iconBg} ${c.iconText} p-3 rounded-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-xl font-bold text-sky-900">{value}</div>
      </div>
    </div>
  );
}

function QuoteRow({
  quote,
  locale,
  t,
}: {
  quote: PortalQuote;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const statusStyle: Record<string, string> = {
    draft: "bg-slate-50 text-slate-600",
    sent: "bg-sky-50 text-sky-700",
    viewed: "bg-sky-50 text-sky-600",
    accepted: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
    expired: "bg-amber-50 text-amber-700",
  };
  const style = statusStyle[quote.status] || "bg-slate-50 text-slate-600";

  return (
    <a
      href={`/${locale}/q/${quote.publicToken}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-5 py-3 hover:bg-sky-50/30 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-sky-600 font-medium">
            {quote.quoteNumber}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${style}`}
          >
            {t(`status.${quote.status}`, { fallback: quote.status })}
          </span>
        </div>
        <div className="text-sm font-medium text-sky-900 mt-0.5 truncate">
          {quote.title}
        </div>
        {quote.validUntil && (
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {t("quotes.validUntil")}: {formatDate(quote.validUntil, locale)}
          </div>
        )}
      </div>
      <div className="text-right rtl:text-left">
        <div className="font-bold text-sky-900">
          {formatMoney(Number(quote.total), quote.currency, locale)}
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-slate-400 inline-block ltr:ml-1 rtl:mr-1 mt-1" />
      </div>
    </a>
  );
}

function ContractRow({
  contract,
  locale,
  t,
}: {
  contract: PortalContract;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const statusIcon: Record<string, typeof CheckCircle2> = {
    draft: Clock,
    pending_signature: Clock,
    signed: CheckCircle2,
    active: CheckCircle2,
    expired: XCircle,
    terminated: XCircle,
  };
  const StatusIcon = statusIcon[contract.status] || Clock;
  const statusStyle: Record<string, string> = {
    draft: "bg-slate-50 text-slate-600",
    pending_signature: "bg-amber-50 text-amber-700",
    signed: "bg-sky-50 text-sky-700",
    active: "bg-emerald-50 text-emerald-700",
    expired: "bg-red-50 text-red-700",
    terminated: "bg-slate-100 text-slate-600",
  };
  const style = statusStyle[contract.status] || "bg-slate-50 text-slate-600";

  const content = (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-sky-600 font-medium">
            {contract.contractNumber}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${style}`}
          >
            <StatusIcon className="w-2.5 h-2.5" />
            {t(`contractStatus.${contract.status}`, {
              fallback: contract.status,
            })}
          </span>
        </div>
        <div className="text-sm font-medium text-sky-900 mt-0.5 truncate">
          {contract.title}
        </div>
        {contract.endDate && (
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {t("contracts.until")}: {formatDate(contract.endDate, locale)}
          </div>
        )}
      </div>
      <div className="text-right rtl:text-left">
        <div className="font-bold text-sky-900">
          {formatMoney(Number(contract.value), contract.currency, locale)}
        </div>
        {contract.fileUrl && (
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 inline-block ltr:ml-1 rtl:mr-1 mt-1" />
        )}
      </div>
    </>
  );

  if (contract.fileUrl) {
    return (
      <a
        href={contract.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-5 py-3 hover:bg-sky-50/30 transition-colors"
      >
        {content}
      </a>
    );
  }
  return (
    <div className="flex items-center gap-3 px-5 py-3">{content}</div>
  );
}

// Helpers
function formatMoney(
  amount: number,
  currency: string,
  locale: string
): string {
  const loc =
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Intl.NumberFormat(loc, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n);
}

function formatDate(iso: string, locale: string): string {
  const loc =
    locale === "ar" ? "ar-SA" : locale === "tr" ? "tr-TR" : "en-US";
  try {
    return new Date(iso).toLocaleDateString(loc, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
