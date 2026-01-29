import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const INSTAGRAM_APP_ID = Deno.env.get("INSTAGRAM_APP_ID")!;
const INSTAGRAM_APP_SECRET = Deno.env.get("INSTAGRAM_APP_SECRET")!;
const REDIRECT_URI = "https://zyllo.tech/auth/instagram/callback";
const FRONTEND_SUCCESS_URL = "https://zyllo.tech/dashboard?connected=instagram";
const FRONTEND_ERROR_URL = "https://zyllo.tech/dashboard?error=instagram_auth_failed";

serve(async (req) => {
  const url = new URL(req.url);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the authorization code from the callback
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const errorReason = url.searchParams.get("error_reason");

    // Handle error from Instagram
    if (error) {
      console.error("Instagram auth error:", error, errorReason);
      return Response.redirect(
        `${FRONTEND_ERROR_URL}&reason=${encodeURIComponent(errorReason || error)}`,
        302
      );
    }

    if (!code) {
      console.error("No authorization code received");
      return Response.redirect(`${FRONTEND_ERROR_URL}&reason=no_code`, 302);
    }

    console.log("Received authorization code, exchanging for access token...");

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: INSTAGRAM_APP_ID,
          client_secret: INSTAGRAM_APP_SECRET,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI,
          code: code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return Response.redirect(`${FRONTEND_ERROR_URL}&reason=token_exchange_failed`, 302);
    }

    const tokenData = await tokenResponse.json();
    console.log("Short-lived token received");

    // Exchange short-lived token for long-lived token
    const longLivedResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${INSTAGRAM_APP_SECRET}&access_token=${tokenData.access_token}`,
      { method: "GET" }
    );

    if (!longLivedResponse.ok) {
      const errorText = await longLivedResponse.text();
      console.error("Long-lived token exchange failed:", errorText);
      // Continue with short-lived token if long-lived fails
    }

    const longLivedData = longLivedResponse.ok
      ? await longLivedResponse.json()
      : null;

    const accessToken = longLivedData?.access_token || tokenData.access_token;
    const expiresIn = longLivedData?.expires_in || 3600; // 1 hour for short-lived
    const userId = tokenData.user_id;

    console.log("Access token obtained, fetching user profile...");

    // Fetch Instagram user profile
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
    );

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error("Profile fetch failed:", errorText);
      return Response.redirect(`${FRONTEND_ERROR_URL}&reason=profile_fetch_failed`, 302);
    }

    const profileData = await profileResponse.json();
    console.log("Profile fetched:", profileData.username);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate token expiry
    const tokenExpiry = new Date();
    tokenExpiry.setSeconds(tokenExpiry.getSeconds() + expiresIn);

    // Store or update the Instagram account in database
    const { data: existingAccount, error: fetchError } = await supabase
      .from("instagram_accounts")
      .select("*")
      .eq("instagram_user_id", userId)
      .single();

    if (existingAccount) {
      // Update existing account
      const { error: updateError } = await supabase
        .from("instagram_accounts")
        .update({
          username: profileData.username,
          access_token: accessToken,
          token_expires_at: tokenExpiry.toISOString(),
          account_type: profileData.account_type,
          media_count: profileData.media_count,
          updated_at: new Date().toISOString(),
        })
        .eq("instagram_user_id", userId);

      if (updateError) {
        console.error("Error updating account:", updateError);
        return Response.redirect(`${FRONTEND_ERROR_URL}&reason=db_error`, 302);
      }
      console.log("Instagram account updated successfully");
    } else {
      // Create new account
      const { error: insertError } = await supabase
        .from("instagram_accounts")
        .insert({
          instagram_user_id: userId,
          username: profileData.username,
          access_token: accessToken,
          token_expires_at: tokenExpiry.toISOString(),
          account_type: profileData.account_type,
          media_count: profileData.media_count,
        });

      if (insertError) {
        console.error("Error inserting account:", insertError);
        return Response.redirect(`${FRONTEND_ERROR_URL}&reason=db_error`, 302);
      }
      console.log("Instagram account created successfully");
    }

    // Redirect to success page
    return Response.redirect(
      `${FRONTEND_SUCCESS_URL}&username=${encodeURIComponent(profileData.username)}`,
      302
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return Response.redirect(
      `${FRONTEND_ERROR_URL}&reason=${encodeURIComponent(error.message)}`,
      302
    );
  }
});
