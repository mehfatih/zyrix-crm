"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

// ============================================================================
// CodeBlock — wraps rendered <pre> blocks with a copy button. Not rendered
// directly; instead, we attach copy buttons via the client runtime helper
// below so remark output stays simple.
// ============================================================================

export function useCopyButtons(scopeRef: React.RefObject<HTMLElement | null>) {
  const [copied, setCopied] = useState<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!scopeRef.current) return;
    const pres = scopeRef.current.querySelectorAll("pre");
    const btns: HTMLButtonElement[] = [];
    pres.forEach((pre) => {
      if (pre.dataset.copyWired === "1") return;
      pre.dataset.copyWired = "1";
      pre.style.position = "relative";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Copy code");
      btn.className =
        "absolute top-2 end-2 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-card/90 border border-border rounded-md text-muted-foreground hover:text-cyan-300 hover:border-sky-300 transition-colors";
      btn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>Copy';
      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        const text = (code?.textContent || pre.textContent || "").trim();
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          // swallow — clipboard may be blocked
        }
        btn.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied';
        setCopied(btn);
        setTimeout(() => {
          btn.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>Copy';
        }, 2000);
      });
      pre.appendChild(btn);
      btns.push(btn);
    });
    return () => {
      btns.forEach((b) => b.remove());
    };
    // We deliberately don't depend on `copied` — the ref is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeRef]);
  return copied;
}

export default function CodeBlock({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ok, setOk] = useState(false);
  return (
    <div className="relative my-4">
      <pre
        ref={ref as unknown as React.RefObject<HTMLPreElement>}
        className="bg-muted border border-border rounded-xl p-4 overflow-x-auto text-sm"
      >
        <code className="font-mono">{children}</code>
      </pre>
      <button
        type="button"
        onClick={async () => {
          const text =
            ref.current?.querySelector("code")?.textContent?.trim() ?? "";
          try {
            await navigator.clipboard.writeText(text);
            setOk(true);
            setTimeout(() => setOk(false), 2000);
          } catch {
            /* clipboard blocked */
          }
        }}
        className="absolute top-2 end-2 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-card/90 border border-border rounded-md text-muted-foreground hover:text-cyan-300"
      >
        {ok ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {ok ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
