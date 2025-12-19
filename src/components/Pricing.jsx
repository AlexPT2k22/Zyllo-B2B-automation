import React from 'react';
import './Pricing.css';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for small businesses just getting started.',
    features: [
      'Automated DMs',
      'Comment Replies',
      'Basic Analytics',
      '1 Social Account'
    ],
    highlight: false
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/month',
    description: 'For growing brands that need more power.',
    features: [
      'Everything in Starter',
      'Advanced Analytics',
      'Priority Support',
      '3 Social Accounts',
      'Custom Rules'
    ],
    highlight: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large organizations.',
    features: [
      'Unlimited Accounts',
      'Dedicated Account Manager',
      'API Access',
      'SLA Support'
    ],
    highlight: false
  }
];

const Pricing = () => {
  return (
    <section className="pricing" id="pricing">
      <div className="pricing-container">
        <h2 className="pricing-title">Simple, transparent pricing</h2>
        <p className="pricing-subtitle">Choose the plan that's right for your business. No hidden fees.</p>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.highlight ? 'highlight' : ''}`}>
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                {plan.price}<span className="plan-period">{plan.period}</span>
              </div>
              <p className="plan-description">{plan.description}</p>
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button className="plan-button">Get Started</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
