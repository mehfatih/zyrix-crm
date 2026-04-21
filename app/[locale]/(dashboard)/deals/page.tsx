"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Briefcase, Loader2, Plus, Filter, X } from "lucide-react";
import { listDeals, type Deal, type DealStage } from "@/lib/api/deals";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CreateDealModal } from "@/components/deals/CreateDealModal";
import { formatDate, cn } from "@/lib/utils";
import ExportButton from "@/components/advanced/ExportButton";
import BulkActionBar from "@/components/advanced/BulkActionBar";
import AdvancedFilterBuilder from "@/components/advanced/AdvancedFilterBuilder";

const DEAL_FILTER_FIELDS = [
  { key: "title", label: "Title", type: "text" as const },
  {
    key: "stage",
    label: "Stage",
    type: "select" as const,
    options: ["lead", "qualified", "proposal", "negotiation", "won", "lost"],
  },
  { key: "value", label: "Value", type: "number" as const },
  { key: "currency", label: "Currency", type: "text" as const },
  { key: "probability", label: "Probability", type: "number" as const },
  { key: "expectedCloseDate", label: "Expected close", type: "date" as const },
  { key: "actualCloseDate", label: "Actual close", type: "date" as const },
  { key: "createdAt", label: "Created", type: "date" as const },
];

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showFilter, setShowFilter] = useState(false);
  const [filterResults, setFilterResults] = useState<Deal[] | null>(null);
  const [filterCount, setFilterCount] = useState(0);

  const fetchDeals = async () => {
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

  useEffect(() => {
    if (filterResults) return;
    fetchDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageFilter, filterResults]);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchDeals();
  };

  const displayedDeals = filterResults ?? deals;

  const clearAdvancedFilter = () => {
    setFilterResults(null);
    setFilterCount(0);
  };

  const totalValue = displayedDeals.reduce(
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
              {displayedDeals.length} deals · ${totalValue.toLocaleString()} won
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilter((v) => !v)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                showFilter || filterResults
                  ? "bg-cyan-600 text-white hover:bg-cyan-700"
                  : "bg-white border border-sky-200 text-slate-700 hover:bg-sky-50"
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
              {filterResults && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-bold">
                  {filterCount}
                </span>
              )}
            </button>
            <ExportButton entityType="deals" />
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New deal
            </button>
          </div>
        </div>

        {showFilter && (
          <div className="mb-4">
            <AdvancedFilterBuilder
              entityType="deals"
              fields={DEAL_FILTER_FIELDS}
              onResults={(items, total) => {
                setFilterResults(items as Deal[]);
                setFilterCount(total);
                setShowFilter(false);
              }}
              onClose={() => setShowFilter(false)}
            />
          </div>
        )}

        {filterResults && !showFilter && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-cyan-50 border border-cyan-100 rounded-lg">
            <Filter className="w-4 h-4 text-cyan-700" />
            <span className="text-sm text-cyan-800">
              Showing {filterCount} results from advanced filter
            </span>
            <button
              onClick={clearAdvancedFilter}
              className="ml-auto inline-flex items-center gap-1 px-2 py-1 text-xs text-cyan-700 hover:bg-cyan-100 rounded"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        )}

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
          ) : displayedDeals.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-ink-muted mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-ink mb-1">
                {filterResults ? "No matches" : "No deals yet"}
              </h3>
              <p className="text-sm text-ink-light">
                {filterResults
                  ? "Try adjusting your filter conditions."
                  : "Create your first deal to track sales opportunities."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-subtle border-b border-line-soft">
                  <tr>
                    <th className="px-3 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={displayedDeals.length > 0 && selectedIds.size === displayedDeals.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(new Set(displayedDeals.map((d) => d.id)));
                          } else {
                            setSelectedIds(new Set());
                          }
                        }}
                        className="rounded border-sky-300 text-cyan-600 focus:ring-cyan-500"
                      />
                    </th>
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
                  {displayedDeals.map((deal) => (
                    <tr
                      key={deal.id}
                      className={cn(
                        "hover:bg-bg-subtle",
                        selectedIds.has(deal.id) && "bg-cyan-50/40"
                      )}
                    >
                      <td className="px-3 py-3 w-10" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(deal.id)}
                          onChange={(e) => {
                            const next = new Set(selectedIds);
                            if (e.target.checked) next.add(deal.id);
                            else next.delete(deal.id);
                            setSelectedIds(next);
                          }}
                          className="rounded border-sky-300 text-cyan-600 focus:ring-cyan-500"
                        />
                      </td>
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

      {showCreateModal && (
        <CreateDealModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      <BulkActionBar
        entityType="deals"
        selectedIds={Array.from(selectedIds)}
        onClearSelection={() => setSelectedIds(new Set())}
        onActionComplete={() => {
          setSelectedIds(new Set());
          fetchDeals();
        }}
      />
    </DashboardShell>
  );
}
