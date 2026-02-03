import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

const envConfig = dotenv.parse(fs.readFileSync(".env"));
const SUPABASE_URL = envConfig.VITE_SUPABASE_URL;
const SUPABASE_KEY = envConfig.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testLog() {
  console.log("📝 Testing direct write to activity_log...");

  const { data: user } = await supabase.auth.getUser();
  const userId = user?.user?.id; // Might be undefined if anon

  // Try to insert a test log
  const { data, error } = await supabase
    .from("activity_log")
    .insert({
      action_type: "test_entry",
      description: "Direct write test from script",
      metadata: { source: "simple-log-test.js" },
    })
    .select();

  if (error) {
    console.error("❌ Write Failed:", error.message);
    console.error(
      "   Details:",
      error.details || error.hint || "Check RLS policies.",
    );
  } else {
    console.log("✅ Write Success!");
    console.log("   Inserted Row:", data);
  }
}

testLog();
