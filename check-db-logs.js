import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

// Load .env manually since dotenv.config() might not find it if not in root or simple setup
const envConfig = dotenv.parse(fs.readFileSync(".env"));
const SUPABASE_URL = envConfig.VITE_SUPABASE_URL;
const SUPABASE_KEY = envConfig.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkOrgs() {
  console.log("🔍 Checking database logs...\n");

  // 1. Check if message was stored
  const { data: messages, error: msgError } = await supabase
    .from("instagram_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (msgError) {
    console.error("❌ Error fetching messages:", msgError.message);
  } else {
    console.log("📨 Latest Stored Messages:");
    messages.forEach((m) => {
      console.log(
        `- [${new Date(m.created_at).toLocaleTimeString()}] Content: "${m.message_text}" | From: ${m.sender_id}`,
      );
    });
    if (messages.length === 0) console.log("   (No messages found)");
  }

  console.log("\n-----------------------------------\n");

  // 2. Check if automation ran (activity_log)
  const { data: logs, error: logError } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (logError) {
    console.error("❌ Error fetching activity logs:", logError.message);
  } else {
    console.log("🤖 Latest Automation Runs:");
    logs.forEach((l) => {
      console.log(
        `- [${new Date(l.created_at).toLocaleTimeString()}] ${l.description} (Status: ${l.metadata?.status || "N/A"})`,
      );
    });
    if (logs.length === 0) console.log("   (No automation logs found)");
  }
}

checkOrgs();
