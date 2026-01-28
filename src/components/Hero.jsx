import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Hero.css";
import DarkVeil from "./DarkVeil";

const Hero = () => {
  return (
    <section className="hero">
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
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Never lose
          <br />a lead anymore
        </motion.h1>
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          Automate responses, qualify leads, and recover shopping carts on
          Instagram and TikTok. The tool that works 24/7 for your clothing,
          nail, resale store and more.
        </motion.p>
        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Link to="/waitlist" className="hero-button">
            Join Waitlist
          </Link>
        </motion.div>

        <motion.div
          className="hero-visuals"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="hero-glow"></div>
          <img
            src="/Screenshot_1.png"
            alt="Dashboard Screenshot"
            className="hero-screenshot"
          />
          <motion.img
            src="/shape-icon.png"
            alt="3D Shape"
            className="hero-shape shape-1"
            initial={{ opacity: 0, x: -30, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.img
            src="/shape-icon2.png"
            alt="3D Shape"
            className="hero-shape shape-2"
            initial={{ opacity: 0, x: 30, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
