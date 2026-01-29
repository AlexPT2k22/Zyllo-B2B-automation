import React from "react";
import Hero from "../components/Hero";
import TechStackTrust from "../components/TechStackTrust";
import Features from "../components/Features";
import ComparisonTable from "../components/ComparisonTable";
import ROICalculator from "../components/ROICalculator";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";

const Home = () => {
  return (
    <>
      <Hero />
      <TechStackTrust />
      <Features />
      <ComparisonTable />
      <ROICalculator />
      <HowItWorks />
      <Pricing />
      <FAQ />
    </>
  );
};

export default Home;
