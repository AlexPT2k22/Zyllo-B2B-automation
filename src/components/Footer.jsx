import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <a href="#" className="footer-link">
            Terms of Use
          </a>
          <span className="footer-divider">•</span>
          <a href="#" className="footer-link">
            Privacy Policy
          </a>
          <span className="footer-divider">•</span>
          <a href="#" className="footer-link">
            Support
          </a>
        </div>

        <div className="footer-bottom">
          <div className="footer-logo">
            <img
              src="/Zolly Logo.png"
              alt="Zyllo"
              className="footer-logo-image"
            />
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Zyllo Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
