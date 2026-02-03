import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

const envConfig = dotenv.parse(fs.readFileSync(".env"));
const SUPABASE_URL = envConfig.VITE_SUPABASE_URL;
const SUPABASE_KEY = envConfig.VITE_SUPABASE_ANON_KEY;
// Using Service Key to bypass RLS just in case, though Anon select is granted
const SERVICE_KEY = envConfig.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function checkLogs() {
  console.log("🔍 Checking 'webhook_logs' table...");

  const { data, error } = await supabase
    .from("webhook_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("❌ Error reading logs:", error.message);
  } else {
    console.log(`✅ Found ${data.length} log entries.`);
    data.forEach((log, index) => {
      console.log(`\n--- Log #${index + 1} (${log.created_at}) ---`);
      console.log(JSON.stringify(log.body, null, 2));
    });
  }
}

checkLogs();
