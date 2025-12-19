import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LogoTicker from './components/LogoTicker';
import Features from './components/Features';
import DashboardPreview from './components/DashboardPreview';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Hero />
        <LogoTicker />
        <Features />
        <DashboardPreview />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;
