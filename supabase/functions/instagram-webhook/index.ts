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

      // DEBUG: Log raw event to verify receipt
      try {
          await supabase.from("webhook_logs").insert({ body: body });
      } catch (logErr) {
          console.error("Failed to log raw webhook:", logErr);
      }

      // Process the webhook event
      if (body.object === "instagram") {
        for (const entry of body.entry || []) {
          // Handle messaging events
          if (entry.messaging) {
            for (const event of entry.messaging) {
              await processMessagingEvent(supabase, event);
            }
          }

          // Handle standby events (when app is not primary receiver)
          if (entry.standby) {
            console.log("Received standby event");
             for (const event of entry.standby) {
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
  // Note: Meta sends timestamp as a string in seconds, we need to convert to ms
  const timestampMs = typeof timestamp === 'string' ? parseInt(timestamp, 10) * 1000 : timestamp;
  const { error } = await supabase.from("instagram_messages").insert({
    sender_id: senderId,
    recipient_id: recipientId,
    message_id: message.mid,
    message_text: message.text,
    timestamp: new Date(timestampMs).toISOString(),
    direction: "inbound",
    processed: false,
  });

  if (error) {
    console.error("Error storing message:", error);
  } else {
    console.log("Message stored successfully");
  }

  // 1. Find the Instagram account owner
  console.log("[DEBUG] Step 1: Looking up Instagram account for recipientId:", recipientId);
  const { data: account, error: accountError } = await supabase
    .from("instagram_accounts")
    .select("user_id, access_token")
    .eq("instagram_user_id", recipientId)
    .single();

  if (accountError) {
    console.error("[DEBUG] Error finding account:", accountError);
  }

  if (!account) {
    console.log("[DEBUG] No linked Instagram account found for recipient:", recipientId);
    return;
  }
  console.log("[DEBUG] Found account, user_id:", account.user_id);

  // 1.5 Get User Email (because automations table might use email instead of user_id)
  const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(account.user_id);
  
  if (userError || !user || !user.email) {
      console.error("Could not fetch user email for ID:", account.user_id);
       await supabase.from("activity_log").insert({
        user_id: account.user_id,
        action_type: "automation_error",
        description: "Failed to resolve user email from account ID",
        metadata: { sender_id: senderId, internal_error: userError }
    });
    return;
  }

  const userEmail = user.email;
  console.log(`Resolved User Email: ${userEmail}`);

  // 2. Fetch active automations via Email OR User ID (Try both to be safe)
  // We use .or() to match either user_id OR user_email if columns exist
  // But strictly speaking, we suspect it's user_email.
  // Let's try fetching all rows for this email.
  console.log("[DEBUG] Step 3: Searching automations for email:", userEmail);
  const { data: workflows, error: workflowError } = await supabase
    .from("automations")
    .select("*")
    .eq("user_email", userEmail);

  if (workflowError) {
      console.error("[DEBUG] Error searching automations:", workflowError);
  }
  console.log("[DEBUG] Found workflows:", workflows?.length || 0);

  if (!workflows || workflows.length === 0) {
    console.log("No automations found for user (active or inactive)");
    // Log warning
    await supabase.from("activity_log").insert({
        user_id: account.user_id,
        action_type: "system_warning",
        description: "Received message but USER HAS NO AUTOMATIONS at all",
        metadata: { sender_id: senderId }
    });
    return;
  }

  // Filter active ones manually and log
  console.log("[DEBUG] Step 4: Filtering active workflows. Raw data:", workflows.map((w: any) => ({ name: w.name, is_active: w.is_active, type: typeof w.is_active })));
  const activeWorkflows = workflows.filter((w: any) => {
      // Check for any truthy value
      const active = w.is_active;
      return active === true || active === 1 || active === "true" || active === "TRUE" || active === "1";
  });
  console.log("[DEBUG] Active workflows after filter:", activeWorkflows.length);
  
  if (activeWorkflows.length === 0) {
      console.log(`Found ${workflows.length} automations but NONE are active.`);
       await supabase.from("activity_log").insert({
        user_id: account.user_id,
        action_type: "system_warning",
        description: `Found ${workflows.length} automations but NONE are active`,
        metadata: { 
            sender_id: senderId,
            statuses: workflows.map((w: any) => ({ 
                name: w.name, 
                isActive: w.isActive, 
                is_active: w.is_active 
            }))
        }
    });
    return;
  }

  const workflowsToRun = activeWorkflows;

  if (!workflowsToRun || workflowsToRun.length === 0) {
     return;
  }

  console.log(`Checking ${workflowsToRun.length} active automations...`);

  // 3. Check triggers
  for (const workflow of workflowsToRun) {
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
        const connection = connections.find((c: any) => c.from === triggerNode.id);
        if (connection) {
            const nextNode = nodes.find((n: any) => n.id === connection.to);
            
            if (nextNode && nextNode.nodeType === "send_reply") {
                const replyText = nextNode.config?.message;
                if (replyText) {
                    // Send Reply
                    const result = await sendReply(account.access_token, senderId, replyText);
                    
                    if (result.success) {
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
                        // Mark message as processed
                        await supabase.from("instagram_messages")
                            .update({ processed: true })
                            .eq("message_id", message.mid);
                    } else {
                         // Log failure
                         await supabase.from("activity_log").insert({
                            user_id: account.user_id,
                            action_type: "automation_error",
                            description: `Failed to send reply for ${workflow.name}`,
                            metadata: {
                                workflow_id: workflow.id,
                                contact_id: senderId,
                                status: "failed_api_call",
                                error_details: result.error
                            }
                        });
                    }
                }
            }
        }
        
        // Stop after first matching workflow
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
            return { success: false, error: err };
        } else {
            console.log("Reply sent successfully");
            return { success: true };
        }
    } catch (e) {
        console.error("Error sending reply:", e);
        return { success: false, error: e.message };
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
    
    case "messages":
      console.log("Received 'messages' event via 'changes' listener. Forwarding...");
      // The structure in 'changes' for messages might be slightly different or just contain the same event object
      // The log showed: value: { sender: { id: "..." }, recipient: { ... } }
      // This matches the 'event' object expected by processMessagingEvent
      await processMessagingEvent(supabase, value);
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
