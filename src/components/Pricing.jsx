import React, { useState } from 'react';
import './Pricing.css';

const plans = [
  {
    name: 'Essential',
    monthlyPrice: 29,
    buttonText: 'Start now',
    features: [
      'Up to 500 assisted conversations/month',
      'Automatic response to comments and DMs',
      'Configuration of 5 response flows',
      'Support via chat'
    ],
    theme: 'dark'
  },
  {
    name: 'Pro',
    monthlyPrice: 79,
    buttonText: 'Try for free',
    badge: 'Most popular',
    features: [
      'Unlimited assisted conversations',
      'Abandoned Cart Recovery via DM',
      'Integration with Product Catalog',
      'Complete Analytics Dashboard',
      'Qualified lead filter'
    ],
    theme: 'light'
  },
  {
    name: 'Business',
    monthlyPrice: 149,
    buttonText: 'Contact us',
    features: [
      'Everything in the Pro plan',
      'Priority Webhook processing',
      'Weekly ROI reports via email',
      'Priority 24/7 support',
      'Access to AI',
      'Early access to new features (Beta)'
    ],
    theme: 'dark'
  }
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const getPrice = (monthlyPrice) => {
    if (isAnnual) {
      const annualPrice = Math.round(monthlyPrice * 12 * 0.8);
      return `$${annualPrice}`;
    }
    return `$${monthlyPrice}`;
  };

  const getPeriod = () => isAnnual ? '/year' : '/month';

  return (
    <section className="pricing" id="pricing">
      <div className="pricing-container">
        <h2 className="pricing-title">Pricing</h2>
        <p className="pricing-subtitle">Upgrade for unlimited tasks, and exclusive features.</p>
        
        <div className="pricing-toggle">
          <span className={!isAnnual ? 'active' : ''}>Monthly</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={isAnnual} 
              onChange={() => setIsAnnual(!isAnnual)} 
            />
            <span className="toggle-slider"></span>
          </label>
          <span className={isAnnual ? 'active' : ''}>Annual <span className="discount-badge">-20%</span></span>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.theme}`}>
              <div className="card-header">
                <h3 className="plan-name">{plan.name}</h3>
                {plan.badge && <span className="plan-badge">{plan.badge}</span>}
              </div>
              <div className="plan-price">
                {getPrice(plan.monthlyPrice)}<span className="plan-period">{getPeriod()}</span>
              </div>
              <button className="plan-button">{plan.buttonText}</button>
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}><span className="check">✓</span> {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

