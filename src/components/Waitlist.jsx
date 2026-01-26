import React, { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import "./Waitlist.css";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/waitlist-signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email }),
        },
      );

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await response.json();
        console.error("Signup error:", data);
        setStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    }
  };

  return (
    <section className="waitlist-section" id="waitlist">
      <div className="waitlist-container">
        <div className="waitlist-card">
          <div className="waitlist-badge">Coming Soon</div>

          <h2 className="waitlist-title">
            Automated sales through{" "}
            <span style={{ color: "#a855f7" }}>smart messaging</span>
          </h2>

          <p className="waitlist-desc">
            Zyllo helps you respond instantly, qualify leads, and recover lost
            revenue automatically. Join the waitlist to get early access and
            special launch pricing.
          </p>

          {status === "success" ? (
            <div className="success-message">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Check size={20} />
                <span>Check your email to confirm your spot!</span>
              </div>
            </div>
          ) : status === "error" ? (
            <div className="error-message">
              <span>Something went wrong. Please try again.</span>
            </div>
          ) : (
            <>
              <form className="waitlist-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Enter your email"
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
              <div className="waitlist-microcopy">
                <p className="waitlist-microcopy-text">
                  We’ll only email you about early access.
                </p>
              </div>
            </>
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
              Join <strong>500+</strong> businesses already on the waitlist
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Waitlist;
