import { createClient } from "@supabase/supabase-js";

// Use your Supabase credentials
const supabaseUrl = "https://nfapcfclofdycraqyipe.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("❌ Please set SUPABASE_SERVICE_ROLE_KEY environment variable");
  console.log(
    "   Run: $env:SUPABASE_SERVICE_ROLE_KEY = 'your-service-role-key'",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  console.log("=== DEBUGGING INSTAGRAM AUTOMATION ===\n");

  // 1. Check Instagram Accounts
  console.log("📱 Instagram Accounts:");
  const { data: accounts, error: accErr } = await supabase
    .from("instagram_accounts")
    .select("*");

  if (accErr) console.error("  Error:", accErr.message);
  else if (!accounts?.length) console.log("  ⚠️ No Instagram accounts linked!");
  else {
    accounts.forEach((a) => {
      console.log(`  - User ID: ${a.user_id}`);
      console.log(`    Instagram ID: ${a.instagram_user_id}`);
      console.log(`    Username: ${a.username || "N/A"}`);
      console.log(`    Has Token: ${!!a.access_token}`);
    });
  }

  // 2. Check Automations
  console.log("\n🤖 Automations:");
  const { data: automations, error: autoErr } = await supabase
    .from("automations")
    .select("id, name, user_email, is_active, nodes, connections");

  if (autoErr) console.error("  Error:", autoErr.message);
  else if (!automations?.length) console.log("  ⚠️ No automations found!");
  else {
    automations.forEach((a) => {
      const active = a.is_active;
      console.log(`  - ${a.name} (${active ? "✅ Active" : "❌ Inactive"})`);
      console.log(`    User Email: ${a.user_email}`);
      console.log(
        `    Nodes: ${a.nodes?.length || 0}, Connections: ${a.connections?.length || 0}`,
      );

      // Check for trigger nodes
      const triggerNode = a.nodes?.find(
        (n) => n.nodeType === "keyword_match" || n.nodeType === "any_message",
      );
      if (triggerNode) {
        console.log(`    Trigger: ${triggerNode.nodeType}`);
        if (triggerNode.config?.keywords) {
          console.log(`    Keywords: ${triggerNode.config.keywords}`);
        }
      }
    });
  }

  // 3. Check Activity Log (recent entries)
  console.log("\n📋 Recent Activity Log:");
  const { data: logs, error: logErr } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (logErr) console.error("  Error:", logErr.message);
  else if (!logs?.length) console.log("  No activity logs found");
  else {
    logs.forEach((l) => {
      console.log(`  [${l.action_type}] ${l.description}`);
      if (l.metadata)
        console.log(`    Metadata: ${JSON.stringify(l.metadata)}`);
    });
  }

  // 4. Check Webhook Logs
  console.log("\n📨 Recent Webhook Logs:");
  const { data: webhooks, error: whErr } = await supabase
    .from("webhook_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (whErr) console.error("  Error:", whErr.message);
  else if (!webhooks?.length) console.log("  No webhook logs found");
  else {
    webhooks.forEach((w, i) => {
      console.log(`  ${i + 1}. Received at: ${w.created_at}`);
    });
  }
}

debug().catch(console.error);
