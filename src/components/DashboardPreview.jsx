import React from 'react';
import './DashboardPreview.css';

const DashboardPreview = () => {
  return (
    <section className="dashboard-preview">
      <div className="dashboard-container">
        <h2 className="dashboard-title">Total control in the palm of your hand</h2>
        <p className="dashboard-subtitle">
          An intuitive interface designed for those who don't have time to waste. Configure your response flows, 
          track conversion metrics, and manage your inventory centrally.
        </p>
        <div className="dashboard-image-wrapper">
          <img src="/src/assets/Screenshot_1.png" alt="Zyllo Dashboard Interface" className="dashboard-image" />
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
