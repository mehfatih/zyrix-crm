"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { WorkflowBuilder } from "@/components/workflows/WorkflowBuilder";

export default function NewWorkflowPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-3xl mx-auto">
        <WorkflowBuilder locale={locale} />
      </div>
    </DashboardShell>
  );
}
