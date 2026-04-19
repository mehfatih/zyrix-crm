"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getPipeline, type PipelineData, type Deal } from "@/lib/api/deals";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { cn } from "@/lib/utils";

const STAGE_ORDER = ["lead", "qualified", "proposal", "negotiation"];
const STAGE_LABELS: Record<string, string> = {
  lead: "Lead",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
};

const STAGE_COLORS: Record<string, string> = {
  lead: "border-t-sky-500",
  qualified: "border-t-cyan-500",
  proposal: "border-t-amber-500",
  negotiation: "border-t-purple-500",
};

export default function PipelinePage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";
  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await getPipeline();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <DashboardShell locale={locale}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">Sales Pipeline</h1>
          <p className="text-sm text-ink-light mt-1">
            Visualize deals across stages
          </p>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAGE_ORDER.map((stage) => {
              const deals = data?.pipeline[stage] || [];
              const summary = data?.summary.find((s) => s.stage === stage);

              return (
                <div
                  key={stage}
                  className={cn(
                    "bg-white rounded-xl border border-line-soft border-t-4",
                    STAGE_COLORS[stage]
                  )}
                >
                  <div className="p-4 border-b border-line-soft">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-ink">
                        {STAGE_LABELS[stage]}
                      </h3>
                      <span className="text-xs text-ink-light bg-bg-subtle px-2 py-0.5 rounded-full">
                        {summary?.count || 0}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted">
                      ${(summary?.totalValue || 0).toLocaleString()} total
                    </p>
                  </div>
                  <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
                    {deals.length === 0 ? (
                      <p className="text-xs text-ink-muted text-center py-8">
                        No deals
                      </p>
                    ) : (
                      deals.map((deal: Deal) => (
                        <div
                          key={deal.id}
                          className="bg-bg-subtle p-3 rounded-lg hover:bg-white hover:shadow-sm cursor-pointer transition-all"
                        >
                          <p className="text-sm font-medium text-ink line-clamp-2 mb-1">
                            {deal.title}
                          </p>
                          <p className="text-xs text-ink-light mb-2">
                            {deal.customer?.fullName || "No customer"}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-ink">
                              {deal.currency}{" "}
                              {Number(deal.value).toLocaleString()}
                            </span>
                            <span className="text-xs text-ink-muted">
                              {deal.probability}%
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}