import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { posts } from "@/content/blog";
import { Breadcrumbs } from "@/components/marketing";
import WaitlistForm from "@/components/waitlist/WaitlistForm";
import "@/styles/marketing.css";

const BlogIndex = () => (
  <div className="mk-page">
    <Breadcrumbs
      items={[
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ]}
    />
    <header className="mk-section-head">
      <p className="mk-eyebrow">Zyllo Blog</p>
      <h1 className="mk-h1">Instagram &amp; TikTok DM sales playbooks</h1>
      <p className="mk-lead">
        Practical guides for e-commerce brands that want more sales from their
        comments and DMs — without living in the inbox.
      </p>
    </header>

    <div className="mk-grid mk-grid--2">
      {posts.map((post) => (
        <Link key={post.slug} to={post.path} className="mk-card mk-card--link">
          <span className="mk-kicker">
            {post.category} · {post.readingTime} min read
          </span>
          <h2 className="mk-h3" style={{ fontSize: "1.375rem" }}>{post.title}</h2>
          <p className="mk-muted">{post.description}</p>
          <span className="mk-card-cta">
            Read guide <ArrowRight size={16} aria-hidden="true" />
          </span>
        </Link>
      ))}
    </div>

    <section className="mk-section">
      <div className="mk-cta-band">
        <h2 className="mk-h2">Automate it instead of reading about it</h2>
        <p className="mk-lead">
          Zyllo puts these playbooks on autopilot for Instagram and TikTok shops.
        </p>
        <WaitlistForm source="blog-index" />
      </div>
    </section>
  </div>
);

export default BlogIndex;
