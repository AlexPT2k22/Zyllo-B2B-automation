import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src="/Zolly Logo.png" alt="Zyllo" className="logo-image" />
          </Link>
        </div>
        <nav className="nav-menu">
          <a href="/#product" className="nav-link">
            Product
          </a>
          <a href="/#pricing" className="nav-link">
            Pricing
          </a>
          <a href="/#faq" className="nav-link">
            FAQ
          </a>
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
