"use client";

import { useState } from "react";
import { Trash2, Users, Tag, ChevronDown, Loader2, X, AlertTriangle, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  bulkAction,
  type BulkActionType,
  type BulkActionResult,
} from "@/lib/api/advanced";

// ============================================================================
// BULK ACTION BAR — floating toolbar when items selected
// ============================================================================

interface BulkActionBarProps {
  entityType: "customers" | "deals";
  selectedIds: string[];
  onClearSelection: () => void;
  onActionComplete: () => void;
  // Optional data for dropdowns
  users?: { id: string; fullName: string }[];
  statusOptions?: string[];
  stageOptions?: string[];
  tags?: { id: string; name: string }[];
}

export default function BulkActionBar({
  entityType,
  selectedIds,
  onClearSelection,
  onActionComplete,
  users = [],
  statusOptions = ["new", "qualified", "customer", "lost"],
  stageOptions = ["lead", "qualified", "proposal", "negotiation", "won", "lost"],
  tags = [],
}: BulkActionBarProps) {
  const t = useTranslations("Bulk");
  const [loading, setLoading] = useState<BulkActionType | null>(null);
  const [result, setResult] = useState<BulkActionResult | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showOwnerMenu, setShowOwnerMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showStageMenu, setShowStageMenu] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);

  if (selectedIds.length === 0) return null;

  const run = async (
    action: BulkActionType,
    params?: { ownerId?: string; status?: string; stage?: string; tagId?: string }
  ) => {
    setLoading(action);
    setResult(null);
    try {
      const r = await bulkAction(entityType, action, selectedIds, params);
      setResult(r);
      if (r.succeeded > 0) {
        setTimeout(() => {
          onActionComplete();
          setResult(null);
          onClearSelection();
        }, 1200);
      }
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message || "Action failed");
    } finally {
      setLoading(null);
      setConfirmDelete(false);
      setShowOwnerMenu(false);
      setShowStatusMenu(false);
      setShowStageMenu(false);
      setShowTagMenu(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-3xl w-full px-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 flex-wrap">
        {/* Selection count */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-muted text-cyan-300 flex items-center justify-center text-xs font-bold">
            {selectedIds.length}
          </div>
          <span className="text-sm font-medium text-foreground">
            {t("selected")}
          </span>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Assign owner */}
          {users.length > 0 && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowOwnerMenu(!showOwnerMenu);
                  setShowStatusMenu(false);
                  setShowStageMenu(false);
                  setShowTagMenu(false);
                }}
                disabled={loading !== null}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted rounded-lg"
              >
                {loading === "assignOwner" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Users className="w-3.5 h-3.5" />
                )}
                {t("assignOwner")}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showOwnerMenu && (
                <div className="absolute bottom-full mb-1 ltr:left-0 rtl:right-0 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[200px] max-h-64 overflow-y-auto">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => run("assignOwner", { ownerId: u.id })}
                      className="w-full text-left rtl:text-right px-3 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      {u.fullName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Change status (customers only) */}
          {entityType === "customers" && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusMenu(!showStatusMenu);
                  setShowOwnerMenu(false);
                  setShowTagMenu(false);
                }}
                disabled={loading !== null}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted rounded-lg"
              >
                {loading === "changeStatus" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                {t("changeStatus")}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showStatusMenu && (
                <div className="absolute bottom-full mb-1 ltr:left-0 rtl:right-0 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[150px]">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => run("changeStatus", { status: s })}
                      className="w-full text-left rtl:text-right px-3 py-2 text-sm text-foreground hover:bg-muted capitalize"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Change stage (deals only) */}
          {entityType === "deals" && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowStageMenu(!showStageMenu);
                  setShowOwnerMenu(false);
                }}
                disabled={loading !== null}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted rounded-lg"
              >
                {loading === "changeStage" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                {t("changeStage")}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showStageMenu && (
                <div className="absolute bottom-full mb-1 ltr:left-0 rtl:right-0 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[150px]">
                  {stageOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => run("changeStage", { stage: s })}
                      className="w-full text-left rtl:text-right px-3 py-2 text-sm text-foreground hover:bg-muted capitalize"
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add tag (customers only) */}
          {entityType === "customers" && tags.length > 0 && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowTagMenu(!showTagMenu);
                  setShowOwnerMenu(false);
                  setShowStatusMenu(false);
                }}
                disabled={loading !== null}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted rounded-lg"
              >
                {loading === "addTag" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Tag className="w-3.5 h-3.5" />
                )}
                {t("addTag")}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showTagMenu && (
                <div className="absolute bottom-full mb-1 ltr:left-0 rtl:right-0 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[180px] max-h-64 overflow-y-auto">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => run("addTag", { tagId: tag.id })}
                      className="w-full text-left rtl:text-right px-3 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Delete */}
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={loading !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/10 rounded-lg"
          >
            {loading === "delete" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            {t("delete")}
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* Clear */}
        <button
          onClick={onClearSelection}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
          aria-label={t("clear")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Confirmation for delete */}
      {confirmDelete && (
        <div className="mt-2 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-300 flex-shrink-0" />
          <div className="flex-1 text-sm text-red-900">
            {t("confirmDelete", { count: selectedIds.length })}
          </div>
          <button
            onClick={() => setConfirmDelete(false)}
            className="px-3 py-1.5 text-xs font-medium text-foreground bg-card hover:bg-muted rounded-lg"
          >
            {t("cancel")}
          </button>
          <button
            onClick={() => run("delete")}
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
          >
            {t("confirmDeleteAction")}
          </button>
        </div>
      )}

      {/* Result banner */}
      {result && result.succeeded > 0 && (
        <div className="mt-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-300" />
          <span className="text-sm text-emerald-900">
            {t("success", { count: result.succeeded })}
          </span>
        </div>
      )}
    </div>
  );
}
