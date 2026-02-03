import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

// Load env
const envConfig = dotenv.parse(fs.readFileSync(".env"));
const SUPABASE_URL = envConfig.VITE_SUPABASE_URL;
const SUPABASE_KEY = envConfig.VITE_SUPABASE_ANON_KEY;
// Start with Anon, but if RLS blocks, we might need Service Role.
// Ideally user uses Service Role key for backend scripts.
// Let's try to grab Service Role if available in .env, otherwise Anon.
const SERVICE_KEY = envConfig.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function checkConnection() {
  console.log("🔍 Checking Instagram Connection...");

  // 1. Get the account
  const { data: accounts, error } = await supabase
    .from("instagram_accounts")
    .select("*")
    .limit(1);

  if (error || !accounts || accounts.length === 0) {
    console.error(
      "❌ No Instagram account found in DB or DB Access Error:",
      error,
    );
    return;
  }

  const account = accounts[0];
  console.log(
    `✅ Found Account for User: ${account.username} (ID: ${account.instagram_user_id})`,
  );

  const accessToken = account.access_token;
  if (!accessToken) {
    console.error("❌ Access Token is missing!");
    return;
  }

  console.log("🔍 validating Access Token with Meta API...");

  // 2. Test Token Validity & Permissions
  // We try to fetch the user's details and if possible conversations
  try {
    const url = `https://graph.instagram.com/${account.instagram_user_id}?fields=id,username&access_token=${accessToken}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ Token Validation Failed:", data.error);
      console.log("👉 Suggestion: Re-link the account in the Settings page.");
      return;
    }

    console.log("✅ Token is VALID. API Response:", data);

    // 3. Check specific functionality (Can we fetch conversations?)
    // Note: 'conversations' might not be available on basic display API, need Graph API.
    // For Business accounts: /me/conversations
    const convUrl = `https://graph.instagram.com/v19.0/${account.instagram_user_id}/conversations?limit=1&access_token=${accessToken}`;
    const convResp = await fetch(convUrl);
    const convData = await convResp.json();

    if (convData.error) {
      console.warn(
        "⚠️ Could not fetch conversations. This might mean missing permissions (instagram_manage_messages).",
      );
      console.error("Error:", convData.error);
    } else {
      console.log("✅ 'instagram_manage_messages' permission seems ACTIVE.");
      console.log(
        "   Found conversations:",
        convData.data ? convData.data.length : 0,
      );
    }
  } catch (err) {
    console.error("❌ Network or Script Error:", err);
  }
}

checkConnection();
