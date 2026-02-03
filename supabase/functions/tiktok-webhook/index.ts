import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// TikTok webhook secret for signature verification
const WEBHOOK_SECRET = Deno.env.get("TIKTOK_WEBHOOK_SECRET") || "";

serve(async (req) => {
  const url = new URL(req.url);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // ============================================
  // WEBHOOK VERIFICATION (GET request from TikTok)
  // ============================================
  if (req.method === "GET") {
    // TikTok sends a challenge for webhook verification
    const challenge = url.searchParams.get("challenge");
    
    if (challenge) {
      console.log("TikTok webhook verification challenge:", challenge);
      return new Response(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new Response("OK", { status: 200 });
  }

  // ============================================
  // WEBHOOK EVENTS (POST requests from TikTok)
  // ============================================
  if (req.method === "POST") {
    try {
      const body = await req.text();
      const signature = req.headers.get("x-tiktok-signature") || "";

      // Verify webhook signature (if secret is configured)
      if (WEBHOOK_SECRET && signature) {
        const isValid = await verifySignature(body, signature, WEBHOOK_SECRET);
        if (!isValid) {
          console.error("Invalid webhook signature");
          return new Response("Invalid signature", { status: 401 });
        }
      }

      const payload = JSON.parse(body);
      console.log("Received TikTok webhook:", JSON.stringify(payload, null, 2));

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Log the webhook
      await supabase.from("webhook_logs").insert({
        platform: "tiktok",
        body: payload,
      });

      // Process the event based on type
      const eventType = payload.event;
      
      switch (eventType) {
        case "receive_message":
          await processIncomingMessage(supabase, payload);
          break;
        
        case "send_message_result":
          console.log("Message send result:", payload);
          break;

        default:
          console.log("Unhandled event type:", eventType);
      }

      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error processing TikTok webhook:", error);
      return new Response(
        JSON.stringify({ status: "error", message: error.message }),
        {
          status: 200, // Return 200 to prevent retries
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  }

  return new Response("Method not allowed", { status: 405 });
});

/**
 * Verify TikTok webhook signature
 */
async function verifySignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const sig = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(body)
    );

    const expectedSignature = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return signature === expectedSignature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

/**
 * Process incoming TikTok DM
 */
async function processIncomingMessage(supabase: any, payload: any) {
  console.log("Processing incoming TikTok message...");

  const content = payload.content || {};
  const senderId = content.from_user_id || payload.from_user_id;
  const recipientId = content.to_user_id || payload.to_user_id;
  const messageId = content.msg_id || payload.msg_id;
  const messageText = content.text || "";
  const timestamp = content.create_time || Date.now();

  if (!senderId || !recipientId) {
    console.log("Missing sender or recipient ID");
    return;
  }

  // Store the incoming message
  const { error: msgError } = await supabase.from("tiktok_messages").insert({
    message_id: messageId,
    sender_id: senderId,
    recipient_id: recipientId,
    message_text: messageText,
    message_type: content.msg_type || "text",
    direction: "inbound",
    processed: false,
    timestamp: new Date(Number(timestamp) * 1000).toISOString(),
  });

  if (msgError) {
    console.error("Error storing TikTok message:", msgError);
  } else {
    console.log("TikTok message stored successfully");
  }

  // Find the TikTok account owner
  console.log("[DEBUG] Looking up TikTok account for:", recipientId);
  const { data: account, error: accountError } = await supabase
    .from("tiktok_accounts")
    .select("user_id, access_token")
    .eq("tiktok_user_id", recipientId)
    .single();

  if (accountError || !account) {
    console.log("No TikTok account found for:", recipientId);
    return;
  }

  console.log("[DEBUG] Found account, user_id:", account.user_id);

  // Get user email for automation lookup
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.admin.getUserById(account.user_id);

  if (userError || !user?.email) {
    console.error("Could not fetch user email:", userError);
    return;
  }

  const userEmail = user.email;
  console.log("[DEBUG] User email:", userEmail);

  // Find TikTok automations for this user
  const { data: workflows, error: workflowError } = await supabase
    .from("automations")
    .select("*")
    .eq("user_email", userEmail)
    .eq("platform", "tiktok");

  if (workflowError) {
    console.error("Error fetching automations:", workflowError);
    return;
  }

  if (!workflows || workflows.length === 0) {
    console.log("No TikTok automations found for user");
    return;
  }

  // Filter active automations
  const activeWorkflows = workflows.filter(
    (w: any) => w.is_active === true || w.is_active === "true"
  );

  if (activeWorkflows.length === 0) {
    console.log("No active TikTok automations");
    return;
  }

  console.log(`Checking ${activeWorkflows.length} active TikTok automations...`);

  // Check triggers and execute actions
  for (const workflow of activeWorkflows) {
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || [];
    const triggerNode = nodes.find(
      (n: any) => n.nodeType === "keyword_match" || n.nodeType === "any_message"
    );

    if (!triggerNode) continue;

    let shouldRun = false;

    if (triggerNode.nodeType === "any_message") {
      shouldRun = true;
    } else if (triggerNode.nodeType === "keyword_match") {
      const keywords = (triggerNode.config?.keywords || "")
        .split(",")
        .map((k: string) => k.trim().toLowerCase());
      const msgText = (messageText || "").toLowerCase();

      if (keywords.some((k: string) => k && msgText.includes(k))) {
        shouldRun = true;
      }
    }

    if (shouldRun) {
      console.log(`Trigger matched: ${workflow.name}`);

      // Find the action node
      const connection = connections.find((c: any) => c.from === triggerNode.id);
      if (connection) {
        const nextNode = nodes.find((n: any) => n.id === connection.to);

        if (nextNode?.nodeType === "send_reply") {
          const replyText = nextNode.config?.message;
          if (replyText) {
            // Send reply via TikTok API
            const result = await sendTikTokReply(
              account.access_token,
              senderId,
              replyText
            );

            // Log the execution
            await supabase.from("activity_log").insert({
              user_id: account.user_id,
              action_type: result.success ? "automation_run" : "automation_error",
              description: result.success
                ? `Auto-replied to TikTok message via ${workflow.name}`
                : `Failed to send TikTok reply: ${result.error}`,
              metadata: {
                platform: "tiktok",
                workflow_id: workflow.id,
                workflow_name: workflow.name,
                contact_id: senderId,
                status: result.success ? "success" : "failed",
              },
            });

            if (result.success) {
              // Mark message as processed
              await supabase
                .from("tiktok_messages")
                .update({ processed: true, auto_replied: true })
                .eq("message_id", messageId);
            }
          }
        }
      }

      // Stop after first matching workflow
      break;
    }
  }
}

/**
 * Send a reply via TikTok DM API
 */
async function sendTikTokReply(
  accessToken: string,
  recipientId: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      "https://open.tiktokapis.com/v2/dm/message/send/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to_user_id: recipientId,
          msg_type: "text",
          text: text,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("TikTok send message error:", data);
      return { success: false, error: JSON.stringify(data) };
    }

    console.log("TikTok reply sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending TikTok reply:", error);
    return { success: false, error: error.message };
  }
}
