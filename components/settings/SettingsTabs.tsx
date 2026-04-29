"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { User, Building2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileTab } from "./ProfileTab";
import { CompanyTab } from "./CompanyTab";
import { SecurityTab } from "./SecurityTab";

type TabId = "profile" | "company" | "security";

interface SettingsTabsProps {
  locale: string;
}

export function SettingsTabs({ locale }: SettingsTabsProps) {
  const t = useTranslations("Settings.tabs");
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const tabs: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
    { id: "profile", label: t("profile"), icon: User },
    { id: "company", label: t("company"), icon: Building2 },
    { id: "security", label: t("security"), icon: Lock },
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex border-b border-border bg-muted px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all",
                isActive
                  ? "border-primary-600 text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="p-6">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "company" && <CompanyTab />}
        {activeTab === "security" && <SecurityTab locale={locale} />}
      </div>
    </div>
  );
}
