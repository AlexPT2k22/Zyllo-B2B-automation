import React from 'react';
import './HowItWorks.css';
import { Link, Settings, DollarSign } from 'lucide-react';

const steps = [
    {
        number: '01',
        title: 'Connect Your Account',
        description: 'Link your Instagram or TikTok business account in just a few clicks. We use official APIs, so your account stays 100% safe.',
        icon: <Link size={32} />,
        platforms: ['Instagram', 'TikTok'],
    },
    {
        number: '02',
        title: 'Set Up Your Keywords',
        description: 'Define the keywords and rules that trigger automatic responses. "Price?", "Available?", "Size?" — you decide what gets answered.',
        icon: <Settings size={32} />,
        features: ['Smart Rules', 'Custom Replies'],
    },
    {
        number: '03',
        title: 'Sell While You Sleep',
        description: 'Watch leads convert 24/7. Get notified when high-intent buyers are ready, while Zyllo handles the rest automatically.',
        icon: <DollarSign size={32} />,
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
                        <div key={index} className={`hiw-step ${index % 2 === 1 ? 'reverse' : ''}`}>
                            <div className="step-content">
                                <span className="step-number">{step.number}</span>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>

                                {step.platforms && (
                                    <div className="step-tags">
                                        {step.platforms.map((platform, i) => (
                                            <span key={i} className="step-tag">{platform}</span>
                                        ))}
                                    </div>
                                )}

                                {step.features && (
                                    <div className="step-tags">
                                        {step.features.map((feature, i) => (
                                            <span key={i} className="step-tag">{feature}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className={`step-visual ${step.highlight ? 'highlight' : ''}`}>
                                <div className="step-icon-wrapper">
                                    {step.icon}
                                </div>
                                {step.highlight && (
                                    <div className="notification-badge">
                                        <span className="notif-icon">💰</span>
                                        <span className="notif-text">New sale: €49.99</span>
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
