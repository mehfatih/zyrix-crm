import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import {
  ACCENT_CLASSES,
  type CategoryId,
  type DocLocale,
  type AccentName,
} from "@/lib/docs/constants";

interface CategoryCardProps {
  locale: DocLocale;
  category: {
    id: CategoryId;
    accent: AccentName;
    icon: string;
    count: number;
    label: Record<DocLocale, string>;
    desc: Record<DocLocale, string>;
  };
  articleCountLabel: string;
}

export default function CategoryCard({
  locale,
  category,
  articleCountLabel,
}: CategoryCardProps) {
  const accent = ACCENT_CLASSES[category.accent];
  const Icon =
    (Icons as unknown as Record<string, typeof Icons.BookOpen>)[category.icon] ||
    Icons.BookOpen;

  return (
    <Link
      href={`/${locale}/docs/${category.id}`}
      className={`group bg-white border-2 ${accent.border} ${accent.hoverBorder} rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg flex flex-col`}
    >
      <div
        className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${accent.chipBg} ${accent.text} mb-3`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        {category.label[locale]}
      </h3>
      <p className="text-sm text-slate-600 mb-4 flex-1">
        {category.desc[locale]}
      </p>
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${accent.text}`}>
          {category.count} {articleCountLabel}
        </span>
        <ArrowRight
          className={`w-4 h-4 ${accent.text} rtl:rotate-180 group-hover:translate-x-0.5 transition-transform`}
        />
      </div>
    </Link>
  );
}
