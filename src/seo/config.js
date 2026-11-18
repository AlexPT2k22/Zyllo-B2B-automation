// Single source of truth for brand + SEO constants.
// Used by the client (<Seo />), the prerender script and the sitemap.

export const SITE_URL = "https://www.zyllo.tech";
export const SITE_NAME = "Zyllo";
export const BRAND_TAGLINE = "AI DM Automation for Instagram & TikTok Shops";
export const CONTACT_EMAIL = "contact@zyllo.tech";

// Bump when page copy changes meaningfully — used as <lastmod> in sitemap.xml
// for non-blog pages (blog posts use their own `updated` frontmatter).
export const CONTENT_UPDATED = "2026-11-18";

export const LOGO_URL = `${SITE_URL}/icons/android-chrome-512x512.png`;
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1024,
  height: 1024,
  alt: "Zyllo — AI DM automation for Instagram & TikTok shops",
};

// Official Zyllo profiles. Fill these in: `sameAs` is one of the strongest
// signals Google uses to tie the brand "Zyllo" to this website.
export const SOCIAL_PROFILES = [
  // "https://www.instagram.com/zyllo.tech",
  // "https://www.tiktok.com/@zyllo.tech",
  // "https://www.linkedin.com/company/zyllo",
];

// Social proof shown next to every waitlist form.
// Keep this number honest — update it as the waitlist grows.
export const WAITLIST_PROOF = {
  count: "500+",
  label: "e-commerce brands already on the early-access list",
};

export const absoluteUrl = (path = "/") =>
  path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
