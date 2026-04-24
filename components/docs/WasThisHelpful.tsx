"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { DOCS_COPY, type DocLocale } from "@/lib/docs/constants";

interface WasThisHelpfulProps {
  locale: DocLocale;
  articleSlug: string;
  category: string;
}

export default function WasThisHelpful({
  locale,
  articleSlug,
  category,
}: WasThisHelpfulProps) {
  const [choice, setChoice] = useState<null | "yes" | "no">(null);
  const [submitting, setSubmitting] = useState(false);
  const copy = DOCS_COPY[locale];

  async function vote(helpful: boolean) {
    if (choice || submitting) return;
    setSubmitting(true);
    setChoice(helpful ? "yes" : "no");
    try {
      await fetch("/api/docs/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          articleSlug,
          category,
          helpful,
        }),
      });
    } catch {
      /* best-effort telemetry — never blocks the UX */
    }
    setSubmitting(false);
  }

  if (choice) {
    return (
      <div className="mt-8 py-6 border-t border-sky-100 text-sm text-slate-600">
        {copy.thanks}
      </div>
    );
  }

  return (
    <div className="mt-8 py-6 border-t border-sky-100 flex items-center gap-3 flex-wrap">
      <span className="text-sm font-medium text-slate-700">{copy.wasHelpful}</span>
      <button
        type="button"
        onClick={() => vote(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
      >
        <ThumbsUp className="w-4 h-4" />
        {copy.yes}
      </button>
      <button
        type="button"
        onClick={() => vote(false)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-rose-200 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
      >
        <ThumbsDown className="w-4 h-4" />
        {copy.no}
      </button>
    </div>
  );
}
