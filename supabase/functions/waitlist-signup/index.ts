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
        subject: "Confirm your Zyllo waitlist spot",
        html: `
          <h2>Welcome to Zyllo!</h2>
          <p>Thanks for joining our waitlist. Please confirm your email to secure your spot:</p>
          <a href="${confirmUrl}" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px;">
            Confirm Email
          </a>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            If you didn't sign up for Zyllo, you can ignore this email.
          </p>
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
