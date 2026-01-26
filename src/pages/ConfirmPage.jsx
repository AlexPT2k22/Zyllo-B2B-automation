import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, X, Loader2 } from "lucide-react";
import "./ConfirmPage.css";

const ConfirmPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasRun.current) return;
    hasRun.current = true;

    const confirmEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid confirmation link.");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/waitlist-confirm?token=${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
        } else {
          setStatus("error");
          setMessage(data.error || "Confirmation failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    confirmEmail();
  }, [searchParams]);

  return (
    <section className="confirm-section">
      <div className="confirm-container">
        <div className="confirm-card">
          {status === "loading" && (
            <>
              <Loader2 className="confirm-icon loading" size={48} />
              <h1>Confirming your email...</h1>
            </>
          )}

          {status === "success" && (
            <>
              <div className="confirm-icon-wrapper success">
                <Check size={32} />
              </div>
              <h1>You're confirmed!</h1>
              <p className="confirm-subtitle">
                We'll notify you when Zyllo launches.
              </p>
              <Link to="/" className="confirm-btn">
                Back to Home
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="confirm-icon-wrapper error">
                <X size={32} />
              </div>
              <h1>Confirmation failed</h1>
              <p>{message}</p>
              <Link to="/" className="confirm-btn">
                Back to Home
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ConfirmPage;
