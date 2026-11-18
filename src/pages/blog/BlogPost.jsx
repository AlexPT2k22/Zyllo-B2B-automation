import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, CTA_MARKER } from "@/content/blog";
import { Breadcrumbs, StickyCta, RelatedLinks } from "@/components/marketing";
import WaitlistForm from "@/components/waitlist/WaitlistForm";
import NotFound from "@/pages/NotFound";
import { formatDate } from "./formatDate";
import "@/styles/marketing.css";

function InlineCta({ source }) {
  return (
    <aside className="mk-inline-cta" aria-label="Join the Zyllo waitlist">
      <h2 className="mk-h3">Put this on autopilot with Zyllo</h2>
      <p className="mk-muted">
        AI DM automation for Instagram &amp; TikTok shops — comment-to-DM,
        product answers and follow-ups. Join the early-access list.
      </p>
      <WaitlistForm source={source} align="left" showProof={false} />
    </aside>
  );
}

function Toc({ toc }) {
  return (
    <ol>
      {toc.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`}>{h.text}</a>
        </li>
      ))}
    </ol>
  );
}

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPost(slug);

  // Internal links inside the Markdown are plain <a> tags; route them
  // through React Router so navigation stays instant.
  const handleClick = useCallback(
    (e) => {
      const a = e.target.closest("a");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
      const href = a.getAttribute("href");
      if (href?.startsWith("/")) {
        e.preventDefault();
        navigate(href);
        window.scrollTo(0, 0);
      }
    },
    [navigate],
  );

  if (!post) return <NotFound />;

  const chunks = post.html.split(CTA_MARKER);

  return (
    <div className="mk-page">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: post.path },
        ]}
      />

      <div className="mk-post-layout">
        <article>
          <header>
            <p className="mk-eyebrow">{post.category} guide</p>
            <h1 className="mk-h1" style={{ fontSize: "clamp(2rem, 5.5vw, 3rem)" }}>
              {post.title}
            </h1>
            <div className="mk-post-meta">
              <span>{post.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.updated}>Updated {formatDate(post.updated)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </header>

          {post.toc.length > 2 && (
            <details className="mk-card mk-toc mk-toc-mobile">
              <summary>In this guide</summary>
              <Toc toc={post.toc} />
            </details>
          )}

          <div className="mk-prose" onClick={handleClick}>
            {chunks.map((html, i) => (
              <div key={i}>
                <div dangerouslySetInnerHTML={{ __html: html }} />
                {i < chunks.length - 1 && <InlineCta source={`blog-${post.slug}-${i + 1}`} />}
              </div>
            ))}
          </div>
        </article>

        <aside className="mk-aside" aria-label="Article sidebar">
          <div className="mk-aside-inner">
            {post.toc.length > 2 && (
              <nav className="mk-card mk-toc" aria-label="Table of contents">
                <span className="mk-kicker">In this guide</span>
                <Toc toc={post.toc} />
              </nav>
            )}
            <div className="mk-card">
              <span className="mk-kicker">Early access</span>
              <p className="mk-h3">Automate your DMs with Zyllo</p>
              <p className="mk-muted" style={{ marginBottom: "1rem", fontSize: "0.9375rem" }}>
                Instant replies, product links and AI follow-ups for Instagram
                &amp; TikTok shops.
              </p>
              <WaitlistForm source={`blog-${post.slug}-sidebar`} showProof={false} buttonLabel="Join waitlist" />
            </div>
          </div>
        </aside>
      </div>

      <RelatedLinks
        title="Related"
        pages={post.category === "TikTok"
          ? ["tiktok-dm-automation", "instagram-dm-automation", "manychat-alternative"]
          : ["instagram-dm-automation", "tiktok-dm-automation", "manychat-alternative"]}
      />

      <StickyCta href="/waitlist" label="Join waitlist" />
    </div>
  );
};

export default BlogPost;
