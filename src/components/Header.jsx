import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/">Zyllo</a>
        </div>
        <nav className="nav-menu">
          <a href="#product" className="nav-link">Product</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#faq" className="nav-link">FAQ</a>
        </nav>
        <div className="cta-container">
          <a href="https://framer.link/ZQ2l2Kk" className="cta-button">Try now</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
