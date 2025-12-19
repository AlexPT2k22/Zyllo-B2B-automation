import React from 'react';
import './LogoTicker.css';

const logos = [
  { name: 'Acme Corp', id: 1 },
  { name: 'Quantum', id: 2 },
  { name: 'Echo Valley', id: 3 },
  { name: 'PULSE', id: 4 },
  { name: 'APEX', id: 5 },
  { name: 'Celestial', id: 6 },
];

const LogoTicker = () => {
  return (
    <section className="logo-ticker">
      <div className="ticker-container">
        <p className="ticker-title">Trusted by the world’s most innovative teams</p>
        <div className="ticker-mask">
          <div className="ticker-track">
            {[...logos, ...logos, ...logos].map((logo, index) => (
              <div key={index} className="ticker-item">
                <div className="logo-icon"></div>
                <span className="logo-name">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoTicker;
