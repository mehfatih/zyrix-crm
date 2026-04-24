import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

// ============================================================================
// parseMarkdown — renders markdown bodies to HTML for the article page.
// The result is injected via dangerouslySetInnerHTML inside a `.prose` wrapper.
// ============================================================================

export async function renderMarkdown(md: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(md);
  return String(file);
}

// ============================================================================
// extractHeadings — returns H2/H3 nodes for the on-this-page TOC.
// ============================================================================

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

export function extractHeadings(md: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  const lines = md.split("\n");
  let inCode = false;
  for (const raw of lines) {
    if (raw.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = raw.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const text = m[2].replace(/[*_`]/g, "").trim();
    let id = slugify(text);
    const count = seen.get(id) || 0;
    if (count > 0) id = `${id}-${count}`;
    seen.set(id, count + 1);
    headings.push({ id, text, level });
  }
  return headings;
}

// ============================================================================
// addHeadingIds — post-processes rendered HTML to attach `id=` attributes
// that match what extractHeadings produced, so the TOC anchors work.
// ============================================================================

export function addHeadingIds(html: string, headings: Heading[]): string {
  let idx = 0;
  return html.replace(/<(h[23])>([\s\S]*?)<\/\1>/g, (match, tag, inner) => {
    const plain = inner.replace(/<[^>]+>/g, "").trim();
    const heading = headings[idx];
    if (heading && heading.text.replace(/\s+/g, " ").toLowerCase() === plain.replace(/\s+/g, " ").toLowerCase()) {
      idx++;
      return `<${tag} id="${heading.id}">${inner}</${tag}>`;
    }
    // Fall back to slug from this heading's own text
    const id = slugify(plain);
    if (heading) idx++;
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
}
