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

  // 1. Find the Instagram account owner
  const { data: account } = await supabase
    .from("instagram_accounts")
    .select("user_id, access_token")
    .eq("instagram_user_id", recipientId) // recipient is the business account
    .single();

  if (!account) {
    console.log("No linked Instagram account found for recipient:", recipientId);
    return;
  }

  // 2. Fetch active automations for this user
  const { data: workflows } = await supabase
    .from("automations")
    .select("*")
    .eq("user_id", account.user_id)
    .eq("isActive", true);

  if (!workflows || workflows.length === 0) {
    console.log("No active automations for user");
    return;
  }

  console.log(`Checking ${workflows.length} active automations...`);

  // 3. Check triggers
  for (const workflow of workflows) {
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || [];
    const triggerNode = nodes.find((n: any) => n.nodeType === "keyword_match" || n.nodeType === "any_message");

    if (!triggerNode) continue;

    let shouldRun = false;

    // Check Trigger Condition
    if (triggerNode.nodeType === "any_message") {
      shouldRun = true;
    } else if (triggerNode.nodeType === "keyword_match") {
        const keywords = (triggerNode.config?.keywords || "").split(",").map((k: string) => k.trim().toLowerCase());
        const msgText = (message.text || "").toLowerCase();
        // Simple "contains" match
        if (keywords.some((k: string) => k && msgText.includes(k))) {
            shouldRun = true;
        }
    }

    if (shouldRun) {
        console.log(`Trigger matched: ${workflow.name}`);
        
        // Find next node (Action)
        // Simplification: Assumes 1 connection from trigger
        const connection = connections.find((c: any) => c.from === triggerNode.id);
        if (connection) {
            const nextNode = nodes.find((n: any) => n.id === connection.to);
            
            if (nextNode && nextNode.nodeType === "send_reply") {
                const replyText = nextNode.config?.message;
                if (replyText) {
                    // Send Reply
                    await sendReply(account.access_token, senderId, replyText);
                    
                    // Log execution
                    await supabase.from("activity_log").insert({
                        user_id: account.user_id,
                        action_type: "automation_run",
                        description: `Auto-replied to message via ${workflow.name}`,
                        metadata: {
                            workflow_id: workflow.id,
                            workflow_name: workflow.name,
                            contact_id: senderId,
                            status: "success"
                        }
                    });
                }
            }
        }
        
        // Stop after first matching workflow (optional rule)
        break; 
    }
  }
}

async function sendReply(accessToken: string, recipientId: string, text: string) {
    try {
        const url = `https://graph.instagram.com/v18.0/me/messages?access_token=${accessToken}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                recipient: { id: recipientId },
                message: { text: text }
            })
        });
        
        if (!response.ok) {
            const err = await response.text();
            console.error("Failed to send reply:", err);
        } else {
            console.log("Reply sent successfully");
        }
    } catch (e) {
        console.error("Error sending reply:", e);
    }
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
