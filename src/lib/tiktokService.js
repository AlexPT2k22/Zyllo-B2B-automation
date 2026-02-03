import { supabase } from "@/lib/supabase";

const TIKTOK_CLIENT_KEY = import.meta.env.VITE_TIKTOK_CLIENT_KEY || "";
const REDIRECT_URI =
  "https://nfapcfclofdycraqyipe.supabase.co/functions/v1/tiktok-auth-callback";

// TikTok OAuth scopes for Zyllo automation features
// - user.info.basic: Get basic profile info (username, avatar)
// - dm.read: Read incoming direct messages
// - dm.write: Send direct messages (for auto-replies)
const SCOPES = "user.info.basic,dm.read,dm.write";

export const tiktokService = {
  /**
   * Get the TikTok OAuth URL
   */
  getAuthUrl: async () => {
    // Get current user ID to pass as state (for security)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Must be logged in to connect TikTok");
    }

    // Generate a random code_verifier for PKCE (TikTok requires this)
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store code_verifier in localStorage for the callback
    localStorage.setItem("tiktok_code_verifier", codeVerifier);

    // Build TikTok OAuth URL
    // Documentation: https://developers.tiktok.com/doc/login-kit-web
    const params = new URLSearchParams({
      client_key: TIKTOK_CLIENT_KEY,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: SCOPES,
      state: user.id, // Pass user ID to link account on callback
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    return `https://www.tiktok.com/v2/auth/authorize?${params.toString()}`;
  },

  /**
   * Check connection status for current user
   */
  checkConnection: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return { connected: false };

      const { data, error } = await supabase
        .from("tiktok_accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) return { connected: false };

      return {
        connected: true,
        account: data,
      };
    } catch (error) {
      console.error("Error checking TikTok connection:", error);
      return { connected: false };
    }
  },

  /**
   * Disconnect TikTok account
   */
  disconnect: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from("tiktok_accounts")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Error disconnecting TikTok:", error);
      return { success: false, error: error.message };
    }
  },
};

/**
 * Generate a random code verifier for PKCE
 * TikTok requires PKCE for OAuth
 */
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

/**
 * Generate code challenge from verifier (SHA-256 hash)
 */
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(new Uint8Array(digest));
}

/**
 * Base64 URL encode (required for PKCE)
 */
function base64URLEncode(buffer) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
