import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Never lose<br />a lead anymore</h1>
        <p className="hero-subtitle">
          Automate responses, qualify leads, and recover shopping carts on Instagram and TikTok. 
          The tool that works 24/7 for your clothing, nail, resale store and more.
        </p>
        <div className="hero-cta">
          <a href="https://framer.link/ZQ2l2Kk" className="hero-button">Try now</a>
        </div>
        
        <div className="hero-visuals">
          <div className="hero-glow"></div>
          <img src="/src/assets/Screenshot_1.png" alt="Dashboard Screenshot" className="hero-screenshot" />
          <img src="/src/assets/Shape Icon.png" alt="3D Shape" className="hero-shape shape-1" />
          <img src="/src/assets/Shape Icon2.png" alt="3D Shape" className="hero-shape shape-2" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
