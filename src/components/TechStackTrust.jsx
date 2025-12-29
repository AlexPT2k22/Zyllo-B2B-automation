import React from 'react';
import './TechStackTrust.css';

const TechStackTrust = () => {
  return (
    <section className="tech-trust">
      <div className="tech-trust-container">
        <div className="tech-trust-icons">
          {/* Meta for Developers */}
          <div className="trust-item">
            <svg className="trust-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"/>
            </svg>
            <span>Meta Official API</span>
          </div>

          {/* Stripe Secure */}
          <div className="trust-item">
            <svg className="trust-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
            </svg>
            <span>Stripe Secure</span>
          </div>

          {/* AWS/Cloud */}
          <div className="trust-item">
            <svg className="trust-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.75 11.35a4.32 4.32 0 0 0-.79-.08 4.73 4.73 0 0 0-.66.05 2.93 2.93 0 0 0-1.41-1.76 4.71 4.71 0 0 0-2.5-.71 4.85 4.85 0 0 0-4.73 3.65 4.46 4.46 0 0 0-1.06-.13 3.9 3.9 0 0 0-3.93 3.86 3.93 3.93 0 0 0 3.93 3.9h10.9a3.55 3.55 0 0 0 3.5-3.58 3.59 3.59 0 0 0-3.25-3.2z"/>
            </svg>
            <span>Cloud Hosted</span>
          </div>

          {/* GDPR Compliant */}
          <div className="trust-item">
            <svg className="trust-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            <span>GDPR Compliant</span>
          </div>
        </div>
        <p className="tech-trust-message">Powered by Official Meta APIs & Bank-level Security</p>
      </div>
    </section>
  );
};

export default TechStackTrust;
