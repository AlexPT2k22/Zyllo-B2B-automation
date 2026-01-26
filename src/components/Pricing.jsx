import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Pricing.css";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Essential",
    monthlyPrice: 29,
    description: "Perfect for getting started",
    buttonText: "Join Waitlist",
    features: [
      "Up to 500 assisted conversations",
      "Automatic response to comments",
      "5 custom response flows",
      "Basic chat support",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    monthlyPrice: 79,
    description: "Best for growing brands",
    buttonText: "Join Waitlist",
    badge: "Most Popular",
    features: [
      "Unlimited conversations",
      "Abandoned Cart Recovery",
      "Product Catalog Sync",
      "Advanced Analytics Dashboard",
      "Qualified Lead Filtering",
    ],
    highlight: true,
  },
  {
    name: "Business",
    monthlyPrice: 149,
    description: "For scaling agencies",
    buttonText: "Join Waitlist",
    features: [
      "Everything in Pro",
      "Priority Webhook processing",
      "Weekly ROI email reports",
      "Priority 24/7 support",
      "Early access to Beta features",
    ],
    highlight: false,
  },
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const getPrice = (monthlyPrice) => {
    if (isAnnual) {
      const annualPrice = Math.round((monthlyPrice * 12 * 0.8) / 12);
      return `€${annualPrice}`;
    }
    return `€${monthlyPrice}`;
  };

  return (
    <section className="pricing" id="pricing">
      <div className="pricing-container">
        <div className="pricing-header">
          <h2 className="pricing-title">Simple, transparent pricing</h2>
          <p className="pricing-subtitle">
            Choose the plan that's right for your business. No hidden fees.
          </p>

          <div className="pricing-toggle-wrapper">
            <span className={`toggle-label ${!isAnnual ? "active" : ""}`}>
              Monthly
            </span>
            <button
              className={`pricing-toggle-btn ${isAnnual ? "active" : ""}`}
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle annual pricing"
            >
              <div className="toggle-thumb" />
            </button>
            <span className={`toggle-label ${isAnnual ? "active" : ""}`}>
              Annual <span className="save-badge">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card ${plan.highlight ? "highlighted" : ""}`}
            >
              {plan.highlight && (
                <div className="popular-badge">Most Popular</div>
              )}

              <div className="card-content">
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-desc">{plan.description}</p>
                </div>

                <div className="plan-price-box">
                  <span className="currency">€</span>
                  <span className="amount">
                    {isAnnual
                      ? Math.round(plan.monthlyPrice * 0.8)
                      : plan.monthlyPrice}
                  </span>
                  <span className="period">/month</span>
                </div>

                {isAnnual && (
                  <div className="billed-yearly">
                    Billed €{Math.round(plan.monthlyPrice * 0.8 * 12)} yearly
                  </div>
                )}

                <Link to="/waitlist" style={{ width: "100%" }}>
                  <button
                    className={`plan-button ${plan.highlight ? "primary" : "secondary"}`}
                  >
                    {plan.buttonText}
                  </button>
                </Link>

                <div className="plan-features">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="feature-item">
                      <Check className="check-icon" size={18} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
