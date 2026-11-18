import { motion } from "framer-motion";
import "./Hero.css";
import DarkVeil from "./DarkVeil";
import WaitlistForm from "./waitlist/WaitlistForm";

// The H1, subtitle and form render without entrance animations on purpose:
// they're the LCP content, so they must be visible in the prerendered HTML
// before JavaScript loads (critical on mobile, where 80% of clicks come from).
const Hero = () => {
  return (
    <section className="hero" id="waitlist-form">
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      >
        <DarkVeil />
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-eyebrow">
            AI DM automation for Instagram &amp; TikTok shops
          </span>
          Never lose
          <br />a lead anymore
        </h1>
        <p className="hero-subtitle">
          Zyllo replies to every comment and DM in seconds, sends the right
          product link and follows up with shoppers who go quiet — 24/7, for
          fashion, beauty, nail, resale and every shop that sells on social.
        </p>
        <div className="hero-cta">
          <WaitlistForm source="home-hero" buttonLabel="Get early access" />
        </div>

        <div className="hero-visuals" aria-hidden="true">
          <div className="hero-glow"></div>
          <motion.img
            src="/shape-icon.png"
            alt=""
            className="hero-shape shape-1"
            initial={{ opacity: 0, x: -30, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.img
            src="/shape-icon2.png"
            alt=""
            className="hero-shape shape-2"
            initial={{ opacity: 0, x: 30, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
