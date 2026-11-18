// JSON-LD builders (schema.org). Every builder returns a plain object;
// the head renderer wraps them in a single @graph.
import {
  SITE_URL,
  SITE_NAME,
  BRAND_TAGLINE,
  CONTACT_EMAIL,
  LOGO_URL,
  DEFAULT_OG_IMAGE,
  SOCIAL_PROFILES,
  absoluteUrl,
} from "./config";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const APP_ID = `${SITE_URL}/#software`;

export const organizationSchema = () => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: ["Zyllo AI", "zyllo.tech"],
  url: `${SITE_URL}/`,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
    width: 512,
    height: 512,
  },
  email: CONTACT_EMAIL,
  description: `${SITE_NAME} is an AI-powered DM automation and sales follow-up platform for e-commerce brands selling on Instagram and TikTok.`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: CONTACT_EMAIL,
    availableLanguage: ["English"],
  },
  ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
});

export const websiteSchema = () => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  alternateName: ["Zyllo AI", "zyllo.tech"],
  description: BRAND_TAGLINE,
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
});

export const softwareApplicationSchema = () => ({
  "@type": "SoftwareApplication",
  "@id": APP_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Social commerce DM automation",
  operatingSystem: "Web",
  description:
    "Zyllo automatically replies to Instagram and TikTok comments and DMs, qualifies buyers, sends product links and follows up with shoppers who go quiet — so e-commerce brands never lose a sale in the inbox.",
  image: DEFAULT_OG_IMAGE.url,
  featureList: [
    "Instagram comment-to-DM automation",
    "TikTok comment and DM automation",
    "Keyword-triggered auto replies",
    "Story mention and new follower triggers",
    "AI-assisted sales follow-ups",
    "Lead qualification and tagging",
    "Abandoned cart recovery via DM",
  ],
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: "29",
    highPrice: "149",
    offerCount: 3,
    availability: "https://schema.org/PreOrder",
    url: absoluteUrl("/waitlist"),
  },
  publisher: { "@id": ORG_ID },
});

export const webPageSchema = ({ path, title, description }) => ({
  "@type": "WebPage",
  "@id": `${absoluteUrl(path)}#webpage`,
  url: absoluteUrl(path),
  name: title,
  description,
  inLanguage: "en",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": APP_ID },
});

export const faqSchema = (faqs) => ({
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
});

// crumbs: [{ name, path }]
export const breadcrumbSchema = (crumbs) => ({
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
});

export const articleSchema = (post) => ({
  "@type": "BlogPosting",
  "@id": `${absoluteUrl(post.path)}#article`,
  mainEntityOfPage: absoluteUrl(post.path),
  headline: post.title,
  description: post.description,
  image: post.image ? absoluteUrl(post.image) : DEFAULT_OG_IMAGE.url,
  datePublished: post.date,
  dateModified: post.updated || post.date,
  wordCount: post.wordCount,
  timeRequired: `PT${post.readingTime}M`,
  inLanguage: "en",
  keywords: post.keywords?.join(", "),
  author: post.author
    ? { "@type": "Person", name: post.author }
    : { "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
  isPartOf: { "@id": WEBSITE_ID },
});
