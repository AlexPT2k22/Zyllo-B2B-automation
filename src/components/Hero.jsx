import { Link } from "react-router-dom";
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
        <h1 className="hero-title">
          Never lose
          <br />a lead anymore
        </h1>
        <p className="hero-subtitle">
          Automate responses, qualify leads, and recover shopping carts on
          Instagram and TikTok. The tool that works 24/7 for your clothing,
          nail, resale store and more.
        </p>
        <div className="hero-cta">
          <Link to="/waitlist" className="hero-button">
            Try now
          </Link>
        </div>

        <div className="hero-visuals">
          <div className="hero-glow"></div>
          <img
            src="/Screenshot_1.png"
            alt="Dashboard Screenshot"
            className="hero-screenshot"
          />
          <img
            src="/shape-icon.png"
            alt="3D Shape"
            className="hero-shape shape-1"
          />
          <img
            src="/shape-icon2.png"
            alt="3D Shape"
            className="hero-shape shape-2"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
