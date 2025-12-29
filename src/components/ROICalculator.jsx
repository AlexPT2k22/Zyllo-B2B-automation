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
                        See how much money you're leaving on the table by not automating your DMs
                    </p>
                </div>

                <div className="roi-content">
                    <div className="roi-sliders">
                        <div className="slider-group">
                            <div className="slider-header">
                                <label>Instagram Followers</label>
                                <span className="slider-value">{formatNumber(followers)}</span>
                            </div>
                            <input
                                type="range"
                                min="1000"
                                max="100000"
                                step="1000"
                                value={followers}
                                onChange={(e) => setFollowers(Number(e.target.value))}
                                className="roi-slider"
                            />
                            <div className="slider-range">
                                <span>1K</span>
                                <span>100K</span>
                            </div>
                        </div>

                        <div className="slider-group">
                            <div className="slider-header">
                                <label>DMs Received Per Day</label>
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
                            <div className="slider-range">
                                <span>5</span>
                                <span>100</span>
                            </div>
                        </div>

                        <div className="slider-group">
                            <div className="slider-header">
                                <label>Average Product Value</label>
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
                            <div className="slider-range">
                                <span>€10</span>
                                <span>€500</span>
                            </div>
                        </div>
                    </div>

                    <div className="roi-result">
                        <div className="result-card">
                            <div className="result-label">Potential Monthly Revenue</div>
                            <div className="result-amount">
                                <span className="currency">€</span>
                                <span className="amount">{formatNumber(monthlyPotential)}</span>
                            </div>
                            <p className="result-description">
                                You could be making <strong>€{formatNumber(monthlyPotential)}/month</strong> more with automation.
                            </p>
                            <div className="result-comparison">
                                <div className="comparison-item">
                                    <span className="comparison-label">Zyllo Pro Plan</span>
                                    <span className="comparison-price">€79/month</span>
                                </div>
                                <div className="comparison-item highlight">
                                    <span className="comparison-label">Your ROI</span>
                                    <span className="comparison-roi">{Math.round((monthlyPotential / 79) * 100)}%</span>
                                </div>
                            </div>
                            <a href="https://framer.link/ZQ2l2Kk" className="roi-cta">
                                Start Automating Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ROICalculator;
