import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate confirmation token
    const token = crypto.randomUUID();

    // Insert into waitlist
    const { error: insertError } = await supabase.from("waitlist").insert({
      email,
      token,
      confirmed: false,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        // Email already exists
        return new Response(
          JSON.stringify({ message: "Email already registered" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw insertError;
    }

    // Send confirmation email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    
    // Detect origin from request headers (works for both localhost and production)
    const origin = req.headers.get("origin") || Deno.env.get("SITE_URL") || "https://www.zyllo.tech";
    const confirmUrl = `${origin}/confirm?token=${token}`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Zyllo <noreply@alexandrefernandes.dev>",
        to: email,
        subject: "Confirm your Zyllo waitlist spot ✨",
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background: #fff;">
          <tr>
            <td style="padding: 48px 40px; text-align: center;">
              <!-- Logo -->
              <div style="margin-bottom: 22px;">
                <img src="https://www.zyllo.tech/Zolly%20Logo.png" alt="Zyllo" width="100" style="display: block; margin: 0 auto;">
              </div>
              
              <!-- Title -->
              <h1 style="color: #0a0a0f; font-size: 28px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.3;">
                You're almost in! 🎉
              </h1>
              
              <!-- Description -->
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                Thanks for joining the Zyllo waitlist. Click below to confirm your email and secure your early access spot.
              </p>
              
              <!-- CTA Button -->
              <a href="${confirmUrl}" style="display: inline-block; background: rgb(168, 85, 247); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600;">
                Confirm email
              </a>
              <!-- Divider -->
              <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 40px 0;"></div>
              
              <!-- Footer -->
              <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 0;">
                If you didn't sign up for Zyllo, you can ignore this email.
              </p>
              <p style="color: #444444; font-size: 12px; margin: 16px 0 0 0;">
                © 2026 Zyllo. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.text();
      console.error("Resend error:", emailError);
      throw new Error("Failed to send confirmation email");
    }

    return new Response(
      JSON.stringify({ message: "Confirmation email sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
