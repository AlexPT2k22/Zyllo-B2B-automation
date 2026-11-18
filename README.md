# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## SEO & marketing pages

Public pages are **prerendered to static HTML at build time** so search engines get real content and unique `<title>`/meta/JSON-LD per URL.

`npm run build` = client build → SSR build (`src/entry-server.jsx`) → `scripts/prerender.mjs`, which writes:

- `dist/<route>.html` for every public route (served by Vercel `cleanUrls`)
- `dist/app.html` — empty SPA shell (noindex) for `/dashboard/*` and `/confirm` (see `vercel.json` rewrites)
- `dist/404.html` — real 404 status for unknown URLs
- `dist/sitemap.xml` — every indexable route

| What | Where |
| --- | --- |
| Domain, brand, social profiles, waitlist proof number | `src/seo/config.js` |
| Title/description/schema per route | `src/seo/routes.js` |
| JSON-LD builders | `src/seo/schemas.js` |
| Use-case landing pages (copy) | `src/content/landingPages.js` |
| Home & waitlist FAQs (UI + FAQPage schema) | `src/content/faqs.js` |
| Blog posts | `src/content/blog/*.md` |

**Add a blog post:** create `src/content/blog/<slug>.md` with frontmatter (`title`, `seoTitle`, `description`, `date`, `updated`, `author`, `category`, `keywords`). Use `<!-- cta -->` on its own line to place an inline waitlist CTA, and a `## Frequently asked questions` section with `###` questions to get FAQPage schema automatically. Routing, reading time, TOC, sitemap and BlogPosting schema are automatic.

**Add a landing page:** add an entry to `src/content/landingPages.js` — the route, metadata, schema, sitemap entry and footer link are generated from it.
