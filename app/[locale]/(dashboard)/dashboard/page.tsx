"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageCircle,
  Settings,
  LogOut,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { getInitials } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";
  const { user, company, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/${locale}/signin`);
    }
  }, [isLoading, isAuthenticated, locale, router]);

  if (isLoading || !user || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-ink-light">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="bg-white border-b border-line-soft sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Zyrix"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-base font-bold text-ink leading-tight">
                {company.name}
              </h1>
              <p className="text-xs text-ink-muted capitalize">
                {company.plan} plan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-ink">
                {user.fullName}
              </span>
              <span className="text-xs text-ink-muted">{user.email}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm">
              {getInitials(user.fullName)}
            </div>
            <button
              onClick={logout}
              className="p-2 text-ink-light hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <div className="bg-gradient-to-r from-primary-600 to-cyan-500 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sm mb-2 opacity-90">
              <Sparkles className="w-4 h-4" />
              <span>Welcome to Zyrix CRM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Hi, {user.fullName.split(" ")[0]}! 👋
            </h2>
            <p className="text-sm sm:text-base opacity-90 max-w-xl">
              Your workspace is ready. Here&apos;s what you can do next to
              get your team up and running.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        </div>
      </section>

      {/* Stats grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={<Users className="w-5 h-5 text-primary-600" />}
            label="Customers"
            value="0"
            hint="Add your first"
          />
          <StatCard
            icon={<Briefcase className="w-5 h-5 text-cyan-600" />}
            label="Deals"
            value="0"
            hint="Pipeline empty"
          />
          <StatCard
            icon={<MessageCircle className="w-5 h-5 text-sky-600" />}
            label="WhatsApp chats"
            value="—"
            hint="Connect WhatsApp"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-success" />}
            label="Tasks done"
            value="0"
            hint="Create your first"
          />
        </div>
      </section>

      {/* Getting Started */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <h3 className="text-lg font-semibold text-ink mb-4">
          Get started with Zyrix CRM
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            icon={<Users className="w-6 h-6" />}
            title="Add your first customer"
            description="Import contacts or create one manually to get started."
            action="Add customer"
            accent="primary"
          />
          <ActionCard
            icon={<Briefcase className="w-6 h-6" />}
            title="Create a deal"
            description="Track opportunities through your sales pipeline."
            action="Create deal"
            accent="cyan"
          />
          <ActionCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="Connect WhatsApp"
            description="Sync conversations and let AI extract customer info."
            action="Connect"
            accent="sky"
            badge="Beta"
          />
          <ActionCard
            icon={<Building2 className="w-6 h-6" />}
            title="Invite teammates"
            description="Bring your team onboard and assign roles."
            action="Invite"
            accent="primary"
          />
          <ActionCard
            icon={<Clock className="w-6 h-6" />}
            title="Set up follow-ups"
            description="Never miss a lead — AI reminds you when to reach out."
            action="Configure"
            accent="cyan"
          />
          <ActionCard
            icon={<Settings className="w-6 h-6" />}
            title="Customize workspace"
            description="Add logo, set currency, tax rates, and tax ID."
            action="Settings"
            accent="sky"
          />
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="bg-white border border-line-soft rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-ink-light">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-ink">{value}</div>
      <div className="text-xs text-ink-muted mt-0.5">{hint}</div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  action,
  accent,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  accent: "primary" | "cyan" | "sky";
  badge?: string;
}) {
  const accentClasses = {
    primary: "text-primary-600 bg-primary-50",
    cyan: "text-cyan-600 bg-cyan-50",
    sky: "text-sky-600 bg-sky-50",
  };

  return (
    <div className="group bg-white border border-line-soft rounded-xl p-5 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer">
      <div
        className={`w-11 h-11 rounded-lg ${accentClasses[accent]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <h4 className="font-semibold text-ink">{title}</h4>
        {badge && (
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-cyan-100 text-cyan-700 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-ink-light mb-4 leading-relaxed">
        {description}
      </p>
      <button className="text-sm font-medium text-primary-600 hover:text-primary-700 group-hover:underline">
        {action} →
      </button>
    </div>
  );
}