"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  MapPin,
  Activity,
  Info,
  Loader2,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";
import { getCustomer, type Customer } from "@/lib/api/customers";
import { DashboardShell } from "@/components/layout/DashboardShell";
import ActivityTimeline from "@/components/advanced/ActivityTimeline";
import { cn, getInitials, formatDate } from "@/lib/utils";

// ============================================================================
// CUSTOMER DETAIL PAGE — with Overview + Activity Timeline tabs
// ============================================================================

type Tab = "overview" | "timeline";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-sky-100 text-cyan-300",
  qualified: "bg-sky-100 text-cyan-300",
  customer: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  lost: "bg-muted text-muted-foreground",
};

export default function CustomerDetailPage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = params?.locale || "en";
  const customerId = params?.id || "";

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!customerId) return;
    (async () => {
      try {
        const data = await getCustomer(customerId);
        setCustomer(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [customerId]);

  if (loading) {
    return (
      <DashboardShell locale={locale}>
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
        </div>
      </DashboardShell>
    );
  }

  if (!customer) {
    return (
      <DashboardShell locale={locale}>
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">Customer not found.</p>
          <Link
            href={`/${locale}/customers`}
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-cyan-300 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to customers
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-4 flex-wrap">
          <Link
            href={`/${locale}/customers`}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
            {getInitials(customer.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">CUSTOMERS</p>
            <h1 className="text-2xl font-bold text-foreground truncate">
              {customer.fullName}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {customer.position && (
                <span className="text-sm text-muted-foreground">{customer.position}</span>
              )}
              {customer.companyName && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{customer.companyName}</span>
                </>
              )}
              <span
                className={cn(
                  "inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full capitalize",
                  STATUS_COLORS[customer.status] || "bg-muted text-foreground"
                )}
              >
                {customer.status}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border flex gap-1">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            Icon={Info}
            label="Overview"
          />
          <TabButton
            active={activeTab === "timeline"}
            onClick={() => setActiveTab("timeline")}
            Icon={Activity}
            label="Activity timeline"
          />
        </div>

        {/* Content */}
        {activeTab === "overview" ? (
          <OverviewTab customer={customer} locale={locale} />
        ) : (
          <ActivityTimeline customerId={customerId} locale={locale} />
        )}
      </div>
    </DashboardShell>
  );
}

function TabButton({
  active,
  onClick,
  Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  Icon: typeof Info;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
        active
          ? "border-sky-500 text-cyan-300"
          : "border-transparent text-muted-foreground hover:text-cyan-300"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function OverviewTab({ customer, locale }: { customer: Customer; locale: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard title="Contact">
        <InfoRow icon={Mail} label="Email" value={customer.email} />
        <InfoRow icon={Phone} label="Phone" value={customer.phone} />
        <InfoRow
          icon={MessageCircle}
          label="WhatsApp"
          value={customer.whatsappPhone}
        />
      </InfoCard>

      <InfoCard title="Location">
        <InfoRow icon={Building2} label="Company" value={customer.companyName} />
        <InfoRow
          icon={MapPin}
          label="Location"
          value={[customer.city, customer.country].filter(Boolean).join(", ") || null}
        />
        <InfoRow icon={User} label="Position" value={customer.position} />
      </InfoCard>

      <InfoCard title="Business">
        <InfoRow
          icon={DollarSign}
          label="Lifetime value"
          value={customer.lifetimeValue ? `$${Number(customer.lifetimeValue).toFixed(2)}` : null}
        />
        <InfoRow icon={Info} label="Source" value={customer.source} />
        <InfoRow icon={Calendar} label="Added" value={formatDate(customer.createdAt, locale)} />
      </InfoCard>

      {customer.notes && (
        <InfoCard title="Notes">
          <p className="text-sm text-foreground whitespace-pre-wrap">{customer.notes}</p>
        </InfoCard>
      )}
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Info;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
      <span className="text-muted-foreground w-20 flex-shrink-0">{label}:</span>
      <span className="text-foreground break-all">
        {value || <span className="text-muted-foreground italic">—</span>}
      </span>
    </div>
  );
}
