import React from 'react';
import { MessageCircle, Zap, ShoppingCart } from 'lucide-react';
import './Features.css';

const features = [
  {
    image: '/phone.png',
    title: '24/7 Instant Responses',
    description: "Don't keep your customers waiting. Our rules engine responds to questions about prices, stock, and schedules in seconds.",
  },
  {
    image: '/charts.png',
    title: 'Qualify Leads',
    description: "Automatically identify high-intent buyers and route them to your sales team or checkout page.",
  },
  {
    image: '/cart.png',
    title: 'Recover Carts',
    description: "Send automated follow-ups to customers who abandoned their shopping carts on Instagram and TikTok.",
  },
];

const Features = () => {
  return (
    <section className="features" id="product">
      <div className="features-container">
        <h2 className="features-title">Everything you need to scale your sales</h2>
        <p className="features-subtitle">
          Enjoy customizable lists, team work tools, and smart tracking all in one place.
          Set tasks, get reminders, and see your progress simply and quickly.
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                {feature.image ? (
                  <img src={feature.image} alt={feature.title} className="feature-floating-img" />
                ) : (
                  <div className="feature-icon">{feature.icon}</div>
                )}
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
