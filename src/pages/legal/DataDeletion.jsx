import React, { useState } from "react";
import { Check } from "lucide-react";
import "./LegalPage.css";

const DataDeletion = () => {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate API call - replace with actual implementation
    try {
      // TODO: Implement actual data deletion request endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1 className="legal-title">Data Deletion Request</h1>
          <p className="legal-updated">GDPR & Privacy Compliance</p>
        </header>

        <div className="legal-content">
          <h2>Your Right to Erasure</h2>
          <p>
            Under the General Data Protection Regulation (GDPR) and other
            applicable privacy laws, you have the right to request the deletion
            of your personal data from our systems.
          </p>

          <h2>What Gets Deleted</h2>
          <p>
            When you submit a data deletion request, we will permanently remove:
          </p>
          <ul>
            <li>Your account information (email, name, company details)</li>
            <li>Connected social media account tokens and data</li>
            <li>Automation rules and response templates you created</li>
            <li>Message history and conversation logs</li>
            <li>Analytics and usage data associated with your account</li>
          </ul>

          <h2>What We May Retain</h2>
          <p>
            We may retain certain information as required by law or for
            legitimate business purposes:
          </p>
          <ul>
            <li>
              Transaction records for tax and accounting purposes (up to 7
              years)
            </li>
            <li>Limited data necessary to prevent fraud or abuse</li>
            <li>Anonymized, aggregated data that cannot identify you</li>
          </ul>

          <h2>Processing Time</h2>
          <p>
            We will process your deletion request within{" "}
            <strong>30 days</strong> of receiving it. You will receive a
            confirmation email once the deletion is complete.
          </p>

          <h2>Submit Your Request</h2>
          <p>
            To request deletion of your personal data, please fill out the form
            below. Use the email address associated with your Zyllo account.
          </p>

          {status === "success" ? (
            <div className="deletion-form">
              <div className="form-success">
                <div className="success-icon">
                  <Check size={28} color="#ffffff" />
                </div>
                <h3>Request Submitted Successfully</h3>
                <p>
                  We've received your data deletion request. You'll receive a
                  confirmation email within 30 days once the process is
                  complete.
                </p>
              </div>
            </div>
          ) : (
            <form className="deletion-form" onSubmit={handleSubmit}>
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                placeholder="Enter the email associated with your account"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
              />

              <label htmlFor="reason">Reason for Deletion (Optional)</label>
              <textarea
                id="reason"
                placeholder="Let us know why you're leaving (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={status === "loading"}
              />

              <button type="submit" disabled={status === "loading"}>
                {status === "loading"
                  ? "Processing..."
                  : "Submit Deletion Request"}
              </button>

              {status === "error" && (
                <p
                  style={{
                    color: "#ef4444",
                    textAlign: "center",
                    marginTop: "16px",
                  }}
                >
                  Something went wrong. Please try again or contact us at
                  privacy@zyllo.tech
                </p>
              )}
            </form>
          )}

          <h2>Alternative Methods</h2>
          <p>You can also request data deletion by:</p>
          <ul>
            <li>
              Emailing us directly at{" "}
              <a href="mailto:privacy@zyllo.tech">privacy@zyllo.tech</a>
            </li>
            <li>
              Deleting your account from within the app settings (if you have an
              active account)
            </li>
          </ul>

          <div className="highlight-box">
            <p>
              <strong>Note:</strong> If you only want to disconnect your social
              media accounts without deleting your entire Zyllo account, you can
              do so from your account settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDeletion;
