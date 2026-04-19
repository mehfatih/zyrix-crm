"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Briefcase,
  MessageCircle,
  Activity as ActivityIcon,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/lib/auth/context";
import { getCustomerStats } from "@/lib/api/customers";

export default function DashboardPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    customers: number;
    customersRecent: number;
  } | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const s = await getCustomerStats();
        setStats({ customers: s.total, customersRecent: s.recent30Days });
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  return (
    <DashboardShell locale={locale}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary-600 to-cyan-500 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden mb-6">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sm mb-2 opacity-90">
              <Sparkles className="w-4 h-4" />
              <span>Welcome to Zyrix CRM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Hi, {user?.fullName.split(" ")[0]}! 👋
            </h2>
            <p className="text-sm sm:text-base opacity-90 max-w-xl">
              Your workspace is ready. Here&apos;s what&apos;s happening.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <StatCard
            icon={<Users className="w-5 h-5 text-primary-600" />}
            label="Customers"
            value={stats?.customers ?? "—"}
            hint={
              stats?.customersRecent
                ? `+${stats.customersRecent} last 30 days`
                : "Add your first"
            }
            href={`/${locale}/customers`}
          />
          <StatCard
            icon={<Briefcase className="w-5 h-5 text-cyan-600" />}
            label="Deals"
            value="—"
            hint="Pipeline"
            href={`/${locale}/deals`}
          />
          <StatCard
            icon={<MessageCircle className="w-5 h-5 text-sky-600" />}
            label="WhatsApp"
            value="—"
            hint="Connect"
            href={`/${locale}/whatsapp`}
          />
          <StatCard
            icon={<ActivityIcon className="w-5 h-5 text-success" />}
            label="Activities"
            value="—"
            hint="This week"
            href={`/${locale}/activities`}
          />
        </div>

        <h3 className="text-lg font-semibold text-ink mb-4">Quick actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            href={`/${locale}/customers`}
            icon={<Users className="w-6 h-6" />}
            title="Manage Customers"
            description="Add, edit, and organize your customer database."
          />
          <ActionCard
            href={`/${locale}/deals`}
            icon={<Briefcase className="w-6 h-6" />}
            title="Track Deals"
            description="Monitor your sales pipeline and close more."
          />
          <ActionCard
            href={`/${locale}/pipeline`}
            icon={<TrendingUp className="w-6 h-6" />}
            title="View Pipeline"
            description="Visual kanban view of your entire sales funnel."
          />
        </div>
      </div>
    </DashboardShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-line-soft rounded-xl p-4 hover:shadow-md hover:border-primary-200 transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-ink-light">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-ink">{value}</div>
      <div className="text-xs text-ink-muted mt-0.5">{hint}</div>
    </Link>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white border border-line-soft rounded-xl p-5 hover:shadow-md hover:border-primary-200 transition-all"
    >
      <div className="w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="font-semibold text-ink mb-1.5">{title}</h4>
      <p className="text-sm text-ink-light mb-4">{description}</p>
      <span className="text-sm font-medium text-primary-600 group-hover:underline inline-flex items-center gap-1">
        Open <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}