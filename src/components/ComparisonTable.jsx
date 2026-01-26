import React from 'react';
import './ComparisonTable.css';
import { Check, X, Clock } from 'lucide-react';

const ComparisonTable = () => {
    const features = [
        {
            name: 'Response Time',
            zyllo: '< 2 seconds',
            manual: '2 hours',
            agency: '24 hours',
            zylloWin: true,
        },
        {
            name: 'Availability',
            zyllo: '24/7',
            manual: '9am - 6pm',
            agency: 'Business hours',
            zylloWin: true,
        },
        {
            name: 'Monthly Cost',
            zyllo: '€29',
            manual: 'Your time',
            agency: '€800+',
            zylloWin: true,
        },
        {
            name: 'Setup Time',
            zyllo: '< 10 minutes',
            manual: '-',
            agency: '2-4 weeks',
            zylloWin: true,
        },
        {
            name: 'Never Gets Tired',
            zyllo: 'Always alert',
            manual: 'Gets fatigued',
            agency: 'Multiple clients',
            zylloWin: true,
        },
    ];

    return (
        <section className="comparison" id="comparison">
            <div className="comparison-container">
                <h2 className="comparison-title">Why choose Zyllo?</h2>
                <p className="comparison-subtitle">
                    See how automation stacks up against the alternatives
                </p>

                <div className="comparison-table-wrapper">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th className="feature-header">Feature</th>
                                <th className="zyllo-header">
                                    <div className="header-content">
                                        <span className="zyllo-logo">Zyllo</span>
                                        <span className="header-badge">Recommended</span>
                                    </div>
                                </th>
                                <th className="other-header">Manual (You)</th>
                                <th className="other-header">Marketing Agency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr key={index}>
                                    <td className="feature-name">{feature.name}</td>
                                    <td className="zyllo-cell">
                                        <div className="cell-content">
                                            <Check className="check-icon" size={18} />
                                            <span>{feature.zyllo}</span>
                                        </div>
                                    </td>
                                    <td className="other-cell">
                                        <div className="cell-content">
                                            {feature.manual === '-' ? (
                                                <span className="dash">-</span>
                                            ) : (
                                                <>
                                                    <Clock className="clock-icon" size={16} />
                                                    <span>{feature.manual}</span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="other-cell">
                                        <div className="cell-content">
                                            <X className="x-icon" size={16} />
                                            <span>{feature.agency}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default ComparisonTable;
