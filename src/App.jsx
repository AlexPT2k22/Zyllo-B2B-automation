import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import WaitlistPage from "./pages/WaitlistPage";
import ConfirmPage from "./pages/ConfirmPage";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/confirm" element={<ConfirmPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
