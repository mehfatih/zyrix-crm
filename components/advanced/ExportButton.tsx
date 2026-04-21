"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileText, FileSpreadsheet, FileType, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  exportData,
  type ExportEntityType,
  type ExportFormat,
} from "@/lib/api/advanced";

// ============================================================================
// EXPORT BUTTON — dropdown with CSV / XLSX / PDF options
// ============================================================================

interface ExportButtonProps {
  entityType: ExportEntityType;
  filters?: Record<string, any>;
  label?: string;
  size?: "sm" | "md";
}

export default function ExportButton({
  entityType,
  filters,
  label,
  size = "md",
}: ExportButtonProps) {
  const t = useTranslations("Export");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<ExportFormat | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleExport = async (format: ExportFormat) => {
    setLoading(format);
    setOpen(false);
    try {
      await exportData(entityType, format, filters);
    } catch (e: any) {
      alert(e?.message || "Export failed");
    } finally {
      setLoading(null);
    }
  };

  const sizeClasses = size === "sm"
    ? "px-2.5 py-1.5 text-xs"
    : "px-3 py-2 text-sm";

  const FORMATS: { id: ExportFormat; Icon: typeof FileText; color: string; label: string }[] = [
    { id: "csv", Icon: FileText, color: "text-sky-600", label: t("csv") },
    { id: "xlsx", Icon: FileSpreadsheet, color: "text-emerald-600", label: t("xlsx") },
    { id: "pdf", Icon: FileType, color: "text-rose-600", label: t("pdf") },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading !== null}
        className={`inline-flex items-center gap-1.5 ${sizeClasses} bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-60`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {label || t("export")}
      </button>

      {open && (
        <div className="absolute top-full mt-1 ltr:right-0 rtl:left-0 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[140px] z-20">
          {FORMATS.map((f) => {
            const Icon = f.Icon;
            return (
              <button
                key={f.id}
                onClick={() => handleExport(f.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 text-left rtl:text-right transition-colors"
              >
                <Icon className={`w-4 h-4 ${f.color}`} />
                <span className="font-medium">{f.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
