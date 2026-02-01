import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2, Mail, ArrowLeft, ChevronRight } from "lucide-react";
import DarkVeil from "@/assets/DarkVeil";
import { Button } from "@/components/ui/button";

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
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0f] flex items-center justify-center">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <DarkVeil
          hueShift={348}
        noiseIntensity={0}
        scanlineIntensity={0}
        speed={0.3}
          scanlineFrequency={0.5}
        warpAmount={0}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full max-w-md px-10">
        <div>
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-block mb-6 transition-transform hover:scale-105 active:scale-95"
            >
              <div className="w-30 h-30 flex items-center justify-center">
                <img
                  src="/Zolly Logo.png"
                  alt="Zyllo"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground/80">
              Enter your email to access your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-medium text-white/70 uppercase tracking-wider ml-1"
              >
                Email Address
              </label>
              <div className="relative group/input">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within/input:text-purple-400 transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all hover:bg-white/10 hover:border-white/20"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-purple-500 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 border-0 hover:bg-purple-600"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <span className="flex items-center justify-center">
                  Continue to Dashboard
                  <ChevronRight className="w-4 h-4 ml-1 opacity-70" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4 text-center">
            <Link
              to="/"
              className="text-xs text-muted-foreground/60 hover:text-white transition-colors flex items-center gap-1.5 group/back"
            >
              <ArrowLeft className="w-3 h-3 group-hover/back:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-6 text-xs text-white/30">
          Not a customer yet?{" "}
          <Link
            to="/waitlist"
            className="text-purple-400 hover:text-purple-300 underline underline-offset-4 decoration-purple-500/30 hover:decoration-purple-500/50 transition-all"
          >
            Join the waitlist
          </Link>
        </p>
      </div>
    </div>
  );
}

export default DashboardLogin;
