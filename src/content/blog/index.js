// Blog content loader.
// Drop a new `.md` file in this folder (with frontmatter) and it's
// automatically routed at /blog/<filename>, prerendered, added to the
// sitemap and given BlogPosting + FAQPage + Breadcrumb schema.
import { Marked, Renderer } from "marked";

const files = import.meta.glob("./*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const WORDS_PER_MINUTE = 220;
export const CTA_MARKER = "<!-- cta -->";

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const stripTags = (html) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

// Minimal frontmatter parser: `key: value` lines between `---` fences.
// Comma-separated `keywords` become an array.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = value;
  }
  if (data.keywords) data.keywords = data.keywords.split(",").map((k) => k.trim());
  return { data, body: match[2] };
}

function buildPost(filePath, raw) {
  const slug = filePath.replace(/^\.\//, "").replace(/\.md$/, "");
  const { data, body } = parseFrontmatter(raw);
  const toc = [];

  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const id = slugify(stripTags(html));
        if (depth === 2) toc.push({ id, text: stripTags(html) });
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !href.includes("zyllo.tech");
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
        const t = title ? ` title="${title}"` : "";
        return `<a href="${href}"${t}${attrs}>${text}</a>`;
      },
      table(token) {
        // Wrap tables so they scroll horizontally on phones.
        const html = Renderer.prototype.table.call(this, token);
        return `<div class="post-table-wrap">${html}</div>`;
      },
    },
  });

  const html = marked.parse(body);

  // Extract FAQ (H3 + paragraphs) under the "Frequently asked questions" H2
  // so it can be emitted as FAQPage schema.
  const faqs = [];
  const tokens = marked.lexer(body);
  let inFaq = false;
  let current = null;
  for (const tok of tokens) {
    if (tok.type === "heading" && tok.depth === 2) {
      if (current) faqs.push(current);
      current = null;
      inFaq = /frequently asked questions|^faq/i.test(tok.text);
      continue;
    }
    if (!inFaq) continue;
    if (tok.type === "heading" && tok.depth === 3) {
      if (current) faqs.push(current);
      current = { question: stripTags(marked.parseInline(tok.text)), answer: "" };
    } else if (current && tok.type === "paragraph") {
      const text = stripTags(marked.parseInline(tok.text));
      current.answer = current.answer ? `${current.answer} ${text}` : text;
    }
  }
  if (current) faqs.push(current);

  const plain = stripTags(html.replaceAll(CTA_MARKER, ""));
  const wordCount = plain.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    path: `/blog/${slug}`,
    title: data.title,
    seoTitle: data.seoTitle || `${data.title} | Zyllo`,
    description: data.description,
    date: data.date,
    updated: data.updated || data.date,
    author: data.author,
    category: data.category,
    keywords: data.keywords || [],
    image: data.image,
    html,
    toc,
    faqs: faqs.filter((f) => f.answer),
    wordCount,
    readingTime: Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)),
  };
}

export const posts = Object.entries(files)
  .map(([path, raw]) => buildPost(path, raw))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug) => posts.find((p) => p.slug === slug);
