import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

const envConfig = dotenv.parse(fs.readFileSync(".env"));
const SUPABASE_URL = envConfig.VITE_SUPABASE_URL;
const SUPABASE_KEY = envConfig.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectSchema() {
  console.log("🔍 Inspecting 'automations' table structure...");

  const { data: automations, error } = await supabase
    .from("automations")
    .select("*")
    .limit(1);

  if (error) {
    console.error("❌ Error fetching automations:", error.message);
  } else if (automations.length === 0) {
    console.log("⚠️ Table is empty, cannot inspect columns.");
  } else {
    console.log("✅ Sample Row Keys:", Object.keys(automations[0]));
    console.log("   Sample Row:", JSON.stringify(automations[0], null, 2));
  }

  console.log("\n🔍 Inspecting 'instagram_accounts' table structure...");
  const { data: accounts } = await supabase
    .from("instagram_accounts")
    .select("*")
    .limit(1);

  if (accounts && accounts.length > 0) {
    console.log("✅ Sample Row Keys:", Object.keys(accounts[0]));
  }
}

inspectSchema();
