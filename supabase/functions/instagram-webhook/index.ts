import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Your verify token - CHANGE THIS to something secure!
const VERIFY_TOKEN = Deno.env.get("INSTAGRAM_VERIFY_TOKEN") || "zyllo_webhook_verify_2024";

serve(async (req) => {
  const url = new URL(req.url);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // ============================================
  // WEBHOOK VERIFICATION (GET request from Meta)
  // ============================================
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    console.log("Webhook verification request:", { mode, token, challenge });

    // Check if this is a subscription verification request
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified successfully!");
      // Return the challenge to confirm the webhook
      return new Response(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    } else {
      console.error("Webhook verification failed. Token mismatch.");
      return new Response("Verification failed", { status: 403 });
    }
  }

  // ============================================
  // WEBHOOK EVENTS (POST requests from Instagram)
  // ============================================
  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log("Received webhook event:", JSON.stringify(body, null, 2));

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Process the webhook event
      if (body.object === "instagram") {
        for (const entry of body.entry || []) {
          // Handle messaging events
          if (entry.messaging) {
            for (const event of entry.messaging) {
              await processMessagingEvent(supabase, event);
            }
          }

          // Handle changes (comments, mentions, etc.)
          if (entry.changes) {
            for (const change of entry.changes) {
              await processChangeEvent(supabase, change);
            }
          }
        }
      }

      // Always respond with 200 OK to acknowledge receipt
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error processing webhook:", error);
      // Still return 200 to prevent Meta from retrying
      return new Response(JSON.stringify({ status: "error", message: error.message }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});

// Process direct message events
async function processMessagingEvent(supabase: any, event: any) {
  console.log("Processing messaging event:", event);

  const senderId = event.sender?.id;
  const recipientId = event.recipient?.id;
  const timestamp = event.timestamp;
  const message = event.message;

  if (!message) {
    console.log("No message in event, skipping");
    return;
  }

  // Store the incoming message
  const { error } = await supabase.from("instagram_messages").insert({
    sender_id: senderId,
    recipient_id: recipientId,
    message_id: message.mid,
    message_text: message.text,
    timestamp: new Date(timestamp).toISOString(),
    direction: "inbound",
    processed: false,
  });

  if (error) {
    console.error("Error storing message:", error);
  } else {
    console.log("Message stored successfully");
  }

  // TODO: Check automation rules and send auto-reply if matching
  // This will be implemented in a separate function
}

// Process change events (comments, mentions, etc.)
async function processChangeEvent(supabase: any, change: any) {
  console.log("Processing change event:", change);

  const field = change.field;
  const value = change.value;

  // Handle different types of changes
  switch (field) {
    case "comments":
      console.log("New comment received:", value);
      // TODO: Process comment and check automation rules
      break;

    case "mentions":
      console.log("New mention received:", value);
      // TODO: Process mention
      break;

    case "story_insights":
      console.log("Story insights received:", value);
      break;

    default:
      console.log(`Unhandled change field: ${field}`);
  }
}
