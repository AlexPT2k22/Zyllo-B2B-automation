import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-cta">
          <h2 className="footer-title">Join Zyllo today</h2>
          <p className="footer-subtitle">
            Automate responses, qualify leads, and recover shopping carts on Instagram and TikTok.
          </p>
          <div className="footer-form">
            <input type="email" placeholder="Enter your email" className="footer-input" />
            <button className="footer-button">Get started</button>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-logo">Zyllo</div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Zyllo Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
