// Route → SEO metadata registry.
// The same data drives: the client-side <Seo /> head updates, the build-time
// prerender (real HTML per URL), and sitemap.xml.
import { BRAND_TAGLINE, SITE_NAME, absoluteUrl } from "./config";
import {
  organizationSchema,
  websiteSchema,
  softwareApplicationSchema,
  webPageSchema,
  faqSchema,
  breadcrumbSchema,
  articleSchema,
} from "./schemas";
import { homeFaqs, waitlistFaqs } from "../content/faqs";
import { landingPageList } from "../content/landingPages";
import { posts } from "../content/blog";

const HOME_TITLE = `${SITE_NAME} — ${BRAND_TAGLINE}`;
const HOME_DESCRIPTION =
  "Zyllo is AI DM automation for Instagram & TikTok shops: instant replies to comments and DMs, product links and follow-ups that turn chats into sales.";

const page = (meta) => ({
  ogType: "website",
  robots: "index, follow, max-image-preview:large, max-snippet:-1",
  ...meta,
});

const staticRoutes = [
  page({
    path: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    sitemap: { priority: 1.0, changefreq: "weekly" },
    schemas: () => [
      organizationSchema(),
      websiteSchema(),
      softwareApplicationSchema(),
      webPageSchema({ path: "/", title: HOME_TITLE, description: HOME_DESCRIPTION }),
      faqSchema(homeFaqs),
    ],
  }),
  page({
    path: "/waitlist",
    title: "Join the Zyllo Waitlist — Early Access to AI DM Automation",
    description:
      "Get early access to Zyllo, AI DM automation for Instagram & TikTok shops. Launch pricing and priority onboarding. Free, no credit card, 10 seconds.",
    sitemap: { priority: 0.9, changefreq: "weekly" },
    schemas: (m) => [
      organizationSchema(),
      webPageSchema(m),
      faqSchema(waitlistFaqs),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Waitlist", path: "/waitlist" },
      ]),
    ],
  }),
  page({
    path: "/blog",
    title: "Zyllo Blog — Instagram & TikTok DM Sales Playbooks",
    description:
      "Practical guides for e-commerce brands: Instagram DM automation, TikTok comment-to-DM, follow-ups and turning social conversations into sales.",
    sitemap: { priority: 0.7, changefreq: "weekly" },
    schemas: (m) => [
      organizationSchema(),
      {
        "@type": "Blog",
        name: "Zyllo Blog",
        url: absoluteUrl("/blog"),
        description: m.description,
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: absoluteUrl(p.path),
          datePublished: p.date,
        })),
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ]),
    ],
  }),
  page({
    path: "/privacy",
    title: "Privacy Policy | Zyllo",
    description: "How Zyllo collects, uses and protects your data.",
    sitemap: { priority: 0.2, changefreq: "yearly" },
  }),
  page({
    path: "/terms",
    title: "Terms of Service | Zyllo",
    description: "The terms that govern your use of Zyllo.",
    sitemap: { priority: 0.2, changefreq: "yearly" },
  }),
  // Required for Meta app review, but no search value → noindex, not in sitemap.
  page({
    path: "/data-deletion",
    title: "Data Deletion Request | Zyllo",
    description: "Request deletion of your personal data from Zyllo.",
    robots: "noindex, follow",
  }),
];

const landingRoutes = landingPageList.map((lp) =>
  page({
    path: lp.path,
    title: lp.seo.title,
    description: lp.seo.description,
    sitemap: { priority: 0.8, changefreq: "monthly" },
    schemas: (m) => [
      organizationSchema(),
      softwareApplicationSchema(),
      webPageSchema(m),
      faqSchema(lp.faqs),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: lp.navLabel, path: lp.path },
      ]),
    ],
  }),
);

const blogRoutes = posts.map((post) =>
  page({
    path: post.path,
    title: post.seoTitle,
    description: post.description,
    ogType: "article",
    article: {
      publishedTime: post.date,
      modifiedTime: post.updated,
      section: post.category,
      tags: post.keywords,
    },
    lastmod: post.updated,
    sitemap: { priority: 0.7, changefreq: "monthly" },
    schemas: () => [
      organizationSchema(),
      articleSchema(post),
      ...(post.faqs.length ? [faqSchema(post.faqs)] : []),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: post.path },
      ]),
    ],
  }),
);

export const publicRoutes = [...staticRoutes, ...landingRoutes, ...blogRoutes];

export const notFoundMeta = page({
  path: null,
  title: "Page not found | Zyllo",
  description: "This page doesn't exist. Explore Zyllo, AI DM automation for Instagram & TikTok shops.",
  robots: "noindex, follow",
});

const privateMeta = page({
  path: null,
  title: "Zyllo Dashboard",
  description: HOME_DESCRIPTION,
  robots: "noindex, nofollow",
});

const normalize = (pathname) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

export function getRouteMeta(pathname) {
  const path = normalize(pathname);
  const match = publicRoutes.find((r) => r.path === path);
  if (match) return match;
  if (path.startsWith("/dashboard") || path === "/confirm") return privateMeta;
  return notFoundMeta;
}
