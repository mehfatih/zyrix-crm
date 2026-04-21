"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  ArrowLeft,
  ArrowRight,
  Users,
  Download,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { importCustomers, type ImportResult } from "@/lib/api/advanced";
import { DashboardShell } from "@/components/layout/DashboardShell";

// ============================================================================
// CSV IMPORT WIZARD
// Step 1: Upload → Step 2: Preview → Step 3: Result
// ============================================================================

type Step = "upload" | "preview" | "result";

const SAMPLE_CSV = `Full Name,Email,Phone,Company,Country,City
Ahmed Ali,ahmed@example.com,+201234567890,Ali Trading,Egypt,Cairo
Fatima Hassan,fatima@example.com,+966501234567,Hassan Group,Saudi Arabia,Riyadh
Mehmet Yilmaz,mehmet@example.com,+905321234567,Yilmaz Ltd,Turkey,Istanbul`;

export default function CsvImportPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Import");

  const [step, setStep] = useState<Step>("upload");
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(t("errors.tooLarge"));
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setCsvText(String(reader.result || ""));
    };
    reader.readAsText(file);
  };

  const downloadSample = () => {
    const blob = new Blob(["\uFEFF" + SAMPLE_CSV], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zyrix-customers-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const parsePreview = () => {
    if (!csvText) return { headers: [], rows: [] };
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return { headers: [], rows: [] };
    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else inQuotes = !inQuotes;
        } else if (ch === "," && !inQuotes) {
          result.push(current);
          current = "";
        } else current += ch;
      }
      result.push(current);
      return result.map((v) => v.trim());
    };
    const headers = parseLine(lines[0]);
    const rows = lines.slice(1, 11).map(parseLine); // Preview max 10 rows
    return { headers, rows, totalRows: lines.length - 1 };
  };

  const preview = step !== "upload" ? parsePreview() : null;

  const handleImport = async () => {
    setLoading(true);
    try {
      const r = await importCustomers(csvText, { skipDuplicates });
      setResult(r);
      setStep("result");
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || e?.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("upload");
    setCsvText("");
    setFileName("");
    setResult(null);
  };

  return (
    <DashboardShell locale={locale}>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/customers`}
              className="text-slate-400 hover:text-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-cyan-900 flex items-center gap-2">
                <Upload className="w-6 h-6 text-cyan-600" />
                {t("title")}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">{t("subtitle")}</p>
            </div>
          </div>
          <button
            onClick={downloadSample}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-sky-200 hover:bg-sky-50 text-slate-700 rounded-lg text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            {t("downloadSample")}
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-3">
          <StepBubble n={1} label={t("steps.upload")} active={step === "upload"} done={step !== "upload"} />
          <div className={`h-0.5 flex-1 rounded ${step !== "upload" ? "bg-cyan-500" : "bg-slate-200"}`} />
          <StepBubble n={2} label={t("steps.preview")} active={step === "preview"} done={step === "result"} />
          <div className={`h-0.5 flex-1 rounded ${step === "result" ? "bg-cyan-500" : "bg-slate-200"}`} />
          <StepBubble n={3} label={t("steps.result")} active={step === "result"} done={false} />
        </div>

        {/* STEP 1: UPLOAD */}
        {step === "upload" && (
          <div className="bg-white border border-sky-100 rounded-xl p-6 space-y-4">
            <div className="border-2 border-dashed border-sky-200 rounded-xl p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-cyan-900 mb-1">
                {fileName || t("upload.title")}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {fileName ? `${(csvText.length / 1024).toFixed(1)} KB` : t("upload.hint")}
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg"
              >
                {fileName ? t("upload.changeFile") : t("upload.selectFile")}
              </button>
            </div>

            <div className="bg-sky-50/40 border border-sky-100 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-slate-600 uppercase mb-2">
                {t("upload.columnsTitle")}
              </h4>
              <p className="text-xs text-slate-600 mb-2">{t("upload.columnsHint")}</p>
              <div className="flex flex-wrap gap-1.5">
                {["fullName", "email", "phone", "company", "country", "city", "status", "notes"].map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 text-[10px] font-mono bg-white border border-sky-200 text-cyan-700 rounded"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                {t("upload.aliasesHint")}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => csvText && setStep("preview")}
                disabled={!csvText}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
              >
                {t("next")}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW */}
        {step === "preview" && preview && (
          <div className="bg-white border border-sky-100 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-base font-semibold text-cyan-900">
                  {t("preview.title")}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t("preview.totalRows", { count: preview.totalRows || 0 })} · {fileName}
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipDuplicates}
                  onChange={(e) => setSkipDuplicates(e.target.checked)}
                  className="rounded border-sky-300 text-cyan-600 focus:ring-cyan-500"
                />
                {t("preview.skipDuplicates")}
              </label>
            </div>

            {preview.headers.length > 0 && (
              <div className="border border-sky-100 rounded-lg overflow-hidden overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-sky-50/50 border-b border-sky-100">
                    <tr>
                      {preview.headers.map((h, i) => (
                        <th
                          key={i}
                          className="px-3 py-2 text-left rtl:text-right font-semibold text-slate-700 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50">
                    {preview.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-sky-50/30">
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 text-slate-700 whitespace-nowrap max-w-[200px] truncate">
                            {cell || <span className="text-slate-400 italic">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(preview.totalRows || 0) > 10 && (
                  <div className="px-3 py-2 bg-sky-50/30 text-xs text-slate-500 text-center border-t border-sky-100">
                    {t("preview.showingFirst", { shown: 10, total: preview.totalRows || 0 })}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setStep("upload")}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("back")}
              </button>
              <button
                onClick={handleImport}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Users className="w-4 h-4" />
                )}
                {t("preview.import", { count: preview.totalRows || 0 })}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RESULT */}
        {step === "result" && result && (
          <div className="bg-white border border-sky-100 rounded-xl p-6 space-y-4">
            <div className="text-center py-6">
              {result.imported > 0 ? (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-cyan-900 mb-1">
                    {t("result.success")}
                  </h3>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full mb-3">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-cyan-900 mb-1">
                    {t("result.noneImported")}
                  </h3>
                </>
              )}
              <p className="text-sm text-slate-600">
                {t("result.summary", {
                  imported: result.imported,
                  skipped: result.skipped,
                  total: result.totalRows,
                })}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatTile icon={CheckCircle2} color="emerald" label={t("result.imported")} value={result.imported} />
              <StatTile icon={AlertTriangle} color="amber" label={t("result.skipped")} value={result.skipped} />
              <StatTile icon={FileText} color="sky" label={t("result.total")} value={result.totalRows} />
            </div>

            {/* Errors table */}
            {result.errors.length > 0 && (
              <div className="border border-red-100 bg-red-50/40 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-red-700 uppercase mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {t("result.errorsTitle", { count: result.errors.length })}
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {result.errors.slice(0, 20).map((e, i) => (
                    <div key={i} className="text-xs text-red-800">
                      <span className="font-semibold">Row {e.row}:</span> {e.message}
                    </div>
                  ))}
                  {result.errors.length > 20 && (
                    <div className="text-[10px] text-red-600 italic">
                      + {result.errors.length - 20} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Duplicates */}
            {result.duplicates.length > 0 && (
              <div className="border border-amber-100 bg-amber-50/40 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-amber-700 uppercase mb-2">
                  {t("result.duplicatesTitle", { count: result.duplicates.length })}
                </h4>
                <p className="text-xs text-amber-800">
                  {t("result.duplicatesHint")}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-4 border-t border-sky-100">
              <button
                onClick={reset}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg"
              >
                {t("result.importAnother")}
              </button>
              <button
                onClick={() => router.push(`/${locale}/customers`)}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg"
              >
                <Users className="w-4 h-4" />
                {t("result.viewCustomers")}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

// ============================================================================
// Helpers
// ============================================================================
function StepBubble({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          done
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-cyan-600 text-white"
              : "bg-slate-200 text-slate-500"
        }`}
      >
        {done ? <CheckCircle2 className="w-4 h-4" /> : n}
      </div>
      <span className={`text-xs font-medium ${active ? "text-cyan-900" : "text-slate-500"} hidden md:inline`}>
        {label}
      </span>
    </div>
  );
}

function StatTile({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: typeof FileText;
  color: "emerald" | "amber" | "sky";
  label: string;
  value: number;
}) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    sky: "bg-sky-50 text-sky-700",
  };
  return (
    <div className={`rounded-lg p-4 text-center ${colors[color]}`}>
      <Icon className="w-5 h-5 mx-auto mb-1" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wide">{label}</div>
    </div>
  );
}
