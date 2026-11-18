import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" aria-label="Zyllo home">
            <img src="/Zolly Logo.png" alt="Zyllo" className="logo-image" width="32" height="32" />
          </Link>
        </div>
        <nav className="nav-menu" aria-label="Main">
          <Link to="/instagram-dm-automation" className="nav-link">
            Instagram
          </Link>
          <Link to="/tiktok-dm-automation" className="nav-link">
            TikTok
          </Link>
          <a href="/#pricing" className="nav-link">
            Pricing
          </a>
          <Link to="/blog" className="nav-link">
            Blog
          </Link>
        </nav>
        <div className="cta-container">
          <Link to="/waitlist" className="cta-button">
            Join Waitlist
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
