import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// TikTok OAuth credentials (from environment)
const TIKTOK_CLIENT_KEY = Deno.env.get("TIKTOK_CLIENT_KEY")!;
const TIKTOK_CLIENT_SECRET = Deno.env.get("TIKTOK_CLIENT_SECRET")!;
const REDIRECT_URI =
  "https://nfapcfclofdycraqyipe.supabase.co/functions/v1/tiktok-auth-callback";
const APP_URL = Deno.env.get("APP_URL") || "https://zyllo.vercel.app";

serve(async (req) => {
  const url = new URL(req.url);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the authorization code and state from TikTok
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state"); // This is the user_id we passed
    const error = url.searchParams.get("error");
    const errorDescription = url.searchParams.get("error_description");

    // Handle errors from TikTok
    if (error) {
      console.error("TikTok OAuth error:", error, errorDescription);
      return Response.redirect(
        `${APP_URL}/dashboard/settings?error=${encodeURIComponent(
          errorDescription || error
        )}`
      );
    }

    if (!code || !state) {
      console.error("Missing code or state parameter");
      return Response.redirect(
        `${APP_URL}/dashboard/settings?error=missing_params`
      );
    }

    console.log("Received TikTok callback with code, state:", state);

    // Exchange the code for access token
    // TikTok requires sending code_verifier for PKCE (we'll get it from the request body)
    // For now, we'll use the server-side flow without PKCE since Edge Functions handle this
    const tokenResponse = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_key: TIKTOK_CLIENT_KEY,
          client_secret: TIKTOK_CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI,
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    console.log("Token response:", JSON.stringify(tokenData, null, 2));

    if (tokenData.error || !tokenData.access_token) {
      console.error("Failed to get access token:", tokenData);
      return Response.redirect(
        `${APP_URL}/dashboard/settings?error=token_exchange_failed`
      );
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in; // seconds
    const openId = tokenData.open_id; // TikTok user ID
    const scopes = tokenData.scope?.split(",") || [];

    // Get user profile from TikTok
    const profileResponse = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const profileData = await profileResponse.json();
    console.log("Profile response:", JSON.stringify(profileData, null, 2));

    const userData = profileData.data?.user || {};
    const username = userData.username || userData.display_name || openId;
    const displayName = userData.display_name || username;
    const avatarUrl = userData.avatar_url || "";

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate token expiration time
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // Upsert the TikTok account (update if exists, insert if new)
    const { error: upsertError } = await supabase
      .from("tiktok_accounts")
      .upsert(
        {
          user_id: state, // The Zyllo user ID passed via state
          tiktok_user_id: openId,
          username: username,
          display_name: displayName,
          avatar_url: avatarUrl,
          access_token: accessToken,
          refresh_token: refreshToken,
          token_expires_at: tokenExpiresAt,
          scopes: scopes,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "tiktok_user_id",
        }
      );

    if (upsertError) {
      console.error("Failed to save TikTok account:", upsertError);
      return Response.redirect(
        `${APP_URL}/dashboard/settings?error=save_failed`
      );
    }

    console.log("Successfully connected TikTok account:", username);

    // Redirect back to settings with success
    return Response.redirect(
      `${APP_URL}/dashboard/settings?tiktok_connected=true`
    );
  } catch (error) {
    console.error("TikTok callback error:", error);
    return Response.redirect(
      `${APP_URL}/dashboard/settings?error=callback_error`
    );
  }
});
