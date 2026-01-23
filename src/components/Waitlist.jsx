import React, { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import "./Waitlist.css";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      console.log("Email captured:", email);
    }, 1500);
  };

  return (
    <section className="waitlist-section" id="waitlist">
      <div className="waitlist-container">
        <div className="waitlist-card">
          <div className="waitlist-badge">Coming Soon</div>

          <h2 className="waitlist-title">
            Join the future of <br />
            <span style={{ color: "#a855f7" }}>automated sales</span>
          </h2>

          <p className="waitlist-desc">
            Be the first to experience Zolly. Join our exclusive waitlist to get
            early access and special launch pricing.
          </p>

          {status === "success" ? (
            <div className="success-message">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <CheckCircle size={20} />
                <span>You're on the list! We'll be in touch soon.</span>
              </div>
            </div>
          ) : (
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your work email"
                className="waitlist-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
              />
              <button
                type="submit"
                className="waitlist-btn"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Join Waitlist"
                )}
              </button>
            </form>
          )}

          <div className="social-proof">
            <div className="avatars">
              <div
                className="avatar"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces)",
                }}
              ></div>
              <div
                className="avatar"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces)",
                }}
              ></div>
              <div
                className="avatar"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces)",
                }}
              ></div>
            </div>
            <p className="proof-text">
              Join <strong>2,000+</strong> others waiting
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Waitlist;
