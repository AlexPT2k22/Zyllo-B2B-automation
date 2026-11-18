import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { landingPages } from "@/content/landingPages";
import { getPost } from "@/content/blog";
import "@/styles/marketing.css";

/* FAQ accordion built on <details>: works without JS and the answers are
   always in the HTML, so crawlers and the FAQPage schema stay in sync. */
export function FaqList({ faqs, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <div className="mk-faq">
      {faqs.map((f, i) => (
        <details key={f.question} className="mk-faq-item" open={i === 0}>
          <summary>
            <H className="mk-faq-q">{f.question}</H>
            <span className="mk-faq-icon" aria-hidden="true">+</span>
          </summary>
          <p className="mk-faq-a">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mk-breadcrumbs">
      <ol>
        {items.map((item, i) => (
          <li key={item.path}>
            {i < items.length - 1 ? (
              <>
                <Link to={item.path}>{item.name}</Link>
                <ChevronRight size={14} aria-hidden="true" />
              </>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* Mobile-only bottom bar that appears once the hero form is scrolled away. */
export function StickyCta({ href = "/waitlist", label = "Get early access", threshold = 600 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const isAnchor = href.startsWith("#");
  return (
    <div className={`mk-sticky ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
      <span className="mk-sticky-text">Early access is open</span>
      {isAnchor ? (
        <a href={href} className="mk-btn mk-btn--sm" tabIndex={visible ? 0 : -1}>
          {label}
        </a>
      ) : (
        <Link to={href} className="mk-btn mk-btn--sm" tabIndex={visible ? 0 : -1}>
          {label}
        </Link>
      )}
    </div>
  );
}

/* Internal-linking block: related use-case pages + blog posts. */
export function RelatedLinks({ title = "Keep exploring", pages = [], postSlugs = [] }) {
  const items = [
    ...pages.map((slug) => {
      const p = landingPages[slug];
      return { to: p.path, kicker: "Use case", title: p.navLabel, body: p.seo.description };
    }),
    ...postSlugs
      .map(getPost)
      .filter(Boolean)
      .map((post) => ({
        to: post.path,
        kicker: `Guide · ${post.readingTime} min read`,
        title: post.title,
        body: post.description,
      })),
  ];
  if (!items.length) return null;

  return (
    <section className="mk-section" aria-labelledby="related-title">
      <h2 id="related-title" className="mk-h2">{title}</h2>
      <div className="mk-grid mk-grid--3">
        {items.map((item) => (
          <Link key={item.to} to={item.to} className="mk-card mk-card--link">
            <span className="mk-kicker">{item.kicker}</span>
            <h3 className="mk-h3">{item.title}</h3>
            <p className="mk-muted">{item.body}</p>
            <span className="mk-card-cta">
              Read more <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
