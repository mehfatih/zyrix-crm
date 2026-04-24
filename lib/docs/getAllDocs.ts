import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { DocLocale, CategoryId } from "./constants";

// ============================================================================
// getAllDocs — build-time reader for every markdown file under content/docs/<lang>
// ============================================================================

export interface DocFrontmatter {
  title: string;
  slug: string;
  category: CategoryId | "guides" | "tutorials" | "faq" | "overview" | string;
  order: number;
  plans?: string[];
  updatedAt?: string;
  readTime?: string;
  featureNumber?: number;
}

export interface DocArticle {
  locale: DocLocale;
  /** Relative path inside content/docs/<locale>, e.g. "features/sales/quotes-proposals" */
  path: string;
  category: string;
  subcategory?: string;
  slug: string;
  frontmatter: DocFrontmatter;
  body: string;
  /** Full body stripped of markdown, used for search. */
  plain: string;
}

const DOCS_ROOT = path.join(process.cwd(), "content", "docs");

function listMarkdownFiles(dir: string, base = ""): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) {
      out.push(...listMarkdownFiles(full, rel));
    } else if (e.isFile() && e.name.endsWith(".md")) {
      out.push(rel);
    }
  }
  return out;
}

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getAllDocs(locale: DocLocale): DocArticle[] {
  const root = path.join(DOCS_ROOT, locale);
  const files = listMarkdownFiles(root);
  const articles: DocArticle[] = [];

  for (const rel of files) {
    const full = path.join(root, rel);
    const raw = fs.readFileSync(full, "utf8");
    const parsed = matter(raw);
    const fm = parsed.data as DocFrontmatter;

    const withoutExt = rel.replace(/\.md$/, "");
    const parts = withoutExt.split("/");

    let category: string;
    let subcategory: string | undefined;
    let slug: string;

    if (parts[0] === "features" && parts.length >= 3) {
      category = parts[1]; // sales, ai, …
      slug = parts[parts.length - 1];
      if (parts.length > 3) subcategory = parts.slice(1, -1).join("/");
    } else if (parts.length === 1) {
      const cat = fm.category || "overview";
      category = cat;
      slug = parts[0].replace(/^\d+-/, "");
    } else {
      category = parts[0];
      slug = parts[parts.length - 1];
    }

    articles.push({
      locale,
      path: withoutExt,
      category: fm.category || category,
      subcategory,
      slug: fm.slug || slug,
      frontmatter: {
        title: fm.title || slug,
        slug: fm.slug || slug,
        category: fm.category || category,
        order: typeof fm.order === "number" ? fm.order : 999,
        plans: fm.plans || [],
        updatedAt: fm.updatedAt,
        readTime: fm.readTime,
        featureNumber: fm.featureNumber,
      },
      body: parsed.content,
      plain: stripMarkdown(parsed.content),
    });
  }

  articles.sort(
    (a, b) =>
      a.category.localeCompare(b.category) || a.frontmatter.order - b.frontmatter.order
  );
  return articles;
}

export function getDocsByCategory(locale: DocLocale, category: string): DocArticle[] {
  return getAllDocs(locale)
    .filter((d) => d.category === category)
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

export function getDoc(
  locale: DocLocale,
  category: string,
  slug: string
): DocArticle | null {
  const all = getAllDocs(locale);
  return (
    all.find(
      (d) => d.category === category && d.slug === slug
    ) || null
  );
}

export function getDocByPath(locale: DocLocale, docPath: string): DocArticle | null {
  return getAllDocs(locale).find((d) => d.path === docPath) || null;
}
