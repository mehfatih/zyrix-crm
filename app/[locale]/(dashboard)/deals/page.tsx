"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Briefcase, Loader2, Plus } from "lucide-react";
import { listDeals, type Deal, type DealStage } from "@/lib/api/deals";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { formatDate, cn } from "@/lib/utils";

const STAGE_COLORS: Record<DealStage, string> = {
  lead: "bg-sky-100 text-sky-700",
  qualified: "bg-cyan-100 text-cyan-700",
  proposal: "bg-amber-100 text-amber-700",
  negotiation: "bg-purple-100 text-purple-700",
  won: "bg-success-light text-success-dark",
  lost: "bg-danger-light text-danger-dark",
};

export default function DealsPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState<string>("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await listDeals({
          stage: stageFilter || undefined,
          limit: 100,
        });
        setDeals(result.deals);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [stageFilter]);

  const totalValue = deals.reduce(
    (sum, d) => sum + (d.stage === "won" ? Number(d.value) : 0),
    0
  );

  return (
    <DashboardShell locale={locale}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink">Deals</h1>
            <p className="text-sm text-ink-light mt-1">
              {deals.length} deals · ${totalValue.toLocaleString()} won
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 shadow-sm">
            <Plus className="w-4 h-4" />
            New deal
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["", "lead", "qualified", "proposal", "negotiation", "won", "lost"].map(
            (stage) => (
              <button
                key={stage || "all"}
                onClick={() => setStageFilter(stage)}
                className={cn(
                  "px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors capitalize",
                  stageFilter === stage
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-line text-ink-light hover:bg-bg-subtle"
                )}
              >
                {stage || "All"}
              </button>
            )
          )}
        </div>

        <div className="bg-white rounded-xl border border-line-soft overflow-hidden">
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : deals.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-ink-muted mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-ink mb-1">
                No deals yet
              </h3>
              <p className="text-sm text-ink-light">
                Create your first deal to track sales opportunities.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-subtle border-b border-line-soft">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ink-light uppercase">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ink-light uppercase hidden md:table-cell">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-ink-light uppercase">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ink-light uppercase">
                      Stage
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-ink-light uppercase hidden sm:table-cell">
                      Probability
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-ink-light uppercase hidden lg:table-cell">
                      Expected close
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {deals.map((deal) => (
                    <tr
                      key={deal.id}
                      className="hover:bg-bg-subtle cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-ink">
                          {deal.title}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-ink-light">
                          {deal.customer?.fullName || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm font-semibold text-ink">
                          {deal.currency} {Number(deal.value).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full capitalize",
                            STAGE_COLORS[deal.stage]
                          )}
                        >
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-ink-light hidden sm:table-cell">
                        {deal.probability}%
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-ink-muted hidden lg:table-cell">
                        {deal.expectedCloseDate
                          ? formatDate(deal.expectedCloseDate, locale)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}