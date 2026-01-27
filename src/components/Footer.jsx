import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/terms" className="footer-link">
            Terms of Service
          </Link>
          <span className="footer-divider">•</span>
          <Link to="/privacy" className="footer-link">
            Privacy Policy
          </Link>
          <span className="footer-divider">•</span>
          <Link to="/data-deletion" className="footer-link">
            Data Deletion
          </Link>
          <span className="footer-divider">•</span>
          <a href="mailto:support@zyllo.tech" className="footer-link">
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
