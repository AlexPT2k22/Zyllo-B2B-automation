import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { landingPageList } from "@/content/landingPages";
import { posts } from "@/content/blog";
import "@/styles/marketing.css";

// Homepage internal-linking hub: passes authority from the branded homepage
// to the non-branded use-case pages and blog guides.
const UseCases = () => (
  <section className="mk-page" style={{ paddingTop: 48, paddingBottom: 0 }} aria-labelledby="usecases-title">
    <div className="mk-section-head">
      <p className="mk-eyebrow">Use cases</p>
      <h2 id="usecases-title" className="mk-h2">
        One tool for every conversation that can become a sale
      </h2>
    </div>
    <div className="mk-grid mk-grid--3">
      {landingPageList.map((lp) => (
        <Link key={lp.path} to={lp.path} className="mk-card mk-card--link">
          <h3 className="mk-h3">{lp.navLabel}</h3>
          <p className="mk-muted">{lp.hero.sub}</p>
          <span className="mk-card-cta">
            Learn more <ArrowRight size={16} aria-hidden="true" />
          </span>
        </Link>
      ))}
    </div>
    {posts.length > 0 && (
      <p className="mk-muted" style={{ marginTop: 20 }}>
        New to DM automation? Start with our guides:{" "}
        {posts.map((p, i) => (
          <span key={p.path}>
            {i > 0 && " · "}
            <Link to={p.path} style={{ color: "#d8b4fe" }}>{p.title}</Link>
          </span>
        ))}
      </p>
    )}
  </section>
);

export default UseCases;
