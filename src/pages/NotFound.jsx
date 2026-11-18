import { Link } from "react-router-dom";
import { landingPageList } from "@/content/landingPages";
import "@/styles/marketing.css";

const NotFound = () => (
  <div className="mk-page" style={{ textAlign: "center", minHeight: "70vh" }}>
    <p className="mk-eyebrow">404</p>
    <h1 className="mk-h1">This page doesn't exist</h1>
    <p className="mk-lead" style={{ margin: "0 auto 2rem" }}>
      But your next sale might be sitting in your DMs. Here's where to go next:
    </p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
      <Link to="/" className="mk-btn">Go to homepage</Link>
      <Link to="/waitlist" className="mk-btn" style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
        Join the waitlist
      </Link>
    </div>
    <ul style={{ listStyle: "none", padding: 0, marginTop: "2.5rem", display: "grid", gap: 8 }}>
      {landingPageList.map((lp) => (
        <li key={lp.path}>
          <Link to={lp.path} style={{ color: "#d8b4fe" }}>{lp.navLabel}</Link>
        </li>
      ))}
      <li><Link to="/blog" style={{ color: "#d8b4fe" }}>Blog</Link></li>
    </ul>
  </div>
);

export default NotFound;
