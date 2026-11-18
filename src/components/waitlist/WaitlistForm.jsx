import { useId, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { track } from "@vercel/analytics";
import { WAITLIST_PROOF } from "@/seo/config";
import "./WaitlistForm.css";

/**
 * Email capture form used across the site.
 * `source` identifies the page/placement (e.g. "home-hero", "lp-instagram")
 * and is sent to Vercel Analytics so you can compare conversion per page.
 */
const WaitlistForm = ({
  source = "unknown",
  buttonLabel = "Get early access",
  showProof = true,
  align = "center",
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const inputId = useId();

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
          body: JSON.stringify({ email, source }),
        },
      );

      if (response.ok) {
        setStatus("success");
        setEmail("");
        track("waitlist_signup", { source });
      } else {
        console.error("Signup error:", await response.json().catch(() => ({})));
        setStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`wf wf--${align}`}>
        <div className="wf-success" role="status">
          <Check size={20} aria-hidden="true" />
          <span>You're on the list! Check your inbox to confirm your spot.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`wf wf--${align}`}>
      <form className="wf-form" onSubmit={handleSubmit} noValidate={false}>
        <label htmlFor={inputId} className="sr-only">
          Work email
        </label>
        <input
          id={inputId}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck="false"
          placeholder="you@yourshop.com"
          className="wf-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
        />
        <button type="submit" className="wf-btn" disabled={status === "loading"}>
          {status === "loading" ? (
            <Loader2 className="wf-spin" size={20} aria-label="Submitting" />
          ) : (
            buttonLabel
          )}
        </button>
      </form>

      {status === "error" ? (
        <p className="wf-error" role="alert">
          Something went wrong. Please try again.
        </p>
      ) : (
        <p className="wf-micro">Free · No credit card · Unsubscribe anytime</p>
      )}

      {showProof && (
        <p className="wf-proof">
          <span className="wf-proof-dot" aria-hidden="true" />
          <span>
            Join <strong>{WAITLIST_PROOF.count}</strong> {WAITLIST_PROOF.label}
          </span>
        </p>
      )}
    </div>
  );
};

export default WaitlistForm;
