import React from "react";
import "./HowItWorks.css";
import { Link, Settings, DollarSign } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect Your Account",
    description:
      "Link your Instagram or TikTok business account in just a few clicks. We use official APIs, so your account stays 100% safe.",
    visualType: "connect",
    platforms: ["Instagram", "TikTok"],
  },
  {
    number: "02",
    title: "Set Up Your Keywords",
    description:
      'Define the keywords and rules that trigger automatic responses. "Price?", "Available?", "Size?" — you decide what gets answered.',
    visualType: "rules",
    features: ["Smart Rules", "Custom Replies"],
  },
  {
    number: "03",
    title: "Sell While You Sleep",
    description:
      "Watch leads convert 24/7. Get notified when high-intent buyers are ready, while Zyllo handles the rest automatically.",
    visualType: "notification",
    highlight: true,
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="hiw-container">
        <div className="hiw-header">
          <h2 className="hiw-title">How It Works</h2>
          <p className="hiw-subtitle">Get started in minutes, not days</p>
        </div>

        <div className="hiw-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`hiw-step ${index % 2 === 1 ? "reverse" : ""}`}
            >
              <div className="step-content">
                <span className="step-number">{step.number}</span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>

                {step.platforms && (
                  <div className="step-tags">
                    {step.platforms.map((platform, i) => (
                      <span key={i} className="step-tag">
                        {platform}
                      </span>
                    ))}
                  </div>
                )}

                {step.features && (
                  <div className="step-tags">
                    {step.features.map((feature, i) => (
                      <span key={i} className="step-tag">
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="step-visual">
                {step.visualType === "connect" && (
                  <div className="visual-mockup connect-mockup">
                    <div className="connect-row">
                      <div className="platform-icon insta">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="20"
                          height="20"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </div>
                      <div className="sync-status">
                        <span className="status-dot"></span>
                        Connected
                      </div>
                    </div>
                  </div>
                )}

                {step.visualType === "rules" && (
                  <div className="visual-mockup rules-mockup">
                    <div className="rule-card">
                      <div className="rule-header">
                        <span className="rule-label">Trigger</span>
                      </div>
                      <div className="rule-content">
                        If message contains{" "}
                        <span className="highlight-text">"price"</span>
                      </div>
                    </div>
                    <div className="rule-arrow">↓</div>
                    <div className="rule-card action">
                      <div className="rule-header">
                        <span className="rule-label">Action</span>
                      </div>
                      <div className="rule-content">
                        Reply "It costs €50..."
                      </div>
                    </div>
                  </div>
                )}

                {step.visualType === "notification" && (
                  <div className="visual-mockup notification-mockup">
                    <div className="notification-toast">
                      <div className="notif-content">
                        <div className="notif-title">New Order Received</div>
                        <div className="notif-message">
                          Customer purchased "Vintage Tee" - €45.00
                        </div>
                      </div>
                      <div className="notif-time">Now</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="hiw-connector">
          <div className="connector-line"></div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
