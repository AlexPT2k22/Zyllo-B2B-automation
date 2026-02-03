import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

const envConfig = dotenv.parse(fs.readFileSync(".env"));
const SUPABASE_URL = envConfig.VITE_SUPABASE_URL;
const SUPABASE_KEY = envConfig.VITE_SUPABASE_ANON_KEY;
const SERVICE_KEY = envConfig.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function checkActivityLog() {
  console.log("🔍 Checking 'activity_log' table for recent entries...");

  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("❌ Error reading activity_log:", error.message);
  } else {
    console.log(`✅ Found ${data.length} entries.`);
    data.forEach((log, index) => {
      console.log(`\n--- Activity Log #${index + 1} (${log.created_at}) ---`);
      console.log(`Type: ${log.action_type}`);
      console.log(`Desc: ${log.description}`);
      console.log(`Meta:`, JSON.stringify(log.metadata, null, 2));
    });
  }
}

checkActivityLog();
