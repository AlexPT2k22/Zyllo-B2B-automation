// Turns route metadata into <head> tags. Shared by the prerender script
// (server HTML) and <Seo /> (client-side navigation), so both always match.
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "./config";

const esc = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// JSON-LD must not contain a literal "</script>".
const safeJson = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

export function buildJsonLd(meta) {
  const graph = meta.schemas ? meta.schemas(meta) : [];
  if (!graph.length) return null;
  return { "@context": "https://schema.org", "@graph": graph };
}

export function renderHeadTags(meta) {
  const canonical = meta.path ? absoluteUrl(meta.path) : null;
  const image = meta.image
    ? { ...DEFAULT_OG_IMAGE, url: absoluteUrl(meta.image), width: null, height: null }
    : DEFAULT_OG_IMAGE;

  const tags = [
    `<title data-seo>${esc(meta.title)}</title>`,
    `<meta data-seo name="description" content="${esc(meta.description)}" />`,
    `<meta data-seo name="robots" content="${esc(meta.robots)}" />`,
    canonical && `<link data-seo rel="canonical" href="${esc(canonical)}" />`,

    `<meta data-seo property="og:site_name" content="${SITE_NAME}" />`,
    `<meta data-seo property="og:locale" content="en_US" />`,
    `<meta data-seo property="og:type" content="${esc(meta.ogType)}" />`,
    canonical && `<meta data-seo property="og:url" content="${esc(canonical)}" />`,
    `<meta data-seo property="og:title" content="${esc(meta.title)}" />`,
    `<meta data-seo property="og:description" content="${esc(meta.description)}" />`,
    `<meta data-seo property="og:image" content="${esc(image.url)}" />`,
    image.width && `<meta data-seo property="og:image:width" content="${image.width}" />`,
    image.height && `<meta data-seo property="og:image:height" content="${image.height}" />`,
    `<meta data-seo property="og:image:alt" content="${esc(image.alt)}" />`,

    `<meta data-seo name="twitter:card" content="summary_large_image" />`,
    `<meta data-seo name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta data-seo name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta data-seo name="twitter:image" content="${esc(image.url)}" />`,
  ];

  if (meta.article) {
    const a = meta.article;
    tags.push(
      a.publishedTime && `<meta data-seo property="article:published_time" content="${esc(a.publishedTime)}" />`,
      a.modifiedTime && `<meta data-seo property="article:modified_time" content="${esc(a.modifiedTime)}" />`,
      a.section && `<meta data-seo property="article:section" content="${esc(a.section)}" />`,
      ...(a.tags || []).map((t) => `<meta data-seo property="article:tag" content="${esc(t)}" />`),
    );
  }

  const jsonLd = buildJsonLd(meta);
  if (jsonLd) {
    tags.push(
      `<script data-seo type="application/ld+json">${safeJson(jsonLd)}</script>`,
    );
  }

  return tags.filter(Boolean).join("\n    ");
}
