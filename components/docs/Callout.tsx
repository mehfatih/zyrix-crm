import type { ReactNode } from "react";
import { Info, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

type Kind = "info" | "warning" | "success" | "tip";

const STYLES: Record<
  Kind,
  { bg: string; border: string; title: string; Icon: typeof Info }
> = {
  info: {
    bg: "bg-muted",
    border: "border-sky-300",
    title: "text-foreground",
    Icon: Info,
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-300",
    title: "text-amber-900",
    Icon: AlertTriangle,
  },
  success: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-300",
    title: "text-emerald-900",
    Icon: CheckCircle2,
  },
  tip: {
    bg: "bg-violet-500/10",
    border: "border-violet-300",
    title: "text-violet-900",
    Icon: Lightbulb,
  },
};

interface CalloutProps {
  kind?: Kind;
  title?: string;
  children: ReactNode;
}

export default function Callout({ kind = "info", title, children }: CalloutProps) {
  const s = STYLES[kind];
  const Icon = s.Icon;
  return (
    <div className={`my-6 border ${s.border} ${s.bg} rounded-xl p-4 flex gap-3`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${s.title}`} />
      <div className="flex-1 min-w-0">
        {title ? (
          <div className={`text-sm font-semibold mb-1 ${s.title}`}>{title}</div>
        ) : null}
        <div className="text-sm text-foreground prose-sm">{children}</div>
      </div>
    </div>
  );
}
