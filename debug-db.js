import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

const envConfig = dotenv.parse(fs.readFileSync(".env"));
const SUPABASE_URL = envConfig.VITE_SUPABASE_URL;
const SUPABASE_KEY = envConfig.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkAccount() {
  console.log("🔍 Account Diagnostics...\n");

  // 1. Check Accounts
  const { data: accounts, error: err } = await supabase
    .from("instagram_accounts")
    .select("*");

  if (err) {
    console.error("❌ Error fetching accounts:", err.message);
    return;
  }

  if (accounts.length === 0) {
    console.log("⚠️ No Instagram accounts found in DB.");
    console.log(
      "   👉 Did you complete the 'Connect Instagram' flow in Settings?",
    );
  } else {
    console.log(`✅ Found ${accounts.length} account(s):`);
    accounts.forEach((a) => {
      console.log(`   - Username: ${a.username}`);
      console.log(`     Instagram ID: ${a.instagram_user_id}`);
      console.log(`     Linked to User: ${a.user_id}`);
    });
  }

  // 2. Check Automations
  const { data: workflows } = await supabase.from("automations").select("*");
  console.log(`\n✅ Found ${workflows?.length || 0} automations.`);
  workflows?.forEach((w) => {
    console.log(`   - "${w.name}" (Active: ${w.isActive})`);
  });
}

checkAccount();
