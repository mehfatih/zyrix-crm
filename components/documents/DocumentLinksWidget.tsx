"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  Plus,
  ExternalLink,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  listDocumentLinks,
  linkDocument,
  unlinkDocument,
  type DocumentLink,
  type DocumentEntity,
} from "@/lib/api/advanced";
import { extractErrorMessage } from "@/lib/errors";

// ============================================================================
// DOCUMENT LINKS WIDGET (P9)
// ----------------------------------------------------------------------------
// Drop-in sidebar widget for customer / deal / quote / contract detail
// pages. Caller passes entityType + entityId; widget handles list / add /
// remove entirely through /api/documents endpoints. Trilingual.
// ============================================================================

type Locale = "en" | "ar" | "tr";

export function DocumentLinksWidget({
  entityType,
  entityId,
  locale = "en",
}: {
  entityType: DocumentEntity;
  entityId: string;
  locale?: Locale;
}) {
  const isRtl = locale === "ar";
  const tr = (en: string, ar: string, trk: string) =>
    locale === "ar" ? ar : locale === "tr" ? trk : en;

  const [links, setLinks] = useState<DocumentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLinks(await listDocumentLinks(entityType, entityId));
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    if (entityId) load();
  }, [load, entityId]);

  const handleAdd = async () => {
    if (!input.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await linkDocument({
        entityType,
        entityId,
        googleDocId: input.trim(),
      });
      setInput("");
      setAdding(false);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (link: DocumentLink) => {
    if (
      !confirm(
        tr(
          `Remove link to "${link.title}"?`,
          `إزالة الرابط "${link.title}"؟`,
          `"${link.title}" bağlantısı kaldırılsın mı?`
        )
      )
    )
      return;
    try {
      await unlinkDocument(link.id);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="rounded-xl border border-sky-100 bg-white p-4 space-y-3"
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-sm font-bold text-cyan-900 inline-flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-600" />
          {tr(
            "Attached documents",
            "المستندات المرفقة",
            "Ekli belgeler"
          )}
        </h3>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-700 hover:bg-cyan-100 text-[10px] font-bold uppercase"
          >
            <Plus className="w-3 h-3" />
            {tr("Attach", "إرفاق", "Ekle")}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-2 flex items-start gap-2 text-xs text-rose-700">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {adding && (
        <div className="rounded-lg border border-cyan-200 bg-cyan-50/30 p-3 space-y-2">
          <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wide">
            {tr(
              "Google Doc URL or ID",
              "رابط أو معرّف مستند Google",
              "Google Belge URL veya ID"
            )}
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://docs.google.com/document/d/…"
            dir="ltr"
            className="w-full px-3 py-2 border border-sky-200 rounded-lg text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setAdding(false);
                setInput("");
              }}
              className="text-xs text-slate-600 hover:text-slate-900"
            >
              {tr("Cancel", "إلغاء", "İptal")}
            </button>
            <button
              onClick={handleAdd}
              disabled={submitting || !input.trim()}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-md text-xs font-semibold"
            >
              {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
              {tr("Attach", "إرفاق", "Ekle")}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
        </div>
      ) : links.length === 0 && !adding ? (
        <p className="text-xs text-slate-500 py-1">
          {tr(
            "No documents yet.",
            "لا مستندات بعد.",
            "Henüz belge yok."
          )}
        </p>
      ) : (
        <ul className="space-y-1.5">
          {links.map((l) => (
            <li
              key={l.id}
              className="flex items-start gap-2 p-2 rounded-lg bg-sky-50/40 border border-sky-100"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://drive.google.com/file/d/${l.googleDocId}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-cyan-800 hover:text-cyan-900 hover:underline inline-flex items-center gap-1"
                  >
                    <span className="truncate">{l.title}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
                {l.snippet && (
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                    {l.snippet}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleRemove(l)}
                className="w-6 h-6 rounded text-slate-400 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center flex-shrink-0"
                title={tr("Remove", "إزالة", "Kaldır")}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
