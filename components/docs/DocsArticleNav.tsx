"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/docs/parseMarkdown";
import { DOCS_COPY, type DocLocale } from "@/lib/docs/constants";

interface DocsArticleNavProps {
  headings: Heading[];
  locale: DocLocale;
}

export default function DocsArticleNav({ headings, locale }: DocsArticleNavProps) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null
  );
  const copy = DOCS_COPY[locale];

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: [0, 1] }
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside className="hidden xl:block w-56 flex-shrink-0 sticky top-20 h-fit text-sm">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
        {copy.onThisPage}
      </div>
      <ul className="space-y-1 border-s-2 border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block transition-colors ${
                h.level === 3 ? "ps-6" : "ps-3"
              } pe-2 py-1 -ms-[2px] border-s-2 ${
                activeId === h.id
                  ? "border-sky-400 text-cyan-300 font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
