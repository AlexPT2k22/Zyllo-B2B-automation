import React, { useState, useMemo } from 'react';
import './ROICalculator.css';

const ROICalculator = () => {
    const [followers, setFollowers] = useState(10000);
    const [dmsPerDay, setDmsPerDay] = useState(20);
    const [productValue, setProductValue] = useState(50);

    const monthlyPotential = useMemo(() => {
        // Formula: (DMs * 0.3 * Value) * 30 days = Monthly Potential
        return Math.round(dmsPerDay * 0.3 * productValue * 30);
    }, [dmsPerDay, productValue]);

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    return (
        <section className="roi-calculator" id="roi-calculator">
            <div className="roi-container">
                <div className="roi-header">
                    <h2 className="roi-title">Calculate Your Lost Revenue</h2>
                    <p className="roi-subtitle">
                        See how much you could be making by automating your DMs
                    </p>
                </div>

                <div className="roi-dashboard">
                    <div className="roi-inputs">
                        <h3 className="inputs-title">Your Metrics</h3>

                        <div className="slider-group">
                            <div className="slider-header group-header">
                                <label>Messages / Day</label>
                                <span className="slider-value">{dmsPerDay}</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="100"
                                step="5"
                                value={dmsPerDay}
                                onChange={(e) => setDmsPerDay(Number(e.target.value))}
                                className="roi-slider"
                            />
                        </div>

                        <div className="slider-group">
                            <div className="slider-header group-header">
                                <label>Avg. Order Value</label>
                                <span className="slider-value">€{productValue}</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="500"
                                step="10"
                                value={productValue}
                                onChange={(e) => setProductValue(Number(e.target.value))}
                                className="roi-slider"
                            />
                        </div>
                    </div>

                    <div className="roi-results-panel">
                        <h3 className="results-title">Monthly Potential</h3>

                        <div className="potential-display">
                            <span className="currency">€</span>
                            <span className="amount">{formatNumber(monthlyPotential)}</span>
                        </div>

                        <p className="potential-subtitle">Additional Revenue</p>

                        <div className="roi-breakdown">
                            <div className="breakdown-row">
                                <span>Annual Potential</span>
                                <span>€{formatNumber(monthlyPotential * 12)}</span>
                            </div>
                            <div className="breakdown-row highlight">
                                <span>Zyllo Cost</span>
                                <span>€79/mo</span>
                            </div>
                        </div>

                        <div className="roi-actions">
                            <a href="https://framer.link/ZQ2l2Kk" className="roi-cta-button">
                                Start Automating
                            </a>
                            <p className="guarantee-text">30-day money-back guarantee</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ROICalculator;
