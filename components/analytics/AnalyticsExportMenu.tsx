"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FileImage, FileSpreadsheet, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import Papa from "papaparse";
import { toast } from "sonner";
import type { AnalyticsTab } from "@/lib/analytics/tab-catalog";

interface Props {
  tab: AnalyticsTab;
  locale: "en" | "ar" | "tr";
}

export function AnalyticsExportMenu({ tab, locale }: Props) {
  const t = useTranslations("Analytics");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const downloadCsv = () => {
    const widgetRows = tab.widgets.map((w) => ({
      section: tab.name[locale],
      kpi: w.label[locale],
      value: w.value,
      trend: `${w.trend}%`,
    }));
    const pivotRows = tab.pivot.data.map((row) => {
      const out: Record<string, string | number> = { section: tab.name[locale] };
      for (const [k, v] of Object.entries(row)) out[k] = v;
      return out;
    });
    const csv =
      `# KPIs\n${Papa.unparse(widgetRows)}\n\n# Pivot\n${Papa.unparse(pivotRows)}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${tab.id}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const stub = (label: string) => {
    toast.info(t("export.comingSoonToast", { type: label }));
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
      >
        <Download className="w-3.5 h-3.5" />
        {t("toolbar.export")}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
          <button
            onClick={() => stub(t("export.png"))}
            className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted border-b border-border"
          >
            <FileImage className="w-4 h-4 text-muted-foreground" />
            {t("export.png")}
          </button>
          <button
            onClick={downloadCsv}
            className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted border-b border-border"
          >
            <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
            {t("export.csv")}
          </button>
          <button
            onClick={() => stub(t("export.pdf"))}
            className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
          >
            <FileText className="w-4 h-4 text-muted-foreground" />
            {t("export.pdf")}
          </button>
        </div>
      )}
    </div>
  );
}
