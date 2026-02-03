import fetch from "node-fetch";

// Your Instagram Business Account ID (from instagram_accounts table)
const INSTAGRAM_ACCOUNT_ID = "25437298245952100";

// Your access_token (from instagram_accounts table)
// IMPORTANT: Replace this with your actual access token
const ACCESS_TOKEN =
  process.env.INSTAGRAM_ACCESS_TOKEN || "YOUR_ACCESS_TOKEN_HERE";

async function subscribeToWebhook() {
  console.log("📱 Subscribing Instagram account to webhook...\n");

  // Step 1: Get the connected Facebook Page ID
  console.log("Step 1: Getting connected Facebook Page...");
  const pageResponse = await fetch(
    `https://graph.facebook.com/v18.0/${INSTAGRAM_ACCOUNT_ID}?fields=connected_instagram_account,instagram_business_account&access_token=${ACCESS_TOKEN}`,
  );
  const pageData = await pageResponse.json();
  console.log("Response:", JSON.stringify(pageData, null, 2));

  // Step 2: Subscribe the Page to webhooks (this enables Instagram messaging webhooks)
  // We need the Page ID and Page Access Token
  console.log("\nStep 2: To subscribe, you need to make this API call:");
  console.log(`
POST https://graph.facebook.com/v18.0/{PAGE_ID}/subscribed_apps
?subscribed_fields=messages,messaging_postbacks
&access_token={PAGE_ACCESS_TOKEN}
  `);

  console.log(
    "\n📋 Alternative: Check your webhook subscription in Meta Dashboard:",
  );
  console.log("1. Go to Meta App Dashboard → Webhooks → Instagram");
  console.log("2. Make sure 'messages' field shows a green checkmark ✓");
  console.log("3. If not, click 'Subscribe' next to 'messages'");

  console.log(
    "\n📋 Also check: Is your Instagram account linked to a Facebook Page?",
  );
  console.log(
    "Instagram Creator/Business accounts MUST be connected to a Facebook Page for DM webhooks to work.",
  );
}

// Also let's check current subscriptions
async function checkSubscriptions() {
  console.log("\n🔍 Checking app subscriptions...");

  // This would need app access token, not user token
  // For now, just provide guidance
  console.log(`
To check subscriptions via API:
GET https://graph.facebook.com/v18.0/{APP_ID}/subscriptions
?access_token={APP_ACCESS_TOKEN}
  `);
}

subscribeToWebhook();
checkSubscriptions();
