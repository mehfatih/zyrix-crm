"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { WorkflowBuilder } from "@/components/workflows/WorkflowBuilder";
import { getWorkflow, type Workflow } from "@/lib/api/advanced";

export default function EditWorkflowPage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = (params?.locale || "en") as "en" | "ar" | "tr";
  const id = params?.id;

  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getWorkflow(id)
      .then(setWorkflow)
      .catch((e) => setError(e?.message || "Failed"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-3xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : workflow ? (
          <WorkflowBuilder locale={locale} initial={workflow} />
        ) : null}
      </div>
    </DashboardShell>
  );
}
