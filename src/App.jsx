import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TechStackTrust from './components/TechStackTrust';
import LogoTicker from './components/LogoTicker';
import Features from './components/Features';
import ComparisonTable from './components/ComparisonTable';
import ROICalculator from './components/ROICalculator';
import HowItWorks from './components/HowItWorks';
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
        <TechStackTrust />
        <Features />
        <ComparisonTable />
        <ROICalculator />
        <HowItWorks />
        <DashboardPreview />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;
