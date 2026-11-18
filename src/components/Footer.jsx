import React from "react";
import { Link } from "react-router-dom";
import { landingPageList } from "@/content/landingPages";
import { posts } from "@/content/blog";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-columns">
          <div className="footer-col footer-col--brand">
            <img
              src="/Zolly Logo.png"
              alt="Zyllo"
              className="footer-logo-image"
              width="24"
              height="24"
            />
            <p className="footer-tagline">
              AI DM automation and sales follow-up for Instagram &amp; TikTok
              shops.
            </p>
            <Link to="/waitlist" className="footer-cta">
              Join the waitlist →
            </Link>
          </div>

          <nav className="footer-col" aria-label="Use cases">
            <p className="footer-heading">Use cases</p>
            {landingPageList.map((lp) => (
              <Link key={lp.path} to={lp.path} className="footer-link">
                {lp.navLabel}
              </Link>
            ))}
          </nav>

          <nav className="footer-col" aria-label="Resources">
            <p className="footer-heading">Resources</p>
            <Link to="/blog" className="footer-link">
              Blog
            </Link>
            {posts.slice(0, 3).map((p) => (
              <Link key={p.path} to={p.path} className="footer-link">
                {p.title}
              </Link>
            ))}
          </nav>

          <nav className="footer-col" aria-label="Company">
            <p className="footer-heading">Company</p>
            <a href="/#pricing" className="footer-link">
              Pricing
            </a>
            <a href="/#faq" className="footer-link">
              FAQ
            </a>
            <a href="mailto:contact@zyllo.tech" className="footer-link">
              Support
            </a>
          </nav>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Zyllo Inc. All rights reserved.
          </div>
          <div className="footer-legal">
            <Link to="/terms" className="footer-link">
              Terms
            </Link>
            <Link to="/privacy" className="footer-link">
              Privacy
            </Link>
            <Link to="/data-deletion" className="footer-link">
              Data Deletion
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
