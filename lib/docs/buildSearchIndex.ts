import { getAllDocs } from "./getAllDocs";
import type { DocLocale } from "./constants";

// ============================================================================
// Search index — returns a lightweight payload the client-side FlexSearch
// instance indexes. Built at page load time on static routes, so there's no
// runtime FS access in the browser.
// ============================================================================

export interface SearchRecord {
  id: string;
  locale: DocLocale;
  title: string;
  category: string;
  path: string;
  /** Up to ~300 chars of plain-text body for snippet generation. */
  excerpt: string;
  /** Full plain-text content used as a fallback search field. */
  body: string;
}

export function buildSearchIndex(locale: DocLocale): SearchRecord[] {
  const docs = getAllDocs(locale);
  return docs.map((d) => {
    const excerpt =
      d.plain.length > 300 ? `${d.plain.slice(0, 300).trim()}…` : d.plain;
    return {
      id: `${d.locale}:${d.path}`,
      locale: d.locale,
      title: d.frontmatter.title,
      category: d.category,
      path: d.path,
      excerpt,
      body: d.plain,
    };
  });
}
