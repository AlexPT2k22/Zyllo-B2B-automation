import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import "./DashboardLogin.css";

function DashboardLogin() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="flex flex-col items-center justify-center">
              <img src="/Zolly Logo.png" alt="Zyllo" className="login-logo" />
              <h1 className="login-title">Welcome to Zyllo</h1>
              <p className="login-subtitle">
                Enter your email to access the dashboard
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="login-input"
                required
                disabled={isLoading}
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="button-spinner" size={20} />
                  Verifying...
                </>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>

          <div className="login-footer">
            <Link to="/" className="back-link">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>

        <p className="login-note">
          Only approved beta users can access the dashboard.
          <br />
          <Link to="/waitlist" className="waitlist-link">
            Join the waitlist
          </Link>
        </p>
      </div>
    </div>
  );
}

export default DashboardLogin;
