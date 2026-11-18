// Build-time static prerender (SSG) for every public route.
//
// Why: the site is a client-side React SPA. Without this, every URL returns
// the same empty <div id="root"> and the same <title>, so Google has to
// render JavaScript to see any content and every page competes with one
// generic snippet. This script writes real HTML + unique <head> tags for
// each public URL, plus the SPA shell, 404 page and sitemap.xml.
//
// Runs after: vite build (client) && vite build --ssr src/entry-server.jsx
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");

const { render, renderHead, publicRoutes, SITE_URL, CONTENT_UPDATED } = await import(
  pathToFileURL(ssrEntry).href
);

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
const ROOT_DIV = '<div id="root"></div>';
if (!SEO_BLOCK.test(template) || !template.includes(ROOT_DIV)) {
  throw new Error("index.html is missing the <!--seo:start/end--> block or the empty #root div");
}

const build = (head, html = "") =>
  template.replace(SEO_BLOCK, head).replace(ROOT_DIV, `<div id="root">${html}</div>`);

const outFile = (route) => {
  if (route === "/") return path.join(distDir, "index.html");
  return path.join(distDir, `${route.slice(1)}.html`); // served via cleanUrls
};

const write = (file, contents) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
};

// 1) SPA shell for client-only routes (dashboard, /confirm). Written first,
//    before index.html is overwritten with the prerendered homepage.
write(
  path.join(distDir, "app.html"),
  build(
    renderHead({
      title: "Zyllo",
      description: "Zyllo — AI DM automation for Instagram & TikTok shops.",
      robots: "noindex, nofollow",
      ogType: "website",
      path: null,
    }),
  ),
);

// 2) Every public route.
let count = 0;
for (const route of publicRoutes) {
  const { html, head } = render(route.path);
  write(outFile(route.path), build(head, html));
  count++;
}

// 3) 404 page (Vercel serves dist/404.html with a real 404 status).
{
  const { html, head } = render("/404");
  write(path.join(distDir, "404.html"), build(head, html));
}

// 4) sitemap.xml — only indexable routes.
const today = new Date().toISOString().slice(0, 10);
const urls = publicRoutes
  .filter((r) => r.sitemap && !/noindex/.test(r.robots))
  .map((r) => {
    const loc = r.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${r.path}`;
    const lastmod = r.lastmod || CONTENT_UPDATED || today;
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${r.sitemap.changefreq}</changefreq>`,
      `    <priority>${r.sitemap.priority.toFixed(1)}</priority>`,
      "  </url>",
    ].join("\n");
  });

write(
  path.join(distDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
);

console.log(`✓ Prerendered ${count} routes + 404 + app shell, sitemap with ${urls.length} URLs`);
